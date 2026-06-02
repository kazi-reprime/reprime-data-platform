# Industrial & Logistics CRE Demand-Signal Intelligence Layer: Free Endpoint-Grade Data Sources

> **Purpose:** Complete reference for building a US industrial-CRE intelligence terminal. Every row is an actionable, free (or no-key) endpoint verified as of May 2026. Organized by the signal category it feeds in the dashboard layer.

***

## Category 1 — Ports: Container Volume (Monthly TEU)

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **Port of LA** | `https://portoflosangeles.org/business/statistics/container-statistics` + bulk CSV via data.gov: `http://catalog.data.gov/dataset/port-of-los-angeles-historical-teu-statistics` | HTML table + CSV/JSON/XML on Data.gov | None | Monthly; released ~15th of following month[^1] | Port of LA (Pier/terminal breakout) | No | Monthly TEU trend tile; YoY delta sparkline |
| **Port of Long Beach** | `https://polb.com/trade-technology/trade-statistics/` | HTML with downloadable XLS | None | Monthly; released ~mid-following month[^2] | Port of Long Beach | No | Monthly TEU tile |
| **Port of NY/NJ** | `https://www.panynj.gov/port/en/our-port/facts-and-figures.html` | HTML table (loads/empties by month)[^3] | None | Monthly; 2–3 week lag | Port of NY/NJ | No | East Coast TEU tile |
| **Port of Savannah (Georgia Ports Authority)** | `https://gaports.com/sales/by-the-numbers/` | Interactive charts + downloadable data[^4] | None | Monthly; ~2-week lag | Savannah (also Brunswick) | No | Southeast TEU tile; YoY chart |
| **Port of Houston** | `https://porthouston.com/about/our-port/statistics/` | Monthly stats overview PDF/press release[^5] | None | Monthly; ~3-week lag (press release) | Barbours Cut + Bayport terminals | No | Gulf Coast TEU tile |
| **Port of Virginia** | `https://www.portofvirginia.com/who-we-are/our-port/data-analytics/` | Web dashboard; CSV via BTS TEU feed[^6] | None | Monthly | Norfolk/Portsmouth/Newport News | No | Mid-Atlantic TEU tile |
| **Northwest Seaport Alliance (Seattle/Tacoma)** | `https://www.nwseaportalliance.com/about-us/cargo-statistics` | Monthly reports + annual trade PDF[^7] | None | Monthly; weekly volumes & metrics report also available at `/cargo-operations/weekly-nwsa-volumes-metrics-report`[^8] | Tacoma + Seattle combined | No | Pacific Northwest TEU tile; weekly volume widget |
| **Port of Oakland** | `https://www.oaklandseaport.com/business/facts-and-figures/` | Downloadable Excel spreadsheets[^9] | None | Monthly | Oakland | No | Bay Area TEU tile |
| **Port of Charleston (SC Ports)** | `https://scspa.com/about-the-port/statistics/` | Multiple downloads: TEU 13-month history, calendar YTD, historical monthly rail/pier/TEU[^10] | None | Monthly | Charleston + Greer inland port | No | SE Atlantic TEU tile |
| **Port of Miami** | `https://www.portmiami.biz/about-portmiami/statistics/` (annual PDF via Miami-Dade[^11]) | PDF statistics | None | Annual (preliminary/fiscal year) | PortMiami | No | South Florida cargo tile |
| **Port Everglades** | `https://www.porteverglades.net/about-us/statistics/cargo-statistics/` | HTML tables; Census Bureau trade data via World City widget[^12] | None | Monthly trade data; annual TEU totals | Fort Lauderdale | No | South Florida TEU tile |
| **BTS Port Performance (all top-25 ports unified)** | `https://www.bts.gov/ports` — Monthly TEU by port downloadable from data portal[^13] | CSV/API (data.transportation.gov) | None | Annual report + monthly dashboard updates[^14] | Top 25 US container ports | No | Multi-port comparison map layer |
| **BTS Monthly TEU Data (unified feed)** | `https://data.bts.gov/Maritime-and-Waterways/Monthly-TEU-Data/rd72-aq8r` — CSV: `https://data.transportation.gov/api/views/rd72-aq8r/rows.csv?accessType=DOWNLOAD`[^15] | CSV (Socrata API) | None | Updated monthly | Port-level, national | No | Unified port volume time-series |
| **FMC Containerized Freight Statistics** | `https://www.fmc.gov/databases-and-publications/containerized-freight-statistics/` | Quarterly report (carrier-by-carrier, per port call)[^16] | None | Quarterly; ~60-day lag | All US ports by carrier | No | Carrier concentration heatmap |

***

## Category 2 — US Census Foreign Trade Statistics

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **Census International Trade — Port-level API** | Imports: `https://api.census.gov/data/timeseries/intltrade/imports/porths` Exports: `https://api.census.gov/data/timeseries/intltrade/exports/porths`[^17][^18] | JSON REST API | Free API key (census.gov) | Monthly; ~5-week lag | Port + HS code + trading partner | No | Commodity-type import flow by port; map overlay |
| **Census International Trade — NAICS by State** | `https://api.census.gov/data/timeseries/intltrade/exports/statenaics` (imports: `/statenaics`)[^17] | JSON API | Free API key | Monthly | State + NAICS sector | No | State-level trade flow tile |
| **USA Trade Online (portal)** | `https://www.census.gov/foreign-trade/` — data portal at usatrade.census.gov[^19][^20] | Web explorer + CSV download | Free registration | Monthly 2003–present; port data available | Port-level and metro area | No | Trade gateway map pin (value + weight) |

***

## Category 3 — Trucking & Rail Freight

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **ATA Truck Tonnage Index** | `https://www.trucking.org/economics-and-industry-data` — press releases at `/news-insights/ata-truck-tonnage-index-*`[^21][^22] | PDF press release (index value) | None (press release); raw data behind member paywall | Monthly; released ~3rd week of following month[^23] | National (for-hire motor carrier) | No | National freight demand gauge; leading indicator tile |
| **Cass Freight Index (Shipments + Expenditures)** | `https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/cass-freight-index`[^24] | Web page + downloadable monthly PDF report[^25] | None (free registration for PDF) | Monthly; 3–4 week lag[^26] | North America (all modes) | No | Freight volume + rate dual-axis tile |
| **Cass Truckload Linehaul Index** | `https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/truckload-linehaul-index`[^27] | PDF report | None | Monthly | National truckload | No | Per-mile rate trend tile |
| **BTS Transportation Services Index (TSI)** | `https://data.bts.gov/Research-and-Statistics/Transportation-Services-Index-and-Seasonally-Adjus/bw6n-ddqk`[^28] — CSV/JSON/XLS download | CSV, JSON, XLS | None (Socrata open data)[^29] | Monthly; ~6-week lag[^30] | National (freight + passenger sub-indices) | No | Multi-modal freight activity index tile |
| **AAR Weekly Rail Traffic (Carloads + Intermodal)** | `https://www.aar.org/data-center/`[^31] | HTML press release + Excel attachment | None | Weekly; released Tuesday for prior week[^32][^33] | National + regional (5 regions) + by commodity group | No | Rail intermodal weekly pulse tile; commodity carload sparklines |
| **BTS Freight Rail Carloads (Data.gov)** | `https://catalog.data.gov/dataset/freight-rail-traffic-carloads`[^34] | CSV | None | Monthly/weekly (AAR sourced) | National | No | Rail carload trend tile |
| **ATRI Top 100 Truck Bottlenecks** | `https://truckingresearch.org/` — annual report PDF[^35][^36] | PDF (annual) | None | Annual; released February[^37] | 325 freight-critical US highway locations | No | Freight congestion risk map layer (pin by bottleneck rank) |

***

## Category 4 — Air & Parcel

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **FAA All-Cargo Airport Data (ACAIS)** | `https://www.faa.gov/airports/planning_capacity/passenger_allcargo_stats/passenger`[^38] | Excel download (annual; preliminary June, final August)[^38] | None | Annual; CY preliminary in June +6 months, final in August[^39] | Individual US airports (all-cargo tonnage) | No | Air cargo gateway map pin; airport tonnage bar chart |
| **BTS T-100 Air Carrier Freight (transtats)** | `https://www.transtats.bts.gov/data_elements.aspx`[^40] | CSV via web form | None | Monthly; ~3–4 month lag | Airport-pair level (domestic + international) | No | Air freight O&D flow tile |
| **DOT International Air Freight Statistics** | `https://www.transportation.gov/policy/aviation-policy/us-international-air-passenger-and-freight-statistics-report`[^41] | Quarterly PDF + raw CSV via DOT portal | None | Quarterly; 2-quarter lag[^41] | International routes by US airport | No | Import/export air cargo tile |
| **USPS Revenue, Pieces & Weight (RPW) Report** | `https://about.usps.com/` — quarterly via SEC-style 10-Q + RPW quarterly at usps.com/stratplan | PDF | None | Quarterly (fiscal quarters); ~4-week lag[^42] | National (product-level: shipping & packages segment) | No | Parcel volume quarterly trend tile |
| **PRC Preliminary Monthly Financial Report** | `https://prc.gov/state-of-the-postal-service`[^43] | PDF (monthly preliminary) | None | Monthly; ~end of following month | National | No | USPS parcel revenue tile (occupancy proxy for last-mile) |

***

## Category 5 — Industrial REIT Quarterly Supplementals (SEC EDGAR)

**EDGAR full-text search:** `https://efts.sec.gov/LATEST/search-index?q=%22supplemental%22&dateRange=custom&startdt=YYYY-01-01&forms=10-Q`[^44]

**EDGAR 10-Q pattern per ticker:** `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=[TICKER]&type=10-Q&dateb=&owner=include&count=10`

| REIT | Ticker | IR Supplemental URL | SEC EDGAR CIK | Key Metrics in Supplement |
|------|--------|---------------------|---------------|--------------------------|
| **Prologis** | PLD | `https://ir.prologis.com/financials/quarterly-results`[^45] | 1045609 | Occupancy %, net effective rent change, development starts, customer concentration by submarket |
| **Rexford Industrial** | REXR | `https://ir.rexfordindustrial.com/financial-info/sec-filings`[^46] | 1571514 | SoCal infill occupancy, same-property NOI, lease spreads |
| **EastGroup Properties** | EGP | `https://investor.eastgroup.net/quarterly-results`[^47] | 49600 | Sun Belt occupancy by market, development pipeline, rent growth |
| **Terreno Realty** | TRNO | `https://investors.terreno.com/financial-information/sec-filings/default.aspx`[^48] | 1476150 | Coastal infill occupancy, lease renewals, same-property cash NOI |
| **First Industrial** | FR | `https://ir.firstindustrial.com/financial-information/sec-filings` | 921825 | 15-market breakdown, rent spreads, leasing volume by MSA |
| **STAG Industrial** | STAG | `https://ir.stagindustrial.com/sec-filings/docs/default.aspx`[^49] | 1479094 | Single-tenant industrial, diversified-geography occupancy, acquisitions pipeline |
| **Americold** | COLD | `https://ir.americold.com/financials/quarterly-results/default.aspx`[^50] | 1455863 | Temperature-controlled warehouse occupancy, same-warehouse NOI, economic occupancy vs. physical |
| **Lineage** | LINE | `https://ir.lineagelogistics.com/` | (IPO 2024) | Cold storage throughput, pallet positions, customer retention |

> All quarterly supplemental PDFs are filed as exhibit 99.1 or ex-99.2 alongside 10-Q filings on EDGAR within 1–5 business days of earnings. Lag is ~45 days after quarter-end.[^44]

***

## Category 6 — Industrial Market Research (Brokers & NAIOP)

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **NAIOP Industrial Space Demand Forecast** | `https://www.naiop.org/research-and-publications/space-demand-forecasts/industrial-space-demand-forecast/`[^51] — direct PDF: `https://www.naiop.org/research-and-publications/research-reports/reports/industrial-space-demand-forecast-first-quarter-2026/`[^52] | Free PDF | None (free registration) | Quarterly; released ~6 weeks after quarter-end[^53][^52] | National net absorption forecast (quarterly) | No | Net absorption forecast tile; 6-quarter projection chart |
| **CBRE US Industrial Figures** | `https://www.cbre.com/insights/figures/q1-2026-us-industrial-and-logistics-figures`[^54] | Free PDF + web article | None | Quarterly; ~3 weeks after quarter-end | National + top ~60 US markets | No | Vacancy rate tile, net absorption chart, asking rent trend |
| **JLL US Industrial Market Dynamics** | `https://www.jll.com/en-us/insights/market-dynamics/industrial-market-statistics-trends`[^55] | Free PDF | None | Quarterly | National + major metros | No | Leasing velocity tile, supply pipeline map |
| **Cushman & Wakefield Industrial Snapshot** | `https://www.cushmanwakefield.com/en/united-states/insights` (search "Industrial Marketbeat") | Free PDF | None | Quarterly | National + 40+ US markets | No | Availability rate tile; rent growth heatmap |

***

## Category 7 — Corporate Footprint

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **MWPVL Amazon Fulfillment Network** | `https://www.mwpvl.com/html/amazon_com.html` (tracker)[^56] + maps at `https://www.mwpvl.com/html/amazon_maps.html`[^57] | Web table + interactive map | None | Updated continuously (every few weeks)[^58] | All US Amazon FC, SC, DS, IXD, Air facilities (~600+ sites)[^58] | Yes (address-level) | Amazon footprint map layer; new facility announcement feed |
| **Supply Chain Dive / FreightWaves Amazon Tracker** | `https://www.supplychaindive.com/` (search "Amazon warehouse")[^59] | News articles | None | Ongoing | US (announced openings/closings) | Yes | Deal announcement feed tile |
| **FedEx Facility Finder (public)** | `https://www.fedex.com/en-us/home.html` → location finder | Web | None | Near-real-time | All FedEx US hubs and stations | No | Carrier hub map layer |
| **UPS Facility Locator** | `https://www.ups.com/us/en/support/shipping-support/tracking-support/warehouse-locator.page` | Web | None | Near-real-time | All UPS US facilities | No | Carrier hub map layer |
| **Walmart Distribution Centers (public list)** | Walmart Corporate site → Distribution Centers; proxy: Open Street Map or `https://corporate.walmart.com/` | Web/OSM | None | Annual update in press releases | ~150+ US distribution/fulfillment centers | No | Retailer DC map pin |
| **GSA Inventory of Owned & Leased Properties (IOLP)** | `https://catalog.data.gov/dataset/inventory-of-owned-and-leased-properties-iolp`[^60]; map tool at `https://www.gsa.gov/tools-overview/buildings-and-real-estate-tools/inventory-of-gsa-owned-and-leased-properties`[^61] | CSV download (Data.gov) | None | Updated monthly after 1st of month[^62]; last major update March 2024[^60] | 8,600+ leased + 1,500 owned federal buildings[^61] | Yes (address-level) | Federal lease expiration risk map; industrial adjacent demand signal |
| **Site Selection / Area Development / Business Facilities** | `https://siteselection.com/` (RSS feed available); `https://www.areadevelopment.com/`; `https://businessfacilities.com/` | RSS / Web | None | Weekly/ongoing | National corporate location announcements | Sometimes | New facility announcement feed (industrial demand leading indicator) |

***

## Category 8 — Data Center Market

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **Data Center Map** | `https://www.datacentermap.com/datacenters/`[^63] | Web database (11,441 facilities); no bulk API — scrape or use filtered search[^64] | None (free browse) | Ongoing community-updated | Global; US filter available | Yes (address-level) | Data center density map layer |
| **datacente.rs World Map** | `https://map.datacente.rs`[^65] | Free account for database access | Free registration | Ongoing | Global | Yes (MW capacity shown) | Power-weighted data center heatmap |
| **EIA Form 860M (Monthly Generator Inventory)** | `https://www.eia.gov/electricity/data/eia860m/`[^66] | Excel (monthly) | None | Monthly; 2-month lag[^66] | Plant-level (lat/lon, MW capacity, status) | Yes (generator/plant-level) | New large load additions map (data center proxy) |
| **EIA Form 860 (Annual Generator Report)** | `https://www.eia.gov/electricity/data/eia860/`[^67] | Excel/ZIP | None | Annual; released September following year | Plant-level nationally | Yes | Annual generation capacity snapshot by county |
| **EIA Form 923 (Monthly Generation + Fuel)** | `https://www.eia.gov/electricity/data/eia923/`[^68] | Excel/ZIP | None | Monthly; 2-month lag | Plant-level | Yes | Power consumption by facility tile |
| **FERC Form 1 Historical (Electric Utilities)** | `https://www.ferc.gov/general-information-0/electric-industry-forms/form-1-1-f-3-q-electric-historical-vfp-data`[^69] | XBRL/VFP database (2047 MB)[^70] | None | Annual (calendar year); filed April 30[^71] | Utility service territory | No | Utility-level load + revenue by state |
| **PJM Data Miner 2** | `https://dataminer2.pjm.com`[^72] — real-time LMPs: `/feed/rt_hrl_lmps/definition`[^73] | REST API (JSON/CSV) | Free PJM account[^74] | Real-time (hourly LMPs) to historical | PJM footprint (13-state Mid-Atlantic/Midwest) | No | Grid load tile; LMP price map (data center power cost proxy) |
| **ERCOT Public API** | `https://www.ercot.com/services/mdt/data-portal`[^75] | RESTful API (OpenAPI/JSON) | None (public API)[^75] | Real-time to historical | ERCOT (Texas deregulated grid) | No | Texas grid load tile; LMP tile |
| **CAISO OASIS** | `https://oasis.caiso.com`[^76] | XML/CSV via OASIS interface; self-registration required | Free registration[^76] | Real-time + historical | California ISO | No | California grid load tile |
| **NYISO Energy Market Data** | `https://www.nyiso.com/energy-market-operational-data`[^77] | CSV/XML (day-ahead + real-time) | None | Real-time + historical | New York ISO | No | NY grid LMP tile |
| **ISO-NE Web Services** | Base URL: `https://webservices.iso-ne.com/api/v1.1`[^78] | REST (XML/JSON) | Requires ISO-NE web services registration[^78] | Real-time + historical | New England 6-state ISO | No | NE grid load tile |
| **MISO RT Data API** | `https://www.misoenergy.org/markets-and-operations/rtdataapis/`[^79] | JSON only (post-Dec 2025)[^79] | None | Real-time | Midwest ISO (15 states) | No | Midwest grid load tile |
| **Uptime Institute Global Data Center Survey** | `https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf`[^80] — landing: `https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025`[^81] | Free PDF (form fill) | Free registration | Annual; released July[^82] | Global / US breakdown | No | Data center resilience + PUE benchmark tile |
| **JLL Data Center Outlook (Global + North America)** | `https://www.jll.com/en-us/insights/market-outlook/data-center-outlook`[^83]; NA year-end: `https://www.jll.com/en-us/insights/market-dynamics/north-america-data-centers`[^84] | Free PDF (form fill) | Free registration | Annual (year-end) + quarterly updates | Global + top 10 North American markets | No | Vacancy rate + pipeline tile; MW under construction chart |
| **FCC Broadband Data Collection (BDC) Map** | `https://broadbandmap.fcc.gov/` — Data Download Portal; base API: `https://broadbandmap.fcc.gov/api/public/map/listAsOfDates`[^85][^86] | GeoJSON/Shapefile (by state + technology) | Free registration[^85] | Biannual (June + December as-of dates); ~6-month publication lag[^87] | Block-level nationally | No | Fiber/connectivity map layer for site selection (data center and warehouse) |

***

## Category 9 — Electricity & Energy Commodities

| Source | Exact URL | Format | Auth | Cadence & Lag | Geography | Property-Level | Dashboard Tile |
|--------|-----------|--------|------|---------------|-----------|----------------|----------------|
| **EIA Electricity Monthly (Commercial + Industrial Sales by State)** | `https://www.eia.gov/electricity/monthly/update/end-use.php`[^88] — underlying Form EIA-861 annual data: `https://www.eia.gov/electricity/data/eia861/`[^89] | Web + Excel | Free API key (api.eia.gov) | Monthly (Electricity Monthly Update); annual Form 861 for full state/sector breakdown[^88] | State-level (commercial, industrial, residential, transportation sectors) | No | Commercial electricity sales index (occupancy proxy); industrial demand tile |
| **EIA API — Electricity Sales** | `https://api.eia.gov/v2/electricity/retail-sales/data/` | JSON REST API | Free API key (eia.gov/api) | Monthly | State + sector | No | State commercial kWh tile; time-series for demand-signal model |
| **EIA — Henry Hub Natural Gas Spot Price** | EIA API series: `NG.RNGWHHD.D` (daily); via `https://www.eia.gov/dnav/ng/ng_pri_fut_s1_d.htm`[^90] | JSON API / XLS | Free API key | Weekly/daily | National benchmark | No | Energy cost tile (warehouse HVAC, refrigeration) |
| **EIA — WTI Crude & No. 2 Diesel Fuel** | EIA API: `PET.EER_EPD2DXL0_PF4_RGC_DPG.W` (diesel weekly); EIA API portal: `https://api.eia.gov/`[^90] | JSON API | Free API key | Weekly (diesel every Monday) | National (diesel by region) | No | Trucking cost input tile; diesel fuel gauge |
| **AISI Weekly Raw Steel Production** | `https://www.steel.org/industry-data/`[^91] | Web (weekly release) + press releases | None | Weekly; released Friday for week ending Saturday[^92] | National + 5 regions (NE, Great Lakes, Midwest, South, West) | No | Industrial materials demand tile; steel capex proxy |

***

## Priority Analysis

### Top 10 Highest-Leverage Feeds for an Industrial-CRE Dashboard

These are ranked by combination of freshness, geographic granularity, direct demand-signal relevance, and free/API accessibility:

1. **BTS Monthly TEU Data (unified CSV)** — single endpoint for all top US container ports, API-ready, monthly[^15]
2. **Census Port-HS Import API** — commodity-type breakout by port reveals what category of goods is moving (electronics → last-mile, chemicals → industrial)[^17][^18]
3. **AAR Weekly Rail Traffic** — weekly intermodal is the fastest-updating proxy for goods-in-transit; carloads flag industrial production[^31]
4. **ATA Truck Tonnage Index** — the canonical for-hire freight volume signal; direct input to BTS TSI[^23][^21]
5. **Prologis/EastGroup Quarterly Supplementals (EDGAR)** — submarket-level occupancy and net effective rent are the actual property market outcomes[^45][^47]
6. **NAIOP Industrial Space Demand Forecast** — quarterly net absorption with 6-quarter forward projection; the broker-consensus benchmark[^52][^51]
7. **CBRE Q-Series Industrial Figures** — 60-market vacancy + asking rent; updated within 3 weeks of quarter-end[^54]
8. **EIA Electricity Monthly (Commercial kWh by State)** — commercial electricity consumption is the best available continuous occupancy proxy; data center buildout visible in Virginia, Texas, Georgia spikes[^88][^93]
9. **EIA Form 860M (Monthly Generator Inventory)** — new large-load interconnection requests identify data center site selection 12–24 months in advance[^66]
10. **MWPVL Amazon Network Tracker** — Amazon's network churn (opens, closings, expansions) is the single most powerful last-mile demand signal in the US[^56][^57]

***

### Compositing a Near-Real-Time "Goods Flowing Through America" Ticker

Combining the following six feeds creates a composite index updated weekly or better, capable of flagging demand inflections before quarterly CRE data confirms them:

- **AAR Weekly Intermodal Units** (Tuesday release, 1-week lag) — goods in transit, coast-to-coast
- **BTS/Port of LA + POLB daily/weekly vessel tracking** (Port Optimizer at `https://volumes.portoptimizer.com`) — container queue visible 10–14 days before TEU statistics publish[^94]
- **ATA Truck Tonnage** (monthly, ~3-week lag) — last-mile delivery and regional distribution
- **Cass Freight Shipments Index** (monthly, ~4-week lag) — all-mode, all-commodity North American volume
- **ERCOT + PJM hourly load data** (real-time) — industrial electricity draw as a proxy for warehousing/manufacturing throughput
- **AISI Weekly Steel Production** (weekly, 1-week lag) — upstream input that leads finished goods manufacturing by 4–8 weeks

Layered in a weighted composite (suggest 30% intermodal/TEU, 25% truck tonnage, 20% Cass shipments, 15% electricity, 10% steel), this produces a leading-indicator ticker with sub-monthly resolution that leads industrial CRE absorption data by roughly one quarter.[^26][^23][^31]

***

### Cheapest Paid Upgrade When Free Sources Fall Short

The most impactful single paid upgrade is **Descartes Datamyne** (formerly PIERS), which provides US Customs import manifest data at the shipment level — bill of lading, shipper name, consignee, commodity, weight, and port — updated weekly. At roughly $500–$3,000/month depending on tier, it unlocks consignee-to-building matching (identifying exactly which warehouse is receiving which cargo, by address), enabling true property-level demand signals rather than port aggregates. A step-up alternative is **CoStar Industrial** (starting ~$12,000/year for a market seat), which adds proprietary submarket-level vacancy, availability, and asking rent time-series at the property level that CBRE/JLL free PDFs only summarize nationally. For port-specific real-time data, **S&P Global Commodity Insights** (formerly Platts) or **Kpler** both offer vessel-tracking-to-port-call data at sub-daily granularity with commodity classification, which eliminates the 2–3-week TEU publication lag entirely. If energy consumption is the priority signal for data center site selection, **Wood Mackenzie Power & Renewables** provides forward capacity queue data by ISO that directly maps to 18–24-month industrial development pipeline by submarket.

---

## References

1. [Container Statistics | Port of Los Angeles](https://portoflosangeles.org/business/statistics/container-statistics) - The table below shows container counts (TEUs) for the latest recorded month. Statistics for the prio...

2. [Port of Long Beach sees cargo decline for May](https://pacificports.org/port-of-long-beach-sees-cargo-decline-for-may/) - The Port has moved 4,042,228 TEUs during the first five months of 2025, up 17.2% from the same perio...

3. [Facts and Figures Information | Port Authority of New York and New ...](https://www.panynj.gov/port/en/our-port/facts-and-figures.html) - Monthly Cargo Volumes ; Loads, Empties ; 2026, 372,973, 2,393 ; 2025, 378,632, 1,658 ; % Change, -1....

4. [By the Numbers - Georgia Ports Authority](https://gaports.com/sales/by-the-numbers/) - ... numbers. Port of Savannah TEU Throughput by Month (through April 2026). Monthly TEU Throughput. ...

5. [Port Statistics - Port Houston](https://porthouston.com/about/our-port/statistics/) - Monthly Statistics Overview · Container Volume by Trade Statistics (annual) · Container Volume by Tr...

6. [Port Sets New Monthly Cargo Volume Record in May as it ...](https://www.portofvirginia.com/who-we-are/newsroom/port-sets-new-monthly-cargo-volume-record-in-may-as-it-processes-more-than-340000-teus/) - The combined volume of March, April and May is more than 978,000 TEUs, resulting in the busiest thre...

7. [Cargo Statistics | The Northwest Seaport Alliance](https://www.nwseaportalliance.com/about-us/cargo-statistics) - On this page, you can find monthly and historical cargo by business sector. In-depth statistics for ...

8. [Weekly NWSA Volumes & Metrics Report](https://www.nwseaportalliance.com/cargo-operations/weekly-nwsa-volumes-metrics-report) - Due to the Holidays - the Weekly Metrics Report will be paused until the new year. If you have quest...

9. [Is Oakland Port's traffic of Freight Carriers down? - Reddit](https://www.reddit.com/r/oakland/comments/1kb81b6/is_oakland_ports_traffic_of_freight_carriers_down/) - Port of Oakland publishes these details on their website, with detailed spreadsheets available for d...

10. [Statistics - SC Ports Authority](https://scspa.com/about-the-port/statistics/) - Statistics · TEU History with Totals - Calendar Year to Date · TEU 13 Month History Chart - Most Cur...

11. [[PDF] Overall Statistics 2024 - Miami-Dade County](https://www.miamidade.gov/resources-port/documents/portmiami-main-overall-statistics.pdf) - The -50/-52 foot water draft handles 15,000 TEU vessels. eRTG Cranes. PortMiami has 18 eRTGs that ca...

12. [Cargo Statistics - Port Everglades](https://www.porteverglades.net/about-us/statistics/cargo-statistics/) - Florida Ports Refrigerated TEU Moves (FY2024) ; Port Everglades. 126,392 ; Jacksonville. 111,187 ; M...

13. [Port Performance Freight Statistics Program](https://www.bts.gov/ports) - Monthly TEUs by Port - Provides the number of TEUs by traffic direction and full/empty status for th...

14. [Port Performance Freight Statistics Program Technical Documentation](https://www.bts.gov/PPFS-Tech-Docs) - A TEU is a measure of container cargo volume and the capacity of container ships, with each unit nom...

15. [Monthly TEU Data - BTS Data Inventory](https://data.bts.gov/Maritime-and-Waterways/Monthly-TEU-Data/rd72-aq8r) - ... Port of Virginia, http://www.portofvirginia.com/; and Savannah, https://gaports.com/. About this...

16. [Containerized Freight Statistics - Federal Maritime Commission](https://www.fmc.gov/databases-and-publications/containerized-freight-statistics/) - The total import and export cargo tonnage and the total number of containers loaded or discharged pe...

17. [[PDF] International Trade Data API User Guide](https://www.census.gov/foreign-trade/reference/guides/Guide_to_International_Trade_Datasets.pdf) - This user guide explains how to access the Monthly International Trade Datasets and their associated...

18. [Census Data API: /data/timeseries/intltrade/exports/porths](https://api.census.gov/data/timeseries/intltrade/exports/porths.html) - The Port HS endpoint in the Census data API also provides value, shipping weight, and method of tran...

19. [International Trade Landing Page - Census Bureau](https://www.census.gov/foreign-trade/) - Visit the Census Bureau's Data Gem on USA Trade Online, to learn how to use this dynamic data tool t...

20. [International Trade Data Main Page - Census Bureau](https://www.census.gov/foreign-trade/data/) - Port data is available monthly through USA Trade Online 2003-present, the International Trade API 20...

21. [Economics and Industry Data | American Trucking Associations](https://www.trucking.org/economics-and-industry-data) - Tonnage: In 2024, the nation's domestic truck tonnage shipped was estimated at 11.27 billion tons of...

22. [ATA Truck Tonnage Index Increased 2.4% in May](https://www.trucking.org/news-insights/ata-truck-tonnage-index-increased-24-may) - American Trucking Associations' advanced seasonally adjusted (SA) For-Hire Truck Tonnage Index rose ...

23. [Truck Tonnage Used in the Transportation Services Index](https://www.bts.gov/learn-about-bts-and-our-work/statistical-methods-and-policies/truck-tonnage) - The Transportation Services Index (TSI) uses the Monthly Truck Tonnage Report (MTTR), issued by the ...

24. [The Cass Freight Index: A Measure of North American Freight Activity](https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/cass-freight-index) - The Cass Freight Index is a measure of monthly freight activity, widely used by analysts and economi...

25. [Cass Transportation Index Report | November 2025](https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/november-2025) - The monthly report provides monthly, quarterly, and annual predictions for over forty data series ov...

26. [What is the Cass Freight Index - Shipments? - ACT Research](https://www.actresearch.net/resources/knowledge-center/what-is-cass-freight-index-shipments) - The Cass Freight Index® measures overall North American freight volumes and expenditures on a monthl...

27. [Cass Truckload Linehaul Index](https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/truckload-linehaul-index) - The Cass Truckload Linehaul Index is a monthly measure of market fluctuations in per-mile truckload ...

28. [Transportation Services Index and Seasonally-Adjusted ...](https://data.bts.gov/Research-and-Statistics/Transportation-Services-Index-and-Seasonally-Adjus/bw6n-ddqk) - Visualizations featuring BTS' Transportation Services Index (TSI). The TSI measures the monthly move...

29. [Transportation Services Index and Seasonally-Adjusted ...](https://data.virginia.gov/dataset/transportation-services-index-and-seasonally-adjusted-transportation-data) - The index, which is seasonally adjusted, combines available data on freight traffic, as well as pass...

30. [May 2025 Freight Transportation Services Index (TSI) Down 0.1 ...](https://www.bts.gov/newsroom/may-2025-freight-transportation-services-index-tsi-down-01-previous-month-and-down-09-same) - A BTS report explaining the TSI, Transportation Services Index and the Economy, is available for dow...

31. [Freight Rail Data Center | AAR - Association of American Railroads](https://www.aar.org/data-center/) - For more detailed information, you can explore the full Weekly Railroad Traffic report. Carload traf...

32. [AAR Reports Weekly Rail Traffic for the Week Ending April 4, 2026 ...](https://railpace.com/aar-reports-weekly-rail-traffic-for-the-week-ending-april-4-2026-download-traffic/) - For this week, total U.S. weekly rail traffic was 501,328 carloads and intermodal units, up 0.1 perc...

33. [AAR Reports Weekly Rail Traffic for the Week Ending June 28, 2025](https://www.aar.org/news/aar-reports-weekly-rail-traffic-for-the-week-ending-june-28-2025/) - For this week, total U.S. weekly rail traffic was 491,424 carloads and intermodal units, down 0.2 pe...

34. [Freight Rail Traffic - Carloads - Catalog - Data.gov](http://catalog.data.gov/dataset/freight-rail-traffic-carloads) - The Association of American Railroads releases data on carloads and intermodal units originated by U...

35. [ATRI Releases Annual List of Top 100 Truck Bottlenecks](https://truckingresearch.org/2025/02/atri-releases-annual-list-of-top-100-truck-bottlenecks-8/) - The 2025 Top Truck Bottleneck List measures the level of truck-involved congestion at more than 325 ...

36. [ATRI Releases Annual List of Top 100 Truck Bottlenecks](https://truckingresearch.org/2024/02/atri-releases-annual-list-of-top-100-truck-bottlenecks-7/) - The 2024 Top Truck Bottleneck List measures the level of truck-involved congestion at over 325 locat...

37. [ATRI Releases 2025 Top 100 Truck Bottlenecks List - LinkedIn](https://www.linkedin.com/pulse/atri-releases-2025-top-100-truck-bottlenecks-list-truckersreport-iysgc) - ATRI's analysis ranks the worst bottlenecks based on extensive GPS data from commercial trucks, trac...

38. [Passenger Boarding (Enplanement) and All-Cargo Data for U.S. ...](https://www.faa.gov/airports/planning_capacity/passenger_allcargo_stats/passenger) - Passenger boarding (enplanement) and all-cargo data is extracted from the FAA 's Air Carrier Activit...

39. [Passenger Boarding (Enplanement) and All-Cargo Data for U.S. ...](https://www.faa.gov/airports/planning_capacity/passenger_allcargo_stats/passenger/collection) - Passenger (enplanement) and cargo data is extracted from the Air Carrier Activity Information System...

40. [Data Elements - Transtats.bts.gov - Bureau of Transportation Statistics](https://www.transtats.bts.gov/data_elements.aspx) - Domestic and international data based on World Area Codes, a numerical code for each country and eac...

41. [U.S. International Air Passenger and Freight Statistics Report](https://www.transportation.gov/policy/aviation-policy/us-international-air-passenger-and-freight-statistics-report) - The US International Air Passenger and Freight Statistics report has been developed to provide the p...

42. [Resources for USPS data | National Association of Letter Carriers ...](https://www.nalc.org/news/research-and-economics/economics/resources-for-usps-data) - The Postal Regulatory Commission website is where the preliminary monthly financial results reports ...

43. [State of the Postal Service - Postal Regulatory Commission](https://prc.gov/state-of-the-postal-service) - This chart displays the Postal Service's total mail volume. In FY 2025, the Postal Service delivered...

44. [Search Filings - SEC.gov](https://www.sec.gov/search-filings) - Full Text Search. Find keywords and phrases in more than 20 years of EDGAR filings, and filter by da...

45. [Quarterly Results - Prologis, Inc.](https://ir.prologis.com/financials/quarterly-results) - Q4 2020. Quarter Ended Dec 31, 2020 · Supplemental Financial Report · PDF · 10-K Filing · HTML PDF ·...

46. [SEC Filings : Rexford Industrial Realty, Inc. (REXR)](https://ir.rexfordindustrial.com/financial-info/sec-filings) - SEC Filings. Date, Form, Description, PDF, XBRL, Pages. 05/21/26, 4, Form 4: Statement of changes in...

47. [EastGroup Properties InvestorRoom - Quarterly Results](https://investor.eastgroup.net/quarterly-results) - Quarterly Results. Please note that EastGroup Properties, Inc. presentations, reports, news releases...

48. [SEC Filings - Terreno Realty Corporation](https://investors.terreno.com/financial-information/sec-filings/default.aspx) - Search SEC Filings. Document Group Types. All Documents, 10-K, 10-Q, Current Reports, Financial Supp...

49. [Documents | STAG Industrial](https://ir.stagindustrial.com/sec-filings/docs/default.aspx) - Quarterly Report, 10-Q, 04/28/2026. HTML PDF XBRL XLS ... Download our Annual Report · Download our ...

50. [Financials - Quarterly Results - Investor Relations - Americold](https://ir.americold.com/financials/quarterly-results/default.aspx) - Quarterly Results, SEC Filings, Stock Information, Stock Quote, Stock Chart, Dividend Information, A...

51. [Industrial Space Demand Forecast - NAIOP](https://www.naiop.org/research-and-publications/space-demand-forecasts/industrial-space-demand-forecast/) - The NAIOP Industrial Space Demand Forecast is based on a predictive model that forecasts demand for ...

52. [Industrial Space Demand Forecast, First Quarter 2026 | NAIOP](https://www.naiop.org/research-and-publications/research-reports/reports/industrial-space-demand-forecast-first-quarter-2026/) - U.S. demand for industrial space strengthened in the second half of 2025, with net absorption of 128...

53. [NAIOP Industrial Space Demand Forecast](https://www.naiop.org/news/naiop-news/2025/industrial-space-demand-forecast-1q25/) - The current forecast projects that net absorption will slow to 52.2 million square feet in the first...

54. [Industrial Fundamentals Stabilize as Big-Box Leasing Surges - CBRE](https://www.cbre.com/insights/figures/q1-2026-us-industrial-and-logistics-figures) - U.S. industrial fundamentals stabilize in Q1 2026 as leasing hits 249.8 MSF and vacancy holds at 6.7...

55. [U.S. Industrial Market Dynamics, Q1 2026 - JLL](https://www.jll.com/en-us/insights/market-dynamics/industrial-market-statistics-trends) - While Q1 historically underperforms other quarters, net absorption of 50.9 million s.f. demonstrated...

56. [Amazon Supply Chain and Fulfillment Center Network - MWPVL](https://www.mwpvl.com/html/amazon_com.html) - In 2024 - 2025, Amazon is restructuring its inbound cross dock network such that there will be natio...

57. [Amazon Global Fulfillment Center Network Maps - MWPVL](https://www.mwpvl.com/html/amazon_maps.html) - This is an article that documents the Amazon global fulfillment center network. MWPVL International ...

58. [How many Amazon warehouses are there? (2025 data)](https://redstagfulfillment.com/how-many-amazon-warehouses-are-there/) - Industry trackers list ≈ 180 global sortation centers; about 90 of them are in the U.S. (MWPVL, Q1 2...

59. [Amazon closes, cancels more warehouses as cost-cutting persists](https://www.supplychaindive.com/news/amazon-warehouse-closures-cancellations-delays-2023-mwpvl/643623/) - Amazon warehouse closures, delays continue across US Communities in which facilities have been cance...

60. [Inventory of Owned and Leased Properties (IOLP) - Catalog - Data.gov](http://catalog.data.gov/dataset/inventory-of-owned-and-leased-properties-iolp) - The Inventory of Owned and Leased Properties (IOLP) allows users to search properties owned and leas...

61. [Inventory of GSA Owned and Leased Properties](https://www.gsa.gov/tools-overview/buildings-and-real-estate-tools/inventory-of-gsa-owned-and-leased-properties) - View expiring lease/occupancy information for more than 8600 leased and 1500 government owned buildi...

62. [Leasing overview - GSA](https://www.gsa.gov/real-estate/leasing) - View our monthly lease inventory (posted after the 1st of each month) for data such as region/locati...

63. [Database - Data Center Map](https://www.datacentermap.com/datacenters/) - Our database contains lists of data center operators and service providers, offering colocation, clo...

64. [About Data Center Map](https://www.datacentermap.com/about/) - About Data Center Map, our history, services and vision. Data Center Map operates a data center data...

65. [Data Centers World Map](https://map.datacente.rs) - Signup, it's free! ... Get your free datacente.rs account with access to our global database, detail...

66. [Preliminary Monthly Electric Generator Inventory (based on ... - EIA](https://www.eia.gov/electricity/data/eia860m/) - The monthly survey Form EIA-860M, 'Monthly Update to Annual Electric Generator Report' supplements t...

67. [Annual Electric Power Industry Report, Form EIA-860 detailed data ...](https://www.eia.gov/electricity/data/eia860/) - The survey Form EIA-860 collects generator-level specific information about existing and planned gen...

68. [Form EIA-923 detailed data with previous form data (EIA-906/920)](https://www.eia.gov/electricity/data/eia923/) - The survey Form EIA-923 collects detailed electric power data -- monthly and annually -- on electric...

69. [Form 1, 1-F, & 3-Q (Electric) Historical VFP Data](https://www.ferc.gov/general-information-0/electric-industry-forms/form-1-1-f-3-q-electric-historical-vfp-data) - Download FERC VFP Form 1 Data and Viewer. Contact Information. Forms 1, 1-F, and 3-Q (electric). Ema...

70. [FERC Form 1 – Annual Report of Major Electric Utilities](https://catalystcoop-pudl.readthedocs.io/en/v2025.7.0/data_sources/ferc1.html) - The FERC Form 1, otherwise known as the Electric Utility Annual Report, contains financial and opera...

71. [Guide to FERC Form 1 - HData Blog](https://blog.hdata.com/ferc-form-1) - The annual FERC Form 1 report provides a comprehensive view of information about an electric utility...

72. [Data Miner 2 - PJM.com](https://dataminer2.pjm.com) - Data Miner is PJM's enhanced data management tool, giving members and non-members easier, faster and...

73. [Real-Time Hourly LMPs - Data Miner 2](https://dataminer2.pjm.com/feed/rt_hrl_lmps/definition) - In order to create a system-to-system connection to this dataset, you can download and implement an ...

74. [Getting access to Data Miner](https://pjm.my.site.com/publicknowledge/s/article/Getting-access-to-Data-Miner) - Data Miner can be accessed through the user interface (UI) or application program interface (API) fo...

75. [ERCOT Public API Applications](https://www.ercot.com/services/mdt/data-portal) - ERCOT Public API applications can be accessed via our API Explorer. The API Explorer provides develo...

76. [caiso oasis - California ISO](https://oasis.caiso.com) - Self-registration is required to access the site. • To access current data, without using the OASIS ...

77. [Energy Market & Operational Data - NYISO](https://www.nyiso.com/energy-market-operational-data) - Our energy markets allow market participants to buy and sell energy and ancillary services at prices...

78. [Web Services Data - ISO New England](https://www.iso-ne.com/participate/support/web-services-data) - ISO New England provides most of our real-time and historic data through web services, as well as do...

79. [RT Data API - Midcontinent Independent System Operator (MISO)](https://www.misoenergy.org/markets-and-operations/rtdataapis/) - This implementation is designed to improve consistency, performance, and future compatibility for ac...

80. [[PDF] Uptime Institute Global Data Center Survey 2025](https://datacenter.uptimeinstitute.com/rs/711-RIA-145/images/2025.Annual.Survey.Report.pdf?version=0) - The Uptime Institute Global Data Center Survey 2025 reveals an innovative and resilient industry — b...

81. [Uptime Institute Global Data Center Survey Results 2025](https://uptimeinstitute.com/resources/research-and-reports/uptime-institute-global-data-center-survey-results-2025) - Now in its 15th year, the Uptime Institute Global Data Center Survey 2025 reveals an innovative and ...

82. [Uptime's 14th Annual Global Data Center Survey Results Shows ...](https://uptimeinstitute.com/about-ui/press-releases/uptimes-14th-annual-global-data-center-survey-results-shows-expanding-industry-planning) - The findings of this report highlight the practices and experiences of data center owners and operat...

83. [2026 Market Outlook for Global Data Centers | JLL Research](https://www.jll.com/en-us/insights/market-outlook/data-center-outlook) - The data center sector is projected to increase by 97 GW between 2025 and 2030, effectively doubling...

84. [North America Data Center Report Year-end 2025 - JLL](https://www.jll.com/en-us/insights/market-dynamics/north-america-data-centers) - North America Data Center Report Year-end 2025 · Vacancy remains at 1% for a second consecutive year...

85. [Is the FCC National Broadband Map API endpoint working?](https://stackoverflow.com/questions/77629483/is-the-fcc-national-broadband-map-api-endpoint-working) - Furthermore, when using the Data Download Portal on the website to manually download data, the Base ...

86. [FCC Broadband Data Collection – June 2024 Update in ArcGIS ...](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/telecommunications/fcc-broadband-data-collection-june-2024-update-in-arcgis-living-atlas) - The June 2024 Broadband Data Collection (BDC) is now available within ArcGIS Living Atlas. This read...

87. [FCC Broadband Coverage Data and FiberLocator – How do they ...](https://www.fiberlocator.com/blog-broadband-coverage-comparisons/) - This system is used to support the National Broadband Map which allows users to search by address fo...

88. [Electricity Monthly Update - U.S. Energy Information Administration ...](https://www.eia.gov/electricity/monthly/update/end-use.php) - Average revenue per kWh by state ; Residential, 18.83, 10.2% ; Commercial, 13.92, 5.8% ; Industrial,...

89. [Annual Electric Power Industry Report, Form EIA-861 detailed data ...](https://www.eia.gov/electricity/data/eia861/) - Description: The data contain revenue, sales (in megawatthours), and customer count of electricity d...

90. [Petroleum Data: Prices Application Programming Interface (API)](http://catalog.data.gov/dataset/petroleum-data-prices-application-programming-interface-api) - Prices of petroleum products and crude oil. Weekly, monthly, and annual data available. Users of the...

91. [Industry Data - American Iron and Steel Institute](https://www.steel.org/industry-data/) - Weekly Raw Steel Production. In the week ending on May 16, 2026, domestic raw steel production was 1...

92. [AISI: Raw steel production strengthens further - Steel Market Update](https://www.steelmarketupdate.com/2026/04/20/aisi-raw-steel-production-strengthens-further/) - Total US raw steel production was estimated at 1,848,000 short tons (st) in the week ending April 18...

93. [Growth in commercial electricity demand linked to states with high ...](https://www.power-eng.com/business/policy-and-regulation/growth-in-commercial-electricity-demand-linked-to-states-with-high-data-center-growth/) - The EIA expects U.S. sales of electricity to the commercial sector will grow by 3% in 2024 and by 1%...

94. [Port Optimizer - Control Tower](https://volumes.portoptimizer.com) - VESSELS AT BERTH · 10 ; AVERAGE TIME AT BERTH · 3.8days ; TOTAL PLANNED VESSELS. 106 ; TOTAL PLANNED...

