# CRE API Endpoint Catalog: 100-Endpoint Master Reference
*For Commercial Real Estate Research, Due Diligence & Site Analysis*
*Compiled May 2026 — Covers All 8 Categories (Economic/Employment, Demographics, Environmental/Hazard, Infrastructure/Amenities, Housing/RE, Energy/Utilities, Zoning/Land Use, Israel-Specific)*

***

## How to Read This Catalog

Each entry follows this schema:

| Field | Meaning |
|---|---|
| **SOURCE** | Publisher / API owner |
| **NAME** | Human-readable endpoint name |
| **ENDPOINT** | Exact base URL with example parameters |
| **INPUT** | Required & optional parameters |
| **OUTPUT** | Format + key returned fields |
| **AUTH** | Key type & registration URL |
| **UPDATE** | Data refresh frequency |
| **CORS** | Browser cross-origin support |
| **RATE LIMIT** | Throttling constraints |
| **CRE USE** | Primary commercial real estate applications |

***

## CATEGORY 1 — Economic / Employment Data (15 Endpoints)

### E-01 · BLS Local Area Unemployment Statistics (LAUS)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Bureau of Labor Statistics |
| **NAME** | LAUS Time-Series API v2 |
| **ENDPOINT** | `https://api.bls.gov/publicAPI/v2/timeseries/data/` (POST) with body `{"seriesid":["LAUCN170310000000003"],"startyear":"2022","endyear":"2025"}` |
| **INPUT** | `seriesid[]` (LAUS series ID; state + county FIPS + measure code); `startyear`; `endyear`; `registrationkey` |
| **OUTPUT** | JSON — `{seriesID, year, period, value, footnotes[]}` — monthly unemployment rate, labor force, employed, unemployed counts |
| **AUTH** | Optional free API key (`registrationkey`); v2 key raises daily query limit from 25 to 500 series. Register: [https://data.bls.gov/registrationEngine/](https://data.bls.gov/registrationEngine/) [^1][^2] |
| **UPDATE** | Monthly, ~3-week lag |
| **CORS** | No (server-side requests required for v2 POST) |
| **RATE LIMIT** | v1: 25 series/day unregistered; v2: 500 series/day; 50 series per single call |
| **CRE USE** | Labor market health for submarket selection; vacancy risk indicators; tenant financial stress indicators for retail/office |

***

### E-02 · BLS Quarterly Census of Employment & Wages (QCEW) — County/MSA

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Bureau of Labor Statistics |
| **NAME** | QCEW API |
| **ENDPOINT** | `https://data.bls.gov/cew/apps/api_sample_code/v2/api_sample_code.htm` → GET `https://data.bls.gov/cew/data/api/2024/4/area/17031.json` |
| **INPUT** | `year` (4-digit); `qtr` (1–4 or `a` for annual); `area` (FIPS code) |
| **OUTPUT** | JSON — industry employment counts, average weekly wages, establishment counts by NAICS at county/MSA level |
| **AUTH** | None required |
| **UPDATE** | Quarterly, ~5-month lag |
| **CORS** | Yes |
| **RATE LIMIT** | No documented limit; reasonable use expected |
| **CRE USE** | Identify growth sectors as anchor/future tenants; wage trends for retail sales forecasting; industrial demand drivers |

***

### E-03 · Census Quarterly Workforce Indicators (QWI)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau (LEHD Program) |
| **NAME** | QWI Census Data API |
| **ENDPOINT** | `https://api.census.gov/data/timeseries/qwi/sa?get=Emp,sEmp&for=county:031&in=state:17&year=2024&quarter=3&key=YOUR_KEY` |
| **INPUT** | Variables (`Emp`, `EmpEnd`, `HirA`, `Sep`, `PayMonth`); geography (`state`, `county`, `cbsa`); `year`; `quarter`; optional cross-tabs (`sex`, `agegrp`, `industry`) |
| **OUTPUT** | JSON — 32 employment flow indicators by firm age, firm size, industry, worker demographics; covers ~96% of private sector employment [^3][^4] |
| **AUTH** | Free Census API key. Register: [https://api.census.gov/data/key_signup.html](https://api.census.gov/data/key_signup.html) |
| **UPDATE** | Quarterly, ~6-month lag |
| **CORS** | Yes |
| **RATE LIMIT** | 500 queries/day with key; 50/day without |
| **CRE USE** | Track sector-level job creation/destruction in target submarkets; identify emerging industry clusters for industrial/flex space demand |

***

### E-04 · FRED Series Observations — Key CRE Series

| Field | Detail |
|---|---|
| **SOURCE** | Federal Reserve Bank of St. Louis |
| **NAME** | FRED API v2 — Series Observations |
| **ENDPOINT** | `https://api.stlouisfed.org/fred/series/observations?series_id=HOUST&api_key=YOUR_KEY&file_type=json&observation_start=2020-01-01` |
| **INPUT** | `series_id` (e.g., `HOUST`=Housing Starts, `RECPROUSM156N`=HPI, `MORTGAGE30US`, `COMRCSLINS`=Commercial RE Loans, `MSACSR`=Monthly Supply of New Houses); `api_key`; `observation_start`; `observation_end`; `frequency`; `units` |
| **OUTPUT** | JSON — `{realtime_start, realtime_end, observation_date, value}` — 800,000+ economic time series [^5][^6] |
| **AUTH** | Free 32-char key. Register: [https://fredaccount.stlouisfed.org/apikeys](https://fredaccount.stlouisfed.org/apikeys) |
| **UPDATE** | Varies by series: daily/weekly/monthly/quarterly |
| **CORS** | Yes |
| **RATE LIMIT** | 120 requests/minute |
| **CRE USE** | Cap rate modeling; mortgage rate feeds; housing starts as leading CRE indicator; commercial RE loan volumes; economic cycle analysis |

***

### E-05 · FRED Series Search

| Field | Detail |
|---|---|
| **SOURCE** | Federal Reserve Bank of St. Louis |
| **NAME** | FRED API v2 — Series Search |
| **ENDPOINT** | `https://api.stlouisfed.org/fred/series/search?search_text=commercial+real+estate&api_key=YOUR_KEY&file_type=json&order_by=popularity` |
| **INPUT** | `search_text`; `api_key`; `order_by`; `sort_order`; `filter_variable`; `filter_value` |
| **OUTPUT** | JSON — list of matching series with ID, title, frequency, units, popularity score |
| **AUTH** | Same 32-char key as E-04 [^6] |
| **UPDATE** | Real-time catalog |
| **CORS** | Yes |
| **RATE LIMIT** | 120 requests/minute |
| **CRE USE** | Discover market-specific time series; cap rate proxies; regional wage and employment series |

***

### E-06 · Census ACS 5-Year — Economic Characteristics (DP03)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | ACS 5-Year Data Profile DP03 |
| **ENDPOINT** | `https://api.census.gov/data/2024/acs/acs5/profile?get=group(DP03)&for=county:031&in=state:17&key=YOUR_KEY` |
| **INPUT** | `get=group(DP03)`; geography (`county`, `tract`, `place`, `zip code tabulation area`); `key` |
| **OUTPUT** | JSON — median household income, per capita income, poverty rate, occupational distribution, commute times, industry employment shares [^7] |
| **AUTH** | Free Census API key [^8] |
| **UPDATE** | Annual (5-year rolling estimates; 2020–2024 released Dec 2024) |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day with key; 50/day without |
| **CRE USE** | Trade area income analysis; retail site selection; workforce supply assessment for industrial/office |

***

### E-07 · Census ACS 1-Year — Economic Characteristics

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | ACS 1-Year Data Profile DP03 |
| **ENDPOINT** | `https://api.census.gov/data/2024/acs/acs1/profile?get=group(DP03)&for=metropolitan+statistical+area/micropolitan+statistical+area:16980&key=YOUR_KEY` |
| **INPUT** | Same as 5-year but geography limited to areas ≥65,000 population; preferred for MSA-level current data |
| **OUTPUT** | Same schema as DP03 but single-year estimates; annual update cycle |
| **AUTH** | Free Census API key |
| **UPDATE** | Annual (12–18 month lag) |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day with key |
| **CRE USE** | Current-year income/employment snapshots for larger markets; faster signal than 5-year for market-timing decisions |

***

### E-08 · BLS Consumer Price Index — All Urban Consumers

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Bureau of Labor Statistics |
| **NAME** | CPI-U Series API |
| **ENDPOINT** | POST `https://api.bls.gov/publicAPI/v2/timeseries/data/` with `{"seriesid":["CUUR0000SA0","CUURS23ASA0"],"startyear":"2020","endyear":"2025"}` |
| **INPUT** | `seriesid` — national `CUUR0000SA0`; regional codes (e.g., `CUURS23A` = Chicago-Gary-Kenosha); category suffixes (rent = `SA0L2`, food = `SAF1`) |
| **OUTPUT** | JSON — monthly CPI index values and percentage changes [^1] |
| **AUTH** | v2 key recommended for higher limits |
| **UPDATE** | Monthly |
| **CORS** | No (POST required) |
| **RATE LIMIT** | v2: 500 series/day |
| **CRE USE** | Lease escalation modeling (CPI-linked rent bumps); operating cost inflation forecasting; underwriting real vs. nominal rent growth |

***

### E-09 · BLS Producer Price Index — Construction Materials

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Bureau of Labor Statistics |
| **NAME** | PPI — Construction Materials |
| **ENDPOINT** | POST `https://api.bls.gov/publicAPI/v2/timeseries/data/` with `{"seriesid":["PCU2361--2361--","PCU3273--3273--"]}` |
| **INPUT** | Construction industry PPI series IDs (NAICS-based); `startyear`; `endyear` |
| **OUTPUT** | JSON — monthly PPI index values for building materials (concrete, lumber, steel) |
| **AUTH** | v2 key recommended |
| **UPDATE** | Monthly |
| **CORS** | No |
| **RATE LIMIT** | v2: 500/day |
| **CRE USE** | Construction cost escalation for development pro formas; replacement cost estimates; capital expenditure budgeting |

***

### E-10 · Census Current Population Survey (CPS) — Labor Force

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau / BLS Joint Program |
| **NAME** | CPS Basic Monthly API |
| **ENDPOINT** | `https://api.census.gov/data/2025/cps/basic/jul?get=PRTAGE,PEMLR,PEMARITL&for=state:17&key=YOUR_KEY` |
| **INPUT** | Variable names (PEMLR=employment status, PRTAGE=age, PEIO1ICD=industry code); geography (`state`); reference month/year |
| **OUTPUT** | JSON microdata — individual-level employment, industry, occupation, income; used to compute national/state unemployment rates [^9][^10] |
| **AUTH** | Free Census API key |
| **UPDATE** | Monthly |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | Labor force participation analysis; sector-specific employment trends; advanced underwriting for workforce housing |

***

### E-11 · USDA ERS County-Level Employment & Income

| Field | Detail |
|---|---|
| **SOURCE** | USDA Economic Research Service |
| **NAME** | Atlas of Rural and Small-Town America API |
| **ENDPOINT** | `https://www.ers.usda.gov/webdocs/DataFiles/48747/People.csv` (also available via Data.gov API `https://catalog.data.gov/api/3/action/datastore_search?resource_id=...`) |
| **INPUT** | State FIPS filter; county FIPS; data type (`People`, `Jobs`, `Agriculture`, `Income`) |
| **OUTPUT** | CSV/JSON — county employment-to-population ratios, unemployment rate, farm/nonfarm income, poverty, population change |
| **AUTH** | None required |
| **UPDATE** | Annual |
| **CORS** | Yes (CSV download) |
| **RATE LIMIT** | None documented |
| **CRE USE** | Rural market demand analysis; agricultural land valuation drivers; Opportunity Zone due diligence |

***

### E-12 · BEA Regional Economic Accounts — GDP by County/MSA

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Bureau of Economic Analysis |
| **NAME** | BEA API — Regional Data |
| **ENDPOINT** | `https://apps.bea.gov/api/data?UserID=YOUR_KEY&method=GetData&DataSetName=Regional&TableName=CAEMP25N&LineCode=10&GeoFips=17031&Year=2023&ResultFormat=json` |
| **INPUT** | `TableName` (e.g., `CAGDP1` = GDP by county, `CAEMP25N` = employment by industry); `GeoFips`; `Year`; `UserID` |
| **OUTPUT** | JSON — county/MSA GDP, compensation, employment, personal income by industry (NAICS) |
| **AUTH** | Free key. Register: [https://apps.bea.gov/api/signup/](https://apps.bea.gov/api/signup/) |
| **UPDATE** | Annual |
| **CORS** | Yes |
| **RATE LIMIT** | 100 requests/minute |
| **CRE USE** | Economic base analysis for market studies; GDP growth trend for long-term CRE demand forecasting |

***

### E-13 · FRED Commercial Real Estate Loan Series

| Field | Detail |
|---|---|
| **SOURCE** | Federal Reserve / FFIEC via FRED |
| **NAME** | FRED API — CRE Loan & Cap Rate Proxies |
| **ENDPOINT** | `https://api.stlouisfed.org/fred/series/observations?series_id=RREACBW027SBOG&api_key=YOUR_KEY&file_type=json` |
| **INPUT** | Key CRE series IDs: `RREACBW027SBOG` (Real estate loans, all commercial banks), `CCLACBW027SBOG` (Consumer credit), `TERMCBW027SBOG` (Total mortgage debt), `NCREIF` (institutional CRE returns via proxy) |
| **OUTPUT** | JSON weekly/monthly values |
| **AUTH** | Free FRED key |
| **UPDATE** | Weekly (balance sheet) |
| **CORS** | Yes |
| **RATE LIMIT** | 120 req/min |
| **CRE USE** | Credit availability monitoring; refinancing risk analysis; debt market conditions for underwriting |

***

### E-14 · Census Business Patterns — Establishment Count by NAICS

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | County Business Patterns (CBP) API |
| **ENDPOINT** | `https://api.census.gov/data/2023/cbp?get=NAICS2017,EMP,ESTAB,PAYANN&for=county:031&in=state:17&NAICS2017=52&key=YOUR_KEY` |
| **INPUT** | `NAICS2017` code; `EMP` (employment); `ESTAB` (establishments); `PAYANN` (annual payroll); geography (county, state, zip) |
| **OUTPUT** | JSON — establishment counts, employment, payroll by industry at county level |
| **AUTH** | Free Census key |
| **UPDATE** | Annual (~18-month lag) |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | Tenant demand by sector; retail leakage analysis; industrial tenant pool sizing; office demand forecasting |

***

### E-15 · BLS Occupational Employment & Wage Statistics (OEWS)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Bureau of Labor Statistics |
| **NAME** | OEWS via BLS Public Data API |
| **ENDPOINT** | POST `https://api.bls.gov/publicAPI/v2/timeseries/data/` with OEWS series IDs (format: `OEUM017031000000015-2035` = Chicago area, all industries, all occupations) |
| **INPUT** | OEWS series ID (area + industry NAICS + occupation SOC); `startyear`; `endyear` |
| **OUTPUT** | JSON — median/mean hourly and annual wages by occupation and MSA |
| **AUTH** | v2 key recommended |
| **UPDATE** | Annual (May reference month data released ~March following year) |
| **CORS** | No (POST) |
| **RATE LIMIT** | 500/day with key |
| **CRE USE** | Office worker salary data for co-working/office space demand; wage analysis for workforce housing proforma |

***

## CATEGORY 2 — Demographics (12 Endpoints)

### D-01 · Census ACS 5-Year — Demographic & Housing (DP04 + DP05)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | ACS 5-Year Data Profiles DP04 (Housing) + DP05 (Demographics) |
| **ENDPOINT** | `https://api.census.gov/data/2024/acs/acs5/profile?get=group(DP04),group(DP05)&for=tract:*&in=state:17+county:031&key=YOUR_KEY` |
| **INPUT** | Variable groups (`DP04` = housing, `DP05` = race/age/gender); geography down to tract and block group level [^7] |
| **OUTPUT** | JSON — 300+ variables: housing units, tenure (owner/renter), vacancy rate, median home value, age distribution, race/ethnicity, household size |
| **AUTH** | Free Census API key |
| **UPDATE** | Annual (2020–2024 released Dec 2024) [^11] |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day with key |
| **CRE USE** | Trade area demographics for retail site selection; multifamily market analysis; renter vs. owner-occupied ratios for apartment investment |

***

### D-02 · Census ACS 5-Year — Social Characteristics (DP02)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | ACS 5-Year Data Profile DP02 |
| **ENDPOINT** | `https://api.census.gov/data/2024/acs/acs5/profile?get=group(DP02)&for=zip+code+tabulation+area:60611&key=YOUR_KEY` |
| **INPUT** | `DP02` group; ZIP, tract, county geographies |
| **OUTPUT** | JSON — educational attainment, marital status, household type, language spoken, veterans, disability, migration, internet access |
| **AUTH** | Free Census key |
| **UPDATE** | Annual |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | Consumer lifestyle segmentation for retail; educational attainment for tech/biotech tenant cluster identification; migration data for growth market identification |

***

### D-03 · Census Decennial 2020 — Population (P1, H1 Tables)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | 2020 Decennial Census Redistricting Data (PL 94-171) API |
| **ENDPOINT** | `https://api.census.gov/data/2020/dec/pl?get=P1_001N,H1_001N&for=block:*&in=state:17+county:031+tract:842400&key=YOUR_KEY` |
| **INPUT** | Table codes (`P1_001N`=total population, `H1_001N`=total housing units); geography down to census block level |
| **OUTPUT** | JSON — block-level counts; highest spatial resolution official source |
| **AUTH** | Free Census key |
| **UPDATE** | Decennial (2020 data current; 2030 ~2031) |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | Precise trade area population estimation; parking demand analysis; block-level void analysis |

***

### D-04 · Census TIGER/Line REST (TIGERweb) — Geographies

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | TIGERweb REST Map Service |
| **ENDPOINT** | `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2024/MapServer/8/query?where=GEOID='17031842400'&outFields=*&f=geojson` |
| **INPUT** | `where` clause (GEOID, name); `geometry` (bounding box or point); `outFields`; `f=geojson or json` |
| **OUTPUT** | GeoJSON — boundary polygons for census tracts, blocks, counties, places, ZIP tabulation areas, congressional districts [^12] |
| **AUTH** | None required |
| **UPDATE** | Annual geographic updates |
| **CORS** | Yes |
| **RATE LIMIT** | None documented; reasonable use expected |
| **CRE USE** | Spatial joins for trade area analysis; boundary mapping for market reports; GIS integration for property mapping |

***

### D-05 · HUD USPS ZIP Code Crosswalk API

| Field | Detail |
|---|---|
| **SOURCE** | HUD (via USPS Vacancy Data) |
| **NAME** | HUD-USPS ZIP/Tract/County/CBSA Crosswalk |
| **ENDPOINT** | `https://www.huduser.gov/hudapi/public/usps?type=3&query=60611&year=2024&quarter=1` |
| **INPUT** | `type` (1=ZIP→tract, 2=ZIP→county, 3=ZIP→CBSA, 4=ZIP→CBSA division, 5=ZIP→congressional district, 6=ZIP→metro division, 7=ZIP→county subdivision); `query` (ZIP or GEOID); `year`; `quarter` |
| **OUTPUT** | JSON — crosswalk table mapping ZIPs to census geographies with residential/commercial/other address allocation ratios [^13][^14] |
| **AUTH** | Free HUD token. Register: [https://www.huduser.gov/portal/dataset/fmr-api.html](https://www.huduser.gov/portal/dataset/fmr-api.html) |
| **UPDATE** | Quarterly |
| **CORS** | Yes |
| **RATE LIMIT** | Not publicly documented; standard API key limits apply |
| **CRE USE** | Translate ZIP-based trade data into census geographies for ACS lookups; aggregate submarket demographics from zip-level sources |

***

### D-06 · HUD CHAS — Housing Affordability Data API

| Field | Detail |
|---|---|
| **SOURCE** | HUD Office of Policy Development & Research |
| **NAME** | Comprehensive Housing Affordability Strategy (CHAS) Data API |
| **ENDPOINT** | `curl -H "Authorization: Bearer YOUR_TOKEN" "https://www.huduser.gov/hudapi/public/chas?type=4&stateId=17&year=2016-2020"` |
| **INPUT** | `type` (1=nation, 2=state, 3=county, 4=place, 5=MCD, 6=tract); `stateId`; optional `entityId`; `year` range |
| **OUTPUT** | JSON — households with housing cost burdens (>30% and >50% of income), by income band, tenure, race; cost-burdened renter/owner counts [^15][^16][^17] |
| **AUTH** | Free HUD bearer token |
| **UPDATE** | ACS 5-year cycle; Dec 2025 release (2018–2022 ACS base) |
| **CORS** | Yes |
| **RATE LIMIT** | Not publicly documented |
| **CRE USE** | Affordable housing market analysis; LIHTC site qualification; Section 8/HCV voucher demand modeling; community development underwriting |

***

### D-07 · Census Population Estimates API

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | Population Estimates & Components of Change API |
| **ENDPOINT** | `https://api.census.gov/data/2024/pep/population?get=POP_2024,LASTUPDATE,NAME&for=county:031&in=state:17&key=YOUR_KEY` |
| **INPUT** | `POP` estimates; `NATURALINC` (natural increase); `NETMIG` (net migration); geography (state, county, metro area) |
| **OUTPUT** | JSON — annual population estimates 2020–2024 with births, deaths, migration components |
| **AUTH** | Free Census key |
| **UPDATE** | Annual (December release) |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | Population growth trajectory for demand forecasting; in-migration/out-migration for multifamily market timing |

***

### D-08 · Census Planning Database (PDB)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | Planning Database API |
| **ENDPOINT** | `https://api.census.gov/data/2024/pdb/tract?get=County_name,Tract,LAND_AREA,Low_Response_Score,pct_Pov_Tract&for=tract:*&in=state:17+county:031&key=YOUR_KEY` |
| **INPUT** | PDB variables; census tract geography |
| **OUTPUT** | JSON — hard-to-count population scores, poverty concentration, housing density, demographic composite indicators |
| **AUTH** | Free Census key |
| **UPDATE** | Annual |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | Opportunity Zone and NMTC market identification; census tract hardship scoring for impact investment underwriting |

***

### D-09 · CDC Social Vulnerability Index (SVI) — REST API

| Field | Detail |
|---|---|
| **SOURCE** | CDC / ATSDR |
| **NAME** | CDC SVI ArcGIS REST Feature Service |
| **ENDPOINT** | `https://services3.arcgis.com/ZvidGQkLaDJxRSJ2/arcgis/rest/services/CDC_Social_Vulnerability_Index_2022/FeatureServer/0/query?where=COUNTY='COOK'&outFields=RPL_THEMES,EP_POV150,EP_UNEMP,EP_HBURD&f=geojson` |
| **INPUT** | FIPS state/county filter; field selection; spatial extent |
| **OUTPUT** | GeoJSON — 16 social vulnerability variables ranked into 4 themes (socioeconomic status, household characteristics, racial/ethnic minority status, housing type/transportation) |
| **AUTH** | None required (public ArcGIS REST) |
| **UPDATE** | Every 2 years (2022 current) |
| **CORS** | Yes |
| **RATE LIMIT** | ArcGIS Online standard limits |
| **CRE USE** | Community impact scoring; ESG/impact CRE underwriting; CDFI investment screening; retail trade area risk profiling |

***

### D-10 · Walk Score API — Walkability & Transit

| Field | Detail |
|---|---|
| **SOURCE** | Walk Score / Redfin |
| **NAME** | Walk Score, Transit Score & Bike Score API |
| **ENDPOINT** | `https://api.walkscore.com/score?format=json&address=233+S+Wacker+Dr+Chicago+IL+60606&lat=41.8781&lon=-87.6298&transit=1&bike=1&wsapikey=YOUR_KEY` |
| **INPUT** | `lat`; `lon`; `address`; `transit=1` to include Transit Score; `bike=1` for Bike Score; `wsapikey` |
| **OUTPUT** | JSON — `{walkscore, description, transit:{score, description, summary}, bike:{score, description}}` (0–100 integer scores) [^18][^19] |
| **AUTH** | Free key for low-volume use. Register: [https://www.walkscore.com/professional/api.php](https://www.walkscore.com/professional/api.php) |
| **UPDATE** | Rolling updates as OSM/transit data changes |
| **CORS** | Yes (JSON-P supported) |
| **RATE LIMIT** | 5,000 API calls/day on free tier; commercial tiers available |
| **CRE USE** | Office/multifamily amenity scoring; tenant attraction analysis; walkability premium modeling; retail foot traffic proxies |

***

### D-11 · Walk Score Public Transit API — Route & Stop Data

| Field | Detail |
|---|---|
| **SOURCE** | Walk Score / Redfin |
| **NAME** | Public Transit API (350+ agencies) |
| **ENDPOINT** | `https://transit.walkscore.com/transit/score/?lat=41.8781&lon=-87.6298&wsapikey=YOUR_KEY` (score) | `https://transit.walkscore.com/transit/search/stops/?lat=41.8781&lon=-87.6298&wsapikey=YOUR_KEY` (stops) |
| **INPUT** | `lat`; `lon`; `wsapikey`; optional `radius` (meters) |
| **OUTPUT** | JSON — Transit Score (0–100); list of nearby stops with route IDs, frequencies, type (rail/bus/ferry) [^20] |
| **AUTH** | Same API key as Walk Score |
| **UPDATE** | GTFS-feed-based updates from transit agencies |
| **CORS** | Yes |
| **RATE LIMIT** | Shared with Walk Score daily limit |
| **CRE USE** | TOD (transit-oriented development) analysis; office space premium estimation; last-mile connectivity for logistics/industrial |

***

### D-12 · OpenStreetMap Overpass API — Amenity Proximity

| Field | Detail |
|---|---|
| **SOURCE** | OpenStreetMap Contributors |
| **NAME** | Overpass API |
| **ENDPOINT** | `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=hospital](around:2000,41.878,-87.630);out;` |
| **INPUT** | Overpass QL or XML query; `around` radius (meters); `amenity` tag (`hospital`, `school`, `restaurant`, `parking`, `supermarket`, `bank`); bounding box or named area |
| **OUTPUT** | JSON/GeoJSON — node/way/relation elements with tags; lat/lon coordinates; OSM IDs [^21] |
| **AUTH** | None required (public instance); consider self-hosting or Overpass Turbo API for heavy use |
| **UPDATE** | ~2-minute lag behind OSM main database edits |
| **CORS** | Yes |
| **RATE LIMIT** | Public instance: fair-use policy; single queries limited to ~10M elements or 3 min runtime |
| **CRE USE** | Amenity density scoring for retail/multifamily/office site analysis; drive-time trade area competitor mapping; daisy-chain property scoring |

***

## CATEGORY 3 — Environmental / Hazard Data (14 Endpoints)

### EH-01 · OpenFEMA — NFIP Flood Policies

| Field | Detail |
|---|---|
| **SOURCE** | FEMA |
| **NAME** | OpenFEMA FimaNfipPolicies Dataset API |
| **ENDPOINT** | `https://www.fema.gov/api/open/v2/FimaNfipPolicies?$filter=countyCode%20eq%20'17031'&$select=policyCount,totalInsuranceInForce,countyCode&$inlinecount=allpages` |
| **INPUT** | OData filters: `countyCode`, `state`, `censusTract`, `reportedZipCode`, `floodZone`; `$top` (max 10,000 per call); `$skip` for pagination [^22] |
| **OUTPUT** | JSON — policy counts, total coverage in force, building/contents coverage split, policy term, flood zone, census tract |
| **AUTH** | None required |
| **UPDATE** | Monthly |
| **CORS** | Yes |
| **RATE LIMIT** | 10,000 records per API response; paginate with `$skip`; no documented daily query limit |
| **CRE USE** | Flood insurance exposure analysis; NFIP participation rates as flood risk proxy; insurance cost modeling for due diligence |

***

### EH-02 · OpenFEMA — NFIP Claims

| Field | Detail |
|---|---|
| **SOURCE** | FEMA |
| **NAME** | OpenFEMA FimaNfipClaims Dataset API |
| **ENDPOINT** | `https://www.fema.gov/api/open/v2/FimaNfipClaims?$filter=state%20eq%20'IL'%20and%20yearOfLoss%20eq%202019&$top=1000` |
| **INPUT** | `state`; `countyCode`; `censusTract`; `yearOfLoss`; `floodZone`; `reportedCity` |
| **OUTPUT** | JSON — building/contents/ICC damage amounts, year of loss, original construction date, flood zone, community rating system (CRS) discount [^22] |
| **AUTH** | None required |
| **UPDATE** | Monthly |
| **CORS** | Yes |
| **RATE LIMIT** | 10,000 per response; paginate |
| **CRE USE** | Historical flood loss experience at property location; insurance underwriting for commercial property; repetitive loss property identification |

***

### EH-03 · OpenFEMA — Disaster Declarations Summary

| Field | Detail |
|---|---|
| **SOURCE** | FEMA |
| **NAME** | OpenFEMA DisasterDeclarationsSummaries |
| **ENDPOINT** | `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=state%20eq%20'IL'%20and%20incidentType%20eq%20'Flood'&$orderby=declarationDate%20desc` |
| **INPUT** | `state`; `incidentType` (`Flood`, `Hurricane`, `Tornado`, `Fire`, `Earthquake`); `declarationDate`; `county` |
| **OUTPUT** | JSON — disaster declaration number, type, start/end date, IA/PA/HM program authorizations, affected counties [^23] |
| **AUTH** | None required |
| **UPDATE** | As declarations are issued (near real-time) |
| **CORS** | Yes |
| **RATE LIMIT** | No documented limit |
| **CRE USE** | Disaster frequency analysis for insurance cost modeling; identify repeatedly declared counties for risk discount; market disruption timing |

***

### EH-04 · FEMA National Flood Hazard Layer (NFHL) via ArcGIS REST

| Field | Detail |
|---|---|
| **SOURCE** | FEMA |
| **NAME** | NFHL Feature Service (ArcGIS REST) |
| **ENDPOINT** | `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?geometry=-87.63,41.87,-87.62,41.88&geometryType=esriGeometryEnvelope&inSR=4326&outFields=FLD_ZONE,SFHA_TF,STATIC_BFE&f=geojson` |
| **INPUT** | `geometry` (bounding box or point); `geometryType`; `inSR=4326`; `outFields`; `f=geojson` |
| **OUTPUT** | GeoJSON — Special Flood Hazard Area (SFHA) polygons; flood zones (A, AE, AH, AO, V, X, etc.); base flood elevation (BFE); community ID; effective map date [^24] |
| **AUTH** | None required |
| **UPDATE** | Effective FIRM panels as LOMC/LOMA amendments posted |
| **CORS** | Yes |
| **RATE LIMIT** | ArcGIS Server standard |
| **CRE USE** | Flood zone determination for insurance requirements and LOC underwriting; site-level SFHA percentage for risk scoring; Elevation Certificate triggers |

***

### EH-05 · USGS Earthquake Hazards — FDSN Event API

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Geological Survey |
| **NAME** | USGS Earthquake Catalog API |
| **ENDPOINT** | `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3.0&starttime=2015-01-01&endtime=2025-01-01&minlatitude=36&maxlatitude=42&minlongitude=-91&maxlongitude=-87` |
| **INPUT** | `format` (geojson, csv, text); `minmagnitude`; `starttime`; `endtime`; bounding box lat/lon OR `latitude`+`longitude`+`maxradiuskm` (point search) [^25] |
| **OUTPUT** | GeoJSON — event magnitude, location, depth, time; shakemap data reference; felt reports |
| **AUTH** | None required |
| **UPDATE** | Near real-time (events posted within minutes) |
| **CORS** | Yes |
| **RATE LIMIT** | No documented limit; courtesy limit ~20,000 events per query |
| **CRE USE** | Seismic risk assessment for structural engineering; insurance premium estimation for commercial buildings; exclusion zone analysis for industrial/data centers |

***

### EH-06 · EPA AQS API — Air Quality Daily Summary by County

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EPA Air Quality System |
| **NAME** | AQS Data Mart REST API v2 |
| **ENDPOINT** | `https://aqs.epa.gov/data/api/dailySummaryByCounty/byCounty?email=YOUR_EMAIL&key=YOUR_KEY&param=88101&bdate=20240101&edate=20241231&state=17&county=031` |
| **INPUT** | `param` (parameter code: `88101`=PM2.5, `44201`=Ozone, `42401`=SO2, `42101`=CO, `42602`=NO2); `bdate`/`edate` (YYYYMMDD); `state` (FIPS); `county` (FIPS) [^26][^27] |
| **OUTPUT** | JSON — daily AQI, arithmetic mean, max value, observation count per monitor; 10,000+ monitoring stations nationwide |
| **AUTH** | Free email-based key. Register: [https://aqs.epa.gov/data/api/signup?email=your@email.com](https://aqs.epa.gov/data/api/signup?email=your@email.com) |
| **UPDATE** | Daily (with ~24-hour lag for most monitors) |
| **CORS** | No (standard REST; server-side calls recommended) |
| **RATE LIMIT** | Registration required; no documented numerical limit but excessive queries throttled |
| **CRE USE** | Environmental due diligence; industrial site selection; outdoor amenity scoring for multifamily; LEED/green building certification data |

***

### EH-07 · EPA AQS API — Monitor Inventory by State

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EPA Air Quality System |
| **NAME** | AQS Monitors Inventory Endpoint |
| **ENDPOINT** | `https://aqs.epa.gov/data/api/monitors/byState?email=YOUR_EMAIL&key=YOUR_KEY&param=88101&bdate=20240101&edate=20241231&state=17` |
| **INPUT** | `param`; `state`; `bdate`; `edate` |
| **OUTPUT** | JSON — site coordinates, monitor type, operational dates, collection frequency, method reference [^27] |
| **AUTH** | Same AQS key |
| **UPDATE** | As monitors are added/removed |
| **CORS** | No |
| **RATE LIMIT** | Same as EH-06 |
| **CRE USE** | Identify nearest air quality monitors for site-specific assessments; confirm data coverage before relying on interpolated values |

***

### EH-08 · EPA Envirofacts REST — TRI Toxics Release Inventory

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EPA Envirofacts |
| **NAME** | TRI Facility Release Data via Envirofacts REST API |
| **ENDPOINT** | `https://enviro.epa.gov/enviro/efservice/BIENNIAL_REPORT/COUNTY/COOK/ROWS/0:100/JSON` (generic pattern) → TRI: `https://enviro.epa.gov/enviro/efservice/TRI_FACILITY/ZIP_CODE/60601/JSON` |
| **INPUT** | Envirofacts REST path: `TABLE_NAME/COLUMN_NAME/VALUE/ROWS/start:end/FORMAT`; supports ZIP, county, state, facility name filters [^28][^29] |
| **OUTPUT** | JSON/XML/CSV/Excel — facility name, address, lat/lon, chemical name, release quantity (air, water, land), carcinogen flag |
| **AUTH** | None required |
| **UPDATE** | Annual (TRI reporting year data released ~May following year) |
| **CORS** | Yes |
| **RATE LIMIT** | No documented limit; row-range pagination required (max ~10,000 rows/request) |
| **CRE USE** | Phase I ESA support; identify Superfund/RCRA proximity; contamination risk radius for industrial acquisition; 1-mile buffer TRI facility lookup |

***

### EH-09 · EPA Envirofacts REST — SDWIS Safe Drinking Water

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EPA Envirofacts — SDWIS |
| **NAME** | Safe Drinking Water Information System REST API |
| **ENDPOINT** | `https://enviro.epa.gov/enviro/efservice/SDWA_PUB_WATER_SYSTEMS/CITY_NAME/CHICAGO/JSON` |
| **INPUT** | Standard Envirofacts table/column/value path; tables: `SDWA_PUB_WATER_SYSTEMS`, `SDWA_VIOLATIONS`, `SDWA_ENFORCEMENT_ACTIONS` |
| **OUTPUT** | JSON — PWS name, type, population served, MCL violations, enforcement actions, primacy agency [^30][^31] |
| **AUTH** | None required |
| **UPDATE** | Quarterly |
| **CORS** | Yes |
| **RATE LIMIT** | Row-range pagination |
| **CRE USE** | Well and municipal water service confirmation for rural/exurban CRE; regulatory compliance risk for data center/industrial water-intensive tenants |

***

### EH-10 · EPA Envirofacts REST — Superfund SEMS (CERCLIS)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EPA Envirofacts — SEMS |
| **NAME** | Superfund Enterprise Management System REST API |
| **ENDPOINT** | `https://enviro.epa.gov/enviro/efservice/SEMS_SITES/COUNTY_NAME/COOK/JSON` |
| **INPUT** | Envirofacts REST path; filter by `COUNTY_NAME`, `STATE_CODE`, `SITE_NAME`, `ZIP_CODE` |
| **OUTPUT** | JSON — site name, address, lat/lon, NPL status, remediation phase, cleanup milestones, responsible parties |
| **AUTH** | None required |
| **UPDATE** | Quarterly |
| **CORS** | Yes |
| **RATE LIMIT** | Row-range pagination |
| **CRE USE** | Phase I ESA Superfund proximity check; remediated brownfield opportunity identification; HazMat liability screening for industrial acquisition |

***

### EH-11 · EPA Envirofacts REST — RCRA Hazardous Waste

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EPA Envirofacts — RCRAInfo |
| **NAME** | RCRA Hazardous Waste Handlers REST API |
| **ENDPOINT** | `https://enviro.epa.gov/enviro/efservice/RCRA_HANDLERS/ZIP_CODE/60601/JSON` |
| **INPUT** | `ZIP_CODE`, `COUNTY_NAME`, `STATE_CODE`, `HANDLER_NAME`; tables: `RCRA_HANDLERS`, `RCRA_VIOLATION_ENFORCEMENTS`, `RCRA_EVALUATIONS` |
| **OUTPUT** | JSON — handler name, address, LQG/SQG/VSQG generator status, active/inactive flag, violations |
| **AUTH** | None required |
| **UPDATE** | Quarterly |
| **CORS** | Yes |
| **RATE LIMIT** | Row-range pagination |
| **CRE USE** | Phase I ESA RCRA generator and handler lookup; proximity to hazardous waste generators for industrial site evaluation |

***

### EH-12 · USGS National Water Information System (NWIS) — Streamflow

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Geological Survey |
| **NAME** | NWIS REST API — Instantaneous Values |
| **ENDPOINT** | `https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=il&parameterCd=00060&siteType=ST&period=P7D` |
| **INPUT** | `format` (json, rdb, wml1, wml2); `sites` or `stateCd`/`countyCd`; `parameterCd` (`00060`=discharge, `00065`=gage height, `00010`=temperature); `period` or `startDT`/`endDT` |
| **OUTPUT** | JSON/WaterML — gage readings, observation timestamps, flood stage thresholds, data qualifiers |
| **AUTH** | None required |
| **UPDATE** | Near real-time (~15-min intervals for active gages) |
| **CORS** | Yes |
| **RATE LIMIT** | No documented limit |
| **CRE USE** | Riverine flood risk adjacent to CRE assets; operational monitoring for logistics/warehouse facilities in flood-prone areas; drainage due diligence |

***

### EH-13 · NOAA Climate Data Online (CDO) API — Historical Weather

| Field | Detail |
|---|---|
| **SOURCE** | NOAA National Centers for Environmental Information |
| **NAME** | NCEI Climate Data Online REST API |
| **ENDPOINT** | `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=GHCND:USW00014819&startdate=2024-01-01&enddate=2024-12-31&datatypeid=TMAX,PRCP&limit=1000` |
| **INPUT** | `datasetid` (GHCND=daily, GHCNDMS=monthly, NORMAL_DLY=30yr normals); `stationid`; `locationid` (county FIPS); `datatypeid`; date range; `limit` |
| **OUTPUT** | JSON — daily/monthly temperature, precipitation, snowfall, snowdepth, wind by station |
| **AUTH** | Free token. Register: [https://www.ncdc.noaa.gov/cdo-web/token](https://www.ncdc.noaa.gov/cdo-web/token) |
| **UPDATE** | Daily (current) + historical |
| **CORS** | Yes |
| **RATE LIMIT** | 1,000 requests/day; 10,000 rows/request |
| **CRE USE** | Flood frequency analysis (precipitation extremes); HVAC sizing for development pro formas; climate risk scoring for ESG reporting |

***

### EH-14 · NREL PVWatts API — Solar Energy Production

| Field | Detail |
|---|---|
| **SOURCE** | National Renewable Energy Laboratory |
| **NAME** | PVWatts v8 API |
| **ENDPOINT** | `https://developer.nlr.gov/api/pvwatts/v8.json?api_key=YOUR_KEY&address=233+S+Wacker+Chicago+IL&system_capacity=100&azimuth=180&tilt=20&array_type=1&module_type=0&losses=14` |
| **INPUT** | `address` or `lat`+`lon`; `system_capacity` (kW); `azimuth`; `tilt`; `array_type` (0=fixed, 1=1-axis tracking); `module_type` (0=standard, 1=premium, 2=thin film); `losses` (%) [^32][^33] |
| **OUTPUT** | JSON — annual/monthly AC energy output (kWh), capacity factor, solar resource data, station info |
| **AUTH** | Free NREL/NLR key. Register: [https://developer.nlr.gov/signup/](https://developer.nlr.gov/signup/) |
| **UPDATE** | Static solar resource database (NSRDB 2022 base) |
| **CORS** | Yes |
| **RATE LIMIT** | 1,000 hourly; 10,000 daily |
| **CRE USE** | Rooftop solar feasibility for CRE assets; green building scoring; net-zero energy planning for industrial/warehouse; NNN lease utility cost modeling |

***

## CATEGORY 4 — Infrastructure / Amenities (10 Endpoints)

### IA-01 · Google Places API (New) — Nearby Search

| Field | Detail |
|---|---|
| **SOURCE** | Google Maps Platform |
| **NAME** | Places API (New) — Nearby Search |
| **ENDPOINT** | POST `https://places.googleapis.com/v1/places:searchNearby` with body `{"includedTypes":["restaurant","parking","bank"],"maxResultCount":20,"locationRestriction":{"circle":{"center":{"latitude":41.8781,"longitude":-87.6298},"radius":500.0}}}` |
| **INPUT** | `includedTypes[]` (200+ place types); `locationRestriction.circle.center` (lat/lon); `radius` (meters); `X-Goog-FieldMask` header specifying fields to return [^34] |
| **OUTPUT** | JSON — place name, type, address, lat/lon, rating, user count, hours, price level, primary type |
| **AUTH** | GCP API key with Places API enabled. Register: [https://cloud.google.com/maps-platform/](https://cloud.google.com/maps-platform/) |
| **UPDATE** | Continuous (Google maintains) |
| **CORS** | Yes (with API key) |
| **RATE LIMIT** | Per-project QPS limits; charged per request (20 results max per call in New API) [^35] |
| **CRE USE** | Amenity density scoring for retail/multifamily; competitive set mapping; food/beverage tenant demand assessment; parking supply analysis |

***

### IA-02 · Google Places API (New) — Text Search

| Field | Detail |
|---|---|
| **SOURCE** | Google Maps Platform |
| **NAME** | Places API (New) — Text Search |
| **ENDPOINT** | POST `https://places.googleapis.com/v1/places:searchText` with body `{"textQuery":"grocery stores near 233 S Wacker Dr Chicago IL","locationBias":{"circle":{"center":{"latitude":41.878,"longitude":-87.629},"radius":2000}}}` |
| **INPUT** | `textQuery` (natural language); `locationBias` or `locationRestriction`; optional `minRating`; `priceLevels[]`; `openNow` [^36] |
| **OUTPUT** | JSON — structured place results with same schema as Nearby Search |
| **AUTH** | Same GCP key as IA-01 |
| **UPDATE** | Continuous |
| **CORS** | Yes |
| **RATE LIMIT** | Per-project QPS |
| **CRE USE** | Retail void analysis (identify gap in grocery/pharmacy anchors); co-tenancy mapping for leasing strategy |

***

### IA-03 · USPS Address Standardization API (v3)

| Field | Detail |
|---|---|
| **SOURCE** | United States Postal Service |
| **NAME** | Addresses 3.0 — Standardization API |
| **ENDPOINT** | `https://api.usps.com/addresses/v3/address?streetAddress=233+S+WACKER+DR&city=CHICAGO&state=IL&ZIPCode=60606&ZIPPlus4=1234` |
| **INPUT** | `streetAddress`; `city`; `state`; `ZIPCode`; OAuth 2.0 Bearer token in Authorization header [^37][^38] |
| **OUTPUT** | JSON — standardized address, corrected ZIP+4, delivery point, address type (firm, PO Box, residential, commercial), geocode |
| **AUTH** | OAuth 2.0 client credentials. Register: [https://developers.usps.com/](https://developers.usps.com/) |
| **UPDATE** | Continuous (USPS address database) |
| **CORS** | Yes |
| **RATE LIMIT** | Not publicly documented; commercial tiers via USPS portal |
| **CRE USE** | Address normalization for parcel matching; correct ZIP+4 for USPS vacancy analysis; delivery/accessibility confirmation |

***

### IA-04 · Census TIGER Roads — ArcGIS REST

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau / TIGERweb |
| **NAME** | TIGERweb Roads REST Feature Service |
| **ENDPOINT** | `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer/2/query?geometry=-87.640,41.875,-87.620,41.885&geometryType=esriGeometryEnvelope&inSR=4326&outFields=FULLNAME,MTFCC,RTTYP&f=geojson` |
| **INPUT** | Bounding box or point; `MTFCC` (road class filter: S1100=primary, S1200=secondary, S1400=local); `outFields`; `f=geojson` |
| **OUTPUT** | GeoJSON — road centerlines with classification, jurisdiction, route type |
| **AUTH** | None required |
| **UPDATE** | Annual |
| **CORS** | Yes |
| **RATE LIMIT** | ArcGIS Server standard |
| **CRE USE** | Ingress/egress analysis; truck route proximity for logistics/industrial; visibility analysis for signage/retail |

***

### IA-05 · NREL Alternative Fuel Stations API

| Field | Detail |
|---|---|
| **SOURCE** | NREL / DOE |
| **NAME** | Alt Fuel Stations API v1 |
| **ENDPOINT** | `https://developer.nlr.gov/api/alt-fuel-stations/v1.json?api_key=YOUR_KEY&fuel_type=ELEC&location=Chicago%2C+IL&radius=5.0&status=E&ev_network=Tesla` |
| **INPUT** | `fuel_type` (ELEC, NG, E85, BIODIESEL, LPG, HY, RD); `location`; `radius`; `status` (E=open, T=temp closed, P=planned); optional `ev_level2_evse_num`, `ev_connector_types` [^39][^33] |
| **OUTPUT** | JSON — station name, address, lat/lon, fuel type, hours, network operator, EV connector types, access type |
| **AUTH** | Free NREL/NLR key |
| **UPDATE** | Continuous volunteer + DOE updates |
| **CORS** | Yes |
| **RATE LIMIT** | 1,000 hourly; 10,000 daily |
| **CRE USE** | EV charging amenity density for office/retail/multifamily ESG scoring; tenant demand for EV infrastructure |

***

### IA-06 · NREL Utility Rates API v3 — Electricity Rates by Location

| Field | Detail |
|---|---|
| **SOURCE** | NREL / OpenEI |
| **NAME** | Utility Rates API v3 |
| **ENDPOINT** | `https://developer.nlr.gov/api/utility_rates/v3.json?api_key=YOUR_KEY&lat=41.8781&lon=-87.6298` |
| **INPUT** | `lat`; `lon`; `address` (alternative) |
| **OUTPUT** | JSON — utility name, EIA utility ID, commercial/residential/industrial electricity rates ($/kWh), effective date, rate schedule type [^32] |
| **AUTH** | Free NREL/NLR key |
| **UPDATE** | EIA Form 861 annual update |
| **CORS** | Yes |
| **RATE LIMIT** | 1,000 hourly; 10,000 daily |
| **CRE USE** | Operating expense modeling for industrial/data center; NNN utility cost budgeting; energy arbitrage for data center site selection |

***

### IA-07 · HRSA Health Resources — Federally Qualified Health Centers (REST)

| Field | Detail |
|---|---|
| **SOURCE** | Health Resources & Services Administration |
| **NAME** | HRSA GIS REST Service — Health Center Sites |
| **ENDPOINT** | `https://gisportal.hrsa.gov/server/rest/services/HCC/BCD_BHCMIS/MapServer/0/query?geometry=-87.65,41.85,-87.60,41.90&geometryType=esriGeometryEnvelope&inSR=4326&outFields=Site_Name,Address,City,State,Zip,Latitude,Longitude&f=geojson` |
| **INPUT** | Bounding box; point+radius; `outFields` |
| **OUTPUT** | GeoJSON — FQHC name, address, service type, patient counts, sliding fee scale flag [^40] |
| **AUTH** | None required |
| **UPDATE** | Annual |
| **CORS** | Yes |
| **RATE LIMIT** | ArcGIS Server standard |
| **CRE USE** | Healthcare amenity proximity for multifamily; community health facility demand analysis for medical office/retail |

***

### IA-08 · EPA ENERGY STAR Product Finder API

| Field | Detail |
|---|---|
| **SOURCE** | EPA / DOE |
| **NAME** | ENERGY STAR Certified Buildings API |
| **ENDPOINT** | `https://data.energystar.gov/resource/h9kf-82e8.json?$where=within_circle(geolocation,41.8781,-87.6298,5000)&$limit=50` |
| **INPUT** | `$where` spatial clause or `property_address`, `city`, `state`; `$limit`; `$offset`; Socrata-powered endpoint |
| **OUTPUT** | JSON — property name, address, certification date, score (1–100), property type, floor area |
| **AUTH** | None required (Socrata open data) |
| **UPDATE** | Certification database updated as new certifications issued |
| **CORS** | Yes |
| **RATE LIMIT** | Socrata standard; 1,000 req/hr without token |
| **CRE USE** | Green building certification research for comparable selection; ESG certification premium quantification; LEED/ENERGY STAR competitive differentiation |

***

### IA-09 · BTS National Transit Database (NTD) — Transit Agency Service

| Field | Detail |
|---|---|
| **SOURCE** | Federal Transit Administration / BTS |
| **NAME** | NTD Data — Agency Service via data.gov API |
| **ENDPOINT** | `https://data.transportation.gov/resource/i8py-hwc8.json?$where=city='Chicago'&$limit=100` |
| **INPUT** | Socrata query: `city`, `state`, `mode` (HR=heavy rail, LR=light rail, MB=bus); `$limit` |
| **OUTPUT** | JSON — agency name, mode, vehicle revenue miles, unlinked passenger trips, operating expenses, fleet size |
| **AUTH** | None required |
| **UPDATE** | Annual (FTA mandated reporting) |
| **CORS** | Yes |
| **RATE LIMIT** | Socrata standard |
| **CRE USE** | Transit mode and ridership for TOD analysis; bus line proximity scoring for multifamily; office space transit premium modeling |

***

### IA-10 · FCC Area API — Broadband by Location

| Field | Detail |
|---|---|
| **SOURCE** | Federal Communications Commission |
| **NAME** | FCC Area API — Broadband Availability |
| **ENDPOINT** | `https://broadbandmap.fcc.gov/api/public/map/listAvailability?latitude=41.8781&longitude=-87.6298&category=fixed_residential&speed_dn=100&speed_up=20` |
| **INPUT** | `latitude`; `longitude`; `category` (fixed_residential, fixed_business, mobile); `speed_dn`; `speed_up`; `tech_types[]` (fiber, cable, DSL) |
| **OUTPUT** | JSON — ISP names, technology types, max advertised upload/download speeds, coverage percentage by provider |
| **AUTH** | None required |
| **UPDATE** | Semi-annual (FCC Form 477 submissions) |
| **CORS** | Yes |
| **RATE LIMIT** | Not documented; reasonable use |
| **CRE USE** | Fiber/broadband connectivity for office, data center, and co-working site selection; tenant telecoms amenity scoring; rural broadband risk for multifamily |

***

## CATEGORY 5 — Housing / Real Estate Data (15 Endpoints)

### HR-01 · HUD Fair Market Rents (FMR) API

| Field | Detail |
|---|---|
| **SOURCE** | HUD Office of Policy Development & Research |
| **NAME** | Fair Market Rents API |
| **ENDPOINT** | `https://www.huduser.gov/hudapi/public/fmr/statedata/IL?year=2025` (state data) | `https://www.huduser.gov/hudapi/public/fmr/data/17031?year=2025` (county/metro) |
| **INPUT** | State code or FIPS code; `year` (FY); optional `county` sub-path |
| **OUTPUT** | JSON — efficiency, 1BR, 2BR, 3BR, 4BR gross FMR dollar amounts by metro area, county, and HUD pay area [^41][^42] |
| **AUTH** | Free HUD bearer token. Register: [https://www.huduser.gov/portal/dataset/fmr-api.html](https://www.huduser.gov/portal/dataset/fmr-api.html) |
| **UPDATE** | Annual (FY, typically October effective) |
| **CORS** | Yes |
| **RATE LIMIT** | Not documented |
| **CRE USE** | Section 8 maximum rent benchmarking; affordable housing financial modeling; voucher subsidy market-rate alignment for workforce housing |

***

### HR-02 · HUD Income Limits API

| Field | Detail |
|---|---|
| **SOURCE** | HUD |
| **NAME** | Income Limits API |
| **ENDPOINT** | `https://www.huduser.gov/hudapi/public/fmr/il/data/17031?year=2025` |
| **INPUT** | FIPS code; `year` |
| **OUTPUT** | JSON — AMI (Area Median Income), 30%/50%/60%/80%/120% AMI thresholds by household size; very low/low/moderate income limits [^43][^44] |
| **AUTH** | Free HUD bearer token |
| **UPDATE** | Annual (April effective) |
| **CORS** | Yes |
| **RATE LIMIT** | Not documented |
| **CRE USE** | LIHTC rent and income qualification; affordable housing compliance testing; qualified census tract and DDA determination |

***

### HR-03 · Census ACS 5-Year — Housing Characteristics (DP04)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau |
| **NAME** | ACS 5-Year DP04 — Selected Housing Characteristics |
| **ENDPOINT** | `https://api.census.gov/data/2024/acs/acs5/profile?get=DP04_0001E,DP04_0003PE,DP04_0045PE,DP04_0046PE,DP04_0127PE&for=tract:*&in=state:17+county:031&key=YOUR_KEY` |
| **INPUT** | DP04 variable codes: `DP04_0001E`=total housing units, `DP04_0003PE`=vacancy rate, `DP04_0045PE`=renter-occupied %, `DP04_0127PE`=median gross rent, `DP04_0089E`=median home value |
| **OUTPUT** | JSON — tract-level housing unit count, vacancy rate, tenure split, median rent, median home value, year built distribution, bedrooms, plumbing/kitchen facilities |
| **AUTH** | Free Census key |
| **UPDATE** | Annual |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | Submarket vacancy benchmarking; renter percentage for multifamily demand; affordability gap analysis; housing stock age for value-add targeting |

***

### HR-04 · ATTOM Property Data API — Basic Profile

| Field | Detail |
|---|---|
| **SOURCE** | ATTOM Data Solutions |
| **NAME** | ATTOM Property API — Basic Profile |
| **ENDPOINT** | `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile?address1=233+S+Wacker+Dr&address2=Chicago+IL+60606` |
| **INPUT** | `address1` (street); `address2` (city state ZIP) OR `attomid` (persistent ATTOM ID); query parameters per endpoint |
| **OUTPUT** | JSON — property type, lot size, year built, building area, bedrooms/baths, units, APN, legal description, owner name, assessment value, last sale date/price [^45][^46] |
| **AUTH** | API key via subscription (commercial pricing). Register: [https://api.developer.attomdata.com/home](https://api.developer.attomdata.com/home) |
| **UPDATE** | Continuous (county assessor feeds) |
| **CORS** | Yes |
| **RATE LIMIT** | Plan-dependent; throttled per-minute limits |
| **CRE USE** | Property-level due diligence; ownership verification; tax assessment review; portfolio screening for acquisition targets |

***

### HR-05 · ATTOM Property API — Sale History

| Field | Detail |
|---|---|
| **SOURCE** | ATTOM Data Solutions |
| **NAME** | ATTOM Property API — Sale History |
| **ENDPOINT** | `https://api.gateway.attomdata.com/propertyapi/v1.0.0/sale/detail?address1=233+S+Wacker+Dr&address2=Chicago+IL+60606` |
| **INPUT** | `address1`; `address2` or `attomid` |
| **OUTPUT** | JSON — transaction history with seller/buyer names, sale price, sale date, deed type, financing type, distressed sale flag |
| **AUTH** | ATTOM subscription API key [^47][^46] |
| **UPDATE** | Continuous |
| **CORS** | Yes |
| **RATE LIMIT** | Plan-dependent |
| **CRE USE** | Comparable sales analysis; cap rate estimation; distressed property identification; acquisition pricing benchmarking |

***

### HR-06 · ATTOM Property API — AVM (Automated Valuation)

| Field | Detail |
|---|---|
| **SOURCE** | ATTOM Data Solutions |
| **NAME** | ATTOM Home Value Estimator / AVM API |
| **ENDPOINT** | `https://api.gateway.attomdata.com/propertyapi/v1.0.0/attomavm/detail?address1=233+S+Wacker+Dr&address2=Chicago+IL+60606` |
| **INPUT** | `address1`; `address2`; optional `attomid` |
| **OUTPUT** | JSON — AVM estimated value, confidence score, value range (low/high), forecast standard deviation, effective date [^47] |
| **AUTH** | ATTOM subscription key |
| **UPDATE** | Monthly model refresh |
| **CORS** | Yes |
| **RATE LIMIT** | Plan-dependent |
| **CRE USE** | Quick underwriting valuation; portfolio mark-to-market; acquisition screening price discovery |

***

### HR-07 · Regrid Parcel API v2 — Address Search

| Field | Detail |
|---|---|
| **SOURCE** | Regrid (149M+ parcels) |
| **NAME** | Regrid Parcel API v2 — Address Endpoint |
| **ENDPOINT** | `https://app.regrid.com/api/v1/search.json?query=233+S+Wacker+Dr+Chicago+IL&token=YOUR_TOKEN&return_custom=true` |
| **INPUT** | `query` (address string); `path` (state/county FIPS path filter); `limit` (1–1000, default 20); `token` |
| **OUTPUT** | GeoJSON — parcel boundary polygon, APN, owner name, mailing address, land use code, acreage, zoning, assessed value, building sq ft, year built [^48][^49] |
| **AUTH** | Regrid account token (subscription plans). Register: [https://app.regrid.com/](https://app.regrid.com/) |
| **UPDATE** | Continuous (county assessor feeds; 99% US coverage) |
| **CORS** | Yes |
| **RATE LIMIT** | 10 simultaneous requests; ~200 req/min; additional capacity via sales [^48] |
| **CRE USE** | Parcel-level ownership; land use and zoning confirmation; site area and geometry for development feasibility; adjacent parcel assembly analysis |

***

### HR-08 · Regrid Parcel API v2 — Spatial (Point/Radius/Bbox) Search

| Field | Detail |
|---|---|
| **SOURCE** | Regrid |
| **NAME** | Regrid Parcel API v2 — Spatial Query |
| **ENDPOINT** | `https://app.regrid.com/api/v1/search.json?lat=41.878&lon=-87.630&radius=500&token=YOUR_TOKEN&limit=100` (point+radius) | `https://app.regrid.com/api/v1/search.json?bbox=-87.64,41.87,-87.62,41.89&token=YOUR_TOKEN` (bounding box) |
| **INPUT** | `lat`+`lon`+`radius` (meters) OR `bbox` (W,S,E,N); `token`; `limit`; optional field filters |
| **OUTPUT** | GeoJSON Feature Collection — multiple parcel records within spatial extent [^50] |
| **AUTH** | Regrid token |
| **UPDATE** | Continuous |
| **CORS** | Yes |
| **RATE LIMIT** | Same as HR-07 |
| **CRE USE** | Market comps aggregation; competitive property set mapping; land banking and site assembly prospecting |

***

### HR-09 · LightBox Zoning API — Parcel-Level Zoning Detail

| Field | Detail |
|---|---|
| **SOURCE** | LightBox |
| **NAME** | LightBox Zoning API |
| **ENDPOINT** | `https://api.lightboxre.com/v1/zoning?address=233+S+Wacker+Dr+Chicago+IL` (address-based) OR `https://api.lightboxre.com/v1/zoning/{lightbox_parcel_id}` |
| **INPUT** | Address string OR LightBox Parcel ID |
| **OUTPUT** | JSON — zoning district classification, permitted uses, setback requirements, FAR (Floor Area Ratio), maximum building height, lot coverage, density metrics, jurisdiction ID [^51][^52][^53] |
| **AUTH** | LightBox API subscription. Portal: [https://developer.lightboxre.com](https://developer.lightboxre.com) |
| **UPDATE** | Continuous sourcing from municipal zoning databases |
| **CORS** | Yes (developer portal authentication) |
| **RATE LIMIT** | Plan-dependent |
| **CRE USE** | Entitlement risk assessment; by-right development capacity; zoning change potential analysis; development pro forma underwriting |

***

### HR-10 · LightBox NFHL API — Flood Zone by Address/Parcel

| Field | Detail |
|---|---|
| **SOURCE** | LightBox (wrapping FEMA NFHL) |
| **NAME** | LightBox NFHL Flood Hazard API |
| **ENDPOINT** | `https://api.lightboxre.com/v1/nfhl?address=233+S+Wacker+Dr+Chicago+IL+60606` |
| **INPUT** | Street address; or LightBox parcel/address ID |
| **OUTPUT** | JSON — flood zone designation (AE, X, etc.); SFHA flag; BFE; FIRM panel number; community ID; effective date; LOMC status [^24] |
| **AUTH** | LightBox API subscription |
| **UPDATE** | Reflects current NFHL effective panels |
| **CORS** | Yes |
| **RATE LIMIT** | Plan-dependent |
| **CRE USE** | Integrated flood determination with parcel context; lender flood insurance mandate compliance; automated due diligence workflows |

***

### HR-11 · HUD eGIS Open Data — Location Affordability Index

| Field | Detail |
|---|---|
| **SOURCE** | HUD / DOT |
| **NAME** | Location Affordability Index (LAI) v3 Feature Service |
| **ENDPOINT** | `https://hud.maps.arcgis.com/home/item.html?id=...` → ArcGIS REST: `https://gis.hud.gov/arcgisimage/.../LAIv3/FeatureServer/0/query?where=GEOID='17031842400'&outFields=*&f=geojson` |
| **INPUT** | GEOID (block group), bounding box, or county FIPS |
| **OUTPUT** | GeoJSON — combined housing + transportation cost as % of income for 8 household profiles; constituent land use and transit variables [^54][^55] |
| **AUTH** | None required |
| **UPDATE** | Static v3 (2012–2016 ACS base); v4 under development |
| **CORS** | Yes |
| **RATE LIMIT** | ArcGIS Online standard |
| **CRE USE** | H+T affordability for retail trade area purchasing power; mixed-income housing market demand; transit-served neighborhood premium analysis |

***

### HR-12 · Census New Residential Construction — Housing Starts API

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Census Bureau / HUD |
| **NAME** | Building Permits Survey API |
| **ENDPOINT** | `https://api.census.gov/data/timeseries/bps/county?get=BLDGS,UNITS&for=county:031&in=state:17&time=2024-01&key=YOUR_KEY` |
| **INPUT** | `BLDGS` (building count); `UNITS` (unit count); `REP_EST` (estimated value); `PERMIT_TYPE` (1=single-family, 2=2-unit, 3=3-4 unit, 4=5+ unit); geography; `time` (YYYY-MM) |
| **OUTPUT** | JSON — monthly building permits issued by structure type and county |
| **AUTH** | Free Census key |
| **UPDATE** | Monthly |
| **CORS** | Yes |
| **RATE LIMIT** | 500/day |
| **CRE USE** | New supply pipeline for apartment/single-family market analysis; construction activity as economic indicator; submarkets with oversupply risk |

***

### HR-13 · FRED Housing Price Index Series

| Field | Detail |
|---|---|
| **SOURCE** | Federal Housing Finance Agency via FRED |
| **NAME** | FHFA House Price Index — MSA Level |
| **ENDPOINT** | `https://api.stlouisfed.org/fred/series/observations?series_id=ATNHPIUS16984Q&api_key=YOUR_KEY&file_type=json` (Chicago-Naperville-Elgin MSA HPI) |
| **INPUT** | FHFA HPI series IDs (format `ATNHPIUS{CBSA_CODE}Q`); `api_key`; date range |
| **OUTPUT** | JSON — quarterly HPI index values; purchase-only index available separately |
| **AUTH** | Free FRED key |
| **UPDATE** | Quarterly (FHFA HPI) |
| **CORS** | Yes |
| **RATE LIMIT** | 120 req/min |
| **CRE USE** | Residential value trends as leading indicator for commercial market cycles; cap rate compression/expansion timing |

***

### HR-14 · RentCast API — Rental Market Data

| Field | Detail |
|---|---|
| **SOURCE** | RentCast |
| **NAME** | RentCast Market Trends & Estimates API |
| **ENDPOINT** | `https://api.rentcast.io/v1/markets?zipCode=60611&propertyType=Apartment` |
| **INPUT** | `zipCode`; `propertyType` (SingleFamily, Condo, Townhouse, Apartment); `bedrooms` |
| **OUTPUT** | JSON — median listed rent, avg rent/sqft, days on market, vacancy estimate, YoY rent growth, comparable properties list |
| **AUTH** | RentCast API key (subscription plans). Register: [https://www.rentcast.io/api](https://www.rentcast.io/api) [^56] |
| **UPDATE** | Monthly model refresh; daily listing ingestion |
| **CORS** | Yes |
| **RATE LIMIT** | Plan-dependent |
| **CRE USE** | Multifamily rent comps; lease-up projection for apartment development; SFR portfolio rent benchmarking |

***

### HR-15 · HUD CHAS API — Renter Cost Burden (Tract Level)

*(See D-06 for full spec — callable at census tract type=6 for tract-level housing cost burden detail)*

| Field | Detail |
|---|---|
| **SOURCE** | HUD |
| **NAME** | CHAS Tract-Level API |
| **ENDPOINT** | `curl -H "Authorization: Bearer YOUR_TOKEN" "https://www.huduser.gov/hudapi/public/chas?type=6&stateId=17&entityId=17031842400&year=2016-2020"` |
| **INPUT** | `type=6` (census tract); `stateId`; `entityId` (full tract GEOID); `year` |
| **OUTPUT** | JSON — tract-level CHAS tables with cost burden by income × tenure × severity |
| **AUTH** | Free HUD bearer token |
| **UPDATE** | ACS 5-year cycle (2018–2022 ACS released Dec 2025) [^15] |
| **CORS** | Yes |
| **RATE LIMIT** | Not documented |
| **CRE USE** | Granular rent subsidy market sizing; opportunity zone CRA investment qualification; affordable housing site scoring |

***

## CATEGORY 6 — Energy / Utilities (8 Endpoints)

### EU-01 · EIA API v2 — Electricity Retail Sales & Prices

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Energy Information Administration |
| **NAME** | EIA API v2 — Electricity Retail Sales by Sector |
| **ENDPOINT** | `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=YOUR_KEY&frequency=monthly&data=customers&data[^1]=revenue&data[^2]=sales&facets[stateid][]=IL&facets[sectorName][]=commercial&sort[column]=period&sort[direction]=desc&offset=0&length=24` |
| **INPUT** | `api_key`; `frequency` (monthly, annual); `facets[stateid][]`; `facets[sectorName][]` (residential, commercial, industrial, transportation); `data[]` (sales kWh, revenue $, customers, price) [^57][^58] |
| **OUTPUT** | JSON — monthly electricity sales (MWh), revenue ($k), customers, average retail price (cents/kWh) by sector and state |
| **AUTH** | Free EIA key. Register: [https://www.eia.gov/opendata/register.php](https://www.eia.gov/opendata/register.php) |
| **UPDATE** | Monthly (~2-month lag) |
| **CORS** | Yes |
| **RATE LIMIT** | 5,000 requests/day |
| **CRE USE** | Commercial electricity pricing for NNN lease operating expense modeling; industrial energy cost benchmarking; data center utility cost due diligence |

***

### EU-02 · EIA API v2 — Natural Gas Citygate Prices

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EIA |
| **NAME** | EIA API v2 — Natural Gas City Gate & Commercial Prices |
| **ENDPOINT** | `https://api.eia.gov/v2/natural-gas/pri/sum/data/?api_key=YOUR_KEY&frequency=monthly&data=value&facets[duoarea][]=S_ILL&facets[process][]=PCS&sort[column]=period&sort[direction]=desc&length=24` |
| **INPUT** | `facets[duoarea][]` (state code, e.g., `S_ILL`); `facets[process][]` (`PCS`=commercial sold, `PRS`=residential, `PIN`=industrial, `PCG`=city gate); `frequency` (monthly, annual) [^59] |
| **OUTPUT** | JSON — $/MCF gas price by sector/state/month |
| **AUTH** | Same EIA key |
| **UPDATE** | Monthly |
| **CORS** | Yes |
| **RATE LIMIT** | 5,000 requests/day |
| **CRE USE** | HVAC operating cost analysis; NNN lease CAM cost reconciliation; energy-intensive industrial tenant lease economics |

***

### EU-03 · EIA API v2 — Electricity Generation by Plant

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EIA |
| **NAME** | EIA API v2 — Plant-Level Electricity Generation |
| **ENDPOINT** | `https://api.eia.gov/v2/electricity/facility-fuel/data/?api_key=YOUR_KEY&frequency=annual&data=generation&data[^1]=gross-generation&facets[state][]=IL&facets[fuel2002][]=NG&sort[column]=period&sort[direction]=desc` |
| **INPUT** | `facets[state][]`; `facets[fuel2002][]` (NG, NUC, SUN, WND, WAT, COL); `facets[plantCode][]`; `frequency` (monthly, annual) |
| **OUTPUT** | JSON — plant name, state, fuel type, generation (MWh), capacity (MW) |
| **AUTH** | Same EIA key |
| **UPDATE** | Monthly (2-month lag) |
| **CORS** | Yes |
| **RATE LIMIT** | 5,000 requests/day |
| **CRE USE** | Grid reliability analysis for data center/critical facility site selection; renewable energy portfolio proximity |

***

### EU-04 · EIA API v2 — Petroleum Retail Prices

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EIA |
| **NAME** | EIA API v2 — Weekly Petroleum Retail Prices |
| **ENDPOINT** | `https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=YOUR_KEY&frequency=weekly&data=value&facets[duoarea][]=R20&facets[product][]=EPD2D&sort[column]=period&sort[direction]=desc&length=52` |
| **INPUT** | `facets[duoarea][]` (PADD region, state code); `facets[product][]` (`EPD2D`=diesel, `EPM0`=regular gasoline); `frequency` (weekly, monthly, annual) |
| **OUTPUT** | JSON — weekly retail fuel price ($/gallon) by region |
| **AUTH** | Same EIA key |
| **UPDATE** | Weekly (Monday release) |
| **CORS** | Yes |
| **RATE LIMIT** | 5,000 requests/day |
| **CRE USE** | Logistics/trucking operating cost modeling; industrial and distribution center lease economics; fleet cost component for tenant analysis |

***

### EU-05 · EIA API v2 — Electric Power Hourly Demand (RTO)

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EIA |
| **NAME** | EIA API v2 — Hourly Electric Grid Demand by RTO |
| **ENDPOINT** | `https://api.eia.gov/v2/electricity/rto/fuel-type-data/data/?api_key=YOUR_KEY&frequency=hourly&data=value&facets[respondent][]=MISO&facets[fueltype][]=NG&sort[column]=period&sort[direction]=desc&length=168` |
| **INPUT** | `facets[respondent][]` (RTO: MISO, PJM, CAISO, ERCOT); `facets[fueltype][]` (NG, SUN, WND, COL, WAT, NUC, OIL); `frequency=hourly` |
| **OUTPUT** | JSON — hourly generation by fuel type and RTO (MWh) |
| **AUTH** | Same EIA key [^57] |
| **UPDATE** | Hourly (near real-time) |
| **CORS** | Yes |
| **RATE LIMIT** | 5,000 requests/day |
| **CRE USE** | Grid stability risk for data center/critical facility; renewable energy percentage calculation for ESG reporting; peak demand cost assessment |

***

### EU-06 · EPA Greenhouse Gas Reporting (GHGRP) via Envirofacts

| Field | Detail |
|---|---|
| **SOURCE** | U.S. EPA Envirofacts — GHGRP |
| **NAME** | GHGRP Facility Emissions REST API |
| **ENDPOINT** | `https://enviro.epa.gov/enviro/efservice/PUB_DIM_FACILITY/COUNTY/COOK/JSON` |
| **INPUT** | Standard Envirofacts REST path; tables: `PUB_DIM_FACILITY`, `PUB_FACTS_SECTOR_GHG_EMISSION`, `PUB_DIM_SEGMENT` |
| **OUTPUT** | JSON — facility name, address, parent company, lat/lon, total CO2e (metric tons), sector (power, industrial, petroleum, etc.) [^60][^61] |
| **AUTH** | None required |
| **UPDATE** | Annual (submission year data released ~October following year) |
| **CORS** | Yes |
| **RATE LIMIT** | Row-range pagination |
| **CRE USE** | Carbon footprint proximity for ESG due diligence; scope 3 tenant emissions estimation; industrial site regulatory burden assessment |

***

### EU-07 · NREL National Solar Radiation Database (NSRDB) API

| Field | Detail |
|---|---|
| **SOURCE** | NREL |
| **NAME** | NSRDB Data Query API |
| **ENDPOINT** | `https://developer.nlr.gov/api/solar/solar_resource/v1.json?api_key=YOUR_KEY&lat=41.878&lon=-87.630` |
| **INPUT** | `lat`; `lon`; `api_key` |
| **OUTPUT** | JSON — annual/monthly solar resource data: Global Horizontal Irradiance (GHI), Direct Normal Irradiance (DNI), Diffuse Horizontal Irradiance (DHI), wind speed |
| **AUTH** | Free NREL/NLR key |
| **UPDATE** | Static (NSRDB 2022 PSM v3 base) |
| **CORS** | Yes |
| **RATE LIMIT** | 1,000 hourly; 10,000 daily |
| **CRE USE** | Solar feasibility for rooftop PV on CRE assets; daylighting analysis for office/retail; ground-mount solar for industrial/vacant land |

***

### EU-08 · DOE Building Performance Database (BPD) — Benchmarking

| Field | Detail |
|---|---|
| **SOURCE** | DOE / LBNL |
| **NAME** | Building Performance Database API |
| **ENDPOINT** | `https://bpd.lbl.gov/api/v1/buildings?propertyType=Office&climate_zone=5A&state=IL` |
| **INPUT** | `propertyType` (Office, Retail, Warehouse, Multifamily); `climate_zone`; `state`; `year_built` range |
| **OUTPUT** | JSON — aggregated energy use intensity (EUI kBtu/sqft/yr) benchmarks; normalized by floor area, vintage, climate zone; percentile distributions |
| **AUTH** | DOE API key (free). Register via DOE EERE portal |
| **UPDATE** | Annual refresh as new benchmarking data submitted |
| **CORS** | Yes |
| **RATE LIMIT** | Not documented |
| **CRE USE** | ENERGY STAR score benchmarking; OpEx energy budget modeling; underwriting utility expense normalization; property improvement ROI analysis |

***

## CATEGORY 7 — Zoning / Land Use (8 Endpoints)

### ZL-01 · LightBox Zoning API — Parcel Zoning Classification

*(Full spec at HR-09; canonical zoning endpoint for CRE workflows)*

| Field | Detail |
|---|---|
| **SOURCE** | LightBox |
| **NAME** | LightBox Zoning API v1 |
| **ENDPOINT** | `https://api.lightboxre.com/v1/zoning/{lightbox_parcel_id}` OR `https://api.lightboxre.com/v1/zoning?address=ADDRESS` |
| **INPUT** | LightBox Parcel ID or address; optional `include_overlay=true` for overlay district data |
| **OUTPUT** | JSON — zone district code, description, primary use class, dimensional standards (FAR, setbacks, height, lot coverage, density), overlay districts, jurisdiction ID [^51][^53] |
| **AUTH** | LightBox API subscription key |
| **UPDATE** | Continuous (municipal sourcing) |
| **CORS** | Yes |
| **RATE LIMIT** | Subscription plan-based |
| **CRE USE** | Automated zoning due diligence for acquisitions; by-right development capacity calculation; entitlement risk scoring; FAR arbitrage analysis |

***

### ZL-02 · Regrid Parcel API — Land Use Code & Zoning Field

*(Full spec at HR-07/HR-08; includes `zoning` and `usecode` fields natively in parcel response)*

| Field | Detail |
|---|---|
| **SOURCE** | Regrid |
| **NAME** | Regrid Parcel API v2 — Land Use & Zoning Fields |
| **ENDPOINT** | `https://app.regrid.com/api/v1/search.json?query=233+S+Wacker+Dr+Chicago+IL&fields=zoning,usecode,usedesc,lbcs_function,lbcs_activity&token=YOUR_TOKEN` |
| **INPUT** | Address/spatial query; `fields` filter to limit response to zoning-relevant fields |
| **OUTPUT** | GeoJSON — `zoning` (municipal code), `usecode` (county assessor use code), `usedesc` (use description), `lbcs_function` (Land-Based Classification Standard function code) [^50][^48] |
| **AUTH** | Regrid subscription token |
| **UPDATE** | Continuous |
| **CORS** | Yes |
| **RATE LIMIT** | 200 req/min; 10 simultaneous |
| **CRE USE** | Lightweight zoning screening without LightBox subscription; use code mapping for portfolio classification; brownfield vs. greenfield land use assessment |

***

### ZL-03 · FEMA National Flood Hazard Layer (NFHL) ArcGIS REST

*(Full spec at EH-04; also functions as land-use overlay for flood plain zoning)*

***

### ZL-04 · National Zoning Atlas — API Access

| Field | Detail |
|---|---|
| **SOURCE** | National Zoning Atlas (Cornell/partner universities) |
| **NAME** | National Zoning Atlas Data |
| **ENDPOINT** | Data available via download portal: [https://www.zoningatlas.org](https://www.zoningatlas.org) + state-specific ArcGIS REST Feature Services |
| **INPUT** | State portal selection; municipality; zone district code |
| **OUTPUT** | GeoJSON/Shapefile — zoning district polygons; permitted uses; dimensional standards; housing type allowances (SFR-only, ADU, MFR) [^62] |
| **AUTH** | None required for state atlas downloads; ArcGIS REST endpoints public |
| **UPDATE** | State-by-state coverage expanding through 2026 |
| **CORS** | Yes (ArcGIS REST) |
| **RATE LIMIT** | ArcGIS standard |
| **CRE USE** | Macro-level zoning reform analysis; housing development restriction mapping; multi-site portfolio zoning comparison |

***

### ZL-05 · City/County Open Data Portals — Zoning District ArcGIS REST

| Field | Detail |
|---|---|
| **SOURCE** | Municipal open data portals (ArcGIS Online/Enterprise) |
| **NAME** | City Zoning Districts Feature Service (example: Chicago) |
| **ENDPOINT** | Chicago example: `https://gis.cityofchicago.org/arcgis/rest/services/EmergencyManagement/ChicagoZoning2024/MapServer/0/query?where=ZONE_CLASS+LIKE+'C%25'&outFields=ZONE_CLASS,ZONE_TYPE,SHAPE_Area&f=geojson` |
| **INPUT** | `where` clause (zone class filter); `geometry` filter; `outFields`; `f=geojson` |
| **OUTPUT** | GeoJSON — zoning polygon with official district code, category, effective date |
| **AUTH** | None required (most municipal ArcGIS REST are public) |
| **UPDATE** | As ordinances pass (typically quarterly updates) |
| **CORS** | Yes |
| **RATE LIMIT** | Server-dependent; typically no hard limit |
| **CRE USE** | Authoritative municipal zoning for local transactions; planned development overlays; TIF district boundaries |

***

### ZL-06 · HUD Opportunity Zone Mapping — ArcGIS REST

| Field | Detail |
|---|---|
| **SOURCE** | U.S. Treasury / HUD |
| **NAME** | Qualified Opportunity Zones Feature Service |
| **ENDPOINT** | `https://hud.maps.arcgis.com/home/item.html?id=...` → `https://tigerweb.geo.census.gov/arcgis/rest/services/Census2010/State_County/MapServer/14/query?where=OZ_ELIGIBLE='Y'&f=geojson` |
| **INPUT** | `where=OZ_ELIGIBLE='Y'`; state filter; tract GEOID |
| **OUTPUT** | GeoJSON — QOZ census tract boundaries, state/county FIPS, designation confirmation |
| **AUTH** | None required |
| **UPDATE** | Static (2018 QOZ designations; statutory) |
| **CORS** | Yes |
| **RATE LIMIT** | ArcGIS Online standard |
| **CRE USE** | OZ fund investment eligibility screening; tax advantage underwriting for ground-up development; QOZB property qualification |

***

### ZL-07 · USDA LandScope America — Agricultural Land Use

| Field | Detail |
|---|---|
| **SOURCE** | USDA National Agricultural Statistics Service (NASS) / CropScape |
| **NAME** | CropScape Cropland Data Layer (CDL) REST API |
| **ENDPOINT** | `https://nassgeodata.gmu.edu/axis2/services/CDLService/GetCDLValue?year=2024&lat=42.00&lon=-88.50` |
| **INPUT** | `year` (2008–2024); `lat`; `lon`; alternative `GetCDLFile` for area download |
| **OUTPUT** | JSON — land cover classification code (corn=1, soybeans=5, developed/high intensity=24, etc.) for point location |
| **AUTH** | None required |
| **UPDATE** | Annual (previous year's CDL released ~February) |
| **CORS** | Yes |
| **RATE LIMIT** | Not documented |
| **CRE USE** | Agricultural-to-industrial land conversion analysis; rural CRE development site assessment; water/drainage context for industrial due diligence |

***

### ZL-08 · EPA Smart Location Mapping API

| Field | Detail |
|---|---|
| **SOURCE** | EPA / HUD |
| **NAME** | EPA Smart Location Database Feature Service |
| **ENDPOINT** | `https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/Smart_Location_Database/FeatureServer/0/query?where=COUNTYFP='031'+AND+STATEFP='17'&outFields=D1A,D2B_E8MIXA,D4A,NatWalkInd,CSA_Name&f=geojson` |
| **INPUT** | FIPS filters; `outFields`: `D1A`=gross residential density, `D2B_E8MIXA`=job diversity mix, `D4A`=transit distance, `NatWalkInd`=national walkability index |
| **OUTPUT** | GeoJSON — block group-level EPA walkability index (0–20), density, diversity, design, transit, and destination variables |
| **AUTH** | None required |
| **UPDATE** | 2021 v3.0 (ACS 2019 + GTFS base); infrequent updates |
| **CORS** | Yes |
| **RATE LIMIT** | ArcGIS Online standard |
| **CRE USE** | Walkability-adjusted cap rate analysis; mixed-use development scoring; sustainable location analysis for green building certification |

***

## CATEGORY 8 — Israel-Specific Endpoints (18 Endpoints)

### IS-01 · data.gov.il CKAN API — Dataset Search

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Government Open Data Portal |
| **NAME** | data.gov.il CKAN Package Search API |
| **ENDPOINT** | `https://data.gov.il/api/3/action/package_search?q=building+permits&fq=organization:piba&rows=20&start=0` |
| **INPUT** | `q` (keyword search, Hebrew or English); `fq` (filter query: `organization:`, `groups:`, `tags:`); `rows` (max 100); `start` (offset for pagination) [^63][^64] |
| **OUTPUT** | JSON — `{success, result:{count, results:[{id, name, title, notes, resources:[{url, format, name}], organization:{name, title}}]}}` |
| **AUTH** | None required |
| **UPDATE** | Real-time catalog |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Discover building permits, population data, real estate transactions, zoning maps across Israeli government agencies |

***

### IS-02 · data.gov.il CKAN API — Dataset Detail (Package Show)

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Government Open Data Portal |
| **NAME** | data.gov.il CKAN Package Show API |
| **ENDPOINT** | `https://data.gov.il/api/3/action/package_show?id=building-permits-piba` |
| **INPUT** | `id` (dataset name or UUID from IS-01 results) |
| **OUTPUT** | JSON — full dataset metadata: resource URLs, file formats, update frequency, license, field descriptions, organization |
| **AUTH** | None required [^64] |
| **UPDATE** | Real-time |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Access resource download URLs; confirm data freshness; retrieve field dictionaries for datasets found via IS-01 |

***

### IS-03 · data.gov.il CKAN API — Datastore Search (Tabular Query)

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Government Open Data Portal |
| **NAME** | data.gov.il CKAN Datastore Search |
| **ENDPOINT** | `https://data.gov.il/api/3/action/datastore_search?resource_id=RESOURCE_ID&filters={"city_code":"5000"}&limit=100&offset=0` |
| **INPUT** | `resource_id` (UUID of specific tabular resource from IS-02); `filters` (JSON object of column=value); `q` (full-text search); `fields` (column subset); `sort`; `limit`; `offset` |
| **OUTPUT** | JSON — tabular rows matching filters; field definitions; total record count [^63][^65] |
| **AUTH** | None required |
| **UPDATE** | As datasets are updated by source agency |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Direct tabular access to Israeli housing data, building permits, population counts, transaction prices, urban planning decisions |

***

### IS-04 · data.gov.il CKAN API — SQL Query (Datastore Search SQL)

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Government Open Data Portal |
| **NAME** | data.gov.il CKAN Datastore SQL Query |
| **ENDPOINT** | `https://data.gov.il/api/3/action/datastore_search_sql?sql=SELECT+"city_name","total_units","permit_date"+FROM+"RESOURCE_ID"+WHERE+"city_code"='5000'+ORDER+BY+"permit_date"+DESC+LIMIT+100` |
| **INPUT** | `sql` (SQL SELECT query; FROM clause uses resource UUID as table name) |
| **OUTPUT** | JSON — query result rows; field definitions |
| **AUTH** | None required [^64] |
| **UPDATE** | Real-time against live dataset |
| **CORS** | Yes |
| **RATE LIMIT** | None documented; complex queries may time out |
| **CRE USE** | Advanced filtering of Israeli building permits by city, year, unit type; Israeli housing transaction aggregation |

***

### IS-05 · Israel CBS API — Statistical Table Data

| Field | Detail |
|---|---|
| **SOURCE** | Israel Central Bureau of Statistics |
| **NAME** | CBS Statistical Data API |
| **ENDPOINT** | `https://api.cbs.gov.il/download/subject/Population/{TABLE_ID}?format=json&download=false` (example pattern) — refer to [https://www.cbs.gov.il/en/Pages/Api-interface.aspx](https://www.cbs.gov.il/en/Pages/Api-interface.aspx) |
| **INPUT** | Subject area path + table ID from CBS catalog; `format` (json, csv, xlsx); geographic classification; time period |
| **OUTPUT** | JSON/CSV — CBS statistical tables: population, employment, housing construction, price indices, national accounts by district/locality [^66][^67] |
| **AUTH** | Mandatory `User-Agent` header; no API key required |
| **UPDATE** | Per CBS publication schedule (weekly/monthly/quarterly/annual) |
| **CORS** | Partial (User-Agent header requirement; use server-side) |
| **RATE LIMIT** | Not documented; reasonable use expected |
| **CRE USE** | Population by locality for Israeli market sizing; employment statistics by industry district; construction output and starts by region |

***

### IS-06 · Israel CBS — New Dwelling Starts & Completions

| Field | Detail |
|---|---|
| **SOURCE** | Israel Central Bureau of Statistics |
| **NAME** | CBS Housing Construction Statistics (via API or data.gov.il) |
| **ENDPOINT** | Via data.gov.il: `https://data.gov.il/api/3/action/package_search?q=housing+construction+starts&fq=organization:cbs` OR CBS direct API path for table on housing construction |
| **INPUT** | Year/quarter; district (Naphah/mehoz); city code; dwelling type (new/additional/renovation) |
| **OUTPUT** | JSON/CSV — new dwelling starts, completions, and units under construction by district/city/quarter [^68][^67] |
| **AUTH** | User-Agent header for CBS; none for data.gov.il |
| **UPDATE** | Quarterly |
| **CORS** | Partial |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli residential supply pipeline; development market timing; presale absorption rate analysis by city |

***

### IS-07 · Israel Ministry of Finance — Real Estate Transaction Prices

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Ministry of Finance / Tax Authority (via data.gov.il) |
| **NAME** | Real Estate Transaction Database (Madlan/MFIN data) |
| **ENDPOINT** | `https://data.gov.il/api/3/action/datastore_search?resource_id={REAL_ESTATE_TRANSACTIONS_RESOURCE_ID}&filters={"city_code":"5000","deal_type":"1"}&limit=200` |
| **INPUT** | `resource_id` from Ministry of Finance dataset; filter by `city_code`, `deal_type` (sale vs. rental), `year`, `street_code` |
| **OUTPUT** | JSON — transaction date, city, street, floor, size (sqm), price (NIS), price per sqm, property type, new/resale flag |
| **AUTH** | None required |
| **UPDATE** | Quarterly (Real estate transaction reports) |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli property transaction comps; price-per-sqm trending by city/neighborhood; foreign investor market entry benchmarking |

***

### IS-08 · Israel Building Permits — PIBA Data via data.gov.il

| Field | Detail |
|---|---|
| **SOURCE** | Planning and Building Administration, Israeli Ministry of Interior (PIBA) via data.gov.il |
| **NAME** | Israeli Building Permits Dataset |
| **ENDPOINT** | `https://data.gov.il/api/3/action/datastore_search?resource_id={BUILDING_PERMITS_RESOURCE_ID}&filters={"municipality_code":"5000","year":"2024"}&limit=100` |
| **INPUT** | `resource_id` (PIBA building permits); `filters` by municipality, year, permit type, building use |
| **OUTPUT** | JSON — permit number, municipality, year, permit type (new construction/expansion/renovation), dwelling units approved, commercial/residential area (sqm) |
| **AUTH** | None required |
| **UPDATE** | Annual/quarterly |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli construction pipeline by city; supply forecast for apartment investment; commercial development permit tracking |

***

### IS-09 · Israel Land Authority (ILA) — GIS Data via data.gov.il

| Field | Detail |
|---|---|
| **SOURCE** | Israel Land Authority (Rashut Mekarkei Yisrael) via data.gov.il |
| **NAME** | ILA Land Allocation & Tender Data |
| **ENDPOINT** | `https://data.gov.il/api/3/action/package_search?q=land+tender&fq=organization:ila` OR known resource ID query |
| **INPUT** | `q` for land tenders, marketing areas; filter by `region`, `intended_use` (residential, commercial, industrial) |
| **OUTPUT** | JSON — tender date, location (gush/helka block/parcel), intended use, minimum bid price (NIS), area (sqm), winning bid if closed |
| **AUTH** | None required |
| **UPDATE** | Per tender publication |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli land acquisition opportunities; government land tender tracking; new supply land cost benchmarking; development feasibility land cost component |

***

### IS-10 · Israel Census & Population Register — Population by City/Locality

| Field | Detail |
|---|---|
| **SOURCE** | Israel CBS |
| **NAME** | CBS Population by Locality API |
| **ENDPOINT** | `https://data.gov.il/api/3/action/datastore_search?resource_id={CBS_POPULATION_BY_LOCALITY_RESOURCE_ID}&filters={"symbol_local":"5000"}&limit=100` |
| **INPUT** | `resource_id`; filter by `symbol_local` (locality code), `year` |
| **OUTPUT** | JSON — locality name (Hebrew/Arabic/English), population, households, area (sqkm), population density, majority religion/ethnicity, socioeconomic cluster rank |
| **AUTH** | None required via data.gov.il |
| **UPDATE** | Annual (end of year estimate) |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Demand sizing for Israeli retail/multifamily markets; target city screening; socioeconomic cluster index for retail trade area potential |

***

### IS-11 · Survey of Israel (SOI) — National Cadastre API

| Field | Detail |
|---|---|
| **SOURCE** | Survey of Israel (Mishal Yisrael) |
| **NAME** | SOI GIS/Cadastral WMS/WFS Services |
| **ENDPOINT** | WMS: `https://maps.survey.gov.il/arcgis/services/Topography/Topography_basemap/MapServer/WMSServer?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=Roads&BBOX=35.1,31.7,35.3,31.9&CRS=EPSG:4326&FORMAT=image/png&WIDTH=1024&HEIGHT=1024` |
| **INPUT** | WMS/WFS standard parameters: `BBOX`, `CRS` (EPSG:4326 or Israel TM Grid ITM), `LAYERS`, `FORMAT` |
| **OUTPUT** | Map images (WMS) or GeoJSON/GML features (WFS) — topography, roads, buildings, boundaries, control points [^69][^70] |
| **AUTH** | None required for public WMS layers; some layers require SOI account |
| **UPDATE** | Annual orthophoto; periodic cadastral updates |
| **CORS** | Yes |
| **RATE LIMIT** | Not documented |
| **CRE USE** | Israeli property mapping base layer; gush/helka cadastral reference; aerial imagery for site analysis |

***

### IS-12 · Israeli Ministry of Housing — Rental Price Index

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Ministry of Construction and Housing via CBS |
| **NAME** | Israeli Rental Price Index by City |
| **ENDPOINT** | `https://data.gov.il/api/3/action/datastore_search?resource_id={RENTAL_INDEX_RESOURCE_ID}&filters={"city_code":"5000"}&sort=date+desc&limit=48` |
| **INPUT** | City code; sort by date descending |
| **OUTPUT** | JSON — monthly/quarterly rental price index, average rent (NIS) by apartment size (rooms), YoY change % |
| **AUTH** | None required |
| **UPDATE** | Monthly/quarterly |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli apartment rental market comps; NOI underwriting for Israeli residential portfolios; rent trend analysis for PBSA and BTR investment |

***

### IS-13 · Bank of Israel API — Macroeconomic Data

| Field | Detail |
|---|---|
| **SOURCE** | Bank of Israel |
| **NAME** | Bank of Israel Open Data API |
| **ENDPOINT** | `https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/{SERIES_ID}/1.0/all?startperiod=2020-01&endperiod=2025-01&format=csv` |
| **INPUT** | `SERIES_ID` (e.g., `IR01_Q1` = prime interest rate, `EXR_USD_ILS` = USD/ILS exchange rate, `HP01` = housing price index); date range; `format` (csv, json) |
| **OUTPUT** | CSV/JSON — Israeli macroeconomic time series: interest rates, exchange rates, housing price index, CPI, GDP growth |
| **AUTH** | None required |
| **UPDATE** | Per Bank of Israel publication schedule |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli cap rate modeling (interest rate component); foreign currency hedging cost for USD-denominated investments; macroeconomic cycle timing for Israeli CRE |

***

### IS-14 · Bank of Israel — Housing Price Index (CBS Methodology)

| Field | Detail |
|---|---|
| **SOURCE** | Bank of Israel / Israel CBS |
| **NAME** | Israeli Housing Price Index Series |
| **ENDPOINT** | `https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/HP01_Q1/1.0/all?startperiod=2015-Q1&endperiod=2025-Q2&format=json` |
| **INPUT** | Series ID `HP01_Q1`; period range |
| **OUTPUT** | JSON — quarterly housing price index for new and existing apartments, national level and by district |
| **AUTH** | None required |
| **UPDATE** | Monthly/quarterly CBS publication |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli residential price trend analysis; real (inflation-adjusted) vs. nominal appreciation; cap rate compression correlation |

***

### IS-15 · Israeli Planning Administration — TABA National Outline Plans

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Planning Administration (Rashut HaTichnun) via data.gov.il |
| **NAME** | National Outline Plan (Taba Artzit) Data |
| **ENDPOINT** | `https://data.gov.il/api/3/action/package_search?q=taba+artzit&fq=organization:planning` (catalog search) |
| **INPUT** | Plan number; geography (district, city); plan type (residential, commercial, tourism, transportation) |
| **OUTPUT** | JSON — plan boundaries (GeoJSON), approved uses, maximum densities, special conditions, approval status |
| **AUTH** | None required |
| **UPDATE** | Per plan approval (statutory process) |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Strategic site evaluation against national planning framework; Israeli development entitlement process due diligence; TMA (transportation master plan) impact on site access |

***

### IS-16 · Israeli Ministry of Interior — Municipalities & Local Council Data

| Field | Detail |
|---|---|
| **SOURCE** | Israeli Ministry of Interior via CBS / data.gov.il |
| **NAME** | Israeli Local Authority Classification & Socioeconomic Index |
| **ENDPOINT** | `https://data.gov.il/api/3/action/datastore_search?resource_id={LOCAL_AUTHORITY_CLUSTER_RESOURCE_ID}&filters={"cluster":"1,2,3"}&limit=200` |
| **INPUT** | `cluster` (socioeconomic 1–10); `district`; `region`; `authority_type` (city, local council, regional council) |
| **OUTPUT** | JSON — authority name, code, district, socioeconomic cluster (1=lowest, 10=highest), population, area type, peripherality index |
| **AUTH** | None required |
| **UPDATE** | Every ~5 years (per CBS socioeconomic classification cycle) |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli retail trade area socioeconomic scoring; affordable vs. luxury development market segmentation; public housing vs. private market balance |

***

### IS-17 · Israeli Real Estate Appraisal Board — Published Assessments

| Field | Detail |
|---|---|
| **SOURCE** | Registrar of Real Estate Appraisers / Ministry of Justice (via Gov.il) |
| **NAME** | Gov.il Tabu Land Registry Extract Service |
| **ENDPOINT** | `https://www.gov.il/en/service/land_registration_extract` (manual portal); programmatic access via `https://eservices.gov.il/api/...` (authenticated session required) |
| **INPUT** | Gush (block) number; Helka (parcel) number; optional Tat-Helka (sub-parcel/unit) |
| **OUTPUT** | Digitally signed PDF extract — ownership rights, registered mortgages/liens, easements, annotations, historical ownership chain [^71][^72] |
| **AUTH** | Gov.il account + payment (~₪30/extract) |
| **UPDATE** | Reflects current registration state at time of request |
| **CORS** | N/A (web portal) |
| **RATE LIMIT** | Per-transaction paid service |
| **CRE USE** | Title verification for Israeli property acquisition; lien/mortgage encumbrance discovery; ownership chain due diligence for NPL portfolios |

***

### IS-18 · World Bank Open Data API — Israel Macro Indicators

| Field | Detail |
|---|---|
| **SOURCE** | World Bank |
| **NAME** | World Bank Data API v2 — Israel Series |
| **ENDPOINT** | `https://api.worldbank.org/v2/country/IL/indicator/NY.GDP.MKTP.KD.ZG?format=json&date=2015:2025` |
| **INPUT** | Country code (`IL`); indicator code (`NY.GDP.MKTP.KD.ZG`=GDP growth, `FP.CPI.TOTL.ZG`=CPI inflation, `SL.UEM.TOTL.ZS`=unemployment, `FS.AST.DOMS.GD.ZS`=domestic credit to private sector); `date` range |
| **OUTPUT** | JSON — annual values with ISO country code, indicator name, year, value [^73] |
| **AUTH** | None required |
| **UPDATE** | Annual (World Bank data revision cycle) |
| **CORS** | Yes |
| **RATE LIMIT** | None documented |
| **CRE USE** | Israeli economic context for foreign CRE investment decisions; sovereign risk indicators; GDP/employment growth trajectory for demand forecasting |

***

## Quick Reference Table — Auth & Rate Limits by Category

| # | Endpoint Name | Auth Type | Rate Limit | Free |
|---|---|---|---|---|
| E-01 | BLS LAUS | Optional key | 500 series/day (v2) | Yes |
| E-02 | BLS QCEW | None | Unlimited | Yes |
| E-03 | Census QWI | Free key | 500 queries/day | Yes |
| E-04/05 | FRED API | Free 32-char key | 120 req/min | Yes |
| E-06/07 | Census ACS | Free key | 500/day | Yes |
| E-08/09 | BLS CPI/PPI | Optional key | 500 series/day (v2) | Yes |
| E-12 | BEA Regional | Free key | 100 req/min | Yes |
| EH-01/02/03 | OpenFEMA | None | Paginate | Yes |
| EH-04 | FEMA NFHL | None | ArcGIS standard | Yes |
| EH-05 | USGS Earthquake | None | ~20K events/query | Yes |
| EH-06/07 | EPA AQS | Free email key | Not documented | Yes |
| EH-08–11 | EPA Envirofacts | None | Paginate rows | Yes |
| EH-12 | USGS NWIS | None | None | Yes |
| EH-13 | NOAA CDO | Free token | 1,000/day | Yes |
| EH-14 | NREL PVWatts | Free NLR key | 10,000/day | Yes |
| IA-01/02 | Google Places | GCP key | Per-QPS (paid) | Pay/use |
| IA-03 | USPS Address | OAuth 2.0 | Not documented | Free dev |
| IA-05/06 | NREL Alt Fuel / Utility | Free NLR key | 10,000/day | Yes |
| IA-10 | FCC Broadband | None | None | Yes |
| HR-01/02 | HUD FMR/IL | Free bearer token | Not documented | Yes |
| HR-03/12/13 | Census/FRED Housing | Free key | 500/day; 120/min | Yes |
| HR-04–06 | ATTOM Data | Paid subscription | Plan-based | No |
| HR-07/08 | Regrid Parcel | Paid token | 200 req/min | No |
| HR-09/10 | LightBox Zoning/NFHL | Paid subscription | Plan-based | No |
| HR-14 | RentCast | Paid subscription | Plan-based | No |
| EU-01–05 | EIA API v2 | Free key | 5,000/day | Yes |
| EU-06 | EPA GHGRP | None | Row-paginate | Yes |
| EU-07 | NREL NSRDB | Free NLR key | 10,000/day | Yes |
| ZL-01 | LightBox Zoning | Paid subscription | Plan-based | No |
| ZL-02 | Regrid Land Use | Paid token | 200 req/min | No |
| ZL-04 | National Zoning Atlas | None | None | Yes |
| ZL-05 | Municipal ArcGIS REST | None | Server-dependent | Yes |
| ZL-06 | HUD OZ Mapping | None | ArcGIS standard | Yes |
| ZL-08 | EPA Smart Location | None | ArcGIS standard | Yes |
| IS-01–04 | data.gov.il CKAN | None | None | Yes |
| IS-05/06 | Israel CBS API | User-Agent req'd | Not documented | Yes |
| IS-07–10 | data.gov.il datasets | None | None | Yes |
| IS-11 | Survey of Israel SOI | None (public layers) | Not documented | Yes |
| IS-13/14 | Bank of Israel API | None | None | Yes |
| IS-17 | Gov.il Tabu Registry | Account + payment | Per transaction | No (₪30/extract) |
| IS-18 | World Bank API | None | None | Yes |

***

## CORS & Integration Notes

**Browser-safe (no proxy required):** Census API, data.gov.il CKAN, FEMA OpenFEMA, USGS Earthquake, EIA v2, EPA Envirofacts, FRED, Walk Score (JSON-P), Regrid, LightBox, OpenStreetMap Overpass, TIGERweb ArcGIS REST, World Bank, Bank of Israel.

**Server-side only (CORS blocked or POST required):** BLS API v2 (POST with body), EPA AQS API (non-CORS headers), USPS Address API (OAuth 2.0 flow), Israel CBS API (User-Agent header requirement).

**Geospatial format note:** All ArcGIS REST endpoints support `f=geojson` output parameter for direct GIS consumption. All Census TIGER endpoints return GeoJSON natively with `f=geojson`.

***

## Key Registration URLs Summary

| API | Registration |
|---|---|
| Census API key | https://api.census.gov/data/key_signup.html |
| BLS API key (v2) | https://data.bls.gov/registrationEngine/ |
| FRED API key | https://fredaccount.stlouisfed.org/apikeys |
| BEA API key | https://apps.bea.gov/api/signup/ |
| HUD API token | https://www.huduser.gov/portal/dataset/fmr-api.html |
| FEMA/OpenFEMA | No key required |
| EPA AQS key | https://aqs.epa.gov/data/api/signup?email=YOUR_EMAIL |
| NOAA CDO token | https://www.ncdc.noaa.gov/cdo-web/token |
| EIA API key | https://www.eia.gov/opendata/register.php |
| NREL/NLR key | https://developer.nlr.gov/signup/ |
| Google Maps Platform | https://cloud.google.com/maps-platform/ |
| USPS Developer Portal | https://developers.usps.com/ |
| Walk Score | https://www.walkscore.com/professional/api.php |
| ATTOM Data | https://api.developer.attomdata.com/home |
| Regrid | https://app.regrid.com/ |
| LightBox | https://developer.lightboxre.com |
| RentCast | https://www.rentcast.io/api |

---

## References

1. [Data API : U.S. Bureau of Labor Statistics](https://www.bls.gov/bls/api_features.htm) - The BLS Public Data API does not require registration and is open for public use. Sample code is pro...

2. [BLS API Guide - BD Economics](https://bd-econ.com/blsapi.html) - The BLS Public Data API allows machine access to an enormous and incredibly useful set of U.S. econo...

3. [tidyqwi: A Tidy Approach to Accessing The US Census Bureau's Quarterly Workforce Indicators](https://joss.theoj.org/papers/10.21105/joss.01462.pdf) - The purpose of tidyqwi is to access the U.S. Census Bureau Quarterly Workforce Indicators(QWI) API a...

4. [Quarterly Workforce Indicators (QWI) (Time Series: 1990 - present)](https://www.census.gov/data/developers/data-sets/qwi.html) - The Quarterly Workforce Indicators (QWI) dataset is now available via the API. The QWI are a set of ...

5. [Leveraging R for powerful data analysis - FRED Blog](https://fredblog.stlouisfed.org/2024/12/leveraging-r-for-powerful-data-analysis/) - The fredo R package streamlines the interaction with the FRED API, provides an accessible interface,...

6. [St. Louis Fed Web Services: FRED® API](https://fred.stlouisfed.org/docs/api/fred/) - The FRED® API, Version 2 is ideal for anyone who is interested to retrieve observations for all seri...

7. [American Community Survey 5-Year Data (2009-2024)](https://www.census.gov/data/developers/data-sets/acs-5year.html) - Subject Tables are available down to the census tract level. Data Profiles contain broad social, eco...

8. [[PDF] Census Bureau's Application Programming Interface (API)](https://tnsdc.utk.edu/wp-content/uploads/sites/94/2022/11/TNSDC_Census-API-11-15-2022.pdf) - The American Community Survey is on the leading edge of survey design, continuous improvement, and d...

9. [Census Data API: /data/2025/cps/basic/jul - Developers](https://api.census.gov/data/2025/cps/basic/jul.html) - In addition to the labor force data, the CPS basic funding provides annual data on work experience, ...

10. [Census Data API: /data/2025/cps/asec/mar - Developers](https://api.census.gov/data/2025/cps/asec/mar.html) - The labor force and work experience data from this survey are used to profile the U.S. labor market ...

11. [2024 - Census Bureau](https://www.census.gov/programs-surveys/acs/news/updates/2024.html) - From 2025 to 2028, the ACS Methods Panel may test ACS and decennial census methods for reducing surv...

12. [REST Services - TIGERweb - CENSUS](https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_restmapservice.html) - The GeoServices REST Specification provides a way for Web clients to communicate with geographic inf...

13. [HUD-USPS ZIP Crosswalk Files](https://www.datalumos.org/datalumos/project/219325/view) - These unique files are derived from data in the quarterly USPS Vacancy Data. They originate directly...

14. [HUD USPS ZIP Code Crosswalk Files - Community Commons](https://www.communitycommons.org/entities/0a78f790-0fa1-4dc2-a85e-285f399bc522) - It provides a crosswalk between USPS ZIP Codes and various geographic boundaries, including Census t...

15. [Comprehensive Housing Affordability Strategy (CHAS) Data and ...](https://www.huduser.gov/portal/datasets/cp.html) - With this API, developers can easily access and customize CHAS data for use in existing applications...

16. [HUD Releases Updated CHAS Data](https://nlihc.org/resource/hud-releases-updated-chas-data-0) - HUD released its latest Comprehensive Housing Affordability Strategy (CHAS) data on September 9. Sta...

17. [CONSOLIDATED PLANNING/CHAS Dataset API Documentation](https://www.huduser.gov/portal/dataset/chas-api.html) - Use the API Tester to make API calls to CHAS Dataset. The API Tester requires an access token. If yo...

18. [Walk Score API for web and mobile developers](https://www.walkscore.com/professional/api.php) - Programmers can use the API to: Integrate Walk Score into your site; Add Walk Score to your property...

19. [Walk Score APIs Overview](https://www.walkscore.com/professional/walk-score-apis.php) - Use the Walk Score API, Public Transit API, and Travel Time API to show a Walk Score on your site, s...

20. [Public Transit API from Walk Score](https://www.walkscore.com/professional/public-transit-api.php) - The Public Transit API returns the Transit Score for a location and provides easy access to nearby p...

21. [Overpass API - OpenStreetMap Wiki](https://wiki.openstreetmap.org/wiki/Overpass_API) - Overpass API: Language reference, Language guide, Technical terms, Areas, Query examples, Sparse Edi...

22. [Access the openFEMA API • rfema - Docs](https://docs.ropensci.org/rfema/) - Introduction. rfema allows users to access The Federal Emergency Management Agency's (FEMA) publicly...

23. [FEMA (Independent Publisher) - Connectors - Microsoft Learn](https://learn.microsoft.com/en-us/connectors/fema/) - The National Flood Insurance Program (NFIP) enables property owners to purchase flood insurance ... ...

24. [LightBox FEMA National Flood Hazard API Overview](https://lightbox.document360.io/docs/fema-national-flood-hazard-layer-overview) - The LightBox National Flood Hazard Layer (NFHL) API is a geospatial set of endpoints that contain cu...

25. [API Documentation - Earthquake Catalog](https://earthquake.usgs.gov/fdsnws/event/1/) - This is an implementation of the FDSN Event Web Service Specification, and allows custom searches fo...

26. [Air Quality System (AQS) API - U.S. EPA Web Server](https://aqs.epa.gov/aqsweb/documents/data_api.html) - Welcome to the AQS API (version 2). This API is the primary place to obtain row-level data from the ...

27. [EPA Air Quality System (AQS) Scraper - Apify](https://apify.com/parseforge/epa-aqs-air-quality-scraper) - The EPA AQS Scraper connects directly to the U.S. Environmental Protection Agency's Air Quality Syst...

28. [Envirofacts Data Service API | US EPA](https://www.epa.gov/enviro/envirofacts-data-service-api) - The Envirofacts REST Service is simple and easy to use to access multiple data sources within EPA. T...

29. [Toxics Release Inventory (TRI) - EnviroFacts REST API - Catalog](https://catalog.data.gov/dataset/toxics-release-inventory-tri/resource/c59e54bc-e770-477b-a88c-8ff8a1190f0c) - The Toxics Release Inventory (TRI) is a dataset compiled by the U.S. Environmental Protection Agency...

30. [Envirofacts Data Service API - US EPA](https://19january2021snapshot.epa.gov/enviro/envirofacts-data-service-api_.html) - Envirofacts makes it easy to find information using an address, ZIP Code, city, county, water body, ...

31. [SDWIS Overview | US EPA](https://www.epa.gov/enviro/sdwis-overview) - Searching SDWIS will allow you to locate your drinking water supplier and view its violations and en...

32. [National Renewable Energy Laboratory Capability - APIs.io](https://capabilities.apis.io/capabilities/national-renewable-energy-laboratory/national-renewable-energy-laboratory-capability/) - Selected endpoints from the National Renewable Energy Laboratory (NREL) developer network covering a...

33. [API Key Usage | NLR: Developer Network](https://developer.nlr.gov/docs/api-key/) - API Key Usage. After signing up, you'll be given your own, unique API key. This 40 character string ...

34. [Understanding the Google Maps Platform New Places API - Dito](https://www.ditoweb.com/2024/09/understanding-the-google-maps-platform-new-places-api/) - The Google Maps Platform Places API is a powerful tool that revolutionizes how businesses and develo...

35. [Next_page_token for new google maps places API - Stack Overflow](https://stackoverflow.com/questions/77898813/next-page-token-for-new-google-maps-places-api-nearbysearch-pagination) - I would like to use the New Places Nearby Search to find restaurants of a certain type. The max outp...

36. [Text Search (New) | Places API - Google for Developers](https://developers.google.com/maps/documentation/places/web-service/text-search) - Text Search (New) returns information about a set of places based on a string (for example, "pizza i...

37. [API Catalog | devportal - USPS Developer Portal](https://developers.usps.com/apis) - This API validates addresses, confirms product availability, calculates postage, and generates the r...

38. [Addresses 3.0 | devportal - USPS Developer Portal](https://developers.usps.com/addressesv3) - The Address Standardization API validates and standardizes USPS® domestic addresses, city and state ...

39. [Query the NREL Alternative Fuel API - R](https://search.r-project.org/CRAN/refmans/altfuelr/html/altfuel_api.html) - API keys can be requested at https://developer.nrel.gov/signup/. endpoint. Character. Path to the sp...

40. [GIS Developer Tools - HRSA Data Warehouse](https://data.hrsa.gov/tools/gis-developer-tools) - GIS Developer Tools. GIS developer tools provide a web-based method for end users to access geograph...

41. [HUD User Python API Docs | dltHub](https://dlthub.com/context/source/hud-user) - The HUD FMR API provides access to Fair Market Rent data for various areas, updated for 2025, with F...

42. [HUD Fair Market Rent API | FMR Data Access & Documentation](https://www.huduser.gov/portal/dataset/fmr-api.html) - The base URL for all FMR API endpoints is https://www.huduser.gov/hudapi/public/fmr. The table below...

43. [Income Limits Data for HUD Housing Assistance Programs](https://www.huduser.gov/portal/datasets/il.html) - HUD first announced this methodology on January 10, 2024 in a Federal Register Notice. For 2025, the...

44. [Area Median Income API Calculations - LegalServer Help](https://help.legalserver.org/article/1768-area-median-income-api-calculations) - Note: HUD APIs do not recognize 2026 as of 2026-05-01, so you may want to switch the month to June t...

45. [Property Data API - Trusted Real Estate API - Attom Data](https://www.attomdata.com/solutions/delivery/property-data-api/) - ATTOM's property data API gives instant access to the most comprehensive real estate data that can b...

46. [ATTOM API Documentation & Examples](https://api.developer.attomdata.com/home) - Explore ATTOM API Documentation for easy access to property data, real estate insights, and market t...

47. [Estated is now part of ATTOM Data](https://estated.com) - ATTOM's Property Data API gives you instant access to one of the nation's most comprehensive real es...

48. [General Introduction - Regrid Support](https://support.regrid.com/api/using-the-parcel-api) - The Regrid API offers a flexible and dynamic set of features for querying Regrid Parcels by numerous...

49. [Parcel API Overview - Regrid Support](https://support.regrid.com/api/section/parcel-api) - The Regrid API offers a flexible and dynamic set of features for querying Regrid Nationwide Parcel D...

50. [Input and Output Formats - Regrid Support](https://support.regrid.com/api/parcel-api-v2-io-formats) - If your account has Matched Building Footprints enabled, then by default any Parcel API endpoints th...

51. [Zoning Data - LightBox API & Data Knowledge Center](https://lightbox.document360.io/docs/zoning-data-2) - Zoning Boundary layer contains the zoning areas represented as polygons and contains the zoning code...

52. [Zoning Data | LightBox](https://www.lightboxre.com/data/zoning-data/) - LightBox Zoning Data offers detailed and comprehensive zoning information, essential for real estate...

53. [Zoning - LightBox Developer Portal](https://developer.lightboxre.com/apis/zoning) - The LightBox Zoning API delivers authoritative parcel-level zoning data that supports critical workf...

54. [Location Affordability Index v.3 - Catalog - Data.gov](http://catalog.data.gov/dataset/location-affordability-index-v-3) - The Location Affordability Index (LAI) helps to better understand the combined cost of housing and t...

55. [Location Affordability Index - HUD Exchange](https://www.hudexchange.info/programs/location-affordability-index/) - This site provides access to that data as well as comprehensive documentation of how the Location Af...

56. [What's the best real estate data API in 2025? : r/RealEstateTechnology](https://www.reddit.com/r/RealEstateTechnology/comments/1ouqdg8/whats_the_best_real_estate_data_api_in_2025/) - Homesage AI and Attom Data have solid foundations, but I'm wondering if anyone's found newer APIs th...

57. [EIAapi - README](https://cran.r-project.org/web/packages/EIAapi/readme/README.html) - The EIAapi package provides functions to query and pull tidy data from EIA API v2. Introduction to t...

58. [Introduction to the EIA API • EIAapi - Rami Krispin](https://ramikrispin.github.io/EIAapi/articles/intro.html) - The EIAapi package provides functions to query and pull tidy data from the EIA API v2. Prerequisites...

59. [Energy API - ProximityOne](https://proximityone.com/fss/energy_api.htm) - EIA Open Data API: This is the primary API for accessing a vast amount of energy data. · Electricity...

60. [Greenhouse Gas RESTful Data Service | US EPA](https://www.epa.gov/enviro/greenhouse-gas-restful-data-service) - This page is intended for technical users who want to work directly with Greenhouse Gas (GHG) data u...

61. [Historical and projected datasets of the United States electricity-water-climate nexus](https://pmc.ncbi.nlm.nih.gov/articles/PMC8477143/) - ...Visualizing the United States electricity-water-climate nexus” published in *Environmental Modeli...

62. [National Zoning Atlas](https://www.zoningatlas.org) - The National Zoning Atlas makes zoning data actionable and accessible, giving advocates, policymaker...

63. [Data.gov.il - Awesome MCP Servers](https://mcpservers.org/servers/DavidOsherProceed/data-gov-il-mcp) - This server connects to data.gov.il - Israel's national open data portal with datasets from: ... Use...

64. [Data Gov CKAN API Documentation 1.0.0 OAS 3.0](https://data.gov.il/docs) - CKAN's Action API is a powerful, RPC-style API that exposes all of CKAN's core features. All endpoin...

65. [israel-gov-api | Skills Marketplace · LobeHub](https://lobehub.com/it/skills/skills-il-government-services-israel-gov-api) - This Skill streamlines discovery, retrieval, and analysis of Israeli government open data via the da...

66. [CBS Site - API interface](https://www.cbs.gov.il/en/Pages/Api-interface.aspx?fireglass_rsn=true) - An application that the public uses to retrieve data from the CBS databases automatically, convenien...

67. [CBS: Building Israel's National Data Lake - Matrix](https://www.matrix-globalservices.com/insight/cbs-building-israels-national-data-lake/) - Modernize access to statistical data while maintaining strict security and privacy standards; Enable...

68. [CBS Site](https://www.cbs.gov.il/en/Pages/default.aspx) - Israel's Foreign Trade in Goods, by Country - April 2026. 20/05/2026. “Land ... Labour Force Survey ...

69. [Geospatial Initiatives in Israel](https://geospatialworld.net/article/geospatial-initiatives-in-israel/) - The National GIS of the SOI consists of a topographic data base including ten topographic layers: or...

70. [[PDF] The Future of the Survey of Israel – On Line Services](https://www.fig.net/resources/proceedings/fig_proceedings/fig2008/papers/ts01a/ts01a_05_srebro_2786.pdf) - - A direct access to the National Archive of Maps and Aerial Photographs. - A direct access to the c...

71. [Real Estate Registration in Israel: The "Tabu" Explained - RNC](https://www.rnc.co.il/tabu-israel-registration/) - The Tabu Land Registry is a Torrens system, which provides a state-guaranteed title. Once registered...

72. [Produce a land registry extract (Tabu) - Gov.il](https://www.gov.il/en/service/land_registration_extract) - Use this service to produce a land registry extract (Tabu). On payment you will receive a the digita...

73. [World Bank Open Data | Data](https://data.worldbank.org) - The World Bank open data site is expanding to Data360, a newly curated collection of data, analytics...

