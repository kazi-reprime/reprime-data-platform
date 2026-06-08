# ADR-002 — pgvector for NL source discovery

**Status:** Accepted (Phase 4)
**Date:** 2026-06-09
**Audit reference:** AUDIT-2026-06-08.md §17 (Phase 4)

## Context

The platform catalogs ~1,932 free data sources across 14 categories. Users today find them via faceted filters in `/sources` (category, cost tier, auth, type, keyword). That works when users know the right vocabulary ("EIA", "FRED", "Socrata") but fails for natural phrasing ("show me free APIs for treasury yields", "what gives me REIT financials without an API key").

We want **natural-language source discovery**: a search box that takes intent, returns the top-K most semantically similar catalog entries, ranked by embedding cosine similarity.

## Decision

Use **pgvector** (Postgres extension, pre-installed on Supabase) for embedding storage + nearest-neighbor search. Generate embeddings via the **Vercel AI Gateway** (provider-agnostic) so we can swap embedding models without code changes.

### Storage

`pipeline/schema.sql` declares:

- `CREATE EXTENSION IF NOT EXISTS vector;`
- `ALTER TABLE sources ADD COLUMN embedding vector(1536);` (1536 dims = `text-embedding-3-small` / `ada-002`)
- `ALTER TABLE sources ADD COLUMN embedding_text TEXT;`
- `ALTER TABLE sources ADD COLUMN embedded_at TIMESTAMPTZ;`
- `CREATE INDEX idx_sources_embedding ON sources USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);`

### Search RPC

`match_sources(query_embedding vector(1536), match_count INT, min_similarity FLOAT)` returns top-K rows projecting only safe columns. Anon has `EXECUTE` only.

### Embedding generation

`pipeline/embed_sources.py` (new) — reads sources missing embeddings, embeds them via Vercel AI Gateway (or OpenAI direct), writes back. Idempotent. Runs from daily cron after catalog load.

### Query endpoint

`api/discover.py` (new) — `GET /api/discover?q=<query>&k=<count>` validates input, embeds query, calls `match_sources` RPC, returns ranked results.

### Frontend

`public/discover.js` (new) — search bar component mounting into `#rp-discover`. Renders results in cards matching `/sources` style.

## Alternatives considered

| Option | Verdict |
|---|---|
| Algolia / Typesense (hosted search) | Adds a second data store + sync layer + monthly cost. pgvector lives next to source data. |
| OpenAI + custom Redis vector index | Two stores, two rotation surfaces. |
| Local sentence-transformers in pipeline | Cron has to ship model (~80-400 MB). Revisit if API cost becomes meaningful. |
| Keyword search only (defer pgvector) | Audit specifically called out NL discovery. Defer ≠ skip. |

## Trade-offs

- **Cost.** Embedding 1,932 sources once is ~$0.02 with text-embedding-3-small. Idempotent re-embed gated by `embedded_at`.
- **Drift.** Model swap → full re-embed. `embedding_text` traceability column makes diff diagnosable.
- **Cold ivfflat.** lists=100 over-indexes 1,932 rows (recommended sqrt(N)≈44). Tune at 5k+.

## Consequences

- New env var: `AI_GATEWAY_API_KEY` or `OPENAI_API_KEY`.
- New Vercel function `api/discover.py` (stdlib only, lean cold start).
- New pipeline script `pipeline/embed_sources.py` joins the daily cron.
- Anon role gets EXECUTE on one new RPC.
