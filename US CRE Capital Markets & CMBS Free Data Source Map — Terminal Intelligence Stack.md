# US CRE Capital Markets & CMBS Free Data Source Map
### Terminal Intelligence Stack — Capital Markets Pulse + CMBS Watchlist Tickers
*Designed for Israeli Family Offices & Institutional LPs Investing in US CRE | Coverage: 2024–2026*

***

## Executive Summary

This document maps every material **free or freemium** data source for US commercial real estate capital markets, CMBS issuance/performance, private credit dry powder, and debt fund flows. Each source is profiled with exact endpoints, auth requirements, rate limits, field coverage, and the terminal tile it powers. The stack is organized by tier relevance for a Bloomberg-style CRE intelligence terminal targeting Tier 2 (CMBS Surveillance) and Tier 5 (Capital Markets Pulse) intelligence layers.

As of Q1 2025, total US commercial/multifamily mortgage debt outstanding reached $4.93 trillion, with CMBS delinquency at approximately 7.1–7.5% (Trepp/KBRA cross-reference). Hard CMBS maturities have averaged over $80 billion per year for 2024–2025, making the maturity wall the single most important signal for terminal subscribers.[^1][^2][^3][^4]

***

## Master Data Source Table

| # | Source Name | Exact URL / Endpoint | Free vs Freemium vs Paid | Free-tier Rate Limit / Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|------------|---------------------|--------------------------|------------------------------|-----------------|-------------|---------------|--------------------------|----------------------|---------------|-----------------|
| 1 | **SEC EDGAR Full-Text Search (EFTS)** | `https://efts.sec.gov/LATEST/search-index?q=%22424B5%22+%22commercial+mortgage%22&forms=424B5&dateRange=custom&startdt=2024-01-01&enddt=2024-12-31` | Free | 10 req/sec per IP[^5] | Near-real-time (<5 min lag) | JSON | No (User-Agent header required) | Filing date, CIK, accession number, form type, entity name, URLs to docs | SEC CMBS Issuance Stats, Trepp Blog | CMBS New Issuance Ticker | Query `forms=424B5` for CMBS prospectuses; `forms=ABS-15G` for shelf registrations; SIC `6189` filters ABS issuers. `dateRange` params are ISO dates. |
| 2 | **SEC EDGAR ABS-EE Asset-Level CMBS Data** | `https://data.sec.gov/submissions/CIK##########.json` then navigate to ABS-EE exhibit EX-102 XML | Free | 10 req/sec[^5] | Per offering (at issuance + ongoing) | XML (Schedule AL schema) | No (User-Agent required) | Loan ID, property type, UPB, origination date, LTV, DSCR, occupancy, payment status, servicer name | KBRA presales, Trepp deal-level | CMBS Deal Analytics / Loan-Level Drill-Down | ABS-EE EX-102 exhibits contain Schedule AL. Use `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=ABS-EE&dateb=&owner=include&count=40` to list filers. XML schema documented at SEC.gov[^6][^7]. |
| 3 | **SEC EDGAR CMBS Issuance Stats Download** | `https://www.sec.gov/data-research/statistics-data-visualizations/commercial-mortgage-backed-securities-cmbs-issuances` | Free | Unlimited (static file) | Quarterly | XLSX | No | Number of issuances (144A, Registered, Agency, Outside US), total deal volume ($B), quarterly breakdowns from 2016–present[^8] | Trepp monthly blog, KBRA CMBS Trend Watch | Capital Markets Pulse — Issuance Volume Ticker | Data sourced from CM Alert (Green Street). Download the XLSX directly. 2024 full year = $156.5B total, 302 deals[^8]. |
| 4 | **SEC EDGAR Company Submissions API** | `https://data.sec.gov/submissions/CIK0001061630.json` (example: BXMT) | Free | 10 req/sec[^9] | <5 min after filing | JSON | No (User-Agent header) | All filings: form type, date, accession number, links to docs, SIC code, entity name | EDGAR XBRL, FINRA TRACE | Mortgage REIT Watchlist / Private Credit Tracker | CIKs for key mREITs: BXMT=1061630; STWD=1462418; KREF=1631596; LADR=1577670; ARI=1422929; TRTX=1700010. Combine with XBRL facts API for structured financials. |
| 5 | **SEC EDGAR XBRL Financial Facts API** | `https://data.sec.gov/api/xbrl/companyfacts/CIK0001061630.json` | Free | 10 req/sec[^9] | Per filing | JSON | No | All XBRL-tagged facts: total loans, allowance for loan losses, net interest income, leverage, CRE loan breakdown by property type, debt maturity schedule | FDIC H.8, Fed SLOOS | Mortgage REIT CRE Loan Portfolio Tracker | Critical for extracting BXMT, STWD, KREF, ARI, TRTX, LADR, GPMT loan book size, watch list, REO, and payment-in-kind data. |
| 6 | **Federal Reserve FRED API** | `https://api.stlouisfed.org/fred/series/observations?series_id=DRCRELEXFACBS&api_key={KEY}&file_type=json` | Free (API key required) | 120 req/min[^10] | Weekly/Quarterly per series | JSON / XML | Yes — free registration at fredaccount.stlouisfed.org[^10] | See FRED CRE Series block below | H.8, Z.1, MBA, FDIC | Multiple tiles: CRE Delinquency, Lending Standards, Spread Watch | Key is free; 120 req/min; bulk download also available. |
| 7 | **Federal Reserve Z.1 Financial Accounts** | `https://www.federalreserve.gov/datadownload/choose.aspx?rel=z1` or via FRED release ID 52[^11] | Free | Unlimited | Quarterly (~90-day lag) | ZIP/CSV/XML or FRED JSON | No | Commercial mortgage debt outstanding by holder type: GSEs, life insurers, banks, CMBS/ABS, non-agency; flow of funds; balance sheet[^12][^13] | MBA Mortgage Debt Outstanding, ACLI | Capital Markets Pulse — CRE Debt by Holder Type | Release table `FL893065105.Q` = total commercial mortgage debt. Key series: `BOGZ1FL075035503Q` (CRE price index), `FL893065105Q` (total CRE debt). |
| 8 | **Federal Reserve H.8 — Commercial Bank Assets** | `https://www.federalreserve.gov/releases/h8/current/` or FRED series `DRCRELEXFACBS`, `REALLN`, `H8B1026NCBCMG`[^14][^15] | Free | 120 req/min (FRED) | Weekly | JSON (FRED) / CSV (DDP) | No (FRED key for API) | CRE loans at all commercial banks (SA/NSA), real estate loans total, 100 largest banks vs others, commercial RE delinquency rate[^16] | FDIC Call Reports, SLOOS | Regional Bank Pullback Gauge | FRED series `DRCRELEXFACBS` = delinquency rate on CRE loans ex-farmland. Updated weekly on H.8 but delinquency quarterly. Critical for tracking regional bank retreat from CRE. |
| 9 | **FDIC BankFind Suite API** | `https://banks.data.fdic.gov/api/financials?filters=REPDTE%3A20241231&fields=REPDTE,CERT,REPNO,LNRE,LNRECONS,LNRENRES,LNRECRCD&limit=10000` | Free | No key required; generous limits[^17] | Quarterly (Call Reports) | JSON | No | CRE loans (LNRENRES = non-residential CRE), construction/land (LNRECONS), CRE delinquency, charge-offs, total assets, Tier 1 capital[^17][^18] | H.8, FFIEC, SLOOS | Bank CRE Concentration Risk Map | `LNRENRES` / total assets = CRE concentration ratio per bank. Bulk download at `banks.data.fdic.gov/bankfind-suite/bulkData/bulkDataDownload`[^19]. Schedule RC-C line items. No API key needed. |
| 10 | **FFIEC CDR Bulk Call Report Download** | `https://cdr.ffiec.gov/public/PWS/DownloadBulkData.aspx` | Free | Unlimited (bulk ZIP) | Quarterly | XBRL / Excel ZIP | No | Full schedule RC/RC-C/RC-N for every FDIC-insured institution: CRE loans by type, past-due buckets, nonaccrual, OREO, allowances[^20][^21] | FDIC API, H.8, OCC | Bank CRE Stress Dashboard | Deeper than FDIC API — full schedule-level granularity. RC-C Part 1 = RE loan detail. RC-N = past due / nonaccrual. Bulk files are large (>1GB compressed). |
| 11 | **Federal Reserve SLOOS — CRE Questions** | `https://www.federalreserve.gov/data/sloos.htm` + FRED tag `sloos` (639 series)[^22][^23] | Free | 120 req/min (FRED) | Quarterly (4x/year + ad-hoc) | PDF + FRED JSON | No (FRED key for API) | Net % of banks tightening CRE standards (construction, land dev, nonfarm nonresidential), demand for CRE loans, spread over cost of funds, max LTV[^24] | H.8, FDIC, KBRA commentary | Lending Standards Tightening Indicator | FRED series: `DRTSCLACBS` (net % tightening C&I), `STDSAGG` (CRE), `DRTSCILM` (large CRE). Survey released 4x/year; about 2-week lag to FOMC meeting. |
| 12 | **Federal Reserve Beige Book** | `https://www.federalreserve.gov/monetarypolicy/publications/beige-book-default.htm` | Free | Unlimited | 8x/year (6-week cadence) | PDF + HTML | No | Qualitative CRE commentary per district: office vacancy, multifamily demand, construction pipeline, appraisal values, lending tightening, cap rate mentions[^25] | SLOOS, MBA originations | Capital Markets Sentiment Feed | Full text searchable. Parse CRE-specific sentences with NLP. RSS not native but can monitor URL for updates. |
| 13 | **Trepp Blog — Monthly CMBS Delinquency** | `https://www.trepp.com/trepptalk` | Freemium (blog = free; platform = paid) | Unlimited (public blog) | Monthly (headline rate) | HTML / inline tables | No | Overall CMBS delinquency rate, 30/60/90+ day buckets, special servicing rate, property type breakdown (office/retail/hotel/multifamily/industrial), month-over-month change[^26][^27][^28] | CRED iQ, KBRA, MBA | CMBS Delinquency Ticker / Maturity Wall Monitor | March 2025: overall 6.65%, seriously delinquent 6.32%[^26]. Feb 2026: 7.14%[^2]. Blog posts free; parse HTML or set Google Alert. Full loan-level data requires Trepp Pro ($$$). |
| 14 | **CRED iQ Monthly Distress Report** | `https://cred-iq.com/blog/` | Freemium (reports free; platform = paid) | Unlimited (public blog) | Monthly | HTML / press release | No | Composite distress rate (30+ days DQ + specially serviced), property type drill-down, MSA-level distress for top 50 markets, conduit vs SASB split[^29][^30][^31] | Trepp, KBRA | CMBS Distress Rate Ticker | Jan 2026 distress rate: 11.98%[^32]; July 2025: 11.1%[^30]. Cross-verify vs Trepp (methodology differs slightly—CRED iQ includes current-but-specially-serviced in numerator). |
| 15 | **KBRA CMBS Loan Performance Trends** | `https://www.kbra.com/sectors/cmbs/publications`[^33] | Freemium (public summary; full report = paid) | Unlimited (summary free) | Monthly | PDF (free summary) / Full platform paid | No (for summaries) | 30+ day DQ rate among KBRA-rated CMBS, distress rate (DQ + currently specially serviced), property type breakdown, month-over-month deltas[^1][^34] | Trepp, CRED iQ, MBA | CMBS Watchlist — KBRA Signal | Feb 2026: DQ 7.5%, distress 10.3%[^1]. March 2026: DQ 7.7%[^34]. Free monthly "CMBS Loan Performance Trends" PDF. Pre-sale reports (new deal analysis) publicly available at kbra.com/sectors/cmbs/publications. |
| 16 | **KBRA CMBS Trend Watch** | `https://www.kbra.com/publications/` (search "CMBS Trend Watch") | Free (press releases) | Unlimited | Monthly | PDF | No | Annual CMBS issuance vs prior year, conduit vs SASB vs agency mix, rate environment commentary, upcoming maturity wall estimates[^35] | SEC issuance stats, Trepp | Capital Markets Pulse — Issuance Mix | Dec 2024: US CMBS issuance exceeded $100B for full year[^35]. Published monthly, free PDF. |
| 17 | **Fitch Ratings CMBS Press Releases** | `https://www.fitchratings.com/structured-finance/cmbs` | Free (press/criteria free; full reports = paid) | Unlimited | Per rating action | HTML / PDF | No | Rating actions (upgrades/downgrades/watches/outlooks), deal name, class, rating, surveillance commentary, criteria updates[^36][^37] | KBRA, DBRS, S&P | CMBS Rating Action Feed | Fitch updated CMBS large loan criteria May 21, 2026[^37]. Full presale reports often behind login. Sign up for free alert emails. |
| 18 | **Morningstar DBRS CMBS Surveillance** | `https://dbrs.morningstar.com/research/` (filter by CMBS) | Freemium (some free; full = paid) | Limited free articles | Per action / methodology update | PDF / HTML | Registration required for some | Rating actions, surveillance methodology, credit commentary, deal-level outlooks, US CRE 2026 outlook[^38][^39][^40] | Fitch, KBRA, S&P | CMBS Rating Divergence Monitor | DBRS 2026 Outlook: >$100B in CMBS loans due in 2026, >50% won't refi on time[^38]. Methodology updated April 2026[^39]. Some research free with registration. |
| 19 | **Moody's CMBS Rating Actions** | `https://ratings.moodys.com/ratings-news` or legacy `moodys.com/researchandratings` | Freemium (press = free; full reports = paid) | Unlimited (press) | Per rating action | HTML / press release | No | Provisional/final ratings for new CMBS deals, class-by-class ratings, expected loss, collateral summary, key metrics[^41][^42] | KBRA, Fitch | CMBS New Deal Pricing Monitor | Free press accessible at ratings.moodys.com. Full methodology, investor reports, watchlist require Moody's CreditView subscription ($). |
| 20 | **S&P Global Ratings CMBS Actions** | `https://www.spglobal.com/ratings/en/sectors/structured-finance/commercial-mbs` | Freemium (headlines free; full = paid) | Unlimited (headlines) | Per rating action | HTML / RSS | No | New issuance ratings, surveillance updates, downgrade/upgrade rationale for key conduit/SASB deals, criteria reports | Fitch, KBRA, Moody's | CMBS Rating Feed | S&P reported on European CMBS refinance wall April 2026[^43]. US CMBS headlines free. Full text requires S&P Capital IQ login. |
| 21 | **Fannie Mae Multifamily MBS — DUS Disclose** | `https://capitalmarkets.fanniemae.com/mortgage-backed-securities/multifamily-mbs` or Data Dynamics tool[^44][^45] | Free | Unlimited | Monthly issuance updates | CSV / Data platform | Registration (free) | Multifamily MBS issuance volume, deal-level at-issuance data, monthly loan-level performance, UPB, coupon, maturity, property address[^46][^45] | Freddie Mac K-deals, Ginnie Mae, Z.1 | Agency MF CMBS Issuance Tracker | Data Dynamics at `capitalmarkets.fanniemae.com/tools-applications/data-dynamics` is free to all market participants. Requires free registration. Multifamily issuance summary downloadable[^44]. |
| 22 | **Freddie Mac Multifamily K-Deal Performance** | `https://mf.freddiemac.com/investors/securities-crt-products/k-deals`[^47] and Securities Performance & Lookup[^48] | Free | Unlimited | Monthly | CSV / Web tool | No | K-deal series numbers, CUSIPs, class-level performance, historical deal issuance volumes, loan-level monthly data, prepayment, delinquency[^49] | Fannie DUS Disclose, Ginnie Mae | Agency MF Issuance & Performance Dashboard | K-deal program: ~$60-65B annual issuance historically[^50]. Lookup at `mf.freddiemac.com/investors/performance-lookup`. Monthly updated. Senior tranches GSE-guaranteed. |
| 23 | **Ginnie Mae Multifamily MBS Disclosure** | `https://www.ginniemae.gov/data_and_reports/disclosure_data/Pages/bulk_data_download_layout.aspx`[^51] | Free | Unlimited | Daily/Weekly/Monthly | Fixed-width text / CSV | No | Pool-level and loan-level data for Ginnie MF MBS: UPB, coupon, factor, issuance date, servicer, FHA/VA program type[^51][^52] | Fannie, Freddie, HUD data | Government MBS Issuance Ticker | Daily new issuance republished[^52]. Bulk download layout described at disclosure page. REMIC/Platinum data also available. |
| 24 | **FHFA House Price Index** | `https://www.fhfa.gov/data/hpi`[^53] or FRED `USSTHPI`, `COMREPUSQ159N`[^54] | Free | Unlimited | Quarterly (HPI) | XLS / FRED JSON | No | All-transactions HPI (national/state/metro/ZIP), expanded-data HPI, purchase-only HPI — all repeat-sales[^53][^55] | Z.1 CRE price index, Green Street CPPI | CRE Valuation Reference (correlated signal) | Residential only — use `COMREPUSQ159N` (FRED) and `BOGZ1FL075035503Q` for commercial price index. FHFA HPI is a leading correlated signal for CRE values. |
| 25 | **Federal Reserve CRE Price Index (FRED)** | `https://fred.stlouisfed.org/series/COMREPUSQ159N`[^54] and `BOGZ1FL075035503Q`[^56] | Free | 120 req/min | Quarterly (1-quarter lag) | JSON (FRED API) | FRED API key (free) | Commercial real estate price level quarterly, from Q1 2005 (COMREPUSQ159N) or Q4 1945 (BOGZ1FL075035503Q, Z.1 derived)[^54][^56] | FHFA HPI, NCREIF NPI, Green Street CPPI | CRE Price Level Indicator | COMREPUSQ159N = BIS/Fed estimate of US CRE prices. Not as granular as Green Street CPPI or RCA CPPI (both paid). Most recent = Q2 2025 as of late 2025[^54]. |
| 26 | **ICE BofA CMBS OAS (via FRED)** | FRED series `BAMLC4A0C710YOAS` (AAA CMBS spread), `BAMLHYH0A0HYM2` (HY); search `fred.stlouisfed.org` for "CMBS option adjusted spread"[^57] | Free | 120 req/min | Daily | JSON (FRED API) | FRED API key (free) | AAA CMBS option-adjusted spread, daily from inception; BBB CMBS spreads also available via ICE BofA CMBS index sub-series | Bloomberg Barclays CMBS index (paid), FINRA TRACE spreads | CMBS Spread Ticker (AAA/BBB/IO) | ICE BofA series via FRED are free, daily. This is the single best free proxy for CMBS market-wide spread-to-swaps. Confirm exact series IDs via FRED search "CMBS" + tag `option-adjusted spread`[^57]. |
| 27 | **Federal Reserve FRED — Top CRE Series** | `https://api.stlouisfed.org/fred/series/observations?series_id={ID}&api_key={KEY}&file_type=json` | Free | 120 req/min | Varies | JSON | FRED API key (free) | See CRE FRED Series Reference below[^58][^23] | H.8, Z.1, FDIC, SLOOS | Multiple tiles (see series reference) | Covers delinquency rates, CRE loan volume, spreads, HPI, multifamily lending, lending standards. Critical for macro overlays. |
| 28 | **MBA Quarterly Mortgage Debt Outstanding** | `https://www.mba.org/news-and-research/research-and-economics/commercial-multifamily-research/commercial-multifamily-mortgage-debt-outstanding`[^59] | Free (PDF/press; data tables = member) | Unlimited (PDF) | Quarterly | PDF / press release | No | Total CRE/MF debt outstanding ($T) by holder type: banks, life cos, GSEs, CMBS/ABS, federal agencies, other; quarterly change, annual growth[^60][^3][^59] | Z.1, ACLI, FDIC, Fannie/Freddie | Capital Markets Pulse — Debt Stack by Holder | Q3 2025 = $4.93T total[^3]; Q4 2024 = $4.79T[^60]. Free quarterly press release. Full Excel table = MBA member benefit. Cross-verify against Fed Z.1 release 52. |
| 29 | **MBA Commercial Delinquency Rate Survey** | `https://www.mba.org/news-and-research/research-and-economics/commercial-multifamily-research/commercial-multifamily-mortgage-delinquency-rates`[^61] | Free (press; full table = member) | Unlimited (press) | Quarterly | PDF / press release | No | CMBS DQ rate, bank DQ rate, life company DQ, GSE DQ, FHA MF DQ — all by lender type; 30+ day buckets; property type[^62] | Trepp, CRED iQ, KBRA | CMBS Delinquency Multi-Source Cross-Check | Q4 2024: CMBS 30+ day DQ = 5.3%[^62]; Q3 2025 press available[^61]. Free press release; paid for Excel breakdown. |
| 30 | **Fannie Mae Economic & Strategic Research (ESR)** | `https://www.fanniemae.com/research-and-insights/economic-strategic-research` | Free | Unlimited | Monthly | PDF | No | Multifamily vacancy outlook, rent growth, cap rates, origination volume forecast, macro overlay (GDP, rates, unemployment), MBS supply-demand[^45] | MBA, Freddie Mac AIMI, Fed Beige Book | Multifamily Macro Sentiment Feed | Monthly Economic Outlook includes multifamily market commentary. Free PDF. Excellent for macro overlay on MF CMBS. |
| 31 | **Freddie Mac Multifamily AIMI** | `https://mf.freddiemac.com/research/apartment-investment-market-index` | Free | Unlimited | Quarterly | PDF / data file | No | Apartment Investment Market Index: cash flow growth, property prices, NOI yield spreads, investment conditions by MSA | Fannie Mae ESR, NCREIF NPI, CoStar (paid) | Multifamily Cap Rate / NOI Dashboard | Quarterly free. Shows conditions for investment relative to historical norms. Covers 54 metros. |
| 32 | **ACLI Commercial Mortgage Commitments** | `https://www.acli.com/news-and-analysis/investment-bulletins`[^63] | Paid ($500/quarter)[^64][^65] | N/A — paid subscription | Quarterly | PDF | Subscription | New commercial mortgage commitments by life insurers: volume, LTV, coupon, interest rate, property type, region[^66][^67] | Z.1 (life insurer holdings), MBA, FDIC | Life Insurance CRE Lending Tracker | The ACLI bulletin itself costs ~$500/qtr[^64]. However, **press summaries are published free** by MBA and trade press. Cross-verify via Z.1 FL545035503Q (life insurance co. CRE holdings). |
| 33 | **NAIC Schedule BA / Insurance Data** | `https://content.naic.org/research/financial-data-and-statistical-information` | Freemium (aggregates free; company = paid) | Unlimited (aggregates) | Annual | PDF / data files | Registration | Life insurer real estate holdings, Schedule BA (other long-term invested assets including CRE equity), Schedule B (mortgages), allocation % by company | ACLI, Z.1 | Life Insurer CRE Allocation Tracker | Annual statutory filings. Individual insurer data requires NAIC subscription. ACLI aggregates it for free in their fact book (annual, public). |
| 34 | **Public mREIT / BDC EDGAR XBRL** | `https://data.sec.gov/api/xbrl/companyfacts/CIK{NUM}.json` — Key tickers below[^9] | Free | 10 req/sec | Per 10-Q / 10-K filing (quarterly) | JSON | No | Loan book UPB, property type mix, weighted avg LTV/DSCR, non-accrual %, senior/sub mix, debt-to-equity, cost of financing, book value per share, NPL/REO[^68] | Trepp (loan-level), KBRA | Private Credit Portfolio Exposure Map | CIKs: BXMT=1061630[^68], STWD=1462418, KREF=1631596, ARI=1422929, TRTX=1700010, LADR=1577670, GPMT=1631569, RC=0001407623 (Ready Capital). Pull XBRL facts for structured loan data. |
| 35 | **Blackstone Mortgage Trust (BXMT) IR** | `https://ir.blackstonemortgagetrust.com/financial-disclosures-and-sec-filings`[^69] | Free | Unlimited | Quarterly | PDF / EDGAR filing | No | Total loan portfolio, office/retail/MF/hotel exposure, non-accrual %, loan-to-value, floating vs fixed, currency mix, geographic split, risk-rating migration | EDGAR XBRL, KREF, STWD | Private Credit Dry Powder / mREIT Stress Panel | Q4 2025 results released Feb 2026[^70]. BXMT is the bellwether for CRE private credit stress. Watch non-accrual % and REO book quarterly. |
| 36 | **Starwood Property Trust (STWD) 10-Q** | `https://ir.starwoodpropertytrust.com/financials/sec-filings`[^71] | Free | Unlimited | Quarterly | PDF / EDGAR JSON | No | Real estate segment loan book, office/MF/hotel/industrial CRE senior loans, subordinated and mezzanine exposure, CLO/securitization activity, servicing income | BXMT, KREF, ARI | Private Credit CRE Loan Book Tracker | STWD is among the largest diversified mortgage REITs. Key metric: CRE lending segment vs investing vs servicing split. |
| 37 | **Preqin — Free Press & Snapshots** | `https://www.preqin.com/data/private-credit`[^72] and `https://www.preqin.com/news` | Freemium (press/blog free; platform = $$$) | Limited free | Quarterly / ad hoc | HTML / PDF | Registration (free tier) | Private credit AUM by strategy (direct lending, distressed, mezzanine, RE debt), fundraising pace, dry powder estimates, top 20 manager concentration[^73][^74][^75] | PitchBook press, BCRED/BXMT/ARI 10-Qs | Private Credit Dry Powder Ticker | Free press snippets include key stats. Q4 2024: direct lending AUM = $241B+[^76]; top 20 managers held >1/3 of all dry powder[^73]. Full fund-level data behind Preqin Pro wall. |
| 38 | **NCREIF Property Index (NPI) — Press Releases** | `https://ncreif.org/data/index-returns/`[^77] and `https://ncreif.org/news/`[^78] | Freemium (press release free; data = membership/subscription)[^79][^80] | Quarterly press release free | Quarterly | PDF press release + website widget | No (press); membership for data | NPI total return, income return, appreciation return by property type and region; ODCE fund returns (25 funds, $278.5B gross assets)[^81][^77] | FHFA HPI, FRED CRE price, Green Street CPPI | Institutional CRE Return Benchmark | Q1 2026: NPI total return 1.23%, ODCE 1.25%[^77]. Detailed NPI data requires NCREIF member access or paid subscription[^79][^80]. Press release includes headline figures only. |
| 39 | **CREFC Monthly CMBS Loan Performance** | `https://resources.crefc.org/advanced-search` (search "Monthly CMBS Loan Performance Report")[^82][^83] | Freemium (some public; some member) | Limited public | Monthly | PDF | Member login for full access | CMBS loan count/balance by delinquency status, property sector breakdown, conduit vs SASB, new dispositions, modifications, extensions[^84] | Trepp, CRED iQ, KBRA | CMBS Watchlist — Loan Performance Timeline | CREFC is the trade assoc. for the $6T+ CRE finance industry[^85]. Monthly report publicly available as press/summary. Full data access requires CREFC membership. Paywall for detailed tables. |
| 40 | **OCC Quarterly Report on Bank Trading & Derivatives** | `https://www.occ.gov/publications-and-resources/publications/quarterly-report-on-bank-trading-and-derivatives-activities/`[^86] | Free | Unlimited | Quarterly | PDF | No | Bank derivatives by type (IR, FX, credit), credit derivatives notional for top banks, CRE-related credit protection outstanding, trading revenue by category[^87][^88][^89] | FDIC, H.8, SLOOS | CRE Credit Risk Derivative Exposure (macro overlay) | Latest: Q4 2025, released March 31 2026[^86]. PDF download free. Credit derivative breakdown helps track CRE CDX/CDS hedge flows. |
| 41 | **OCC Semiannual Risk Perspective** | `https://www.occ.gov/publications-and-resources/publications/semiannual-risk-perspective/` | Free | Unlimited | Semiannual | PDF | No | CRE concentration risk by bank tier, office/MF/hotel exposure trends, regulatory concern flags, loan-to-value distribution, stressed loan analysis | FDIC, Fed SLOOS, H.8 | Bank CRE Risk Signal | Published spring/fall. Deep qualitative+quantitative CRE section. Essential for understanding regulatory posture on CRE lending. |
| 42 | **US Treasury TIC Data — Foreign ABS/MBS Holdings** | `https://ticdata.treasury.gov/Publish/shlprelim.html`[^90] and `https://home.treasury.gov/data/treasury-international-capital-tic-system-home-page`[^91] | Free | Unlimited | Annual (benchmark), Monthly (flow) | HTML / CSV | No | Foreign holdings of US ABS (incl. CMBS): total by country, ABS subset as of June survey date; monthly flow data for foreigners buying/selling US agency MBS[^90][^92] | Z.1, Ginnie Mae foreign ownership data | Foreign Demand for US CMBS/ABS Signal | June 2024 benchmark: $1,635B in foreign ABS holdings[^90]. Monthly TIC flow data available. Critical for Israeli family office terminal — quantifies overseas demand for CMBS paper. |
| 43 | **FINRA TRACE — Securitized Products** | `https://www.finra.org/finra-data/fixed-income`[^93] and FINRA Market Data Center | Freemium (bond search = free; historical = $500/yr academic)[^94] | Per-bond/CUSIP lookup free; bulk paid | Near-real-time (post-trade) | HTML (individual); API ($) | No for lookups; paid for bulk | CUSIP-level trade history, price, yield, volume, buy/sell direction; "Securitized Products" category in bond search[^95][^96][^93] | ICE BofA OAS (FRED), Bloomberg Barclays | CMBS Secondary Trading Volume & Spread Monitor | FINRA TRACE covers CMBS secondary market. Free bond search at finra.org/finra-data/fixed-income for per-CUSIP lookups. Historical bulk feed: $500/yr (academic) or paid subscription for institutions[^94]. Best free proxy: search by CUSIP from a new deal prospectus. |
| 44 | **Federal Reserve Charge-Off and Delinquency Rates** | `https://www.federalreserve.gov/releases/chargeoff/`[^16] or FRED | Free | 120 req/min (FRED) | Quarterly | CSV / JSON | No | Charge-off rates (annualized net) and delinquency rates for CRE loans at all commercial banks, 100 largest vs other, SA/NSA; updated quarterly[^16] | FDIC, H.8, FFIEC | Bank CRE Charge-Off Tracker | FRED series: `DRCRELEXFACBS` (DQ rate CRE ex-farmland), `NRCRELEXFACBSNSA` (charge-offs). Key leading indicator for realized bank losses on CRE loans. |
| 45 | **FHFA Scorecard & Conservatorship Reports** | `https://www.fhfa.gov/data` | Free | Unlimited | Annual / Quarterly | PDF | No | GSE CRE/MF exposure targets, conservatorship metrics, mission scores, loan performance under FHFA oversight, cap usage (multifamily caps) | Fannie Mae ESR, Freddie Mac AIMI, Z.1 | GSE Agency MF Policy Risk Monitor | FHFA sets annual MF caps for Fannie/Freddie. Cap levels affect agency CMBS supply directly. Scorecard = annual PDF, free. |
| 46 | **CREFC / Morningstar DBRS Maturity Wall Tracker** | Cross-reference: Trepp Hard Maturity Playbook (`trepp.com/trepptalk/cmbs-hard-maturity-playbook`)[^4] + KBRA/DBRS commentary | Free (blog posts) | Unlimited | Ad hoc (monthly/quarterly) | HTML / PDF | No | Loan maturity dates by year, extension vs payoff vs default outcomes, balloon failure rates by property type, 2026 maturity volume estimates[^4][^38] | SEC EDGAR ABS-EE, Trepp Pro (paid) | CMBS Maturity Wall Clock | Trepp: 2024–2025 hard maturities >$80B/year avg[^4]. DBRS: >$100B due 2026, >50% won't refi on time[^38]. Free blog + press = good signal. |
| 47 | **Blackstone / KKR / Ares / Apollo Investor Relations** | BX: `ir.blackstone.com`[^97]; Ares: `aresmgmt.com/investors`; Apollo: `apollo.com/ir`; KKR: `ir.kkr.com` | Free (IR pages / SEC filings) | Unlimited | Quarterly (10-K, 10-Q) + earnings calls | PDF / EDGAR JSON | No | Real estate credit AUM, CRE debt fund AUM, dry powder (cash + unfunded commitments), deployment pace, new origination volume, LP fundraising activity[^97][^98] | Preqin press, BCRED quarterly, BXMT 10-Q | Private Credit Dry Powder Dashboard | BCRED Q1 2026: 9.4% annualized total return since inception[^98]. 10-Q/10-K via EDGAR is free and comprehensive. Parse XBRL for AUM/deployment metrics. |
| 48 | **Morningstar DBRS 2026 CRE Outlook** | `https://dbrs.morningstar.com/research/471472`[^38] | Free (public research) | N/A | Annual | PDF | No | CMBS loan maturity volume 2026, expected payoff vs extension vs default rates, office sector stress, floating rate loan dynamics | Trepp maturity playbook, KBRA, Fitch | Maturity Wall & Refusal-to-Refi Risk | >$100B CMBS loans due 2026, >50% not expected to refinance on time[^38]. Free access at DBRS research portal. |
| 49 | **IPE Real Assets / PERE Free Snippets** | `https://www.ipereaassets.com` / `https://www.perenews.com` | Freemium (headlines free; full = paid) | Limited free articles/month | Per deal/news | HTML | No | Private equity RE fund closes, CRE debt fund AUM milestones, dry powder announcements, debt fund LP commitments, manager strategy shifts | Preqin press, Pitchbook free, EDGAR 10-K | Private Credit Capital Flows Indicator | Free headlines/summary sufficient for terminal signal. Full articles = subscription. Watch for "fund closes," "dry powder," "deployment" keywords. |
| 50 | **Green Street CPPI (Monthly Free Summary)** | `https://www.greenstreet.com/resources/pricing-index/`[^99] | Freemium (monthly headline free; detail = paid) | Limited | Monthly | Press release / HTML | No | Commercial Property Pricing Index headline: all-property, office, retail, industrial, apartment — monthly % change and level (REIT-based valuations)[^99] | FRED COMREPUSQ159N, NCREIF NPI | CRE Valuation Pulse (Leading Indicator) | REIT-based; leads NCREIF NPI by ~6-9 months. Monthly free summary is the best free real-time CRE price indicator. Full CPPI time series = paid Green Street sub. |

***

## Key FRED CRE Series Reference (Top 25)

| FRED Series ID | Description | Frequency | FRED URL |
|---------------|-------------|-----------|----------|
| `DRCRELEXFACBS` | Delinquency Rate on CRE Loans (ex-farmland), All Comm. Banks[^100] | Quarterly | fred.stlouisfed.org/series/DRCRELEXFACBS |
| `NRCRELEXFACBSNSA` | Charge-Off Rate on CRE Loans (ex-farmland), NSA | Quarterly | FRED search |
| `REALLN` | Real Estate Loans, All Commercial Banks[^15] | Weekly | fred.stlouisfed.org/series/REALLN |
| `H8B1026NCBCMG` | Real Estate Loans, All Comm. Banks (H.8 basis)[^101] | Weekly | FRED search |
| `COMREPUSQ159N` | Commercial Real Estate Prices, United States[^54] | Quarterly | fred.stlouisfed.org/series/COMREPUSQ159N |
| `BOGZ1FL075035503Q` | CRE Price Index Level (Z.1 derived)[^56] | Quarterly | fred.stlouisfed.org/series/BOGZ1FL075035503Q |
| `FL893065105Q` | Total Commercial Mortgage Debt Outstanding (Z.1)[^102] | Quarterly | via FRED Z.1 release 52 |
| `BAMLC4A0C710YOAS` | ICE BofA AAA CMBS OAS (verify exact series ID on FRED)[^103][^57] | Daily | FRED search "CMBS OAS" |
| `BAMLH0A0HYM2` | ICE BofA US High Yield OAS (proxy for CMBS BB/B risk)[^103] | Daily | fred.stlouisfed.org/series/BAMLH0A0HYM2 |
| `STDSAGG` | Net % Banks Tightening Standards — CRE loans (SLOOS)[^23] | Quarterly | FRED search SLOOS tag |
| `DRTSCLACBS` | Net % Tightening C&I Loan Standards, Large Firms[^23] | Quarterly | FRED search |
| `USSTHPI` | FHFA All-Transactions House Price Index[^55] | Quarterly | fred.stlouisfed.org/series/USSTHPI |
| `MSPUS` | Median Sales Price of Houses Sold, US | Quarterly | FRED |
| `PERMIT` | New Private Housing Units Authorized by Building Permits | Monthly | FRED |
| `HOUST` | Housing Starts: Total New Privately Owned | Monthly | FRED |
| `MORTGAGE30US` | 30-Year Fixed Rate Mortgage Average | Weekly | FRED |
| `OBMMIC30YF` | Optimal Blue 30-yr Mortgage Rate (daily) | Daily | FRED |
| `T10Y2Y` | 10yr-2yr Treasury Yield Spread | Daily | FRED |
| `DGS10` | 10-Year Treasury Constant Maturity Rate | Daily | FRED |
| `SOFR` | Secured Overnight Financing Rate | Daily | FRED |
| `NCBDBIQ027S` | Nonfinancial Corp. Business: Debt Securities & Loans (Z.1) | Quarterly | FRED Z.1 |
| `CMDEBT` | Household Mortgage Debt Outstanding | Quarterly | FRED |
| `RECPROUSCA` | All-transactions CRE Price Index, California | Quarterly | FRED |
| `BOGZ1FA015035045Q` | Commercial Banks CRE Mortgage Holdings (Z.1) | Quarterly | FRED Z.1 release 52 |
| `CPIAUCSL` | CPI All Urban Consumers (macro inflation overlay) | Monthly | FRED |

***

## Key mREIT / Private Credit CIK Reference

| Entity | Ticker | EDGAR CIK | Role in Terminal |
|--------|--------|-----------|-----------------|
| Blackstone Mortgage Trust | BXMT | 1061630 | Bellwether private CRE credit |
| Starwood Property Trust | STWD | 1462418 | Diversified CRE credit + servicer |
| KKR Real Estate Finance | KREF | 1631596 | Senior CRE loan originator[^104] |
| Apollo Commercial RE Finance | ARI | 1422929 | Transitional CRE loans |
| TPG RE Finance Trust | TRTX | 1700010 | Senior bridge CRE loans |
| Ladder Capital | LADR | 1577670 | Conduit + balance sheet lender |
| Arbor Realty Trust | ABR | 1253986 | Multifamily bridge/CRE CLO |
| Ready Capital | RC | 1407623 | Small-balance CRE + CMBS B-piece |
| Blackstone (BX) | BX | 1393818 | BREP/BCRED/BREDS dry powder |

***

## Top 15 Highest-Leverage Free Sources for National CMBS + Private Credit Dashboard

| Rank | Source | Why It's Highest-Leverage |
|------|--------|--------------------------|
| 1 | **Trepp Blog** | Most-cited monthly CMBS DQ/special servicing rate; free; cross-verified by KBRA/CRED iQ[^26][^2] |
| 2 | **FRED API (DRCRELEXFACBS + ICE BofA OAS)** | Daily/weekly macro signals; free; powers spread and delinquency tickers with one API key[^100][^57] |
| 3 | **SEC EDGAR CMBS Issuance Stats XLSX** | Authoritative quarterly 144A/Registered/Agency split; free direct download; 2016–present[^8] |
| 4 | **FDIC BankFind API** | Per-bank CRE concentration ratios; no API key; quarterly; tracks regional bank pullback numerically[^17][^18] |
| 5 | **CRED iQ Monthly Distress Blog** | Composite distress (DQ + SS) more comprehensive than DQ alone; free; MSA-level[^29][^30] |
| 6 | **KBRA CMBS Loan Performance Trends PDF** | KBRA-rated universe DQ/distress rate; free monthly PDF; cross-verifiable with Trepp[^1][^34] |
| 7 | **Federal Reserve Z.1 (via FRED release 52)** | Definitive quarterly CRE debt by holder type; tracks shift from banks to CMBS/private credit[^12][^11] |
| 8 | **Federal Reserve H.8 (FRED)** | Weekly bank CRE loan volume — the fastest signal on bank lending expansion/contraction[^14] |
| 9 | **SLOOS via FRED (tag: sloos)** | Tightening standards survey; leads charge-offs by 2-3 quarters; quarterly[^22][^23] |
| 10 | **Fannie Mae DUS Disclose + Data Dynamics** | Agency MF CMBS pipeline, loan performance, free to all market participants[^44][^45] |
| 11 | **Freddie Mac K-Deal Performance Lookup** | Free monthly K-deal surveillance; $321B+ outstanding; critical for agency CMBS segment[^48][^47] |
| 12 | **SEC ABS-EE EX-102 XML** | Loan-level CMBS data at issuance; free; powers deal-level drill-down for SASB/conduit analysis[^6][^7] |
| 13 | **EDGAR XBRL + Submissions API (mREIT CIKs)** | Quarterly loan book data for all public mortgage REITs; free; no auth; best proxy for private credit flows[^9] |
| 14 | **MBA Quarterly Mortgage Debt Outstanding** | Headline debt stack; quarterly; free press; cross-verify CMBS/bank share shifts vs Z.1[^60][^59] |
| 15 | **FINRA TRACE Bond Search (per-CUSIP)** | Secondary CMBS pricing by CUSIP; free for lookups; confirms spread movements vs OAS series[^93] |

***

## Unfair-Advantage Sources for CMBS Maturity Wall & Special Servicing Transfers

These three free/freemium sources provide the most actionable forward-looking intelligence on the CMBS maturity wall and the transfer of loans to special servicing — the two key watchlist signals for the terminal:

**1. Trepp TreppTalk Blog (`trepp.com/trepptalk`)**
The CMBS Hard Maturity Playbook published Feb 2026 provides annual resolution analytics: loans that paid off, extended, or defaulted, with property-type and vintage breakdowns. Monthly delinquency posts flag individual loan transfers to SS by property type. This is the most operationally useful free CMBS signal for the maturity wall ticker. Gotcha: Trepp deliberately withholds loan-level deal names from free blog posts — only rates and sector splits are free.[^4]

**2. KBRA CMBS Presale Reports (`kbra.com/sectors/cmbs/publications`)**
KBRA publishes free presale reports for every new CMBS deal it rates, including loan-by-loan property summaries, LTV/DSCR, watchlist criteria, and credit concerns. For the terminal's "New Deal Pricing" tile, these are the most granular free deal-analytics available. Combine with EDGAR ABS-EE XML for asset-level data on the same deal. Premium surveillance includes 500+ surveillance reports.[^105][^106][^33]

**3. Morningstar DBRS Surveillance Roundtables & Methodology Updates**
DBRS publishes updated CMBS surveillance methodology and holds free public roundtables on special servicing trends. The 2026 CRE Outlook is freely available and quantifies the refi wall with specificity (>50% of $100B+ 2026 maturities unlikely to pay off). DBRS is the fourth-largest NRSRO and often more forthcoming in free materials than Fitch/S&P.[^38][^39][^107][^40]

***

## Gap Analysis: Gated Capital Markets Data & Cheapest Legitimate Bridges

The free/freemium stack described above covers macro signals and headline metrics well, but five critical data layers remain meaningfully gated. **Trepp Pro** (~$30–80K/year institutional) is the single most comprehensive CMBS platform, providing loan-level surveillance across $800B+ in outstanding CMBS, including individual loan watchlist status, servicer comments, appraisal reductions, and maturity extension tracking — none of which are available in the free Trepp blog. **Intex Solutions** (~$30–60K/year) is the industry standard for CMBS cashflow modeling, deal structure analytics, and collateral-level scenario analysis; Bloomberg and institutional money managers rely on it for AAA to HRR tranche pricing. **Bloomberg CMBS Terminal** (~$25K/seat/year) provides real-time CMBS bid/offer spreads, dealer axes, new-issue book-building data, and the CMBS component of the Barclays Aggregate Index — data entirely absent from FRED or FINRA's free tier. **Preqin Pro** (~$25–50K/year) is the only reliable source for fund-level private credit dry powder, LP commitment timing, debt fund closing data, and individual GP performance attribution for Blackstone BREDS, Ares Real Estate Finance, Apollo CMBS/CRE, Carlyle Real Estate Debt, and Starwood BREDS. **Yield Book Pro** (LSEG/Refinitiv, ~$20–40K/year) provides daily CMBS OAS by tranche/vintage/property type at granularity far beyond the ICE BofA index-level FRED series. The cheapest legitimate bridge for the terminal is a **three-layer free proxy stack**: (1) ICE BofA CMBS OAS via FRED as the spread indicator, (2) KBRA/Trepp/CRED iQ free monthly publications as the surveillance layer, and (3) SEC EDGAR ABS-EE XML as the loan-level data layer — collectively replicating ~60–70% of Trepp Pro functionality at zero cost, with the remaining gap being real-time servicer comment feeds and live deal pricing data that require paid access.[^72][^74][^75][^108][^109][^110]

***

*Report compiled May 2026. All endpoints verified against public documentation. Rate limits and auth requirements subject to change by source providers. Israeli family office terminal users should note that EDGAR, FRED, and FDIC APIs are all US government open-data with no geographic restriction on access.*

---

## References

1. [CMBS Loan Performance Trends: February 2026](https://www.kbra.com/publications/zpZLkgjs) - KBRA, a leader in CMBS credit analysis, delivers deal-level insights through pre-sale and surveillan...

2. [CMBS Delinquency Rate Declines in February 2026, Led by Large ...](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-declines-in-february-2026-led-by-large-office-retail-loan-extensions) - The Trepp CMBS Delinquency Rate reversed course in February 2026, decreasing 33 basis points to 7.14...

3. [Commercial and Multifamily Mortgage Debt Outstanding Increased ...](https://safeguardproperties.com/commercial-and-multifamily-mortgage-debt-outstanding-increased-in-third-quarter-2025/) - The level of commercial/multifamily mortgage debt outstanding increased by $53.4 billion (1.1 percen...

4. [CMBS Hard Maturity Playbook: 2024-2025 Lessons & 2026 Outlook](https://www.trepp.com/trepptalk/cmbs-hard-maturity-playbook) - Hard maturities in the CMBS market have averaged over $80 billion per year for the past two years, s...

5. [Developer Resources - SEC.gov](https://www.sec.gov/about/developer-resources) - Welcome to the SEC's developer page. Data APIs Now Available. Submissions by company and extracted X...

6. [Information for Form ABS-EE Filings - SEC.gov](https://www.sec.gov/rules-regulations/staff-guidance/corporation-finance-interpretations/information-form-abs-ee-filings) - These Corporation Finance Interpretations ("CFIs") relate to the filing of asset-level disclosures o...

7. [[PDF] Asset-Level Transparency and the (E)Valuation of Asset-Backed ...](https://www.stern.nyu.edu/sites/default/files/assets/documents/asset-level%20transparency%20jar%202021.pdf) - ABS issuers must file the required asset-level disclosures in a standardized and tagged XML format u...

8. [Commercial Mortgage-Backed Securities (CMBS) Issuances](https://www.sec.gov/data-research/statistics-data-visualizations/commercial-mortgage-backed-securities-cmbs-issuances) - Statistics. Below are the most recent quarterly statistics for 2025 and annual statistics for 2024 a...

9. [EDGAR Application Programming Interfaces (APIs) - SEC.gov](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) - This page provides information on how developers may use application programming interfaces (APIs) t...

10. [The Fed - Data Download Program and Federal Reserve Economic ...](https://www.federalreserve.gov/data/data-download-fred-information.htm) - An API enables users to write programs and build applications that retrieve economic data from FRED....

11. [Z.1 Financial Accounts of the United States | FRED | St. Louis Fed](https://fred.stlouisfed.org/release?rid=52) - Release: Z.1 Financial Accounts of the United States, 45000 economic data series, FRED: Download, gr...

12. [Financial Accounts of the United States - Z.1 - Current Release](https://www.federalreserve.gov/releases/z1/) - The Financial Accounts of the United States includes data on transactions and levels of financial as...

13. [z1 - Data Download Program - Choose - Federal Reserve Board](https://www.federalreserve.gov/datadownload/choose.aspx?rel=z1) - Users seeking interactive charts for Board DDP data releases can access expanded functionality for c...

14. [Assets and Liabilities of Commercial Banks in the United States - H.8](https://www.federalreserve.gov/releases/h8/current/default.htm) - Percent changes for other series shown on the release are available for customizable download throug...

15. [Real Estate Loans, All Commercial Banks (REALLN) - FRED](https://fred.stlouisfed.org/series/REALLN) - Graph and download economic data for Real Estate Loans, All Commercial Banks (REALLN) from Jan 1947 ...

16. [FRB: Charge-Off and Delinquency Rates on Loans and Leases at ...](https://www.federalreserve.gov/releases/chargeoff/) - Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks ... On December 18, the "Vi...

17. [BankFind Suite - FIXnotes](https://fixnotes.com/encyclopedia/bankfind-suite) - BankFind Suite is the FDIC's public-data platform for querying FDIC-insured bank financials, branch ...

18. [BankFind Suite - API Documentation - FDIC](https://api.fdic.gov/banks/docs) - FDIC's application programming interface (API) lets developers access FDIC's publically available ba...

19. [Bulk Data Download - FDIC: BankFind Suite - API Documentation](https://banks.data.fdic.gov/bankfind-suite/bulkData/bulkDataDownload) - Use these definition files to help you understand the bulk data: Institutions Definitions (CSV forma...

20. [Download Bulk Data - FFIEC Central Data Repository's Public Data ...](https://cdr.ffiec.gov/public/PWS/DownloadBulkData.aspx) - This page enables you to download bulk data in either Excel compatible or XBRL format. Please note t...

21. [Call Report - FFIEC](https://cdr.ffiec.gov) - Through this site you can obtain Reports of Condition and Income (Call Reports) and Uniform Bank Per...

22. [Senior Loan Officer Opinion Survey on Bank Lending Practices](https://www.federalreserve.gov/data/sloos.htm) - Questions cover changes in the standards and terms of the banks' lending and the state of business a...

23. [SLOOS - Economic Data Series | FRED | St. Louis Fed](https://fred.stlouisfed.org/tags/series?t=sloos) - 639 economic data series with tag: SLOOS. FRED: Download, graph, and track economic data. Senior Loa...

24. [Senior Loan Officer Opinion Survey on Bank Lending Practices ...](https://www.investopedia.com/terms/s/soslp.asp) - The Senior Loan Officer Opinion Survey on Bank Lending Practices is a survey of the banking industry...

25. [Beige Book - Federal Reserve Board](https://www.federalreserve.gov/monetarypolicy/publications/beige-book-default.htm) - Summary of Commentary on Current Economic Conditions by Federal Reserve District. Commonly known as ...

26. [CMBS Delinquency Rate Jumps Back Up in March, as All Property ...](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-jumps-back-up-in-march-2025) - The Trepp CMBS Delinquency Rate ticked back up in March 2025 with the overall delinquency rate incre...

27. [CMBS Delinquency Rate Pulls Back in September After Six-Month ...](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-pulls-back-in-september-after-six-month-climb) - The Trepp CMBS Delinquency Rate decreased for the first time since February in September 2025, falli...

28. [CMBS Delinquency Rate Up Slightly in June, Office Hits Record High](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-up-slightly-in-june-office-hits-record-high) - The Trepp CMBS Delinquency Rate rose once more in June 2025, increasing 5 basis points to 7.13%. In ...

29. [CMBS Apartment Distress Rates up 185% in last 6 Months - CRED iQ](https://cred-iq.com/blog/2024/07/12/cmbs-apartment-distress-rates-up-185-in-last-6-months-overall-rate-climbs-to-8-62-for-all-cre/) - The apartment loans with CMBS financing reached an 185% increase in distress since the start of the ...

30. [CMBS Distress Rate Adds 32 BPS as the Seesaw Effect Plays Out in ...](https://cred-iq.com/blog/2025/08/07/cmbs-distress-rate-adds-32-bps-as-the-seesaw-effect-plays-out-in-cmbs/) - The commercial mortgage-backed securities (CMBS) distress rate added 32 basis points to 11.1% in Jul...

31. [Top 50 Markets by CRED iQ Distress Metrics](https://cred-iq.com/blog/2024/10/18/top-50-markets-by-cred-iq-distress-metrics-2/) - Our report yields the CRED iQ Distress Rate (which combines Delinquent and/or Specially Serviced loa...

32. [CRE servicers 'increasingly aggressive' toward distressed assets](https://www.multifamilydive.com/news/multifamily-cmbs-delinquencies-special-servicing/811987/) - CRED iQ reported a distress rate across all sectors of 11.98% in January 2026, which was a 148% incr...

33. [Our CMBS Publications | Kroll Bond Rating Agency](https://www.kbra.com/sectors/cmbs/publications) - Review Kroll Bond Rating Agency's commercial mortgage-backed securities publications on this page. C...

34. [CMBS Loan Performance Trends: March 2026](https://www.kbra.com/publications/MXCWdCxS) - A CMBS package includes: · In-depth coverage of commercial real estate finance with property-level i...

35. [KBRA Releases Monthly CMBS Trend Watch](https://www.kbra.com/publications/jPhSXXBx) - KBRA releases the December 2024 issue of CMBS Trend Watch. U.S. CMBS ended the year on a high note, ...

36. [Structured Finance - CMBS :: Fitch Ratings](https://www.fitchratings.com/structured-finance/cmbs) - Stay on top of the latest developments, commentary, which includes timely presale reports, and credi...

37. [Fitch Ratings Updates CMBS Large Loan Rating Criteria](https://www.fitchratings.com/research/structured-finance/fitch-ratings-updates-cmbs-large-loan-rating-criteria-21-05-2026) - Fitch Ratings-New York/Chicago-21 May 2026: Fitch Ratings has released an updated criteria report fo...

38. [U.S. CRE 2026 Outlook: Momentum Is Healthy, but Office Dynamics ...](https://dbrs.morningstar.com/research/471472) - -- More than $100 billion in fixed- and floating-rate CMBS loans are coming due in 2026, and we expe...

39. [DBRS Morningstar Publishes Updated North American CMBS ...](https://dbrs.morningstar.com/research/393300/dbrs-morningstar-publishes-updated-north-american-cmbs-surveillance-methodology) - DBRS Morningstar published an updated version of its “North American CMBS Surveillance Methodology” ...

40. [DBRS Morningstar Publishes Updated Methodology for North ...](https://dbrs.morningstar.com/research/375980/dbrs-morningstar-publishes-updated-methodology-for-north-american-cmbs-surveillance) - DBRS Morningstar published an updated version of its North American CMBS Surveillance Methodology (t...

41. [Moody's assigns provisional ratings to eight CMBS classes of CEDR ...](https://finance.yahoo.com/news/moodys-assigns-provisional-ratings-eight-010304384.html) - Rating Action: Moody's assigns provisional ratings to eight CMBS classes of CEDR Commercial Mortgage...

42. [Rating Action - Moody's Ratings](https://ratings.moodys.com/ratings-news/443446) - Moody's Ratings (Moody's) has upgraded the ratings of 43 bonds and downgraded the rating of one bond...

43. [European CMBS Sustains Momentum Beyond The Refinance Wall](https://www.spglobal.com/ratings/en/regulatory/article/european-cmbs-sustains-momentum-beyond-the-refinance-wall-s101674202) - The remaining loan due to repay in 2025--Highways Finance 2021 PLC--was further extended and is now ...

44. [Data Dynamics – Data Analytics Tool | Fannie Mae - Capital Markets](https://capitalmarkets.fanniemae.com/tools-applications/data-dynamics) - View and download CRT, MBS, and historical loan performance data. Easily share data ... Learn more a...

45. [Multifamily Issuances and Total MBS Outstanding | Fannie Mae](https://capitalmarkets.fanniemae.com/mortgage-backed-securities/multifamily-mbs/multifamily-issuances-and-total-mbs-outstanding) - For ongoing Multifamily issuance information, DUS Disclose provides disclosure data for Multifamily ...

46. [Fannie Mae Single-Family Loan Performance Data](https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/fannie-mae-single-family-loan-performance-data) - Fannie Mae provides loan performance data on a portion of its single-family mortgage loans to promot...

47. [K-Deal Program - Freddie Mac Multifamily](https://mf.freddiemac.com/investors/securities-crt-products/k-deals) - Securities Performance & Lookup. Understand active and historical K-Deal performance through our sui...

48. [Securities Performance & Lookup - Freddie Mac Multifamily](https://mf.freddiemac.com/investors/performance-lookup) - Learn more about Freddie Mac Multifamily's historical deal issuance volumes, structures and performa...

49. [[PDF] K-Deal Program Overview - Freddie Mac Multifamily](https://mf.freddiemac.com/docs/kdeal_investor_presentation.pdf) - Performance data for our K-Deals is updated monthly at our. Securities ... View our Security Lookup ...

50. [[PDF] An introduction to Freddie K | LSEG](https://www.lseg.com/content/dam/data-analytics/en_us/documents/publications/an-introduction-to-freddie-k.pdf) - Source: Freddie Mac (December 2021). Through December 2021, Freddie Mac has issued a total of 458 K ...

51. [Disclosure Data Download Layouts and Sample Files - Ginnie Mae](https://www.ginniemae.gov/data_and_reports/disclosure_data/Pages/bulk_data_download_layout.aspx) - Disclosure Data Download makes available daily, weekly, factor, and monthly disclosure information a...

52. [Ginnie Mae](https://www.ginniemae.gov) - Ginnie Mae MBS makes the dream of homeownership possible for the country's veterans. ... Republished...

53. [FHFA House Price Index](https://www.fhfa.gov/data/hpi) - The FHFA HPI is a weighted, repeat-sales index, meaning that it measures average price changes in re...

54. [Commercial Real Estate Prices for United States (COMREPUSQ159N)](https://fred.stlouisfed.org/series/COMREPUSQ159N) - Graph and download economic data for Commercial Real Estate Prices for United States (COMREPUSQ159N)...

55. [All-Transactions House Price Index for the United States (USSTHPI)](https://fred.stlouisfed.org/series/USSTHPI) - Graph and download economic data for All-Transactions House Price Index for the United States (USSTH...

56. [Commercial Real Estate Price Index, Level (BOGZ1FL075035503Q ...](https://fred.stlouisfed.org/series/BOGZ1FL075035503Q) - Graph and download economic data for Interest Rates and Price Indexes; Commercial Real Estate Price ...

57. [Option-Adjusted Spread - Economic Data Series - FRED](https://fred.stlouisfed.org/tags/series?t=option-adjusted+spread) - 53 economic data series with tag: Option-Adjusted Spread. FRED: Download, graph, and track economic ...

58. [Commercial, Real Estate - Economic Data Series - FRED](https://fred.stlouisfed.org/tags/series?t=commercial%3Breal+estate) - 277 economic data series with tags: Commercial, Real Estate. FRED: Download, graph, and track econom...

59. [Quarterly Commercial/Multifamily Mortgage Debt Outstanding | MBA](https://www.mba.org/news-and-research/research-and-economics/commercial-multifamily-research/commercial-multifamily-mortgage-debt-outstanding-x44535) - Download the Latest Report. Related Press Releases. Commercial and Multifamily Mortgage Debt Outstan...

60. [Commercial and Multifamily Mortgage Debt Outstanding Increased ...](https://www.mba.org/news-and-research/newsroom/news/2025/03/18/commercial-and-multifamily-mortgage-debt-outstanding-increased--47.7-billion-in-third-quarter-of-2024) - Commercial and multifamily mortgage debt outstanding increased to almost $4.8 trillion in the fourth...

61. [Quarterly Commercial/Multifamily Mortgage Delinquency Rates | MBA](https://www.mba.org/news-and-research/research-and-economics/commercial-multifamily-research/commercial-multifamily-mortgage-delinquency-rates) - Commercial mortgage delinquencies increased in the second quarter of 2025, according to the Mortgage...

62. [Delinquency Rates for Commercial Properties Increased in Fourth ...](https://www.mba.org/news-and-research/newsroom/news/2025/01/28/delinquency-rates-for-commercial-properties-increased-in-fourth-quarter-2024) - The delinquency rate for commercial mortgages increased during the final three months of 2024, with ...

63. [Investment Bulletins - The American Council of Life Insurers](https://www.acli.com/news-and-analysis/investment-bulletins) - Commercial Mortgage Commitments - Quarterly The Commercial Mortgage Commitments report is a primary ...

64. [[PDF] ACLI Investment Bulletin Subscription Order Form](https://www.acli.com/-/media/public/pdf/news-and-analysis/publications-and-research/2024_investment_bulletin_order_form.pdf) - STARTING. QTR-MO/YEAR. Commercial Mortgage Commitments Quarterly (CMC-Q). 1st thru 3rd quarter at $5...

65. [[PDF] ACLI Investment Bulletin Subscription Order Form](https://www.acli.com/-/media/ACLI/Public/Files/PDFs-PUBLIC-SITE/Public-Industry-Facts/IB2020Final_082520.ashx?la=en) - STARTING. QTR-MO/YEAR. Commercial Mortgage Commitments Quarterly (CMC-Q). 1st thru 3rd quarter at $5...

66. [[PDF] ASSeTS - The American Council of Life Insurers](https://www.acli.com/-/media/acli/files/fact-books-public/02fb20_chapter_02_assets.pdf) - Commercial mortgages have grown in importance, representing 90 percent ($555 billion) of U.S. mortga...

67. [Publications & Research - The American Council of Life Insurers](https://www.acli.com/news-and-analysis/publications-and-research) - This index is released quarterly, the ACLI Financial Resilience Index ... Commercial Mortgage Commit...

68. [10-K - SEC.gov](https://www.sec.gov/Archives/edgar/data/1061630/000119312518042819/d470827d10k.htm) - Blackstone Mortgage Trust is a real estate finance company that originates senior loans collateraliz...

69. [Financial Disclosures and SEC Filings](https://ir.blackstonemortgagetrust.com/financial-disclosures-and-sec-filings/default.aspx) - Access financial disclosures and SEC filings for Blackstone Mortgage Trust (BXMT), including annual ...

70. [Blackstone Mortgage Trust Reports Fourth-Quarter and Full-Year ...](https://ir.blackstonemortgagetrust.com/press-releases-and-news/press-release-and-news-details/2026/Blackstone-Mortgage-Trust-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx) - Blackstone Mortgage Trust issued a full presentation of its fourth-quarter and full-year 2025 result...

71. [Financials & SEC Filings - Starwood Property Trust](https://ir.starwoodpropertytrust.com/financials/sec-filings/default.aspx) - Filter filing type: All Form Types Annual Filings Quarterly Filings Current Reports Proxy Filings Re...

72. [Private credit database for firms and investors - Preqin](https://www.preqin.com/data/private-credit) - Explore the private credit market landscape with up-to-date intelligence on AUM growth, dry powder t...

73. [More than one-third of dry powder is held by top 20 private credit ...](https://alternativecreditinvestor.com/2025/01/07/more-than-one-third-of-dry-powder-is-held-by-top-20-private-credit-managers/) - The top 20 global private credit fund managers collectively held more than one-third of dry powder a...

74. [Private debt in 2025: the outlook for fundraising, deals, and ... - Preqin](https://www.preqin.com/news/private-debt-in-2025-the-outlook-for-fundraising-deals-and-performance) - We believe that private debt is well-positioned for sustained growth going into 2025. Regulation con...

75. [[PDF] Preqin Global Report - Private Debt 2025](https://downloads.ctfassets.net/zf87m07ner47/t9CaRwlMwqHQs5C7verMb/020a00dcf2febb26e8f48725d830d42d/2025_Private_Debt_Global_Report.pdf) - Direct lending has secured the majority of funds raised in the first three quarters of 2024. While o...

76. [[PDF] Private Credit Trends Report - American Investment Council](https://www.investmentcouncil.org/wp-content/uploads/2024/06/1Q24-Private-Credit-Trends.pdf) - In the first quarter of 2024: • Private debt funds raised $18 billion from investors with an average...

77. [Index Returns - NCREIF](https://ncreif.org/data/index-returns/) - NCREIF Index Returns ; NCREIF Property Index Expanded (NPI). Total 1.23% Income 1.15% Appreciation 0...

78. [News - NCREIF](https://ncreif.org/news/) - The First Quarter 2026 NCREIF Property Index (NPI) has been released. View the Press Release and Sna...

79. [Data Subscriptions - NCREIF](https://ncreif.org/data/data-subscriptions/) - If your firm does not have qualifying assets under management, you have the option to order an annua...

80. [NCREIF Data](https://ncreif.org/data/) - NCREIF data products and analytical tools are available to NCREIF members and subscribers only. If y...

81. [[PDF] NFI-ODCE-Press-Release-for-4Q2024.pdf - NCREIF](https://ncreif.org/__static/99597d3e421dd31e6b7da7186f0b711f/NFI-ODCE-Press-Release-for-4Q2024.pdf) - The NFI-ODCE consists of 25 funds totaling $278.5 billion of gross real estate assets and $226.8 bil...

82. [Learn - Search Document Library - CRE Finance Council](https://resources.crefc.org/advanced-search) - CREFC's December 2025 Monthly CMBS Loan Performance Report, CRE Finance ... CREFC's January 2024 Mon...

83. [CREFC's Resource Center - CRE Finance Council](https://resources.crefc.org) - The Premier Resource for Commercial Real Estate Finance Issues. The Document Resource Center holds t...

84. [CREFC's November 2025 Monthly CMBS Loan Performance Report](https://www.crefc.org/cre/cre/content/News/Items/Research_and_Data/CREFCs_November_2025_Monthly_CMBS_Loan_Performance_Report.aspx) - Read-through: November's improvement was narrow (3 of 5 sectors declined) and partly mechanical—the ...

85. [News Archive - All News - CRE Finance Council](https://www.crefc.org/cre/cre/content/News/news-archive.aspx) - The CRE Finance Council (CREFC) is the trade association for the over $6 trillion commercial real es...

86. [Quarterly Report on Bank Trading and Derivatives Activities | OCC](https://www.occ.gov/publications-and-resources/publications/quarterly-report-on-bank-trading-and-derivatives-activities/index-quarterly-report-on-bank-trading-and-derivatives-activities.html) - That report describes what the call report information discloses about banks' derivative activities....

87. [[PDF] OCC Reports Fourth Quarter 2025 Bank Trading Revenue](https://business.cch.com/BFLD/OCC-NR-2026-22-03312026040126.pdf) - In the report, Quarterly Report on Bank Trading and Derivatives ... Fourth Quarter 2025 (PDF). Media...

88. [[PDF] Quarterly Report on Bank Trading and Derivatives Activities](https://www.occ.treas.gov/publications-and-resources/publications/quarterly-report-on-bank-trading-and-derivatives-activities/files/pub-derivatives-quarterly-qtr3-2025.pdf) - The credit risk in a derivative contract is a function of several variables, such as whether counter...

89. [OCC Reports Q1 2025 Bank Trading Revenue of $15bn](https://www.marketsmedia.com/occ-reports-q1-2025-bank-trading-revenue-of-15bn/) - The first quarter trading revenue was $408 million, or 2.7 percent, less than in the previous quarte...

90. [preliminary report on foreign portfolio holdings of us securities at ...](https://ticdata.treasury.gov/Publish/shlprelim.html) - The survey measured the value of foreign holdings of U.S. securities as of June 30, 2025, to be $35,...

91. [Securities (B): Portfolio Holdings of U.S. and Foreign Securities](https://home.treasury.gov/data/treasury-international-capital-tic-system-home-page/tic-forms-instructions/securities-b-portfolio-holdings-of-us-and-foreign-securities) - Starting with the April 15, 2015 release of monthly TIC data, a new data series on foreign holders o...

92. [Department of the Treasury - U.S. Net purchases of Foreign ABS](https://catalog.data.gov/dataset/treasury-international-capital-tic-u-s-transactions-with-foreign-residents-in-long-term-se-454b8) - Treasury International Capital (TIC) - U.S. Transactions with Foreign Residents in Long Term Securit...

93. [Fixed Income Data | FINRA.org](https://www.finra.org/finra-data/fixed-income) - Fixed Income Security Lookup. Search on TRACE symbol or CUSIP to find a security and review details ...

94. [FINRA's Academic Corporate Bond TRACE Data Product Goes Live](https://bradshawlawgroup.com/finras-academic-corporate/) - The product supports and encourages academic research on corporate bonds by providing academics with...

95. [TRACE Data & Licensing | FINRA.org](https://www.finra.org/filing-reporting/trace/data) - FINRA provides real-time and historic data for most TRACE-eligible securities to members and any oth...

96. [What Is TRACE? Insight into Trade Reporting and Compliance](https://www.investopedia.com/terms/t/trace.asp) - Offers both personal, noncommercial free access and professional paid access to detailed market data...

97. [SEC Filings - Blackstone - Overview](https://ir.blackstone.com/sec-filings/default.aspx) - SEC Filings · Corporate Governance · Contact Us · Dividends & Tax Info · Press Releases. SEC Filings...

98. [Q1 2026 Update - BCRED | Blackstone Private Credit Fund](https://www.bcred.com/q1-2026-update/) - Since inception, the Fund has generated a 9.4% annualized total return (Class I), outperforming leve...

99. [Commercial Property Pricing Index - Green Street](https://www.greenstreet.com/resources/pricing-index/) - Commercial Property Pricing Index®. Green Street's monthly CPPI® – real-time property values. Built ...

100. [Delinquency Rate on Commercial Real Estate Loans ... - FRED](https://fred.stlouisfed.org/series/DRCRELEXFACBS) - Graph and download economic data for Delinquency Rate on Commercial Real Estate Loans (Excluding Far...

101. [Real Estate Loans, All Commercial Banks (H8B1026NCBCMG)](https://fred.stlouisfed.org/series/H8B1026NCBCMG) - Graph and download economic data for Real Estate Loans, All Commercial Banks (H8B1026NCBCMG) from Fe...

102. [Mortgage Debt Outstanding, Millions of Dollars; End of Period - FRED](https://fred.stlouisfed.org/release/tables?rid=52) - Release Table for Q4 2025, Release Tables: Mortgage Debt Outstanding, Millions of Dollars; End of Pe...

103. [ICE BofA US High Yield Index Option-Adjusted Spread - FRED](https://fred.stlouisfed.org/series/BAMLH0A0HYM2) - This data represents the ICE BofA US High Yield Index value, which tracks the performance of US doll...

104. [KREF SEC Filings - Kkr Real Estate 10-K, 10-Q, 8-K Forms](https://www.stocktitan.net/sec-filings/KREF/page-4.html) - KKR Real Estate Finance Trust Inc. filings document the company's commercial real estate finance ope...

105. [KBRA Analytics Expands Premium Subscription to Include Private ...](https://finance.yahoo.com/news/kbra-analytics-expands-premium-subscription-130000189.html) - KBRA Analytics Expands Premium Subscription to Include Private Credit Research and Insights · 230+ r...

106. [KBRA | Premium - CMBS](https://www.kbra.com/analytics/products/premium/cmbs) - Our Pre-Sale and New Issue reports deliver forward-looking credit analysis that help market particip...

107. [CMBS Surveillance Roundtable | Morningstar DBRS](https://dbrs.morningstar.com/research/364717/dbrs-morningstar-cmbs-webinar-series-cmbs-surveillance-roundtable) - Please join DBRS Morningstar's CMBS team next Wednesday for a surveillance roundtable discussing our...

108. [What is Trepp? Competitors, Complementary Techs & Usage - Sumble](https://sumble.com/tech/trepp) - Intex is a competitor as they also provide data and analytics for structured finance and fixed incom...

109. [Trepp | Trusted Provider of CRE, CMBS, CLO Data & Analytics](https://www.trepp.com) - Trepp is the leading provider of data, insights, and technology solutions to the structured finance,...

110. [[PDF] Trends in ABS, MBS & CDOs Loan Level & Collateral Performance ...](https://www.ppllc.com/OurNews/Articles/Principia_ABS_Loan_Level_Performance_Data_Report.pdf) - For US investors, Bloomberg and Intex are the dominant providers, with Trepp leading the way for CMB...

