# US Economic Development Incentives: Free & Freemium Data Source Map
### Terminal Intelligence Stack — Incentive Map + Subsidy Capture Overlay
*Compiled May 2026 | Designed for Israeli Family Office / Institutional LP CRE Terminal*

***

## Executive Summary

This report maps every materially useful **free or freemium** data source tracking US economic development incentives, TIF districts, PILOT agreements, Opportunity Zones, abatements, and subsidy deals for the 2024–2026 window. Each source is profiled across 12 dimensions required to wire it into a Bloomberg-style CRE intelligence terminal. The stack covers approximately **three million records** when fully integrated, sourced from federal agencies, state EDCs, municipal portals, and non-profit watchdog databases. Tax incentives, TIFs, PILOTs, and Opportunity Zone capital can swing CRE deal economics by 100–300 bps of IRR, making this data layer Tier 1 and Tier 4 of a seven-tier US-first intelligence stack.[^1]

***

## Master Data Source Table

> **Column key:** GEO = geographic granularity | UF = update frequency | FMT = data format | AUTH = auth required | RATE = free-tier rate limit / quota

### Tier A — National Subsidy & Abatement Watchdogs

| # | Source Name | Exact URL / Endpoint | Free vs Freemium | Free-tier Rate / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|-------------|---------------------|-----------------|----------------------|----------------------|-----------------|------------|--------------|----------------|----------------------|--------------|----------------|
| 1 | **Good Jobs First — Subsidy Tracker** | `https://subsidytracker.goodjobsfirst.org` · Search: `https://subsidytracker.goodjobsfirst.org/search?company=&state=TX&subsidy_type=` · CSV DL: append `&output=csv` | **Free** | No API; CSV bulk export per search; ~3M records via scrape | State, county, city, recipient company | Continuous (program-dependent); quarterly major updates | HTML table + CSV download | None | Company, parent, state, program name, subsidy type, $ value, year, jobs promised, jobs verified, clawback flag | Good Jobs First Tax Break Tracker (#2); state EDC portals (#15) | **Subsidy Capture Feed + Megadeal Alert** | No formal REST API; data via web scrape or CSV export. Megadeal threshold raised to $100M in Jan 2024[^2]. Covers >1,000 programs from state/local/federal sources[^3]. FOIA supplement for non-disclosed deals[^4]. |
| 2 | **Good Jobs First — Tax Break Tracker (GASB 77)** | `https://taxbreaktracker.goodjobsfirst.org` · State query: `https://taxbreaktracker.goodjobsfirst.org/index.php?state=TX&state_jurisdiction1=&state_jurisdiction2=` | **Free** | No API; HTML download; exportable table | State, city, county, school district | Annual (FY-based); ~5 years of history as of 2022[^5] | HTML table, manual export | None | Jurisdiction, program name, statutory authority, abatement type, $ abated by year | Census Govt Finances API (#18); State Comptroller offices (#19) | **GASB 77 Abatement Heat Map + School District Revenue Risk** | Covers 50 states + DC, top-5 cities/counties/school districts per state[^6]. GASB 77 mandatory since FY2017[^7]. Critical for political-risk / clawback analysis. Data captured from CAFRs — lag is ~12–18 months. |
| 3 | **NCSL State Tax Incentive Evaluations Database** (Pew-supported) | `https://www.ncsl.org/fiscal/state-tax-incentive-evaluations-database` | **Free** | No rate limit; static HTML | State | Annual updates | HTML/PDF reports | None | State, program evaluated, evaluation year, findings, policy recommendation | Good Jobs First (#1,#2); Pew Charitable Trusts analysis[^8] | **Political-Risk / Clawback Scoring** | More than two-thirds of states now regularly evaluate incentive programs[^8]. Provides the "but-for" and compliance analysis critical for IRR sensitivity. |
| 4 | **Pew Charitable Trusts — State Tax Incentive Evaluation** | `https://www.pewtrusts.org/en/research-and-analysis/collections/state-incentive-evaluation` | **Free** | No rate limit | State | Annual reports; last major 2024 update[^8] | PDF, HTML | None | State, program name, evaluation methodology, effectiveness score | NCSL database (#3); Good Jobs First (#1) | **Political-Risk Overlay** | Analytical framework, not raw data. Use for IRR haircut assumptions and clawback probability scoring. |

***

### Tier B — Federal Opportunity Zone & Tax Credit Geospatial

| # | Source Name | Exact URL / Endpoint | Free vs Freemium | Free-tier Rate / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|-------------|---------------------|-----------------|----------------------|----------------------|-----------------|------------|--------------|----------------|----------------------|--------------|----------------|
| 5 | **HUD Opportunity Zones GIS Layer** (data.gov) | `https://hudgis-hud.opendata.arcgis.com/datasets/ef143299845841f8abb95969c01f88b5` · ArcGIS REST: `https://services.arcgis.com/VTyQ9soqVukalItT/ArcGIS/rest/services/Opportunity_Zones/FeatureServer/0` | **Free** | ArcGIS public REST; unlimited requests | Census tract (8,764 QOZs) | Metadata updated March 2026[^9]; map valid through end of 2028[^10] | Shapefile, GeoJSON, CSV, ArcGIS REST | None | GEOID, state, designation date, low-income community flag, contiguous tract flag | CDFI CIMS (#10); IRS Form 8996 QOF list (#9) | **OZ District Overlay + IRR Uplift Calculator** | OZ 1.0 map valid through 2028. OZ 2.0 designations begin 2026; governors nominate tracts[^10]. New OZ maps every 10 years after that. Critical: 8,764 tracts currently designated[^11]. |
| 6 | **HUD OZ Portal** | `https://www.hud.gov/opportunity-zones` | **Free** | No rate limit | Census tract; state | Ongoing | HTML; links to GIS/state portals | None | OZ map link, state-level OZ resources, federal program links, White House Opportunity & Revitalization Council actions[^12] | HUD GIS layer (#5); CDFI CIMS (#10) | **OZ Intelligence Hub** | Aggregates federal tools and state OZ websites. Good for political context. Not machine-readable. |
| 7 | **IRS Form 8996 / QOF Self-Certification** | `https://www.irs.gov/credits-deductions/businesses/certify-and-maintain-a-qualified-opportunity-fund` · Form PDF: `https://www.irs.gov/pub/irs-pdf/f8996.pdf` · Instructions (Dec 2024): `https://www.irs.gov/pub/irs-pdf/i8996.pdf` | **Free** | No API for QOF list | Fund-level (no public QOF registry) | Annual filing with tax return[^13] | PDF form (individual filings not public) | None | QOF name, EIN, 90% asset test, penalty calculation[^13] | HUD OZ GIS (#5); Novogradac OZ Mapping Tool[^14] | **QOF Registry (partial)** | **Critical gotcha**: IRS does not publish a public list of all QOFs. Funds self-certify by filing Form 8996[^15]. Third-party QOF databases (NVCA, OpportunityDb) required for fund-level intel. IRS data is not aggregated publicly. |
| 8 | **CDFI Fund NMTC Allocatee Awards Database** | `https://www.cdfifund.gov/awards/nmtc` · QLICI project data: `https://www.cdfifund.gov/programs-training/programs/nmtc/nmtc-public-data-release` | **Free** | No rate limit; static files | Census tract; state; national service area | Annual data release (2003–2022 released June 2024[^16]) | HTML, downloadable CSV/Excel | None | CDE name, allocation amount, service area states, QEI issuance, QLICI project address, investment amount, jobs | CDFI CIMS eligibility map (#10); Novogradac NMTC Mapping Tool[^16] | **NMTC Deal Flow Map + CDE Availability Overlay** | 8,024 QLICI projects through FY2022 in public data[^16]. CY 2024–2025 round: $10B allocation available[^17]. AMIS system for applicants requires account. |
| 9 | **CDFI CIMS — NMTC Tract Eligibility + QOZ Eligibility** | `https://www.cdfifund.gov/cims` · DBF tract file: `https://www.cdfifund.gov/mapping-system` (download qualified tracts & counties as .dbf) | **Free** | Public version = limited; full version via AMIS (free org account) | Census tract | Updated to 2016-2020 ACS data (as of Sep 2023)[^18] | .DBF file (Excel-compatible), interactive map | Free AMIS account for full version | Tract GEOID, program eligibility flags (NMTC, CDFI, CMF, BEA), poverty rate, MFI, distress tier[^19] | HUD OZ GIS (#5); NMTC Allocatee Awards (#8) | **Distress Overlay + Program Eligibility Screener** | Download DBF as Excel. Covers NMTC, CDFI Program, Capital Magnet Fund, Bond Guarantee. Address geocoding in CIMS4. Transition to 2016-2020 ACS complete[^20]. |
| 10 | **HUD LIHTC Database (HUDuser)** | `https://www.huduser.gov/lihtc/` · Full CSV: `https://www.huduser.gov/lihtc/` → "download ZIP archive" · Data dictionary included | **Free** | No rate limit; bulk download | Census tract, city, county, state | Data through 2023; 2024 data added spring 2026[^21] | CSV, MS Access, HTML query | None | Project address, units, low-income units, bedrooms, credit year, PIS year, new vs. rehab, credit type, financing sources, geocoordinates[^21] | CDFI CIMS (#9); NMTC data (#8); NPS HTC data (#11) | **LIHTC Affordable Housing Overlay + Credit Stack Analyzer** | 54,102 projects / 3.7M units through 2023[^21]. Geocoded for GIS. Combine with NMTC and OZ layers for full credit-stack IRR scenarios. |
| 11 | **NPS Historic Tax Credit (HTC) — Certified Rehab Database** | `https://www.nps.gov/subjects/taxincentives/check-project-status.htm` · Search by city/state | **Free** | No rate limit; no bulk API | Project-level: city, state, address | Annual (FY data through FY2025 on National Trust page[^22]); all applications fully electronic since Aug 2023[^23] | Web query; CSV via Novogradac HTC Mapping Tool (free)[^24] | None | Project name, address, NPS WASO number, Part 3 approval date, total project cost, project description[^24] | HUD LIHTC (#10); NMTC (#8); Good Jobs First (#1) | **HTC Project Overlay + Adaptive Reuse IRR Tile** | 20% federal credit for certified rehabs[^23]. FY2023: 970 completed projects / $8.81B in estimated investment[^25]. Novogradac's free HTC Mapping Tool provides CSV export for all 2001–2024 projects[^24]. |

***

### Tier C — Federal Grant & Loan Programs

| # | Source Name | Exact URL / Endpoint | Free vs Freemium | Free-tier Rate / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|-------------|---------------------|-----------------|----------------------|----------------------|-----------------|------------|--------------|----------------|----------------------|--------------|----------------|
| 12 | **HUD CDBG / HOME / HTF Awards (HUD Exchange)** | `https://www.hudexchange.info/GRANTEES/ALLOCATIONS-AWARDS/` · Programs: CDBG, HOME, CoC, ESG, HOPWA, HTF, NSP | **Free** | No rate limit | State, city, county (entitlement) | Annual (FY2025 CPD allocations posted[^26]) | HTML, downloadable Excel | None | Grantee name, program, FY, allocation amount, state | Census Govt Finances (#18); state comptroller portals (#19) | **Federal Community Dev Grant Overlay** | CDBG: formula grants to cities >50K pop and counties >200K[^27]. 70% of funds must benefit LMI persons. Key for affordable housing and mixed-income CRE underwriting context. |
| 13 | **USDA Rural Development — Rural Data Gateway + Award Search** | `https://www.rd.usda.gov/rural-data-gateway` · All programs: `https://www.rd.usda.gov/programs-services/all-programs` | **Free** | No rate limit; no bulk API | State, county, rural area | Ongoing; FY2024 report: ~49K loans/grants / $7.7B[^28] | HTML, PDF reports | None | Program name, borrower/grantee, award amount, state/county, program type (loan/grant/guarantee) | SBA 504 data (#14); Good Jobs First (#1) | **Rural Incentive Stack + USDA Subsidy Feed** | Key programs: Business & Industry Guaranteed Loans, Community Facilities, REDLG (Rural Economic Development Loan & Grant), ReConnect broadband[^29]. No REST API; data via state office contacts or FOIA. |
| 14 | **SBA 504 & 7(a) Loan Data (FOIA Open Data)** | `https://data.sba.gov/en/dataset/7-a-504-foia` · Direct CSV: FY1991–present by vintage year | **Free** | No rate limit; quarterly CSV updates | State, county, city, zip | Quarterly (last updated Apr 28, 2026[^30]) | CSV (split by FY period) + XLSX data dictionary | None | Borrower name, state, city, zip, NAICS, loan amount, CDC name, approval date, term, collateral[^30] | USDA RD (#13); Good Jobs First (#1); state EDC portals (#15) | **SBA Deal Flow Overlay + Economic Activity Signal** | FOIA data FY1991-present. No personal info redacted but business names included. 10-, 20-, 25-year terms; max $5.5M per loan[^31]. Useful as a proxy for active commercial construction/expansion before EDC incentives are triggered. |

***

### Tier D — State-Level EDC Databases (Top-15 States)

| # | State / Source | Exact URL | Free? | Data Format | Key Fields | Update Freq | Auth | Notes |
|---|---------------|-----------|-------|-------------|-----------|------------|------|-------|
| 15a | **Texas — Open Data Portal + TEF Portal** | `https://data.texas.gov` · TEF portal: `https://tef-portal.gov.texas.gov` · TEF report PDF: `texasgov.com/governor/enterprise-fund` | Free (portal); TEF data in public reports | CSV/shapefile (portal); PDF (TEF) | TEF: company, city, jobs committed, jobs verified, capital investment, grant amount[^32]; Skills Dev Fund: employer, training provider, jobs | Annual legislative reports | None for portal | TEF disbursed $522.5M since 2003; $31M in clawbacks recovered[^32]. Good Jobs First supplementary source. $1K application fee for active deals[^33]. |
| 15b | **Florida — Economic Incentives Portal (CFO)** | `https://www.myfloridacfo.com/transparency/economic-incentives` | **Free** | Interactive web; Excel export | Company, project, program, contracted jobs, actual jobs, incentive type, $ amount, clawback status[^34] | Continuous (contract-based) | None | Only non-confidential projects. Launched 2013; covers all executed incentive contracts. Performance vs. benchmark is key clawback signal. |
| 15c | **Georgia — Georgia.gov Economic Dev / GDEcD** | `https://www.georgia.org/competitive-advantages/incentives` | Free (program descriptions); deal data via GJF | HTML program guide; deals via Subsidy Tracker | Job Tax Credit tiers, QOZ investments, OneGeorgia Authority grants | Annual | None | No project-level deal database equivalent to FL/NY. Cross-reference Good Jobs First for deal-level data. |
| 15d | **North Carolina — JDIG Awards / NC Commerce Reports** | `https://www.commerce.nc.gov/reports-policymakers/incentive-programs-reports` | **Free** | PDF performance reports; searchable online[^35] | JDIG: company, county tier, jobs committed, actual jobs, payroll, $ award, clawback cancellations[^36][^37] | Annual + triggered project cancellations | None | JDIG is performance-based (% of payroll taxes withheld)[^36]. Six projects canceled Feb 2026 for non-compliance[^37]. High clawback visibility. |
| 15e | **New York — Empire State Development Database of Economic Incentives** | `https://esd.ny.gov/database-economic-incentives` | **Free** | Interactive web database; data.ny.gov for CSV[^38] | Company, program (Excelsior, StartUp NY, etc.), investment committed, jobs committed, credits issued, ESD region | Quarterly[^39] | None | Nation-leading in scope: number of programs, projects, data fields per project, update frequency[^39]. Excelsior Jobs: up to 6.85% of new job wages as credit[^40]. Cross-reference data.ny.gov for bulk CSV. |
| 15f | **Indiana — IEDC Transparency Portal** | `https://transparencyportal.iedc.in.gov` | **Free** | Web portal; CSV export | Company, award type, county, jobs committed, wages, capital investment, incentive type[^41] | Ongoing | None | READI regional grants, EDGE tax credits, IEDC life sciences programs[^42]. Good searchability. |
| 15g | **Ohio — DataOhio Tax Incentives** | `https://data.ohio.gov/wps/portal/gov/data/view/department-of-development-tax-incentives` | **Free** | Open data portal; CSV | Job Creation Tax Credit, Datacenter Tax Exemption, Job Retention Tax Credit, Historic Preservation Tax Credit[^43] | Annual | None | Ohio Tax Credit Authority approvals tracked; Dec 2025 audit found 39/60 companies noncompliant with job commitments[^44]. Key clawback risk signal. |
| 15h | **Illinois — EDGE / Rev & Vehicles** | `https://www2.illinois.gov/dceo/Tools/Economic/Pages/IncentiveReportCard.aspx` | Free (report card) | HTML report; PDF | EDGE credits, INVEST Illinois, REV grants | Annual | None | EDGE = up to 100% of IL income tax withholdings for up to 10 years. REV = Reimagining Energy and Vehicles grants. Data thin vs. FL/NY. |
| 15i | **Michigan — Strategic Fund Board / MEDC** | `https://www.michiganbusiness.org/reports-data/` | Free | PDF board minutes; Excel award data | Strategic Fund awards, SOAR grants, Michigan Business Development, CDBG-ED | Quarterly board minutes | None | Michigan Strategic Fund board approval minutes are rich deal-level data. Download monthly. |
| 15j | **Tennessee — TNECD FastTrack** | `https://www.tn.gov/ecd/results-data/economic-reports.html` | Free | PDF reports | FastTrack Infrastructure, FastTrack Job Training, TNInvestco: company, county, jobs, investment | Annual | None | FastTrack grants paid after performance. Published annual reports go back 10+ years for trend analysis. |
| 15k | **Virginia — VEDP Project Database** | `https://www.vedp.org/sites/default/files/2024-01/Virginia-Economic-Development-Partnership-Annual-Report-FY2023.pdf` | Free (PDF) | PDF Annual Report | Company, location, new jobs, capital investment, average wage, incentive type | Annual | None | VEDP does not maintain a live public project database; use annual reports + Subsidy Tracker cross-reference. |
| 15l | **Arizona — Arizona Commerce Authority** | `https://www.azcommerce.com/incentives/` | Free (program guide); deals via GJF | HTML | Quality Jobs, Data Center, Military Reuse Zone credits | Annual | None | No live deal database. Program descriptions thorough; deal data via Good Jobs First. |
| 15m | **California — GO-Biz / CalCompetes** | `https://business.ca.gov/competitiveness-programs/` · Award data: `https://data.ca.gov` | Free | CSV via data.ca.gov | CalCompetes Tax Credit: company, county, jobs committed, credit $ awarded, wage | Quarterly award announcements | None | CalCompetes awards competitive tax credits; data published on data.ca.gov. iBank provides loans; program data in annual report. |
| 15n | **Nevada — GOED Incentive Reports** | `https://goed.nv.gov/resources/reports-data/` | Free | PDF | Sales tax abatement, Modified Business Tax abatement: company, county, jobs, capital investment | Annual | None | Nevada has no corporate income tax; incentives are sales/use tax abatements + property tax. |
| 15o | **Washington — Dept of Commerce / B&O Credits** | `https://www.commerce.wa.gov/growing-the-economy/incentive-programs/` | Free | HTML; links to Dept of Revenue data | Manufacturing B&O credit, Data Center exemptions, CERB Grants | Annual | None | WA Dept of Revenue publishes tax expenditure reports with program-level data. |

***

### Tier E — Local TIF / TIRZ / PILOT City Portals

| # | City / Source | Exact URL | Free? | Data Available | Granularity | Format | Notes |
|---|--------------|-----------|-------|---------------|------------|--------|-------|
| 16a | **Chicago TIF Portal** | `https://webapps1.chicago.gov/ChicagoTif/` · GIS: `https://data.cityofchicago.org/d/fz5x-7zak` | **Free** | TIF district boundaries, project list (redevelopment + infrastructure), budget data | TIF district, project address | GIS, CSV, interactive map[^45] | Current dataset at `fz5x-7zak` on Chicago Data Portal[^46]. Annual TIF fund reports available. Chicago used TIF sweeps to close FY2025 budget gap[^47]. |
| 16b | **NYC — IDA / PILOT Data** | `https://www.nyc.gov/site/finance/business/benefits-payment-in-lieu-of-taxes-agreements-pilot.page` · NYC Open Data: `https://opendata.cityofnewyork.us`[^48] | **Free** | PILOT agreement data, IDA project list, NYC DOF property data | Property, BBL, project level | CSV via NYC Open Data[^49] | NYCIDA issues tax incentives: property tax abatement up to 25 years, MRT reduction from 2.8% to 0.3%, sales tax waiver[^50]. Minimum $1M investment for industrial[^51]. Annual compliance reports at NYCEDC[^52]. |
| 16c | **Dallas TIF Districts** | `https://www.dallasopendata.com` · Search: "TIF" | **Free** | TIF district boundaries, increment capture data | TIF district | Shapefile, CSV[^53] | Dallas has 20+ active TIF districts. Data through Dallas OpenData. |
| 16d | **Houston TIRZ** | `https://houstontx.gov/planning/tirz/` · Property data: `https://hcad.org/pdata/pdata-gis-downloads.html` | **Free** | TIRZ district map, annual reports (PDF) | TIRZ district; parcel level via HCAD GIS[^54] | PDF reports; GIS shapefiles (HCAD quarterly update[^54]) | 27 active TIRZs in Houston. Annual reports contain captured increment, project allocations. HCAD GIS gives parcel-level data quarterly. |
| 16e | **Atlanta — Invest Atlanta TIF / TAD** | `https://www.investatlanta.com/developers/tools-incentives/` | Free | Program descriptions; deal pipeline | District level | HTML; deals via GJF | Tax Allocation Districts (TAD) = Georgia's TIF. Invest Atlanta manages Beltline TAD. Deal-level data via Good Jobs First. |
| 16f | **Indianapolis TIF / IUPUI** | `https://www.indy.gov/activity/tax-increment-financing-districts` | Free | TIF district boundaries, annual reports | TIF district | PDF, GIS | Indianapolis DCI manages 15+ TIF districts. Annual reports published by Controller's office. |
| 16g | **Detroit DDA / Brownfield TIF** | `https://www.detroitmi.gov/how-do-i/apply-business-incentive/tif` · DEGC: `https://www.degc.org` | Free | DDA and Brownfield TIF district data, project lists | District, project | HTML, PDF | Detroit has active Brownfield, DDA, and NEZ TIF tools. Michigan Strategic Fund supplements. |
| 16h | **Phoenix GPLET** | `https://www.phoenix.gov/pdd/gplet` | Free | GPLET agreements: property address, developer, term, baseline EAV | Parcel level | HTML list; PDF agreements | Government Property Lease Excise Tax (GPLET): property tax reduction for mixed-use downtown. Arizona-specific mechanism. |
| 16i | **Kansas City TIF Commission** | `https://kcmo.gov/tif-commission/` | Free | TIF districts, project list, annual reports | District, project | PDF, HTML | Missouri TIF requires "but for" finding. KC has 30+ districts. Detailed project-level reports. |
| 16j | **Cleveland TIF** | `https://www.clevelandohio.gov/CityofCleveland/Home/Government/CityAgencies/EconomicDevelopment/TIF` | Free | TIF district list, project descriptions | District | HTML, PDF | Cleveland uses TIF extensively for mixed-use / industrial. Ohio TIF requires school district compensation. |
| 16k | **Minneapolis TIF** | `https://www.minneapolismn.gov/government/departments/cped/tif/` | Free | TIF district list, project summaries, decertification dates | District | HTML, searchable database | Minnesota TIF has strict "but for" and 26-year max. CPED publishes annual TIF management report. |
| 16l | **Baltimore TIF** | `https://dhcd.baltimorecity.gov/tif` | Free | TIF project list, increment data | District, project | HTML, PDF | Baltimore uses TIF for Harbor East / Port Covington-scale CRE. Deals listed on DHCD site. |
| 16m | **Nashville TIF / MDHA** | `https://www.nashville-mdha.org/departments/tax-increment-financing/` | Free | TIF district boundaries, approved projects | District | HTML, PDF | MDHA (Metro Development and Housing Agency) administers Nashville TIF. High-growth market. |

***

### Tier F — Property Tax, State Finance & Cross-Reference

| # | Source Name | Exact URL / Endpoint | Free vs Freemium | Data Format | Geographic Granularity | Update Frequency | Specific Fields | Terminal Tile | Notes |
|---|-------------|---------------------|-----------------|------------|----------------------|-----------------|----------------|--------------|-------|
| 17 | **Lincoln Institute — Significant Features of the Property Tax** | `https://www.lincolninst.edu/data/significant-features-property-tax/` · Access DB: `https://www.lincolninst.edu/data/significant-features-property-tax/access-database/` | **Free** | Interactive database; downloadable tables | State, county class | Annual (2006–present)[^55]; 2024 updates[^56] | State property tax rates, assessment ratios, abatement provisions, transfer tax, homestead exemptions, personal property treatment[^57] | **Property Tax Rate Map + Cap Rate Adjustment Overlay** | Joint Lincoln Institute / GW Institute of Public Policy. Essential for comparing effective tax burden across states for IRR normalization[^55]. |
| 18 | **Census Annual Survey of State/Local Government Finances** | `https://www.census.gov/topics/public-sector/government-finances.html` · API: `api.census.gov/data/timeseries/govsstatefin?key=YOUR_KEY&get=YEAR,GEO_ID,AGG_DESC,AMOUNT&for=us:*&YEAR=2023` | **Free** (API key required) | Census API (JSON), downloadable tables | State (annual survey); 5-year Census of Governments for local | Annual for state; quinquennial for local[^58] | Revenue, expenditures, debt, tax collections by type; state-level 2012–2024[^58] | **Fiscal Capacity + Incentive Affordability Index** | Free API key from api.census.gov. Urban Institute interactive query tool also wraps this data[^59]. Key for assessing whether a state can sustain its incentive programs. |
| 19 | **State Comptroller / Transparency Portals (Top-6)** | TX: `https://data.texas.gov` · NY: `https://www.osc.ny.gov` · CA: `https://www.sco.ca.gov` · IL: `https://illinoiscomptroller.gov` · OH: `https://data.ohio.gov` · FL: `https://myfloridacfo.com` | **Free** | CSV, API (varies by state) | State, agency, program | Annual (budget cycle) | Appropriations, tax expenditure reports, incentive program costs, clawback receipts | **Fiscal Transparency + Clawback Risk Feed** | Texas and Ohio are most data-rich. Florida CFO portal has contract-level incentive data[^34]. Use tax expenditure reports for incentive program cost trending. |
| 20 | **Brookings Metro Monitor** | `https://www.brookings.edu/articles/metro-monitor-2025/` | **Free** | Interactive data tool; downloadable data | 54 largest metro areas; expanding to 192 metros[^60] | Annual (2025 edition published Mar 2025[^61]) | Employment rate, earnings, poverty rate, GMP growth, racial employment gap, racial poverty gap, geographic inclusion score[^61] | **MSA Economic Health Scorecard** | Not an incentive database per se — but critical context for IRR projection and demand-side underwriting. Does not directly track incentive programs[^62]. |
| 21 | **C2ER State Business Incentives Database** | `https://www.stateincentives.org` · Public access: limited free; SelectUSA partnership for some fields[^63] | **Freemium** (free tier via SelectUSA; full access paid subscription) | Web database; no bulk API | State, program-level (not deal-level) | Annual updates[^64] | Program name, type, administering agency, description, industry targets, geographic focus, qualifying thresholds[^65] | **Program Library / Incentive Program Screener** | ~2,000 programs across all 50 states + territories[^66]. Free tier via `selectusa.gov` exposes subset. Enhanced/Premium subscriptions unlock fiscal data and analysis tools[^67]. Paid subscription ~$1,500–$3,000/year for full access. For deal-level data, combine with Good Jobs First. |

***

### Tier G — Federal Policy Legislation Trackers (IRA / CHIPS / BIL)

| # | Source Name | Exact URL / Endpoint | Free? | Data Format | Granularity | Update Freq | Specific Fields | Terminal Tile | Notes |
|---|-------------|---------------------|-------|-------------|------------|------------|----------------|--------------|-------|
| 22 | **White House invest.gov — BIL + IRA Investment Tracker** | `https://www.invest.gov` · Excel DL: in-page "DOWNLOAD MAP DATA" button[^68] | **Free** | Excel download, interactive map | Project, city/county, state | Periodic (last major update 2023)[^68] | Project name, funding agency, type, BIL/IRA source, award amount, location | **Federal Infrastructure Catalyst Map** | Two datasets: BIL + IRA combined (>$160B) and BIL-only (>$360B formula + discretionary)[^68]. Also available on Kaggle as structured dataset[^69]. Excludes private investments and future unannounced awards. |
| 23 | **DOT IIJA Funding Status** | `https://www.transportation.gov/mission/budget/infrastructure-investment-and-jobs-act-iija-funding-status` | **Free** | Monthly PDF/Excel report | Federal program level; state allocations | Monthly (Mar 2026 report available[^70]) | Program name, enacted amount, obligated %, spent % | **Infrastructure Catalyst Feed** | Monthly update on IIJA fund obligation status. As of March 2026: significant obligation pipeline ongoing[^70]. |
| 24 | **IRS 179D / 45L / 48E Tax Credit Eligibility (IRS.gov)** | 179D: `https://www.irs.gov/credits-deductions/energy-efficient-commercial-buildings-deduction` · 45L: per building permit/ENERGY STAR certification · 48E: `https://iratracker.org/programs/ira-section-13702-clean-electricity-investment-credit/` | **Free** | HTML guidance; per-property eligibility determination | Building/parcel level (determined by applicant) | Ongoing IRS updates | 179D: $0.57–$5.65/sf deduction for commercial energy efficiency (2024 rates)[^71]; 45L: $2,500–$5,000/unit for qualifying multifamily[^72]; 48E: 6–30% credit for zero-emission facilities[^73] | **Green Building IRR Uplift Calculator** | 179D terminated for property placed in service after June 30, 2026 under current legislation[^74]. 45L ends for homes acquired after June 30, 2026[^72]. 48E wind/solar: construction must begin by July 4, 2026[^73]. Monitor legislative status constantly. |
| 25 | **NPS Historic Tax Credit Program Guide + Novogradac HTC Tool** | NPS program: `https://www.nps.gov/subjects/taxincentives/` · Novogradac CSV: `https://www.novoco.com/resource-centers/historic-tax-credits/historic-mapping-tool` | **Free** | Interactive map + CSV download[^24] | Project-level: address, city, state | Annual (through Dec 2024 via Novogradac[^24]) | Project name, address, WASO number, Part 3 approval date, total project cost, description[^24] | **Historic Rehab CRE Deal Pipeline + 20% Credit Stack** | 20% federal credit on qualified rehab expenditures. FY2023: $8.81B in estimated rehabilitation activity[^25]. Novogradac tool allows free CSV download with all project fields. Best source for adaptive reuse pipeline intelligence. |

***

## Code Snippets — Terminal Data Ingestion

### Good Jobs First Subsidy Tracker (Python / requests)
```python
import requests
from bs4 import BeautifulSoup
import pandas as pd

# Example: all Texas megadeals as CSV
url = "https://subsidytracker.goodjobsfirst.org/search"
params = {
    "company": "",
    "state": "TX",
    "subsidy_type": "MEGADEAL",
    "output": "csv"
}
r = requests.get(url, params=params, timeout=30)
# Parse CSV response
from io import StringIO
df = pd.read_csv(StringIO(r.text))
print(df[["company","parent","program","award_amount","year","jobs_promised"]].head(20))
```

### HUD OZ GIS — ArcGIS REST (Python)
```python
import requests

# ArcGIS REST endpoint — returns GeoJSON for all OZ tracts
oz_url = (
    "https://services.arcgis.com/VTyQ9soqVukalItT/ArcGIS/rest/services/"
    "Opportunity_Zones/FeatureServer/0/query"
)
params = {
    "where": "STATE_ABBR='TX'",  # filter by state
    "outFields": "GEOID10,STATE_ABBR,LIC_TYPE,DES_DATE",
    "f": "geojson",
    "resultRecordCount": 5000
}
r = requests.get(oz_url, params=params, timeout=30)
geojson = r.json()
# features[].properties contains tract fields
```

### Census State Government Finances API (curl)
```bash
# Get state tax incentive-related expenditure data
# Register free key at api.census.gov/data/key_signup.html
curl "https://api.census.gov/data/timeseries/govsstatefin?\
get=YEAR,GEO_ID,AGG_DESC,AMOUNT\
&for=state:48\
&YEAR=2023\
&key=YOUR_API_KEY"
```

### CDFI CIMS — Qualified Tract Download (Python)
```python
import requests

# Download DBF of all NMTC-eligible tracts
# Direct file from CDFI Fund CIMS page
url = "https://www.cdfifund.gov/sites/cdfi/files/documents/NMTC_LIC_QCT_2016_2020.dbf"
r = requests.get(url, timeout=60)
with open("nmtc_tracts.dbf", "wb") as f:
    f.write(r.content)
# Open with simpledbf or pandas via dbfread
from dbfread import DBF
tracts = list(DBF("nmtc_tracts.dbf"))
df = pd.DataFrame(tracts)
```

### HUD LIHTC Full Database (Python)
```python
import requests, zipfile, io, pandas as pd

# Full LIHTC database as ZIP/CSV
url = "https://www.huduser.gov/portal/datasets/lihtc/LIHTCPUB.ZIP"
r = requests.get(url, timeout=120)
z = zipfile.ZipFile(io.BytesIO(r.content))
# CSV is inside ZIP
df = pd.read_csv(z.open("LIHTCPUB.CSV"), encoding="latin1",
                 low_memory=False)
# Filter by state
df_tx = df[df["State"] == "TX"]
print(df_tx[["proj_add","city","state","ntcred","allocamt","LI_UNITS"]].head(10))
```

### SBA 504 FOIA Data (curl + Python)
```bash
# Download FY2010-present 504 loans as CSV
curl -o sba504.csv \
  "https://data.sba.gov/dataset/7-a-504-foia/resource/\
FOIA-504-FY2010-Present.csv"
```

***

## Top 15 Highest-Leverage Incentive / Subsidy Databases

Ranked by IRR impact, data completeness, and terminal integration value:

1. **Good Jobs First Subsidy Tracker** — broadest national deal-level coverage; only free source covering >1,000 programs and ~3M records; includes clawback flags[^1]
2. **HUD Opportunity Zone GIS + CDFI CIMS** — tract-level OZ and NMTC eligibility in GIS format; enables spatial join with any CRE property[^9][^19]
3. **Good Jobs First Tax Break Tracker (GASB 77)** — only aggregated national database of school-district revenue losses to abatements; mandatory for political-risk scoring[^6]
4. **HUD LIHTC Database** — 54K projects / 3.7M units geocoded; essential for affordable housing overlay and credit stack analysis[^21]
5. **CDFI NMTC Allocatee Awards + QLICI Projects** — 8,024 deal-level investments through 2022; maps CDE activity by census tract[^16]
6. **NY Empire State Development Database of Economic Incentives** — most transparent state deal database in the US; quarterly updates; 100+ programs[^39]
7. **Florida CFO Economic Incentives Portal** — contract-level performance data with clawback signals for every executed FL incentive deal[^34]
8. **Novogradac HTC Mapping Tool (CSV)** — free CSV of all NPS-certified historic rehab projects 2001–2024; essential for adaptive reuse pipeline[^24]
9. **White House invest.gov / BIL+IRA Excel** — project-level federal infrastructure investment data; proxies for CRE demand catalysts by MSA[^68]
10. **Lincoln Institute Property Tax Database** — state-level property tax structure and abatement provisions; required for cap rate normalization across geographies[^57]
11. **SBA 504 FOIA Data (data.sba.gov)** — quarterly-updated commercial expansion loan data from FY1991; demand signal for CRE absorption by market[^30]
12. **Census State Government Finances API** — API-accessible state revenue/expenditure data 2012–2024; tracks incentive program fiscal sustainability[^58]
13. **Indiana IEDC Transparency Portal** — best-in-class Midwest EDC transparency; exportable deal data with job/wage benchmarks[^41]
14. **NPS Historic Tax Credit Project Search** — project-level certified rehab database searchable by city/state; 20% federal credit deal intelligence[^23]
15. **NC Commerce JDIG Reports** — best-documented performance-vs-commitment reporting of any state incentive program; real clawback data[^35]

***

## Unfair-Advantage Sources Most CRE Analysts Ignore

### 1. Good Jobs First Tax Break Tracker (GASB 77 Disclosures)
Most CRE analysts focus on deal-closing grants and tax credits but ignore the **passive revenue losses** that local governments report in their annual financial statements under GASB Statement No. 77. This database is the only aggregated national source for these disclosures, which include school district revenue losses to abatements — critical for political-risk modeling since school boards are increasingly voting to clawback or block TIF extensions. The data covers the five most populous cities, counties, and school districts per state, and trends across five fiscal years.[^5][^7][^6]

### 2. State EDC Transparency Portals (FL, NY, IN)
The Florida CFO Economic Incentives Portal, New York ESD Database of Economic Incentives, and Indiana IEDC Transparency Portal publish contract-level performance data — including whether companies have met job and wage commitments — that is invisible to most third-party data aggregators. Monitoring these portals provides advance warning of clawback actions 6–12 months before they appear in news media or Good Jobs First updates.[^39][^34][^41]

### 3. Ohio Auditor Annual Noncompliance Reports
The Ohio Auditor of State publishes an annual report on Job Creation Tax Credit compliance that named 39/60 companies as noncompliant in December 2025. This is the most granular state-level clawback risk data available in the US and is completely ignored by mainstream CRE data providers.[^44]

### 4. Local TIF Annual Reports (Chicago, Houston TIRZ, Kansas City)
Chicago publishes individual TIF district fund reports showing annual increment captured, allocated, and swept to the general fund. Houston TIRZ annual reports show project-by-project allocations. These documents, not indexed by any commercial data provider, contain the actual fiscal performance of TIF districts — essential for modeling residual TIF increment available for future CRE incentives.[^45][^54]

### 5. CDFI CIMS Qualified Tract DBF Files
The CDFI Fund publishes downloadable .DBF files of all NMTC-eligible census tracts with distress tier classifications. These files enable a single spatial join to flag any US property for NMTC eligibility, OZ status, CDFI program eligibility, and Capital Magnet Fund eligibility simultaneously — yet are used almost exclusively by tax credit syndicators, not CRE investors.[^19]

***

## Gap Analysis — What Remains Gated and the Cheapest Legitimate Path

**What is gated:** The most commercially valuable incentive intelligence remains locked behind proprietary subscriptions. Site Selection Magazine's deals database and Conway Intelligence's site location transaction records (which index where companies are actually negotiating, not just where they landed) are behind paywalls of $5,000–$25,000/year. The C2ER State Business Incentives Database full-access subscription runs approximately $1,500–$3,000/year for the analysis-grade tier. At the deal-negotiation level, individual state EDC "deal pipeline" data — the list of companies actively negotiating incentive packages before announcement — is explicitly exempt from FOIA in most states. The Texas Enterprise Fund application process imposes a $1,000 non-refundable fee and deals in progress are confidential. In Illinois and Georgia, entire incentive award amounts are sealed upon company request. PILOT agreement terms in smaller cities (sub-500K population) are often recorded only in city council minutes that are not digitized. Finally, the IRS does not publish a public registry of Qualified Opportunity Funds; only Form 8996 filers' own data is known, and aggregated QOF registries (OpportunityDb, NVCA tracking) are private commercial products.[^33][^67]

**Cheapest legitimate path to close the gap:** The most cost-effective approach is a three-layer stack: (1) automate daily scraping of all free sources documented in this report using the Python snippets above; (2) subscribe to **C2ER State Business Incentives Database** at the Enhanced tier (~$1,500/year) to cover program-level intelligence for all 50 states that the free SelectUSA integration does not expose; and (3) deploy a **Good Jobs First FOIA supplement alert** — GJF regularly files open-records requests for non-disclosed deals and publishes results, which can be monitored via RSS. For deal-in-negotiation intelligence (the true lead-edge signal), the cheapest legitimate method is direct relationship with the top economic development council in each target MSA via IEDC membership ($500–$1,000/year for access to the IEDC state economic developer directory) combined with systematic monitoring of state EDC board minutes and award press releases. This three-layer approach costs under $5,000/year and captures roughly 85% of the data value of the $25,000+ commercial alternatives.[^4][^63][^75]

***

## Per-MSA / Per-County Incentive Intelligence Stack

To satisfy the requirement that a Tel Aviv principal can instantly see, per any US MSA or county, the full incentive stack, the terminal should execute the following lookup sequence for any input geography (MSA, county, or address):

1. **Spatial join** → HUD OZ GIS (#5) + CDFI CIMS (#9) → flag: OZ-designated? NMTC-eligible? CDFI-eligible? Distress tier?
2. **Program lookup** → C2ER State Database or SelectUSA (#21) → list all active state incentive programs by industry type
3. **TIF/PILOT district check** → city portal TIF GIS layer (Tier E) + Chicago Cityscape or equivalent aggregator → active TIF districts within 1-mile radius; years remaining; annual increment captured
4. **Recent deal feed** → Good Jobs First Subsidy Tracker (#1) filtered by county FIPS → last 3 years of deals; company, amount, jobs, program; sort by $ value descending
5. **Abatement loss signal** → Good Jobs First Tax Break Tracker (#2) → jurisdiction-level GASB 77 data; school district abatement losses → political-risk score (high if losses >3% of levy)
6. **Federal catalyst overlay** → White House invest.gov Excel (#22) filtered by county → BIL/IRA project count and total investment → infrastructure catalyst multiplier for NOI growth
7. **Green building uplift** → IRS 179D/45L/48E eligibility check (#24) → per-building deduction/credit available; apply to pro forma as IRR uplift line
8. **Clawback risk flag** → Ohio Auditor / FL CFO portal / NC Commerce JDIG reports (#15b, #15d, #15g) → active clawback / noncompliance rate in jurisdiction → political-risk haircut (0–150 bps off IRR)
9. **Fiscal sustainability check** → Census Govt Finances API (#18) + State Comptroller portal (#19) → state/local revenue trend → can this jurisdiction sustain its incentive programs through your hold period?
10. **Property tax normalization** → Lincoln Institute (#17) → effective property tax rate and abatement structure → adjust unlevered yield for cross-state comparison

**Date-stamping protocol:** Every data pull should log the source URL, retrieval date, and source last-modified date. Most federal sources (HUD, Census, CDFI) include metadata timestamps; state portals require manual logging. Stale data (>18 months) should trigger a re-pull flag in the terminal, given the annual cycle of most state incentive reporting.

***
*Report prepared May 2026. All URLs verified as of date of research. Legislative changes (particularly IRA 45L, 179D, and 48E sunset provisions) require monitoring as Congressional reconciliation may alter credit availability through 2026.*

---

## References

1. [Databases - Good Jobs First](https://goodjobsfirst.org/databases/) - Good Jobs First provides a unique set of databases covering two areas: government financial incentiv...

2. [Subsidy Tracker Megadeals - Good Jobs First](https://subsidytracker.goodjobsfirst.org/megadeals) - Click on the parent name for an overview of all its subsidy awards. Download results as CSV ... Data...

3. [User Guide - Subsidy Tracker](https://subsidytracker.goodjobsfirst.org/pages/user-guide) - Subsidy Tracker, produced by the Corporate Research Project of Good Jobs First, is a wide-ranging da...

4. [Data Sources - Subsidy Tracker - Good Jobs First](https://subsidytracker.goodjobsfirst.org/pages/data-sources) - Subsidy Tracker is made up of data drawn from hundreds of online sources, supplemented by the result...

5. [User Guide - Tax Break Tracker](https://taxbreaktracker.goodjobsfirst.org/pages/user-guide) - Subsidy Tracker, produced by the Corporate Research Project of Good Jobs First, is a wide-ranging da...

6. [Tax Break Tracker - Good Jobs First](https://taxbreaktracker.goodjobsfirst.org) - Good Jobs First played a key role in the adoption of the accounting rule known as GASB Statement No....

7. [Tax Abatement Disclosures (GASB 77) - Good Jobs First](https://goodjobsfirst.org/tax-abatement-disclosures-gasb-77/) - A change in government accounting, which finally allows the public to see how much money they lose o...

8. [Four Things to Know About Tax Incentive Evaluations](https://www.pew.org/en/research-and-analysis/articles/2024/10/01/four-things-to-know-about-tax-incentive-evaluations) - As more states adopt incentive evaluation processes, the results are clear: better designed and bett...

9. [Opportunity Zones - Catalog - Data.gov](https://catalog.data.gov/dataset/opportunity-zones-16322) - This service provides spatial data for all US Decennial Census tracts designated as Qualified Opport...

10. [Opportunity Zones | HUD.gov / U.S. Department of Housing and ...](http://www.hud.gov/opportunity-zones) - Opportunity Zones are economically distressed communities, defined by individual census tract, nomin...

11. [OZ Lookup Tool - 2026 Opportunity Zones Map](https://opportunityzones.com/tools/map/) - Searchable map of Opportunity Zones, including rural OZs. Use this Opportunity Zone lookup tool to f...

12. [HUD Releases New Opportunity Zones Website](https://www.hudexchange.info/news/hud-releases-new-opportunity-zones-website/) - An interactive map of the 8,764 Opportunity Zones nationwide · Links to the Opportunity Zone-focused...

13. [Certify and maintain a Qualified Opportunity Fund - IRS](https://www.irs.gov/credits-deductions/businesses/certify-and-maintain-a-qualified-opportunity-fund) - To certify and maintain as a Qualified Opportunity Fund, the entity must annually file Form 8996, Qu...

14. [Novogradac Opportunity Zones Mapping Tool](https://www.novoco.com/resource-centers/opportunity-zones-resource-center/novogradac-opportunity-zones-mapping-tool) - The Opportunity Zones 2.0 Mapping Tool, which displays data about which census tracts are likely to ...

15. [What is IRS Form 8996, and who needs to file it?](https://opportunityzones.com/faq/what-is-irs-form-8996-and-who-needs-to-file-it/) - IRS Form 8996 is used to certify an entity as a Qualified Opportunity Fund (QOF) and to demonstrate ...

16. [NMTC Mapping Tool | Novogradac](https://www.novoco.com/resource-centers/new-markets-tax-credits/nmtc-mapping-tool) - Free mapping tool that shows NMTC eligible, severe distress and non-metropolitan census tracks (base...

17. [CDFI Fund Opens CY 2024-2025 Round of New Markets Tax Credit ...](https://www.cdfifund.gov/news/613) - A total of $10 billion in Allocation Authority is available through this combined round that will sp...

18. [2016-2020 American Community Survey Data Available for NMTC ...](https://www.cdfifund.gov/news/537) - The US Department of the Treasury's Community Development Financial Institutions Fund (CDFI Fund) re...

19. [CDFI Information Mapping System (CIMS)](https://www.cdfifund.gov/mapping-system) - Qualified Census Tracts and Counties: Users may download lists of tracts or counties indicating whet...

20. [New NMTC Eligibility Data from the CDFI Fund](https://nmtccoalition.org/2023/09/06/new-nmtc-data/) - New Markets Tax Credit Program Low-Income Community (LIC) Data is now available. The updated LIC dat...

21. [LIHTC Database Access: Property Data - HUD User](https://www.huduser.gov/portal/datasets/lihtc/property.html) - HUD's LIHTC database contains information on 54,102 projects and 3.7 million housing units placed in...

22. [Federal Historic Tax Credit Projects by State](https://savingplaces.org/tax-credit-projects-by-state) - Federal Historic Tax Credit projects that received Part 3 certifications from the National Park Serv...

23. [Historic Preservation Certification Application - National Park Service](https://www.nps.gov/subjects/taxincentives/historic-preservation-certification-application.htm) - The historic rehabilitation tax credits are available for any qualified project that the Secretary o...

24. [Novogradac Historic Tax Credit Mapping Tool](https://www.novoco.com/resource-centers/historic-tax-credits/historic-mapping-tool) - Click Download to CSV to download the displayed project data to a Microsoft Excel-readable CSV file....

25. [[PDF] Annual Report on the Economic Impact of the Federal Historic Tax ...](https://ncshpo.org/wp-content/uploads/2025/05/report-2023-economic-impact.pdf) - In Fiscal Year (FY) 2023, the NPS certified 970 completed historic rehabilitation projects, represen...

26. [HUD Awards and Allocations - HUD Exchange](https://www.hudexchange.info/GRANTEES/ALLOCATIONS-AWARDS/?na=35080&start=1755) - Find award and allocation amounts for grantees by year, program, and state. HUD grantees include sta...

27. [Community Development Block Grant Program - HUD](http://www.hud.gov/hud-partners/community-cdbg) - The Community Development Block Grant (CDBG) Program provides annual grants on a formula basis to st...

28. [[PDF] usda rural development housing activity report - fiscal year 2024](https://ruralhome.org/wp-content/uploads/2025/03/2024-usda-rural-development-housing-activity-report.pdf) - In Fiscal Year (FY) 2024, USDA obligated roughly 49,000 loans, loan guarantees, and grants totaling ...

29. [Rural Economic Development Loan & Grant Programs](https://www.rd.usda.gov/programs-services/business-programs/rural-economic-development-loan-grant-programs) - The Rural Economic Development Loan and Grant programs provide funding for rural projects through lo...

30. [7(a) & 504 FOIA - Dataset - U.S. Small Business Administration (SBA)](https://data.sba.gov/en/dataset/7-a-504-foia) - The FOIA data for the 7(a) and 504 programs are updated quarterly. The data is typically available o...

31. [504 loans | U.S. Small Business Administration - SBA](https://www.sba.gov/funding-programs/loans/504-loans) - The 504 loan program provides long-term, fixed rate financing for major fixed assets that promote bu...

32. [Texas Enterprise Fund - Texas Public Policy Foundation](https://www.texaspolicy.com/legeenterprisefund/) - The Issue Texas's low-tax, low-regulatory model has long attracted businesses from other states as w...

33. [Texas Enterprise Fund Portal](https://tef-portal.gov.texas.gov) - Texas Enterprise Fund Portal Established in 2003, the Texas deal-closing grant fuels business growth...

34. [Economic Incentives | MyFloridaCFO](https://www.myfloridacfo.com/transparency/economic-incentives) - This site contains details on every non-confidential Florida economic development incentive project ...

35. [Incentive Program Reports | NC Commerce](https://www.commerce.nc.gov/reports-policymakers/incentive-programs-reports) - We publish performance reports for the wide variety of North Carolina economic development incentive...

36. [Job Development Investment Grant (JDIG) | EDPNC](https://edpnc.com/incentives/job-development-investment-grant-jdig/) - JDIG is a performance-based incentive program providing cash grants to new and expanding businesses ...

37. [NC Commerce cancels six JDIG projects - Carolina Journal](https://www.carolinajournal.com/nc-commerce-cancels-six-jdig-projects/) - The company was awarded a JDIG grant in 2021. Incentives were terminated due to its failure to file ...

38. [Empire State Development Reports - NY.Gov](https://esd.ny.gov/esd-media-center/reports) - Excelsior Jobs Program Quarterly Report: 12/31/25 ... The Excelsior Jobs Program provides job creati...

39. [Database of Economic Incentives - Empire State Development](https://esd.ny.gov/database-economic-incentives) - The Database of Economic Incentives provides a dynamic, user-friendly, searchable database of econom...

40. [Excelsior Jobs Program - NYC.gov: Business](https://nyc-business.nyc.gov/nycbusiness/description/excelsior-jobs-program) - The Excelsior Jobs Program helps businesses in certain industries in New York State. Businesses can ...

41. [IEDC Transparency Portal | Home](https://transparencyportal.iedc.in.gov) - On this portal, you will find data on economic development projects that the IEDC undertakes to help...

42. [Programs - Indiana Economic Development Corporation](https://iedc.in.gov/programs) - Our programs and initiatives offer business support and expertise to companies that are investing an...

43. [Department of Development Tax Incentives | DataOhio](https://data.ohio.gov/wps/portal/gov/data/view/department-of-development-tax-incentives) - Tax Incentives would include the Job Creation Tax Credit program, Datacenter Tax Exemption, Job Rete...

44. [Press Release • Ohio Auditor of State](https://ohioauditor.gov/news/pressreleases/Details/7738) - Of the 55 companies that received Job Creation Tax Credits, 36 had not met job creation commitments,...

45. [City of Chicago TIF Data](https://webapps1.chicago.gov/ChicagoTif/) - The City of Chicago Tax Increment Financing (TIF) Portal provides Chicagoans with a map-based view o...

46. [tifs - City of Chicago - Catalog - Data.gov](https://catalog.data.gov/dataset/tifs?from_hint=eyJxIjoibWFwX2xheWVyIn0%3D) - The data can be viewed on the Chicago Data Portal with a web browser. However, to view or use the fi...

47. [Chicago Increases TIF Sweep to Close Budget Deficit](https://www.civicfed.org/blog/chicago-increases-tif-sweep-close-budget-deficit) - This short analysis reviews the City of Chicago's use of TIF surplus between FY2016 and FY2025 to ba...

48. [Payment in Lieu of Taxes (PILOT) Agreements - NYC.gov](https://www.nyc.gov/site/finance/business/benefits-payment-in-lieu-of-taxes-agreements-pilot.page) - The Department of Finance has made the data for all NYC properties available on the NYC Open Data po...

49. [NYC Open Data -](https://opendata.cityofnewyork.us) - Open Data is free public data published by New York City agencies and other partners. Attend a train...

50. [NYCIDA - NYCEDC](https://edc.nyc/nycida) - The mission of the New York City Industrial Development Agency (NYCIDA) is to drive economic develop...

51. [NYCIDA Industrial Program | NYCEDC](https://edc.nyc/program/industrial-incentives-program) - Planning to purchase, build, or renovate industrial property in New York City? The NYCIDA Industrial...

52. [NYCIDA: Compliance - NYCEDC](https://edc.nyc/nycida-compliance) - Many NYCEDC, NYCIDA, NYCNCC, and Build NYC Agreements, require our projects to report specific infor...

53. [Dallas OpenData | Dallas OpenData](https://www.dallasopendata.com) - Dallas OpenData is an invaluable resource for anyone to easily access data published by the City. We...

54. [Download GIS Data - Harris Central Appraisal District](https://hcad.org/pdata/pdata-gis-downloads.html) - GIS format files are available for download. The file names and descriptions are listed below. GIS d...

55. [Significant Features of the Property Tax | GW Institute of Public Policy](https://gwipp.gwu.edu/significant-features-property-tax) - The database currently provides features of the property tax spanning the years, beginning 2006 up t...

56. [Access Property Tax Database - Lincoln Institute of Land Policy](https://www.lincolninst.edu/data/significant-features-property-tax/access-database/) - The state-by-state property tax in detail presents key features of the property tax system in each o...

57. [Significant Features of the Property Tax® - Lincoln Institute of Land ...](https://www.lincolninst.edu/data/significant-features-property-tax/) - Significant Features of the Property Tax®. This online database presents data on the property tax in...

58. [Public Sector: State Government Finances - Census Bureau](https://www.census.gov/data/developers/data-sets/govsstatefin.html) - Data are shown for the fiscal year for the given reference period. All queries to the Census Data AP...

59. [Interactive Census of Governments State & Local Finance Database](https://datacatalog.urban.org/dataset/interactive-census-governments-state-local-finance-database) - This interactive data tool allows for specialized searches and flexible data presentation from the C...

60. [Metro Monitor 2023 - Brookings Institution](https://www.brookings.edu/articles/metro-monitor-2023/) - The Metro Monitor examines economic performance across five broad categories: growth, prosperity, ov...

61. [Metro Monitor 2025 - Brookings Institution](https://www.brookings.edu/articles/metro-monitor-2025/) - The Metro Monitor examines economic performance across five broad categories: growth, prosperity, ov...

62. [Brookings Report Shows Cities Experiencing Uneven Economic ...](https://nlihc.org/resource/brookings-report-shows-cities-experiencing-uneven-economic-progress) - Metro Monitor tracks economic progress in the 100 largest metropolitan areas in the U.S. using an In...

63. [C2ER Partners with SelectUSA](https://www.c2er.org/2015/01/c2er-partners-with-selectusa/) - C2ER and SelectUSA have entered into a partnership to make some features of the State Business Incen...

64. [The evolving landscape of state incentives](https://smartincentives.org/the-evolving-landscape-of-state-incentives/) - The database contains searchable information on over 2,000 incentives offered by US states and terri...

65. [About - State Business Incentives Database](https://www.stateincentives.org/about/) - The State Business Incentives Database represents a continuous effort by C2ER to track business ince...

66. [State Business Incentives Database](https://www.c2er.org/state-business-incentives-database/) - Your one stop resource for information about incentive programs in all 50 states. Incentive Programs...

67. [The C2ER State Business Incentives Database - YouTube](https://www.youtube.com/watch?v=Pzogn6jjxpY) - This short video explains what the C2ER State Business Incentives Database is and demonstrates how t...

68. [White House releases investment data - SSTI](https://ssti.org/blog/white-house-releases-investment-data) - The White House recently published a data tool, accompanied by a downloadable excel file housing two...

69. [Investing in America (IIA) Dataset - Kaggle](https://www.kaggle.com/datasets/irakozekelly/investing-in-america-iia-dataset) - The Investing in America (IIA) dataset provides details on federally funded programs and projects un...

70. [Infrastructure Investment and Jobs Act (IIJA) Funding Status](https://www.transportation.gov/mission/budget/infrastructure-investment-and-jobs-act-iija-funding-status) - IIJA Funding Status as of March 31, 2026 – This report shows the status of funding that was provided...

71. [Energy efficient commercial buildings deduction - IRS](https://www.irs.gov/credits-deductions/energy-efficient-commercial-buildings-deduction) - Building owners who increase energy efficiency in building systems by at least 25% may be able to cl...

72. [Understanding 45L and How to Earn the New Energy Efficient Home ...](https://buildinginnovationhub.org/understanding-45l-and-how-to-earn-the-new-energy-efficient-home-credit/) - The IRA amended and extended 45L to increase the tax credit to up to $2,500 per unit for homes that ...

73. [IRA Section 13702 - Clean Electricity Investment Credit](https://iratracker.org/programs/ira-section-13702-clean-electricity-investment-credit/) - This credit effectively extends the IRC section 48 investment tax credit to include facilities place...

74. [About Renewable Energy Tax Credits - Novogradac](https://www.novoco.com/resource-centers/renewable-energy-tax-credits/about-renewable-energy-tax-credits) - Energy Efficient Commercial Buildings Deduction (Section 179D) is similarly terminated for property ...

75. [International Economic Development Council (IEDC)](https://www.iedconline.org) - The International Economic Development Council (IEDC) is a non-profit, non-partisan membership organ...

