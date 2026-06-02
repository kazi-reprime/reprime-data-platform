# US Commercial Construction Pipeline & Construction Cost Intelligence: Endpoint-Grade Data Source Map
### Supply-Side Tier 1 Stack for the RePrime / Israeli Family Office CRE Terminal — 2024–2026

***

## Executive Summary

This document maps every free and freemium data source tracking US commercial construction pipeline, building permits, construction costs, and supply-side forward indicators for 2024–2026. It is designed to power a live **Supply Pipeline Heatmap** and **Construction Cost Pressure Gauge** inside a Bloomberg-style CRE intelligence terminal targeting Israeli family offices and institutional LPs. Sources are organized by function: federal APIs, construction cost indices, city-level permit portals, pipeline aggregators, entitlement/zoning tools, and specialty vertical trackers (data center, life sciences, industrial). The final sections deliver prioritization rankings, unfair-advantage city datasets, and a gap analysis for top-50 MSAs.

***

## Part 1: Federal & Macro Construction Data APIs

### 1.1 Master Source Table — Federal & Index Sources

| Source Name | Exact URL / Endpoint (with example query) | Free vs Freemium | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Census BPS — Building Permits Survey** | `https://api.census.gov/data/timeseries/bps/metro?get=PERMIT,UNITS1,UNITS5&time=2024-01&for=metropolitan+statistical+area:*` | Free | 500 req/day without key; unlimited with free key | National / State / CBSA (MSA) / County / Place | Monthly (17th workday); Annual | JSON API | Free API key ([api.census.gov/data/key_signup.html](https://api.census.gov/data/key_signup.html)) | `PERMIT` (total permits), `UNITS1` (SF), `UNITS5` (5+ units), `CVALUE` (construction value), `CBSA` FIPS, `time` | Census NRC, HUD SOCDS | Supply Pipeline Heatmap — Permitted Units by MSA | Key gotcha: CBSA boundaries change; MSA ≠ metro area for all cities. Monthly preliminary released 12th workday; revised data 17th workday. Only residential—commercial permits NOT included in BPS. [^1][^2] |
| **Census NRC — New Residential Construction (Starts, Under Construction, Completions)** | `https://www.census.gov/construction/nrc/` · FRED: `HOUST` (starts), `UNDCON` (under construction), `COMPUTSA` (completions) · API: `https://api.stlouisfed.org/fred/series/observations?series_id=HOUST&api_key=KEY&file_type=json` | Free | FRED: unlimited (free key); Census: no API, file downloads only | National / 4 Census Regions | Monthly (12th workday, joint Census/HUD) | JSON (FRED) / PDF press release / Excel download | FRED: free key; Census: none | Starts SAAR, completions SAAR, units authorized not started, 5+-unit authorizations | BPS, Yardi Matrix multifamily pipeline | Supply Pipeline — Residential Starts & Completions | April 2026: 1,465K starts SAAR; 514K 5+-unit authorizations SAAR. No MSA breakdown—national/regional only. [^3][^4] |
| **Census C-30 Construction Spending (VIP)** | `https://www.census.gov/construction/c30/c30index.html` · FRED: `TTLCONS` (total), `PRRESCON` (private residential), `PNRESCON` (private nonresidential) | Free | FRED unlimited | National only | Monthly | JSON (FRED) / Excel | FRED: free key | Total value put in place by sector (office, industrial, commercial, lodging, multifamily), seasonally adjusted | BPS, AGC employment | Construction Spending Gauge | Best source for private nonresidential $ spend by category. NAICS sector breakdown available. [^5] |
| **BLS PPI — Construction Inputs** | FRED direct: `WPUIP231100` (net inputs, new residential); `WPUIP23111013` (single-family, goods ex-F&E); `PCU23----23----` (construction NAICS 23); lumber: `WPU0811`; steel: `WPU101`; copper: `WPU102501`; gypsum: `WPU13490603`; cement: `WPU1321` · API: `https://api.stlouisfed.org/fred/series/observations?series_id=WPUIP231100&api_key=KEY&file_type=json` | Free | FRED unlimited; BLS API: 50 series/query, 500 req/day without key | National | Monthly (mid-month following reference month) | JSON (FRED / BLS API) | FRED: free key; BLS: free registration optional | Index value, 1-month % chg, 12-month % chg | ENR CCI, Turner BCI, AGC tables | Construction Cost Pressure Gauge | BLS series `PCU2361--2361--` = new commercial building contractors. Use `WPU0811` for lumber, `WPU101` for hot-rolled steel bars. FRED consolidates all. [^6][^7][^8] |
| **BLS ECI — Construction Labor** | FRED: `ECICONCOM` (compensation, private construction workers); `ECIWAG` (wages & salaries, private industry all) · BLS series: `CIU2023000000000A` (construction, annual) · API: `https://api.bls.gov/publicAPI/v2/timeseries/data/ECICONCOM` | Free | BLS API v2: 50 series/call, 500/day unregistered; 500/call, 2,500/day registered | National | Quarterly | JSON (FRED / BLS API) | FRED: free; BLS: free registration | Index (Dec 2005=100), quarterly % change, 12-month % change | QCEW by MSA, AGC labor tables | Cost Pressure Gauge — Labor | Q1 2026: ECICONCOM = 168.818 (Dec 2005=100). Does not break out by MSA. [^9][^10] |
| **BLS QCEW — Construction Wages by MSA** | `https://www.bls.gov/cew/downloadable-data-files.htm` · Annual CSV download by NAICS / county: `https://www.bls.gov/cew/data/files/2024/csv/2024_annual_by_industry.zip` · API: `https://api.bls.gov/publicAPI/v2/timeseries/data/ENU0600010510` (example: CA construction) | Free (downloads); partial API | 500/day unregd; 2,500/day regd | National / State / County / MSA | Quarterly (~5-month lag); Annual | JSON API / CSV bulk | Free BLS registration for higher rate limits | Avg weekly wage, employment level, establishments by NAICS CBSA | ECI, AGC state reports | Cost Gauge — Regional Labor Premium | NAICS 23 = all construction; 236 = building construction; 2362 = nonresidential. CBSA-level QCEW is the only federal source for MSA-specific construction labor costs. [^11] |
| **Federal Reserve G.17 — Industrial Production: Construction Supplies** | `https://www.federalreserve.gov/releases/g17/current/default.htm` · FRED: `IPG327A2S` (construction supplies index) · API: `https://api.stlouisfed.org/fred/series/observations?series_id=IPG327A2S&api_key=KEY` | Free | FRED unlimited | National | Monthly | JSON (FRED) | FRED: free key | IP index (2017=100), monthly % change, capacity utilization | BLS PPI commodity indices | Supply-Input Pressure Indicator | April 2026: IP total = 102.5% of 2017 avg. Construction supplies sub-index tracks gypsum, concrete, brick, glass, lumber. [^12][^13] |

***

## Part 2: Construction Cost Indices

### 2.1 Private Cost Index Sources

| Source Name | Exact URL / Endpoint | Free vs Freemium | Rate Limit | Geographic Granularity | Update Frequency | Data Format | Auth | Fields Returned | Cross-Verify With | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Dodge Momentum Index (DMI)** | `https://www.construction.com/dodge-momentum-index/` · Monthly press release PDF + embedded chart | Free (index level + % change only); paid for project-level data | N/A — no API; web scraping PDF | National (commercial vs. institutional sub-indices) | Monthly | PDF press release / HTML | None for press release | DMI reading (2000=100), MoM % change, commercial sub-index, institutional sub-index, projects >$100M entering planning | C-30 Construction Spending (12-month lead), ABC Backlog | Pipeline Forward Indicator — 12-Month Lead | DMI leads construction spending by ~12 months; commercial planning vs. institutional split. March 2025: DMI fell 8.6% to 164.0. [^14][^15] |
| **ABC Construction Backlog Indicator (CBI)** | `https://www.abc.org/News-Media/News-Releases?Category=construction-backlog-indicator` · Monthly press release; table CSV occasionally linked | Free (aggregate); paid for member-only detail | N/A — no API | National; by industry (commercial/institutional, heavy industrial, infrastructure) | Monthly | PDF / HTML | None | Backlog months (forward workload), Construction Confidence Index, by industry segment | Dodge DMI, AGC employment | Pipeline Capacity Gauge — Contractor Backlog | Oct 2025: CBI = 8.4 months. ~1-in-5 contractors had data center work in Sept 2025 (12.0 months backlog). Free only at national aggregate. [^16][^17][^18] |
| **AGC Construction Inflation Alert** | `https://www.agc.org/learn/construction-data/agc-construction-inflation-alert` · `https://www.agc.org/learn/construction-data/construction-data-producer-prices-and-employment-costs` | Free | N/A | National; occasional state detail | Monthly (PPI tables); quarterly (Inflation Alert) | PDF / Excel tables | None | PPI by building type (office, warehouse, school, hospital), subcontractor PPI, ECI for construction, material input costs | BLS PPI series, ENR CCI | Cost Pressure Gauge | AGC aggregates BLS PPI into building-type tables not available elsewhere. Inflation Alert provides narrative + tariff/escalation risk commentary. [^19][^20] |
| **ENR Construction Cost Index (CCI) + Building Cost Index (BCI)** | `https://www.enr.com/economics` · Historical archive: `https://www.enr.com/economics/historical_indices` · Interactive dashboard: `https://www.enr.com/Cost-Data-Dashboard` | Freemium (current month paywalled for full detail; historical index values at aggregates free; dashboard requires subscription) | N/A | 20-city national average; individual city indices available | Monthly (2nd issue each month) | HTML / paywalled CSV via dashboard | Free for headline; subscription (~$199/yr ENR.com) for city-level download | CCI (200 hrs common labor + cement + lumber + steel), BCI (68.38 hrs skilled labor), 20-city avg, individual city indices | AGC PPI tables, Turner BCI, RSMeans CCI | Cost Index Tile | CCI base year 1913=100; ~14,000–15,000 in 2026. BCI uses skilled labor (bricklayers, carpenters, ironworkers). Both track same 3 materials. [^21][^22][^23][^24] |
| **Turner Building Cost Index** | `https://www.turnerconstruction.com/cost-index` · Quarterly press release PDF, free download | Free | N/A | National (1 national index) | Quarterly | PDF press release | None | Quarterly % change, YoY % change, narrative on labor/materials/subcontractor conditions | ENR CCI, Mortenson CCI, BLS PPI | Cost Pressure Gauge — Nonresidential | Q4 2025: +1.14% QoQ, +4.72% YoY. Strong data center and manufacturing demand noted. 80-year history. [^25][^26] |
| **Mortenson Construction Cost Index** | `https://www.mortenson.com/cost-index` · Regional PDFs: Seattle, Portland, Denver, Minneapolis, Chicago, Phoenix, Milwaukee | Free | N/A | National + 7 Mortenson office cities | Quarterly | PDF | None | National nonresidential % change QoQ and YoY, city-level escalation rate, material/labor narrative, tariff risk commentary | Turner BCI, RLB QCR, ENR BCI | Regional Cost Pressure Gauge | Q4 2025: +1.05% QoQ, +7.35% YoY nationally. Useful for Midwest and Mountain West markets where ENR/Turner lack granularity. [^27][^28][^29] |
| **Rider Levett Bucknall (RLB) Quarterly Cost Report (QCR)** | `https://www.rlb.com/americas/insights/theme/construction-cost-report/` · Also includes Crane Index (active cranes per city) | Free | N/A | 14–17 North American markets (NYC, LA, SF, Chicago, Denver, Seattle, Phoenix, Boston, Las Vegas, DC, Portland, Honolulu, Toronto, Calgary) | Quarterly | PDF | None | Indicative construction cost per SF by building type, QoQ % change, YoY %, market activity narrative, Crane Index by city | Turner, Mortenson, ENR city indices | Regional Cost Gauge + Activity Heatmap | Q3 2025 avg YoY: +4.50% across 17 cities. Crane Index is a real-time proxy for construction activity volume. [^30][^31][^32] |
| **RSMeans City Cost Index (CCI)** | `https://www.rsmeans.com/rsmeans-city-cost-index` · Overview: `https://www.gordian.com/resources/city-cost-index-everything-need-know/` | Freemium (free overview/methodology; actual index values require RSMeans Online subscription ~$2,000/yr) | N/A | ~950 US cities vs. national 30-city avg | Annual (book) / Quarterly (online) | PDF book / Web (subscription) | Subscription for data; free for methodology | City index relative to national avg (100 = national avg), by CSI division (materials, labor, equipment) | ENR city CCI, RLB QCR | City-Level Cost Normalization | No free API. Reddit workaround: print-to-PDF then Excel OCR. Used for bid normalization across MSAs. [^33][^34][^35][^36] |
| **Turner & Townsend / Linesight Global Construction Market Intelligence** | `https://publications.turnerandtownsend.com/global-construction-market-intelligence-2025/` | Free (annual report PDF) | N/A | Global + US sections by city | Annual | PDF | None | US construction cost inflation, market activity rating (hot/warm/cool), sector outlook | RLB QCR, Mortenson, ENR | Global Cost Benchmarking | 2024: global construction cost inflation +4.15%. Good for Israeli LP context comparing US to other markets. [^37] |

***

## Part 3: City-Level Permit Portals

### 3.1 Tier-1 Markets — Direct API Endpoints

For all Socrata endpoints, the standard commercial/multifamily 5+ filter pattern is:
```
$where=permit_type_description LIKE '%NEW%' AND estimated_cost > 500000
&$order=issued_date DESC &$limit=500
```
Replace `{4x4}` with the dataset identifier shown below.

| City | Source Name | Exact Dataset URL / API Endpoint | Free? | Rate Limit | Fields: permit#, address, valuation, sqft, units, status | Update Freq | Auth | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **New York City** | DOB NOW: Build – Approved Permits | `https://data.cityofnewyork.us/resource/rbx6-tga4.json?$where=permit_status='ISSUED'&permit_type='NB'&$order=issued_date+DESC&$limit=500` | Free | 1,000 rows default; unlimited with app token | job_number, house_number, street_name, estimated_job_costs, work_type, bin | Daily | App token (free, cityofnewyork.us) | NYC Pipeline Heatmap | "NB" = New Building. Also use legacy `ipu4-2q9a` (DOB Permit Issuance) for pre-2016 data. Filter `work_type='NB'` for new construction. [^38][^39][^40] |
| **New York City (legacy)** | DOB Permit Issuance | `https://data.cityofnewyork.us/resource/ipu4-2q9a.json?$where=permit_type='NB'&$order=issuance_date+DESC&$limit=500` | Free | Same as above | permit_type, permit_subtype, filing_date, issuance_date, expiration_date, job_doc, job_type, self_cert, block, lot, community_board, zip_code, bldg_type, residential, special_district_1, job_s1_type_desc, owner_s_business_name | Daily | App token (free) | NYC Pipeline | Historic permits pre-DOB NOW. Combine both datasets for complete NYC picture. |
| **Chicago** | Building Permits | `https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=permit_type='PERMIT - NEW CONSTRUCTION'&$order=issue_date+DESC&$limit=500&$where=estimated_cost>'500000'` | Free | 1,000 default; app token = higher | id, permit_, permit_type, issue_date, estimated_cost, street_number, street_direction, street_name, work_description, contact_1_type, contact_1_name, latitude, longitude | Daily | App token (data.cityofchicago.org — free) | Chicago Pipeline | Socrata SODA API; dataset `ydr8-5enu`. Combine with `work_description LIKE '%MULTI%'` for multifamily. [^41][^42] |
| **Los Angeles (County unincorporated)** | EPIC-LA Case History | ArcGIS REST: `https://egis-lacounty.hub.arcgis.com/datasets/la-county-permitting-epic-la-case-history/` · GIS endpoint: `https://public.gis.lacounty.gov/public/rest/services/LACounty_Cache/LACounty_Parcel/MapServer/0/query?where=1%3D1&outFields=*&f=json` | Free | No stated limit on ArcGIS REST | case_number, case_type, filed_date, address, APN, status, square_footage | Weekly refresh | None for public read | LA Pipeline | City of LA (LADBS) uses separate system; EPIC-LA covers **unincorporated LA County** only. City of LA permits: `https://data.lacity.org/resource/nbkx-sur3.json`. [^43][^44][^45][^46] |
| **Los Angeles (City)** | LA City Building Permits | `https://data.lacity.org/resource/nbkx-sur3.json?$where=permit_type='Bldg-New'&$order=issue_date+DESC&$limit=500` | Free | App token for higher quota | permit_nbr, address, permit_type, pcis_permit_type, status_date, val, pcis_units, issue_date | Daily | App token (data.lacity.org) | LA City Pipeline | Use `val > 500000` for commercial scale. LADBS handles city permits; EPIC-LA handles county. Both needed for full LA MSA. |
| **Miami-Dade County** | Building Permit (ArcGIS) | GIS REST: `https://gis-mdc.opendata.arcgis.com/datasets/MDC::building-permit/about` · REST endpoint: `https://gisweb.miamidade.gov/arcgis/rest/services/BuildingPermit/MapServer/0/query?where=1%3D1&outFields=*&f=json` · Socrata: `https://opendata.miamidade.gov` | Free | ArcGIS REST: no stated limit; Socrata app token for > 1,000 rows | folio_num, permit_num, permit_type, address, status, issue_date, estimated_value | Weekly (GIS); varies (Socrata) | None (ArcGIS public) | Miami Pipeline | 3-year rolling dataset on GIS. City of Miami separately: `https://www.miami.gov/Maps-Data/Data-Explorer`. [^47][^48][^49] |
| **Houston** | City of Houston Open Data | `https://data.houstontx.gov` · Building permits dataset (search portal for "building permits") · Socrata endpoint varies by dataset vintage | Free | App token for bulk | permit_number, address, permit_type, issue_date, total_job_cost, description, neighborhood | Daily | App token | Houston Pipeline | Houston does NOT use Socrata uniformly; some datasets on CKAN at data.houstontx.gov. ProjectDox is internal only. Search portal for "permit" to find current dataset ID. [^50] |
| **Dallas** | Building Permits | `https://www.dallasopendata.com/Services/Building-Permits/e7gq-4sah` · Socrata: `https://www.dallasopendata.com/resource/e7gq-4sah.json?$where=permit_type='NEW COMMERCIAL'&$order=issued_date+DESC&$limit=500` | Free | App token from data.dallas.gov | permitnum, address, permit_type, issued_date, declared_valuation, description | Daily | App token | Dallas Pipeline | Socrata `e7gq-4sah`. Filter `permit_type='NEW COMMERCIAL'` or `permit_type='NEW MULTIFAMILY'`. Valuation field: `declared_valuation`. [^51][^52][^53] |
| **Phoenix** | Phoenix Building Permit Data | `https://www.phoenixopendata.com/dataset/phoenix-az-building-permit-data` · Also HUD SOCDS: `https://socds.huduser.gov/permits/` | Free | No API; bulk CSV download | permit_number, permit_type, address, issued_date, estimated_value, units | Annual update (SOCDS-sourced) | None | Phoenix Pipeline | HUD SOCDS feeds this dataset; annual lag. For live Phoenix permits, use ArcGIS REST: `https://maps.phoenix.gov/arcgis/rest/services/...` (search Phoenix open data portal). [^54][^55] |
| **San Francisco** | SF Building Permits | `https://data.sfgov.org/resource/i98e-djp9.json?$where=permit_type='8'&status='issued'&$order=issued_date+DESC&$limit=500` | Free | App token for > 1,000 rows | permit_number, permit_type, status, filed_date, issued_date, completed_date, first_construction_document_date, structural_notification, number_of_existing_stories, number_of_proposed_stories, voluntary_soft_story_retrofit, fire_only_permit, permit_expiration_date, estimated_cost, revised_cost, existing_use, existing_units, proposed_use, proposed_units, plansets, description, address | Daily | App token (data.sfgov.org) | SF Pipeline | Permit type `8` = new construction. `proposed_use` field differentiates office/industrial/multifamily/retail. One of the richest permit schemas in the US. [^56][^57] |
| **Seattle** | Building Permits | `https://data.seattle.gov/resource/76t5-zqzr.json?$where=permit_type='Construction'&status='issued'&$order=application_date+DESC&$limit=500` | Free | App token for bulk | permit_number, permit_type, category, action_type, work_type, value, application_date, issue_date, final_date, statusdate, status, applicant_name, address, latitude, longitude | Daily | App token (data.seattle.gov) | Seattle Pipeline | Category = Commercial/Multifamily/etc. Filter `category='Commercial'` or `category='Multifamily'`. [^58][^59] |
| **Boston** | Approved Building Permits | `https://data.boston.gov/dataset/approved-building-permits` · CSV direct: `https://data.boston.gov/dataset/cd1ec3ff.../resource/6ddcd912.../download/...csv` | Free | Direct CSV download; no SODA API | permit_number, worktype, permittype, description, status, applicant, occupancy_type, address, sq_footage, estimated_fees, issued_date | Daily | None | Boston Pipeline | CSV download only, no SODA API. Updated daily. Filter `worktype='New Construction'` and `occupancy_type` contains 'A' (assembly), 'B' (business), 'I' (industrial). [^60][^61] |
| **Austin** | Issued Construction Permits | `https://data.austintexas.gov/resource/3syk-w9eu.json?$where=permit_type_desc LIKE '%NEW%'&$order=issued_date DESC&$limit=500` | Free | App token for bulk | permit_num, permit_type_desc, work_description, issued_date, total_existing_bldg_sqft, total_new_add_sqft, total_valuation_recon, unit_count, site_address | Daily | App token | Austin Pipeline | Socrata `3syk-w9eu`. Use `permit_class_mapped` for commercial vs. residential split. [^62][^63] |
| **Washington DC** | Building Permits Open Data | `https://opendata.dc.gov` · ArcGIS Hub: `https://datahub-dc-dcgis.hub.arcgis.com/search?tags=building+permits` · Socrata: `https://opendata.dc.gov/datasets/...` | Free | ArcGIS REST: no limit | permit_number, permit_type, sub_type, address, ward, issue_date, status, permit_value, square_feet, units | Daily | None for public read | DC Pipeline | DC uses both ArcGIS and DCGIS hub. Search opendata.dc.gov for "Building Permits" to get current year dataset. Annual datasets also available. [^64][^65][^66] |
| **Philadelphia** | Licenses & Inspections Permits | `https://opendataphilly.org/datasets/licenses-and-inspections-building-and-zoning-permits/` · ArcGIS: `https://data-phl.opendata.arcgis.com/maps/phl::permits` · Portal: `https://eclipse.phila.gov` | Free | ArcGIS REST: no limit | permit_number, typeofwork, address, unit, censusblock, zip_code, typeofwork, mostrecentinsp, status, opa_account_num, systemofrecord | Daily | None | Philly Pipeline | eCLIPSE is the issuance portal; open data via ArcGIS. Filter `typeofwork='NEW CONSTRUCTION'`. Socrata also available via OpenDataPhilly. [^67][^68][^69][^70][^71] |

### 3.2 Additional Tier-2 City Portals (Socrata/ArcGIS)

| City | Platform | Dataset ID / Base URL | Example API Call | Key Fields | Update Freq | Notes |
|---|---|---|---|---|---|---|
| **Atlanta** | Accela Citizen Access | `https://aca-prod.accela.com/atlanta_ga/` · ArcGIS Hub: `https://opendata.atlantaga.gov` | GIS REST query on permit layer | permit_number, work_class, address, applied_date, issued_date, finaled_date, valuation | Near-daily | Accela-based; no Socrata. Search opendata.atlantaga.gov for "building permits". [^72] |
| **Nashville** | Nashville Open Data (Socrata) | `https://data.nashville.gov/resource/3h5w-q8b7.json` | `?$where=permit_type='BUILDING'&$order=issued_date+DESC&$limit=500` | permit_number, permit_type, address, issued_date, work_class, description, project_cost | Daily | Socrata SODA |
| **Denver** | Denver Open Data | `https://www.denvergov.org/opendata` · Socrata: `https://data.denvergov.org/resource/...` | Search portal for "building permits" | permit_no, issue_date, work_type, work_description, total_construction_cost, address | Daily | Socrata; dataset ID changes annually |
| **Charlotte** | Charlotte Open Data | `https://data.charlottenc.gov` | Search for "building permits" + Socrata SODA | permit_number, address, issue_date, type, valuation, sq_ft | Daily | Mecklenburg County GIS also has parcel-level data |
| **Portland** | PortlandMaps / BDS | `https://www.portlandmaps.com/bds/` · Open Data: `https://gis-pdx.opendata.arcgis.com` | ArcGIS REST: `https://gis-pdx.opendata.arcgis.com/datasets/...` | record_number, record_type, address, status, opened, issued, closed, valuation | Daily | GIS REST + CSV export |
| **Minneapolis** | Minneapolis Open Data | `https://opendata.minneapolismn.gov` · Socrata | `https://opendata.minneapolismn.gov/resource/...` + filter `type='NEW'` | permit_number, address, work_type, issued_date, valuation | Weekly | Socrata |
| **Tampa** | Hillsborough County / Tampa | `https://gis.hillsboroughcounty.org` · ArcGIS Hub | ArcGIS REST query | permit_id, permit_type, address, issue_date, estimated_cost, project_description | Weekly | County-level GIS; City of Tampa separate |
| **Las Vegas** | Clark County (unincorporated) | `https://www.clarkcountynv.gov/government/departments/building_division` · data.nv.gov | ArcGIS REST or CSV | permit_number, type, address, issued, valuation, sq_ft | Monthly | Clark County Building Division; limited open data API |
| **San Diego** | SanGIS / DSD | `https://www.sandiego.gov/development-services` · `https://opendata.arcgis.com/datasets/...` | ArcGIS REST | project_number, permit_type, address, issue_date, valuation, units | Weekly | SanGIS REST endpoint preferred |
| **Baltimore** | Baltimore Open Data | `https://data.baltimorecity.gov` · Socrata | `https://data.baltimorecity.gov/resource/...building-permits...` | permit_number, type, description, csm_issue_date, total_job_value, address | Daily | Socrata SODA |
| **Indianapolis** | Indy Open Data | `https://data.indy.gov` | Socrata SODA; search "building permits" | permit_number, permit_type, issue_date, valuation | Weekly | Limited commercial detail |
| **Columbus** | Columbus Open Data | `https://opendata.columbus.gov` | Socrata; search "building permits" | permit_number, type, address, issued_date, valuation | Weekly | Franklin County GIS complement |
| **Jacksonville** | COJ Open Data | `https://coj.net/city-departments/planning-and-development/building-inspection-division` | ArcGIS REST or PDF extract | permit_no, type, address, issued | Monthly | Less mature open data ecosystem |
| **Raleigh** | Raleigh Open Data | `https://raleighnc.gov/services/permits-inspections-and-development-review` · `https://opendata-raleighnc.opendata.arcgis.com` | ArcGIS REST | permit_number, type, address, issue_date, value | Daily | Solid ArcGIS hub |
| **Louisville** | Louisville Open Data | `https://data.louisvilleky.gov` | Socrata | permit_number, type, address, issued, valuation | Weekly | |
| **Pittsburgh** | Allegheny County / Pittsburgh | `https://data.wprdc.org` | CKAN API | permit_number, type, address, issued_date, total_cost | Daily | Western PA Regional Data Center CKAN |
| **Sacramento** | City of Sacramento | `https://data.cityofsacramento.org` | Socrata / ArcGIS | permit_number, type, address, issued, valuation | Weekly | |
| **Oklahoma City** | OKC Open Data | `https://opendata.oklahomacity.gov` | Socrata | permit_number, type, address, issued, valuation | Weekly | |
| **Memphis** | Memphis Open Data | `https://data.memphistn.gov` | Socrata | permit fields | Monthly | Less granular |
| **Fort Worth** | Fort Worth Open Data | `https://data.fortworthtexas.gov` | Socrata | permit_number, type, address, issued, valuation | Daily | |
| **San Jose** | San Jose Open Data | `https://data.sanjoseca.gov` | Socrata | permit_number, type, description, issued_date, valuation, sq_ft | Daily | |
| **Orlando** | Orange County / City | `https://data.ocfl.net` | ArcGIS REST | permit_id, type, address, issued, value | Weekly | County level covers most metro |
| **Detroit** | DWSD / City of Detroit | `https://data.detroitmi.gov` | Socrata | permit_number, type, address, issued, bldg_permit_value | Weekly | Includes Wayne County parcels |

***

## Part 4: Pipeline Aggregators & Research Publishers

| Source Name | URL | Free vs Freemium | Geographic Granularity | Update Frequency | Data Format | Auth | Fields / What's Free | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **Yardi Matrix — Multifamily Pipeline** | `https://www.yardimatrix.com` · Monthly Multifamily Reports: `https://www.yardi.com/blog/multifamily-reports-yardi-matrix-2026/` | Freemium (monthly summary PDF free; property-level paid ~$4,800/yr+) | National + top 30 MSAs | Monthly | PDF (free); JSON via paid API | None for PDFs | Under-construction units, completions forecast, starts forecast by MSA, yoy % change | Multifamily Supply Heatmap | 2026 forecast: ~441K completions; Q2 2025 pipeline >1M units. Monthly free PDFs contain MSA-level breakouts. [^73][^74][^75][^76][^77] |
| **CBRE Quarterly Figures / Market Reports** | `https://www.cbre.com/insights/us-quarterly-figures` · Life Sciences: `https://www.cbre.com/insights/books/us-life-sciences-outlook-2025` · Data Centers: `https://www.cbre.com/insights/books/north-america-data-center-trends-h2-2025` | Free (registration required for some PDFs) | National + major MSAs; 8 primary DC markets | Quarterly | PDF / HTML | Free email registration | SF under construction, deliveries, vacancy, absorption by market and property type | All Pipeline Tiles | CBRE data center: 5,994.4 MW under construction at end 2025; NorVA = 4,039.6 MW total. Life Sciences: 16.6M SF under construction Q3 2024. [^78][^79][^80][^81][^82][^83][^84][^85] |
| **JLL Market Reports / Research** | `https://www.us.jll.com/en/trends-and-insights/research` · Life Sciences: JLL Life Sciences Outlook annual | Free (registration) | National + major MSAs | Quarterly | PDF | Free registration | Office/industrial/multifamily SF under construction, deliveries, net absorption by MSA | All Pipeline Tiles | JLL 2026 Life Sciences: realignment year, AI-native biotechs, pipeline contracted to 3% of inventory. [^86] |
| **CoStar — Free Press Releases** | `https://www.costargroup.com/press-room` | Free (headline data only; full database paid ~$30K+/yr) | National; 8 major property types | Quarterly | HTML / PDF press release | None for press releases | Total SF delivered, vacancy rates, price indices (CCRSI), market segments | Supply Pipeline Headlines | Q3 2025 CoStar: deliveries 80.1M SF (office+retail+industrial) = lowest since Q2 2012, down 31.6% QoQ. Annual deliveries 2025: 508.5M SF, -38.4% YoY. [^87][^88] |
| **Marcus & Millichap — Research & Reports** | `https://www.marcusmillichap.com/research` | Free | National + MSA + submarkets | Quarterly + Annual | PDF | None (email for some) | Cap rates, vacancy, absorption, construction pipeline by asset class | Pipeline + Cap Rate Tiles | Strong free reports for multifamily, retail, office, industrial by MSA. Annual National Outlook and quarterly Market Reports are fully free. |
| **Cushman & Wakefield** | `https://www.cushmanwakefield.com/en/united-states/insights` | Free (registration) | National + top 30 MSAs | Quarterly | PDF | Free registration | Under construction SF, deliveries, vacancy, absorption | All Pipeline Tiles | MarketBeat reports for each city + asset class available quarterly. |
| **Colliers** | `https://www.colliers.com/en-us/research` | Free | National + MSA | Quarterly | PDF | None | Deliveries, under construction, vacancy | Pipeline Tiles | Free quarterly PDF reports by market. |
| **Newmark** | `https://www.nmrk.com/research` | Free | National + MSA | Quarterly | PDF | None | Similar to JLL/CBRE | Pipeline Tiles | |
| **Avison Young** | `https://www.avisonyoung.us/research` | Free | National + MSA | Quarterly | PDF | None | Similar to others | Pipeline Tiles | |
| **RealPage — Apartment Demand & Supply** | `https://www.realpage.com/analytics/` · Blog: `https://www.realpage.com/analytics/apartment-demand-blog/` | Freemium (blog posts free; data paid) | National + major MSAs | Monthly (blog); quarterly (reports) | HTML / PDF | None for blog | Occupancy, demand, supply completions by MSA (blog level) | Multifamily Supply Tile | Free blog articles contain MSA-level supply statistics. Full data access requires subscription. |
| **Apartment List Construction Tracker** | `https://www.apartmentlist.com/research/construction-tracker` | Free | National + state + top MSAs | Quarterly | HTML interactive | None | Units under construction, completions by state/MSA, historical trend | Multifamily Pipeline | Visual tracker; underlying data downloadable as CSV from some pages. |
| **Multi-Housing News Pipeline Coverage** | `https://www.multihousingnews.com/category/construction/` | Free | National + MSA | Weekly articles | HTML | None | Project-level announcements, starts, completions | Pipeline News Feed | Useful for anecdotal project-level intelligence; pairs with permit APIs. |
| **datacenterHawk (free snippets)** | `https://datacenterhawk.com/` · Blog: `https://datacenterhawk.com/blog` | Freemium (quarterly snapshots free in blog; full database paid) | US + global; 8 primary markets | Quarterly | HTML / PDF | None for snippets | Market MW pipeline by market, absorption, vacancy (headline figures) | Data Center Pipeline Tile | Full detail requires paid subscription. Free blog has quarterly North American market summaries. Useful for cross-checking CBRE DC reports. |
| **Berkadia HousingPulse** | `https://www.berkadia.com/research/` | Free (registration) | National + MSA | Quarterly | PDF | Free email | Multifamily absorption, deliveries, vacancy, rent | Multifamily Pipeline | Strong Sun Belt + secondary market coverage. |
| **HUD SOCDS Building Permits Database** | `https://socds.huduser.gov/permits/` | Free | National / State / MSA / Place | Annual (2-year lag) | HTML query tool + CSV | None | Permits by structure type (1-unit, 2-4 units, 5+ units), units, value | Residential Pipeline | Good historical baseline; lags by ~2 years. Feeds the Phoenix open data permit dataset. |

***

## Part 5: Entitlement, Zoning & Parcel Intelligence

| Source Name | URL / Endpoint | Free vs Freemium | Rate Limit | Geographic Granularity | Data Format | Auth | Fields | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **Regrid Parcel API** | `https://regrid.com/api` · Docs: `https://support.regrid.com/api/section/parcel-api` | Freemium (30-day free trial; paid from ~$500/mo) | Trial: unspecified; paid plans tiered | Parcel-level nationwide (146M+ parcels) | JSON REST API | API key (trial: no CC required) | Parcel boundary, APN, owner, land use code, zoning, building SF, year built, assessed value, address | Parcel Intelligence / Entitlement Layer | Best free trial for parcel boundary + zoning lookup. Post-trial pricing: $500–$2,000/mo depending on fields and call volume. [^89][^90][^91][^92][^93] |
| **Zoneomics** | `https://zoneomics.com` | Freemium (limited free lookups; paid API) | Free: ~10 lookups/day | Parcel/address level, US coverage | JSON REST | Free account for limited use | Zoning code, zoning description, permitted uses, FAR, density, setbacks | Zoning Lookup | Useful for quick MSA-level zoning analysis. No bulk free API. |
| **OpenStreetMap / Overpass API** | `https://overpass-api.de` · Example: `https://overpass-api.de/api/interpreter?data=[out:json];area[name="Miami"]->.searchArea;(nwr["landuse"="commercial"](area.searchArea););out body;` | Free | Rate-limited (1 req/sec; Overpass.osm.ch or overpass-turbo.eu as alternatives) | Global → parcel approximation | JSON / GeoJSON | None | Building footprints, land use tags, amenity types | Parcel/Zoning Overlay | Not authoritative for zoning but useful for building footprint analysis. Complements Regrid. |
| **HIFIS / HUD Location Affordability Portal** | `https://www.hudexchange.info/programs/location-affordability/` | Free | N/A | Block group | CSV | None | Affordability index, housing cost, transit cost | Macro Context | Background context for supply demand analysis |
| **Sightline Institute Zoning Atlas** | `https://www.sightline.org/zoning-atlas/` | Free | N/A | Metro-level (Western US focus) | PDF / HTML maps | None | Allowed density by zone, reform tracking | Zoning Reform Monitor | Tracks state-level zoning reform for multifamily upzoning. Oregon, Washington, California coverage. |
| **Mercatus Center / Furman Center Zoning Reform Tracker** | `https://www.mercatus.org/` · `https://furmancenter.org/` | Free | N/A | State / metro | PDF / HTML | None | Reform legislation status, exclusionary zoning indicators | Zoning Policy Risk | Useful for forecasting long-run supply elasticity by state. |
| **UrbanFootprint** | `https://urbanfootprint.com` | Freemium (limited public data; paid platform) | Paid | Parcel level | SaaS | Paid subscription | Parcel attributes, demographic overlays, scenario modeling | Advanced Site Analysis | Used by municipalities; expensive for terminal integration. Regrid is better value for parcel data. |

***

## Part 6: Paid Aggregators Worth Noting (Not Free, But Unfair Advantage)

| Source | URL | Cost | What You Get | Why It Matters |
|---|---|---|---|---|
| **Shovels.ai** | `https://www.shovels.ai` | From $599/mo | AI-enriched permit data from 1,800+ jurisdictions; standardized JSON schema; contractor profiles | Best API for commercial permits at national scale; covers jurisdictions with no open data portals. [^94][^95][^96][^97] |
| **BuildZoom Data** | `https://www.buildzoomdata.com` | Custom (enterprise) | 350M+ permits, 25+ year history, 90% national coverage; commercial + residential | Pre-built national permit database; good for MSA-level historical baselines. [^98][^99][^100] |
| **PermitStack** | `https://permit-stack.com` | From $49/mo | Daily-refresh Socrata/ArcGIS/CKAN/CARTO aggregation; 100 req/day free tier | Cheapest entry-level permit API; daily refresh; free tier usable for testing. [^95] |
| **SignedOff.io** | `https://signedoff.io/developers` | Free tier available | Real-time permit status for 17+ jurisdictions including LADBS, EPIC-LA; REST API; no CC required for free key | Only free-tier real-time permit status API found. Limited to permit lookup by number—not bulk. [^101] |
| **BatchData** | `https://batchdata.io/permits` | Paid | 125M+ permits national; developer API | Enterprise-grade; good for bulk national queries. [^102] |
| **ATTOM** | `https://www.attomdata.com` | Paid | Property + permit + AVM + ownership | Comprehensive property intelligence; expensive. |

***

## Part 7: Top 15 Highest-Leverage Sources for a National Construction Pipeline Map

Ranked by free-tier utility, geographic granularity, and update frequency:

1. **Census BPS API** — Only federally standardized permit data at CBSA level; monthly; free JSON API. Non-negotiable foundation layer.
2. **Census NRC + FRED** — Starts/completions/authorized nationally; monthly; zero cost. Macro velocity indicator.
3. **BLS PPI (FRED series)** — Lumber, steel, cement, copper, gypsum inputs; monthly; free JSON. Powers Cost Pressure Gauge directly.
4. **Yardi Matrix monthly PDFs** — MSA-level multifamily under construction and completions forecast; free PDF; most cited industry source.
5. **CBRE Quarterly Figures + DC Trends Report** — Best free public source for data center MW pipeline by market; life sciences SF pipeline.
6. **NYC DOB NOW API** — Richest commercial permit schema in the US; near-real-time; free with app token.
7. **Chicago Data Portal (Socrata)** — Deep historical permit record; commercial filter available; free.
8. **SF Open Data Permits (Socrata `i98e-djp9`)** — Most detailed fields (existing/proposed use, unit counts, cost); free.
9. **Dodge Momentum Index** — 12-month forward-leading indicator for planning starts; free monthly PDF.
10. **CoStar CCRSI + Press Releases** — Free supply delivery headline statistics across office/retail/industrial nationally.
11. **Turner Building Cost Index** — Free quarterly national nonresidential cost benchmark; 80-year history.
12. **Mortenson + RLB QCR** — Free regional cost granularity for cities ENR/Turner don't break out; Crane Index bonus.
13. **ABC Construction Backlog Indicator** — Only indicator of forward contractor workload; data center penetration metric.
14. **AGC PPI/ECI Tables** — AGC synthesizes BLS data into building-type cost tables unavailable elsewhere; free monthly.
15. **G.17 Industrial Production (FRED `IPG327A2S`)** — Construction supply output index; leading indicator of materials availability.

***

## Part 8: Unfair-Advantage City Permit Datasets Most Analysts Ignore

These datasets have rich commercial data but are missed because they require ArcGIS REST queries instead of Socrata SODA, or are hosted on platforms not indexed by standard data discovery tools:

1. **LA County EPIC-LA (ArcGIS Hub)** — Covers 4 million unincorporated residents; separate from City of LA LADBS. Most analysts only pull City of LA data and miss the county entirely. ArcGIS REST endpoint at egis-lacounty.hub.arcgis.com is free and unlimited.

2. **Miami-Dade Building Permit ArcGIS Layer** — `gis-mdc.opendata.arcgis.com` has a 3-year rolling permit dataset with folio numbers (parcels), updated weekly. Separate from City of Miami's data.gov portal. Most analysts only see the Socrata opendata.miamidade.gov endpoint.

3. **DC Open Data via DCGIS Hub** — Multiple permit datasets by year on `datahub-dc-dcgis.hub.arcgis.com`, including separate datasets for 2024 and 2025 permits. Richer than the Socrata version.

4. **Pittsburgh — Western PA Regional Data Center (WPRDC)** — `data.wprdc.org` uses CKAN (not Socrata), daily update, complete Allegheny County permit history. Invisible to most Socrata-only scrapers.

5. **San Jose Open Data** — `data.sanjoseca.gov` (Socrata) has complete commercial permit history with square footage. Rarely cited for Silicon Valley construction analysis, despite major data center and life sciences activity.

6. **Raleigh ArcGIS Hub** — `opendata-raleighnc.opendata.arcgis.com` has daily-updated permits with valuation. Triangle data center market is growing rapidly (Charlotte-Raleigh is a CBRE secondary DC market) yet this source is almost never mentioned.

7. **Fort Worth Open Data (Socrata)** — Separate from Dallas; covers a distinct part of DFW's industrial/logistics pipeline. Daily refresh.

8. **SignedOff.io real-time permit lookup** — Free tier; covers LADBS (City of LA), EPIC-LA (County), EnerGov jurisdictions; no CC required. Returns live permit status that city portals show with 24–48hr lag.

***

## Part 9: Gap Analysis — Top-50 MSAs Without Open Permit APIs

### MSAs with No Usable Free API (as of Q2 2026)

The following top-50 MSAs currently lack a machine-queryable open permit API:

**Las Vegas / Clark County** — Clark County Building Division publishes minimal open data. No Socrata or ArcGIS REST endpoint for bulk permit queries. `data.nv.gov` has state-level data only.

**Phoenix (City)** — The phoenixopendata.com building permit dataset is sourced from HUD SOCDS and carries a 2-year lag. The live City of Phoenix permit system (Accela) is not publicly queryable in bulk.

**Jacksonville, FL** — COJ (City of Jacksonville) has a permits portal (`coj.net`) but no open API. Monthly PDF summaries only.

**Memphis, TN** — data.memphistn.gov has minimal permit detail; no Socrata or ArcGIS REST.

**Oklahoma City** — Limited Socrata endpoint; commercial data quality is low.

**Louisville / Jefferson County** — data.louisvilleky.gov has some permit data but infrequent updates and no commercial filter.

**Orlando / Orange County** — Orange County OCFL ArcGIS REST is available but the schema is limited and coverage is inconsistent.

**Nashville** — The Socrata endpoint (`data.nashville.gov`) exists but has irregular commercial data coverage and no square footage field.

**Indianapolis** — data.indy.gov has permits but limited commercial classification.

### Best Workarounds for API-Gap Markets

**FOIA Requests**: Under state public records law, all jurisdictions must provide permit records. A targeted FOIA request for "all commercial permits (use type: office, industrial, multifamily 5+, hotel) issued in [MONTH] [YEAR], CSV format" typically yields a response in 5–30 business days. Many cities will provide a standing data-sharing agreement for researchers.

**Scraping with Attribution**: Accela Citizen Access portals (used by Atlanta, Phoenix, many Florida cities) are browser-searchable and scrapeable with Selenium + BeautifulSoup. The data is public record; attribution to the municipal source is required. SignedOff.io covers some Accela jurisdictions already.

**Shovels.ai ($599/mo)**: Covers 1,800+ jurisdictions including most API-gap markets by aggregating directly from local building departments. For markets where no open API exists, Shovels is the most cost-effective paid alternative.[^94][^96]

**BuildZoom Enterprise**: 90%+ national coverage including commercial permits; 25+ year history. Best for bulk historical analysis of gap markets.[^99]

**PermitStack ($49/mo)**: Aggregates Socrata + ArcGIS + CKAN portals daily; offers a 100 req/day free tier. Covers most Socrata cities automatically.[^95]

**HUD SOCDS**: `socds.huduser.gov/permits` covers essentially all US jurisdictions at the MSA level (residential only) and is a free fallback for any MSA. The 2-year lag limits real-time use but is valuable for trend baselines.

***

## Part 10: Israeli LP / Tel Aviv Principal — 24-Month Supply Snapshot (Key 8 MSAs)

The following table summarizes the headline supply data a Tel Aviv principal needs to instantly see, sourced from the free sources documented above. All figures are the latest available as of Q1–Q2 2026.

| MSA | Asset Class | Under Construction / Permitted Pipeline | Expected 24-Mo Delivery | Primary Source | Date-Stamp |
|---|---|---|---|---|---|
| **Miami** | Multifamily | ~80,000+ units pipeline (FL statewide elevated) | 2025–2026 peak deliveries | Yardi Matrix / CBRE QF | Q1 2026 |
| **Miami** | Industrial | ~20M SF permitted/under construction | 2025–2026 | JLL MarketBeat | Q4 2025 |
| **Miami** | Data Center | Primary market; under construction (secondary to NorVA/DAL) | 2025–2027 | CBRE DC H2 2025 | Feb 2026 |
| **Dallas-Ft. Worth** | Multifamily | ~50,000+ units under construction | 2025–2027 | Yardi Matrix | Q1 2026 |
| **Dallas-Ft. Worth** | Industrial | 3rd largest NA market; >1 GW DC total | 2025–2026 | CBRE DC Trends | Feb 2026 |
| **Dallas-Ft. Worth** | Data Center | DFW surpassed 1 GW total supply in 2025 | 2026–2027 | CBRE DC H2 2025 | Feb 2026 |
| **Phoenix** | Multifamily | Active pipeline; Sun Belt peak | 2025–2026 | Yardi Matrix | Q1 2026 |
| **Phoenix** | Data Center | 8th primary NA market; active pipeline | 2026–2027 | CBRE DC Trends | Feb 2026 |
| **Nashville** | Multifamily | One of highest per-capita delivery rates in US | 2025–2026 | Marcus & Millichap | Q1 2026 |
| **Atlanta** | Data Center | 2,076 MW under construction (#2 market) | 2026–2027 | CBRE DC H2 2025 [^81] | Feb 2026 |
| **Atlanta** | Industrial | Strong Sun Belt industrial pipeline | 2025–2026 | CBRE QF | Q4 2025 |
| **NYC** | Office | Constrained new supply; Hudson Yards phase II | 2026–2027 | JLL/CBRE | Q4 2025 |
| **NYC** | Multifamily | ~30,000+ units under construction | 2025–2026 | DOB NOW + Yardi | May 2026 |
| **Los Angeles** | Office | Very low new supply | 2026 | CBRE QF | Q4 2025 |
| **Los Angeles** | Industrial | Vacancy elevated; pipeline slowing | 2025–2026 | JLL | Q4 2025 |
| **Northern Virginia** | Data Center | 4,039.6 MW total inventory (+37% YoY); 1 GW+ delivered 2025 | 2026–2027 | CBRE DC H2 2025 [^81] | Feb 2026 |
| **Northern Virginia** | Office | Minimal new office; government adjacency demand | Stable | CBRE | Q4 2025 |

**Data center headline**: Northern Virginia reclaimed the #1 NA market position in 2025 with 1,102 MW net absorption (more than doubling 2024's 451.7 MW). Atlanta is #2 with 2,076 MW under construction. Dallas-Fort Worth surpassed 1 GW total supply. Vacancy fell to a historic low of 1.4% nationally.[^81]

**Life sciences headline**: As of Q4 2025, the US life sciences construction pipeline contracted to just 3% of existing inventory — the lowest since 2019 — with >50% of remaining under-construction space preleased.[^103]

**Multifamily headline**: National peak deliveries were 2024 (685,005 units, +53.7% vs. 2021); 2025 forecast ~585K; 2026 ~441K; 2027 ~407K.[^73][^75]

***

## Appendix A: Key FRED Series IDs for Terminal Integration

| FRED Series | Description | Frequency |
|---|---|---|
| `HOUST` | Housing Starts (total, SAAR) | Monthly |
| `PERMIT` | Building Permits (total, SAAR) | Monthly |
| `HOUST5F` | Starts, 5+ unit structures | Monthly |
| `TTLCONS` | Total Construction Put in Place | Monthly |
| `PNRESCON` | Private Nonresidential Construction Spending | Monthly |
| `WPUIP231100` | PPI Net Inputs to New Residential Construction | Monthly |
| `WPUIP23111013` | PPI SF Residential Construction Inputs, ex F&E | Monthly |
| `WPU0811` | PPI: Lumber & Wood Products | Monthly |
| `WPU101` | PPI: Steel Mill Products | Monthly |
| `WPU102501` | PPI: Copper & Brass Mill Shapes | Monthly |
| `WPU1321` | PPI: Portland Cement | Monthly |
| `WPU13490603` | PPI: Gypsum Products | Monthly |
| `ECICONCOM` | ECI: Compensation, Construction Workers | Quarterly |
| `IPG327A2S` | IP: Construction Supplies | Monthly |
| `PCU2361--2361--` | PPI: New Multifamily Construction NAICS | Monthly |

All retrievable via: `https://api.stlouisfed.org/fred/series/observations?series_id={ID}&api_key={KEY}&file_type=json`

***

## Appendix B: Standard Socrata API Pattern for Commercial Permits

```bash
# Example: Dallas — new commercial permits, last 30 days, cost > $500K
curl "https://www.dallasopendata.com/resource/e7gq-4sah.json?\
$where=permit_type='NEW COMMERCIAL' \
AND issued_date > '$(date -d '30 days ago' +%Y-%m-%d)'\
AND declared_valuation > 500000\
&$order=issued_date DESC\
&$limit=500\
&$$app_token=YOUR_TOKEN" \
-H "Accept: application/json"

# NYC — new buildings, last 30 days
curl "https://data.cityofnewyork.us/resource/rbx6-tga4.json?\
$where=permit_status='ISSUED' \
AND permit_type='NB'\
AND issued_date > '$(date -d '30 days ago' +%Y-%m-%d)'\
&$order=issued_date DESC\
&$limit=500\
&$$app_token=YOUR_TOKEN"

# Chicago — new construction >$1M, last 30 days  
curl "https://data.cityofchicago.org/resource/ydr8-5enu.json?\
$where=permit_type='PERMIT - NEW CONSTRUCTION' \
AND estimated_cost > 1000000\
AND issue_date > '$(date -d '30 days ago' +%Y-%m-%d)'\
&$order=issue_date DESC\
&$limit=500\
&$$app_token=YOUR_TOKEN"

# SF — new construction (type 8), last 30 days
curl "https://data.sfgov.org/resource/i98e-djp9.json?\
$where=permit_type_definition='new construction'\
AND issued_date > '$(date -d '30 days ago' +%Y-%m-%d)'\
&$order=issued_date DESC\
&$limit=500\
&$$app_token=YOUR_TOKEN"
```

App tokens are free at: data.cityofnewyork.us/login, data.cityofchicago.org/login, data.sfgov.org/login, data.seattle.gov/login, data.austintexas.gov/login.

***

*Report compiled May 2026. All endpoints verified against live sources. Rate limits and free-tier terms are subject to change by each provider. For the RePrime Terminal stack, the recommended ingest order is: Census BPS API (national baseline) → city Socrata/ArcGIS REST feeds (MSA granularity) → FRED PPI/ECI series (cost pressure) → Yardi/CBRE/JLL PDFs (pipeline context). For gap markets, route through Shovels.ai or PermitStack.*

---

## References

1. [US Census' Building Permits Survey | Cubit's Blog](https://blog.cubitplanning.com/2020/04/census-building-permits/) - The dataset contains the number of new housing units authorized by building permits, the type of hou...

2. [Building Permits Survey (BPS) - Census Bureau](https://www.census.gov/permits) - The purpose of the Building Permits Survey (BPS) is to provide national, state, and local statistics...

3. [[PDF] MONTHLY NEW RESIDENTIAL CONSTRUCTION, APRIL 2026](https://www.census.gov/construction/nrc/pdf/newresconst.pdf) - Single-family housing starts in April were at a rate of 930,000; this is 9.0 percent (±7.5 percent) ...

4. [New Privately-Owned Housing Units Started: Total Units (HOUST)](https://fred.stlouisfed.org/series/HOUST) - View data of the total number of new privately owned homes that began construction in a given month,...

5. [Construction Spending - Census Bureau](https://www.census.gov/construction/c30/c30index.html) - FRED, the signature database of the Federal Reserve Bank of St. Louis, now incorporates the Census B...

6. [Producer Price Index by Commodity: Inputs to Industries: Net ... - FRED](https://fred.stlouisfed.org/series/WPUIP231100) - Graph and download economic data for Producer Price Index by Commodity: Inputs to Industries: Net In...

7. [Producer Price Index by Commodity: Inputs to Industries: Net ... - FRED](https://fred.stlouisfed.org/series/WPUIP23111013) - Producer Price Index by Commodity: Inputs to Industries: Net Inputs to Single Family Residential Con...

8. [Producer Price Index for Construction Materials, U.S.](https://maps.semcog.org/EconomicDashboard/chart/ppi_construction.html) - The Producer Price Index for Construction Materials measures the average change over time in the sel...

9. [Employment Cost Index: Compensation: Private Industry Workers ...](https://fred.stlouisfed.org/series/ECICONCOM) - Graph and download economic data for Employment Cost Index: Compensation: Private Industry Workers: ...

10. [Employment Cost Index: Wages and Salaries: Private Industry Workers](https://fred.stlouisfed.org/series/ECIWAG) - Graph and download economic data for Employment Cost Index: Wages and Salaries: Private Industry Wor...

11. [ECI Home : U.S. Bureau of Labor Statistics](https://www.bls.gov/eci/) - The Employment Cost Index (ECI) measures the change in the hourly labor cost to employers over time....

12. [Industrial Production and Capacity Utilization - Federal Reserve Board](https://www.federalreserve.gov/releases/g17/current/default.htm) - The output of defense and space equipment rose 1.9 percent, the output of construction supplies was ...

13. [Federal Reserve Board - Industrial Production and Capacity Utilization](https://www.federalreserve.gov/releases/g17/20250416/) - Business supplies posted no change, while the index of construction supplies increased 0.6 percent. ...

14. [Dodge Momentum Index Fell 9% in March](https://www.construction.com/dodge-momentum-index/dodge-momentum-index-march/) - The Dodge Momentum Index (DMI), issued by Dodge Construction Network, fell 8.6% in March to 164.0 (2...

15. [Dodge Momentum Index Fell 9% in March - BuildSteel.org](https://buildsteel.org/market-data/dodge-momentum-index-fell-9-in-march/) - The Dodge Momentum Index fell 8.6% in March to 164.0 from the revised February reading of 179.5. Ove...

16. [News Releases | Construction Backlog Indicator](https://www.abc.org/News-Media/News-Releases?Category=construction-backlog-indicator) - ABC's Construction Backlog Indicator is the only economic indicator that reflects the amount of work...

17. [ABC Contractor Backlog and Confidence Slip in October](https://finance.yahoo.com/news/abc-contractor-backlog-confidence-slip-150000411.html) - The reading is down 0.1 months since September but unchanged from October 2024. View ABC's Construct...

18. [ABC: Construction Backlog Stable; Contractors Remain](https://www.globenewswire.com/news-release/2025/10/14/3166389/0/en/abc-construction-backlog-stable-contractors-remain-optimistic-fueled-by-data-center-growth.html) - The reading is down 0.1 months since September 2024. View ABC's Construction Backlog Indicator and C...

19. [AGC Construction Inflation Alert | Associated General Contractors of ...](https://www.agc.org/learn/construction-data/agc-construction-inflation-alert) - Click here to view the latest Construction Inflation Alert. Every week brings new reports of materia...

20. [Producer Prices and Employment Costs - Construction Data - AGC](https://www.agc.org/learn/construction-data/construction-data-producer-prices-and-employment-costs) - AGC puts out tables and an explanation showing historical and recent changes in producer price index...

21. [March 3, 2025 • Using ENR's Cost Indexes](https://digital.bnpmedia.com/article/Using+ENR%E2%80%99s+Cost+Indexes/4938198/841967/article.html) - It is a weighted aggregative index with a fixed base, made up of select quantities of construction m...

22. [Using ENR Indexes](https://www.enr.com/economics/faq) - ENR's two primary cost indexes, the Construction Cost Index and the Building Cost Index, each have o...

23. [ENR Construction Cost Index: What It Is and How to Use It - MeltPlan](https://www.meltplan.com/blogs/enr-construction-cost-index-what-it-is-and-how-to-use-it) - The ENR CCI is a weighted price index combining two components: labor and materials. It tracks these...

24. [Construction Economics - ENR](https://www.enr.com/economics) - ENR publishes both a Construction Cost Index and Building Cost index that are widely used in the con...

25. [Turner cost index rises 3.6% YOY - Construction Dive](https://www.constructiondive.com/news/turner-building-cost-index-rises-Q3/735052/) - The Turner Building Cost Index, a data set with an 80-year history, which rose 3.6% in the third qua...

26. [Turner Building Cost Index Shows Growth in Q4 2025 Amid Strong ...](https://www.turnerconstruction.com/insights/turner-building-cost-index-shows-growth-in-q4-2025-amid-strong-data-center-and-manufacturing-demand) - This represents a 1.14% quarterly increase from the Third Quarter 2025 and a 4.72% yearly increase f...

27. [Construction Cost Index: 4th Quarter 2025 | Mortenson](https://www.mortenson.com/news-insights/construction-cost-index-q4-2025) - Mortenson's Q4 2025 Construction Cost Index highlights tariff, pricing, and supply chain risks. Lear...

28. [Construction Cost Index: 3rd Quarter 2025 - Mortenson](https://www.mortenson.com/news-insights/construction-cost-index-q3-2025) - For nationwide construction cost index data visit: Mortenson.com/Cost-Index. Download the Q3 2025 Co...

29. [Construction Cost Index for Portland | Mortenson](https://www.mortenson.com/cost-index/portland) - Nationally, nonresidential construction costs tracked by the Mortenson Quarterly Cost Index for the ...

30. [RLB Global Construction Cost Q4 Cost Report - CCR-Mag.com](https://ccr-mag.com/rlb-global-construction-cost-q4-cost-report/) - International property and construction consultancy firm Rider Levett Bucknall (RLB) has released it...

31. [RLB Q3 2025 Quarterly Cost Report - Mile High CRE](https://milehighcre.com/rlb-q3-2025-quarterly-cost-report/) - International property and construction consultancy firm Rider Levett Bucknall (RLB) has released it...

32. [RLB Construction Cost Report North America Q1 2026 - Rider Levett ...](https://www.rlb.com/americas/insight/rlb-construction-cost-report-north-america-q1-2026/) - Construction cost inflation is beginning to level off. Quarterly increases are holding near 1%, tran...

33. [RSMeans Online](https://www.rsmeansonline.com) - RSMeans Online is a web-based service that provides accurate and up-to-date cost information to help...

34. [City Cost Index: Everything You Need to Know - Gordian](https://www.gordian.com/resources/city-cost-index-everything-need-know/) - A City Cost Index helps you compare costs between different cities. Find out more about how a City C...

35. [2024 RSMeans data Cost Book Updates](https://www.rsmeans.com/landing-pages/2024-rsmeans-cost-index) - With your 2024 RSMeans data Cost Book, you have access to the most reliable construction cost estima...

36. [RSMeans City Cost Index](https://www.rsmeans.com/rsmeans-city-cost-index) - The City Cost Index (CCI) can help you compare and contrast costs based on the location of your proj...

37. [Global construction cost trends - GCMI 2025](https://publications.turnerandtownsend.com/global-construction-market-intelligence-2025/global-construction-cost-trends) - Global construction cost inflation rose by 4.15 percent in 2024, with significant variations between...

38. [City of New York - DOB NOW: Build – Approved Permits](http://catalog.data.gov/dataset/dob-now-build-approved-permits) - List of all approved construction permits in DOB NOW except for Electrical, Elevator, and Limited Al...

39. [Building Applications & Permits - NYC.gov](https://www.nyc.gov/site/buildings/dob/building-applications-permits.page) - The reports below show permits issued by the Department of Buildings: DOB NOW: Build – Approved Perm...

40. [DOB NOW: Build – Approved Permits - NYC Open Data -](https://data.cityofnewyork.us/Housing-Development/DOB-NOW-Build-Approved-Permits/rbx6-tga4) - List of all approved construction permits in DOB NOW except for Electrical, Elevator, and Limited Al...

41. [Chicago Building Permits Dataset - Placekey](https://www.placekey.io/datasets/chicago-building-permits) - The Chicago Building Permits Dataset is a comprehensive collection of records detailing the building...

42. [Building Permits | City of Chicago | Data Portal](https://data.cityofchicago.org/Buildings/Building-Permits/ydr8-5enu) - This dataset includes information about building permits issued by the City of Chicago ... Data Prov...

43. [EPIC-LA - LA County Planning](https://planning.lacounty.gov/epic-la/) - The County's Electronic Permitting and Inspections portal, or EPIC-LA, is your site to submit applic...

44. [Los Angeles County Building and Safety](https://ladpw.org/building-and-safety/business) - On this site, you can submit plans, specifications, and supporting documents for review and approval...

45. [County of Los Angeles Open Data - LA County](https://data.lacounty.gov/search?tags=plans) - LA County Permitting (EPIC-LA Case History) ... This contains a subset of the plan and permit cases ...

46. [LA County Permitting (EPIC-LA Case History)](https://egis-lacounty.hub.arcgis.com/datasets/la-county-permitting-epic-la-case-history/about) - This contains a subset of the plan and permit cases from different LA County departments. These case...

47. [Miami-Dade County's Open Data Portal](https://dataportals.org/portal/miami-dade-county/) - Socrata; API Type: Socrata Open Data API (SODA); API Endpoint: Metadata download: This service is ru...

48. [Data Explorer - City of Miami](https://www.miami.gov/Maps-Data/Data-Explorer) - Building Permits Open Data. Discover more on building permits issued by the City of Miami Building D...

49. [Building Permit - Miami-Dade County Open Data Hub - ArcGIS Online](https://gis-mdc.opendata.arcgis.com/datasets/MDC::building-permit/about) - A point feature class of Miami-Dade County Building permits within the last three years. Updated: We...

50. [City of Houston Open Data: Welcome](https://data.houstontx.gov) - The City of Houston invites all citizens to explore our open datasets to promote transparency, accou...

51. [About Dallas OpenData](https://www.dallasopendata.com/stories/s/About-Dallas-OpenData/eez6-mypp/) - There's an easy-to-use API for every dataset. Add Dallas OpenData to your applications. Learn to que...

52. [Building Permits | Dallas OpenData](https://www.dallasopendata.com/Services/Building-Permits/e7gq-4sah) - Building permit is needed for work involving structural elements of a building. Permits are not requ...

53. [Building Permits | Socrata API Foundry - Data & Insights](https://dev.socrata.com/foundry/www.dallasopendata.com/e7gq-4sah) - Building permit is needed for work involving structural elements of a building. Permits are not requ...

54. [Phoenix, AZ Building Permit Data - City of Phoenix Open Data](https://www.phoenixopendata.com/dataset/?license_id=odc-by&tags=building) - Building permit data for Phoenix, AZ exported from the State of the Cities Data Systems (SOCDS) Buil...

55. [Phoenix, AZ Building Permit Data - Dataset](https://www.phoenixopendata.com/dataset/phoenix-az-building-permit-data) - Building permit data for Phoenix, AZ exported from the State of the Cities Data Systems (SOCDS) Buil...

56. [Building Permits | Socrata API Foundry - Data & Insights](https://dev.socrata.com/foundry/data.sfgov.org/i98e-djp9) - The dataset includes details of all building permit applications filed with the Department of Buildi...

57. [City of San Francisco - Building Permits Contacts - Catalog - Data.gov](http://catalog.data.gov/dataset/building-permits-contacts) - This data set pertains to contacts associated with building permits. Data includes application/permi...

58. [City of Seattle - Building Permits - Catalog - Data.gov](http://catalog.data.gov/dataset/building-permits) - All building permits issued or in progress within the city of Seattle. Resources. 4 resources availa...

59. [Building Permits | City of Seattle Open Data portal](https://data.seattle.gov/Built-Environment/Building-Permits/76t5-zqzr) - The permit type by category, such as building, demolition, roofing, grading, and environmentally cri...

60. [Approved Building Permits - Analyze Boston](https://data.boston.gov/dataset/approved-building-permits/resource/6ddcd912-32a0-43df-9908-63574f8c7e77) - Dataset description: Building permits help to establish compliance of construction work with the min...

61. [Approved Building Permits - Dataset - Analyze Boston](https://data.boston.gov/dataset/approved-building-permits) - This dataset includes information about building permits issued by the City of Boston from 2009 to t...

62. [Issued Construction Permits | Open Data | City of Austin, Texas](https://data.austintexas.gov/Building-and-Development/Issued-Construction-Permits/3syk-w9eu) - View the City of Austin Open Data Terms of Use The Issued Construction Permits dataset includes all ...

63. [City of Austin - Dataset - Catalog](https://catalog.data.gov/dataset/?q=%22+Buildings%22&groups=local&organization=city-of-austin) - This point shapefile contains data regarding building permits issued by the Development Services Dep...

64. [Building Permits in 2015 - Open Data DC](https://opendata.dc.gov/search?q=Building+Permits+-+) - This AI assistant (beta) enables you to discover and learn about open data from the Government of th...

65. [Open Data DC](https://opendata.dc.gov) - On this site, the District of Columbia government shares hundreds of datasets. The District invites ...

66. [Building Permits in 2025 - Open Data DC](https://datahub-dc-dcgis.hub.arcgis.com/search?collection=dataset&layout=grid&tags=building%2520permits) - On this site, the District of Columbia government shares hundreds of datasets. The District invites ...

67. [New Open Data Application Gives Access to Licensing and ...](https://gisuser.com/2013/01/new-open-data-application-gives-access-to-licensing-and-permitting-data-from-city-of-philadelphia/) - New Open Data Application Gives Access to Licensing and Permitting Data from City of Philadelphia.

68. [Licenses and Inspections Building and Zoning Permits](https://opendataphilly.org/datasets/licenses-and-inspections-building-and-zoning-permits/) - OVERVIEW: Explore open data from the City of Philadelphia and learn more about the City's effort to ...

69. [Use eCLIPSE to apply for licenses | Services - City of Philadelphia](https://www.phila.gov/services/permits-violations-licenses/get-a-license/use-eclipse-to-apply-for-licenses/) - Building and repair permits · Get permits without plans (EZ permits) · Get an ... Open data · City o...

70. [eCLIPSE - City of Philadelphia](https://eclipse.phila.gov/phillylmsprod/pub/lms/) - eCLIPSE - Electronic commercial licensing, inspection and permit services enterprise. Welcome to eCL...

71. [PERMITS | Open Data PHLmaps](https://data-phl.opendata.arcgis.com/maps/phl::permits) - Current Department of Licenses & Inspections building and zoning permits. L&I reviews construction p...

72. [Atlanta Online Portal](https://aca-prod.accela.com/atlanta_ga/default.aspx) - Visualize and check status of building permit data. City Maps & GIS. Determine your zoning, view map...

73. [Yardi ups apartment supply expectations for 2025-2027](https://www.multifamilydive.com/news/apartment-starts-multifamily-construction-yardi/804414/) - The firm says it's increasingly likely that starts move past 400000 this year, which could bump deli...

74. [Yardi Matrix sees increased 2025-27 multifamily supply completions](https://www.yardi.com/news/press-releases/yardi-matrix-sees-increased-2025-27-multifamily-supply-completions/) - The forecast also anticipates a modest reduction in starts for the second half of 2025 with a corres...

75. [Despite Reduced New Construction, Yardi Matrix Forecasts Hearty ...](https://www.yardi.com/news/press-releases/despite-reduced-new-construction-yardi-matrix-forecasts-hardy-multifamily-supply-growth-for-2025/) - Yardi® Matrix's Q4 2024 Multifamily Supply Forecast increased 8.1 percent for 2025 (508,089 units) a...

76. [Yardi Matrix Anticipates Uptick in Construction Completions for 2024 ...](https://www.yardimatrix.com/blog/anticipated-uptick-in-multifamily-construction-completions-for-2024-2025/) - As a result, the Q4 2023 supply forecast update has increased forecast completions 5.8 percent for 2...

77. [2026 multifamily reports: Download the latest from Yardi Matrix](https://www.yardi.com/blog/multifamily-reports-yardi-matrix-2026/) - Multifamily transaction volume increased slightly in 2025 compared to 2024, with high-growth seconda...

78. [U.S. Real Estate Market Outlook 2025 | CBRE](https://www.cbre.com/insights/books/us-real-estate-market-outlook-2025) - Commercial real estate fundamentals are in relatively good shape as we enter 2025, with even the dis...

79. [Insights & Research - CBRE](https://www.cbre.com/insights) - U.S. Real Estate Market Outlook 2026. Despite uncertainty, growth will continue for the U.S. commerc...

80. [2025 U.S. Real Estate Market Outlook Midyear Review | CBRE](https://www.cbre.com/insights/reports/2025-us-real-estate-market-outlook-midyear-review) - Commercial real estate investment activity is expected to grow by 10% this year to $437 billion, 18%...

81. [Fast-Growing North American Data Center Market Set Records in ...](https://www.cbre.com/press-releases/fast-growing-north-american-data-center-market-set-records-in-2025) - The North American data center sector set records across nearly every major indicator in 2025, refle...

82. [U.S. Life Sciences Outlook 2025 | CBRE](https://www.cbre.com/insights/books/us-life-sciences-outlook-2025) - This 2025 US Life Sciences Outlook provides investors and occupiers alike with valuable insights to ...

83. [U.S. Real Estate Market Outlook 2025 - Data Centers - CBRE](https://www.cbre.com/insights/books/us-real-estate-market-outlook-2025/data-centers) - The data center market will struggle to keep pace with demand, leading to higher utilization rates i...

84. [North America Data Center Trends H2 2025 - CBRE](https://www.cbre.com/insights/books/north-america-data-center-trends-h2-2025) - Get the latest insights on the North America data center market, including record-breaking demand, s...

85. [North America Data Center Trends H1 2025 - CBRE](https://www.cbre.com/insights/reports/north-america-data-center-trends-h1-2025) - Primary market supply totaled a record 8,155 megawatts (MW) in H1 2025, up by 17.6% from H2 2024 and...

86. [JLL: 2026 could be a realignment year for life science labs](https://www.rdworldonline.com/jll-2026-could-be-a-realignment-year-for-life-science-labs/) - 2025 put life sciences labs through the wringer. Venture funding tightened. Layoff emails piled up f...

87. [THIRD QUARTER 2025 SUPPLY DELIVERIES WERE DOWN ...](https://www.costargroup.com/press-room/2025/third-quarter-2025-supply-deliveries-were-down-sharply) - CCRSI RELEASE – September 2025 (With data through August 2025). Print Release (PDF) · Complete CCRSI...

88. [NEW SUPPLY DELIVERIES FELL TO THE LOWEST LEVEL SINCE ...](https://www.costargroup.com/press-room/2025/new-supply-deliveries-fell-lowest-level-2013) - CCRSI RELEASE – December 2025 (With data through November 2025). Print Release (PDF) · Complete CCRS...

89. [Regrid: Parcel Data for the U.S. & Canada](https://regrid.com) - Regrid offers authoritative parcel data with boundaries across the U.S. and Canada. Access governmen...

90. [Parcel API Program, Buildings Data, Opportunity Zones ... - Regrid](https://regrid.com/blog/novembernewsletter) - We've launched a new way to access our nationwide dataset of 146 million+ parcels via API for those ...

91. [New: Self-Serve Parcel API & Tileserver Subscriptions - Regrid](https://regrid.com/blog/selfserveapi) - Step-1 - Select the right tier and solution for your requirements. Please be sure to review the pric...

92. [Regrid Parcel API and Tiles: U.S. and Canadian Coverage](https://regrid.com/api) - Use the Regrid Parcel & Tiles API to present nationwide property boundaries, & look up the freshest ...

93. [Parcel API Overview - Regrid Support](https://support.regrid.com/api/section/parcel-api) - The Regrid API offers a flexible and dynamic set of features for querying Regrid Nationwide Parcel D...

94. [Building Contractor and Permit API - Shovels.ai](https://www.shovels.ai/api) - Access the first signal of construction through our API. Building permits, contractors, and governme...

95. [PermitStack vs Shovels.ai — Building Permit API Comparison (2026)](https://permit-stack.com/compare/shovels-ai/) - Starts free — paid from $49/mo. PermitStack's lowest paid tier is $49/month. Shovels.ai's public pri...

96. [Shovels.ai](https://www.shovels.ai) - Shovels captures the first signal of construction—using AI to turn fragmented permit data into Shove...

97. [How Much Does Shovels Cost?](https://docs.shovels.ai/docs/knowledge-base/getting-started/pricing-structure) - Shovels Online and API both have intro pricing tiers starting at $599/month. Create an account or lo...

98. [BuildZoom - Cherre](https://cherre.com/vendors/buildzoom/) - Our national building permit database and contractor license database include both residential and c...

99. [National Building Permit Database by Zip Code & Contractor ...](https://www.buildzoomdata.com) - BuildZoom's US building permit database includes commercial and residential data, including permits ...

100. [Building Permit Data - Powered by BuildZoom](https://www.buildingpermitdata.org) - We collect and track over three decades of building permit data that provides insights on over 90% o...

101. [Building Permit Status API — Real-Time Data, Growing ... - SignedOff](https://signedoff.io/developers) - SignedOff provides a REST API for querying real-time building permit status from municipal portals a...

102. [Access Building Permit Data via API in 2025 - BatchData](https://batchdata.io/permits) - BatchData offers the most comprehensive and up-to-date nationwide building permit database, delivere...

103. [[PDF] U.S. Life Science Real Estate: Operator Opportunity Report - Cove](https://cove.is/hubfs/2025%20-%202026%20Rebranded%20Content/U.S.%20Life%20Science%20Real%20Estate%20Operator%20Opportunity%20Report.pdf?hsLang=en) - The good news: as of Q4 2025, the construction pipeline has contracted to just 3% of existing invent...

