# US & Israel Government APIs for Commercial Real Estate Market Intelligence — Developer Reference (May 25, 2026)

## TL;DR
- **80+ free or freemium endpoints are usable today; roughly 60% can be called directly from the browser (CORS-enabled ArcGIS Online + Socrata + Census), and the remaining ~40% must be proxied server-side** (BLS, HUD HUDUSER, EIA, FCC BDC, AirNow, FHFA/Census BPS static files, TASE, Bank of Israel SDMX). Build a thin Node/Cloudflare-Worker proxy for the latter set and let the browser hit the rest directly.
- **The single largest 2026 disruption: NREL has been renamed by DOE (Dec 1, 2025) to the National Laboratory of the Rockies (NLR), and `developer.nrel.gov` is migrating to `developer.nlr.gov`.** Per developer.nlr.gov: "The previous developer.nrel.gov domain will experience scheduled service disruptions beginning May 1, 2026, and it will be shut down on May 29, 2026." So PVWatts/URDB/NSRDB callers must update their base URL within days of this writing. Walk Score's free API is still alive but capped at 5,000 calls/day. GreatSchools' free public API was retired; the replacement is the paid NearbySchools™ API (14-day free trial; base plan 15,000 calls/month). The Bank of Israel migrated to a Fusion SDMX EDGE platform — the new base is `https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/`.
- **For a 10–15-tile broker MI panel, the highest-leverage stack is:** Census ACS 5-yr (demographics, income, education) + BLS LAUS (unemployment) + HUD FMR/IL + FEMA NFHL (flood) + EPA AirNow (AQI) + FCC BDC (broadband) + EIA v2 (electricity) + NREL PVWatts (solar) + USGS Seismic Design Web Services + CDC PLACES + Opportunity Zone/QCT ArcGIS + a state/city zoning ArcGIS REST layer. Everything else (transit, EV, wetlands, soils, brownfields, traffic) layers in as secondary tiles via Overpass + ArcGIS REST.

---

## Key Findings
1. **The Census Data API is the most important single source.** With one free key (`https://api.census.gov/data/key_signup.html`), the ACS 5-year endpoint (`api.census.gov/data/2023/acs/acs5`) answers at least 6 of the 15 tiles — median income, age cohorts, owner/renter, education, vehicle ownership, commute mode — all at tract granularity. The 2020–2024 ACS 5-year estimates were publicly released on **January 29, 2026** (originally scheduled December 11, 2025 then rescheduled), per the U.S. Census Bureau's ACS Updates page, which is now the latest vintage you should target.
2. **ArcGIS REST is your CORS-friendly best friend.** FEMA NFHL, HUD LIHTC/QCT/OZ, USFWS Wetlands, EPA CIMC, NYC ZoLa, Chicago, LA GeoHub, and the QCT/OZ HUD layers all support `?f=json` or `?f=geojson` and send `Access-Control-Allow-Origin: *`, so they can be hit from the browser with no proxy.
3. **Several "famous" data sets have no real API** — Census Building Permits Survey, FHFA HPI, NOAA Storm Events Database, FAA noise contours, HUD USPS Vacancy. These are static CSV/XLS downloads behind redirects or login gates and need a server-side ETL job (daily/quarterly) that materializes the data into your own DB. FRED carries 393 FHFA HPI MSA series, so FRED API is the cleanest substitute.
4. **Two large "must-build-server-side" categories:** anything BLS (POST with API key + JSON body — no CORS), anything HUDUSER (`huduser.gov/hudapi/public/...` requires bearer token in `Authorization` header — must be set server-side anyway).
5. **Israel:** Bank of Israel's new SDMX EDGE API (`edge.boi.org.il/FusionEdgeServer/sdmx/v2/`) is the canonical source for representative USD/ILS and BOI policy rate; CBS Lamas exposes an SDMX endpoint at `apis.cbs.gov.il/SDMX/...` covering housing and CPI; TASE Open API (`openapi.tase.co.il/tase/prod/`) exists but is OAuth-gated and most feeds are paid; data.gov.il runs a standard CKAN 2.x API at `data.gov.il/api/3/action/...`.

---

## Details — Source-by-Source Reference

Each entry lists SOURCE | NAME | ENDPOINT (with example params) | INPUT | OUTPUT | AUTH | UPDATE | CORS | RATE LIMIT | CRE USE.

### CATEGORY 1 — ECONOMIC & EMPLOYMENT

**1. BLS LAUS (unemployment by county/MSA)**
- SOURCE: U.S. Bureau of Labor Statistics
- NAME: Local Area Unemployment Statistics
- ENDPOINT: `POST https://api.bls.gov/publicAPI/v2/timeseries/data/` with JSON body `{"seriesid":["LAUCN040130000000003"],"startyear":"2024","endyear":"2026","registrationkey":"YOUR_KEY"}`. Series ID format `LAU` + seasonal (`U`/`S`) + area code (15 char; e.g., `CN0401300000000` = Maricopa County, AZ; `MT1716980300000` = Chicago MSA) + measure (`03`=unemployment rate, `04`=unemployment, `05`=employment, `06`=labor force).
- INPUT: BLS series ID (constructed from FIPS county/MSA code + measure)
- OUTPUT: JSON
- AUTH: Free key at `https://data.bls.gov/registrationEngine/` (v2 = 500 req/day, 50 series/query, 20 years; v1 = no key, 25 req/day, 25 series/query, 10 years)
- UPDATE: Monthly (3rd Friday after reference month)
- CORS: No — must POST server-side
- RATE LIMIT: 500 daily queries (v2 with key)
- CRE USE: "Unemployment Rate" tile (county + MSA dual sparkline)

**2. BLS QCEW (employment by NAICS by county)**
- SOURCE: BLS
- NAME: Quarterly Census of Employment and Wages
- ENDPOINT: Annual avg: `https://data.bls.gov/cew/data/api/2024/a/area/04013.csv` (county FIPS `04013` = Maricopa, AZ). Quarterly: `.../api/2024/1/area/04013.csv`. Industry-specific: `.../api/2024/a/industry/722.csv` (NAICS 722 Food Services).
- INPUT: 5-digit county FIPS, year, qtr (1–4 or `a` for annual), or NAICS code
- OUTPUT: CSV (also JSON via `.json`)
- AUTH: None
- UPDATE: Quarterly (≈5 months lag)
- CORS: No — CSV from `data.bls.gov` lacks CORS; proxy
- RATE LIMIT: None published; courtesy use
- CRE USE: "Employment by Industry" tile (NAICS top-10 bar) + "Total Establishments" tile

**3. Census ACS — Median Household Income (B19013) by tract**
- SOURCE: U.S. Census Bureau
- NAME: American Community Survey 5-Year, Detailed Tables
- ENDPOINT: `https://api.census.gov/data/2023/acs/acs5?get=NAME,B19013_001E,B19013_001M&for=tract:*&in=state:04+county:013&key=YOUR_KEY` (returns all tracts in Maricopa County, AZ). Single tract: `&for=tract:610200&in=state:04+county:013`. (Update to `2024` once you've migrated; the 2020–2024 5-yr release went live January 29, 2026.)
- INPUT: state+county FIPS (always required for tract-level), tract code
- OUTPUT: JSON (array of arrays)
- AUTH: Free key at `https://api.census.gov/data/key_signup.html`
- UPDATE: Annual (5-yr release each December/January)
- CORS: Yes (Census API sends `Access-Control-Allow-Origin: *`)
- RATE LIMIT: 500 variables/call, no published daily cap (heavy users may be throttled)
- CRE USE: "Median Household Income" tile

**4. Census ACS — Poverty Rate (S1701 / B17001) by tract**
- SOURCE: Census Bureau
- NAME: ACS 5-Year Subject Table S1701 (or Detailed Table B17001)
- ENDPOINT: `https://api.census.gov/data/2023/acs/acs5/subject?get=NAME,S1701_C03_001E&for=tract:*&in=state:04+county:013&key=YOUR_KEY` (S1701_C03_001E = % of population below poverty). Alternative: B17001 detailed (`B17001_002E` below poverty count / `B17001_001E` universe).
- INPUT: same as above
- OUTPUT: JSON
- AUTH: free Census key
- UPDATE: Annual
- CORS: Yes
- CRE USE: "Poverty Rate" tile (color-coded for risk overlay)

**5. Census County Business Patterns (CBP) — establishments by ZIP**
- SOURCE: Census Bureau
- NAME: County Business Patterns / ZIP Code Business Patterns
- ENDPOINT: ZIP: `https://api.census.gov/data/2022/zbp?get=NAME,ESTAB,EMP,PAYANN&for=zipcode:85016&key=YOUR_KEY`. County by NAICS: `https://api.census.gov/data/2022/cbp?get=ESTAB,EMP&NAICS2017=722&for=county:013&in=state:04&key=YOUR_KEY`
- INPUT: ZIP or state+county FIPS; optional NAICS2017
- OUTPUT: JSON
- AUTH: free Census key
- UPDATE: Annual (~24-month lag; 2022 vintage is latest as of mid-2026)
- CORS: Yes
- CRE USE: "Local Business Density" tile (establishments + employees by ZIP)

**6. Census ACS — Transportation to Work (B08301) by tract**
- SOURCE: Census Bureau
- NAME: ACS 5-Year B08301 "Means of Transportation to Work"
- ENDPOINT: `https://api.census.gov/data/2023/acs/acs5?get=group(B08301)&for=tract:610200&in=state:04+county:013&key=YOUR_KEY`
- OUTPUT: JSON; variables `B08301_001E` (total) through `B08301_021E` (worked from home)
- AUTH: free Census key
- UPDATE: Annual
- CORS: Yes
- CRE USE: "Commute Mode Mix" tile (drove alone / public transit / WFH donut chart)

### CATEGORY 2 — DEMOGRAPHICS (tract/ZIP)

All ACS endpoints share the pattern `https://api.census.gov/data/2023/acs/acs5?get=<vars>&for=tract:*&in=state:SS+county:CCC&key=KEY` — CORS: yes, JSON, free key, annual.

| # | Table | Key variable(s) | Tile |
|---|---|---|---|
| 7 | B01003 | `B01003_001E` total population | "Tract Population" |
| 8 | B01001 | `B01001_001E` total; `B01001_011E`+`B01001_012E` males 25–34, `B01001_035E`+`B01001_036E` females 25–34 (sum = key renter cohort) | "Age 25–34 Cohort %" (peak multifamily renter demand) |
| 9 | B11001 | `B11001_001E` total households; `B11001_007E` nonfamily | "Household Count" |
| 10 | B25001 / B25002 | `B25001_001E` total housing units; `B25002_002E` occupied / `B25002_003E` vacant | "Housing Units & Vacancy" |
| 11 | B25003 | `B25003_001E` total; `B25003_002E` owner-occupied; `B25003_003E` renter-occupied | "Owner-vs-Renter Mix" |
| 12 | B15003 | `B15003_022E` bachelor's; `B15003_023E` master's; `B15003_024E` professional; `B15003_025E` doctoral | "Educational Attainment (% Bachelor's+)" |
| 13 | B25044 / B08201 | `B25044_001E` total HH by vehicles; `B25044_003E`/`_010E` = 0 vehicles (owner/renter) | "Vehicle Ownership / Zero-Car HH %" |

All return JSON; all CORS-enabled; all annual; all require the same free key registered once.

**14. Census Geocoder (resolve street address → tract/county FIPS)**
- ENDPOINT: `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=1600+Pennsylvania+Ave+NW,+Washington,+DC&benchmark=Public_AR_Current&vintage=Current_Current&format=json`
- INPUT: free-text address or lat/lng
- OUTPUT: JSON containing state FIPS, county FIPS, tract, block
- AUTH: None
- UPDATE: Continuously aligned with TIGER
- CORS: Yes
- CRE USE: Backend resolver — feeds every ACS / tract-based tile in the panel

### CATEGORY 3 — ENVIRONMENTAL & HAZARD

**15. FEMA National Flood Hazard Layer (NFHL)**
- ENDPOINT (Flood Hazard Zones layer 28): `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?geometry=-77.0369,38.9072&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,STATIC_BFE&returnGeometry=false&f=geojson`
- INPUT: lat/lng point
- OUTPUT: JSON / GeoJSON / PBF; key field `FLD_ZONE` (A, AE, AH, AO, V, VE, X, D)
- AUTH: None
- UPDATE: Continuously (LOMR/LOMA-driven; MaxRecordCount 2000)
- CORS: Yes (FEMA ArcGIS Server allows CORS for read ops)
- CRE USE: "Flood Zone" tile (SFHA Y/N + BFE)

**16. EPA Envirofacts — Superfund/SEMS**
- ENDPOINT: `https://data.epa.gov/efservice/sems.envirofacts_site/zip_code/equals/85016/JSON` (sites by ZIP); state: `.../sems.envirofacts_site/state_name/equals/Arizona/JSON`
- INPUT: ZIP, city, county, state, or site name (no native point-radius — buffer client-side)
- OUTPUT: JSON, CSV, XML, Excel
- AUTH: None
- UPDATE: Continuous EPA refresh; 15-min query cap per request
- CORS: Not guaranteed — test required; consider proxy
- CRE USE: "Superfund Sites Nearby" tile (count within 1/5/10 mi)

**17. EPA TRI (Toxics Release Inventory)**
- ENDPOINT: `https://data.epa.gov/efservice/tri_facility/zip_code/equals/85016/JSON` (TRI facilities by ZIP); join `/tri_facility/tri_reporting_form` for release amounts
- OUTPUT: JSON/CSV/XML
- AUTH: None
- UPDATE: Annual (each July for prior calendar year)
- CORS: Test required
- CRE USE: "Industrial Pollution Score" tile (count + lbs released within radius)

**18. EPA Cleanups in My Community (CIMC) — Brownfields**
- ENDPOINT: `https://map22.epa.gov/arcgis/rest/services/cimc/Cleanups/MapServer/0/query?where=PROGRAM%3D%27BROWNFIELDS%27&geometry=-77.05,38.88,-76.95,38.95&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&f=json`
- INPUT: ArcGIS envelope or buffered point
- OUTPUT: JSON / GeoJSON
- AUTH: None
- UPDATE: Twice monthly (last refresh 04/21/2025)
- CORS: Yes (EPA ArcGIS Server)
- CRE USE: "Brownfield Sites Nearby" tile

**19. USGS Seismic Design Web Services (NSHM)**
- ENDPOINT: `https://earthquake.usgs.gov/ws/designmaps/asce7-22.json?latitude=34.05&longitude=-118.25&riskCategory=II&siteClass=D&title=LA-Test` (also asce7-16, asce41-23, ibc-2015, etc.)
- INPUT: lat/lng + risk category + site class
- OUTPUT: JSON (SDS, SD1, PGA, Sa values; design and MCE spectra)
- AUTH: None
- UPDATE: When a new NSHM model is published (2018 conterminous; 2021 Hawaii)
- CORS: Yes (USGS earthquake.usgs.gov)
- RATE LIMIT: None published — courtesy use
- CRE USE: "Seismic Design Category" tile (SDC + design spectrum mini-chart)

**20. NOAA Storm Events Database**
- ENDPOINT: Bulk CSV directory `https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/` (3 annual files: details, locations, fatalities)
- INPUT: Year-stamped filenames; HTML search at `https://www.ncei.noaa.gov/stormevents/`
- OUTPUT: CSV
- AUTH: None
- UPDATE: Monthly, ~75–90 day lag
- CORS: No (static HTTP) — server-side ingest only
- CRE USE: "Severe Weather History (10-yr)" tile (counts by event type within county)

**21. CDC PLACES (health by tract)**
- ENDPOINT (Socrata): `https://data.cdc.gov/resource/cwsq-ngmh.json?$where=StateAbbr='AZ' AND CountyFIPS='04013' AND TractFIPS='04013610200'` (2025 release tract dataset, ID `cwsq-ngmh`)
- INPUT: SoQL via state/county/tract FIPS; **40 chronic-disease and health-related measures per tract** (per CDC's PLACES About page: "A small area estimation methodology is used to obtain data on 40 chronic disease and other health-related measures for the entire United States.")
- OUTPUT: JSON, CSV, GeoJSON via SODA
- AUTH: Anonymous OK; free Socrata App Token recommended (`X-App-Token` header) at `https://dev.socrata.com`
- UPDATE: Annual
- CORS: Yes
- RATE LIMIT: Anonymous throttled aggressively; with token: shared per-app
- CRE USE: "Health Profile" tile (obesity, smoking, mental-health %)

**22. EPA Radon Zones (county map)**
- ENDPOINT: Static dataset at `https://www.epa.gov/radon/find-information-about-local-radon-zones-and-state-contact-information` (no API). Use EPA Map of Radon Zones (zones 1/2/3) by county FIPS — published as static lookup table; many state EPA's offer GeoJSON (e.g., PA DEP).
- INPUT: County FIPS
- OUTPUT: Static table; ingest once
- AUTH: None
- UPDATE: Rare (decadal updates)
- CORS: N/A
- CRE USE: "Radon Risk Zone" tile (1=highest, 3=lowest)

**23. USFWS National Wetlands Inventory**
- ENDPOINT: `https://fwspublicservices.wim.usgs.gov/wetlandsmapservice/rest/services/Wetlands/MapServer/0/query?geometry=-77.0369,38.9072&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=ATTRIBUTE,WETLAND_TYPE&returnGeometry=true&f=geojson`
- INPUT: point geometry
- OUTPUT: JSON / GeoJSON (wetland classification code per Cowardin system)
- AUTH: None
- UPDATE: Biannual
- CORS: Yes
- CRE USE: "Wetlands Designation" tile (Y/N + type)

**24. EPA AirNow (current AQI)**
- ENDPOINT (current obs by ZIP): `https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=85016&distance=25&API_KEY=YOUR_KEY`. By lat/lng: `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=34.05&longitude=-118.25&distance=25&API_KEY=YOUR_KEY`. Forecast: swap `/observation/` for `/forecast/`.
- INPUT: ZIP or lat/lng + radius (miles)
- OUTPUT: JSON / XML / CSV / KML
- AUTH: Free key at `https://docs.airnowapi.org/account/request/`
- UPDATE: Hourly observations; daily forecasts
- CORS: No — proxy server-side
- RATE LIMIT: 500 calls/hr per web-service per key (separate budgets for ZIP-obs, latlng-obs, ZIP-forecast, latlng-forecast)
- CRE USE: "Air Quality (AQI)" tile (live + 24h trend)

**25. EPA AQS (historical air quality)**
- ENDPOINT: `https://aqs.epa.gov/data/api/dailyData/byCounty?email=YOU@example.com&key=YOUR_KEY&param=88101&bdate=20240101&edate=20241231&state=04&county=013`
- INPUT: param code (e.g., 88101 PM2.5), date range, geographic filter
- OUTPUT: JSON
- AUTH: Free signup at `https://aqs.epa.gov/aqsweb/documents/data_api.html#signup`
- UPDATE: ~6-month lag
- CORS: Test required (likely proxy)
- RATE LIMIT: 10 req/min, 5-sec courtesy pause, 1M rows/query cap
- CRE USE: "Historical Air Quality (5-yr)" tile

**26. USDA NRCS Soil Data Access (SDA)**
- ENDPOINT (POST): `https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest` with JSON body `{"format":"JSON","query":"SELECT mukey, muname FROM mapunit WHERE mukey IN (SELECT mukey FROM SDA_Get_Mukey_from_intersection_with_WktWgs84('POINT(-77.0369 38.9072)'))"}`. Also WFS for spatial: `https://SDMDataAccess.sc.egov.usda.gov/Spatial/SDMWGS84Geographic.wfs`
- INPUT: WKT point/polygon + SQL query (T-SQL flavor)
- OUTPUT: JSON / XML / WFS GML
- AUTH: None
- UPDATE: With each SSURGO release (annual+)
- CORS: No — POST proxy required
- CRE USE: "Soil Suitability" tile (drainage class, AASHTO group, hydric soil flag — useful for industrial/agri/site engineering)

**27. FAA Airport Noise Contours**
- ENDPOINT: Per-airport Part 150 NEM PDFs/shapefiles indexed at `https://www.faa.gov/airports/environmental/airport_noise/noise_exposure_maps`. No national API.
- INPUT: Airport identifier (manual)
- OUTPUT: Mostly PDF; some airports publish GIS shapefiles
- AUTH: None
- UPDATE: Per-airport, voluntary cadence
- CORS: N/A
- CRE USE: "Airport Noise Exposure" tile (within DNL 65 dB Y/N) — only if backed by airport-specific layers

### CATEGORY 4 — INFRASTRUCTURE & AMENITIES

**28. Walk Score API**
- ENDPOINT: `https://api.walkscore.com/score?format=json&address=1119+8th+Avenue+Seattle+WA+98101&lat=47.6085&lon=-122.3295&transit=1&bike=1&wsapikey=YOUR_KEY`
- INPUT: lat/lon + address; flags `transit=1`, `bike=1` for Transit Score and Bike Score
- OUTPUT: JSON
- AUTH: Free key (5,000 calls/day) at `https://www.walkscore.com/professional/api-sign-up.php`; paid tiers for higher limits and commercial use
- UPDATE: Refreshed every ~6 months
- CORS: No — proxy
- RATE LIMIT: 5,000 calls/day on free tier
- CRE USE: "Walk / Transit / Bike Score" tile (3-score badge)

**29. OpenStreetMap Overpass API (transit, amenities)**
- ENDPOINT: `https://overpass-api.de/api/interpreter` POST body `[out:json][timeout:25];( node["public_transport"="stop_position"](around:1000,40.7580,-73.9855); node["highway"="bus_stop"](around:1000,40.7580,-73.9855); node["railway"="station"](around:1000,40.7580,-73.9855); ); out body; >; out skel qt;`
- INPUT: Overpass QL (around: meters, lat, lng)
- OUTPUT: JSON / XML / CSV
- AUTH: None
- UPDATE: Live OSM (minutes)
- CORS: Yes (the public overpass-api.de instance sends CORS headers)
- RATE LIMIT: Polite use; ~10,000 results/query; alternate mirrors available
- CRE USE: "Transit Stops Within 1 km" tile + "Amenities Nearby" tile (groceries, restaurants, schools — by amenity= tag)

**30. GreatSchools — current status (2026)**
- The free public API has been retired. The replacement is the paid **NearbySchools™ API** at `https://www.greatschools.org/api/`, sold on a flat monthly subscription with **15,000 calls included in the base price** (per greatschools.org/api: "15,000 calls are included in the base price; beyond that, you only pay for what you use, up to a max of 300k calls"). A **14-day free trial** is offered. **Mark as PAID.**
- Free alternative: SchoolDigger (see #31) or state DOE downloads (e.g., CA DOE at `https://www.cde.ca.gov/ds/`).

**31. SchoolDigger API**
- ENDPOINT: `https://api.schooldigger.com/v2.3/schools?st=AZ&zip=85016&appID=YOUR_APPID&appKey=YOUR_KEY`
- INPUT: state, ZIP, lat/lng + distance
- OUTPUT: JSON
- AUTH: Free tier 1,500 calls/month (registration at `https://developer.schooldigger.com/`); paid tiers higher
- UPDATE: Annual school-year cycle
- CORS: No — proxy
- CRE USE: "School Ratings" tile (top-3 schools within 2 mi)

**32. Open Charge Map (EV chargers)**
- ENDPOINT: `https://api.openchargemap.io/v3/poi/?output=json&latitude=37.7749&longitude=-122.4194&distance=10&distanceunit=KM&maxresults=25&compact=true&key=YOUR_API_KEY`
- INPUT: lat/lng + radius, or `boundingbox=`
- OUTPUT: JSON / KML / GeoJSON
- AUTH: Free key at `https://openchargemap.org/site/loginprovider/beginlogin?prompt=register`
- UPDATE: Continuous (crowd + operator feeds)
- CORS: Yes (designed for browser apps)
- RATE LIMIT: No hard cap; throttle/cache
- CRE USE: "EV Charging Stations Nearby" tile

**33. FCC National Broadband Map (BDC) Public Data API**
- ENDPOINT: `https://broadbandmap.fcc.gov/nbm/map/api/published/filing` and per-location endpoints. Full spec at `https://www.fcc.gov/sites/default/files/bdc-public-data-api-spec.pdf`. Address resolution → `Location ID` requires Fabric license; the public API exposes provider/speed availability by Location ID.
- INPUT: FCC Location ID (or filter by state/county/tech/speed); for direct address-to-Location ID resolution, license the Fabric (free for governments/non-profits) at `https://help.bdc.fcc.gov/`
- OUTPUT: JSON / CSV
- AUTH: BDC username + 44-character API token (free; obtain via "Manage API Access" after registering at `https://bdc.fcc.gov/`)
- UPDATE: Twice-yearly availability filings (June + December)
- CORS: No — proxy
- RATE LIMIT: Not publicly documented; per-token throttle
- CRE USE: "Internet Service Availability" tile (max download/upload, # of providers, fiber Y/N)

**34. FBI Crime Data Explorer API**
- ENDPOINT: `https://api.usa.gov/crime/fbi/cde/agency/byStateAbbr/AZ?API_KEY=YOUR_KEY` (list agencies in state with ORIs). Agency-level crime: `https://api.usa.gov/crime/fbi/cde/summarized/agency/{ORI}/all?from=01-2020&to=12-2024&API_KEY=YOUR_KEY`. Estimated state/national: `https://api.usa.gov/crime/fbi/cde/estimate/state/AZ/2020/2024?API_KEY=YOUR_KEY`
- INPUT: state abbr, 9-char ORI agency code, date range
- OUTPUT: JSON
- AUTH: Free api.data.gov key at `https://api.data.gov/signup/`
- UPDATE: Annual (each fall for prior year)
- CORS: Yes (api.data.gov gateway permits CORS)
- RATE LIMIT: 1,000 req/hr default (api.data.gov default)
- CRE USE: "Crime Index" tile — **NOTE**: granularity is agency/ORI level (police department), NOT tract or ZIP. Display as "City of Phoenix PD reported X violent crimes / 100k". For tract granularity, use a paid source.

**35. DOT FHWA — AADT (state DOT layers)**
- ENDPOINT: No single national API. Most state DOTs publish AADT as ArcGIS REST FeatureServers — e.g., Caltrans `https://gis.data.ca.gov/datasets/...`, TxDOT `https://gis-txdot.opendata.arcgis.com/...`, FDOT `https://gis.fdot.gov/arcgis/rest/services/...`. NPMRDS (HPMS-derived national perf data) is restricted to public-sector users.
- INPUT: lat/lng → spatial query against state's AADT FeatureServer
- OUTPUT: JSON / GeoJSON
- AUTH: None for state public services; NPMRDS requires RITIS sign-up (`https://npmrds.ritis.org/`)
- UPDATE: Annual (most DOTs)
- CORS: Yes (most state ArcGIS Online services)
- CRE USE: "Traffic Volume at Frontage" tile (AADT on nearest roadway segment)

### CATEGORY 5 — HOUSING & REAL ESTATE

**36. HUD Fair Market Rents API**
- ENDPOINT: `https://www.huduser.gov/hudapi/public/fmr/data/0801499999?year=2026` (Denver-Aurora-Lakewood, CO MSA, FY2026). Small Area FMR for ZIP: `https://www.huduser.gov/hudapi/public/fmr/data/METROCODE?year=2026` returns ZIP-level array. List FMR areas: `/fmr/listMetroAreas`, `/fmr/listSmallAreas/{state}`.
- INPUT: FIPS-based metro/county code + year; bearer token in `Authorization` header
- OUTPUT: JSON
- AUTH: Free bearer token at `https://www.huduser.gov/hudapi/public/register?comingfrom=1` → My Account → Create New Token
- UPDATE: Annual (effective each October)
- CORS: No — proxy (token must be server-side anyway)
- RATE LIMIT: Not publicly numbered
- CRE USE: "Area Fair Market Rent (by Bedrooms)" tile + ZIP-level Small-Area FMR comparison

**37. HUD Income Limits API**
- ENDPOINT: `https://www.huduser.gov/hudapi/public/il/data/0801499999?year=2025`
- INPUT: same as FMR; `il/listCounties/{state}?updated=2025` for FY2025 FIPS
- OUTPUT: JSON (50%, 80%, 30% AMI for 1–8 person HH)
- AUTH: same HUDUSER token
- UPDATE: Annual
- CORS: No — proxy
- CRE USE: "Area Median Income / LIHTC Income Limits" tile

**38. HUD USPS Vacancy Data**
- ACCESS: Not a public API. Quarterly CSV downloads behind sublicense login at `https://www.huduser.gov/portal/usps/index.html`
- ELIGIBILITY: Restricted to governmental entities and non-profit organizations
- INPUT: Census Tract (data is keyed to tract)
- OUTPUT: CSV
- AUTH: HUD-issued login (approval can take weeks)
- UPDATE: Quarterly
- CORS: N/A
- CRE USE: "Address Vacancy (Residential + Business)" tile — only if your firm qualifies for the sublicense. **Note**: HUD-USPS ZIP↔tract crosswalk API is separate and openly available with HUDUSER token.

**39. Census ACS — Housing Units (B25001/B25002)** — see Demographics #10

**40. Census Building Permits Survey (BPS)**
- ENDPOINT: Static files at `https://www.census.gov/construction/bps/` — CBSA monthly Excel/TXT (e.g., `https://www2.census.gov/econ/bps/Metro/ma2601c.txt` for Jan 2026 CBSA), state monthly, annual.
- INPUT: filename pattern by YYMM
- OUTPUT: TXT (fixed-width) + Excel
- AUTH: None
- UPDATE: Monthly preliminary (~12th workday) + revised (~17th)
- CORS: No — static; proxy
- CRE USE: "Building Permits — 12-mo trend" tile (MSA single-family + multifamily)

**41. FHFA House Price Index**
- ENDPOINT: Direct static files indexed at `https://www.fhfa.gov/data/hpi/datasets` (filenames change quarterly). **Better option**: FRED API carries 393 FHFA HPI MSA series. Example: `https://api.stlouisfed.org/fred/series/observations?series_id=ATNHPIUS14454Q&api_key=YOUR_KEY&file_type=json` (ATNHPIUS14454Q = All-Transactions HPI, Boston-Cambridge-Newton MSA).
- INPUT: FRED series ID per MSA (mapping table at FRED)
- OUTPUT: JSON (FRED) / CSV (FHFA)
- AUTH: Free FRED API key at `https://fred.stlouisfed.org/docs/api/api_key.html`
- UPDATE: Quarterly (MSA, county, tract); monthly (national, state, purchase-only)
- CORS: Yes (FRED API sends CORS headers)
- RATE LIMIT: 120 req/min (FRED)
- CRE USE: "MSA Home Price Index (10-yr Trend)" tile

**42. HUD Opportunity Zones (designated QOZ tracts)**
- ENDPOINT: `https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/Opportunity_Zones/FeatureServer/0/query?geometry=-87.6298,41.8781&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=GEOID10,STATE,COUNTY&returnGeometry=false&f=json`
- INPUT: lat/lng point
- OUTPUT: JSON / GeoJSON
- AUTH: None
- UPDATE: Static 2018 designations (10-yr period); a new round under "OZ 2.0" is expected mid-2026 (CDFI Fund accepted comments through May 5, 2026 on nomination tool revisions)
- CORS: Yes (ArcGIS Online)
- CRE USE: "Opportunity Zone Y/N" tile (key incentive flag for investors)

**43. HUD LIHTC Properties**
- ENDPOINT: `https://services.arcgis.com/VTyQ9soqVukalItT/arcgis/rest/services/LIHTC/FeatureServer/0/query?geometry=...&geometryType=esriGeometryEnvelope&...&f=geojson`. Also at `https://egis.hud.gov/arcgis/rest/services/gotit/LIHTCProperties/MapServer/0/query`
- INPUT: ArcGIS spatial query (envelope or buffered point)
- OUTPUT: JSON / GeoJSON
- AUTH: None
- UPDATE: ~Annual
- CORS: Yes
- CRE USE: "LIHTC Properties Within Radius" tile (competitive supply for affordable developers)

**44. HUD Qualified Census Tracts (QCT)**
- ENDPOINT: `https://services1.arcgis.com/FCaUeJ5SOVtImake/arcgis/rest/services/QCT_2025/FeatureServer/0/query?geometry=...&f=json`. HUDUSER also publishes Excel + dBase at `https://www.huduser.gov/portal/datasets/qct.html`
- INPUT: point geometry
- OUTPUT: JSON / GeoJSON
- AUTH: None
- UPDATE: Annual (2026 designations published September 2025)
- CORS: Yes
- CRE USE: "Qualified Census Tract Y/N" tile (LIHTC basis boost eligibility)

**45. HUD Difficult Development Areas (DDA)**
- ENDPOINT: similar HUD eGIS hosted FeatureServer; layer "DDA_2026". Static dBase at `https://www.huduser.gov/portal/datasets/qct.html`
- OUTPUT: JSON / GeoJSON
- AUTH: None
- UPDATE: Annual (concurrent with QCT)
- CORS: Yes
- CRE USE: "DDA Y/N" tile (30% basis boost eligibility)

### CATEGORY 6 — ENERGY & UTILITIES

**46. EIA v2 — Retail Electricity Rates by State/Sector**
- ENDPOINT: `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=YOUR_KEY&frequency=monthly&data[0]=price&data[1]=revenue&data[2]=sales&facets[stateid][]=CA&facets[sectorid][]=COM&start=2024-01&end=2026-04`
- INPUT: stateid + sectorid (RES/COM/IND/TRA/ALL/OTH), date range
- OUTPUT: JSON
- AUTH: Free key at `https://www.eia.gov/opendata/register.php`
- UPDATE: Monthly
- CORS: Yes (EIA v2 sends CORS headers)
- RATE LIMIT: 5,000 rows per page
- CRE USE: "Avg Commercial Electricity Rate (¢/kWh)" tile

**47. NREL OpenEI — Utility Rates by ZIP (lookup utility from ZIP first)**
- ENDPOINT: `https://developer.nlr.gov/api/utility_rates/v3.json?api_key=YOUR_KEY&address=85016` returns utility name, avg residential/commercial/industrial $/kWh for that ZIP/address. (Replaces previous developer.nrel.gov; old host shuts down May 29, 2026.)
- INPUT: address OR lat+lon
- OUTPUT: JSON / XML
- AUTH: NREL/NLR developer key at `https://developer.nlr.gov/signup/`
- UPDATE: When EIA-861 refreshes
- CORS: Yes (developer.nlr.gov uses api.data.gov gateway with CORS)
- RATE LIMIT: 1,000 req/hr default
- CRE USE: "Utility Provider + Avg Rates" tile

**48. NREL OpenEI URDB — Utility Rate Database (detailed tariffs)**
- ENDPOINT: `https://api.openei.org/utility_rates?version=latest&format=json&detail=full&address=85016&api_key=YOUR_KEY`. Direct URDB queries: `https://api.openei.org/utility_rates?version=8&format=json&getpage=URDB_RATE_ID&api_key=YOUR_KEY`
- INPUT: address, lat+lon, or rate ID
- OUTPUT: JSON
- AUTH: NREL/NLR key
- UPDATE: Continuously curated by NREL + crowd
- CORS: Yes
- CRE USE: "Detailed Electric Tariff Structure" tile (TOU, demand charges — critical for industrial CRE underwriting)

**49. EIA v2 — Natural Gas Prices**
- ENDPOINT: `https://api.eia.gov/v2/natural-gas/pri/sum/data/?api_key=YOUR_KEY&frequency=monthly&data[0]=value&facets[duoarea][]=SAZ&facets[process][]=PCS&start=2024-01` (SAZ = Arizona; process PCS = commercial price, PIN = industrial, PRS = residential)
- INPUT: state code, process code
- OUTPUT: JSON
- AUTH: free EIA key
- UPDATE: Monthly
- CORS: Yes
- CRE USE: "Avg Commercial Natural Gas Price" tile

**50. NREL PVWatts v8 — Solar Production Estimate**
- ENDPOINT: `https://developer.nlr.gov/api/pvwatts/v8.json?api_key=YOUR_KEY&lat=33.45&lon=-112.07&system_capacity=100&module_type=0&losses=14&array_type=1&tilt=20&azimuth=180`
- INPUT: lat/lon + system specs
- OUTPUT: JSON (AC kWh/yr, monthly array, capacity factor)
- AUTH: NREL/NLR key
- UPDATE: When NSRDB TMY refreshes (last ~2020 TMY)
- CORS: Yes
- RATE LIMIT: 1,000 req/hr
- CRE USE: "Rooftop Solar Potential (kWh/yr per kW)" tile (critical for industrial/distribution-center underwriting)

**51. NREL NSRDB — Solar Resource Data**
- ENDPOINT: `https://developer.nlr.gov/api/solar/solar_resource/v1.json?api_key=YOUR_KEY&lat=33.45&lon=-112.07` (returns avg DNI, GHI, Tilt-at-Latitude monthly)
- OUTPUT: JSON
- AUTH: NREL/NLR key
- CORS: Yes
- CRE USE: Supplementary "Solar Resource (kWh/m²/day)" tile

### CATEGORY 7 — ZONING & LAND USE

**52. Nationwide free zoning APIs by address**
- **None exist** as fully free + nationwide. Zoneomics, Regrid (Landgrid), and ATTOM are all paid. Zoneomics offers 100,000 free **tile** calls for map overlay (no attribute query). Regrid offers a 7-day CC-gated trial only. Best free strategy: maintain a city-by-city ArcGIS REST registry below.

**53. NYC ZoLa / NYC DCP Zoning**
- ENDPOINT: `https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nyzd/FeatureServer/0/query?geometry=-73.9855,40.7580&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=ZONEDIST,ZONEDIST_SIMPLE&returnGeometry=false&f=geojson`
- INPUT: point geometry
- OUTPUT: JSON / GeoJSON / PBF; `ZONEDIST` like "R9-1", "C6-2A"
- AUTH: None; CORS Yes
- UPDATE: When DCP changes (multiple times/yr); MaxRecordCount 4000
- CRE USE: "Zoning District" tile (NYC) — sibling layers for commercial overlays, special districts

**54. LA City / LA County Zoning**
- ENDPOINT (LA City zoning via GeoHub, served by Esri Online): `https://geohub.lacity.org/datasets/lahub::zoning/about` (download). For live query, use LA City GeoHub-hosted FeatureServer (look up current URL from the dataset's REST tab). LA County (unincorporated) Z-NET: `https://arcgis.gis.lacounty.gov/arcgis/rest/services/Arcadia/Zoning/MapServer`
- INPUT: ArcGIS point query
- OUTPUT: JSON / GeoJSON
- AUTH: None; CORS Yes
- CRE USE: "Zoning District" (LA market)

**55. Chicago Zoning**
- ENDPOINT: `https://data.cityofchicago.org/resource/7cve-jgbp.geojson?$where=within_circle(the_geom,41.8781,-87.6298,500)` (Socrata SODA, dataset `7cve-jgbp`)
- INPUT: SoQL `$where` with spatial functions
- OUTPUT: JSON / GeoJSON / CSV / XML
- AUTH: Free Socrata App Token (`X-App-Token`) at `https://dev.socrata.com`
- UPDATE: With ordinance changes
- CORS: Yes
- CRE USE: "Zoning District" (Chicago)

**56. Houston permitting (no zoning — but permits available)**
- ENDPOINT: Houston Open Data Socrata at `https://data.houstontx.gov/resource/...` and `https://cohgis-mycity.opendata.arcgis.com/` ArcGIS REST services. Houston has no zoning, but building permits and use restrictions are available via these portals.
- CORS: Yes
- CRE USE: "Building Permit History" tile

**57. NLCD / MRLC — National Land Cover**
- ENDPOINT (WMS GetCapabilities): `https://www.mrlc.gov/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities`. Point query (GetFeatureInfo): `https://www.mrlc.gov/geoserver/mrlc_display/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=mrlc_display:NLCD_2021_Land_Cover_L48&query_layers=mrlc_display:NLCD_2021_Land_Cover_L48&bbox=-13627732,4544933,-13616732,4555933&width=101&height=101&srs=EPSG:3857&info_format=application/json&x=50&y=50`. WCS raster: `https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2021_Land_Cover_L48/ows?service=wcs&version=1.0.0&request=GetCapabilities`
- INPUT: WMS GetFeatureInfo (bbox + pixel x/y) OR WCS GetCoverage (subset)
- OUTPUT: PNG/JPG (visual); JSON (GetFeatureInfo); GeoTIFF (WCS)
- AUTH: None
- UPDATE: Annual NLCD CONUS Collection 1.0 most recent (annual cadence now)
- CORS: Test required — MRLC GeoServer typically allows
- CRE USE: "Land Cover Class (current + 20-yr change)" tile (developed/forest/cropland/water)

### CATEGORY 8 — ISRAEL

**58. Bank of Israel — Representative USD/ILS rate (SDMX EDGE)**
- ENDPOINT: `https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/EXR/1.0/RER_USD_ILS?format=sdmx-json&lastNObservations=1` (single-series CSV variant: append `?format=csv`). All currencies: `.../EXR/1.0/?c[DATA_TYPE]=OF00&startperiod=2025-01-01&endperiod=2026-05-25&format=csv`
- INPUT: SDMX key (e.g., `RER_USD_ILS`, `RER_EUR_ILS`, `RER_GBP_ILS`) + optional date range + format
- OUTPUT: SDMX-JSON / SDMX-XML / CSV / Excel-series / Excel-table
- AUTH: None
- UPDATE: Daily (business days, ~3 PM Israel time)
- CORS: Test required (newer Fusion EDGE typically allows; if not, proxy)
- CRE USE: "USD/ILS FX Rate" tile (essential for cross-border CRE deals)

**59. Bank of Israel — Policy Interest Rate (SDMX EDGE)**
- ENDPOINT: `https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/IR/1.0/IR_BOI_RATE?format=sdmx-json&lastNObservations=24` (24 most recent observations; consult the BOI metadata browser at `https://www.boi.org.il/en/economic-roles/research-and-publications/statistical-bulletin/` to confirm the exact series key in the current dataflow registry)
- INPUT: BOI rate series key
- OUTPUT: SDMX-JSON / CSV
- AUTH: None
- UPDATE: After each Monetary Committee decision (~8/year). The most recent move was the **May 25, 2026 cut to 3.75%**, the Committee's second cut of 2026 (per Globes, May 25, 2026: "The Bank of Israel Monetary Committee…has cut the interest rate 0.25% to 3.75%"). The prior level was 4.0%, held since the January 5, 2026 cut.
- CORS: Test required
- CRE USE: "BOI Policy Rate" tile (Israeli mortgage rate proxy)

**60. CBS (Central Bureau of Statistics, Lamas) — Housing Price Index, CPI, Construction**
- ENDPOINT: `https://apis.cbs.gov.il/SDMX/DATA/IMF/ECOFIN_CBS/1` (SDMX root; aligns with IMF SDDS). For house price index: navigate to the dwelling-price dataflow (`PRC_HOUSING` or similar) — Lamas exposes specific series at `https://apis.cbs.gov.il/SDMX/data/`. Also REST instructions at `https://www.cbs.gov.il/en/Pages/Api-interface.aspx`.
- INPUT: SDMX dataflow + series key
- OUTPUT: SDMX-XML / SDMX-JSON / CSV
- AUTH: None
- UPDATE: Monthly (15th @ 6:30 PM Israel time for prices); quarterly (housing)
- CORS: Test required
- CRE USE: "Israel National Dwelling Price Index" tile, "Israel CPI Housing" tile, "Construction Starts (quarterly)" tile

**61. Tel Aviv Stock Exchange (TASE) Open API**
- ENDPOINT (portal): `https://openapi.tase.co.il/tase/prod/`. Example product: TASE Indices EoD `https://openapi.tase.co.il/tase/prod/product/8221` (returns last 7 trading days for TA-35, TA-125, TA Real-Estate). Index Components Basic: `https://openapi.tase.co.il/tase/prod/product/9069/api/8290`.
- INPUT: OAuth2 access token; product-specific path parameters
- OUTPUT: JSON
- AUTH: Register at `openapi.tase.co.il` → create App → receive client_id + client_secret → subscribe to a Plan (some FREE basic plans, most are PAID monthly subscriptions)
- UPDATE: EoD daily; some intraday products
- CORS: No — server-side only (secret-bound)
- CRE USE: "TA-Real Estate Index" tile (Israeli REIT benchmark)

**62. data.gov.il — CKAN Open Data API**
- ENDPOINT: `https://data.gov.il/api/3/action/package_search?q=real+estate` (list datasets), `https://data.gov.il/api/3/action/datastore_search?resource_id=...&limit=100&q=...` (query a resource), `https://data.gov.il/api/3/action/datastore_search_sql?sql=SELECT...` (SQL on enabled resources)
- INPUT: standard CKAN actions (`package_list`, `package_show`, `datastore_search`, `datastore_search_sql`)
- OUTPUT: JSON
- AUTH: Anonymous works for public datasets; API key needed for writes
- UPDATE: Per-dataset (varies)
- CORS: Yes (CKAN default allows CORS)
- CRE USE: "Israeli Transactions Lookup" — e.g., `nadlan.gov.il` (real-estate transactions) datasets are mirrored here

**63. Israeli mortgage rates**
- No single API. Bank of Israel publishes aggregated new mortgage rates in monthly "Banking" statistical bulletin (SDMX EDGE under `BANKING` dataflow). Each commercial bank also publishes a "prime + spread" table on its site — not standardized.
- ENDPOINT: BOI SDMX (see #59) + scraping at `https://www.boi.org.il/en/economic-roles/statistics/banking-statistics/`
- UPDATE: Monthly
- CRE USE: "Israeli Avg Mortgage Rate (5-yr Fixed)" tile

### Helper / Misc

**64. HUD-USPS ZIP↔Tract Crosswalk API**
- ENDPOINT: `https://www.huduser.gov/hudapi/public/usps?type=1&query=85016&year=2025` (type: 1=ZIP-TRACT, 2=ZIP-COUNTY, 3=ZIP-CBSA, etc.)
- AUTH: HUDUSER bearer token (same as FMR)
- OUTPUT: JSON
- UPDATE: Quarterly
- CORS: No — proxy
- CRE USE: Backend reverse-lookup (ZIP→tract list) for tile aggregation

**65. FRED API (St. Louis Fed) — macro context**
- ENDPOINT: `https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=YOUR_KEY&file_type=json` (10-yr Treasury); `MORTGAGE30US` (30-yr fixed mortgage avg); `CPIAUCSL` (CPI); `T10YIE` (10-yr breakeven inflation)
- AUTH: Free key at `https://fred.stlouisfed.org/docs/api/api_key.html`
- OUTPUT: JSON / XML / CSV
- UPDATE: Real-time as series refresh
- CORS: Yes
- RATE LIMIT: 120 req/min
- CRE USE: "10-yr Treasury", "30-yr Mortgage", "MSA HPI Trend" — all CRE underwriting fundamentals

---

## Recommendations

**Stage 1 — Build the panel MVP with these 10 tiles (all CORS-friendly except where noted):**
1. **Median HH Income** — Census ACS B19013 (direct browser; free key)
2. **Population & Age Mix** — Census ACS B01003 + B01001 (browser)
3. **Owner/Renter Mix** — Census ACS B25003 (browser)
4. **Flood Zone** — FEMA NFHL ArcGIS (browser)
5. **Opportunity Zone Y/N** — HUD OZ ArcGIS (browser)
6. **AQI** — EPA AirNow (proxy)
7. **Avg Electricity Rate** — EIA v2 retail-sales (browser; free key)
8. **Solar Production** — NREL PVWatts v8 at developer.nlr.gov (browser; free key)
9. **Walk/Transit/Bike Score** — Walk Score API (proxy; 5k/day free)
10. **Broadband Speeds** — FCC BDC (proxy; free token)

**Stage 2 — Add 5 more once Stage 1 is stable:**
11. Seismic Design Category — USGS web service (browser)
12. Crime — FBI CDE (browser; api.data.gov key) — clearly label as **agency-level**
13. Building Permits 12-mo Trend — Census BPS ETL job (server)
14. MSA HPI Trend — FRED (browser; free key)
15. Zoning District — city/state ArcGIS layer (browser) where available; fallback "Zoning Unknown — see municipal portal"

**Stage 3 — Optional/premium tiles:**
- LIHTC properties radius (HUD ArcGIS)
- Brownfield/Superfund proximity (EPA CIMC)
- EV chargers (Open Charge Map)
- School ratings (SchoolDigger or paid GreatSchools NearbySchools™ API)
- BOI USD/ILS + TA-Real Estate index (Israel deals)

**Architecture decision points:**
- Build a single `/proxy?source=X` Cloudflare Worker (or Vercel Edge Function) that handles the no-CORS sources (BLS, HUD, AirNow, Walk Score, FCC, FHFA static, BPS static, TASE OAuth). Cache aggressively in KV (24h for ACS, 1h for AirNow, monthly for BLS).
- Cache geocoding at `https://geocoding.geo.census.gov/...` for 30 days per address — every other tile is keyed to its state/county/tract result.
- For tract-keyed tiles, precompute results once per ACS release year and store in your own DB; only Mortgage/AQI/Walk Score need live calls.
- **Migrate all NREL calls to `developer.nlr.gov` before May 29, 2026.** The DOE renamed NREL to the National Laboratory of the Rockies on December 1, 2025, and the legacy `developer.nrel.gov` shuts down completely on May 29, 2026.

**Benchmarks that should change the plan:**
- If you exceed 5,000 Walk Score calls/day → either upgrade to paid, or build your own walkability index from Overpass amenity counts + OSM street density.
- If you exceed 1,000 req/hr on api.data.gov endpoints (NREL/NLR, FBI CDE) → upgrade key tier (free upgrade by emailing api.data.gov support).
- If broker demand for Houston/Dallas/Phoenix zoning grows → invest in Regrid or Zoneomics subscription rather than maintaining 50+ city ArcGIS adapters.

---

## Caveats

1. **NREL host migration deadline May 29, 2026.** Anything pointing at `developer.nrel.gov` will break — update to `developer.nlr.gov` immediately for PVWatts, URDB, NSRDB calls. The lab itself was renamed "National Laboratory of the Rockies" by DOE on December 1, 2025; all branding/email/domain follows.
2. **FBI Crime Data Explorer granularity** is at the **agency (ORI) level**, not tract or ZIP. Do not advertise "crime rate by neighborhood" if you are sourcing the FBI API — that requires NIBRS-incident-level aggregation or a paid provider (e.g., LexisNexis, ATTOM Crime).
3. **HUD USPS Vacancy Data** is the most common myth in CRE tech: it is **not a public API**. Brokers' platforms that show "vacancy by tract" either (a) sourced it under a sublicense as a government/non-profit, (b) bought it from a redistributor, or (c) are conflating it with USPS NCOA (which is different and even more restricted).
4. **ACS suppression and margins of error**: B19013 in low-population tracts returns nulls or wide MOEs. Always pull the `_M` margin variable and grey out tiles with MOE > 30% of estimate, or pull a wider geography (county) fallback.
5. **FEMA NFHL coverage**: per FEMA's official NFHL page, "NFHL digital data covers over 90% of the U.S. population" — but a meaningful share of rural/unincorporated areas still has no digital flood data. Handle "no result" gracefully (do not assume "out of zone").
6. **CORS testing is required.** Where CORS is marked "Yes," it reflects current behavior on a public ArcGIS Online or api.data.gov endpoint, but agency redeploys (e.g., FEMA's NFHL ArcGIS) have changed headers in the past. Always include a server-side fallback path.
7. **TASE Open API is mostly paid.** Free tier exposes only delayed/partial market data; for live TA-Real-Estate index components a paid plan is required.
8. **Bank of Israel/CBS endpoints are SDMX**, not REST-style JSON. Your parser must handle SDMX-JSON (or fall back to CSV format with `?format=csv` which is easier).
9. **CDC PLACES**: model-based estimates of 40 chronic-disease/health measures (per CDC: "A small area estimation methodology is used to obtain data on 40 chronic disease and other health-related measures"), not direct surveillance — useful for "neighborhood health profile" framing but should not be presented as ground-truth disease prevalence at the parcel level.
10. **Opportunity Zone re-designation pending**: the original 2018 OZ designations expire on a 10-yr schedule; CDFI Fund accepted comments through May 5, 2026 on OZ 2.0 nomination tool revisions — the QOZ list may change in mid-to-late 2026.
11. **GreatSchools' replacement is paid.** The new NearbySchools™ API includes 15,000 calls/month in the base price (per greatschools.org/api) with a 14-day free trial. Plan around this if you advertise "school ratings near you."
12. **ACS vintage**: the 2020–2024 ACS 5-year estimates went live on **January 29, 2026**, per the U.S. Census Bureau's ACS Updates page. Switch from `data/2023/acs/acs5` to `data/2024/acs/acs5` once your dependencies/variable mappings are validated against the 2024 5YR API Changes document.