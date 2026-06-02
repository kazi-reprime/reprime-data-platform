# Free & Freemium US Commercial Real Estate Cap Rate Data: The Definitive Source Directory

> **Compiled May 2026 | Focus: free-to-access or freemium-usable-tier sources for US CRE cap rates, NOI, pricing series, and yield data by property type and market**

***

## Part I — Primary Sources: Deep Dives

### 1. NCREIF (National Council of Real Estate Investment Fiduciaries)

**What is free vs. member-only:**

The NCREIF Property Index (NPI) is the institutional benchmark for unlevered private CRE returns across apartments, industrial, office, retail, and hotels. Most of the NPI data is **member-only**, but NCREIF releases meaningful public-facing material:[^1][^2]

- **Free: Quarterly Press Releases** — Published via the NCREIF News page at [https://ncreif.org/news/](https://ncreif.org/news/). Each press release (PDF) contains:
  - Total return, income return, appreciation return (all-property and by property type)
  - **Market value-weighted cap rates** from appraisals for unsold NPI properties
  - **Transaction cap rates** for sold properties in that quarter
  - Example from Q1 2025: appraisal cap rate 4.63% vs. transaction cap rate 5.66%[^3]
  - Direct PDF link pattern: `https://ncreif.org/__static/[hash]/NPI-[Q]-[YEAR]-Press-Release.pdf`
  - Q2 2025: [https://ncreif.org/__static/jdj5jdewjeztl3dsednwcdzxm3lmznjv/NPI-2Q2025-Press-Release.pdf](https://ncreif.org/__static/jdj5jdewjeztl3dsednwcdzxm3lmznjv/NPI-2Q2025-Press-Release.pdf)[^4]
  - Q3 2025: [https://ncreif.org/__static/jdj5jdewjflcvw1vytcymnhroukxdzvp/NPI-3Q2025-Press-Release(3).pdf](https://ncreif.org/__static/jdj5jdewjflcvw1vytcymnhroukxdzvp/NPI-3Q2025-Press-Release(3).pdf)[^5]

- **Free: Expanded NPI Snapshot Flash** — Contains property-type breakdown of returns and cap rates. Q2 2025: [https://ncreif.org/__static/jdj5jdewjfeuzxhyv1dzcejycdmwt2nz/Expanded-NPI-Snapshot-Flash-20252.pdf](https://ncreif.org/__static/jdj5jdewjfeuzxhyv1dzcejycdmwt2nz/Expanded-NPI-Snapshot-Flash-20252.pdf)[^6]

- **Free: NCREIF/CREFC Open-End Debt Fund Aggregate Snapshot** — Released quarterly, free public snapshot covers fund-level returns for CRE debt funds. Available on both NCREIF News and CREFC website. Q2 2025: [https://ncreif.org/__static/jdj5jdewjgkulkpiqthmqzrkrnhyavr4/Public-Snapshot-6-30-25-NCREIF-CREFC-Debt-Fund-Aggregate.pdf](https://ncreif.org/__static/jdj5jdewjgkulkpiqthmqzrkrnhyavr4/Public-Snapshot-6-30-25-NCREIF-CREFC-Debt-Fund-Aggregate.pdf)[^7]

- **Member-only:** Property-level data, custom query tool, Research Database (all property types including self-storage and seniors housing), sub-index returns by geography[^1]

- **Cadence & lag:** Quarterly, released ~3–4 weeks after quarter-end
- **Methodology link:** [https://www.ncreif.org/data/index-returns/](https://www.ncreif.org/data/index-returns/)
- **Farmland / Timberland indices:** Publicly available press releases at the same NCREIF News page; senior housing sector cap rate commentary is published by NIC ([https://www.nic.org/blog/](https://www.nic.org/blog/)) citing NCREIF NPI[^8]
- **What you get free:** National-level cap rates (appraisal and transaction), 4 property types, quarterly. No MSA-level data free.

***

### 2. American Council of Life Insurers (ACLI) — Commercial Mortgage Commitments

**This is paid, not free.** A key clarification for practitioners:

- The ACLI Commercial Mortgage Commitments (CMC) quarterly report — the primary source for life company CRE mortgage data including **implied cap rates, coupon/interest rate spreads, LTV, DSCR by property type** — is a **subscription product**[^9]
- Pricing per the 2024 order form: $500 per quarter (Q1–Q3), $600 for Q4, or $1,300 annually for CMC-Q[^9]
- Subscriptions via Aaron Hoppenstedt, AaronHoppenstedt@acli.com, 202-624-2354
- The ACLI publications page at [https://www.acli.com/news-and-analysis/publications-and-research](https://www.acli.com/news-and-analysis/publications-and-research) lists the CMC alongside the Life Insurers Fact Book[^10]
- **Free partial window:** ACLI's Investment Bulletins page ([https://www.acli.com/news-and-analysis/investment-bulletins](https://www.acli.com/news-and-analysis/investment-bulletins)) posts the CMC as the "primary source of industry information on mortgage lending activity" — some headline statistics from past bulletins circulate in academic papers (e.g., fixed-rate cap rates and yield spreads by property type). The Metlife Investment research paper at `https://investments.metlife.com/...` cites ACLI CMC Historical Database for coupon/cap rate series[^11][^12]
- **Workaround:** The Federal Reserve Z.1 / FRED series below captures aggregate life company CRE mortgage flows; MBA CREF Loan Performance Survey gives free delinquency data by capital source including life companies[^13]

***

### 3. Federal Reserve — FRED Series for CRE Cap Rate Proxies

No FRED series directly publishes a "cap rate." However, the following series are the best free proxies for CRE yield and pricing data:

#### A. CRE Price Index (Z.1 Financial Accounts)
| FRED Series ID | Description | URL | Cadence |
|---|---|---|---|
| `BOGZ1FL075035503Q` | Commercial Real Estate Price Index, Level (Board of Governors Z.1) — from Q4 1945 | [fred.stlouisfed.org/series/BOGZ1FL075035503Q](https://fred.stlouisfed.org/series/BOGZ1FL075035503Q) | Quarterly, ~10-week lag[^14] |
| `COMREPUSQ159N` | Commercial Real Estate Prices for United States (BIS/Federal Reserve) | [fred.stlouisfed.org/series/COMREPUSQ159N](https://fred.stlouisfed.org/series/COMREPUSQ159N) | Quarterly[^15] |

#### B. CRE Delinquency and Charge-Off (Proxy for distress/yield spread)
| FRED Series ID | Description | URL | Cadence |
|---|---|---|---|
| `DRCRELEXFACBS` | Delinquency Rate, CRE Loans excl. Farmland, All Commercial Banks | [fred.stlouisfed.org/series/DRCRELEXFACBS](https://fred.stlouisfed.org/series/DRCRELEXFACBS) | Quarterly[^16][^17] |
| `DRCRELEXFOBS` | Same series, banks NOT in top 100 by assets | [fred.stlouisfed.org/series/DRCRELEXFOBS](https://fred.stlouisfed.org/series/DRCRELEXFOBS) | Quarterly[^18] |
| `H8B3219NCBCMG` | CRE Loans, All Commercial Banks (level, break-adjusted) | [fred.stlouisfed.org/series/H8B3219NCBCMG](https://fred.stlouisfed.org/series/H8B3219NCBCMG) | Weekly[^19] |

#### C. Interest Rate Benchmarks (to compute cap rate spreads)
| FRED Series ID | Description | URL | Cadence |
|---|---|---|---|
| `DGS10` | 10-Year Treasury Constant Maturity | [fred.stlouisfed.org/series/DGS10](https://fred.stlouisfed.org/series/DGS10) | Daily |
| `DFII10` | 10-Year TIPS (real rate) | [fred.stlouisfed.org/series/DFII10](https://fred.stlouisfed.org/series/DFII10) | Daily[^20] |
| `INTDSRUSM193N` | Discount Rate for United States | [fred.stlouisfed.org/series/INTDSRUSM193N](https://fred.stlouisfed.org/series/INTDSRUSM193N) | Monthly[^21] |

#### D. FRED API Call Examples (JSON)
```
# CRE delinquency rate, all banks
https://api.stlouisfed.org/fred/series/observations?series_id=DRCRELEXFACBS&api_key=YOUR_KEY&file_type=json

# Z.1 CRE price index
https://api.stlouisfed.org/fred/series/observations?series_id=BOGZ1FL075035503Q&api_key=YOUR_KEY&file_type=json

# CRE loan balances weekly
https://api.stlouisfed.org/fred/series/observations?series_id=H8B3219NCBCMG&api_key=YOUR_KEY&file_type=json
```
Free API key at [https://fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)

#### E. Senior Loan Officer Opinion Survey (SLOOS) — CRE Lending Standards
- Published quarterly at [https://www.federalreserve.gov/data/sloos.htm](https://www.federalreserve.gov/data/sloos.htm)[^22]
- SLOOS Q1 2026 (Jan 2026): Net tightening of -3.16% across CRE loan types — meaning **net easing** for the first time since 2022[^23]
- FRED tag page: [https://fred.stlouisfed.org/tags/series?t=sloos](https://fred.stlouisfed.org/tags/series?t=sloos) — 639 series with SLOOS tag[^24]
- CRE-specific SLOOS series cover: construction/land development, nonfarm-nonresidential (office/retail/industrial), and multifamily — standards, terms, and demand
- Cadence: Quarterly (~4 weeks after survey close). Lag: ~5 weeks after quarter-end.
- **Charge-off/delinquency release:** [https://www.federalreserve.gov/releases/chargeoff/](https://www.federalreserve.gov/releases/chargeoff/) — quarterly, seasonally and non-seasonally adjusted[^25][^26]

***

### 4. Academic Datasets

| Institution | Dataset / Resource | URL | License | Format | Access |
|---|---|---|---|---|---|
| **MIT Center for Real Estate** | Price Dynamics Platform — TRI, RCA CPPI Forecasts, Investor Sentiment Index | [pricedynamicsplatform.mit.edu/analytics/](https://pricedynamicsplatform.mit.edu/analytics/) | Academic | Interactive/download | Free (some products) |
| **MIT CRE / NCREIF** | Transactions-Based Index (TBI) — repeat-sales price appreciation, underlying NCREIF data | [cre.mit.edu](https://cre.mit.edu) | Academic research | Time series | Member/academic license |
| **Wharton (WRDS)** | Real estate databases via WRDS: CoStar, RCA, MSCI NPI detail | [ai-analytics.wharton.upenn.edu/iwrds-data-catalog/](https://ai-analytics.wharton.upenn.edu/iwrds-data-catalog/) | Academic (institutional affiliation required) | SQL/CSV | Requires Wharton/Penn affiliation or licensed university[^27] |
| **NYU Stern / NYU Libraries** | Research guides linking to CoStar, Real Capital Analytics, S&P GMI; ZTRAX via ICPSR | [guides.nyu.edu/c.php?g=276881](https://guides.nyu.edu/c.php?g=276881) | Institutional license | Various | Library account[^28] |
| **Lincoln Institute of Land Policy** | Land and Property Values in the U.S. — national rent/price ratio quarterly from 1960 to present; Significant Features of the Property Tax database; working papers | [lincolninst.edu/publications/articles/](https://www.lincolninst.edu/publications/articles/) | Free public | CSV/XLS | Free download[^29][^30] |
| **UNC Kenan-Flagler** | CREDA White Paper on CRE data parity; access to CBRE/RCA data via library | [kenaninstitute.unc.edu](https://kenaninstitute.unc.edu) | Academic | PDF | Free (papers) |
| **U Michigan Kresge / ZTRAX** | Zillow Transaction and Assessment Dataset (ZTRAX) via ICPSR — 20+ years deed transfers, mortgages, commercial/residential | [kresgeguides.bus.umich.edu/realestate/commercial](https://kresgeguides.bus.umich.edu/realestate/commercial) | Academic (ICPSR license) | CSV | Academic affiliation[^31] |
| **NYU Furman Center** | Housing and urban data for NYC; some multifamily rental series | [furmancenter.org](https://furmancenter.org) | Free | Various | Free download |
| **Berkeley Fisher Center** | CRE research publications and working papers; no standalone dataset portal | [fisher.haas.berkeley.edu](https://fisher.haas.berkeley.edu) | Free (papers) | PDF | Free |
| **USC Lusk Center** | Greater Los Angeles CRE reports, retail/industrial/multifamily snapshots | [lusk.usc.edu](https://lusk.usc.edu) | Free | PDF | Free download |
| **Cornell Baker Program** | CRE research, hotel/hospitality focus, HAMA data partnerships | [sha.cornell.edu/cre](https://sha.cornell.edu/cre) | Free (papers) | PDF | Free |

**Note on WRDS/RCA access:** NYU Stern students can access WRDS (which includes MSCI RCA transaction-level data) via institutional license. This is the back-door to free RCA cap rate data for affiliated researchers.[^32]

***

### 5. County Recorder Systems — Top 20 Counties

The following table covers the 20 largest US counties and their sale-price data availability. For deriving implied cap rates, you need: **sale price + NOI proxy (rent roll or assessed income)**. Recorder data gives you price; NOI must be sourced separately (rent comps + vacancy = imputed NOI).

| County | Recorder/Assessor Sale Price Data? | Open Data Portal | Direct URL | Format |
|---|---|---|---|---|
| **Los Angeles County, CA** | Assessor parcel data (2006–2021) on ArcGIS Hub; recorder images online but not structured bulk CSV | ArcGIS Hub [egis-lacounty.hub.arcgis.com](https://egis-lacounty.hub.arcgis.com/datasets/bffc21600e5f408ea6791d1bce7738ae) | [data.lacounty.gov](https://data.lacounty.gov) | Shapefile, CSV via Socrata[^33][^34] |
| **Cook County, IL** | ✅ Full parcel sales 1999-present with sale price on Socrata open data portal | Socrata [datacatalog.cookcountyil.gov/Property-Taxation/Assessor-Parcel-Sales/wvhk-k5uv](https://datacatalog.cookcountyil.gov/Property-Taxation/Assessor-Parcel-Sales/wvhk-k5uv) | ArcGIS Hub: [hub-cookcountyil.opendata.arcgis.com](https://hub-cookcountyil.opendata.arcgis.com/pages/property-open-data) | CSV download, API (SODA)[^35][^36] |
| **Harris County, TX** | ✅ HCAD Public Data: property characteristics + assessed values free download; recorder deeds images only | HCAD [hcad.org/pdata/pdata-property-downloads.html](https://hcad.org/pdata/pdata-property-downloads.html) | [hcad.org/hcad-online-services/pdata/](https://hcad.org/hcad-online-services/pdata/) | Text/CSV[^37][^38] |
| **Maricopa County, AZ** | ✅ Free dataset downloads via assessor | [mcassessor.maricopa.gov/page/data_sales/](https://www.mcassessor.maricopa.gov/page/data_sales/) | Same | CSV[^39] |
| **San Diego County, CA** | Assessor parcel data; recorder images require fee per copy | San Diego Open Data Portal | [sandiego.gov/opendata](https://www.sandiego.gov/opendata) | Varies |
| **Orange County, CA** | Assessor assessments public; bulk sale data not freely downloadable | OCGov open data | [ocgov.com/gisdata](https://ocgov.com/gisdata) | Shapefile |
| **Miami-Dade County, FL** | ⚠️ Property Appraiser bulk data: $50/file (50 credits) | File Library [bbs.miamidadepa.gov](https://bbs.miamidadepa.gov) | ArcGIS Hub: [gis-mdc.opendata.arcgis.com](https://gis-mdc.opendata.arcgis.com) | CSV (paid bulk); deed images in ACRIS-equivalent[^40][^41] |
| **Dallas County, TX** | Assessor/DCAD data; sale prices in appraisal records, partial free | DCAD [dallascad.org](https://www.dallascad.org) | DCAD Open Data portal | CSV |
| **Kings County (Brooklyn), NY** | ✅ NYC ACRIS: all deeds, mortgages, sale prices back to 1966, free | [nyc.gov/site/finance/property/acris.page](https://www.nyc.gov/site/finance/property/acris.page) | a836-acris.nyc.gov | PDF images + structured data[^42][^43] |
| **Queens County, NY** | ✅ Same NYC ACRIS system — free | Same as Kings | Same | Same[^44][^45] |
| **Riverside County, CA** | Assessor data; recorder images online; bulk requires request | Riverside County GIS | [rcgis.countyofriverside.us](https://rcgis.countyofriverside.us) | Varies |
| **San Bernardino County, CA** | Assessor data; bulk data for fee; some parcels on Socrata | SB County Open Data | [data.sbcounty.gov](https://data.sbcounty.gov) | Varies |
| **King County (Seattle), WA** | ✅ Parcel sales search, online records search by consideration (price); REET database | [kingcounty.gov/en/dept/executive-services/.../recorders-office](https://kingcounty.gov/en/dept/executive-services/certificates-permits-licenses/records-licensing/recorders-office) | [kingcounty.gov/en/dept/.../records-search](https://kingcounty.gov/en/dept/executive-services/certificates-permits-licenses/records-licensing/recorders-office/records-search) | Online search; parcel viewer free[^46][^47] |
| **Clark County (Las Vegas), NV** | ⚠️ Assessor bulk data: requires signed letter + subscription fee | [clarkcountynv.gov/government/assessor/datafiles](https://www.clarkcountynv.gov/government/assessor/datafiles) | Real property search: [clarkcountynv.gov/government/assessor/property_search](https://www.clarkcountynv.gov/government/assessor/property_search/real-property-records) | Paid subscription[^48][^49] |
| **Tarrant County, TX** | Assessor/TCAD: parcel + sale data partially free | [tad.org](https://www.tad.org) | TCAD data portal | CSV |
| **Bexar County (San Antonio), TX** | BCAD data: free assessor data; recorder requires per-page fee | [bcad.org](https://www.bcad.org) | BCAD data | CSV |
| **Broward County, FL** | Assessor sales data free via property search; bulk: $275 flat file | [bcpa.net](https://www.bcpa.net) | Property Appraiser portal | CSV (paid bulk) |
| **Santa Clara County, CA** | Assessor data; recorder online; bulk for fee | [sccassessor.org](https://www.sccassessor.org) | Open data portal | Varies |
| **Wayne County (Detroit), MI** | Assessor/BSEED data; recorder images via Michigan LARC | Wayne Co. Open Data | [waynecounty.com/elected/bor](https://www.waynecounty.com) | Varies |
| **New York County (Manhattan), NY** | ✅ Same NYC ACRIS — full sale prices free | [nyc.gov/site/finance/property/acris.page](https://www.nyc.gov/site/finance/property/acris.page) | a836-acris.nyc.gov | PDF + structured[^42] |

**Bottom line on county data:** Only NYC ACRIS (Manhattan, Queens, Brooklyn, Bronx), Cook County IL, Maricopa AZ, Harris TX (HCAD), and King County WA offer truly free, structured, downloadable sale price data with enough property characteristics to begin computing implied CRE prices. From these you can compute price/sq ft; combining with a rent proxy (Zillow ZORI, CoStar vacancy, or HUD FMR for multifamily) yields a synthetic cap rate estimate.

***

## Part II — Adjacent Must-Haves

### 6. MSCI Real Capital Analytics (RCA)

- **Status: Paid.** Full RCA platform (transaction-level cap rates, volume by property type, MSA-level) requires an institutional subscription through MSCI[^50]
- **Free public releases:**
  - MSCI publishes monthly "Latest on US Commercial-Property Pricing" blog posts at [msci.com/research-and-insights/paper/rca-commercial-property-price-indexes-rca-cppi](https://www.msci.com/research-and-insights/paper/rca-commercial-property-price-indexes-rca-cppi) with headline CPPI numbers[^51]
  - Monthly CPPI summary: e.g., as of February 2026, all-property prices +1.3% YoY and +0.4% MoM[^52]
  - US RCA Capital Trends Report teaser: [msci.com/data-and-analytics/real-estate/us-rca-capital-trends-report](https://www.msci.com/data-and-analytics/real-estate/us-rca-capital-trends-report) — quarterly, free teaser with volume and headline cap rate[^53]
  - **What is free:** Headline monthly price change %, by property type; no MSA-level or transaction-level cap rates
- **Pricing for access:** Entry-level MSCI RCA data package estimated at $10,000–$25,000/year for institutional subscribers

***

### 7. Green Street Advisors — CPPI

- **Status: Predominantly paid.** The full CPPI with property-type and sub-sector detail requires a Green Street subscription[^54][^55]
- **Free public releases:**
  - Monthly CPPI headline number published at [greenstreet.com/resources/pricing-index/](https://www.greenstreet.com/resources/pricing-index/) — a single index level with 12-month change (e.g., Jan 2026: 130.3, +2.4% YoY, -15.9% from 2022 peak)[^56][^57]
  - Monthly email signup: [linkedin.com/posts/green-street](https://www.linkedin.com/posts/green-street_the-green-street-european-commercial-property-activity-7449709325117177857-tbQQ) — "sign up to receive Green Street's CPPI report and data delivered directly to your inbox each month"[^58]
  - **What is free:** All-property index level only; no cap rates, no property-type breakdown, no MSA detail
  - ULI and CREFC occasionally republish CPPI with slightly more detail ([resources.crefc.org/green-street-s-commercial-property-price-index-cppi/](https://resources.crefc.org/green-street-s-commercial-property-price-index-cppi/))[^59]
- **Cheapest paid access:** Green Street's research platform starts at approximately $20,000–$30,000/year for basic CPPI + sector commentary; full analytics with cap rate series by sector substantially higher

***

### 8. Major Brokerage Cap Rate Reports

All of the following are **free PDFs** requiring only an email/form registration. None expose structured CSV or API natively.

| Source | Latest Report URL | Property Types | Geography | Cadence & Lag | Notes |
|---|---|---|---|---|---|
| **CBRE Cap Rate Survey** | H2 2025: [cbre.com/insights/reports/us-cap-rate-survey-h2-2025](https://www.cbre.com/insights/reports/us-cap-rate-survey-h2-2025) | Office, Industrial, Multifamily, Retail, Hotel, Self-Storage | National + major MSAs | Semi-annual (H1: Aug, H2: Feb), ~2-month lag[^60][^61] | Most comprehensive; H1 2025 shows cap rates peaking[^61]; includes expected cap rate direction by respondents |
| **JLL Market Dynamics / Capital Markets** | [jll.com/en-us/insights](https://www.jll.com/en-us/insights) — sector-specific Market Dynamics quarterly | Office, Industrial, Retail, Living | National + key MSAs | Quarterly[^62][^63] | Free with email; cap rate data embedded in broader market stats |
| **Cushman & Wakefield MarketBeat** | [cushmanwakefield.com/en/insights/marketbeat](https://www.cushmanwakefield.com/en/insights/marketbeat) | Office, Industrial, Retail, Multifamily | National + 50+ MSAs | Quarterly (Q4 2025 out Jan 2026)[^64] | Multifamily archive: [multifamily.cushwake.com/Research/2](https://multifamily.cushwake.com/Research/2)[^65]; average cap rates in PDF narrative (e.g., office 6.0–7.5%)[^66] |
| **Colliers Cap Rate Report / Market Reports** | [colliers.com/en-us/research](https://www.colliers.com/en-us/research) | Office, Industrial, Retail, Multifamily | National + submarkets | Quarterly[^67] | Free; global and US city-level |
| **Marcus & Millichap Research** | [marcusmillichap.com/research](https://www.marcusmillichap.com/research) | Multifamily, Office, Retail, Industrial, Self-Storage, Hotels | National + 40+ MSAs | Quarterly + annual investment forecast | Free; Investment Research includes cap rate by subtype; single-tenant retail reports[^68][^69] |
| **Newmark Capital Markets Report** | [nmrk.com/insights/market-report/united-states-capital-markets-report](https://www.nmrk.com/insights/market-report/united-states-capital-markets-report) | All major types | National | Quarterly[^70] | Free PDF; Q1 2025: CRE debt origination +42% YoY[^70] |
| **Avison Young Market Intelligence** | [avisonyoung.com/insights](https://www.avisonyoung.com/insights) | Office, Industrial, Retail, Multifamily | National + major markets | Quarterly | Free with email[^71] |
| **Berkadia** | Student Housing: [berkadia.com/lp/2025-berkadia-us-student-housing-market-report/](https://www.berkadia.com/lp/2025-berkadia-us-student-housing-market-report/) | Multifamily, Senior Housing, Student Housing | National | Annual + sector updates[^72] | Hotel report available separately at berkadia.com/research |
| **NAR Commercial Real Estate Market Insights** | [nar.realtor/commercial-real-estate-market-insights](https://www.nar.realtor/commercial-real-estate-market-insights) | Office, Industrial, Retail, Multifamily, Hotel | National + metro | Quarterly[^73][^74] | Free; Aug 2025 issue includes multifamily stabilization data; cap rates embedded in sector narratives |
| **NAIOP CRE Sentiment Index** | [naiop.org/research-and-publications/sentiment-index/](https://www.naiop.org/research-and-publications/sentiment-index/) | All industrial/office | National | Semi-annual | Free; March 2026 index: 52[^75] |

**RSS monitoring:** All major brokerages have blog/insights pages. CBRE Insights RSS: `https://www.cbre.com/rss/insights`. JLL Insights: `https://www.jll.com/en-us/rss/insights`. For cap rate drop monitoring, set Google Alerts for "cap rate survey" + site:cbre.com, site:jll.com, etc.

***

### 9. CMBS Data — Trepp, Moody's CRE, Fitch, KBRA, DBRS Morningstar

| Source | Free Monthly Data | URL | Format | Cadence |
|---|---|---|---|---|
| **Trepp** | Monthly CMBS Delinquency Rate blog post — overall + by property type (office, multifamily, retail, lodging, industrial). June 2025: overall 7.08%[^76]. Jan 2026: 7.47%[^77] | [trepp.com/trepptalk](https://www.trepp.com/trepptalk) | Blog post + table | Monthly, ~3–5 days after month-end |
| **Trepp (download)** | Full monthly report downloadable BUT requires form fill (lead-gen, not truly free) | [trepp.com/instantly-access-delinquency-report-march-2023](https://www.trepp.com/instantly-access-delinquency-report-march-2023) | PDF | Monthly[^78] |
| **CRED iQ** | Free blog with monthly delinquency + quarterly cap rate by property type (CMBS conduit). Most detailed free cap rate table available. June 2025: industrial 5.74%, multifamily 5.90%, office 7.34%, self-storage 5.81%[^79] | [cred-iq.com/blog](https://cred-iq.com/blog) | Blog/table | Monthly + quarterly[^80][^81] |
| **KBRA** | Monthly CMBS Loan Performance Trends — delinquency + distress rate. Dec 2025: delinquency 7.7%, distress 10.6% | [kbra.com/publications/NYJnvsQp](https://www.kbra.com/publications/NYJnvsQp) | Free PDF (email registration) | Monthly[^82] |
| **Moody's CRE** | Free blog/insights: CMBS Troubled Loan Tracker — conduit delinquency. Jan 2025: 7.61%[^83] | [moodyscre.com/insights/research/](https://www.moodyscre.com/insights/research/) | Blog | Monthly[^84] |
| **Fitch CMBS** | Analytical data (structured), requires Fitch account | [fitchratings.com/structured-finance/cmbs](https://www.fitchratings.com/structured-finance/cmbs) | Subscription | Various[^85] |
| **MBA CREF Loan Performance Survey** | Quarterly delinquency by capital source (CMBS, banks, life companies, GSEs, FHA). Q1 2025: CMBS 5.2% 30+day[^13] | [mba.org/news-and-research/newsroom/news/2025/05/13/delinquency-rates-for-commercial-properties-increased-in-first-quarter-2025](https://www.mba.org/news-and-research/newsroom/news/2025/05/13/delinquency-rates-for-commercial-properties-increased-in-first-quarter-2025) | Press release | Quarterly[^86] |

***

### 10. FDIC — Quarterly Banking Profile and Call Report CRE Data

The FDIC BankFind Suite API is one of the most under-utilized free CRE data sources:

- **API Base URL:** `https://api.fdic.gov/` — Full documentation at [api.fdic.gov/banks/docs](https://api.fdic.gov/banks/docs)[^87]
- **Key CRE endpoints and example calls:**

```
# Total CRE loans for all banks (latest quarter)
https://api.fdic.gov/financials?filters=REPDTE%3A20250331&fields=repdte,inst_name,asset,lnrecons,lnrenres,lnremult,lnrecoml&limit=100&offset=0

# Fields for CRE analysis:
# lnrecons  = Construction/land development RE loans
# lnremult  = Multifamily RE loans  
# lnrecoml  = Commercial (nonfarm, nonresidential) RE loans
# lnrenres  = Nonfarm nonresidential RE loans
# chrtres   = CRE charge-off rate
# p3recons  = CRE 30-89 day past due
# p9recons  = CRE 90+ day past due / nonaccrual
```

- **FFIEC Call Report CDR:** [cdr.ffiec.gov](https://cdr.ffiec.gov) — all individual bank call reports downloadable[^88]
- **FDIC SDI:** [banks.data.fdic.gov/api/financials](https://banks.data.fdic.gov/api/financials) — aggregate statistics on depository institutions[^89]
- **What you get:** CRE loan yields are NOT directly published; you derive them from net interest margin + asset mix. Charge-off and delinquency rates by CRE category (construction vs. multifamily vs. commercial) are available at quarterly frequency with ~10-week lag.
- **Federal Reserve Charge-off Release:** Free at [federalreserve.gov/releases/chargeoff/](https://www.federalreserve.gov/releases/chargeoff/)[^25]

***

### 11. NAREIT T-Tracker (REIT Industry Tracker) — Implied Cap Rates

- **Status: Free PDF download** from NAREIT website
- Q1 2025 T-Tracker PDF: [reit.com/sites/default/files/2025-05/Ttracker_2025Q1.pdf](https://www.reit.com/sites/default/files/2025-05/Ttracker_2025Q1.pdf)[^90]
- Also at: [reit.com/data-research/reit-market-data/report/nareit-reit-industry-tracker](https://www.reit.com/data-research/reit-market-data/report/nareit-reit-industry-tracker)[^91]
- **What it contains:**
  - **REIT implied cap rate** (all equity REITs): Q1 2025 = 5.6%, derived from NOI / enterprise value[^92]
  - Historical chart of implied cap rate from 2005 to present
  - Sector breakdown: industrial, retail, residential, office, diversified, hotel, healthcare
  - Gross acquisitions by sector
  - Dividend yields, NAV premiums/discounts
- **Cadence:** Quarterly, released ~6 weeks after quarter-end
- **FTSE Nareit Indices (price return):** Live index levels at [lseg.com/en/ftse-russell/indices/nareit](https://www.lseg.com/en/ftse-russell/indices/nareit) — includes All Equity REITs, Residential, Mortgage, Specialty[^93]
- **What is NOT free:** Property-type-specific implied cap rates in downloadable time series; those require NAREIT membership or CoStar/S&P subscription

***

### 12. HUD USER — Multifamily Series

| Resource | URL | Free | Content | Format |
|---|---|---|---|---|
| PD&R Datasets Landing | [huduser.gov/portal/pdrdatas_landing.html](https://www.huduser.gov/portal/pdrdatas_landing.html) | Free | American Housing Survey microdata, FMRs, income limits, multifamily stock data | CSV, XLS, PDF[^94] |
| Fair Market Rents (FMR) | [huduser.gov/portal/datasets/fmr.html](https://www.huduser.gov/portal/datasets/fmr.html) | Free | 40th percentile rents by bedroom count, county, and metro — **use as NOI proxy denominator** | XLS; API at huduser.gov/portal/dataset/fmr-api.html[^95] |
| Income Limits (MTSP/IL) | [huduser.gov/portal/datasets/mtsp.html](https://www.huduser.gov/portal/datasets/mtsp.html) | Free | LIHTC and multifamily tax subsidy income limits by AMI — critical for affordable MF cap rate derivation | XLS, PDF, API[^96] |
| US Housing Market Conditions (USHMC) | [huduser.gov/portal/pdredge/pdr-edge-spotlight-article-020526.html](https://www.huduser.gov/portal/pdredge/pdr-edge-spotlight-article-020526.html) | Free | Monthly/quarterly: supply, demand, finance, vacancy. Aggregated from Census/FHFA/BEA | Interactive + CSV download[^97] |
| Multifamily Assistance & Section 8 DB | [hud.gov/hud-partners/multifamily-assist-section8-database](https://www.hud.gov/hud-partners/multifamily-assist-section8-database) | Free | HUD-insured multifamily stock | MS Access DB[^98] |

**Key analytical use:** HUD FMR + USHMC vacancy data → imputed effective gross income → divided by current sale price (from ACRIS/HCAD) = synthetic multifamily cap rate estimate at county level.

***

### 13. Free Rent Series for Deriving Multifamily Cap Rates

| Source | Series | URL | Geography | Cadence | Notes |
|---|---|---|---|---|---|
| **Zillow Research** | Zillow Observed Rent Index (ZORI) | [zillow.com/research/data/](https://www.zillow.com/research/data/) | National, state, metro, zip | Monthly | Free CSV download; all terms of use allow commercial analysis[^99][^100] |
| **Apartment List** | Median rent estimates new leases | [apartmentlist.com/research/category/data-rent-estimates](https://www.apartmentlist.com/research/category/data-rent-estimates) | National + metro + city + county | Monthly | Free download; April 2026: national median $1,370, +0.5% MoM[^101][^102] |
| **RealPage Market Analytics** | Effective asking rent, occupancy (market-rate units) | [realpage.com/analytics/](https://www.realpage.com/analytics/) | National + MSA | Monthly | Freemium — monthly blog with national/regional data free; MSA detail requires subscription[^103][^104] |
| **HUD FMR API** | Fair Market Rents by bedroom count | [huduser.gov/portal/dataset/fmr-api.html](https://www.huduser.gov/portal/dataset/fmr-api.html) | County / HUD Metro | Annual | Free API key; 40th percentile rent[^105] |
| **Census ACS / AHS** | Median gross rent by metro | [census.gov/topics/housing.html](https://www.census.gov/topics/housing.html) | National + MSA + tract | Annual (ACS 1-yr/5-yr) | Free via Census API |

***

### 14. Brokerage Research RSS / Monitoring

To monitor cap rate report drops:

| Source | RSS / Email / Alert |
|---|---|
| CBRE Insights | `https://www.cbre.com/rss/insights` |
| JLL Insights | Subscribe at `jll.com/en-us/insights` |
| Cushman & Wakefield | RSS: `https://www.cushmanwakefield.com/en/rss` |
| Marcus & Millichap | Email alerts at `marcusmillichap.com/research` |
| Trepp TreppWire | Free newsletter signup at `trepp.com` |
| CRED iQ | Blog RSS at `cred-iq.com/blog` |
| NCREIF News | Subscribe at `ncreif.org/news` |
| NAR Commercial | `nar.realtor/commercial-real-estate-market-insights` |
| MBA CREF | Newsroom at `mba.org/news-and-research/newsroom` |

***

## Part III — Master Reference Table by Property Type

The following table consolidates all sources by property type. Columns: **Source | URL | Free/Freemium/Paid | What It Returns | Geography | Property Type | Format | Cadence & Lag | Methodology | Dashboard Tile**

### Office

| Source | URL | Access | What It Returns | Geography | Format | Cadence | Methodology |
|---|---|---|---|---|---|---|---|
| CBRE Cap Rate Survey | [cbre.com/insights/reports/us-cap-rate-survey-h2-2025](https://www.cbre.com/insights/reports/us-cap-rate-survey-h2-2025) | Free PDF | Survey cap rates by market + submarkets; H2 2025: office cap rates stable | National + MSA | PDF | Semi-annual | Survey of CBRE professionals[^60] |
| NCREIF NPI Press Release | [ncreif.org/news/](https://ncreif.org/news/) | Free PDF | Appraisal + transaction cap rates, office total returns | National only | PDF | Quarterly, 3-4 wk lag | Value-weighted appraisal[^2][^3] |
| CRED iQ Blog | [cred-iq.com/blog](https://cred-iq.com/blog) | Free | CMBS conduit office cap rate range + average. June 2025: 7.34% avg | National | Blog/table | Monthly/quarterly | CMBS conduit originations[^79] |
| JLL Market Dynamics | [jll.com/en-us/insights/market-dynamics/us-office](https://www.jll.com/en-us/insights/market-dynamics/us-office) | Free PDF | Vacancy, absorption, rent, investment volume; Q1 2026 single-asset sales +40% YoY[^63] | National + MSA | PDF | Quarterly | JLLS proprietary data |
| FRED BOGZ1FL075035503Q | [fred.stlouisfed.org/series/BOGZ1FL075035503Q](https://fred.stlouisfed.org/series/BOGZ1FL075035503Q) | Free API | CRE price index level (all types) | National | JSON/CSV | Quarterly | Z.1 Financial Accounts[^14] |
| Cushman MarketBeat Office | [cushmanwakefield.com/en/insights/marketbeat](https://www.cushmanwakefield.com/en/insights/marketbeat) | Free PDF | Office: vacancy, net absorption, avg asking rent; cap rate narrative | National + 50+ MSAs | PDF | Quarterly | CW proprietary[^64][^66] |

### Industrial

| Source | URL | Access | What It Returns | Geography | Format | Cadence | Methodology |
|---|---|---|---|---|---|---|---|
| CBRE Cap Rate Survey | Same as above | Free PDF | Industrial cap rate by grade + market; H2 2025 industrial cap rates showing stabilization[^60] | National + MSA | PDF | Semi-annual | Survey |
| CRED iQ Blog | [cred-iq.com/blog](https://cred-iq.com/blog) | Free | CMBS industrial cap rates; June 2025: 5.74% avg[^79] | National | Blog | Monthly/quarterly | CMBS conduit |
| JLL Industrial Dynamics | [jll.com/en-us/insights/market-dynamics/industrial-market-statistics-trends](https://www.jll.com/en-us/insights/market-dynamics/industrial-market-statistics-trends) | Free PDF | Vacancy 7.5% Q1 2026, absorption, rent[^106] | National + MSA | PDF | Quarterly | JLL data |
| NCREIF NPI | Same as above | Free PDF | Industrial total return + cap rate national | National | PDF | Quarterly | Appraisal/transaction |
| Trepp Delinquency | [trepp.com/trepptalk](https://www.trepp.com/trepptalk) | Free | CMBS industrial delinquency (proxy for stress/yield) | National | Blog | Monthly | CMBS servicer reports |

### Multifamily

| Source | URL | Access | What It Returns | Geography | Format | Cadence | Methodology |
|---|---|---|---|---|---|---|---|
| NAREIT T-Tracker | [reit.com/.../Ttracker_2025Q1.pdf](https://www.reit.com/sites/default/files/2025-05/Ttracker_2025Q1.pdf) | Free PDF | REIT implied cap rate residential sector; Q1 2025: 5.6% all-equity | National sector | PDF | Quarterly | NOI/enterprise value[^90][^92] |
| CRED iQ | [cred-iq.com/blog](https://cred-iq.com/blog) | Free | CMBS multifamily cap rate; June 2025: 5.90% avg; Q4 2025: 5.71%[^107][^79] | National | Blog | Monthly/quarterly | CMBS conduit |
| Zillow ZORI | [zillow.com/research/data/](https://www.zillow.com/research/data/) | Free CSV | Observed rent index by unit type and market | National + MSA + ZIP | CSV | Monthly | Repeat-rent index[^99][^100] |
| Apartment List | [apartmentlist.com/research/national-rent-data](https://www.apartmentlist.com/research/national-rent-data) | Free CSV | Median rent new leases; April 2026: $1,370[^102] | National + metro + county | CSV | Monthly | New lease observations |
| RealPage Analytics | [realpage.com/analytics/](https://www.realpage.com/analytics/) | Freemium | Effective asking rent + occupancy national/regional; Nov 2025: 94.8% occupancy[^104] | National/region (MSA requires sub) | Blog/paid CSV | Monthly | Market-rate professionally managed |
| HUD FMR API | [huduser.gov/portal/dataset/fmr-api.html](https://www.huduser.gov/portal/dataset/fmr-api.html) | Free API | 40th percentile rent by BR, county, HUD metro | County / HUD Metro | API/XLS | Annual | HUD survey + modeling[^105] |
| NCREIF NPI | [ncreif.org/news/](https://ncreif.org/news/) | Free PDF | Apartment total return + appraisal cap rate | National | PDF | Quarterly | Appraisal[^3] |
| MBA CREF Survey | [mba.org/news-and-research/newsroom/news/...](https://www.mba.org/news-and-research/newsroom/news/2025/05/13/delinquency-rates-for-commercial-properties-increased-in-first-quarter-2025) | Free | Multifamily delinquency by capital source; Q1 2025: GSE 0.6%, life co 1%[^13] | National | Press release | Quarterly | UPB survey |

### Retail

| Source | URL | Access | What It Returns | Geography | Format | Cadence |
|---|---|---|---|---|---|---|
| CBRE Cap Rate Survey | [cbre.com/insights/reports/us-cap-rate-survey-h2-2025](https://www.cbre.com/insights/reports/us-cap-rate-survey-h2-2025) | Free PDF | Retail cap rates by type (strip, power, lifestyle, net lease); H2 2025 retail cap rates stable[^60] | National + MSA | PDF | Semi-annual |
| CRED iQ | [cred-iq.com/blog](https://cred-iq.com/blog) | Free | CMBS retail cap rates; Q4 2025: 6.36%[^107] | National | Blog | Monthly/quarterly |
| Cushman MarketBeat Retail | [cushmanwakefield.com/en/insights/marketbeat](https://www.cushmanwakefield.com/en/insights/marketbeat) | Free PDF | Vacancy, rent, absorption, investment; Q1 2026: retail -4.4M SF net absorption[^108] | National + MSAs | PDF | Quarterly |
| Marcus & Millichap | [marcusmillichap.com/research](https://www.marcusmillichap.com/research) | Free PDF | Single-tenant retail cap rates, investment trends; sector/subtype breakdown | National + MSAs | PDF | Quarterly |
| NAR Commercial Insights | [nar.realtor/commercial-real-estate-market-insights](https://www.nar.realtor/commercial-real-estate-market-insights) | Free PDF | Retail cap rate narrative + vacancy | National + top metros | PDF | Quarterly[^73] |

### Hospitality

| Source | URL | Access | What It Returns | Geography | Format | Cadence |
|---|---|---|---|---|---|---|
| CBRE Cap Rate Survey | Same | Free PDF | Hotel cap rate by class; H2 2025 hotel: near-peak decline from 8.40% in Q4 2025[^107][^60] | National + MSA | PDF | Semi-annual |
| Berkadia | [berkadia.com/lp/2025-berkadia-us-student-housing-market-report/](https://www.berkadia.com/lp/2025-berkadia-us-student-housing-market-report/) | Free PDF | Multifamily/hospitality hotel market data annually | National | PDF | Annual[^72] |
| STR (CoStar) | [str.com](https://www.str.com) | Paid | ADR, RevPAR, occupancy — needed to derive hotel NOI | National + MSA + property | Paid | Monthly |
| CRED iQ | [cred-iq.com/blog](https://cred-iq.com/blog) | Free | CMBS hotel/lodging cap rates; Q4 2025: 8.40%[^107]; Jan 2026: lodging rate down to 5.56%[^77] | National | Blog | Monthly |

### Self-Storage

| Source | URL | Access | What It Returns | Geography | Format | Cadence |
|---|---|---|---|---|---|---|
| CRED iQ | [cred-iq.com/blog](https://cred-iq.com/blog) | Free | CMBS self-storage cap rates; Q4 2025: 5.73% (compressed from 6.61%)[^107] | National | Blog | Monthly/quarterly |
| NAREIT T-Tracker | [reit.com/...Ttracker_2025Q1.pdf](https://www.reit.com/sites/default/files/2025-05/Ttracker_2025Q1.pdf) | Free PDF | REIT self-storage implied cap rate (via Specialty REIT sector) | National sector | PDF | Quarterly |
| Marcus & Millichap | [marcusmillichap.com/research](https://www.marcusmillichap.com/research) | Free PDF | Self-storage investment report, cap rates by market | National + MSAs | PDF | Annual + quarterly |

### Medical Office / Senior Housing / Data Centers

| Property Type | Best Free Source | URL | Notes |
|---|---|---|---|
| **Medical Office (MOB)** | CBRE Cap Rate Survey (MOB included in Office section) + Marcus & Millichap MOB Report | [cbre.com/insights](https://www.cbre.com/insights) | CBRE H2 2025 covers MOB cap rate range by market |
| **Senior Housing** | NIC (National Investment Center) — senior housing cap rates, occupancy, absorption | [nic.org/blog/](https://www.nic.org/blog/) | NIC publishes NCREIF senior housing Q3 2025: 9.21% 1-yr return, highest property type[^8]; full NIC MAP data paid |
| **Data Center** | CBRE (DC section in Specialty) + NAREIT Data Center REIT implied caps | [cbre.com/insights](https://www.cbre.com/insights) | Data center cap rate data is exceptionally thin free; most is CoStar-gated |

***

## Part IV — Top 5 Highest-Signal Free Sources (Ranked)

1. **CBRE Cap Rate Survey (semi-annual PDF)** — [cbre.com/insights/reports/us-cap-rate-survey-h2-2025](https://www.cbre.com/insights/reports/us-cap-rate-survey-h2-2025) — Most comprehensive free cap rate dataset: all major property types, 50+ MSAs, forward outlook by respondent survey. The single best free point-in-time cap rate reference.[^61][^60]

2. **CRED iQ Monthly Blog** — [cred-iq.com/blog](https://cred-iq.com/blog) — Most current free cap rate signal: CMBS conduit cap rates by property type (office, multifamily, industrial, retail, hotel, self-storage) with range + average, updated monthly. Q4 2025 data includes 2025 full-year trajectory.[^107][^80]

3. **NCREIF NPI Quarterly Press Release + Snapshot** — [ncreif.org/news/](https://ncreif.org/news/) — Highest-quality institutional benchmark for unlevered CRE. Free press releases contain national appraisal cap rates and transaction cap rates by property type. No MSA breakdown free.[^2][^3]

4. **NAREIT T-Tracker (quarterly PDF)** — [reit.com/data-research/reit-market-data/report/nareit-reit-industry-tracker](https://www.reit.com/data-research/reit-market-data/report/nareit-reit-industry-tracker) — Only free source of time-series implied cap rates for public market REITs, by sector (residential, industrial, retail, office, hotel, healthcare). Useful as leading indicator since REIT pricing leads private market by 6–12 months.[^91][^90][^92]

5. **FRED Z.1 CRE Price Index (BOGZ1FL075035503Q) + Delinquency Series** — [fred.stlouisfed.org](https://fred.stlouisfed.org) — Free API access to the deepest historical CRE price series (Q4 1945 to present), delinquency by bank size, and SLOOS lending standards. Enables cap rate spread modeling when combined with treasury rates.[^16][^14]

**Honorable mention:** Zillow ZORI + HUD FMR API for multifamily only — the most granular free geographic rent series for deriving county/zip-level multifamily cap rates.[^99][^105]

***

## Part V — Synthetic Cap Rate Recipe (Free Data Only)

The following pseudocode derives a synthetic cap rate at the MSA level from free sources only. Property type: **Multifamily**. Adapt denominators for other types using CBRE survey benchmarks.

```python
# SYNTHETIC CAP RATE DERIVATION — MULTIFAMILY, MSA LEVEL
# Data sources: all free

# STEP 1: Get effective gross rent (EGI)
# Source: Zillow ZORI (CSV from zillow.com/research/data/)
# or: Apartment List median rent (CSV from apartmentlist.com/research/)
zori_monthly_rent = get_zori(msa_code, date)  # $/month, 2BR median
annual_gross_rent = zori_monthly_rent * 12

# STEP 2: Apply vacancy deduction
# Source: HUD USHMC vacancy rates (huduser.gov) OR RealPage national (freemium)
# Use national/regional: US apt market Nov 2025 occupancy = 94.8% → vacancy = 5.2%
vacancy_rate = get_vacancy(msa_code)  # default: 0.052 national from RealPage
egi = annual_gross_rent * (1 - vacancy_rate)

# STEP 3: Apply expense ratio to get NOI
# Source: NCREIF NPI press release expense ratios (implied from income return)
# or use CBRE survey benchmark: MF expense ratio ~35-40% of EGI
expense_ratio = 0.38  # multifamily national benchmark
noi_per_unit = egi * (1 - expense_ratio)

# STEP 4: Get current sale price per unit
# Source: County recorder (Cook IL, King WA, NYC ACRIS, HCAD TX - all free)
# Filter: commercial multifamily (5+ units), sold in trailing 12 months
# Average $/unit from parcel sales table filtered by property class
price_per_unit = get_recorder_sales(county, property_type="multifamily", 
                                    min_units=5, months=12)  # weighted avg

# STEP 5: Compute synthetic cap rate
synthetic_cap_rate = noi_per_unit / price_per_unit

# STEP 6: Validate against institutional benchmarks
# Source: NCREIF NPI (appraisal cap rate, national), CRED iQ (CMBS conduit)
# NCREIF Q1 2025 multifamily appraisal cap rate: ~4.8% (read from press release)
# CRED iQ Q4 2025 multifamily CMBS avg: 5.71%
# If synthetic_cap_rate is within ±75bps of these, calibration is good

# STEP 7: Apply MSA-specific cap rate adjustment
# Source: CBRE Cap Rate Survey (free PDF), look up MSA-specific delta from national
# e.g., NYC multifamily trades 80-100bps tighter than national
msa_adjustment = get_cbre_survey_delta(msa="New_York", property_type="multifamily")
adjusted_cap_rate = synthetic_cap_rate + msa_adjustment

print(f"Synthetic MSA cap rate: {adjusted_cap_rate:.2%}")
print(f"Validation range: NCREIF {ncreif_national:.2%} | CRED iQ {crediq_national:.2%}")
```

**For commercial types (office, industrial, retail):** Replace ZORI with lease comps from LoopNet free listings (EGI proxy), use CBRE survey vacancy rates, apply CBRE survey expense ratios. Recorder sale price data is sparser for commercial — LA County ArcGIS, Cook County Socrata, and NYC ACRIS are your best free sources.

***

## Part VI — Property Types with No Free Cap Rate Data

**Data centers, medical office (standalone MOB), and senior housing** have essentially no free, current, and market-representative cap rate data. Cap rate data for these types is:

- **Data centers:** Entirely gated behind CBRE/JLL client relationships or CoStar subscription; hyperscale vs. retail colocation distinction makes any public aggregate nearly meaningless anyway. NAREIT's Data Center REIT subsector implied cap rate (in T-Tracker) is the only free proxy.

- **Medical office (MOB):** CoStar and CBRE EA track MOB cap rates but publish only to subscribers. CBRE's cap rate survey includes MOB as an appendix sub-type but MSA detail requires registering and downloading the full report.

- **Senior housing:** NIC MAP is the definitive source and charges institutional fees. NIC's free blog posts cite quarterly NCREIF senior housing returns (e.g., 9.21% TTM in Q3 2025) but do not publish cap rates.[^8]

- **Single-tenant net lease (STNL):** Marcus & Millichap and CBRE have STNL-specific free reports, but tenant-credit-grade differentiation is paywalled through CoStar/Net Lease World.

**Cheapest paid access to premium cap rate data:**

| Vendor | What You Get | Approx. Entry Price |
|---|---|---|
| **CoStar** | Property-level cap rates, MSA analytics, CMBS data | ~$6,000–$15,000/year (market analytics module) |
| **MSCI RCA** | Transaction-level cap rates, deal flow, global | ~$10,000–$25,000/year |
| **Green Street CPPI + Sector Reports** | Monthly CPPI by sector, cap rate estimates, NAV | ~$20,000–$30,000/year |
| **Trepp TreppIQ** | CMBS loan-level cap rates, surveillance | ~$8,000–$20,000/year |
| **CRED iQ** | CMBS cap rates, distress analytics, loan-level | ~$5,000–$12,000/year (most accessible entry) |
| **ACLI CMC Annual** | Life company cap rates, coupon, LTV, DSCR by type | ~$1,300/year (only direct-publish cap rate time series at this price point) |
| **PwC/Altus Real Estate Investor Survey** | Quarterly survey cap rates by type and market | ~$3,000–$5,000/year |

For a practitioner on a tight budget, the **ACLI CMC at $1,300/year** is the cheapest way to get a true cap rate time series (fixed-rate life company commitments by property type, quarterly back to the 1970s). **CRED iQ's entry tier** at roughly $5,000–$12,000/year provides the richest CMBS cap rate analytics for deal-level work.

---

## References

1. [NCREIF Query Tool](https://user.ncreif.org/data-products/ncreif-query-tool/) - The custom query tool allows users to create their own custom benchmarks or datasets. There are two ...

2. [Index Returns - NCREIF](https://ncreif.org/data/index-returns/) - NCREIF Members should Login to view detailed data and reports. You can view the latest index Press R...

3. [[PDF] NPI-1Q2025-Press-Release(2).pdf - NCREIF](https://ncreif.org/__static/jdj5jdewjdndanz4dtz1ngrhwjhlmmzk/NPI-1Q2025-Press-Release(2).pdf) - The unleveraged quarterly return for the first quarter of 2025 was 1.29%. The returns are detailed i...

4. [[PDF] NPI-2Q2025-Press-Release.pdf - NCREIF](https://ncreif.org/__static/jdj5jdewjeztl3dsednwcdzxm3lmznjv/NPI-2Q2025-Press-Release.pdf) - The unleveraged quarterly return for the second quarter of 2025 was 1.23%, bringing the total return...

5. [[PDF] NPI Return - NCREIF](https://ncreif.org/__static/jdj5jdewjflcvw1vytcymnhroukxdzvp/NPI-3Q2025-Press-Release(3).pdf) - CHICAGO, IL, October 24, 2025 –The National Council of Real Estate Investment Fiduciaries (NCREIF) h...

6. [[PDF] Expanded NPI Flash 2nd Quarter 2025 - NCREIF](https://ncreif.org/__static/jdj5jdewjfeuzxhyv1dzcejycdmwt2nz/Expanded-NPI-Snapshot-Flash-20252.pdf) - The database increases quarterly as participants acquire properties and as new members join NCREIF. ...

7. [[PDF] NCREIF/CREFC Open-end Debt Fund Aggregate](https://ncreif.org/__static/jdj5jdewjgkulkpiqthmqzrkrnhyavr4/Public-Snapshot-6-30-25-NCREIF-CREFC-Debt-Fund-Aggregate.pdf) - NCREIF/CREFC. Open-end Debt Fund Aggregate. Snapshot Report. SECOND QUARTER 2025. Consultation. Edit...

8. [Senior Housing Posts Highest NCREIF Property Type Return in ...](https://www.nic.org/blog/senior-housing-posts-highest-ncreif-property-type-return-in-third-quarter-and-year-to-date-2025/) - Senior housing posted a positive total return of 2.88% in the third quarter of 2025, bringing year-t...

9. [[PDF] ACLI Investment Bulletin Subscription Order Form](https://www.acli.com/-/media/public/pdf/news-and-analysis/publications-and-research/2024_investment_bulletin_order_form.pdf) - STARTING. QTR-MO/YEAR. Commercial Mortgage Commitments Quarterly (CMC-Q). 1st thru 3rd quarter at $5...

10. [Publications & Research - The American Council of Life Insurers](https://www.acli.com/news-and-analysis/publications-and-research) - This index is released quarterly, the ACLI Financial Resilience Index ... Commercial Mortgage Commit...

11. [Investment Bulletins - The American Council of Life Insurers](https://www.acli.com/news-and-analysis/investment-bulletins) - The Commercial Mortgage Commitments report is a primary source of industry information on mortgage l...

12. [[PDF] Investment Opportunities in Private Commercial Mortgage Investments](https://investments.metlife.com/content/dam/metlifecom/us/investments/insights/research-topics/real-estate/images-new/Article/investmen-opportunities-in-private-commercial-mortgage-investments/mim-investment-ppportunities-in-U.S.-private-commercial-mortgage-investments-October-2022.pdf) - Source: ACLI Commercial Mortgage Commitments Historical Database (Fixed Rate Mortgages), Bloomberg U...

13. [Delinquency Rates for Commercial Properties Increased in the First ...](https://www.mba.org/news-and-research/newsroom/news/2025/05/13/delinquency-rates-for-commercial-properties-increased-in-first-quarter-2025) - The delinquency rate for commercial mortgages increased again in the first quarter of 2025, driven b...

14. [Commercial Real Estate Price Index, Level (BOGZ1FL075035503Q ...](https://fred.stlouisfed.org/series/BOGZ1FL075035503Q) - Graph and download economic data for Interest Rates and Price Indexes; Commercial Real Estate Price ...

15. [Commercial Real Estate Prices for United States (COMREPUSQ159N)](https://fred.stlouisfed.org/series/COMREPUSQ159N) - This series covers commercial real estate price indices. Currently, there is limited international e...

16. [Delinquency Rate on Commercial Real Estate Loans ... - FRED](https://fred.stlouisfed.org/series/DRCRELEXFACBS) - Graph and download economic data for Delinquency Rate on Commercial Real Estate Loans (Excluding Far...

17. [Table Data - Delinquency Rate on Commercial Real Estate Loans ...](https://fred.stlouisfed.org/data/DRCRELEXFACBS) - Title, Delinquency Rate on Commercial Real Estate Loans (Excluding Farmland), Booked in Domestic Off...

18. [Delinquency Rate on Commercial Real Estate Loans (Excluding ...](https://fred.stlouisfed.org/series/DRCRELEXFOBS) - Delinquency rate on commercial real estate loans (excluding farmland), booked in domestic offices, b...

19. [Commercial Real Estate Loans, All Commercial Banks ... - FRED](https://fred.stlouisfed.org/series/H8B3219NCBCMG) - These series are break adjusted. The percent changes are at a simple annual rate and have been adjus...

20. [Market Yield on U.S. Treasury Securities at 10-Year Constant ...](https://fred.stlouisfed.org/series/DFII10) - View data of the inflation-adjusted interest rates on 10-year Treasury securities with a constant ma...

21. [Interest Rates, Discount Rate for United States (INTDSRUSM193N)](https://fred.stlouisfed.org/series/INTDSRUSM193N) - Interest Rates, Discount Rate for United States (INTDSRUSM193N) Observations Aug 2021: 0.25 | Percen...

22. [Senior Loan Officer Opinion Survey on Bank Lending Practices](https://www.federalreserve.gov/data/sloos.htm) - Questions cover changes in the standards and terms of the banks' lending and the state of business a...

23. [Lending standards ease — constructive signal for commercial real ...](https://www.invesco.com/us/en/insights/lending-standards-ease-constructive-signal-for-commercial-real-estate.html) - The Senior Loan Officer Opinion Survey on Bank Lending Practices (SLOOS) is a quarterly survey condu...

24. [SLOOS - Economic Data Series | FRED | St. Louis Fed](https://fred.stlouisfed.org/tags/series?t=sloos) - 639 economic data series with tag: SLOOS. FRED: Download, graph, and track economic data. Senior Loa...

25. [FRB: Charge-Off and Delinquency Rates on Loans and Leases at ...](https://www.federalreserve.gov/releases/chargeoff/) - Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks · The 100 largest banks are...

26. [FRB: Charge-Off and Delinquency Rates on Loans and Leases at ...](https://www.federalreserve.gov/releases/chargeoff/delallsa.htm) - Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks · Delinquency Rates · Notes...

27. [iWRDS Data Catalog - Wharton AI & Analytics Initiative](https://ai-analytics.wharton.upenn.edu/iwrds-data-catalog/) - This dataset includes exposures to email and online display advertisements from a travel business co...

28. [Real Estate: Data sources - NYU Libraries Research Guides](https://guides.nyu.edu/c.php?g=276881&p=1846357) - Provides in-depth commercial real estate property data and analytics, including vacancy rates, rent ...

29. [Report from the President - Lincoln Institute of Land Policy](https://www.lincolninst.edu/publications/articles/report-president-7/) - A new initiative of the Lincoln Institute is to compile data relevant to the analysis of land and ta...

30. [Estimating Land Values Using Residential Sales Data](https://www.lincolninst.edu/publications/working-papers/estimating-land-values-using-residential-sales-data/) - In the first step, we use single-family residential sales data to estimate a constant-quality price ...

31. [Real Estate Industry: Commercial Real Estate - Kresge Guides](https://kresgeguides.bus.umich.edu/realestate/commercial) - Each quarterly survey issue contains: cash flow assumption data for select national and regional mar...

32. [Available Datasets Overview - SCRC Documentation - GitHub Pages](https://ctzn-vishal.github.io/SCRC_Docs/research-datasets/available-datasets-overview/) - This document provides a summary of major research datasets available to the NYU Stern community thr...

33. [Assessor Parcels Data 2006 thru 2021 - LA County GIS Hub](https://egis-lacounty.hub.arcgis.com/datasets/bffc21600e5f408ea6791d1bce7738ae) - Downloadable Assessor Parcel Data File. For more information visit:https://portal.assessor.lacounty....

34. [County of Los Angeles Open Data](https://data.lacounty.gov) - This site provides you with the ability to filter data, create visualizations, develop apps, support...

35. [Assessor - Parcel Sales - Cook County Open Data](https://datacatalog.cookcountyil.gov/Property-Taxation/Assessor-Parcel-Sales/wvhk-k5uv) - Parcel sales for real property in Cook County, from 1999 to present. The Assessor's Office uses this...

36. [Property Open Data - Cook Central](https://hub-cookcountyil.opendata.arcgis.com/pages/property-open-data) - Cook County maintains and manages nearly 2 million parcels. About 30-50 thousand parcel edits are ma...

37. [Public Data - Harris Central Appraisal District](https://hcad.org/hcad-online-services/pdata/) - Download property data consists of certified/preliminary values from the HCAD Real and Personal prop...

38. [Download Property Data - Harris Central Appraisal District](https://hcad.org/pdata/pdata-property-downloads.html) - Download property data. Text files contain the data from the HCAD Real & Personal Property Database ...

39. [Data Downloads - Maricopa County Assessor's Office](https://www.mcassessor.maricopa.gov/page/data_sales/) - This feature allows you to access datasets at no cost. Please keep in mind that after downloading th...

40. [Miami Dade Property Appraiser File Library - Miami-Dade County ...](https://bbs.miamidadepa.gov) - The data files may be downloaded at a cost of $50.00 (50 credits) per file. If you would like to req...

41. [Miami-Dade County Open Data Hub](https://gis-mdc.opendata.arcgis.com) - As a data consumer, you can explore, download, visualize, embed, and share datasets. As an applicati...

42. [ACRIS - NYC.gov](https://www.nyc.gov/site/finance/property/acris.page) - The Automated City Register Information System (ACRIS) allows you to search property records and vie...

43. [ACRIS NYC: The Complete Guide to NYC Property Records (2026)](https://www.eastcoastappraisal.com/acris-nyc-property-records-guide) - ACRIS is NYC's free property records database. Learn what it is, how to look up who owns a property ...

44. [How to find Queens County NY Property Records](https://www.queenshometeam.com/blog/find-queens-county-ny-property-records/) - Records dated after 1966 can be recorded and corrected through the Automated City Register Informati...

45. [ACRIS: How to Search NYC Property Records Like a Pro](https://www.coolhandmovers.com/moving-tips-guides/acris-how-to-search-nyc-property-records-like-a-pro) - Go to www.nyc.gov/acris or search “NYC ACRIS” online. 2. Click on 'Search Property Records'. You'll ...

46. [Record a document - King County, Washington](https://kingcounty.gov/en/dept/executive-services/certificates-permits-licenses/records-licensing/recorders-office/document-recording) - Parcel viewer property search · Property tax payment information · Property research · Property tax ...

47. [Recorder's Office - King County, Washington](https://kingcounty.gov/en/dept/executive-services/certificates-permits-licenses/records-licensing/recorders-office) - Parcel viewer property search · Property tax payment information · Property research · Property tax ...

48. [Data Files - Welcome to Clark County, NV](https://www.clarkcountynv.gov/government/assessor/datafiles) - Information from the Clark County Assessor's Office computerized records is available for purchase i...

49. [Real Property Records Search - Assessor - Clark County](https://www.clarkcountynv.gov/government/assessor/property_search/real-property-records) - Search by one of the following: Parcel Number, Owner Name, Address, Subdivision Name, Subdivision Ow...

50. [Real Capital Analytics - MSCI](https://www.msci.com/data-and-analytics/real-estate/real-capital-analytics) - Transparent, proprietary intelligence across global private real estate markets connecting investors...

51. [Latest on US Commercial-Property Pricing - MSCI](https://www.msci.com/research-and-insights/paper/rca-commercial-property-price-indexes-rca-cppi) - MSCI's commercial-property price indexes (RCA CPPI™) provide a consistent measure of transacted sale...

52. [Economic Update – March 26, 2026 | SVN | Miller Commercial Real ...](https://svnmiller.com/economic-update-march-26-2026/) - COMMERCIAL PROPERTY PRICES • According to the latest data from MSCI-RCA, commercial property prices ...

53. [US RCA Capital Trends Report - MSCI](https://www.msci.com/data-and-analytics/real-estate/us-rca-capital-trends-report) - The US RCA Capital Trends report provides a timely view of investment activity across U.S. commercia...

54. [Commercial Property Pricing Index - Green Street](https://www.greenstreet.com/resources/pricing-index/) - Newport Beach, CA, December 4, 2025 — The Green Street Commercial Property Price Index® increased 0....

55. [Green Street: Home](https://www.greenstreet.com) - Get the most out of all that Green Street has to offer. Pricing Index. Green Street's monthly CPPI® ...

56. [What Green Street's Latest CPPI Tells Us About 2026 - LinkedIn](https://www.linkedin.com/pulse/what-green-streets-latest-cppi-tells-us-2026-logan-d-freeman-l7q0c) - Jan 2026: 130.3 (unchanged from Dec 2025); Jan 2025: 127.3; 2022 Peak: 155.0; 12-Month Change: +2.4%...

57. [Green Street Data Show Stabilized Pricing, Not A New Rally - Globest](https://www.globest.com/2026/02/09/green-street-data-show-stabilized-pricing-not-a-new-rally/) - Where the Market Stands Now. Green Street pegs the all-property CPPI at 130.3, an aggregate level th...

58. [The Green Street European Commercial Property Price ... - LinkedIn](https://www.linkedin.com/posts/green-street_the-green-street-european-commercial-property-activity-7449709325117177857-tbQQ) - Sign up to receive Green Street's CPPI report and data delivered directly to your inbox each month, ...

59. [Green Street's Commercial Property Price Index (CPPI)](https://resources.crefc.org/green-street-s-commercial-property-price-index-cppi/) - Green Street's Commercial Property Price Index is a time series of unleveraged U.S. commercial prope...

60. [U.S. Cap Rate Survey H2 2025 - CBRE](https://www.cbre.com/insights/reports/us-cap-rate-survey-h2-2025) - U.S. cap rates show signs of stabilization, with improving liquidity, firmer pricing and growing con...

61. [U.S. Cap Rate Survey H1 2025 | CBRE](https://www.cbre.com/insights/reports/us-cap-rate-survey-h1-2025) - U.S. Cap Rate Survey H1 2025. Most respondents believe that cap rates have peaked. August 20, 2025 5...

62. [Commercial real estate trends and insights | JLL](https://www.jll.com/en-us/insights) - JLL's regular view on global real estate dynamics, covering: investment, office, logistics, retail, ...

63. [U.S. Office Market Dynamics, Q1 2026 - JLL](https://www.jll.com/en-us/insights/market-dynamics/us-office) - Single-asset sales volume reached $11.5 billion in Q1, the highest Q1 total since 2020, growing 40% ...

64. [Cushman & Wakefield's Q4 2025 US MarketBeat Report - LinkedIn](https://www.linkedin.com/posts/cushman-&-wakefield_cushman-wakefields-q4-2025-us-marketbeat-activity-7417624504912379904-K3fx) - As noted below, Cushman & Wakefield's Q4 2025 MarketBeat reports are available for the four major pr...

65. [Market Research - Cushman & Wakefield Multifamily Advisory Group](https://multifamily.cushwake.com/Research/2) - 2025 / Q12025.Q1 - Multifamily MarketBeat.pdf; 2024 / Q32024.Q3 - Multifamily MarketBeat.pdf; 2024 /...

66. [Cushman & Wakefield releases Q2 2025 U.S. MarketBeat reports](https://www.linkedin.com/posts/cushman-&-wakefield_cushman-wakefields-q2-2025-us-marketbeat-activity-7350967824342790144-0dJb) - • Office: Facing headwinds from hybrid work models, office cap rates have softened slightly, averagi...

67. [Real Estate Research Sources | Leon Hess Business School](https://www.monmouth.edu/business-school/departments/department-of-economics-finance-real-estate/research-sources/real-estate-research-sources/) - Free local market reports for office, hotel, apartment, etc., and includes employment, construction,...

68. [Commercial Real Estate Research | Marcus & Millichap](https://www.marcusmillichap.com/research) - Browse our research reports below or contact your local Marcus & Millichap agent for more personaliz...

69. [Investor Relations :: Marcus & Millichap, Inc. (MMI)](https://ir.marcusmillichap.com) - Marcus & Millichap Releases New Single-Tenant Retail Reports as Industry Gathers at ICSC Las Vegas ....

70. [Capital Markets Report | Newmark](https://www.nmrk.com/insights/market-report/united-states-capital-markets-report) - Commercial real estate (CRE) debt origination maintained strong momentum in the first quarter of 202...

71. [U.S. Office Market Insights Q1 2025 | PDF - Scribd](https://www.scribd.com/document/903767647/Q1-2025-US-Office-Report) - ... 2025 US Office Report - Free download as PDF ... insights | Q1 2025 Source: Avison Young Market ...

72. [2025 Berkadia U.S. Student Housing Market Report](https://www.berkadia.com/lp/2025-berkadia-us-student-housing-market-report/) - Berkadia's 2025 U.S. Student Housing Market Report is now available. We analyze the impact of 2024's...

73. [Commercial Real Estate Market Insights](https://www.nar.realtor/commercial-real-estate-market-insights) - The Commercial Real Estate Market Insights Report provides in-depth analysis and market insights on ...

74. [August 2025 | NAR Commercial Real Estate Market Insights - CARW](https://carw.com/august-2025-nar-commercial-real-estate-market-insights/) - As of July 2025, the multifamily market shows continued signs of stabilization, with net absorption ...

75. [The NAIOP CRE Sentiment Index](https://www.naiop.org/research-and-publications/sentiment-index/) - The NAIOP CRE Sentiment Index is designed to predict general conditions in the commercial real estat...

76. [Trepp: Multifamily CMBS delinquencies, servicing rates fall](https://www.multifamilydive.com/news/cmbs-debt-delinquent-multifamily-loan-special-servicing/750723/) - Commercial real estate delinquencies ticked up 5 bps to 7.08% in May, while the special servicing ra...

77. [CMBS Delinquency Rate Increased to Open 2026 as Office ... - Trepp](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-increased-to-open-2026) - The overall US CMBS delinquency rate increased by 17 basis points to 7.47% for the month. The percen...

78. [Download the March 2023 Trepp CMBS Delinquency Report](https://www.trepp.com/instantly-access-delinquency-report-march-2023) - If you would like more information on our products or would like to speak with a member of our team,...

79. [Recent Conduit Cap Rate & Interest Rate Trends - CRED iQ](https://cred-iq.com/blog/2025/06/12/recent-conduit-cap-rate-interest-rate-trends/) - Office cap rates ranged from 4.31% to 10.63% with an average of 7.34%, down 10 BPS February print (7...

80. [Cap Rate Trends are Steadily Increasing - CRED iQ](https://cred-iq.com/blog/2025/02/21/cap-rate-trends-are-steadily-increasing/) - Interest rates for multifamily loans in CMBS deals ranged from 5.20% to 7.70% with an average of 6.6...

81. [CRED iQ Market Update: Navigating CMBS Distress and Broader ...](https://cred-iq.com/blog/2025/10/02/cred-iq-market-update-navigating-cmbs-distress-and-broader-cre-trends-in-q3-2025/) - Starting with CMBS delinquency trends, our tracking shows a slight downward trend in overall distres...

82. [KBRA Releases Research – CMBS Loan Performance Trends](https://www.kbra.com/publications/NYJnvsQp) - Key observations of the December 2025 performance data are as follows: The delinquency rate decrease...

83. [CMBS Troubled Loan Tracker: A Calm Start to 2025 After a Tough ...](https://www.moodyscre.com/insights/research/cmbs-troubled-loan-tracker-a-calm-start-to-2025-after-a-tough-2024/) - The delinquency rate for CMBS conduit loans has decreased, albeit only by a meager 2 bps to 7.61% in...

84. [Moody's CRE: Commercial Real Estate Data Analytics](https://www.moodyscre.com) - Explore Moody's Analytics CRE. Commercial real estate solutions for lenders, investors & brokers. Be...

85. [Structured Finance - CMBS :: Fitch Ratings](https://www.fitchratings.com/structured-finance/cmbs) - Fitch Ratings CMBS Analytical Data provides you with transparent, multi-layered transaction insights...

86. [Delinquency Rates for Commercial Properties Increased in Fourth ...](https://www.mba.org/news-and-research/newsroom/news/2025/01/28/delinquency-rates-for-commercial-properties-increased-in-fourth-quarter-2024) - The delinquency rate for commercial mortgages increased during the final three months of 2024, with ...

87. [BankFind Suite - API Documentation - FDIC](https://api.fdic.gov/banks/docs) - Overview. FDIC's application programming interface (API) lets developers access FDIC's publically av...

88. [Call Report - FFIEC](https://cdr.ffiec.gov) - Through this site you can obtain Reports of Condition and Income (Call Reports) and Uniform Bank Per...

89. [FDIC Statistics on Depository Institutions (SDI) Explained](https://fdicauthority.com/fdic-statistics-on-depository-institutions/) - The FDIC's Statistics on Depository Institutions (SDI) is a publicly accessible database that aggreg...

90. [[PDF] REIT Industry Tracker Results Q1:2025](https://www.reit.com/sites/default/files/2025-05/Ttracker_2025Q1.pdf) - Sources: S&P Capital IQ Pro, Nareit REIT Industry Tracker. Data as of ... Implied Cap Rate. All Equi...

91. [Nareit REIT Industry Tracker](https://www.reit.com/data-research/reit-market-data/report/nareit-reit-industry-tracker) - Nareit's REIT Industry Tracker Series – formerly the Nareit T-Tracker– is ... REIT implied cap rate ...

92. [Nareit T-Tracker® Q1 2025: REIT Industry Insights - LinkedIn](https://www.linkedin.com/posts/david-auerbach_reit-activity-7331352196204183552-GAbn) - ... Implied cap rate stood at 5.6% https://lnkd.in/gw8SNmpw. ... That's where the Free Cash Flow (FC...

93. [FTSE Nareit US Real Estate Indices - LSEG](https://www.lseg.com/en/ftse-russell/indices/nareit) - Index performance ; FTSE Nareit All Equity REITs. 849.17. 0.15 ; FTSE Nareit Composite. 237.00. 0.16...

94. [HUD PD&R Datasets | Housing & Community Development Data](https://www.huduser.gov/portal/pdrdatas_landing.html) - Browse HUD PD&R datasets covering housing markets, income limits, fair market rents, homelessness, a...

95. [HUD Fair Market Rents (40th PERCENTILE RENTS) - HUD User](https://www.huduser.gov/portal/datasets/fmr.html) - Access HUD Fair Market Rents (FMR) data by year, county, and metro area. Find Section 8 payment stan...

96. [Multifamily Tax Subsidy Projects (MTSP) Income Limits - HUD User](https://www.huduser.gov/portal/datasets/mtsp.html) - Access MTSP income limits by year, county, and metro area for LIHTC and multifamily housing programs...

97. [PD&R's U.S. Housing Market Conditions Database: An Overview of ...](https://www.huduser.gov/portal/pdredge/pdr-edge-spotlight-article-020526.html) - HUD's Office of Policy Development and Research (PD&R) updates the graphs, tables, and downloadable ...

98. [Multifamily Assistance & Section 8 Database - HUD](https://www.hud.gov/hud-partners/multifamily-assist-section8-database) - Download of the Assistance and Section 8 Contracts - This compressed, (self extracting) file is offe...

99. [Real Estate Metrics - Data & APIs](https://www.zillowgroup.com/developers/api/public-data/real-estate-metrics/) - In terms of aggregate data at the neighborhood level, can be found here – https://www.zillow.com/res...

100. [Housing Data - Zillow Research](https://www.zillow.com/research/data/) - Download. RENTAL FORECASTS. Zillow Observed Rent Forecast (ZORF): A month-ahead, quarter-ahead and y...

101. [Data & Rent Estimates - Apartment List Blog](https://www.apartmentlist.com/research/category/data-rent-estimates) - Read about and download the latest rental data in your area. Access the latest rental market data fo...

102. [Apartment List National Rent Report](https://www.apartmentlist.com/research/national-rent-data) - The national median rent increased by 0.5% in April, and now stands at $1,370. This marks the third ...

103. [February 2025 Apartment Market Update - RealPage](https://www.realpage.com/analytics/february-2025-data-update/) - Apartment rents in market-rate units grew 0.41% in February, according to data from RealPage Market ...

104. [Rent Cuts Continue in the US Apartment Market as Occupancy Falls ...](https://www.realpage.com/analytics/november-2025-data-update/) - RealPage Analytics delivers the most accurate apartment data ... Infographic detailing U.S. apartmen...

105. [Income Limits Data for HUD Housing Assistance Programs](https://www.huduser.gov/portal/datasets/il.html) - Access HUD Income Limits data by year, county, and metro area. Find Area Median Income (AMI), Sectio...

106. [U.S. Industrial Market Dynamics, Q1 2026 - JLL](https://www.jll.com/en-us/insights/market-dynamics/industrial-market-statistics-trends) - Nationally, the vacancy rate held at 7.5% in Q1 but is expected to begin trending downward as existi...

107. [Commercial Real Estate Cap Rates Show Measured Expansion ...](https://cred-iq.com/blog/2026/01/30/commercial-real-estate-cap-rates-show-measured-expansion-through-2025/) - Commercial real estate cap rates exhibited a steady upward trajectory throughout 2025, according to ...

108. [United States Retail Market Dynamics Q1 2026 - JLL](https://www.jll.com/en-us/insights/market-dynamics/us-retail) - The U.S. retail market entered 2026 with negative net absorption of -4.4 million square feet, mirror...

