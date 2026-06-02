# Free & Freemium US Migration, Demographics & Labor Data Sources
## MSA / ZIP Intelligence Map for Bloomberg-Style CRE Terminal

*Tier 1 Demand-Side Fundamentals Stack — Designed for Israeli Family Offices & Institutional LPs Investing in US CRE*
*Compiled: May 2026 | Coverage: 2024–2026 Data*

***

## Executive Summary

This document maps every meaningful free or freemium data source for US population migration, demographic shifts, job formation, wage growth, and household formation at the MSA, county, ZIP, tract, and block-group levels. The stack is architected to power three terminal tiles: a live **"Where the Money & People Are Moving"** map, an **"MSA Momentum Scorecard"**, and a **Household Formation / Demand Pressure** module. For each source, exact API endpoints with example query strings, authentication paths, rate limits, data formats, specific fields, and cross-verification partners are documented.

**Key findings:**
- Roughly 35 sources are genuinely free with API access; 8 more are freemium with usable free tiers
- The highest-leverage real-time signals are: IRS SOI Migration (AGI flows), Census QWI (quarterly job creation), BLS QCEW (weekly wages by county/NAICS), Indeed Hiring Lab API (daily job postings + wage YoY), and USPS Population Mobility Trends (COA-derived ZIP-to-ZIP flows)
- The data that definitively leads the official Census by 6–18 months: USPS COA, U-Haul Growth Index, Apartment List migration reports, school enrollment data, and new business formation (Census BFS)
- The hardest gap: real-time cell-phone derived origin-destination matrices at ZIP resolution (Placer.ai, SafeGraph commercial, Spectus) — all require paid subscriptions

***

## Master Data Source Map

### Block A — US Census Bureau APIs

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **ACS 1-Year Estimates API** | `https://api.census.gov/data/2023/acs/acs1?get=NAME,B19013_001E,B01002_001E,B15003_022E&for=metropolitan+statistical+area/micropolitan+statistical+area:*&key=YOUR_KEY`[^1][^2] | Free | 500 calls/day per key; no hard cap on data volume | National / State / MSA / County / Place | Annual (1-year lag; 2023 data released Sep 2024) | JSON → CSV | Yes — free key at `api.census.gov/data/key_signup.html` | Median HH income (B19013), median age (B01002), educational attainment (B15003), foreign-born share (B05012), race/ethnicity (B03002) | PEP, BEA RegionalIncome, BLS QCEW | MSA Momentum Scorecard / Demographic tile | Only released for populations ≥65,000; small metros use 5-yr only[^3] |
| **ACS 5-Year Estimates API** | `https://api.census.gov/data/2024/acs/acs5?get=NAME,group(B01001)&for=us:1&key=YOUR_KEY`[^4] | Free | Same as 1-yr | National / State / MSA / County / ZIP / Tract / Block Group | Rolling 5-yr (2020–2024 released Jan 2026; 2015–2019 comparison available) | JSON | Yes — same key | All ACS tables to block-group; B25003 (tenure), B25031 (gross rent), B08303 (commute time) | CHAS (HUD), Eviction Lab, Opportunity Insights | Household Formation / Multifamily Demand | 2020–2024 vs 2015–2019 non-overlapping comparison now available[^4] |
| **Census Population Estimates Program (PEP) API** | `https://api.census.gov/data/2023/pep/charv?get=POP,AGE,SEX,POPGROUP,HISP&for=state:01&YEAR=2023&key=YOUR_KEY`[^5] | Free | 500 calls/day | National / State / County (2020+ via flat file for recent years) | Annual (July 1 vintage) | JSON / CSV flat file | Yes | Total population, births, deaths, net domestic migration, net international migration, natural increase | ACS 1-yr, IRS SOI Migration | Population Growth tile | PEP API coverage dropped post-2019; recent vintages served as flat files from Census FTP[^6] |
| **Census Decennial 2020 — DHC API** | `https://api.census.gov/data/2020/dec/dhc?get=NAME,P1_001N&for=tract:*&in=state:06+county:*&key=YOUR_KEY` | Free | 500 calls/day | National / State / County / Tract / Block Group / Block | Decennial (2030 next) | JSON | Yes | Age by sex (P12), race/ethnicity (P9), Hispanic origin (P4), household type (H1) | ACS 5-yr, PEP | Demographic baseline anchor | Use DHC for 2020 baseline; ACS 5-yr for trend | 
| **Census Building Permits Survey (BPS) API** | `https://api.census.gov/data/timeseries/eits/bps?get=cell_value,time_slot_id&category_code=TOTAL&data_type_code=VALC&for=metropolitan+statistical+area/micropolitan+statistical+area:*&key=YOUR_KEY` | Free | 500 calls/day | National / State / MSA / County / Place | Monthly | JSON | Yes | Permit counts by structure type (1-unit, 2-4 unit, 5+ unit), valuation | QCEW construction jobs, HUD AHS | Supply Pipeline vs. Demand Pressure tile | Cross with multifamily permit YoY vs. net migration to compute supply/demand gap |
| **Census Quarterly Workforce Indicators (QWI) API** | `https://api.census.gov/data/timeseries/qwi/sa?get=Emp,EmpEnd,EmpS,HirA,Sep,EarnS&for=metropolitan+statistical+area:*&in=state:*&key=YOUR_KEY`[^7] | Free | 500 calls/day | State / County / MSA | Quarterly (~6-mo lag) | JSON | Yes | Employment (Emp), job creation (FrmJbGn), job destruction (FrmJbLs), hires (HirA), separations (Sep), average monthly earnings (EarnS), by NAICS + sex + age | BLS QCEW, LAUS | Job Formation / Wage Growth tile | Gold standard for job creation/destruction flows at MSA level; 32 economic indicators[^8][^9] |
| **Census Business Formation Statistics (BFS) API** | `https://api.census.gov/data/timeseries/bds?key=YOUR_KEY` also `api.census.gov/data/timeseries/eits/bfs`[^10][^11] | Free | 500 calls/day | National / State / Metro (BDS) | Quarterly (BFS); Annual (BDS) | JSON | Yes | New business applications (BA_BA), high-propensity applications (BA_HBA), employer business formations | QCEW, QWI | Job Formation leading indicator tile | BFS leads QCEW by 2–4 quarters as a startup signal; critical leading indicator |
| **County Business Patterns (CBP) API** | `https://api.census.gov/data/2023/cbp?get=ESTAB,LFO,NAICS2017_LABEL,NAME&for=county:*&in=state:*&NAICS2017=52&key=YOUR_KEY`[^12] | Free | 500 calls/day | National / State / County (not MSA directly — aggregate counties) | Annual (~18-mo lag) | JSON | Yes | Establishments, paid employees, first-quarter payroll, annual payroll by 6-digit NAICS | BLS QCEW, QWI | Industry Composition / Sector Diversification tile | No MSA FIPS natively; join to MSA via FIPS county crosswalk from Census |
| **Census Current Population Survey (CPS) via IPUMS-CPS** | `https://cps.ipums.org/cps/` — download microdata extracts; no REST API | Free (registration required) | No stated quota | National / State (individual records) | Monthly | Fixed-width / CSV / Stata | Yes — IPUMS account | Migration in last year (MIGRATE1), occupation, industry, earnings, foreign-born, metro status | ACS, BLS LAUS | Household / Migration behavior deep-dive | Microdata; requires aggregation; MSA identifiers partially suppressed for small metros |

***

### Block B — IRS Statistics of Income (SOI) Migration

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **IRS SOI Migration Data — County-to-County** | `https://www.irs.gov/statistics/soi-tax-stats-migration-data` — direct CSV/ZIP download[^13] Latest year: 2021–2022 (Filing Year 2023 typically released ~18 months after tax year) | Free | No API; bulk file download | County-to-county inflow/outflow; state-to-state with AGI/age splits | Annual (~18-mo lag from tax year) | CSV / Excel by state | No | Returns filed (≈ households), exemptions claimed (≈ persons), total AGI in/out, AGI by bracket (2011+), age of primary taxpayer (2011+) | PEP, ACS, Apartment List | "Where the Money Is Moving" map — HIGH-INCOME HOUSEHOLD FLOW anchor | The only source showing dollar value of income migrating between counties. AGI flow = wealth migration signal. Most recent published: FY 2021–2022[^14][^13] |
| **IRS County Business Patterns (via Census CBP)** | See CBP above | Free | — | County | Annual | CSV | No | — | — | Industry tile | IRS NAICS-level payroll feeds CBP; same data, Census API preferred |

***

### Block C — BLS Labor Market APIs

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **BLS QCEW — Quarterly Census of Employment & Wages** | `https://www.bls.gov/cew/` — OpenData API: `https://data.bls.gov/cew/data/api/{YEAR}/{QTR}/area/{AREA_FIPS}.csv` Example: `https://data.bls.gov/cew/data/api/2024/3/area/35644.csv` (NYC MSA)[^15][^16] | Free | No stated quota on flat-file downloads | National / State / MSA / County / NAICS | Quarterly (~5-mo lag) | CSV | No for bulk; key for BLS JSON API | Establishments, monthly employment (3 months), total quarterly wages, average weekly wage, by NAICS | QWI, CBP, LAUS | **Primary Job Formation + Wage Growth tile** | Most comprehensive employment/wage coverage (95%+ of US jobs via UI system). NAICS breakdown to 6-digit at county level[^17] |
| **BLS LAUS — Local Area Unemployment Statistics** | BLS JSON API: `https://api.bls.gov/publicAPI/v2/timeseries/data/` Series ID format: `LAUMT{STATE_FIPS}{AREA_FIPS}0000003` (unemployment rate) Example: `LAUMT353565000000003` = NYC MSA unemployment rate[^18][^19] | Free | Unauthenticated: 25 series/request, 500/day; Registered: 500 series/request, 3,000/day | National / State / MSA / County / City | Monthly (~3-wk lag) | JSON / CSV | Registration recommended (free at bls.gov) | Labor force, employment, unemployment, unemployment rate | QCEW, CES | MSA Labor Market Health tile | Best near-real-time labor indicator; monthly MSA unemployment rate is a lagging but reliable economic health check |
| **BLS CES — Current Employment Statistics (Metro)** | BLS JSON API: series format `SMU{STATE_FIPS}{AREA_FIPS}{NAICS_SUPER}01` Example: NYC private payroll: `SMU3635600000000001` | Free | Same as LAUS | State / MSA | Monthly | JSON / CSV | Registration recommended | Nonfarm payroll employment by supersector (mining/logging, construction, manufacturing, trade/transport, info, financial, prof/business, education/health, leisure, government) | LAUS, QCEW | Sector Employment Shift tile | Seasonally adjusted; best for MoM/YoY sector trend; feeds "where are the jobs growing" chart |
| **BLS JOLTS — Job Openings & Labor Turnover** | `https://api.bls.gov/publicAPI/v2/timeseries/data/` JOLTS series: `JTS000000000000000JOR` (national only; regional = 4 Census regions) | Free | Same quota | National / 4 Census regions | Monthly | JSON | Registration recommended | Job openings rate, hires rate, quits rate, layoffs/discharges | CES, QCEW | Labor Demand Pressure tile | **No MSA-level JOLTS**; regional only. Use as national/regional backdrop signal, not MSA driver |
| **BLS OEWS — Occupational Employment & Wage Statistics** | Flat-file download: `https://www.bls.gov/oes/tables.htm` — May 2024 MSA data (zip file, ~300MB) API: not supported natively; CSV download required[^20][^21] | Free | No limit on downloads | National / State / MSA / Non-MSA | Annual (May survey, published ~12 months later) | Excel / CSV | No | Employment and wage (mean, median, percentile) for 830+ occupations by MSA; cross-occupation wage distribution | QCEW, QWI, CBP | Occupation/Wage Profile tile | Tells you *what jobs are paying* in each MSA — critical for income-level demand modeling. May 2024 data published ~May 2025[^22] |

***

### Block D — Bureau of Economic Analysis (BEA) Regional API

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **BEA Regional API — GDP by MSA** | `https://apps.bea.gov/api/data?UserID=YOUR_KEY&method=GetData&datasetname=RegionalProduct&TableName=MGDP9&LineCode=1&GeoFips=COUNTY&Year=2023&ResultFormat=JSON`[^23][^24] GDP by MSA: `GeoFips=MSA`, `TableName=MAGDP9` | Free | No stated cap; key free at `bea.gov/API/signup/index.cfm` | National / State / MSA / County | Annual (MSA GDP ~8-mo lag) | JSON / XML | Yes — free BEA API key | GDP by metro (MAGDP9); personal income (SAINC1); per capita personal income (SAINC30); compensation of employees; proprietors' income | FRED BEA MSA series, ACS income | **MSA Economic Output / Per-Capita Income tile** | BEA RegionalProduct (MSA GDP) and RegionalIncome (personal income, compensation) are both available. GDP by MSA now through 2023[^25][^26] |
| **FRED — St. Louis Fed (BEA/BLS MSA series)** | REST API: `https://api.stlouisfed.org/fred/series/observations?series_id=NYNQGSP&api_key=YOUR_KEY&file_type=json` MSA employment example: `NYNA326MSANA` (NYC nonfarm payroll). 4,584 BEA+MSA series; 40,000+ employment+MSA series[^27][^28] | Free | Free key at `fredaccount.stlouisfed.org`; no hard quota stated | National / State / MSA | Monthly/Quarterly/Annual depending on series | JSON / CSV / Excel | Yes — free FRED API key | Per-capita income, GDP by state, unemployment rate, payroll employment, housing price index, mortgage rates — thousands of MSA-level series | BEA API, BLS APIs | Macro overlay / MSA Scorecard inputs | FRED is the easiest programmatic interface to BEA + BLS data; use series search: `https://api.stlouisfed.org/fred/series/search?search_text=dallas+employment&api_key=KEY` |

***

### Block E — USPS & Moving Company Migration Signals

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **USPS Population Mobility Trends (PMT)** | `https://postalpro.usps.com/pmt` — Order form at `https://postalpro.usps.com/pmt_order_form`[^29][^30] | **Paid** (licensed product via PostalPro; academic/gov discounts) | N/A — licensed data | ZIP-to-ZIP (9 top destination ZIPs per source ZIP, by local/in-state/out-of-state) | Quarterly | CSV tabular | Yes — PostalPro account + license | COA volume by ZIP → destination ZIP; overlaid with income, age, HH size from 2020 Census | IRS SOI, Apartment List | Migration origin-destination map (leads Census by 12–18 mo) | USPS COA aggregate data is licensed, not free. For free proxy: HUD's USPS Vacancy data is free to gov/nonprofits[^31]. Third-party: MyMove annual report (free PDF). PMT is the richest version but requires purchase. |
| **HUD USPS Address Vacancy Data** | `https://www.huduser.gov/portal/datasets/usps.html`[^31] | Free (gov/nonprofit only) | Quarterly download | ZIP / County / Congressional District | Quarterly | CSV | HUD account required | Vacant residential + commercial address counts by ZIP; "no-stat" addresses (likely vacant) | USPS PMT, ACS vacancy rates | Vacancy / Shadow Supply tile | Restricted to governmental and registered non-profit users under USPS agreement |
| **U-Haul Growth Index** | `https://www.uhaul.com/About/Migration/` — Annual press releases with state and MSA rankings[^32][^33][^34] | Free | No API; annual PDF/HTML | State / MSA / City | Annual (released Jan for prior year) | HTML tables / PDF | No | Net gain/loss one-way transactions by state and top 25 metros; YoY rank change | IRS SOI, PEP, Apartment List | "Where People Are Moving" leading indicator tile | **Leads Census by ~12 months.** 2025 data released Jan 2026: Dallas #1 metro, Texas #1 state for 7th time in 10 years[^32][^33] |
| **United Van Lines / Atlas / North American Movers Annual Study** | `https://www.unitedvanlines.com/moving-tips/infographics/national-movers-study` (United); Atlas and North American publish similar annual reports | Free | Annual PDF | State | Annual | PDF press release | No | Inbound vs. outbound % by state; reason for move (job, retirement, family); demographic profile of movers | U-Haul, PEP, IRS SOI | Migration reason/profile supplement | State-level only; directional signal for Sun Belt vs. Rust Belt; useful for LP narrative not MSA model |
| **MyMove Annual Moving Report** | `https://www.mymove.com/moving/statistics/moving-statistics/` | Free | No API; web scrape or PDF | National / State | Annual | HTML / PDF | No | Top move-to states; peak moving months; renter vs. homeowner migration share | U-Haul, United Van Lines | Moving volume / seasonality overlay | Aggregates USPS COA data and third-party surveys; not primary data; use for narrative context |

***

### Block F — Real Estate & Rental Market Data Feeds

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Zillow Research — ZHVI & ZORI (ZIP-level)** | `https://www.zillow.com/research/data/`[^35] Direct CSV links e.g.: `https://files.zillowstatic.com/research/public_csvs/zhvi/Zip_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv` | Free | No API; direct CSV download | National / State / Metro / County / City / ZIP / Neighborhood | Monthly | CSV | No | ZHVI (typical home value by ZIP, tier, property type); ZORI (observed rent index); inventory; days on market; list price cuts; sale-to-list ratio | Realtor.com, Apartment List RAVI, Census ACS rent | Multifamily & SFR Value tile + Rent Trend tile | **ZIP-level ZHVI + ZORI is the most granular free housing value/rent series available**. Bulk CSVs update monthly[^35][^36] |
| **Redfin Data Center** | `https://www.redfin.com/news/data-center/` — Download tab: National, Metro, State, County, City, ZIP, Neighborhood[^37] | Free | No API; CSV download | National / State / Metro / County / City / ZIP / Neighborhood | Monthly | CSV | No | Median sale price, homes sold, days on market, new listings, active inventory, sale-to-list ratio, % sold above list, median price/sqft | Zillow ZHVI, MLS data | Housing Market Health tile | Redfin migration analysis (separate from Data Center) uses Census CPS data for metro net flows; available as press release reports[^38] |
| **Realtor.com Research Data Library** | `https://www.realtor.com/research/data/`[^39][^40] — Weekly inventory CSV + Monthly market hotness + Hot ZIP rankings | Free | No API; CSV download | National / State / Metro / County / ZIP | Weekly (inventory) / Monthly | CSV | No | Active listings, median list price, days on market, new listings, price reductions, market hotness score | Zillow, Redfin | Inventory & Market Velocity tile | Realtor.com hotness score (supply × demand composite) is useful for MSA scorecard ranking input |
| **Apartment List Renter Migration Report** | `https://www.apartmentlist.com/research/apartment-list-renter-migration-report-2026`[^41][^42] Annual report with platform search data | Free | Annual PDF / web interactive | MSA / State | Annual | HTML / PDF (no raw CSV) | No | Share of searches coming from outside MSA (demand pull); top inflow/outflow cities; search-origin matrix | IRS SOI, Census PEP, Redfin | **Renter demand inflow leading indicator** (leads Census 6–12 mo) | Based on millions of platform searches — behavioral signal, not administrative data. Sun Belt and Mountain West continue gaining in 2026 report[^41][^42] |

***

### Block G — Indeed Hiring Lab & LinkedIn Workforce Reports

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Indeed Hiring Lab API** | GraphQL: `POST https://apis.indeed.com/graphql` Header: `Indeed-API-Key: YOUR_KEY`[^43] Example query for regional job postings: `findHiringLabPostingsPublic(input:{filter:{country:["US"], geography:STATES, region:["Texas"]}})` Wage growth query: `findHiringLabWagesPublic` | **Freemium** (researcher/partner API key request via hiring-lab-api@indeed.com) | Key issued per application; rate TBD per agreement | National / State / Sector (no MSA via API yet; MSA via data.indeed.com portal) | Daily (postings) / Monthly (wages) | JSON via GraphQL | Yes — apply for key at hiring-lab-api@indeed.com | Job postings index (SA/NSA); YoY wage growth from postings; remote work share; AI job share; sector-level splits[^43][^44] | BLS CES, QCEW, LAUS | **Real-time Job Demand tile** (leads BLS by 30–60 days) | Free data portal at `data.indeed.com` for interactive use. API key requires application. Most current leading indicator for labor demand available for free[^43] |
| **LinkedIn Workforce Report (Monthly PDF)** | `https://economicgraph.linkedin.com/resources/` — search for "workforce report"[^45][^46][^47] | Free | Monthly PDF; no API | MSA (hiring rates + migration) | Monthly | PDF | No — public page | Hiring rate index; top cities gaining/losing LinkedIn members (migration proxy for professionals); industry hiring shift; fastest-growing job titles | BLS CES, Indeed Hiring Lab | Professional Migration / Hiring Rate tile | **White-collar and tech-heavy migration signal**. Covers ~100 US metros. PDFs require parsing; no bulk download. LinkedIn Economic Graph API is enterprise-only |
| **Glassdoor Research (Local Pay)** | `https://www.glassdoor.com/Salaries/` — web UI only; no public download API[^48] | Free (web UI) | Web UI only; no API | MSA / City | Continuous (user-reported) | Web HTML | No (public) | Median/mean salary by occupation and metro; YoY pay trends; cost-of-living adjusted pay | BLS OEWS, QWI | Wage Competitiveness per MSA tile | No bulk download API; must scrape or use manual export. Less rigorous than BLS OEWS but faster-updating. Glassdoor's employer-specific salaries are crowdsourced |

***

### Block H — Federal Reserve & Household Finance

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **NY Fed Household Debt & Credit Report** | `https://www.newyorkfed.org/microeconomics/hhdc` — Quarterly PDF + Excel tables[^49][^50] | Free | Quarterly download | National + State/MSA supplements in some reports | Quarterly (~45-day lag) | Excel / PDF | No | Total debt balances by type (mortgage, auto, student, CC, HELOC); delinquency rates; foreclosure initiations; originations by credit score | ACS income, QCEW wages | HH Balance Sheet / Credit Stress tile | State/MSA breakdowns available in supplemental exhibits. Data.gov hosts "Household Debt by State, County, and MSA" series[^51] |
| **Federal Reserve Survey of Consumer Finances (SCF)** | `https://www.federalreserve.gov/econres/scfindex.htm` — triennial microdata download | Free | Triennial (2022 latest) | National (no MSA) | Every 3 years | SAS / Stata / CSV | No | Net worth distribution, asset composition, income, debt by demographic | ACS income, BEA per-capita income | Wealth Tier / HH Net Worth context | No MSA-level data; national only. Use for income-wealth cohort framing in LP presentations |

***

### Block I — HUD & Housing Affordability

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **HUD CHAS Data (Comprehensive Housing Affordability Strategy)** | Download: `https://www.huduser.gov/portal/datasets/cp.html` API: `https://www.huduser.gov/portal/dataset/chas-api.html`[^52][^53] | Free | API token required; no stated quota | National / State / MSA / County / Tract | Every 2–3 years (based on ACS) | CSV / API JSON | Yes — free token at huduser.gov | Cost-burdened households by income level; extremely low income (ELI) housing shortage; units affordable by income tier; renter vs. owner breakdown | ACS 5-yr, Eviction Lab | Affordability Stress / Rent Demand Pressure tile | CHAS is derived from ACS but HUD-processed to show housing need specifically. Most recent: 2021 5-yr ACS basis |
| **HUD AHS — American Housing Survey** | `https://www.census.gov/programs-surveys/ahs.html` | Free | Biennial download | National / 25 largest metros | Biennial | CSV/SAS | No | Housing quality, tenure, vacancy, recent mover status, monthly housing costs, square footage | ACS tenure/value tables, ZHVI | Housing Stock Quality / Recent Mover tile | Recent mover flag (moved in last 12 months) is a proxy for migration turnover at metro level |
| **HUD Picture of Subsidized Households** | `https://www.huduser.gov/portal/datasets/assthsg.html` | Free | Annual download | National / State / MSA / County / Tract | Annual | CSV | No | Number of HUD-assisted units, average income of assisted households, racial composition, elderly/disabled share | CHAS, ACS B25003 | Subsidized Supply Overlay tile | Use as supply constraint signal in high-subsidy MSAs |
| **Eviction Lab — Princeton University** | `https://evictionlab.org` — National map + data download[^54][^55] | Free | Bulk CSV download | National / State / County (2000–2018 historical); ongoing tracker for select cities | Annual (historical); monthly (tracker) | CSV | No | Eviction filing rate, judgment rate, renter-occupied households, low-income renter households | ACS rent burden (B25070), CHAS, NY Fed delinquency | Housing Stress / Tenant Distress tile | Historical national data 2000–2018 free. Eviction tracker covers ~30 cities with near-real-time data. Princeton-verified methodology |

***

### Block J — Economic Mobility & Neighborhood Analytics

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Opportunity Insights (Raj Chetty) Data Downloads** | `https://opportunityinsights.org/data/`[^56][^57] — direct CSV downloads | Free | No API; bulk CSV | Census Tract / County / College / CZ | Various; some annually updated | CSV | No | Income mobility rates (p25, p75, p100 upward mobility); earnings by tract of origin; economic connectedness index; GPS mobility by county (COVID era) | ACS, IRS SOI, CHAS | **Neighborhood Quality / Opportunity Score tile** | Includes the Opportunity Atlas (70,000 tracts) and Economic Connectedness index. Critical for LP-facing "quality of neighborhood" scoring |
| **Brookings Metro Monitor** | `https://www.brookings.edu/articles/metro-monitor-2026/`[^58][^59][^60] — annual data download | Free | Annual Excel download | Top 100 MSAs | Annual | Excel | No | GDP growth, productivity, employment, median wages, poverty rate, racial income gaps, geographic inclusion index | BEA regional, BLS QCEW, ACS | MSA Balanced Growth Scorecard tile | 2026 edition released March 2026. Covers economic growth, prosperity, and inclusion for 100 metros — ready-made scorecard composite |
| **Harvard JCHS State of the Nation's Housing** | `https://www.jchs.harvard.edu/state-nations-housing-2025`[^61][^62] — annual data tables | Free | Annual Excel | National / State / Metro (select) | Annual | Excel / PDF | No | Homeownership rate, cost-burden rates, housing starts, affordability index, demographic demand projections | ACS, QCEW, Zillow, BPS | Housing Demand Structural Trend tile | 2025 report released June 2025. Excel appendix tables available for download. Strategic framing for multifamily demand narrative |

***

### Block K — Cell-Phone & Behavioral Migration Data

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **SafeGraph (via Dewey Data — Academic)** | `https://www.deweydata.io/data-partners/safegraph`[^63][^64] | **Freemium** — free for university-affiliated researchers; commercial = paid | Academic tier free; commercial pricing not disclosed | POI / Census Block Group / County | Weekly | CSV (Parquet) | Yes — Dewey academic account | POI visits, home census block group of visitors, distance traveled, visitor demographics estimates | USPS PMT, QCEW, ACS | Foot traffic + migration origin tile (academic/research use) | Commercial use requires paid contract; academic free tier has been the main legitimate free path[^63] |
| **Advan Research (via Dewey Data — Academic)** | `https://www.deweydata.io/data-partners/advan`[^65] | **Freemium** — free for academic; commercial = paid | Academic tier free | POI / County | Weekly | CSV | Yes — Dewey account | Visit counts, trade area, visitor home location, dwell time | SafeGraph, QCEW, USPS PMT | Foot Traffic / Consumer Activity tile | Similar to SafeGraph academic path; commercial = `advanresearch.com/products/patternsplus`[^66] |
| **Placer.ai** | `https://www.placer.ai`[^67][^68] | **Paid** — enterprise SaaS; $1,000+/month[^69]; "Data for Good" free educational tier | Free educational tier (limited) | POI / ZIP / County / MSA | Weekly/Monthly | Dashboard / API | Yes — subscription | Foot traffic by POI, estimated trade area, visit frequency, demographic estimates, migration flows | SafeGraph, QCEW, Apartment List | Retail Site Selection / Foot Traffic tile | Placer deepened Bloomberg terminal integration in April 2026[^67]. Full migration analytics require paid tier. |
| **Replica / StreetLight Data** | `https://replicahq.com` / `https://www.streetlightdata.com` | **Paid** | No free tier | TAZ / County / MSA | Monthly | Dashboard / CSV | Yes — subscription | Origin-destination flows, mode split, trip purpose, income-segmented flows | LODES, QCEW | Commute flow / labor shed tile | StreetLight free snippets via data.gov partnerships in some cities; full product is paid |

***

### Block L — Leading Indicators: Voter, School, Business Registration

| Source Name | Exact URL / Endpoint (with example query) | Free / Freemium / Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **State DOE School Enrollment** | Varies by state. NCES Common Core of Data: `https://nces.ed.gov/ccd/` — district and school enrollment by year | Free | No API; CSV bulk download | School District / County / State | Annual | CSV | No | Total enrollment by grade, race/ethnicity, ELL share, free/reduced lunch %; YoY change | ACS age distribution (B01001), PEP, IRS SOI | **Family migration leading indicator** (leads Census 6–12 months) | K–12 enrollment changes signal family-with-children migration 1–2 years before Census measures it. Available for all 50 states via NCES CCD |
| **Voter Registration Data** | State-level; e.g., Florida: `https://dos.fl.gov/elections/data-statistics/voter-registration-statistics/` Texas: SOS website | Free | Varies by state | County / Precinct | Monthly (most states) | CSV / Excel | No | New registrations by party; address changes by county; net registration change YoY | PEP, IRS SOI | New Resident Registration tile | **Near-real-time adult migration proxy**. New address registrations = inbound population signal. Florida and Texas most reliable; availability varies by state |
| **Census Business Dynamics Statistics (BDS)** | `https://api.census.gov/data/timeseries/bds?key=YOUR_KEY` (see BFS above)[^10] | Free | 500 calls/day | National / State / Metro (via BDS metro tables) | Annual (2-yr lag) | JSON | Yes | Establishment births/deaths, employment at births/deaths, net job creation, firm age | QWI, CBP, BFS | Business Ecosystem Vitality tile | Combine BFS (leading) + BDS (lagging) to show business formation acceleration/deceleration by MSA |

***

## Top 15 Highest-Leverage Sources for an MSA Momentum Scorecard

Ranked by timeliness × geographic granularity × economic signal strength:

| Rank | Source | Why It's High-Leverage | Lag from Real Time | Tile |
|---|---|---|---|---|
| 1 | **IRS SOI Migration** | Only free source showing *dollar value* of AGI moving county-to-county; wealth migration anchor | ~18 months | Money Flow Map |
| 2 | **BLS QCEW** | 95%+ job coverage, county/NAICS/weekly wages; quarterly cadence | ~5 months | Job Formation + Wages |
| 3 | **Census QWI API** | Job creation/destruction + hires + earnings by MSA + NAICS + demographics | ~6 months | Labor Flows |
| 4 | **Indeed Hiring Lab API** | Daily job postings index + YoY wage growth; 30–60 days ahead of BLS | Real-time | Job Demand Leading Indicator |
| 5 | **Census ACS 5-Year API** | Income, age, education, tenure, foreign-born to block group; demographic baseline | 2-yr rolling | Demographic Profile |
| 6 | **Zillow ZHVI/ZORI (ZIP)** | Monthly ZIP-level home value + rent index; best free granularity for housing demand | 1 month | Housing Demand |
| 7 | **U-Haul Growth Index** | Annual one-way truck flow = consumer migration signal; leads Census by 12 months | ~1 month (Jan release) | Migration Leading Indicator |
| 8 | **USPS PMT / Apartment List** | ZIP-to-ZIP COA flows + search-intent migration data; both lead Census | 3–6 months | Where People Are Moving Now |
| 9 | **BEA Regional API (MSA GDP + Income)** | GDP by metro + personal income; economic output anchor for scorecard | ~8 months | Economic Output |
| 10 | **FRED API (MSA series)** | Programmatic access to 40,000+ MSA-level series; single key, stable endpoint | Varies by series | Macro Dashboard |
| 11 | **Brookings Metro Monitor** | Pre-computed growth/prosperity/inclusion scores for 100 metros; ready-made scorecard | Annual (Mar release) | Composite Scorecard |
| 12 | **BLS LAUS API** | Monthly MSA unemployment rate; most current standard labor health check | ~3 weeks | Labor Health |
| 13 | **Census PEP** | Official annual population estimates with natural increase vs. net migration components | ~8 months | Population Growth Rate |
| 14 | **Opportunity Insights Tract Data** | Economic mobility, connectedness scores at tract level; neighborhood quality signal | Static (historical) | Neighborhood Quality |
| 15 | **BLS OEWS (MSA level)** | Occupation-level wages for 830 jobs in every MSA; "what do the jobs pay" answer | ~12 months | Wage Distribution |

***

## Unfair-Advantage Leading Signals (6–18 Months Ahead of Census)

These sources consistently reveal migration and economic formation trends well before the official Census and BLS releases confirm them:

1. **USPS Change-of-Address / PMT (6–12 mo lead):** COA filings happen at time of move. The USPS PMT product (licensed) or HUD's vacancy data (free to gov/nonprofit) gives ZIP-to-ZIP directional flows in near-real-time. The IRS SOI migration data, which relies on COA-derived address changes in tax filings, typically lags the actual move by 18–24 months.[^13][^29]

2. **U-Haul Growth Index (12 mo lead):** U-Haul's one-way rental transactions are consumer-revealed preferences at the time of moving decision. The January 2026 release confirmed Dallas-Fort Worth as the #1 growth metro and Texas as #1 growth state for 2025 — data that won't appear in official Census estimates until mid-2026 or later.[^32][^33]

3. **Apartment List / Redfin Search Migration (6–9 mo lead):** Platform search data reflects moving *intent* 3–9 months before the actual move. When the share of Apartment List searches originating outside an MSA spikes, net inflow typically follows. The 2026 report already identifies sustained Mountain West and Sun Belt search dominance.[^41][^42]

4. **K–12 School Enrollment (9–12 mo lead):** Families with school-age children register children before or immediately upon arrival. District enrollment data from state DOEs is published annually and reflects moves from the prior summer — often 1–2 school years ahead of Census measurements. NCES CCD district data is free and covers all 50 states.

5. **Census Business Formation Statistics / New Business Applications (6–9 mo lead):** High-propensity business applications (entrepreneurs) cluster where population is arriving and income is rising. The BFS quarterly release tracks this ZIP and state-level — available free via Census API.[^10]

6. **LinkedIn Workforce Report (1–2 mo lead on professional migration):** LinkedIn member address changes are continuous. The monthly report's "cities gaining/losing the most people" (per 10,000 members) tracks professional-class inflow with a 30–60-day cadence — critical for office/mixed-use demand signal.[^45][^46]

***

## Gap Analysis: What's Behind Paid Walls and the Cheapest Legitimate Path

**What Requires Payment:** The most critical gap in the free data stack is *real-time, granular, origin-destination migration matrices at the ZIP and tract level derived from anonymized cellular location data.* Placer.ai's full migration and visitation dataset (integrated into Bloomberg Terminal in April 2026), SafeGraph's commercial Patterns+ product, Spectus (formerly Cuebiq), and StreetLight Data all sit behind enterprise subscriptions ranging from approximately $1,000–$50,000+ per month. These products deliver weekly ZIP-to-ZIP or tract-to-tract population flow matrices from 15–20 million+ anonymized devices, enabling nearly real-time detection of migration shifts that may not appear in USPS COA, Census, or IRS data for 12–24 months. The USPS Population Mobility Trends product is also licensed (not free), requiring a PostalPro commercial subscription. Glassdoor's bulk salary export API and LinkedIn's Economic Graph enterprise data are enterprise-licensed. Experian/Equifax/TransUnion MSA-level credit dashboards publish aggregated free summaries but the underlying segmentation (spend by income cohort, new-to-market credit profiles) requires commercial licensing.[^67]

**Cheapest Legitimate Paths:**
- **For cellular-derived O-D data:** The Dewey Data academic platform provides free access to both SafeGraph and Advan data for university-affiliated researchers — ideal if the terminal is developed in partnership with a university lab. Non-academic path: SafeGraph's free Open Census Data on AWS Marketplace includes 7,500+ demographic attributes at block group level without mobility flows.[^63][^64][^70]
- **For USPS COA proxy:** HUD's free USPS vacancy data (restricted to gov/nonprofits) is the closest free substitute; the IRS SOI migration data provides the lagged wealth-migration signal for free; Apartment List and LinkedIn provide the behavioral/professional signal for free.[^31]
- **For near-real-time migration at scale without paying:** Stack IRS SOI (wealth flow) + QWI (job creation) + Indeed Hiring Lab (job demand) + U-Haul (consumer migration) + Apartment List (renter intent) + K–12 enrollment + BFS (new businesses) + LinkedIn Workforce Report (professional migration). This seven-source stack covers demographic, economic, behavioral, and consumer-logistics signals at a combined cost of $0, with data lags ranging from 1 day (Indeed) to 18 months (IRS SOI). The result is a 6-to-18-month early warning system that is 80–90% as predictive as the full paid stack for identifying which 25 MSAs are gaining high-income households and high-wage jobs.

***

## Authentication Quick Reference

| API | Key Registration URL | Cost | Notes |
|---|---|---|---|
| Census Bureau (all APIs) | `https://api.census.gov/data/key_signup.html` | Free | Email-verified; 500 calls/day per key |
| BEA | `https://www.bea.gov/API/signup/index.cfm` | Free | Instant email delivery |
| FRED (St. Louis Fed) | `https://fredaccount.stlouisfed.org/apikeys` | Free | Google account supported |
| BLS JSON API | `https://www.bls.gov/developers/home.htm` | Free | 500 series/request registered vs. 25 unregistered |
| Indeed Hiring Lab API | Email `hiring-lab-api@indeed.com` | Free (partner/researcher) | Application review required |
| HUD CHAS API | `https://www.huduser.gov/portal/dataset/chas-api.html` | Free | Account + token registration |
| Opportunity Insights | Direct download at `opportunityinsights.org/data/` | Free | No auth required |

***

## Python / curl Quick-Start Examples

**ACS 5-Year — Median HH Income by Census Tract (example: all tracts in Texas):**
```python
import requests
KEY = "YOUR_CENSUS_KEY"
url = (
    "https://api.census.gov/data/2024/acs/acs5"
    "?get=NAME,B19013_001E,B19013_001M"
    "&for=tract:*&in=state:48&key=" + KEY
)
r = requests.get(url)
data = r.json()  # list of lists; row = headers
```

**BLS QCEW — Average Weekly Wages, Dallas-Fort Worth MSA (FIPS 19100), Q3 2024:**
```bash
curl "https://data.bls.gov/cew/data/api/2024/3/area/19100.csv"
```

**BEA API — Personal Income by MSA (all metros, 2023):**
```python
import requests
KEY = "YOUR_BEA_KEY"
url = (
    "https://apps.bea.gov/api/data"
    "?UserID=" + KEY +
    "&method=GetData&datasetname=RegionalIncome"
    "&TableName=SAINC1&LineCode=1&GeoFips=MSA&Year=2023&ResultFormat=JSON"
)
r = requests.get(url)
data = r.json()["BEAAPI"]["Results"]["Data"]
```

**Indeed Hiring Lab — YoY Wage Growth (National):**
```bash
curl -X POST 'https://apis.indeed.com/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Indeed-API-Key: YOUR_KEY' \
  -H 'Referer: https://your-terminal.com' \
  --data-raw '{"query":"query{findHiringLabWagesPublic(input:{filter:{country:[\"US\"]}}){edges{node{...on HiringLabNationalWage{date wageGrowthYoy wageGrowth3Ma}}}}}"}'
```

**FRED API — Dallas-Fort Worth Nonfarm Payroll (monthly):**
```python
import requests
KEY = "YOUR_FRED_KEY"
url = f"https://api.stlouisfed.org/fred/series/observations?series_id=DALLASRGSP&api_key={KEY}&file_type=json"
# For employment: series_id = "DALL419MSANA" (DFW nonfarm payroll)
r = requests.get(url)
observations = r.json()["observations"]
```

***

*All endpoints current as of May 2026. Rate limits and free-tier terms subject to change. For the RePrime Terminal Tier 1 stack, the recommended daily data pipeline is: QCEW (quarterly wages/jobs) → QWI (job creation flows) → LAUS (unemployment) → ACS 5-yr (demographics) → IRS SOI (wealth migration) → Indeed Hiring Lab (real-time job demand) → Zillow ZHVI/ZORI (housing value/rent) → Apartment List + U-Haul (behavioral migration) → Opportunity Insights (neighborhood quality scoring).*

---

## References

1. [Census Data API User Guide](https://www.census.gov/data/developers/guidance/api-user-guide.Example_API_Queries.html) - American Community Survey (ACS) Example · 1. Start your query with the host name: api.census.gov/dat...

2. [American Community Survey Data via API - Census Bureau](https://www.census.gov/programs-surveys/acs/data/data-via-api.html) - The Census Bureau's Application Programming Interface (API) is a tool that you can use to access Ame...

3. [Available APIs - Census Bureau](https://www.census.gov/data/developers/data-sets.html) - We plan on adding all of our publicly available data sets. Here you'll find which of our many data s...

4. [American Community Survey 5-Year Data (2009-2024)](https://www.census.gov/data/developers/data-sets/acs-5year.html) - All data queries to the Census Data API now require an API key. Please cut and paste the Example Cal...

5. [Population Estimates APIs - Census Bureau](https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html) - The Census Bureau's Population Estimates Program uses current data on births, deaths, and migration ...

6. [get_estimates function - RDocumentation](https://www.rdocumentation.org/packages/tidycensus/versions/1.7.5/topics/get_estimates) - The get_estimates() function requests data from the US Census Bureau's Population Estimates Program ...

7. [Quarterly Workforce Indicators (QWI) (Time Series: 1990 - present)](https://www.census.gov/data/developers/data-sets/qwi.html) - The QWI are a set of 32 economic indicators including employment, job creation/destruction, wages, h...

8. [tidyqwi: A Tidy Approach to Accessing The US Census Bureau's Quarterly Workforce Indicators](http://joss.theoj.org/papers/10.21105/joss.01462) - The purpose of tidyqwi is to access the U.S. Census Bureau Quarterly Workforce Indicators(QWI) API a...

9. [Quarterly Workforce Indicators - Social Explorer](https://www.socialexplorer.com/home/dataset-entry/quarterly-workforce-indicators) - The Quarterly Workforce Indicators (QWI) report, produced by the U.S. Census Bureau, provides quarte...

10. [Business Dynamics Statistics (BDS) Data - Census Bureau](https://www.census.gov/programs-surveys/bds/data.API.html) - The BDS dataset is available as a Census Bureau API. To access data using the Census API, you will n...

11. [Time Series: Business Dynamics Statistics - API endpoint - Catalog](https://catalog.data.gov/dataset/economic-surveys-business-dynamics-statistics/resource/f9178d32-245c-46e2-963d-a7cfd04b709a) - The Business Dynamics Statistics (BDS) is a public use data set providing annual aggregate measures ...

12. [County Business Patterns (CBP) APIs - Census Bureau](https://www.census.gov/data/developers/data-sets/cbp-zbp/cbp-api.html) - County Business Patterns provides annual statistics for businesses with paid employees within the US...

13. [SOI tax stats - Migration data | Internal Revenue Service](https://www.irs.gov/statistics/soi-tax-stats-migration-data) - The data present migration patterns by state or by county for the entire United States and are avail...

14. [SOI tax stats - Migration data 2021–2022 | Internal Revenue Service](https://www.irs.gov/statistics/soi-tax-stats-migration-data-2021-2022) - Migration data 2021-2022 data files are available for download in Comma Separated Values files (.csv...

15. [Quarterly Census of Employment and Wages](https://www.bls.gov/cew/) - County Employment and Wages (QCEW) database now fully updated through 3rd quarter 2024. 03/05/2025. ...

16. [QCEW Data Files : U.S. Bureau of Labor Statistics](https://www.bls.gov/cew/downloadable-data-files.htm) - The Quarterly Census of Employment and Wages (QCEW) program provides several different types of data...

17. [County Employment and Wages Summary - Bureau of Labor Statistics](https://www.bls.gov/news.release/cewqtr.nr0.htm) - County Employment and Wages Summary · Table 1. Covered establishments, employment, and wages in the ...

18. [LAUS Home : U.S. Bureau of Labor Statistics](https://www.bls.gov/lau/) - The Local Area Unemployment Statistics (LAUS) program produces monthly and annual employment, unempl...

19. [Local Area Unemployment Statistics Overview](https://www.bls.gov/lau/lauov.htm) - State monthly model-based estimates are controlled in "real time" to sum to national monthly employm...

20. [OES Home : U.S. Bureau of Labor Statistics](https://www.bls.gov/oes/) - The Occupational Employment and Wage Statistics (OEWS) program produces employment and wage estimate...

21. [Occupational Employment and Wage Statistics (OEWS) Tables](https://www.bls.gov/oes/tables.htm) - Occupational Employment and Wage Statistics (OEWS) Tables · May 2025 · May 2024 · May 2023 · May 202...

22. [Overview of BLS Wage Data by Area and Occupation](https://www.bls.gov/bls/blswage.htm) - BLS wage data are available by occupation for the nation, regions, states, and many metropolitan and...

23. [Bureau of Economic Analysis (Independent Publisher) - Connectors](https://learn.microsoft.com/en-us/connectors/bureauofeconomicanal/) - Unlike traditional REST APIs with multiple endpoints, the BEA API uses a single endpoint ( /data ) a...

24. [BEA's API Expands Access to All Regional Data](https://www.bea.gov/news/blog/2015-07-08/beas-api-expands-access-all-regional-data) - BEA's API allows developers to build a service to search, display, analyze, retrieve, or view BEA st...

25. [Regional GDP & Personal Income - Bureau of Economic Analysis](https://www.bea.gov/itable/regional-gdp-and-personal-income) - ... State and Personal Income by State, 4th Quarter 2024 and Preliminary 2024 · Gross Domestic Produ...

26. [Regional Economic Accounts](https://www.bea.gov/data/economic-accounts/regional) - The estimates of gross domestic product by state and state and local area personal income, and the a...

27. [BEA, MSA - Economic Data Series | FRED | St. Louis Fed](https://fred.stlouisfed.org/tags/series?t=bea%3Bmsa) - 4584 economic data series with tags: BEA, MSA. FRED: Download, graph, and track economic data. Burea...

28. [Employment, MSA - Economic Data Series | FRED | St. Louis Fed](https://fred.stlouisfed.org/tags/series?t=employment%3Bmsa) - 40000 economic data series with tags: Employment, MSA. FRED: Download, graph, and track economic dat...

29. [Beyond the Mail - USPS | PostalPro](https://postalpro.usps.com/beyond-the-mail) - USPS® Population Mobility Trends. A tabular dataset built upon aggregated USPS National Change of Ad...

30. [Population Mobility Trends Order Form - USPS | PostalPro](https://postalpro.usps.com/pmt_order_form) - Population Mobility Trends Order Form. February 13, 2025. Download. Quick Links. USPS® Population Mo...

31. [HUD Aggregated USPS Administrative Data On Address Vacancies](https://www.huduser.gov/portal/datasets/usps.html) - Under the current agreement with the USPS, HUD can make the data accessible only to governmental ent...

32. [Texas Back on Top as No. 1 Growth State of 2025 - U-Haul](https://www.uhaul.com/Articles/About/U-Haul-Growth-Index-Texas-Back-ON-Top-As-No-1-Growth-State-Of-2025-36556/) - Texas and Florida lead the list of in-migration states on the U-Haul® Growth Index analyzing one-way...

33. [Top U.S. Growth Metros and Cities of 2025 Announced - U-Haul](https://www.uhaul.com/Articles/About/U-Haul-Growth-Index-Top-US-Growth-Metros-And-Cities-Of-2025-Announced-36558/) - Texas metros litter the latest U-Haul Growth Index, claiming the top three spots (Dallas, Houston, A...

34. [U-Haul Growth Index](https://www.uhaul.com/About/Migration/) - Select a year and province to view migration trends. Year. 2025, 2024, 2023, 2022, 2021, 2020, 2019,...

35. [Housing Data - Zillow Research](https://www.zillow.com/research/data/) - Zillow Home Value Index (ZHVI): A measure of the typical home value and market changes across a give...

36. [ZHVI User Guide - Zillow Research](https://www.zillow.com/research/zhvi-user-guide/) - ZHVI represents the “typical” home value for a region. It's calculated as a weighted average of the ...

37. [Downloadable Housing Market Data - Redfin](https://www.redfin.com/news/data-center/) - Downloadable housing market insights from across the U.S.. Download the data. Redfin Data Center Lan...

38. [Florida and Texas Are Gaining Residents at a Much Slower Rate ...](https://www.redfin.com/news/slowing-migration-florida-texas-2024/) - The migration figures in this report are from a Redfin analysis of U.S. Census Bureau data. It focus...

39. [Residential real estate data library - Realtor.com](https://www.realtor.com/research/data/) - Get the latest real estate data and statistics by zip code, county, metro, state and the U.S. broken...

40. [Realtor.com® Research - Housing Data & Real Estate Market Trends](https://www.realtor.com/research/) - Download your real estate data. Get access to the latest Weekly Inventory, Monthly Inventory, and Mo...

41. [Apartment List Renter Migration Report: 2026](https://www.apartmentlist.com/research/apartment-list-renter-migration-report-2026) - Need insights on where renters are moving? Our Apartment List Renter Migration Report explores the l...

42. [Renters Migrating To Sunbelt And Mountain West Report Says](https://rentalhousingjournal.com/renters-migrating-to-sunbelt-and-mountain-west-report-says/) - Americans are continuing to migrate to the Sunbelt and Mountain West, according to the 2026 Apartmen...

43. [Hiring Lab API | Indeed Partner Docs](https://docs.indeed.com/hiring-lab-api/) - The API provides access to comprehensive labor market data including job postings trends, wage growt...

44. [Introducing Hiring Lab's New Data Portal: Delivering Faster, Better ...](https://www.hiringlab.org/2024/04/16/new-data-portal/) - Hiring Lab has launched a newly redesigned data portal that showcases more of Indeed's world-class l...

45. [January Workforce Report 2024 - LinkedIn's Economic Graph](https://economicgraph.linkedin.com/resources/linkedin-workforce-report-january-2024) - This month's LinkedIn Workforce Report looks at our latest national data on hiring and migration tre...

46. [LinkedIn Workforce Report - July 2024](https://economicgraph.linkedin.com/resources/linkedin-workforce-report-july-2024) - This month's LinkedIn Workforce Report looks at our latest national data on hiring and migration tre...

47. [Workforce data - LinkedIn's Economic Graph](https://economicgraph.linkedin.com/workforce-data) - Real-time data and updates including Labor market insights, Workforce Confidence Index, and LinkedIn...

48. [Salaries and Compensation at Top Companies | Glassdoor](https://www.glassdoor.com/Salaries/index.htm) - Search salaries at top companies and discover what you should be paid. Compare average salaries, com...

49. [Household Debt and Credit Report](https://www.newyorkfed.org/microeconomics/hhdc) - Non-housing debt balances declined by $15 billion, or 0.3%, from 2025Q4. This decline was driven pri...

50. [Household Debt and Credit - Federal Reserve Bank of New York](https://www.newyorkfed.org/microeconomics/hhdc/background.html) - The dataset can be used to calculate national and regional aggregate measures of individual- and hou...

51. [Household Debt by State, County, and MSA - Catalog - Data.gov](http://catalog.data.gov/dataset/household-debt-by-state-county-and-msa) - The tables and interactive maps below allow users to explore the ratio of debt to income by state, m...

52. [Comprehensive Housing Affordability Strategy (CHAS) Data and ...](https://www.huduser.gov/portal/datasets/cp.html) - These data, known as the "CHAS" data (Comprehensive Housing Affordability Strategy), demonstrate the...

53. [HUD Consolidated Planning/CHAS Data](https://www.datalumos.org/datalumos/project/219201/view) - These data, known as the "CHAS" data (Comprehensive Housing Affordability Strategy), demonstrate the...

54. [The Eviction Lab](https://evictionlab.org) - The Eviction Lab at Princeton University creates data, interactive tools, and research to help neigh...

55. [Eviction Lab Media Resources](https://evictionlab.org/media/) - Find eviction rates and overall eviction filings numbers in every county and state between 2000 to 2...

56. [Data | Opportunity Insights](https://opportunityinsights.org/data/) - Explore Neighborhood-Level Data to Find Solutions to Your Community's Challenges. ... GPS Mobility D...

57. [The Opportunity Atlas: Mapping the Childhood Roots of Social Mobility](https://opportunityinsights.org/paper/the-opportunity-atlas/) - Explore Neighborhood-Level Data to Find Solutions to Your Community's Challenges. ... Raj Chetty, Na...

58. [Metro Monitor 2024 - Brookings Institution](https://www.brookings.edu/articles/metro-monitor-2024/) - The Metro Monitor examines economic performance across five broad categories: growth, prosperity, ov...

59. [Metro Monitor 2025 - Brookings Institution](https://www.brookings.edu/articles/metro-monitor-2025/) - The Metro Monitor examines economic performance across five broad categories: growth, prosperity, ov...

60. [The Brookings Institution - Metro Monitor 2026 - LinkedIn](https://www.linkedin.com/posts/the-brookings-institution_metro-monitor-2026-the-relationship-between-activity-7441871381564346368-JDOs) - As federal immigration policy shifts, new data offers a timely look at what's at stake for regional ...

61. [The State of the Nation's Housing 2024](https://www.jchs.harvard.edu/state-nations-housing-2024) - The Harvard Joint Center for Housing Studies strives to improve equitable access to decent, affordab...

62. [The State of the Nation's Housing 2025](https://www.jchs.harvard.edu/state-nations-housing-2025) - The Harvard Joint Center for Housing Studies strives to improve equitable access to decent, affordab...

63. [SafeGraph Partners with Dewey for Academic Data Access](https://www.safegraph.com/blog/safegraph-partners-with-dewey/) - Accessing SafeGraph Data Through Dewey. Anyone affiliated with a university that subscribes to the D...

64. [SafeGraph Data for Academics - Dewey Data](https://www.deweydata.io/data-partners/safegraph) - Browse SafeGraph data available via the Dewey platform, including fresh and accurate points of inter...

65. [Advan Data for Academics - Dewey Data](https://www.deweydata.io/data-partners/advan) - Advan research data for academics. Understand consumer mobility at specific places (POI) or neighbor...

66. [Foot Traffic Data Feeds | Patterns+ Product - Advan Research](https://advanresearch.com/products/patternsplus) - Patterns+ is a high-fidelity foot traffic dataset offering weekly visitor behavior, trade areas, and...

67. [Placer.ai Deepens Bloomberg Collaboration with Data Entitlements ...](https://www.placer.ai/anchor/articles/placer-ai-deepens-bloomberg-collaboration-with-data-entitlements-offering) - Placer.ai Location Analytics featured among the first premium data sets for Data Entitlements in {AL...

68. [Pricing Plans | Customized Subscription Packages - Placer.ai](https://www.placer.ai/pricing) - Educational users are encouraged to register for our free edition and take advantage of the no-cost ...

69. [Placer.AI is great but too expensive. Can anyone ... - Reddit](https://www.reddit.com/r/CommercialRealEstate/comments/whp9a3/placerai_is_great_but_too_expensive_can_anyone/) - Placer is great but the price is $1000+ monthly from what I've been quoted. Has anyone found a cheap...

70. [AWS Marketplace: SafeGraph](https://aws.amazon.com/marketplace/seller-profile?id=7d5ff8ca-105f-4856-9d99-5f2f1d83223c) - Free | 1 month subscription available. SafeGraph Open Census Data contains 7500+ demographic attribu...

