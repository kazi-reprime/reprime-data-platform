# Agency Multifamily & Government Housing Data Layer
## CRE Intelligence Terminal — 59-Day Launch Reference

*Compiled May 26, 2026. Every source verified as publicly accessible and free. URLs are direct-access endpoints.*

***

## Master Source Table

### FANNIE MAE

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **Multifamily Loan Performance Data (MFLPD)** — loan acquisition and performance, DSCR, delinquency, prepayment | `https://capitalmarkets.fanniemae.com/credit-risk-transfer/multifamily-credit-risk-transfer/multifamily-loan-performance-data` (accessed via Data Dynamics platform) | CSV download via portal | Quarterly (~2 weeks post quarter-end)[^1] | Loan-level; no MSA aggregation out-of-box | Yes (loan-level) | Free; registration required | "Agency MF Loan Health" ticker — DSCR distribution, delinquency rates |
| **Single-Family Loan Performance Data (SFLPD / Data Dynamics)** — 30-yr fixed acquisition + monthly performance from 2000 | `https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/fannie-mae-single-family-loan-perfo` | CSV + API | Quarterly; Q3 2025 released Jan 30, 2026[^2] | Loan-level; census tract geocode | Yes (loan-level) | Free; registration required at datadynamics.fanniemae.com[^3] | SF credit performance heat map; prepay/default rate overlay |
| **Connecticut Avenue Securities (CAS) Deal Reports** — single-family credit risk transfer, tranche-level loss data | `https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/connecticut-avenue-securities/conne` | PDF + CSV per deal | Per transaction (~5–7 per year; 2025 calendar issued Dec 2024)[^4] | National; reference pool by vintage | No (deal-level) | Free | CRT credit signal ticker; CAS spread / subordination live card |
| **DUS Disclose** — multifamily MBS pool and loan disclosure, AMI breakdown, Social Bond flag | `https://multifamily.fanniemae.com/applications-technology/dus-disclose` | Web search + CSV download per pool[^5] | Monthly/per-issuance | Pool and loan level; property address[^6] | Yes (property-level) | Free | "MF MBS Issuance" map layer; affordable unit AMI tile per property |

***

### FREDDIE MAC

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **Multifamily Loan-Level Dataset** — ~55 million loans 1999–2025, standard + non-standard datasets | `https://www.freddiemac.com/research/datasets` (download via Clarity Data Intelligence portal) | CSV by year[^7] | Quarterly[^7] | Loan-level; state, MSA, zip available in schema | Yes (loan-level) | Free; registration required (Clarity portal) | SF/MF credit quality heatmap; CDR/CPR time-series chart |
| **Apartment Investment Market Index (AIMI)** — combines NOI growth, property price growth, MF mortgage rates into single index | `https://mf.freddiemac.com/aimi` (XLS export button on page)[^8] | XLS / interactive[^9] | Quarterly[^9] | National + ~25 select metros[^9] | No (metro index) | Free | "AIMI Gauge" live tile; metro-level MF investment climate tracker |
| **Primary Mortgage Market Survey (PMMS)** — 30-yr and 15-yr fixed weekly rates since 1971 | `https://www.freddiemac.com/pmms/docs/historicalweeklydata.xlsx` (direct XLSX link)[^10] | XLSX[^10] | Weekly (Thursdays, noon ET)[^11] | National | No (national rate) | Free | "Mortgage Rate Ticker" — live 30-yr/15-yr rate card |
| **Multifamily Outlook Quarterly PDF** — latest: 2025 edition; archive at mf.freddiemac.com/research | Latest: `https://mf.freddiemac.com/docs/2025_multifamily_outlook.pdf`; archive: `https://mf.freddiemac.com/research`[^12][^13] | PDF | Quarterly | National; select MSA forecasts | No (aggregate) | Free | "MF Market Forecast" headline tile; vacancy/rent growth chart |
| **STACR Deal Reports** — SF credit risk transfer, loan-level disclosure via Clarity | `https://capitalmarkets.freddiemac.com/crt/securities`[^14] | TXT/CSV (EU Annex II format); download via Clarity[^15] | Monthly (per outstanding deal) | Loan-level reference pool | Yes (loan-level) | Free; Clarity registration required | SF CRT credit signal; STACR spread dashboard |

***

### HUD / FHA MULTIFAMILY

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **FHA Active & Terminated MF Insured Mortgages** (223f, 221d4, 232 etc.) | `https://www.hud.gov/hud-partners/multifamily-fhasl-active`[^16] | Excel (monthly extract from FHA Subsidiary Ledger)[^16] | Monthly (post month-end closing)[^16] | Property-level; address, state | Yes (property-level) | Free; public | "FHA-Insured MF" map layer; insured balance by MSA tile |
| **FHA MF Firm Commitments & Endorsements** — quarterly production by program type | `https://www.hud.gov/hud-partners/multifamily-data`[^17] | Excel | Quarterly (current FY back to FY2001)[^17] | Property-level; state/city | Yes (property-level) | Free; public | Origination pipeline tracker; lender league table |
| **HUD Picture of Subsidized Households** — 4.5M+ HUD-assisted units; Section 8, public housing, project-based[^18] | `https://www.huduser.gov/portal/datasets/assthsg.html` | CSV / structured | Annual[^19] | Property- and census-tract level[^19] | Yes (project-level) | Free | "Subsidized Housing Overlay" map; assisted unit count by ZIP |
| **HUD Multifamily REAC Physical Inspection Scores** — most recent inspection score per property | `https://www.hud.gov/program_offices/housing/mfh/rems/remsinspecscores/remsphysinspscores`[^20] | Excel + PDF[^20] | Updated as inspections occur; current as of Mar 3, 2026[^20] | Property-level; state/city | Yes (property-level) | Free | "Property Health Score" pin layer; REAC score histogram |
| **HUD Multifamily Property / Contract / Insured Active FHA Addresses** | `https://www.hud.gov/hud-partners/multifamily-preservation`[^21] | Excel[^21] | Monthly (as of 3/03/2026)[^21] | Property address-level | Yes (property-level) | Free | MF property geocoded map base layer |
| **HUD CHAS API** — Comprehensive Housing Affordability Strategy; housing need by income band by tract | `https://www.huduser.gov/hudapi/public/chas`[^22] | REST API (JSON) | Annual (ACS-based)[^22] | Census tract, county, state[^22] | No (tract-aggregate) | Free; token required (free signup)[^22] | "Affordability Gap" map layer; renter cost-burden overlay |
| **HUD Fair Market Rents API** — FMR and Income Limits by county/metro | `https://www.huduser.gov/hudapi/public/fmr`[^23] | REST API (JSON)[^23] | Annual (FY2025 data live)[^23] | County, metro area, state[^23] | No (area-level) | Free; token required (free signup)[^23] | "FMR Heat Map" by county; rent affordability calculator |
| **HUD Open Data Catalog** — full catalog of HUD datasets (CHAS, AHS, HMDA crosswalk, homeless, insured properties) | `https://data.hud.gov/datasets`[^24] | Web catalog; links to CSV/API per dataset[^24] | Varies by dataset | Varies | Varies | Free | Central API registry for all HUD-layer data |
| **data.gov HUD Insured Multifamily** (GIS layer) | `https://catalog.data.gov/dataset/hud-insured-multifamily-properties`[^25] | GeoDatabase ZIP + ArcGIS Hub[^25] | Periodic | Property-level geocoded | Yes (geocoded) | Free; public domain | GIS map layer import for Mapbox / Leaflet |
| **HUD Multifamily Assistance & Section 8 Contracts DB** | `https://www.hud.gov/hud-partners/multifamily-assist-section8-database`[^26] | MS Access (property + contract tables)[^26] | Periodic | Property and contract level[^26] | Yes (property-level) | Free | HAP contract expiration tracker; preservation risk tile |

***

### HUD USER DATASETS (PD&R)

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **LIHTC Database** — 54,102 projects, 3.7M units, 1987–2023, geocoded[^27] | `https://www.huduser.gov/lihtc/` (interactive + full ZIP download)[^28][^27] | CSV + MS Access (LIHTCPUB.ZIP)[^27] | Annual (2024 data expected spring 2026)[^28] | Property-level; lat/lon, address, census tract[^27] | Yes (property-level, geocoded) | Free; public | "LIHTC Inventory" pin map; tax-credit pipeline by MSA / state |
| **CHAS API** *(see HUD/FHA above)* | `https://www.huduser.gov/hudapi/public/chas` | REST API | Annual | Census tract | No | Free + token | Affordability overlay |
| **HUD USER PD&R Master Dataset Catalog** | `https://www.huduser.gov/portal/pdrdatas_landing.html`[^29] | Various (CSV, SAS, SPSS) | Dataset-dependent | Varies | Varies | Free | Research data registry |

***

### USDA RURAL DEVELOPMENT

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **Section 515 & 514 Farm Labor Housing Portfolio** — lat/lon, units, LIHTC ID, RA units, vacancies[^30] | `https://catalog.data.gov/dataset/usda-rural-development-multifamily-section-515-rural-rental-housing-and-section-514-farm-l`[^30] | CSV[^30] | Last published June 2016 (static snapshot; live MFIS queries via USDA) | Property-level; lat/lon, address[^30] | Yes (property-level) | Public domain | "USDA Affordable Rural" pin layer; exit/prepay risk tracker |
| **Section 515 Exit / Prepayment Data** — projected loan payoff and exit year by property[^31] | `https://catalog.data.gov/dataset/usda-rural-development-multi-family-housing-program-exit-data`[^31] | Excel[^31] | Periodic snapshot | Property-level | Yes | Public domain | "USDA Exit Risk" heat map; preservation pipeline alert |
| **MFH Servicing Dataset (sc.egov.usda.gov)** | `https://www.sc.egov.usda.gov/data/MFH.html`[^32] | CSV (Multi-Family Support dataset)[^33] | Periodic | Property-level | Yes | Public domain | Active Section 515/538 loan portfolio map |
| **Section 538 Guaranteed Loans (data.gov)** | `https://catalog.data.gov/dataset/usda-rural-development-section-538-multifamily-guaranteed-loans-as-of-7-13-2016`[^34] | CSV + data dictionary PDF[^34] | Static (2016 FOIA snapshot; update requires new request) | Property-level | Yes | Public domain | Agency MF debt map layer — rural guaranteed lending |

***

### VA / FHA SINGLE-FAMILY REO

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **HUD Home Store (FHA REO)** — FHA SF REO available for sale | `https://www.hudhomestore.gov` (web + data API on data.gov)[^35][^36] | Web search; data.gov feed[^35] | Daily | Property-level; address | Yes | Free; public | "FHA REO" pin map; distressed inventory count tile |
| **FHA SF REO Properties for Sale (data.gov)** | `https://catalog.data.gov/dataset/fha-single-family-reo-properties-for-sale`[^35] | Geospatial web page[^35] | Periodic (last updated Apr 30, 2025)[^35] | Property-level | Yes | Public domain | REO density map layer |
| **VA REO** — VA-acquired homes via vendee financing (listed on hudhomestore.gov and ocwen/vrmco.com servicer) | `https://www.hudhomestore.gov` (filter by VA)[^36] | Web search | Periodic | Property-level | Yes | Free | "VA REO" overlay on distressed property map |

***

### CDFI FUND / OPPORTUNITY ZONES / NMTC

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **Opportunity Zone Tract List & Map** | `https://www.cdfifund.gov/opportunity-zones`[^37] (map link on page) | Web map + downloadable tract list[^37] | Static (designated 2018; updates pending One Big Beautiful Bill Act 2025 process)[^37] | Census tract (8,764 designated QOZs) | No (tract-level) | Free; public | "OZ Overlay" census tract shading; deal-zone eligibility checker |
| **CDFI Information Mapping System (CIMS4)** — OZ, NMTC, LIC eligibility per tract; downloadable DBF files[^38] | `https://www.cdfifund.gov/mapping-system`[^38] | DBF (open in Excel)[^38] | Annual (ACS-based refresh)[^38] | Census tract + county | No (tract-level) | Free (public version) | CDFI program eligibility map; multi-layer distress scoring |
| **NMTC Public Data Release** — 8,024 QLICI investments through FY2022 by project; allocatee awards database[^39][^40] | `https://www.cdfifund.gov/programs-training/programs/new-markets-tax-credit`[^41] (Awards Database search) | Web + CSV (Awards Database)[^41] | Annual (FY2022 data released June 2024)[^39] | Project-level; address[^39] | Yes (project-level) | Free | "NMTC Investment" heat map; low-income community deal flow |

***

### SBA LOAN ORIGINATION DATA

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **7(a) & 504 FOIA Origination CSVs** — complete loan-level data since FY1991, segmented by decade; includes ZIP, NAICS, borrower name, lender, approval amount[^42][^43] | `https://data.sba.gov/en/dataset/7-a-504-foia` (FY2020–present CSV direct link: `https://data.sba.gov/en/dataset/0ff8e8e9-b967-4f4e-987c-6ac78c575087/resource/d67d3ccb-2002-4134-a288-481b51cd3479/download/foia-7a-fy2020-present-asof-260331.csv`)[^42] | CSV (4 files for 7(a), 2 for 504)[^43] | Quarterly refresh (current as of 03/31/26)[^42] | ZIP code, state, county; borrower address | Yes (loan-level) | Public domain | "SBA Lending" choropleth by ZIP; small-business credit heat map |
| **SBA Lender Reports (7a/504)** — by state and lender, aggregated | `https://www.sba.gov/partners/lenders/lender-reports`[^44] | CSV / Excel[^44] | Periodic | State / lender | No (summary) | Free | Lender concentration bar chart |

***

### FFIEC HMDA

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **Modified LAR (institution-level files)** — 48 data points per application: race, income, loan type, property type, census tract; 4,768 filers for 2025[^45] | `https://ffiec.cfpb.gov/data-publication/modified-lar`[^45][^46] | CSV (one file per filer + combined national file)[^45] | Annual (2025 data released March 30, 2026)[^45] | Loan/application level; census tract, MSA[^45] | Yes (application-level) | Free; public | "Mortgage Market Activity" census tract map; approval/denial rate tile |
| **Dynamic National Loan-Level Dataset** — full national HMDA, updated weekly to absorb late submissions[^47][^48] | `https://ffiec.cfpb.gov/data-publication/dynamic-national-loan-level-dataset`[^47] | CSV download[^47] | Weekly[^47][^48] | National; census tract[^47] | Yes (application-level) | Free; public | Live mortgage demand heat map; weekly origination pulse ticker |
| **Snapshot National Loan-Level Dataset** — point-in-time annual freeze (as of May 1 each year)[^47] | `https://ffiec.cfpb.gov/data-publication/snapshot-national-loan-level-dataset`[^47] | CSV[^47] | Annual (snapshot)[^47] | National; census tract | Yes | Free; public | Annual vintage comparison map |
| **HMDA Data Browser** — custom table builder and CSV export | `https://ffiec.cfpb.gov/data-browser/`[^48] | CSV export[^48] | Current year dynamic | MSA, county, census tract | Aggregated (not raw) | Free | Interactive market filter tool; drill-down by geography + product |

***

### FFIEC CALL REPORTS (FDIC)

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **FDIC BankFind Suite API** — financials endpoint with CRE loan balances (RCON1480 = CRE, RCON1766 = multifamily, RCON1415 = ADC), institution-level quarterly[^49][^50] | `https://api.fdic.gov/banks/financials` (base: `https://api.fdic.gov/banks/docs`[^49]) | REST API → JSON or CSV[^49] | Quarterly[^51] | Institution-level; CERT ID maps to address/MSA[^49] | No (institution-level) | Free; no key required[^49] | "Bank CRE Exposure" bar chart by institution; ADC ratio watchlist |
| **FDIC Bulk Data Download** — full Call Report quarterly dataset | `https://banks.data.fdic.gov/bankfind-suite/bulkData/bulkDataDownload`[^52] | CSV bulk files[^52] | Quarterly | Institution-level | No | Free; public | Bulk processing for all-bank CRE concentration screener |
| **FFIEC CDR (Call Report retrieval)** | `https://cdr.ffiec.gov`[^53] | Web + XBRL/XML | Quarterly[^53] | Institution-level | No | Free | Regulatory ratio data supplement |

***

### GINNIE MAE

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **Bulk Disclosure Data Download** — multifamily pool + loan monthly portfolio disclosure; new issuance monthly disclosure; RPB (Remaining Principal Balance) data[^54] | `https://bulk.ginniemae.gov`[^54] | TXT/CSV flat files[^54][^55] | Daily (pool-level) + Monthly (RPB, issuance)[^54] | Pool and loan level; CUSIP[^54] | Yes (pool/loan) | Free | "GNMA MF MBS" issuance ticker; RPB trend chart; pool-level map |
| **Monthly Issuance Reports** | `https://www.ginniemae.gov/data_and_reports/reporting/Pages/monthly_issuance_reports.aspx`[^56] | PDF[^56] | Monthly[^56] | National; MF vs SF split | No | Free | Issuance volume chart; government-backed lending pulse |
| **Disclosure Search Tools (pool/RPB/CUSIP lookup)** | `https://www.ginniemae.gov/investors/investor_search_tools/Pages/DisclosureSearchTools.aspx`[^57] | Web + CSV export[^57] | Monthly/current[^57] | Pool-level | Yes (pool-level) | Free | GNMA pool health detail card |

***

### FHFA

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **FHFA House Price Index (HPI) — master CSV** | `https://www.fhfa.gov/hpi/download/monthly/hpi_master.csv`[^58] | CSV (direct download)[^58] | Monthly (latest: Aug 2025)[^59] | National, division, state, MSA, county, ZIP, census tract[^60][^61] | No (area-level) | Free; public domain[^61] | "HPI Trend" live chart; MSA price change heatmap |
| **FHFA HPI Interactive Tool + All Downloads** | `https://www.fhfa.gov/data/hpi`[^60] | CSV + API (data.gov)[^58] | Monthly/quarterly | Multi-geography | No | Free | Multi-geography selector tile |
| **FHFA Public Use Database (PUDB) — Multifamily** — Fannie/Freddie MF acquisitions, unit count, affordability, census tract[^62][^63] | `https://www.fhfa.gov/data/public-use-database`[^63] | CSV[^63] | Annual[^63] | Census tract; MSA[^63] | No (aggregate) | Free | "GSE MF Purchase Volume" tile by census tract / MSA |
| **NMDB Aggregate Statistics** — 5% sample of all US residential mortgages; rates, LTV, DTI distributions[^64] | `https://www.fhfa.gov/data/nmdb`[^64] | CSV (wide + long format)[^64] | Quarterly[^64] | National + MSA | No (aggregate) | Free | Underwriting conditions tracker; LTV/DTI distribution tile |
| **MIRS Transition Index** — successor to discontinued Monthly Interest Rate Survey; published final Thursday of each month[^65] | `https://www.fhfa.gov/data/mirs`[^65] | CSV | Monthly[^65] | National | No | Free | CRE rate context tile; historical rate series |
| **Refinance Report / Foreclosure Prevention Report** | `https://www.fhfa.gov/reports/foreclosure-prevention-refinance-and-fpm/2025/Q1`[^66] | PDF + data tables | Quarterly[^66] | National; Enterprise-level | No | Free | GSE forbearance and mod tracker |

***

### USCIS / DOL LABOR DEMAND

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **OFLC LCA Disclosure Data (H-1B, H-1B1, E-3)** — employer, job title, work city, wage, case status; Q1 FY26 released Feb 2026[^67] | `https://www.dol.gov/agencies/eta/foreign-labor/performance`[^68] | Excel (.xlsx) per fiscal quarter[^68] | Quarterly (released ~1 month post-quarter)[^69][^70] | Work-site city/state; ZIP in some fields[^68] | No (employer-level) | Free; public[^68] | "Knowledge Worker Demand" employer heat map; tech-job immigration signal layer |
| **USCIS H-1B Employer Data Hub** — annual approvals/denials by employer | `https://www.uscis.gov/tools/reports-and-studies/h-1b-employer-data-hub` | CSV (annual) | Annual (~Jan/Feb each year)[^69] | Employer address; ZIP | No (employer-level) | Free | H-1B worker demand by MSA; tech-corridor office demand indicator |

***

### GSA FEDERAL REAL PROPERTY

| Source | Exact URL | Format | Update Cadence | Geography | Property-Level | License | Dashboard Tile / Map Layer |
|---|---|---|---|---|---|---|---|
| **Federal Real Property Profile (FRPP) Public Dataset — FY2024** — asset-level detail for all civilian agency real property owned/leased; ~300K+ assets[^71][^72] | `https://www.gsa.gov/policy-regulations/policy/real-property-policy-division-overview/asset-management/federal-real-property-profile-public-data-set` → direct XLSX: `FRPP_Public_Dataset_FY24_07022025.xlsx`[^72] | Excel (XLSX)[^71][^72] | Annual (FY-end; FY2024 published July 2025)[^71] | Asset-level; address, city, state, lat/lon (partial)[^71] | Yes (asset-level) | Free; public (FOIA exclusions apply to national-security properties)[^71] | "Federal Tenant" layer; lease expiry heat map; government office demand signal |
| **FRPP Summary Report Library** — historical summary reports since 1997[^73] | `https://www.gsa.gov/policy-regulations/policy/real-property-policy-division-overview/data-collection-and-reports/frpp-summary-report-library`[^73] | PDF + summary XLSX[^73] | Annual[^73] | National + agency summary | No (summary) | Free | Federal footprint trend chart |
| **FRPP data.gov catalog entry** | `https://catalog.data.gov/dataset/fy-2024-federal-real-property-profile-frpp-public-dataset`[^72] | XLSX[^72] | Annual | Asset-level | Yes | Free | Alternate download/API access |

***

## Strategic Analysis

### (A) Top 10 Highest-Leverage Sources for a 59-Day Launch

Ranked by immediate shipping value — data availability, property-level granularity, geocoding readiness, and direct public URL access:

1. **FFIEC HMDA Dynamic National Loan-Level Dataset** (`ffiec.cfpb.gov/data-publication/dynamic-national-loan-level-dataset`) — Weekly-updated, 48 data points per application, census-tract geocoded. Powers the broadest CRE market activity map on day one. Highest leverage for any geography-aware terminal.[^47]

2. **HUD LIHTC Database** (`huduser.gov/lihtc/`) — 54,102 projects, 3.7M units, lat/lon geocoded, full schema including program type, sponsor, year, credit allocation. Plug directly into a map tile. Zero data wrangling required.[^28][^27]

3. **FHFA HPI Master CSV** (`fhfa.gov/hpi/download/monthly/hpi_master.csv`) — Direct, no-registration CSV covering ZIP, county, MSA, state, and tract levels. Powers any price appreciation/depreciation map with one GET request.[^58]

4. **FHA Active MF Insured Mortgages** (`hud.gov/hud-partners/multifamily-fhasl-active`) — Monthly Excel with every active FHA-insured multifamily loan. Property address + program code enables instant geocoded map of the entire government-backed MF universe.[^16]

5. **HUD REAC Inspection Scores** (`hud.gov/program_offices/housing/mfh/rems/remsinspecscores/remsphysinspscores`) — Download the Excel today; join to FHA Active file by HUD project ID. Powers a "property health" risk pin map on the same launch sprint.[^20]

6. **SBA 7(a)/504 FOIA CSV** (`data.sba.gov/en/dataset/7-a-504-foia`) — Loan-level ZIP + NAICS + lender. Powers a small-business credit heat map by corridor — high value for mixed-use and retail CRE context.[^42]

7. **FDIC BankFind API** (`api.fdic.gov/banks/financials`) — No registration, JSON/CSV, real-time. Filter by CRE-concentration fields to build an "At-Risk Lender" watchlist tile. Critical for gauging credit availability by geography.[^49]

8. **Ginnie Mae Bulk Disclosure** (`bulk.ginniemae.gov`) — Direct flat-file downloads of multifamily pool and loan data. Daily/monthly cadence. Powers a government-backed MBS issuance feed without scraping.[^54]

9. **Freddie Mac PMMS Historical XLSX** (`freddiemac.com/pmms/docs/historicalweeklydata.xlsx`) — The canonical rate series since 1971. Single GET → instant rate trend chart. Zero dependencies.[^10]

10. **GSA FRPP FY2024 Dataset** (`gsa.gov` XLSX) — Federal real property at asset level. Powers an office-to-residential conversion opportunity layer and federal tenant credit-quality map with minimal processing.[^71]

***

### (B) Property-Level Granularity vs. Summary Statistics Only

**True Property-Level** (lat/lon or property address in schema; can be geocoded and pinned on a map):

| Source | Key Identifiers |
|---|---|
| FHA Active & Terminated MF Insured Mortgages[^16] | HUD Project ID, property address, program code |
| FHA Firm Commitments & Endorsements[^17] | Property name, address, program, lender |
| HUD REAC Inspection Scores[^20] | HUD Project ID, property name, state/city |
| HUD Multifamily Insured Active FHA Addresses[^21] | Property address, lat/lon via data.gov GIS layer[^25] |
| HUD Multifamily Assistance & Section 8 Contracts[^26] | Property ID (join contract + property tables) |
| HUD Picture of Subsidized Households[^19] | Project/property level with census tract |
| HUD LIHTC Database[^27] | Property address, lat/lon, census tract |
| USDA Section 515/514 Portfolio[^30] | Lat/lon coordinates, property address |
| USDA MF Exit/Prepay Data[^31] | Property-level loan data |
| Fannie Mae MFLPD (via Data Dynamics)[^74] | Loan-level (no direct address; MSA derived) |
| Fannie Mae DUS Disclose[^6] | Pool- and loan-level; property address available |
| Fannie Mae SF Loan Performance Data[^2] | Loan-level; census tract geocode |
| Freddie Mac SF Loan-Level Dataset[^7] | Loan-level; state, ZIP in schema |
| Freddie Mac STACR (via Clarity)[^15] | Loan-level reference pool |
| FFIEC HMDA LAR[^45] | Application-level; census tract, MSA |
| Ginnie Mae Bulk Disclosure[^54] | Pool- and loan-level by CUSIP |
| GSA FRPP FY2024[^71] | Asset-level; address, agency, use type |
| SBA 7(a)/504 FOIA[^42] | Loan-level; borrower ZIP, address |
| NMTC QLICI Projects[^39] | Project address |

**Summary / Index Level Only** (no property-level PIN; useful for market-context tiles but not map overlays):

- Freddie Mac AIMI (metro-level index)[^9]
- Freddie Mac PMMS (national rate)[^10]
- Freddie Mac Multifamily Outlook PDF (aggregate forecasts)[^12]
- FHFA HPI (area-aggregated price index)[^58]
- FHFA PUDB Multifamily (census tract aggregates)[^63]
- FHFA NMDB Aggregate Statistics[^64]
- FDIC BankFind Financials API (institution-level)[^49]
- HUD CHAS API (census tract)[^22]
- HUD FMR API (county/metro)[^23]
- OZ/NMTC tract lists (census tract eligibility)[^37][^38]
- Ginnie Mae Monthly Issuance Reports (national aggregates)[^56]
- Fannie Mae CAS Deal Reports (deal-level)[^75]
- USCIS/DOL LCA data (employer/city level)[^68]

***

### (C) FOIA Wall — What Requires a Request and How to Expedite

Several of the most operationally valuable datasets sit behind a partial or full FOIA wall. Teams launching in 59 days should file requests immediately.

**Datasets partially or fully behind FOIA or access barriers:**

- **USDA Section 538 Guaranteed Loan Portfolio (current)**: The data.gov CSV is a static 2016 snapshot. Current loan-level data for the ~$400M+ annual 538 program requires a FOIA request to USDA Rural Development. File at: `https://www.rd.usda.gov/about-rd/foia`. Request "Section 538 active guaranteed loan portfolio, property-level, as of most recent quarter" in Excel format. Processing typically takes 20–60 business days; expedited processing is available if demonstrating public interest urgency — cite the terminal's public market transparency mission.[^34]

- **HUD Aged Receivables / Watchlist (HUD MF)**: HUD's internal Aged Receivables Report tracking delinquent or at-risk FHA-insured multifamily mortgages is not routinely published. It is available via FOIA request to HUD Office of Multifamily Housing at MFProductionHQ@hud.gov or through the HUD FOIA portal at `https://www.hud.gov/FOIA`. Request "Multifamily Aged Receivables Report and Watchlist, current quarter." Median response time is 30–90 days; expedite by citing commercial urgency per 5 U.S.C. § 552(a)(6)(E).

- **GSA FRPP — National Security Exclusions**: The public FRPP dataset omits properties excluded for national security and FOIA reasons. Agencies individually determine exclusions. The excluded property count and aggregate square footage by agency is accessible in the FRPP Summary Report without FOIA. For specific excluded assets, agency-level FOIA requests are required.[^71]

- **USDA MF Current Active Portfolio (MFH)**: The sc.egov.usda.gov dataset has a last-published date of 2020. A FOIA request to USDA RD will yield the current active MFH portfolio. Direct: `https://www.rd.usda.gov/about-rd/foia`.[^32]

- **Fannie Mae / Freddie Mac Internal Watchlists and Non-Public Servicer Reports**: DUS lender-level default and loss data beyond what is published in the MFLPD are available only to approved DUS lenders or via structured FOIA requests to FHFA (as conservator). File at: `https://www.fhfa.gov/about/foia`. Note that FHFA treats some Fannie/Freddie operational data as exempt under FOIA Exemption 4 (trade secrets) and Exemption 8 (bank examination reports).

**Recommended FOIA filing sequence for a 59-day launch:** File the USDA 538 and HUD Aged Receivables requests within 48 hours of reading this report. Both are high-value, low-controversy datasets likely to receive partial responses within the 59-day window. Requests to FHFA for non-public Fannie/Freddie data should be filed for future roadmap value but are unlikely to resolve within the launch timeline.

---

## References

1. [Updated Multifamily Loan Performance Data and DUS Prepayment ...](https://capitalmarkets.fanniemae.com/credit-risk-transfer/multifamily-credit-risk-transfer/mf-loan-performance-data-dus-prepayment-history-available-data-dynamics-q4-2023) - The Multifamily Loan Performance Data, accessible on Data Dynamics, has been updated with loan acqui...

2. [Fannie Mae Single-Family Loan Performance Data](https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/fannie-mae-single-family-loan-performance-data) - The HARP dataset contains approximately one million 30-year fixed rate mortgage loans that are in th...

3. [Data Dynamics – Data Analytics Tool | Fannie Mae - Capital Markets](https://capitalmarkets.fanniemae.com/tools-applications/data-dynamics) - Data Dynamics is the only free data analytics platform for market participants to evaluate and analy...

4. [Fannie Mae Announces 2025 Connecticut Avenue Securities (CAS ...](https://www.fanniemae.com/newsroom/fannie-mae-news/2025-connecticut-avenue-securities-cas-issuance-calendar) - We currently expect total CAS volume of around $4 billion across 5-7 transactions," said Kathleen Pa...

5. [Fannie Mae Launches DUS Disclose Website - PR Newswire](https://www.prnewswire.com/news-releases/fannie-mae-launches-dus-disclose-website-300565905.html) - The new DUS Disclose website replaces the Multifamily Securities Locator Service (MFSLS) and provide...

6. [Fannie Mae DUS Disclose Now Live with Expanded Multifamily ...](https://capitalmarkets.fanniemae.com/mortgage-backed-securities/multifamily-mbs/dus-disclose-expanded-multifamily-social-disclosures) - Expanded affordability disclosures for multifamily pools are now available in DUS Disclose, Fannie M...

7. [Single Family Loan-Level Dataset - Freddie Mac](https://www.freddiemac.com/research/datasets/sf-loanlevel-dataset) - Monthly loan performance data, including credit performance information up to and including property...

8. [Apartment Investment Market Index® - Freddie Mac Multifamily](https://mf.freddiemac.com/aimi) - The Freddie Mac Multifamily Apartment Investment Market Index (AIMI) can help you determine how the ...

9. [About Apartment Investment Market Index® (AIMI®)](https://mf.freddiemac.com/aimi/about) - AIMI estimates how the multifamily investment environment changes over time nationally and in select...

10. [[XLS] Current Mortgage Rates Data Since 1971​xlsx - Freddie Mac](https://www.freddiemac.com/pmms/docs/historicalweeklydata.xlsx) - Although Freddie Mac attempts to provide reliable, useful information in this document Freddie Mac d...

11. [Freddie Mac Updates Its Mortgage Rate Survey](https://nationalmortgageprofessional.com/news/freddie-mac-updates-its-mortgage-rate-survey) - Beginning Thursday, Freddie Mac will debut a revised version of its Primary Mortgage Market Survey (...

12. [[PDF] 2025 Multifamily Outlook](https://mf.freddiemac.com/docs/2025_multifamily_outlook.pdf) - The Fred forecasts the 10-year rate to be around 4% in late 2025. Page 4. 2025 Multifamily Outlook |...

13. [2025 Multifamily Outlook - YouTube](https://www.youtube.com/watch?v=hcpbhQPAm70) - To learn more or read the full report, visit our website at https://mf.freddiemac.com/research.

14. [STACR® (Structured Agency Credit Risk) - Capital Markets](https://capitalmarkets.freddiemac.com/crt/securities) - STACR (Structured Agency Credit Risk) reduces U.S. taxpayer credit exposure through the issuance of ...

15. [How to Download Annex II and Annex XII Files for STACR Deals](https://capitalmarkets.freddiemac.com/crt/resources/regulatory-information/how-to-download-annex-ii-and-annex-xii-files-for-stacr-deals) - Download the applicable EU files using the “Current Reporting Period Download” or “Custom Download.”...

16. [HUD Insured Multifamily Mortgages | HUD.gov / U.S. Department of ...](http://www.hud.gov/hud-partners/multifamily-fhasl-active) - These MS Excel files include all active and terminated FHA Multifamily insured mortgages and are upd...

17. [Multifamily Data | HUD.gov / U.S. Department of Housing and Urban ...](http://www.hud.gov/hud-partners/multifamily-data) - Multifamily publishes a quarterly database of FHA Multifamily Firm Commitments and Initial Endorseme...

18. [A Picture of Subsidized Households Volume 11, United States](https://www.huduser.gov/portal/publications/A-Picture-of-Subsidized-Households-Volume-11-United-States-Large-Projects-Agencies.html) - The reports cover approximately 4.5 million HUD-subsidized housing units and 300,000 Low Income Hous...

19. [Picture of Subsidized Households: HUD-Assisted Housing Data](https://www.huduser.gov/portal/datasets/assthsg.html) - All programs covered in this report provide subsidies that reduce rents for low-income tenants who m...

20. [Multifamily Housing - Physical Inspection Scores By State - HUD](http://www.hud.gov/stat/mfh/inspection-scores) - HUD assesses the physical condition of all HUD related multifamily projects pursuant to its regulati...

21. [Multifamily Property / Contract / Rent & Utility Allowance Datasets ...](http://www.hud.gov/hud-partners/multifamily-preservation) - The information has been compiled from multiple data sources within FHA or its contractors. This inf...

22. [CONSOLIDATED PLANNING/CHAS Dataset API Documentation](https://www.huduser.gov/portal/dataset/chas-api.html) - Use the API Tester to make API calls to CHAS Dataset. The API Tester requires an access token. If yo...

23. [HUD Fair Market Rent API | FMR Data Access & Documentation](https://www.huduser.gov/portal/dataset/fmr-api.html) - The base URL for all FMR API endpoints is https://www.huduser.gov/hudapi/public/fmr. The table below...

24. [Data Catalog | HUD Data](https://data.hud.gov/datasets) - Explore HUD's comprehensive data catalog. Find datasets related to housing, community development, f...

25. [HUD-Insured Multifamily Properties - Catalog - Data.gov](https://catalog.data.gov/dataset/hud-insured-multifamily-properties) - The FHA insured Multifamily Housing portfolio consists primarily of rental housing properties with f...

26. [Multifamily Assistance & Section 8 Database - HUD](https://www.hud.gov/hud-partners/multifamily-assist-section8-database) - Download of the Assistance and Section 8 Contracts - This compressed, (self extracting) file is offe...

27. [LIHTC Database Access: Property Data - HUD User](https://www.huduser.gov/portal/datasets/lihtc/property.html) - HUD's LIHTC database contains information on 54,102 projects and 3.7 million housing units placed in...

28. [LIHTC Database Access - HUD User](https://www.huduser.gov/lihtc/) - Data are now available for projects placed in service through 2023. Data for properties placed in se...

29. [HUD PD&R Datasets | Housing & Community Development Data](https://www.huduser.gov/portal/pdrdatas_landing.html) - Browse HUD PD&R datasets covering housing markets, income limits, fair market rents, homelessness, a...

30. [USDA Rural Development Multifamily Section 515 Rural Rental ...](http://catalog.data.gov/dataset/usda-rural-development-multifamily-section-515-rural-rental-housing-and-section-514-farm-l) - Includes latitude and longitude coordinates, property address, type of development, date of operatio...

31. [USDA Rural Development Multi-Family Housing Program Exit Data](http://catalog.data.gov/dataset/usda-rural-development-multi-family-housing-program-exit-data) - This dataset provides loan-level information on when USDA Section 514 and 515 properties are project...

32. [Multi-Family Housing (MFH)](https://www.sc.egov.usda.gov/data/MFH.html) - Multi-Family Housing (MFH). Welcome to the Rural Development (RD) Dataset Web site. In an attempt to...

33. [RD Datasets](https://www.sc.egov.usda.gov/data/data_files.html) - ... rural rental housing and farm labor housing projects. Multi-Family Support used in servicing MFH...

34. [USDA Rural Development Section 538 Multifamily Guaranteed ...](http://catalog.data.gov/dataset/usda-rural-development-section-538-multifamily-guaranteed-loans-as-of-7-13-2016) - Download. USDA Section 538 Multifamily Guaranteed Loan Program_Public Data Dictionary_July 2016. APP...

35. [FHA Single Family REO Properties For Sale - Catalog - Data.gov](http://catalog.data.gov/dataset/fha-single-family-reo-properties-for-sale) - This service provides data on Federal Housing Administration (FHA) single family, Real Estate Owned ...

36. [Homes for Sale | HUD.gov / U.S. Department of Housing and Urban ...](http://www.hud.gov/helping-americans/homes-for-sale) - HUD sells both single family homes and multifamily properties. Check them out- one might be just wha...

37. [Opportunity Zones Resources | Community Development Financial ...](https://www.cdfifund.gov/opportunity-zones) - The CDFI Fund is supporting the IRS with the Opportunity Zone nomination and designation process und...

38. [CDFI Information Mapping System (CIMS)](https://www.cdfifund.gov/mapping-system) - Qualified Census Tracts and Counties: Users may download lists of tracts or counties indicating whet...

39. [NMTC Mapping Tool | Novogradac](https://www.novoco.com/resource-centers/new-markets-tax-credits/nmtc-mapping-tool) - Free mapping tool that shows NMTC eligible, severe distress and non-metropolitan census tracks (base...

40. [CDFI Fund Update: Public Data for NMTC Program (2003-2019 ...](https://content.govdelivery.com/accounts/USTREASCDFI/bulletins/2c9b2fc) - Through 16 application rounds of the NMTC Program, the CDFI Fund has made 1,254 awards, allocating a...

41. [New Markets Tax Credit Program](https://www.cdfifund.gov/programs-training/programs/new-markets-tax-credit) - Access the CDFI Fund's database systems below. Use the Awards Database search to find CDFI Fund awar...

42. [FOIA - 7(a) (FY2020-Present) asof 260331.csv](https://data.sba.gov/en/dataset/7-a-504-foia/resource/d67d3ccb-2002-4134-a288-481b51cd3479) - There are four files for the 7(a) loan program that segment the data by decade. There are two files ...

43. [7(a) & 504 FOIA - 7a_504_FOIA Data Dictionary as of 260331.xlsx](https://data.sba.gov/en/dataset/7-a-504-foia/resource/6898b986-a895-47b4-bb7e-c6b286b23a7b) - There are four files for the 7(a) loan program that segment the data by decade. There are two files ...

44. [Lender reports | U.S. Small Business Administration - SBA](https://www.sba.gov/partners/lenders/lender-reports) - Using the links below, you can specify additional filters, and download results in spreadsheet or CS...

45. [2025 HMDA Data on Mortgage Lending Now Available](https://www.consumerfinance.gov/about-us/newsroom/2025-hmda-data-on-mortgage-lending-now-available/) - The 2025 HMDA Loan Application Register data can be found on the FFIEC's HMDA Platform: https://ffie...

46. [[PDF] Mortgage Disclosure Act Data and Link - State Bank of Faribault](https://www.tsbf.com/assets/files/bxijHvjt) - Home Mortgage Disclosure Act Data and Link. HMDA Data Browser (cfpb.gov). To view The State Bank of ...

47. [2021 Home Mortgage Disclosure Act (HMDA) datasets released by ...](http://www.aeaweb.org/forum/2701/2021-home-mortgage-disclosure-hmda-datasets-released-ffiec) - The 2021 data include information on 23.3 million home loan applications. Among them, 21.1 million w...

48. [FFIEC Announces Availability of 2019 Data on Mortgage Lending](https://ncua.gov/newsroom/press-release/2020/ffiec-announces-availability-2019-data-mortgage-lending) - Dynamic National Loan-Level Dataset (Opens new window) is updated, on a weekly basis, to reflect lat...

49. [BankFind Suite - API Documentation - FDIC](https://api.fdic.gov/banks/docs) - Overview. FDIC's application programming interface (API) lets developers access FDIC's publically av...

50. [Federal Deposit Insurance Corporation - FDIC BankFind Suite API](http://catalog.data.gov/dataset/fdic-bankfind-suite-api) - FDIC's application programming interface (API) lets developers access FDIC's publicly available bank...

51. [Build an Automated FDIC Call Report Analysis System with n8n (Free](https://www.atherial.ai/how-to-build-an-automated-fdic-call-report-analysis-system-with-n8n-free-template-mffvx2) - Automate quarterly FDIC Call Report downloads, calculate CRE exposure ratios, and rank U.S. banks by...

52. [Bulk Data Download - FDIC: BankFind Suite - API Documentation](https://banks.data.fdic.gov/bankfind-suite/bulkData/bulkDataDownload) - Use these definition files to help you understand the bulk data: Institutions Definitions (CSV forma...

53. [Call Report - FFIEC](https://cdr.ffiec.gov) - Through this site you can obtain Reports of Condition and Income (Call Reports) and Uniform Bank Per...

54. [Ginnie Mae](https://bulk.ginniemae.gov) - Disclosure Data Download Files ; MULTIFAMILY POOL AND LOAN MONTHLY PORTFOLIO DISCLOSURE · MULTIFAMIL...

55. [Disclosure Data Download Layouts and Sample Files - Ginnie Mae](https://www.ginniemae.gov/data_and_reports/disclosure_data/Pages/bulk_data_download_layout.aspx) - Disclosure Data Download makes available daily, weekly, factor, and monthly disclosure information a...

56. [Monthly Issuance Reports - Ginnie Mae](https://www.ginniemae.gov/data_and_reports/reporting/Pages/monthly_issuance_reports.aspx) - Monthly Issuance Reports​. Ginnie Mae's Monthly Issuance Reports can ​be downloaded in Portable Docu...

57. [Disclosure Search Tools - Ginnie Mae](https://www.ginniemae.gov/investors/investor_search_tools/Pages/DisclosureSearchTools.aspx) - ​Search Tax, Pool, RPB and Factor Data using a list of Pool numbers and/or CUSIPs. View by current f...

58. [FHFA House Price Indexes (HPIs) - Catalog - Data.gov](https://catalog.data.gov/dataset/fhfa-house-price-indexes-hpis-948c6/resource/823aac87-188d-43fd-8980-e93f3c90ee24) - Download. More Details. FHFA House Price Indexes (HPIs). URL: https://www.fhfa.gov/hpi/download/mont...

59. [FHFA House Price Index® Up 0.4 Percent in August](https://www.fhfa.gov/news/news-release/fhfa-house-price-index-up-0.4-percent-in-august-up-2.3-percent-from-last-year) - U.S. house prices rose 0.4 percent in August, according to the U.S. Federal Housing (FHFA) seasonall...

60. [FHFA House Price Index](https://www.fhfa.gov/data/hpi) - The FHFA HPI is a weighted, repeat-sales index, meaning that it measures average price changes in re...

61. [FHFA House Price Index® Frequently Asked Questions](https://www.fhfa.gov/faqs/hpi) - The FHFA HPI® data are freely available for download at https://www.fhfa.gov/data/hpi. To cite the i...

62. [Datasets - FHFA](https://www.fhfa.gov/data/datasets) - The survey provided monthly information on interest rates, loan terms, and house prices by property ...

63. [Public Use Database - FHFA](https://www.fhfa.gov/data/public-use-database) - The Enterprise Multifamily Public Use Database Dashboard provides users an interactive way to genera...

64. [National Mortgage Database (NMDB®) Aggregate Statistics - FHFA](https://www.fhfa.gov/data/nmdb) - 2) Alternate wide format CSV files are available. The wide format may be more easily opened by MS Ex...

65. [Update on the Discontinuation of FHFA's Monthly Interest Rate ...](https://www.fhfa.gov/data/mirs) - This new index is called “MIRS Transition Index” and will be published on fhfa.gov on the final Thur...

66. [Foreclosure Prevention, Refinance, and FPM Report - 1Q2025 - FHFA](https://www.fhfa.gov/reports/foreclosure-prevention-refinance-and-fpm/2025/Q1) - Initiated forbearance plans dropped to 31,010 in the first quarter of 2025 from 46,902 in the fourth...

67. [OFLC Releases Public Disclosure Data and Selected Program ...](https://www.aila.org/library/oflc-releases-public-disclosure-data-and-selected-program-statistics-for-q1-of-fy26) - OFLC released public disclosure data through Q1 of FY26 and selected program statistics for Q1 of FY...

68. [Performance Data | U.S. Department of Labor](https://www.dol.gov/agencies/eta/foreign-labor/performance) - OFLC will continue to publish and publicly release program data on our website through our quarterly...

69. [Data Refresh Status, When was website Data Updated - H1BGrader](https://h1bgrader.com/data-refresh-status) - We update data on the website periodically as USCIS, US Department of Labor, DHS, and other agencies...

70. [OFLC Releases New Public Data on Foreign Labor Certifications](https://www.envoyglobal.com/news-alert/oflc-releases-new-public-data-on-foreign-labor-certifications/) - Quarterly Application Data: OFLC has published public disclosure files and program statistics for Q3...

71. [Federal Real Property Public Data Set | GSA](https://www.gsa.gov/policy-regulations/policy/real-property-policy-division-overview/asset-management/federal-real-property-profile/federal-real-property-public-data-set) - The most recent edition of FRPP data currently accessible on this site represents the government's i...

72. [FY 2024 Federal Real Property Profile (FRPP) Public Dataset](http://catalog.data.gov/dataset/fy-2024-federal-real-property-profile-frpp-public-dataset) - The Federal Real Property Profile Management System (FRPP MS) is the federal government's centralize...

73. [FRPP Summary Report Library - GSA](https://www.gsa.gov/policy-regulations/policy/real-property-policy-division-overview/data-collection-and-reports/frpp-summary-report-library) - The Federal Real Property Profile Summary Report Library provides copies of all FRPP and Worldwide I...

74. [Multifamily Loan Performance Data - Capital Markets - Fannie Mae](https://capitalmarkets.fanniemae.com/credit-risk-transfer/multifamily-credit-risk-transfer/multifamily-loan-performance-data) - The Multifamily Loan Performance Data (MFLPD) is designed to give market participants information th...

75. [Connecticut Avenue Securities Transactions | Fannie Mae](https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/connecticut-avenue-securities/connecticut-avenue-securities-transactions) - Connecticut Avenue Securities Transactions. This CAS transactions page provides documentation and da...

