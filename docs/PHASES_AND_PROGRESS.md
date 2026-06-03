# RePrime Data Platform — Phases & Progress

_How the work proceeded, where it stands, and what comes next. As of `8c0800a`._

---

## The starting point (the problem)

The platform rendered but the data didn't. Most features were facades: UI that
implied live data while serving hardcoded values, fake latencies, and static
JSON. Three different, divergent search implementations existed and disagreed.
The repo had 819 files, a dead Render backend, and **live API keys committed in
plaintext** to a public repository.

A critical complication discovered mid-way: the local clone was sitting on a
**stale v3.0 base**, while the GitHub remote had quietly advanced 17 commits (a
parallel "v4.0" hardening attempt that never successfully deployed — the live
site was still serving an even older v3.4).

---

## Phase 0 — Audit (reality, no fixes)

Probed the live endpoints, ran the search against multiple real addresses, and
read the source. Produced a truth table separating real features from facades.
**Key finding:** the directive's premise ("`api/search.py` is the product") was
false — no such file existed; there were three competing engines and a leaked
secrets problem. Captured in `AUDIT.md`.

**Status: ✅ complete.**

---

## Phase 1 — Consolidate the search engine

Chose architecture **C**: one Vercel Python function as the single source of
truth, retiring the browser-direct and Render paths. Built `api/search.py` from
scratch (stdlib-only): geocode gate, parallel fan-out, per-source error capture,
budgets, caching, validation, CORS. Proved it locally against real APIs.

**Status: ✅ complete.** Expanded from ~11 to **18 live sources**.

---

## Phase 2 — Frontend (all 5 pages onto live data)

Rewired each page to the consolidated engine and live endpoints, removing every
fabricated literal:

1. **Explore** — browser-direct → `/api/search`; added Leaflet map, progressive
   render, valuation input, search history, error states.
2. **Dashboard** — real KPIs, Chart.js rate chart, real endpoint-health monitor;
   removed leaked API-key fingerprints.
3. **Terminal** — live FEMA/news/coverage/financing; deal data moved to a
   SAMPLE-labeled file.
4. **Company site** — live ticker, registry-driven counters/categories/marquee;
   removed fabricated 8,223 / 549 figures.
5. **Homepage** (`index.html`) — discovered as a 5th page during verification;
   real KPIs, real source-health, SAMPLE-labeled pipeline, real activity.

**Status: ✅ complete** (team roster on `/site` still placeholder).

---

## Phase 3 — Data layer

Built the real **630-source registry** (`build_registry.py`) and replaced the
fabricated `stats.json`/`categories.json`. Hardened the aggregator
(`aggregate.py`) with `cached_at` + TTL + `manifest.json`. Added the real
`/api/health` function. Wired `/api/sources` to the registry.

**Status: ✅ complete.**

---

## Phase 4 — Hardening, secrets, dead code

Stripped 11 leaked API keys from the repo (and a key-leaking HTML checklist).
Retired the Render backend (`api/server`, `api/property`, `render.yaml`).
Added CORS, content-type, and request validation.

**Status: ✅ complete** (keys still need rotating — git history + prior public exposure).

---

## Phase 5 — Tests & self-proof

Added `tests/test_search.py` (7 pytest tests: validation, helpers, registry,
live integration) and `scripts/verify.sh` (8-section re-runnable audit that
exits non-zero on breakage). Wrote `AUDIT.md` and rewrote `README.md`.

**Status: ✅ complete.**

---

## Phase 6 — Cleanup, push, deploy

Deleted 751 unnecessary files (819 → 75 tracked; 98 MB → 33 MB). Preserved the
remote's 17-commit v4.0 line as `backup/v4-line`, then force-pushed the
consolidated version to `main`. Vercel auto-deployed.

**Status: ✅ complete.**

---

## Phase 7 — Production debugging on Vercel (the hard part)

The first live deploy of the search **hung past 42 seconds**. Diagnosed and
fixed a chain of real production issues:

1. The thread pool blocked on shutdown waiting for stuck sources → **made
   shutdown non-blocking**.
2. FRED fetched 5 series sequentially (~15s) → **parallelized**.
3. FEMA/EPA/FDIC are **slow or IP-blocked from Vercel's datacenter IPs** → routed
   the headline rates through the platform's own cached ticker (reliable), and
   **capped the budget at 13s** so blocked sources get cut fast.

Result: cold search now returns in **~13–14s with 16–17/20 sources**, instant
when edge-cached.

**Status: ✅ complete.**

---

## Where it stands now

| Dimension | State |
|-----------|-------|
| Live URL | All 5 pages + all endpoints return 200 |
| Search | 16/20 sources, ~14s cold, instant cached |
| Repo | 75 files, clean, on `main` (`8c0800a`), auto-deploying |
| Backup | v4.0 line safe on `backup/v4-line` |
| Proof | `bash scripts/verify.sh` + 7 pytest tests |

---

## What's next (recommended order)

1. **You: rotate the 11 leaked keys.** They were public and remain in git
   history — highest priority, security.
2. **You: set a valid `CENSUS_API_KEY`** in Vercel env to enable demographics.
3. **Restore FEMA-NFHL + EPA** via a small server-side proxy (or cache their
   results in the aggregator like we did for FRED) to recover flood-zone data.
4. **Schedule the aggregator** (Vercel Cron / GitHub Action) so cached market
   data and `cached_at` stay fresh.
5. **Send the canonical 611 source list + real team roster** so the headline
   number matches exactly and the team section is real.
6. **Add Playwright tests** for true in-browser verification of map/chart render.

---

## How to verify any of this yourself

```bash
bash scripts/verify.sh            # local engine + artifacts
LIVE=1 bash scripts/verify.sh     # also probe the deployed URL
pytest tests/test_search.py -v    # backend contract tests
python3 api/search.py "350 5th Ave, New York, NY 10118"   # run the engine directly
curl https://reprime-data-platform.vercel.app/api/health  # liveness
```
