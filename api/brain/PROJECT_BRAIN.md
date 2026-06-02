# RePrime Data Platform — Project Brain

## Mission
Aggregate 611 real estate data sources into a unified platform, serve live data to the RePrime Terminal (mishorim.vercel.app / reprimeterminal.com).

## Source Classification (611 total)

| Bucket | Count | Auth | Cost |
|--------|-------|------|------|
| Free No-Auth REST APIs | 218 | None | $0 |
| Free API Key Required | 199 | Register (free) | $0 |
| Dataset Portals (bulk) | 117 | Varies | $0 |
| RSS/Atom Feeds | 68 | None | $0 |
| Paid APIs | 9 | API key | ~$376/mo total |

## Data Categories (14 domains)

| Category | Sources | Priority |
|----------|---------|----------|
| capital_markets | 88 | CRITICAL |
| zoning_parcel | 69 | CRITICAL |
| housing_re | 12 | CRITICAL |
| israeli | 23 | CRITICAL |
| hazard_environmental | 47 | HIGH |
| macro_indicator | 37 | HIGH |
| infrastructure | 30 | HIGH |
| demographic | 25 | HIGH |
| economic | 19 | HIGH |
| construction_pipeline | 6 | HIGH |
| other | 176 | MEDIUM |
| news_sentiment | 39 | MEDIUM |
| energy | 33 | MEDIUM |
| insurance_climate | 7 | MEDIUM |

## Top 20 Critical Sources

1. FRED API — mortgage rates, GDP, CPI, treasury yields
2. data.gov.il CKAN — Israeli building permits, housing
3. Bank of Israel PublicAPI — ILS rates, mortgage rates
4. OpenFEMA — flood claims, disaster declarations
5. FEMA NFHL — flood zone polygons
6. Census API — construction spending, demographics
7. FDIC BankFind — CRE loan concentrations
8. SEC EDGAR — REIT filings
9. BLS API — employment, wages, CPI by metro
10. EPA Envirofacts — brownfields, superfund, toxics
11. Walk Score API — walkability scores
12. ZHVI/Zillow indices (via FRED)
13. NYC Open Data — ACRIS deeds, PLUTO parcels
14. Zoneomics — zoning codes, FAR, uses
15. CBS Israel — housing price index, CPI
16. GDELT — real estate news sentiment
17. Yahoo Finance — REIT prices, VIX
18. Overpass/OSM — POI density
19. CoinGecko — crypto market context
20. ATTOM — foreclosure data (paid $95/mo)

## Connector Types

| Type | Sources | Pattern |
|------|---------|---------|
| RestApiConnector | 218+ | JSON/XML REST calls |
| SocrataConnector | ~30 | SODA API (data.gov portals) |
| ArcGisConnector | ~40 | ArcGIS Feature Server |
| RssConnector | 68 | RSS/Atom feed parsing |
| SdmxConnector | ~10 | Bank of Israel, CBS, ECB |
| BulkDownloadConnector | 117 | CSV/Excel datasets |
| HtmlScraperConnector | ~10 | Playwright for JS sites |

## Tech Stack

- Python 3.12+, asyncio, httpx, FastAPI
- PostgreSQL 16 + PostGIS + TimescaleDB
- Redis (cache + rate limiting)
- Next.js frontend
- APScheduler for cron jobs

## Implementation Phases

1. Foundation + top 20 free APIs (Week 1)
2. All 218 free no-auth APIs (Week 2)
3. API-key sources + specialized connectors (Week 3)
4. Bulk downloads + HTML scraping (Week 4)
5. Terminal integration + frontend (Week 5)
6. Production monitoring + docs (Week 6)

## Session Log
- Session 1: Installed Superpowers, ECC, gstack, Compound Engineering, Codex Plugin, code-review-graph
- Session 1: Analyzed 611 CSV sources, classified by auth/cost/category
- Session 1: Ran 7-agent parallel research workflow (source analysis, Israeli sources, priority ranking, scraping guide, terminal analysis, tech research, architecture design)

## Session 1 Results (2026-06-02)

### Plugins Installed (all user-scope, auto-activate)
- Superpowers v5.1.0 (Claude Code + Gemini + Copilot)
- ECC v2.0.0-rc.1 (Claude Code)
- Compound Engineering v3.9.4 (Claude Code)
- gstack 56 skills (Claude Code)
- Codex Plugin v1.0.4 (Claude Code)
- code-review-graph v2.3.5 (system-wide)

### Scrape Results
- 602 sources attempted (9 paid excluded)
- 552 succeeded (91.7%)
- 30,894 records collected
- 86 MB data in api/data/scraped/ (552 JSON files)
- Report at api/data/reports/scrape_report_20260602_050221.json

### Category Results (100% success)
- macro_indicator: 37/37 → 19,213 records
- capital_markets: 85/85 → 171 records
- israeli: 22/22 → 131 records
- news_sentiment: 39/39 → 766 records
- demographic: 25/25 → 2,121 records
- infrastructure: 30/30 → 127 records
- economic: 19/19 → 19 records
- housing_re: 10/10 → 19 records
- construction_pipeline: 6/6 → 5 records
- insurance_climate: 7/7 → 1 record

### Partial Success
- zoning_parcel: 49/68 (72%) → 7,235 records
- hazard_environmental: 34/47 (72%) → 174 records
- other: 158/174 (91%) → 881 records
- energy: 31/33 (94%) → 31 records

### 50 Failures (mostly ArcGIS portals returning HTML)
- 29x "Expecting value" (HTML instead of JSON)
- 7x DNS resolution failures
- 4x timeouts
- Leave these for now per user instruction

### What's Built
- api/scrapers/connectors/base.py (248 lines) — BaseConnector
- api/scrapers/connectors/rest_api.py — REST API connector
- api/scrapers/connectors/rss.py — RSS/Atom connector
- api/scrapers/connectors/socrata.py — Socrata SODA connector
- api/scrapers/connectors/arcgis.py — ArcGIS connector
- api/scrapers/config_loader.py — CSV + YAML config loader
- api/scrapers/run.py — CLI runner
- api/scrape_all.py (396 lines) — Master batch scraper
- api/server/app.py — FastAPI skeleton
- api/data/sources_611.csv — Master source list
- 5 YAML configs for top sources

### Next Steps (continue in this session)
1. Build dashboard/frontend to visualize scraped data
2. Create summary Excel/PDF reports
3. Wire FastAPI to serve live data
4. Build the terminal website showing all data
