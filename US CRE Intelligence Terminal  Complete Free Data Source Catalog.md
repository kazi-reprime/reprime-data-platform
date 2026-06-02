# US CRE Intelligence Terminal: Complete Free Data Source Catalog
### Risk · Distress · Environmental · Due-Diligence Data Layer — May 2026

***

## Master Reference Table

> **Column key:** Auth = authentication required | Cadence = update frequency | Geo = geographic granularity | Layer = map layer or alert ticker powered | Free/Paid = access tier

***

### DISTRESS

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 1 | **HUD REO (FHA Foreclosures)** | `https://www.hudhomestore.gov` listing portal; bulk via HUD USPS API `https://www.huduser.gov/portal/dataset/` | HTML/JSON | Free account (broker NAID for offers) | Daily refresh | Property / ZIP | REO inventory overlay; price-reduced alert ticker | Free (search); **no public CSV bulk feed**—scraping TOS-sensitive[^1][^2] |
| 2 | **USDA Rural Development REO** | `https://properties.sc.egov.usda.gov/resales/public/home`; bulk flat files at `https://www.sc.egov.usda.gov/data/data_files.html` (REO .TXT + FCL .TXT) | TXT/HTML | None | ~Weekly | Property / County | Rural distress heatmap; farm & ranch REO layer | Free[^3][^4][^5] |
| 3 | **VA Vendee REO** | `https://listings.vrmco.com` (VRM Mortgage Services, VA's exclusive agent) | HTML/Map | Free (VRM account for offers) | Daily | Property / State | VA REO pin layer on state map | Free to search; **no machine-readable feed**—VRM portal only[^6][^7] |
| 4 | **Fannie Mae HomePath REO** | `https://homepath.fanniemae.com` (search UI); loan-performance data (includes REO flags) at `https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/fannie-mae-single-family-loan-performance-data` | HTML / CSV (loan-level, quarterly) | Free registration for loan-level CSV | Quarterly (loan CSV); daily (portal) | Property / ZIP | Active REO map; delinquency pipeline layer | Free for non-commercial; redistribution requires license[^8][^9][^10] |
| 5 | **Freddie Mac HomeSteps REO** | `https://www.homesteps.com`; loan-level dataset (REO flags) at `https://freddiemac.com/research/datasets/sf-loanlevel-dataset` via Clarity Data Intelligence | HTML / CSV (quarterly) | Clarity account (free) for loan CSV | Quarterly | Property / ZIP | REO inventory layer; REO pipeline trend chart | Free non-commercial; commercial redistribution requires license[^11][^12] |
| 6 | **FDIC Failed Banks + Asset Inventory** | BankFind API: `https://api.fdic.gov/banks/` (endpoints: `/failures`, `/institutions`, `/summary`); bulk: `https://banks.data.fdic.gov/bankfind-suite/bulkData/bulkDataDownload` | JSON / CSV | None (public API) | ~Weekly (failures); quarterly (financials) | Bank/County/State | Failed-bank alert ticker; banking stress heatmap | Fully free[^13][^14][^15] |
| 7a | **Trepp CMBS Delinquency Report** | Monthly PDF: `https://www.trepp.com/hubfs/Trepp%20CMBS%20Delinquency%20Report%20[Month]%202025.pdf` (pattern URL); blog posts at `trepp.com/trepptalk` | PDF (free); structured data (paid) | None for PDF; paid for Trepp API | Monthly | Property-type / National | CMBS delinquency trend chart; office/retail stress ticker | Monthly PDF = **free**; loan-level data = **paid** subscription[^16][^17][^18] |
| 7b | **KBRA CMBS Surveillance** | Monthly report: `https://www.kbra.com/publications/` (search "CMBS Loan Performance Trends"); direct example: `https://www.kbra.com/publications/vkLSmnfq` | PDF / HTML | Free KBRA account | Monthly | Deal-level / National | CMBS distress rate trend; deal-level surveillance feed | Free (public research); analytics platform = **paid**[^19][^20][^21] |
| 7c | **DBRS Morningstar (Morningstar Credit) CMBS** | `https://dbrs.morningstar.com/research/cmbs` — monthly commentary & surveillance PDFs | PDF | Free account | Monthly | Deal/Loan level | CMBS watchlist layer | Free PDFs; structured data = **paid** |
| 7d | **Moody's Analytics CMBS** | `https://www.moodys.com/web/en/us/commercial-real-estate.html` — CRE research PDFs | PDF | Free account | Monthly/Ad hoc | National | Sector commentary | Free PDFs; CRE data platform = **paid** |
| 8 | **US Bankruptcy Court PACER** | `https://pacer.uscourts.gov` | HTML/PDF | PACER account ($0.10/page, waived < $30/quarter) | Real-time | Court / Case / Property | Bankruptcy alert ticker (by debtor address) | **Nominally paid** (per-page); effectively free for low-volume users[^22] |
| 8b | **CourtListener RECAP Archive** | `https://www.courtlistener.com`; REST API `https://www.courtlistener.com/api/rest/v4/`; RECAP search alerts (June 2025) | JSON / HTML | Free account (alerts) | Near real-time (crowdsourced uploads) | Case / Federal District | Bankruptcy/foreclosure keyword alert feed | Free (5 daily alerts); paid tiers $10–$100/mo for real-time[^23][^24][^25] |
| 9 | **State Court Foreclosure Dashboards** | **FL:** `https://flhousingdata.shimberg.ufl.edu/eviction-foreclosure/` (UF Shimberg Center); **TX:** `https://www.txcourts.gov/statistics/` monthly reports; **CA:** No central portal — use ATTOM or county superior courts; **AZ:** `https://www.superiorcourt.maricopa.gov/` (Maricopa dominant); **NV:** `https://nvcourts.gov/Supreme/Statistics/` ; **GA:** `https://georgiacourts.gov/research-and-data/`; **OH:** `https://www.supremecourt.ohio.gov/Publications/annrep/` | PDF / HTML | None | Monthly/Quarterly | County / State | State-level foreclosure starts heat ring | Free (public court records)[^26][^27] |
| 10 | **ATTOM Foreclosure Press Releases** | `https://www.attomdata.com/news/market-trends/foreclosures/` — monthly, quarterly, mid-year, year-end press releases; syndicated on PR Newswire | HTML / PR Newswire RSS | None | Monthly | County / ZIP / State | Foreclosure starts/completions trend overlay | Free (press release aggregates); granular address-level data = **paid** ATTOM API[^28][^29][^30] |
| 11 | **US Marshals Seized Property** | `https://www.usmarshals.gov/what-we-do/asset-forfeiture` (main); asset listings at `https://www.usmarshals.gov/assets`; DOJ auction link at `https://www.justice.gov/usao/selling-forfeited-property` | HTML | None | Ad hoc / case-by-case | Property / District | Seized asset alert feed | Free[^31][^32] |
| 12 | **Tax-Deed / County Auctions** | No federal portal; county-by-county: **FL:** `https://www.myfloridalegal.com` + individual clerk sites; **TX:** county appraisal district sites; **GA:** `https://www.gsccca.org/search`; general aggregator: `https://www.bid4assets.com` and `https://www.realauction.com` | HTML | None (some counties require bidder registration) | Variable (weekly–monthly) | Parcel / County | Upcoming tax-deed auction calendar layer | Free to view; bidder registration may require deposit[^33] |
| 13 | **GSA Auctions (Federal Surplus Real Estate)** | `https://gsaauctions.gov` (portal); federal real estate listings at `https://www.gsa.gov/real-estate/real-estate-services/real-property-disposal/real-property-for-sale-lease`; FedBizOpps/SAM.gov notifications at `https://sam.gov` | HTML | Free Login.gov account for bidding | Ad hoc | Property / Region | Federal surplus property layer | Free to browse; identity verification required to bid[^34][^35][^36] |

***

### FLOOD & CLIMATE

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 14 | **FEMA NFHL (National Flood Hazard Layer)** | ArcGIS REST: `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer`; WMS: `https://hazards.fema.gov/arcgis/services/public/NFHLWMS/MapServer/WMSServer`; WFS: `https://hazards.fema.gov/arcgis/services/public/NFHL/MapServer/WFSServer`; Preliminary: `https://hazards.fema.gov/arcgis/rest/services/PrelimPending/Prelim_NFHL/MapServer` | GIS REST / WMS / WFS / KMZ | None | Continuous (FIRM updates as Letters of Map Revision issued) | Parcel / Flood Zone / Floodway | SFHA flood zone overlay; 100-yr / 500-yr flood boundary layer | Fully free[^37][^38][^39] |
| 15 | **FEMA OpenFEMA — NFIP Claims & Policies** | `https://www.fema.gov/openfema-data-page/fima-nfip-redacted-claims-v2`; direct API: `https://www.fema.gov/api/open/v2/FimaNfipClaims` | JSON / CSV | None | Quarterly refresh | ZIP / County / Census Tract | NFIP claims density heatmap; flood loss history layer | Fully free[^40][^41][^42] |
| 16 | **NOAA Billion-Dollar Disasters** | `https://www.ncei.noaa.gov/access/billions/` — CSV downloads at `/time-series/` and `/summary-stats/`; **⚠️ NOTE: NOAA ceased updates to this database in May 2025; data archived through 2024** | CSV | None | **Archived (ceased May 2025)** | State / National | Historical catastrophe loss overlay | Free (archived)[^43][^44][^45] |
| 17 | **NOAA Storm Events Database** | `https://www.ncei.noaa.gov/stormevents/ftp.jsp`; FTP/HTTP bulk CSV by year; API: `https://www.ncei.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND` | CSV | Token required (free, instant) for API | Jan 1950–current; monthly additions | County / NWS Zone | Storm damage heatmap; flood/tornado event alert layer | Free[^46][^47][^48] |
| 18 | **NOAA Climate at a Glance API** | Portal: `https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/`; CDO API base: `https://www.ncei.noaa.gov/cdo-web/api/v2/{endpoint}` | JSON | Free token (email request) | Monthly | Division / State / National | Temperature/precip anomaly trend chart | Free (10,000 req/day)[^49][^50][^51] |
| 19 | **First Street Foundation Risk Factor** | `https://firststreet.org` / `https://riskfactor.com` — property lookup free on website; bulk property-level data on Zenodo (county/ZIP aggregates): `https://zenodo.org/records/6459076` | Web UI / CSV (aggregates free; property-level via API) | None for web lookup | Annual model updates | Property / ZIP / County | Flood/fire/wind/heat risk score overlay | Property-level lookup = **free** on website; **bulk property-level API = paid**; county/ZIP aggregates on Zenodo = free[^52][^53][^54][^55] |
| 20 | **FEMA Hazus** | `https://www.fema.gov/flood-maps/tools-resources/hazus`; download at `https://www.fema.gov/hazus-software-download` | Desktop GIS software / GDB output | Free (Windows install) | Annual releases | Census Tract / County | Loss estimation raster; multi-hazard scenario layer | Free (desktop)[^56] |

***

### WILDFIRE

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 21 | **NIFC Fire Perimeters (WFIGS)** | ArcGIS Hub current perimeters: `https://data-nifc.opendata.arcgis.com/datasets/nifc::wfigs-current-interagency-fire-perimeters/about`; EGP portal: `https://egp-nifc.hub.arcgis.com/`; historical all years: `https://data-nifc.opendata.arcgis.com/datasets/nifc::interagencyfireperimeterhistory-all-years-view/about` | GeoJSON / Shapefile / ArcGIS REST | None | Near real-time (operational updates) | Fire Perimeter / Incident | Active wildfire perimeter live layer; burn scar overlay | Fully free[^57][^58][^59][^60][^61] |
| 22a | **InciWeb Wildfire Incidents** | `https://inciweb.wildfire.gov/` — interagency incident management; state feeds: `https://inciweb.wildfire.gov/state/{state}` | HTML / Atom RSS | None | Real-time | Incident / State | Active incident marker layer; new incident alert ticker | Fully free[^62][^63] |
| 22b | **NASA FIRMS Fire Detections** | API: `https://firms.modaps.eosdis.nasa.gov/api/area/csv/[MAP_KEY]/VIIRS_NOAA20_NRT/[BBOX]/[DAYS]`; MAP_KEY free signup at `https://firms.modaps.eosdis.nasa.gov/api/map_key`; sensor options: MODIS, VIIRS S-NPP, NOAA-20, NOAA-21 | CSV / KML / SHP / WMS | Free MAP_KEY | Near real-time (within 3 hrs globally; real-time for US/Canada) | ~375m pixel / Point | Active fire hotspot live layer; thermal anomaly ticker | Fully free (MAP_KEY)[^64][^65][^66][^67] |
| 22c | **NOAA HMS Smoke** | `https://www.ospo.noaa.gov/Products/land/hms.html`; smoke polygon shapefiles and KML | SHP / KML | None | Daily | ~1km grid | Wildfire smoke plume overlay | Fully free |

***

### EARTHQUAKE

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 23 | **USGS Earthquake Catalog API** | `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&[params]`; real-time GeoJSON feeds: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`; ENS email/SMS alerts at `https://earthquake.usgs.gov/ens/` | GeoJSON / GeoAtom / CSV / QuakeML | None | Real-time (< 5 min latency) | Point / Region | Seismic event live map; M≥3.0 property-radius alert ticker | Fully free[^68][^69][^70] |
| 24 | **USGS NSHM Seismic Hazard** | 2023 NSHM model data: `https://earthquake.usgs.gov/nshmp/`; raster/GeoJSON downloads at `https://data.usgs.gov/datacatalog/search?usgsKeyword=National+Seismic+Hazard+Model`; code at `https://github.com/usgs/nshmp-haz` | Raster / GeoJSON / CSV | None | Model cycle (~5 years; 2023 is current) | County / Grid Cell | Seismic hazard raster overlay (PGA, Sa) | Fully free[^71][^72][^73][^74][^75] |

***

### ENVIRONMENTAL

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 25 | **EPA Envirofacts API** | `https://enviro.epa.gov/enviro/efservice/[TABLE]/[COLUMN]/[VALUE]/[FORMAT]`; developer portal: `https://www.epa.gov/enviro/envirofacts-data-service-api`; integrates: TRI, Superfund SEMS, RCRAInfo, SDWIS, ECHO, RadNet | JSON / XML / CSV | None | Varies by sub-system (daily–annual) | Address / ZIP / County | Multi-hazard environmental facility overlay | Fully free[^76][^77][^78][^79] |
| 26 | **EPA Toxic Release Inventory (TRI)** | `https://enviro.epa.gov/enviro/tri_formr_v2.fac_list?`; bulk downloads: `https://www.epa.gov/toxics-release-inventory-tri-program/tri-basic-data-files-calendar-years-1987-present` | CSV | None | Annual (prior year released each October) | Facility / County | TRI facility buffer heatmap; toxic release proximity alert | Fully free[^76][^77] |
| 27 | **EPA Superfund NPL** | ArcGIS Hub: `https://hub.arcgis.com/datasets/EPA::superfund-national-priorities-list-npl-sites-with-status-information/about`; EPA data: `https://www.epa.gov/superfund/superfund-data-and-reports`; Envirofacts SEMS table | CSV / GeoJSON | None | Updated per rulemaking (~monthly) | Site / Address | Superfund site overlay; proximity risk alert layer | Fully free[^80][^81][^82][^83] |
| 28 | **EPA RCRA Hazardous Waste** | RCRAInfo via Envirofacts: `https://enviro.epa.gov/enviro/efservice/RCRA_HANDLER_BASIC/`; ECHO facility search: `https://echo.epa.gov/` | JSON / CSV | None | Quarterly | Facility / County | RCRA handler facility layer; hazmat proximity flag | Fully free[^76] |
| 29 | **EPA UST (Underground Storage Tanks)** | LUST/UST data via Envirofacts; also ECHO: `https://echo.epa.gov/facilities/facility-search?regulation_type=UST`; state-level UST data varies (e.g., CA: `https://geotracker.waterboards.ca.gov/`) | JSON / CSV | None | State-reported, quarterly rollup | Tank site / ZIP | UST / LUST contamination point layer | Fully free at EPA; some state portals require free account[^77][^78] |

***

### CRIME

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 30 | **FBI Crime Data Explorer API** | Portal: `https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/home`; bulk downloads: `https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/downloads`; API key requests at same portal | CSV / JSON | Free API key | Annual (UCR); monthly updates (NIBRS) | Agency / County / City | Crime rate heatmap; property crime index layer | Fully free[^84][^85][^86][^87] |
| 31a | **NYC Open Data (Crime/311)** | Socrata: `https://data.cityofnewyork.us/resource/qgea-i56i.json` (complaint data); ArcGIS: `https://maps.nyc.gov/crime/` | JSON / CSV / GeoJSON | None (rate limits without key) | Daily | Block / Precinct | Crime incident overlay; complaint density heatmap | Fully free |
| 31b | **Chicago Data Portal** | `https://data.cityofchicago.org/resource/ijzp-q8t2.json` (crimes 2001–present) | JSON / CSV | None (Socrata) | Daily | Block / Beat | Crime trend layer | Fully free |
| 31c | **LA Open Data** | `https://data.lacity.org/resource/2nrs-mtv8.json` (crime incidents); `https://data.lacity.org/resource/y8tr-7khq.json` (arrests) | JSON / CSV | None (Socrata) | Monthly | Reporting District | Crime heat overlay | Fully free |
| 31d | **Houston Open Data** | `https://www.houstontx.gov/police/cs/crime-stats.htm`; ArcGIS Hub crime data | HTML / CSV | None | Monthly | Council District / ZIP | Crime stats layer | Fully free |
| 31e | **Phoenix Open Data** | `https://www.phoenixopendata.com/dataset/crime-stats` (Socrata) | JSON / CSV | None | Monthly | City / Beat | Crime incident layer | Fully free[^88] |

***

### INSURANCE

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 32a | **NAIC SERFF Filing Access (SFA)** | `https://portals.naic.org/serff-filing-access` — public view of rate/form filings for all participating states | HTML | None | Continuous (as filed) | State / Line of Business | Insurance rate-change alert ticker | Free (public access)[^89][^90][^91] |
| 32b | **Florida OIR IRFS** | `https://irfssearch.floir.gov` — full P&C and L&H rate/form filing search since 2001 | HTML / PDF | None | Continuous | State / Company / Line | FL rate increase alert; P&C filing trend chart | Fully free[^92] |
| 32c | **CA CDI (Dept of Insurance)** | `https://interactive.web.insurance.ca.gov/apex_extprd/f?p=102:1` (rate filing search) | HTML | None | Continuous | State / Company | CA homeowner rate filing alert | Fully free |
| 33a | **Florida Citizens Property Insurance** | `https://www.citizensfla.com` — weekly policy counts published on website; statistical reports at `https://www.citizensfla.com/statistical-reports` | HTML / PDF | None | Weekly policy count; annual statistical report | ZIP / County | Citizens policy-count trend chart; depopulation momentum tracker | Fully free[^93][^94][^95][^96] |
| 33b | **California FAIR Plan** | `https://www.cfpca.org` — annual report; CDI publishes FAIR Plan data at `https://www.insurance.ca.gov/01-consumers/120-company/01-whichco/fair_plan.cfm` | PDF / HTML | None | Annual | County / ZIP | FAIR Plan exposure heatmap (CA wildfire zones) | Fully free |
| 33c | **NC Joint Underwriting Assoc. / Beach Plan** | `https://www.ncjua.com`; statistical reports publicly available | PDF | None | Annual | County (coastal) | Insurer-of-last-resort exposure layer | Fully free |
| 33d | **Texas Windstorm Insurance Assn. (TWIA)** | `https://www.twia.org`; TDI resources: `https://www.tdi.texas.gov/commercial/pctwia.html`; annual report with policy counts | PDF / HTML | None | Annual (report); policy lookup real-time | County (coastal TDI-designated) | TWIA exposure concentration heatmap | Fully free[^97][^98][^99][^100] |

***

### ZONING & PARCEL

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 34a | **NYC ZoLa** | `https://zola.planning.nyc.gov`; open data layers at `https://data.cityofnewyork.us/Development/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks` (MapPLUTO) | Web UI / GeoJSON / SHP | None | ~Quarterly (PLUTO) | Tax Lot / Parcel | Zoning district overlay; proposed rezoning alert layer | Fully free[^101][^102][^103] |
| 34b | **LA City Planning** | ArcGIS REST: `https://gis.lacity.org/arcgis/rest/services/ZONING/`; open data: `https://data.lacity.org/A-Prosperous-City/Zoning/5sdx-iy7m` | GeoJSON / ArcGIS REST | None | As amended | Parcel | Zoning overlay; upzone proposal tracker | Fully free |
| 34c | **SF Planning** | `https://data.sfgov.org/Housing-and-Buildings/Zoning-Districts/kkvh-xhqp` (Socrata); ArcGIS: `https://sfgis.maps.arcgis.com/` | GeoJSON / SHP | None | As amended | Parcel | Zoning district layer | Fully free |
| 34d | **Chicago Zoning** | `https://data.cityofchicago.org/Community-Economic-Development/Boundaries-Zoning-Districts/p8va-airx` (Socrata); open data portal: `https://data.cityofchicago.org` | GeoJSON / CSV | None | As amended | Parcel / Lot | Zoning district overlay | Fully free |
| 34e | **Boston Zoning** | `https://bostonopendata-boston.opendata.arcgis.com/datasets/zoning-districts` | GeoJSON / SHP | None | As amended | Parcel | Zoning map layer | Fully free |
| 34f | **Seattle Zoning** | `https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::zoning` | GeoJSON / SHP | None | As amended | Parcel | Zoning overlay | Fully free |
| 34g | **Austin Zoning** | `https://data.austintexas.gov/Locations-and-Maps/Zoning/5rzy-nm5e` (Socrata) | GeoJSON / CSV | None | As amended | Parcel | Zoning layer | Fully free |
| 34h | **Portland Zoning** | `https://gis-pdx.opendata.arcgis.com/datasets/zoning-` | GeoJSON / SHP | None | As amended | Parcel | Zoning overlay | Fully free[^104] |
| 35 | **Building Footprints** | Microsoft US: `https://github.com/microsoft/GlobalMLBuildingFootprints/` (~1.4B global, ODbL); OvertureMaps: `https://overturemaps.org/download/` (CONUS, combines OSM + Google + MS + Esri, ODbL); OpenStreetMap: via Overpass API `https://overpass-api.de/` | GeoJSON / Parquet / SHP | None | MS: periodic; Overture: quarterly releases | Building / Parcel | Building footprint layer; vacancy analysis overlay | Fully free (ODbL)[^105][^106][^107][^108] |
| 36 | **Census TIGER/Line Shapefiles** | `https://www.census.gov/cgi-bin/geo/shapefiles/index.php`; API: `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/` | SHP / GeoJSON | None | Annual | Block / Tract / County / State | Parcel boundary, census geography base layers | Fully free[^9] |

***

### BROADBAND

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 37 | **FCC Broadband Data Collection (BDC)** | `https://broadbandmap.fcc.gov/data-download`; API: `https://broadbandmap.fcc.gov/api/public/map/`; ArcGIS: `https://www.arcgis.com/home/item.html?id=e1343efcefc344709057260ee57290a0` (June 2025 BDC data) | CSV / Parquet / GeoJSON | None | Semi-annual (March & September filings; March 2026 data current) | BSL (6-digit H3 tile) / Block / County | Broadband availability heatmap; served/unserved BSL overlay | Fully free[^109][^110][^111][^112] |
| 38 | **FCC Form 477 (Legacy)** | `https://www.fcc.gov/general/broadband-deployment-data-fcc-form-477`; bulk download at FCC Data page | CSV | None | Semi-annual (pre-BDC; superseded by BDC after Dec 2022) | Census Block | Legacy coverage layer (useful for 2013–2022 trend) | Fully free[^113] |
| 39 | **Ookla Speedtest Open Data** | AWS S3: `s3://ookla-open-data/`; direct downloads: `https://ookla-open-data.s3.amazonaws.com/shapefiles/performance/type=fixed/year=2024/quarter=4/2024-10-01_performance_fixed_tiles.zip`; GitHub: `https://github.com/teamookla/ookla-open-data`; AWS registry: `https://registry.opendata.aws/speedtest-global-performance/` | SHP / Parquet | None (CC BY-NC-SA 4.0 license) | Quarterly | ~610m tile (zoom-16 web Mercator) | Actual speed performance heatmap; underserved corridor overlay | Free non-commercial; **commercial use requires Ookla license**[^114][^115][^116][^117][^118] |

***

### TITLE & ANTI-MONEY LAUNDERING

| # | Source | Exact URL | Format | Auth | Cadence | Geo Granularity | Map Layer / Alert Ticker | Free vs Paid |
|---|--------|-----------|--------|------|---------|-----------------|--------------------------|--------------|
| 40 | **FinCEN BOI (Beneficial Ownership)** | `https://www.fincen.gov/boi` — **⚠️ CRITICAL UPDATE:** As of March 26, 2025, all US domestic entities are **exempt** from BOI reporting under the CTA interim final rule. Only foreign entities registered in the US must file. The BOI database is **not publicly accessible** — it is law-enforcement-only. No public query API exists. | N/A (no public access) | Law enforcement only | Ongoing (foreign entities only) | Entity level | **No public layer** — not available for commercial terminal | **Not publicly accessible** — law enforcement only[^119][^120][^121] |
| 41 | **FinCEN Residential Real Estate GTO / RRE Rule** | GTO PDFs: `https://www.fincen.gov/news/news-releases/fincen-renews-residential-real-estate-geographic-targeting-orders-0`; current GTO PDF: `https://www.fincen.gov/system/files/2025-10/RRE-GTO-Order.pdf`; **RRE Rule** (effective March 1, 2026): requires all non-financed residential transfers to entities/trusts reported via FinCEN AML filings; details: `https://www.fincen.gov/anti-money-laundering-regulations-real-estate` | PDF (GTO text); no public data API | Law enforcement (filings); public GTO text = free | GTOs renewed ~every 180 days; RRE Rule permanent as of March 2026 | Metro-area counties (14 states + DC covered as of Oct 2025) | All-cash shell-company transaction risk flag layer (covered metro map) | GTO text = **free**; underlying CTR filings = **not public**[^122][^123][^124][^125] |

***

## Part A — Top 12 Highest-Leverage Feeds for CRE Due-Diligence Overlay

These 12 feeds deliver the highest signal-to-noise ratio for a property-level due-diligence intelligence layer, based on data quality, endpoint accessibility, geographic granularity, and direct relevance to underwriting decisions:

1. **FEMA NFHL ArcGIS REST** (`hazards.fema.gov`) — instant flood zone classification at the parcel level; zero-auth, real-time[^37]
2. **USGS Earthquake Catalog API** (`earthquake.usgs.gov/fdsnws/event/1/`) — live seismic event data with radius-from-property queries; no-auth JSON[^68]
3. **FDIC BankFind API** (`api.fdic.gov/banks/failures`) — county-level banking-stress signal; free structured JSON updated weekly[^14]
4. **EPA Envirofacts API** (`enviro.epa.gov/enviro/efservice`) — single endpoint for Superfund, TRI, RCRA, UST contamination flags at address level[^76]
5. **NASA FIRMS API** (`firms.modaps.eosdis.nasa.gov/api`) — real-time active-fire detections within bounding box; free MAP_KEY; <3 hr latency[^64][^65]
6. **NIFC WFIGS Current Fire Perimeters** (`data-nifc.opendata.arcgis.com`) — authoritative operational fire perimeter polygons; ArcGIS REST; real-time[^59]
7. **FEMA OpenFEMA NFIP Claims API** (`fema.gov/api/open/v2/FimaNfipClaims`) — historical flood-claim density by ZIP; underwriting proxy for actual flood loss[^42]
8. **FBI Crime Data Explorer (bulk CSV)** (`cde.ucr.cjis.gov/LATEST/webapp/#/pages/downloads`) — annual UCR crime rates by agency/county for safety-score overlay[^85]
9. **FCC BDC API** (`broadbandmap.fcc.gov/api/public/map/`) — broadband availability score at the BSL level; tenant-quality and asset-type proxy[^110]
10. **Trepp CMBS Monthly Delinquency PDF** (`trepp.com/hubfs/Trepp CMBS Delinquency Report`) — sector-level (office, retail, multifamily) distress rate used for deal-comp underwriting[^16][^17]
11. **CourtListener RECAP API** (`courtlistener.com/api/rest/v4/`) — free federal bankruptcy filings search by debtor address / property keyword; near-real-time[^23][^25]
12. **EPA Superfund NPL ArcGIS** (`hub.arcgis.com/datasets/EPA::superfund-national-priorities-list-npl-sites`) — NPL site proximity is a hard underwriting flag for Phase I ESA and lender requirements[^83]

***

## Part B — County-Level "Where Is Distress Brewing" Heat-Map Signal

Combining five freely available feeds produces a compositable, county-level distress score heat map:

| Feed | Signal Contributed | Geo Unit | Blend Weight (suggested) |
|------|--------------------|----------|--------------------------|
| **FDIC BankFind `/failures`** | Banking-sector stress (failed institutions per county, recent 24 mo) | County | 20% |
| **FEMA OpenFEMA NFIP Claims** | Flood-loss density (claims per 1,000 policies by ZIP → county rollup) | ZIP → County | 20% |
| **ATTOM Foreclosure Press Release** (aggregated) | Foreclosure starts per 1,000 units by state/metro (free monthly) | Metro / State | 25% |
| **EPA Envirofacts (Superfund + TRI)** | Environmental liability concentration (NPL + TRI facilities per sq mi) | County | 15% |
| **FBI CDE Crime Rate** | Property crime index (per 100K) by county | County | 10% |
| **NOAA Storm Events (property damage)** | Weather-loss frequency ($ damage events per county, 5-yr rolling) | County | 10% |

These six feeds are all **zero-cost, no-auth** at the county-level aggregate, can be joined on FIPS codes, and produce a composite "distress probability index" heat map renderable as a choropleth across all 3,143 US counties. ATTOM's free press-release data provides the highest-weight foreclosure signal — but for address-level precision, a paid ATTOM API or CoreLogic license is needed.[^13][^46][^27][^30][^76]

***

## Part C — Which Datasets Need a Paid Wrapper to Be Production-Ready

**Seven sources require paid licensing before they can power a live, property-level commercial intelligence terminal:**

**ATTOM Data** is the single most critical paid layer: free press-release aggregates provide metro/state-level foreclosure rates, but address-level default notices, lis pendens, auction dates, and REO records require a paid ATTOM API or bulk license — this is the backbone of any county-by-county distress scanner. **Trepp** supplies CMBS loan-level surveillance (watch lists, maturity schedules, special servicing transfers) that are absent from the free monthly delinquency PDF; a Trepp CMBS subscription unlocks the full deal database. **First Street Foundation** provides free property-lookup scores on the website and free county/ZIP aggregates on Zenodo, but a bulk property-level API (covering all 148M+ US properties with annual projections) requires a commercial data agreement. **Ookla Speedtest Open Data** is free for academic/non-commercial use under CC BY-NC-SA 4.0, but any revenue-generating application — including a SaaS CRE terminal — requires a direct commercial license from Ookla. **CourtListener RECAP** offers free bankruptcy document search with a 5-alert daily cap; production-grade real-time alerts ($25–$100/mo) and the full bulk PACER mirror require paid tiers. **Freddie Mac / Fannie Mae loan-level datasets** are free for research but require redistribution licensing agreements for any commercial platform that republishes the data. Finally, **HUD REO and VA/VRM REO** have no machine-readable bulk feeds at all — HUD Home Store and VRM's listing portal are HTML-only, meaning a production-grade REO inventory layer requires either a scraping arrangement negotiated with the respective agencies, a third-party data vendor (e.g., DataTree, RealtyTrac), or ATTOM's REO dataset. These seven gaps represent the boundary between a free-data intelligence prototype and a production-grade, county-level distress terminal.[^1][^6][^11][^8][^18][^25][^52][^53][^28][^55][^114][^118][^16][^23]

---

## References

1. [FHA REO Management and Marketing Contractors - HUD](http://www.hud.gov/helping-americans/reo-management) - HUD's Management and Marketing Contractors maintain and sell HUD-owned homes on behalf of the Depart...

2. [Homes for Sale | HUD.gov / U.S. Department of Housing and Urban ...](http://www.hud.gov/helping-americans/homes-for-sale) - HUD sells both single family homes and multifamily properties. Check them out- one might be just wha...

3. [REO and Foreclosure Properties - USDA-RD/FSA Properties](https://properties.sc.egov.usda.gov/resales/public/home) - The USDA-RD/FSA Resales web site provides current information about single- and multi-family homes a...

4. [RD Datasets](https://www.sc.egov.usda.gov/data/data_files.html) - Resale Properties (Real Estate Owned). Resale (REO) | File Description ; Resale Properties (Foreclos...

5. [USDA Rural Development Resale Properties - Foreclosure](http://catalog.data.gov/dataset/usda-rural-development-resale-properties-foreclosure) - Data provides current information regarding single family homes and ranches for sale by the US Feder...

6. [Vendee Financing: How to Buy VA Foreclosure REO Properties](https://valoannetwork.com/va-vendee-financing-guide/) - Vendee financing is a VA-backed loan program that lets you buy VA-owned foreclosure properties — kno...

7. [[PDF] VA Vendee Loan Program Fact Sheet](https://www.benefits.va.gov/BENEFITS/factsheets/homeloans/vendee.pdf) - To view VA REO properties available for Vendee financing, visit listings.vrmco.com. For More Informa...

8. [Fannie Mae Single-Family Loan Performance Data](https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/fannie-mae-single-family-loan-performance-data) - On April 30, 2026, Fannie Mae released the following updated datasets: Primary dataset: Acquisition ...

9. [Fannie Mae Homepath Properties (REO) Real Estate Owned](https://societymortgage.com/mortgage-tips/fannie-mae-reo-properties/) - HomePath homes are foreclosures owned by Fannie Mae and offer low deposit options for homebuyers. Un...

10. [HomePath - Fannie Mae](https://homepath.fanniemae.com) - HomePath helps homebuyers, real estate agents, community-minded groups, and investors find Fannie Ma...

11. [Single Family Loan-Level Dataset - Freddie Mac](https://www.freddiemac.com/research/datasets/sf-loanlevel-dataset) - The full dataset, Standard Dataset by year, Non-Standard Dataset, sample files, and RPL Mapping file...

12. [Find a Home | HomeSteps.com | Freddie Mac Real Estate](https://www.homesteps.com) - HomeSteps, the Freddie Mac real estate sales unit, strives to have the best property and sales stand...

13. [dpguthrie/bankfind: Python interface to the FDIC's API for publically ...](https://github.com/dpguthrie/bankfind) - There are currently, as of 8/11/20, five endpoints that the FDIC has exposed to the public: failures...

14. [BankFind Suite - API Documentation - FDIC](https://api.fdic.gov/banks/docs) - FDIC's application programming interface (API) lets developers access FDIC's publically available ba...

15. [Bulk Data Download - FDIC: BankFind Suite - API Documentation](https://banks.data.fdic.gov/bankfind-suite/bulkData/bulkDataDownload) - Use these definition files to help you understand the bulk data: Institutions Definitions (CSV forma...

16. [[PDF] Trepp CMBS Delinquency Report February 2025](https://www.trepp.com/hubfs/Trepp%20CMBS%20Delinquency%20Report%20February%202025.pdf) - The Trepp CMBS Delinquency Rate decreased again in February. 2025, with the overall delinquency rate...

17. [CMBS Delinquency Rate Jumps Back Up in March, as All Property ...](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-jumps-back-up-in-march-2025) - The Trepp CMBS Delinquency Rate ticked back up in March 2025 with the overall delinquency rate incre...

18. [CMBS Delinquency Rate Increases Again in August as Office ...](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-increases-again-in-august-2025) - The Trepp CMBS Delinquency Rate increased for the sixth consecutive month in August 2025, rising six...

19. [CMBS Loan Performance Trends: September 2025](https://www.kbra.com/publications/vkLSmnfq) - KBRA, a leader in CMBS credit analysis, delivers deal-level insights through pre-sale and surveillan...

20. [KBRA Releases Monthly CMBS Trend Watch](https://www.kbra.com/publications/nsQSYCwg) - KBRA releases the December 2025 issue of CMBS Trend Watch. U.S. CMBS finished the year at $125.8 bil...

21. [KBRA Releases Research – CMBS Loan Performance Trends](https://www.kbra.com/publications/RVLVmSJH) - KBRA releases a report on U.S. commercial mortgage-backed securities (CMBS) loan performance trends ...

22. [Public Access to Court Electronic Records | PACER: Federal Court ...](https://pacer.uscourts.gov) - PACER provides information about accessing and filing federal court records electronically. Find res...

23. [CourtListener Launches RECAP Search Alerts for PACER Filings](https://www.lawnext.com/2025/06/courtlistener-launches-recap-search-alerts-for-pacer-filings-google-alerts-for-federal-courts.html) - CourtListener has launched RECAP Search Alerts, a new feature that allows users to monitor federal c...

24. [RECAP Suite — Turning PACER Around Since 2009](https://free.law/recap/) - RECAP is an online archive and free extension for Firefox, Chrome and Safari that improves the exper...

25. [RECAP APIs for PACER Data - FLP Wiki](https://wiki.free.law/c/courtlistener/help/api/rest/v4/recap) - Use these APIs to scrape PACER data and to upload data into CourtListener's database of federal cour...

26. [Results: Eviction Foreclosure | Florida Housing Data Clearinghouse](https://flhousingdata.shimberg.ufl.edu/eviction-foreclosure/results?nid=1) - Results: Eviction Foreclosure ; Florida, 2022, 145,154 ; Florida, 2023, 151,181 ; Florida, 2024, 146...

27. [U.S. Foreclosure Activity Increases Annually in Q3 2025](https://safeguardproperties.com/u-s-foreclosure-activity-increases-annually-in-q3-2025/) - ATTOM released the Q3 2025 U.S. Foreclosure Market Report, showing foreclosure filings are up 17% fr...

28. [Foreclosure Data - Attom Data](https://www.attomdata.com/data/foreclosure-data/) - ATTOM provides the most accurate and up-to-date nationwide foreclosure data, auction, default, bank ...

29. [U.S. FORECLOSURE ACTIVITY INCREASES IN 2025 - PR Newswire](https://www.prnewswire.com/news-releases/us-foreclosure-activity-increases-in-2025-302662322.html) - Foreclosure Starts and Completions Rise Annually; December and Q4 2025 Foreclosure Activity Increase...

30. [Foreclosure Activity in First Half of 2025 Up From Previous Year](https://www.attomdata.com/news/market-trends/foreclosures/mid-year-2025-foreclosure-market-report/) - ATTOM's Mid-Year 2025 Foreclosure Market Report shows filings up 5.8% from 2024, with foreclosure st...

31. [Asset Forfeiture | U.S. Marshals Service](https://www.usmarshals.gov/what-we-do/asset-forfeiture) - The U.S. Marshals Service (USMS) is entrusted to assess, value, manage, and sell real property asset...

32. [Asset Forfeiture Fact Sheet | U.S. Marshals Service](https://www.usmarshals.gov/what-we-do/asset-forfeiture/fact-sheet) - Additional information can be found at www.usmarshals.gov/assets, including current asset sales (pub...

33. [Tackling the Data Sourcing Problem in Construction Procurement Using File-Scraping Algorithms](https://www.mdpi.com/2673-4591/53/1/34/pdf?version=1700797021) - ...adoption rate is the limited availability of data, as ML techniques rely on large datasets to tra...

34. [GSA Generates $3.9M by Selling Surplus Federal Property in Texas ...](https://www.gsa.gov/about-gsa/newsroom/news-releases/gsa-generates-39m-by-selling-surplus-federal-property-in-texas-delivers-value-03022026) - GSA Generates $3.9M by Selling Surplus Federal Property in Texas, Delivers Value to American Taxpaye...

35. [Guide to Buying Buildings From the Federal Government - JD Supra](https://www.jdsupra.com/legalnews/guide-to-buying-buildings-from-the-5473790/) - Focus on the GSA Auctions website,8 and specifically the “Real Estate for Sale” section.9 The GSA we...

36. [Personal Property Management System](https://gsaauctions.gov) - Missing: RSS feed

37. [GIS Web Services for the FEMA National Flood Hazard Layer (NFHL)](https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS) - The ArcGIS REST service provides direct access to NFHL spatial information through Environmental Sys...

38. [FEMA's National Flood Hazard Layer (NFHL) Viewer | MARISA](https://www.marisa.psu.edu/individualtools/page-tool51.0/) - The National Flood Hazard Layer (NFHL) is an interactive mapping tool that allows users to view floo...

39. [Using the National Flood Hazard Layer Web Map Service (WMS) in ...](https://hazards.fema.gov/femaportal/wps/portal/NFHLWMSkmzdownload) - "FEMA NFHL" is a general application that provides for the display of flood hazard zones and labels,...

40. [GitHub - mebauer/duckdb-fema-nfip: Analyzing FEMA's National ...](https://github.com/mebauer/duckdb-fema-nfip) - This project examines both the NFIP Redacted Claims and Policies datasets, but more importantly, dem...

41. [rfema: Getting Started - Docs](https://docs.ropensci.org/rfema/articles/getting_started.html) - This vignette provides a brief overview on using the rfema package to obtain data from the Open FEMA...

42. [FIMA NFIP Redacted Claims (OpenFEMA) - Catalog - Data.gov](http://catalog.data.gov/dataset/fima-nfip-redacted-claims-openfema) - rnrnThis dataset is derived from the NFIP system of record, staged in the NFIP reporting platform an...

43. [U.S. Billion-Dollar Disasters: 1980-2024 - Climate Central](https://www.climatecentral.org/climate-matters/billion-dollar-disasters-2025) - The U.S. Billion-Dollar Weather and Climate Disasters database — NOAA's systematic record of the mos...

44. [Billion-Dollar Weather and Climate Disasters](https://www.ncei.noaa.gov/access/billions/) - The US sustained 403 weather and climate disasters from 1980–2024 where overall damages/costs reache...

45. [Billion-Dollar Weather and Climate Disasters | Climatology](https://www.ncei.noaa.gov/access/billions/climatology) - NOAA National Centers for Environmental Information (NCEI) U.S. Billion-Dollar Weather and Climate D...

46. [Storm Events Database](https://www.ncei.noaa.gov/stormevents/ftp.jsp) - Bulk data are available in comma-separated files (CSV). These files can be viewed in Excel and other...

47. [geanders/noaastormevents: explore noaa storm database - GitHub](https://github.com/geanders/noaastormevents) - This package can be used to explore and map data from NOAA's Storm Events Database. This storm event...

48. [Storm Events Database](https://www.ncei.noaa.gov/stormevents/) - The Storm Events Database contains records on various types of severe weather, as collected by NOAA'...

49. [A guide to the NCEIs suite of climate data APIs - GitHub](https://github.com/partytax/ncei-api-guide) - Use this API to get information about what attributes are available for a given dataset. Endpoint. G...

50. [Web Services API (version 2) Documentation | Climate Data Online ...](https://www.ncdc.noaa.gov/cdo-web/webservices/getstarted) - To make a request use the base url with one of the endpoint paths appended. Base URL. https://www.nc...

51. [Climate at a Glance National Time Series](https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/national/time-series) - This survey is designed to measure your level of satisfaction with ncei.noaa.gov. It consists of nin...

52. [What is First Street? - Realtors Property Resource - RPR](https://blog.narrpr.com/support/what-is-first-street/) - First Street assesses a property's risk from floods, wildfires, hurricane wind, extreme heat, and ai...

53. [First Street Foundation Property Level Flood Risk Statistics V2.0](https://zenodo.org/records/6459076) - The property level flood risk statistics generated by the First Street Foundation Flood Model Versio...

54. [First Street Foundation releases new data disclosing the flood risk of ...](https://www.prnewswire.com/news-releases/first-street-foundation-releases-new-data-disclosing-the-flood-risk-of-every-home-in-the-contiguous-us-301084757.html) - ... First Street Foundation Flood Model identifies nearly 70% more, or 14.6 million properties with ...

55. [First Street: The Standard for Climate Risk Financial Modeling](https://firststreet.org) - We create physics-based deterministic models that calculate property-level risk statistics today, an...

56. [Open Data Portal Watch Mapping and export of Schema.org ...](https://data.wu.ac.at/schema/data_gov/Y2U3NDhiMjUtZTQ5Mi00YmU5LWIyNTQtMzU0YjJiMmNhMTEx) - Title, USDA Rural Development Resale Properties - Real Estate Owned ; Description, Data provides cur...

57. [Maps - National Interagency Fire Center](https://www.nifc.gov/fire-information/maps) - Explore Wildland Fire Maps. This page is your gateway to real-time and historical maps that tell the...

58. [Data - Wildfire EGP](https://egp.wildfire.gov/egp/data/) - Currently, the EGP data sources are available with NIFC's ArcGIS Online Organization (AGOL). To acce...

59. [WFIGS Current Interagency Fire Perimeters](https://data-nifc.opendata.arcgis.com/datasets/nifc::wfigs-current-interagency-fire-perimeters/about) - Best available perimeters for recent and ongoing wildland fires in the United States. The Wildland F...

60. [National Interagency Fire Center](https://data-nifc.opendata.arcgis.com) - An Experience Builder App to provide investigation and download access to the current (most recent) ...

61. [InterAgencyFirePerimeterHistory All Years View](https://data-nifc.opendata.arcgis.com/datasets/nifc::interagencyfireperimeterhistory-all-years-view/about) - Interagency Wildland Fire Perimeter History (IFPH) includes perimeters thru 2024 fires, update compl...

62. [InciWeb Information - National Interagency Fire Center](https://www.nifc.gov/fire-information/pio-bulletin-board/inciweb) - InciWeb Shortcuts from the 2025 PIO Incident Organizer, August 4, 2025 (PDF, 170 KB) This one-page s...

63. [InciWeb - State Fire Maps - Responserack](https://www.responserack.com/posts/inciweb-state-links/) - Link directly to your state or territory InciWeb fire map. Center the fire map around you. Listed be...

64. [How to use FIRMS API in Python](https://firms.modaps.eosdis.nasa.gov/content/academy/data_api/firms_api_use.html) - In this tutorial we will look into using FIRMS API to access up-to-date fire detections. We will cov...

65. [NASA | LANCE | FIRMS](https://firms.modaps.eosdis.nasa.gov) - FIRMS uses satellite observations from the MODIS and VIIRS instruments to detect active fires and th...

66. [API - Data Availability - NASA | LANCE | FIRMS](https://firms.modaps.eosdis.nasa.gov/api/data_availability/) - Global fire map and data. NASA | LANCE | Fire Information for Resource Management System provides ne...

67. [FIRMS: Fire Information for Resource Management System](https://developers.google.com/earth-engine/datasets/catalog/FIRMS) - The Earth Engine version of the Fire Information for Resource Management System (FIRMS) dataset cont...

68. [API Documentation - Earthquake Catalog](https://earthquake.usgs.gov/fdsnws/event/1/) - This is an implementation of the FDSN Event Web Service Specification, and allows custom searches fo...

69. [Real-time Notifications, Feeds, and Web Services](https://earthquake.usgs.gov/earthquakes/feed/) - The Earthquake Notification Service (ENS) is a free service that sends you automated notifications t...

70. [APIs | U.S. Geological Survey - USGS.gov](https://www.usgs.gov/products/web-tools/apis) - Earthquake Notifications, Feeds, and Web Services. Know about earthquakes just after they happen in ...

71. [GitHub - usgs/nshmp-haz: National Seismic Hazard Mapping Project ...](https://github.com/usgs/nshmp-haz) - U.S. Geological Survey (USGS) National Seismic Hazard Mapping Project (NSHMP) code for performing pr...

72. [National Seismic Hazard Model (2023) | U.S. Geological Survey](https://www.usgs.gov/media/images/national-seismic-hazard-model-2023-chance-damaging-earthquake-shaking) - National Seismic Hazard Model (2023). Map displays the likelihood of damaging earthquake shaking in ...

73. [National Seismic Hazard Model | U.S. Geological Survey - USGS.gov](https://www.usgs.gov/programs/earthquake-hazards/science/national-seismic-hazard-model) - The USGS has completed and released the 2023 updated hazard model for the 50 states. The 2023 Nation...

74. [USGS Earthquake Hazard Toolbox](https://earthquake.usgs.gov/nshmp/) - The USGS Earthquake Hazard Toolbox is a suite of applications to explore USGS national seismic hazar...

75. [Search | USGS Science Data Catalog](https://data.usgs.gov/datacatalog/search?usgsKeyword=%5B%22National+Seismic+Hazard+Model%22%5D) - This data set represents multi-period response spectra (MPRS) results for 36 Alaska test sites using...

76. [Envirofacts Data Service API | US EPA](https://www.epa.gov/enviro/envirofacts-data-service-api) - Envirofacts provides a single point of access to US EPA environmental data contained in US EPA datab...

77. [Envirofacts Data Service API - US EPA](https://19january2021snapshot.epa.gov/enviro/envirofacts-data-service-api_.html) - Envirofacts makes it easy to find information using an address, ZIP Code, city, county, water body, ...

78. [Envirofacts Data & Developer Services | US EPA](https://www.epa.gov/enviro/envirofacts-data-developer-services) - Envirofacts Data & Developer Services. Access Envirofacts data programmatically using EPA's APIs, me...

79. [Learn more about EPA Envirofacts API, a dataset from United State ...](https://opennetzero.org/united-state-environmental-protection-agency/epa-envirofacts-api) - Overview. Envirofacts integrates information from a variety of EPA's environmental databases. Each o...

80. [EPA Superfund Sites Map – All NPL Sites Explorer - Mapscaping.com](https://mapscaping.com/superfund-sites/) - This interactive map plots all 1,840+ NPL sites, letting you filter by cleanup status, zoom to any s...

81. [Superfund Data and Reports | US EPA](https://www.epa.gov/superfund/superfund-data-and-reports) - The datasets below cover active and archived contaminated sites evaluated by the Superfund program, ...

82. [Current NPL Updates: New Proposed NPL Sites and New ... - EPA](https://www.epa.gov/superfund/current-npl-updates-new-proposed-npl-sites-and-new-npl-sites) - The Superfund program publishes documents with each rulemaking adding or proposing sites to the Nati...

83. [Superfund National Priorities List (NPL) Sites with Status Information](https://hub.arcgis.com/datasets/EPA::superfund-national-priorities-list-npl-sites-with-status-information/about) - National Priorities List (NPL) Sites with Status Information CSV file for the EPA's Where You Live p...

84. [GitHub - fbi-cde/crime-data-api](https://github.com/fbi-cde/crime-data-api) - The Crime Data Explorer is a website that allows law enforcement and the general public to more easi...

85. [Uniform Crime Reporting (UCR) Program - Crime Data Explorer](https://catalog.data.gov/dataset/uniform-crime-reporting-ucr-program/resource/2f7847e1-b73f-4795-8f41-a9cde45ec601) - The Crime Data Explorer (CDE) offers downloadable Uniform Crime Reporting (UCR) data files. Source: ...

86. [The FBI's Uniform Crime Reporting (UCR) Program released the ...](https://www.facebook.com/FBICleveland/posts/the-fbis-uniform-crime-reporting-ucr-program-released-the-first-look-2025-crime-/1155722814285978/) - The FBI's Uniform Crime Reporting (UCR) Program released the First Look: 2025 Crime Data on the FBI'...

87. [The FBI has published the monthly update of reported crime and law ...](https://www.facebook.com/FBIAlbuquerque/posts/the-fbi-has-published-the-monthly-update-of-reported-crime-and-law-enforcement-d/122262085628018671/) - The FBI has published the monthly update of reported crime and law enforcement data to the Crime Dat...

88. [Approved Zoning - ArcGIS Hub Dataset - City of Phoenix Open Data](https://www.phoenixopendata.com/dataset/approved-zoning/resource/792b1869-329a-4f51-a2de-277bdb711c25) - City of Phoenix approved zoning locations. ... Enter a number to expand filtered area. ... Approved ...

89. [SERFF Filing Access (SFA) | DIFI - Arizona Department of Insurance](https://difi.az.gov/sfa) - SFA (accessible using the button at the bottom of this page) is a web site that allows the general p...

90. [Search the System for Electronic Rates and Forms Filing (SERFF)](https://www.tdi.texas.gov/company/serff/index.html) - You can view and search company filings received after April 13, 2014, on the National Association o...

91. [Home - SERFF Filing Access - NAIC](https://portals.naic.org/serff-filing-access) - Welcome to SERFF Filing Access! The Insurance Compact has approved insurance rates and forms availab...

92. [FLOIR IRFS Forms & Rates Search - Florida Office of Insurance ...](https://irfssearch.floir.gov) - This system contains relevant filings for both the Life & Health and Property & Casualty lines of bu...

93. [Citizens' Policy Count Remains Stable - | Florida Realtors](https://www.floridarealtors.org/news-media/news-articles/2025/02/citizens-policy-count-remains-stable) - As of Friday, Citizens had 942,810 policies; it had 941,158 a week ago. Fla.'s insurer of last resor...

94. [Citizens' Policy Count Below 1M - Public](https://www.citizensfla.com/-/20241204-citizens-policy-count-below-1m) - The reduced policy count, which was 987,650 as of November 29, 2024, is due in large part to the suc...

95. [Florida Citizens exposure shrinks 43% in last year as depopulation ...](https://www.artemis.bm/news/florida-citizens-exposure-shrinks-43-in-last-year-as-depopulation-accelerated/) - Florida Citizens gives a best-estimate for having around 700,585 policies in force by the end of 202...

96. [Citizens Property Insurance Corporation: Home - Public](https://www.citizensfla.com) - Don't wait – report your claim 24/7 myPolicy: Report/track claims online Phone: 866.411.2742

97. [Get Windstorm Insurance - TWIA](https://www.twia.org/property-owners/get-windstorm-insurance/) - TWIA is meant to provide coverage for wind and hail losses only. No other perils are covered by TWIA...

98. [Windstorm Certificates Issued by TWIA](https://www.twia.org/wpi-8-lookup/) - Search this database for WPI-8-Cs issued by TWIA. TWIA accepted applications for WPI-8-Cs from Janua...

99. [TWIA: HOME](https://www.twia.org) - The Texas Windstorm Insurance Association (TWIA) is a not-for-profit insurance company, offering win...

100. [Texas Windstorm Insurance Association (TWIA) Resources](https://www.tdi.texas.gov/commercial/pctwia.html) - Resource/Index page for information relating to the Texas Windstorm Insurance Association (TWIA)

101. [NYCPlanning/labs-zola: NYC Planning's Zoning and Land Use App](https://github.com/NYCPlanning/labs-zola) - ZoLa provides a simple way to research zoning regulations and other information relevant to planners...

102. [ZoLa | NYC's Zoning & Land Use Map](https://zola.planning.nyc.gov) - ZoLa provides a simple way to research zoning regulations. Find the zoning for your property, discov...

103. [Data - ZoLa | NYC's Zoning & Land Use Map](https://zola-staging.planninglabs.nyc/data) - Zoning Map Index · Zoning Map Amendments · Pending Zoning Map Amendments · Special Purpose Districts...

104. [Maps, GIS and Open Data - Portland.gov](https://www.portland.gov/bts/cgis) - Here you can stay current on projects, find maps, applications, access enterprise data, and offer an...

105. [microsoft/GlobalMLBuildingFootprints: Worldwide building footprints ...](https://github.com/microsoft/GlobalMLBuildingFootprints/) - 2026-02-03 - Added 1.2M building footprints and 1.2M height estimates derived from Vexcel imagery be...

106. [Microsoft Releases 130 million Building Footprints in the USA as...](https://blogs.bing.com/maps/2018-07/microsoft-releases-125-million-building-footprints-in-the-us-as-open-data) - Microsoft Releases 130 million Building Footprints in the USA as Open Data ... You can read more abo...

107. [Overture Foundation Building Footprints](https://gee-community-catalog.org/projects/overture_buildings/) - The Overture Maps buildings theme describes human-made structures with roofs or interior spaces that...

108. [A national dataset of rasterized building footprints for the U.S.](http://catalog.data.gov/dataset/a-national-dataset-of-rasterized-building-footprints-for-the-u-s) - A US-wide vector building dataset in 2018, which includes over 125 million building footprints for a...

109. [FCC BDC Filing & HUBB Filing - Requirements & Deadlines](https://www.costquest.com/broadband-serviceable-location-fabric/fcc-bdc-filing-and-usac-hubb-filing-guide/) - Click the link for 2025 FCC rule changes involving the use of the Broadband Serviceable Location Fab...

110. [FCC Broadband Data Collection June 2025 - ArcGIS Online](https://www.arcgis.com/home/item.html?id=e1343efcefc344709057260ee57290a0) - This layer summarizes the June 2025 BDC data showing the number of served, underserved, and unserved...

111. [How to Download Mobile Broadband Coverage Data from the FCC's ...](https://help.bdc.fcc.gov/hc/en-us/articles/43909220634651-How-to-Download-Mobile-Broadband-Coverage-Data-from-the-FCC-s-National-Broadband-Map-Step-by-Step-Instructions) - How to Download Mobile Broadband Coverage Data from the FCC's National Broadband Map: Step-by-Step I...

112. [FCC Broadband Data Collection: Issues or Errors You May Encounter](https://www.youtube.com/watch?v=8mtIek9Kk_4) - A video tutorial to assist filers with issues or errors they may encounter in the FCC's Broadband Da...

113. [FDIC: Failed Bank List](https://napsterinblue.github.io/notes/python/pandas/data/fdic_failed_bank_list/) - Other Assets from Failed Banks. Other Assets from Failed Banks. The inventory of other assets for sa...

114. [teamookla/ookla-open-data: Speedtest by Ookla Global Fixed and ...](https://github.com/teamookla/ookla-open-data) - Download speed, upload speed, and latency are collected via the Speedtest by Ookla applications for ...

115. [Speedtest by Ookla Global Fixed and Mobile Network Performance ...](https://registry.opendata.aws/speedtest-global-performance/) - Download speed, upload speed, and latency are collected via the Speedtest by Ookla applications for ...

116. [Global fixed broadband and mobile (cellular) network performance](https://gee-community-catalog.org/projects/speedtest/) - Download speed, upload speed, and latency are collected via the Speedtest by Ookla applications for ...

117. [Ookla Speedtest for Global Broadband Performance in Living Atlas](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/telecommunications/ookla-speedtest-for-global-broadband-performance-in-living-atlas) - Download speed, upload speed, and latency are collected via the Speedtest by Ookla applications for ...

118. [Ookla's Open Data Initiative](https://www.ookla.com/ookla-for-good/open-data) - Ookla open datasets are available on a complimentary basis to help people make informed decisions ar...

119. [Beneficial Ownership Information Reporting | FinCEN.gov](https://www.fincen.gov/boi) - Beneficial ownership information reporting requirements are now back in effect, with a new deadline ...

120. [US BOI reporting & beneficial ownership information - Moody's](https://www.moodys.com/web/en/us/kyc/resources/insights/7-things-to-know-about-us-beneficial-ownership-information-boi-reporting.html) - In September 2022, FinCEN finalized a rule introducing a reporting obligation for beneficial ownersh...

121. [Beneficial Ownership Information Reporting Rule Fact Sheet - FinCEN](https://www.fincen.gov/beneficial-ownership-information-reporting-rule-fact-sheet) - Reporting companies registered to do business in the United States before March 26, 2025, must file ...

122. [[PDF] FinCEN RRE GTO 10/9/2025](https://www.fincen.gov/system/files/2025-10/RRE-GTO-Order.pdf) - GEOGRAPHIC TARGETING ORDER. The Director of the Financial Crimes Enforcement Network (FinCEN) hereby...

123. [FinCEN GTO Update - America's Credit Unions](https://www.americascreditunions.org/blogs/compliance/fincen-gto-update) - The initial order was effective April 14, 2025 to September 9, 2025, and later extended from October...

124. [FinCEN Renews Residential Real Estate Geographic Targeting ...](https://www.fincen.gov/news/news-releases/fincen-renews-residential-real-estate-geographic-targeting-orders-0) - The GTOs are effective beginning October 10, 2025. On September 30, 2025, FinCEN announced a postpon...

125. [NAR Issue Brief: FinCEN's Renewed Geographic Targeting Order](https://www.nar.realtor/money-laundering-and-terrorism-financing/nar-issue-brief-fincens-renewed-geographic-targeting-order) - FinCEN issued an updated GTO effective beginning on October 10, 2025, through February 28, 2026, req...

