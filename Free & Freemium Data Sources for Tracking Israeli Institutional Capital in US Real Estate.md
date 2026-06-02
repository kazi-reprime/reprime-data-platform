# Free & Freemium Data Sources: Tracking Israeli Institutional Capital in US Real Estate

## Executive Summary

Israel ranked as the **10th largest foreign real estate investor in the United States in 2024**, with capital inflows totaling $578 million — concentrated heavily in industrial/logistics ($400M), office ($169M), and retail ($10M). In 2022, Israeli institutions acquired 89 US properties worth nearly $1.5 billion, placing Israel among the top 10 foreign capital sources. Major actors include Migdal, Phoenix, Harel, Clal, Menora Mivtachim (the "Big Five" insurers/pension managers), plus listed real estate conglomerates like Gazit-Globe, Azrieli, and Alony-Hetz.[^1][^2][^3][^4][^5]

This map organizes every free or freemium data source across six functional layers: **macro FDI flows, regulatory filings, capital markets disclosures, property-level transaction data, Israeli-side disclosures, and news/intelligence feeds**. Each source is rated for actionability and coverage gaps are noted explicitly.

***

## Layer 1: Macro FDI Flow Data (Bilateral Aggregates)

These sources provide the macro picture of Israeli capital moving into the US economy, including real estate sectors. None isolate CRE precisely, but BEA's industry breakdowns come closest.

### BEA — Foreign Direct Investment in the United States (FDIUS)

**URL:** [bea.gov/international/di1fdiop](https://www.bea.gov/international/di1fdiop)
**Cost:** Free
**What it provides:** Annual data on the activities of US affiliates of foreign multinational enterprises, including financial structure, employment, sales, and capital flows by country of origin and by industry (including "Real Estate and Rental and Leasing" as a separate SIC/NAICS sector). The **BE-12 Benchmark Survey**, conducted every five years, is the most comprehensive dataset on this. Annual surveys (BE-15) update between benchmarks.[^6][^7]

**How to use it:**
- Navigate to [bea.gov/itable](https://www.bea.gov/itable) → "International" → "Direct Investment" → "Foreign Direct Investment in the United States" → filter by **Israel** and **Real Estate sector**[^8]
- Table format: direct download to Excel/CSV
- Limitation: Data lags 18–24 months; does not break out CRE from residential; does not identify specific transactions or investors

**Actionability for Israeli CRE tracking:** Medium. Gives you annual aggregate Israeli FDI into US real estate. Best used for trend lines and annual benchmarking.

***

### IMF — Coordinated Direct Investment Survey (CDIS) / Direct Investment Positions by Counterpart Economy (DIP)

**URL:** [data.imf.org/en/datasets/IMF.STA:DIP](https://data.imf.org/en/datasets/IMF.STA:DIP)
**Cost:** Free
**What it provides:** Bilateral direct investment positions (inward and outward) by instrument (equity vs. debt) between Israel and the US, annually from 2009. Also available via World Bank's Data360 ([data360.worldbank.org](https://data360.worldbank.org/en/dataset/IMF_CDIS)) and DBnomics ([db.nomics.world/IMF/CDIS](https://db.nomics.world/IMF/CDIS)).[^9][^10][^11]

**How to use it:**
- At data.imf.org, select "DIP" dataset → filter counterpart economy = United States, reporting economy = Israel
- Outward Israeli FDI position into the US is the relevant field; cross-reference against BEA for validation
- Limitation: No industry breakdown; aggregated capital not just real estate; annual, not transactional

**Actionability:** Low-Medium. Best used to validate BEA figures and model macro trend.

***

### UNCTAD — FDI Statistics by Country

**URL:** [unctadstat.unctad.org](https://unctadstat.unctad.org/datacentre/dataviewer/US.FDIFlowsStock)
**Cost:** Free
**What it provides:** FDI inflow/outflow aggregates and stocks for 190+ economies, plus Greenfield Investment Monitor data. Israel country factsheets are updated annually.[^12][^13]

**How to use it:**
- At UNCTADstat, use the "FDI Flows and Stocks" viewer → select Israel as reporting economy, US as partner
- Also check the **World Investment Report** (free PDF annually) for qualitative country analysis
- Limitation: No real estate sector disaggregation; no deal-level data

**Actionability:** Low. Useful for top-of-funnel context only.

***

### OECD — International Direct Investment Statistics

**URL:** [oecd.org/en/data/indicators/fdi-flows.html](https://www.oecd.org/en/data/indicators/fdi-flows.html)
**Cost:** Free
**What it provides:** FDI flows and positions disaggregated by partner economy and by industry (including real estate) for OECD members, including Israel. Israel joined the OECD in 2010 and submits detailed bilateral FDI data.[^14][^15]

**How to use it:**
- OECD Data Explorer → "Finance" → "Foreign Direct Investment" → filter by Israel/US bilateral and by industry code F68 (Real Estate Activities)
- Data available in JSON/CSV via OECD's API (free, no registration)
- Limitation: Annual; lags ~12 months

**Actionability:** Medium-High. The OECD's industry disaggregation makes this one of the best free macro sources for Israeli CRE capital specifically.

***

## Layer 2: US Regulatory Filings — The Core Free Dataset Stack

This layer is the most actionable for deal-level and manager-level intelligence. All sources are fully free.

### SEC EDGAR — Form 20-F (Annual Reports, Foreign Private Issuers)

**URL:** [efts.sec.gov/LATEST/search-index?q=%22Israel%22&dateRange=custom&startdt=2020-01-01&forms=20-F](https://efts.sec.gov/LATEST/search-index?q=%22Israel%22&dateRange=custom&startdt=2020-01-01&forms=20-F)
**Cost:** Free
**What it provides:** Israeli companies dual-listed on US exchanges (NASDAQ, NYSE) must file annual reports on Form 20-F. For real estate-focused Israeli entities, these contain complete US property portfolios, transaction history, debt schedules, and capital allocation.[^16][^17]

**Key Israeli filers to monitor directly:**
- **Gazit-Globe Ltd.** (CIK: 1379009) — major US retail and mixed-use[^18]
- **Elbit Real Estate Ltd.** (ELRL on TASE, tracks US properties via subsidiary Plaza Centers)
- Search EDGAR Full Text Search ([efts.sec.gov](https://efts.sec.gov/LATEST/search-index)) for "United States real estate" + Israel + 20-F

**How to use it:**
- EDGAR Full Text Search: search `"Israeli investors" "United States" "real estate"` filtered to 20-F forms
- Use `edgartools` Python library (free, open-source) for programmatic bulk extraction[^19]
- Alert: Set up EDGAR RSS feed ([sec.gov/cgi-bin/browse-edgar?action=getcompany&type=20-F](https://www.sec.gov/cgi-bin/browse-edgar)) for any Israeli CIK

**Actionability:** High. These filings contain audited asset-level data on US property holdings, valuations, and transaction history.

***

### SEC EDGAR — Form 13F (Institutional Holdings)

**URL:** [investor.gov/form-13F](https://www.investor.gov/introduction-investing/investing-basics/glossary/form-13f-reports-filed-institutional-investment)
**Cost:** Free
**What it provides:** Quarterly equity holdings disclosure by institutional investment managers with >$100M in 13(f) securities. Israeli institutional managers (Harel, Migdal, Phoenix, Clal) who manage US public REIT portfolios must file 13F.[^20]

**How to use it:**
- EDGAR Full Text Search → filter by Form "13F-HR" → search company name (e.g., "Migdal," "Harel," "Phoenix Holdings")
- Use `edgartools` for Python-based parsing: `filings = get_filings(form="13F-HR")` → filter by filer address = Israel[^19]
- Limitation: Only captures **publicly traded securities** (REITs, REIT ETFs) — does NOT capture direct private CRE deals, which is where most Israeli institutional action happens

**Actionability:** Medium. Good for tracking Israeli institutional exposure to US public REITs; limited for direct private CRE.

***

### SEC EDGAR — Form ADV (Investment Adviser Registration)

**URL:** [adviserinfo.sec.gov](https://adviserinfo.sec.gov)
**Cost:** Free
**What it provides:** All SEC-registered investment advisers must file Form ADV disclosing AUM, client types, investment strategies, and principal office location. As of 2025, the SEC has approved registrations for several Israeli-based investment adviser firms.[^21][^22][^23]

**How to use it:**
- Search adviserinfo.sec.gov → "Organization/Firm" → filter "Place of Business" = Israel, or search known manager names
- Form ADV Part 2 brochures describe investment strategies (e.g., "US real estate," "commercial property")
- Monitor for newly registered Israeli RIAs that describe CRE focus

**Actionability:** Medium. Identifies Israeli fund managers operating in the US advisory space; ADV Part 2 often reveals CRE strategy and AUM.

***

### SEC EDGAR — Form PF (Private Fund Reporting)

**URL:** [sec.gov/search-filings](https://www.sec.gov/search-filings)
**Cost:** Free (filing search); some aggregate data at sec.gov/info/investment/pfd.shtml
**What it provides:** Large hedge funds and private fund advisers file Form PF with the SEC quarterly/annually. Israeli managers running US private real estate funds above threshold must file.[^24]

**Limitation:** Individual Form PF data is **confidential** and not public. Only aggregate statistics are released by the SEC. This source has limited direct utility for identifying specific Israeli positions.

**Actionability:** Low. Use primarily to verify that a specific Israeli RIA is active in US private funds via IAPD cross-reference.

***

### BEA — BE-13 Survey (New Foreign Direct Investment)

**URL:** [bea.gov/surveys/be13](https://www.bea.gov/surveys/be13)
**Cost:** Free to access results; filing is mandatory for foreign investors
**What it provides:** Mandatory survey filed by foreign companies that establish or acquire a US business (including real estate entities) with >$3M in assets. BEA publishes aggregate results by country and industry annually.[^25]

**How to use it:**
- Download annual tables at bea.gov → "International" → "Direct Investment" → "New Foreign Investment" → filter by Israel and Real Estate
- Limitation: Published with ~18 month lag; individual filer data is confidential

**Actionability:** Medium. Confirms when Israeli entities are creating new US real estate affiliates; sector-level, not deal-level.

***

### CFIUS Annual Report to Congress

**URL:** [home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius](https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius)
**Cost:** Free
**What it provides:** Annual report with anonymized statistics on filings by country of acquirer and by sector (including real estate). The 2024 Annual Report was released August 2025.[^26][^27][^28][^29]

**Important caveat:** There is **no mandatory CFIUS filing requirement** for most real estate transactions. Parties may voluntarily notify CFIUS for a "safe harbor" letter. Israeli investors are not on the "excepted real estate investor" country list, meaning their CRE transactions near military installations could trigger review — but most standard CRE deals are never reported to CFIUS.[^30]

**Actionability:** Low-Medium. Confirms country-level CRE filing trends, but Israel is rarely the headline country; useful for geopolitical risk context.

***

### USDA AFIDA — Agricultural Foreign Investment Disclosure Act Reports

**URL:** [fsa.usda.gov](https://www.fsa.usda.gov/programs-and-services/farm-loan-programs/foreign-investment/index) and new portal [afida.landmark.usda.gov](https://afida.landmark.usda.gov)
**Cost:** Free
**What it provides:** Annual reports on foreign ownership of US agricultural land by country, filed under the Agricultural Foreign Investment Disclosure Act (AFIDA). As of December 31, 2023, foreign persons held ~45 million acres. Country-level breakdowns are published in FSA annual reports.[^31][^32][^33][^34]

**Relevance to Israeli CRE:** Israeli agricultural land holdings in the US are minimal. However, the new USDA portal launched January 2026 creates a more searchable database. Relevant only if tracking Israeli investment in farmland, timber, or energy-related land deals (e.g., the Migdal/Mammoth Solar project covers 13,000 acres in Indiana).[^1][^31]

**Actionability:** Low for standard CRE; Medium for Israeli renewable energy/land deals.

***

## Layer 3: Israeli Capital Markets Disclosures (The Underused Layer)

This is arguably the highest-signal free layer for tracking CRE deals, because Israeli institutional investors are required by the Israel Securities Authority (ISA) to disclose US real estate investments in their public filings.

### ISA MAGNA System — Israeli Public Company Filings

**URL:** [magna.isa.gov.il](https://magna.isa.gov.il)
**Cost:** Free (Hebrew-language primary; English available for dual-listed companies)
**What it provides:** The MAGNA Electronic Public Disclosure System is Israel's equivalent of EDGAR. All Israeli public companies (TASE-listed and ISA-regulated) must file periodic reports, immediate reports, and annual reports via MAGNA. This includes the Big Five insurers (Harel, Migdal, Phoenix, Clal, Menora Mivtachim) and real estate conglomerates (Gazit-Globe, Azrieli, Alony-Hetz).[^35][^36]

**How to use it for CRE tracking:**
- Navigate to magna.isa.gov.il → search by company name (Hebrew or English ticker)
- Filter for **Periodic Reports (דוח תקופתי)** and **Immediate Reports (דיווח מיידי)** — the latter trigger within days of a US property acquisition
- Search annual reports for the sections titled "International Real Estate Portfolio" or "Foreign Investments"
- Key companies to monitor:
  - **Migdal Insurance** (מגדל) — US multifamily JVs (Charlotte, Atlanta, Dallas)[^1]
  - **Harel Insurance** (הראל) — US residential and wind energy investments[^3]
  - **Phoenix Financial** (פניקס) — annual report English version available[^37]
  - **Clal Insurance** — US CRE exposure via fund managers
  - **Menora Mivtachim** — growing US industrial exposure

**Critical advantage:** MAGNA filings often disclose a specific US deal **within days** of signing — far ahead of any US regulatory disclosure. The Migdal/BentallGreenOak Charlotte multifamily JV, for example, was disclosed in MAGNA before appearing in US property records.[^1]

**Actionability:** **Very High** — the single best free real-time signal for Israeli institutional CRE deals in the US.

***

### Israeli Pension Company English-Language Investor Relations Pages

Israeli insurers maintain English IR pages with downloadable annual reports and quarterly financials. These English reports contain international portfolio sections with US real estate holdings:

| Company | English IR URL | Coverage |
|---|---|---|
| Migdal Holdings | migdalholdings.co.il/en/financial-reports/ | Annual + quarterly, US portfolio detail[^38] |
| Phoenix Financial | digital-content.fnx.co.il (2024 Annual Report) | Full English annual[^37] |
| Harel Group | pr.harel-group.co.il (2024 Annual Report) | Full English annual[^39] |

**How to use it:** Download the most recent annual report → search for "United States," "US real estate," "North America" → extract property list, JV partners, invested capital, and fair value. All three contain audited fair-value disclosures of their US real estate portfolios.

**Actionability:** High. Free, audited, English-language, annually updated portfolio snapshots.

***

### Tel Aviv Stock Exchange (TASE) — Company Disclosures and Indices

**URL:** [tase.co.il](https://www.tase.co.il/en) and [ir.tase.co.il/en](https://ir.tase.co.il/en)
**Cost:** Free
**What it provides:** Real-time and historical filings for all TASE-listed companies. The new **TA-Real Estate 35 Index**, launched November 2025, tracks Israel's 35 largest real estate companies. TASE's 87 listed real estate companies represent the most concentrated source of Israeli institutional CRE capital.[^40][^41][^42]

**Key TASE real estate companies with US exposure:**
- Gazit-Globe (GLOB) — US retail assets
- Azrieli Group (AZRG) — US real estate JVs
- Alony-Hetz (ALHE) — owns stake in Carr Properties (US mixed-use/office)[^1]
- Elbit Imaging/Real Estate (EMITF/ELRL) — historical US CRE

**How to use it:** For English-language data feeds from TASE, use third-party APIs:
- **EODHD** (eodhd.com) — free tier includes TASE historical data and company fundamentals[^43]
- **Twelve Data** (twelvedata.com) — TASE coverage with free API tier[^44]
- **TradingView** — free TASE company financials and filings viewer[^45]

**Actionability:** High for identifying which Israeli RE companies are growing US exposure year-over-year; real-time TASE filings feed complements MAGNA.

***

### Israeli Bond Issuances on TASE — US Real Estate Companies Raising in Israel

**URL:** [tase.co.il/en/market-data/bonds](https://www.tase.co.il/en/market-data/bonds) + EDGAR 20-F/424B5 filings
**Cost:** Free
**What it provides:** Over 36 US real estate companies have raised more than $7 billion through Israeli bond markets, with 68% in the residential sector. US companies issuing bonds on TASE must file prospectuses with ISA (via MAGNA) and often file corresponding documents on EDGAR as well.[^46][^47][^48]

**The reverse signal:** When a US CRE company raises bonds in Israel, it signals that Israeli institutional capital (pensions, insurance companies) is the primary buyer. This creates a trackable link between Israeli capital and specific US properties.

**How to use it:**
- EDGAR Full Text Search: search `"Tel Aviv Stock Exchange" "real estate"` in prospectus (424B-series) filings
- MAGNA: search for US company names in prospectus filings (available in English for dual-listed issuers)
- WSJ reported ~30 US real estate companies had raised $5.5B+ in Israeli bond market as of 2021[^48]

**Actionability:** High. This reverse-flow tracking is highly underused and reveals which US CRE portfolios are effectively Israeli-capital-backed.

***

## Layer 4: Property-Level Transaction Data (Freemium)

These tools don't natively tag "Israeli" as a buyer nationality but can be used in conjunction with the entities identified in Layers 2 and 3.

### SEC EDGAR — Full Text Search (EFTS)

**URL:** [efts.sec.gov/LATEST/search-index](https://efts.sec.gov/LATEST/search-index)
**Cost:** Free
**What it provides:** Full-text search of all EDGAR filings since 2001. Useful for finding any SEC filing that mentions specific Israeli investors, Israeli company names, or Israeli-linked US property addresses.[^49][^17]

**Search strategies:**
- `"Migdal" "commercial real estate" "United States"` in all forms
- `"Israel" "industrial" "acquisition"` in 8-K and 20-F forms
- `"BentallGreenOak" OR "White Oak Partners" "Israel"` — names of known Israeli JV partners in the US

**Actionability:** High. One of the most powerful free tools when you know what entity names to search.

***

### LoopNet (CoStar) — Free Tier

**URL:** [loopnet.com](https://www.loopnet.com)
**Cost:** Free tier (basic listings); premium CoStar required for full comp data
**What it provides:** Free access to commercial listings, basic sale comparables, and some ownership information.[^50][^51]

**Limitation for Israeli tracking:** Does not tag buyers by nationality. To use effectively, you must already know the entity name (from MAGNA or EDGAR) and search the buyer/owner field.

**Actionability:** Medium. Secondary verification tool once you have entity names.

***

### Crexi — Free Tier

**URL:** [crexi.com](https://www.crexi.com)
**Cost:** Free tier (basic search); Crexi Intelligence is paid
**What it provides:** CRE listings, deal flow, and limited comp data. Free tier allows property searches and basic market stats.[^52]

**Actionability:** Low-Medium. Same limitation as LoopNet — no foreign buyer nationality tagging.

***

### County Assessor / Recorder Public Records (Free)

**URL:** Varies by county (e.g., NYC: [acris.nyc.gov](https://acris.nyc.gov); Cook County: [cookcountyassessor.com](https://www.cookcountyassessor.com))
**Cost:** Free
**What it provides:** Deed transfers, ownership history, and grantee/grantor names recorded at closing. This is the ground-truth data layer for tracking specific Israeli entities purchasing US CRE.

**How to use it:**
- Once you identify an entity name from MAGNA (e.g., "Migdal RE Holdings LLC" or a specific SPV name mentioned in an Israeli IR filing), search the relevant county recorder
- Cross-reference against national aggregators like ATTOM Data (has a free trial and academic API)[^53][^54]
- PropertyShark offers deep ownership records at ~$99/month — freemium with limited free lookups[^55]

**Actionability:** Very High for specific entity verification; requires entity names from upstream sources (MAGNA/EDGAR).

***

### ProPublica Nonprofit Explorer — Form 990 Data

**URL:** [projects.propublica.org/nonprofits](https://projects.propublica.org/nonprofits)
**Cost:** Free
**What it provides:** All IRS Form 990 filings by US nonprofits, digitized and searchable. Relevant when Israeli foundations or quasi-governmental entities own US real estate through nonprofit structures (endowments, sovereign wealth arms).[^56][^57]

**Actionability:** Low-Niche. Useful for edge cases involving Israeli university endowments or foundations with US real estate holdings.

***

## Layer 5: Intelligence & News Feeds (Free, High Signal-to-Noise)

### Globes English — Israeli Business News

**URL:** [en.globes.co.il](https://en.globes.co.il)
**Cost:** Free (most articles; some premium)
**What it provides:** Israel's leading business daily, with an English edition covering Israeli institutional capital flows, TASE company news, pension fund activity, and real estate deal announcements. Globes often breaks Israeli CRE deals in the US days before they appear in US press.[^58][^59]

**How to use it:**
- RSS feed available: en.globes.co.il/en/news/rss.aspx
- Search: `site:en.globes.co.il "United States" "real estate"` in Google
- Archive search for historical deal coverage

**Actionability:** **Very High** — the best English-language early-warning feed for Israeli CRE deals.

***

### JLL Global Investment Report (Annual, Free PDF)

**URL:** [jll.com/en-us/insights](https://www.jll.com/en-us/insights)
**Cost:** Free (registration required)
**What it provides:** JLL's annual Global Capital Flows report ranks countries by CRE investment volume. Israel ranked 10th in the US and 7th in Europe for 2024, with a detailed sector breakdown ($400M industrial, $169M office, $10M retail).[^2][^5]

**How to use it:**
- Register at jll.com for free report downloads
- Use annual reports for trend benchmarking and sector allocation shifts
- JLL's quarterly US market dynamics reports track industrial and office transaction volumes that can be cross-referenced against Israeli deal flow[^60]

**Actionability:** High for macro benchmarking; does not identify specific deals or investors.

***

### MSCI Real Capital Analytics (RCA) — Academic/Limited Free Access

**URL:** [msci.com/real-capital-analytics](https://www.msci.com/data-and-analytics/real-estate/real-capital-analytics)
**Cost:** Paid (commercial); **Free for academic researchers** via Institute for Private Capital agreement (applications accepted twice yearly)[^61][^62]
**What it provides:** The gold standard for CRE transaction tracking — $40+ trillion in global CRE transactions linked to 200,000+ investor profiles. Can filter by investor country of origin (Israel) and by property sector and geography.[^61]

**Free tier limitation:** The direct-access free tier does not exist for commercial users. The academic research pipeline (IPC/AREUEA) requires institutional affiliation. As a practitioner, the primary path is via brokerage platforms (CBRE, JLL, Cushman & Wakefield) that license RCA for client use.

**Actionability:** Very High (if accessible); the definitive source for Israeli deal-level CRE transaction data.

***

### NAR International Transactions Report (Annual, Free)

**URL:** [nar.realtor/research-and-statistics/research-reports/international-transactions-in-u-s-residential-real-estate](https://www.nar.realtor/research-and-statistics/research-reports/international-transactions-in-u-s-residential-real-estate)
**Cost:** Free (PDF download, registration required)
**What it provides:** Annual survey of foreign buyer activity in US residential real estate by country. The 2025 report covers April 2024 – March 2025. Note: primarily covers **residential**, not CRE.[^63][^64]

**Limitation for Israeli CRE:** Israel is not typically in the top-5 residential foreign buyer countries (China, Canada, Mexico, India, UK dominate). This source provides minimal signal for institutional CRE capital.[^65]

**Actionability:** Low for CRE; useful only to contrast residential vs. institutional patterns.

***

### FinCEN Geographic Targeting Orders (GTOs)

**URL:** [fincen.gov](https://www.fincen.gov/news/news-releases/fincen-renews-residential-real-estate-geographic-targeting-orders)
**Cost:** Free (public notices only; underlying SAR/CTR data is not public)
**What it provides:** GTOs require US title insurance companies to identify beneficial owners behind shell companies in non-financed real estate purchases above thresholds in designated MSAs. The GTO program was renewed April 2025 through October 2025.[^66][^67][^68]

**Limitation:** The actual Currency Transaction Reports (CTRs) filed under GTOs are **confidential law enforcement data** and not publicly accessible. The public value is understanding which MSAs are under enhanced scrutiny and that Israeli capital flowing through shell structures in those markets would be captured — but not released publicly.[^69]

**Actionability:** Low (public intelligence); High (if you have law enforcement or compliance access).

***

## Layer 6: Cross-Reference Workflow for Deal Intelligence

The most effective free research methodology chains these sources together:

```
Step 1: MAGNA (isa.gov.il) — Monitor Israeli insurer/RE company immediate reports (מיידי)
         → Extract: deal name, US property address, SPV entity name, JV partner name
         ↓
Step 2: SEC EDGAR Full Text Search (efts.sec.gov) — Search entity/SPV name
         → Extract: any 8-K, 20-F, or proxy mention; cross-check US partner filings
         ↓
Step 3: County Recorder / ACRIS — Search grantee name (SPV entity from Step 1)
         → Extract: deed transfer, exact address, price (if recorded), closing date
         ↓
Step 4: Globes English + TASE company page — Verify deal narrative and structure
         → Extract: equity split, loan source, Israeli bond backing, exit strategy
         ↓
Step 5: BEA FDIUS / OECD FDI — Update macro tally for portfolio benchmarking
```

***

## Data Source Master Reference Table

| Source | Layer | Cost | Data Type | Israeli CRE Specificity | Lag | URL |
|---|---|---|---|---|---|---|
| BEA FDIUS/BE-12 | Macro FDI | Free | Aggregate FDI by country+industry | Medium — RE sector broken out | 18-24 mo | bea.gov/international/di1fdiop |
| IMF DIP (CDIS) | Macro FDI | Free | Bilateral FDI positions | Low — no sector split | 12-18 mo | data.imf.org |
| UNCTAD FDI Stats | Macro FDI | Free | Bilateral FDI flows/stocks | Low — aggregate only | 12 mo | unctadstat.unctad.org |
| OECD FDI Database | Macro FDI | Free | FDI by country + industry | Medium-High — RE sector available | 12 mo | oecd.org/fdi-flows |
| SEC EDGAR 20-F | US Reg. Filing | Free | Israeli company US asset disclosures | Very High | 45-90 days | efts.sec.gov |
| SEC EDGAR 13F | US Reg. Filing | Free | Israeli manager REIT equity holdings | Medium — public REITs only | 45 days | efts.sec.gov |
| SEC EDGAR ADV | US Reg. Filing | Free | Israeli RIA registration, strategy | Medium | Near real-time | adviserinfo.sec.gov |
| CFIUS Annual Report | US Reg. Filing | Free | Aggregate foreign RE transactions | Low — anonymized, voluntary | 12 mo | treasury.gov |
| USDA AFIDA | US Reg. Filing | Free | Foreign agricultural land by country | Low — farmland only | Annual | afida.landmark.usda.gov |
| ISA MAGNA | Israeli Disclosure | Free | Israeli company full filings (Hebrew+English) | **Very High** | 1-3 days | magna.isa.gov.il |
| Israeli Insurer IRs | Israeli Disclosure | Free | English annual reports, US portfolio | High | Quarterly/Annual | (See table above) |
| TASE + EODHD/TwelveData | Israeli Disclosure | Free tier | TASE company data + financials | High | Near real-time | tase.co.il / eodhd.com |
| Israeli Bond Prospectuses | Israeli Disclosure | Free | US RE companies raising on TASE | High (reverse signal) | Deal-time | MAGNA + EDGAR |
| EDGAR Full Text Search | Cross-Reference | Free | Keyword search across all US filings | Very High (entity-specific) | Near real-time | efts.sec.gov |
| County Recorder/ACRIS | Property-Level | Free | Deed transfers, SPV grantees | Very High (entity-specific) | 1-30 days | Varies by county |
| Globes English | News/Intel | Free | Israeli deal news + IR coverage | Very High | Real-time | en.globes.co.il |
| JLL Global Cap Flows | News/Intel | Free (reg.) | Annual Israeli CRE investment rankings | High — sector breakdown | Annual | jll.com |
| MSCI/RCA | Transaction Data | Academic only | Deal-level CRE transactions by investor | Very High | Near real-time | msci.com/rca |
| NAR Intl Transactions | Transaction Data | Free (reg.) | Residential foreign buyer by country | Low — residential only | Annual | nar.realtor |
| FinCEN GTOs | AML/Compliance | Free (notices only) | Shell company beneficial ownership | Indirect | 6 months | fincen.gov |
| ProPublica 990 Explorer | Nonprofit | Free | Israeli foundation US RE holdings | Niche | 12-18 mo | projects.propublica.org |
| BEA BE-13 Survey | US Reg. Filing | Free | New foreign affiliates in US RE | Medium | 18-24 mo | bea.gov/surveys/be13 |
| Crexi (free tier) | Property-Level | Freemium | CRE listings, basic comps | Low (no nationality tag) | Real-time | crexi.com |
| LoopNet (free tier) | Property-Level | Freemium | CRE listings, basic comps | Low (no nationality tag) | Real-time | loopnet.com |
| ATTOM Data | Property-Level | Freemium | Property records, transactions | Low-Medium (entity search) | 30 days | attomdata.com |

***

## Coverage Gaps and Known Limitations

**What no free source captures directly:**
1. **Private fund deal-level data** — When Israeli pension funds invest through US private equity real estate funds (e.g., Blackstone, Starwood), the Israeli capital is invisible in all public sources. The Israeli pension's MAGNA filing may disclose "investment in Blackstone Real Estate Fund X," but the underlying US properties are not listed.
2. **Sub-threshold transactions** — Deals below BEA's $3M filing threshold (BE-13) and below SEC's $100M AUM threshold (13F) are not captured.
3. **US LLC beneficial ownership** — The US lacks a fully public beneficial ownership registry. FinCEN's Beneficial Ownership Information (BOI) database under the Corporate Transparency Act (CTA) is not currently accessible to the public (law enforcement only as of 2025-2026).
4. **Real-time MSCI/RCA deal data** — The most granular transaction database for Israeli CRE buyers in the US is MSCI RCA, which has no commercial free tier.
5. **CFIUS real estate filings** — Most Israeli CRE transactions are never voluntarily filed with CFIUS; the annual report data covers a small fraction of actual deal flow.

***

## Recommended Priority Stack for Practitioners

For a commercial real estate professional tracking Israeli institutional capital specifically:

1. **Set up MAGNA alerts** for the Big Five Israeli insurers and top TASE real estate companies → best real-time signal
2. **Monitor Globes English RSS** daily → fastest English-language deal news
3. **EDGAR Full Text Search** — set saved searches for Israeli entity names identified via MAGNA
4. **Download annual English IR reports** from Migdal, Phoenix, and Harel → audited US portfolio snapshots
5. **BEA FDIUS + OECD FDI** — quarterly/annual macro benchmarks for total Israeli RE capital flow
6. **County recorder lookups** (ACRIS for NY; county-specific for other markets) → verify specific entity deals
7. **JLL/CBRE free research** → annual Israeli ranking and sector allocation context
8. **TASE via EODHD free API** → track TA-Real Estate 35 index constituents with US exposure

---

## References

1. [Israeli Investors Driving U.S. Real Estate Growth](https://brazoban.com/israeli-investors-driving-u-s-real-estate-growth/) - Nationally, Israeli investors bought 89 properties in 2022 worth nearly $1.5 billion, placing them a...

2. [Israel joins top ranks of global real estate investors, says JLL report](https://www.jpost.com/business-and-innovation/real-estate/article-848636) - Israel has emerged as a key player in global commercial real estate, ranking seventh in Europe and 1...

3. [Harel Insurance Investments and Financial Services Ltd](https://investigate.afsc.org/company/harel-insurance-inv) - Harel facilitates the expansion of Israel's illegal settlement enterprise in the occupied West Bank ...

4. [Israeli Insurance Market Size, Share - Industry Report 2035](https://www.businessresearchinsights.com/market-reports/israeli-insurance-market-121028) - Harel is a market leader in health insurance, even as Clal and Migdal have strong positions in life ...

5. [Israel Among Top 10 Global Real Estate Investors in Europe, US](https://www.rprealtyplus.com/international/israel-among-top-10-global-real-estate-investors-in-europe-us-119424.html) - According to the 2024 Global Investment Report by Jones Lang LaSalle (JLL), Israel now ranks 7th in ...

6. [BE-12 Benchmark Survey: Foreign Direct Investment in the United ...](https://www.bea.gov/surveys/be12) - The BE-12 is our most comprehensive survey on financial and operating data of US affiliates of forei...

7. [Foreign Direct Investment in the United States (FDIUS)](https://www.bea.gov/international/di1fdiop) - Detailed establishment data for U.S. affiliates of foreign parents obtained from a project that link...

8. [Interactive Data Application | U.S. Bureau of Economic Analysis (BEA)](https://www.bea.gov/itable) - BEA's interactive data application is the one stop shop for accessing BEA data on the fly. The inter...

9. [DIP - IMF Data - International Monetary Fund](https://data.imf.org/en/datasets/IMF.STA:DIP) - The Direct Investment Positions by Counterpart Economy dataset is based on information collected thr...

10. [IMF/CDIS | DBnomics](https://db.nomics.world/IMF/CDIS) - [CDIS] Coordinated Direct Investment Survey (CDIS) ; [A.A2.IIWDA_​BP6_​USD.A2] · 2009=30,365.647 · 2...

11. [Coordinated Direct Investment Survey (CDIS) - World Bank Open Data](https://data360.worldbank.org/en/dataset/IMF_CDIS) - Coordinated Direct Investment Survey (CDIS). 20 Indicators | 2009 - 2023 |216 Economies (Updated: ab...

12. [UNCTAD: FDI Statistics by Country - globalEDGE](https://globaledge.msu.edu/global-resources/resource/2521) - Quick electronic access to comprehensive statistics on foreign direct investment (FDI) flows and sto...

13. [Investment statistics and trends - UNCTAD](https://unctad.org/topic/investment/investment-statistics-and-trends) - UNCTAD addresses countries' data needs through its analysis and dissemination of foreign direct inve...

14. [FDI flows - OECD](https://www.oecd.org/en/data/indicators/fdi-flows.html) - Foreign direct investment (FDI) flows is the value of cross-border transactions related to direct in...

15. [Measuring foreign direct investment - OECD](https://www.oecd.org/en/topics/foreign-direct-investment-fdi.html) - FDI statistics disaggregated by partner economy and by industry for 2022 are available in the online...

16. [eslt-20241231 - SEC.gov](https://www.sec.gov/Archives/edgar/data/1027664/000162828025013971/eslt-20241231.htm) - The consolidated financial statements of Elbit Systems Ltd. (Elbit Systems) included in this annual ...

17. [Search Filings - SEC.gov](https://www.sec.gov/search-filings) - Full Text Search ... Find keywords and phrases in more than 20 years of EDGAR filings, and filter by...

18. [FORM 20-F - SEC.gov](https://www.sec.gov/Archives/edgar/data/1379009/000119312513164739/d521614d20f.htm) - Commission file number: 001-35378. GAZIT-GLOBE LTD. (Exact name of registrant as specified in its ch...

19. [Institutional Holdings: Analyze Hedge Fund Portfolios with Python](https://edgartools.readthedocs.io/en/stable/13f-filings/) - Analyze SEC 13F institutional holdings filings with Python. Track hedge fund portfolios, compare qua...

20. [Form 13F -—Reports Filed by Institutional Investment Managers](https://www.investor.gov/introduction-investing/investing-basics/glossary/form-13f-reports-filed-institutional-investment) - The Form 13F report requires disclosure of the name of the institutional investment manager that fil...

21. [What Is the IAPD and How Can It Help You Find the Right Financial ...](https://wealthtender.com/insights/investing/iapd-sec-advisor-search/) - The IAPD is the SEC's free database to check any financial advisor's Form ADV, disciplinary history,...

22. [New Development: SEC Approves Registrations of Israel-Based ...](https://www.ria-compliance-consultants.com/2025/09/sec-registration-israel-investment-adviser/) - The U.S. Securities and Exchange Commission (SEC) recently approved the registration of several inve...

23. [Investment Adviser Public Disclosure (IAPD) - Investor.gov](https://www.investor.gov/introduction-investing/investing-basics/glossary/investment-adviser-public-disclosure-iapd) - Search for an investment adviser firm or individual representative. View the adviser's current Form ...

24. [Concerning Private Fund Advisers Registering as Investment ...](https://www.ria-compliance-consultants.com/frequently_asked_questions/faqs_private_fund_investment_adviser_registration_sec/) - Investment advisers must file a Form PF if registered or required to register with the SEC as an inv...

25. [BEA's Foreign Direct Investment Reporting Requirements: A Primer](https://www.thompsonhine.com/insights/beas-foreign-direct-investment-reporting-requirements-a-primer/) - To gather the data necessary to compile and report certain business statistics on a macro-industry/e...

26. [Treasury Releases 2024 CFIUS Annual Report - Torres Trade Law](https://www.torrestradelaw.com/posts/Treasury-Releases-2024-CFIUS-Annual-Report/416) - The report offers valuable insight into the CFIUS review process and highlights the various foreign ...

27. [CFIUS Annual Report Shows Oversight and Monitoring Remain ...](https://www.jdsupra.com/legalnews/cfius-annual-report-shows-oversight-and-3471206/) - The report includes anonymized statistics and summaries of the 2024 calendar year CFIUS caseload. Wh...

28. [CFIUS Report: Foreign Investment Reviews up from Prior Years](https://phillipslytle.com/2022-cfius-report-to-congress-foreign-investment-reviews-up-from-previous-years/) - This 83-page document includes a summary of CFIUS actions for the prior year, broken down by type of...

29. [CFIUS Releases 2024 Annual Report - Hunton Andrews Kurth LLP](https://www.hunton.com/insights/legal/cfius-releases-2024-annual-report) - The Report provides the fourth full year of public data since the implementation of the 2020 rule ch...

30. [[PDF] The Committee on Foreign Investment in the United States (CFIUS)](https://www.trade.gov/sites/default/files/2025-03/Chapter%207%20-%20CFIUS%202025.pdf) - The CFIUS statute and regulations provide clarity to the business and investment communities with re...

31. [USDA Launches New Online Portal for Reporting Foreign-Owned ...](https://www.usda.gov/about-usda/news/press-releases/2026/01/22/usda-launches-new-online-portal-reporting-foreign-owned-agricultural-land-transactions) - The report lists foreign holdings of U.S. agricultural land as 46 million acres, as of December 31, ...

32. [[PDF] Foreign Holdings of U.S. Agricultural Land - Farm Service Agency](https://www.fsa.usda.gov/sites/default/files/2024-12/AFIDAYR2023ReportwithPageNumbers.pdf) - Foreign persons held an interest in nearly 45 million acres of U.S. agricultural land as of December...

33. [Foreign-held farmland in the United States and Iowa: scale, use, and ...](https://www.extension.iastate.edu/agdm/articles/chandio/ChaJul25.html) - As of the end of 2023, foreign individuals and entities reported holding an interest in nearly 45 mi...

34. [Displaying the Data: Online AFIDA Database To Be Established](https://nationalaglawcenter.org/displaying-the-data-online-afida-database-to-be-established/) - AFIDA established a nationwide system for collecting certain information about foreign ownership and...

35. [Pilot Program with the Israel Securities Authority - 2nd Call for ...](https://innovationisrael.org.il/en/calls_for_proposal/pilot-program-with-the-israel-securities-authority-2nd-call-for-proposals/) - Assistance will include access to public MAGNA (Electronic Public Disclosure System) reports' databa...

36. [[PDF] Overview of Corporate and Securities Law and M&A in Israel](https://www.goldfarb.com/pdf1/GS-%20Firm%20Overview%20-%20May%202018_3.pdf) - Pending proposal to permit English. ✓ Filings made electronically via MAGNA systems. ✓ ISA staff car...

37. [[PDF] Phoenix Financial Ltd. - Annual Report for 2024](https://digital-content.fnx.co.il/sites/docs/genery/for_new_site/investor-relations-eng/Financial-Reports/fnx-annual-report-2024.pdf) - The total public assets reached a record high of over NIS 6 trillion, with growth observed in asset ...

38. [Financial Reports - Migdal](https://www.migdalholdings.co.il/en/financial-reports/) - Financial Results Q1/2025 · Migdal Insurance and Financial Holdings Ltd. - Consolidated Financial St...

39. [[PDF] Periodic Report for 2024 - Harel Investor Relations](https://pr.harel-group.co.il/ExternalMedia/lggf25lw/harel-2024-en-final.pdf) - Harel Insurance Investments and Financial Services Ltd. Periodic Report for 2024. Chapter 1. Descrip...

40. [TASE Launches a New Index for Israel's Major Real Estate Companies](https://finance.yahoo.com/news/tase-launches-index-israels-major-120000684.html) - Since the beginning of 2025, the TA-Real Estate index increased by 36%. The new index will be launch...

41. [Tel Aviv Stock Exchange - Wikipedia](https://en.wikipedia.org/wiki/Tel_Aviv_Stock_Exchange) - The companies listed on TASE ; Real estate and construction, 87, 155 ; Industry, 60, 74 ; Investment...

42. [TASE Launches a New Index for Israel's Major Real Estate Companies](https://www.prnewswire.com/il/news-releases/tase-launches-a-new-index-for-israels-major-real-estate-companies---ta-real-estate-35-302598320.html) - Since the beginning of 2025, the TA-Real Estate index increased by 36%. The new index will be launch...

43. [Tel Aviv Stock Exchange (TASE TA) stock market data APIs - EODHD](https://eodhd.com/financial-summary/TASE.TA) - Get TASE.TA (Tel Aviv Stock Exchange).Stock market data historical prices and Fundamental Data APIs ...

44. [Tel Aviv Stock Exchange Ltd. (TASE) - Overview - Twelve Data](https://twelvedata.com/markets/684453/stock/tase/tase) - Comprehensive market data for Tel Aviv Stock Exchange Ltd. (TASE). Explore various metrics, charts, ...

45. [Elbit Real Estate Ltd Financial Statements - ELRL - TradingView](https://www.tradingview.com/symbols/TASE-ELRL/financials-overview/) - Get an overview of Elbit Real Estate Ltd financials with all the important metrics. View ELRL market...

46. [Raising Unsecured Debt In Israel: A Competitive Financing ...](https://www.multifamily.loans/apartment-finance-blog/raising-unsecured-debt-in-israel-competitive-financing-alternative-for-us-multifamily-developers/) - The Israeli bonds assist the company in creating a leverage efficiency, issuing unsecured debt for c...

47. [U.S. counsel for New England Based Real Estate Investment ...](https://www.hinckleyallen.com/case-studies/u-s-counsel-for-new-england-based-real-estate-investment-company-in-114m-tel-aviv-stock-exchange-financing-deal/) - The client is the first Massachusetts Real Estate company to successfully issue debt on the Tel Aviv...

48. [Israeli Bond Proposal Threatens to Curb Borrowing by U.S. Real ...](https://www.wsj.com/finance/investing/israeli-bond-proposal-threatens-to-curb-borrowing-by-u-s-real-estate-firms-11616500828) - About 30 U.S. real-estate companies have raised more than 18 billion shekels, or $5.5 billion, in th...

49. [EDGAR Full Text Search - SEC.gov](https://www.sec.gov/edgar/search/) - The new EDGAR advanced search gives you access to the full text of electronic filings since 2001.

50. [LoopNet: #1 in Commercial Real Estate for Sale & Lease](https://www.loopnet.com) - Find commercial real estate for sale, lease & auction on the leading commercial real estate marketin...

51. [LoopNet Alternatives For CRE Brokers and Appraisers - CompStak](https://compstak.com/blog/loopnet-alternatives-cre-resources) - LoopNet is a popular online resource for commercial real estate data. It first came online in 1995 a...

52. [10 Top Commercial Real Estate Databases in 2025 [Free & Paid]](https://swordfish.ai/resources/real-estate/commercial-real-estate-database/) - PropertyShark: Provides thorough property data, including ownership records, maps, zoning, and marke...

53. [Property Data for Commercial Real Estate Platforms](https://www.attomdata.com/industries/real-estate/commercial-data-platforms/) - ATTOM has the most recent information crucial to commercial real estate investment decisions, such a...

54. [Property Data Analytics & AI-Powered Intelligence: API, Bulk, Cloud](https://www.attomdata.com) - Unlock trusted property data and analytics with AI-powered insights. Flexible delivery options inclu...

55. [PropertyShark Reviews 2026: Details, Pricing, & Features - G2](https://www.g2.com/products/propertyshark/reviews) - You can find comprehensive property details: ✓ Ownership and contact details, including real owners ...

56. [Friends Of Israel Story - Nonprofit Explorer - ProPublica](https://projects.propublica.org/nonprofits/organizations/842612770) - Designated as a 501(c)(3) Organizations for any of the following purposes: religious, educational, c...

57. [Charles B Israel Foundation - Full Filing - Nonprofit Explorer](https://projects.propublica.org/nonprofits/organizations/841390151/201541319349102069/full) - Tax returns filed by nonprofit organizations are public records. The Internal Revenue Service releas...

58. [News - Globes English - גלובס](https://en.globes.co.il/en/news/default.aspx?fid=1725) - Real estate companies report dwindling profits. The financial reports of Israeli residential develop...

59. [Globes - Israel Business News](https://en.globes.co.il) - Real estate companies report dwindling profits. ToHa towers Tel Aviv credit: Tali Bogdanovsky. Const...

60. [U.S. Office Market Dynamics, Q1 2026 - JLL](https://www.jll.com/en-us/insights/market-dynamics/us-office) - Single-asset sales volume reached $11.5 billion in Q1, the highest Q1 total since 2020, growing 40% ...

61. [RCA data is again available to academic researchers!](https://areuea.memberclicks.net/index.php?option=com_dailyplanetblog&view=entry&category=other-conference-notices&id=235%3Arca-data-is-again-available-to-academic-researchers-) - RCA is a data and analytics solution for global commercial real estate investing and transactions, w...

62. [Real Capital Analytics - MSCI](https://www.msci.com/data-and-analytics/real-estate/real-capital-analytics) - Transparent, proprietary intelligence across global private real estate markets connecting investors...

63. [International Buyers Purchased $56 Billion Worth of U.S. Homes ...](https://www.nar.realtor/newsroom/international-buyers-purchased-56-billion-worth-of-u-s-homes-from-april-24-to-march-25) - Foreign buyers purchased $56 billion worth of US existing homes from April 2024 through March 2025, ...

64. [International Transactions in U.S. Residential Real Estate](https://www.nar.realtor/research-and-statistics/research-reports/international-transactions-in-u-s-residential-real-estate) - The report highlights foreign client purchases and sales of U.S. residential property, and looks at ...

65. [NAR Report 2025: Trends and Insights on Foreign Buyers in U.S. ...](https://www.getwaltz.com/blog-posts/nar-report-foreign-buyers) - The number of foreign buyers grew to 78,100 between April 2024 and March 2025, making up nearly 2% o...

66. [FinCEN reissues real estate Geographic Targeting Orders - Abrigo](https://www.abrigo.com/blog/fincen-reissues-real-estate-geographic-targeting-orders/) - FinCEN reissued Geographic Targeting Orders to include two new regions in Colorado and Connecticut. ...

67. [Geographic Targeting Order: Understanding FinCEN's GTOs - Alessa](https://alessa.com/blog/geographic-targeting-orders/) - An overview of what financial institutions need to know about FinCEN's real estate Geographic Target...

68. [FinCEN Renews Residential Real Estate Geographic Targeting ...](https://www.fincen.gov/news/news-releases/fincen-renews-residential-real-estate-geographic-targeting-orders) - The terms of the GTOs are effective beginning April 15, 2025, and ending on October 9, 2025. The GTO...

69. [[PDF] FinCEN RRE GTO 10/9/2025](https://www.fincen.gov/system/files/2025-10/RRE-GTO-Order.pdf) - GEOGRAPHIC TARGETING ORDER. The Director of the Financial Crimes Enforcement Network (FinCEN) hereby...

