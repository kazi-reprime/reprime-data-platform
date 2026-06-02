# Insurance Shock Intelligence Stack: Complete Free & Freemium Data Source Map for US Property Insurance Risk (2024–2026)

**Prepared for:** RePrime Terminal — Tier 3 Risk Module (Property Insurance Insurability Score)  
**Audience:** Israeli family offices and institutional LPs investing in US CRE  
**Purpose:** Power live "Insurance Shock" alerts + county-level "Insurability Score" tiles  
**Date:** May 2026

***

## Executive Summary

Property insurance has structurally re-priced across the US, migrating from a 1–2% NOI line item to 5–15% in FL/CA/LA/TX coastal markets. The root cause is a simultaneous convergence of catastrophe-loss inflation, carrier insolvency waves (especially Florida admitted market), and climate-driven uninsurability. For a Tel Aviv principal evaluating US CRE, the intelligence gap is acute: standard underwriting models price insurance at trailing actuals, not forward rate-filing trajectories. This map provides every material free or freemium data source, organized by tier, with exact endpoints, auth requirements, update cadence, and the specific terminal tile each source powers.[^1][^2]

**Key structural facts to anchor the model:**
- Florida Citizens policy count peaked at ~1.4M, dropped to 987,650 by Nov 2024 as depopulation removed policies to private market — but private carriers now hold the rate-shock risk[^3]
- TWIA insures 276,220+ Texas coastal policies with over $117B in total exposure as of Q1 2025[^4]
- California FAIR Plan residential exposure grew from $160B to $558B between 2021–2025, with FAIR Plan policies up 123% since 2020[^5][^6]
- NOAA NCEI billion-dollar disaster database was retired in 2025; Climate Central now maintains updates[^7][^8]

***

## Section 1: NAIC Regulatory Data Sources

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile It Powers | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **NAIC SERFF Filing Access (SFA)** | `https://filingaccess.serff.com/sfa/home/` | Free (public read) | No programmatic API; manual search only | State (filing by state DOI) | Real-time as filed | HTML/PDF download; ZIP file of attachments | No auth; state DOI controls confidential flag | Filing type, carrier name, effective date, % rate change indicated vs filed, disposition, product type, SERFF tracking # | State DOI portals, IRFS FL, CDI WARFF | Rate Filing Trajectory tile; Carrier Rate Action Alert | Confidential filings hidden; no structured API — must scrape HTML or download ZIP. Covers filings from ~2014 forward in most states. Some carriers mark filings confidential.[^9][^10] |
| **NAIC Annual P&C Market Share Report** | `https://content.naic.org/sites/default/files/research-actuarial-property-casualty-market-share.pdf` | Free (PDF + CSV available) | Unlimited download | National; top 25 groups by state line | Annual (released ~March for prior year) | PDF; underlying CSV via InsData (paid) | No auth for PDF | Direct premiums written by company/group, market share %, line of business, 2024 total P&C DPW ~$1.06T[^11] | State DOI market share reports | Carrier Concentration Risk tile | Top 10 P&C insurers hold 51.40% market share in 2024[^11]. State-level breakdowns in paid InsData. Free PDF covers national top 25 only. |
| **NAIC Insurance Industry Snapshots & Analysis Reports** | `https://content.naic.org/industry/insurance-industry-snapshots-analysis-reports` | Free | Unlimited | National | Semi-annual | PDF | None | P&C loss ratios, combined ratios, surplus trends, premium growth by line, insolvency indicators | AM Best ratings, Demotech FSRs | Market Health Monitor tile | Covers ~99% of all US insurers via statutory filings[^12]. Download directly; no API. |
| **NAIC MCAS Data Dashboard** | `https://content.naic.org/mcas_data_dashboard.htm` | Free (aggregated) | Dashboard; CSV download at page bottom | State (51 jurisdictions) | Annual (data ~60 days post April 30 filing deadline)[^13] | CSV download; dashboard | None for dashboard | Non-renewal ratios, cancellation ratios, claim frequency/severity, complaint index by line and state | State DOI non-renewal bulletins | Non-Renewal Rate tile; Carrier Withdrawal Signal | **Highest-leverage underused source.** Homeowners and private flood lines included. Individual company-level data not public — only aggregate ratios. 51 jurisdictions in 2024 data year[^14]. |
| **NAIC Financial Data Repository (FDR)** | `https://content.naic.org/insurance-topics/financial-data-repository` | Free for regulators; paid for public via InsData | Via InsData subscription ($) | National; per-insurer | Annual + quarterly | Database | Regulator credential OR InsData paid | 10 years of quarterly/annual statutory financials: surplus, loss reserves, premium written/earned | NAIC Market Share PDF, AM Best | Carrier Solvency Stress tile | Public access via InsData at cost. Free alternative: NAIC IDRR and Snapshot reports.[^15] |
| **NAIC IDRR (Insurance Dept. Resources Report)** | `https://content.naic.org/sites/default/files/publication-sta-bb-volume-one.pdf` | Free | Unlimited | State | Annual | PDF (Vol. 1 + Vol. 2) | None | State DOI staff count, budget, premium data, exam count, enforcement actions | NAIC Snapshots | Regulatory Capacity tile | Volume 2 contains state-level P&C premium data useful for market sizing. 2022 edition is most recent publicly available[^16]. |

***

## Section 2: State DOI Rate-Filing Portals

### Priority Tier 1: Gulf/Coastal Crisis States

| Source Name | Exact URL / Endpoint | Free vs Freemium | Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Florida OIR IRFS Rate Filing Search** | `https://irfssearch.floir.gov` | Free | No API; manual search; 2,500 match max per query[^17] | State (FL only); ZIP-level data required monthly per HB1611 as of Jan 2025[^2] | Real-time as filed; 2001–present | HTML/PDF; ZIP download | None | File log #, company name, effective date, rate change %, product name, disposition, trade secret flags[^17] | SERFF SFA, Citizens policy count | Rate Filing Trajectory; Carrier Action Alert | **Critical unfair-advantage source.** FL OIR IRFS is separate from SERFF. HB1611 (2025) now requires monthly ZIP-code-level supplemental data from all FL admitted carriers[^2]. |
| **Florida OIR iPortal** | `https://floir.gov/iportal` | Free | Manual portal | State (FL) | Real-time | Web | Industry login required for filing submissions; public for viewing approved data | Company admissions, PIP contacts, data collection filings[^18] | IRFS | Company Admissions & Exit Tracker | iPortal = company-side submission system; IRFS = public search side. Distinct URLs. |
| **Florida Citizens Policy Count & Depopulation** | `https://www.citizensfla.com/` (search "policy count" or "depopulation") | Free | Unlimited | State; aggregate | Monthly | PDF / Press release | None | Policy count by line, depopulation assumptions count, assuming carrier names[^3] | FL OIR approvals, IRFS | Citizens Exposure tile; Depopulation Velocity tracker | Policy count hit 987,650 as of Nov 2024[^3]. Citizens rate filing history: +11% 2022, +12% 2023, +13% 2024, +14% proposed 2025[^1]. |
| **California CDI Rate Filing Search (WARFF)** | `https://www.insurance.ca.gov/0250-insurers/0800-rate-filings/` | Free | No API; manual WARFF search | State (CA); some ZIP | Real-time as filed | HTML/PDF via WARFF or SERFF | None | Prior approval filing status, rate change %, company name, effective date[^19] | CA market share report | Rate Filing Trajectory; CA Prior Approval Queue | CA is "prior approval" state — rate increases must be approved before taking effect. Queue backlog is the leading indicator of future rate shock. |
| **California CDI Market Share Reports** | `https://www.insurance.ca.gov/01-consumers/120-company/04-mrktshare/` | Free | Unlimited | State (CA); by line | Annual (5 years maintained) | PDF/CSV | None | DPW by company, market share % by line, Prop 103 data[^20] | NAIC Market Share | Carrier Concentration Risk (CA) | Post-LA fires 2025, watch for market share shifts in homeowners line. |
| **California FAIR Plan Key Statistics & Data** | `https://www.cfpnet.com/key-statistics-data/` + `https://www.cfpnet.com/about-fair-plan/` | Free | Unlimited | State; ZIP-level via CEPP research | Monthly/quarterly updates | Web; PDF Financial Reports | None | Policy count by type, exposure ($), member participation rates (2024–2026), financial reports[^21][^22] | CDI market share, CDI non-renewal data | FAIR Plan Exposure tile; Uninsurability Signal | Residential exposure grew from $160B to $558B (2021–2025)[^5]. ZIP-level mapping available via CEPP Substack research[^5]. |
| **California CDI Non-Renewal Bulletins & Moratorium Tracker** | `https://www.insurance.ca.gov/01-consumers/140-catastrophes/MandatoryOneYearMoratoriumNonRenewals.cfm` | Free | Unlimited | ZIP code level per fire perimeter | Event-driven (post-Governor emergency declaration) | Web/HTML; bulletin PDF | None | Moratorium ZIP codes, fire name, declaration date, moratorium period[^23] | CDI rate filings, InciWeb wildfire feeds | Non-Renewal Signal; CA Fire Exposure Map | SB 824 (2018) triggers 1-year moratorium post-wildfire emergency. Jan 2025 moratorium covers LA Palisades/Eaton fire ZIP codes[^24]. State Farm submitted a rate increase to CDI in June 2024[^25]. |
| **Louisiana LDI Rate Filing Search** | `https://www.ldi.la.gov/online-services/rate-filing-search` | Free | Manual portal | State (LA) | Real-time | Web | None | Rate filings by carrier, date, type[^26] | NAIC SERFF SFA | Rate Filing Trajectory (LA) | LDI issued Bulletin 2024-01 requiring quarterly non-renewal/cancellation data call from all P&C carriers[^27]. Contact: 3yruledata@ldi.la.gov |
| **Louisiana LDI Market Share Reports** | `https://ldi.la.gov` (Data Center section) | Free | Unlimited | State; by carrier | Annual | PDF/Web | None | Market share, premiums by carrier and line | NAIC Market Share | Carrier Concentration (LA) | LDI Data Center also hosts P&C Rate Filing Search Tool[^28]. |
| **Texas TDI SERFF / Rate Filing Search** | `https://www.tdi.texas.gov/company/serff/index.html` | Free | Manual; open records for confidential filings | State (TX) | Real-time | HTML/PDF via SERFF SFA | None | Rate change %, company name, effective date, confidentiality flag[^9] | NAIC SERFF SFA | Rate Filing Trajectory (TX) | TX uses SERFF SFA system; confidential filings require open records request to TDI. |
| **TWIA Exposure Reports & Annual Reports** | `https://www.twia.org/` + `https://www.tdi.texas.gov/submissions/indextwia.html` | Free | Unlimited | County (TX coastal counties) | Quarterly Fact Book; Annual Report | PDF | None | Policy count, exposure ($), PML by county, reinsurance budget, rate filing status[^29][^30][^31] | TDI rate filings | TWIA Exposure tile; Coastal TX NOI Risk | **Highest-leverage source for TX coastal CRE.** TWIA had $117.2B in exposure across 276,220 policies as of Q1 2025[^4]. Reinsurance budget up 22% to $485M for 2025[^32]. Q3 2025 Fact Book available at twia.org. |
| **Texas FAIR Plan (TFPA) Rate Filings** | `https://www.texasfairplan.org/news-and-announcements/` | Free | Unlimited | State (TX) | Per TDI approval | Web/PDF | None | Rate change % by product, TDI order, effective date[^33] | TDI SERFF | TX Non-Coastal Insurer-of-Last-Resort tile | TFPA Aug 2025 filing: Homeowners +9.3%, Dwelling Fire +25%, Dwelling EC +24.8%[^33]. |

### Priority Tier 2: Atlantic / Other Coastal States

| Source Name | Exact URL / Endpoint | Free vs Freemium | Rate Limit | Geographic Granularity | Update Freq | Data Format | Auth | Specific Fields | Cross-Verify | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **NC NCDOI + NCIUA/Beach Plan** | `https://www.ncdoi.gov/` ; `https://www.ncjua-nciua.org/` | Free | Unlimited | State; county/territory for beach vs inland | Annual/Per filing | Web/PDF | None | Rate filings via SERFF SFA; beach plan policy count and rate; wind/hail eligibility rules[^34][^35] | NAIC SERFF SFA | NC Coastal Wind Pool tile | NCIUA = Coastal Property Insurance Pool for 18 eligible coastal counties. Separate from NCDOI rate filings. Premiums: NC Coastal HO ~$69/unit vs national beach plan avg $173[^36]. |
| **SC SCDOI + SCWHUA** | `https://doi.sc.gov/` ; `https://www.scwind.com/` | Free | Unlimited | State; beach territory | Per filing / Annual | Web/PDF | None | MCAS data (doi.sc.gov MCAS page), SCWHUA rate and coverage rules[^37][^38] | NAIC MCAS | SC Wind/Hail Pool tile | SCWHUA covers wind/hail in designated coastal "Beach" territory only[^37]. |
| **Georgia GDOI (SERFF)** | `https://oci.georgia.gov/regulatory-filings/insurance-product-filings/serff` | Free | Manual | State | Real-time | HTML/PDF via SERFF[^10] | None | Rate filings, disposition, type of insurance, effective date | NAIC SERFF SFA | Rate Filing (GA) | GA DOI uses SERFF public access. Step-by-step search guide available at above URL[^10]. |
| **Alabama ALDOI + Beach Pool (SERFF)** | `https://aldoi.gov/RatesForms/SERFFsPublicAccess.aspx` | Free | Manual; filings marked eligible only | State | Real-time | HTML/PDF via SERFF[^39] | None | Rate/form filings eligible for public access | NAIC SERFF SFA | Rate Filing (AL) | AL Beach Pool (Alabama Insurance Underwriting Association — AIUA) separately at aiua.org. |
| **Mississippi MID + Wind Pool** | `https://www.mid.ms.gov/` | Free | Manual | State; coastal counties for wind pool | Per filing | Web/PDF | None | Rate filings via SERFF SFA; Mississippi Windstorm Underwriting Association (MWUA) data at mwua.net | NAIC SERFF SFA | Rate Filing (MS) | MWUA is the coastal wind insurer of last resort for 6 coastal counties. |
| **New York DFS + NYPIUA** | `https://www.dfs.ny.gov/` | Free | Manual | State | Per filing | Web/PDF | None | Rate filings, market data, NYPIUA (NY Property Insurance Underwriting Assoc.) exposure | NAIC SERFF SFA | Rate Filing (NY) | NY DFS publishes insurer exam results and market analyses. NYPIUA = FAIR Plan equivalent. |
| **New Jersey DOBI + NJPLIGA** | `https://www.njdobi.gov/` | Free | Manual | State | Per filing | Web/PDF | None | Rate filings, NJPLIGA (NJ Property-Liability Insurance Guaranty Assoc.) insolvency data | NAIC SERFF SFA | Rate Filing (NJ) | NJ DOBI publishes insolvency notices useful for carrier exit tracking. |
| **Virginia SCC Bureau of Insurance** | `https://scc.virginia.gov/pages/bureauofinsurance` | Free | Manual | State | Per filing | Web/PDF | None | Rate filings, market conduct data, SERFF SFA | NAIC SERFF SFA | Rate Filing (VA) | |
| **Massachusetts MDOI + MPIUA** | `https://www.mass.gov/orgs/division-of-insurance` | Free | Manual | State | Per filing | Web/PDF | None | Rate filings, MPIUA (MA Property Ins. Underwriting Assoc. = FAIR Plan) stats | NAIC SERFF SFA | Rate Filing (MA) | |
| **Connecticut CID** | `https://portal.ct.gov/cid` | Free | Manual | State | Per filing | Web | None | Rate filings via SERFF SFA | NAIC SERFF SFA | Rate Filing (CT) | |
| **Colorado DOI + CO FAIR Plan** | `https://doi.colorado.gov/` | Free | Manual | State | Per filing | Web/PDF | None | Rate filings, CO FAIR Plan policy stats | NAIC SERFF SFA | Rate Filing (CO) | CO wildfire exposure growing sharply; FAIR Plan demand rising. |
| **Hawaii HDOI** | `https://cca.hawaii.gov/ins/` | Free | Manual | State | Per filing | Web | None | Rate filings, carrier actions | NAIC SERFF SFA | Rate Filing (HI) | |
| **Oregon DCBS** | `https://dfr.oregon.gov/` | Free | Manual | State | Per filing | Web | None | Rate filings via SERFF SFA | NAIC SERFF SFA | Rate Filing (OR) | |
| **Washington OIC** | `https://www.insurance.wa.gov/` | Free | Manual | State | Per filing | Web/PDF | None | Rate filings, non-renewal data, SERFF SFA | NAIC SERFF SFA | Rate Filing (WA) | WA OIC publishes annual non-renewal statistical reports — underused source. |
| **Arizona DIFI (SERFF)** | `https://difi.az.gov/sfa` | Free | Manual | State | Real-time | HTML/PDF via SERFF[^40] | None | Form/rate/rule/health plan binder filings[^40] | NAIC SERFF SFA | Rate Filing (AZ) | SFA = SERFF Filing Access; direct link on DIFI page. |
| **Nevada DOI** | `https://doi.nv.gov/` | Free | Manual | State | Per filing | Web | None | Rate filings, SERFF SFA | NAIC SERFF SFA | Rate Filing (NV) | |
| **Kentucky KDOI (SERFF)** | `https://insurance.ky.gov/` | Free | Manual; pre-Nov 2018 via open records[^41] | State | Real-time (post 2018) | HTML/PDF via SERFF[^41] | None | Rate/form filings, disposition | NAIC SERFF SFA | Rate Filing (KY) | |
| **West Virginia OIC** | `https://www.wvinsurance.gov/` | Free | Manual | State | Per filing | Web | None | Rate filings via SERFF SFA | NAIC SERFF SFA | Rate Filing (WV) | |

***

## Section 3: Industry, Research & Rating Agency Sources

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Limit | Geographic Granularity | Update Frequency | Data Format | Auth | Specific Fields | Cross-Verify | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **AM Best News & Rating Actions** | `https://news.ambest.com` (RSS available) | Freemium (full reports paid) | Free headline + press release; full reports ~$75+ | National; per-carrier | Real-time | RSS/HTML | No auth for headlines | Carrier name, rating action type (upgrade/downgrade/affirm/withdraw), outlook change, publication date[^42] | Demotech FSRs, NAIC financials | Carrier Solvency Alert tile | 2024 had more upgrades and fewer downgrades vs 2023[^43]. Full Best's Reports require paid subscription. RSS feed at news.ambest.com for free monitoring. |
| **Demotech Financial Stability Ratings** | `https://www.demotech.com/financial-stability-ratings/` | Free (public FSR lookup); full reports paid | Free FSR lookup per carrier | National; critical for FL admitted market | Real-time (quarterly review cycle) | Web lookup | No auth for public FSR | FSR letter grade (A" through M), stability opinion, company name[^44] | AM Best, NAIC FDR | FL Admitted Carrier Stability tile | **Highest-leverage source for FL CRE.** Most FL admitted homeowners carriers rated by Demotech, not AM Best. FSR downgrades trigger insurer-of-last-resort cascade to Citizens. Demotech warned of mass downgrades in 2022 FL crisis[^45]. |
| **Insurance Information Institute (Triple-I) Research** | `https://www.iii.org/research-data` ; `https://www.iii.org/publications/triple-i-insurance-facts` | Free (public stats); Facts Book paid for full access ($) | Free stats and press releases; Facts Book = member/paid | National; some state | Ongoing/Annual | Web/PDF | None for public stats | Loss ratios, catastrophe losses, homeowners premium trends, FAIR plan statistics[^46][^47] | NAIC Market Share, NOAA NCEI | Market Trend Monitor tile | Triple-I Insurance Facts (formerly Insurance Fact Book) is member-only for full data[^47]. Public stats pages are free and extensive. |
| **Wharton Risk Center Publications** | `https://risk.wharton.upenn.edu/` ; `https://impact.wharton.upenn.edu/` | Free | Unlimited | National; occasional state/county | Per publication | PDF | None | Flood insurance reform research, NFIP analysis, parametric insurance studies, climate-insurance market research[^48][^49] | FEMA NFIP data, NOAA | Research Depth tile; Academic Validation | Key researchers: Howard Kunreuther, Ben Keys (mortgage escrow insurance data). FSU RMI Center is FL-focused analog[^50]. |
| **FSU Risk Management & Insurance Center** | `https://business.fsu.edu/departments/rmi` ; FSU-OIR partnership data | Free (published research) | Per publication | FL-focused; state level | Per study | PDF/Press | None | FL insurance market structure, cat model research, OIR partnership data[^50][^51] | FL OIR IRFS, Demotech | FL Market Deep Dive tile | HB1097 (2025) proposes $5M+ funding for FSU FL Catastrophic Storm Risk Management Center with OIR data access[^51]. |
| **Ceres Climate Risk Reporting (Insurers)** | `https://www.ceres.org/resources/reports/` | Free | Unlimited | National; 526 insurance groups analyzed[^52] | Annual | PDF | None | TCFD disclosure rates, climate scenario adoption, insurer metrics vs targets[^52] | AM Best ESG data | Climate Governance tile | 99% of insurers reported on risk management; only 29% disclosed metrics and targets[^52]. |
| **S&P Global / Moody's / Fitch Press Releases** | S&P: `https://www.spglobal.com/ratings/en/research-insights/` ; Moody's: `https://www.moodys.com/newsandevents` | Freemium (press releases free; full reports paid) | Free headlines; reports ~$300–$2,000 | National; per-carrier | Per action | HTML/RSS | None for press | Rating action, outlook, rationale summary | AM Best, Demotech | Carrier Rating Monitor tile | Only AM Best specializes in insurance; S&P/Moody's/Fitch cover large group holding companies (AIG, Travelers, Allstate parent). |

***

## Section 4: Catastrophe Data Sources

### 4A: Weather & Natural Hazard APIs

| Source Name | Exact URL / Endpoint | Free vs Freemium | Rate Limit | Geographic Granularity | Update Freq | Data Format | Auth | Specific Fields | Cross-Verify | Terminal Tile | Notes / Curl Example |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **NOAA Storm Events Database** | `https://www.ncei.noaa.gov/stormevents/` ; FTP: `https://www.ncdc.noaa.gov/stormevents/ftp.jsp` | Free | No API key; FTP download; 1 file/year | County | Annual (Jan 1950–Feb 2026 current)[^53] | CSV (3 files/year: events, fatalities, locations) | None | Event type, begin/end date, county, state, injuries, deaths, property damage $, crop damage $[^54] | NOAA NCEI Billion-Dollar Disasters, FEMA disaster declarations | Catastrophe History tile; County Loss Map | No structured REST API — FTP bulk download or third-party scrapers[^54][^55]. Use noaastormevents R package or Apify scraper for automation[^55]. Property damage fields are estimates. |
| **NOAA NCEI Billion-Dollar Disasters** | `https://www.ncei.noaa.gov/access/billions/` ; state summary: `.../state-summary/FL` etc.[^56] | Free (static archive 1980–2024) | Unlimited | National; state summary | **RETIRED as of 2025** — static archive only[^7] | Web/CSV download | None | Event count, type, cost ($B CPI-adjusted), fatality count by state[^56] | Climate Central (now maintains updates) | Catastrophe Cost tile | NOAA retired this database in 2025 due to budget cuts[^7]. **Climate Central now maintains active updates at** `https://www.climatecentral.org/climate-services/billion-dollar-disasters`[^8]. |
| **Climate Central Billion-Dollar Disasters** | `https://www.climatecentral.org/climate-services/billion-dollar-disasters` | Free | Unlimited | National; state | Ongoing (took over from NOAA 2025)[^8] | Web/CSV | None | 431 events 1980–2026, total cost >$3.1T CPI-adjusted[^8] | NOAA Storm Events, FEMA declarations | Catastrophe Cost tile (replacement) | As of July 2025, Climate Central maintains what NOAA abandoned[^8]. Critical gap-fill. |
| **NOAA HURDAT2 Hurricane Track Data** | `https://www.nhc.noaa.gov/data/hurdat/` ; IBTrACS: `https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/access/csv/` | Free | Unlimited | Track-level; ~6-hourly positions[^57] | Annual update (current year added following year)[^58] | CSV / netCDF / Shapefile | None | Storm ID, name, date/time UTC, lat/lon, max sustained winds, min pressure, basin[^57][^59] | NOAA Storm Events, FEMA IA/PA grants | Hurricane Exposure tile; Windspeed-at-Property overlay | IBTrACS covers 1842–present, 6,000+ global cyclones[^60]. HURDAT2 is Atlantic/Pacific focused. Public domain[^57]. |
| **USGS Earthquake Hazards Program API** | `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-12-31&minmagnitude=2.5` | Free | No key required[^61] | Parcel-level (lat/lon) | Real-time (~minutes post-event) | GeoJSON / CSV / XML[^62] | None | Magnitude, depth, lat/lon, time, place description, significance score, tsunami flag[^62] | USGS National Seismic Hazard Maps | Seismic Risk tile; Earthquake Alert | No rate limit documented. Feeds: `all_day.geojson`, `all_week.geojson`, `all_month.geojson`[^63]. FDSN standard implementation[^62]. Example: `curl "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4.0&starttime=2025-01-01"` |
| **FEMA Flood Map Service Center (FIRM)** | `https://msc.fema.gov/portal/search` | Free | Unlimited | Parcel/flood zone | Updated per community remap (years-long cycle) | Shapefile / PDF / API | None for search | Flood zone designation (AE, X, VE, etc.), base flood elevation, FIRM panel ID[^64] | FEMA NFIP policies, First Street flood risk | Flood Zone tile; SFHA Overlay | FEMA FIRM maps are regulatory, not risk-based. First Street shows 70% more at-risk properties than FEMA SFHAs[^65]. |
| **NASA FIRMS Active Fire Feed** | `https://firms.modaps.eosdis.nasa.gov/api/area/csv/[MAP_KEY]/VIIRS_SNPP_NRT/-124,25,-66,49/1/` | Free (MAP_KEY required — free signup) | MAP_KEY; 10-minute window reset[^66] | 375m–1km pixel; lat/lon per detection | Near real-time (~60 sec post-overpass)[^66] | CSV / KML / JSON | Free MAP_KEY signup at `https://firms.modaps.eosdis.nasa.gov/api/map_key` | Lat/lon of fire hotspot, brightness temp, detection confidence (0–100%), satellite, acquisition date/time[^66][^67] | InciWeb, USDA InciWeb RSS, Cal Fire | Wildfire Proximity Alert tile; Active Fire Overlay | VIIRS = 375m resolution. MODIS = 1km. NRT data. Example call for CONUS: area coords `-124,25,-66,49`. 30,000–100,000+ records/day for full CONUS VIIRS[^66]. |
| **USDA InciWeb Wildfire Incidents (RSS)** | `https://inciweb.wildfire.gov/` ; RSS: `https://inciweb.wildfire.gov/feeds/rss/` | Free | Unlimited | State / incident polygon | Real-time (active incidents) | RSS / Web / GeoJSON | None | Incident name, location, acres, % contained, structures threatened, evacuation notices[^68][^69] | NASA FIRMS, NIFC | Active Wildfire Alert tile | NIFC also provides state-level InciWeb links[^69]. 29,023 fires, 2.3M acres so far in 2026[^70]. |

### 4B: FEMA / NFIP Data APIs

| Source Name | Exact URL / Endpoint | Free vs Freemium | Rate Limit | Geographic Granularity | Update Freq | Data Format | Auth | Specific Fields | Cross-Verify | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **OpenFEMA Disaster Declarations API** | `https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries.json?$filter=state%20eq%20'FL'` | Free | No API key; 1,000 records/call (paginate)[^71] | County | Ongoing | JSON / CSV | None | Disaster number, type (DR/EM/FM), incident type, state, county FIPS, declaration date, program areas declared (IA/PA)[^72][^73] | NOAA Storm Events, FEMA IA/PA grants | Disaster Declaration Alert; County Risk Score | Full dataset at `https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2`[^72]. Use rfema R package or Python loop for >1,000 records[^71][^74]. |
| **OpenFEMA NFIP Redacted Claims** | `https://www.fema.gov/api/open/v2/FimaNfipClaims?$filter=state%20eq%20'FL'` | Free | No key; 1,000/call; updated every 40–60 days[^75] | ZIP code (redacted for privacy) | Every 40–60 days | JSON / CSV | None | Year of loss, state, ZIP, cause of loss, amount paid ($), claim count[^71][^76] | NFIP policies data, NOAA flood events | NFIP Claims Density tile; Flood Loss History | Full dataset: `https://www.fema.gov/about/openfema/data-sets#nfip`[^75]. Privacy redaction removes parcel ID. |
| **OpenFEMA NFIP Policies** | `https://www.fema.gov/api/open/v2/FimaNfipPolicies` | Free | No key; 1,000/call; ~40–60 day lag[^77] | ZIP code | Every 40–60 days | JSON / CSV | None | State, ZIP, coverage amount, policy count, occupancy type, base flood elevation, flood zone | NFIP claims, FEMA FIRM maps | NFIP Policy Count tile; SFHA Penetration Rate | Use DuckDB or Python for bulk queries of this large dataset[^78]. |
| **OpenFEMA Individual + Public Assistance Grants** | `https://www.fema.gov/api/open/v2/IndividualAssistanceHousingRegistrants` ; `/PublicAssistanceApplicantsProgramDeliveries` | Free | No key; paginate | County | Per disaster close-out | JSON | None | Award amounts, county, disaster number, damage category | Disaster declarations, NOAA storm events | NOI Impact Estimator (post-disaster) | IA/PA grants reveal actual economic damage per county post-disaster — proxy for uninsured loss magnitude[^73]. |

***

## Section 5: Climate Risk Scoring APIs (Property-Level)

| Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free Tier Details | Geographic Granularity | Update Freq | Data Format | Auth | Specific Fields | Cross-Verify | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **First Street Risk Factor (Consumer Site)** | `https://riskfactor.com` | Free (consumer lookup) | Free per-property lookup for residential; CRE data via enterprise[^79][^80] | Property/parcel | Annual model updates | Web (no free API) | Free account creation | Flood Factor (1–10), Fire Factor, Wind Factor, Heat Factor, Air Quality score; damage cost estimates[^81][^79] | FEMA FIRM, NOAA Storm Events | Property Risk Score tile (residential) | **Free for residential properties.**[^79] CRE / commercial API requires paid Enterprise Suite[^80]. RPR (Realtor Property Resource) integrates First Street for REALTORS[^81]. |
| **First Street Climate Risk API (Enterprise)** | `https://docs.firststreet.org/api` | Paid (enterprise) | No free API tier; contact `api@firststreet.org`[^82] | Parcel-level globally | Annual | REST API; JSON | API key (paid) | Physical climate risk scores for flood, fire, wind, heat at point coordinates; portfolio aggregation[^82][^80] | NASA FIRMS, NOAA HURDAT2, USGS | Property Risk Score tile (commercial/portfolio) | Enterprise API covers commercial properties and portfolio views[^80]. Three APIs: Climate Risk, Enterprise (portfolio), Raster Map[^82]. First Street + Arup CRE flood report (2021) shows 729,699 CRE properties at flood risk[^83]. |
| **FEMA National Flood Hazard Layer (NFHL)** | `https://msc.fema.gov/portal/search` ; WMS/WFS at `https://hazards.fema.gov/gis/nfhl/rest/services/` | Free | Unlimited | Parcel | Per community remap | WMS/WFS/Shapefile | None | Flood zone (AE/X/VE), FIRM panel, BFE, floodway, LOMA status | NFIP policies, First Street flood risk | SFHA Overlay tile | WFS endpoint allows GIS integration. NFHL is the regulatory layer; First Street is the probabilistic risk layer — use both. |
| **NOAA Coastal Change Hazards Portal** | `https://marine.usgs.gov/coastalchangehazardsportal/` | Free | Unlimited | Coastal parcel/shoreline | Variable | Web/API/Shapefile | None | Shoreline change rate, coastal erosion risk, sea-level rise projections, storm impact | FEMA FIRM, NOAA HURDAT2 | Coastal Erosion / SLR Risk tile | Maintained by USGS. Useful for FL/LA/TX/NC coastal CRE. |

***

## Section 6: Residual Market / FAIR Plan Exposure Trackers

| Source Name | Exact URL / Endpoint | Free vs Paid | Granularity | Update Freq | Data Format | Auth | Key Fields | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **FL Citizens depopulation / policy count** | `https://www.citizensfla.com/` | Free | State aggregate | Monthly | PDF / Web | None | Policy count, assumed policies count, assuming carrier list | Citizens Exposure tile | Policy count 987,650 as of Nov 2024[^3]; +354K assumed in 2024[^84] |
| **CA FAIR Plan stats** | `https://www.cfpnet.com/key-statistics-key/` + `https://www.cfpnet.com/about-fair-plan/` | Free | State; ZIP via research | Quarterly | Web/PDF | None | Policy count, exposure $, member participation rates, financial reports[^21] | CA FAIR Exposure tile | FAIR Plan not rated by AM Best[^21]; exposure up $400B since 2021[^5] |
| **LA Citizens (LCPIC)** | `https://lcpic.com/` | Free | State | Annual / per depopulation event | Web/PDF | None | Policy count, depopulation program details, assuming carriers | LA Citizens Exposure tile | LA Citizens depopulation portal accessed via agency portal Quick Links[^85] |
| **NC Beach Plan (NCIUA)** | `https://www.ncjua-nciua.org/` | Free | 18 coastal counties | Annual | Web/PDF | None | Policy count by line, exposure, rate schedule | NC Beach Exposure tile | |
| **SC Wind Hail (SCWHUA)** | `https://www.scwind.com/` | Free | Beach territory | Annual | Web/PDF | None | Policy count, coverage types, rate info[^37] | SC Wind Pool tile | |
| **TX FAIR Plan (TFPA)** | `https://www.texasfairplan.org/` | Free | State (TX underserved areas) | Per rate filing / annual | Web/PDF | None | Rate changes, TDI orders, product list[^86][^33] | TX FAIR Exposure tile | TFPA is residential only; TWIA handles coastal wind. |
| **MS Windstorm Underwriting Assoc. (MWUA)** | `https://www.mwua.net/` | Free | 6 MS coastal counties | Annual | Web | None | Policy count, exposure, rate | MS Wind Pool tile | |
| **AL Insurance Underwriting Assoc. (AIUA)** | `https://www.aiua.org/` | Free | AL coastal counties | Annual | Web/PDF | None | Policy count, rate | AL Beach Pool tile | |

***

## Section 7: Catastrophe Model Firm Free Intelligence

| Source Name | Exact URL / Endpoint | Free vs Paid | Granularity | Update Freq | Data Format | Auth | Key Fields | Terminal Tile | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **Verisk (AIR) Extreme Event Commentary** | `https://www.verisk.com/company/newsroom/` | Free (press/commentary only; models are paid enterprise) | National; event-level | Per cat event | HTML/PDF | None | Industry insured loss estimate ($), model commentary, event type | Catastrophe Loss Estimate tile | AIR rebranded as Verisk Extreme Event Solutions in 2022[^87][^88]. Verisk ProMetrix / PSOLD loss cost data is licensed only[^89][^90][^91]. |
| **Moody's RMS (Extreme Event Solutions) Press** | `https://www.moodysrms.com/` | Free (press only) | National; event-level | Per cat event | HTML | None | Loss estimates, model updates | Catastrophe Loss Estimate tile | Moody's acquired RMS for $2B in 2021[^92]. Parcel-level risk models licensed only. |
| **CoreLogic / Cotality Hazard HQ** | `https://hazardhq.corelogic.com/` | Free (public portal); reports paid | National; event-level | Per cat event / quarterly reports | Web/PDF | None | Properties at risk count, RCV $, event summaries by peril[^93][^94] | Cat Exposure tile | CoreLogic rebranded as Cotality in 2025[^95]. Hurricane risk report (2025): 33M+ residential properties at moderate+ wind risk, $11.7T RCV[^96]. SCS report: 41M homes at hail risk[^94]. |
| **Karen Clark & Company (KCC) Press** | `https://www.karenclarkandco.com/news/` | Free (press) | National; per event | Per cat event | HTML | None | Insured loss estimates | Catastrophe Loss Estimate tile | Independent cat modeler; particularly influential for hurricane season outlooks. |

***

## Section 8: Python / curl Endpoint Reference Sheet

```python
# 1. USGS Earthquake Feed (No auth, no rate limit)
import requests
r = requests.get("https://earthquake.usgs.gov/fdsnws/event/1/query",
    params={"format":"geojson","starttime":"2025-01-01","minmagnitude":"4.0","minlatitude":25,"maxlatitude":50})
events = r.json()["features"]

# 2. OpenFEMA Disaster Declarations (No auth, paginate 1000/call)
base = "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"
r = requests.get(base, params={"$filter":"state eq 'FL'","$orderby":"declarationDate desc","$top":1000})
decls = r.json()["DisasterDeclarationsSummaries"]

# 3. OpenFEMA NFIP Claims (No auth, ZIP-level)
r = requests.get("https://www.fema.gov/api/open/v2/FimaNfipClaims",
    params={"$filter":"state eq 'FL' and yearOfLoss ge 2020","$top":1000})
claims = r.json()["FimaNfipClaims"]

# 4. NOAA Storm Events (FTP download)
import urllib.request
urllib.request.urlretrieve(
    "https://www.ncei.noaa.gov/pub/data/swdi/stormevents/csvfiles/StormEvents_details-ftp_v1.0_d2024_c20250317.csv.gz",
    "stormevents_2024.csv.gz")

# 5. NASA FIRMS Active Fire (Free MAP_KEY required)
MAP_KEY = "YOUR_FREE_KEY"  # signup at firms.modaps.eosdis.nasa.gov/api/map_key
r = requests.get(f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/VIIRS_SNPP_NRT/-124,25,-66,49/1/")
# Returns CSV of fire hotspots in CONUS in last 24 hours

# 6. NOAA IBTrACS Hurricane Tracks (No auth)
urllib.request.urlretrieve(
    "https://www.ncei.noaa.gov/data/international-best-track-archive-for-climate-stewardship-ibtracs/v04r01/access/csv/ibtracs.NA.list.v04r01.csv",
    "ibtracs_north_atlantic.csv")
```

***

## Section 9: Top 15 Highest-Leverage Sources for the Insurance Shock Alert System

Ranked by actionability for live alerts + county-level Insurability Score:

1. **NAIC MCAS Data Dashboard** — Only free source with aggregate non-renewal/cancellation ratios at state level across all 51 jurisdictions. No substitute for detecting systemic withdrawal signals.[^14][^13]
2. **Florida OIR IRFS** (`irfssearch.floir.gov`) — FL is the bellwether of the national insurance crisis. Real-time rate filings, 2001–present. HB1611 now requires monthly ZIP-level data.[^17][^2]
3. **NAIC SERFF Filing Access (SFA)** — National rate-filing backbone. Covers most states post-2014. The raw source for rate trajectory data before it reaches pricing models.[^10][^9]
4. **TWIA Quarterly Fact Book** — TX coastal CRE has $117B+ exposure; 10% residential rate increase filed in 2024. Updated quarterly.[^97][^29]
5. **OpenFEMA Disaster Declarations API** — County-level, real-time, no auth. Essential for correlating declarations with rate-filing spikes (declarations precede rate increases by 12–24 months).[^71][^72]
6. **California FAIR Plan Key Statistics** — $558B exposure, up $400B in 4 years. Monthly-ish updates. Uninsurability canary for Western CRE.[^21][^22][^5]
7. **NOAA HURDAT2 / IBTrACS** — Historical hurricane track data for actuarial correlations. Free, public domain, structured CSV.[^57][^60]
8. **OpenFEMA NFIP Redacted Claims** — ZIP-level flood claims, updated every 40–60 days. Reveals where private insurers will flee next.[^75][^71]
9. **Demotech FSR Lookup** (`demotech.com`) — FL admitted carrier rating monitor. FSR downgrade = Citizens policy surge + coverage gap.[^45][^44]
10. **NASA FIRMS Active Fire API** — Real-time wildfire detection within 60 seconds of satellite overpass. Free MAP_KEY. Direct CA/CO/OR/WA signal.[^66][^67]
11. **Climate Central Billion-Dollar Disasters** — Replaced NOAA NCEI in 2025. National catalog of $1B+ events, CPI-adjusted.[^8]
12. **NOAA Storm Events Database (FTP)** — County-level historic severe weather data, 1950–present. Property and crop damage estimates. Essential for loss model calibration.[^54][^53]
13. **USGS Earthquake API** (`earthquake.usgs.gov/fdsnws/event/1/`) — No auth, real-time. Critical for CA/NV/WA/OR CRE portfolios.[^98][^62]
14. **AM Best News RSS** (`news.ambest.com`) — Carrier rating actions as leading indicator of market withdrawal capacity.[^43][^42]
15. **InciWeb / NIFC Wildfire RSS** — Active incident data including structures threatened; complements NASA FIRMS with incident management context.[^68][^70]

***

## Section 10: Unfair-Advantage DOI Portals Most Analysts Ignore

### 1. Florida OIR IRFS — The Raw Filing Layer
Most analysts use broker reports and trade press to track FL rate increases. The direct path is `https://irfssearch.floir.gov` — searchable by company name, returning the actual filed rate change percentage, the disposition (approved/withdrawn/pending), and effective dates back to 2001. The system flags trade secret claims that obscure granular data, but the overall rate trajectory per carrier is visible. **HB1611 (2025)** now mandates monthly ZIP-code-level supplemental data submissions from all FL admitted carriers, creating a new high-resolution signal stream as of January 2025.[^2][^17]

### 2. California CDI Prior Approval Queue
California is a prior-approval state under Proposition 103 (1988). Every rate increase must be filed and approved before going into effect. The CDI WARFF system (`https://www.insurance.ca.gov/0250-insurers/0800-rate-filings/`) shows the pending queue — the gap between filed date and effective date reveals regulatory bottleneck. A 12–18 month approval queue for State Farm (filed June 2024) means filed rate increases are a leading indicator of future NOI compression. **The prior approval queue is the most predictive signal for CA insurance cost trajectory.**[^25]

### 3. Louisiana LDI + Mandatory Non-Renewal Data Call
LDI issued **Bulletin 2024-01** requiring all P&C insurers to file quarterly non-renewal/cancellation data via the POIDRS module in the Industry Access Portal. This mandatory data call — covering all homeowners policies in-force for 3+ years — is not widely tracked by out-of-state analysts. It creates a quarterly time series of the exact carrier withdrawal rate in Louisiana. Contact `3yruledata@ldi.la.gov` for data availability timeline. Rate filing search at `https://www.ldi.la.gov/online-services/rate-filing-search`.[^26][^27]

### 4. NAIC MCAS Dashboard — The Non-Renewal Data Nobody Aggregates
The MCAS Data Dashboard at `https://content.naic.org/mcas_data_dashboard.htm` provides state-level non-renewal and cancellation ratios across 51 jurisdictions for homeowners insurance. This is the only free, standardized, nationally-comparable dataset for carrier exit behavior. Updated ~60 days after the April 30 filing deadline. Most data vendors do not systematically aggregate this. For an Insurability Score, MCAS is the backbone.[^13][^14]

### 5. Washington OIC Non-Renewal Statistical Reports
The WA OIC publishes annual statistical reports on insurance non-renewals — a practice that few other states replicate publicly. As wildfires expand into WA/OR/ID, this data trail gives early warning on western carrier withdrawal patterns before they show up in NAIC aggregates.

***

## Section 11: Gap Analysis — What Remains Gated

The following data remains commercially gated, creating a structural information asymmetry between institutional cat model users and market-participants relying on public data:

**1. Verisk/ISO Parcel-Level Loss Costs (ProMetrix / PSOLD)**  
ISO's statistical model covers 11.3M+ commercial properties with class-rated and specifically-rated loss costs per building. This is the actuarial pricing input for most admitted carriers. Access requires a Verisk carrier relationship or paid data license (~$10K–$100K/year depending on scope). The Estimated Loss Cost Quote Report is available on a per-property basis. *Cheapest legitimate path:* Use OpenFEMA NFIP claims + NOAA Storm Events to construct a proxy loss cost surface at ZIP level. Layer with First Street risk scores for a defensible approximation.[^89][^99][^91]

**2. CoreLogic/Cotality Risk Premium & Reconstruction Cost Value**  
CoreLogic's parcel-level reconstruction cost value (RCV) and risk premium data — used by lenders and carriers — is licensed only. The free Hazard HQ portal provides aggregate national estimates. *Cheapest legitimate path:* Use CoreLogic's free Hazard HQ press releases plus FEMA NFIP policy data (which contains coverage amounts as a proxy for insured value).[^93][^96]

**3. Reinsurance Broker Proprietary Reports (Aon / Guy Carpenter / Gallagher Re)**  
Aon Reinsurance Solutions, Guy Carpenter (Marsh McLennan), and Gallagher Re publish proprietary January 1 and June 1 renewal market reports with reinsurance pricing indices, ROL (rate-on-line) changes, and carrier capacity data. These reports are shared with cedants and retrocessionaires only — not publicly available. They are the leading indicator of primary insurance rate actions (reinsurance costs pass through with a 6–18 month lag). *Cheapest legitimate path:* Monitor Artemis.bm (free cat bond/ILS market news), reinsurancene.ws (free), and Gallagher Re's public market updates at `https://www.ajg.com/gallagherre/insights/` for free-tier summaries of reinsurance pricing trends.[^100]

**4. Demotech Full Company Reports / FL Carrier-Level Financials**  
Demotech's FSR letter grade is free, but the underlying quantitative ratios, trend analysis, and company financial exhibits are paid. The publicly available alternative is NAIC statutory financial statement data via InsData (paid) or the NAIC Annual Statement data obtained via individual state DOI open records requests (slow but free).[^44]

**5. Moody's RMS / Verisk AIR Full Cat Model Output**  
Probable Maximum Loss (PML) curves, Average Annual Loss (AAL) by ZIP, and return-period loss tables are licensed only. *Free proxy:* TWIA publishes its own 1-in-100-year PML estimates in quarterly reports; FEMA publishes loss frequency data in NFIP statistics; First Street's methodology papers are public and peer-reviewed, enabling construction of a proxy model.[^29]

***

## Section 12: Terminal Tile Architecture — Mapping Sources to Display

| Terminal Tile | Primary Sources | Secondary / Validation Sources | Alert Trigger Logic |
|---|---|---|---|
| **Rate Filing Trajectory** (state + line) | FL OIR IRFS, NAIC SERFF SFA, state DOI portals | NAIC Market Share Report, Triple-I | Rate filing ≥ 15% OR consecutive filings ≥3 years |
| **Carrier Concentration Risk** | NAIC Annual P&C Market Share | State DOI market share reports | HHI > 0.25 OR top 3 carriers > 70% market share |
| **Non-Renewal Rate** | NAIC MCAS Dashboard, state DOI bulletins | CDI non-renewal moratorium tracker, LDI data call | Non-renewal ratio >2x prior year or >2x state average |
| **FAIR Plan Exposure** | CA FAIR Plan stats, FL Citizens, LA Citizens, TWIA Fact Book | Triple-I, state DOI | FAIR Plan policies >15% of total market OR exposure growth >25% YoY |
| **Implied NOI Hit per Asset Class** | Rate trajectory × asset-type insurance-to-value ratios | TWIA RCV data, CoreLogic Hazard HQ RCV estimates | Insurance cost as % NOI crosses 5% (yellow), 10% (red) threshold |
| **Catastrophe Alert** | OpenFEMA Disaster Declarations, NOAA Storm Events, USGS EQ, NASA FIRMS, InciWeb | NOAA HURDAT2, Climate Central Billion-Dollar Disasters | Disaster declaration in county containing watched asset |
| **Carrier Solvency Stress** | Demotech FSR, AM Best News RSS, NAIC Snapshots | Moody's/S&P press releases | FSR downgrade or AM Best negative outlook for carrier active in watched state |
| **Seismic Risk Overlay** | USGS EQ API real-time, USGS National Seismic Hazard Maps | FEMA FIRM, OpenFEMA | M4.0+ within 50km of watched county |
| **Flood Loss History** | OpenFEMA NFIP Claims, OpenFEMA NFIP Policies | FEMA FIRM/NFHL, First Street Flood Factor | NFIP claims density >$10K/policy in ZIP over rolling 5 years |
| **Wildfire Proximity** | NASA FIRMS NRT, InciWeb RSS | NOAA Storm Events (wildfire type), NIFC | Active fire hotspot within 25 miles OR structures threatened in county |

***

## Note for Tel Aviv Principal — "What Does This Mean Right Now?"

A Tel Aviv LP looking at a multifamily acquisition in Tampa Bay, FL can now run the following free check in under 30 minutes:

1. **IRFS search** for the target property's insurer — check rate filing history since 2021. If insurer filed +12%, +13%, +14% consecutively (Citizens-level), underwrite a 5-year insurance cost escalation of 14% CAGRat minimum.
2. **MCAS Dashboard** — pull FL homeowners non-renewal ratio vs national average. FL has been >2x national average since 2022.
3. **TWIA / Citizens** — confirm whether the asset falls within Citizens eligibility territory (coastal barrier island = yes; inland Hillsborough = likely no), and check Citizens policy count trend.
4. **OpenFEMA NFIP Claims** — filter for target ZIP, last 5 years. High claim density = flood zone repricing risk on top of wind risk.
5. **NASA FIRMS / NOAA HURDAT2** — overlay 150 years of hurricane tracks to confirm exposure return period.
6. **NAIC MCAS** — benchmark non-renewal ratio and claims frequency for FL homeowners line nationally.

**Red-flag scenario:** Asset insured by a Demotech-rated FL carrier with a consecutive rate-filing history of 10%+, in a ZIP with NFIP claims >$15K/policy, within a Citizens-eligible territory, where the FL MCAS non-renewal ratio is >3x state benchmark. This pattern — fully detectable with free public data — is the actuarial signature of asymmetric value destruction.

---

## References

1. [Citizens' homeowners insurance rate hike request still waiting ...](https://www.cfpublic.org/housing-homelessness/2025-01-16/citizens-homeowners-insurance-rate-hike-request-still-waiting-approval) - Florida homeowners renewing their policies this year with Citizens Property Insurance Corporation mi...

2. [OIR Provides Update on Florida's Strengthening Property Insurance ...](https://floir.gov/home/2024/05/18/oir-provides-update-on-florida-s-strengthening-property-insurance-market) - Today, the Florida Office of Insurance Regulation (OIR) issued an update on the continued strengthen...

3. [Citizens' Policy Count Below 1M - Public](https://www.citizensfla.com/-/20241204-citizens-policy-count-below-1m) - The reduced policy count, which was 987,650 as of November 29, 2024, is due in large part to the suc...

4. [TWIA faces rising exposure, deepening deficit | Reinsurance Business](https://www.insurancebusinessmag.com/reinsurance/news/breaking-news/twia-faces-rising-exposure-deepening-deficit-537784.aspx) - At the end of the first quarter, the association had more than 276,000 active policies with total ex...

5. [Mapping the Residential Exposure and Coverage of California's ...](https://cepp.substack.com/p/mapping-the-residential-exposure) - We provide several interactive maps exploring the spatial distribution of the FAIR Plan's residentia...

6. [California homeowners insurance: Current state of the market and ...](https://www.milliman.com/en/insight/california-homeowners-insurance-los-angeles-wildfires) - Over the past four fiscal years, the FAIR Plan dwelling policies have increased by 123% from 202,897...

7. [Billion-dollar disasters database being retired, NOAA says](https://www.foxweather.com/weather-news/billion-dollar-database-retirement-2025-noaa) - According to NCEI, information from 1980-2024 will still be accessible. However, no updates will be ...

8. [U.S. Billion-Dollar Weather and Climate Disasters](https://www.climatecentral.org/climate-services/billion-dollar-disasters) - As of July 28, 2025, Climate Central manages and maintains this billion-dollar disaster dataset, bui...

9. [Search the System for Electronic Rates and Forms Filing (SERFF)](https://www.tdi.texas.gov/company/serff/index.html) - You can view and search company filings received after April 13, 2014, on the National Association o...

10. [SERFF Public Access - oci.ga.gov](https://oci.georgia.gov/regulatory-filings/insurance-product-filings/serff) - The Georgia Department of Insurance allows form and rate filings to be searched for Life, Health, an...

11. [NAIC 2025 Market Share Report | Top 25 P&C Insurers](https://agencychecklists.com/2025/03/17/naic-2025-market-share-report-pc-insurers-74868/) - The top 10 P&C insurers account for 51.40% of the total market share, reflecting a continued concent...

12. [Insurance Industry Snapshots and Analysis Reports - NAIC](https://content.naic.org/industry/insurance-industry-snapshots-analysis-reports) - These comprehensive reports cover the Property & Casualty, Title, Life, Fraternal, and Health Insura...

13. [MCAS Data Dashboard - Market Conduct Annual Statements - NAIC](https://content.naic.org/mcas_data_dashboard.htm) - For companies that download all the jurisdictional ratios and distributions in one document, the dat...

14. [Insurance Topics | Market Conduct Annual Statement - NAIC](https://content.naic.org/insurance-topics/market-conduct-annual-statement) - Learn about market regulation through the NAIC's Market Conduct Annual Statement for data collection...

15. [Insurance Topics | Financial Data Repository - NAIC](https://content.naic.org/insurance-topics/financial-data-repository) - The NAIC Financial Data Repository provides regulators access to insurer financial data for solvency...

16. [[PDF] Insurance Department Resources Report Volume 1 - NAIC](https://content.naic.org/sites/default/files/publication-sta-bb-volume-one.pdf) - The 2022 Insurance Department Resources Report. (IDRR) – Volume 1 is organized into five key section...

17. [FLOIR IRFS Forms & Rates Search - Florida Office of Insurance ...](https://irfssearch.floir.gov) - This system contains relevant filings for both the Life & Health and Property & Casualty lines of bu...

18. [iPortal - Florida Office of Insurance Regulation](https://floir.gov/iportal) - All product review filings, data collection filings, company contact information, and PIP contact in...

19. [Rate Filings - California Department of Insurance](https://www.insurance.ca.gov/0250-insurers/0800-rate-filings/) - Insurance Company Rate Filing Search. This link provides Web Access to Rate and Form Filings (WARFF)...

20. [California Insurance Market Share Reports](https://www.insurance.ca.gov/01-consumers/120-company/04-mrktshare/) - Below are our Life and Annuity Market Share Reports. It includes California licensed companies writi...

21. [About - The California FAIR Plan](https://www.cfpnet.com/about-fair-plan/) - Click to view our Member Participation Rates for 2024, 2025, and 2026. Click to view our Financial R...

22. [Key Statistics & Data - The California FAIR Plan](https://www.cfpnet.com/key-statistics-data/) - Key Statistics & Data. Increasing risks due to climate-driven wildfires and a lack of adequate insur...

23. [Mandatory One Year Moratorium on Non-Renewals](https://www.insurance.ca.gov/01-consumers/140-catastrophes/MandatoryOneYearMoratoriumNonRenewals.cfm) - This important consumer protection law requires a mandatory one-year moratorium on insurance compani...

24. [California Insurance Commissioner Issues Moratorium on Insurance ...](https://www.hansonbridgett.com/publication/250113-8300-la-wildfires) - California Insurance Commissioner Ricardo Lara issued a mandatory one-year moratorium on insurance n...

25. [State Farm and the California Insurance Marketplace](https://newsroom.statefarm.com/state-farm-in-california-understanding-the-issues/) - State Farm General submitted a rate increase to the California Department of Insurance in June 2024....

26. [Rate Filing Search - Louisiana Department of Insurance](https://www.ldi.la.gov/online-services/rate-filing-search) - The LDI staff reviews rate filings to ensure that proposed rates are not excessive, inadequate or un...

27. [Louisiana Issues Data Call on Homeowners Insurance Policies](https://aaisviews.aaisonline.com/compliance-alerts/la-data-call-homeowners-insurance-policies) - The Bulletin requires all insurers to submit the Homeowners Insurance Policies Data Calls through th...

28. [Louisiana Department of Insurance](https://ldi.la.gov) - Latest Rate Filings: Shop Your Policy for the Best Rate! Homeowners ... Data Center. P&C Rate Filing...

29. [[PDF] Texas Windstorm Insurance Association Fact Book](https://www.twia.org/wp-content/uploads/Q3-2025-TWIA-Fact-Book.pdf) - TWIA's policy count began rising in 2021 after a period of decline. The Association projects that po...

30. [[PDF] TWIA Annual Report](https://www.twia.org/wp-content/uploads/2025-TWIA-Annual-Report.pdf) - As of the end of the first quarter of 2025, the Association has more than 276,000 policies with more...

31. [[PDF] Texas Windstorm Insurance Association Overview](https://www.tdi.texas.gov/pubs/pc/twia-overview.pdf) - Hurricane Beryl made landfall near Matagorda on July 8, 2024, as a Category 1 hurricane with maximum...

32. [TWIA Board approves 22% increase in reinsurance budget for 2025](https://www.reinsurancene.ws/twia-board-approves-22-increase-in-reinsurance-budget-for-2025/) - TWIA approved the 2025 budget, which includes $485 million of ceded premiums, up on 2024's $397 mill...

33. [Updates to Rates and Deductible Filings for Texas Fair Plan ...](https://www.texasfairplan.org/news-and-announcements/updates-to-rates-and-deductible-filings-for-texas-fair-plan-association/) - The rate changes will apply to new and renewal business beginning August 1, 2025. View the official ...

34. [North Carolina Joint Underwriters and The State Wind Pool](https://www.nccoastalhomeinsurance.com/north-carolina-joint-underwriters-and-the-state-wind-pool) - You can find more information on the FAIR Plan via this website or you may contact your Insurance Ag...

35. [NCIUA-Coastal Property Insurance Pool - NCJUA](https://www.ncjua-nciua.org/html/svcs_cov.htm) - The FAIR Plan offers, to any person having an insurable interest in property, full peril commercial ...

36. [[PDF] NCJUA/NCIUA DYNAMIC WEB - ncbiwa](https://www.ncbiwa.org/wp-content/uploads/2024/05/Coastal-HO-Insurance.pdf) - ▫ NC Coastal Property Insurance Pool $ 69. ▫ National Average for Beach Plans. $173. ▫ NC FAIR Plan....

37. [About Us - SCWHUA](https://www.scwind.com/about.html) - It provides coverage for the perils of wind and hail in the coastal area of the state designated by ...

38. [Market Conduct Annual Statement (MCAS)](https://doi.sc.gov/869/Market-Conduct-Annual-Statement-MCAS) - The due date for submitting MCAS filings is April 30th of each year except Health. The due date for ...

39. [ALDOI - SERFF's Public Access - Alabama Department of Insurance](https://aldoi.gov/RatesForms/SERFFsPublicAccess.aspx) - Public Online Search for SERFF's Rate & Form Submissions. The State of Alabama Department of Insuran...

40. [SERFF Filing Access (SFA) | DIFI - Arizona Department of Insurance](https://difi.az.gov/sfa) - SFA (accessible using the button at the bottom of this page) is a web site that allows the general p...

41. [[PDF] Public Access Insurance Filings for Rate, Rule, and Form Filing Search](https://insurance.ky.gov/ppc/Documents/publicaccessinsurancefilingsforproperty.pdf) - The SERFF Filing Access Interface ("Interface") is the property of the NAIC. This system is intended...

42. [Best's News | Insurance Industry Headlines from AM Best](https://news.ambest.com) - BEST'S CREDIT RATING ACTION AM Best Affirms Credit Ratings of Rural Trust Insurance Company and Nati...

43. [[PDF] Rating Upgrades Up, Downgrades Down in 2024 - AM Best](https://web.ambest.com/docs/default-source/events/us-property-casualty---rating-upgrades-up-downgrades-down-in-2024.pdf?sfvrsn=5e57375d_1) - Principal Takeaways. • There were more rating upgrades and fewer rating downgrades in 2024 compared ...

44. [Financial Stability Ratings® Information | Demotech, Inc.](https://www.demotech.com/financial-stability-ratings/) - Financial Stability Ratings (FSRs) are a leading indicator of the financial stability of Property an...

45. [Demotech calls for Florida market reform with rating downgrades likely](https://www.artemis.bm/news/demotech-calls-for-florida-market-reform-with-rating-downgrades-likely/) - Demotech calls for Florida market reform with rating downgrades likely · Florida Citizens targets “t...

46. [Research + Data | III - Insurance Information Institute](https://www.iii.org/research-data) - Research + Data. Find the latest updates, data and in-depth analysis of insurance issues—along with ...

47. [Triple-I Insurance Facts | III](https://www.iii.org/publications/triple-i-insurance-facts) - Welcome to Triple-I Insurance Facts! Triple-I members have exclusive access to Insurance Facts, form...

48. [2021 Risk Center Annual Report - Wharton Impact](https://impact.wharton.upenn.edu/archive-risk-center-annual-reports/2021-risk-center-annual-report/) - 2021 deepened the Risk Center's role as the hub for climate and environmental research, education, a...

49. [Flood Insurance Projects from the Wharton Risk Center - RFF.org](https://www.rff.org/topics/climate-risks-and-resilience/adaptation-and-resilience/flood-insurance-projects-from-the-wharton-risk-center/) - Flood Insurance Projects from the Wharton Risk Center · Overview · Issue Briefs · Reports · Topics ·...

50. [Research by FSU's risk management and insurance faculty shapes ...](https://news.fsu.edu/news/business-law-policy/2025/04/03/research-by-fsus-risk-management-and-insurance-faculty-shapes-public-policy/) - The massive data analysis project represents the latest example of policymakers turning to the FSU C...

51. [Bill Would Move Storm Modeling, Research From FIU to FSU ...](https://www.insurancejournal.com/news/southeast/2025/03/18/815882.htm) - The new center at FSU also would be required to publish a hurricane loss data summary each year, and...

52. [Climate Risk Reporting in the U.S. Insurance Sector - Ceres.org](https://www.ceres.org/resources/reports/2025-progress-report-climate-risk-reporting-in-the-us-insurance-sector) - The new report—2025 Progress Report: Climate Risk Reporting in the U.S. Insurance Sector—analyzes cl...

53. [Storm Events Database](https://www.ncei.noaa.gov/stormevents/) - The Storm Events Database contains records on various types of severe weather, as collected by NOAA'...

54. [geanders/noaastormevents: explore noaa storm database - GitHub](https://github.com/geanders/noaastormevents) - This package can be used to explore and map data from NOAA's Storm Events Database. This storm event...

55. [NOAA Storm Events Database Scraper OpenAPI definition - Apify](https://apify.com/compute-edge/noaa-storm-events-scraper/api/openapi) - Learn how to interact with NOAA Storm Events Database Scraper in OpenAPI. Includes an OpenAPI exampl...

56. [Billion-Dollar Weather and Climate Disasters | Florida Summary](https://www.ncei.noaa.gov/access/billions/state-summary/FL) - From 1980-2024, there were 94 confirmed weather/climate disaster events with losses exceeding $1 bil...

57. [IBTrACS - Monty Extension Documentation - IFRC GO](https://ifrcgo.org/monty-stac-extension/model/sources/IBTrACS/) - IBTrACS combines data from numerous sources to create a comprehensive global dataset of tropical cyc...

58. [Historical Hurricane Tracks - NOAA Office for Coastal Management](https://coast.noaa.gov/digitalcoast/data/hurricanes.html) - These data are used in NOAA's Historical Hurricane Tracks tool. Here users can search for a storm by...

59. [International Best Track Archive for Climate Stewardship Project](https://developers.google.com/earth-engine/datasets/catalog/NOAA_IBTrACS_v4) - The International Best Track Archive for Climate Stewardship (IBTrACS) provides location and intensi...

60. [Historical Hurricane Tracks - GIS Map Viewer | NOAA Climate.gov](https://www.climate.gov/maps-data/dataset/historical-hurricane-tracks-gis-map-viewer) - This interactive mapping tool is used to view, analyze, and share track data from the NOAA National ...

61. [USGS Earthquake Scraper - Real-time Seismic Data API - Apify](https://apify.com/cloud9_ai/usgs-earthquake-scraper/api) - Extract real-time and historical earthquake data from USGS. Get magnitude, location, depth, and tsun...

62. [API Documentation - Earthquake Catalog](https://earthquake.usgs.gov/fdsnws/event/1/) - This is an implementation of the FDSN Event Web Service Specification, and allows custom searches fo...

63. [USGS Earthquake Data API Guide | PDF | Apache Spark - Scribd](https://www.scribd.com/document/842245993/1) - The document outlines the process for retrieving and analyzing earthquake data using the USGS API. I...

64. [Search By Address - FEMA Flood Map Service Center](https://msc.fema.gov/portal/search) - This is an interactive map showing the location searched and the available digital flood data for th...

65. [First Street Foundation releases new data disclosing the flood risk of ...](https://www.prnewswire.com/news-releases/first-street-foundation-releases-new-data-disclosing-the-flood-risk-of-every-home-in-the-contiguous-us-301084757.html) - People can look up a property's Flood Factor and learn more about its past, present, and future floo...

66. [How to use FIRMS API in Python](https://firms.modaps.eosdis.nasa.gov/content/academy/data_api/firms_api_use.html) - In this tutorial we will look into using FIRMS API to access up-to-date fire detections. We will cov...

67. [API - NASA | LANCE | FIRMS](https://firms.modaps.eosdis.nasa.gov/api/kml_fire_footprints/) - FIRMS makes URT data available in less than 60 seconds of satellite fly over for much of the US and ...

68. [Public Fire Information Websites | US Forest Service](https://www.fs.usda.gov/science-technology/fire/information) - InciWeb is an interagency all-risk incident information management system. The web-based program pro...

69. [Wildfire Explorer | Real-Time Maps & Incident Data for the US](https://fires.cornea.is) - Inciweb provides multiple RSS feeds that offer wildfire news, announcements, and incident summaries....

70. [National Fire News | National Interagency Fire Center](https://www.nifc.gov/fire-information/nfn) - Fire activity and firefighter engagement increased in several geographic areas in the past week. 18 ...

71. [Access the openFEMA API • rfema - Docs](https://docs.ropensci.org/rfema/) - Introduction. rfema allows users to access The Federal Emergency Management Agency's (FEMA) publicly...

72. [[PDF] Harnessing the Power of AI for Disaster Response and Preparedness](https://www.napsgfoundation.org/wp-content/uploads/2024/02/InSPIRE-2023-Presentation_Harnessing-the-Power-of-AI-for-Disaster-Preparedness-and-Response.pdf) - 50% of PA PDAs took 60 days or longer for declarations made from June 1, 2017 to June 1, 2023. Days ...

73. [FEMA (Independent Publisher) - Connectors - Microsoft Learn](https://learn.microsoft.com/en-us/connectors/fema/) - This action lists all official FEMA Disaster Declarations, beginning with the first disaster declara...

74. [rfema: Getting Started - Docs](https://docs.ropensci.org/rfema/articles/getting_started.html) - This vignette provides a brief overview on using the rfema package to obtain data from the Open FEMA...

75. [[PDF] NFIP Policies and Claims: Frequently Asked Questions (FAQ)](https://www.winterspringsfl.org/media/19221) - A: Anyone can use OpenFEMA to access the most current flood insurance claims and policies datasets (...

76. [FIMA NFIP Redacted Claims (OpenFEMA) - Catalog - Data.gov](http://catalog.data.gov/dataset/fima-nfip-redacted-claims-openfema) - FEMA administers NFIP by ensuring insurance applications are processed properly; determining correct...

77. [FAQs About Policies and NFIP Data](https://agents.floodsmart.gov/flood-maps-and-data/faqs-about-nfip-data) - Frequently asked questions and answers about NFIP policies and claims data, including public access,...

78. [duckdb-fema-nfip/README.md at main - GitHub](https://github.com/mebauer/duckdb-fema-nfip/blob/main/README.md) - This project examines both the NFIP Redacted Claims and Policies datasets, but more importantly, dem...

79. [First Street: The Standard for Climate Risk Financial Modeling](https://riskfactor.com) - We exist to make the connection between climate and financial risk at scale for financial institutio...

80. [First Street FAQ](https://help.firststreet.org/hc/en-us/articles/9680350042903-First-Street-FAQ) - First Street serves as a comprehensive climate risk assessment tool that can provide one-of-a-kind i...

81. [What is First Street? - Realtors Property Resource - RPR](https://blog.narrpr.com/support/what-is-first-street/) - RPR has partnered with First Street (formerly Risk Factor) – a free tool created by the nonprofit Fi...

82. [First Street API - GitBook](https://docs.firststreet.org/api) - First Street API. Comprehensive application programming interfaces for quantifying physical climate ...

83. [First Street Foundation and Arup release report that arms ...](https://www.prnewswire.com/news-releases/first-street-foundation-and-arup-release-report-that-arms-commercial-property-owners-with-new-data-to-better-prepare-for-flooding-301442672.html) - The report identifies the economic impact to metropolitan areas and states from lost days of product...

84. [OIR Issues Update on Florida's Property Insurance Market](https://floir.gov/home/2024/04/03/oir-issues-update-on-florida's-property-insurance-market) - In 2024, OIR has approved 13 companies to assume more than 354,000 policies from Citizens. In 2023, ...

85. [Citizens Property Insurance Corporation Depopulation Information](https://safepointla.com/citizens-property-insurance-corporation-depopulation-information/) - Through the depopulation process new or existing private insurance companies can assume policies cur...

86. [About Us - Texas FAIR Plan Association](https://www.texasfairplan.org/about-us/) - Texas FAIR Plan Association's mission is to provide essential property insurance products and servic...

87. [AIR Worldwide - Wikipedia](https://en.wikipedia.org/wiki/AIR_Worldwide) - AIR Worldwide specialized in catastrophe modeling software and services to manage the probability of...

88. [Cat bond modeller AIR Worldwide to rebrand under parent Verisk](https://www.artemis.bm/news/cat-bond-modeller-air-worldwide-to-rebrand-under-parent-verisk/) - AIR Worldwide was perhaps the first recognised catastrophe modeller for the global insurance and rei...

89. [[PDF] ProMetrix - Verisk](https://www.verisk.com/siteassets/media/cp-v/resources/est-loss-cost-report.pdf) - The. ProMetrix commercial property database provides loss costs and underwriting information on spec...

90. [PSOLD and ISO Rapid Valuator - Verisk](https://www.verisk.com/products/commercial-property-size-of-loss-database/) - Get decades of data for commercial property insurance with Verisk's Property Size of Loss Database a...

91. [Loss Cost Reports for Rating Commercial Property Insurance | Verisk](https://www.verisk.com/products/prometrix/loss-cost-reports/) - Our Estimated Loss Cost Quote Report gives you a quick, simple, and economical way to estimate both ...

92. [Do we rely too much on catastrophe modeling for insurance?](https://www.insurancebusinessmag.com/us/news/catastrophe/do-we-rely-too-much-on-catastrophe-modeling-for-insurance-485026.aspx) - Risk modeling businesses include: AIR Worldwide – part of Verisk; Moody's RMS – acquired by Moody's ...

93. [CoreLogic launches Hazard HQ catastrophe info hub](https://www.reinsurancene.ws/corelogic-launches-hazard-hq-catastrophe-info-hub/) - Hazard HQ will respond to the growing demand for comprehensive risk assessment resources with insigh...

94. [Key Insights from the 2025 CoreLogic® Severe Convective Storm ...](https://www.carriermanagement.com/brand-spotlight/cotality/weathering-the-storm-key-insights-from-the-2025-corelogic-severe-convective-storm-risk-report) - The 2025 CoreLogic Severe Convective Storm Risk Report provides critical insights into the frequency...

95. [[PDF] Impact Report - Cotality](https://pages.corelogic.com/hubfs/Archive/CoreLogic%20NA/Brand/2025%20Impact%20Report.pdf) - 2025 Cotality Impact Report. 27. Strong governance and oversight ... Hazard. HQ Command Central™ are...

96. [New Cotality Hurricane Risk Report Finds Associated Risks Are ...](https://www.businesswire.com/news/home/20250529587928/en/New-Cotality-Hurricane-Risk-Report-Finds-Associated-Risks-Are-Distorting-Property-Markets-in-Unexpected-Places) - Additionally, Cotality data shows homes in Virginia Beach, Va., remained on the market 32% longer in...

97. [Rate Filing Update and Hurricane Preparedness Message - TWIA](https://www.twia.org/rate-filing-update-and-hurricane-preparedness-message/) - As a reminder, TWIA's Board of Directors voted on August 6 to file a rate increase of 10% for reside...

98. [Integrate USGS Earthquake Hazards Program API](https://www.openassistantgpt.io/integrations/api-integrations/science-math/usgs-earthquake-hazards-program) - Earthquakes data real-time. Overview. The USGS Earthquake Hazards Program provides real-time earthqu...

99. [Field expertise paired with advanced computer modeling empowers ...](https://www.carriermanagement.com/brand-spotlight/verisk/field-expertise-paired-with-advanced-computer-modeling-empowers-data-driven-commercial-property-underwriting) - ISO's statistical team has built an advanced analytical model for over 11.3 million commercial prope...

100. [Aon tops reinsurance broker ranking on 2024 revenues, but Guy ...](https://www.reinsurancene.ws/aon-tops-reinsurance-broker-ranking-on-2024-revenues-but-guy-carpenter-ahead-in-2025/) - During the first half of 2025, though, Guy Carpenter has overtaken Aon Reinsurance Solutions, with r...

