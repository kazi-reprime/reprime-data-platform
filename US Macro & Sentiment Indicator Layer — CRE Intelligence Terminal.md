# US Macro & Sentiment Indicator Layer — CRE Intelligence Terminal

## Overview

This reference compiles every free, machine-readable US macro and sentiment data source a CRE intelligence terminal needs to read the cycle in real time. Every entry includes an exact API or CSV endpoint, series IDs, authentication requirements, release cadence, and the specific tile or sparkline it powers. Sources are sorted from highest frequency (daily) to lowest (quarterly).

***

## Master Indicator Table

> **Auth key legend:**  
> `BLS-KEY` — free registration at https://www.bls.gov/developers/home.htm  
> `FRED-KEY` — free registration at https://fredaccount.stlouisfed.org/login/secure/  
> `BEA-KEY` — free at https://apps.bea.gov/API/signup/index.cfm  
> `EIA-KEY` — free at https://www.eia.gov/opendata/  
> `NONE` — no key required

***

### DAILY INDICATORS

| Indicator | Source | Exact API / CSV Endpoint | Series ID / Slug | Auth | Cadence & Release Time (ET) | Lag from Period-End | Format | Live Tile | CRE Relevance |
|---|---|---|---|---|---|---|---|---|---|
| **SOFR** (Secured Overnight Financing Rate) | NY Fed | `https://www.newyorkfed.org/markets/reference-rates/sofr` — data CSV: `https://markets.newyorkfed.org/api/rates/secured/sofr/last/1.json` | `SOFR` (FRED: `SOFR`) | NONE | Daily, ~8:00 AM | T+1 business day | JSON / CSV | Rate ticker, sparkline | Benchmark floating-rate index; directly prices CRE loans, construction financing, and CMBS coupon reset[^1][^2] |
| **SOFR 30/90/180-Day Averages** | NY Fed | `https://www.newyorkfed.org/markets/reference-rates/sofr-averages-and-index` | FRED: `SOFR30DAYAVG`, `SOFR90DAYAVG`, `SOFR180DAYAVG` | NONE (FRED-KEY for bulk) | Daily, ~8:00 AM | T+1 business day | JSON / CSV | Rolling-rate gauge | Smoothed rate for loan pricing; 30-day average standard on many floating-rate bridge loans[^2][^3] |
| **Treasury Yield Curve (H.15 Daily)** | Federal Reserve Board | `https://www.federalreserve.gov/releases/h15/` — DDP download: `https://www.federalreserve.gov/datadownload/Choose.aspx?rel=H15` | FRED series: `DGS1MO`, `DGS3MO`, `DGS6MO`, `DGS1`, `DGS2`, `DGS5`, `DGS10`, `DGS30` | NONE (FRED-KEY for API) | Daily, 4:15 PM | T+0 (same day close) | CSV / JSON | Yield curve widget, 2-10 spread gauge | 10-year Treasury is the primary cap rate anchor; 2-10 inversion is strongest leading recession signal for CRE demand[^4][^5] |
| **Daily Treasury Par Yield Curve** | US Treasury | `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rate-archives` — current year JSON: `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdate_value[value][year]=2026` | Maturities: 1M, 2M, 3M, 4M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y | NONE | Daily, ~4:15 PM | T+0 | JSON / CSV | Dual yield-curve overlay vs FRED H.15 | Primary government source; used to cross-check FRED H.15; 10yr–2yr spread is a standard CRE cycle barometer[^6] |
| **Atlanta Fed GDPNow** | Atlanta Fed | `https://www.atlantafed.org/research-and-data/data/gdpnow` — model data CSV: linked from page as `GDPNow Model Data and Historical Forecasts`; FRED mirror: `GDPNOW` | `GDPNOW` | NONE | Updated on each major data release day throughout quarter, typically 2–6×/week during active quarter | Current quarter, continuously updated | CSV / FRED JSON | GDP nowcast speedometer | Real-time GDP tracker; GDP contraction triggers CRE distress cycle; Q1 2026 WEI/GDPNow divergence is a key watch[^7][^8] |

***

### WEEKLY INDICATORS

| Indicator | Source | Exact API / CSV Endpoint | Series ID / Slug | Auth | Cadence & Release Time (ET) | Lag from Period-End | Format | Live Tile | CRE Relevance |
|---|---|---|---|---|---|---|---|---|---|
| **Initial Unemployment Claims (ICSA)** | DOL / FRED | BLS: `https://oui.doleta.gov/unemploy/claims.asp` (XLS); FRED API: `https://api.stlouisfed.org/fred/series/observations?series_id=ICSA&api_key=KEY&file_type=json` | `ICSA` | FRED-KEY | Weekly, Thursday 8:30 AM | ~5 days | JSON / XLS | Claims spike alert, event marker | Rising claims → tenant stress, lease defaults; weekly pulse faster than monthly payrolls[^9] |
| **Continuing Unemployment Claims (CCSA)** | DOL / FRED | FRED API same template as ICSA | `CCSA` | FRED-KEY | Weekly, Thursday 8:30 AM | ~12 days | JSON | Duration trend sparkline | Persistent elevated CCSA signals structural job loss affecting office/retail demand[^9] |
| **NY Fed Weekly Economic Index (WEI)** | NY Fed / Dallas Fed | Dallas Fed hosts updated data: `https://www.dallasfed.org/research/wei` — CSV download linked on page; FRED: `WEI` | `WEI` | NONE | Weekly, Thursday ~10:30 AM CT | ~5 days | CSV / FRED JSON | Composite activity sparkline | 10-indicator composite (consumer, labor, production) scaled to 4Q GDP; fastest macro regime gauge available[^10][^11] |
| **EIA Weekly Petroleum Status Report** | EIA | `https://api.eia.gov/v2/petroleum/sum/sndw/data/?api_key=KEY` — Dashboard: `https://www.eia.gov/petroleum/supply/weekly/` | EIA API: `PET.WCESTUS1.W` (crude stocks); `PET.WGFSTUS1.W` (gasoline) | EIA-KEY | Weekly, Wednesday 10:30 AM | ~4 days | JSON | Energy cost indicator | Construction/logistics costs tied to diesel; energy price shocks flow through to CRE operating expenses and NOI[^12][^13] |
| **EIA Natural Gas Storage** | EIA | `https://api.eia.gov/v2/natural-gas/stor/wkly/data/?api_key=KEY` | `NG.NW2_EPG0_SWO_R48_BCF.W` | EIA-KEY | Weekly, Thursday 10:30 AM | ~5 days | JSON | Energy/utility cost tracker | Industrial/warehouse tenant utility costs; surplus storage → lower rents for gas-heavy industrial assets[^12] |
| **Philly Fed ADS Business Conditions Index** | Philadelphia Fed | `https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/ads` — CSV download on page | `ADS_index` | NONE | Updated ~8× per month as underlying data releases | Coincident, real-time | CSV | Sub-weekly nowcast bar | Blends 6 series (claims, payrolls, IP, income, trade sales, GDP); highest-frequency business conditions gauge for CRE cycle positioning[^14][^15] |

***

### MONTHLY INDICATORS

| Indicator | Source | Exact API / CSV Endpoint | Series ID / Slug | Auth | Cadence & Release Time (ET) | Lag from Period-End | Format | Live Tile | CRE Relevance |
|---|---|---|---|---|---|---|---|---|---|
| **ADP National Employment Report** | ADP Research / Stanford Lab | Monthly release via press release: `https://adpemploymentreport.com/` — preliminary weekly estimate (new, Tuesdays): `https://mediacenter.adp.com/` | No public API; download from press release page or FRED `ADPMNUSNERSA` | NONE (FRED-KEY for API) | Monthly: 1st Wed of month, 8:15 AM; Weekly preliminary: each Tuesday, 8:15 AM | 2 days before BLS NFP | PDF press release / FRED JSON | NFP preview ticker | Private payrolls leader; sector breakdowns (leisure/hospitality = retail CRE leading indicator; construction = supply pipeline signal)[^16][^17] |
| **BLS CES: Nonfarm Payrolls (NFP)** | BLS API v2 | `POST https://api.bls.gov/publicAPI/v2/timeseries/data/` with JSON body `{"seriesid":["CEU0000000001","CEU2000000001","CEU7000000001"],"registrationkey":"KEY"}` | `CEU0000000001` (total nonfarm), `CEU2000000001` (construction), `CEU7000000001` (leisure & hospitality) | BLS-KEY | Monthly: 1st Friday, 8:30 AM | ~30 days | JSON | NFP headline ticker + sector splits | Construction payrolls → labor supply/cost for new supply; leisure/hospitality → retail/hotel CRE demand driver[^9][^18] |
| **BLS CPS: Unemployment Rate** | BLS API v2 | Same endpoint as CES | `LNS14000000` (U-3), `LNS13000000` (employed), `LNS11300000` (labor force participation) | BLS-KEY | Monthly: 1st Friday, 8:30 AM (same release as NFP) | ~30 days | JSON | Unemployment gauge | U-3 above 5% historically precedes retail/office lease defaults; participation tracks workforce size affecting housing demand[^19][^18] |
| **BLS JOLTS: Job Openings, Quits, Hires** | BLS API v2 | Same endpoint | `JTU000000000JOL` (openings), `JTU000000000HIL` (hires), `JTU000000000QUL` (quits), `JTU000000000TSL` (total separations) | BLS-KEY | Monthly: 4th Tuesday (~4 weeks after reference month), 10:00 AM | ~60 days | JSON | JOLTS openings sparkline, quits rate | Quits rate is forward demand signal for multifamily (household formation); openings tighten or loosen office/industrial leasing[^9] |
| **BLS CPI — All Items** | BLS API v2 | Same endpoint | `CUUR0000SA0` | BLS-KEY | Monthly: ~2nd or 3rd week, 8:30 AM | ~15 days | JSON | Inflation headline gauge | Overall inflation drives Fed policy and cap rate trajectory; primary macro risk to CRE valuations[^20] |
| **BLS CPI — Shelter** | BLS API v2 | Same endpoint | `CUUR0000SAH1` | BLS-KEY | Monthly: same as CPI | ~15 days | JSON | Shelter CPI sparkline | Largest CPI component; real-time rent pressure gauge; lagging indicator to actual market rents by ~12–18 months[^20] |
| **BLS PPI — Lumber** | BLS API v2 | Same endpoint | `WPU0571` | BLS-KEY | Monthly: ~2nd or 3rd week, 8:30 AM | ~15 days | JSON | Construction cost index | Lumber cost is #1 variable in residential/wood-frame multifamily construction pro forma[^20] |
| **BLS PPI — Iron and Steel** | BLS API v2 | Same endpoint | `WPU101` | BLS-KEY | Monthly: same as PPI release | ~15 days | JSON | Steel cost sparkline | Structural steel drives high-rise multifamily and industrial construction costs; tariff-sensitive[^20] |
| **BLS PPI — Gypsum** | BLS API v2 | Same endpoint | `WPU0573` | BLS-KEY | Monthly: same as PPI release | ~15 days | JSON | Drywall cost tile | Interior finish cost for all asset classes; sensitive to housing-start demand cycles[^20] |
| **BLS Employment Cost Index (ECI)** | BLS API v2 | Same endpoint | `CIU2010000000000A` (private wages), `CIU2020000000000A` (private benefits); FRED: `ECIWAG` | BLS-KEY | Quarterly: last business day of Jan/Apr/Jul/Oct, 8:30 AM | ~30 days | JSON | Labor cost sparkline | Property management and construction labor cost driver; ECI above CPI = NOI compression risk for operators[^21][^22] |
| **BLS Productivity & Real Earnings** | BLS API v2 | Same endpoint | `PRS85006092` (nonfarm business output/hr), `LEU0252881500` (real avg weekly earnings) | BLS-KEY | Quarterly (productivity), Monthly (earnings), 8:30 AM | ~30/15 days | JSON | Real wage tracker | Real earnings deflation → consumer spending stress → retail/hospitality CRE headwinds[^23] |
| **ISM Manufacturing PMI** | ISM (historical CSV via eco3min) | Eco3min CSV: `https://eco3min.fr/dataset/ism-manufacturing-pmi.csv`; official release: `https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports/` | No public API; use FRED `MANEMP` or `NAPMPI` as proxy; eco3min CSV is the cleanest direct source | NONE | Monthly: 1st business day, 10:00 AM | ~30 days | CSV | PMI dial gauge | Manufacturing contraction (below 50) signals industrial/warehouse demand softening; correlates with CRE construction pipeline adjustments[^24][^25] |
| **ISM Services PMI** | ISM | Same page as Manufacturing | No public API; FRED `NMFCI` as proxy | NONE | Monthly: 3rd business day, 10:00 AM | ~30 days | Press release / FRED | Services PMI gauge | Services > 70% of US GDP; services expansion supports office/retail leasing; critical CRE demand driver[^25] |
| **Conference Board LEI** | Conference Board | Press release: `https://www.conference-board.org/topics/us-leading-indicators/` — data access: `https://data-central.conference-board.org/` (free account required) | N/A (subscription for full series; FRED `USALOLITONOSTSAM` is OECD equivalent) | Free account at data-central.conference-board.org | Monthly: ~3rd week, 10:00 AM | ~3 weeks | Press release / restricted API | Recession risk signal | LEI decline for 6+ consecutive months = CRE distress ahead; contains building permits and credit spread as components[^26][^27] |
| **University of Michigan Consumer Sentiment** | Univ. of Michigan | Preliminary (mid-month): `https://www.sca.isr.umich.edu`; Final (last Friday): same URL; FRED: `https://api.stlouisfed.org/fred/series/observations?series_id=UMCSENT&api_key=KEY` | `UMCSENT` | FRED-KEY | Monthly: Preliminary 2nd Friday, Final last Friday, 10:00 AM | ~2/4 weeks | FRED JSON | Sentiment gauge, event marker | Consumer confidence directly drives housing, retail spending, and lodging demand; 5Y inflation expectations within report are a rate-risk signal for CRE valuations[^28][^29][^30] |
| **Chicago Fed CFNAI** | Chicago Fed | `https://www.chicagofed.org/research/data/cfnai/current-data` — CSV download on page; FRED: `CFNAI` | `CFNAI`, `CFNAI-MA3` | NONE / FRED-KEY | Monthly: last week of month, 8:30 AM | ~30 days | CSV / FRED JSON | Broad activity composite tile | 85-variable composite; CFNAI-MA3 < –0.70 = recession in progress; broader than any single Fed survey[^31][^32] |
| **Philly Fed Manufacturing Business Outlook Survey** | Philadelphia Fed | `https://www.philadelphiafed.org/surveys-and-data/regional-economic-analysis/mbos-2026-05-15` — historical CSV on survey page | `MFGBOS` / FRED `TXMFGBUSI` (Texas equivalent); Philly CSV direct download on survey landing page | NONE | Monthly: 3rd Thursday, 8:30 AM | ~30 days | CSV | Regional mfg sentiment gauge | Philly Fed district industrial demand; new orders sub-index is 4–6 week leading indicator for mid-Atlantic industrial/warehouse leasing[^33] |
| **Philly Fed Services Survey** | Philadelphia Fed | Same surveys-and-data page | CSV on survey page | NONE | Monthly: 3rd Thursday, 8:30 AM | ~30 days | CSV | Services diffusion gauge | Office/flex demand in DE, NJ, PA corridor; companion to manufacturing survey[^33] |
| **Philly Fed Survey of Professional Forecasters (SPF)** | Philadelphia Fed | `https://www.philadelphiafed.org/surveys-and-data/data-files` — per-variable CSV downloads | Quarterly data files by variable (RGDP, CPI, UNEMP, etc.) | NONE | Quarterly: ~mid-Feb, mid-May, mid-Aug, mid-Nov | ~6 weeks after quarter end | CSV | Consensus forecast band chart | 10-year inflation expectations anchor long-term cap rate assumptions; GDP probability distribution sets recession-weight in stress tests[^34][^35][^36] |
| **Philly Fed GDPplus** | Philadelphia Fed | `https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/gdpplus` — Excel download on page | GDP+ series file | NONE | Quarterly, ~3 weeks after BEA advance GDP | ~3 weeks | XLSX | GDP quality indicator | Optimal blend of income-side and expenditure-side GDP; smooths BEA revisions; more accurate signal for cycle turning points[^14] |
| **Dallas Fed Texas Manufacturing Outlook** | Dallas Fed | `https://www.dallasfed.org/research/surveys/tmos/2026/2605` — CSV/Excel download; historical: `https://www.dallasfed.org/research/surveys/tmos` | Excel tables on page | NONE | Monthly: last Monday of month, 10:30 AM CT | ~30 days | XLSX | TX industrial gauge | Energy-sector employment and industrial real estate demand concentrated in DFW/Houston; key signal for Sunbelt CRE[^37] |
| **Dallas Fed Service Sector Outlook** | Dallas Fed | `https://www.dallasfed.org/research/surveys/tssos` — Excel download on page | Excel tables | NONE | Monthly: last Tuesday of month, 10:30 AM CT | ~30 days | XLSX | TX services diffusion gauge | Captures finance/insurance/logistics service growth driving Dallas office/flex demand[^37] |
| **Dallas Fed Trimmed Mean PCE** | Dallas Fed | `https://www.dallasfed.org/research/pce` — data download link on page; FRED: `PCECTPICTM` | `PCECTPICTM` | FRED-KEY | Monthly: day BEA releases PCE (~last business day), 10:30 AM CT | Same day as BEA PCE | CSV / FRED JSON | Core inflation sparkline | Best single measure of trend inflation; less noisy than core PCE; Fed closely watches this when calibrating rate path — the key cap rate risk indicator[^38][^37][^39] |
| **Kansas City Fed Manufacturing Survey** | Kansas City Fed | `https://www.kansascityfed.org/surveys/manufacturing-survey/` — Excel download on page | Excel data tables | NONE | Monthly: last Thursday of month | ~30 days | XLSX | Plains manufacturing gauge | Agricultural and energy-related industrial CRE demand in Kansas, Nebraska, Oklahoma, Colorado[^40][^41] |
| **Kansas City Fed Labor Market Conditions Indicators (LMCI)** | Kansas City Fed | `https://www.kansascityfed.org/data-and-trends/labor-market-conditions-indicators/` — CSV download linked | FRED: `FRBKCLMCILA` (level), `FRBKCLMCIMA` (momentum) | FRED-KEY | Monthly: ~3rd week | ~3 weeks | CSV / FRED JSON | Labor market composite gauge | LMCI captures 24 labor variables; momentum index leads NFP by 1–2 months; tightening labor → rising rents in multifamily markets[^42][^43] |
| **Richmond Fed Manufacturing Survey** | Richmond Fed | `https://www.richmondfed.org/region_communities/regional_data_analysis/business_surveys/manufacturing` — Excel download | Excel/CSV on page | NONE | Monthly: 4th Tuesday, 10:00 AM | ~30 days | XLSX | Mid-Atlantic mfg gauge | DC/VA/NC/SC industrial demand; government-adjacent office market correlations in Northern Virginia[^44][^45] |
| **Richmond Fed Non-Manufacturing Survey** | Richmond Fed | `https://www.richmondfed.org/region_communities/regional_data_analysis/business_surveys/non-manufacturing` — Excel download | Excel/CSV on page | NONE | Monthly: 4th Tuesday, 10:00 AM | ~30 days | XLSX | Mid-Atlantic services gauge | Revenue and employment expectations in the Richmond District's services sector; proxy for DC metro office demand[^46][^47] |
| **NY Fed Underlying Inflation Gauge (UIG)** | NY Fed / FRED | FRED release page: `https://fred.stlouisfed.org/release?rid=605`; NY Fed: `https://www.newyorkfed.org/research/policy/underlying-inflation-gauge` | FRED: `UIGFULL` (full data set), `UIGPRICE` (prices-only) | FRED-KEY | Monthly: ~mid-month | ~2 weeks | FRED JSON | Trend inflation overlay | Broad-based inflation measure combining 100+ variables; leads CPI turns by 1–2 months; critical for Fed path and thus CRE discount rate[^48][^49][^50] |
| **NY Fed Consumer Expectations Survey (SCE)** | NY Fed | `https://www.newyorkfed.org/microeconomics/sce` — CSV downloads on page | Per-topic CSVs (inflation expectations, credit access, housing market, labor market) | NONE | Monthly: 2nd Monday, 11:00 AM | ~30 days | CSV | Expectations dashboard | Housing section includes: home price expectations (1Y and 3Y ahead), moving intentions, rent vs. buy preferences — direct CRE demand signal[^51] |
| **NY Fed Recession Probabilities (Yield-Curve Model)** | NY Fed | `https://www.newyorkfed.org/research/capital_markets/ycfaq` — Excel data: linked on page | Excel download; FRED: `RECPROUSM156N` | FRED-KEY | Monthly: ~end of month | ~30 days | XLSX / FRED JSON | Recession probability dial | 10Y–3M spread-based recession probability 12 months ahead; most-cited single recession indicator; threshold of 30%+ triggers CRE defensive positioning[^52] |
| **BEA GDP (Advance, Preliminary, Final)** | BEA API | `https://apps.bea.gov/api/data/?UserID=KEY&method=GetData&DataSetName=NIPA&TableName=T10101&Frequency=Q&Year=ALL&ResultFormat=JSON` | NIPA Table 1.1.1 (GDP %-change), T20100 (Personal Income) | BEA-KEY | Quarterly: Advance (~last week of month after quarter), Preliminary (+1 mo), Final (+2 mo), 8:30 AM | 25–90 days | JSON | GDP bar chart | GDP contraction of 2+ consecutive quarters resets CRE underwriting assumptions across all asset classes[^53][^54] |
| **BEA State & MSA Personal Income** | BEA API | `https://apps.bea.gov/api/data/?UserID=KEY&method=GetData&DataSetName=Regional&TableName=SAINC1&LineCode=1&GeoFips=STATE&Year=LAST5&ResultFormat=JSON` | `Regional` dataset, `SAINC1` (state personal income) | BEA-KEY | Annually (state-level), Quarterly (metro estimates) | ~6 months lag | JSON | State income heat map | Personal income by MSA is the single best leading indicator of multifamily rent growth and retail sales performance[^54][^55] |
| **Census Monthly Construction Spending (VIP)** | Census | `https://www.census.gov/construction/c30/current/index.html` — data file: `https://www.census.gov/construction/c30/xls/totalsa.xls`; API: `https://api.census.gov/data/timeseries/eits/vip?get=cell_value,error_data&for=us:1&unitofmeasure=millions_of_dollars&seasonally_adj=yes&category_code=PRIV&time=2026-01` | `vip` (Value of Construction Put in Place) | NONE | Monthly: 1st business day of month, 10:00 AM | ~2 months | XLS / JSON | CRE construction spending bar | Total private non-residential construction = direct CRE supply-side indicator; residential completions feed multifamily vacancy models[^56][^57] |
| **Census Building Permits Survey (BPS)** | Census | `https://www.census.gov/permits` — monthly data: `https://www.census.gov/construction/nrc/current/index.html`; FRED: `PERMIT` (total), `PERMITNSA` | `PERMIT`, `PERMIT1` (single-family), `PERMIT5` (5+ units); BLS series `CUUR0000SAH1` shelter cross-ref | NONE / FRED-KEY | Monthly: ~3rd week (joint release with Housing Starts), 8:30 AM | ~3 weeks | XLS / FRED JSON | Permit pipeline sparkline | Multifamily permit pulls (5+ unit) are the primary leading indicator for apartment supply additions 12–18 months forward[^58][^59] |
| **Census Retail Trade (MARTS)** | Census | Monthly Advance Retail Trade: `https://www.census.gov/retail/marts/www/marts_current.xlsx`; API: `https://api.census.gov/data/timeseries/eits/marts?get=cell_value&for=us:1&time=2026-01` | `marts` | NONE | Monthly: ~2nd week, 8:30 AM | ~2 weeks | XLS / JSON | Retail sales sparkline | Retail sales momentum directly sets retail CRE revenue expectations; food service sub-index drives restaurant/NNN lease renewals[^60] |
| **FOMC Meeting Calendar & Dates** | Federal Reserve | `https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm` | N/A — structured HTML; scrape or use ical feed | NONE | Static calendar; updated annually; minutes released 3 weeks after meeting | N/A | HTML / iCal | FOMC event marker on timeline | Every FOMC decision shifts cap rate compression/expansion expectations; hold vs. cut vs. hike changes CRE transaction volume immediately[^61][^62] |
| **Beige Book** | Federal Reserve | `https://www.federalreserve.gov/monetarypolicy/publications/beige-book-default.htm` — 2026 schedule listed on page | Full text HTML/PDF per district | NONE | 8× per year (~2 weeks before each FOMC), 2:00 PM | ~6 weeks of anecdotal coverage | HTML / PDF | Qualitative text feed / event marker | Real estate section contains direct commentary on CRE conditions, rent trends, vacancy, and credit availability in each of the 12 Fed districts[^63][^64] |
| **FOMC SEP Dot Plot Data** | Federal Reserve | Embedded in FOMC press conference materials: `https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm` — SEP PDF released same day as decision | No machine-readable API; parse projections PDF or use scraper | NONE | Quarterly (4 of 8 FOMC meetings), ~2:00 PM | Same day | PDF | Dot plot visualization | Long-run dot anchors the terminal rate expectation; the single most influential input to CRE cap rate forecasting models[^61] |

***

### QUARTERLY INDICATORS

| Indicator | Source | Exact API / CSV Endpoint | Series ID / Slug | Auth | Cadence & Release Time (ET) | Lag from Period-End | Format | Live Tile | CRE Relevance |
|---|---|---|---|---|---|---|---|---|---|
| **FRED: CRE Loan Delinquency Rate** | FRED (FR Y-9C data) | `https://api.stlouisfed.org/fred/series/observations?series_id=DRCRELEXFACBS&api_key=KEY` | `DRCRELEXFACBS` (CRE ex-farmland delinquency), `DRCRELACBS` (all CRE) | FRED-KEY | Quarterly, ~10 weeks after quarter-end | ~10 weeks | JSON | Delinquency rate gauge | The CRE stress barometer: rising delinquency signals distressed asset opportunity and lender credit tightening[^65] |
| **FRED: Multifamily/Rental Vacancy Rate** | FRED (Census HVS) | `https://api.stlouisfed.org/fred/series/observations?series_id=RRVRUSQ156N&api_key=KEY` | `RRVRUSQ156N` | FRED-KEY | Quarterly, ~3 weeks after quarter end | ~3 weeks | JSON | Vacancy sparkline | National apartment vacancy benchmark; rising vacancy compresses multifamily NOI and drives cap rate expansion[^66] |
| **Philly Fed Survey of Professional Forecasters** | Philadelphia Fed | `https://www.philadelphiafed.org/surveys-and-data/data-files` — full data set ZIP | Annual data files by variable | NONE | Quarterly: mid-Feb, mid-May, mid-Aug, mid-Nov | ~6 weeks | CSV | Consensus band visualization | Provides probability distribution of GDP/inflation outcomes; critical for building recession-weight stress tests in CRE DCF models[^34][^35][^36] |
| **BLS Employment Cost Index (ECI)** | BLS API v2 | `POST https://api.bls.gov/publicAPI/v2/timeseries/data/` | `CIU2010000000000A`, `ECIWAG` | BLS-KEY | Quarterly: last business day of Jan/Apr/Jul/Oct, 8:30 AM | ~30 days | JSON | Labor cost index tile | Construction/property management labor cost tracker; ECI growth > inflation = NOI compression; Q1 2026: civilian comp +3.4% YoY[^21][^22] |

***

## FRED API Call Template

All FRED series share a single GET pattern:[^67][^68]

```
Base URL:
  https://api.stlouisfed.org/fred/series/observations

Required params:
  series_id   = {SERIES_ID}
  api_key     = {YOUR_32_CHAR_KEY}
  file_type   = json          # or xml
  observation_start = 2015-01-01   # optional
  observation_end   = 9999-12-31   # optional
  frequency   = m             # d=daily, w=weekly, m=monthly, q=quarterly, a=annual
  units       = lin           # lin=levels, chg=change, pc1=pct change from year ago

Full example (10-year Treasury, monthly, % change YoY):
  https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=KEY&file_type=json&frequency=m&units=pc1
```

**50 Most Useful FRED Series IDs for CRE:**

| Category | Series ID | Description |
|---|---|---|
| **Rates** | `DGS1MO` | 1-Month Treasury |
| | `DGS3MO` | 3-Month Treasury |
| | `DGS2` | 2-Year Treasury |
| | `DGS5` | 5-Year Treasury |
| | `DGS10` | 10-Year Treasury |
| | `DGS30` | 30-Year Treasury |
| | `SOFR` | SOFR Overnight |
| | `SOFR30DAYAVG` | 30-Day Average SOFR |
| | `FEDFUNDS` | Effective Fed Funds Rate |
| | `DFII10` | 10-Year TIPS Yield (real rate) |
| **Credit Spreads** | `BAMLC0A4CBBB` | ICE BofA BBB Corporate Spread |
| | `BAMLH0A0HYM2` | High-Yield (Junk) Spread |
| | `TEDRATE` | TED Spread (credit stress) |
| | `T10Y2Y` | 10Y–2Y Yield Spread |
| | `T10Y3M` | 10Y–3M Yield Spread (NY Fed recession model input) |
| **MBS/Mortgage** | `MORTGAGE30US` | 30-Year Fixed Mortgage Rate |
| | `MORTGAGE15US` | 15-Year Fixed Mortgage Rate |
| | `MSPNHSUS` | Median Sales Price New Homes |
| **CRE-Specific** | `DRCRELEXFACBS` | CRE Loan Delinquency Rate (ex-farmland) |
| | `DRCRELACBS` | CRE Loan Delinquency Rate (all) |
| | `RRVRUSQ156N` | US Rental Vacancy Rate |
| | `EQFXSUBPRIME` | Subprime MBS Spreads (CMBS stress proxy) |
| | `CCLACBW027SBOG` | Commercial & Industrial Loan Growth |
| | `BUSLOANS` | Commercial & Industrial Loans |
| | `RREACBQ158SBOG` | Residential RE Loans, All Banks |
| **Inflation** | `CPIAUCSL` | CPI All Urban (seasonally adj) |
| | `CPILFESL` | Core CPI (ex-food and energy) |
| | `PCEPI` | PCE Price Index |
| | `PCEPILFE` | Core PCE Price Index |
| | `PCECTPICTM` | Dallas Fed Trimmed Mean PCE |
| | `MICH` | UMich 1Y Inflation Expectations |
| **Labor** | `UNRATE` | U-3 Unemployment Rate |
| | `U6RATE` | U-6 Unemployment (underemployment) |
| | `PAYEMS` | Total Nonfarm Payrolls |
| | `ICSA` | Initial Unemployment Claims |
| | `CCSA` | Continuing Claims |
| | `JTSJOL` | JOLTS Job Openings |
| | `ECIWAG` | ECI Wages & Salaries |
| **Activity** | `INDPRO` | Industrial Production Index |
| | `CFNAI` | Chicago Fed CFNAI |
| | `WEI` | Weekly Economic Index |
| | `GDPNOW` | Atlanta Fed GDPNow |
| | `GDPC1` | Real GDP (quarterly) |
| **Housing/Construction** | `PERMIT` | Building Permits (total) |
| | `PERMIT1` | Single-Family Permits |
| | `HOUST5F` | 5+ Unit Housing Starts |
| | `TTLCONS` | Total Construction Spending |
| | `MANEMP` | Manufacturing Employment |
| **Sentiment** | `UMCSENT` | UMich Consumer Sentiment |
| | `RECPROUSM156N` | NY Fed Recession Probability |

***

## BLS API v2 Call Template

Registration: https://data.bls.gov/registrationEngine/[^9][^18]

```python
import requests

# POST for multiple series (up to 50 with key)
url = "https://api.bls.gov/publicAPI/v2/timeseries/data/"
payload = {
    "seriesid": [
        "CEU0000000001",   # Total Nonfarm Payrolls
        "LNS14000000",     # Unemployment Rate
        "JTU000000000JOL", # JOLTS Job Openings
        "JTU000000000HIL", # JOLTS Hires
        "CUUR0000SA0",     # CPI All Items
        "CUUR0000SAH1",    # CPI Shelter
        "WPU0571",         # PPI Lumber
        "WPU101",          # PPI Iron and Steel
        "WPU0573"          # PPI Gypsum
    ],
    "startyear": "2020",
    "endyear": "2026",
    "registrationkey": "YOUR_BLS_API_KEY"
}
r = requests.post(url, json=payload)
data = r.json()["Results"]["series"]
```

***

## BEA API Call Template

Registration: https://apps.bea.gov/API/signup/index.cfm[^53][^54]

```python
import requests

BEA_KEY = "YOUR_36_CHAR_KEY"

# GDP quarterly percent change (NIPA Table 1.1.1)
gdp_url = (
    f"https://apps.bea.gov/api/data/?UserID={BEA_KEY}"
    "&method=GetData&DataSetName=NIPA&TableName=T10101"
    "&Frequency=Q&Year=ALL&ResultFormat=JSON"
)

# State personal income (Regional dataset)
state_income_url = (
    f"https://apps.bea.gov/api/data/?UserID={BEA_KEY}"
    "&method=GetData&DataSetName=Regional&TableName=SAINC1"
    "&LineCode=1&GeoFips=STATE&Year=LAST5&ResultFormat=JSON"
)
```

***

## EIA API Call Template

Registration: https://www.eia.gov/opendata/[^13][^69][^12]

```python
import requests

EIA_KEY = "YOUR_EIA_KEY"

# Weekly petroleum crude stocks
petro_url = (
    f"https://api.eia.gov/v2/petroleum/sum/sndw/data/"
    f"?api_key={EIA_KEY}&frequency=weekly"
    "&data=value&facets[series][]=WCESTUS1"
    "&sort[column]=period&sort[direction]=desc&length=52"
)

# Natural gas weekly storage
ng_url = (
    f"https://api.eia.gov/v2/natural-gas/stor/wkly/data/"
    f"?api_key={EIA_KEY}&frequency=weekly"
    "&data=value&sort[column]=period"
    "&sort[direction]=desc&length=52"
)
```

***

## Top 10 CRE Macro Cockpit — Ranked

The following 10 indicators, in priority order, constitute the minimum viable macro layer for a CRE intelligence terminal:[^7][^38][^65][^58][^24][^44][^52][^1][^31][^30]

| Rank | Indicator | Why It's #1 for CRE |
|---|---|---|
| 1 | **10-Year Treasury Yield (DGS10)** | The single input that moves cap rates; every 100 bps shift in the 10Y reprices the entire CRE market |
| 2 | **SOFR (daily)** | Floating-rate benchmark for 60–70% of outstanding CRE debt; bridge loan, construction loan, and CMBS coupon anchor |
| 3 | **Atlanta Fed GDPNow** | Real-time economic velocity; contraction below 0% triggers underwriting conservatism across all asset classes |
| 4 | **Dallas Fed Trimmed Mean PCE** | Cleanest inflation trend signal; drives Fed rate expectations and thus cap rate path |
| 5 | **NY Fed Recession Probability (12M)** | Probability above 30% historically precedes peak-to-trough CRE value declines of 20–35% |
| 6 | **BLS NFP + Construction Payrolls** | Labor market health is the #1 driver of office and industrial demand; construction payrolls signal new supply cost |
| 7 | **JOLTS Job Openings (JTU000000000JOL)** | Forward indicator for office/industrial absorption; quits rate leads multifamily household formation |
| 8 | **Building Permits 5+ Units (HOUST5F/PERMIT5)** | Direct 12–18 month leading indicator for apartment supply additions; shapes multifamily underwriting |
| 9 | **UMich Consumer Sentiment (UMCSENT)** | Consumer confidence directly drives retail CRE demand, hotel RevPAR, and multifamily leasing velocity |
| 10 | **CRE Loan Delinquency Rate (DRCRELEXFACBS)** | Lags the cycle by ~3 quarters; rising delinquency = distressed acquisition opportunity + credit tightening signal |

***

## Indicators That Move the CRE Thesis on Surprise

When the following release **meaningfully surprises** consensus (beat or miss), CRE underwriting assumptions should be immediately reviewed:

1. **BLS NFP** — A miss of ≥100K jobs vs. consensus shifts office absorption forecasts; a construction payroll miss signals labor cost relief for development pro formas.
2. **CPI / Core PCE** — A hot print delays Fed cuts → cap rate compression stalls; cap rate expansion accelerates; every 50 bps of rate delay = ~3–5% value reduction on stabilized assets.
3. **JOLTS Job Openings** — A sharp drop in openings leads office leasing slowdowns by 2–3 quarters; watch quits rate for multifamily household formation signals.
4. **ISM Manufacturing PMI** — Breaking below 45 (deep contraction) triggers industrial tenant demand revision; breaking above 55 from trough signals warehouse/distribution uptick.
5. **UMich 1Y Inflation Expectations** — A spike above 5% (current May 2026: 4.8%) re-anchors Fed hawkishness and hammers floating-rate CRE most directly.[^30]
6. **Building Permits (5+ units)** — A sustained 20%+ decline in multifamily permits is bullish for rents 18 months forward; a surge is bearish.
7. **Atlanta Fed GDPNow** — A single-week collapse of 2+ percentage points in the estimate (as seen in tariff-shock periods) triggers immediate reassessment of leasing demand forecasts.
8. **Conference Board LEI** — Six consecutive monthly declines constitute the historical early warning threshold for recession-driven CRE distress cycles.[^27]

***

## asyncio Python Snippet — Pull Today's Top 10 Indicators in Parallel

```python
import asyncio
import aiohttp
import os
from datetime import date

FRED_KEY = os.getenv("FRED_KEY")   # set in .env
BLS_KEY  = os.getenv("BLS_KEY")
BEA_KEY  = os.getenv("BEA_KEY")

FRED_BASE = "https://api.stlouisfed.org/fred/series/observations"

def fred_url(series: str, limit: int = 1) -> str:
    return (
        f"{FRED_BASE}?series_id={series}&api_key={FRED_KEY}"
        f"&file_type=json&sort_order=desc&limit={limit}"
    )

INDICATOR_MAP = {
    "10Y_Treasury":        fred_url("DGS10"),
    "SOFR":                fred_url("SOFR"),
    "SOFR_30Day_Avg":      fred_url("SOFR30DAYAVG"),
    "GDPNow":              fred_url("GDPNOW"),
    "Trimmed_Mean_PCE":    fred_url("PCECTPICTM"),
    "Recession_Prob_12M":  fred_url("RECPROUSM156N"),
    "UMich_Sentiment":     fred_url("UMCSENT"),
    "CRE_Delinquency":     fred_url("DRCRELEXFACBS"),
    "Initial_Claims":      fred_url("ICSA"),
    "WEI":                 fred_url("WEI"),
}

# BLS multi-series POST (requires separate async POST)
BLS_SERIES = [
    "CEU0000000001",   # NFP
    "LNS14000000",     # Unemployment
    "JTU000000000JOL", # JOLTS Openings
    "CUUR0000SA0",     # CPI
    "CUUR0000SAH1",    # Shelter CPI
    "WPU0571",         # Lumber PPI
    "WPU101",          # Iron & Steel PPI
    "WPU0573",         # Gypsum PPI
    "HOUST5F",         # 5+ Unit Starts (FRED proxy for permits)
    "PERMIT5",         # 5+ Unit Permits
]

async def fetch_fred(session: aiohttp.ClientSession, name: str, url: str) -> dict:
    async with session.get(url) as resp:
        data = await resp.json(content_type=None)
        obs = data.get("observations", [{}])
        latest = obs if obs else {}
        return {
            "indicator": name,
            "date":  latest.get("date"),
            "value": latest.get("value"),
        }

async def fetch_bls(session: aiohttp.ClientSession) -> list[dict]:
    today = date.today()
    payload = {
        "seriesid":       BLS_SERIES,
        "startyear":      str(today.year - 1),
        "endyear":        str(today.year),
        "registrationkey": BLS_KEY,
    }
    async with session.post(
        "https://api.bls.gov/publicAPI/v2/timeseries/data/",
        json=payload
    ) as resp:
        data = await resp.json(content_type=None)
        results = []
        for series in data.get("Results", {}).get("series", []):
            sid  = series["seriesID"]
            rows = series.get("data", [{}])
            latest = rows if rows else {}
            results.append({
                "indicator": sid,
                "period":    latest.get("period"),
                "year":      latest.get("year"),
                "value":     latest.get("value"),
            })
        return results

async def main():
    async with aiohttp.ClientSession() as session:
        # Fire all FRED + BLS requests concurrently
        fred_tasks = [
            fetch_fred(session, name, url)
            for name, url in INDICATOR_MAP.items()
        ]
        bls_task = fetch_bls(session)
        fred_results, bls_results = await asyncio.gather(
            asyncio.gather(*fred_tasks),
            bls_task,
        )

    print("\n=== FRED / NY Fed / Atlanta Fed ===")
    for r in fred_results:
        print(f"  {r['indicator']:<25} {r['date']}  {r['value']}")

    print("\n=== BLS Series ===")
    for r in bls_results:
        print(f"  {r['indicator']:<25} {r['year']}-{r['period']}  {r['value']}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Dependencies:** `pip install aiohttp`  
**Expected runtime:** ~1–3 seconds (all requests fire concurrently).  
**Note:** FRED free tier allows 120 requests/minute; BLS v2 allows 500 daily requests with key. For the full 50-series FRED pull, batch into groups of 20 in a loop over `fred_url()` with `limit=1`.[^19][^9][^67]

---

## References

1. [Secured Overnight Financing Rate Data](https://www.newyorkfed.org/markets/reference-rates/sofr) - The Secured Overnight Financing Rate (SOFR) is a broad measure of the cost of borrowing cash overnig...

2. [SOFR Averages and Index Data - Federal Reserve Bank of New York](https://www.newyorkfed.org/markets/reference-rates/sofr-averages-and-index) - The SOFR Averages are compounded averages of the SOFR over rolling 30-, 90-, and 180-calendar day pe...

3. [30-Day Average SOFR (SOFR30DAYAVG) - ALFRED | St. Louis Fed](https://alfred.stlouisfed.org/series?seid=SOFR30DAYAVG) - Graph and download revisions to economic data for from 2018-05-02 to 2026-05-19 about 1-month, finan...

4. [Federal Reserve Board - H.15 - Selected Interest Rates (Daily)](https://www.federalreserve.gov/releases/h15/) - This curve, which relates the yield on a security to its time to maturity, is based on the closing m...

5. [Market Yield on U.S. Treasury Securities at 2-Year Constant Maturity ...](https://fred.stlouisfed.org/series/DGS2) - Graph and download economic data for Market Yield on U.S. Treasury Securities at 2-Year Constant Mat...

6. [Daily Treasury Rate Archives | U.S. Department of the Treasury](https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rate-archives) - Daily Treasury Rate Archives. Daily Treasury Rate Archives. Select Type of Interest Rate Data. Daily...

7. [GDPNow - Federal Reserve Bank of Atlanta](https://www.atlantafed.org/research-and-data/data/gdpnow) - GDPNow Forecast · GDPNow Model Data and Historical Forecasts · GDPNow Release Dates · Modifications ...

8. [GDPNow - FRED - Federal Reserve Bank of St. Louis](https://fred.stlouisfed.org/series/GDPNOW) - The Atlanta Fed recalculates and updates their GDPNow forecasts (called "nowcasts") throughout the q...

9. [BLS Public Data API Signatures (Version 2.0)](https://www.bls.gov/developers/api_signature_v2.htm) - Use this signature to retrieve data for a single time series for the past three years. Be sure to in...

10. [Weekly Economic Index - Dallasfed.org](https://www.dallasfed.org/research/wei) - The Weekly Economic Index (WEI) provides a signal of the state of the US economy based on data avail...

11. [Monitoring Real Activity in Real Time: The Weekly Economic Index](https://libertystreeteconomics.newyorkfed.org/2020/03/monitoring-real-activity-in-real-time-the-weekly-economic-index/) - To address this challenge, we compute a Weekly Economic Index (WEI) to measure real economic activit...

12. [Opendata - U.S. Energy Information Administration (EIA)](https://www.eia.gov/opendata/) - EIA's API is multi-facetted and contains the following time-series data sets organized by the main e...

13. [EIAapi - README](https://cran.r-project.org/web/packages/EIAapi/readme/README.html) - A suggested workflow to query data from the EIA API with the eia_get function. Submit the query and ...

14. [Aruoba-Diebold-Scotti Business Conditions Index](https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/ads) - The Aruoba-Diebold-Scotti business conditions index is designed to track real business conditions at...

15. [[PDF] Methodology for the Aruoba-Diebold-Scotti Business Conditions Index](https://www.philadelphiafed.org/-/media/FRBP/Assets/Surveys-And-Data/ads/ads-technical-documentation.pdf) - The Aruoba-Diebold-Scotti (ADS) business conditions index is designed to track real business conditi...

16. [ADP Announces National Employment Report Preliminary Estimate ...](https://mediacenter.adp.com/2025-10-28-ADP-Announces-National-Employment-Report-Preliminary-Estimate-Publicly-Available-on-a-Weekly-Cadence) - The October 2025 ADP National Employment Report will be released on November 5, 2025, at 8:15 a.m. E...

17. [ADP National Employment Report Explained: Key Insights on U.S. ...](https://www.investopedia.com/terms/a/adpreport.asp) - The ADP National Employment Report tracks nonfarm private employment in the U.S. and is released mon...

18. [Data API : U.S. Bureau of Labor Statistics](https://www.bls.gov/bls/api_features.htm) - Adds a /popular URL endpoint that returns series IDs for the 25 most popular BLS and survey-specific...

19. [BLS API Guide - BD Economics](https://bd-econ.com/blsapi.html) - The series ID is appended directly to the URL path. You can find series IDs using the BLS data site ...

20. [Bureau of Labor Statistics (Independent Publisher) - Connectors](https://learn.microsoft.com/en-us/connectors/bureauoflaborstatist/) - Retrieve data for one or more series by posting a list of series IDs and optional parameters (start ...

21. [Employment Cost Index: Wages and Salaries: Private Industry Workers](https://fred.stlouisfed.org/series/ECIWAG) - Graph and download economic data for Employment Cost Index: Wages and Salaries: Private Industry Wor...

22. [Employment Cost Index Summary - 2026 Q01 Results](https://www.bls.gov/news.release/eci.nr0.htm) - Employment Cost Index Summary ; Footnotes (1) Includes private industry and state and local governme...

23. [ECI Home : U.S. Bureau of Labor Statistics](https://www.bls.gov/eci/) - The Employment Cost Index (ECI) measures the change in the hourly labor cost to employers over time....

24. [ISM Manufacturing PMI — Daily CSV Download (US ... - Eco3min](https://eco3min.fr/en/ism-manufacturing-pmi-dataset/) - Direct daily updated download for the ISM Manufacturing PMI dataset (US Manufacturing Survey). Get h...

25. [ISM® PMI® Reports](https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports/) - The ISM® PMI® Reports continue to be consistent and accurate in indicating the direction of the over...

26. [[PDF] US Leading Indicators - FedPrimeRate.com](https://fedprimerate.com/docs/Conference-Board/Fed-Prime-Rate-Conference-Board----LEADING--ECONOMIC--INDEX---MARCH---2025.pdf) - The Conference Board Leading Economic Index® (LEI) for the US declined by 0.7% in. March 2025 to 100...

27. [US Leading Indicators - The Conference Board](https://www.conference-board.org/topics/us-leading-indicators/) - The Conference Board Leading Economic Index® (LEI) for the US rose slightly by 0.1% in April 2026 to...

28. [University of Michigan: Consumer Sentiment (UMCSENT)](https://fred.stlouisfed.org/series/UMCSENT) - View an index of the results of the University of Michigan's monthly Survey of Consumers, which is u...

29. [Surveys of Consumers - University of Michigan](https://data.sca.isr.umich.edu) - The Index of Consumer Sentiment, 49.8. Current Economic Conditions, 52.5. Index of Consumer Expectat...

30. [Surveys of Consumers - University of Michigan](https://www.sca.isr.umich.edu) - Final Results for May 2026 ; Index of Consumer Sentiment, 44.8, 49.8, 52.2, -10.0% ; Current Economi...

31. [Chicago Fed National Activity Index: Current Data](https://www.chicagofed.org/research/data/cfnai/current-data) - The Chicago Fed National Activity Index (CFNAI) is a monthly index designed to gauge overall economi...

32. [Chicago Fed National Activity Index (CFNAI) - FRED](https://fred.stlouisfed.org/series/CFNAI) - Graph and download economic data for Chicago Fed National Activity Index (CFNAI) from Mar 1967 to Ma...

33. [Surveys & Data - Federal Reserve Bank of Philadelphia](https://www.philadelphiafed.org/surveys-and-data) - Aruoba-Diebold-Scotti Business Conditions Index. An index designed to track real business conditions...

34. [First Quarter 2026 Survey of Professional Forecasters](https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/spf-q1-2026) - Researchers at the Philadelphia Fed delayed the release so that the panelists would have available t...

35. [Second Quarter 2026 Survey of Professional Forecasters](https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/spf-q2-2026) - This data set contains Tealbook/Greenbook projections for many of the variables also forecast in the...

36. [Data Files - Survey of Professional Forecasters](https://www.philadelphiafed.org/surveys-and-data/data-files) - Data Files - Survey of Professional Forecasters ... Variables created from the Survey of Professiona...

37. [Trimmed Mean PCE inflation rate - Dallasfed.org](https://www.dallasfed.org/research/pce) - The Trimmed Mean PCE inflation rate over the 12 months ending in March was 2.4 percent. According to...

38. [Dallas Fed: Trimmed Mean PCE 2.4 percent for 12 months through ...](https://www.dallasfed.org/news/releases/2026/nr260430pce) - DALLAS—The Trimmed Mean PCE inflation rate over the 12 months ending in March was 2.4 percent—up sli...

39. [Series Description - Dallasfed.org - Federal Reserve Bank of Dallas](https://www.dallasfed.org/research/pce/descr) - Trimmed mean inflation rates are derived by a similar procedure. In any given month, the rate of inf...

40. [US: Kansas City Fed Manufacturing Index - CME Group](https://www.cmegroup.com/education/events/econoday/671351) - The Kansas City Fed index offers a monthly assessment of change in the region's manufacturing sector...

41. [Manufacturing Survey - Federal Reserve Bank of Kansas City](https://www.kansascityfed.org/surveys/manufacturing-survey/) - The Kansas City Fed's monthly Survey of Tenth District Manufacturers provides information on manufac...

42. [Labor Market Conditions Indicators](https://www.kansascityfed.org/data-and-trends/labor-market-conditions-indicators/) - The Kansas City Fed Labor Market Conditions Indicators (LMCI) are two monthly measures of labor mark...

43. [KC Fed Labor Market Conditions Index, Level of Activity Indicator](https://fred.stlouisfed.org/series/FRBKCLMCILA) - Graph and download economic data for KC Fed Labor Market Conditions Index, Level of Activity Indicat...

44. [Survey of Manufacturing Activity - About the Survey | Richmond Fed](https://www.richmondfed.org/region_communities/regional_data_analysis/business_surveys/manufacturing/about) - Each month since November 1993, the Federal Reserve Bank of Richmond has conducted the survey of man...

45. [[PDF] The Richmond Fed Manufacturing and Service Sector Surveys](https://www.richmondfed.org/~/media/richmondfedorg/publications/research/economic_brief/2014/pdf/eb_14-03.pdf) - The services survey, which began in November 1993, was the first such survey by a Reserve Bank; it r...

46. [About the Surveys | Richmond Fed](https://www.richmondfed.org/region_communities/regional_data_analysis/business_surveys/about) - It was known as the service sector survey until October 2025. The current and historical data Excel ...

47. [Non-Manufacturing Survey - Federal Reserve Bank of Richmond](https://www.richmondfed.org/region_communities/regional_data_analysis/business_surveys/non-manufacturing) - Download Current and Historical Data ... *The non-manufacturing survey, formerly called the service ...

48. [Underlying Inflation Gauge (UIG) | FRED | St. Louis Fed](https://fred.stlouisfed.org/release?rid=605) - The Underlying Inflation Gauge is a monthly estimate of trend inflation released by the Federal Rese...

49. [Measuring Trend Inflation with the Underlying Inflation Gauge](https://libertystreeteconomics.newyorkfed.org/2017/05/measuring-trend-inflation-with-the-underlying-inflation-gauge/) - The UIG is derived from a large data set that extends beyond price variables and displays greater fo...

50. [The FRBNY Staff Underlying Inflation Gauge: UIG](https://www.newyorkfed.org/research/staff_reports/sr672.html) - This paper presents the “FRBNY Staff Underlying Inflation Gauge (UIG)” for CPI and PCE. Using a dyna...

51. [Weekly Economic Index (WEI) - Federal Reserve Bank of New York](https://www.newyorkfed.org/research/policy/weekly-economic-index) - The WEI is an index of ten indicators of real economic activity, scaled to align with the four-quart...

52. [The Yield Curve as a Leading Indicator](https://www.newyorkfed.org/research/capital_markets/ycfaq) - This model uses the slope of the yield curve, or “term spread,” to calculate the probability of a re...

53. [GDP Data via API - R Views](https://rviews.rstudio.com/2018/09/12/gdp-via-api/) - bea_gdp_api is now a tibble that holds the quarterly percentage change for each of the GDP accounts ...

54. [Chapter 1 Access Economic Data via the BEA API](https://us-bea.github.io/econ-visual-guide/access-economic-data-via-the-bea-api.html) - Using the sample API call from the above example, we will retrieve Personal Consumption Expenditures...

55. [Interactive Data Application | U.S. Bureau of Economic Analysis (BEA)](https://www.bea.gov/itable) - BEA's interactive data application is the one stop shop for accessing BEA data on the fly. The inter...

56. [Monthly Construction Spending, March 2026 - Census Bureau](https://www.census.gov/construction/c30/current/index.html) - Construction spending during March 2026 was estimated at a seasonally adjusted annual rate of $2,185...

57. [Construction Spending - Census Bureau](https://www.census.gov/construction/c30/c30index.html) - The Value of Construction Put in Place Survey (VIP) provides monthly estimates of the total dollar v...

58. [New Residential Construction Press Release - Census Bureau](https://www.census.gov/construction/nrc/current/index.html) - Single-family authorizations in April were at a rate of 872,000; this is 2.6 percent below the revis...

59. [Building Permits Survey (BPS) - Census Bureau](https://www.census.gov/permits) - The purpose of the Building Permits Survey (BPS) is to provide national, state, and local statistics...

60. [Time Series Economic Indicators Time Series - Catalog - Data.gov](http://catalog.data.gov/dataset/time-series-economic-indicators-time-series-construction-spending) - These surveys produce a variety of statistics covering construction, housing, international trade, r...

61. [The Fed - Meeting calendars and information - Federal Reserve](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm) - Meeting calendars, statements, and minutes (2021-2027). The FOMC holds eight regularly scheduled mee...

62. [Calendar: January 2026 - Federal Reserve Board](https://www.federalreserve.gov/newsevents/2026-january.htm) - FOMC Meeting. Two-day meeting, January 27 - 28. Press Conference. 28. Beige Book. Time: Release Date...

63. [Beige Book - Federal Reserve Board](https://www.federalreserve.gov/monetarypolicy/publications/beige-book-default.htm) - An overall summary of the twelve district reports is prepared by a designated Federal Reserve Bank o...

64. [US Beige Book | Forex Factory](https://www.forexfactory.com/calendar/241-us-beige-book) - Jan 14, 2026 · Nov 26, 2025 · Oct 15, 2025 · Sep 3, 2025 · Jul 16, 2025 · Jun 4 ... Related Events. ...

65. [Delinquency Rate on Commercial Real Estate Loans ... - FRED](https://fred.stlouisfed.org/series/DRCRELEXFACBS) - Graph and download economic data for Delinquency Rate on Commercial Real Estate Loans (Excluding Far...

66. [Rental Vacancy Rate in the United States (RRVRUSQ156N) - FRED](https://fred.stlouisfed.org/series/RRVRUSQ156N) - Graph and download economic data for Rental Vacancy Rate in the United States (RRVRUSQ156N) from Q1 ...

67. [St. Louis Fed Web Services: FRED® API](https://fred.stlouisfed.org/docs/api/fred/) - The FRED® API, Version 2 is ideal for anyone who is interested to retrieve observations for all seri...

68. [St. Louis Fed Web Services: fred/series/search](https://fred.stlouisfed.org/docs/api/fred/series_search.html) - Read API Keys for more information. 32 character alpha-numeric lowercase ... 'series_id' performs a ...

69. [Introduction to the EIA API • EIAapi - Rami Krispin](https://ramikrispin.github.io/EIAapi/articles/intro.html) - The EIA data is open and accessible through an Application Programming Interface (API) for free. The...

