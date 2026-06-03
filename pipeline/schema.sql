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
