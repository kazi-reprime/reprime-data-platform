# US Zoning, Entitlement & Parcel Data: Free/Freemium Source Map for CRE Intelligence Terminals

**Purpose:** Endpoint-grade map of every free or freemium-with-usable-free-tier data source covering US zoning, entitlement, land-use regulation, parcel data, and site-selection intelligence for 2024–2026. Designed to power a live "Entitlement Friction Score" and parcel-level land-use overlay inside a Bloomberg-style CRE terminal targeting Israeli family offices and institutional LPs investing in US CRE. A Tel Aviv principal must be able to click any address in Miami, Dallas, Phoenix, NYC, or LA and immediately see zoning, allowed uses, recent rezoning activity, and friction score — in seconds, not days.

***

## Part 1: Master Data Source Table

### Section A: National Parcel & Zoning Data Platforms

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile It Powers | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Regrid Parcel API v2** | `https://app.regrid.com/api/v2/us/parcels/point?lat={LAT}&lon={LON}&token={TOKEN}` | Freemium (30-day free trial; paid $500–$2,000+/mo after) | 30-day trial: 10 concurrent requests, ~200 req/min[^1] | National → Parcel | Varies by county; mostly monthly-quarterly | JSON (GeoJSON Feature) | Yes — API token (free to generate)[^2] | APN, owner name, address, land use code, sq ft, year built, assessed value, zoning (where sourced), lat/lon centroid | County assessor, Zoneomics | Parcel Map Tile; Ownership Overlay | 146M+ parcels US+Canada[^3]. Schema at `support.regrid.com/parcel-schema`. Post-trial, tileserver bundle ~$12K/yr annual[^4]. Batch endpoint: `https://app.regrid.com/api/v2/batch/points`[^5]. |
| **Regrid ESRI Living Atlas Tile Layer** | `https://www.arcgis.com/home/item.html?id={REGRID_PARCEL_ITEM_ID}` | Freemium (requires ArcGIS Online subscription; Premium Content) | Unlimited map tile viewing within ArcGIS subscription | National → Parcel | Regularly updated | ArcGIS Vector Tile | Yes — ArcGIS Online login | Parcel boundaries, basic attributes | Regrid API, county assessors | Parcel Map Tile | Partnership between Esri and Regrid; launched 2024[^6][^7]. Premium Content tier — not free for data extraction but free for map display in ArcGIS Online orgs. |
| **Zoneomics API** | `https://api.zoneomics.com/v2/zoneDetail?lat={LAT}&lon={LON}&key={KEY}` | Freemium | Free tier: 100 API calls + 100,000 map tiles/mo[^8] | National → Parcel (22,000+ jurisdictions)[^9] | Near-real-time (AI-aggregated) | JSON | Yes — API key | Zone code, zone name, zone type, zone subtype, permitted uses, FAR, height, setbacks, coverage %, link to local zoning code[^10] | Regrid parcels, city GIS portals | Zoning Code Tile; Allowed Uses; FAR/Height Panel | Coverage claimed for 22,000+ US+Canada jurisdictions[^9]. Pro tier $399/mo. Integrates with Autodesk Forma and TestFit[^11][^12]. Area-based calls capped at 100 hectares free[^8]. |
| **National Zoning Atlas (NZA)** | `https://www.zoningatlas.org` + downloadable state GeoJSONs | Free (nonprofit, open data) | No API rate limit; dataset downloads | National (33,000+ jurisdictions in progress)[^13] | Ongoing (per-state team cadence) | Shapefile / GeoJSON / CSV | No (web map); Yes for raw datasets (email request) | Zone district name, permitted residential types, multifamily allowed Y/N, min lot size, FAR, ADU allowed | Regrid, city GIS portals | Zoning Reform Context Tile; Policy Friction Layer | Standardized, research-grade. Not parcel-level — jurisdiction-level polygons. Coverage uneven: CT, VT, OH, TX, AZ well-covered; others partial[^14][^15]. Best for jurisdiction-level friction scoring. |
| **NYC Zoning API (NYC Planning)** | `https://ae-zoning-api.nyc.gov` (OpenAPI) + ZoLa: `https://zola.planning.nyc.gov` | Free | No documented rate limit | City → Tax lot (parcel) | Periodic (monthly-ish) | JSON (REST) | No | Zoning district, special districts, overlays, contextual districts, applicability rules | MapPLUTO, DCP PLUTO | NYC Zoning Tile; Allowed Uses | Open-source GitHub repo: `NYCPlanning/ae-zoning-api`[^16]. ZoLa does NOT return FAR/height directly — link to Zoning Resolution text[^17]. |
| **NYC MapPLUTO / PLUTO** | `https://data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks` (Socrata) | Free | Standard Socrata: 1,000 rows/call; unlimited calls | City → Tax lot (parcel) | Quarterly | CSV / GeoJSON / Shapefile | No (but app token for higher speed) | Land use code, zone dist, lot area, bldg class, year built, # floors, assessed value, owner, FAR achieved, address[^18][^19] | NYC ZoLa, DOF Digital Tax Map | Parcel Tile; Land Use Layer; Ownership Panel | 70+ fields per lot. MapPLUTO adds geometry. API: `https://data.cityofnewyork.us/resource/64uk-42ks.json?$limit=1000&$offset=0`. |
| **UrbanFootprint (Academic/Trial)** | `https://urbanfootprint.com` | Freemium (Academic tier for edu/research; free trial available) | Academic: limited seats; Trial: 14–30 days by request | National → Parcel / Block / Census Tract | Quarterly data releases (Winter 2025 most recent)[^20] | Web app + API (by arrangement) | Yes — account | Land use category, parcel dimensions, building type, population, employment, parcel area, transit access score[^21][^22] | Regrid, PLUTO, city GIS | Land Use Canvas; Site Context Tile | "Academic" launched July 2024 for educators/researchers[^23]. 160M+ parcels nationwide[^21]. No documented public REST endpoint — data accessed through platform. Not suitable for real-time production API. |
| **Shovels.ai (Building Permits + Gov Meetings)** | `https://api.shovels.ai/v1/permits?address={ADDRESS}` | Paid (starts at $599/mo)[^24] | No free tier; trial available | National → Address/Parcel (1,800+ jurisdictions) | Near-real-time | JSON | Yes — API key | Permit type, filing date, status, contractor, valuation, work description, inspection outcomes, pass rate[^25] | Regrid, city permit portals | Entitlement Activity Tile; Permit History | Shovels acquired ReZone in Jan 2026 — now includes local gov meeting intelligence[^26]. 113M+ permit records, 3M+ contractors[^27]. Critical for entitlement friction scoring. Starts at $599/mo; no public free tier. |
| **Gridics Zoning API** | `https://gridics.com/zoning-data-api/` | Paid (contact for pricing) | No public free tier | National → Parcel | Varies | JSON | Yes | Development capacity, buildable SF, setbacks, allowed uses, OZ status, FAR, height, lot coverage[^28] | Regrid, Zoneomics | Development Potential Tile; FAR/Capacity Panel | Trusted by cities and major RE funds[^29]. Calculates buildable capacity relative to parcel geometry — unique value. Contact for enterprise pricing. |
| **ReZone.ai (now Shovels)** | `https://www.shovels.ai` (merged Jan 2026[^26]) | Paid | 30-day free trial (historical, pre-acquisition) | 65 → 250+ cities nationwide[^30] | Continuous (AI-tracked meetings) | JSON / web | Yes | Zoning change decisions, local gov meeting notes, approval timelines, application status | Shovels permits, city portals | Rezoning Activity Feed; Entitlement History | Acquired by Shovels Jan 2026[^26]. Originally tracked zoning/land-use changes from city council meetings in 65+ cities. Now integrated into Shovels platform. Code "ThesisDriven" for 25% off trial[^30]. |

***

### Section B: Federal Government Free Data (No API Key or Free Key)

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile It Powers | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **FEMA NFHL ArcGIS REST** | `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer` | Free (public federal) | No rate limit documented | National → Parcel/Address | Updated with FIRM revisions | ArcGIS REST / WMS / WFS | No[^31] | Flood zone designation (A, AE, X, etc.), BFE, SFHA, LOMA/LOMR history, effective FIRM date[^32] | Parcel centroid from Regrid; USGS elevation | Flood Risk Overlay Tile | WFS endpoint: `https://hazards.fema.gov/arcgis/services/public/NFHL/MapServer/WFSServer`; WMS: `https://hazards.fema.gov/arcgis/rest/services/public/NFHLWMS/MapServer/WMSServer`[^31]. Most critical free layer for coastal MSA risk scoring. |
| **HUD Opportunity Zones Layer** | `https://catalog.data.gov/dataset/opportunity-zones-16322` + `https://www.hud.gov/opportunity-zones` | Free (public federal) | No limit | National → Census Tract | OZ 1.0 effective through 2028; OZ 2.0 effective through 2036[^33] | Shapefile / GeoJSON | No[^34] | Census tract GEOID, OZ designation (1.0 and 2.0), state, county | IRS QCT, CDFI NMTC, Census TIGER | Opportunity Zone Overlay Tile | OZ 2.0 map now in effect from 2025 legislation[^33]. Download from Data.gov. ArcGIS REST also available through HUD GeoPlatform. |
| **IRS / CDFI QCT & NMTC** | `https://www.cdfifund.gov/cims` (CIMS Mapping Tool) + `https://www.cims.cdfifund.gov/preparation/?config=config_nmtc.xml` | Free (public federal) | Web tool; no documented API rate limit | National → Census Tract | Updated Sept 2023 (ACS 2016–2020)[^35] | Web / CSV download | No (web tool); CIMS API credentials for bulk | QCT eligibility, NMTC LIC eligibility, poverty rate, MFI %, DDA status[^36][^37] | HUD OZ layer, Census ACS | Tax Incentive Layer (QCT/NMTC/DDA) | NMTC updated to 2016–2020 ACS data[^35]. Use CIMS for individual lookups; download CSVs from CDFI Fund website for bulk integration. |
| **Census TIGERweb GeoServices REST** | `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/MapServer/{layer}/query?where=...&outFields=*&f=json` | Free | ~500 req/day without key; free API key for higher volume[^38] | National → Tract / Block / County / State | Annual | ArcGIS REST / JSON | No (key optional for high volume) | Census tract GEOID, county FIPS, state FIPS, tract name, area, population (joined from ACS)[^39] | CDFI NMTC, HUD OZ, any parcel centroid | Census Geography Tile; QCT/Tract Lookup | ACS socioeconomic data joinable via `api.census.gov`. TIGER tract boundaries at layer 14. Use `tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb` as base. |
| **MRLC NLCD Land Cover** | `https://www.mrlc.gov/data` + WMS: `https://www.mrlc.gov/arcgis/rest/services` | Free (public federal) | No documented limit | National → 30-meter raster | Annual (2024 CONUS available)[^40] | GeoTIFF / WMS / WCS[^41] | No | 16–21 land cover classes (developed low/med/high intensity, cropland, forest, wetland, water, etc.)[^42] | USDA CDL, USGS National Map | Land Cover Context Tile | Annual coverage 1985–2024 for CONUS[^40]. WMS/WCS services for streaming. Best for greenfield site feasibility context. Not parcel-level. |
| **USDA Cropland Data Layer (CDL)** | `https://nassgeodata.gmu.edu/CropScape/` (CropScape API) + `https://www.nass.usda.gov/Research_and_Science/Cropland/Release/index.php` | Free (public federal / public domain) | No documented limit[^43] | National → 30-meter raster | Annual (2025 10-meter release available)[^44] | GeoTIFF / WMS | No | Crop type by pixel (corn, soybeans, developed, wetland, etc.); 100+ crop categories[^45] | MRLC NLCD, USGS | Agricultural Land Context Tile | CropScape API: `https://nassgeodata.gmu.edu/axis2/services/CDLService/GetCDLValue?lat={LAT}&lon={LON}&year=2023`. Critical for rural/exurban CRE site selection in Midwest/Southeast MSAs. |
| **USGS National Map (TNM)** | `https://apps.nationalmap.gov/downloader/` + API: `https://tnmaccess.nationalmap.gov/api/v1/products?datasets=...&bbox=...` | Free (public federal) | No documented limit | National → Various | Annual to continuous | Shapefile / GDB / GeoTIFF | No[^46] | Elevation (3DEP), hydrography (NHD), transportation, structures, governmental units | FEMA NFHL, MRLC NLCD | Topographic Context; Hydrology Overlay | Note: TNM does NOT include parcel boundaries natively — it covers topographic features. Use for elevation context for flood/slope analysis. |
| **NOAA Sea Level Rise Viewer + WMS** | `https://coast.noaa.gov/slr/` + ArcGIS REST: `https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_{N}ft/MapServer` (N = 0–10) | Free (public federal) | No limit | National coastal → ~1-meter resolution | Dataset-level (2024 most recent) | WMS / ArcGIS REST / Shapefile download[^47] | No[^48] | Inundation extent at 0–10 ft SLR scenarios, depth rasters, flood frequency, vulnerability index, marsh migration[^49] | FEMA NFHL, Regrid parcel | Climate Risk Overlay Tile | REST endpoint example: `https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_3ft/MapServer`[^50]. Download inundation polygons at `coast.noaa.gov/slrdata/`[^47]. Essential for Miami, Houston, NYC, Charleston, Tampa terminals. |
| **EPA EJScreen (archived)** | Archived at `https://screening-tools.com/epa-ejscreen` + Zenodo archive 2015–2024: `https://zenodo.org/records/14767363` | Free (archived; original EPA endpoint removed Feb 2025[^51]) | Downloads only (no live API) | National → Census Block Group | Last update: 2024 (v2.3)[^52] | CSV / GDB (download) | No | Air quality burden, lead paint risk, proximity to hazardous waste, demographic vulnerability index, EJ Index[^53] | Census ACS, FEMA NFHL | Environmental Risk Layer (EJ Score) | EPA removed EJScreen from its website Feb 5, 2025[^51][^54]. Live API no longer available. Use archived downloads from Zenodo or `gaftp.epa.gov/EJScreen/`. Critical gotcha — check for mirror/archive availability for production use. |
| **OpenStreetMap Overpass API** | `https://overpass-api.de/api/interpreter` + Turbo UI: `https://overpass-turbo.eu` | Free (open) | Public instances: fair-use (~10k requests/day suggested); self-hostable[^55] | Global → Feature-level | Continuous (crowd-updated) | JSON / XML / GeoJSON | No[^55] | Building footprints, landuse polygons (OSM tags), road network, POI, water bodies | Regrid parcels, city GIS portals | Base Map Context; POI Density Layer | Query example for landuse: `[out:json]; way["landuse"](bbox); out body;`. OSM landuse ≠ legal zoning — it reflects observed use, not regulatory zoning. Use as supplemental layer, not primary zoning source. |

***

### Section C: Academic / Policy / Research Databases

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile It Powers | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **National Zoning Atlas (NZA)** | `https://www.zoningatlas.org` + state downloads | Free | Download only | National → Zoning District | Per-state cadence (ongoing) | Shapefile / GeoJSON | No | Residential zone types, min lot size, multifamily allowance, ADU rules, setbacks, by-right vs. discretionary[^13][^56] | NZA + city GIS portals | Zoning Reform Tracker; Policy Risk Layer | As of 2025: 33,000+ jurisdictions being digitized. Coverage: CT, VT, OH, AZ, TX, RI, NC, MD substantially complete[^14]. Best academic-grade free source for comparative zoning analysis. |
| **NYU Furman Center Land Use Reform Tracker** | `https://www.furmancenter.org/data-tool/land-use-reform-tracker/` | Free | Web tool / data download | National → State / City | Periodic | Web / CSV | No[^57] | State land use reforms, reform type (upzone, ADU, by-right), bill status, jurisdiction affected | NZA, Sightline, Terner Center | Regulatory Change Feed; Friction Friction Context | Most comprehensive tracker of enacted state-level zoning reforms. NYC-specific deep data also at CoreData.nyc[^58]. |
| **Mercatus Center / Wharton WRLURI** | `https://www.mercatus.org` (reports) + Wharton WRLURI data at Wharton Real Estate: `https://realestate.wharton.upenn.edu` | Free | Download | National → Metro/City | WRLURI: survey-based, 2,600+ communities[^59] | CSV / PDF | No | Regulatory stringency index (WRLURI), approval delays, political pressure index, density restrictions index[^60][^61] | NZA, Shovels permit data, Terner Center | Entitlement Friction Score Input | WRLURI data is from ~2006 survey — dated but foundational for cross-metro friction benchmarking. Mercatus has newer research through 2024[^62]. |
| **Terner Center UC Berkeley** | `https://ternercenter.berkeley.edu` | Free | Download (PDFs + datasets) | City / Metro / State | Periodic (major reports) | PDF / CSV | No[^63] | Permit approval timelines by jurisdiction, ADU approval times, inclusionary zoning requirements, project-specific entitlement tracking[^63][^64] | Shovels permits, Census BPS | Permit Timeline Benchmarks; Friction Score Calibration | ADU approval: LA Coastal Zone avg 260 days vs. 147 days outside[^63]. Key source for calibrating months-to-permit by MSA. |
| **US Census Building Permits Survey (BPS)** | `https://www.census.gov/permits` + API: `https://api.census.gov/data/{year}/cbpnextract?get=...` | Free | ~500 req/day free; free API key for higher[^38] | National → State / CBSA (MSA) | Monthly | CSV / Excel / JSON | Optional API key | Permit counts by type (1-unit, 2-unit, 3-4 unit, 5+ unit), authorized, started, completed; by geography[^65] | Shovels, Terner Center, NAHB | Permitting Volume Trend; Issuance Rate Tile | Monthly data: census.gov/permits. 2025 annual data released May 14, 2026[^65]. Use for jurisdiction-level permit approval velocity benchmarking. |

***

### Section D: Top-50 MSA City & County GIS Portal Endpoints

#### Tier 1 — Fully Open ArcGIS REST / Socrata APIs

| City / County | Source Name | Exact Endpoint / URL | Data Available | Format | Auth | Update Freq | Notes |
|---|---|---|---|---|---|---|---|
| **New York City** | NYC MapPLUTO (Socrata) | `https://data.cityofnewyork.us/resource/64uk-42ks.json` | Parcel, land use code, zone dist, bldg class, FAR achieved, owner[^18][^66] | JSON / CSV | App token optional | Quarterly | 70+ fields. MapPLUTO geometry: `data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-Map-MapPLUTO/f888-ni5f` |
| **New York City** | NYC ZoLa (ArcGIS REST) | `https://zola.planning.nyc.gov` + `https://ae-zoning-api.nyc.gov` | Zoning districts, overlays, special districts, DCP applications[^67][^68] | JSON | No | Monthly | ZoLa does not return FAR/height numeric values directly — must cross-reference NYC Zoning Resolution[^17] |
| **New York City** | NYC DCP Application Portal | `https://a030-lucats.nyc.gov` | Active land use applications, ULURP cases, Uniform Land Use Review | JSON / Web | No | Real-time | ULURP = Uniform Land Use Review Procedure. Key for entitlement pipeline tracking. |
| **Los Angeles City** | LA GeoHub (ArcGIS REST) | `https://geohub.lacity.org/datasets/` + ZIMAS: `https://zimas.lacity.org` | Zoning, overlays, specific plans, permit history, planning applications[^69][^70] | GeoJSON / REST | No | Continuous | ZIMAS searchable by address/APN. GeoHub REST: `gis.lacity.org/arcgis/rest/services/LADCP/Zoning/MapServer` |
| **Chicago** | City of Chicago Socrata | `https://data.cityofchicago.org/resource/7cve-jgbp.json` (current zoning) | Zoning districts, zoning type, classification[^71][^72] | JSON / GeoJSON | App token optional | 2024-updated | Current dataset ID: `7cve-jgbp`. Chicago Cityscape API (paid membership) adds FAR, height, setbacks[^73]. |
| **Dallas** | Dallas GIS (ArcGIS REST) | `https://gis.dallascityhall.com/arcgis/rest/services/sdc_public/Zoning/MapServer` | Zoning code, case number, overlay districts[^74][^75] | ArcGIS REST / JSON | No | Daily (automated script)[^75] | Query example: `/MapServer/0/query?geometry={POINT}&geometryType=esriGeometryPoint&outFields=*&f=json` |
| **Phoenix** | Phoenix Open Data (ArcGIS REST) | `https://maps.phoenix.gov/pub/rest/services/Public/Zoning/MapServer` | Zoning boundaries, overlay zones, PDZ cases[^76][^77] | ArcGIS REST | No | Periodic | Also: `https://www.phoenixopendata.com` for rezoning case data |
| **Miami (City)** | City of Miami GIS / Developer Portal | `https://datahub-miamigis.opendata.arcgis.com` + `https://www.miami.gov/Developer` | Zoning, land use, property info, OZ[^78][^79] | GeoService / GeoJSON | No | Continuous | Miami21 zoning layers accessible via ArcGIS REST. Developer portal provides Geoservice and GeoJson endpoints[^78]. |
| **Miami-Dade County** | Miami-Dade Open Data Hub | `https://gis-mdc.opendata.arcgis.com` + eMaps: `https://gisweb.miamidade.gov/emaps/` | County parcels, zoning, flood, environmental, property records[^80][^81] | ArcGIS REST | No | Continuous | Best county-level source for unincorporated MDC areas. |
| **Seattle** | Seattle GeoData (ArcGIS) | `https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::current-land-use-zoning-detail/about` | Land use zoning, zoning groups (26 categories)[^82][^83] | ArcGIS REST / Shapefile | No | Periodic | Direct REST: `gisdata.seattle.gov/server/rest/services/COS/Seattle_Zoning/MapServer` |
| **DC** | DC Open Data (ArcGIS / Socrata) | `https://opendata.dc.gov` + MAR2 API: `https://mar.dc.gov/api/v1/` | Zoning, overlays, address master record, permit history, parcel[^84][^85] | ArcGIS REST / Socrata / JSON | No (MAR2 needs key) | Real-time (MAR2); periodic (zoning) | Zoning layer: `maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Zoning_WebMercator/MapServer` |
| **San Francisco** | DataSF (Socrata) | `https://data.sfgov.org/resource/6b2n-v87s.json` (zoning districts) | Zoning districts, land use, property information, planning pipeline[^86][^87] | Socrata JSON | No (app token optional) | Quarterly | SF Planning pipeline at DataSF: `data.sfgov.org/Housing-and-Buildings/SF-Development-Pipeline-2024/` Zoning Board cases also available[^87]. |
| **Boston** | Analyze Boston + BPDA ZBA Tracker | `https://data.boston.gov/resource/` + Zoning Viewer: `https://maps.bostonplans.org/zoningviewer/` | Zoning districts, ZBA appeals tracker, permit data, assessor[^88][^89][^90] | Socrata JSON | No | Near-real-time (ZBA) | ZBA tracker includes variance/appeal outcomes — critical for friction scoring[^89]. BPDA Article 80 Developer Portal for large projects[^91]. |
| **Atlanta** | Atlanta City Planning GIS | `https://dpcd-coaplangis.opendata.arcgis.com` + `https://gis.atlantaga.gov` | Zoning districts, parcels, OZ, TAD[^92][^93] | ArcGIS REST | No | Periodic | ARC Open Data Hub (`opendata.atlantaregional.com`) adds regional context, building permit tracker[^94][^95]. |
| **Austin** | Austin Open Data Portal | `https://data.austintexas.gov` + GIS: `https://austintexas.gov/department/gis` | Zoning, future land use, parcel, permits[^96] | Socrata JSON / ArcGIS REST | No | Continuous | Austin has a detailed zoning layer: `https://services.arcgis.com/0L95cKYz7bqXDibU/arcgis/rest/services/` |
| **Portland** | PortlandMaps + BPS Open Data | `https://www.portlandmaps.com` + `https://gis-pdx.opendata.arcgis.com` | Zoning, permits, land use review cases (from 2000), assessor[^97][^98] | ArcGIS REST / Web | No (free account for docs)[^98] | Continuous | Permits/zoning searchable by address. REST: `gis.portlandoregon.gov/arcgis/rest/services/` Note: Multnomah County pauses data sharing seasonally during tax processing[^99]. |
| **Denver** | Denver Open Data Catalog | `https://opendata-geospatialdenver.hub.arcgis.com` + `https://www.denvergov.org/data` | Zoning, parcels, permits, land use[^100][^101] | ArcGIS REST / CSV | No | Continuous | Denver County parcel Feature Server: `https://www.denvergov.org/Government/Data-and-Maps`[^102]. Denver Regional Council adds MSA context[^103]. |

#### Tier 2 — Documented Open Portals, Less Uniform API Access

| City | Portal URL | Data Available | Format | Notes |
|---|---|---|---|---|
| **Houston** | `https://cohgis-mycity.opendata.arcgis.com` | No zoning (Houston has no citywide zoning). Deed restrictions, ETJ, permit data | ArcGIS REST | No zoning — use deed restriction layer + Regrid ownership for workaround. |
| **San Jose** | `https://gis.sanjoseca.gov/arcgis/rest/services` | Zoning, permits, parcels | ArcGIS REST | REST: `gis.sanjoseca.gov/arcgis/rest/services/PublicData/Zoning/MapServer` |
| **San Diego** | `https://opendata.sandiego.gov` + County: `https://gis.sdsheriff.gov` | Zoning (iMaps), county parcels | ArcGIS REST / Socrata | City zoning: `https://seshat.sandag.org/sdgis/rest/services/` |
| **Charlotte** | `https://charlottenc.gov/planning/geodata` + `https://maps.charlottenc.gov` | UDO zoning, parcels, permit history | ArcGIS REST | Charlotte Explorer: `https://explore.charlottenc.gov`. New UDO adopted 2022. |
| **Raleigh** | `https://data-ral.opendata.arcgis.com` (iMaps) | Zoning, permits, parcels, land use | ArcGIS REST | Excellent open data portal, one of best mid-tier cities. |
| **Minneapolis** | `https://opendata.minneapolismn.gov` | Minneapolis 2040 plan zoning, parcels | ArcGIS REST / Socrata | Minneapolis 2040 allows fourplexes citywide — high policy relevance. |
| **Nashville** | `https://data.nashville.gov` + Maps Nashville | Zoning, permits, parcels | Socrata / ArcGIS | Metro Planning: `https://www.nashville.gov/departments/planning` |
| **Philadelphia** | `https://www.opendataphilly.org` + Atlas: `https://atlas.phila.gov` | Zoning, parcels, permits, L&I violations | Socrata JSON / ArcGIS | Atlas aggregates zoning + permits + property in single address lookup. |
| **Pittsburgh** | `https://pghgis-pittsburghpa.opendata.arcgis.com` | Zoning, parcels, permits | ArcGIS REST | Good coverage for a mid-tier MSA. |
| **Indianapolis** | `https://www.mapindy.org` | Zoning, parcels, permits | ArcGIS REST | Marion County parcels well-documented. |
| **Louisville** | `https://lojic.maps.arcgis.com` (LOJIC) | Parcels, zoning, permits | ArcGIS REST | LOJIC = Louisville-Jefferson County Information Consortium. Strong open data. |
| **Columbus** | `https://opendata.columbus.gov` + Franklin County GIS | Zoning, parcels | ArcGIS REST | Franklin County Auditor GIS: `https://gis.franklincountyauditor.com` |
| **Sacramento** | `https://data.cityofsacramento.org` | Zoning, permits, parcels | Socrata / ArcGIS | County: Sacramento County GIS portal |
| **Las Vegas** | `https://maps.clarkcountyns.gov` (Clark County) | Parcels, zoning, permits | ArcGIS REST | Clark County GIS: strong coverage for unincorporated areas (most of Vegas metro). |
| **Tampa** | `https://www.arcgis.com/apps/webappviewer/...` (TampaGov GIS) | Zoning, parcels, flood | ArcGIS REST | Hillsborough County has separate GIS portal. |
| **Fort Worth** | `https://data.fortworthtexas.gov` | Zoning, permits | Socrata / ArcGIS | Tarrant County Appraisal District has parcel data. |
| **Oklahoma City** | `https://data.okc.gov` | Zoning, permits, parcels | Socrata / ArcGIS | Mid-tier but good open data posture. |
| **Jacksonville** | `https://www.coj.net/departments/planning-and-development/` | Zoning, permits | Web / ArcGIS REST | JaxGIS: `https://maps.coj.net` |
| **Memphis** | `https://data.memphistn.gov` | Permits, parcels | Socrata | Zoning less documented; Shelby County assessor has parcels. |
| **Baltimore** | `https://data.baltimorecity.gov` | Zoning, permits, parcels | Socrata / ArcGIS | `https://maps.baltimorecity.gov` for interactive lookup. |
| **Detroit** | `https://data.detroitmi.gov` | Parcels, permits, blight | Socrata | Wayne County GIS for broader parcel coverage. |
| **Orlando** | `https://www.arcgis.com/apps/...` (OrangeGIS) | Zoning, parcels, permits | ArcGIS REST | Orange County Property Appraiser: `https://ocpafl.org/gis` |

***

## Part 2: Top 15 Highest-Leverage Sources for National CRE Entitlement Overlay

The following 15 sources, ranked by their contribution to an "Entitlement Friction Score," represent the essential backbone for a national parcel-level CRE intelligence terminal.

1. **Regrid API v2** — The only nationally consistent free-trial parcel geometry + attribute backbone for all 50 states. No substitute for nationwide coverage.[^2]

2. **Zoneomics API** — Sole vendor with parcel-level zoning code, permitted uses, FAR, and setbacks via a single API call across 22,000+ US jurisdictions. Free tier (100 calls/mo) sufficient for testing; Pro ($399/mo) for production.[^9]

3. **FEMA NFHL ArcGIS REST** — Completely free, no auth, no rate limit, official flood zone data required for any risk-adjusted underwriting. Single most impactful free overlay for coastal MSAs.[^31]

4. **NYC MapPLUTO / PLUTO (Socrata)** — Free, 70+ fields, parcel-level zoning + land use + ownership for the most complex market in the US. No comparable source exists for NYC depth.[^18][^19]

5. **HUD Opportunity Zones Layer** — Free GIS download covering 8,764 OZ tracts; OZ 2.0 designations now active through 2036. Critical for Israeli LP tax-advantaged deal screening.[^33]

6. **CDFI Fund CIMS / NMTC Layer** — Free address-level QCT and NMTC eligibility lookup; updated to 2016–2020 ACS. Essential for deal incentive stacking analysis.[^37][^35]

7. **Census TIGERweb REST + BPS API** — Free census tract geometry + monthly building permit volume by MSA. Required for friction score calibration (MSA-level permit velocity).[^65][^39]

8. **Shovels.ai** — Only vendor aggregating 113M+ building permits from 1,800+ jurisdictions in standardized JSON, now with meeting intelligence via ReZone acquisition. Paid ($599/mo+) but irreplaceable for entitlement activity tracking.[^26][^25]

9. **National Zoning Atlas (NZA)** — Free, research-grade, standardized zoning dataset covering 33,000+ jurisdictions. Best source for comparative friction scoring across metros.[^13][^56]

10. **NOAA Sea Level Rise WMS** — Free ArcGIS REST services for 0–10 ft SLR inundation scenarios. Mandatory overlay for Miami, Tampa, Charleston, Houston, NYC coastal parcels.[^50]

11. **Dallas GIS / Phoenix Open Data / Chicago Socrata** — Free ArcGIS REST zoning layers for three of the top-five growth MSAs; daily-updated for Dallas. First-call sources before buying commercial data.[^71][^74][^75]

12. **NYC DCP ZoLa + AE Zoning API** — Free, no-auth API for NYC zoning district + DCP application lookups. Essential for the world's most complex zoning jurisdiction.[^68][^16]

13. **NYU Furman Center Land Use Reform Tracker** — Free tracker of state-level zoning reforms; key input for jurisdiction-level regulatory risk scoring.[^57][^104]

14. **EPA EJScreen Archive (Zenodo)** — Free archived data at block-group level through 2024. Use as environmental burden input for EJ-overlay deal screening; note live API is offline.[^51][^105]

15. **Terner Center / Census BPS Permit Timing Data** — Free research reports providing MSA-level permit approval timelines — the empirical backbone of the months-to-permit friction metric.[^63][^64]

***

## Part 3: Unfair-Advantage City/County GIS Endpoints Most Analysts Ignore

These mid-tier MSA endpoints are publicly accessible, REST-queryable, and largely unknown to institutional analysts, creating significant information asymmetry:

**Raleigh, NC — `data-ral.opendata.arcgis.com`**
One of the best-maintained mid-tier open data portals in the US; parcel, zoning, and permit data all Socrata-queryable. Raleigh-Durham is a top-10 growth market yet rarely gets API-grade attention. The iMaps portal returns parcel-level zoning on address lookup.

**Louisville, KY — LOJIC (`lojic.maps.arcgis.com`)**
The Louisville-Jefferson County Information Consortium operates one of the most sophisticated regional GIS infrastructures in the South. Full parcel, zoning, and permit dataset with REST endpoints. Louisville-Jefferson County is a major logistics and industrial CRE market that most coastal analysts treat as a data desert.

**Minneapolis, MN — `opendata.minneapolismn.gov`**
Minneapolis 2040 comprehensive plan upzoned the entire city to allow fourplexes citywide — the most permissive zoning reform of any major US city. All zoning layers are REST-accessible. High relevance for multifamily entitlement analysis and friction scoring benchmarking.[^106]

**Indianapolis, IN — MapIndy (`mapindy.org`)**
Marion County has a well-documented ArcGIS REST service with parcel-level zoning + property records. Indianapolis is a top industrial/logistics CRE market with virtually no commercial data coverage.

**Pittsburgh, PA — `pghgis-pittsburghpa.opendata.arcgis.com`**
Full zoning + parcel + permit ArcGIS Hub; Allegheny County assessor integrates well. Pittsburgh has significant opportunity zones and urban redevelopment plays with near-zero institutional data competition.

**Columbus, OH — `opendata.columbus.gov`**
Franklin County Auditor GIS (`gis.franklincountyauditor.com`) provides one of the best county-level assessor datasets in the Midwest — parcel, ownership, deed history, zoning — all freely accessible via REST.

**Denver/Aurora — `opendata-geospatialdenver.hub.arcgis.com`**
Denver's ArcGIS Hub is comprehensive and well-maintained. The Denver Regional Council of Governments (`data.drcog.org`) adds MSA-wide context including land use forecasts. Most analysts only use city-level data and miss the DRCOG regional layer.

**Clark County (Las Vegas) — `maps.clarkcountyns.gov`**
Approximately 70% of the Las Vegas metro is unincorporated Clark County — yet most analysts only query the City of Las Vegas portal. Clark County GIS has full parcel + zoning coverage for the true Las Vegas market.

***

## Part 4: Gap Analysis — Top-50 MSAs Without Open Zoning APIs

### MSAs With Structural Data Gaps

Several major MSAs in the top 50 either lack programmatic zoning APIs entirely or have such fragmented governance that no single endpoint covers the market:

**Houston, TX** — No citywide zoning ordinance exists. The city instead uses deed restrictions (private), which are not aggregated in any public API. The City of Houston's GIS provides parcel data and Special Purpose District overlays, but no zone code. The Harris County Appraisal District (`hcad.org`) provides parcel-level attributes. **Workaround:** Regrid (paid) for parcel backbone + deed restriction layer from City of Houston GIS + HCAD API for ownership; Zoneomics (paid) for deed restriction-aware use overlays.[^29]

**Mid-Tier Texas (San Antonio, Fort Worth, OKC, Tulsa)** — Cities maintain ArcGIS portals but with irregular update cadence and no documented public API authentication. Zoning layers often available as static Shapefile downloads only. **Workaround:** Regrid paid API (zoning field populated from city source where licensed) + Shovels for permit activity as a proxy for entitlement velocity.

**Southeast (Memphis, TN; Jackson, MS; Birmingham, AL)** — County-level parcel data varies dramatically. Shelby County (Memphis) has a reasonable assessor GIS; city-level zoning is web-only with no REST API. **Workaround:** FOIA request to city planning department for bulk zoning shapefile (typically fulfilled in 10–30 days; legally required under state open records laws) + Regrid paid for parcel geometry.

**Inland Empire, CA (Riverside/San Bernardino counties)** — Both counties have GIS portals but zoning is managed at the city level across dozens of municipalities; no county-wide aggregated zoning layer. **Workaround:** Zoneomics paid ($399/mo) covers these jurisdictions; alternatively, pull LAFCO boundaries + individual city ArcGIS services via a city-by-city scraping approach.

**New Jersey (Newark, Jersey City, Trenton)** — NJ municipalities control zoning; there is no statewide aggregator. NJGIN (NJ Geographic Information Network) provides some layers but zoning is not standardized. **Workaround:** NZA datasets for NJ (partially complete) + individual municipal web portals; alternatively, Regrid paid includes NJ zoning where sourced.

### Gap Severity by Priority MSA

| MSA | Gap Type | Coverage Score (1–5) | Best Free Workaround | Best Paid Workaround |
|---|---|---|---|---|
| NYC | Excellent open data | 5/5 | MapPLUTO + ZoLa + AE Zoning API | N/A |
| LA | Good, fragmented | 4/5 | GeoHub + ZIMAS | Zoneomics Pro |
| Chicago | Good | 4/5 | Socrata zoning + Chicago Cityscape (paid) | Chicago Cityscape API |
| Dallas | Excellent | 5/5 | Dallas GIS REST (daily updated) | Regrid + Shovels |
| Phoenix | Good | 4/5 | Phoenix Open Data ArcGIS | Zoneomics Pro |
| Miami | Good (city) / Great (county) | 4/5 | Miami City GIS + Miami-Dade Hub | N/A |
| Houston | Poor (no zoning) | 2/5 | HCAD parcel + deed restrictions | Regrid paid + Zoneomics |
| Atlanta | Moderate | 3/5 | Atlanta City Planning GIS + ARC | Regrid paid |
| Seattle | Good | 4/5 | Seattle GeoData ArcGIS | N/A |
| Boston | Good | 4/5 | Analyze Boston + ZBA Tracker | N/A |
| San Francisco | Excellent | 5/5 | DataSF Socrata | N/A |
| DC | Excellent | 5/5 | DC Open Data + MAR2 API | N/A |
| Denver | Good | 4/5 | Denver Open Data Hub | N/A |
| Portland | Good | 4/5 | PortlandMaps (seasonal gaps) | N/A |
| Minneapolis | Good | 4/5 | Minneapolis Open Data | N/A |
| Las Vegas | Moderate | 3/5 | Clark County GIS (covers most) | Regrid paid |
| San Antonio | Moderate | 3/5 | SAMaps GIS | Regrid + Zoneomics |
| Riverside/IE | Poor | 2/5 | Per-city ArcGIS services | Zoneomics Pro |
| Memphis | Poor | 2/5 | Shelby County assessor + FOIA | Regrid paid |
| New Jersey MSAs | Poor | 2/5 | NZA (partial) + per-city portals | Regrid paid + Zoneomics |

### Cheapest Legitimate Workarounds for Gap MSAs

1. **FOIA/Public Records Request** — Every US state has an open records statute. A bulk zoning shapefile request to any city planning department typically costs $0–$50 and must be fulfilled within 5–30 business days. This is the zero-cost path for one-time coverage of gap markets. However, it does not produce a real-time API.

2. **Regrid Paid API** — Regrid ($500–$2,000/mo depending on volume) populates the `zoning` field in its schema where the underlying county/city data has been licensed. Coverage is approximately 60–70% of US parcels for the zoning field, concentrated in active CRE markets.[^107][^108]

3. **Zoneomics Pro ($399/mo)** — Claims 22,000+ US jurisdictions. Best choice for programmatic zoning lookups in markets where city GIS portals are absent or non-queryable. Covers permitted uses, FAR, height, setbacks in a standardized schema.[^9]

4. **Shovels.ai ($599/mo+)** — For entitlement activity (permit history, meeting decisions) in markets where zoning APIs are absent, Shovels provides permit-based proxy signals for entitlement velocity.[^25][^24]

5. **Scraping (use cautiously)** — City portals with JavaScript-rendered zoning lookups (e.g., older ArcGIS Server 10.x installations) can be queried via the underlying ArcGIS REST endpoint even without a documented public API, using the standard `{server}/arcgis/rest/services/{layer}/query?geometry={POINT}&outFields=*&f=json` pattern. This is legally permissible for public government data but should be rate-limited to avoid server strain. A curated list of ~3,500 government ArcGIS server endpoints is maintained at `mappingsupport.com/p/surf_gis/list-federal-state-county-city-GIS-servers.txt`.[^109][^110]

***

## Part 5: Entitlement Friction Score — Recommended Architecture

To power a real-time "Entitlement Friction Score" for any parcel in the top-50 MSAs, the terminal should assemble the following data pipeline:

### Input Data by Tier

**Tier 1 — Real-Time Parcel Context (per-click)**
- Parcel geometry + APN: Regrid API v2[^2]
- Zoning code + permitted uses: Zoneomics API (or city ArcGIS REST where available)[^8][^9]
- Flood zone: FEMA NFHL REST[^31]
- Opportunity Zone status: HUD OZ GIS (pre-loaded)[^34]
- QCT / NMTC status: CDFI CIMS (pre-loaded)[^37]
- Sea level rise exposure (coastal MSAs): NOAA SLR WMS[^50]

**Tier 2 — Jurisdiction-Level Friction Calibration (pre-computed)**
- Months-to-permit benchmark: Census BPS permit data velocity + Terner Center research[^63][^65]
- Regulatory stringency: WRLURI index + NZA zoning type data[^59][^13]
- Recent reform trajectory: Furman Center Reform Tracker + NZA reform coverage[^57]
- Entitlement application density: Shovels.ai permit + meeting data (paid)[^25]

**Tier 3 — Historical Entitlement Activity (pre-computed)**
- Variance/rezoning history: City-specific ZBA/Planning Commission Socrata feeds (Boston, NYC, SF, Chicago all have open ZBA data)[^72][^89]
- Permit denial rate: Shovels.ai inspection pass rates; city permit portals (Austin, Portland, SF)[^25]

### Friction Score Formula (Conceptual)

The Entitlement Friction Score \(EFS\) for a parcel \(p\) in jurisdiction \(j\) is conceptually:

\[
EFS_{p,j} = w_1 \cdot \text{months\_to\_permit}_j + w_2 \cdot \text{denial\_rate}_j + w_3 \cdot \text{regulatory\_index}_j - w_4 \cdot \text{by\_right\_flag}_{p} - w_5 \cdot \text{reform\_momentum}_j
\]

Where weights \(w_1\)–\(w_5\) are calibrated against Terner Center benchmarks and Wharton WRLURI data, and `by_right_flag` is derived from the Zoneomics `permitted_uses` field cross-referenced against proposed use.

***

## Part 6: Sample API Calls (curl / Python)

### Regrid API v2 — Parcel by Lat/Lon
```bash
curl "https://app.regrid.com/api/v2/us/parcels/point?lat=25.7617&lon=-80.1918&token=YOUR_TOKEN&return_custom=true"
```

### Zoneomics — Zoning Detail by Lat/Lon
```bash
curl "https://api.zoneomics.com/v2/zoneDetail?lat=25.7617&lon=-80.1918&key=YOUR_KEY"
# Returns: zone_code, zone_name, permitted_uses[], FAR, height_ft, setbacks{}, coverage_pct
```

### FEMA NFHL — Flood Zone by Parcel Geometry
```bash
curl "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query?geometry=-80.1918,25.7617&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,SFHA_TF,BFE_REVERT&f=json"
```

### NYC MapPLUTO — Parcel by Address (Socrata)
```python
import requests
r = requests.get(
    "https://data.cityofnewyork.us/resource/64uk-42ks.json",
    params={"address": "123 Main St", "$limit": 1, "$$app_token": "YOUR_TOKEN"}
)
data = r.json()
# Fields: zonedist1, landuse, bldgclass, yearbuilt, numfloors, assesstot, ownername
```

### CDFI CIMS — NMTC Tract Eligibility (TIGERweb join)
```python
import requests
# Step 1: Get census tract GEOID from TIGERweb
r = requests.get(
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/0/query",
    params={"geometry": "-80.1918,25.7617", "geometryType": "esriGeometryPoint",
            "outFields": "GEOID", "f": "json"}
)
geoid = r.json()["features"]["attributes"]["GEOID"]
# Step 2: Cross-reference GEOID against CDFI NMTC eligibility CSV (pre-loaded)
```

### Dallas Zoning — ArcGIS REST
```bash
curl "https://gis.dallascityhall.com/arcgis/rest/services/sdc_public/Zoning/MapServer/0/query?geometry=-96.797,32.776&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=ZONE_DESC,CASE_NO,OVERLAY&f=json"
```

***

## Appendix: Key Data Gaps and Caveats for Israeli LP Terminal Users

1. **EJScreen offline:** EPA removed EJScreen Feb 2025. Use archived Zenodo data (static, through 2024 vintage) or screening-tools.com mirror. Not suitable for live API calls until EPA restores access.[^51]

2. **Zoneomics free tier is effectively a trial:** 100 calls/month is adequate for validation and demos but not production. A Tel Aviv user clicking addresses across all 50 MSAs will exhaust the free tier within hours of testing. Budget for Zoneomics Pro ($399/mo) or equivalent from day one.

3. **Houston has no zoning:** No zoning ordinance = no zoning API. The CRE terminal must display a disclaimer and substitute deed restriction mapping + land use classification from Regrid/HCAD.[^29]

4. **Portland data gaps:** PortlandMaps pauses data sharing seasonally during tax processing. Build in graceful degradation to cached data.[^99]

5. **NYC ZoLa ≠ development feasibility:** ZoLa shows zoning districts but does NOT return numeric FAR, height limits, or allowable use counts directly. The AE Zoning API (`ae-zoning-api.nyc.gov`) and the NYC Zoning Resolution text API are needed for full development potential calculation.[^17]

6. **FEMA NFHL lag:** FIRM maps can be years out of date in actively flooded areas. Always note effective date and cross-reference with NOAA SLR data for forward-looking coastal risk.[^32]

7. **Regrid zoning field coverage:** The `zoning` field in Regrid's schema is populated for approximately 60–70% of US parcels. Where blank, Zoneomics or city GIS fallback is required.[^108]

8. **OZ 2.0 transition:** The new Opportunity Zones 2.0 map is now in effect alongside OZ 1.0 (effective through 2028). The terminal must display both designations until the 2028 sunset of OZ 1.0.[^33]

---

## References

1. [General Introduction - Regrid Support](https://support.regrid.com/api/using-the-parcel-api) - Rates are limited to 10 simultaneous API requests or approximately 200 API requests per minute. Addi...

2. [Using the API v1 - Regrid Support](https://support.regrid.com/api/using-the-parcel-api-v1) - The Parcel API supports searching by location (lat/lon), parcel number (APN), parcel street address,...

3. [Parcel API Program, Buildings Data, Opportunity Zones ... - Regrid](https://regrid.com/blog/novembernewsletter) - There is a 30 day free trial, no payment info required, and after that if you want to continue using...

4. [Annual API & Tileserver Packages - Limited-Time Offer ONLY! - Regrid](https://regrid.com/blog/apipackages) - The Standard Bundle - Parcel API + Tiles (Vector & Rastor):. Annual license - $12K per year, with 12...

5. [Regrid's Batch Parcel API](https://support.regrid.com/api/batch-api) - To fine tune your requests Regrid's Batch Parcel API supports the relevant parameters of API v2 endp...

6. [US Parcel Boundary Tile Layer Now Available - Esri](https://www.esri.com/arcgis-blog/products/arcgis-living-atlas/announcements/us-parcel-boundary-tile-layer-now-available) - This layer will be regularly updated and covers urban, suburban, and rural areas in the United State...

7. [The US Parcel Boundary tile layer is now available in ArcGIS Living ...](https://www.facebook.com/esrigis/posts/the-us-parcel-boundary-tile-layer-is-now-available-in-arcgis-living-atlas-made-i/897739165713271/) - The US Parcel Boundary tile layer is now available in ArcGIS Living Atlas. Made in collaboration wit...

8. [Zoneomics Zoning API Reviews and Pricing 2026 - F6S](https://www.f6s.com/software/zoneomics-zoning-api) - Free Tier. $0per month. - Zoning Map Tiling Service - Free up to 100,000 map tiles ... API calls - 1...

9. [Real Estate API: Transforming Property Data, Zoning Insights, and ...](https://www.zoneomics.com/blog/what-is-an-api-and-how-is-it-used-in-real-estate) - Zoning APIs provide zoning designations, detailed regulations (setbacks, height limits, density), pe...

10. [Pushing the envelope: Automated Zoning Constraints with Zoneomics](https://www.youtube.com/watch?v=DDSDvEAMTT0) - Leveraging the Giraffe SDK, @Zoneomics Video (AI-enabled Zoning Data Solutions) has built an incredi...

11. [Smarter Generative Design: Autodesk and Zoneomics Partner to ...](https://blogs.autodesk.com/forma/2024/08/19/autodesk-and-zoneomics-partner-to-bring-zoning-responsive-building-envelopes-to-forma/) - The next natural evolution in the application of our zoning data and insights is the development of ...

12. [Zoneomics Integration - TestFit](https://www.testfit.io/integrations-zoneomics) - Sign up for our Zoneomics integration to access and apply zoning data to find the best site solution...

13. [National Zoning Atlas](https://www.zoningatlas.org) - The National Zoning Atlas is digitizing, demystifying, and democratizing information about zoning co...

14. [National Zoning Atlas Could Contribute to Zoning Law Reform ...](https://www.novoco.com/notes-from-novogradac/national-zoning-atlas-could-contribute-zoning-law-reform-policy-analysis) - The National Zoning Atlas project aims to create a tool that outlines different zoning codes by stat...

15. [National Zoning Atlas Launched to Make America's Patchwork of ...](https://www.lawschool.cornell.edu/news/national-zoning-atlas-launched-to-make-americas-patchwork-of-codes-accessible-and-comprehensible/) - Professor of City and Regional Planning Sara Bronin's zoning atlas initiative is a first-of-its-kind...

16. [NYCPlanning/ae-zoning-api - GitHub](https://github.com/NYCPlanning/ae-zoning-api) - This project includes an API to interact with data from city planning and OpenAPI documentation for ...

17. [Has anyone used NYC ZoLa map to see what I can build on ... - Reddit](https://www.reddit.com/r/Architects/comments/1chvtc7/has_anyone_used_nyc_zola_map_to_see_what_i_can/) - The zola map makes for a great table of contents, but it will take a deep dive into the zoning code ...

18. [Primary Land Use Tax Lot Output - Map (MapPLUTO)](http://catalog.data.gov/dataset/primary-land-use-tax-lot-output-map-mappluto) - Extensive land use and geographic data at the tax lot level in GIS format (ESRI Shapefile). Contains...

19. [PLUTO, MapPLUTO and PLUTO Change File - NYC.gov](https://www.nyc.gov/content/planning/pages/resources/datasets/mappluto-pluto-change) - MapPLUTO merges PLUTO tax lot data ... It contains extensive land use and geographic data at the tax...

20. [Fresh Data from UrbanFootprint](https://urbanfootprint.com/blog/product/fresh-data-from-urbanfootprint/) - Our latest Winter 2025 data release brings refreshed nationwide datasets, including: Updated parcel ...

21. [Built Environment | UrbanFootprint](https://urbanfootprint.com/platform/built-environment/) - A curated collection of datasets and models offering an up-to-date view of land use, buildings, tran...

22. [Unlock Insights at Every Scale Using UrbanFootprint's Land Use ...](https://urbanfootprint.com/blog/sustainable-cities/land-use-categories/) - UrbanFootprint has the most comprehensive, nationwide land use database available, which allows you ...

23. [Introducing UrbanFootprint Academic](https://urbanfootprint.com/blog/sustainable-cities/new-offering-for-educators-and-researchers/) - UrbanFootprint evaluates the percent of residents with walk access to parks and transit stops within...

24. [How Much Does Shovels Cost?](https://docs.shovels.ai/docs/knowledge-base/getting-started/pricing-structure) - Shovels Online and API both have intro pricing tiers starting at $599/month. Create an account or lo...

25. [Building Contractor and Permit API - Shovels.ai](https://www.shovels.ai/api) - We capture permit, contractor, and property data from 1,800+ jurisdictions nationwide—using AI to cl...

26. [Shovels Acquires ReZone to Add Local Government Meeting ...](https://www.shovels.ai/blog/shovels-acquires-rezone/) - Shovels has acquired ReZone, an AI company tracking local government meeting decisions, unifying mee...

27. [How to use the Shovels AI GPT](https://www.shovels.ai/blog/how-to-use-the-shovels-ai-gpt/) - The Shovels custom GPT is an easy way for anyone looking to access detailed, localized information o...

28. [Parcel-Specific Zoning Data via API Integration - Gridics](https://gridics.com/zoning-data-api/) - Gridics API integration provides thousands of zoning data points including development potential, op...

29. [Zoning data APIs : r/gis - Reddit](https://www.reddit.com/r/gis/comments/ui9jmf/zoning_data_apis/) - Looking for an API where I can pull in zoning polygon datasets from either the state, county or town...

30. [Tracking Zoning Decisions with an LLM - Thesis Driven](https://www.thesisdriven.com/letters/tracking-zoning-decisions-with-an/) - You can try ReZone for free for 30 days here and use the code “ThesisDriven” to get 25% off. I've as...

31. [GIS Web Services for the FEMA National Flood Hazard Layer (NFHL)](https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS) - The ArcGIS REST service provides direct access to NFHL spatial information through Environmental Sys...

32. [FEMA's National Flood Hazard Layer (NFHL) Viewer | MARISA](https://www.marisa.psu.edu/individualtools/page-tool51.0/) - The National Flood Hazard Layer (NFHL) is an interactive mapping tool that allows users to view floo...

33. [Opportunity Zones | HUD.gov / U.S. Department of Housing and ...](http://www.hud.gov/opportunity-zones) - Opportunity Zones are economically distressed communities, defined by individual census tract, nomin...

34. [Opportunity Zones - Catalog - Data.gov](https://catalog.data.gov/dataset/opportunity-zones-16322) - This service provides spatial data for all US Decennial Census tracts designated as Qualified Opport...

35. [New NMTC Eligibility Data from the CDFI Fund](https://nmtccoalition.org/2023/09/06/new-nmtc-data/) - New Markets Tax Credit Program Low-Income Community (LIC) Data is now available. The updated LIC dat...

36. [CDFI (Community Development Financial Institutions) Fund and ...](https://www.policymap.com/data/sources/cdfi-community-development-financial-institutions-fund-and-policymap) - PolicyMap provides a map of those eligible Census tracts (“Eligible Tracts”), as well as the underly...

37. [Welcome to the CDFI Fund CIMS Mapping Tool](https://www.cdfifund.gov/cims) - This mapping tool was created to provide prospective applicants with the ability to search by addres...

38. [US Census Data Python API Docs | dltHub](https://dlthub.com/context/source/us-census-data) - The US Census Data API is a REST API providing programmatic access to raw statistical data from mult...

39. [Census TIGERweb GeoServices REST API](https://www.census.gov/data/developers/data-sets/TIGERweb-map-service.html) - The GeoServices REST Specification provides a way for Web clients to communicate with geographic inf...

40. [National Land Cover Database (NLCD) | Geospatial (GIS) Data](https://www.lib.ncsu.edu/gis/nlcd) - As of March 2026, the latest release is 2024 for the Conteniental United States (CONUS). Recently, t...

41. [Data Services Page | Multi-Resolution Land Characteristics (MRLC ...](https://www.mrlc.gov/data-services-page) - The following MRLC datasets are published as map services. These map services are available as Open ...

42. [Land Cover](https://www.mrlc.gov/data/type/land-cover) - The annual NLCD land cover dataset uses a modified Anderson Level II classification system with 16 l...

43. [USDA - Research and Science - Cropland Data Layers](https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php) - The Cropland Data Layer is available free for download at CroplandCROS ... The CDL is available onli...

44. [Research and Science - Cropland Data Layer Releases](https://www.nass.usda.gov/Research_and_Science/Cropland/Release/index.php) - Download the 2023 and 2024 Hawaii Cropland Data Layers V2.0 here: Hawaii_CDL_2023_2024.zip (17 MB). ...

45. [USDA NASS Cropland Data Layers | Earth Engine Data Catalog](https://developers.google.com/earth-engine/datasets/catalog/USDA_NASS_CDL) - The Cropland Data Layer (CDL) provides annual, crop-specific land cover data for the continental Uni...

46. [Download Data & Maps from The National Map - USGS.gov](https://www.usgs.gov/tools/download-data-maps-national-map) - The National Map Downloader is the primary search and download application for USGS topographic maps...

47. [Sea Level Rise Viewer Data Download](https://coast.noaa.gov/slrdata/) - This page provides links to download data associated with the NOAA Office for Coastal Management's (...

48. [Sea Level Rise Viewer - NOAA Office for Coastal Management](https://coast.noaa.gov/digitalcoast/tools/slr.html) - Use this web mapping tool to visualize community-level impacts from coastal flooding or sea level ri...

49. [Sea Level Rise - Map Viewer | NOAA Climate.gov](https://www.climate.gov/maps-data/dataset/sea-level-rise-map-viewer) - NOAA's Sea Level Rise map viewer gives users a way to visualize community-level impacts from coastal...

50. [dc_slr/slr_3ft (MapServer) - NOAA Office for Coastal Management](https://www.coast.noaa.gov/arcgis/rest/services/dc_slr/slr_3ft/MapServer) - The purpose of the mapping viewer is to provide coastal managers and scientists with a preliminary l...

51. [EPA Removes EJScreen from Its Website](https://envirodatagov.org/epa-removes-ejscreen-from-its-website/) - On February 5th, EPA removed from its website the environmental justice mapping and screening tool, ...

52. [U.S. EPA Announces Fourth Update to Environmental Justice ...](https://environmentalhealthsafetybrief.sidley.com/2024/07/12/u-s-epa-announces-fourth-update-to-environmental-justice-mapping-tool-ejscreen-2-3/) - EPA's first update to the tool, in February 2022, EJSCREEN 2.0, added new indicators including an en...

53. [Environmental Protection Agency (EPA), Environmental Justice ...](https://www.policymap.com/data/sources/environmental-protection-agency-epa-environmental-justice-screening-and-mapping-tool-ejscreen) - Description: EPA EJScreen is EPA's environmental justice mapping and screening tool that provides EP...

54. [EPA Removed EJ Screen from Its Website](https://eelp.law.harvard.edu/tracker/epa-added-environmental-health-indicators-to-ejscreen/) - In July 2024, EPA released EJSCREEN 2.3, which added data on nitrogen dioxide levels, drinking water...

55. [Overpass API - OpenStreetMap Wiki](https://wiki.openstreetmap.org/wiki/Overpass_API) - Overpass API ; License: GNU AGPL v3 (free of charge) ; Status: Active ; Version: 0.7.62.4 (2024-11-2...

56. [About the National Zoning Atlas](https://www.zoningatlas.org/about) - The NZA team is digitizing, demystifying, and democratizing information about zoning conditions in m...

57. [Land Use Reform Tracker - NYU Furman Center](https://www.furmancenter.org/data-tool/land-use-reform-tracker/) - The Land Use Reform Tracker is a resource designed to provide researchers, state lawmakers, city off...

58. [CoreData.nyc - NYU Furman Center](https://app.coredata.nyc) - An online application that provides direct access New York City data compiled by the NYU Furman Cent...

59. [[PDF] The Wharton Residential Land Use Regulatory Index Joseph](https://realestate.wharton.upenn.edu/wp-content/uploads/2017/03/558.pdf) - The responses from a nationwide survey of residential land use regulation in over. 2,600 communities...

60. [Housing Prices and Land Use Regulations: A Study of 250 Major US ...](https://www.anserpress.org/journal/jea/3/1/45/html) - This study examines the impact of land use regulations on housing prices from 1989 to 2006 in an unu...

61. [[PDF] Economic Impact of Land Use Regulations](https://schoolstatefinance.org/resource-assets/Economic-Impact-of-Land-Use-Regulations.pdf) - The Wharton Residential Land Use Regulation Index, published by the Samuel. Zell and Robert Lurie Re...

62. [Land Use Regulations and Housing Affordability in Northern Virginia](https://www.mercatus.org/research/policy-briefs/land-use-regulations-and-housing-affordability-northern-virginia-national) - The National Zoning Atlas catalogs the local zoning rules that affect housing construction and affor...

63. [Comparing ADU Permitting Time Inside and Outside the Coastal Zone](https://ternercenter.berkeley.edu/blog/adus-coastal-zone/) - In Los Angeles, ADU applications in the Coastal Zone took an average of 260 days to be permitted, co...

64. [The Land Entitlement Process Step-By-Step - GatherGov](https://gathergov.com/articles/land-entitlement-guide) - Research from the Terner Center for Housing Innovation at UC Berkeley looked at housing permitting d...

65. [Building Permits Survey (BPS) - Census Bureau](https://www.census.gov/permits) - Annual data for 2025 was released on May 14, 2026. Data Visualizations. Explore building permits dat...

66. [Primary Land Use Tax Lot Output (PLUTO) - NYC Open Data -](https://data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks) - Extensive land use and geographic data at the tax lot level in comma-separated values (CSV) file for...

67. [NYCPlanning/labs-zola: NYC Planning's Zoning and Land Use App](https://github.com/NYCPlanning/labs-zola) - ZoLa provides a simple way to research zoning regulations and other information relevant to planners...

68. [ZoLa | NYC's Zoning & Land Use Map](https://zola.planning.nyc.gov) - ZoLa provides a simple way to research zoning regulations. Find the zoning for your property, discov...

69. [Zoning Search - Los Angeles City Planning](https://planning.lacity.gov/zoning/zoning-search) - The Zone Information and Map Access System (ZIMAS) is a web-based mapping tool that provides zoning ...

70. [Open Data | Los Angeles City Planning](https://planning.lacity.gov/resources/open-data) - The City of Los Angeles has two sites dedicated to sharing real-time data: the Open Data Portal and ...

71. [City of Chicago - Zoning - Catalog - Data.gov](https://catalog.data.gov/dataset/zoning-9b6a4?from_hint=eyJxIjoiem9uaW5nIn0%3D) - Data is based on the Chicago Zoning Ordinance and Land Use Ordinance http://bit.ly/9eqawi. Zoning Ty...

72. [Boundaries - Zoning Districts (current) | Socrata API Foundry](https://dev.socrata.com/foundry/data.cityofchicago.org/dj47-wfun) - Zoning district boundaries by type and classification.Chicago is divided into zoning districts that ...

73. [API - Start page - Chicago Cityscape](https://help.chicagocityscape.com/api) - The Zoning API returns zoning standards and regulations for a given Chicago zoning classification, i...

74. [sdc_public/Zoning (MapServer) - City of Dallas GIS Data Hub](https://gis.dallascityhall.com/arcgis/rest/services/sdc_public/Zoning/MapServer) - ArcGIS REST Services Directory, Login | Get Token · Home > services ... Demolition Delay Overlay (19...

75. [Dallas Zoning - ArcGIS Hub](https://hub.arcgis.com/maps/647e8235fe18438d93012b58d910497c) - Public service for Zoning data. The web layer contains Zoning Information for City of Dallas. Data i...

76. [Public/Zoning (MapServer) - City of Phoenix](https://maps.phoenix.gov/pub/rest/services/Public/Zoning/MapServer) - Description: The City of Phoenix (COP) zoning boundaries were digitized from a hard copy data set, b...

77. [Dataset - City of Phoenix Open Data](https://www.phoenixopendata.com/dataset/?res_format=ArcGIS+GeoServices+REST+API&groups=mapping&tags=City+of+Phoenix&tags=PDZ) - Proposed Zoning data is intended to better inform residents of current rezoning activities in their ...

78. [City of Miami's Developer Portal](https://www.miami.gov/Developer) - Datasets and API Endpoints. Our geospatial (GIS) datasets are available via two main APIs on our pub...

79. [City of Miami Open Data GIS](https://datahub-miamigis.opendata.arcgis.com) - This is the City of Miami's public platform for exploring and downloading open GIS data, discovering...

80. [Miami-Dade County Open Data Hub](https://gis-mdc.opendata.arcgis.com) - Miami-Dade County's Open Data Hub promotes access to the county's publicly available data, allowing ...

81. [Community Development District | Open Data Hub Site](https://gis-mdc.opendata.arcgis.com/datasets/community-development-district/api) - A polygon feature class of the Community Development District (CDD) boundaries maintained by the Mia...

82. [Current Land Use Zoning Detail | Seattle GeoData](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::current-land-use-zoning-detail/about) - A generalized version of the City of Seattle's land use zoning symbolized at the zoning group level ...

83. [Land Use Zoning | City of Seattle Open Data portal](https://data.seattle.gov/dataset/Land-Use-Zoning/vckc-k5ef) - These layers are used as part of the City of Seattle Zoned Development Capacity Model 2016. Includes...

84. [District of Columbia - Open Data DC](http://catalog.data.gov/dataset/open-data-dc) - On this site the District of Columbia government shares opportunities to explore hundreds of dataset...

85. [DC's New MAR 2 API for Application Developers - GovDelivery](https://content.govdelivery.com/accounts/DCWASH/bulletins/2f592c0) - The new MAR 2 API is packed with more enhancements including security features, usage tracking and b...

86. [San Francisco Housing Dashboard | SF Planning](https://sfplanning.org/san-francisco-housing-dashboard) - The Housing Dashboard offers a comprehensive look at housing production in San Francisco, showcasing...

87. [Developers - SF OpenData | DataSF](https://data.sfgov.org/developers) - Every dataset, map, chart, and filtered view has an API! To find it, click the Export button and sel...

88. [City of Boston Zoning Viewer for Urban Planning - Blue Raster](https://blueraster.com/stories/boston-zoning-viewer/) - View planning and zoning information for properties across the City of Boston with the Boston Redeve...

89. [Zoning Board of Appeal Tracker - Dataset - Analyze Boston](https://data.boston.gov/dataset/zoning-board-of-appeal-tracker) - This tracker is designed for members of the public and City of Boston employees to be able to quickl...

90. [How to Check a Building's Zoning Designation | Boston.gov](https://www.boston.gov/departments/inspectional-services/how-check-buildings-zoning-designation) - Open the Zoning Viewer. You'll see a map of Boston. · Type an address or parcel ID number into the s...

91. [Developer Portal | Bostonplans.org](http://www.bostonplans.org/projects/developer-portal) - Developers and team members can regularly access the portal to add new materials and update project ...

92. [City of Atlanta - Department of City Planning GIS - Open Data Hub](https://dpcd-coaplangis.opendata.arcgis.com/search) - To download all of the zoning districts in the City of Atlanta, please use the Zoning Districts for ...

93. [atlanta department of city planning gis](https://gis.atlantaga.gov) - OPEN DATA HUB. Browse our open data hub to find relevant data to serve your needs. Our data are cate...

94. [Interactive Data & Mapping Tools - Atlanta Regional Commission](https://atlantaregional.org/what-we-do/research-and-innovation/interactive-data-mapping-tools/) - Open Data and Mapping Hub. ARC's Open Data and Mapping Hub offers data accessibility and exploration...

95. [ARC Open Data & Mapping Hub - Atlanta Regional Commission](https://opendata.atlantaregional.com) - ARC's Open Data and Mapping Hub offers data accessibility and exploration while showcasing web maps,...

96. [City of Austin Open Data Portal](https://data.austintexas.gov) - Austin's Open Data portal is a public data-sharing site for residents, community members and anyone ...

97. [[PDF] City of Portland Terms of Use for Open Data](https://www.portlandmaps.com/bps/arpa/tos.pdf) - The City, through the Corporate GIS Group ("CGIS"), is providing the infrastructure and technical su...

98. [PortlandMaps Help Guide: General Search Permit Information](https://www.portland.gov/ppd/portlandmaps-help-guides/portlandmaps-general-search) - Learn how to search by address and find data in the Permits & Zoning area of PortlandMaps (Portland ...

99. [PortlandMaps](https://www.portlandmaps.com) - The City of Portland, Oregon, provides PortlandMaps.com as a convenient way of accessing and providi...

100. [Denver County, Colorado Parcel GIS REST API - UrbanKit Studio](https://urbankitstudio.com/parcel-atlas/colorado/denver-county) - Public ArcGIS FeatureServer endpoint for Denver County parcel data. ... GIS department—many offer fr...

101. [Denver Open Data Catalog](https://opendata-geospatialdenver.hub.arcgis.com) - The City and County of Denver's Open Data Catalog provides public access to data created and maintai...

102. [Data and Maps - City and County of Denver](https://www.denvergov.org/Government/Data-and-Maps) - View various maps from our GIS team, including crime maps and zoning maps! Neighborhood Maps. Find D...

103. [Regional Data Catalog | Home page - Denver Regional Council of ...](https://data.drcog.org) - Open data for the Denver region · The Regional Data Catalog is a repository of open data managed by ...

104. [Land Use Reform Tracker - NYU Furman Center](https://www.furmancenter.org/land-use-reform-tracker/) - Data Tool. Mapping State Land Use Reforms. The Land Use Reform Tracker provides the analysis and res...

105. [EPA Environmental Justice Screening Tool (EJ Screen) data, 2015 ...](https://zenodo.org/records/14767363) - EJScreen is EPA's environmental justice mapping and screening tool that provides EPA with a national...

106. [A housing shortage in the U.S. is leading to zoning changes - NPR](https://www.npr.org/2024/02/17/1229867031/housing-shortage-zoning-reform-cities) - Researchers at the University of California, Berkeley built a zoning reform tracker and identified z...

107. [Regrid Parcel API and Tiles: U.S. and Canadian Coverage](https://regrid.com/api) - Use the Regrid Parcel & Tiles API to present nationwide property boundaries, & look up the freshest ...

108. [Regrid: Parcel Data for the U.S. & Canada](https://regrid.com) - Regrid offers authoritative parcel data with boundaries across the U.S. and Canada. Access governmen...

109. [ArcGIS Server Services Directory REST API - Esri Developer](https://developers.arcgis.com/rest/services-reference/enterprise/get-started-with-the-services-directory/) - This topic introduces users to the ArcGIS Server Services Directory and how to navigate and utilize ...

110. [Curated list of ~3,500 government ArcGIS server addresses : r/gis](https://www.reddit.com/r/gis/comments/s65vxz/curated_list_of_3500_government_arcgis_server/) - All agency data managers are required to create FGDC metadata, which these days, includes REST endpo...

