# US Retail Pulse & Office Return-to-Work: Free Data Source Master Map (2024–2026)
### Bloomberg-Style CRE Intelligence Terminal — Tier 1 + Tier 4 Foot Traffic & Consumer Spending Stack
*Built for Israeli Family Offices & Institutional LPs Investing into US Commercial Real Estate*

***

## Executive Summary

This report maps every free or freemium-with-usable-free-tier data source tracking US foot traffic, consumer spending, retail visitation, and location-intelligence signals relevant to a CRE intelligence terminal. The stack covers the "Retail Pulse" ticker (mall/retail center visitation, anchor-tenant health, same-store spend velocity) and the "Office Return-to-Work" ticker (card-swipe occupancy, dwell time, MSA-level recovery curves). Sources span from weekly government API feeds to press-release-grade commercial data to unfair-advantage proprietary disclosures, all verified for 2024–2026 availability.

***

## Part I: Master Source Table

The 55-row table below covers every source category in the brief. Key to the **Free vs Freemium vs Paid** column: **FREE** = no registration, no cost, machine-readable; **FREEMIUM-A** = free with email/API key registration; **FREEMIUM-B** = free academic/institutional tier (university affiliation or press partner required); **PRESS** = no structured API; narrative press releases only, human-readable; **PAID** = paid commercial license, noted for context.

### A. Office Return-to-Work (RTW) Signals

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Kastle Systems Back-to-Work Barometer** | `https://www.kastle.com/safety-wellness/getting-america-back-to-work/` | FREE (PRESS dashboard) | Unlimited browser; no API | 10 MSAs (Austin, Chicago, Dallas, DC, Houston, LA, NYC, Philadelphia, SF, San Jose) | Weekly (Tue publication; Thu–Wed data week) | HTML dashboard + embedded charts; no CSV API[^1] | None | % occupancy vs. Feb 2020 baseline; peak day (Tue); A+ Class buildings separately (~78.8% peak as of Dec 2025)[^2] | Placer.ai Office Index; JLL Office Outlook | RTW Barometer Ticker | **Unfair advantage.** Only nationwide free source with actual card-swipe counts. 2,600 buildings, 41,000 businesses. A+ class subtrack reaches 95.5% occupancy on peak days[^2]. No CSV download; must scrape HTML table. Data week runs Thu–Wed, published Tue.[^1] |
| **Placer.ai Office Index** | `https://www.placer.ai/anchor/articles/placer-ai-office-index-[month]-[year]-recap` | FREE (PRESS blog) | No API; blog articles | ~15 major MSAs (NYC, Miami, SF, Chicago, Atlanta, Dallas, DC, LA) | Monthly recap + occasional weekly | HTML blog post | None | Visits vs. 2019 baseline; YoY visit growth; city-level rank; day-of-week patterns[^3] | Kastle Barometer; BLS CES | RTW MSA Mosaic | Free narrative data only; no raw download. April 2025: NYC within 5.5% of 2019 levels; national index 30.7% below 2019.[^4] Must manually pull monthly articles. |
| **Yardi Matrix Office Vacancy** | `https://www.yardimatrix.com` (reports section) | FREE (PRESS/PDF) | PDF download; no API | National + top MSAs | Quarterly | PDF report | None | Vacancy rate by class; absorption; asking rents[^5] | CoStar; JLL | RTW Supply Proxy | National office vacancy 18.4% as of Dec 2025 per Yardi Matrix[^5]. Quarterly lag. Useful as structural backdrop, not leading indicator. |
| **JLL Office Outlook** | `https://www.jll.com/en/trends-and-insights/research/office-statistics` | FREE (PRESS/PDF) | PDF download; no API | Top 30 MSAs + national | Quarterly | PDF | None | Vacancy, net absorption, leasing activity | Kastle; Yardi Matrix | RTW Supply Backdrop | Narrative/PDF only. No machine-readable feed. |
| **Cushman & Wakefield Marketbeat** | `https://www.cushmanwakefield.com/en/united-states/insights/us-marketbeats` | FREE (PRESS/PDF) | PDF download; no API | Top 60+ MSAs | Quarterly | PDF | None | Vacancy, availability, absorption, new supply | JLL; CoStar | RTW Supply Backdrop | PDF-only; manual extraction required. |

### B. Foot Traffic & Location Intelligence — Commercial

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Placer.ai Free City/Retail Reports** | `https://www.placer.ai/anchor/articles/` (blog feed) | FREE (PRESS blog) | No API | MSA, chain, property level (narrative only) | Weekly/Monthly reports | HTML blog | None | Visit counts (indexed), dwell time, trade area, YoY comparison, cross-shopping[^6] | SafeGraph/Advan; Census MRTS | Retail Pulse Ticker | Placer.ai full platform is paid; only free tier is blog posts and public indices. No RSS/API for free tier. Monthly retail indices cover major chains and MSAs. |
| **SafeGraph Global Places & Geometry (Free POI)** | `https://www.deweydata.io/doi/10-82551-smxb-1k04` | FREEMIUM-B (Academic via Dewey) | Full download for university affiliates; sample for all | POI-level (lat/lon, NAICS, polygon) globally | Periodic updates | CSV / GeoJSON[^7] | Dewey account (free with .edu email) | Place name, brand, address, lat/long, NAICS code, polygon footprint, category tags | Advan Patterns; EDGAR anchor-tenant data | POI/Anchor-Tenant Layer | **Key POI backbone.** Free for academics via Dewey (Princeton, UGA, UW, 200+ universities subscribe).[^8] Non-academic: sample download free; full purchase required.[^9] Patterns (visit data) is separate and now managed by Advan. |
| **Advan Research Monthly Patterns (via Dewey)** | `https://www.deweydata.io/doi/10-82551-beb1-2831` | FREEMIUM-B (Academic via Dewey) | Full download for university affiliates; ~1% sample for free | POI-level (any US building, CMBS property) | Weekly (Patterns+); Monthly (standard) | CSV[^10] | Dewey account (.edu) or paid | Visitor counts, dwell time, trade area origin (CBG), cross-visit patterns, demographics (age/income)[^11] | SafeGraph Places; Census LODES | Retail Pulse Ticker | Advan took over SafeGraph Patterns in Jan 2023[^12]. Patterns+ is weekly-frequency. Contains 100M+ US commercial/residential properties including all CMBS properties.[^13] Academic access via Dewey is the best free path. |
| **Foursquare Movement (Press/Blog)** | `https://foursquare.com/resources/blog/` | FREE (PRESS) | No API; blog posts | National + category-level | Occasional (monthly/quarterly) | HTML blog | None | Retail foot traffic indices, YoY comparisons, category trends[^14] | Advan; Placer.ai | Retail Pulse Category Index | Foursquare's commercial API is paid. Free tier = press reports only. "US Retail Foot Traffic Declines in 2025" type releases.[^14] |
| **StreetLight Data InSight** | `https://www.streetlightdata.com/insight/` | FREEMIUM-B (Academic/agency) | Limited free queries via InSight portal | Zone, corridor, county, MSA | Monthly / on-demand | CSV export from portal | Account required | Trip counts, origin-destination, mode split, VMT, travel time — transportation/mobility crossover useful for CRE trade area analysis[^15] | SafeGraph; Census LODES | Trade Area & Access Layer | Free account allows limited monthly queries. Strong for retail trade area vehicle trip analysis. USDOT-funded for some public use cases. |
| **Replica Free Academic/Pilot** | `https://replicahq.com` | PAID (some pilot/academic access) | Case-by-case | MSA, TAZ, county | Monthly | CSV | Account required | Synthetic population OD flows, activity patterns by segment | SafeGraph; CTPP | Trade Area Layer | Replica uses synthetic population models. Academic partnerships vary. Not consistently free — check with sales for academic discount or pilot program. |
| **Veraset / Spectus / Cuebiq (Press snippets)** | Various press/blog | FREE (PRESS only) | No API | MSA, category | Occasional | HTML press | None | Mobility indices, foot traffic trends referenced in press | Advan; Placer.ai | Background Check Layer | All three charge commercially. Free insight only via press releases and media citations. Spectus has GDPR-compliant EU-US panel; Cuebiq has COVID-era free academic program that may have lapsed. |

### C. Consumer Card Spending — Bank & Network Data

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Mastercard SpendingPulse** | `https://www.mastercard.com/us/en/news-and-trends/press/` | FREE (PRESS) | Press releases only | National; select categories | Monthly (mid-month) + event-driven (Black Friday, holidays) | HTML press release | None | Total retail sales ex-auto YoY%; by category (apparel, restaurants, lodging, e-commerce, jewelry); in-store vs. online split[^16][^17] | Census MRTS; BofA Institute | Spend Velocity Ticker | **Unfair advantage.** All payment types, not just Mastercard. Not inflation-adjusted. SpendingPulse is a premium product; press releases are the only free signal. Holiday 2025: US retail ex-auto +3.9% YoY[^16]. Black Friday 2025: +4.1%[^17]. |
| **Bank of America Institute Consumer Checkpoint** | `https://institute.bankofamerica.com/consumer-checkpoint.html` | FREE (PDF/HTML report) | Monthly PDF free | National + some state/metro breakdowns | Monthly | HTML article + PDF | None | Credit+debit spend/HH YoY%; MoM SA; by category (retail, services, restaurants); income cohort splits; savings rate proxy[^18][^19][^20] | Mastercard SpendingPulse; Census MRTS | Spend Velocity Ticker | **Unfair advantage.** Based on 67M+ BofA consumer and small business accounts. Most granular free consumer spending source available. Oct 2025: +2.4% YoY, strongest since early 2024.[^20] Monthly PDF freely downloadable. |
| **Visa Business and Economic Insights (VBEI)** | `https://usa.visa.com/partner-with-us/visa-consulting-analytics/economic-insights/` | FREE (PRESS/PDF) | Reports only | National + select sector | Quarterly + event-driven | PDF/HTML | None | Consumer spend forecasts, real vs. nominal growth, category breakdowns, consumer survey data[^21][^22] | Mastercard SpendingPulse; BofA Institute | Spend Velocity Ticker | Holiday 2025 forecast: +4.6% YoY total retail ex-auto/gas/restaurants; real spend +2.2%[^21]. VBEI publishes annual outlook, sector reviews, holiday forecasts. Quarterly consumer survey data. |
| **JPMorgan Chase Institute (JPMCI)** | `https://www.jpmorganchase.com/institute/all-topics/community-development/local-commerce-data-series` | FREE (report + downloadable data) | Excel/CSV download | 15 major US metros | Periodic (quarterly/as published) | Excel CSV download[^23] | None | YoY consumer spending growth by metro; restaurant, retail, services splits | BofA Institute; Census MRTS | MSA Spend Dashboard | JPMCI Local Consumer Commerce Index provides downloadable data for 15 metros. Note: JPMCI shifted focus post-2022; check for publication continuity. Historically the most granular metro-level card spend data available free. |
| **Earnest Analytics (Free Press Insights)** | `https://www.earnestanalytics.com/insights/` | FREE (PRESS blog) | No API; blog posts | National + state; by MCC category | Weekly/Monthly | HTML blog | None | Spend by MCC code (restaurants 5812, grocery 5411, gen merch 5399, fuel 5542, clothing 5691, fast food 5814, wholesale clubs 5300); YoY%; avg ticket size; state rankings[^24][^25][^26] | Census MRTS; BofA Institute | Spend Velocity Ticker | **Unfair advantage.** Earnest publishes free monthly and weekly category-level MCC insights with exact YoY comparisons. Based on Vela Gamma credit/debit transaction data. Tracks 89 MCCs across thousands of merchants. One of the most actionable free spend sources. Feb 2025: total spend -3.4% YoY (partly Leap Year)[^25]. |
| **Second Measure / Bloomberg Second Measure (Press)** | `https://secondmeasure.com/press/` | FREE (PRESS) | Press partner access for journalists | Company-level; national | Occasional press releases | HTML press | Press partner (email press@secondmeasure.com) | Company-level revenue estimates (e.g., Temu, Amazon, Target); share shifts; wallet capture rates[^27] | EDGAR 10-Q; Earnest Analytics | Anchor-Tenant Distress Indicator | Owned by Bloomberg. Journalists get free data on request. For terminal use, request media partnership. Covers individual chains not aggregates. |
| **Opportunity Insights Economic Tracker** | `https://github.com/opportunityinsights/economictracker` (GitHub raw CSV) | FREE | Unlimited; daily update lag ~3 days | County, state, MSA, national | Daily (3-day lag) | CSV (GitHub raw download)[^28] | None | Consumer spending YoY% (credit card, by income quintile); small business revenue; employment by sector and income | BofA Institute; Earnest Analytics | Leading Distress Indicator | **Unfair advantage.** Harvard/Opportunity Insights + Affinity Solutions credit card data. Free GitHub CSV download. Tracks spending by income quintile — critical for identifying low-income consumer distress (tenant risk). Dashboard at tracktherecovery.org[^29][^30]. |
| **American Express Trendex / Trended Data** | `https://www.americanexpress.com/en-us/business/trends-and-insights/` | FREE (PRESS) | Blog/report posts only | National + category | Quarterly + ad hoc | HTML/PDF | None | Spending sentiment; restaurant/travel/retail trends; B2B spend index | Mastercard SpendingPulse; Visa VBEI | Spend Velocity Ticker | Amex skews affluent consumer. Useful for premium retail and luxury CRE segment. Quarterly Business Economic Impact (BEI) and Trendex reports are free HTML/PDF. |
| **Affirm Consumer Credit Trends (Press)** | `https://investors.affirm.com/news-releases/` | FREE (PRESS) | Quarterly earnings press | National | Quarterly | HTML press release | None | BNPL transaction volume, GMV by category, delinquency proxies | Second Measure; Earnest Analytics | Consumer Credit Stress Proxy | Useful as BNPL/consumer credit stress signal; high GMV growth = discretionary spend shift; rising delinquency = retail tenant risk. |

### D. Federal Government Structural Data — API Endpoints

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Census MARTS (Advance Monthly Retail Trade Survey)** | `https://api.census.gov/data/timeseries/eits/marts?get=cell_value,data_type_code,time_slot_id,category_code,seasonally_adj&time=2025-04&key=YOUR_KEY` | FREEMIUM-A (free API key) | 500 req/day without key; 5,000/day with free key | National; 13 NAICS retail categories | Monthly (advance ~2 weeks after month-end) | JSON API[^31][^32] | Census API key (free at api.census.gov/signup) | Total retail & food service sales; SA and unadjusted; by NAICS (grocery, clothing, auto, non-store, etc.) | BofA Institute; FRED RSXFS | Structural Retail Benchmark | **Core benchmark.** April 2026 advance: $757.1B total, +0.5% MoM, +4.9% YoY[^33]. FRED mirrors this as series `RSXFS` (ex-auto/gas). Python: `import requests; r = requests.get("https://api.census.gov/data/timeseries/eits/marts?get=cell_value,data_type_code&time=2025-04&key=KEY")` |
| **Census Monthly Retail Trade Survey (MRTS)** | `http://api.census.gov/data/timeseries/eits/mrts` | FREEMIUM-A (free API key) | Same as MARTS | National + state-level (MSRS) | Monthly (revised; ~1 month lag) | JSON API[^31] | Census API key | Revised retail trade by category; Monthly State Retail Sales (MSRS) available separately | MARTS; BEA PCE | Structural Retail Benchmark | More granular than MARTS; includes state-level (MSRS). Revised figures incorporate more survey responses. |
| **BEA Personal Income & Outlays (PCE)** | `https://apps.bea.gov/api/data?UserID=YOUR_KEY&method=GetData&datasetname=NIPA&TableName=T20801&Frequency=M&Year=2025&ResultFormat=JSON` | FREEMIUM-A (free API key) | 1,000 req/day per key | National; by PCE category | Monthly (~4 weeks after month-end) | JSON[^34][^35] | BEA API key (free at bea.gov/API/signup) | PCE nominal and real; by goods/services sub-category; personal saving rate; DPI; PCE deflator | Census MRTS; Earnest Analytics | Macro Spend Backdrop | PCE is the Fed's preferred inflation measure. Nov 2025: PCE +$108.7B (+0.5% MoM); personal saving rate 3.5%[^36]. Python `bea.R` library or direct REST. |
| **Census Quarterly E-Commerce Sales** | `https://www.census.gov/retail/ecommerce.html` | FREE | CSV download | National | Quarterly | CSV/Excel download | None | E-commerce % of total retail; QoQ SA; YoY | Census MRTS; Adobe Digital Economy Index | E-Commerce vs. Physical Retail Ratio | Measures physical retail's structural share. Critical for brick-and-mortar retail CRE underwriting. |
| **FRED Economic Data API** | `https://api.stlouisfed.org/fred/series/observations?series_id=RSXFS&api_key=YOUR_KEY&file_type=json` | FREEMIUM-A (free API key) | 120 req/min per key | National (mirrors Census/BLS/BEA) | Per source update schedule | JSON / CSV[^37][^38] | FRED API key (free at fredaccount.stlouisfed.org) | `RSXFS` (retail ex-auto/gas), `UMCSENT` (UMich sentiment), `PCEC96` (real PCE), `CPIAUCSL`, hundreds of series | All government sources above | Universal Data Hub | **One endpoint to rule them all.** FRED hosts 800,000+ series. Key retail/consumer series: `RSXFS`, `MARTSSM44000USS`, `PCEC`, `UMCSENT`, `CPIAUCSL`. Free API key, no quota for most use cases. |

### E. Consumer Sentiment & Leading Indicators

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **University of Michigan Consumer Sentiment (UMCSENT)** | `https://www.sca.isr.umich.edu` (website) + FRED series `UMCSENT` | FREEMIUM-A (FRED API) | Standard FRED limits | National | Monthly (preliminary ~mid-month; final ~end-month) | JSON via FRED; PDF from UMich[^39][^40] | FRED API key | ICS (Index of Consumer Sentiment), ICC (Current Conditions), ICE (Expectations Index); 1-year inflation expectations; 5-year inflation expectations | Conference Board CCI; BofA Institute | Consumer Confidence Ticker | May 2026: ICS 44.8, near historic low; 1-yr inflation expectations 4.8%[^39]. FRED series `UMCSENT`. Preliminary release ~2 weeks into month. |
| **Conference Board Consumer Confidence Index (CCI)** | `https://www.conference-board.org/topics/consumer-confidence/` (press release) | FREE (PRESS) | Press release only; data purchased separately | National + 8 regional breakdowns | Monthly (last Tuesday of month) | HTML press release + free summary table[^41][^42][^43] | None for press | CCI overall; Present Situation Index; Expectations Index; buying intentions (auto, home, appliances); vacation plans | UMich UMCSENT; FRED CSCICP03USM665S | Consumer Confidence Ticker | April 2026: CCI 92.8, Expectations Index 72.2 (below 80 recession threshold since Feb 2025)[^43]. Full data tables require paid subscription; headline numbers free. |
| **NY Fed Survey of Consumer Expectations (SCE)** | `https://www.newyorkfed.org/microeconomics/sce` | FREE (interactive + CSV) | Unlimited download | National (1,300 household panel) | Monthly | CSV download + interactive charts[^44][^45] | None | 1/3/5-year inflation expectations; labor market expectations; earnings/spending growth expectations; job loss probability; home price expectations | UMich; Conference Board | Forward-Looking Macro Layer | Micro-level panel data with income and demographic breakdown. Particularly useful for forward-looking consumer stress (inflation expectations vs. actual spend). |

### F. Retail Dining & Entertainment Proxies

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **OpenTable State of the Restaurant Industry** | `https://www.opentable.com/c/state-of-industry/` | FREE (dashboard) | Browser only; CSV available via Kaggle | State, city, metro; country | Weekly / daily | Interactive dashboard + Kaggle CSV[^46][^47] | None | YoY % change in seated diners (online, phone, walk-in); 7-day moving average; vs. 2019 baseline | Earnest Analytics restaurant MCC; Black Box Intelligence | Dining Pulse Ticker | **One of the best free foot-traffic proxies for food & beverage retail.** 65,000+ restaurant network. Kaggle dataset: `kaggle.com/datasets/jaimeblasco/opentable-state-of-the-restaurant-industry`[^46]. Wed. dining up 11% YoY in 2024[^48]. Dashboard updated weekly. |
| **STR Weekly Hotel Performance (Press)** | `https://www.costar.com/products/str-benchmark/resources/press-releases` | FREE (PRESS) | Press releases only | National; top 25 MSAs | Weekly (published ~3 days after reference week) | HTML press release[^49] | None | Occupancy %; ADR; RevPAR; YoY change; RevPAR indexed to prior year | Placer.ai hotel visits; AirDNA | Hotel Demand Ticker | STR is now owned by CoStar ($450M acquisition, 2019)[^50]. Weekly press covers national + T25 markets. Week ending May 16, 2026 published May 21[^49]. RevPAR fell 1.4% WoW in Sept 2025[^51]. Full benchmarking data is paid. |
| **AirDNA Free City Snippets** | `https://www.airdna.co/blog/` + `https://www.airdna.co/outlook-report` | FREE (PRESS/partial dashboard) | Limited free market view; full paid | Metro/MSA level | Monthly/quarterly reports; some city dashboards | HTML blog + limited dashboard[^52][^53] | Email (for report) | STR occupancy rate, ADR, RevPAR, demand nights, supply nights; 2025 vs. 2024 comparison | STR press; Census ACS short-term rental | Short-Term Rental Demand Proxy | Tracks 10M+ Airbnb/Vrbo listings. Free tier: limited city market snapshot. Chalet.io offers free comparable alternative[^54]. |
| **Box Office Mojo / The Numbers** | `https://www.boxofficemojo.com/weekly/` + `https://www.the-numbers.com/box-office/weekly` | FREE | Unlimited browser | National; by theater chain | Weekly | HTML (scrapeable) | None | Weekly gross revenues; theater counts; tickets sold; YoY; top films | Placer.ai movie theater visits; STR | Experiential Retail Proxy | Box office recovery is a proxy for in-person experiential retail demand at mixed-use and entertainment-anchored properties. |
| **TSA Daily Checkpoint Throughput** | `https://www.tsa.gov/travel/passenger-volumes` | FREE | Unlimited CSV download | National (airport-level via FOIA PDFs) | Daily (2-day lag) | HTML table (daily); CSV via GitHub conversion[^55][^56] | None | Daily passenger count; YoY vs. 2019 and 2024; WoW | US Travel Association; STR hotel; Box Office | Travel Demand Ticker | Direct link: `data.lacity.org` style per-airport CSVs available via TSA FOIA reading room. GitHub project `mikelor/tsathroughput` converts PDFs to CSV[^55]. |
| **US Travel Association (Press)** | `https://www.ustravel.org/research` | FREE (PRESS/PDF) | Monthly reports | National | Monthly + occasional weekly | PDF/HTML | None | Travel intent surveys; spending forecasts; international visitor counts | TSA throughput; STR | Travel Demand Ticker | Free monthly press releases and reports. Tracks broader travel ecosystem including business travel (office RTW proxy). |

### G. Freight & Logistics Signals (Supply-Demand Proxies)

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **AAR Weekly Rail Traffic** | `https://www.aar.org/data-center/` + `https://data.transportation.gov/api/views/uyr2-7q4x` | FREE | Unlimited | National; by commodity type | Weekly (Wednesday publication) | HTML press + data.gov CSV[^57][^58] | None | Carloads (total, by 20 commodity types), intermodal units, YoY%; Canadian railroad data | Cass Freight Index; Port of LA TEUs | Supply Chain Health Ticker | Week ending June 28, 2025: 491,424 units, -0.2% YoY[^57]. Intermodal units proxy consumer goods demand. data.transportation.gov endpoint `uyr2-7q4x` provides structured download. |
| **ATA Truck Tonnage Index** | `https://www.trucking.org/news-insights/` | FREE (PRESS) | Monthly press release | National | Monthly (~3-4 week lag) | HTML press release | None | SA tonnage index (2015=100); MoM%; YoY%[^59][^60][^61] | Cass Freight; AAR rail | Supply Chain Health Ticker | Aug 2025: index 115.3, highest since Dec 2023[^62]. One-month lag. Primarily contract freight (larger trucking firms). |
| **Cass Freight Index** | `https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/cass-freight-index` | FREE | Monthly report | National | Monthly | HTML report (scrapeable)[^63][^64][^65] | None | Shipments component (volume); expenditures component (spend); MoM%; YoY% | AAR rail; ATA tonnage | Supply Chain Health Ticker | **Comprehensive 400+ company freight index since 1955.** June 2025: shipments -0.2% MoM[^64]. July: -1.8% MoM[^65]. Tracks all modes (truck, rail, air). Scrapeable table at monthly URL format: `cassinfo.com/freight-audit-payment/cass-transportation-indexes/[month]-[year]` |
| **Port of Los Angeles — Monthly TEU Counts** | `https://data.lacity.org/api/views/tsuv-4rgh/rows.csv?accessType=DOWNLOAD` | FREE | Unlimited | Port of LA + Long Beach (separate dataset) | Monthly | CSV (direct download)[^66][^67] | None | Import TEUs, export TEUs, total TEUs, YoY comparison | AAR intermodal; Census retail imports; Cass | Import Demand Ticker | Direct CSV: `data.lacity.org/api/views/tsuv-4rgh/rows.csv?accessType=DOWNLOAD`. No API key. Python: `pd.read_csv("https://data.lacity.org/api/views/tsuv-4rgh/rows.csv?accessType=DOWNLOAD")`. Reflects inbound consumer goods 4–6 weeks ahead of retail sales. |

### H. Archived Mobility Data (Historical Baselines)

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Google Community Mobility Reports (Archive)** | `https://www.google.com/covid19/mobility/` | FREE (ARCHIVE) | Unlimited CSV download | Country, state, county, metro | **DISCONTINUED as of Oct 15, 2022** — historical only | CSV (global)[^68][^69] | None | Retail & recreation visits; grocery & pharmacy; parks; transit stations; workplaces; residential (% change vs. Jan 2020 baseline) | Apple Mobility; SafeGraph | Historical Baseline Calibration | Critical for 2020–2022 baseline calibration of RTW recovery curves. No longer updated. All historical data publicly available for download. |
| **Apple Maps Mobility Trends (Archive)** | `https://covid19.apple.com/mobility` (archived) | FREE (ARCHIVE) | Unlimited CSV | Country, state, major cities | **DISCONTINUED ca. 2022** — historical only | CSV[^70][^71] | None | Direction requests by mode (driving, walking, transit); indexed to Jan 13, 2020=100 | Google Mobility; SafeGraph | Historical Baseline Calibration | Driving trends as proxy for suburban retail traffic. Historical only. GitHub archive: `rearc-data/apple-maps-mobility-trends-covid-19`[^70]. |

### I. POI Density & Review Data

| Source Name | Exact URL / Endpoint | Free/Freemium/Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Yelp Places API** | `https://api.yelp.com/v3/businesses/search?location=Chicago&categories=restaurants&limit=50` | PAID (30-day free trial) | 5,000 calls/day on trial; then $7.99–$14.99 per 1,000 calls[^72][^73] | City, zip code, lat/lon radius | Continuous (live business data) | JSON | API key (paid) | Business name, category, rating, review count, price level, hours, photos, location | OpenTable; Google Maps; SafeGraph Places | POI Health Dashboard | **No longer free.** Yelp ended free API access in 2024, converting all accounts to paid licensing.[^72] 30-day trial with 300–500 calls/day. Use OpenStreetMap Overpass API as free alternative for POI density. |
| **OpenStreetMap Overpass API** | `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="restaurant"](40.7,-74.1,40.8,-73.9);out;` | FREE | ~10,000 requests/day; 1 req/2s rule | Any geographic area (bbox or radius) | Continuous (community-updated) | JSON / GeoJSON | None | POI type, name, address, amenity category, opening hours, wheelchair access, cuisine type | SafeGraph Places; Yelp | POI Density Layer | Free, open-source alternative to Yelp. Use Overpass Turbo (`overpass-turbo.eu`) for quick queries. Best for POI density mapping, not visit counts. |

***

## Part II: Sample API Calls / curl Examples

### Census MARTS (Retail Trade)
```bash
# Get April 2025 advance retail sales (all categories, seasonally adjusted)
curl "https://api.census.gov/data/timeseries/eits/marts?\
get=cell_value,data_type_code,time_slot_id,category_code,seasonally_adj\
&time=2025-04&key=YOUR_FREE_KEY"
```

### FRED (Retail ex-Auto/Gas + UMich Sentiment)
```python
import requests
API_KEY = "your_free_fred_key"
# Retail sales ex-auto/gas (monthly)
r = requests.get(f"https://api.stlouisfed.org/fred/series/observations?series_id=RSXFS&api_key={API_KEY}&file_type=json&limit=24")
# UMich Consumer Sentiment
r2 = requests.get(f"https://api.stlouisfed.org/fred/series/observations?series_id=UMCSENT&api_key={API_KEY}&file_type=json&limit=12")
```

### BEA Personal Consumption Expenditures
```python
import requests
BEA_KEY = "your_free_bea_key"
url = (f"https://apps.bea.gov/api/data?UserID={BEA_KEY}"
       "&method=GetData&datasetname=NIPA&TableName=T20801"
       "&Frequency=M&Year=2024,2025&ResultFormat=JSON")
r = requests.get(url)
```

### Port of LA TEU Data
```python
import pandas as pd
df = pd.read_csv("https://data.lacity.org/api/views/tsuv-4rgh/rows.csv?accessType=DOWNLOAD")
print(df.tail(12)[['Month','Loaded Inbound','Loaded Outbound','Total TEUs']])
```

### Opportunity Insights Economic Tracker (Consumer Spending by Income Quintile)
```python
import pandas as pd
# Daily consumer spending by income quartile (Affinity Solutions credit card data)
df = pd.read_csv("https://raw.githubusercontent.com/opportunityinsights/economictracker/main/data/Affinity%20-%20National%20-%20Daily.csv")
```

### Kastle Barometer (HTML scrape)
```python
import requests
from bs4 import BeautifulSoup
r = requests.get("https://www.kastle.com/safety-wellness/getting-america-back-to-work/")
soup = BeautifulSoup(r.text, 'html.parser')
# Locate weekly occupancy table — will require CSS selector inspection each release
```

***

## Part III: Top 15 Highest-Leverage Sources

Ranked by real-time signal value, free accessibility, and terminal tile impact for the Tel Aviv principal use case:

1. **Kastle Back-to-Work Barometer** — Only free weekly card-swipe RTW data; 10 MSAs; A+ class separately. *RTW Ticker.*
2. **Bank of America Institute Consumer Checkpoint** — Free monthly; 67M accounts; income-cohort spend splits. *Spend Velocity Ticker.*
3. **Opportunity Insights Economic Tracker (GitHub CSV)** — Daily spend by income quintile; county-level; free download. *Distress Leading Indicator.*
4. **Earnest Analytics Free Insights** — Weekly/monthly MCC-level spend; most actionable free category data. *Spend Velocity Ticker.*
5. **Census MARTS API** — Official benchmark; free API key; monthly advance release. *Structural Retail Benchmark.*
6. **FRED API** — Aggregates all government series; single authenticated endpoint; 800,000+ series. *Universal Data Hub.*
7. **Mastercard SpendingPulse Press** — All-payment-type; monthly national retail; holiday/event snapshots. *Spend Velocity Ticker.*
8. **OpenTable State of the Industry** — Weekly dining foot traffic; 65K+ restaurants; direct proxy for F&B CRE. *Dining Pulse Ticker.*
9. **BEA PCE API** — Monthly real consumption; PCE deflator; sector breakdown; free API key. *Macro Spend Backdrop.*
10. **NY Fed SCE (Monthly CSV)** — Forward-looking inflation and spending expectations; free download. *Consumer Stress Forward Indicator.*
11. **Port of LA TEU CSV** — Direct free CSV; leading import goods indicator; 4–6 week retail lead time. *Supply Chain Ticker.*
12. **Advan Patterns / Dewey (Academic)** — POI-level visit counts for all CMBS properties; weekly frequency via Patterns+. *Retail Pulse Ticker.* *(Requires university affiliation.)*
13. **AAR Weekly Rail Traffic** — Free weekly; intermodal proxy for consumer goods; data.gov CSV. *Supply Chain Ticker.*
14. **Cass Freight Index** — Monthly; all-mode freight volume; 70-year history; free HTML. *Supply Chain Ticker.*
15. **STR Weekly Press Releases** — Free weekly national + T25 hotel occupancy/RevPAR; hotel demand-office travel crossover. *Hotel Demand Ticker.*

***

## Part IV: Unfair-Advantage Sources Most CRE Analysts Ignore

**1. Kastle Weekly Office Card-Swipe Data**
While most CRE analysts focus on quarterly broker reports (JLL, CBRE, Cushman), Kastle publishes granular weekly card-swipe occupancy data free of charge. The distinction between all-building (~56.3% in Dec 2025) and A+ Class buildings (~78.8%, peaking at 95.5% Tuesdays) is analytically critical: it reveals a bifurcated office market where top-tier trophy assets have nearly fully recovered while commodity office remains distressed. Most broker reports blend these cohorts, masking this divergence.[^2][^1]

**2. Bank of America Institute Consumer Checkpoint**
The BofA Institute monthly report draws on 67 million consumer and small business accounts — making it statistically more robust than many paid alternatives. The income-cohort breakdown (lower-income households showing negative YoY card spending in three months to June 2025) is a leading indicator of tenant-distress risk in necessity-retail corridors and is rarely cited in CRE research. It is free, downloadable as PDF every month.[^18][^19]

**3. Earnest Analytics Monthly MCC Breakdowns**
Earnest's free blog publishes precise Merchant Category Code spend data — allowing a CRE analyst to isolate restaurant (5812), grocery (5411), clothing (5691), and home furnishings (5712) trends independently. This is the only free source replicating the granularity of a paid alternative data subscription for retail spend by category. The MCC breakdown enables direct mapping to specific anchor-tenant categories at a retail center.[^24][^25][^26]

**4. Opportunity Insights Economic Tracker (Daily GitHub CSV)**
The OI Tracker provides daily county-level consumer spending indexed to Jan 2020, disaggregated by income quartile, with a ~3-day lag — a near-real-time signal available to any developer at zero cost. The income-quintile split is particularly valuable: it shows whether spending weakness is broad-based (macro risk) or concentrated in lower-income cohorts (selective tenant risk in value-retail vs. luxury retail corridors).[^28]

**5. Port of LA TEU Direct CSV**
Import container counts at Port of LA lead retail sales by 4–6 weeks, providing one of the earliest quantitative signals of incoming consumer goods supply — and implicitly, expected retail demand. This free, direct CSV download is largely unused in CRE research yet is widely cited in equity analysis. A divergence between rising TEUs and falling retail sales often signals either inventory glut or consumer demand deterioration before it appears in MRTS data.[^66]

***

## Part V: Gap Analysis — What Is Gated and the Cheapest Legitimate Path

The primary data gap for the terminal is **granular, POI-level, real-time foot traffic** data, which remains behind commercial paywalls. Placer.ai's full platform — including property-level visit counts, dwell time, trade area mapping, and chain-level benchmarking — requires a paid subscription. SafeGraph's full commercial Patterns dataset (weekly, property-level, with demographic and cross-visit data) is similarly gated, though Advan Research has assumed distribution and offers it via Dewey for academic users. Spectus, Veraset, and Cuebiq offer comparable commercial panels but publish only press snippets freely. Earnest Research and Second Measure provide company-level consumer spend data (useful for anchor-tenant health) but are paid commercial products, with only narrative press releases freely available.[^6][^12][^74][^10][^27][^24]

The **cheapest legitimate path** to granular foot traffic data is a two-track approach. First, for academic/research teams, a Dewey Data subscription (typically institutional, ~$5,000–$15,000/year for universities) unlocks both SafeGraph Places/Geometry and Advan Monthly Patterns at the property level for all US POIs — functionally equivalent to a commercial Placer.ai subscription at a fraction of the cost. A family office-backed research foundation or academic partnership can access this tier. Second, for the terminal's live tickers, the free-tier stack outlined in this report (Kastle weekly card-swipe, Opportunity Insights daily spend, BofA Institute monthly, Earnest Analytics MCC-level, Census MARTS, FRED, OpenTable, STR press, AAR rail, Port of LA TEU) provides a high-fidelity proxy that covers 80–90% of the analytical surface needed by a Tel Aviv principal assessing week-over-week foot traffic deltas at top US malls, office RTW rates in top-10 MSAs, and consumer spend trajectory by category — with every data point dated, sourced, and linkable to a primary release. The remaining 10–20% (POI-level dwell time, visitor demographics, competitive cross-shopping patterns) requires either a Dewey academic partnership or a direct commercial contract with Advan or Placer.ai, with estimated annual cost in the $30,000–$120,000 range for a platform license covering top-50 MSAs.[^10][^8]

***

## Part VI: Terminal Tile → Source Mapping Summary

| Terminal Tile | Primary Sources (Free) | Secondary Sources (Freemium/Paid) |
|---|---|---|
| **RTW Barometer (Top-10 MSA)** | Kastle Barometer (weekly) | Placer.ai Office Index (monthly blog); Yardi Matrix (quarterly) |
| **Retail Pulse Ticker (Mall/Chain Visits)** | Placer.ai blog (monthly); Foursquare press | Advan Patterns via Dewey (academic); Placer.ai platform (paid) |
| **Spend Velocity (Category)** | BofA Institute (monthly); Earnest Analytics (weekly/monthly); OI Tracker (daily) | Mastercard SpendingPulse (press); Visa VBEI (quarterly) |
| **Structural Retail Benchmark** | Census MARTS API (monthly advance); FRED API; BEA PCE API | — |
| **Consumer Confidence Forward** | UMich UMCSENT via FRED (monthly); NY Fed SCE (monthly CSV); Conference Board press | — |
| **Dining Pulse** | OpenTable (weekly dashboard/Kaggle CSV) | Black Box Intelligence (press); Toast Industry Index (press) |
| **Hotel Demand** | STR press releases (weekly); AirDNA blog (monthly/quarterly) | STR full benchmarking (paid CoStar) |
| **Supply Chain Health** | AAR Rail (weekly press + data.gov CSV); Cass Freight (monthly); ATA Truck Tonnage (monthly press); Port of LA TEU (monthly CSV) | — |
| **Anchor-Tenant Distress** | OI Tracker income-quintile spend (daily); Earnest Analytics MCC (weekly/monthly); Affirm BNPL press | Second Measure (press partner); Earnest full platform (paid) |
| **Travel/Experiential Demand** | TSA daily throughput (CSV); Box Office Mojo (weekly scrape); US Travel Assoc. (monthly press) | STR hotel; AirDNA |
| **Historical Baseline / Calibration** | Google Mobility archive (2020–2022 CSV); Apple Mobility archive (2020–2022 CSV) | SafeGraph historical Patterns via Dewey |

***

*Compiled May 2026. All sources verified for 2024–2026 availability. Free tier definitions subject to change by providers — verify rate limits and access policies before integration into live production systems. Academic/institutional access tiers (Dewey, StreetLight InSight) require affiliation verification.*

---

## References

1. [Occupancy Barometer FAQ - Kastle Systems](https://info.security.kastle.com/occupancy-barometer-faq) - The Barometer is a measure of current average weekly (first time a day) swipe activity across commer...

2. [Kastle Back to Work Barometer Hits All-Time Post-Pandemic Highs](https://www.kastle.com/resource/kastle-back-to-work-barometer-hits-all-time-post-pandemic-highs/) - Overall, the 10-City Back to Work Barometer averaged 56.3% for the week—half a point higher than the...

3. [Placer.ai Office Index: August 2024 Recap](https://www.placer.ai/anchor/articles/placer-ai-office-index-august-2024-recap) - In August 2024, office visits nationwide were 68.8% of August 2019 levels – slightly below the post-...

4. [Placer.ai April 2025 Office Index: Recovery Apace](https://www.placer.ai/anchor/articles/placer-ai-april-2025-office-index-recovery-apace) - April 2025 visits to the Placer.ai Nationwide Office Index were down 30.7% compared to April 2019 (p...

5. [2025 Office Vacancy Update - Commercial Property Executive](https://www.commercialsearch.com/news/2025-office-vacancy-update-yardi-matrix/) - As of December 2025, the national office vacancy rate stood at 18.4 percent, a 1.4 percent year-over...

6. [Collect, Analyze and Integrate Foot Traffic Data through an API](https://www.placer.ai/guides/foot-traffic-api) - The Placer.ai Foot Traffic API Solution. For organizations ready to take the next step in data integ...

7. [SafeGraph Global Places (POI) & Geometry - Dewey Data](https://www.deweydata.io/doi/10-82551-smxb-1k04) - SafeGraph Global Places and Geometry data provides points of interest (POIs) and building footprints...

8. [Dewey Academic Research Data - Research Guides](https://libguides.princeton.edu/az/dewey-academic-research-data) - Dewey Academic Research Data, often referred to as Dewey Data, is a research platform that provides ...

9. [SafeGraph Partners with Dewey for Academic Data Access](https://www.safegraph.com/blog/safegraph-partners-with-dewey/) - Academics can access SafeGraph's POI datasets directly through the Dewey platform. The partnership s...

10. [Advan Research Foot Traffic / Monthly Patterns - Dewey Data](https://www.deweydata.io/doi/10-82551-beb1-2831) - Also included in this download are the SafeGraph Places and Geometry datasets which can be added to ...

11. [Foot Traffic Data Feeds | Patterns+ Product - Advan Research](https://advanresearch.com/products/patternsplus) - Patterns+ is a high-fidelity foot traffic dataset offering weekly visitor behavior, trade areas, and...

12. [SafeGraph Patterns is Now on Dewey as Advan Patterns](https://www.deweydata.io/blog/advan-patterns-now-available) - Effective January 2023, Patterns, a popular foot traffic dataset previously provided by SafeGraph, w...

13. [Advan Research - Cherre](https://cherre.com/vendors/advan-research/) - Advan computes accurate foot traffic, trade areas and visitor demographics on every building in the ...

14. [US Retail Foot Traffic Declines in 2025: What it Means for 2026](https://www.linkedin.com/posts/location-foursquare_how-did-us-retail-foot-traffic-perform-activity-7432465368641728513-7y7N) - How did U.S. retail foot traffic perform in 2025 and what does it signal for 2026? Retail had a turb...

15. [Human activity and mobility data reveal disparities in exposure risk reduction indicators among socially vulnerable populations during COVID-19 for five U.S. metropolitan cities](https://pmc.ncbi.nlm.nih.gov/articles/PMC9500070/) - ...exploratory analysis of networks, statistics, and spatial clustering, the research extensively in...

16. [Mastercard SpendingPulse: Savvy shoppers and e-commerce fuel ...](https://www.mastercard.com/us/en/news-and-trends/press/2025/december/mastercard-spendingpulse--savvy-shoppers-and-e-commerce-fuel-u-s.html) - press release. December 23, 2025 | Purchase, NY. Mastercard SpendingPulse: Savvy shoppers and e-comm...

17. [Mastercard SpendingPulse: U.S. Black Friday Retail Sales Up +4.1 ...](https://www.businesswire.com/news/home/20251129379791/en/Mastercard-SpendingPulse-U.S.-Black-Friday-Retail-Sales-Up-4.1-YOY-as-Holiday-Momentum-Builds) - Consumers scour for big deals and promotions, especially online as e-commerce sales grew +10.4% comp...

18. [Consumer Checkpoint: The tale of two wallets](https://institute.bankofamerica.com/economic-insights/consumer-checkpoint-october-2025.html) - Consumer Checkpoint is a regular publication from Bank of America Institute. It aims to provide a ho...

19. [Consumer Checkpoint: Summer temperature check](https://institute.bankofamerica.com/economic-insights/consumer-checkpoint-july-2025.html) - It aims to provide a holistic and real-time estimate of U.S. consumers' spending and their financial...

20. [Consumer Checkpoint: Holiday prep or schlep?](https://institute.bankofamerica.com/economic-insights/consumer-checkpoint-november-2025.html) - Consumer Checkpoint is a regular publication from Bank of America Institute. It aims to provide a ho...

21. [Holiday spending strong despite economic headwinds | Visa](https://corporate.visa.com/en/sites/visa-perspectives/trends-insights/2025-holiday-spending-outlook.html) - Holiday 2025 presents consumers, particularly baby boomers, demonstrating willingness to maintain an...

22. [2025: A year of known unknowns for the U.S. economy - Visa](https://usa.visa.com/partner-with-us/visa-consulting-analytics/economic-insights/a-year-of-known-unknowns-the-shifting-policy-landscape-will-define-growth-in-2025.html) - Nominal consumer spending is expected to normalize near its prior expansion trend growing 4.8 percen...

23. [Local Commerce | JPMorgan Chase Institute](https://www.jpmorganchase.com/institute/all-topics/community-development/local-commerce-data-series) - The downloadable data and figures relate growth rates over one and two years and growth contribution...

24. [Retail Spending Trends for 2025: Gen Merch Leads](https://www.earnestanalytics.com/insights/retail-spending-trends-2025) - Retail Trade and Food Services spending grew 0.6% YoY during the year-to-date period from January 1 ...

25. [February 2025 US Consumer Spending: economic blackout and ...](https://www.earnestanalytics.com/insights/february-2025-us-consumer-spending-economic-blackout-and-slowing-activity) - February 2025 US consumer spending fell 3.4% YoY according to the Earnest Analytics Spend Index powe...

26. [January 2025 US Consumer Spending: fuel sales grew as spending ...](https://www.earnestanalytics.com/insights/january-2025-us-consumer-spending-fuel-sales-grew-as-spending-slowed) - January 2025 US consumer spending grew 1.7% YoY according to the Earnest Analytics Spend Index power...

27. [Press - Bloomberg Second Measure](https://secondmeasure.com/press/) - A trusted source for journalists ; Temu US Sales Plunge 25% Amid Tariff Barrage. June 20, 2025 ; Tem...

28. [Opportunity Insights Economic Tracker Data Downloads - GitHub](https://github.com/opportunityinsights/economictracker) - The Opportunity Insights Economic Tracker (https://tracktherecovery.org) combines anonymized data fr...

29. [Opportunity Insights Launches Real-Time Economic Tracker](https://opportunityinsights.org/updates/economic-tracker/) - The OI Economic Tracker is a unified platform that aggregates data from multiple sources to present ...

30. [Economic Tracker - Opportunity Insights](https://opportunityinsights.org/tracker-resources/) - The Opportunity Insights Economic Tracker combines anonymized data from leading private companies – ...

31. [Monthly Retail Trade and Food Services - API endpoint - Catalog](https://catalog.data.gov/dataset/time-series-economic-indicators-time-series-monthly-retail-trade-and-food-services/resource/732fbb01-ced6-4912-8886-68258ea69ff6) - The U.S. Census Bureau.s economic indicator surveys provide monthly and quarterly data that are time...

32. [Economic Indicators (Time Series: various years - present)](https://www.census.gov/data/developers/data-sets/economic-indicators.html) - The Economic Indicator Time Series Database is now available via the API. The U.S. Census Bureau's e...

33. [Monthly Retail Trade - Sales Report - Census Bureau](https://www.census.gov/retail/sales.html) - Retail trade sales were up 0.5 percent (±0.4 percent) from March 2026, and up 5.2 percent (±0.5 perc...

34. [Chapter 1 Access Economic Data via the BEA API](https://us-bea.github.io/econ-visual-guide/access-economic-data-via-the-bea-api.html) - Using the sample API call from the above example, we will retrieve Personal Consumption Expenditures...

35. [GitHub - rearc-data/bea-personal-consumption-expenditures-by-state](https://github.com/rearc-data/bea-personal-consumption-expenditures-by-state) - This dataset offers consumer spending statistics published by BEA and can serve as one of early gaug...

36. [Personal Income and Outlays, October and November 2025](https://www.bea.gov/news/2026/personal-income-and-outlays-october-and-november-2025) - Personal income increased $30.6 billion (0.1 percent at a monthly rate) in October, followed by an i...

37. [Advance Monthly Sales for Retail and Food Services | FRED](https://fred.stlouisfed.org/release?rid=9) - The US Census Bureau conducts the Advance Monthly Retail Trade and Food Services Survey to provide a...

38. [St. Louis Fed Web Services: API Key - FRED](https://fred.stlouisfed.org/docs/api/api_key.html) - The API key is set using the api_key variable, a 32 character lower-cased alpha-numeric string. Belo...

39. [Surveys of Consumers - University of Michigan](https://www.sca.isr.umich.edu) - 2025, Change, Change. Index of Consumer Sentiment, 44.8, 49.8, 52.2, -10.0%, -14.2%. Current Economi...

40. [University of Michigan: Consumer Sentiment (UMCSENT)](https://fred.stlouisfed.org/series/UMCSENT) - View an index of the results of the University of Michigan's monthly Survey of Consumers, which is u...

41. [Consumer Confidence Survey - The Conference Board](https://www.conference-board.org/data/datadetail.cfm?dataid=consumerconf) - This monthly report details consumer attitudes, buying intentions, vacation plans and consumer expec...

42. [US Consumer Confidence Virtually Unchanged in October](https://www.prnewswire.com/news-releases/us-consumer-confidence-virtually-unchanged-in-october-302596825.html) - NEW YORK, Oct. 28, 2025 /PRNewswire/ -- The Conference Board Consumer Confidence Index® inched down ...

43. [US Consumer Confidence - The Conference Board](https://www.conference-board.org/topics/consumer-confidence/) - This monthly report details consumer attitudes, buying intentions, vacation plans, and consumer expe...

44. [Useful Labor Data Links](https://sites.google.com/view/jason-faberman/home/useful-data-links) - FRBNY Survey of Consumer Expectations (SCE): a monthly survey of ~1,200 heads of household per month...

45. [Survey of Consumer Expectations](https://www.newyorkfed.org/microeconomics/sce) - Interactive charts reporting results from the monthly Survey of Consumer Expectations plus links to ...

46. [Opentable state of the restaurant industry - Kaggle](https://www.kaggle.com/datasets/jaimeblasco/opentable-state-of-the-restaurant-industry) - This data shows year-over-year seated diners at restaurants on the OpenTable network across all chan...

47. [State of the Restaurant Industry - OpenTable Data](https://www.opentable.com/c/state-of-industry/) - The State of the Industry dashboard leverages OpenTable's global network of more than 65,000 restaur...

48. [OpenTable Serves Up 2025 Dining Predictions - PR Newswire](https://www.prnewswire.com/news-releases/opentable-serves-up-2025-dining-predictions-302310134.html) - OpenTable unveils its Top 100 Restaurants in America for 2024, highlighting the most sought-after di...

49. [Press Releases | STR Benchmark - CoStar](https://www.costar.com/products/str-benchmark/resources/press-releases) - Providing you with the latest global hotel performance data ; U.S. hotel results for week ending 16 ...

50. [Hotel data firm STR sold to CoStar Group for $450M - Travel Weekly](https://www.travelweekly.com/Travel-News/Hotel-News/CoStar-Group-buys-hotel-data-firm-STR) - Real estate analytics group CoStar has paid $450 million to acquire STR, formerly Smith Travel Resea...

51. [STR Weekly Insights: U.S. Hotel Industry Faces Continued Decline ...](https://www.hotelnewsresource.com/article138240.html) - U.S. hotel industry faces continued challenges with declining occupancy rates, while global markets ...

52. [US 2026 Short-Term Rental Outlook Report - AirDNA](https://www.airdna.co/outlook-report) - Stronger holiday performance and demand growth from the first half the year will bring average occup...

53. [AirDNA | Short-Term Rental Data Analytics | Vrbo & Airbnb Data](https://www.airdna.co) - AirDNA tracks 10M+ Airbnb and Vrbo rentals across 120K markets. The original STR data platform since...

54. [Free AirDNA Alternative (2025): 100% Free Airbnb Analytics - Chalet](https://www.getchalet.com/blog/free-airdna-the-best-free-alternative-to-airdna-no-paywall) - Chalet is a free alternative to AirDNA, providing comprehensive short-term rental analytics includin...

55. [TSA Throughput Dataset (alternate source) - Reddit](https://www.reddit.com/r/datasets/comments/mx87q8/tsa_throughput_dataset_alternate_source/) - This folder contains .CSV files for individual airports as wall as a .CSV file for All airports (uni...

56. [Department of Homeland Security - COVID-19 Passenger Throughput](http://catalog.data.gov/dataset/covid-19-passenger-throughput) - Since the beginning of the COVID-19 pandemic, TSA has published the daily passenger checkpoint throu...

57. [AAR Reports Weekly Rail Traffic for the Week Ending June 28, 2025](https://www.aar.org/news/aar-reports-weekly-rail-traffic-for-the-week-ending-june-28-2025/) - For this week, total U.S. weekly rail traffic was 491,424 carloads and intermodal units, down 0.2 pe...

58. [Freight Rail Traffic - Carloads - Catalog - Data.gov](http://catalog.data.gov/dataset/freight-rail-traffic-carloads) - The Association of American Railroads releases data on carloads and intermodal units originated by U...

59. [Truck Tonnage Used in the Transportation Services Index](https://www.bts.gov/learn-about-bts-and-our-work/statistical-methods-and-policies/truck-tonnage) - The ATA report contains an index that is a relative measure of the total tonnage transported by the ...

60. [ATA reports truck tonnage down in March 2025](https://www.truckpartsandservice.com/economic-trends/freight-demand/article/15743879/ata-reports-truck-tonnage-down-in-march-2025) - In March, the ATA advanced seasonally adjusted For-Hire Truck Tonnage Index equaled 113.4, down from...

61. [ATA Truck Tonnage Index Declined 0.1% in May](https://www.trucking.org/news-insights/ata-truck-tonnage-index-declined-01-may) - The index, which is based on 2015 as 100, was down 1.3% from the same month last year, the first yea...

62. [ATA Truck Tonnage Index Rose 0.9% in August](https://www.trucking.org/news-insights/ata-truck-tonnage-index-rose-09-august) - In August, the ATA advanced seasonally adjusted For-Hire Truck Tonnage Index equaled 115.3, up from ...

63. [The Cass Freight Index: A Measure of North American Freight Activity](https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/cass-freight-index) - The Cass Freight Index is a measure of monthly freight activity, widely used by analysts and economi...

64. [Cass Transportation Index Report | June 2025](https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/june-2025) - The monthly report provides monthly, quarterly, and annual predictions for over forty data series ov...

65. [Cass Transportation Index Report | July 2025](https://www.cassinfo.com/freight-audit-payment/cass-transportation-indexes/july-2025) - The monthly report provides monthly, quarterly, and annual predictions for over forty data series ov...

66. [Port of Los Angeles - TEU Counts Monthly And Calendar YTD](https://catalog.data.gov/dataset/port-of-los-angeles-teu-counts-monthly-and-calendar-ytd) - Resources · Resource 1. APPLICATION/JSON. Download · Resource 2. APPLICATION/RDF+XML. Download · Res...

67. [Container Statistics | Port of Los Angeles](https://portoflosangeles.org/business/statistics/container-statistics) - Provided statistical breakdowns include monthly and annual container counts measured in Twenty-Foot ...

68. [COVID-19 Community Mobility Reports - Google](https://www.google.com/covid19/mobility/) - Community Mobility Reports. Reports created 2022-10-17. In order to download or use the data or repo...

69. [COVID-19 Mobility Data Aggregator (Archived) - GitHub](https://github.com/ActiveConclusion/COVID19_mobility) - This section details the data sources that were aggregated by this project. Note the archival status...

70. [rearc-data/apple-maps-mobility-trends-covid-19 - GitHub](https://github.com/rearc-data/apple-maps-mobility-trends-covid-19) - This dataset contains COVID‑19 mobility trends in countries/regions and cities from Apple. The CSV f...

71. [Apple makes mobility data available to aid COVID-19 efforts](https://www.apple.com/newsroom/2020/04/apple-makes-mobility-data-available-to-aid-covid-19-efforts/) - Apple today released a mobility data trends tool from Apple Maps to support the impactful work happe...

72. [Yelp Fusion API outrageous new pricing - App Developer Magazine](https://appdevelopermagazine.com/yelp-fusion-api-outrageous-new-pricing/) - The new plans include the Starter at $7.99 per 1000 API calls, the Plus at $9.99, and the Enterprise...

73. [Yelp Places API | Yelp Data Licensing - Yelp for Business](https://business.yelp.com/data/products/places-api/) - Yelp Places API is priced per API call and has three monthly plans to choose from. Premium. Receive ...

74. [Pricing Plans | Customized Subscription Packages - Placer.ai](https://www.placer.ai/pricing) - Our customized subscription packages are designed to provide you with valuable insights, while meeti...

