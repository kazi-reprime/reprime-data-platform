# ADR-001: Data Ingestion Architecture for Maximum 611-Source Coverage

**Status:** Accepted (Option A)
**Date:** 2026-06-03
**Deciders:** Gideon (RePrime principal); implementation by the platform team

## Context

The goal is to gather the **maximum real data from the ~611 free data sources**
and display it on the platform. The deployed system cannot do this:

- `/api/search` is a **13-second Vercel serverless** request that fans out
  *per-address*. Most of the 611 sources are **national/regional datasets**, not
  per-address lookups.
- Several gov endpoints (FEMA-NFHL, EPA, FDIC) are **IP-blocked from Vercel's
  datacenter ranges** — proven live.
- The sources are **heterogeneous**. Triage of the registry shows, of 696 free
  sources with a URL: **146 live machine APIs** (73 keyless / ready now, 73
  keyed), **52 bulk** downloads, **33 RSS**, **23 scrape** targets, and **442
  "inspect"** entries whose `endpoint_url` is a doc/landing page, not a machine
  endpoint. A generic "fetch the URL" returns HTML for most (verified: only ~2
  of 12 sampled keyless URLs returned JSON).

Therefore "scrape everything" is a **scheduled ingestion-pipeline problem with
typed, per-family connectors**, not a search problem and not a generic fetch.

**Constraints:** keep it free where possible; gov APIs must be reached from
non-blocked IPs with no hard time limit; data volume exceeds what JSON-in-git
can hold; Vercel remains the display layer.

## Decision

Adopt **Option A**: ingestion on **GitHub Actions (scheduled cron)**, storage in
a **free Postgres/Supabase database**, serving via **Vercel reading from the
DB**. A tiered connector framework (`pipeline/`) classifies each source and
fetches it by family (ArcGIS, Socrata, FDSN, OpenFEMA, generic JSON, RSS, bulk,
scrape), tracking honest coverage.

## Options Considered

### Option A: GitHub Actions + Postgres/Supabase + Vercel  *(chosen)*
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium |
| Cost | Free (GH Actions minutes + Supabase free tier) |
| Scalability | High — real DB, no time limit, non-blocked IPs |
| Team familiarity | High (Python + SQL + YAML) |

**Pros:** not IP-blocked like Vercel; no 13s limit (can run Playwright + bulk
downloads); free; real DB handles volume + queries; clean separation of
ingest/store/serve.
**Cons:** a DB to provision and a schema to maintain; GH Actions cron is
best-effort timing.

### Option B: GitHub Actions + JSON committed to repo (no DB)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | Free |
| Scalability | Low — git bloats; no querying |

**Pros:** simplest, fully free, zero infra.
**Cons:** caps total data; no query layer; repo bloat. Fine for headline figures,
not "maximum data."

### Option C: Always-on worker (Render/Fly/Railway) + DB
| Dimension | Assessment |
|-----------|------------|
| Complexity | High |
| Cost | ~$7+/mo |
| Scalability | High |

**Pros:** real scheduler, most control, long-running jobs.
**Cons:** monthly cost; another service to operate. Overkill for current stage.

## Trade-off Analysis

A beats B on the core requirement (volume + queryability) at the same zero cost;
the only added burden is provisioning one free Supabase project. A beats C by
avoiding a paid always-on service — GitHub Actions covers scheduled ingestion
for free, and the pipeline is stateless between runs. We can graduate to C later
if ingestion outgrows GH Actions' limits.

## Consequences

- **Easier:** reaching gov APIs (non-blocked IPs), running heavy jobs, querying
  ingested data, honest coverage tracking.
- **Harder:** one DB to manage; per-source adapters for the 442 "inspect" + bulk
  + scrape tiers are ongoing work (not a one-shot).
- **Revisit:** if GH Actions runtime/quotas become a limit → Option C.

## Action Items (sprints — detail in docs/DATA_PIPELINE_PLAN.md)

1. [x] Triage all 611/696 sources into ingestion tiers (`pipeline/triage.py`).
2. [x] Connector framework + runner; proven pulling real records
       (`pipeline/connectors.py`, `run_ingest.py`).
3. [x] GitHub Actions cron workflow (`.github/workflows/ingest.yml`).
4. [x] Postgres schema (`pipeline/schema.sql`).
5. [ ] **You:** provision a free Supabase project; set `DATABASE_URL` secret.
6. [ ] `load_to_db.py` — upsert ingest results into Postgres.
7. [ ] Harden connectors per family (Overpass POST, OpenFEMA params, ArcGIS
       layer discovery, Socrata, RSS, bulk CSV) → raise keyless coverage.
8. [ ] Add keyed connectors (the 73 api_key sources) using repo secrets.
9. [ ] Add scrape connector (Playwright) for the 23 scrape targets.
10. [ ] Per-source adapters for high-value "inspect" sources.
11. [ ] Serving: Vercel endpoints/pages read from the DB; coverage dashboard.
12. [ ] Coverage/freshness tests in `verify.sh`.
