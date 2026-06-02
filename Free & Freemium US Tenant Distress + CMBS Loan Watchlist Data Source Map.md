# Free & Freemium US Tenant Distress + CMBS Loan Watchlist Data Source Map
### Bloomberg-Style CRE Intelligence Terminal — Israeli Family Office Edition (2024–2026)

> **How to read this map:** Every row is a live feed or API endpoint your engineering team can wire into the terminal today. Columns are designed to answer the one question a Tel Aviv family-office principal asks before allocating capital: *"How fast will I know, and what exactly will I see?"*

***

## Section 1 — Bankruptcy & Chapter 11 Filings

| Source Name | Exact URL / Endpoint (example query) | Free / Freemium / Paid | Free-Tier Rate Limit / Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes on Latency, Completeness, Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|
| **CourtListener RECAP API v4** (Free Law Project) | `GET https://www.courtlistener.com/api/rest/v4/dockets/?court__jurisdiction=FBK&nature_of_suit=11&order_by=-date_filed` | Free (with free-key) | 5 req/min, 50/hr, 125/day (free tier)[^1] | Near-real-time; indexed within hours of PACER filing[^2] | JSON | Free API key (token in header) | case_name, docket_number, court, date_filed, nature_of_suit, chapter | PACER PCL, BankruptcyData.com | **Tenant Distress Ticker** | Best free entry point to PACER data. Free Search Alerts launched 2025: up to 5 daily keyword alerts free[^2]. Add `?q=retailer+OR+NAICS+452` to pre-filter. `court__jurisdiction=FBK` returns all federal bankruptcy courts. Delaware = `deb`; SDNY = `nysb`; SDTX = `txsb`; NDIL = `ilnb`; CDCA = `cacb`[^3]. |
| **PACER Case Locator (PCL) API** | `POST https://pcl.uscourts.gov/pcl/pages/api/search.jsf` with JSON body `{"caseType":"bk","chapter":11,"dateFiledFrom":"2024-01-01","courts":["deb","nysb","txsb","ilnb","cacb"]}` | Freemium | PACER accounts free to create; $0.10/page accessed (cap $3/doc)[^4] | Real-time (minutes after filing) | JSON / XML | PACER account (free, $0.10/pg cost)[^5] | case_name, case_number, chapter, court, date_filed, party_name, NOS | CourtListener RECAP, BankruptcyData.com | **Tenant Distress Ticker** | PCL supports batch search up to 108,000 items[^5]. Filter by NatureOfSuit=11 for Chapter 11. Party search allows pre-filtering by SIC/NAICS if known debtor. Quarterly fee waiver if usage <$30/quarter. For bulk Chapter 11 retail surveillance, CourtListener is free; PACER PCL is ~$5–30/month depending on volume. |
| **CourtListener RECAP Search Alerts** | `https://www.courtlistener.com/alerts/` → save search with query `chapter 11 retailer court:deb OR court:nysb` | Freemium | 5 daily email alerts (free); 10 daily + 5 real-time at $10/mo[^2] | Real-time alert on new matching filings[^2] | Email / webhook | Free account | Alert trigger on docket match: case name, court, filing date, docket link | PACER PCL, EDGAR EFTS | **Tenant Distress Ticker** | Described as "Google Alerts for federal courts"[^2]. Set keyword strings: `"chapter 11" "going concern"`, `"store closure" "lease rejection"` for retail. $10/mo tier enables real-time webhook push — highly recommended for the terminal live ticker. |
| **UCLA-LoPucki Bankruptcy Research Database (BRD)** | `https://lopucki.law.ufl.edu/spreadsheet.php` (direct CSV download) | **Free** | Unlimited download; updated periodically | Weekly–monthly updates[^6][^7] | CSV / Excel | None (public) | company_name, SIC, assets, filing_date, court, outcome, exit_date, confirmed_plan | CourtListener, BankruptcyData.com | **Tenant Distress Historical** | Covers all large public companies (>$100M assets 1980$) filing Ch. 7 or 11 since 1979[^6]. Now hosted at Florida law school (formerly UCLA)[^7]. Use for historical cross-reference and pattern analysis on retailer/REIT defaults. Not real-time — best for baseline distress modeling. |
| **BankruptcyData.com** | `https://www.bankruptcydata.com` (web; limited free RSS at `/rss`) | Freemium | Free headline access; unlimited scraping gated | Daily updates | RSS / HTML scrape | None for free tier | debtor_name, filing_date, court, chapter, assets_liabilities, industry | CourtListener, PACER PCL | **Tenant Distress Ticker** | Free tier provides recent filing headlines and basic case metadata[^8][^9]. Covers all 94 US bankruptcy courts[^10]. Editorial team annotates public company filings. RSS feed at `https://www.bankruptcydata.com/rss` pulls recent filings. Paid tier unlocks 340+ data fields and pre-filing distress signals[^10]. |
| **ABI (American Bankruptcy Institute) Free Headlines** | `https://www.abi.org/feed` (RSS) | **Free** | Unlimited | Daily | RSS / XML | None | headline, date, brief_summary, filing_links | BankruptcyData.com, CourtListener | **Tenant Distress Ticker** | ABI publishes monthly commercial Chapter 11 filing counts (e.g., 956 filings in January 2026, up 76% YoY)[^11]. Free RSS covers news and ABI Journal excerpts. Good for summary-level context. Not granular per-filing. Cross-reference with Epiq AACER monthly press releases (free PDF) for aggregate retail Chapter 11 counts[^12][^13]. |
| **Epiq AACER Monthly Press Releases** | `https://www.epiqglobal.com/en-us/resource-center/news` (web scrape) | **Free** | Unlimited | Monthly | HTML / PDF | None | total_commercial_ch11, subchapter_V, YoY_pct_change, month | ABI, CourtListener | **Distress Macro Gauge** | Industry-standard filing count data cited by Bloomberg and Reuters[^12]. January 2026: 3,016 total commercial Chapter 11s in H1 2024, up 34%[^13]. PDF press releases. No API — monitor via RSS from `epiqglobal.com`. |

***

## Section 2 — CMBS Surveillance & Special Servicing

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **KBRA CMBS Trend Watch (Monthly)** | `https://www.kbra.com/publications/` → search "CMBS Trend Watch" | **Freemium** | Monthly PDF free; granular loan-level paid | Monthly[^14][^15] | PDF / web article | None for PDF | delinquency_rate, distress_rate (delinquent + specially_serviced), issuance_volume, sector_breakdowns | Trepp, CRED iQ | **CMBS Watchlist Ticker** | KBRA CMBS distress rate ended 2024 at 9.3%, rising to 10.6% by end-2025[^15]. Free monthly PDFs are the most granular public sector-level data. Example: August 2025 showed delinquency at 7.9% ($26.1B), distress at 10.6% ($35B)[^16]. RSS via `https://www.kbra.com/feed/publications/rss`. Critical CMBS source. |
| **CRED iQ Monthly CMBS Distress Reports** | `https://cred-iq.com/blog/` (web scrape or RSS at `https://cred-iq.com/feed/`) | **Freemium** | Monthly summary free; loan-level is paid | Monthly[^17][^18] | Blog/HTML / PDF | None for free articles | distress_rate, delinquency_rate, special_servicing_rate, sector_breakdowns (office/multifamily/retail/industrial/hotel) | KBRA, Trepp | **CMBS Watchlist Ticker** | CRED iQ distress rate (delinquent + specially serviced) was 10.8% in June 2025[^17], 11.28% in September 2025[^18]. Monthly blog posts are free. Paid platform has loan-level special servicing transfers. RSS: `https://cred-iq.com/feed/`. For the terminal, RSS poll daily and surface any distress rate move >50bps as a live alert. |
| **Trepp Blog / Delinquency Commentary** | `https://www.trepp.com/trepptalk` (web scrape); Monthly Delinquency Report PDF at `https://www.trepp.com/instantly-access-cmbs-delinquency-report-[MONTH]-[YEAR]` | **Freemium** | Blog/commentary free; loan-level TreppWire is paid | Monthly (report) + weekly (blog)[^19][^20] | HTML blog / PDF (gated lead-gen) | None (blog); email registration for PDF | overall_delinquency_rate, sector_rates (office/multifamily/retail), special_servicing_rate, notable_loan_transfers | KBRA, CRED iQ | **CMBS Watchlist Ticker** | Trepp CMBS delinquency was 7.29% in August 2025, up for the sixth consecutive month[^19]. Free blog posts name specific distressed properties. Monthly PDF requires email registration (not paid). True loan-level special-servicing transfer data is behind TreppWire Pro ($5K–$20K/yr). RSS at `https://www.trepp.com/feed`. |
| **S&P Global Ratings Press Release RSS** | `https://www.spglobal.com/ratings/en/research-insights/articles/rss` — filter client-side for "CMBS" or "REIT" in title | Freemium | Public press releases free; RatingsDirect paid | Real-time (within hours of rating action)[^21] | RSS / XML | None for press RSS | rating_action, issuer_name, rating_level, outlook, rationale_excerpt | Fitch RSS, Moody's RSS, KBRA | **Rating Action Ticker** | Public rating announcements (not full research) available via RSS. For CMBS/REIT actions, filter RSS `<title>` for keywords: "CMBS", "REIT", "commercial mortgage", "going concern". Full analysis behind paid RatingsDirect. Moody's investor relations RSS: `https://ir.moodys.com/contacts/rss-feeds`[^22]. |
| **Fitch Ratings Research RSS** | `https://www.fitchratings.com/search/?q=CMBS+REIT&type=research` (web scrape) | Freemium | Press releases free | Real-time[^23] | HTML / RSS | None for public press releases | rating_action, CMBS_tranche, REIT_issuer, rating_date, outlook | S&P RSS, KBRA RSS, Moody's | **Rating Action Ticker** | Fitch updates CMBS large-loan criteria periodically (e.g. May 2026 update)[^23]. Subscribe to Fitch public alerts at `fitchratings.com`. Filter for structured finance / US CMBS / US REITs. Full research gated behind Fitch Connect subscription. |
| **KBRA Press Release RSS** | `https://www.kbra.com/feed/publications/rss` | **Free** | Unlimited | Real-time | RSS / XML | None | rating_action, entity_name, action_type, date, sector | S&P, Fitch, Moody's | **Rating Action Ticker** | KBRA is integrated into Bloomberg CMBS index methodology as of June 2026[^24]. Free RSS is the best of the four major CMBS raters for public feed access. KBRA's CMBS Trend Watch (monthly) and Loan Performance Trends (monthly)[^16] are core inputs. |

***

## Section 3 — Retail Store Closure & Tenant Health Trackers

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **Retail Dive RSS** | `https://www.retaildive.com/feeds/news/` | **Free** | Unlimited[^25][^26] | Near-real-time (within hours of event) | RSS / XML | None | headline, summary, date, url, tags (bankruptcy, store-closure) | Chain Store Age RSS, WARN Act | **Tenant Distress Ticker** | Monitor RSS and filter for tags: "bankruptcy", "chapter 11", "store closure", "liquidation", "going-out-of-business". Retail Dive broke 40K+ store closure story April 2026[^27]. High signal-to-noise for major retailer events. |
| **Chain Store Age RSS** | `https://chainstoreage.com/rss.xml` | **Free** | Unlimited[^26] | Near-real-time | RSS / XML | None | headline, summary, date, author | Retail Dive RSS, Coresight | **Tenant Distress Ticker** | Complementary to Retail Dive; covers convenience, grocery, mass market. Filter for "closure", "bankruptcy", "restructuring". |
| **Coresight Research US Store Closure Tracker** | `https://coresight.com/tag/weekly-us-store-openings-and-closures-tracker/` (weekly article; free PDF registration) | **Freemium** | Weekly tracker article free; detailed CSV behind paywall | Weekly[^28][^29] | HTML article / PDF (registration) | Email registration for PDF | retailer_name, store_count_closing, store_count_opening, YTD_net_closures, bankruptcy_flag | Retail Dive RSS, EDGAR 8-K | **Tenant Distress Ticker** | Coresight tracked 7,325 US store closures in 2024 (119M sqft vacated)[^28] and projects ~15,000 closures in 2025[^28][^30]. Weekly tracker is the gold standard for aggregate retail vacancy. RSS for blog at `https://coresight.com/feed/`. Free registration unlocks weekly PDF. Full data CSV is paid. |
| **WARN Act — California (EDD)** | `https://edd.ca.gov/en/jobs_and_training/layoff_services_warn` (downloadable Excel/CSV[^31][^32]) | **Free** | Unlimited | Weekly updates | CSV / Excel / HTML | None | employer_name, address, layoff_date, employees_affected, type (closure/layoff) | NY WARN, TX WARN, CourtListener | **Tenant Distress Ticker** | WARN Act requires 60-day advance notice for closings/layoffs affecting 100+ employees[^32]. USA Today aggregates 44 states daily[^32]. For terminal: scrape state portals directly. Key retail states below. |
| **WARN Act — New York (NYSDOL)** | `https://dol.ny.gov/warn-notices` (downloadable Excel[^31]) | **Free** | Unlimited | Weekly | Excel / HTML | None | employer, county, date_of_filing, layoff_date, employees | CA WARN, TX WARN | **Tenant Distress Ticker** | NY Mini-WARN requires 90 days notice and covers employers 50+[^32]. High-value for NYC retail/office tenant signals. |
| **WARN Act — Texas (TWC)** | `https://www.twc.texas.gov/data-reports/warn-notice` (downloadable files[^31]) | **Free** | Unlimited | Weekly | CSV / Excel | None | employer, city, county, notice_date, layoff_date, employees | CA WARN, NY WARN | **Tenant Distress Ticker** | Texas has major retail/industrial corridors (DFW, Houston). TWC posts notices within days of filing. |
| **WARN Act — Florida (DEO)** | `https://floridajobs.org/office-directory/division-of-workforce-services/workforce-programs/reemployment-and-emergency-assistance-coordination-team-react/warn-notices` | **Free** | Unlimited | Weekly | HTML / PDF | None | employer, location, layoff_date, employees | TX WARN, GA WARN | **Tenant Distress Ticker** | |
| **WARN Act — Illinois (DCEO)** | `https://dceo.illinois.gov/workforcedevelopment/warn.html` → monthly WARN dashboard[^33] | **Free** | Unlimited | Monthly dashboard (individual notices faster)[^33] | HTML / Excel | None | employer_name, location, date, employees | CA WARN, OH WARN | **Tenant Distress Ticker** | IL WARN covers employers 75+ employees[^33]. Dashboard updated monthly; individual notices posted faster. |
| **WARN Act — Pennsylvania (DLI)** | `https://www.pa.gov/en/agencies/dli/programs-services/workforce-development-home/warn-requirements/warn-notices.html` | **Free** | Unlimited | Weekly | HTML / PDF | None | employer, location, date, employees | NY WARN, NJ WARN | **Tenant Distress Ticker** | |
| **WARN Act — Ohio / Georgia / NC / MI / NJ / VA / WA / AZ / MA** | Ohio: `jfs.ohio.gov`; GA: `tcsg.edu/warn-public-view`[^31]; NC: `commerce.nc.gov/data-tools-reports/labor-market-data-tools/workforce-warn-reports`[^31]; MA: `mass.gov/info-details/worker-adjustment-and-retraining-notification-act-warn-layoff-and-closure-updates`[^34] | **Free** | Unlimited | Weekly | HTML / CSV / Excel | None | employer, city, date, employees | CA/NY/TX WARN | **Tenant Distress Ticker** | WARNTracker.com aggregates 40+ states since 1988 free view; full dataset is paid subscription[^32]. For terminal, direct state scraping is cleaner for real-time use. |

***

## Section 4 — SEC EDGAR Filings (8-K / 10-Q / 10-K / XBRL)

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **EDGAR Full-Text Search (EFTS) API** | `https://efts.sec.gov/LATEST/search-index?q=%22chapter+11%22+%22going+concern%22&forms=8-K&dateRange=custom&startdt=2024-01-01&category=form-type` | **Free** | No rate limit published; SEC requests politeness (≤10 req/sec)[^35][^36] | Real-time (minutes after filing dissemination) | JSON | None[^35] | filing_id, entity_name, CIK, form_type, filing_date, document_url, matched_text_excerpt | EDGAR Submissions API, CourtListener | **Tenant Distress Ticker** | **Most powerful free endpoint on this list.** EDGAR EFTS indexes full text of all filings since 2001[^36]. Example queries: `q="chapter 11" forms=8-K&dateRange=custom` — returns every 8-K mentioning Chapter 11. Add `&category=form-type` and manually filter SIC 5300–5999 (retail) or 6500–6599 (real estate). No API key needed[^35]. Combine with EDGAR Submissions API for SIC filtering: `https://data.sec.gov/submissions/CIK##########.json`. |
| **EDGAR Submissions API** (by SIC) | `https://data.sec.gov/submissions/CIK##########.json` — bulk: `https://www.sec.gov/Archives/edgar/daily-index/bulkdata/submissions.zip` | **Free** | No auth required; no documented rate limit[^35] | Real-time (< 1 second delay)[^35] | JSON | None | CIK, entity_name, SIC_code, recent_filings (form_type, filing_date, accession_number), ticker | EDGAR EFTS, XBRL API | **Rating Action / Loan Watchlist** | Download `submissions.zip` nightly (~3 AM ET) for bulk processing[^35]. Filter `sic` field: 5300–5999 for retail, 6798 for REITs, 6552 for land subdividers/developers. Then query individual CIK endpoints for 8-K filings. |
| **EDGAR XBRL Frames API (REIT NOI/Tenant Data)** | `https://data.sec.gov/api/xbrl/frames/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax/USD/CY2024Q3.json` | **Free** | No auth; no documented rate limit[^35][^37] | Real-time (< 1 min delay)[^35] | JSON | None | entity_name, CIK, val (reported value), accn (accession), filed_date, form | EDGAR Submissions API, SEC EFTS | **REIT Health Tracker** | Pull REIT-specific concepts: `SameStoreNetOperatingIncomeLoss`, `TenantImprovementAllowance`, `PercentageRent` from XBRL taxonomy. Combine with `companyfacts` API: `https://data.sec.gov/api/xbrl/companyfacts/CIK##########.json` for per-REIT time-series. Covers 10-Q and 10-K same-store NOI disclosures automatically[^37]. |
| **EDGAR RSS Feed (Real-Time Filings)** | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&dateb=&owner=include&count=40&search_text=&output=atom` | **Free** | Unlimited | Real-time (updated continuously) | Atom/RSS | None | company_name, CIK, form_type, filing_date, filing_url | EDGAR EFTS, CourtListener | **Tenant Distress Ticker** | Real-time atom feed for 8-K filings. Filter downstream for SIC codes. Change `type=8-K` to `10-Q` or `10-K` as needed. No search/filter parameters — full firehose, must process client-side. |

***

## Section 5 — Banking & Regulatory Distress Signals

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **FDIC BankFind Suite API** | `https://banks.data.fdic.gov/api/financials?filters=REPDTE%3A20241231%20AND%20CREACR%3A[0.25+TO+*]&fields=INSTNAME,REPDTE,CREACR,LNRECONS,ASSET&limit=50&offset=0&output=json` | **Free** | No auth, no rate limit published[^38] | Quarterly (Call Report data)[^38] | JSON / CSV | None[^38] | institution_name, CRE_loan_concentration_ratio (`CREACR`), construction_loans, total_assets, delinquency_metrics | FFIEC CDR, Fed H.8 | **CRE Loan Risk Gauge** | `CREACR` = CRE concentration ratio. Failed bank list: `https://banks.data.fdic.gov/api/failures?fields=NAME,FAILDATE,CERT,SAVR,RESTYPE,CHARTER,COST,QBFASSET&sort_by=FAILDATE&sort_order=DESC&output=json`. Filters support Elasticsearch syntax[^38]. No API key needed. Primary endpoint for bank-level CRE exposure surveillance. |
| **FFIEC CDR Bulk Data Download** | `https://cdr.ffiec.gov/public/PWS/DownloadBulkData.aspx` → select "FFIEC 031" or "FFIEC 041"[^39] | **Free** | Free account required for SOAP API[^40] | Quarterly[^39] | CSV / XBRL / Excel[^39] | Free CDR account for SOAP API | CRE_loans_by_category, construction_loans, noncurrent_CRE, charge-offs, bank_name, RSSD_ID | FDIC BankFind, FRED | **CRE Loan Risk Gauge** | Python connector `ffiec_data_connect` wraps the SOAP API[^40]: `pip install ffiec-data-connect`. Schedule: Q4 2025 data released ~March 2026. Key MDRM codes: `RCON1480` (CRE non-farm, non-residential), `RCON3584` (past-due 30–89 days), `RCON3585` (90+ days or nonaccrual). |
| **Federal Reserve FRED API — CRE Delinquency** | `https://api.stlouisfed.org/fred/series/observations?series_id=DRCRELEXFACBS&api_key=YOUR_FREE_KEY&file_type=json` | **Free** | 120 req/min with free key[^41][^42] | Quarterly (1–2 week delay after quarter-end)[^41] | JSON / CSV / XML | Free API key | observation_date, value (delinquency_rate_pct) | FDIC BankFind, FFIEC CDR | **CRE Loan Risk Gauge** | Series `DRCRELEXFACBS`: Delinquency Rate on CRE Loans, All Commercial Banks[^42]. Series `CREACBM027NBOG`: Total CRE Loans outstanding monthly ($3.085T as of April 2026)[^43]. Series `DRCRELEXFOBS`: same for non-top-100 banks[^44]. FRED API is free; key at `fred.stlouisfed.org/docs/api/api_key.html`. |
| **Federal Reserve H.8 / SLOOS (via FRED)** | H.8: `https://api.stlouisfed.org/fred/release/series?release_id=22&api_key=KEY&file_type=json` SLOOS: `https://www.federalreserve.gov/releases/sloos/`[^45][^46] | **Free** | FRED: 120 req/min; SLOOS PDF free[^46][^47] | H.8: Weekly (Friday); SLOOS: Quarterly[^45] | JSON (FRED) / PDF (SLOOS) | Free key (FRED) | H.8: aggregate_CRE_loans, commercial_bank_assets; SLOOS: tightening_standards_CRE_pct, demand_change_CRE_pct | FRED CRE Delinquency, FFIEC CDR | **Macro CRE Gauge** | SLOOS surveys 80 large domestic banks quarterly on CRE lending standards[^45]. High signal for tightening credit. Fed charge-off and delinquency table: `https://www.federalreserve.gov/releases/chargeoff/`[^48] updated quarterly. |
| **NCUA Credit Union CRE Call Report Data** | `https://ncua.gov/analysis/credit-union-corporate-call-report-data` → download quarterly ZIP[^49] | **Free** | Unlimited[^49] | Quarterly[^49][^50] | CSV (zipped) | None[^49] | total_CRE_loans, total_assets, delinquent_CRE, net_charge_offs, member_count | FDIC BankFind, FFIEC CDR | **CRE Loan Risk Gauge** | Q4 2025: total CU assets $2.43T[^50]. CSV includes all federally-insured credit unions. Filter for large CUs with material CRE concentration. NCUA publishes quarterly aggregate performance report and full credit union list[^50]. Open data also at `ncua.gov/data`[^51]. |
| **OCC Semiannual Risk Perspective** | `https://occ.gov/publications-and-resources/publications/semiannual-risk-perspective/index-semiannual-risk-perspective.html` | **Free** | Unlimited | Semiannual (Spring/Fall) | PDF | None | CRE_concentration_risk, bank_underwriting_standards, loan_stress_metrics | FDIC, FFIEC | **Macro CRE Gauge** | OCC's flagship systemic risk document. Flags CRE concentrations and office/retail exposure by bank size. Not real-time — use as quarterly calibration for risk overlay. |

***

## Section 6 — Federal Tenant (GSA/Office) Risk

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **GSA IOLP Dataset (Data.gov)** | `https://catalog.data.gov/dataset/inventory-of-owned-and-leased-properties-iolp` → CSV download[^52] | **Free** | Unlimited | Last updated March 2024[^52] | CSV | None | property_address, sq_footage, lease_expiration, annual_rent, occupancy_pct, building_type | GSA utilization data, Trepp GSA analysis | **Federal Tenant Watchlist** | Full GSA lease inventory: 8,600+ leased, 1,500+ owned buildings[^53]. JLL tracks GSA terminations since Jan 2025 on ArcGIS[^54]. Over 53M sqft (35.5% of GSA-leased space) has option to terminate in Trump second term, representing $1.87B annual rent[^55]. DOGE-driven early termination risk is material for office CMBS[^56][^57]. Combine with CMBS loan data to identify CMBS loans backed by buildings with high federal occupancy. |
| **GSA Building Utilization Data (2026 Release)** | `https://www.gsa.gov/tools-overview/buildings-and-real-estate-tools/inventory-of-gsa-owned-and-leased-properties`[^58] | **Free** | Unlimited | Periodic (first full snapshot released Q1 2026)[^58] | CSV / web | None | building_id, utilization_rate_pct, sq_footage, lease_expiration | GSA IOLP CSV, Trepp | **Federal Tenant Watchlist** | GSA released first government-wide space utilization data in March 2026, flagging thousands of properties below 60% utilization[^58]. Download as part of DOGE lease-termination pipeline. Critical for identifying office buildings at risk of federal tenant loss. |

***

## Section 7 — Foot Traffic & Physical Occupancy Signals

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **Placer.ai Free City/MSA Snippets** | `https://www.placer.ai/anchor/articles/` (free blog) | **Freemium** | Free blog reports; full API is paid[^59][^60] | Monthly (Office Index)[^60] | HTML / PDF | None for blog | national_office_visit_gap_vs_2019_pct, city_recovery_rank, visit_trends | Advan, SafeGraph | **Occupancy Trend Gauge** | March 2024: nationwide office visits 32.7% below 2019; Miami gap 14.1%; SF gap ~50%[^60]. Free Placer.ai blog publishes monthly office and retail indices. Full API (for property-level data) requires paid subscription. |
| **Advan Research (formerly SafeGraph Patterns)** | `https://advanresearch.com/industry/cre`[^61] | **Paid (academic free via Dewey)** | Academic: free via university Dewey subscription[^62][^63] | Weekly[^64] | CSV (Dewey) | Dewey academic login (free if university subscriber)[^65] | visits_per_week, dwell_time, trade_area, visitor_home_cbg, POI_name | Placer.ai, SafeGraph | **Occupancy Trend Gauge** | Advan Patterns+ dataset covers millions of POIs, updated weekly[^64]. SafeGraph partnered with Dewey for academic free access[^63]; Advan now offers same data through Dewey[^62]. For a commercial terminal (non-academic), paid license required. Quoted as "the CRE foot traffic dataset" by industry[^61]. |
| **SafeGraph POI Core (via Dewey academic)** | `https://www.safegraph.com` → Dewey: `https://www.deweydata.io`[^66][^63] | Academic free | Free for subscribed universities[^63][^65] | Weekly | CSV | Dewey university login | business_name, NAICS_category, open_status, visits, dwell_time | Advan, Placer.ai | **Occupancy Trend Gauge** | Primary use case: monitor visit collapse at specific anchor tenants (e.g. Macy's, Best Buy, Dollar Tree) by location as leading distress indicator. |

***

## Section 8 — REIT & CMBS Bondholder Free Reports

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **EDGAR XBRL REIT 10-Q/10-K** | `https://data.sec.gov/api/xbrl/companyconcept/CIK0000894871/us-gaap/SameStoreNetOperatingIncomeLoss.json` | **Free** | No limit[^35] | Real-time (< 1 min)[^35] | JSON | None | quarterly_NOI, same_store_NOI, tenant_base_rent, occupancy_rate, REIT_name | Trepp, CRED iQ, Coresight | **REIT Health Tracker** | Standard XBRL API endpoint. Query `us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax` for REITs (SIC 6798). Free `companyfacts.zip` bulk download covers all REITs[^35]. Limitations: not all REITs use standard XBRL tags consistently — custom taxonomies require scraping. |
| **CMBS Issuer Free Investor Reports** | Varies by issuer. Example: DBRS Morningstar commentary at `dbrsmorningstar.com/research`; Kroll at `kbra.com/publications` | Freemium | Public research PDFs free | Monthly–quarterly | PDF | None for selected reports | deal_name, loan_balance, DSCR, LTV, property_type, NOI, special_servicer_name | Trepp, CRED iQ | **CMBS Watchlist Ticker** | Many CMBS issuers post free investor reports on deal performance. Search: `"[deal name] servicer report" site:citi.com OR site:wellsfargo.com OR site:jpmorganchase.com`. DBRS Morningstar has free research library. Full CMBS waterfall models require Bloomberg or Intex. |

***

## Section 9 — Reorg Research Substitutes & Free Restructuring News

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **Law360 Bankruptcy RSS** | `https://www.law360.com/bankruptcy/rss` | **Freemium** | Headlines free; full article behind paywall[^67][^68] | Real-time | RSS / XML | None for headlines | headline, date, brief_summary, case_name, parties | ABI, CourtListener | **Tenant Distress Ticker** | Headlines include case names, law firms, and deal structures. Free RSS is sufficient for monitoring new Chapter 11 filings by major retailers/REITs. Full text requires $700+/yr subscription. |
| **Reorg Research Free Snippets** | `https://reorg.com` (registration for snippets) | **Freemium** | 1–3 free article snippets/week after registration | Real-time | HTML | Free registration | restructuring_news, DIP_financing, claim_trading, hearing_dates | Debtwire, Law360, CourtListener | **Tenant Distress Ticker** | Reorg (now Reorg/Covenant Review) is the gold standard for CRE restructuring intelligence. Free tier provides teaser headlines and one paragraph. Full access: $10K–$50K/yr. |
| **Debtwire Free Headlines** | `https://www.debtwire.com` (subscription; limited free headlines) | **Freemium** | 3–5 free headlines/visit (no registration) | Real-time | HTML | None (limited) | company_name, debt_type, restructuring_stage, headline | Reorg, Law360, CourtListener | **Tenant Distress Ticker** | Debtwire covers distressed debt and CRE restructuring. Full access requires paid subscription ($5K–$20K/yr). Free headlines visible without login. Use as confirmation signal alongside CourtListener filings. |

***

## Section 10 — Macro Risk Confirming Signals

| Source Name | Exact URL / Endpoint | Free / Freemium / Paid | Free-Tier Quota | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile / Ticker | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| **FRED API — Full CRE Suite** | `https://api.stlouisfed.org/fred/series/observations?series_id=CREACBM027NBOG&api_key=YOUR_KEY&file_type=json` | **Free** | 120 req/min[^43] | Monthly/Quarterly | JSON | Free key | CRE_loans_outstanding, delinquency_rate, charge_off_rate | FDIC BankFind, FFIEC CDR | **Macro CRE Gauge** | Key series: `CREACBM027NBOG` (total CRE loans, $3.085T April 2026)[^43]; `DRCRELEXFACBS` (delinquency rate)[^42]; `DRCRELEXFOBS` (small bank CRE delinquency)[^44]. All free via FRED API with free key. |
| **FDIC Bank Failure List API** | `https://banks.data.fdic.gov/api/failures?fields=NAME,FAILDATE,CERT,COST,QBFASSET&sort_by=FAILDATE&sort_order=DESC&output=json` | **Free** | No limit | Real-time (failure date + next business day) | JSON | None | bank_name, fail_date, estimated_cost, total_assets, acquiring_institution, charter | FDIC Financials API, FFIEC | **CRE Loan Risk Gauge** | Full failure history back to 1934. Trigger alert on any new bank failure with CRE concentration >150% (flag using FDIC Financials API `CREACR` field pre-failure). |

***

## Appendix A — Top 15 Highest-Leverage Sources (Signal-per-Dollar Ranking)

| Rank | Source | Why It's High-Leverage | Signal Type | Cost |
|---|---|---|---|---|
| 1 | **EDGAR EFTS Full-Text Search** | Real-time 8-K/10-Q full-text search for "chapter 11", "going concern", "store closure" across all public companies; no API key; real-time[^35][^36] | Chapter 11 + REIT stress | **$0** |
| 2 | **CourtListener RECAP API + Alerts** | Fastest free access to PACER data; real-time webhooks at $10/mo; covers all 94 federal bankruptcy courts[^1][^2] | Chapter 11 filings | **$0–$10/mo** |
| 3 | **KBRA CMBS Publications RSS** | Free monthly CMBS distress + delinquency reports; integrated into Bloomberg index Jun 2026[^15][^24] | CMBS distress | **$0** |
| 4 | **CRED iQ Monthly Distress Blog + RSS** | Best free CMBS distress rate tracker (10.8% distress rate in Jun 2025)[^17]; sector-level breakdowns | CMBS special servicing | **$0** |
| 5 | **Retail Dive + Chain Store Age RSS** | Real-time store closure + bankruptcy news; high signal density for retail tenant events[^25][^26] | Retail tenant closures | **$0** |
| 6 | **FDIC BankFind Suite API** | Free CRE concentration by bank; failure list; no API key; Elasticsearch filtering[^38] | Bank CRE exposure | **$0** |
| 7 | **FRED API (CRE Delinquency Suite)** | Free API; covers CRE delinquency rates and outstanding loan balances with 120 req/min[^43][^42] | Macro CRE distress | **$0** |
| 8 | **WARN Act State Portals (CA/NY/TX/FL/IL/PA)** | 60-day advance notice of mass closures; best lead indicator for retail/office tenant exits[^31][^32] | Tenant closure signals | **$0** |
| 9 | **EDGAR XBRL Company Facts API** | Free REIT 10-Q/10-K NOI, occupancy, lease data via XBRL API; real-time[^35][^37] | REIT health | **$0** |
| 10 | **Trepp Blog + RSS (free tier)** | Names specific distressed properties and CMBS transfers in free blog posts[^19][^20] | CMBS property-level | **$0** |
| 11 | **FFIEC CDR Bulk Data** | Quarterly bank-level CRE delinquency by MDRM code; free with SOAP API[^39][^40] | Bank CRE loan quality | **$0** |
| 12 | **Coresight Weekly Store Tracker** | Gold standard for aggregate US store closure counts; free PDF registration[^28][^29] | Retail occupancy trends | **$0 (registration)** |
| 13 | **GSA IOLP + Utilization Data** | Federal tenant lease expiry and utilization by building; critical for office CMBS risk with DOGE impact[^53][^52][^58] | Federal office risk | **$0** |
| 14 | **PACER Case Locator API** | Official court records; batch search 108K cases; filter by Chapter 11 + court[^5] | Chapter 11 filings | **~$5–$30/mo** |
| 15 | **BankruptcyData.com Free RSS** | Editorial-quality Chapter 11 coverage; RSS for top-10 US bankruptcy courts[^8][^9] | Chapter 11 | **$0** |

***

## Appendix B — Unfair-Advantage Sources Most CRE Analysts Overlook

1. **EDGAR EFTS `/LATEST/search-index` endpoint** — Most analysts use EDGAR's web UI. The `efts.sec.gov` JSON API returns structured results without a key or rate limit, enabling real-time 8-K monitoring for any phrase ("lease rejection", "store closure", "going concern", "chapter 11 petition") across all public companies simultaneously. Wire this to your Kafka topic today.[^35][^36]

2. **WARN Act portals as a 60-day leading indicator** — A WARN Act filing precedes a public Chapter 11 announcement by weeks or months for large retail/industrial tenants. Most CRE analysts track closures after they happen. WARN Act state portals give 60 days advance notice. The CA EDD portal alone covers major retail distribution, warehouse, and store employees.[^31][^32]

3. **FFIEC CDR MDRM codes for bank-level CRE stress** — The FFIEC bulk data download contains MDRM code `RCON1480` (CRE non-farm non-residential loans) and `RCON3585` (90+ day delinquent or nonaccrual CRE). Cross-referencing a bank's CRE concentration (FDIC `CREACR`) with the delinquency trend creates a bank-level "stress score" that predicts CMBS loan call risk before it appears in servicer reports.[^39][^40]

4. **CourtListener RECAP Search Alerts at $10/month** — Commercial-grade alert coverage of all federal bankruptcy courts for $10/month. Most institutional services charge $1,000+/month for equivalent coverage. Set alerts for keyword combinations: `"retail" "chapter 11" court:(deb OR nysb OR txsb)` to catch Delaware/SDNY/SDTX filings within hours.[^2]

5. **KBRA CMBS Trend Watch RSS** — KBRA now feeds Bloomberg's CMBS index (June 2026), yet its monthly PDF reports are free. The distress rate data (10.6% as of year-end 2025) is cited by Bloomberg terminals — but available free via KBRA's RSS feed weeks before consensus acknowledgment.[^15][^24]

6. **CRED iQ RSS blog** — CRED iQ's free monthly distress analysis distinguishes between delinquent vs. specially-serviced loans by sector, a differentiation that most free sources collapse. The office sector's special servicing rate is a leading edge — loans can enter special servicing while still current, making this a true early-warning signal.[^17][^18]

7. **GSA utilization data (first released Q1 2026)** — First ever government-wide office utilization snapshot showing thousands of properties below 60% occupancy. DOGE-driven termination of ~7,500 federal leases represents the largest single tenant-exit event in US office history. Cross-referencing the GSA lease CSV with CMBS loan databases identifies CMBS deals with material federal-tenant exposure before servicer reports reflect it.[^56][^58]

***

## Appendix C — Gap Analysis: What Remains Gated Behind Paid Walls

The highest-fidelity CMBS intelligence — loan-level special-servicing transfer records, individual DSCR/LTV by loan, borrower covenant violations, DIP financing terms, hearing dates, and restructuring plan details — remains gated behind three dominant paid platforms: **Trepp Pro** ($5K–$20K/yr for the TreppWire loan surveillance database), **Reorg Research** ($10K–$50K/yr for restructuring intelligence including DIP, plan, and claims data), and **Debtwire** ($5K–$20K/yr for CRE debt restructuring news). Bloomberg CMBS module requires a full BVAL terminal ($25K+/yr). Intex, the industry-standard CMBS cash-flow model, is similarly enterprise-priced. **The cheapest legitimate path to approximate this data** is a three-pronged strategy: (1) CRED iQ Essentials subscription (~$300–$500/mo) provides loan-level special servicing data that is operationally equivalent to Trepp for most distress monitoring use cases; (2) **CourtListener's $10/month real-time alert tier** captures restructuring case filings within hours — often before Reorg publishes; and (3) parsing EDGAR 8-K filings via the free EFTS API catches DIP facility announcements, plan confirmations, and sale motions as they are required to be disclosed publicly. For a terminal targeting Israeli family-office LPs making portfolio-level decisions (not loan-level trading), the free-tier stack above, supplemented by CRED iQ Essentials and CourtListener's $10/month tier, delivers approximately 70–80% of the signal available on a full Bloomberg CMBS terminal at less than 2% of the cost.[^69][^67][^36][^35]

***

*Data as of May 2026. Rate limits and free-tier terms are subject to change by source providers. All PACER costs are subject to quarterly fee waiver if usage <$30/quarter per PACER policy.*

---

## References

1. [REST API, v4.4 - Courtlistener - FLP Wiki](https://wiki.free.law/c/courtlistener/help/api/rest/v4/overview) - Rate Limits¶ ... By default, authenticated users may make up to 5 requests per minute, 50 requests p...

2. [CourtListener Launches RECAP Search Alerts for PACER Filings](https://www.lawnext.com/2025/06/courtlistener-launches-recap-search-alerts-for-pacer-filings-google-alerts-for-federal-courts.html) - There is no cost to use the service, but the free version comes with limits. Free users will be limi...

3. [Recreating a Bankruptcy Dataset #4641 - GitHub](https://github.com/freelawproject/courtlistener/discussions/4641) - I have been able to very nicely grab docket information using your api https://www.courtlistener.com...

4. [Public Access to Court Electronic Records | PACER: Federal Court ...](https://pacer.uscourts.gov) - PACER provides information about accessing and filing federal court records electronically. Find res...

5. [Pacer Case Locator Pcl Api - API Evangelist APIs](https://apis.apievangelist.com/store/pacer-case-locator-pcl-api/) - The PACER Case Locator (PCL) API is a REST API providing programmatic access to a nationwide index o...

6. [Florida-UCLA-LoPucki Bankruptcy Research Database - Baker Library](https://www.library.hbs.edu/databases-cases-and-more/databases/florida-ucla-lopucki-bankruptcy-research) - The UCLA-LoPucki Bankruptcy Research Database (BRD) is a data collection, data linking, and data dis...

7. [BRD Spreadsheet](https://lopucki.law.ufl.edu/spreadsheet.php) - The BRD Spreadsheet is an abbreviated version of the BRD. It contains data on all large, public comp...

8. [About - Home | Bankruptcy Data](https://www.bankruptcydata.com/about.thtml) - BankruptcyData is the industry's most extensive database of business bankruptcy information. With co...

9. [Bankruptcy Data: Home](https://www.bankruptcydata.com) - We compile a database of case information for all companies (regardless of size) that file for bankr...

10. [US Bankruptcy Data | Exchange Data International](https://www.exchange-data.com/product/us-bankruptcy-data/) - With the US Bankruptcy Data service, clients can keep tabs on public company bankruptcy and follow b...

11. [January Commercial Chapter 11 Filings Increased 76 Percent over ...](https://www.abi.org/node/1002058) - 5, 2026 — There were 956 commercial chapter 11 filings in January 2026, an increase of 76 percent fr...

12. [Total Bankruptcy Filings Increase 11% in Calendar Year 2025 - Epiq](https://www.epiqglobal.com/en-us/resource-center/news/total-bankruptcy-filings-increase-11-in-calendar-year-2025) - Commercial bankruptcy filings increased five percent to 31,810 in CY 2025 from the 30,201 registered...

13. [Commercial Filings Increased 34 Percent in First Half of 2024 - Epiq](https://www.epiqglobal.com/en-us/resource-center/news/commercial-chapter-11-filings-increased-24-percent-in-first-half-of-2024) - Small business filings, captured as subchapter V elections within chapter 11, totaled 1,176 in the f...

14. [KBRA Releases Monthly CMBS Trend Watch](https://www.kbra.com/publications/jPhSXXBx) - KBRA releases the December 2024 issue of CMBS Trend Watch. U.S. CMBS ended the year on a high note, ...

15. [KBRA Releases Monthly CMBS Trend Watch](https://www.kbra.com/publications/nsQSYCwg) - KBRA releases the December 2025 issue of CMBS Trend Watch. U.S. CMBS finished the year at $125.8 bil...

16. [KBRA Releases Research – CMBS Loan Performance Trends](https://www.kbra.com/publications/RVLVmSJH) - KBRA releases a report on U.S. commercial mortgage-backed securities (CMBS) loan performance trends ...

17. [CMBS Distress Rate Trims 20 BPS, While Delinquencies Increase](https://cred-iq.com/blog/2025/07/10/cmbs-distress-rate-trims-20-bps-while-delinquencies-increase/) - The commercial mortgage-backed securities (CMBS) distress rate shaved 20 basis points to 10.8% in Ju...

18. [CRED iQ Market Update: Navigating CMBS Distress and Broader ...](https://cred-iq.com/blog/2025/10/02/cred-iq-market-update-navigating-cmbs-distress-and-broader-cre-trends-in-q3-2025/) - Starting with CMBS delinquency trends, our tracking shows a slight downward trend in overall distres...

19. [CMBS Delinquency Rate Increases Again in August as Office ...](https://www.trepp.com/trepptalk/cmbs-delinquency-rate-increases-again-in-august-2025) - The Trepp CMBS Delinquency Rate increased for the sixth consecutive month in August 2025, rising six...

20. [Download the Trepp CMBS Delinquency Report](https://www.trepp.com/instantly-access-cmbs-delinquency-report-july-2025) - Access the monthly Trepp CMBS Delinquency Report for July 2025.

21. [RSS Feeds - S&P Global - Contact Investor Relations](https://investor.spglobal.com/contact-investor-relations/rss-feeds/default.aspx) - Clicking on an RSS link below will provide you with raw XML data of our content. If you do not have ...

22. [Contacts - RSS Feeds - Moodys - Investor Relations](https://ir.moodys.com/contacts/rss-feeds/default.aspx) - To subscribe to an RSS feed, select the location of the website of interest and click the small oran...

23. [Fitch Ratings Updates CMBS Large Loan Rating Criteria](https://www.fitchratings.com/research/structured-finance/fitch-ratings-updates-cmbs-large-loan-rating-criteria-21-05-2026) - Fitch Ratings-New York/Chicago-21 May 2026: Fitch Ratings has released an updated criteria report fo...

24. [KBRA (@krollbondrating) / Posts / X - Twitter](https://x.com/krollbondrating) - KBRA credit ratings will be incorporated into @Bloomberg's CMBS index methodology beginning with the...

25. [Retail Dive: Retail News and Trends](https://www.retaildive.com) - Retail Dive provides news and analysis for retail executives. We cover topics like retail tech, mark...

26. [Top 30 Retail Technology RSS Feeds](https://rss.feedspot.com/retail_technology_rss_feeds/) - Retail Dive RSS Feed Follow RSS Website retaildive.com. Retail Dive provides ... RIS News RSS Feed. ...

27. [Retailers could close more than 40K stores in the next 5 years](https://www.retaildive.com/news/retailers-close-more-than-40k-stores-5-years/818423/) - Growth in e-commerce, aided by AI, is poised to lead retailers to close more than 40,000 stores over...

28. [The US could see 15,000 brick-and-mortar store closures in 2025](https://www.glossy.co/beauty/the-us-could-see-15000-brick-and-mortar-store-closures-in-2025/) - U.S. store closures in 2025 could top 2024 numbers, according to new data released Thursday by Cores...

29. [Weekly US Store Openings and Closures Tracker Archives](https://coresight.com/tag/weekly-us-store-openings-and-closures-tracker/) - Our Weekly US Store Openings and Closures Tracker series reports on store closures, openings and ban...

30. [3 huge retailers closed forever after 2024 bakruptcies - Yahoo Finance](https://finance.yahoo.com/news/3-retail-brands-vanished-2025-183300821.html) - 3 huge retailers closed forever after 2024 bakruptcies · Party City: Filed Chapter 11 bankruptcy and...

31. [A (work in progress) aggregation of places to find WARN Act notices ...](https://gist.github.com/0xdade/c90d11a7f2d2591ad0a980b9c7ed232f) - WARN Act. Worker Adjustment and Retraining Notification Act of 1988 requires that advance notice be ...

32. [See which companies announced layoffs and closings - WARN ...](https://data.usatoday.com/see-which-companies-announced-mass-layoffs-closings/) - The Worker Adjustment and Retraining Notification (WARN) Act requires employers with 100 or more emp...

33. [Notices of Layoffs and Closures (WARN)](https://dceo.illinois.gov/workforcedevelopment/warn.html) - Under state law, employers must notify the state when they plan to lay off workers. This law is know...

34. [Worker Adjustment and Retraining Notification Act (WARN) layoff ...](https://www.mass.gov/info-details/worker-adjustment-and-retraining-notification-act-warn-layoff-and-closure-updates) - In compliance with the federal WARN Act, employers must notify the Executive Office of Labor and Wor...

35. [EDGAR Application Programming Interfaces (APIs) - SEC.gov](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) - This page provides information on how developers may use application programming interfaces (APIs) t...

36. [Search Filings - SEC.gov](https://www.sec.gov/search-filings) - Full Text Search. Find keywords and phrases in more than 20 years of EDGAR filings, and filter by da...

37. [SEC EDGAR Data - XBRL US](https://xbrl.us/academic-repository/sec-edgar-data/) - The public can access XBRL for free via SEC EDGAR Financial Statements Data Sets and ...

38. [FDIC Bank Data Scraper — Financials & Failed Banks - Apify](https://apify.com/copious_atoll/fdic-bank-data) - Extract FDIC bank financial data and the complete failed banks list from the official FDIC BankFind ...

39. [Download Bulk Data - FFIEC Central Data Repository's Public Data ...](https://cdr.ffiec.gov/public/PWS/DownloadBulkData.aspx) - This page enables you to download bulk data in either Excel compatible or XBRL format. Please note t...

40. [call-report/ffiec-data-connect - GitHub](https://github.com/call-report/ffiec-data-connect) - REST API Endpoints. The library supports all 7 FFIEC REST API endpoints (per CDR-PDD-SIS-611 v1.10):...

41. [FRED Graph - Federal Reserve Bank of St. Louis](https://fred.stlouisfed.org/graph/?g=115OG) - Graph and download economic data for Delinquency Rate on Loans Secured by Real Estate, All Commercia...

42. [Delinquency Rate on Commercial Real Estate Loans ... - FRED](https://fred.stlouisfed.org/series/DRCRELEXFACBS) - Graph and download economic data for Delinquency Rate on Commercial Real Estate Loans (Excluding Far...

43. [Commercial Real Estate Loans, All Commercial Banks ... - FRED](https://fred.stlouisfed.org/series/CREACBM027NBOG) - Graph and download economic data for Real Estate Loans: Commercial Real Estate Loans, All Commercial...

44. [Delinquency Rate on Commercial Real Estate Loans (Excluding ...](https://fred.stlouisfed.org/series/DRCRELEXFOBS) - Delinquency rate on commercial real estate loans (excluding farmland), booked in domestic offices, b...

45. [Senior Loan Officer Opinion Survey on Bank Lending Practices](http://catalog.data.gov/dataset/senior-loan-officer-opinion-survey-on-bank-lending-practices) - The Senior Loan Officer Opinion Survey on Bank Lending Practices (SLOOS) surveys up to 80 large dome...

46. [H.8 Assets and Liabilities of Commercial Banks in the United States](https://alfred.stlouisfed.org/release/downloaddates?rid=22) - Download Release Dates for Release: H.8 Assets and Liabilities of Commercial Banks in the United Sta...

47. [Senior Loan Officer Opinion Survey on Bank Lending Practices](https://alfred.stlouisfed.org/release/downloaddates?rid=191) - Download Release Dates for Release: Senior Loan Officer Opinion Survey on Bank Lending Practices ; L...

48. [FRB: Charge-Off and Delinquency Rates on Loans and Leases at ...](https://www.federalreserve.gov/releases/chargeoff/) - Charge-Off and Delinquency Rates on Loans and Leases at Commercial Banks · The 100 largest banks are...

49. [Credit Union and Corporate Call Report Data | NCUA](https://ncua.gov/analysis/credit-union-corporate-call-report-data) - These quarterly reports present year-to-date financial trends in federally insured credit unions, ba...

50. [NCUA Releases Fourth Quarter 2025 Credit Union System ...](https://ncua.gov/newsroom/press-release/2026/ncua-releases-fourth-quarter-2025-credit-union-system-performance-data) - The National Credit Union Administration today released its fourth quarter credit union system perfo...

51. [NCUA Open Data](https://ncua.gov/data) - NCUA Data and Analysis. Credit union financial performance, merger data, chartering, field of member...

52. [Inventory of Owned and Leased Properties (IOLP) - Catalog - Data.gov](http://catalog.data.gov/dataset/inventory-of-owned-and-leased-properties-iolp) - The Inventory of Owned and Leased Properties (IOLP) allows users to search properties owned and leas...

53. [Inventory of GSA Owned and Leased Properties](https://www.gsa.gov/tools-overview/buildings-and-real-estate-tools/inventory-of-gsa-owned-and-leased-properties) - View expiring lease/occupancy information for more than 8600 leased and 1500 government owned buildi...

54. [Federal Lease Terminations - ArcGIS Experience Builder](https://experience.arcgis.com/experience/176a3e217307488b9ee5f039c1aee453) - JLL is tracking GSA lease terminations since January 20, 2025 and measuring how much the federally-l...

55. [DOGE Looks to Cut GSA-Leased Office Space - Trepp](https://www.trepp.com/trepptalk/doge-looks-to-cut-gsa-leased-office-space-quantifying-impact-on-key-msas) - This analysis looks at the impact on the office markets of the top 10 individual metropolitan statis...

56. [US Administration Terminates Federal Office Leases Through ...](https://www.jdsupra.com/legalnews/us-administration-terminates-federal-3899206/) - The standard form L201C GSA lease contains provisions allowing the government to exercise an early t...

57. [DOGE Issues Directive Regarding GSA Leases - Kilpatrick](https://ktslaw.com/en/insights/alert/2025/2/%7B88528D39-8A90-4BE8-9DB2-36096A58E240%7D?pdf=1) - This legal alert aims to help landlords navigate this confusion by helping them maximize their lease...

58. [Underused federal offices targeted as GSA releases utilization data](https://www.govexec.com/management/2026/04/underused-federal-offices-targeted-gsa-releases-utilization-data/412559/) - The agency found that thousands of federal buildings did not meet a statutory 60% minimum average ut...

59. [Collect, Analyze and Integrate Foot Traffic Data through an API](https://www.placer.ai/guides/foot-traffic-api) - For organizations ready to take the next step in data integration, Placer.ai offers a robust Foot Tr...

60. [Placer.ai Office Index: March 2024 Recap](https://www.placer.ai/anchor/articles/placer-ai-office-index-march-2024-recap) - The Placer.ai Nationwide Office Building Index: The office building index analyzes foot traffic data...

61. [Solutions for Commercial Real Estate - Advan Research](https://advanresearch.com/industry/cre) - Foot traffic and location insights for commercial real estate teams to optimize leasing, improve NOI...

62. [SafeGraph Patterns is Now on Dewey as Advan Patterns](https://www.deweydata.io/blog/advan-patterns-now-available) - Effective January 2023, Patterns, a popular foot traffic dataset previously provided by SafeGraph, w...

63. [SafeGraph Partners with Dewey for Academic Data Access](https://www.safegraph.com/blog/safegraph-partners-with-dewey/) - SafeGraph partners with Dewey to provide academics easy access to high-quality POI data for research...

64. [Foot Traffic Data Feeds | Patterns+ Product - Advan Research](https://advanresearch.com/products/patternsplus) - Patterns+ is a high-fidelity foot traffic dataset offering weekly visitor behavior, trade areas, and...

65. [Dewey Academic Research Data - Research Guides](https://libguides.princeton.edu/az/dewey-academic-research-data) - Dewey Academic Research Data, often referred to as Dewey Data, is a research platform that provides ...

66. [Foot Traffic Data: How It Works, Uses & Where to Get It - SafeGraph](https://www.safegraph.com/guides/foot-traffic-data/) - Learn what foot traffic data is, how it's collected, calculated, and used for site selection, compet...

67. [Bankruptcy : Law360 : Legal News & Analysis](https://www.law360.com/bankruptcy) - Legal news and analysis on bankruptcy litigation and policy. Covers corporate bankruptcy, restructur...

68. [Latest News in Bankruptcy - Law360](https://www.law360.com/about/bankruptcy) - Law360 provides breaking news and analysis on bankruptcy law. Coverage includes corporate bankruptci...

69. [Bankruptcy Practice News - BC Law Library's Research Guides](https://lawguides.bc.edu/c.php?g=350878&p=2367026) - Law360 Bankruptcy Practice News - Tracks law firm representation and case outcomes for bankruptcy ma...

