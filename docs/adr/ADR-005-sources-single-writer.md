# ADR-005 — Single writer for the `sources` table

**Status:** Accepted (Phase 2 task 2.11)
**Date:** 2026-06-09

## Context

Two scripts were writing to the Supabase `sources` table in different ways:

- `pipeline/load_sources.py` — uses the rich catalog (`public/data/sources_catalog.json`), upserts via PostgREST with the service-role key, includes cost/auth/endpoint metadata.
- `pipeline/rest_load_catalog.py` — also wrote to `sources` via PostgREST. Documented in the architecture doc as a parallel path.

Result: dual-writer race. Whichever ran last won. Field coverage diverged because the two scripts mapped catalog → DB columns differently.

## Decision

Keep `pipeline/load_sources.py` as the single canonical writer. Delete `pipeline/rest_load_catalog.py`.

If a future need requires a separate ingestion path (e.g. partial updates, a different catalog source), it MUST be a Postgres function with explicit COALESCE merge — not a parallel direct-table writer.

## Consequences

- One writer → no more divergent state.
- The cron workflow (`ingest.yml`) needs `pipeline/load_sources.py` to remain in the ingest path. Confirmed present.
- Rotation of the service-role key affects only one consumer.
