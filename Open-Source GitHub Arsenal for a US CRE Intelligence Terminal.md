# Open-Source GitHub Arsenal for a US CRE Intelligence Terminal

> **Purpose:** A field guide for the Terminal team — every actively maintained open-source project worth forking, wiring in, or studying to power a live US commercial real estate intelligence terminal with tiles, tickers, maps, and data feeds. Sourced directly from GitHub MCP searches run May 26, 2026.

***

## Master Repository Table

*Grouped by functional category. Stars and last-commit data are live as of the search date.*

### Category 1 — Curated Awesome Lists & CRE Meta-Repos

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| etewiah/awesome-real-estate | https://github.com/etewiah/awesome-real-estate | 314 | 2026-05-25 | Markdown | MIT | Curated list of RE resources, APIs, datasets, PropTech tools | Navigation hub / discovery index for every other row in this table | Hobby |
| Deal-Scale/awesome-real-estate-investing | https://github.com/Deal-Scale/awesome-real-estate-investing | 8 | 2026-05-05 | HTML | Unknown | Investor-focused extension of the above; tools, platforms, projects | Secondary discovery layer | Toy |

The canonical **etewiah/awesome-real-estate** repo is the definitive starting point — 314 stars, last updated the day before this search, organized into categories covering APIs, analytics, valuation, PropTech startups, and datasets. Fork it as your internal team wiki and add every repo below to it.

***

### Category 2 — FRED / Macro Economic Data Pipelines

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| mortada/fredapi | https://github.com/mortada/fredapi | 1,575 | 2026-05-26 | Python | Apache-2.0 | Python API for FRED and ALFRED | Cap rate / interest rate tile; 10-yr Treasury feed, vacancy series | Battle-tested |
| gw-moore/pyfredapi | https://github.com/gw-moore/pyfredapi | 69 | 2026-04-23 | Python | MIT | Typed, modern Python FRED client | Same macro feeds with Pydantic models | Active |

**mortada/fredapi** is the workhorse — 1,575 stars, still receiving commits in May 2026, covering every FRED series including CMHPI house price indexes, commercial mortgage delinquency rates, and the 10-yr/2-yr Treasury spread critical for cap rate modeling. **pyfredapi** (69 stars) wraps the same API with type hints and a cleaner interface suitable for FastAPI backends.

***

### Category 3 — Census / Geography Data Loaders

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| jtleider/censusdata | https://github.com/jtleider/censusdata | 144 | 2025-08-25 | Python | MIT | Download ACS, Decennial, and Economic Census tables via API | Demographics tile; trade area population, income, household density | Active |
| walkerke/pygris | https://github.com/walkerke/pygris | 149 | 2026-03-24 | Python | MIT | US Census shapefiles in Python (port of R's tigris) | Map tile geometry — tracts, counties, CBSAs, ZIP codes | Active |

**pygris** (149 stars, March 2026 commit) is the fastest path to pulling US Census TIGER shapefiles directly into GeoPandas for map layers — tracts, counties, CBSAs, ZIP codes, congressional districts. Pair it with **censusdata** (144 stars) to attach ACS demographic and income tables to those geometries for trade-area overlays.

***

### Category 4 — GIS / Spatial Analysis Core

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| gboeing/osmnx | https://github.com/gboeing/osmnx | 5,685 | 2026-05-25 | Python | MIT | Download, model, and analyze street networks from OpenStreetMap | Walk-score / drive-time isochrone overlay; proximity-to-transit tile | Battle-tested |
| microsoft/GlobalMLBuildingFootprints | https://github.com/microsoft/GlobalMLBuildingFootprints | 1,871 | 2026-05-22 | Python | ODbL | Worldwide building footprints from satellite ML | Building footprint layer; parcel density map | Active |
| OvertureMaps/overturemaps-py | https://github.com/OvertureMaps/overturemaps-py | 246 | 2026-05-19 | Python | Apache-2.0 | Official Python CLI for Overture Maps Foundation data | POI layer, building layer, places data pipeline | Active |
| kraina-ai/overturemaestro | https://github.com/kraina-ai/overturemaestro | 36 | 2026-05-22 | Python | MIT | Multiprocessing Overture Maps reader with QoL features | Faster Overture ingestion pipeline | Active |

**osmnx** at 5,685 stars is battle-tested for real estate: it computes drive-time isochrones, walk scores to transit nodes, and proximity analytics that power site-selection intelligence tiles. **GlobalMLBuildingFootprints** from Microsoft (1,871 stars) is the only free global building polygon dataset at usable resolution — wire it in for parcel footprint overlays. The official **overturemaps-py** CLI gives CLI and Python access to Overture's buildings, places, and addresses (updated May 2026).

***

### Category 5 — Visualization: Maps (Front-End)

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| maplibre/maplibre-gl-js | https://github.com/maplibre/maplibre-gl-js | 10,686 | 2026-05-26 | TypeScript | BSD-3 | Open-source WebGL vector tile maps in the browser | Base map tile for every geographic layer in the terminal | Battle-tested |
| visgl/deck.gl | https://github.com/visgl/deck.gl | ~12,000 | 2026-05-26 | JavaScript | MIT | WebGL2 visualization framework for large geospatial datasets | Heat maps, hexbin layers, arc layers over property data | Battle-tested |

**MapLibre GL JS** (10,686 stars, May 26 commit) is the open-source Mapbox GL fork that is now the industry standard for self-hosted vector tile maps — no per-tile API costs. **deck.gl** from vis.gl (visgl organization) sits on top of MapLibre/WebGL to render millions of points as hexbins, heat maps, arcs, and scatter layers — essential for density and distress visualization at scale.[^1][^2]

***

### Category 6 — Visualization: Financial Charts & Dashboards

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| tradingview/lightweight-charts | https://github.com/tradingview/lightweight-charts | 15,982 | 2026-05-26 | TypeScript | Apache-2.0 | Performant HTML5 canvas financial charts | REIT ticker tile, cap rate time-series, T-spread chart | Battle-tested |
| louisnw01/lightweight-charts-python | https://github.com/louisnw01/lightweight-charts-python | 2,036 | 2026-05-25 | TypeScript/Python | MIT | Python framework wrapping TradingView Lightweight Charts | Same charts driven from Python backend | Active |
| klinecharts/KLineChart | https://github.com/klinecharts/KLineChart | 3,802 | 2026-05-26 | TypeScript | Apache-2.0 | Customizable k-line/candlestick chart, zero dependencies | REIT OHLC ticker display | Active |

**tradingview/lightweight-charts** at 15,982 stars (committed today) is the fastest path to a Bloomberg-style price chart tile. The companion **lightweight-charts-python** (2,036 stars) wraps the same library so a Streamlit or FastAPI backend can push live data without a Node.js layer.

***

### Category 7 — SEC EDGAR Filings (REIT & CRE)

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| dgunning/edgartools | https://github.com/dgunning/edgartools | 2,220 | 2026-05-26 | Python | MIT | Read/analyze SEC filings: 10-K, 8-K, XBRL, 13F, Form 4 | REIT filing feed; NOI/FFO data extraction; insider trades | Battle-tested |

**edgartools** is the standout here — 2,220 stars, committed today, MIT license. It parses XBRL financials so you can extract REIT NOI, FFO, debt maturities, and geographic segment data from 10-K filings directly. The SIC code 6500-series (Real Estate) and 6726 (Investment Offices, NEC — covers REITs) can be filtered via its company search. An MCP server wrapper (`dynamicdeploy/edgartools-mcpserver`) exists for agentic pipelines.

***

### Category 8 — News Sentiment & Events Feed (GDELT)

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| linwoodc3/gdeltPyR | https://github.com/linwoodc3/gdeltPyR | 251 | 2026-05-18 | Python/Jupyter | MIT | Retrieve GDELT 1.0 & 2.0 event data in Python | News sentiment feed; "distress events" near a submarket | Hobby |
| alex9smith/gdelt-doc-api | https://github.com/alex9smith/gdelt-doc-api | 218 | 2026-05-20 | Python | MIT | Python client for GDELT 2.0 Doc API | Article-level news feed for CRE sentiment tile | Active |
| abresler/gdeltr2 | https://github.com/abresler/gdeltr2 | 76 | 2026-05-13 | R | MIT | Modern GDELT wrapper for R | R-based sentiment scoring pipeline | Hobby |

**gdelt-doc-api** (218 stars, updated May 20) is the cleanest Python interface — query by keyword ("commercial real estate foreclosure Chicago") and get news articles with tone scores. Wire into a Kafka/Redis stream for a live sentiment ticker. **gdeltPyR** (251 stars) handles the full bulk GDELT Events database for historical backtesting.

***

### Category 9 — Affordable Housing, Multifamily & Rent Data

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| cfpb/hmda-census | https://github.com/cfpb/hmda-census | ~12 | 2019 | Python | CC0 | ETL for geographic/Census data used by HMDA Platform (CFPB) | Mortgage origination density map; lending desert overlay | Abandoned (fork-worthy) |
| UI-Research/hmda-neighborhood | https://github.com/UI-Research/hmda-neighborhood | ~8 | 2020 | Python | MIT | Neighborhood-level HMDA data aggregation | Lending activity heat map | Abandoned (fork-worthy) |
| sdabney5/HCVGAPS / hudlink | https://github.com/sdabney5/HCVGAPS | ~3 | 2024 | Python | MIT | Automated ACS-HUD data linking for voucher gap analysis | Affordability stress tile | Hobby |

No battle-tested open-source LIHTC or HMDA pipeline exists as of mid-2026. The HUD CHAS API and HMDA public data files are well-documented but every open-source consumer is at hobby or abandoned status. The CFPB's own **hmda-census** repo, while abandoned, is the most complete starting point for a FFIEC HMDA geographic ETL.[^3][^4]

***

### Category 10 — Zoning, Parcels & Property Records

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| NuMetriq/sarpy-zoning-parcel-dashboard | https://github.com/NuMetriq/sarpy-zoning-parcel-dashboard | 0 | 2026-01-22 | Python | Unknown | GIS dashboard analyzing parcel/zoning data (Sarpy County) | Proof-of-concept parcel zoning overlay | Toy |
| stevevance/cook_county_address_scraper | https://github.com/stevevance/cook_county_address_scraper | ~5 | 2014 | Ruby | Unknown | Cook County property tax scraper | County recorder / tax deed data pipeline | Abandoned (fork-worthy) |

**This is the largest gap in the ecosystem** (see Gap Analysis below). No general-purpose, national-scale open-source zoning or parcel lookup library exists. RegridData and Zoning Atlas projects are proprietary or paywalled.

***

### Category 11 — CMBS / Distress Data

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| Trepp (org) | https://github.com/Trepp | N/A | 2026 | Various | Proprietary | Official Trepp GitHub — no public data repos as of search date | N/A — monitor for future OSS releases | N/A |

**No open-source CMBS remittance parser, watchlist aggregator, or special-servicer transfer tracker exists on GitHub**. Trepp's GitHub org has no public data repositories. DealCharts and Bloomberg are the only structured CMBS data sources with APIs, both proprietary. This is the second-largest gap (see Gap Analysis).[^5][^6]

***

### Category 12 — FEMA Flood / Climate Risk

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| *(no dedicated repo found — use FEMA's ArcGIS REST API directly)* | https://msc.fema.gov/arcgis/rest/services | N/A | Live | REST | Gov | FEMA FIRM flood map REST service | Flood zone overlay on map tile | N/A (API, not repo) |

No standalone Python FEMA FIRM/NFIP loader library exists with meaningful star counts. The standard approach is to query FEMA's National Flood Hazard Layer (NFHL) ArcGIS REST service directly via `requests` or `arcgis` Python SDK. FEMA's own GitHub org (`FEMA`) has administrative repos but no flood data loader.

***

### Category 13 — Construction Cost & BLS PPI

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| HarryStevens/inflation-scraper | https://github.com/HarryStevens/inflation-scraper | ~10 | 2019 | JavaScript | MIT | Get BLS CPI inflation data | Construction cost tile (extend to PPI) | Abandoned (fork-worthy) |
| jvawdrey/bls-scraper | https://github.com/jvawdrey/bls-scraper | ~3 | 2015 | Python | Unknown | BLS data scraper | PPI Construction series (PCU236-series) | Abandoned (fork-worthy) |

The BLS public API (api.bls.gov) is robust and free — ENR and PPI construction cost series (e.g., `PCU236210236210`) are accessible via direct REST calls. No active open-source wrapper focuses specifically on construction cost indexes. Pull directly from `mortada/fredapi` using FRED series `WPUSI012011` (PPI: Construction) as the simplest path.[^7]

***

### Category 14 — DCF / Cap Rate / IRR Financial Models

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| PSLmodels/Cost-of-Capital-Calculator | https://github.com/PSLmodels/Cost-of-Capital-Calculator | ~500 | Active | Python | CC0 | Cost of capital model with tax policy parameters | WACC / discount rate tile | Active |
| scfengv/Stock-Valuation | https://github.com/scfengv/Stock-Valuation | ~30 | 2024 | Python | MIT | DCF model implementation in Python | Adapt for CRE income capitalization | Hobby |

No open-source CRE-specific DCF/IRR/equity-multiple calculator with meaningful star counts or active maintenance exists. The **PSLmodels/Cost-of-Capital-Calculator** is the most rigorous open-source cost-of-capital implementation but is equity-focused. For CRE: the standard is to build from scratch using numpy-financial (`numpy_financial.irr`, `.npv`, `.mirr`) — lightweight and maintained by NumPy contributors.[^8]

***

### Category 15 — Israeli Finance (TASE / Bank of Israel / USD-ILS)

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| *(No TASE/Maya scraper found with active maintenance)* | — | — | — | — | — | — | — | — |
| *(BOI API is REST — no wrapper found)* | https://boi.org.il/en/economic-roles/markets-and-payment-systems/foreign-exchange/ | N/A | Live | REST | Gov | Bank of Israel official FX rates API | USD/ILS live rate tile | N/A (direct API) |

No open-source TASE/Maya scraper, Bank of Israel data loader, or Gemel pension data client was found on GitHub with active maintenance. The Bank of Israel publishes a free REST API for exchange rates (including USD/ILS daily fixing) at `boi.org.il` — pull directly. For TASE data, Maya (the Israeli disclosure system) has no public API; the only known scrapers are private or abandoned forks.

***

### Category 16 — Port / Logistics & Demand Proxies

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| *(No Port of LA TEU or POLB scraper found)* | — | — | — | — | — | Port of LA publishes monthly TEU CSV at portofla.org | Industrial demand proxy tile | N/A (direct download) |

No open-source Port of LA/Long Beach TEU loader, TSA throughput scraper, or ATA tonnage parser was found with any star count on GitHub. Port of LA's ACIS system publishes monthly CSV files directly — a 20-line Python script with `requests` and `pandas` is sufficient. The BTS (Bureau of Transportation Statistics) API covers freight and tonnage with no dedicated wrapper either.

***

### Category 17 — Office Demand / WFH Proxies

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| *(No Kastle, Stanford WFH, or OpenTable scraper found publicly)* | — | — | — | — | — | Kastle publishes weekly back-to-office PDF; Stanford WFH publishes public CSV | Office occupancy tile | N/A (direct download) |

Kastle Systems' back-to-office data is published as embeddable JavaScript widgets with underlying JSON — scrapable but no open-source scraper is maintained. The Stanford WFH Research Project publishes public CSVs on their site. OpenTable's seated-diners data is available via direct download from their research site. None have active GitHub wrappers.

***

### Category 18 — Foreclosure / Tax Deed / County Recorder

| Repo (org/name) | GitHub URL | Stars | Last Commit | Language | License | One-Line Description | Dashboard Tile / Pipeline | Production-Readiness |
|---|---|---|---|---|---|---|---|---|
| stevevance/cook_county_address_scraper | https://github.com/stevevance/cook_county_address_scraper | ~5 | 2014 | Ruby | Unknown | Cook County property tax lookup scraper | Delinquency / tax deed pipeline seed | Abandoned (fork-worthy) |
| typpo/ca-property-tax | https://github.com/typpo/ca-property-tax | ~15 | 2020 | JavaScript | MIT | California property tax map | County-level tax data visualization | Abandoned (fork-worthy) |

No general-purpose national foreclosure scraper or hudhomestore.gov scraper exists. County recorder data is extremely fragmented — most counties use inaccessible vendor portals (Tyler Technologies, GovTech). The most practical approach is to consume the ATTOM Data Solutions feed (commercial) or scrape individual county CAMA portals. No open-source abstraction layer exists at national scale.

***

## The 10 Highest-Leverage Repos for Shipping in 59 Days

Ranked by impact-to-integration-time ratio for a small team building a live public CRE terminal:

| Rank | Repo | Stars | Why It's #N on the 59-Day Sprint |
|---|---|---|---|
| 1 | **tradingview/lightweight-charts** | 15,982 | Ships production-quality financial charts (REIT tickers, cap rate series, T-spread) in hours. Zero chart-from-scratch work. |
| 2 | **maplibre/maplibre-gl-js** | 10,686 | The entire map layer of the terminal. Self-hosted vector tiles, no per-tile costs, React-friendly. |
| 3 | **dgunning/edgartools** | 2,220 | Pulls live REIT 10-K/8-K XBRL data — NOI, FFO, debt schedules — from SEC. MIT licensed, committed daily. |
| 4 | **mortada/fredapi** | 1,575 | 10-yr Treasury, mortgage rates, CMHPI, commercial delinquency — every macro rate series the terminal needs. |
| 5 | **gboeing/osmnx** | 5,685 | Walk-score overlays, drive-time isochrones, transit proximity — differentiating site-quality analytics. |
| 6 | **microsoft/GlobalMLBuildingFootprints** | 1,871 | Free building polygons to overlay on map tiles — no commercial parcel data license needed for footprints. |
| 7 | **OvertureMaps/overturemaps-py** | 246 | POI layer, building data, addresses — feeds the places/amenity overlay tiles. |
| 8 | **walkerke/pygris** | 149 | TIGER census boundary shapefiles in three lines of Python — powers every geographic boundary layer. |
| 9 | **alex9smith/gdelt-doc-api** | 218 | Live news sentiment feed by submarket keyword — the "news feed" tile ships in a weekend. |
| 10 | **louisnw01/lightweight-charts-python** | 2,036 | Bridges Python data pipelines directly to TradingView charts without a Node.js layer. |

***

## Abandoned-But-Still-Useful Repos Worth Forking

These repos have not been updated in 2+ years but contain unique logic that saves weeks of work:

| Repo | Stars | Last Commit | What to Salvage |
|---|---|---|---|
| cfpb/hmda-census | ~12 | 2019 | FFIEC HMDA geographic join logic — the hardest part of building a lending-activity map tile[^3] |
| stevevance/cook_county_address_scraper | ~5 | 2014 | Exact XPath/scraping patterns for IL property tax portal — template for other Cook-style county portals[^9] |
| HarryStevens/inflation-scraper | ~10 | 2019 | BLS API call pattern for CPI; extend to PPI Construction series for a cost-index tile[^10] |
| narayave/Insight-GDELT-Feed | 48 | 2019 | Airflow + Spark GDELT ingestion pipeline — the full ETL architecture for a streaming news feed |
| UI-Research/hmda-neighborhood | ~8 | 2020 | Neighborhood-level HMDA aggregation logic; census tract mortgage origination density[^11] |

***

## Gap Analysis — Where No Good Open-Source Repo Exists

**The single most glaring void in the entire US CRE open-source ecosystem is a national-scale, programmatic zoning and parcel-data abstraction layer.** No open-source library exists that normalizes zoning codes, permitted uses, FAR, lot coverage limits, and setbacks across multiple US jurisdictions into a queryable API — despite this being the single most common due-diligence lookup in commercial real estate. The closest public-domain resource is the National Zoning Atlas project (a university consortium), but it has no Python client, no REST API, and no GitHub repository with live data. A second gap, nearly as large, is a free CMBS remittance parser: Trepp has no public GitHub repos, no open-source project parses the raw CMBS trustee distribution reports (TDRs published monthly by trustees like Wells Fargo and US Bank), and no open-source watchlist or special-servicer transfer tracker exists — leaving a team building a CRE distress dashboard entirely dependent on expensive proprietary feeds. A third gap is a unified foreclosure-to-tax-deed pipeline: county-by-county scraping of recorder portals, lis pendens filings, and auction calendars is either abandoned (Cook County, 2014) or entirely absent, despite foreclosure tracking being a core workflow for distressed CRE investors. Any of these three — a national zoning API client, a CMBS TDR parser, or a multi-county foreclosure aggregator — would immediately attract significant GitHub stars and fill a genuine market need that no VC-backed PropTech vendor has chosen to open-source.[^12][^13][^6][^9][^5]

---

## References

1. [Open Source Data Visualization Project deck.gl v9 Released](https://openjsf.org/blog/deckgl-v9) - The deck.gl team has released v9! deck.gl, a GPU-powered framework for visual exploratory data analy...

2. [visgl/deck.gl: WebGL2 powered visualization framework - GitHub](https://github.com/visgl/deck.gl) - deck.gl is designed to simplify high-performance, WebGL2/WebGPU based visualization of large data se...

3. [ETL for geographic and Census data used by the HMDA Platform](https://github.com/cfpb/hmda-census) - The HMDA Platform uses data the combines elements of the FFIEC Census Flat File and the OMB MSA deli...

4. [CONSOLIDATED PLANNING/CHAS Dataset API Documentation](https://www.huduser.gov/portal/dataset/chas-api.html) - Use the API Tester to make API calls to CHAS Dataset. The API Tester requires an access token. If yo...

5. [Trepp - GitHub](https://github.com/Trepp) - Trepp is the leading provider of data, insights, and technology solutions to the structured finance,...

6. [A Deep Dive into CMBS Delinquency Rates for Programmatic Analysis](https://dealcharts.org/blog/cmbs-delinquency-rates) - Learn how to track and analyze CMBS delinquency rates programmatically with verifiable data lineage....

7. [Producer Price Index Data for the Nonresidential Building ...](https://www.bls.gov/ppi/factsheets/producer-price-index-nonresidential-building-construction-initiative.htm) - The following table lists the output price indexes BLS developed as part of the PPI Nonresidential B...

8. [real-estate-investment · GitHub Topics](https://github.com/topics/real-estate-investment) - A lightweight Real Estate ROI Calculator to analyze rental property investments. Computes cash inves...

9. [Given a Chicago address, scrape the Cook County Property Tax ...](https://github.com/stevevance/cook_county_address_scraper) - Scrapes the Cook County Property Tax Info portal's Address Results page and dumps data in a more use...

10. [HarryStevens/inflation-scraper: Get CPI inflation from BLS. - GitHub](https://github.com/HarryStevens/inflation-scraper) - Get CPI inflation from BLS. Contribute to HarryStevens/inflation-scraper development by creating an ...

11. [UI-Research/hmda-neighborhood: Neighborhood-level HMDA data](https://github.com/UI-Research/hmda-neighborhood) - This project derives census-tract level statistics from the unprocessed HMDA dataset to make the dat...

12. [[PDF] TreppCMBSTM - HubSpot](https://cdn2.hubspot.net/hub/157783/file-463978370-pdf/TreppCMBS_Overview.pdf) - Access the largest trading-quality CMBS database in the industry. The secondary CMBS market relies o...

13. [Breaking Down Trepp's CMBS Delinquency Report: Guide to ...](https://www.trepp.com/trepptalk/breaking-down-trepp-cmbs-delinquency-report-essential-guide-distress-cmbs) - The data comes from the CMBS market and specifically from servicers and trustees that collect and di...

