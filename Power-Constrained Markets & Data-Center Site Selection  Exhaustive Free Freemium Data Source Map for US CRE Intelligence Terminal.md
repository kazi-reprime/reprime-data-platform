# Power-Constrained Markets & Data-Center Site Selection: Exhaustive Free/Freemium Data Source Map for US CRE Intelligence Terminal

> **Purpose:** Bloomberg-style terminal overlay for Israeli family offices and institutional LPs investing in US CRE. Covers US electricity grid capacity, ISO/RTO interconnection queues, energy prices, and data-center/power-intensive CRE infrastructure — 2024–2026 data horizon.

***

## Executive Summary

The supply of available megawatts is now the primary gating constraint on CRE site selection, particularly for hyperscale data centers and industrial reshoring facilities. As of end-2024, nearly 2,600 GW of generation and storage capacity was actively seeking grid interconnection across all US queues — more than double installed US generating capacity. ERCOT's large-load queue alone jumped almost 300% in 2025, with 70%+ of requests driven by data centers. Meanwhile, 300+ state legislative bills addressing data-center energy were filed in just six weeks of 2026, including moratoria in NY, SD, and OK. For a Tel Aviv LP screen, the single most important data layer is: *county-level MW availability vs. queued MW vs. operational data-center pipeline*. Every source below is mapped to that objective.[^1][^2][^3]

***

## Section 1: EIA Open Data API v2 — Core Grid Intelligence

The EIA Open Data API v2 is the **mandatory anchor** for any US power intelligence terminal — free, no rate limit disclosed (practical limit ~5,000 requests/day), JSON only, API key via `https://www.eia.gov/opendata/register.php`.[^4][^5]

### Key Endpoints

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **EIA API v2 — Retail Electricity Prices** | `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=KEY&data=price&facets[sectorName][]=residential` | Free | No documented limit (~5k req/day practical) | State, utility, sector | Monthly | JSON | Yes (free key) | Price (¢/kWh), revenue, sales (MWh), customer count by sector | EIA Form 861 | "Retail Power Price by State" tile | 1–2 month lag; sector = residential/commercial/industrial/all |
| **EIA API v2 — Hourly Grid Operations (RTO/ISO)** | `https://api.eia.gov/v2/electricity/rto/region-data/data/?frequency=hourly&data=value&facets[type][]=D&api_key=KEY` | Free | ~5k req/day | Balancing Authority (56 BAs) | Hourly | JSON | Yes (free key) | Demand (MWh), net generation, interchange by BA | GridStatus.io | "Hourly Load by Balancing Authority" tile | Best hourly source covering all CONUS; use `facets[subba][]` for subregions[^4] |
| **EIA API v2 — Generation by Source** | `https://api.eia.gov/v2/electricity/rto/fuel-type-data/data/?frequency=hourly&data=value&api_key=KEY` | Free | ~5k req/day | Balancing Authority | Hourly | JSON | Yes (free key) | MWh by fuel type (coal/gas/nuclear/solar/wind/hydro/other) | CAISO OASIS, PUDL | "Generation Mix" tile | Useful for carbon intensity overlay per BA |
| **EIA API v2 — Electric Power Operations (Capacity)** | `https://api.eia.gov/v2/electricity/electric-power-operational-data/data/?api_key=KEY` | Free | ~5k req/day | State, utility | Monthly/Annual | JSON | Yes (free key) | Net generation (MWh), capacity (MW), fuel consumption, plant count | EIA Form 860 | "Installed Capacity by State" tile | Does not include queued/planned capacity |
| **EIA API v2 — State Energy Price Index** | `https://api.eia.gov/v2/electricity/retail-sales/data/?frequency=annual&facets[stateid][]=TX` | Free | ~5k req/day | State | Annual | JSON | Yes (free key) | Average retail price (¢/kWh) all sectors, annual | FERC EQR | "State Power Cost Heatmap" tile | Use for site-selection cost comparison across states |

**Sample curl (hourly BA demand):**
```bash
curl "https://api.eia.gov/v2/electricity/rto/region-data/data/?frequency=hourly\
&data=value&facets[type][]=D&sort[column]=period\
&sort[direction]=desc&length=100&api_key=YOUR_KEY"
```

***

## Section 2: EIA Bulk Form Data — Generator Inventory & Utility Census

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **EIA Form 860 — Generator Inventory** | `https://www.eia.gov/electricity/data/eia860/` | Free | Bulk file (no limit) | Plant/generator level (lat/lon) | Annual (next: Sep 2026 for 2025 data) | Excel/ZIP | No | Generator ID, capacity (MW), fuel, status (operating/planned/retired), lat/lon, interconnecting utility, voltage | FERC Form 1, LBNL Queued Up | "Plant-Level Capacity Map" | Key for substation-level analysis; 2024 data released Sep 2025[^6] |
| **EIA Form 861 — Annual Electric Utility Census** | `https://www.eia.gov/electricity/data/eia861/zip/f8612023.zip` | Free | Bulk file | Utility/state | Annual (1–2 yr lag) | ZIP/Excel | No | Peak load, MWh sales, revenue by sector, customer count, net metering, DSM programs | EIA API v2 retail sales | "Utility Load Profile" tile | Census of ALL US electric utilities; critical for utility-level power availability[^7][^8] |
| **EIA Form 923 — Generation & Fuel Receipts** | `https://www.eia.gov/electricity/data/eia923/` | Free | Bulk file | Plant level | Monthly (2-mo lag) | Excel/ZIP | No | Net generation (MWh), fuel consumed (MMBtu), heat rate, fuel costs, stocks | EIA Form 860, PUDL | "Plant-Level Generation" tile | Links to Form 860 via plant ID; monthly detail is powerful for capacity utilization analysis |
| **EIA Form 860M — Monthly Generator Additions** | `https://www.eia.gov/electricity/data/eia860m/` | Free | Bulk file | Plant/generator | Monthly | Excel | No | New, retired, or changed generators this month; planned in-service date | FERC queue data | "New Capacity Pipeline" tile | Best free source for tracking near-term (0–24 mo) capacity additions |

***

## Section 3: FERC Data — Interconnection, Transmission, Wholesale Power

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **FERC eLibrary (document search)** | `https://elibrary.ferc.gov/eLibrary/search` | Free | Unlimited search | National / docket-level | Real-time as filed | PDF/XML | No (search), Yes (some filings) | All FERC orders, NOPRs, tariff filings, IRP filings by utility | FERC data.ferc.gov | "Regulatory Action Feed" tile | RSS available; search by docket type = "Electric" + "Interconnection" for queue reform orders |
| **FERC data.ferc.gov** | `https://data.ferc.gov` | Free | Unlimited | National / utility | Updated continuously | CSV/JSON/API | No | FERC form filings metadata, enforcement actions, rate cases | FERC eLibrary | "Regulatory Timeline" tile | Portal launched 2022; API-style queries for structured FERC data[^9] |
| **FERC EQR — Electric Quarterly Reports (Bulk)** | `https://www.ferc.gov/download-database` (FTP bulk) | Free | Bulk (GBs) | Utility / control area / contract | Quarterly | CSV (compressed) | No | Buyer, seller, price ($/MWh), quantity (MWh), product type, delivery location, duration | EIA API retail prices, GridStatus LMP | "Wholesale Power Market" tile | Multi-GB download; use FERC EQR Report Viewer for selective filings[^10][^11][^12] |
| **FERC Form 1 (via PUDL/OpenEI)** | `https://data.openei.org/submissions/489` | Free | Bulk file | Utility level | Annual (1994–2024 via PUDL) | Excel/CSV | No | Transmission capex, O&M costs, MWh sales by class, peak demand, customer count | EIA Form 861 | "Utility Financials & Transmission Spend" tile | Raw Form 1 is via FERC eFiling (registered users); PUDL/OpenEI provides cleaned version[^13][^14] |
| **FERC Form 715 — Transmission Planning (CEII-protected)** | `https://www.ferc.gov/electric-industry-forms/form-no-715-annual-transmission-planning` | Restricted | CEII/FOIA request only | Transmission system / utility | Annual | PDF/Power flow files | Yes (CEII request) | Transmission maps, base case power flows, reliability criteria, planned expansions | N/A | Not directly usable in terminal | **GATED:** Power flow data was removed from public access in 2001 for national security reasons; requires CEII request to FERC (18 CFR § 388.113)[^15] |
| **FERC Generator Interconnection Queue Summary** | `https://www.ferc.gov/industries-data/electric/electric-power/generator-interconnection` | Free | Unlimited | National / ISO | Periodic (per queue updates) | PDF/CSV | No | Projects by ISO, capacity MW, study phase, withdrawal rates | LBNL Queued Up | "Interconnection Policy Watch" tile | Use alongside LBNL for full picture; FERC Order 2023 compliance filings critical context[^16] |

***

## Section 4: ISO/RTO Queue + LMP Data — The "Unfair Advantage" Layer

### 4A: PJM (Mid-Atlantic, Midwest — 13 states, ~65 GW peak load)

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PJM Data Miner 2 — Interconnection Queue** | `https://dataminer2.pjm.com/feed/ivmkt_intstudy_queue` (Excel feed) | Free | No stated limit | PJM footprint / substation POI | Daily | Excel/CSV/JSON | No (public feeds) | Queue position, project name, MW capacity, technology, POI (point of interconnection), status, study phase, projected in-service date | LBNL Queued Up | "PJM Queue Map" tile | **Unfair-advantage source**: raw Excel includes substation-level POI data most analysts never exploit[^17][^18][^19] |
| **PJM Data Miner 2 — Real-Time Hourly LMPs** | `https://dataminer2.pjm.com/feed/rt_hrl_lmps/definition` | Free | No stated limit | Node-level (2,000+ pricing nodes) | Hourly | CSV/JSON | No | LMP ($/MWh), energy component, congestion component, loss component by node | CAISO OASIS, FERC EQR | "Nodal Price Map" tile | Node-level LMP is the granularity that shows congestion; congestion = constrained infrastructure[^20][^21] |
| **PJM Queue Scope (new 2025 tool)** | `https://www.pjm.com/planning/planning-center/queue-scope` | Free | No stated limit | Substation / POI level | Periodic | Web/Export | No | Predicted MW impact of new generation at any substation node | PJM Data Miner 2 | "Substation Headroom" tile | PJM launched this public tool in Oct 2025 to let developers pre-screen viability before queue entry[^22] |

**Sample Python (PJM LMP via gridstatus):**
```python
import gridstatus
pjm = gridstatus.PJM()
df = pjm.get_lmp("today", market="REAL_TIME_HOURLY", locations="ALL")
```

### 4B: ERCOT (Texas — 90% of Texas load, largest US grid by geography)

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **ERCOT GIS Report (Monthly)** | `https://www.ercot.com/gridinfo/resource` | Free | Bulk download | Project level (lat/lon in GIS) | Monthly | Excel/ZIP | No | Project name, MW, fuel, POI substation, county, planned COD, study phase | LBNL Queued Up, interconnection.fyi | "Texas Queue Map" tile | #1 unfair-advantage source for Texas: raw GIS report includes exact substation coordinates[^23][^24] |
| **ERCOT Large Load Integration Queue** | `https://www.ercot.com/services/rq/large-load-integration` | Free | Bulk download | TSP / project level | Per-filing | Excel/DOCX | No | MW requested, county, TSP, study phase — data-center demand specifically categorized | ERCOT GIS, LBNL | "Texas Data-Center Demand Queue" tile | ERCOT's large load queue jumped 300% in 2025; 70%+ are data centers[^1][^25] |
| **ERCOT Real-Time LMP (Settlement Points)** | `http://mis.nyiso.com/public/` or via gridstatus: `ercot.get_lmp("today")` | Free | No stated limit | Load zone (8 zones) + hub prices | 5-minute / hourly | CSV/JSON | Account for MIS portal | Settlement point price ($/MWh), real-time, day-ahead | FERC EQR (for bilateral contracts) | "Texas Spot Price" tile | ERCOT uses zonal (not nodal) pricing; congestion less visible at node level[^21] |
| **ERCOT Resource Adequacy (Monthly)** | `https://www.ercot.com/gridinfo/resource` | Free | No stated limit | ERCOT system / weather zones | Monthly | Excel/PDF | No | Installed capacity (MW), available capacity, reserve margins by season, demand forecast | EIA Form 860 | "ERCOT Reserve Margin" tile | Use for stress-testing power availability claims by DC developers |

### 4C: MISO (Midwest + South — 15 states, ~183 GW peak)

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **MISO RT Data API** | `https://www.misoenergy.org/markets-and-operations/rtdataapis/` | Free | No stated limit | System / LRZ level | Real-time (5-min) | JSON (as of Dec 2025) | No | Load, generation by fuel, real-time LMP by hub, interface flows | EIA API BA hourly | "MISO Live Dashboard" tile | Note: URLs changed Dec 2025 — update hardcoded endpoints[^26] |
| **MISO GI Queue Interactive Map** | `https://giqueue.misoenergy.org/PublicGiQueueMap/index.html` | Free | No limit (web GIS) | Project level / POI | Updated per cycle | Web GIS / CSV export | No | Project MW, technology, county, POI, status (active/withdrawn/in study) | LBNL Queued Up | "MISO Queue Map" tile | 123 GW new capacity in 2024 cycle; 348 GW total if all valid[^27][^28][^29] |
| **MISO Generator Interconnection Queue (CSV)** | `https://www.misoenergy.org/planning/resource-utilization/GI_Queue/` | Free | Bulk download | Project level | Per cycle | Excel/CSV | No | All active/withdrawn projects with MW, fuel, POI, study results, cost estimates | LBNL, FERC | "MISO Queue Analysis" tile | Also provides "Queue Cap Tracker" for cap submission limits per region |

### 4D: CAISO (California — 80% of CA load)

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **CAISO OASIS API** | `https://oasis.caiso.com/oasisapi/SingleZip?queryname=PRC_LMP&startdatetime=20240101T08:00-0000&enddatetime=20240101T09:00-0000&version=1&market_run_id=RTM&node=TH_NP15_GEN-APND` | Free | Self-register required | Node-level (2,500+ pricing nodes) + zones | 5-minute (RT), hourly, daily | XML/CSV (zipped) | Self-registration (free) | LMP by node, day-ahead market prices, AS requirements, transmission limits, congestion data | FERC EQR | "CAISO Nodal Price & Congestion" tile | 39-month data retention; Historical OASIS Data Downloader tool added Nov 2025[^30][^31][^32] |
| **CAISO Interconnection Queue** | `https://www.caiso.com/generation-and-storage/generator-interconnection` | Free | Bulk download | Project level / POI substation | Monthly | Excel/ZIP | No | Project MW, fuel, POI, study phase, CAISO-estimated cost, projected COD | LBNL Queued Up | "CAISO Queue Map" tile | CA moratorium risk very high — track queue withdrawals as a leading indicator |

**Sample curl (CAISO OASIS RT LMP):**
```bash
curl "https://oasis.caiso.com/oasisapi/SingleZip?\
queryname=PRC_LMP&startdatetime=20260101T08:00-0000\
&enddatetime=20260101T09:00-0000&version=1\
&market_run_id=RTM&node=TH_NP15_GEN-APND&resultformat=6"
```

### 4E: NYISO, ISO-NE, SPP

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **NYISO Market Data** | `http://mis.nyiso.com/public/` | Free | No limit | Zone (11 zones) + node | 5-minute | CSV | No | DA/RT LMP by zone, load, generation by fuel, outages | ISO-NE, PJM | "NY Grid Price" tile | Full historical archive back to 2000[^21][^33][^34] |
| **ISO-NE Web Services API** | `https://webservices.iso-ne.com/api/v1.1` | Free | No stated limit (registration required) | Node-level (NE) | 5-min/hourly | XML/JSON | Yes (free registration) | RT LMP, DA LMP, load, constraints, interchange, AS prices | NYISO | "New England Grid" tile | RESTful API; WADL at base URL; apply via ISO-NE website[^35] |
| **SPP Marketplace Portal** | `https://portal.spp.org/` | Free | No stated limit | Node-level + LRZ | 5-min/hourly | CSV | No | DA/RT LMP, load, generation, interconnection queue Excel | LBNL Queued Up | "SPP Grid Price" tile | SPP queue has grown 5x since 2013; now ~150 GW queued[^36][^37] |

### 4F: GridStatus.io / gridstatus Python Library — Cross-ISO Unified API

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **gridstatus Python library (open source)** | `pip install gridstatus` → `gridstatus.CAISO().get_lmp("today")` | Free (open source) | No limit (direct ISO calls) | All 7 major ISOs: CAISO, PJM, MISO, ERCOT, SPP, NYISO, ISONE | Real-time to historical | Pandas DataFrame | No (ISO auth embedded) | LMP, load, fuel mix, interconnection queue for all ISOs via unified API | All ISO sources above | All "Grid Price" tiles | **Best single library for unified ISO data**; wraps all ISOs transparently[^38][^39][^40] |
| **GridStatus.io hosted API** | `https://api.gridstatus.io/v1/` | Freemium | Free tier: limited rows/requests; paid for bulk | All major US ISOs | Real-time | JSON | Yes (free API key at gridstatus.io) | LMP, load, fuel mix, standardized across ISOs | gridstatus library | Any price/load tile | Hosted version for production; free tier suitable for PoC; upgrade for terminal-grade data[^41][^42] |

***

## Section 5: LBNL + Interconnection.fyi — The Queue Intelligence Layer

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **LBNL "Queued Up" Annual Report + Excel** | `https://emp.lbl.gov/queues` | Free | Full Excel download | Project level / ISO / county | Annual (Dec/Jan for prior year) | PDF + Excel (35+ tabs) | No | All 10,300+ active projects: MW, fuel type, ISO, county, study phase, wait time, withdrawal rates; codebook included | All ISO queue sources | "National Queue Intelligence" tile | **Highest-leverage free source in this entire list**: Excel has project-level data from 7 ISOs + 49 non-ISO BAs covering 97% of US capacity[^43][^2][^44] |
| **Interconnection.fyi** | `https://www.interconnection.fyi` | Freemium | Free: web dashboard + county map; Paid: API + bulk CSV | National / ISO / state / county | Daily | Web / CSV (paid) / API (paid) | No (web); Yes (API) | 42,582 queue requests 1995–2026; MW, technology, status, ISO, county; daily updates; load queue (data centers) filter | LBNL Queued Up, LBNL | "Live Queue Map" tile | **Best daily-updated cross-ISO aggregate**; load queue at `interconnection.fyi/?type=Load` shows data-center demand side[^45][^46][^47][^48][^49] |

***

## Section 6: PUDL — The Free Data Cleaning Layer

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PUDL (Public Utility Data Liberation Project)** | `https://catalyst.coop/pudl/` or AWS: `s3://pudl.catalyst.coop/` | Free (open source) | No limit | Plant/utility/state | Quarterly releases (v2025.11 is latest) | Parquet/SQLite/CSV | No | Cleaned EIA 860/861/923, FERC Form 1, EQR, EPA CEMS — all linked via plant/utility ID | All EIA/FERC sources | Back-end ETL for all EIA/FERC tiles | **Best free ETL pipeline for building a terminal**: avoids months of data cleaning[^14][^50][^51][^52][^53] |

***

## Section 7: Data-Center Market Intelligence — Free/Freemium Sources

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **CBRE North America Data Center Trends** | `https://www.cbre.com/insights/books/north-america-data-center-trends-h2-2025` | Free (registration) | Full H2 2025 report | 8 primary markets + secondary | Semi-annual | PDF | Email registration | MW absorbed, supply under construction, vacancy rate, asking power price ($/kW-mo), new market leaders | JLL, Cushman | "Primary Market Dashboard" tile | H2 2025: primary supply up 36% YoY to 9,432 MW; Atlanta surpassed NoVA in absorption in 2024[^54][^55] |
| **JLL Global Data Center Outlook 2026** | `https://www.jll.com/en/trends-and-insights/research/global-data-center-outlook` | Free (registration) | Annual report | Global / US primary + secondary | Annual | PDF | Email registration | Power availability, construction pipeline, pricing, projected 200 GW by 2030 | CBRE, Cushman | "Market Forecast" tile | 2026 Outlook projects 200 GW global capacity by 2030[^56][^57] |
| **Cleanview.co Data Center Map** | `https://cleanview.co/data-centers/us` | Freemium | Free: web map; Paid: API + bulk data | Project level (lat/lon) | Weekly | Web / API (paid) | No (web); Yes (API) | 614 operating US DCs (18,505 MW), 968 planned projects (339,127 MW additional); status, developer, MW | interconnection.fyi, Business Insider DC map | "DC Pipeline Map" tile | Best free visual pipeline; API access requires paid tier[^58] |
| **Datacentertracker.org** | `https://datacentertracker.org` | Free | Full web access | County level (US) | Ongoing | Web/interactive map | No | Community opposition, legislative actions, moratorium proposals, proposed projects by community response | CBRE, state press releases | "Moratorium & Opposition Watch" tile | Tracks $64B+ in blocked/delayed projects[^59][^60] |
| **Interconnection.fyi Data Center Records** | `https://interconnection.fyi/data-center` | Free | Web access | US project level | Ongoing | Web | No | Proposed, under construction, operational DCs from public records; cross-referenced to load queue requests | Cleanview, ERCOT large-load queue | "DC + Load Queue Cross-Reference" tile | Unique: links physical DC permits to ISO load interconnection queue requests |
| **Datacentermap.com** | `https://www.datacentermap.com/usa/` | Free | Full | State / city | Ongoing | Web | No | 4,287 US facilities from 1,837 operators; colocation + hyperscale; state drill-down | Cleanview, CBRE | "Facility Inventory" tile | Includes smaller colocation that CBRE/JLL don't track |
| **Business Insider Interactive DC Map (2024)** | `https://www.businessinsider.com/data-center-locations-us-map-ai-boom-2025-9` | Free | Full | County level | Static (updated 2024) | Web (searchable table + map) | No | 1,240 built/approved US DCs; company, county, state, estimated MW (low/high); sortable table | Cleanview, CBRE | "Built/Approved Inventory" tile | Best county-level inventory with power estimates for site-selection screening |

### 7A: Regional Data-Center Corridor Intelligence

| Market / Source | URL | Key Stat (2024–2026) | Terminal Use |
|---|---|---|---|
| **Northern Virginia** (Loudoun/Prince William/Stafford/Fauquier moratoria tracker) | `https://www.pecva.org/region/loudoun/existing-and-proposed-data-centers-a-web-map/` | Loudoun DC moratorium in effect; PW County reviewing; VA HB 961/897 targeting tax incentives[^3][^61] | "NoVA Saturation Alert" tile |
| **Atlanta Metro** (GA DCA, utility filings) | State press releases + Georgia Power IRP | Atlanta absorbed 705.8 MW net in 2024 — 39x more than 2023[^54] | "Atlanta Growth Corridor" tile |
| **Phoenix AZ** | AZ Commerce Authority + SRP/APS utility IRPs | 1,000.4 MW under construction in H2 2024 (+222% YoY)[^54] | "Phoenix Power Stress" tile |
| **State Data-Center Legislation Tracker** | `https://www.multistate.us/insider/2026/2/20/state-data-center-legislation` | 300+ bills in 30+ states in first 6 weeks of 2026; moratoria in NY (3 yrs), SD (1 yr), OK (>100 MW until 2029)[^3] | "Regulatory Risk Map" tile |

***

## Section 8: Industrial Power, Incentives & Reshoring Intelligence

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Good Jobs First Subsidy Tracker** | `https://subsidytracker.goodjobsfirst.org` | Free | Full search | Facility / county / state | Ongoing (~3M records) | Web (searchable) | No | Company, subsidy value ($), program name, year, state/county, jobs claimed | DOE LPO, CHIPS tracker | "Incentive Heatmap" tile | Search "data center" for all DC-specific incentives; reveals subsidy-driven location decisions[^62][^63][^64] |
| **Novogradac IRA Energy Mapping Tool** | `https://www.novoco.com/resource-centers/renewable-energy-tax-credits/inflation-reduction-act-bonus-credits` | Free | Full map | Census tract / county | Annual IRS update | Web GIS | No | Energy community eligibility (§48E/§45Y +10% ITC/PTC bonus), low-income community zones, brownfield sites | IRS Notice 2023-29, IRA tracker | "Tax Credit Opportunity Zones" tile | §48E/§45Y tech-neutral credits in effect since Jan 2025; phaseout begins 2032[^65][^66][^67] |
| **IRA Tracker (CATF)** | `https://iratracker.org/programs/ira-section-13702-clean-electricity-investment-credit/` | Free | Full | National / program level | Ongoing (updated for OBBBA 2025 changes) | Web | No | Tax credit values, eligibility, phase-out schedule, OBBBA July 2025 amendments | Novogradac map, Crux | "IRA Clean Energy Credit Status" tile | Critical: OBBBA (July 2025) narrowed several IRA credits; verify current status[^68][^69] |
| **NREL Annual Technology Baseline (ATB)** | `https://atb.nrel.gov` → `https://atb.nrel.gov/electricity/2024/data` | Free | Full download | National / technology | Annual | Excel/CSV/Parquet | No | LCOE, capex, opex, capacity factor for all generation + storage tech (2024–2050 projections) | EIA Form 860 | "Power Procurement Cost" tile | 2024 ATB on OpenEI data lake; CSV and Parquet optimized for analytics[^70][^71][^72][^73] |
| **NREL Renewable Energy Atlas** | `https://maps.nrel.gov/` | Free | Full GIS | Grid cell / county | Annual update | Web GIS / download | No | Solar/wind resource potential (kWh/m²/day), biomass, geothermal, hydro capacity | NREL ATB | "Renewable Resource Potential" tile | Use to assess co-location of renewable power with DC sites |

***

## Section 9: Water, Grid Risk & Environmental Intelligence

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **USGS Water Data APIs (new OGC API)** | `https://api.waterdata.usgs.gov/ogcapi/v0` | Free | No limit | Site-level (stream gauge / groundwater well) | Real-time (15-min), daily | JSON (OGC Features) | No | Streamflow (cfs), gage height, groundwater level, water temperature at 10,000+ sites | US Drought Monitor | "Water Risk" tile | Legacy waterservices.usgs.gov decommissioning in early 2027 — migrate to new API[^74][^75][^76][^77] |
| **US Drought Monitor GIS** | `https://droughtmonitor.unl.edu/DmData/GISData.aspx` | Free | Full | County level | Weekly (Thursday) | Shapefile/KMZ/WMS | No | Drought severity (D0–D4) by county; 1999–present archive | USGS NWIS, NOAA CPC | "Data-Center Cooling Risk" tile | Also available via Google Earth Engine; XYZ tiles at drought.gov for web map integration[^78][^79][^80] |
| **NERC Long-Term Reliability Assessment** | `https://www.nerc.com/globalassets/our-work/assessments/nerc_ltra_2025.pdf` | Free | Full PDF | NERC region / state | Annual (Dec) | PDF | No | 10-year resource adequacy outlook, reserve margin projections, demand forecast including data centers, reliability risks by region | EIA Form 860M, LBNL | "Grid Reliability Risk" tile | 2025 LTRA shows most of North America faces mounting resource adequacy challenges[^81][^82][^83] |
| **WattTime Marginal Emissions (free tier)** | `https://api.watttime.org/v3/` | Freemium | Free tier: signal index only (no absolute MOER values); Paid: full MOER (lbs CO2/MWh) | Balancing authority | 5-minute | JSON | Yes (free registration) | Marginal Operating Emissions Rate index (relative), forecast 24hrs; real lbs CO2/MWh requires paid | EPA eGRID, NREL Cambium | "Green Power Score" tile | Now covers 210 countries; BA-level for full US; free tier limited to ordinal signal not absolute values[^84][^85][^86] |
| **EPA eGRID** | `https://www.epa.gov/egrid` | Free | Full download | eGRID subregion / state / unit | Annual (2-yr lag) | Excel | No | Generation by fuel type, emissions (CO2/NOx/SO2) lbs/MWh by subregion, heat rate, capacity factor | EIA Form 923 | "Carbon Intensity Map" tile | Annual average emissions factors; use WattTime for marginal/real-time |
| **Carbon Monitor / Open Grid Emissions Initiative** | `https://carbonmonitor.org` + `https://github.com/singularity-energy/open-grid-emissions` | Free | Full | BA / state / country | Near-real-time (Carbon Monitor) | CSV/JSON | No | CO2 emissions by sector, grid emissions intensity hourly | EPA eGRID, WattTime | "Emissions Overlay" tile | Open Grid Emissions is academic/research grade; Carbon Monitor is near-real-time |

***

## Section 10: Top 15 Highest-Leverage Sources for National Power-Constrained Markets Overlay

Ranked by data-to-effort ratio for terminal buildout:

1. **LBNL Queued Up Excel** — Project-level queue data from 7 ISOs + 49 utilities; county-level; annual; free. Single file enables national MW-queued heatmap.[^43][^2][^44]
2. **EIA API v2 (hourly RTO demand + retail prices)** — Free, API, covers all 56 balancing authorities; anchors all price and load tiles.[^87][^4]
3. **interconnection.fyi (daily web data + load queue filter)** — Only daily-updated cross-ISO database; load queue filter = data-center demand side; county map free.[^45][^46][^48]
4. **EIA Form 860 bulk download** — Generator-level lat/lon inventory; links to POI substations; foundation for substation-level capacity mapping.[^6]
5. **PUDL** — Free ETL pipeline linking EIA 860/861/923 + FERC Form 1; eliminates months of cleaning work; AWS S3 bucket for bulk access.[^14][^52]
6. **ERCOT GIS Monthly Report** — Substation-level POI data for every TX generation + large-load request; free Excel download; most analysts never use the GIS coordinates.[^23][^24]
7. **PJM Data Miner 2 Queue Excel** — Raw Excel with substation POI; paired with PJM Queue Scope tool for pre-entry screening; no auth required.[^17][^22]
8. **gridstatus Python library** — Unified API across all 7 major ISOs for LMP, load, fuel mix; open source; fastest path to multi-ISO price data.[^38][^39]
9. **CBRE North America Data Center Trends (free PDF)** — Best market-level capacity absorption and pipeline data; semi-annual; registration only.[^54][^55]
10. **Cleanview.co (web map)** — 1,582 DC projects (operating + planned) with MW; best visual pipeline map; API requires upgrade.[^58]
11. **NERC LTRA (annual PDF)** — 10-year reserve margin outlook by region; authoritative grid stress assessment; data-center demand featured prominently since 2023.[^82][^83]
12. **Good Jobs First Subsidy Tracker** — Nearly 3M records; search "data center" for all incentive flows by county; reveals where states are still subsidizing vs. imposing moratoria.[^62][^63]
13. **State Moratorium Tracker (Multistate.us + Datacentertracker.org)** — 300+ bills in 2026 alone; moratoria in NY/SD/OK; critical regulatory risk layer.[^3][^59][^60]
14. **USGS Water Data API (new)** — Free real-time streamflow and groundwater at 10k+ sites; water cooling availability is a secondary but growing constraint especially in Phoenix/Vegas/Reno.[^74][^76]
15. **Novogradac IRA Energy Mapping Tool** — §48E/§45Y energy community bonus credit eligibility by county; +10% ITC bonus drives site selection for renewables paired with DCs.[^65][^66]

***

## Section 11: Unfair-Advantage ISO/RTO Endpoints Most CRE Analysts Ignore

Most commercial real estate professionals looking at data-center site selection use only broker reports (CBRE/JLL). The following four raw data sources provide **genuinely differentiated intelligence** unavailable in any broker publication:

1. **PJM Queue Excel download (Data Miner 2)** — The raw interconnection queue feed at `dataminer2.pjm.com/feed/ivmkt_intstudy_queue` contains the exact Point of Interconnection (POI) substation for every project. When you map these, you can see which substations are "stuffed" (50+ projects pointing to the same POI) vs. which have headroom. No broker report includes this. The new PJM Queue Scope tool (Oct 2025) lets you pre-screen substation impacts without even entering the queue.[^18][^22][^17]

2. **ERCOT Monthly GIS Report with Lat/Lon** — Downloaded from `ercot.com/gridinfo/resource`, the Excel includes `Latitude` and `Longitude` columns for every queued project's POI. Combined with Texas county assessor data-center permit filings (counties: Travis, Williamson, Dallas, Denton, Montgomery, Nueces for Corpus Christi), this creates a **substation stress map of Texas** that is invisible to anyone not looking at the raw file. ERCOT's large load queue — 233 GW as of late 2025, 70%+ from data centers — is documented in the same source.[^25][^24][^88][^23][^1]

3. **FERC EQR Bulk Database** — The FTP bulk download at `ferc.gov/download-database` contains every wholesale power transaction (buyer, seller, price, quantity, control area) filed with FERC. For a CRE terminal, this enables: (a) identifying which utilities are selling large blocks of power to data-center hyperscalers under long-term contracts, (b) spotting utilities under wholesale price pressure due to new large-load customers, and (c) tracing where power is flowing between control areas under congestion. Almost no CRE practitioner uses this.[^10][^11][^12]

4. **MISO GI Queue Interactive Map + GIS Export** — At `giqueue.misoenergy.org/PublicGiQueueMap/index.html`, the MISO map allows filtering by county, fuel type, and study status, with CSV export. With 348 GW potentially queued and 93% zero-carbon resources, MISO's queue reveals which Midwest counties (Indiana, Illinois, Minnesota, Missouri) are emerging as renewable-plus-data-center corridors — particularly important given reshoring industrial load in the Rust Belt.[^27][^28][^29]

***

## Section 12: Gap Analysis — Substation-Level Capacity Data and Cheapest Legitimate Paths

### The Core Problem

The most critical data point for a power-constrained CRE terminal — **exact available MW at a named substation** — does not exist in any free public dataset. Here is why, and what the cheapest legitimate paths are:

**What is gated behind paid walls:** The granularity below what ISO-level LMPs and queue reports provide requires: (a) utility Integrated Resource Plans (IRPs), which contain substation-by-substation capacity expansion schedules, but are filed as PDFs with state utility commissions and not machine-readable; (b) distribution-level interconnection queue data, which FERC has not standardized and which varies by utility (some post CSVs, many publish only PDFs); (c) substation hosting capacity maps, which about 30% of US utilities have published (some as GIS) under FERC Order 2222 and state-level mandates, but in non-standardized formats; and (d) nodal LMP data at the substation level within distribution territories, which requires Velocity Suite (Hitachi Energy, formerly ABB) at approximately $15,000–$40,000/year, S&P Capital IQ Pro Energy (approximately $25,000–$50,000/year), or Yes Energy (similar range).[^89][^90][^91][^92]

**What FERC Form 715 was:** Transmission planning data (power flows, expansion plans, reliability criteria) was once publicly available in FERC Form 715, but was removed from public access in 2001 for national security reasons under Docket PL02-1-000. Access now requires a Critical Energy Infrastructure Information (CEII) request, which takes months and requires demonstrated need.[^15][^93]

**Cheapest legitimate paths to substation-level data:**

1. **State Utility Commission IRP Filings (free, but manual):** Every investor-owned utility files an Integrated Resource Plan with its state PUC every 3–5 years. These contain substation expansion schedules, planned transmission upgrades, and load forecasts by area. The filings are public on state PUC websites (e.g., Virginia SCC, Texas PUC, California PUC/CAISO, Illinois ICC). Manual extraction from the PDF is labor-intensive, but free. Target the IRPs for Dominion Energy (VA/NC), Georgia Power (GA), APS/SRP (AZ), ComEd (IL), and Oncor (TX) for the primary data-center corridors.

2. **Utility Hosting Capacity Maps (patchy but free):** Under FERC Order 2222 and various state mandates, about 30% of US utilities have published hosting capacity maps showing available MW at distribution feeders. Pacific Gas & Electric, Southern California Edison, and Consumers Energy (MI) have relatively mature GIS hosting capacity maps. SEPA (Smart Electric Power Alliance) maintains a tracker of which utilities have published these.

3. **interconnection.fyi Distribution Grid Data (~$2,000–$5,000 one-time):** The `interconnection.fyi/dg` endpoint covers 500,000+ distribution grid interconnection projects across 28 utilities and 16 states, available as a one-time export or monthly subscription. This is the cheapest path to aggregated distribution-level queue data, and is priced at the low end of the market. It does not include direct substation MW availability, but the density of interconnection requests by feeder is a strong proxy.[^94][^95]

4. **PUDL + EIA Form 860 + Utility GIS (free, requires engineering):** EIA Form 860 includes generator-level interconnecting substation names and voltage. By cross-referencing with utility transmission maps (many published as GIS under NERC standards) and FERC Form 1 transmission investment data, a skilled analyst can construct a rough substation-level capacity picture for ~$0 in data costs. This is the path most open-source energy researchers use. PUDL makes this data stack available via an AWS S3 bucket with no download fees.

5. **Velocity Suite / S&P Capital IQ Power (full solution, $15,000–$50,000/year):** For a terminal serving institutional LPs making eight-figure CRE commitments, the cost-benefit of Velocity Suite or S&P Capital IQ Pro Energy is favorable. Velocity Suite provides substation-level asset data, locational marginal prices at every FERC-jurisdictional node, and transmission constraint data. S&P Capital IQ Pro Energy adds deal tracking and project pipeline at the county level. The "unfair advantage" data sources in Section 11 should be fully exploited first; only proceed to these paid products if the free stack leaves critical gaps in the specific geographies targeted by the LP's portfolio.[^90][^91][^89]

***

## Terminal Tile Architecture Summary

For a Tel Aviv principal to instantly see available MW vs. saturated counties vs. 18-month DC pipeline, the following six tiles should appear on the primary screen:

| Tile | Primary Source | Secondary/Verification Source | Refresh Rate |
|---|---|---|---|
| **National MW Queue Heatmap** (county choropleth: queued MW vs. installed capacity) | LBNL Queued Up Excel + EIA Form 860 | interconnection.fyi daily | Annual base, daily overlay |
| **Live Power Price by ISO/BA** ($/MWh spot, retail ¢/kWh) | EIA API v2 (hourly BA) + gridstatus LMP | FERC EQR wholesale | Hourly |
| **Data-Center Pipeline Map** (operating + planned + under construction) | Cleanview.co + interconnection.fyi DC records | CBRE semi-annual PDF | Weekly |
| **Moratorium & Regulatory Risk Layer** (state/county color codes) | Datacentertracker.org + Multistate.us + state PUC filings | PECVA NoVA map | Monthly |
| **Grid Reliability Risk** (NERC LTRA reserve margins by region) | NERC LTRA annual + ERCOT Resource Adequacy monthly | EIA Form 860M new capacity | Annual / quarterly |
| **Incentive & Tax Credit Eligibility** (§48E/§45Y energy community bonus, subsidy tracker) | Novogradac IRA map + Good Jobs First | IRA Tracker (CATF) | Annual (IRS updates) |

All six tiles can be populated entirely with free or self-registration data sources identified in this report. The only material gaps — substation-level MW availability and granular nodal LMP within utility distribution territories — require either manual extraction from state PUC IRP filings (free, slow) or a paid data subscription (Velocity Suite / S&P Cap IQ Power).

---

## References

1. [ERCOT's large load queue jumped almost 300% last year | Utility Dive](https://www.utilitydive.com/news/ercots-large-load-queue-jumped-almost-300-last-year-official/808820/) - The total capacity exploring grid interconnection near the end of 2025 increased almost 300% over th...

2. [Queued Up: 2024 Edition, Characteristics of Power Plants Seeking ...](https://emp.lbl.gov/publications/queued-2024-edition-characteristics) - This annually updated briefing and data file compiles and analyzes interconnection queue data from a...

3. [State Data Center Legislation in 2026 Tackles Energy and Tax Issues](https://www.multistate.us/insider/2026/2/20/state-data-center-legislation-in-2026-tackles-energy-and-tax-issues) - In 2026, more than 300 state data center legislation bills have been filed across 30+ states in just...

4. [Introduction to the EIA API • EIAapi - Rami Krispin](https://ramikrispin.github.io/EIAapi/articles/intro.html) - The EIA data is open and accessible through an Application Programming Interface (API) for free. The...

5. [API Wrapper for U.S. Energy Information Administration (EIA ... - Docs](https://docs.ropensci.org/eia/) - Provides API access to data from the U.S. Energy Information Administration (EIA) . Use of the EIA's...

6. [Annual Electric Power Industry Report, Form EIA-860 detailed data ...](https://www.eia.gov/electricity/data/eia860/) - EIA's free and open data available as API, Excel add-in, bulk files, and widgets ... 2024 data Next ...

7. [U.S. Energy Information Administration dataset 861 for 2023 - Catalog](https://catalog.data.gov/dataset/u-s-electric-utility-companies-and-rates-look-up-by-zipcode-2023/resource/aac15a5d-0f02-4e57-b86d-06d44801d4a1) - The Form EIA-861 and Form EIA-861S (Short Form) data files include information such as peak load, ge...

8. [Annual Electric Power Industry Report, Form EIA-861 detailed data ...](https://www.eia.gov/electricity/data/eia861/) - Description: The data contain revenue, sales, and customer count by sector from utilities that deliv...

9. [Home | data.ferc.gov](https://data.ferc.gov) - An online document database that allows users to search for and access official documents related to...

10. [Download Database - Federal Energy Regulatory Commission](https://www.ferc.gov/download-database) - The Electric Quarterly Report (EQR) database, including data filed by all respondents, is available ...

11. [Reports: Data Inquiries and Tools](https://www.ferc.gov/industries-data/electric/power-sales-and-markets/electric-quarterly-reports-eqr/reports-data) - Download Database. Provides for the download of the full EQR database. It should be used only by adv...

12. [Electric Quarterly Reports (EQR) | Federal Energy Regulatory ...](https://www.ferc.gov/power-sales-and-markets/electric-quarterly-reports-eqr) - November 23, 2020 – FERC Staff has upgraded the EQR Report Viewer to include additional filter optio...

13. [FERC Form 1 Electric Utility Cost, Energy Sales, Peak Demand, and ...](https://data.openei.org/submissions/489) - FERC Form 1 Electric Utility Cost, Energy Sales, Peak Demand, and Customer Count Data 1994-2019. Pub...

14. [The Public Utility Data Liberation (PUDL) Project](https://catalyst.coop/pudl/) - The Public Utility Data Liberation (PUDL) project takes publicly available utility data makes it pub...

15. [Form No. 715 - Annual Transmission Planning and Evaluation Report](https://www.ferc.gov/industries-data/electric/electric-industry-forms/form-no-715-annual-transmission-planning-and-evaluation-repor-data) - The FERC Form No. 715 data is no longer publicly available in accordance with the Commission order i...

16. [Explainer on the Interconnection Final Rule](https://www.ferc.gov/explainer-interconnection-final-rule) - In June 2022, FERC issued a NOPR proposing several changes to existing generator interconnection pro...

17. [GitHub - rzwink/pjm_dataminer: PJM data miner scripts to make ...](https://github.com/rzwink/pjm_dataminer) - Note that while Data Miner 2 will make available any data that has been calculated by PJM Settlement...

18. [Data Miner 2 - PJM.com](https://dataminer2.pjm.com) - Data Miner is PJM's enhanced data management tool, giving members and non-members easier, faster and...

19. [Getting access to Data Miner](https://pjm.my.site.com/publicknowledge/s/article/Getting-access-to-Data-Miner) - Data Miner can be accessed through the user interface (UI) or application program interface (API) fo...

20. [Real-Time Hourly LMPs - Data Miner 2](https://dataminer2.pjm.com/feed/rt_hrl_lmps/definition) - This feed contains hourly Real-Time Energy Market locational marginal pricing (LMP) data for all bus...

21. [How to Find Historical Busbar (Nodal) Prices in U.S. Electricity Markets](https://www.pcienergysolutions.com/2025/05/01/how-to-find-historical-busbar-nodal-prices-in-u-s-electricity-markets/) - The California Independent System Operator (CAISO) offers historical LMP data through its Open Acces...

22. [PJM Launches Public Tool To Assess Potential Impacts of New ...](https://insidelines.pjm.com/pjm-launches-public-tool-to-assess-potential-impacts-of-new-generation-on-the-grid/) - Queue Scope is designed to allow developers to better assess the viability of their potential projec...

23. [ERCOT's Interconnection Queue: How quickly do batteries progress?](https://modoenergy.com/research/en/ercot-battery-energy-storage-interconnection-queue-gis-report-development-timeline-full-interconnection-study-interconnection-agreement) - According to the May 2024 Generation Interconnection Status (GIS) report, more than 149 GW of batter...

24. [Resource Adequacy - ERCOT.com](https://www.ercot.com/gridinfo/resource) - Monthly Generator Interconnection Status Report. View the latest public interconnection information ...

25. [Large Load Integration - ERCOT.com](https://www.ercot.com/services/rq/large-load-integration) - This document contains instructions for submission of documents and other communications related to ...

26. [RT Data API - Midcontinent Independent System Operator (MISO)](https://www.misoenergy.org/markets-and-operations/rtdataapis/) - For your convenience, MISO provides direct access to the source data behind the charts and tables di...

27. [MISO Details Latest Generator Interconnection Queue Cycle Results](https://www.publicpower.org/periodical/article/miso-details-latest-generator-interconnection-queue-cycle-results) - The Midcontinent Independent System Operator's most recent generator interconnection queue's cumulat...

28. [Generator Interconnection Queue](https://www.misoenergy.org/planning/resource-utilization/GI_Queue/) - Interactive map to assist with pre-screening potential POIs. Project Status Tool Filter projects in ...

29. [MISO energy generation queue map available - Facebook](https://www.facebook.com/groups/1440945756997286/posts/1506154737143054/) - They are mapped and assigned a project number, when you click it you'll see its interconnect point, ...

30. [[PDF] Same-time Information System (OASIS) Frequently Asked Questions ...](https://www.caiso.com/documents/oasis-frequently-asked-questions.pdf) - The California ISO provides a Computer Based Training (CBT) overview of OASIS. This. CBT is in our T...

31. [New Tool Now Available on CAISO OASIS Website](https://www.caiso.com/notices/new-tool-now-available-on-caiso-oasis-website) - This new tool is now live on the OASIS webpage, where users can access expanded data capabilities an...

32. [caiso oasis - California ISO](https://oasis.caiso.com) - Self-registration is required to access the site. • To access current data, without using the OASIS ...

33. [m4rz910/NYISOToolkit: Access data, statistics, and ... - GitHub](https://github.com/m4rz910/NYISOToolkit) - A package for accessing power system data ( NYISOData ), generating statistics ( NYISOStat ), and cr...

34. [Energy Market & Operational Data - NYISO](https://www.nyiso.com/energy-market-operational-data) - Our energy markets allow market participants to buy and sell energy and ancillary services at prices...

35. [Web Services Data - ISO New England](https://www.iso-ne.com/participate/support/web-services-data) - ISO customers can apply for automated acquisition of publicly available operational data from the IS...

36. [Part 2 of 3 – The SPP Interconnection Queue](https://ces-ltd.com/part-2-of-3-the-spp-interconnection-queue-understanding-the-landscape-and-what-it-means-for-developers/) - This part will provides a comprehensive guide to SPP's interconnection process: the study mechanics,...

37. [Generator Interconnection - Southwest Power Pool](https://www.spp.org/engineering/generator-interconnection/) - The SPP generator interconnection queue process provides a means for generation planners and develop...

38. [What is the gridstatus library? — gridstatus](https://opensource.gridstatus.io) - This library provides minimally-processed data. If you need production-ready data, consider using ou...

39. [API Reference - gridstatus](https://opensource.gridstatus.io/en/stable/api-reference.html) - Supported Independent System Operators (ISOs): ISO API Clients: Some ISOs provide official APIs that...

40. [Spp — gridstatus](https://opensource.gridstatus.io/en/0.17.0/autoapi/gridstatus/spp/) - Get interconnection queue. get_lmp. Get LMP data. get_load. Returns load for last 24hrs in 5 minute ...

41. [API Usage | Developers - Grid Status Documentation](https://docs.gridstatus.io/developers/api-reference/api-usage) - API Usage. Get Api Usage Endpoint. get. https://api.gridstatus.io/v1/api_usage. Get API usage statis...

42. [Grid Status](https://www.gridstatus.io) - Grid Status is a modern data platform for the energy industry. Energy Traders Make better trading de...

43. [LBNL's 2025 Interconnection Queue Report Now Available - LinkedIn](https://www.linkedin.com/posts/ryanwiser_queued-up-characteristics-of-power-plants-activity-7407150069688209409-Hbm0) - LBNL's "Queued Up: 2025 Edition" report is now available here: https://emp.lbl.gov/queues This repor...

44. [Characteristics of Power Plants Seeking Transmission Interconnection](https://emp.lbl.gov/queues) - Key highlights from the Queued Up: 2025 Edition (featuring data through 2024) include: As of the end...

45. [Latest Interconnection Queue Requests with daily data updates ...](https://www.interconnection.fyi) - Tracking 42,582 interconnection queue requests from 1995 to 2026. What is the interconnection queue?...

46. [2024 Active Generation Interconnection Queue Requests with daily ...](https://www.interconnection.fyi/?year=2024) - Track interconnection queue requests across US ISOs and utilities, with daily data updates. Learn wh...

47. [Latest Load Interconnection Queue Requests with daily data updates](https://www.interconnection.fyi/?type=Load) - Track interconnection queue requests across US ISOs and utilities, with daily data updates. Learn wh...

48. [US Data Center Records Directory - Interconnection.fyi](https://interconnection.fyi/data-center) - Comprehensive database of U.S. data centers from various public records. Track proposed, under const...

49. [State of interconnection queues — January 2024](https://www.interconnection.fyi/blog/state-of-interconnection-jan-2024) - Interconnection.fyi aggregates queue data across all 6 major RTOs/ISOs and 20 utilities in the U.S.....

50. [Exploring Open Energy Data with the Public Utility Data Liberation ...](https://kleinmanenergy.upenn.edu/events/exploring-open-energy-data-with-the-public-utility-data-liberation-project/) - Learn about key energy datasets from FERC, EIA, and EPA and how PUDL helps make these data more acce...

51. [Public Utility Data Liberation Project (PUDL) Data Release - Zenodo](https://zenodo.org/records/17606427) - v2025.11.0 (2025-11-13) This is a quarterly PUDL data release, and includes final 2024 data for a nu...

52. [Public Utility Data Liberation Project - Registry of Open Data on AWS](https://registry.opendata.aws/catalyst-cooperative-pudl/) - Description. The Public Utility Data Liberation Project (PUDL) provides analysis-ready U.S. energy s...

53. [The Public Utility Data Liberation Project (PUDL) - GitHub](https://github.com/catalyst-cooperative/pudl) - The PUDL Project (pronounced puddle) is an open source data processing pipeline that makes US energy...

54. [This Market Tops the Nation for Data Center Absorption](https://www.commercialsearch.com/news/this-market-tops-the-nation-for-data-center-absorption/) - In 2024, CBRE stated that North America doubled the data center supply under construction compared t...

55. [North America Data Center Trends H2 2025 - CBRE](https://www.cbre.com/insights/books/north-america-data-center-trends-h2-2025) - Primary market supply increased by 36% year-over-year to 9,432 megawatts (MW), surpassing the 34% in...

56. [JLL's 2026 Data Center Outlook: AI Workloads, Power Constraints ...](https://www.linkedin.com/posts/data-center-solutions-at-jll_global-data-center-outlook-activity-7412863773641715712-g-O4) - JLL's upcoming 2026 Global Data Center Outlook examines how surging AI workloads, escalating power c...

57. [JLL 2026 Data Center Outlook: 200 GW Capacity by 2030 - LinkedIn](https://www.linkedin.com/posts/farney_jlls-2026-global-data-center-outlook-navigating-activity-7416899200694661120-aSUk) - JLL 2026 Data Center Outlook: 200 GW Capacity by 2030. View profile for Sean Farney. Sean Farney. Vi...

58. [US Data Center Map — Project List & Tracker - Cleanview](https://cleanview.co/data-centers/us) - Interactive map of US data centers with a complete list of planned, under construction, and operatin...

59. [$64 billion of data center projects have been blocked or delayed ...](https://www.datacenterwatch.org/report) - $64 billion in US data center projects have been blocked or delayed by a growing wave of local, bipa...

60. [Tracking American AI Data Center Buildout – Community Response ...](https://datacentertracker.org) - An interactive map and open database tracking community response and legislative action on AI data c...

61. [Existing and Proposed Data Centers - A Web Map](https://www.pecva.org/region/loudoun/existing-and-proposed-data-centers-a-web-map/) - It is our best approximation given the information available and will change as more data centers ar...

62. [Databases - Good Jobs First](https://goodjobsfirst.org/databases/) - Good Jobs First provides a unique set of databases covering two areas: government financial incentiv...

63. [Subsidy Tracker - Good Jobs First](https://subsidytracker.goodjobsfirst.org) - SUBSIDY TRACKER is the first national search engine for economic development subsidies and other for...

64. [Shutting Down Data Center Subsidies - Good Jobs First](https://goodjobsfirst.org/data-center-shutdowns/) - If a community insists on using subsidies to attract data centers, they should require all subsidy c...

65. [Ever.green's IRA Map Updated with 2024 Energy Communities](https://ever.green/insight/2024-energy-community-update) - 45Y and 48E Tax Credit Regulations: Final Rules Released. Read more.. What Buyers Need to Know About...

66. [Energy Mapping Tool | Novogradac](https://www.novoco.com/resource-centers/renewable-energy-tax-credits/inflation-reduction-act-bonus-credits) - This mapping tool is designed to provide users with the means to seeing if an area might be eligible...

67. [§48E and §45Y tech-neutral tax credits: Guide + FAQs - Crux](https://www.cruxclimate.com/insights/tech-neutral-tax-credits) - The tech-neutral clean energy and manufacturing tax credit regime went into effect on January 1, 202...

68. [IRA Section 13702 - Clean Electricity Investment Credit](https://iratracker.org/programs/ira-section-13702-clean-electricity-investment-credit/) - Section 13702 of the IRA inserts a new section 48E into the IRC, establishing a Clean Electricity In...

69. [U.S. clean energy investments: 2025 Quarter 3 analysis](https://www.catf.us/2025/12/us-clean-energy-investments-2025-quarter-3-analysis/) - 48E Technology Neutral Clean Electricity Credit – Investment Tax Credit (ITC) ... OBBBA's PFE/FEOC r...

70. [Annual Technology Baseline - National Laboratory of the Rockies](https://atb.nrel.gov) - The NLR Annual Technology Baseline (ATB) provides a consistent set of technology cost and performanc...

71. [2024 Annual Technology Baseline (ATB) Cost and Performance ...](https://data.openei.org/submissions/6006) - NREL has presented the ATB, consisting of detailed cost and performance data, both current and proje...

72. [Electricity | 2024 | ATB | NLR - Annual Technology Baseline](https://atb.nrel.gov/electricity/2024/technologies) - The 2024 Electricity Annual Technology Baseline (ATB) provides consistent, freely available, technol...

73. [Data | Electricity | 2024 | ATB | NLR - Annual Technology Baseline](https://atb.nrel.gov/electricity/2024/data) - The NREL ATB data are presented in an Excel workbook that contains detailed cost and performance dat...

74. [USGS Water Data APIs](https://api.waterdata.usgs.gov) - This API provides the most recent real-time measurements of streamflow, gage height, and hundreds of...

75. [Water Services Web - USGS.gov](https://waterservices.usgs.gov) - This site provides USGS water data in machine-readable formats via REST APIs, a common framework pro...

76. [Home - USGS Water Data APIs](https://api.waterdata.usgs.gov/ogcapi/v0?f=html) - USGS Water Data OGC APIs. These APIs provide OGC-compliant interfaces to USGS water data, letting yo...

77. [Introduction to New USGS Water Data APIs - GitHub Pages](https://doi-usgs.github.io/dataRetrieval/articles/read_waterdata_functions.html) - As we bid adieu to the NWIS web services, we welcome a host of new web service offering: the USGS Wa...

78. [Drought.gov Data Download (GIS and Web-Ready)](https://www.drought.gov/data-download) - Drought.gov operates an operational version of the Climate Engine API, which is a cloud-based climat...

79. [GIS Data | U.S. Drought Monitor](https://droughtmonitor.unl.edu/DmData/GISData.aspx) - Get GIS data files for each week including shapefiles, kmz, wms and more.

80. [United States Drought Monitor | Earth Engine Data Catalog](https://developers.google.com/earth-engine/datasets/catalog/projects_sat-io_open-datasets_us-drought-monitor) - The US Drought Monitor is a map released every Thursday, showing parts of the US that are in drought...

81. [[PDF] 2024 Long-Term Reliability Assessment](https://www.nerc.com/globalassets/our-work/assessments/2024-ltra_corrected_july_2025.pdf) - This assessment was developed based on data and narrative information NERC collected from the six. R...

82. [[PDF] 2025 Long-Term Reliability Assessment](https://www.nerc.com/globalassets/our-work/assessments/nerc_ltra_2025.pdf) - NERC develops and enforces Reliability Standards; annually assesses seasonal and long-term reliabili...

83. [2024 Long-Term Reliability Assessment - OurEnergyPolicy](https://www.ourenergypolicy.org/resources/2024-long-term-reliability-assessment/) - In the 2024 LTRA, NERC finds that most of the North American BPS faces mounting resource adequacy ch...

84. [WattTime expands marginal emissions dataset globally to cover ...](https://watttime.org/news-and-insights/watttime-expands-marginal-emissions-dataset-globally-to-cover-nearly-100-of-worlds-electricity-consumption/) - WattTime has announced the completion of the first-ever hourly electricity marginal emissions datase...

85. [[PDF] Protocols, rates, factors, attribution, accounting, oh my! A survey of ...](https://www.aceee.org/sites/default/files/pdfs/ssi23/3-127-PHILLIPS.pdf) - In plain language, WattTime's impact accounting proposal uses marginal emissions “rates to determine...

86. [SIGNAL: Marginal CO2 - WattTime](https://watttime.org/data-science/data-signals/marginal-co2/) - To help people understand the emissions caused by when they use electricity and to help them cause f...

87. [EIA API in Python: Automatic download of US energy data](https://datons.com/en/blog/eia-api-automating-us-energy-data-with-python) - Understand the structure of the EIA API and learn how to use it with Python to automate the download...

88. [ERCOT's Interconnection Queue: How quickly do batteries progress?](https://www.youtube.com/watch?v=hwCKe_vZ1PM) - ... (GIS) report, more than 149 GW of battery energy storage is in the ERCOT Interconnection queue. ...

89. [[PDF] Velocity Suite Power Prices API](https://vsservices.velocitysuiteonline.com/registrationservice/getdocument.aspx?key=3FAF284BABCEDDD569BC9278D11E0DF7) - Velocity Suite Power Prices provides (via API) immediate access to validated energy market data. You...

90. [Energy Market Insights Software Solution](https://www.hitachienergy.com/products-and-solutions/energy-portfolio-management/energy-analytics-software-solutions/energy-market-insights-software-solution) - Currently known as Velocity Suite, our Energy Market Insights software delivers trusted, comprehensi...

91. [S&P Capital IQ Pro - Global Energy Service](https://www.spglobal.com/market-intelligence/en/solutions/products/resources/capital-iq-pro-energy) - Track energy development, generation capacity, and project pipelines with our in-depth power plant a...

92. [Marketplace | FERC EQR Dataset - Yes Energy](https://www.yesenergy.com/ferc-eqr-dataset) - FERC Electric Quarterly Reporting (EQR) data tracks all physical contracts and transactions in whole...

93. [Form No. 715 - Annual Transmission Planning and Evaluation Report](https://ferc.gov/industries-data/electric/electric-industry-forms/form-no-715-annual-transmission-planning-and-evaluation-report-filing-instructions) - Filings must be submitted to the Commission on or before Wednesday, April 1st 2026. The FERC eFiling...

94. [Distribution Grid (DG) Interconnection Data](https://www.interconnection.fyi/dg) - Our distribution grid (DG) interconnection data covers over 500,000 projects across 28 utilities and...

95. [Purchase the full Interconnection.fyi data set - Distribution Queue Data](https://www.interconnection.fyi/dg/purchase-data) - Purchase the full data of over 500,000 distribution grid & distributed generation projects across 28...

