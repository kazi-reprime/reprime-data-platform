> ⚠️ **Stale — snapshot at commit `8c0800a` (2026-06-03).** Current source of truth is `AUDIT-2026-06-08.md` + the live `README.md`. Compare before relying on anything in this file.

# RePrime Data Pipeline — Implementation Plan (Option A)

_Goal: gather the maximum real data from the ~611 free sources and display it._
_Architecture decided in ADR-001. This is the sprint-by-sprint build plan._
_Status as of 2026-06-03: Sprints 0–1 scaffolded and proven; DB + connector_
_hardening next._

---

## The reality this plan is built on (triage results)

Of **696 free sources with a URL** (`pipeline/triage.py`):

| Tier | Count | How it's ingested |
|------|------:|-------------------|
| `live_api` | **146** | Real machine API → typed connector (ArcGIS / Socrata / FDSN / OpenFEMA / generic JSON) |
| `bulk` | 52 | Download CSV/ZIP/portal file → parse |
| `rss` | 33 | Parse RSS/Atom feed |
| `scrape` | 23 | Headless browser (Playwright) |
| `inspect` | 442 | `endpoint_url` is a doc/landing page → needs a per-source adapter or isn't machine-ingestible |

Auth: **444 keyless · 73 api_key · 179 unknown.**
**Ready to ingest now (live_api + keyless): 73.**

> Honest framing: "all 611" is the catalog. Realistic high-value ingestion is the
> ~146 live APIs + 52 bulk + 33 RSS first (~230 sources yielding real data),
> then chip away at the 442 "inspect" tier source-by-source. We track coverage as
> "sources returning real data," not catalog size.

**Proof the pipeline works:** a capped run of 30 keyless live APIs pulled **2,650
real records** (EDGAR XBRL 2,597, USGS quakes 42, FDIC 10, CoinGecko) — with
honest status (4 ok, 2 not-data, 24 error). The errors are the connector work
below, not a broken pipeline.

---

## Sprint 0 — Foundation ✅ (done)

- `pipeline/triage.py` — tiers all sources → `ingest_manifest.json`.
- `pipeline/connectors.py` — family detection + typed fetch + record counting.
- `pipeline/run_ingest.py` — runner + honest coverage report (`ingest_report.json`).
- `.github/workflows/ingest.yml` — daily cron on GitHub Actions (non-blocked IPs, no 13s limit).
- `pipeline/schema.sql` — Postgres storage schema + coverage views.

## Sprint 1 — Keyless live APIs (the 73) ▶ in progress

**Goal:** maximize the 73 keyless `live_api` sources from error → ok.
- Harden connectors per family: Overpass (POST QL), OpenFEMA (`$top`/`$filter`),
  ArcGIS (layer discovery → `/0/query`), Socrata (`$limit`), FDSN, generic JSON.
- Drop mislabeled RapidAPI/keyed entries from the keyless set.
- **Target:** ≥ 50 of 73 returning real records.
- **Exit:** `run_ingest --tier live_api --auth keyless` shows ≥ 50 ok in the report.

## Sprint 2 — Storage (Supabase) 🔲 needs your action first

- **You:** create a free Supabase project; add `DATABASE_URL` (and confirm
  `CENSUS_API_KEY`, `FRED_API_KEY`) as GitHub repo secrets.
- Apply `pipeline/schema.sql`.
- Add `pipeline/load_to_db.py` — upsert sources + `source_data` (jsonb) + run rows.
- Wire the GH Action's "Load to Postgres" step (already stubbed).
- **Exit:** a scheduled run populates the DB; `v_coverage` view returns real rows.

## Sprint 3 — Keyed live APIs (the 73) 🔲

- Connectors that read keys from env/secrets (Census ACS, FRED authenticated,
  BLS, EIA, etc. — we already hold several keys; rotate first).
- **Target:** ≥ 40 of 73 keyed sources ingesting.

## Sprint 4 — RSS + Bulk (33 + 52) 🔲

- `rss` connector (feedparser-style, stdlib `xml`).
- `bulk` connector: follow portal → download CSV/ZIP → parse → store summary +
  sample (cap row counts to keep storage sane).
- **Target:** ≥ 25 RSS + ≥ 25 bulk ingesting.

## Sprint 5 — Scrape tier (23) 🔲

- Playwright connector in GitHub Actions (browsers preinstalled on runners).
- Per-target selectors for the 23 JS-rendered sites.
- **Target:** ≥ 12 scrape targets ingesting.

## Sprint 6 — High-value "inspect" adapters 🔲

- Triage the 442 "inspect" entries by value; write per-source adapters for the
  top ~50 (the ones with hidden APIs behind doc pages).
- **Target:** +50 sources ingesting.

## Sprint 7 — Serving + coverage display 🔲

- Vercel endpoints read from the DB (`/api/dataset/:slug`, `/api/coverage`).
- A **coverage dashboard** page: live count of "sources returning real data /
  611", per-category freshness, last-run time.
- Wire the existing pages to show ingested datasets where relevant.

## Sprint 8 — Tests + hardening 🔲

- Coverage/freshness assertions in `scripts/verify.sh` (fail if coverage drops or
  data goes stale past TTL).
- pytest for connectors (mocked responses per family).
- Alerting on ingest-run failures (GH Action status).

---

## Running coverage target

| Milestone | Sources returning real data |
|-----------|----------------------------:|
| Sprint 1 | ~50 (keyless live APIs) |
| Sprint 3 | ~90 |
| Sprint 4 | ~140 |
| Sprint 5 | ~150 |
| Sprint 6 | ~200+ |

---

## What only you can do (unblocks Sprints 2–3)

1. **Rotate the 11 leaked keys** (still in git history) — security, do first.
2. **Create a free Supabase project**, add `DATABASE_URL` + API-key secrets to GitHub.
3. Confirm whether you want bulk/scraped data stored in full or sampled (storage cost).

## How to run it today

```bash
python3 pipeline/triage.py                                   # re-tier sources
python3 pipeline/run_ingest.py --tier live_api --auth keyless --limit 100   # ingest
cat pipeline/ingest_report.json                              # honest coverage
# GitHub Actions runs this daily automatically once pushed.
```
