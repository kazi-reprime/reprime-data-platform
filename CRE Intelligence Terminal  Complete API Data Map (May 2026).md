# CRE Intelligence Terminal: Complete API Data Map (May 2026)

## Executive Summary

This report maps every commercially relevant property data API discoverable through RapidAPI and direct-vendor channels as of May 2026. It covers 50+ APIs across six categories — property records, valuation/comps, rent/lease, distress/foreclosure, demographics/risk, and rates/FX — with pricing, free-tier limits, and CRE underwriter relevance scores. The short answer: **free tiers are real but thin**; getting NOI-grade data (ownership chains, rent comps, sale comps, tax history) almost always requires a paid plan starting at $29–$99/month. The exceptions are the US Census Bureau, FEMA NFHL, and Microsoft Building Footprints — all genuinely free with serious data depth.

***

## Part 1 · RapidAPI Marketplace — CRE-Relevant Listings

### Category A: Property Records

| API Name | RapidAPI URL | Free Tier | Paid Tier (Start) | Property-Level CRE Data? | Live Tile / Ticker | Notes |
|---|---|---|---|---|---|---|
| **US Real Estate** (DataScraper) | rapidapi.com/datascraper/api/us-real-estate | 300 req/mo[^1] | $9/mo (5,000 req)[^1] | Y — address search, listing type, square footage, lot size, owner, estimates, schools, noise score, commute time[^1] | Property detail card, listing map pin | Updated ~daily; commercial + residential; best all-in-one on RapidAPI[^1] |
| **Realty in US** (Api Dojo) | rapidapi.com/apidojo/api/realty-in-us | ~100 req/mo (freemium) | ~$15/mo | Y — for-sale, for-rent, sold, agent data[^2] | Active listing tracker, price history sparkline | Mirrors Realtor.com data; deprecated endpoints; popularity 9.9[^3] |
| **Realtor** (s.mahmoud97 / realtor16) | rapidapi.com/s.mahmoud97/api/realtor16 | ~50 req/mo (freemium) | ~$10/mo | Y — homes for sale, agents, mortgages, property values[^4] | Search widget | Unofficial scraper of Realtor.com[^4] |
| **Realty Mole Property** | rapidapi.com/realtymole/api/realty-mole-property-api | 50 req/mo[^5] | ~$39/mo | Y — 140M+ records, owner details, sq ft, beds/baths, rent estimates, listings[^6] | Property snapshot tile | **Note: listed as deprecated on RapidAPI** — direct via RentCast preferred[^3] |
| **ATTOM Property** (RapidAPI listing) | rapidapi.com/attomdatasolutions/api/attom-property | 10 req/mo[^5] | $95/mo (direct)[^7] | Y — 158M+ properties, tax, deed, mortgage, foreclosure, AVM, school, flood[^8] | Ownership & tax history tile | Free tier too small for production; go direct[^9] |
| **Realtor Search** (ntd119) | rapidapi.com/ntd119/api/realtor-search | ~50 req/mo | ~$10/mo | Partial — residential focus[^10] | Listing search bar | Less complete than Api Dojo version |
| **Real Estate USA** (com.realtor.api) | rapidapi.com/com.realtor.api/api/real-estate-usa | 500,000 req/mo (free)[^11] | Free only | Partial — listing data without deep ownership/tax[^11] | Public search layer | Very generous free tier but limited fields |
| **Realtor Api Data** (nusantaracodedotcom) | rapidapi.com/nusantaracodedotcom/api/realtor-api-data | ~50 req/mo | ~$10/mo | Partial — sold listings, market trends[^12] | Recent sales ticker | Thin data depth |

***

### Category B: Valuation & Comps

| API Name | RapidAPI URL | Free Tier | Paid Tier (Start) | Property-Level CRE Data? | Live Tile / Ticker | Notes |
|---|---|---|---|---|---|---|
| **Mashvisor** (Airbnb Rates & RE Analysis) | rapidapi.com/mashvisor-team/api/mashvisor | Free trial (limited) | $129/mo (direct)[^13] | Y — cap rate, cash-on-cash return, NOI, Airbnb occupancy, price estimate, rental income, neighborhood analytics[^14] | Cap rate tile, COC return widget, neighborhood heatmap | One of few RapidAPI APIs that surfaces cap rate and NOI directly[^3] |
| **Realty Mole — Rent Estimate** | rapidapi.com/moneals/api/rent-estimate | 50 req/mo[^5] | ~$39/mo | Partial — rent estimate only[^5] | Rent estimate widget | Deprecated; see RentCast direct[^3] |
| **Real Estate Valuation Purchase** | rapidapi.com/ehlersanalytics/api/real-estate-valuation-purchase | Freemium | ~$15/mo | Partial — AVM/purchase valuation[^3] | AVM ticker | Niche; limited coverage |
| **APIllow** (Zillow-sourced AVM) | Not on RapidAPI — direct: apillow.co | 50 req/mo free[^7] | $9.99/mo (3,333 req)[^7] | Partial — Zestimate, price history, tax records, schools, comps[^7] | Zestimate + price history chart | Only source for Zestimates outside Bridge Interactive; no ownership data[^7] |
| **IdealSpot GeoData** | rapidapi.com/idealspot-inc/api/idealspot-geodata | Freemium (limited) | ~$99/mo+ | Y — hyperlocal demographics, housing, spending, labor, vehicle traffic, OZ polygons, census tract, block group[^3] | Neighborhood heatmap, traffic count tile | Explicitly used for CRE and retail site selection[^3] |

***

### Category C: Rent & Lease

| API Name | RapidAPI URL | Free Tier | Paid Tier (Start) | Property-Level CRE Data? | Live Tile / Ticker | Notes |
|---|---|---|---|---|---|---|
| **Rent Estimate** (Realty Mole / RentCast) | rapidapi.com/moneals/api/rent-estimate | 50 req/mo[^5] | ~$29/mo (direct) | Y — address-level rent estimate + comparable rentals[^5] | Rent estimate widget | Deprecated on RapidAPI; use RentCast direct API[^15] |
| **Mashvisor** | (see above) | — | $129/mo | Y — rent comps, occupancy, LTR + STR income[^14] | LTR/STR income split tile | — |
| **RedLine Zipcode** | rapidapi.com/redline/api/redline-zipcode | Freemium | ~$10/mo | Partial — ZIP-to-city/state, distance, radius (geographic scaffold for rent searches) | ZIP radius filter | Pairs with rent/comp APIs[^3] |

***

### Category D: Distress & Foreclosure

| API Name | RapidAPI URL / Source | Free Tier | Paid Tier (Start) | Property-Level CRE Data? | Live Tile / Ticker | Notes |
|---|---|---|---|---|---|---|
| **ATTOM Property** | (see above) | 10 req/mo | $95/mo | Y — foreclosure status, pre-foreclosure, REO, lis pendens[^8] | Distress flag overlay | Best foreclosure coverage on RapidAPI[^8] |
| **PropStream** (direct, not RapidAPI) | propstream.com | 7-day free trial[^16] | $99/mo (Essentials)[^17] | Y — pre-foreclosure, bankruptcy, tax liens, NOD, REO, distressed filters[^17] | Distress pipeline tracker | $199/mo Pro, $699/mo Elite[^17]; add-ons for skip trace, mail |
| **BatchData** (direct) | batchdata.io | Pay-as-you-go from $0.01/call[^18] | $1,000/mo (100K records)[^18] | Y — lien data, MLS add-on $600/mo, skip tracing, 155M properties[^18] | Owner distress dashboard | High minimums; suited for large-scale bulk |

***

### Category E: Demographics & Risk

| API Name | RapidAPI URL | Free Tier | Paid Tier (Start) | Property-Level CRE Data? | Live Tile / Ticker | Notes |
|---|---|---|---|---|---|---|
| **Walk Score** | rapidapi.com/theapiguy/api/walk-score | 5,000 req/day free[^5] | Premium (volume) | Partial — Walk Score, Transit Score, Bike Score[^19] | Walkability badge, location quality tile | One of the most generous free tiers in the ecosystem[^19] |
| **CrimeScore** (YourMapper) | rapidapi.com/yourmapper/api/crimescore | Freemium | ~$10/mo | Partial — crime score by location[^3] | Crime risk heatmap | Pairs well with Walk Score[^3] |
| **Crime Data** (jgentes) | rapidapi.com/jgentes/api/crime-data | Free (low score: 0.3)[^3] | — | Partial | Crime ticker | Low reliability score; use CrimeoMeter direct instead[^3] |
| **CrimeoMeter** (direct) | crimeometer.com | Freemium | Paid tiers | Partial — incident-level crime by location[^20] | Crime density overlay | More granular than RapidAPI options[^20] |
| **DoorProfit API** (direct) | api.doorprofit.com | Freemium | Paid tiers | Partial — crime stats, registered offenders, location safety score[^21] | Safety score tile | 900,000+ sex offenders nationwide[^21] |
| **IdealSpot GeoData** | (see above) | Freemium | ~$99/mo+ | Y — demographics, consumer segmentation, OZ, census tract, block group[^3] | Demographic donut charts, traffic counts | Best single demographic API on RapidAPI[^3] |
| **GeoDB Cities** (Michael Mogley) | rapidapi.com/wirefreethought/api/geodb-cities | Freemium | ~$10/mo | Partial — city/region/country data, populations[^3] | Metro selector, population ticker | Useful for market-level geography scaffolding[^3] |
| **Mortgage Payments** | rapidapi.com/shai.sachs/api/mortgage-payments | Freemium | ~$5/mo | Partial — PITI calculator[^3] | Mortgage payment calculator widget | Use as deal-level underwriting input[^3] |
| **Neighborhood Intelligence MCP** (Apify) | apify.com/andrew_avina/neighborhood-intelligence-mcp | Freemium | Paid credits | Partial — crime, walk score, rent growth, vacancy, gentrification, investor score by ZIP[^22] | ZIP investor score tile | MCP-native; integrates with Claude/GPT[^22] |

***

### Category F: Rates & FX (RapidAPI + Paired Sources)

| API Name | RapidAPI URL | Free Tier | Paid Tier (Start) | CRE Relevance | Live Tile / Ticker | Notes |
|---|---|---|---|---|---|---|
| **Mortgage Rate API** (API Ninjas) | api-ninjas.com/api/mortgagerate | Freemium | Paid tier | Y — daily 30-yr and 15-yr fixed mortgage rates[^23] | Mortgage rate ticker | Historical data going back decades[^23] |
| **Alpha Vantage** (direct) | alphavantage.co | 25 req/day free[^24] | $49.99/mo[^24] | Y — REIT price (e.g., VNQ, XLRE), Treasury yields, SOFR proxies, FX (USD/ILS)[^25] | REIT price ticker, yield curve tile | NASDAQ official vendor; free tier thin but functional[^25] |
| **NY Fed SOFR API** (direct, free) | newyorkfed.org/markets/reference-rates/sofr | **Unlimited, free**[^26] | — | Y — daily SOFR rate, 30/90/180-day averages[^26] | SOFR rate live tile | Official source; critical for floating-rate CRE debt[^26] |
| **Polygon.io** (direct) | polygon.io | 5 req/min free[^24] | $199/mo[^24] | Y — REIT stock prices, ETFs (VNQ, XLRE, IYR), Treasury ETFs[^24] | REIT ETF sparklines | Best for real-time equity/REIT data[^24] |
| **US Treasury Yield API** (direct via FRED) | fred.stlouisfed.org/docs/api/fred | **Free with key** | — | Y — 10-yr, 5-yr, 2-yr Treasury yields; SOFR; CPI; Fed Funds[^27] | Yield curve tile, cap rate spread | Free, unlimited with registration; primary macro data source |
| **CurrencyFreaks / Fixer.io** (direct) | currencyfreaks.com | Freemium | Paid tier | Partial — USD/ILS and 150+ FX rates[^28] | USD/ILS live tile | Relevant if your portfolio has Israeli capital partners[^28] |
| **Mortgage APIs** (RapidAPI collection) | rapidapi.com/collection/mortgage-api | Varies | Varies | Partial — mortgage payment calculators, rate data[^29] | Rate calculator widget | Multiple vendors; quality varies[^29] |

***

## Part 2 · Direct-Vendor APIs (Beyond RapidAPI)

| Vendor | Pricing URL | Cheapest CRE-Grade Plan | Key Fields | Free Option |
|---|---|---|---|---|
| **RentCast** | rentcast.io/api | Free: 2 req/mo; Starter $29/mo (100 req); Growth $99/mo (500 req); Pro $199/mo (2,000 req)[^30] | 140M+ property records, owner info, AVM, rent estimates, comps, listings, market trends (ZIP level)[^6] | Yes — 2 req/mo free, 50 req/mo developer tier[^15] |
| **ATTOM Data** | api.developer.attomdata.com | $95/mo (5,000 calls, ~$0.019/call)[^7]; 30-day free trial[^9] | 158M+ properties, tax, deed, mortgage, AVM, foreclosure, flood, school, neighborhood[^31] | 30-day trial only[^9] |
| **Estated (now ATTOM)** | estated.com → redirects to ATTOM | Merged with ATTOM 2024–2025[^31] | Property characteristics from county assessor; $0.10/call was legacy pricing[^7] | Trial only |
| **Realie** | realie.ai/pricing | Free: 25 calls/mo; Tier 1: $50/mo (1,250 calls); Tier 2: $150/mo (6,000); Tier 3: $350/mo (30,000 calls)[^32] | Property, ownership, mortgage, parcel, zoning data; AI-collected from 3,100+ counties[^33] | Yes — 25 free calls/mo[^34] |
| **RealEstateAPI (REAPI)** | realestateapi.com | $599/mo Starter (30,000 records)[^35]; 159M parcels, 3,100+ counties[^35] | Comps, building/lot/owner criteria, mortgage/tax info, property intelligence[^36] | No free tier — demo only[^35] |
| **BatchData** | batchdata.io | $1,000/mo (100K records) or PAYG $0.01/call[^18] | 155M properties, ownership, liens, skip tracing, MLS add-on ($600/mo), building permits add-on ($1,250/mo)[^18] | PAYG from $0.01; no free monthly tier[^18] |
| **PropertyRadar** | propertyradar.com | $600/mo for API access[^37] | Hyperlocal property/owner data, marketed lists, CRE filters | Platform plans from $49/mo but API is $600/mo[^37] |
| **Reonomy** | reonomy.com | $299+/mo (annual contract)[^38]; enterprise tiers | 54M+ commercial properties, LLC ownership piercing, transaction history, verified owner contacts[^39] | Trial on request only[^39] |
| **MSCI Real Capital Analytics (RCA)** | msci.com/real-estate/real-capital-analytics | Enterprise-only; negotiated subscription (est. $10K–$50K+/yr)[^40] | Global CRE transaction comps, CMBS, cap rate indices, deal-level analytics[^41] | Data Integration API requires subscription[^42] |
| **Trepp / TreppWeb Services** | trepp.com/trepp-web-services | Enterprise pricing; no public tiers[^43] | CMBS deal library, loan-level analytics, cashflow projections, delinquency data[^44] | Free CMBS delinquency reports only (not API)[^45] |
| **CoreLogic Discovery Platform** | corelogic.com | Enterprise; Snowflake/S3 delivery; no public pricing[^46] | 150M+ properties, mortgage/archival focus, AVM, neighborhood analytics[^47] | Trials via sales team only[^48] |
| **HelloData** (acquired by Grace Hill) | hellodata.ai | No public pricing — contact sales[^49] | 35M multifamily units, unit-level rent comps, concessions, expense benchmarks, deal underwriting[^49] | Demo only[^49] |
| **Regrid** (Parcel API) | regrid.com/api | $500–$2,000/mo (API subscription)[^50]; $0.10/record (Standard) or $0.15 (Premium)[^51] | 157M+ parcels, property boundaries, ownership, tax assessments, zoning, building footprints overlay[^52] | 30-day free trial[^50] |

***

## Part 3 · Free & Near-Free Alternatives (Not on RapidAPI)

These sources replace expensive APIs for specific data layers and power the static/reference layers of a CRE dashboard at zero cost.

| Source | URL | Format | License | What RapidAPI API It Replaces |
|---|---|---|---|---|
| **US Census Bureau API (ACS/Decennial)** | census.gov/data/developers | JSON, CSV[^53] | Public domain; free with key[^27] | IdealSpot GeoData (demographics), GeoDB Cities (population) — covers race, income, housing tenure, commute, poverty by tract/ZIP[^54] |
| **FEMA NFHL (Flood Hazard Layer)** | hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer | ArcGIS REST, WMS, WFS, GeoJSON[^55] | Public domain; free[^55] | All paid flood risk API overlays (LightBox, CoreLogic climate) — 90%+ US population covered[^55] |
| **Microsoft US Building Footprints** | github.com/microsoft/USBuildingFootprints | GeoJSON by state[^56] | ODbL (Open Database License)[^56] | Regrid building footprint add-on; paid structure databases — 129.5M computer-generated footprints, all 50 states[^56] |
| **OpenStreetMap + Overpass API** | openstreetmap.org / overpass-api.de | OSM XML, GeoJSON[^57] | ODbL[^57] | Google Maps/Geocoding API for basic address/building queries — global coverage, free for bulk use |
| **HUD USPS ZIP Crosswalk API** | huduser.gov/portal/dataset/uspszip-api.html | JSON[^58] | Public domain; free[^58] | RedLine Zipcode API — ZIP-to-census-tract crosswalk, vacancy data, address counts[^58] |
| **FRED API (Federal Reserve)** | fred.stlouisfed.org/docs/api/fred | JSON[^27] | Public domain; free with key | Mortgage Rate API, any Treasury/SOFR ticker — 500K+ economic series including 10-yr yield, SOFR, CPI, HPI[^27] |
| **EPA Envirofacts API** | epa.gov/enviro/envirofacts-data-service-api | REST/JSON | Public domain; free | Environmental risk overlays — brownfield, Superfund, TRI emissions, toxics near any address |
| **HUD Opportunity Zones Layer** | hud.gov/opportunity-zones | GeoJSON/Shapefiles[^59] | Public domain; free[^59] | Any paid OZ overlay — 8,764 designated OZ tracts (OZ 1.0 through 2028; OZ 2.0 mapping begins 2026)[^59] |
| **County Assessor Portals (bulk)** | Varies by county; aggregated at data.gov | CSV, shapefile | Public records | ATTOM/CoreLogic for basic ownership/tax data — Iowa counties: beacon.schneidercorp.com; most Midwest counties have free GIS download |
| **TIGER/Line Shapefiles (Census)** | census.gov/geographies/mapping-files/time-series/geo/tiger-line-file | Shapefile, GDB[^53] | Public domain; free | Parcel boundary APIs (Regrid, etc.) for political/census boundary layers — roads, county lines, census tracts, block groups |

***

## Part 4 · The Master Table by Category

### 🏢 Property Records

| API Name | URL | Free/mo | Paid Start | CRE Data Y/N | Tile It Powers |
|---|---|---|---|---|---|
| US Real Estate (DataScraper) | rapidapi.com/datascraper/api/us-real-estate | 300[^1] | $9 | Y | Property card, ownership tile[^1] |
| Realty in US (Api Dojo) | rapidapi.com/apidojo/api/realty-in-us | ~100 | $15 | Y | Listing map, MLS feed[^2] |
| ATTOM Property | rapidapi.com/attomdatasolutions/api/attom-property | 10[^5] | $95[^7] | Y | Tax/deed history tile[^8] |
| RentCast (direct) | rentcast.io/api | 2–50[^30] | $29[^30] | Y | Property record lookup[^6] |
| Realie (direct) | realie.ai | 25[^32] | $50[^34] | Y | Parcel/ownership/zoning card[^33] |
| Regrid Parcel API | regrid.com/api | Trial only[^50] | $500[^50] | Y | Parcel boundary map[^52] |
| REAPI | realestateapi.com | None[^35] | $599[^35] | Y | Bulk property records[^36] |
| BatchData | batchdata.io | PAYG[^18] | $1,000[^18] | Y | Owner/lien enrichment[^46] |

### 💰 Valuation & Comps

| API Name | URL | Free/mo | Paid Start | CRE Data Y/N | Tile It Powers |
|---|---|---|---|---|---|
| Mashvisor | rapidapi.com/mashvisor-team/api/mashvisor | Trial | $129[^13] | Y (cap rate, NOI, comps) | Cap rate tile, COC widget[^14] |
| APIllow (Zillow AVM) | apillow.co | 50[^7] | $9.99[^7] | Partial (Zestimate) | AVM ticker[^7] |
| ATTOM AVM | api.developer.attomdata.com | Trial[^9] | $95[^7] | Y | AVM + comps panel[^8] |
| RentCast AVM + Comps | rentcast.io/api | 2–50[^30] | $29[^30] | Y | Valuation + comps carousel[^6] |
| Reonomy (direct) | reonomy.com | Trial[^39] | $299+[^38] | Y (CRE only) | Commercial deal comps[^60] |
| MSCI RCA | msci.com/real-estate | None[^40] | Enterprise | Y | CRE transaction comps[^41] |

### 🏘 Rent & Lease

| API Name | URL | Free/mo | Paid Start | CRE Data Y/N | Tile It Powers |
|---|---|---|---|---|---|
| RentCast Rent Estimate | rentcast.io/api | 2–50[^30] | $29[^30] | Y | Rent estimate widget[^6] |
| Mashvisor | (see above) | Trial | $129[^13] | Y | LTR/STR rent projection[^14] |
| HelloData (direct) | hellodata.ai | Demo | Custom[^49] | Y (multifamily) | Unit-level rent comp table[^49] |
| Rent Estimate (RapidAPI) | rapidapi.com/moneals/api/rent-estimate | 50[^5] | ~$39 | Partial | Rent estimate widget[^5] |

### ⚠️ Distress & Foreclosure

| API Name | URL | Free/mo | Paid Start | CRE Data Y/N | Tile It Powers |
|---|---|---|---|---|---|
| ATTOM Property | rapidapi.com (see above) | 10[^5] | $95[^7] | Y — foreclosure/REO/lis pendens | Distress flag icon[^8] |
| PropStream (direct) | propstream.com | 7-day trial[^16] | $99[^17] | Y | Distressed property list[^17] |
| BatchData | batchdata.io | PAYG | $1,000[^18] | Y | Lien/distress enrichment[^18] |
| RentCast (pre-foreclosure limited) | rentcast.io/api | 2–50[^30] | $29[^30] | Partial | Owner flag[^6] |

### 📊 Demographics & Risk

| API Name | URL | Free/mo | Paid Start | CRE Data Y/N | Tile It Powers |
|---|---|---|---|---|---|
| US Census ACS API | census.gov/data | **Unlimited**[^27] | Free | Y | Demographics panel, income heatmap[^54] |
| IdealSpot GeoData | rapidapi.com (see above) | Limited | ~$99[^3] | Y | Traffic count, spending tile[^3] |
| Walk Score | rapidapi.com/theapiguy/api/walk-score | 5,000/day[^19] | Premium | Partial | Walkability badge[^19] |
| FEMA NFHL | hazards.fema.gov | **Unlimited**[^55] | Free | Y | Flood zone overlay[^55] |
| HUD OZ Layer | hud.gov/opportunity-zones | **Unlimited**[^59] | Free | Y | OZ designation flag[^59] |
| CrimeoMeter | crimeometer.com | Freemium[^20] | Paid | Partial | Crime risk badge[^20] |
| DoorProfit API | api.doorprofit.com | Freemium[^21] | Paid | Partial | Safety score tile[^21] |

### 📈 Rates & FX

| API Name | URL | Free/mo | Paid Start | CRE Data Y/N | Tile It Powers |
|---|---|---|---|---|---|
| NY Fed SOFR API | newyorkfed.org | **Unlimited**[^26] | Free | Y | SOFR live rate tile[^26] |
| FRED API | fred.stlouisfed.org | **Unlimited (free key)**[^27] | Free | Y | Yield curve, 10-yr Treasury, HPI[^27] |
| Alpha Vantage | alphavantage.co | 25 req/day[^24] | $49.99/mo[^24] | Y (REITs/FX) | REIT price ticker, USD/ILS rate[^25] |
| Polygon.io | polygon.io | 5 req/min[^24] | $199/mo[^24] | Y (REITs/ETFs) | VNQ/XLRE sparkline[^24] |
| Mortgage Rate API (API Ninjas) | api-ninjas.com | Freemium[^23] | Paid | Y | 30-yr fixed rate ticker[^23] |
| CurrencyFreaks / Fixer.io | currencyfreaks.com | Freemium[^28] | Paid | Partial | USD/ILS live FX tile[^28] |
| Trepp Web Services | trepp.com/trepp-web-services | None[^43] | Enterprise | Y (CMBS) | CMBS delinquency rate tile[^44] |

***

## Part 5 · The Underwriter Test: Free Tier Sufficiency

**Does the free tier cover what a CRE underwriter actually needs?** The core underwriter data requirements are: NOI/cap rate, rent comps, sale comps, ownership records, tax history, debt/lien data.

| Data Need | Best Free-Tier Option | Assessment |
|---|---|---|
| **Ownership records** | Realie (25/mo free)[^32]; Census/County assessors (unlimited)[^27] | Free tier barely adequate for spot checks; $50/mo Realie covers light production use |
| **Tax history** | ATTOM (10 free calls)[^5]; county assessor portals (free bulk download) | ATTOM free tier is too thin; county bulk is free but requires parsing |
| **Rent comps** | RentCast (2–50/mo free)[^30]; Mashvisor trial | Not production-ready for free; $29/mo RentCast Starter is minimum |
| **Sale comps** | US Real Estate RapidAPI (300/mo free)[^1]; RentCast ($29/mo)[^30] | 300 free calls is enough for a widget or small-batch lookup |
| **NOI / cap rate** | Mashvisor (trial only)[^13] | **Requires paid plan** — no public API returns NOI for free |
| **Debt / lien data** | BatchData (PAYG $0.01/call)[^18] | Free in theory (PAYG), but no monthly free tier |
| **Flood zone** | FEMA NFHL (unlimited free)[^55] | **Fully powered by free** |
| **Demographics** | Census ACS API (unlimited free)[^27] | **Fully powered by free** |
| **Walkability** | Walk Score (5,000/day free)[^19] | **Fully powered by free** |
| **SOFR / Treasury** | NY Fed + FRED (unlimited free)[^26] | **Fully powered by free** |

**Verdict:** The free tier can fully power a public-facing visual widget for flood risk, demographics, walkability, and rate data. For property records, ownership, rent comps, and sale comps — which are the core of a CRE intelligence terminal — a paid plan is required. The minimum viable paid stack is approximately **$29–$99/month** (RentCast Starter or Growth) layered on free government data.

***

## Part 6 · Top Recommendations

### (a) 5 Highest-Leverage Free APIs for a Public CRE Dashboard

1. **FRED API** — US Treasury yields (2/5/10yr), SOFR, CPI, FHFA HPI, vacancy rates — unlimited free with key → Powers a live rates tile and macro context panel[^27]
2. **US Census ACS API** — Income, population density, housing tenure, rent burden by ZIP, tract, county — unlimited free → Powers any demographic heatmap or neighborhood profile[^54]
3. **FEMA NFHL** — Flood zone (AE, VE, etc.) for every address in the US — unlimited free WFS/REST → Powers flood risk badge on every property card; kills the need for a $200/mo climate overlay[^55]
4. **Walk Score API** — Walk/Transit/Bike score for any US address — 5,000 req/day free → Powers a location quality tile; integrates in one GET call[^19]
5. **US Real Estate API (DataScraper on RapidAPI)** — 300 free calls/month returning address, lot size, sqft, owner name, listing type, price estimate → Powers a basic property lookup widget sufficient for a demo or public-facing prototype[^1]

### (b) 3 Best Paid APIs by Value-Per-Dollar for a 59-Day Launch

#1 — RentCast ($29–$99/mo)[^30]
The best dollar-for-dollar choice for a CRE terminal launch. Covers 140M+ properties including commercial; returns owner info, AVM, rent estimate, comps, listings, and ZIP-level market trends in a single REST call. The $99/mo Growth plan (500 calls) is enough to serve a dashboard with moderate traffic. No contract, month-to-month billing. The free Realty Mole RapidAPI listing is its deprecated predecessor — go direct.[^6][^61]

#2 — Realie ($50–$150/mo)[^34]
Most affordable path to parcel geometry + zoning + ownership + mortgage data across all 50 states. Tier 1 at $50/mo gives 1,250 calls — enough for small-batch underwriting lookups. Its AI-collected data from 3,100+ counties covers gaps that ATTOM misses in rural markets. Most competitors offering parcel geometry start at $350+/mo.[^33][^34]

#3 — ATTOM Data ($95/mo trial then custom)[^7]
The gold standard for data completeness — 158M+ properties, tax assessment, deed chain, foreclosure, mortgage, school, and flood data in a single API. Estated was acquired by ATTOM, so this is now the single entry point for that data set. The 30-day free trial is enough to validate integration before committing. At production volume the cost jumps to $10K+/month, so use it for enrichment, not primary data fabric, in a 59-day launch.[^8][^9][^62][^31]

### (c) Surprise APIs Worth Knowing

**IdealSpot GeoData** — This is the sleeper hit for CRE intelligence terminals. It returns hyperlocal vehicle traffic counts, consumer spending by category, labor market data, opportunity zone polygons, and commercial real estate market signals all in one API call, queryable by drive-time polygon rather than just address. It is positioned for retail site selection but is directly applicable to multifamily and industrial CRE underwriting. Most CRE developers don't search for "geodata" — they search "demographics" and miss it entirely.[^3][^63]

**NY Fed SOFR API** — Zero cost, zero signup friction, and official. Every floating-rate CRE loan in the US is now indexed to SOFR. A live SOFR tile on a CRE terminal (daily update, 30/90/180-day averages) takes one HTTP call and costs nothing. This is the single highest-leverage rate data point a CRE terminal can display, and it's free.[^26]

**FRED API (St. Louis Fed)** — 500,000+ economic time series, fully free. The data most CRE terminals pay Trepp or Bloomberg for — 10-year Treasury yield, FHFA House Price Index, commercial real estate price indexes, vacancy rates by property type, CMBS spreads (via FRED series) — is directly available here. For a 59-day launch on a budget, FRED replaces a significant portion of what institutional platforms charge five figures for.[^27]

***

## Data Gaps & Known Limitations

- **CMBS loan-level data** (Trepp, RCA) has no affordable API equivalent. Trepp Web Services requires an enterprise contract; RCA is negotiated institutional pricing. The closest free substitutes are FRED CMBS spread series and Trepp's free monthly delinquency reports (non-API PDF).[^40][^43]
- **CoStar** has no public API. Its data (lease comps, submarket vacancies, tenant info) remains behind a $1,200+/mo platform subscription with no developer access.
- **MLS / IDX data** requires RESO Web API compliance and an MLS data license. No public RapidAPI listing provides authentic, real-time IDX comps — the "Realtor" listings on RapidAPI are scrapers that can be rate-limited or shut down at any time.[^64]
- **Reonomy pricing** is opaque and requires a sales conversation; the $299/mo figure cited by some sources appears to be 2022 pricing — current enterprise pricing is significantly higher.[^65][^38]
- **Regrid API pricing** of $500–$2,000/mo is steep for a parcel-boundary layer; use county GIS bulk downloads (free) for static layers, or Realie ($50/mo) for live parcel queries.[^50][^34]

---

## References

1. [US Real Estate - RapidAPI](https://rapidapi.com/datascraper/api/us-real-estate) - US Real Estate & commercial property for sale & for rent, housing, apartments, home estimate value, ...

2. [Realty in US - RapidAPI](https://rapidapi.com/apidojo/api/realty-in-us) - This API helps to query properties for sale, rent, sold,etc... to create a real estate site/applicat...

3. [Top Real Estate APIs (MLS) - RapidAPI](https://rapidapi.com/collection/best-real-estate-apis) - Nationwide real estate API for properties details and analyzing Airbnb and traditional rental proper...

4. [Realtor - RapidAPI](https://rapidapi.com/s.mahmoud97/api/realtor16) - Search homes for sale, new construction homes, apartments, and houses for rent. See property values ...

5. [real estate APIs - RapidAPI](https://rapidapi.com/blog/best-real-estate-apis/) - API Marketplace.

6. [RentCast API - GitHub](https://github.com/RentCast) - Our real estate and property data API provides access to 140+ million property records, owner detail...

7. [Zillow API Pricing 2026: Complete Cost Comparison - APIllow](https://apillow.co/blog/zillow-api-pricing-comparison-2026) - Estated provides property characteristics from county assessor records. At $0.10 per API call, it's ...

8. [ATTOM API Documentation & Examples](https://api.developer.attomdata.com/home) - We have many different pricing options depending on what your needs are. If you are just getting sta...

9. [ATTOM Developer Guides & API Examples](https://api.developer.attomdata.com/docs/guides) - Attom offers a free 30-day trial with access to our API and you can sign up right here – https://api...

10. [Realtor Search - RapidAPI](https://rapidapi.com/ntd119/api/realtor-search) - API allows users to search and explore a wide range of residential properties, including houses, con...

11. [Real Estate USA - RapidAPI](https://rapidapi.com/com.realtor.api/api/real-estate-usa/pricing) - RapidAPI partners directly with API providers to give you no-fuss, transparent pricing. Basic. $0.00...

12. [Realtor Api Data - RapidAPI](https://rapidapi.com/nusantaracodedotcom/api/realtor-api-data) - Sold Listings: Analyze recently sold properties in any area. Understand market trends, pricing strat...

13. [Mashvisor API Pricing Explained: Real Use Cases](https://www.mashvisor.com/blog/mashvisor-api-pricing/) - Mashvisor offers flexible monthly and annual API plans starting at $129/month, with pricing based on...

14. [Airbnb Rates & Real Estate Analysis (Mashvisor®) - RapidAPI](https://rapidapi.com/mashvisor-team/api/mashvisor/details) - Mashvisor's API provides instant access to nationwide real estate data and investment analytics acro...

15. [New Feature: Introducing the RentCast Real Estate API](https://www.rentcast.io/blog/introducing-rentcast-real-estate-api) - Step 2: Pick an API Billing Plan. Our API pricing plans start with 50 free API calls per month to al...

16. [How You Can Use Real Estate Data to Warm Up Your Pipeline of ...](https://www.propstream.com/real-estate-agent-blog/how-you-can-use-real-estate-data-to-warm-up-your-pipeline-of-cold-leads-in-2026) - Refresh old leads. Uncover New Opportunities in 2026 With PropStream. Sign up for a free 7-day trial...

17. [PropStream Pricing: Worth It or Choose REsimpli?](https://resimpli.com/blog/propstream-pricing/) - PropStream Essentials Plan: $99/month or $81/month annually · PropStream Pro Plan: $199/month or $16...

18. [Real Estate Data API Pricing Compared - BatchData](https://batchdata.io/blog/real-estate-data-api-pricing-comparison-batchdata-competitors) - Property Data plans start at $1,000/month for 100,000 records and go up to $5,000/month for 750,000 ...

19. [Walk Score API for web and mobile developers](https://www.walkscore.com/professional/api.php) - Programmers can use the API to: Integrate Walk Score into your site; Add Walk Score to your property...

20. [Crime Data API | CrimeoMeter](https://www.crimeometer.com/crime-data-api) - The CrimeoMeter Crime Data API lets you request crime information including crime incidents for a sp...

21. [DoorProfit API - Crime Data, Registered Offenders & Location ...](https://api.doorprofit.com) - Crime Data API. Get detailed crime statistics, safety scores, and incident data for any US address. ...

22. [Neighborhood Intel by ZIP — Crime, Walk Score, Rent MCP - Apify](https://apify.com/andrew_avina/neighborhood-intelligence-mcp) - Crime index, walk score, 3-year rent growth, vacancy, gentrification trend, and Investor Score (1-10...

23. [Mortgage Rate API - API Ninjas](https://api-ninjas.com/api/mortgagerate) - Returns the daily 30-year and 15-year fixed-rate mortgage (FRM) data. If no parameters are set, the ...

24. [Financial Data APIs Compared: Polygon vs IEX Cloud vs Alpha ...](https://www.ksred.com/the-complete-guide-to-financial-data-apis-building-your-own-stock-market-data-pipeline-in-2025/) - The free tier is limited to 250 requests per day, but their paid plans are reasonable if you need fu...

25. [Alpha Vantage: Free Stock APIs in JSON & Excel](https://www.alphavantage.co) - Alpha Vantage offers free stock APIs in JSON and CSV formats for realtime and historical stock marke...

26. [Secured Overnight Financing Rate Data](https://www.newyorkfed.org/markets/reference-rates/sofr) - The Secured Overnight Financing Rate (SOFR) is a broad measure of the cost of borrowing cash overnig...

27. [Census API - Census Data - Library Guides at Brown University](https://libguides.brown.edu/census/api) - The Census Bureau publishes REST APIs for many datasets. Instead of interacting with a graphic inter...

28. [Best Financial API Picks for Real-Time Data in 2026 - CurrencyFreaks](https://currencyfreaks.com/blog/Best-Financial-API-Picks-For-Real-Time-Data-in-2026) - Compare 12 financial api providers for stocks, forex, crypto, and banking. See latency, coverage, an...

29. [Mortgage APIs - RapidAPI](https://rapidapi.com/collection/mortgage-api) - Are there free mortgage APIs? Many lending institutions offer access to their mortgage APIs at no co...

30. [RentCast Review 2026: What Short-Term Rental Investors Need to ...](https://www.bnbcalc.com/reviews/rentcast-review-2026) - RentCast's pricing is structured around API calls and subscription ... Starter — $29/month: 100 API ...

31. [Estated is now part of ATTOM Data](https://estated.com) - Estated is now ATTOM. ATTOM's Property Data API gives you instant access to one of the nation's most...

32. [Property Data API Pricing and Bulk Data Licensing - Realie](https://www.realie.ai/pricing) - Choose an API plan ; Free. $0 · 25 API calls / mo ; Tier 1. $50 · 1,250 API calls / mo ; Tier 2 · $1...

33. [Realie: Nationwide Property Data for API and Bulk Delivery](https://www.realie.ai) - Access property, ownership, mortgage, parcel, and zoning data through a fast API or bulk transfers. ...

34. [Most Affordable Property Data API | Realie from $50/month | 2025](https://www.realie.ai/info/most-affordable-property-data-api) - Realie delivers full national coverage and detailed parcel shapes starting with a free tier, followe...

35. [Do not use Real Estate API : r/RealEstateTechnology - Reddit](https://www.reddit.com/r/RealEstateTechnology/comments/1lttdba/do_not_use_real_estate_api/) - The Starter plan ($599+CC fees) gets you 30,000 property records monthly. Our system has 159M parcel...

36. [RealEstateAPI - LinkedIn](https://www.linkedin.com/company/realestateapi) - RealEstateAPI (REAPI) is a big data as a service platform. We empower our customers with access to p...

37. [PropertyRadar Api : r/RealEstateTechnology - Reddit](https://www.reddit.com/r/RealEstateTechnology/comments/1lcp3ws/propertyradar_api/) - PropertyRadar offers API access, but it's only available on their $600/month plan. My current tool a...

38. [How Much Does Reonomy Cost? Are There Cheaper Alternatives?](https://www.mashvisor.com/blog/reonomy-cost/) - However, some individuals report that the Reonomy pricing starts at $299 per month, requiring a year...

39. [Reonomy Web Application - Property Intelligence, Property Search ...](https://www.reonomy.com/solutions/web-application/) - Reonomy unlocks property ownership data for all commercial real estate properties across the United ...

40. [Real Capital Analytics Subscription? : r/CommercialRealEstate](https://www.reddit.com/r/CommercialRealEstate/comments/esvs9l/real_capital_analytics_subscription/) - Does anyone subscribe to RCA? I know their cale comp data is top notch but I know a subscription is ...

41. [Real Capital Analytics - MSCI](https://www.msci.com/data-and-analytics/real-estate/real-capital-analytics) - Transparent, proprietary intelligence across global private real estate markets connecting investors...

42. [[PDF] Integration API Instructions - Real Capital Analytics](https://app.rcanalytics.com/api/v1/di/GetDIInstructions) - Each user authorized for Data Integration access will receive a personal API Key. This key is unique...

43. [Access Trepp Cashflows in the Cloud | TreppWeb Services](https://www.trepp.com/trepp-web-services) - With a faster time-to-value and lower total cost of ownership, TreppWeb Services (TWS) expands acces...

44. [What is Trepp? - HelloData](https://www.hellodata.ai/help-articles/what-is-trepp) - CMBS Data: Trepp provides comprehensive data and analytics on CMBS, including performance metrics, c...

45. [Can Trepp Provide Valuable Market Data for CMBS Borrowers?](https://cmbs.loans/blog/can-trepp-can-provide-valuable-market-data-for-cmbs-borrowers/) - Trepp provides a variety of market data to CMBS borrowers, including individual property data, CMBS ...

46. [Property Enrichment API Bulk Delivery Comparison - BatchData](https://batchdata.io/blog/property-enrichment-api-bulk-data-delivery-comparison-2026) - By 2026, CoreLogic has introduced some modern delivery options, including bulk data access through t...

47. [CoreLogic launches Discovery Platform - Reinsurance News](https://www.reinsurancene.ws/corelogic-launches-discovery-platform/) - The Discovery Platform allows users to easily integrate their own business objectives and data with ...

48. [Discovery Platform by CoreLogic - Harbr Data](https://www.harbrdata.com/case-studies/discovery-platform-by-corelogic-optimizing-the-data-consumer-experience) - Quickly access data samples and trials to make informed purchasing decisions; Securely connect their...

49. [HelloData Overview (2026): Rental Market Analytics, Multifamily ...](https://blog.iq.dwellsy.com/hellodata-overview-2026-rental-market-analytics-multifamily-data-and-operational-insights/) - HelloData is a multifamily market analysis platform for property managers and investors. Pricing is ...

50. [Parcel API Program, Buildings Data, Opportunity Zones ... - Regrid](https://regrid.com/blog/novembernewsletter) - There is a 30 day free trial, no payment info required, and after that if you want to continue using...

51. [2023 - Regrid Parcel Data Price Change](https://regrid.com/blog/2023-parcel-data-price-change) - Nationwide Parcel Data - Standard Schema, $50,000, $8,000 ; Nationwide Parcel Data - Premium Schema,...

52. [Regrid - docs.up42.com](https://docs.up42.com/data/regrid) - Regrid offers parcel data across the USA that includes property boundaries, ownership details, land ...

53. [Available APIs](https://www.census.gov/data/developers/data-sets.html) - We plan on adding all of our publicly available data sets. Here you'll find which of our many data s...

54. [Census Data Profiles – Real Estate Research](https://wcrer.be.uw.edu/housing-market-data-toolkit/census-data/) - The ACS covers a broad range of topics about social, economic, demographic, and housing characterist...

55. [GIS Web Services for the FEMA National Flood Hazard Layer (NFHL)](https://hazards.fema.gov/femaportal/wps/portal/NFHLWMS) - FEMA provides access to the National Flood Hazard Layer (NFHL) through web mapping services. The NFH...

56. [microsoft/USBuildingFootprints: Computer generated building ...](https://github.com/microsoft/USBuildingFootprints) - This dataset contains 129,591,852 computer generated building footprints derived using our computer ...

57. [Global Google-Microsoft Open Buildings Dataset](https://gee-community-catalog.org/projects/global_buildings/) - This dataset consolidates Google's V3 Open Buildings and Microsoft's most recent Building Footprints...

58. [USPS ZIP Code Crosswalk Files - HUD User](https://www.huduser.gov/portal/datasets/usps_crosswalk.html) - Download USPS ZIP Code Crosswalk files and mapping resources for housing research, geographic analys...

59. [Opportunity Zones | HUD.gov / U.S. Department of Housing and ...](http://www.hud.gov/opportunity-zones) - Opportunity Zones are economically distressed communities, defined by individual census tract, nomin...

60. [Reonomy | Commercial Real Estate Data & Property Owner Lookup](https://www.reonomy.com) - The commercial real estate data platform that uncovers the real owners hidden behind shell LLCs acro...

61. [Affordable Property Data for Developers & AI Tools | RentCast](https://www.youtube.com/watch?v=NJUq_mwegig) - RentCast CEO Anton walks through the complete API platform - a developer ... Pricing: Free tier avai...

62. [What is the price of Attom data? : r/RealEstateTechnology - Reddit](https://www.reddit.com/r/RealEstateTechnology/comments/1b76bfz/what_is_the_price_of_attom_data/) - Overview of Attom data solutions. Details on Attom data API. Top tools for real estate lead generati...

63. [IdealSpot GeoData - Postman](https://documenter.getpostman.com/view/11237619/SzzrZaEs) - Use this API as your local economy microscope by querying IdealSpot hyperlocal market insight and ge...

64. [How to Access the ZillowAPI through RapidAPI | #209 (Zillow API #6)](https://www.youtube.com/watch?v=qjlOBMxd2is) - Looking to leverage Zillow data for your projects or applications? Look no further! In this tutorial...

65. [Reonomy Software Pricing, Alternatives & More 2026 | Capterra](https://www.capterra.com/p/208413/Reonomy/) - With the help of Capterra, learn about Reonomy Software - reviews, pricing plans, popular comparison...

