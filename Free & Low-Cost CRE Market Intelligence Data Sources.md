# Free & Low-Cost CRE Market Intelligence Data Sources
### A Complete Reference for Building a US Commercial Real Estate Dashboard Without CoStar

***

## Overview

This guide catalogs every meaningful free or near-free data source for building a commercial real estate market intelligence dashboard covering vacancy rates, rent trends, cap rates, distress signals, construction pipeline, and demographic demand drivers. For each source the exact endpoint, geographic granularity, property type coverage, update frequency, format, cost, and visualization use case are documented. Where a source is residential-only or has significant limitations, those are called out explicitly so you don't waste integration time.

**Critical framing:** No single free source replicates CoStar's integrated vacancy+rent+absorption universe for all property types. The strategy is to **triangulate** — combine government administrative data (employment, permits, building patterns) with broker PDF extraction, FRED financial series, and CMBS surveillance to build a composite CRE intelligence layer that is defensible for a dashboard without paying six figures annually.

***

## Section A — Vacancy Rates

### A1. Census Housing Vacancy Survey (HVS)

| Field | Detail |
|-------|--------|
| **NAME** | Census Housing Vacancy Survey (HVS) |
| **ENDPOINT** | Press releases: `https://www.census.gov/housing/hvs/current/index.html` · API: `https://api.census.gov/data/{year}/hvs` |
| **GRANULARITY** | National only (4 Census regions for homeowner rate) |
| **PROPERTY TYPES** | **Residential ONLY** — rental vacancy and homeowner vacancy rates |
| **UPDATE** | Quarterly |
| **FORMAT** | JSON API, press release HTML, Excel tables |
| **FREE** | Yes, free API key (500 queries/day without key) |
| **VISUAL USE** | ❌ Not directly useful for CRE. However, the rental vacancy rate (Q1 2026: 7.3%) is a lagging proxy for multifamily market tightness[^1]. Display as a time-series line alongside your multifamily dashboard as a macro context indicator. |

**Verdict:** The HVS covers only residential vacancy. It does NOT measure commercial vacancy for office, retail, or industrial. Do not use as a CRE vacancy proxy without clearly labeling it as residential.[^1]

***

### A2. HUD USPS Vacancy Data

| Field | Detail |
|-------|--------|
| **NAME** | HUD Aggregated USPS Administrative Data on Address Vacancies |
| **ENDPOINT** | `https://www.huduser.gov/portal/datasets/usps.html` |
| **GRANULARITY** | Census tract level (also rolls up to ZIP, county, MSA, state) |
| **PROPERTY TYPES** | **Both residential AND commercial/business addresses** — separate fields for each |
| **UPDATE** | Quarterly (USPS delivers to HUD quarterly) |
| **FORMAT** | CSV download (login required) |
| **FREE** | Free but **restricted** — available only to governmental entities and non-profit organizations[^2]. For-profit commercial use requires alternative access routes. |
| **VISUAL USE** | Business address vacancy rate by census tract → county-level choropleth heatmap showing commercial vacancy pressure. GEOID field maps directly to Census tract shapefiles[^3]. |

**Verdict:** This is real and does distinguish commercial from residential via separate data fields. The USPS field "Total vacant business addresses" gives a legitimate commercial vacancy proxy at the tract level. The access restriction to govt/nonprofit is the key limitation for a private-sector dashboard. If your firm qualifies or you partner with a nonprofit, this is extremely valuable.[^4][^5]

***

### A3. Census County Business Patterns (CBP)

| Field | Detail |
|-------|--------|
| **NAME** | Census County Business Patterns (CBP) |
| **ENDPOINT** | `https://api.census.gov/data/2023/cbp?get=ESTAB,EMP,PAYANN&for=county:*&NAICS2017=XX&key=YOUR_KEY` |
| **GRANULARITY** | National, state, county, MSA, ZIP code, congressional district[^6] |
| **PROPERTY TYPES** | Proxies for office/retail/industrial demand — no direct CRE vacancy |
| **UPDATE** | Annual (reference year lags ~18 months) |
| **FORMAT** | JSON API |
| **FREE** | Yes — free API key at `api.census.gov` |
| **VISUAL USE** | Track establishment counts and employment by NAICS to proxy occupied commercial space. Declining establishment counts = rising effective vacancy. |

**Key NAICS Codes for CRE Proxies:**

| NAICS | Sector | CRE Relevance |
|-------|--------|---------------|
| 531 | Real Estate | Direct — RE firm activity |
| 236 | Construction of Buildings | Supply pipeline proxy |
| 52 | Finance & Insurance | Office demand proxy |
| 54 | Professional/Scientific/Technical | Office demand proxy |
| 44-45 | Retail Trade | Retail space demand |
| 62 | Health Care | Medical office demand |
| 72 | Accommodation & Food Services | Retail/hospitality |
| 493 | Warehousing & Storage | Industrial demand |

**Example API call** — establishments in all counties for Professional Services (NAICS 54):
```
api.census.gov/data/2023/cbp?get=NAME,ESTAB,EMP&for=county:*&NAICS2017=54&key=YOUR_KEY
```

***

### A4. Free Broker Reports — Vacancy Data from CBRE, JLL, Cushman, Colliers, Newmark

**Bottom line: None of the major brokers publish structured/downloadable vacancy data. They publish narrative PDFs.**

- **CBRE Insights** (`cbre.com/insights`): Publishes quarterly market reports with vacancy, absorption, and rent data for the top 20+ MSAs by property type. Access is free via PDF download with email registration. No structured CSV or API.[^7][^8]
- **JLL Research**: Similar — free PDFs, no structured download.
- **Cushman & Wakefield Multifamily**: `multifamily.cushwake.com/Research` offers downloadable MarketBeat PDFs with actual vacancy rates by MSA. No API.[^9]
- **Lee & Associates**: Publishes North America quarterly market reports in PDF form with actual vacancy rates for office, industrial, retail, and multifamily. More accessible than major brokers.[^10]
- **NAR Commercial Dashboard**: `nar.realtor/research-and-statistics/research-reports/commercial-real-estate-metro-market-reports` — evaluates net absorption, vacancy rates, rents, and cap rates for major MSAs, but the underlying data source is CoStar. Free to view, not downloadable as structured data.[^11]

**Dashboard strategy:** Build a PDF extraction pipeline (PyMuPDF or pdfplumber) to parse quarterly broker PDFs and extract vacancy tables. These PDFs follow consistent formats and are published free. This is the most reliable free path to actual vacancy rates for top 20 MSAs.

***

### A5. NAR Commercial Vacancy Data

NAR's Commercial Real Estate Metro Market Dashboard (`nar.realtor`) displays vacancy rates, net absorption, rents, deliveries, inventory, and cap rates for the largest metros. The data originates from CoStar. It is viewable free online but is not available for bulk structured download. No API exists. Useful for spot-checking individual markets but not for powering an automated dashboard.[^11]

***

### A6. Federal Reserve Regional Banks — CRE Vacancy Data

No Federal Reserve regional bank (New York, Chicago, Dallas, etc.) publishes direct CRE vacancy rates by property type. What they do publish that is useful:
- **FRED series `DRCRELEXFACBS`**: Delinquency Rate on CRE Loans, all commercial banks — quarterly, free JSON API.[^12][^13]
- **SLOOS**: Lending standards for CRE — quarterly signal for credit tightening. Free via FRED (`SUBLPDRCSCLGNQ`).[^14]
- **Dallas Fed**: Publishes CRE-adjacent commentary in its Texas Economic Indicators, but no vacancy tables.
- **NY Fed**: Publishes commercial real estate research papers but no vacancy data series.

***

### A7. State-Level CRE Vacancy APIs

No US state — including California, New York, Texas, Florida, or Illinois — publishes official state-level CRE vacancy data via API or structured download. CRE vacancy data remains a private-sector product at all sub-national geographies. The closest public proxies are:
- USPS vacancy data (business addresses) via HUD — tract level, restricted access[^2]
- CBP establishment counts — annual, county-level[^6]
- LAUS unemployment by county — monthly[^15]

***

## Section B — Rent Trends and Absorption

### B8. Zillow Research Data (ZHVI and ZORI)

| Field | Detail |
|-------|--------|
| **NAME** | Zillow Research — ZHVI (Home Value Index) and ZORI (Observed Rent Index) |
| **ENDPOINT** | `https://www.zillow.com/research/data/` — click any metric to get direct CSV download URL |
| **GRANULARITY** | National, state, MSA/metro, county, ZIP code, neighborhood[^16] |
| **PROPERTY TYPES** | **Residential ONLY** — single-family homes and multifamily rentals. No commercial (office/retail/industrial) data[^17][^16]. |
| **UPDATE** | Monthly (data updated on the 16th of each month)[^17] |
| **FORMAT** | CSV direct download (no API key required)[^16] |
| **FREE** | Yes — explicitly free for public use, analysts, and media[^16] |
| **VISUAL USE** | ZORI = multifamily rent trend line chart by MSA or ZIP. ZHVI = residential home value heatmap. Both are excellent leading indicators for multifamily demand in a CRE dashboard. |

**Note on commercial rent:** Zillow publishes **zero commercial rent data** (office, retail, industrial). ZORI covers only market-rate residential rentals. For multifamily dashboard panels, ZORI at the ZIP or MSA level is highly useful and updated monthly.[^17]

***

### B9. ApartmentList Rent Data

| Field | Detail |
|-------|--------|
| **NAME** | ApartmentList National Rent Report |
| **ENDPOINT** | `https://www.apartmentlist.com/research/national-rent-data` (monthly articles) · `https://www.apartmentlist.com/research/category/data-rent-estimates` |
| **GRANULARITY** | National, state, MSA/metro, city, county[^18] |
| **PROPERTY TYPES** | Multifamily residential only |
| **UPDATE** | Monthly[^19] |
| **FORMAT** | Free articles with downloadable data tables; no public JSON API |
| **FREE** | Yes |
| **VISUAL USE** | Month-over-month rent change dashboard panel; trend comparison vs. national median. As of April 2026, national median rent was $1,370, down 1.7% year-over-year[^19]. |

***

### B10. Redfin Data Center

| Field | Detail |
|-------|--------|
| **NAME** | Redfin Data Center |
| **ENDPOINT** | `https://www.redfin.com/news/data-center/` |
| **GRANULARITY** | National, metro, state, county, city, ZIP code, neighborhood[^20] |
| **PROPERTY TYPES** | **Residential ONLY** — for-sale homes; no commercial data[^20] |
| **UPDATE** | Weekly (some metrics) and monthly |
| **FORMAT** | CSV download (click Download tab on any chart)[^20] |
| **FREE** | Yes |
| **VISUAL USE** | Days on market, median sale price, inventory — useful as residential demand proxies for multifamily submarket analysis. Not a CRE vacancy or rent source. |

***

### B11. NAHB Housing Market Index (HMI)

| Field | Detail |
|-------|--------|
| **NAME** | NAHB/Wells Fargo Housing Market Index |
| **ENDPOINT** | `https://www.nahb.org/news-and-economics/housing-economics/indices/housing-market-index` |
| **GRANULARITY** | National; some regional breakdowns |
| **PROPERTY TYPES** | **Single-family residential ONLY** — no commercial component[^21] |
| **UPDATE** | Monthly |
| **FORMAT** | Press release HTML; historical data on FRED (`HOUST`) |
| **FREE** | Yes |
| **VISUAL USE** | Single-family builder confidence gauge. Weakly correlated with retail and mixed-use CRE demand. Not a direct CRE metric. |

***

### B12. NMHC Quarterly Survey of Apartment Market Conditions

| Field | Detail |
|-------|--------|
| **NAME** | NMHC Quarterly Survey of Apartment Market Conditions |
| **ENDPOINT** | `https://www.nmhc.org/research-insight/quarterly-survey/` |
| **GRANULARITY** | National (index scores only) |
| **PROPERTY TYPES** | Multifamily only |
| **UPDATE** | Quarterly |
| **FORMAT** | **PDF and web page only** — index tables are readable but not downloadable as structured CSV[^22]. Historical data available as downloadable spreadsheets on the website[^23]. |
| **FREE** | Yes |
| **VISUAL USE** | Market Tightness Index, Sales Volume Index, Debt Financing Index, Equity Financing Index — display as a 4-panel gauge dashboard for multifamily market sentiment. As of January 2026, Market Tightness was 32 (below 50 = loosening)[^24]. |

***

### B13. BLS QCEW — Employment by MSA as CRE Demand Proxy

| Field | Detail |
|-------|--------|
| **NAME** | BLS Quarterly Census of Employment and Wages (QCEW) |
| **ENDPOINT** | Open data CSV: `https://data.bls.gov/cew/data/files/{year}/csv/{year}_qtrly_naics10_msa.zip` · Data viewer: `https://www.bls.gov/cew/additional-resources/open-data/` |
| **GRANULARITY** | National, state, county, MSA — all geographies published for every 6-digit NAICS[^25][^26] |
| **PROPERTY TYPES** | Not CRE directly — employment data as demand proxy |
| **UPDATE** | Quarterly (with ~5 month lag) |
| **FORMAT** | CSV bulk download files; also accessible via BLS API[^27][^28] |
| **FREE** | Yes — completely free, no key required for CSV; BLS API key is free[^28] |
| **VISUAL USE** | Employment growth in office-using industries (NAICS 52, 54, 55) by MSA = office demand signal. Warehouse/logistics employment (NAICS 493) = industrial demand. Retail trade (NAICS 44-45) = retail absorption proxy. |

**Key NAICS codes for CRE dashboard:**
- `531` = Real Estate — direct sector
- `236` = Construction of Buildings — pipeline proxy
- `52` = Finance & Insurance (office demand)
- `54` = Professional, Scientific, Technical Services (office demand)
- `493` = Warehousing & Storage (industrial demand)
- `44-45` = Retail Trade (retail demand)

**BLS QCEW API example** (county-level, NAICS 531, Q4 2024):
```
https://data.bls.gov/cew/data/api/2024/4/area/MSA/own/5/industry/531/ENHLQS.json
```

***

### B14. Census Building Permits Survey — New Construction as Future Supply

| Field | Detail |
|-------|--------|
| **NAME** | Census Building Permits Survey (BPS) |
| **ENDPOINT** | Current data: `https://www.census.gov/permits` · Annual files: `https://www.census.gov/construction/bps/` |
| **GRANULARITY** | National, state, CBSA (MSA), county, place (city)[^29][^30] |
| **PROPERTY TYPES** | **Primarily residential** — 1-unit, 2-unit, 3-4 unit, 5+ unit structures[^29]. Non-residential permits are collected but the BPS's primary published series focuses on residential housing units[^30]. |
| **UPDATE** | Monthly (released ~17th workday of following month)[^29] |
| **FORMAT** | Excel download (current data), comma-delimited text (historical CBSA/county/place)[^29] |
| **FREE** | Yes |
| **VISUAL USE** | 5+ unit residential permits = multifamily supply pipeline by MSA. For commercial permits, use Census Construction Spending (see B23) instead. |

**Important caveat:** The BPS counts only privately-owned **residential** units. Non-residential/commercial building permits are tracked by local jurisdictions and reported to the Census, but the BPS's published national series does not disaggregate into office/retail/warehouse permit counts. Commercial construction supply tracking requires either Census Construction Spending (C-30) or Dodge Construction Network (paid).

***

## Section C — Cap Rates and Transaction Data

### C15. Free Sources for Cap Rates

| Source | What's Free | Format | Limitation |
|--------|------------|--------|------------|
| **FRED BOGZ1FL075035503Q** | Commercial RE Price Index (Fed Z.1 flow of funds) — quarterly since 1945[^31] | JSON API at `fred.stlouisfed.org/series/BOGZ1FL075035503Q` | National aggregate only; no property type breakdown |
| **FRED COMREPUSQ159N** | Commercial Real Estate Prices for United States — quarterly[^32] | JSON API at `fred.stlouisfed.org/series/COMREPUSQ159N` | BIS-sourced national index; no MSA breakdown |
| **NCREIF Press Releases** | NPI quarterly press releases include national equal-weighted cap rates by property type (office/industrial/retail/apartment/hotel)[^33] | PDF at `ncreif.org` | No download; manual extraction from quarterly PDF. NPI Trends Report (spreadsheet) requires NCREIF membership. |
| **MIT REPD Platform** | Free Total Return Indexes, CPPI Forecasts, and Supply/Demand Indexes for 7 major metros (NYC, BOS, LA, SF, Chicago, DC, Seattle)[^34] | CSV/Excel download at `pricedynamicsplatform.mit.edu/analytics/` | 7 metros only; uses RCA data as input |
| **Green Street CPPI** | Monthly all-property price index moves published in press releases[^35] | Press release text only; no CSV | National headline only; property type breakdown requires paid access |
| **ACLI / Fed SLOOS** | Net % of banks tightening CRE lending standards (proxy for cap rate direction)[^14] | FRED JSON API (`SUBLPDRCSCLGNQ`) | Sentiment indicator, not actual cap rates |

**Academic cap rate datasets:** The Wharton Real Estate Center and MIT CRE have published research using NCREIF and RCA data, but the underlying cap rate datasets are not freely available for download. NCREIF's full query tool (with transaction and appraisal cap rates by metro, property type, and subtype) requires paid membership.[^36]

***

### C16. RCA CPPI — Any Free Version?

MSCI's RCA CPPI (Commercial Property Price Index) is the gold standard transaction-based price index. **No free version exists.** However:[^37][^38][^39]
- FRED series `COMREPUSQ159N` is based on BIS/OECD commercial property price data — quarterly national aggregate, free.[^32]
- FRED series `BOGZ1FL075035503Q` is the Federal Reserve's own commercial RE price index from the Z.1 Financial Accounts — quarterly, free.[^31]
- MIT REPD Platform forecasts 26 RCA CPPIs for major US metros and publishes the forecasts and Total Return Indexes free.[^34]

For an actual transaction-based price index at the MSA level, RCA/MSCI (paid), Green Street CPPI (paid), or NCREIF (membership) are the only options.

***

### C17. FHFA — Commercial Property Values?

The FHFA House Price Index (HPI) covers **single-family residential** and multifamily properties (only those with GSE-backed financing). **FHFA publishes nothing on commercial (office/retail/industrial) property values.** Its mandate is residential mortgage markets. The FHFA HPI is freely downloadable as CSV/Excel and useful for the residential component of a mixed-use CRE dashboard.[^40]

***

## Section D — Distress and Maturity Data

### D18. CMBS Delinquency by Property Type — Free Sources

| Source | What's Free | Detail |
|--------|------------|--------|
| **FRED `DRCRELEXFACBS`** | Delinquency rate on CRE loans (all banks), quarterly[^12][^13] | National aggregate only; no property type split. JSON API free. |
| **FRED `DRCRELEXFOBS`** | Same but for smaller banks (not top 100)[^41] | Same limitation |
| **Federal Reserve H.8** | Weekly aggregate CRE loan balances at all commercial banks[^42] | Via FRED, JSON API, national only |
| **MBA Quarterly Survey** | Delinquency rates by property type (CMBS, bank, life insurance, GSE) published quarterly in press releases[^43] | PDF/press release only — e.g., "5.2% of CMBS loan balances 30+ days delinquent" as of Q1 2025. Not downloadable as structured data. |
| **KBRA CMBS Surveillance** | Monthly delinquency rate for KBRA-rated CMBS; published in free monthly reports[^44] | PDF report only; as of March 2026: 7.7% 30+ day delinquency rate |
| **Trepp Blog** | Trepp publishes monthly CMBS delinquency by property type in blog posts[^45][^46] | Free narrative/blog — not structured data API. Office CMBS hit 12.34% in January 2026[^45]. |

**Best free option:** FRED `DRCRELEXFACBS` for programmatic access. Trepp blog posts for property-type breakdown (manual extraction or PDF parsing). FFIEC CDR Public Data Distribution (`cdr.ffiec.gov/public`) allows bulk download of bank call report data — from this you can compute CMBS-equivalent delinquency from bank-reported schedules.[^47][^48]

***

### D19. Commercial Mortgage Maturity Schedule — Free Structured Data

No free structured API exists for the CMBS/CRE maturity wall schedule. What is available:
- **MBA Annual Survey of Loan Maturity Volumes**: Published as press releases/blog posts with breakdowns by lender type and property type. As of 2025 data: $957B in commercial mortgages maturing in 2025 (20% of the $4.8T outstanding). PDF/press release only.[^49]
- **FFIEC CDR Bulk Download** (`cdr.ffiec.gov/public/PWS/DownloadBulkData.aspx`): Bank call reports in XBRL/Excel format — you can extract maturity schedules from Schedule RC-C (loans) for bank-held loans.[^47]
- **DBRS Morningstar Research**: Free registration gives access to their 2026 CRE outlook noting $100B+ in fixed/floating-rate CMBS loans due in 2026. Not structured data.[^50]

***

### D20. Bank CRE Concentration Data

#### BankRegData.com

| Field | Detail |
|-------|--------|
| **NAME** | BankRegData |
| **ENDPOINT** | `https://www.bankregdata.com` · Export: `http://www.bankregdata.com/export.asp` |
| **GRANULARITY** | Institution level (every FDIC-insured bank) |
| **FORMAT** | CSV export (requires paid subscription after free trial) |
| **FREE** | 2-week free trial with full data access[^51] — then subscription required |
| **VISUAL USE** | Filter banks by CRE concentration >300% of risk-based capital (per OCC/Fed guidance threshold[^52]). Map by state. Identify systemically important community banks for distress monitoring[^53][^54]. |

#### FDIC BankFind Suite API

| Field | Detail |
|-------|--------|
| **NAME** | FDIC BankFind Suite |
| **ENDPOINT** | `https://banks.data.fdic.gov/api/financials?filters=REPDTE%3A20250331&fields=REPDTE,INSTNAME,CERT,CRECONC,CRELNS,ASSET&limit=10000` |
| **GRANULARITY** | Institution level — every FDIC-insured bank |
| **PROPERTY TYPES** | CRE loans including: non-owner occupied CRE, construction/land, multifamily |
| **UPDATE** | Quarterly (call report cycle) |
| **FORMAT** | JSON REST API — no key required[^55][^56] |
| **FREE** | Yes — completely free, no API key needed[^56] |
| **VISUAL USE** | Query `CRECONC` (CRE concentration ratio) and `CRELNS` (CRE loan balance) by institution. Filter for `CRECONC > 300` to identify high-concentration banks. Map by state. Build a bank stress heat map. |

**FDIC API example** — banks with CRE concentration >300% of capital, most recent quarter:
```
https://banks.data.fdic.gov/api/financials?filters=REPDTE%3A20250331%20AND%20CRECONC%3A%5B300%20TO%20*%5D&fields=REPDTE,INSTNAME,STNAME,CRECONC,CRELNS,ASSET&limit=10000&sort_by=CRECONC&sort_order=DESC
```

**Bulk download** (all fields, all institutions): `https://banks.data.fdic.gov/bankfind-suite/bulkdata`[^57]

***

### D21. Special Servicing Rates — Free Data

No free structured API for CMBS special servicing rates exists. Sources:
- **Trepp Blog** (`trepp.com/trepptalk`): Monthly CMBS delinquency and special servicing commentary is free. As of March 2026, $3.28B in CMBS loan balances reached hard maturity. Not an API.[^46][^58]
- **KBRA Monthly Reports**: Free with registration — includes distress rate (delinquent + current-but-specially-serviced) at 10.3% as of March 2026.[^44]
- **Fed SLOOS**: Quarterly qualitative signal on CRE workout conditions. Free via FRED.[^59]

***

## Section E — Construction and Supply Pipeline

### E22. Census Building Permits — Commercial-Specific Codes

The Census Building Permits Survey primarily tracks residential units. It does **not** publish a structured national series broken out by commercial structure type (office, warehouse, retail). The permit survey collects:[^29][^30]
- 1-unit structures
- 2-unit structures
- 3-4 unit structures
- 5+ unit structures (multifamily)

For commercial permits, local building departments track structure use codes, but these are not rolled up into a free national API. The closest substitute is **Census Construction Spending (C-30)**, which does break out nonresidential construction by type.

***

### E23. Census Construction Spending (C-30) — Private CRE by Type

| Field | Detail |
|-------|--------|
| **NAME** | Census Monthly Construction Spending (Value Put in Place, C-30) |
| **ENDPOINT** | Current release: `https://www.census.gov/construction/c30/current/index.html` · Historical data: `https://www.census.gov/construction/c30/historical_data.html` · API: `https://www.census.gov/construction/c30/c30index.html` (links to FRED series) |
| **GRANULARITY** | National only (seasonally adjusted annual rates) |
| **PROPERTY TYPES** | **Full CRE breakdown**: Office, Commercial (retail/warehouse), Health care, Educational, Religious, Public safety, Amusement/Recreation, Transportation, Power, Highway, plus Residential[^60] |
| **UPDATE** | Monthly (released first week of second following month)[^61] |
| **FORMAT** | Excel tables (Census site) and JSON via FRED API |
| **FREE** | Yes |
| **VISUAL USE** | Nonresidential private construction spending by type — track office vs. warehouse vs. retail construction trends. As of March 2026: Private nonresidential construction was at $729.4B SAAR[^60]. Multi-line chart showing construction spending by CRE property type over time. |

**FRED series for CRE construction spending:**
- `PNRESCONS` = Total private nonresidential construction
- Office-specific and other sub-type series available by searching FRED for "construction spending office" etc.

***

### E24. Dodge Construction Network — Free Tier?

**No free tier exists.** Dodge Construction Network is a paid subscription service for construction project data, analytics, and market intelligence. Pricing is typically several thousand dollars per year per region. No API or public data download is available. The free alternative for supply pipeline data is Census Construction Spending (C-30) and QCEW construction employment.[^62][^63]

***

### E25. ConstructConnect / CMD — Free Data?

**No free data.** ConstructConnect (formerly CMD Group and BidClerk) is a paid platform comparable to Dodge. No public API or free tier exists for project-level data.[^64]

***

## Section F — Demographics as Demand Proxies

### F26. Census ACS 5-Year API — Exact Table IDs

**Base URL:** `https://api.census.gov/data/2024/acs/acs5`[^65]

The ACS 5-year estimates are available for nation, all states, DC, all counties, all MSAs, all ZIP Code Tabulation Areas (ZCTAs), census tracts, and block groups.[^65]

| Metric | Table ID | Variable(s) | Example API Call |
|--------|----------|-------------|------------------|
| Total Population | B01003 | B01003_001E | `?get=NAME,B01003_001E&for=metropolitan+statistical+area/micropolitan+statistical+area:*` |
| Median Household Income | B19013 | B19013_001E | `?get=NAME,B19013_001E&for=county:*&in=state:*` |
| Renter vs. Owner Ratio | B25003 | B25003_002E (owner), B25003_003E (renter) | `?get=NAME,B25003_002E,B25003_003E&for=county:*` |
| Median Home Value | B25077 | B25077_001E | `?get=NAME,B25077_001E&for=metropolitan+statistical+area/micropolitan+statistical+area:*` |
| Employment by Industry | S2403 | Multiple sector columns | Subject table — detailed industry employment shares |
| Educational Attainment | B15003 | B15003_022E+ | College degree share — office demand proxy |
| Housing Units | B25001 | B25001_001E | Total housing units |
| Vacancy Rate (Housing) | B25002 | B25002_003E (vacant) / B25002_001E (total) | Residential vacancy by tract |

**Full example** — Renter ratio for all counties:
```
https://api.census.gov/data/2024/acs/acs5?get=NAME,B25003_001E,B25003_002E,B25003_003E&for=county:*&key=YOUR_KEY
```


***

### F27. Census Population Estimates API

| Field | Detail |
|-------|--------|
| **NAME** | Census Population Estimates Program (PEP) |
| **ENDPOINT** | `https://api.census.gov/data/2023/pep/population?get=POP,NAME&for=metropolitan+statistical+area/micropolitan+statistical+area:*` |
| **GRANULARITY** | National, state, county, MSA, combined statistical area, place[^66][^67] |
| **UPDATE** | Annual (Vintage year released ~March of following year) |
| **FORMAT** | JSON API |
| **FREE** | Yes |
| **VISUAL USE** | Year-over-year population growth rate by MSA — overlay on multifamily rent trend charts to show demand-supply dynamics. Identify fastest-growing metros for investment targeting. |

**Note:** Post-2020 estimates are downloadable as files but may not be on the API endpoint yet. Use `api.census.gov/data/2023/pep/population` for the most recent API-accessible vintage.[^67]

***

### F28. IRS SOI Migration Data

| Field | Detail |
|-------|--------|
| **NAME** | IRS Statistics of Income (SOI) — County-to-County Migration Data |
| **ENDPOINT** | Download page: `https://www.irs.gov/statistics/soi-tax-stats-migration-data` · Annual files: `https://www.irs.gov/statistics/soi-tax-stats-migration-data-2021-2022` |
| **GRANULARITY** | County-to-county (inflow and outflow for every county pair)[^68][^69] |
| **UPDATE** | Annual (2011–2022 currently available in CSV; filing year 2023 pending)[^68] |
| **FORMAT** | CSV and Excel by state[^70][^68][^69] |
| **FREE** | Yes — completely free download |
| **VISUAL USE** | Net migration flows to/from each county → identify counties gaining population (multifamily demand growth) or losing (softening demand). Build origin-destination migration flow maps. Excellent for Sun Belt vs. Rust Belt multifamily demand stories. |

***

### F29. BLS LAUS — Unemployment by MSA

| Field | Detail |
|-------|--------|
| **NAME** | BLS Local Area Unemployment Statistics (LAUS) |
| **ENDPOINT** | Data page: `https://www.bls.gov/lau/data.htm` · Series search: `https://data.bls.gov/timeseries/LAUMT{FIPS}0000000000003` (unemployment rate) |
| **GRANULARITY** | Census regions/divisions, states, counties, metros, cities[^71][^15] |
| **UPDATE** | Monthly |
| **FORMAT** | JSON via BLS API (free key) + CSV bulk download |
| **FREE** | Yes — free BLS API key at `data.bls.gov/registrationEngine/` |
| **VISUAL USE** | Unemployment rate by MSA as a monthly leading indicator for CRE demand. Low unemployment = tight office and retail markets. Use as a choropleth map layer or as a paired metric alongside vacancy rates. |

**BLS API series format for metro unemployment rate:**
```
https://api.bls.gov/publicAPI/v2/timeseries/data/LAUMT{MSA_FIPS_CODE}0000000000003
```
Where `{MSA_FIPS_CODE}` is the 4-digit MSA FIPS code (e.g., `0875` for Chicago-Naperville, `4472` for New York-Newark).

***

## Master Source Matrix

| # | Source | Endpoint | Granularity | CRE Types | Update | Format | Cost |
|---|--------|----------|-------------|-----------|--------|--------|------|
| A1 | Census HVS | `census.gov/housing/hvs` | National | Residential ONLY | Quarterly | JSON API | Free |
| A2 | HUD USPS Vacancy | `huduser.gov/portal/datasets/usps.html` | Census tract | Residential + Commercial | Quarterly | CSV | Free (govt/nonprofit only) |
| A3 | Census CBP | `api.census.gov/data/2023/cbp` | County/MSA/ZIP | Establishment proxy | Annual | JSON API | Free |
| A4 | Broker PDFs | `cbre.com/insights`, `cushwake.com/Research` | MSA | All CRE types | Quarterly | PDF | Free (parse) |
| B8 | Zillow ZORI | `zillow.com/research/data/` | ZIP/County/MSA | Multifamily rent only | Monthly | CSV | Free |
| B9 | ApartmentList | `apartmentlist.com/research` | Metro/city | Multifamily | Monthly | Web tables | Free |
| B10 | Redfin Data | `redfin.com/news/data-center/` | ZIP/County/Metro | Residential only | Weekly | CSV | Free |
| B12 | NMHC Survey | `nmhc.org/research-insight/quarterly-survey/` | National | Multifamily | Quarterly | Spreadsheet | Free |
| B13 | BLS QCEW | `bls.gov/cew/additional-resources/open-data/` | County/MSA | Employment proxy | Quarterly | CSV/JSON | Free |
| B14 | Census BPS | `census.gov/permits` | County/MSA/State | Residential (5+ unit) | Monthly | Excel/CSV | Free |
| C15 | FRED CRE Price | `fred.stlouisfed.org/series/COMREPUSQ159N` | National | All CRE | Quarterly | JSON API | Free |
| C15 | FRED CRE Price (Z.1) | `fred.stlouisfed.org/series/BOGZ1FL075035503Q` | National | All CRE | Quarterly | JSON API | Free |
| C15 | MIT REPD | `pricedynamicsplatform.mit.edu/analytics/` | 7 major metros | All CRE | Quarterly | CSV | Free |
| C15 | NCREIF Press | `ncreif.org` | National/type | Office/Ind/Ret/MF | Quarterly | PDF | Free (PDF) |
| D18 | FRED Delinquency | `fred.stlouisfed.org/series/DRCRELEXFACBS` | National | All CRE loans | Quarterly | JSON API | Free |
| D20 | FDIC BankFind | `banks.data.fdic.gov/api/financials` | Institution | CRE loans | Quarterly | JSON API | Free |
| D20 | FFIEC CDR Bulk | `cdr.ffiec.gov/public/PWS/DownloadBulkData.aspx` | Institution | All loan types | Quarterly | Excel/XBRL | Free |
| D20 | BankRegData | `bankregdata.com` | Institution | CRE concentration | Quarterly | CSV | Trial free; paid |
| E23 | Census C-30 | `census.gov/construction/c30/` | National | Office/retail/warehouse | Monthly | Excel/FRED | Free |
| F26 | Census ACS 5-yr | `api.census.gov/data/2024/acs/acs5` | Tract/ZIP/County/MSA | Demographics | Annual | JSON API | Free |
| F27 | Census PEP | `api.census.gov/data/2023/pep/population` | County/MSA/State | Population | Annual | JSON API | Free |
| F28 | IRS SOI Migration | `irs.gov/statistics/soi-tax-stats-migration-data` | County-to-county | Migration flows | Annual | CSV | Free |
| F29 | BLS LAUS | `bls.gov/lau/data.htm` | County/MSA/City | Employment/unemployment | Monthly | JSON API/CSV | Free |
| Fed SLOOS | CRE Lending Standards | `fred.stlouisfed.org/series/SUBLPDRCSCLGNQ` | National | CRE loans | Quarterly | JSON API | Free |

***

## Dashboard Architecture Recommendations

### Vacancy Rate Panel (No CoStar)
Use a **three-layer approach:**
1. **Macro layer**: FRED `DRCRELEXFACBS` delinquency rate as a proxy for distress (free, JSON API)
2. **Market layer**: Quarterly broker PDF extraction (CBRE, JLL, Lee & Associates) using PyMuPDF to pull vacancy tables for top 20 MSAs
3. **Micro layer**: CBP establishment count trends by NAICS at county level (free, annual)

### Multifamily-Specific Panel
Combine: Zillow ZORI (monthly rent trends, MSA/ZIP) + NMHC Market Tightness Index (quarterly) + ApartmentList national median + Census ACS B25003 (renter ratio) + Census BPS 5+ unit permits (supply pipeline).

### Office Demand Proxy Panel
BLS QCEW employment growth in NAICS 52+54 (finance + professional services) by MSA, quarterly. Layer with BLS LAUS unemployment rate by metro. Neither gives you vacancy directly, but employment growth in office-using industries is the cleanest free proxy available.

### Distress Monitoring Panel
FDIC BankFind API (`CRECONC` field) to map bank CRE concentration by state. FRED CRE delinquency series for trend. FFIEC CDR bulk data for granular call report analysis. Trepp blog for CMBS commentary (PDF parse).

### Cap Rate / Pricing Panel
FRED `COMREPUSQ159N` for national commercial price index trend. MIT REPD for 7-metro cap rate direction. NCREIF quarterly press release (PDF parse) for property-type breakdown. Federal Reserve SLOOS (`SUBLPDRCSCLGNQ`) for lending standards direction as a cap rate direction signal.

### Demographics/Demand Panel
IRS SOI migration (county-to-county net flows, CSV download) for population movement story. Census ACS B19013 (median income), B25003 (renter ratio) for MSA-level demand quality. Census PEP for annual population growth rates. BLS LAUS for monthly unemployment momentum.

***

## Known Data Gaps — Cannot Be Sourced for Free

The following metrics **cannot be reliably sourced without paying** for CoStar, MSCI RCA, or equivalent:

1. **Commercial vacancy rates by property type at the MSA level** — No government source exists. Broker PDF extraction is the only free path.
2. **Net absorption by property type** — Same. No public data.
3. **Asking/effective rents for office, retail, and industrial** — No government source. Zillow/ApartmentList cover multifamily only.
4. **Transaction volume by property type and MSA** — MSCI RCA. CoStar. No free alternative for systematic data.
5. **Cap rates by MSA and property type** — NCREIF (membership), RCA/MSCI (paid), Green Street (paid). MIT REPD provides 7 metros free.
6. **CMBS special servicing by property type (structured)** — Trepp (paid). Free sources are blog-post commentary only.
7. **Construction pipeline by project** — Dodge or ConstructConnect (both paid). No free project-level alternative.

---

## References

1. [Housing Vacancies and Homeownership - Press Release](https://www.census.gov/housing/hvs/current/index.html) - National vacancy rates in the first quarter 2026 were 7.3 percent for rental housing and 1.1 percent...

2. [HUD Aggregated USPS Administrative Data On Address Vacancies](https://www.huduser.gov/portal/datasets/usps.html) - USPS provides aggregate vacancy and no-stat counts of residential and business addresses that are co...

3. [[PDF] Downloading HUD Aggregated USPS Administrative Data on ...](https://equityindicators.org/wp-content/uploads/2019/10/ISLG_USPS.pdf) - To access the data, you will need to register on the HUD User website: https://www.huduser.gov/porta...

4. [HUD Aggregated USPS Administrative Data on Address Vacancies](https://www.communitycommons.org/entities/ecfd0a31-13b0-4473-b8e0-a2f9ff62abc5) - USPS provides aggregate vacancy and no-stat counts of residential and business addresses that are co...

5. [[PDF] USPS Vacancy Indicators - NEOCANDO](https://neocando.case.edu/resources/neocando/new%20docs/11-%20USPS%20Vacancy%20Indicators.pdf) - Total number of addresses: This represents all addresses (residential and commercial) that the USPS ...

6. [County Business Patterns (CBP) APIs - Census Bureau](https://www.census.gov/data/developers/data-sets/cbp-zbp/cbp-api.html) - County Business Patterns provides annual statistics for businesses with paid employees within the US...

7. [Insights & Research - CBRE](https://www.cbre.com/insights) - Explore the latest insights and trends in the real estate industry with CBRE. Stay informed and make...

8. [Multifamily - CBRE](https://www.cbre.com/insights/books/us-real-estate-market-outlook-2025/multifamily) - The average multifamily vacancy rate is expected to end 2025 at 4.9% and average annual rent growth ...

9. [Market Research - Cushman & Wakefield Multifamily Advisory Group](https://multifamily.cushwake.com/Research/2) - Quarterly Market Reports. SF. South Florida. Mid-Atlantic. Midwest. Mountain. Northeast ... Most Rec...

10. [[PDF] Q1 2025 MARKET REPORTS | Lee & Associates](https://www.lee-associates.com/wp-content/uploads/2025/04/2025.Q1-North-America-Market-Report.pdf) - New supply in the Naples multifamily market has kept vacancy elevated. The vacancy rate climbed to 1...

11. [Commercial Real Estate Metro Market Dashboard](https://www.nar.realtor/research-and-statistics/research-reports/commercial-real-estate-metro-market-reports) - The Commercial Metro Markets Dashboard evaluates market factors such as economic and demographic con...

12. [Delinquency Rate on Commercial Real Estate Loans ... - FRED](https://fred.stlouisfed.org/series/DRCRELEXFACBS) - Graph and download economic data for Delinquency Rate on Commercial Real Estate Loans (Excluding Far...

13. [Table Data - Delinquency Rate on Commercial Real Estate Loans ...](https://fred.stlouisfed.org/data/DRCRELEXFACBS) - Delinquency Rate on Commercial Real Estate Loans (Excluding Farmland), Booked in Domestic Offices, A...

14. [Net Percentage of Large Domestic Banks Tightening Standards for ...](https://fred.stlouisfed.org/series/SUBLPDRCSCLGNQ) - This data series is part of the Board of Governors of the Federal Reserve System's Senior Loan Offic...

15. [Bureau of Labor Statistics Local Area Unemployment Statistics](https://www.policymap.com/data/sources/bureau-of-labor-statistics-local-area-unemployment-statistics) - The Bureau of Labor Statistics' Local Area Unemployment Statistics (LAUS) program produces monthly a...

16. [Real Estate Metrics - Data & APIs](https://www.zillowgroup.com/developers/api/public-data/real-estate-metrics/) - In terms of aggregate data at the neighborhood level, can be found here – https://www.zillow.com/res...

17. [Housing Data - Zillow Research](https://www.zillow.com/research/data/) - Note: We make occasional changes to CSV download paths and data is updated on the 16th of each month...

18. [Data & Rent Estimates - Apartment List Blog](https://www.apartmentlist.com/research/category/data-rent-estimates) - Read about and download the latest rental data in your area. Access the latest rental market data fo...

19. [Apartment List National Rent Report](https://www.apartmentlist.com/research/national-rent-data) - The national median rent increased by 0.5% in April, and now stands at $1,370. · Rent prices nationa...

20. [Downloadable Housing Market Data - Redfin](https://www.redfin.com/news/data-center/) - Downloadable housing market insights from across the U.S.. Download the data. Redfin Data Center Lan...

21. [NAHB/Wells Fargo Housing Market Index (HMI)](https://www.nahb.org/news-and-economics/housing-economics/indices/housing-market-index) - The NAHB/Wells Fargo Housing Market Index (HMI) is designed to gauge and track the pulse of the sing...

22. [Quarterly Survey of Apartment Market Conditions - NMHC](https://www.nmhc.org/research-insight/quarterly-survey/) - The NMHC Quarterly Survey of Apartment Market Conditions provides a snapshot of the state of the apa...

23. [Quarterly Survey of Apartment Construction & Development Activity](https://www.nmhc.org/research-insight/nmhc-construction-survey/) - The Construction Quarterly Survey began in March 2022; the survey was revised in June 2024 and once ...

24. [NMHC Quarterly Survey of Apartment Conditions (January 2026)](https://www.nmhc.org/research-insight/quarterly-survey/2026/nmhc-quarterly-survey-of-apartment-conditions-january-2026/) - Market Tightness Index1, Sales Volume Index2, Equity Financing Index3, Debt Financing Index4. Januar...

25. [Quarterly Census of Employment and Wages (QCEW)](https://kb.lightcast.io/en/articles/7934107-quarterly-census-of-employment-and-wages-qcew) - QCEW is a dataset published by the Bureau of Labor Statistics (BLS). QCEW is the backbone of Lightca...

26. [Quarterly Census of Employment and Wages (ICPSR 36312)](https://www.icpsr.umich.edu/web/NADAC/studies/36312) - The QCEW program serves as a near census of monthly employment and quarterly wage information by 6-d...

27. [QCEW Data Files : U.S. Bureau of Labor Statistics](https://www.bls.gov/cew/downloadable-data-files.htm) - The Quarterly Census of Employment and Wages (QCEW) program provides several different types of data...

28. [QCEW Open Data Access - Bureau of Labor Statistics](https://www.bls.gov/cew/additional-resources/open-data/) - QCEW provides a collection of CSV files designed to allow third party programmers, developers, and o...

29. [Building Permits Survey (BPS) - Census Bureau](https://www.census.gov/permits) - The purpose of the Building Permits Survey (BPS) is to provide national, state, and local statistics...

30. [About the Building Permits Survey (BPS) - Census Bureau](https://www.census.gov/construction/bps/about.html) - Building permits data are available in four basic levels of aggregation: state, core based statistic...

31. [Commercial Real Estate Price Index, Level (BOGZ1FL075035503Q ...](https://fred.stlouisfed.org/series/BOGZ1FL075035503Q) - Graph and download economic data for Interest Rates and Price Indexes; Commercial Real Estate Price ...

32. [Commercial Real Estate Prices for United States (COMREPUSQ159N)](https://fred.stlouisfed.org/series/COMREPUSQ159N) - Graph and download economic data for Commercial Real Estate Prices for United States (COMREPUSQ159N)...

33. [[PDF] NPI-2Q2025-Press-Release.pdf - NCREIF](https://ncreif.org/__static/jdj5jdewjeztl3dsednwcdzxm3lmznjv/NPI-2Q2025-Press-Release.pdf) - For those properties that did sell (which is a very small percentage of properties in the index), th...

34. [Real Estate Price Dynamics Platform - MIT](https://pricedynamicsplatform.mit.edu) - Our research focuses on developing applications and models used for real estate price indices for ma...

35. [United States Archives - Green Street](https://www.greenstreet.com/tag/united-states/) - Newport Beach, CA, April 7, 2026 — The Green Street Commercial Property Price Index® increased 0.4% ...

36. [NCREIF Query Tool](https://user.ncreif.org/data-products/ncreif-query-tool/) - Transaction and Appraisal Cap Rates. The information generated from the queries can be viewed at the...

37. [[PDF] RCA CPPI US | MSCI](https://www.msci.com/downloads/web/msci-com/research-and-insights/paper/rca-commercial-property-price-indexes-rca-cppi/2508_RCACPPI_US.pdf) - The RCA CPPI (commercial property price indexes) are transaction- based indexes and measure commerci...

38. [[PDF] RCA CPPI US | MSCI](https://www.msci.com/downloads/web/msci-com/research-and-insights/paper/rca-commercial-property-price-indexes-rca-cppi/2510_RCACPPI_US.pdf) - The RCA CPPI (commercial property price indexes) are transaction-based indexes and measure commercia...

39. [Latest on US Commercial-Property Pricing - MSCI](https://www.msci.com/research-and-insights/paper/rca-commercial-property-price-indexes-rca-cppi) - MSCI's commercial-property price indexes (RCA CPPI™) provide a consistent measure of transacted sale...

40. [FHFA House Price Index® Datasets](https://www.fhfa.gov/data/hpi/datasets) - The FHFA HPI is a comprehensive collection of publicly available house price indexes that measure ch...

41. [Delinquency Rate on Commercial Real Estate Loans (Excluding ...](https://fred.stlouisfed.org/series/DRCRELEXFOBS) - Delinquency rate on commercial real estate loans (excluding farmland), booked in domestic offices, b...

42. [FRB: Charge-Off and Delinquency Rates on Loans and Leases at ...](https://www.federalreserve.gov/releases/chargeoff/) - Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks ... Louis's Federal Reserve...

43. [Delinquency Rates for Commercial Properties Increased in the First ...](https://www.mba.org/news-and-research/newsroom/news/2025/05/13/delinquency-rates-for-commercial-properties-increased-in-first-quarter-2025) - The delinquency rate for commercial mortgages increased again in the first quarter of 2025, driven b...

44. [CMBS Loan Performance Trends: March 2026](https://www.kbra.com/publications/MXCWdCxS) - A CMBS package includes: · In-depth coverage of commercial real estate finance with property-level i...

45. [Office CMBS Delinquency Hits an All-Time High - Trepp](https://www.trepp.com/trepptalk/office-cmbs-delinquency-hits-an-all-time-high-what-the-data-is-really-saying) - The CMBS office delinquency rate reached 12.34% in January 2026, marking a new all-time high and sur...

46. [CMBS Delinquency Rate Increases Again in August as Office ...](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-increases-again-in-august-2025) - Download the August 2025 Delinquency Report to see readings for each major property type and CMBS 1....

47. [Download Bulk Data - FFIEC Central Data Repository's Public Data ...](https://cdr.ffiec.gov/public/PWS/DownloadBulkData.aspx) - This page enables you to download bulk data in either Excel compatible or XBRL format. Please note t...

48. [View or download data for individual institutions - FFIEC Central ...](https://cdr.ffiec.gov) - Through this site you can obtain Reports of Condition and Income (Call Reports) and Uniform Bank Per...

49. [Commercial Real Estate Loan Maturity Volumes | MBA](https://www.mba.org/news-and-research/newsroom/blog-post/chart-of-the-week--commercial-real-estate-loan-maturity-volumes) - Among loans backed by industrial properties, 22 percent will come due in 2025, as will 24 percent of...

50. [U.S. CRE 2026 Outlook: Momentum Is Healthy, but Office Dynamics ...](https://dbrs.morningstar.com/research/471472) - -- More than $100 billion in fixed- and floating-rate CMBS loans are coming due in 2026, and we expe...

51. [Free Trial - BankRegData](https://www.bankregdata.com/freeTrial.asp) - Will I get access to everything? Yes. Free Trial access is the same as Client access. You may have s...

52. [Interagency Guidance on CRE Concentration Risk Management](https://www.occ.gov/news-issuances/bulletins/2006/bulletin-2006-46.html) - Total commercial real estate loans, as defined in the guidance, represent 300 percent or more of the...

53. [BankRegData](https://www.bankregdata.com) - BankRegData, Bank, FDIC, Call Reports, Tier 1 Leverage, CET1 Capital Ratio ... Concentration, CRE Co...

54. [BankRegData](https://www.bankregdata.com/allHm.asp) - U.S. Bank Performance ... CRE: Non Owner Occupied, 38,871,000,000, 2.56, 2.25, 1.85. 9, Construction...

55. [BankFind Suite - API Documentation - FDIC](https://api.fdic.gov/banks/docs) - FDIC's application programming interface (API) lets developers access FDIC's publically available ba...

56. [FDIC Bank Data Search - US Bank Financials & Info API in JavaScript](https://apify.com/ryanclinton/fdic-bank-search/api/javascript) - Extract FDIC-insured bank and thrift institution data from the FDIC BankFind Suite API. Search by st...

57. [Bulk Data and API - FDIC: BankFind Suite](https://banks.data.fdic.gov/bankfind-suite/bulkdata) - BankFind Suite enables users to search, filter, and download bank data using our Application Program...

58. [TreppTalk | Maturing CMBS](https://www.trepp.com/trepptalk/topic/maturing-cmbs) - The private-label commercial mortgage-backed securities (CMBS) universe shows $3.28 billion in loan ...

59. [The April 2026 Senior Loan Officer Opinion Survey on Bank Lending ...](https://www.federalreserve.gov/data/sloos/sloos-202604.htm) - Questions on commercial real estate lending. Over the first quarter, banks reported having left stan...

60. [Monthly Construction Spending, March 2026 - Census Bureau](https://www.census.gov/construction/c30/current/index.html) - Private Construction Spending on private construction was at a seasonally adjusted annual rate of $1...

61. [[PDF] MONTHLY CONSTRUCTION SPENDING, MARCH 2026](https://www.census.gov/construction/c30/pdf/release.pdf) - Spending on private construction was at a seasonally adjusted annual rate of $1,659.0 billion, 0.8 p...

62. [Dodge Construction Network Ramp Rate: A Data-Backed Look](https://ramp.com/vendors/dodge-construction-network) - As of May 2026, 8% of organizations who have a vendor in the Construction category use Dodge Constru...

63. [Dodge Construction Network: Construction Project Data & Market ...](https://www.construction.com) - Find projects earlier, access verified construction data, and act with confidence. Dodge helps you i...

64. [Dodge vs ConstructConnect Pricing and Project Intelligence [2026]](https://constructionbids.ai/blog/dodge-vs-constructconnect-comparison) - We compared Dodge and ConstructConnect on pricing, project coverage, and data quality. See which pla...

65. [American Community Survey 5-Year Data (2009-2024)](https://www.census.gov/data/developers/data-sets/acs-5year.html) - Subject Tables are available down to the census tract level. Data Profiles contain broad social, eco...

66. [Population Estimates APIs - Census Bureau](https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html) - The Census Bureau's Population Estimates Program uses current data on births, deaths, and migration ...

67. [Other Census Bureau datasets • tidycensus - WALKER DATA](https://walker-data.com/tidycensus/articles/other-datasets.html) - One such dataset is the Population Estimates API, which includes information on a wide variety of po...

68. [SOI tax stats - Migration data | Internal Revenue Service](https://www.irs.gov/statistics/soi-tax-stats-migration-data) - Migration data for years 2011-2022 are available for download in Comma Separated Values files and Ex...

69. [SOI tax stats - Migration data 2021–2022 | Internal Revenue Service](https://www.irs.gov/statistics/soi-tax-stats-migration-data-2021-2022) - Migration data 2021-2022 data files are available for download in ... County-to-county outflow | Cou...

70. [SOI Tax Stats - County-to-county migration data files - IRS](https://www.irs.gov/statistics/soi-tax-stats-county-to-county-migration-data-files) - Data files are available for download in two formats: Generic ASCII data files (.dat file extension)...

71. [Local Area Unemployment Statistics (LAUS), Annual Average](http://catalog.data.gov/dataset/local-area-unemployment-statistics-laus-annual-average) - This dataset contains the Local Area Unemployment Statistics (LAUS), annual averages from 1990 to 20...

