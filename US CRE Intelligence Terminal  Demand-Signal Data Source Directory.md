# US CRE Intelligence Terminal: Demand-Signal Data Source Directory

> **Scope:** Hospitality · Retail · Multifamily · Office & Return-to-Work · Healthcare/Senior Housing · Demographic Turnover  
> **Purpose:** Endpoint-grade source directory for a live CRE analytics dashboard — every free and freemium feed that can drive tiles, sparklines, and alerting without a paid contract.

***

## 1 · HOSPITALITY

| # | Source | Exact URL / API Endpoint | Format | Auth | Cadence | Geography | Live Tile / Sparkline | Free vs Paid |
|---|--------|--------------------------|--------|------|---------|-----------|----------------------|--------------|
| 1 | **TSA Checkpoint Passenger Throughput** | `https://www.tsa.gov/coronavirus/passenger-throughput` (HTML table scrape via `pd.read_html()`)[^1] | HTML table → CSV (via scrape)[^2] | None | Daily (D-1 lag)[^3] | National; airport-level in FOIA PDFs[^4] | Air-travel demand sparkline vs prior-year baseline | Free — public domain[^3] |
| 2 | **STR / CoStar Hotel Weekly Snapshot** | `https://str.com/press-releases` (weekly press release digest)[^5] | PDF/HTML press release | None (summary); STR account for full | Weekly (released Tuesday)[^6] | National; top-25 markets in full report | RevPAR, ADR, Occ rate tiles | Free headline; **Paid** full benchmarking[^6] |
| 3 | **AHLA State of the Hotel Industry (Annual)** | `https://www.ahla.com/resource/2025-state-industry-report`[^7] | PDF | None | Annual (released ~Feb) | National | Annual supply/demand baseline | Free[^8] |
| 4 | **CBRE Hotels Americas Research** | `https://www.cbre.com/services/property-types/hotels/trends` and `https://www.cbre.com/insights/reports/2025-global-hotel-outlook`[^9][^10] | PDF | None (gated email form) | Quarterly + ad hoc | National + 65 markets | RevPAR forecast sparkline | Free (email registration)[^11] |
| 5 | **Lodging Econometrics Construction Pipeline** | `https://lodgingeconometrics.com` (press releases per quarter)[^12][^13] | HTML/PDF | None | Quarterly | National, top metros | Supply pipeline bar chart (projects under construction) | Free headline; **Paid** full dataset[^14] |
| 6 | **US Travel Association Weekly Forecast** | `https://www.ustravel.org/research` | PDF/HTML | None | Weekly | National | Travel spending forecast tile | Free |
| 7 | **DOT BTS T-100 Segment Data (Air Carrier Statistics)** | `https://www.transtats.bts.gov/Tables.asp` → "Air Carrier Statistics Form 41 Traffic U.S. Carriers"[^15][^16] | CSV download or web API | None | Monthly (M+30–60 day lag)[^17] | Airport-to-airport, carrier-level[^16] | Market-level enplanements time series | Free — public domain[^18] |
| 8 | **Airport Monthly Passenger Statistics** — 12 majors: | | | | | | | |
|   | ATL (Hartsfield-Jackson) | `https://www.atl.com/about-atl/statistics/` | PDF/Excel | None | Monthly | Airport | ATL pax sparkline | Free |
|   | LAX | `https://www.lawa.org/lax/statistics` | PDF/Excel | None | Monthly | Airport | LAX pax sparkline | Free |
|   | ORD (O'Hare) | `https://www.flychicago.com/ohare/aboutohare/statistics/pages/default.aspx` | PDF/Excel | None | Monthly[^19] | Airport | ORD pax sparkline | Free |
|   | DFW | `https://www.dfwairport.com/business/about/stats/`[^20] | PDF/Excel | None | Monthly (~45-day lag)[^20] | Airport | DFW pax sparkline | Free |
|   | JFK / LGA | `https://www.panynj.gov/airports/en/statistics-general-info.html` | PDF/Excel | None | Monthly | Airport | JFK/LGA pax sparkline | Free |
|   | MIA | `https://www.miami-airport.com/statistics.asp` | PDF | None | Monthly | Airport | MIA pax sparkline | Free |
|   | SFO | `https://www.flysfo.com/about/media/facts-statistics/air-traffic-statistics`[^21] | CSV/PDF | None | Monthly[^21] | Airport | SFO pax sparkline | Free |
|   | SEA | `https://www.portseattle.org/page/airport-statistics` | PDF/Excel | None | Monthly | Airport | SEA pax sparkline | Free |
|   | DEN | `https://www.flydenver.com/about/financials_stats/air_service_stats` | PDF/Excel | None | Monthly[^19] | Airport | DEN pax sparkline | Free |
|   | LAS | `https://www.harreyfield.com/en/airport-business/statistics.aspx` | PDF | None | Monthly | Airport | LAS pax sparkline | Free |
|   | MCO | `https://www.orlandoairports.net/media/3/statistics` | PDF | None | Monthly | Airport | MCO pax sparkline | Free |
| 9 | **Hotel REIT Quarterly Supplementals** (Host HST, Park PK, Apple APLE, RLJ RLJ, Pebblebrook PEB, Sunstone SHO, Summit INN) | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-Q` → each ticker | HTML/Excel exhibits | None (EDGAR public) | Quarterly (10-Q + 8-K exhibit) | Property/market-level RevPAR | RevPAR-by-market table (operator-reported) | Free — SEC EDGAR[^22] |

***

## 2 · RETAIL

| # | Source | Exact URL / API Endpoint | Format | Auth | Cadence | Geography | Live Tile / Sparkline | Free vs Paid |
|---|--------|--------------------------|--------|------|---------|-----------|----------------------|--------------|
| 10 | **Census MARTS / MRTS (Retail Sales)** | `https://api.census.gov/data/timeseries/eits/marts` (JSON API) and `https://www.census.gov/retail/sales.html`[^23] | JSON (API) / XLS | None (API key optional) | Monthly advance (~D+12) + revised (~D+47)[^24] | National; NAICS category | Retail sales growth sparkline | Free — public domain[^25][^23] |
| 11 | **FRED MARTS series** | `https://fred.stlouisfed.org/release?rid=9`[^26] | JSON/CSV (FRED API) | Free API key | Monthly | National | YoY retail trade tile | Free[^26] |
| 12 | **Conference Board Consumer Confidence Index** | `https://www.conference-board.org/topics/consumer-confidence/`[^27] | Press release PDF / licensed data feed | Press release: None; data feed: subscription | Monthly (last Tuesday of month)[^28] | National; top-8 states | Consumer confidence gauge tile | Free headline; **Paid** time-series download[^29] |
| 13 | **U-Mich Consumer Sentiment (UMCSI)** | `https://www.sca.isr.umich.edu` (summary tables)[^30] + `https://data.sca.isr.umich.edu/data-archive/mine.php`[^31] | HTML tables; licensed XLSX data archive | Summary: None; archive: $600/yr license | Monthly preliminary (mid-month) + final (last Friday)[^32] | National; age/income breakdowns[^32] | Sentiment gauge + expectations sub-index tile | Free headline; **Paid** full archive[^30] |
| 14 | **OpenTable State of the Restaurant Industry** | `https://www.opentable.com/c/state-of-industry/`[^33] | CSV download (linked on page) | None | Daily YoY update[^33] | US + major metros; global countries | YoY seated-diner sparkline | Free[^33][^34] |
| 15 | **Yelp Local Economic Impact Report** | `https://trends.yelp.com`[^35] | HTML/PDF | None | Periodic (monthly/quarterly economic reports)[^36] | MSA-level business open/close counts | Business closure/opening heat map | Free[^37] |
| 16 | **Foursquare OS Places (POI baseline)** | `https://location.foursquare.com/places-portal` (Iceberg catalog)[^38] | Parquet (Iceberg/S3) | Free account + token[^38] | Quarterly refresh | 100M+ POIs globally[^39] | Retail density / POI change map | Free (OS tier)[^39][^38] |
| 17 | **Placer.ai Free / Freemium** | `https://www.placer.ai` (freemium dashboard)[^40] | Web dashboard | Free account | Weekly trends visible in UI[^41] | Property / metro / chain | Foot-traffic YoY tile | Free limited; **Paid** full data export[^42] |
| 18 | **SafeGraph (now via Advan on Dewey)** | `https://www.deweydata.io` (Advan Patterns dataset)[^43] | Parquet/CSV | Paid or academic request | Monthly (Patterns) | POI-level, nationwide[^44] | Foot-traffic by NAICS category | **Academic free**; commercial paid[^43][^45] |
| 19 | **Adobe Digital Economy Index** | `https://business.adobe.com/resources/digital-economy-index.html`[^46] | PDF report | None | Monthly[^46] | National e-commerce | E-commerce spend YoY sparkline | Free[^46][^47] |
| 20 | **Mastercard SpendingPulse** | `https://www.mastercard.com/us/en/business/insights-intelligence/economic-market-insights/solutions/spendingpulse.html`[^48] | Press release PDF | None (summaries); licensed full data | Monthly / event-based releases[^49] | National; sector-level (apparel, restaurant, etc.) | Retail category spend tile | Free headline; **Paid** licensed feed[^48] |
| 21 | **BEA Personal Consumption Expenditures (PCE)** | `https://www.bea.gov/data/consumer-spending/main` + API: `https://apps.bea.gov/api/`[^50] | JSON (BEA API) / XLS | Free API key | Monthly (M+30 day advance)[^51] | National; major categories | Real PCE sparkline + deflator | Free — public domain[^52][^53] |
| 22 | **JPMorgan Chase Institute / BofA Institute Consumer Checkpoint** | JPMC: `https://www.jpmorganchase.com/institute` / BofA: `https://institute.bankofamerica.com` | PDF/HTML | None | Monthly | National; demographic cuts | Spending-by-category tiles | Free PDF summaries |
| 23 | **Retail REIT Quarterly Supplementals** (Simon SPG, Regency REG, Brixmor BRX, Federal Realty FRT, Kimco KIM, Tanger SKT, Kite KRG, Macerich MAC) | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-Q` → each ticker | HTML/Excel | None (EDGAR public) | Quarterly | Property / market-level leasing spreads | Leasing spread & occupancy table | Free — SEC EDGAR |

***

## 3 · MULTIFAMILY

| # | Source | Exact URL / API Endpoint | Format | Auth | Cadence | Geography | Live Tile / Sparkline | Free vs Paid |
|---|--------|--------------------------|--------|------|---------|-----------|----------------------|--------------|
| 24 | **Apartment List Rent Estimates** | `https://www.apartmentlist.com/research/category/data-rent-estimates`[^54] (CSV download links in posts) | CSV[^55][^56] | None | Monthly[^55] | National / state / metro / city[^56] | Median rent sparkline + YoY tile | Free[^54] |
| 25 | **Zillow Observed Rent Index (ZORI)** | `https://www.zillow.com/research/data/` (direct CSV links on page)[^57] | CSV | None | Monthly[^58][^59] | National / metro / ZIP | ZORI rent index sparkline | Free[^57] |
| 26 | **Zillow Home Value Index (ZHVI)** | `https://www.zillow.com/research/data/` (same data page)[^57] | CSV | None | Monthly | National / metro / ZIP | ZHVI sparkline for multifamily | Free[^57] |
| 27 | **Redfin Data Center** | `https://www.redfin.com/news/data-center/`[^60] Direct S3 links (e.g., `s3://redfin-public-data/redfin_market_tracker/zip_code_market_tracker.tsv000.gz`)[^61] | TSV.GZ (S3) | None | Weekly and monthly[^62] | National / metro / state / county / city / ZIP / neighborhood[^60] | Median price, inventory, pending sales tiles | Free[^60] |
| 28 | **Realtor.com Economic Research** | `https://www.realtor.com/research/data/` | CSV | None | Weekly (inventory) + monthly | National / metro / ZIP | Active listing count sparkline | Free |
| 29 | **RealPage Market Analytics Monthly Data Update** | `https://www.realpage.com/analytics/`[^63] (monthly recap blog posts with embedded data)[^64][^65] | HTML/PDF recap | None (summary); **Paid** platform for full data | Monthly[^64] | National / top-50 metros[^66] | Occupancy rate + effective rent sparkline | Free recap; **Paid** full platform[^67] |
| 30 | **CoStar Multifamily National Report** | `https://www.costar.com/about/costar-news/research` | PDF (registration required) | Email registration | Quarterly | National / major markets | Vacancy / absorption bar chart | Free (registration)[^63] |
| 31 | **NMHC Quarterly Apartment Survey** | `https://www.nmhc.org/research-insight/quarterly-survey/`[^68] | HTML tables + PDF | None | Quarterly (Jan / Apr / Jul / Oct)[^69] | National sentiment (Market Tightness, Sales Volume, Financing) | NMHC Market Tightness gauge | Free[^68] |
| 32 | **Census Building Permits Survey (BPS) — Multifamily** | `https://www.census.gov/construction/bps/` → MSA-level Excel downloads[^70] | Excel / CSV | None | Monthly (preliminary D+12; revised D+17)[^71] | National / region / state / MSA (CBSA)[^70] | Multifamily permits sparkline by MSA | Free — public domain[^71] |
| 33 | **AHS (American Housing Survey)** | `https://www.census.gov/programs-surveys/ahs.html` + API: `api.census.gov/data/2023/ahs` | JSON (API) / CSV | Free API key | Biennial (odd years) | National; 25 largest metros | Housing tenure / vacancy tiles | Free — public domain |
| 34 | **ACS Housing Tenure (B25003)** | `https://api.census.gov/data/2023/acs/acs1` (table B25003)[^72] | JSON (Census API) | Free API key | Annual (1-yr) + 5-yr | National / state / county / tract | Owner vs renter ratio map | Free — public domain[^72] |
| 35 | **Yardi Matrix National Multifamily Report** | `https://www.yardimatrix.com/Publications`[^73] + `https://www.yardi.com/blog/multifamily-reports-yardi-matrix-2026/`[^74] | PDF (free download) | None | Monthly[^74][^75] | National / top metros | Advertised rent + occupancy sparkline | Free PDF summary; **Paid** full database[^76] |
| 36 | **Multifamily REIT Quarterly Supplementals** (AvalonBay AVB, EQR, Camden CAA, MAA, UDR, Essex ESS, Independence Realty IRT) | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-Q` → each ticker | HTML/Excel | None (EDGAR public) | Quarterly | Property / submarket-level same-store NOI and occupancy | Same-store NOI growth tile | Free — SEC EDGAR |

***

## 4 · OFFICE AND RETURN-TO-OFFICE

| # | Source | Exact URL / API Endpoint | Format | Auth | Cadence | Geography | Live Tile / Sparkline | Free vs Paid |
|---|--------|--------------------------|--------|------|---------|-----------|----------------------|--------------|
| 37 | **Kastle Systems Back to Work Barometer** | `https://www.kastle.com/safety-wellness/getting-america-back-to-work/`[^77] | HTML (weekly embed / PDF) | None | Weekly (data updates Monday for prior week)[^78][^79] | 10 metros: NYC, DC, Houston, Dallas, Austin, Chicago, LA, SF, Seattle, San Jose[^80] | Office occupancy % vs 2020 baseline sparkline | Free[^79][^77] |
| 38 | **Stanford WFH Research (SWAA)** | `https://wfhresearch.com/data/`[^81] | CSV (survey micro + aggregate)[^82] | None | Monthly (survey of 2,500–10,000 US residents)[^81] | National; by industry / occupation | WFH days per week trend sparkline | Free[^81] |
| 39 | **LinkedIn Workforce Reports / Economic Graph** | `https://economicgraph.linkedin.com/research` | PDF / JSON (Research API, by approval) | None (PDF); API requires partner approval | Monthly (Workforce Report) | National; metro / industry | Hiring rate by sector tile | Free PDF; API by approval |
| 40 | **JLL US Office Market Dynamics** | `https://www.jll.com/en-us/insights/market-dynamics/us-office`[^83] and PDF archive: `https://www.jll.com/content/dam/jllcom/...`[^84][^85] | PDF | None | Quarterly[^83] | National + major markets | Net absorption / vacancy bar chart | Free[^83] |
| 41 | **CBRE Office Figures** | `https://www.cbre.com/insights/reports` (search "US Office Figures")[^86] | PDF | Email registration | Quarterly | National + 60+ markets | Sublease availability tile | Free (registration)[^86] |
| 42 | **Cushman & Wakefield Office MarketBeat** | `https://www.cushmanwakefield.com/en/united-states/insights/us-marketbeat-reports` | PDF | None | Quarterly | National + ~80 markets | Cap rate + effective rent tiles | Free |
| 43 | **Office REIT Quarterly Supplementals** (Boston Properties BXP, Vornado VNO, SL Green SLG, Kilroy KRC, Cousins CUZ, Highwoods HIW, Brandywine BDN, Piedmont PDM) | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=10-Q` → each ticker | HTML/Excel | None (EDGAR public) | Quarterly | Building / submarket-level leasing volume, % leased | Leased % + leasing spread table | Free — SEC EDGAR[^87] |

***

## 5 · HEALTHCARE AND SENIOR HOUSING

| # | Source | Exact URL / API Endpoint | Format | Auth | Cadence | Geography | Live Tile / Sparkline | Free vs Paid |
|---|--------|--------------------------|--------|------|---------|-----------|----------------------|--------------|
| 44 | **CMS Provider of Services (POS) File** | `https://data.cms.gov/provider-characteristics/hospitals-and-other-facilities/provider-of-services-file-hospital-non-hospital-facilities`[^88] | CSV / JSON (API)[^89] | None | Quarterly (updated ~45 days after quarter end)[^90] | Every Medicare-certified facility, nationwide[^91] | Facility count by type / MSA map | Free[^89][^88] |
| 45 | **CMS Hospital Compare Dataset** | `https://data.cms.gov/provider-data/dataset/xubh-q36u` | CSV / API | None | Annual + quarterly partial updates[^90] | Facility-level | Hospital quality score tile | Free[^90] |
| 46 | **CMS Nursing Home Compare (Care Compare)** | `https://data.cms.gov/provider-data/topics/nursing-homes`[^90] | CSV / API | None | Quarterly[^90] | Facility-level + MSA rollups | SNF quality + occupancy sparkline | Free[^90] |
| 47 | **NIC MAP Free Tier / Press Releases** | `https://www.nicmap.com/news/`[^92] and quarterly occupancy recap at `https://nicmap.com` | PDF press release | None (summary); NIC MAP subscription for full | Quarterly (occupancy / absorption)[^93] | 31 NIC Primary Markets[^93] | Senior housing occupancy gauge | Free headline; **Paid** platform subscription[^94] |
| 48 | **Healthcare REIT Quarterly Supplementals** (Welltower WELL, Ventas VTR, Healthpeak DOC, Omega OHI, Sabra SBRA, NHI) | Welltower: `https://welltower.com/investors/sec-filings/`[^95] / Healthpeak: `https://ir.healthpeak.com/financials/sec-filings/`[^96] / others via EDGAR | HTML/Excel | None (EDGAR public) | Quarterly | Operator / property-type / market-level REVPOR, occupancy | REVPOR + occupancy sparkline by care type | Free — SEC EDGAR[^97][^22] |

***

## 6 · DEMOGRAPHIC TURNOVER

| # | Source | Exact URL / API Endpoint | Format | Auth | Cadence | Geography | Live Tile / Sparkline | Free vs Paid |
|---|--------|--------------------------|--------|------|---------|-----------|----------------------|--------------|
| 49 | **USCIS / DOL OFLC LCA Quarterly Disclosure (H-1B, H-1B1, E-3)** | `https://www.dol.gov/agencies/eta/foreign-labor/performance`[^98] (`LCA_Disclosure_Data_FY####_Q#.xlsx`) | XLSX | None | Quarterly (~60-day lag)[^99][^98] | Employer MSA + employer name + occupation + wage | H-1B filing surge by MSA tile (office/tech demand proxy) | Free[^100][^101] |
| 50 | **USCIS H-1B Approvals / Denial Data** | `https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub` | CSV / Online tool | None | Annual (released ~Jan–Feb)[^99] | Employer name + state | Annual H-1B approval count by employer | Free |
| 51 | **IPEDS University Enrollment** | `https://nces.ed.gov/ipeds/use-the-data`[^102][^103] + Urban Institute API: `https://educationdata.urban.org/api/v1/college-university/ipeds/enrollment-summary/{year}/`[^104] | CSV / JSON (API) | None | Annual (fall collection; provisional released ~Sep)[^105][^106] | Institution-level → MSA aggregation | Student enrollment change sparkline (student housing proxy) | Free[^102] |
| 52 | **Census ACS 5-Year Migration Flows** | `https://api.census.gov/data/2022/acs/flows`[^107] | JSON (Census API) | Free API key | 5-year rolling (annual release of new 5-yr estimates)[^108][^72] | County-to-county; metro-to-metro; state-to-state | In/out-migration flow map by MSA | Free[^107][^109] |
| 53 | **IRS SOI County-to-County Migration** | `https://www.irs.gov/statistics/soi-tax-stats-migration-data`[^110] (CSV/XLSX by state)[^111] | CSV / XLSX | None | Annual (~18-month lag; FY2022–23 files released Mar 2026)[^111] | County-to-county inflow/outflow + AGI[^110] | Net migration tile by county + AGI-weighted flows | Free[^110][^112] |
| 54 | **EB-5 Visa / USCIS Immigrant Investor Data** | `https://www.uscis.gov/tools/reports-and-studies/immigration-and-citizenship-data` | PDF tables / CSV | None | Annual | Regional center / project-level | EB-5 capital flow map (foreign CRE demand proxy) | Free |

***

## Dashboard Engineering Notes

### Resolving TSA Data
The TSA page at `tsa.gov/coronavirus/passenger-throughput` serves an HTML table that is readable via `pd.read_html()` with no API key. It includes daily totals back to February 2020 with prior-year comparisons. Airport-level hourly data requires downloading FOIA PDFs from `tsa.gov/foia/readingroom` and parsing them (Python or R workflow). The data is public domain with no license restrictions.[^4][^2][^3][^1]

### STR Free vs. Paid Boundary
STR (now a CoStar subsidiary) distributes weekly headline data through press releases and industry media (e.g., Hospitality Net). The full benchmarking report — individual hotel comp-set performance, detailed market breakdowns — requires a paid STR subscription; hotels provide their own data as the participation fee. The free press release is sufficient for a national/top-market RevPAR sparkline.[^6][^113][^5]

### BTS T-100 API Pattern
TranStats supports both an online analysis tool and bulk CSV downloads. For API-style access, use the download endpoint: `https://www.transtats.bts.gov/DL_SelectFields.aspx?gnoyr_VQ=FIM` (T-100 Domestic Market) with GET/POST parameters for year, month, carrier, and origin/destination airport codes. No auth required. Monthly data lands with a 30–60 day lag.[^16][^17]

### Kastle Historical Archive
Kastle publishes its 10-city weekly barometer as a live HTML widget and regular blog posts at `kastle.com/safety-wellness/getting-america-back-to-work/`. A downloadable historical archive is not formally exposed, but researchers have assembled panel series from weekly screenshots and blog posts. Data goes back to February 2020. For machine-readable history, FRED has begun hosting the Kastle series under ticker codes `CWUSAWROCCWK` (national) and city-specific variants.[^79][^114][^77]

***

## Priority Rankings for Dashboard Build

### (a) 12 Highest-Velocity Demand-Signal Feeds for a Public Dashboard

These feeds update daily to weekly, require no paid contract, and map directly to investable CRE property types:

1. **TSA Checkpoint Throughput** — daily air travel demand; 1-day lag; hospitality demand spine[^3][^1]
2. **Kastle Back to Work Barometer** — weekly office occupancy; 10-metro breakdown; most-cited RTO metric[^80][^77][^79]
3. **OpenTable Seated Diner YoY** — daily restaurant demand signal; retail/hospitality crossover[^33][^34]
4. **Census MARTS Retail Sales** — monthly national and NAICS retail sales; best macro retail tile[^26][^23]
5. **Redfin Data Center Weekly** — weekly housing supply/demand data via free S3 TSV; sub-ZIP granularity[^60][^62][^61]
6. **Zillow ZORI (CSV)** — monthly metro-level rent index; programmatic CSV; no auth[^58][^57][^59]
7. **ApartmentList Monthly Rent Estimates** — monthly median rent by city/county; downloadable CSV[^54][^55]
8. **BEA PCE Monthly** — monthly real consumer spending; macro overlay for all property types[^50][^53]
9. **Census Building Permits (BPS) — Multifamily** — monthly MSA-level pipeline; leading supply indicator[^71][^70]
10. **WFH Research SWAA** — monthly work-from-home share by industry; office demand signal[^82][^81]
11. **CMS POS / Provider Data** — quarterly facility-count changes; healthcare real estate supply[^89][^88][^90]
12. **DOL OFLC LCA Quarterly Disclosure** — quarterly tech/professional worker H-1B filings by MSA; office/multifamily demand leading indicator[^100][^98]

***

### (b) 5 Unfair-Advantage Feeds Almost Nobody Puts on a CRE Site

1. **DOL OFLC LCA Quarterly H-1B Disclosure by MSA** — The quarterly XLSX from `dol.gov/agencies/eta/foreign-labor/performance` reveals which metro-level employers are filing for high-skilled workers 6–18 months before those workers show up in payroll data. A spike in LCA filings for Austin, Raleigh, or Nashville is a leading edge for office lease demand and Class A multifamily absorption — free, machine-readable, almost zero CRE dashboard adoption.[^98][^115]

2. **TSA FOIA Airport-Level Hourly Checkpoint Data** — While national daily TSA throughput is well-known, the airport-level hourly FOIA PDFs (parsed to CSV) reveal which specific origin markets are recovering fastest. Mapping those to airport-adjacent hotel submarkets, convention corridors, and office clusters gives a 30–60 day edge over STR or CBRE market reports.[^2][^4]

3. **IRS SOI County-to-County Migration + AGI** — The IRS migration files include adjusted gross income of movers. This lets you distinguish high-income migration (relevant to Class A multifamily and for-sale luxury) from population migration, a distinction no CRE data provider surfaces cleanly. Filing-year data runs 18 months behind but the signal is durable.[^110][^111]

4. **Foursquare OS Places Quarterly Delta File** — The open-source Foursquare POI dataset includes a delta/change feed identifying new, closed, and modified POIs by quarter. Tracking net retail POI closures in a submarket before vacancy data catches up in CoStar or CBRE reports provides a 1–2 quarter lead on retail fundamentals — free under Apache 2.0.[^39][^38]

5. **NMHC Construction Quarterly Survey** — Beyond the headline Market Tightness index, the NMHC quarterly survey asks developers about construction starts delays, material/labor cost obstacles, and financing conditions. These sub-indices are not tracked by any standard CRE data product and function as a forward-looking multifamily supply pipeline stress gauge that predicts certificate-of-occupancy slippage before BPS data shows it.[^68][^116]

***

### (c) Cheapest Paid Upgrades When Free Tiers Fall Short

**STR (CoStar):** The free weekly press release covers national headline ADR/Occupancy/RevPAR only. The first meaningful paid tier is an STR Benchmarking subscription (typically $500–$2,000/month depending on property count), which delivers comp-set STAR reports — the weekly competitive-set RevPAR index every hotel investor monitors. For a CRE intelligence terminal focused on submarket-level RevPAR trends without owning a hotel, the most cost-efficient entry point is the CoStar hospitality market analytics module (bundled at ~$500–$800/month), which repackages STR data with CoStar's submarkets already mapped. Contact: `str.com` → Market Intelligence.

**Placer.ai:** The freemium tier shows limited weekly visit-trend snapshots for individual venues without export or historical depth. The Professional plan (estimated $800–$1,500/month for a small team) unlocks full metro-wide foot-traffic indices, visitor origin ZIP codes (critical for trade-area underwriting), and API-grade CSV export. For CRE purposes the minimum viable upgrade is the **Trade Area & Competitive Intelligence** add-on, which maps visitor overlap between competing retail centers — the single most actionable signal for retail leasing decisions. Contact: `placer.ai/pricing`.[^40]

**SafeGraph / Advan Patterns:** SafeGraph's academic free tier via the Dewey platform is genuine but time-lagged and limited in query volume. Commercial Advan Patterns via Dewey starts at approximately $500–$1,000/month for access to monthly foot-traffic patterns by NAICS category for all US POIs. For a CRE intelligence terminal, the highest-ROI tier is the **Neighborhood Patterns** dataset, which aggregates foot traffic to the census block group level, enabling retail corridor and mixed-use underwriting without property-level licensing costs.[^43]

**RealPage Market Analytics:** The free monthly recap blog posts at `realpage.com/analytics/` provide one headline national number plus a few metro call-outs. The full Market Analytics platform (estimated $2,000–$5,000/month) unlocks property-level effective rent, concession tracking, and submarket-level demand forecasts for the 150 largest US apartment markets. The minimum viable paid upgrade is the **National Snapshot license** (approximately $500–$1,000/month in some channel packages), which provides monthly effective rent and occupancy for top-50 metros in a data feed format suitable for dashboard ingestion.[^64][^66]

---

## References

1. [How to Pull TSA Checkpoint Passenger Data - bbgatch](https://www.bbgatch.com/projects/tsa/2022-03-15-pulling-plotting-tsa-data/2022-03-15-how-to-pull-tsa-data.html) - ... TSA data from url = "https://www.tsa.gov/coronavirus/passenger-throughput" # Read the page using...

2. [TSA Throughput Dataset (alternate source) - Reddit](https://www.reddit.com/r/datasets/comments/mx87q8/tsa_throughput_dataset_alternate_source/) - This folder contains .CSV files for individual airports as wall as a .CSV file for All airports (uni...

3. [Department of Homeland Security - COVID-19 Passenger Throughput](http://catalog.data.gov/dataset/covid-19-passenger-throughput) - Since the beginning of the COVID-19 pandemic, TSA has published the daily passenger checkpoint throu...

4. [Airport Data for Artificial Intelligence Forecasting of Air Passenger ...](https://datacommons.erau.edu/datasets/4dsy9vxxgx/1) - Data observations include daily airport passenger flow from aggregated airport TSA security checkpoi...

5. [STR Weekly Insights: 29 June – 5 July 2025 - Hospitality Net](https://www.hospitalitynet.org/news/4128138/str-weekly-insights-29-june-5-july-2025) - Las Vegas reported another down week with RevPAR retreating 28.7%, due to falling ADR (-14.3%) and o...

6. [How to Read a STR Report (Hotelier Step-by-Step)](https://hoteltechreport.com/news/str-report) - The STR report is a benchmarking tool that compares your hotel's performance against a set of simila...

7. [2025 State of The Industry Report | AHLA](https://www.ahla.com/resource/2025-state-industry-report) - The American Hotel & Lodging Association's 2025 State of the Industry Report highlights several key ...

8. [2025 State of the Industry: Partner Trends & Insights Report | AHLA](https://www.ahla.com/resource/2025-state-industry-partner-trends-insights-report) - The American Hotel & Lodging Association's 2025 report highlights key industry trends, policy update...

9. [Trends® | CBRE](https://www.cbre.com/services/property-types/hotels/trends) - Five-year forecasts of supply, demand, occupancy, ADR, and RevPAR for the U.S. lodging industry, six...

10. [2025 Global Hotel Outlook | CBRE](https://www.cbre.com/insights/reports/2025-global-hotel-outlook) - CBRE expects 2025 US RevPAR to grow 2% given the outlook for mid-single-digit increases in inbound i...

11. [Hotels | CBRE](https://www.cbre.com/services/property-types/hotels) - CBRE Hotel Research Thought Leadership. 1/4 Report | Intelligent Investment. Hotel Brand Performance...

12. [U.S. Hotel Construction Pipeline Grows 5% YOY in Q1 2025, Early ...](https://lodgingeconometrics.com/u-s-hotel-construction-pipeline-grows-5-yoy-in-q1-2025-early-planning-stage-surges-10/) - These first quarter totals represent a 5% year-over-year (YOY) increase in projects and a 6% YOY inc...

13. [U.S. Hotel Construction Pipeline Remains Steady Year-Over-Year ...](https://lodgingeconometrics.com/extended-stay-hotels-comprising-40-of-total-projects-in-u-s-hotel-construction-pipeline/) - U.S. Hotel Construction Pipeline Remains Steady Year-Over-Year, with Extended-Stay Hotels Comprising...

14. [Global Hotel Construction Pipeline Reaches Record-High 15,871 ...](https://lodgingeconometrics.com/global-hotel-construction-pipeline-reaches-record-high-q2-2025/) - LE analysts forecast a total of 2,854 new hotels with 418,247 rooms to open in 2025. With the global...

15. [Data Bank 28DS - T-100 Domestic Segment Data (World Area Code)](https://www.bts.gov/browse-statistical-products-and-data/bts-publications/data-bank-28ds-t-100-domestic-segment-data) - This CD presents data reported by U.S. carriers operating between airports located within the bounda...

16. [Using Airline Data on TranStats - YouTube](https://www.youtube.com/watch?v=DgX8dkq70vI) - TranStats webpage: https://www.transtats.bts.gov/ TranStats T-100 Traffic Data Practice Video (sampl...

17. [Where can I find statistics on air travel and air carriers?](https://transportation.libanswers.com/faq/204455) - Certificated air carriers are required under 14 CFR 234 and 14 CFR 241 to report statistics to the B...

18. [Data Elements - Transtats.bts.gov - Bureau of Transportation Statistics](https://www.transtats.bts.gov/data_elements.aspx) - For previous months, see T-100 for U.S. carrier, foreign carrier and individual airport passenger an...

19. [As American Battles United, O'Hare Vaunts To Third Busiest Airport](https://www.forbes.com/sites/tedreed/2025/12/31/chicago-is-up-but-2025-traffic-falls-at-seven-of-top-ten-airports/) - Passenger traffic declined at seven of the top ten U.S. airports during 2025, as both global carrier...

20. [Traffic Statistics - DFW Airport](https://www.dfwairport.com/business/about/stats/) - DFW Airport's passenger, cargo and operational statistics are available and updated monthly, approxi...

21. [Air Traffic Statistics | San Francisco International Airport](https://www.flysfo.com/about/media/facts-statistics/air-traffic-statistics) - The passenger dataset contains data about passenger traffic into and out of SFO with monthly totals ...

22. [well-20250930 - SEC.gov](https://www.sec.gov/Archives/edgar/data/766704/000076670425000040/well-20250930.htm) - On November 20, 2025, we will pay our 218th consecutive quarterly cash dividend to stockholders of r...

23. [Monthly Retail Trade - Sales Report - Census Bureau](https://www.census.gov/retail/sales.html) - Retail trade sales were up 0.5 percent (±0.4 percent) from March 2026, and up 5.2 percent (±0.5 perc...

24. [Advance Monthly Retail Trade Survey](https://www.census.gov/retail/marts/about_the_surveys.html) - The Advance Monthly Retail Trade Survey (MARTS) provides an early indication of sales of retail and ...

25. [Monthly Retail Trade - Main Page - Census Bureau](https://www.census.gov/retail/) - The Advance Monthly and Monthly Retail Trade Surveys (MARTS and MRTS), the Annual Retail Trade Surve...

26. [Advance Monthly Sales for Retail and Food Services | FRED](https://fred.stlouisfed.org/release?rid=9) - The US Census Bureau conducts the Advance Monthly Retail Trade and Food Services Survey to provide a...

27. [US Consumer Confidence - The Conference Board](https://www.conference-board.org/topics/consumer-confidence/) - This monthly report details consumer attitudes, buying intentions, vacation plans, and consumer expe...

28. [US Consumer Confidence Virtually Unchanged in October](https://www.prnewswire.com/news-releases/us-consumer-confidence-virtually-unchanged-in-october-302596825.html) - The Conference Board publishes the Consumer Confidence Index® at 10 a.m. ET on the last Tuesday of e...

29. [Consumer Confidence Survey - The Conference Board](https://www.conference-board.org/data/datadetail.cfm?dataid=consumerconf) - This monthly report details consumer attitudes, buying intentions, vacation plans and consumer expec...

30. [Surveys of Consumers - University of Michigan](https://www.sca.isr.umich.edu) - Final Results for May 2026 ; Index of Consumer Sentiment, 44.8, 49.8, 52.2, -10.0% ; Current Economi...

31. [Surveys of Consumers - Data - University of Michigan](https://data.sca.isr.umich.edu/data-archive/mine.php) - Table 1: The Index of Consumer Sentiment Table 2: The Index of Consumer Sentiment Within Income Terc...

32. [Survey Description - Surveys of Consumers - University of Michigan](https://data.sca.isr.umich.edu/survey-description.php) - The Index of Consumer Expectations focuses on three areas: how consumers view prospects for their ow...

33. [State of the Restaurant Industry - OpenTable Data](https://www.opentable.com/c/state-of-industry/) - The State of the Industry looks at year-over-year (YoY) change in seated diners from online reservat...

34. [Restaurant Industry Data Analysis - OpenTable](https://www.opentable.com/restaurant-solutions/intel/) - Our State of the Industry is updated daily and shows how restaurants around the world are doing in t...

35. [Yelp Trends & Insights](https://trends.yelp.com) - Yelp's unique and extensive data uncovers cultural trends, economic shifts, and brand insights acros...

36. [Yelp: Local Economic Impact Report](https://trends.yelp.com/business-closures-update-sep-2020) - See Yelp's previous Local Economic Impact Reports at our Data Science Medium, Locally Optimal. Recen...

37. [Yelp Local Economic Impact Report: A Look at Diverse Businesses](https://trends.yelp.com/diverse-business-report) - Yelp data reveals how women, Black, and Latinx business owners faced challenges and persevered acros...

38. [Access FSQ OS Places - Docs - Foursquare](https://docs.foursquare.com/data-products/docs/access-fsq-os-places) - With Foursquare's Open Source Places, you can access free data to accelerate geospatial innovation a...

39. [Foursquare places | ClickHouse Docs](https://clickhouse.com/docs/getting-started/example-datasets/foursquare-places) - This dataset by Foursquare is available to download and to use for free under the Apache 2.0 license...

40. [Pricing Plans | Customized Subscription Packages - Placer.ai](https://www.placer.ai/pricing) - Our customized subscription packages are designed to provide you with valuable insights, while meeti...

41. [Retail's Balancing Act: What the First Half of 2025 Reveals About ...](https://www.placer.ai/anchor/articles/retails-balancing-act-first-half-of-2025) - In this report, we explore the key takeaways across retail fundamentals and shifting consumer behavi...

42. [Placer.AI is great but too expensive. Can anyone ... - Reddit](https://www.reddit.com/r/CommercialRealEstate/comments/whp9a3/placerai_is_great_but_too_expensive_can_anyone/) - Placer is great but the price is $1000+ monthly from what I've been quoted. Has anyone found a cheap...

43. [SafeGraph Patterns is Now on Dewey as Advan Patterns](https://www.deweydata.io/blog/advan-patterns-now-available) - Effective January 2023, Patterns, a popular foot traffic dataset previously provided by SafeGraph, w...

44. [We're Excited to Back SafeGraph, a Leading DaaS Company for ...](https://sapphireventures.com/blog/safegraph-series-b/) - SafeGraph provides valuable data on over eight million physical places in the U.S. and Canada, and a...

45. [Academic Research - SafeGraph](https://www.safegraph.com/publications/academic-research/) - Our Data in the Real World. Stay current with the latest media coverage, academic papers, and indust...

46. [Adobe Digital Economy Index](https://business.adobe.com/resources/digital-economy-index.html) - Gain insights into US ecommerce trends with Adobe's Digital Economy Index. A monthly analysis of onl...

47. [Adobe Digital Price Index](https://business.adobe.com/resources/digital-price-index.html) - Adobe is uniquely poised to measure the growing global digital economy tracking a trillion+ visits t...

48. [SpendingPulse for Retail Sales & Market Insights - Mastercard](https://www.mastercard.com/us/en/business/insights-intelligence/economic-market-insights/solutions/spendingpulse.html) - Analyze near real-time retail sales and consumer spending trends to benchmark performance, forecast ...

49. [Mastercard SpendingPulse: Savvy Shoppers and E-Commerce Fuel ...](https://investor.mastercard.com/investor-news/investor-news-details/2025/Mastercard-SpendingPulse-Savvy-Shoppers-and-E-Commerce-Fuel-U-S--Holiday-Retail-Sales-Growth-by-3-9-YOY/default.aspx) - Mastercard SpendingPulse: Savvy Shoppers and E-Commerce Fuel U.S. Holiday Retail Sales Growth by 3.9...

50. [Consumer Spending | U.S. Bureau of Economic Analysis (BEA)](https://www.bea.gov/data/consumer-spending/main) - Consumer spending, or personal consumption expenditures (PCE), is the value of the goods and service...

51. [Personal Income and Outlays, August 2025](https://www.bea.gov/news/2025/personal-income-and-outlays-august-2025) - Personal Income and Outlays, August 2025 ; Real disposable personal income, 0.1 ; Current-dollar per...

52. [Personal Consumption Expenditures Price Index, Excluding Food ...](https://www.bea.gov/data/personal-consumption-expenditures-price-index-excluding-food-and-energy) - The PCE Price Index Excluding Food and Energy, also known as the core PCE price index, is released a...

53. [Personal Income and Outlays, October and November 2025](https://www.bea.gov/news/2026/personal-income-and-outlays-october-and-november-2025) - Due to a lapse in federal appropriations, the Bureau of Labor Statistics (BLS) could not collect Oct...

54. [Data & Rent Estimates - Apartment List Blog](https://www.apartmentlist.com/research/category/data-rent-estimates) - Read about and download the latest rental data in your area. Access the latest rental market data fo...

55. [Apartment List National Rent Report](https://www.apartmentlist.com/research/national-rent-data) - In dollar terms, the national median monthly rent now stands at $1,370, down $23 compared to April 2...

56. [Apartment List's National Rent Report (August 2023) By the ...](https://aoausa.com/apartment-lists-national-rent-report-august-2023-by-the-apartment-list-research-team/) - For complete data, head over to our rental data page at (www.apartmentlist.com/research/category/dat...

57. [Real Estate Metrics - Data & APIs](https://www.zillowgroup.com/developers/api/public-data/real-estate-metrics/) - In terms of aggregate data at the neighborhood level, can be found here – https://www.zillow.com/res...

58. [Methodology: Zillow Observed Rent Index (ZORI)](https://www.zillow.com/research/methodology-zori-repeat-rent-27092/) - The Zillow Observed Rent Index (ZORI) measures changes in asking rents over time, controlling for ch...

59. [Steady As She Goes: Rent Growth in June Was Perfectly Average ...](https://www.zillow.com/research/june-2023-rent-report-32840/) - Asking rents climbed by $12, or 0.6%, from May to June, according to the latest edition of the Zillo...

60. [Downloadable Housing Market Data - Redfin](https://www.redfin.com/news/data-center/) - Housing Market Tracker: Weekly & Monthly. Get a comprehensive overview of the latest U.S. housing ac...

61. [New York Housing Market - Redfin - GitHub](https://github.com/RichieGarafola/Redfin-NewYorkHousingMarket) - To locate the file navigate to Redfin's Data Center. https://www.redfin.com/news/data-center/. Right...

62. [Housing Market Tracker: Weekly & Monthly - Data Center - Redfin](https://www.redfin.com/news/data-center/housing-market/) - Housing Market data measuring prices, supply, demand and other U.S. housing trends, and covers weekl...

63. [Apartment Data and Multifamily Research - RealPage](https://www.realpage.com/analytics/) - RealPage Analytics (formerly MPF Research & Axiometrics) delivers apartment data and trends, news an...

64. [April 2025 Data Update - RealPage](https://www.realpage.com/analytics/april-2025-data-update/) - The U.S. apartment market saw occupancy surge in April 2025, as operators tried to fill vacant units...

65. [October 2025 Data Update - RealPage](https://www.realpage.com/analytics/october-2025-data-update/) - U.S. apartment occupancy fell for a third consecutive month, dipping to 94.9% in October, according ...

66. [Resiliency Continues Across the US Apartment Market - RealPage](https://www.realpage.com/analytics/july-2025-data-update/) - Infographic on U.S. apartment market fundamentals for July 2025, showing rent changes, occupancy rat...

67. [Market Analytics Platform for Multifamily - RealPage](https://www.realpage.com/insights-analytics/market-analytics/) - Market Analytics provides market visibility and performance, enabling property managers to leverage ...

68. [Quarterly Survey of Apartment Market Conditions - NMHC](https://www.nmhc.org/research-insight/quarterly-survey/) - The NMHC Quarterly Survey of Apartment Market Conditions provides a snapshot of the state of the apa...

69. [NMHC Quarterly Survey of Apartment Conditions (January 2026)](https://www.nmhc.org/research-insight/quarterly-survey/2026/nmhc-quarterly-survey-of-apartment-conditions-january-2026/) - Market Tightness Index1, Sales Volume Index2, Equity Financing Index3, Debt Financing Index4. Januar...

70. [Building Permits Survey (BPS) - Census Bureau](https://www.census.gov/permits) - View charts, maps, and graphs from the latest annual release. Annual data for 2025 was released on M...

71. [Building Permits Survey Release Schedule - Census Bureau](https://www.census.gov/construction/bps/schedule.html) - Monthly Releases: New Residential Construction, New Residential Sales, Revised Building Permits, and...

72. [American Community Survey Data via API - Census Bureau](https://www.census.gov/programs-surveys/acs/data/data-via-api.html) - Migration flows between counties, minor civil divisions, and metropolitan areas using ACS 5-year dat...

73. [Yardi Matrix > Matrix Multifamily National Report-August 2025](https://www.yardimatrix.com/Publications/Download/File/7790-MatrixMultifamilyNationalReport-August2025) - Rent Growth Flat in Summer Slowdown Multifamily rents were flat nationally in August, as demand kept...

74. [2026 multifamily reports: Download the latest from Yardi Matrix](https://www.yardi.com/blog/multifamily-reports-yardi-matrix-2026/) - Check out all Yardi Matrix multifamily reports from 2026. We update this page monthly with the lates...

75. [Multifamily rents ended 2025 without growth: Yardi](https://www.multifamilydive.com/news/multifamily-rents-ended-2025-without-growth-yardi/809883/) - Rent prices slumped at the end of 2025, wiping out all the gains from the first half of the year, pe...

76. [Yardi Matrix: Commercial Real Estate Data and Research](https://www.yardimatrix.com) - Yardi Matrix researches and reports on multifamily, affordable housing, student housing, office, ind...

77. [Getting America Back to Work - Kastle Systems](https://www.kastle.com/safety-wellness/getting-america-back-to-work/) - Weekly Average. The Kastle Barometer national weekly average occupancy was also up this week, rising...

78. [Office Occupancy Trends and Insights - Propmodo](https://propmodo.com/office-occupancy-trends-and-insights/) - Office occupancy in 2025 has remained steady, with some cities showing stronger in-office attendance...

79. [Evidence of the New Hybrid Work Pattern - Kastle Systems](https://www.kastle.com/resource/evidence-of-the-new-hybrid-work-pattern/) - The Kastle Back-to-Work Barometer* tracks office occupancy today versus pre-pandemic levels from Feb...

80. [Kastle Back to Work Barometer Hits All-Time Post-Pandemic Highs](https://www.kastle.com/resource/kastle-back-to-work-barometer-hits-all-time-post-pandemic-highs/) - Weekly average occupancy in A+ Class buildings rebounded to 78.8%, essentially back to pre-Thanksgiv...

81. [U.S. Survey of Working Arrangements and Attitudes (SWAA)](https://wfhresearch.com/data/) - The Survey of Working Arrangements and Attitudes (SWAA) is a monthly survey of between 2,500 to 10,0...

82. [WFH Research | Survey of Working Arrangements and Attitudes](https://wfhresearch.com) - Download the latest data from the Survey of Workplace Arrangements & Attitudes (SWAA). Know more. Gl...

83. [U.S. Office Market Dynamics, Q1 2026 - JLL](https://www.jll.com/en-us/insights/market-dynamics/us-office) - Single-asset sales volume reached $11.5 billion in Q1, the highest Q1 total since 2020, growing 40% ...

84. [[PDF] United States: Office Market Dynamics - JLL](https://www.jll.com/content/dam/jllcom/en/us/documents/reports/research-reports/25-insights-us-office-market-dynamics-q2-2025.pdf) - Office-using employment in the private sector was unchanged quarter-over-quarter, with gains of 19,0...

85. [[PDF] United States: Office Market Dynamics - JLL](https://www.jll.com/content/dam/jllcom/en/global/documents/reports/research-reports/25-research-us-office-market-dynamics-q1-2025.pdf) - Leasing volume slowed moderately from post-pandemic highs in Q4, but reached 50.4 million s.f. in Q1...

86. [Insights & Research - CBRE](https://www.cbre.com/insights) - Explore the latest insights and trends in the real estate industry with CBRE. Stay informed and make...

87. [EDGAR filings - SEC.gov](https://www.sec.gov/edgar/browse/?CIK=0001632970) - November 7, 2025 - 10-Q: Quarterly report for quarter ending September 30, 2025 ... SEC's website de...

88. [CMS Data: Home Page](https://data.cms.gov) - Search and download CMS' publicly reported provider data. Explore the site. Medicare Beneficiaries D...

89. [Data - CMS](https://www.cms.gov/newsroom/data) - Data.CMS.gov lets you interactively analyze our datasets in real-time. All datasets are API-enabled,...

90. [Provider Data Catalog - CMS Data](https://data.cms.gov/provider-data) - Explore and download provider data on: Dialysis facilities, Doctors and clinicians, Home health serv...

91. [CMS Public Use Files for Researcher Use - ResDAC](https://resdac.org/cms-public-use-files-for-researcher-use) - The Centers for Medicare & Medicaid Services (CMS) makes PUFs freely available for download. Researc...

92. [Senior Housing Transactions: Market Insights for 2025 - NIC MAP](https://www.nicmap.com/news/nic-map-releases-top-markets-for-senior-housing-transactions-of-2025/) - Explore trends in Senior Housing Transactions, including increased volume and rising prices in 2025 ...

93. [Senior Housing Occupancy Rises in 2Q 2025 - Inventory Growth at ...](https://www.nicmap.com/blog/senior-housing-occupancy-rises-in-2q-2025-inventory-growth-at-record-lows/) - The senior housing occupancy rate for the 31 NIC MAP Primary Markets rose 0.8 percentage points to 8...

94. [The Leading Senior Housing Data & Analytics Platform](https://www.nicmap.com) - Unlock the full power of market analytics in NIC MAP's easy-to-use senior housing data platform, bui...

95. [SEC Filings - Welltower Inc.](https://welltower.com/investors/sec-filings/) - View all filings, annual filings, quarterly filings, current filings, registration statements, secti...

96. [SEC Filings - Healthpeak Properties, Inc. - Investor Relations](https://ir.healthpeak.com/financials/sec-filings/default.aspx) - SEC Filings · 4 filing dated 05/13/2026 in pdf Format Download (opens in new window) · 4 filing date...

97. [Welltower (WELL) 10K Form and Latest SEC Filings 2026 | MarketBeat](https://www.marketbeat.com/stocks/NYSE/WELL/sec-filings/) - Welltower Files Quarterly Report on Apr. 29, 2026. The 10-Q contains Welltower's unaudited quarterly...

98. [Performance Data | U.S. Department of Labor](https://www.dol.gov/agencies/eta/foreign-labor/performance) - The following case disclosure files cover determinations issued between October 1, 2025 and March 31...

99. [Data Refresh Status, When was website Data Updated - H1BGrader](https://h1bgrader.com/data-refresh-status) - August 31st, 2025:H1B LCA data for Q3 of Fiscal Year 2025 from April 2025 to June 2025 added ... Feb...

100. [OFLC Releases Public Disclosure Data and Selected Program ...](https://www.aila.org/library/oflc-releases-public-disclosure-data-and-selected-program-statistics-for-q3-of-fy-2025) - The public disclosure files include all final determinations OFLC issued for these programs during t...

101. [OFLC Releases New Public Data on Foreign Labor Certifications](https://www.envoyglobal.com/news-alert/oflc-releases-new-public-data-on-foreign-labor-certifications/) - Quarterly Application Data: OFLC has published public disclosure files and program statistics for Q3...

102. [Use The Data - National Center for Education Statistics (NCES)](https://nces.ed.gov/ipeds/use-the-data) - Use The Data. Access IPEDS data submitted to NCES through our data tools or download the data to con...

103. [IPEDS - National Center for Education Statistics (NCES)](https://nces.ed.gov/ipeds) - IPEDS is a system of 12 interrelated survey components conducted annually that gathers data from eve...

104. [API documentation - Education Data Explorer - Urban Institute](https://educationdata.urban.org/documentation/) - IPEDS features data on enrollment, program completion, graduation rates, faculty and staff, finances...

105. [2024-25 Memo - IPEDS Data Release Memorandum (Memo)](https://nces.ed.gov/ipeds/survey-components/release-memo?type=fall&year=2025) - For more information about the IPEDS Survey, its 12 components, and data release procedures, visit h...

106. [NCES releases the IPEDS Fall 2024 Provisional Data | IES](https://ies.ed.gov/learn/news/nces-releases-ipeds-fall-2024-provisional-data) - See national results from the Fall 2024 IPEDS data collection, including Institutional Characteristi...

107. [American Community Survey Migration Flows - Census Bureau](https://www.census.gov/data/developers/data-sets/acs-migration-flows.html) - The ACS 5-Year Migration Flow Files. These migration flows are derived from the household and group ...

108. [2024 Data Release New and Notable - Census Bureau](https://www.census.gov/programs-surveys/acs/news/data-releases/2024/release.html) - The 2020-2024 ACS 5-year estimates are scheduled to be released on December 11, 2025. These data wil...

109. [American Community Survey: 5-Year Migration Flows](http://catalog.data.gov/dataset/american-community-survey-5-year-migration-flows) - Migration flows are derived from the relationship between the location of current residence in the A...

110. [SOI tax stats - Migration data | Internal Revenue Service](https://www.irs.gov/statistics/soi-tax-stats-migration-data) - Migration data 2011-2022. Migration data for years 2011-2022 are available for download in Comma Sep...

111. [SOI tax stats - Migration data 2022–2023 | Internal Revenue Service](https://www.irs.gov/statistics/soi-tax-stats-migration-data-2022-2023) - 2022-2023 Migration Data files are available for download in Comma Separated Values files (.csv file...

112. [SOI Tax Stats - U.S. Population State and County Migration Data ...](https://www.datalumos.org/datalumos/project/101745/version/V3/view) - These data are an important source of information detailing the movement of individuals from one loc...

113. [Hotel Data Analytics: STR Insights to Drive Hotel Strategy](https://futureofhospitality.org/hotel-data-analytics-str-insights-to-drive-hotel-strategy/) - Hotel data analytics insights from Smith Travel Research: trends, forecasting tips and AI strategies...

114. [The Data Science Behind theBack to Work Barometer - Kastle Systems](https://www.kastle.com/the-data-science-behind-theback-to-work-barometer/) - ... Barometer's weekly average and deeper insight into return-to-office trends. For example, mid-wee...

115. [United States | OFLC releases Q3 labor certification data for select ...](https://www.bal.com/immigration-news/united-states-oflc-releases-q3-labor-certification-data-for-select-programs-including-perm-and-h-1b-h-2a-and-h-2b-visas/) - The OFLC's Q3 release includes final determinations from Oct. 1, 2024, through June 30, 2025, for pr...

116. [Quarterly Survey of Apartment Construction & Development Activity](https://www.nmhc.org/research-insight/nmhc-construction-survey/) - The Construction Quarterly Survey began in March 2022; the survey was revised in June 2024 and once ...

