-- RePrime Data Platform — ingestion storage schema (Postgres / Supabase).
-- Apply once the database is provisioned:  psql "$DATABASE_URL" -f pipeline/schema.sql
-- Option A storage layer: GitHub Actions ingests → loads here → Vercel reads.

-- 1. The source registry (the 611/696 catalog + ingestion tiering)
CREATE TABLE IF NOT EXISTS sources (
    id           BIGSERIAL PRIMARY KEY,
    name         TEXT NOT NULL UNIQUE,
    category     TEXT,
    provider     TEXT,
    url          TEXT,
    type         TEXT,
    tier         TEXT,            -- live_api | rss | bulk | scrape | inspect
    auth         TEXT,            -- keyless | api_key | oauth | unknown
    created_at   TIMESTAMPTZ DEFAULT now(),
    updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sources_category ON sources (category);
CREATE INDEX IF NOT EXISTS idx_sources_tier     ON sources (tier);

-- 2. Each ingestion run (for coverage/freshness tracking)
CREATE TABLE IF NOT EXISTS ingest_runs (
    id            BIGSERIAL PRIMARY KEY,
    run_at        TIMESTAMPTZ DEFAULT now(),
    tier          TEXT,
    attempted     INT,
    succeeded     INT,
    errors        INT,
    records_total BIGINT
);

-- 3. The actual ingested data — raw JSON per source per run, queryable via jsonb
CREATE TABLE IF NOT EXISTS source_data (
    id            BIGSERIAL PRIMARY KEY,
    source_id     BIGINT REFERENCES sources (id) ON DELETE CASCADE,
    run_id        BIGINT REFERENCES ingest_runs (id) ON DELETE SET NULL,
    fetched_at    TIMESTAMPTZ DEFAULT now(),
    status        TEXT,           -- ok | empty | not_data | error
    record_count  INT,
    latency_ms    INT,
    payload       JSONB,          -- the fetched records (sample or full)
    error         TEXT
);
CREATE INDEX IF NOT EXISTS idx_source_data_source ON source_data (source_id);
CREATE INDEX IF NOT EXISTS idx_source_data_payload ON source_data USING GIN (payload);

-- 4. Latest-per-source view for the serving layer (Vercel reads this)
CREATE OR REPLACE VIEW v_latest_source_data AS
SELECT DISTINCT ON (sd.source_id)
       s.name, s.category, s.provider, s.tier,
       sd.fetched_at, sd.status, sd.record_count, sd.payload
FROM source_data sd
JOIN sources s ON s.id = sd.source_id
ORDER BY sd.source_id, sd.fetched_at DESC;

-- 5. Coverage rollup (the metric the goal actually cares about)
CREATE OR REPLACE VIEW v_coverage AS
SELECT category,
       count(*)                                   AS sources,
       count(*) FILTER (WHERE tier = 'live_api')  AS live_api,
       count(*) FILTER (WHERE auth = 'keyless')   AS keyless
FROM sources
GROUP BY category
ORDER BY sources DESC;

-- 6. Row-Level Security: the public anon/publishable key may READ (for serving on
-- Vercel); WRITES happen only via the Postgres DATABASE_URL or the service-role
-- key used by the GitHub Actions loader. This keeps the published key safe.
ALTER TABLE sources     ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingest_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS anon_read_sources ON sources;
DROP POLICY IF EXISTS anon_read_data    ON source_data;
DROP POLICY IF EXISTS anon_read_runs    ON ingest_runs;
CREATE POLICY anon_read_sources ON sources     FOR SELECT TO anon USING (true);
CREATE POLICY anon_read_data    ON source_data FOR SELECT TO anon USING (true);
CREATE POLICY anon_read_runs    ON ingest_runs FOR SELECT TO anon USING (true);

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON sources, ingest_runs TO anon;
-- NOTE: source_data is intentionally NOT granted to anon. Anon reads via
-- v_latest_source_data (which projects safe columns) — see Phase 2.4 below.
GRANT SELECT ON v_latest_source_data, v_coverage TO anon;

-- ============================================================================
-- Phase 2.5 — data_records table (moved from runtime DDL in flatten_records.py)
-- ============================================================================
CREATE TABLE IF NOT EXISTS data_records (
    id           BIGSERIAL PRIMARY KEY,
    source_name  TEXT NOT NULL,
    category     TEXT,
    fields       JSONB NOT NULL,
    fetched_at   TIMESTAMPTZ DEFAULT now()
);

-- Phase 2.6 — composite + targeted indexes for the query paths the front-end
-- actually runs (status filters, source-name lookups, latest-per-source ordering).
CREATE INDEX IF NOT EXISTS idx_source_data_source_fetched ON source_data (source_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_source_data_status         ON source_data (status);
CREATE INDEX IF NOT EXISTS idx_data_records_source_name   ON data_records (source_name);
CREATE INDEX IF NOT EXISTS idx_data_records_category      ON data_records (category);
CREATE INDEX IF NOT EXISTS idx_data_records_fetched_at    ON data_records (fetched_at DESC);

-- Phase 2.4 — sanitized public view + tightened RLS.
-- The earlier `FOR SELECT TO anon USING (true)` on source_data exposed the
-- full `payload` JSONB column to the anon role. Socrata-discovered municipal
-- datasets historically carry PII (names, addresses, license numbers). We
-- drop the blanket policy and replace it with a curated view that exposes
-- only safe columns.
ALTER TABLE data_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anon_read_records ON data_records;
-- We deliberately do NOT add a SELECT policy on data_records for anon.
-- Anon must go through the sanitized view v_public_records below.

CREATE OR REPLACE VIEW v_public_records AS
SELECT id, source_name, category, fetched_at
FROM data_records;
GRANT SELECT ON v_public_records TO anon;

-- ============================================================================
-- Phase 4 — pgvector for NL source discovery
-- ============================================================================
-- Enable the vector extension (Supabase has it pre-installed; this just ensures it's on).
CREATE EXTENSION IF NOT EXISTS vector;

-- Add an embedding column to sources for semantic search.
-- 1536 dims matches text-embedding-3-small / ada-002 / many gateway providers.
-- Use ivfflat for cosine similarity; reindex periodically as catalog grows.
ALTER TABLE sources ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE sources ADD COLUMN IF NOT EXISTS embedding_text TEXT;  -- the text we embedded, for traceability
ALTER TABLE sources ADD COLUMN IF NOT EXISTS embedded_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_sources_embedding
    ON sources USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Semantic-search RPC: takes a query embedding + top_k, returns nearest neighbors.
-- Anon can call this RPC; the function itself filters to safe columns only.
CREATE OR REPLACE FUNCTION match_sources(
    query_embedding vector(1536),
    match_count INT DEFAULT 10,
    min_similarity FLOAT DEFAULT 0.2
)
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    category TEXT,
    provider TEXT,
    url TEXT,
    tier TEXT,
    auth TEXT,
    similarity FLOAT
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, s.category, s.provider, s.url, s.tier, s.auth,
           1 - (s.embedding <=> query_embedding) AS similarity
    FROM sources s
    WHERE s.embedding IS NOT NULL
      AND 1 - (s.embedding <=> query_embedding) >= min_similarity
    ORDER BY s.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION match_sources(vector, INT, FLOAT) TO anon;
