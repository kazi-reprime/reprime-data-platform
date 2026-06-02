# Global Institutional Capital Flows Into US CRE: Free & Freemium Data Source Map (2024–2026)

**Terminal Context:** Tier 5 — Global LP Benchmarking & Co-Investment Radar  
**Target User:** Tel Aviv family-office principal benchmarking what GIC, ADIA, CPP, Norway, CalPERS, and APG are doing in US CRE in the last 90 days  
**Coverage Period:** 2024–2026  
**Scope:** Free and freemium (usable free tier) only — excludes Israeli-capital tab

***

## Executive Summary

Roughly 30 data sources provide **actionable, free or freemium intelligence** on global institutional capital flows into US commercial real estate. The highest-fidelity primary data comes from (a) US government macro plumbing — TIC, BEA FDI, CFIUS, OFAC — which sets the regulatory and aggregate context; (b) sovereign wealth fund and pension annual reports and press releases, which disclose specific US CRE transactions with deal size and asset class; and (c) broker/aggregator free monthly reports from MSCI RCA and CBRE that quantify actual cross-border volume. The key intelligence gap is transaction-level data with LP attribution, which remains gated behind MSCI RCA Pro, Preqin Pro, and PitchBook Pro. The cheapest legitimate path to bridge that gap is detailed in the gap analysis section.

***

## Master Data Source Table

> **Column Key:** Free = no cost ever | Freemium = free tier exists with meaningful data | Paid = registration/subscription required with no meaningful free tier

### Tier 1 — US Government Macro Plumbing (Primary, Structured, Programmatic)

| Source Name | Exact URL / Endpoint | Free vs Freemium | Free-tier Rate Limit / Quota | Geographic / Entity Coverage | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **US Treasury TIC System — Monthly Press + Holdings** | `https://home.treasury.gov/data/treasury-international-capital-tic-system` — Major Foreign Holders direct link: `https://ticdata.treasury.gov/Publish/mfh.txt` | **Free** | Unlimited; no API key needed | 30+ country breakdown for Treasuries; aggregate cross-border securities flows by country[^1][^2] | Monthly (45-day lag); Annual surveys (end-June, released April/November)[^2] | TXT, XLS, PDF | None for bulk CSV; FRBNY login for Form SHL submitters[^3] | Foreign holdings of US Treasuries by country; cross-border long-term securities transactions (net buys/sells); short-term holdings; foreign private vs official split[^2][^4] | BEA IIP, UNCTAD FDI stats | Global Foreign Capital Heatmap tile | **Gotcha:** TIC does not break out CRE directly — it covers portfolio securities (equities, bonds), not direct real estate. Use as macro fund-flow proxy + country-level capital direction signal. New CSLT dataset launched May 2026[^5]. Annual SHL survey (foreign holdings of all US securities) released April 2026[^6]. |
| **TIC SHL Annual Survey — Foreign Portfolio Holdings of US Securities** | `https://home.treasury.gov/data/treasury-international-capital-tic-system/us-liabilities-to-foreigners-from-holdings-of-us-securi…` | **Free** | Unlimited download | Country × security type matrix (equity, LT debt, ABS, short-term)[^6][^3] | Annual (end-June survey; released April following year)[^2][^6] | PDF tables + XLS | None | Country-level foreign holdings of US equities, bonds, ABS; does NOT include direct RE | TIC monthly, BEA IIP | Foreign Institutional Capital Context tile | **Gotcha:** 5-year deep-dive benchmark survey (TIC SHL benchmark) required of any US fund with ≥$200M foreign ownership[^3][^7]. Data is 10-month lagged. Cannot parse SWF from private capital. |
| **BEA — Foreign Direct Investment in the US (FDIUS)** | Base API: `https://apps.bea.gov/api/data/?UserID=YOUR_KEY&method=GetData&DataSetName=MNE&...` — Interactive: `https://www.bea.gov/data/intl-trade-investment/direct-investment-country-and-industry` | **Free** (API key free, request at bea.gov) | Unlimited; BEA API free key; Python library `beaapi` on GitHub[^8] | Country × Industry breakdown including "Real Estate and Rental and Leasing" as NAICS sector[^9][^10] | Annual (2-year lag); Quarterly IIP position data (BEA Form BE-605)[^11] | JSON/CSV via API; XLS bulk download | Free API key (`bea.gov/API/signup/index.cfm`)[^12] | FDI inflows by country of UBO, by US industry (incl. real estate NAICS), capital flows, income, employment at US affiliates of foreign firms[^10][^11] | TIC, IMF CDIS, UNCTAD | FDI Country-of-Origin Breakdown tile | **Gotcha:** Covers FDI (≥10% voting equity stake), NOT portfolio flows. Real estate NAICS code captures operating real estate companies; most SWF co-investments via blind-pool funds may classify under "Finance and Insurance." Annual data has ~18-month lag; quarterly BE-605 is 45 days. `BEA API dataset=MNE` for MNC data; use `TableName=T22` for FDI by industry[^13]. Some affiliate-level tables were discontinued Dec 2025[^10]. |
| **BEA — International Investment Position (IIP)** | `https://apps.bea.gov/iTable/bp_download_modern.cfm?pid=5` (CSV bulk) — API: `DataSetName=IIP`[^14] | **Free** | Unlimited | US-level aggregate; foreign claims on US assets by asset class (FDI, portfolio, other)[^15][^14] | Quarterly (45-day lag) | CSV, JSON | Free BEA API key | FDI position, portfolio equity/debt, bank claims; geographic split at annual level[^15] | TIC, Federal Reserve Z.1 | Macro Capital Position Context tile | **Gotcha:** Does not break out real estate as a separate line within FDI position at quarterly frequency. Annual IIP does have some industry detail. |
| **BEA Direct Investment by Country and Industry** | `https://www.bea.gov/data/intl-trade-investment/direct-investment-country-and-industry`[^9] | **Free** | Unlimited | ~60 countries × ~20 NAICS industries | Annual (released mid-year for prior year)[^9] | XLS, interactive | Free BEA API key | FDI position stock ($) and flows, income, by country of UBO and US industry[^9][^16] | CFIUS, UNCTAD | Country × Sector FDI Heatmap tile | **Gotcha:** As of Dec 2025, two affiliate-level tables were discontinued[^16]. Use `https://www.bea.gov/international/di1fdiop` for FDIUS operating data page[^10]. Python call: `dataset='MNE', TableName='T31', Frequency='A'`. |
| **CFIUS Annual Report to Congress** | `https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius/cfius-reports-and-tables` — 2024 PDF: `https://home.treasury.gov/system/files/206/2024-CFIUS-Annual-Report.pdf`[^17][^18] | **Free** | N/A — PDF download | All foreign acquirers of US businesses/real estate; sector + country distribution[^19][^20] | Annual (8-month lag; 2024 report released Aug 2025)[^19] | PDF | None | Number of notices/declarations by sector, country of acquirer, real estate transactions flagged; covered real estate expansions; enforcement/mitigation orders[^19][^20][^21] | BEA FDIUS, TIC | CFIUS/Geopolitical Risk Overlay tile | **Gotcha:** 2024 report: 6 real estate declarations, 3 real estate notices filed; Nov 2024 rule expanded CFIUS jurisdiction over real estate near 59 military installations[^19][^18]. Highly aggregated — no deal-level disclosure. Use for regulatory risk screening for co-investment decisions. |
| **OFAC SDN + Consolidated Sanctions List** | SDN XML: `https://www.treasury.gov/ofac/downloads/sdn.xml` — SDN CSV: `https://www.treasury.gov/ofac/downloads/sdn.csv` — Consolidated non-SDN XML: `https://www.treasury.gov/ofac/downloads/sanctions/1.0/cons_advanced.xml`[^22][^23] | **Free** | Unlimited; updated daily (some wrappers q2 min via OpenSanctions)[^24] | Global — all designated individuals, entities, vessels[^24] | Daily updated[^24][^23] | XML, CSV, fixed-field | None for bulk download; OpenSanctions REST API for search[^24] | Entity name, aliases, addresses, sanction program, country, ID numbers[^23] | CFIUS, FinCEN, EU Consolidated List | Co-Investor Restricted Party Screening tile | **Gotcha:** Use `opensanctions.org/datasets/us_ofac_sdn/` for API search endpoint (`/search`, `/match`)[^24]. Raw Treasury files require name-matching logic. Must screen every prospective co-LP before accepting capital. |
| **IMF Coordinated Portfolio Investment Survey (CPIS/PIP)** | `https://data.imf.org/en/datasets/IMF.STA:PIP`[^25] — DBnomics mirror: `https://db.nomics.world/IMF/CPIS`[^26] | **Free** | Unlimited | ~75 reporting economies × counterpart economy (bilateral portfolio positions)[^25][^27] | Annual (18-month lag)[^25] | CSV/JSON (IMF API), interactive | None | Bilateral portfolio investment positions: equity, LT debt, ST debt by reporting + counterpart country[^25] | BEA IIP, TIC SHL | Bilateral Portfolio Flow tile | **Gotcha:** Covers securities only (portfolio), NOT direct real estate investment. Use to gauge relative weight of capital from each country into US securities as a proxy for institutional capacity and appetite. No fund-level attribution. |
| **UNCTAD World Investment Report + FDI Statistics** | `https://unctad.org/topic/investment/world-investment-report` — Country factsheets: `https://unctad.org/topic/investment/investment-statistics-and-trends`[^28][^29] | **Free** | Unlimited | ~200 economies; global FDI flows and stocks[^28][^30] | Annual (June release for prior year)[^31] | PDF, XLS, online | None | Global FDI flows/stocks by country-pair and sector; M&A greenfield data; top host/source countries[^29] | BEA FDIUS, IMF CPIS | Global FDI Context tile | **Gotcha:** Real estate is not broken out as a separate FDI sector in UNCTAD headline data. Useful for cross-country benchmarking and identifying emerging source countries (e.g., Saudi Arabia, UAE uptick). |

***

### Tier 2 — Sovereign Wealth Fund Disclosures (Annual Reports + Press Releases)

| Source Name | Exact URL / Endpoint | Free vs Freemium | Free-tier Rate Limit / Quota | Geographic / Entity Coverage | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **NBIM / Norway GPFG — All Investments Database** | `https://www.nbim.no/en/investments/all-investments/` — Annual Report 2025: `https://www.nbim.no/en/news-and-insights/reports/2025/annual-report-2025/`[^32][^33] | **Free** | Unlimited; filterable by country/sector/year | Global; US real estate sub-portfolio searchable[^32][^33] | Annual (holdings); deal press releases real-time[^34][^35] | Interactive web + downloadable holdings list (Excel) | None | Property name, country, ownership %, JV partner, asset class, transaction date, price (partial)[^34][^36][^35] | RCA free report, CBRE cross-border | Norway Flow Tracker tile | **Hotspot:** NBIM quadrupled private real estate deployment in 2024[^35]. Real estate allocation: 50% REITs + 50% private[^37]. 14 real estate transactions approved in 2024 vs 8 in 2023[^36]. 4 new investments in 2024. Download full holdings Excel at year-end. Menlo Park office: $217M, Oct 2024[^34]. **Highest-transparency SWF globally.** |
| **ADIA Annual Review** | `https://www.adia.ae/en/publications` — 2024 PDF: `https://www.adia.ae/en/pr/2024/pdf/adia-annual-review-2024_final.pdf`[^38][^39] | **Free** | N/A — PDF | Global; North America 45–60% of portfolio est.[^40] | Annual (September release for prior year)[^39] | PDF | None | Asset allocation ranges by class (real estate % range); geographic allocation ranges; investment approach narrative; no deal-level data[^41][^40] | SWFI transaction database, trade press | ADIA Portfolio Signal tile | **Gotcha:** ADIA deliberately publishes ranges (e.g., "45–60% North America"), not precise figures or deal names. Real estate + infrastructure combined ~5–10% allocation range. Cross-reference with SWFI news and PERE press for specific US deals. |
| **GIC Singapore — Annual Report** | `https://www.gic.com.sg/our-portfolio/gic-reports/` — 2024/25 PDF: `https://www.gic.com.sg/uploads/2025/07/GIC_AR_2024-25_PRINT.pdf`[^42][^43][^44] | **Free** | N/A — PDF | Global; US is primary market; real estate sub-portfolio[^44] | Annual (July/August release)[^43][^45] | PDF | None | 20-year annualized real return vs inflation; allocation ranges by geography and asset class; nominal GDP-weighted portfolio mix; senior executive CRE appointments[^44][^45] | PERE/IPE transaction alerts, SWFI | GIC Singapore Flow tile | **Gotcha:** GIC does not disclose specific transactions or individual asset names in public reports. In 2024/25: Goh Chin Kiong appointed CIO Real Estate April 2024[^44]. Boosted US equity allocation despite valuation concerns[^46]. Track deal flow via PERE deal alerts. Portfolio >USD 300B[^44]. |
| **Temasek Annual Review** | `https://www.temasek.com.sg/en/news-and-resources/annual-review` | **Free** | N/A — PDF | Global; ~25% Americas | Annual (July) | PDF | None | Net portfolio value; geographic mix; sector mix; listed/unlisted split; sustainability metrics | SWFI, PERE press | Temasek Flow tile | **Gotcha:** Temasek is primarily a direct equity investor; real estate is a minor allocation vs infrastructure/PE. No transaction-level CRE data in public report. |
| **Kuwait Investment Authority (KIA)** | No public annual report with granular data; SWFI profile: `https://www.swfinstitute.org` | **Freemium** (SWFI has some free news) | Free news snippets only | Global; US heavy | Irregular press/SWFI alerts | Press, SWFI snippets | None for free snippets | Transaction headlines when disclosed via press release only | Trade press, SWFI | Gulf SWF Context tile | **Gotcha:** KIA is one of the least transparent SWFs globally. No structured public data. Monitor trade press (PERE, IPE, WSJ) for deal announcements. |
| **Qatar Investment Authority (QIA)** | `https://www.qia.qa/en/portfolio/Pages/Real-Estate.aspx`[^47] — IFSWF profile: `https://www.ifswf.org/member-profiles/qatar-investment-authority`[^48] | **Free** (sparse) | N/A | Global; US real estate team dedicated[^47][^49] | Irregular announcements only | Web + press | None | Asset class descriptions; sector coverage (RE, infra, PE, credit); no deal-level data[^47][^49] | SWFI, PERE, WSJ CRE | QIA Signal tile | **Gotcha:** QIA ($526–600B AUM)[^49][^50] covers 9 sectors including real estate but releases no transaction database. Saudi PIF invested hundreds of millions in proposed NYC skyscraper in 2025[^51], signaling Gulf SWF re-engagement. Monitor WSJ/Bloomberg deal coverage and SWFI transaction database. |
| **China Investment Corporation (CIC) Annual Report** | `http://www.china-inv.cn/en/` | **Free** (PDF) | N/A | Global; US listed/unlisted equities, real estate | Annual (12–18 month lag) | PDF | None | Asset allocation by class; geographic split; 10-year annualized return; no specific US CRE deals | BEA FDIUS China, CFIUS | CIC China Flow tile | **Gotcha:** CIC subject to heightened CFIUS scrutiny. US real estate investments have been curtailed post-2018. Monitor CFIUS report for Chinese RE transaction trends. Data lag 12–18 months. |
| **Saudi PIF — Portfolio Transparency** | `https://pif.gov.sa` — Portfolio companies: `https://saudipedia.com/en/public-investment-fund-companies`[^52] | **Free** (limited) | N/A | Global; US CRE re-engaging 2025[^51] | Irregular press; portfolio page updates | Web, press | None | Portfolio company names (partial list); press releases on new deals[^51][^52] | SWFI, WSJ, Bloomberg | Gulf SWF / PIF Tracker tile | **Hotspot:** Saudi PIF acquiring two-thirds stake in proposed NYC skyscraper (2025)[^51]; foreign investors bought >$2.1B Manhattan CRE in Q4 2024/Q1 2025[^51]. PIF committed $40B/yr through 2025[^53]. Use SWFI free news + press alerts for deal flow. |
| **Korea Investment Corporation (KIC)** | `https://www.kic.kr/en/investment/portfolio/management-status`[^54] — Annual Report: `https://www.kic.kr/annual-report/2024/eng/`[^55] | **Free** | N/A | Global; US heavy; alternatives = 22% of portfolio[^56] | Annual (English version ~3-month lag) | PDF + web | None | Total AUM (USD 232B Dec 2025)[^57][^54]; asset allocation by class; alternatives breakdown; CIO commentary on RE strategy | PERE, IPE | Korea LP Signal tile | **Gotcha:** KIC eyeing "total portfolio approach" as real estate underperformed in recent periods[^56]. Detailed US CRE positions not publicly disclosed. Use PERE news + SWFI for specific transactions. |
| **Japan GPIF** | `https://www.gpif.go.jp/en/` — 2024 Annual Report: `https://www.gpif.go.jp/en/performance/annual_report_fiscal_year_2024.pdf`[^58][^59] | **Free** | N/A | Global; $27.3B alternatives AUM as of late 2025[^60] | Annual (July release for fiscal year ending March) | PDF | None | Asset allocation targets; alternatives sub-allocation (real estate via fund-of-funds); 1/5/10-year return by class[^61][^58][^62] | PERE fund-raising data | Japan LP Allocation tile | **Hotspot:** GPIF increased real estate AUM 27% in FY2024[^62]; building internal alts database[^60]. Invests via external managers (unlisted RE funds)[^61]. Names of external RE managers occasionally disclosed in annual report appendix — check for US-focused fund names. |

***

### Tier 3 — North American Public Pension Disclosures (Board Agendas + Annual Reports)

| Source Name | Exact URL / Endpoint | Free vs Freemium | Free-tier Rate Limit / Quota | Geographic / Entity Coverage | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **CalPERS — Investment Committee Board Agendas** | Board meetings: `https://www.calpers.ca.gov/about/board/board-meetings` — Investment reports: `https://www.calpers.ca.gov/investments/about-investment-office/investment-financial-reports` — Real Estate Annual Program Review: `https://www.calpers.ca.gov/documents/202506-invest-agenda-item06e1-01/download?inline`[^63][^64][^65] | **Free** | Unlimited public access; agendas published 10 days before meeting | US + global; $50.1–50.4B real estate portfolio[^66][^67] | Monthly board meetings; Real Estate Annual Program Review quarterly[^67][^65] | PDF (Meketa consultant reports attached to agenda items) | None | RE portfolio market value, performance by property type (industrial, multifamily, office), manager list, new commitments, dispositions, benchmark vs NPI[^66][^67][^65] | NCREIF NPI, MSCI RCA | CalPERS RE Exposure tile | **Unfair advantage source.** Real Estate Annual Program Review PDFs are attached to monthly Investment Committee agenda items (e.g., `agenda-item06e1`). Contains manager-level allocation, property type breakdown, vintage commitments. Next meeting: June 15–17, 2026[^63]. URL pattern: `calpers.ca.gov/documents/YYYYMM-invest-agenda-item[XX]/download?inline`. |
| **CalSTRS — Real Estate Program Reports** | Reports: `http://www.calstrs.com/reports`[^68][^69] | **Free** | Unlimited | US + global; ~9% RE allocation | Quarterly investment reports; Annual program review | PDF | None | RE portfolio NAV, property type/geography mix, manager list, annual returns vs NPI | CalPERS, NCREIF | CalSTRS RE Signal tile | **Gotcha:** Less granular than CalPERS at board level. Annual Investment Report contains RE program summary. CalSTRS held separate EAC meeting from CalPERS as of Nov 2025[^69]. |
| **New York Common Retirement Fund (NYSCRF)** | `https://www.osc.ny.gov/common-retirement-fund/resources/financial-reporting-and-asset-allocation`[^70][^71] | **Free** | Unlimited | US + global; 12% RE allocation[^70] | Quarterly asset allocation reports; annual report | PDF, web | None | Asset allocation by class; RE = 12% of ~$267B fund[^72]; manager commitments disclosed in annual report | SWFI, NCREIF | NYSCRF LP Signal tile | **Gotcha:** NY Comptroller's office publishes quarterly allocations. Individual manager names and commitment amounts in Annual Report. $267.7B total AUM[^72]. |
| **NYC Pension Funds (NYCERS, TRS, BERS, Police, Fire)** | NYC Comptroller: `https://comptroller.nyc.gov/reports/new-york-city-pension-funds-returns-for-fiscal-year-2025/`[^73] | **Free** | Unlimited | US + global; combined >$280B | Annual (July); occasional board meeting reports | PDF | None | Combined fund return by class; individual fund RE allocations | NYSCRF, NCREIF | NYC Pension Tile | **Gotcha:** Five separate boards; investment committee agendas for each on respective websites. NYC funds FY2025 returns published May 2026[^73]. TRS and NYCERS have own separate RE managers. |
| **Florida SBA (FRS Pension)** | Annual Investment Reports: `https://www.sbafla.com/reporting/annual-investment-reports/` — FY2024-25 PDF: `https://www.sbafla.com/media/ucznhyvg/2024-2025-air-final.pdf`[^74][^75][^76] | **Free** | Unlimited | US + global; RE allocation reduced Jan 2024[^74] | Annual (December); quarterly performance reports | PDF | None | Fund total AUM; asset allocation targets and actuals; RE portfolio manager names, performance vs benchmarks[^74][^77] | NCREIF, CalPERS | Florida SBA RE Tracker tile | **Gotcha:** SBA restructured RE allocation in Jan 2024[^74]. FRS Pension = ~$180B. Annual report contains manager roster. FL PRIME = $25.5B separate vehicle[^78]. |
| **Washington State Investment Board (WSIB)** | Annual Reports: `https://www.sib.wa.gov/docs/reports/annual/` — FY2025 PDF: `https://www.sib.wa.gov/docs/reports/annual/ar25.pdf`[^79][^80][^81] | **Free** | Unlimited | US + global; 6.5% RE + 15.6% tangible assets[^81] | Annual (September) | PDF | None | RE portfolio NAV, returns, manager list, vintage commitments; total fund = ~$190B[^82][^81] | CalPERS, NCREIF | WSIB LP Signal tile | **Gotcha:** WSIB returned 5.4% FY2024, second best among major public pensions[^82]. Real estate -7.5% in FY2024[^80]. Reports include full private RE manager roster. URL: `sib.wa.gov/docs/reports/annual/ar25.pdf`. |
| **Oregon PERS (OPERF)** | `https://www.oregon.gov/ost/pages/performancereports.aspx` | **Free** | Unlimited | US + global; strong RE + infra program | Annual (December) | PDF | None | RE fund commitments, returns by vintage, manager names; OPERF returned 6.32% FY2024[^82] | WSIB, CalPERS, NCREIF | Oregon LP Signal tile | **Gotcha:** Oregon PERS was #1 performing major US pension FY2024[^82]. RE program particularly strong. Consultant reports in Investment Advisory Council meeting agendas contain granular data. |
| **CPP Investments (CPPIB)** | Newsroom (deal press releases): `https://www.cppinvestments.com/newsroom/`[^83] — Annual reports: `https://www.cppinvestments.com/about/our-performance/` | **Free** | Unlimited | Global; US CRE major allocation[^84] | Quarterly press releases; Annual (May) | PDF + web press | None | Specific US CRE transactions with partner, asset type, geography, price (partial); total RE AUM; fund return by class[^85][^86][^83][^87] | PERE deal database, CoStar | CPPIB/Canada LP Tracker tile | **Hotspot:** CPP newsroom announces specific deals: e.g., $750M Redwood Trust residential mortgage JV (Mar 2024)[^85]; further reduced RE holdings FY2024[^87]. Newsroom URL includes transaction press releases. NET ASSETS: CAD 632.3B at FY2024 end[^84]. |
| **CDPQ / La Caisse (formerly Ivanhoé Cambridge)** | Press releases: `https://www.lacaisse.com/en/news/pressreleases/`[^88] | **Free** | Unlimited | Global; US office/logistics major focus | Quarterly/as-deals-happen | PDF press + web | None | Specific US RE transactions (e.g., sold 49% of 1211 Ave of Americas, NYC Jan 2025[^89]); portfolio rebalancing announcements[^88][^90] | CoStar, RCA free report | CDPQ Flow tile | **Hotspot:** CDPQ integrated Ivanhoé Cambridge into La Caisse brand as of 2024–2025[^91][^90]. Now operates as unified RE investment group. Press release feed = real-time deal signal. Sold partial stake in News Corp Building, NYC 2025[^89]. |
| **OTPP / Ontario Teachers' (Cadillac Fairview)** | OTPP news: `https://www.otpp.com/en-ca/about-us/news-and-insights/` — Cadillac Fairview: `https://www.cadillacfairview.com/news/` | **Free** | Unlimited | US + Canada; CRE (retail + office + life sciences) | Deal-by-deal press releases | Web/press | None | Transaction partner, asset class, geography, price (partial); strategic direction commentary[^92] | CoStar, PERE | OTPP RE Flow tile | **Hotspot:** OTPP building new in-house RE team (announced March 2026)[^92], signaling increased direct US CRE activity. Cadillac Fairview is wholly owned RE subsidiary[^93]. |
| **OMERS / Oxford Properties** | Oxford news: `https://www.oxfordproperties.com/news/` — Oxford US retail entry: `https://www.oxfordproperties.com/news/oxford-enters-us-open-air-retail-market-with-acquisition-of-1-million-sq-ft-austin-based-r…`[^94] | **Free** | Unlimited | US + Canada + UK + Europe; major US office + retail + life sci[^95] | Deal-by-deal press releases | Web/press | None | US CRE acquisitions with address, sq ft, JV partner, asset type, entry into new sub-markets[^94] | CoStar, CPP transactions | OMERS/Oxford Flow tile | **Hotspot:** Oxford entered US open-air retail in Austin, TX (May 2024)[^94]; acquired full Western Canada office portfolio from CPP (June 2025)[^96]. Significant Hudson Yards JV with Related Companies[^95]. |
| **PSP Investments** | Annual reports: `https://www.investpsp.com/en/investment-performance/reports/` — 2024 Annual Report PDF[^97][^98] | **Free** | Unlimited | Global; US CRE via direct + JV[^97] | Annual (May); occasional deal press | PDF | None | Total RE AUM, returns; select deal disclosures; 5-year net annualized 7.9%[^97] | PERE, CoStar | PSP LP Signal tile | **Gotcha:** Less deal-level transparency than OTPP or Oxford. Monitor PERE for PSP-linked transactions. |
| **BCI / QuadReal** | BCI annual: `https://www.bci.ca/about/reports/` — QuadReal US Fund financial statements: `https://www.bci.ca/wp-content/uploads/2018/03/BCI-QuadReal-US-Pension-B-Pooled-Fund-Financial-Statements-Dec2024.pdf`[^99] | **Free** | Unlimited | US + Canada + UK + Europe; pooled RE fund focused[^100] | Annual (September BCI); fund financial statements annually | PDF | None | US pooled fund NAV; property type mix; geographic concentration; BCI trustee + QuadReal manager structure[^100][^99] | CoStar, NCREIF | BCI/QuadReal Flow tile | **Gotcha:** QuadReal runs separate US Pension B Pooled Fund with published financial statements[^99] — rare transparency. Search `bci.ca` for QuadReal fund reports. |
| **AustralianSuper + IFM Investors** | AustralianSuper Annual Report 2025: `https://www.australiansuper.com/-/media/australian-super/files/about-us/annual-reports/2025-annual-report.pdf`[^101] — IFM: `https://www.ifminvestors.com/` | **Free** | Unlimited | US is #1 destination (est. $400B → >$1T by 2035)[^102] | Annual (September for June 30 FY) | PDF | None | Total AUM; RE allocation (~5% unlisted); infrastructure USA focus; IFM US infrastructure investment strategy report[^103][^104] | SWFI, PERE, IFM press releases | Australian Super Flow tile | **Hotspot:** IFM commissioned landmark report (Feb 2025): Australian super funds to more than double US investment from $400B to >$1T by 2035[^102][^103]. IFM owned by 15 Australian pension funds + UK NEST[^103]. Monitor IFM US infrastructure and CRE deal announcements. |
| **APG Asset Management (Netherlands)** | Annual Report 2024: `https://apg.nl/en/about-apg/annual-report-2024/` — PDF: `https://apg.nl/media/zlmnwuod/publication_annual-report-2024-apg-groep-nv-2024.pdf`[^105][^106] | **Free** | Unlimited | Global; US significant; manages ABP (largest Dutch pension)[^107] | Annual (March for prior year) | PDF | None | Total AUM (>€521B)[^107]; RE allocation; ESG approach; no deal-level disclosures in public report | PERE, SWFI news | APG/Netherlands LP tile | **Gotcha:** APG manages real estate via CBRE IM and direct mandates. NY office at 666 Third Ave[^107]. For US CRE deals, track CBRE IM press releases and SWFI transaction database. Annual report is strategic overview only, no asset-level data. |

***

### Tier 4 — Industry Aggregators, Trade Press, and Research Platforms

| Source Name | Exact URL / Endpoint | Free vs Freemium | Free-tier Rate Limit / Quota | Geographic / Entity Coverage | Update Frequency | Data Format | Auth Required | Specific Fields Returned | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **MSCI Real Capital Analytics (RCA) — US Capital Trends Report** | `https://www.msci.com/data-and-analytics/real-estate/us-rca-capital-trends-report`[^108] — Global Big Picture: `https://www.msci.com/data-and-analytics/real-estate/real-capital-analytics`[^109] | **Freemium** | Free monthly PDF download (registration required); full database = paid[^109][^108] | US CRE all property types; global cross-border buyers[^109][^108] | Monthly PDF (35-day lag)[^108][^110] | PDF (free); Platform (paid)[^111] | Email registration for free PDF | Monthly transaction volume by type/geography; cross-border buyer share; cap rate trends; top buyer types (private, institutional, SWF)[^109][^108][^110] | CBRE, JLL, Cushman | Global Capital Trends tile | **Highest-leverage free source.** RCA free monthly PDF shows cross-border % of US CRE investment. Full RCA database (>$40T transactions, 200K investor profiles)[^112] = paid. Academic access via IPC/AREUEA semiannual application[^112]. Sign up at msci.com/real-estate. |
| **CBRE — Global Cross-Border Capital Flows + US Capital Markets** | H2 2024 report: `https://www.cbre.com/insights/reports/h2-2024-global-real-estate-capital-flows`[^113] — US Q4 2025: `https://www.cbre.com/insights/figures/q4-2025-us-capital-markets-figures`[^114] | **Freemium** | Free registration; gated after a few downloads per month | US + global cross-regional; North America ↔ Europe ↔ APAC flows[^115][^113] | Semi-annual cross-border report; quarterly US figures[^114] | PDF (free); interactive data (paid) | Email registration | Cross-regional capital flow volume by corridor ($B); buyer type breakdowns; cap rate comps; total CRE investment volume[^114][^116][^115][^113] | MSCI RCA, JLL | Cross-Border Flow tile | **Key data point:** H2 2024 cross-regional flows to North America up 31% YoY to $37B[^113]. Total US CRE volume $499B in 2025, up 22%[^114]. Foreign investors = small but high-signal share. CBRE also publishes annual US Market Outlook (free registration). |
| **JLL — Global Capital Flows Report** | JLL Insights: `https://www.us.jll.com/en/trends-and-insights/research` — Asia Pacific Capital Tracker: `https://www.slideshare.net/slideshow/jll-asia-pacific-capital-tracker-1q24-pdf/267955243`[^117][^118] | **Freemium** | Free registration; PDF reports | Global + US; regional capital trackers by quarter | Quarterly capital tracker; annual outlook[^117] | PDF | Email registration | Investment volume by region and property type; cross-border capital flow estimates; cap rate benchmarks[^118] | MSCI RCA, CBRE | JLL Capital Flows tile | **Gotcha:** JLL's free Global Capital Outlook (annual) is less granular than RCA on LP-level flows. Quarterly Asia Pacific Capital Tracker is particularly useful for APAC SWF/pension signal. JLL 2025 Global CRE Tech Survey: 92% of CRE firms running AI pilots[^119]. |
| **Cushman & Wakefield — Cross-Border Capital** | C&W Global Insights: `https://www.cushmanwakefield.com/en/insights/global-outlook` | **Freemium** | Free registration; limited downloads | US + global cross-border flows | Quarterly/Annual | PDF | Email registration | Cross-border investment volumes; buyer origin rankings; forward outlook | CBRE, JLL | Cushman Capital tile | **Gotcha:** Cushman's cross-border report is less frequently updated than CBRE or RCA. Good for narrative context; lower data precision on LP-level attribution. |
| **AFIRE — Annual International Investor Survey** | `https://www.afire.org/survey/h22025report/`[^120] — H2 2025 Pulse Report[^120][^121] | **Freemium** | Free headline results; full data requires AFIRE membership ($500+) | Global cross-border investors in US CRE; 100+ institutional respondents[^122][^123][^124] | Semi-annual (H1 + H2)[^120] | PDF summary (free); full dataset (member) | None for summary | Preferred US CRE property types (industrial #1, multifamily #2)[^122][^121]; preferred US cities; allocation intentions; market sentiment indices[^120][^121] | CBRE, JLL | AFIRE Sentiment tile | **High-leverage for sentiment signals.** AFIRE H2 2024: CRE in "major era of change" — industrial/multifamily still preferred by foreign investors[^121]. Members include 200+ global institutional investors in US CRE. Membership required for deal-level granularity. |
| **PERE (Private Equity Real Estate News)** | `https://www.perenews.com/` — Data platform: `https://www.perenews.com/private-real-estate-data/`[^125][^126] | **Freemium** | Free article limit (5-10/month); full access = subscription | Global LPs and GPs; 14,000+ investor/manager profiles[^125] | Daily news + deal alerts | Web articles | None for free articles | Deal headlines (LP, GP, asset, geography, size); fund-raising news; LP strategy profiles; executive moves[^35][^87][^62] | RCA, CPP/NBIM press, CalPERS agendas | PERE Deal Radar tile | **Highest-leverage trade source.** PERE = fastest LP deal attribution in the market. Key recent signals: NBIM quadrupled RE deployment 2024[^35]; CPP reduced RE holdings FY2024[^87]; GPIF increasing RE exposure[^62]. Free tier sufficient for deal alerts. Full LP contact database requires subscription. |
| **IPE Real Assets** | `https://realassets.ipe.com` — Asset Owner access (free upon request): `https://realassets.ipe.com/membership-options`[^127][^128] | **Freemium** | Asset owners get courtesy free access upon request[^128]; others = paid | European + global institutional RE; pension + SWF focus | Monthly magazine; daily news | Web + PDF | Registration (free for asset owners[^128]) | Fund commitments; LP strategy shifts; manager searches; deal news (European bias, but global coverage) | PERE, INREV | IPE Real Assets tile | **Unfair advantage:** Asset owners (which Israeli institutional LPs qualify as) get free access upon request[^128]. GRESB partner[^129]. Strong European LP coverage (APG, PGGM, Allianz, AXA). |
| **INREV / ANREV** | INREV library: `https://www.inrev.org/library` — ANREV: `https://www.anrev.org/en/library/`[^130] | **Freemium** | Free market insights to non-members; full data = member | European (INREV) + Asian (ANREV) non-listed RE fund investors | Quarterly reports; Annual | PDF | Registration for free content; membership for full data | Fund flow data; investor appetite surveys; cross-border allocation trends; NFI-ODCE equivalent comparisons[^131][^132] | NCREIF NPI, MSCI RCA | INREV/European LP tile | **Gotcha:** INREV's most granular data (fund-level performance, LP commitments) requires paid membership. Free global market insights report is valuable for European LP directional signals. ANREV covers APAC equivalents. |
| **Preqin — Free Press + Global Report Summary** | `https://www.preqin.com/global-report` — 2025 RE summary: `https://www.preqin.com/insights/global-reports/2025-real-estate`[^133][^134] | **Freemium** | Free summary report (annual); free press releases[^135]; full database = paid | Global; 2024 RE fundraising = $96B YTD[^135] | Annual Global Report (December); press releases as news | PDF (summary free); platform (paid) | Email registration for summary PDF | Global RE deal market trends; fundraising totals; investor risk appetite signals[^135][^134] | PERE, RCA | Preqin Market Context tile | **Gotcha:** Free Preqin summary = excellent annual benchmark for fundraising volumes and LP sentiment. Deal-level LP attribution requires Preqin Pro ($20K+/yr). Press releases: "Early signs of recovery in 2024"[^135]; 2024 capital raised = 61% of 2023 total ($96B)[^135]. |
| **SEC EDGAR — Form D (Private Fund Offerings)** | Full-text search: `https://efts.sec.gov/LATEST/search-index?forms=D&dateRange=custom&startdt=2024-01-01&enddt=2024-12-31` — EDGAR search: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=D&dateb=&owner=include&count=40&search_text=`[^136][^137] | **Free** | 10 requests/second per IP (EDGAR rate limit)[^137] | All US private funds raising capital under Reg D; filter by "Pooled Investment Fund" + "Real Estate" | Near real-time (within 15 days of first sale)[^138] | XML, JSON via EDGAR API | None | Issuer name + address, offering size, investor count, industry group, named officers/directors, exemption type[^138] | BEA FDIUS, TIC SHL | Foreign GP Fund Radar tile | **Underused gem.** Filter Form D for "Pooled Investment Fund" → "Real estate" industry group → non-US issuer address = stream of foreign GPs raising US CRE funds. Apify scraper[^138] provides structured JSON at $5/1,000 rows. EDGAR EFTS API is free and fully documented at `https://efts.sec.gov/LATEST/search-index`. |
| **SEC EDGAR — Form ADV (Registered Investment Advisers)** | `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=ADV&dateb=&owner=include&count=40` — IAPD: `https://adviserinfo.sec.gov/` | **Free** | 10 req/sec | All registered RIAs including foreign-domiciled RE managers | Annual + amendments | XML, CSV bulk download | None | AUM by client type (pooled funds, pensions, SWFs); foreign clients list; advisory fee structure; principal office | Form D, CFIUS data | Foreign GP/Manager Registry tile | **Gotcha:** Form ADV Schedule D Part 7B lists type and approximate amount of each client type. SWF and foreign official clients disclosed in aggregate. Use to identify which GPs have significant SWF/foreign institutional LP base. |
| **SWFI — Free News + Sovereign Wealth Transactions** | `https://www.swfinstitute.org` — REST API: `https://www.swfinstitute.org/services/datafeed-api`[^139][^140] | **Freemium** | Free news/press coverage; API = paid subscription[^139][^141] | Global SWFs, pensions, endowments; US CRE deal tracking | Daily news; API = real-time | Web (free); JSON API (paid) | None for free news; API key for paid REST API[^139] | Transaction headlines with fund name, asset, geography, deal size (when disclosed); fund AUM; executive moves[^141][^142] | PERE, annual reports | SWF Transaction Feed tile | **Highest-leverage free SWF tracker.** SWFI free news tracks deal announcements for ADIA, GIC, QIA, KIA, Temasek, PIF, etc. Paid API provides structured JSON feed with 10K+ data points. Free tier sufficient for daily monitoring of SWF US CRE activity. |
| **NCREIF NPI (National Property Index)** | `https://user.ncreif.org/data-products/property/`[^143][^144] | **Freemium** | Limited free quarterly summary; full data = member ($7,500+/yr)[^143] | US institutional CRE (tax-exempt institutional investors only)[^143] | Quarterly | PDF summary + web member portal | Member login for full data | Unleveraged quarterly total returns by property type and geography; historical to Q4 1977[^143][^144] | CalPERS RE benchmark, INREV | US RE Benchmark tile | **Gotcha:** NCREIF NPI is the benchmark used by CalPERS, CalSTRS, and most US pension RE programs — referenced in all public board reports. Free quarterly return figures published in press release; LP-level attribution = members only. Cross-border investor breakdown not available in free tier. |
| **IIF Capital Flows Tracker** | `https://www.iif.com/Products/Capital-Flows-Tracker`[^145][^146] — Download data: `https://www.iif.com/Research/Download-Data`[^147] | **Freemium** | Free monthly press briefing; historical data download = member[^147][^148][^149] | 25 emerging market economies; portfolio + FDI flows | Monthly (portfolio); Semi-annual (full)[^149] | PDF press + CSV (member) | Member login for CSV download[^147] | Portfolio flows by EM country; net capital flows total; EM-specific FDI context | TIC, BEA | EM Capital Flows Context tile | **Gotcha:** IIF covers EM capital flows broadly; not US CRE specific. Use for understanding GCC and Asia-Pacific LP capital availability (Kuwait, UAE, Singapore capacity signals). Free monthly tracker available without login at `iif.com`. |
| **Bisnow / Commercial Observer — International Capital Coverage** | Bisnow: `https://www.bisnow.com/national/news/international` — CO: `https://commercialobserver.com/` | **Freemium** | Free article limit | US CRE deals; international buyer identification | Daily deal news | Web | None for free articles | Deal price, buyer identity, asset address, property type, financing structure (when disclosed) | SWFI, PERE | US CRE Deal News Feed tile | **Gotcha:** CO and Bisnow often break specific LP-GP-deal linkages before they appear in SWFI or PERE. Co-subscribe to free newsletters (CO Morning Brief, Bisnow Daily). For Israeli LP audience, filter for NYC, Miami, Houston, LA deals with international buyers. |

***

## Section A: Top 15 Highest-Leverage Free Sources for Tracking Global LP Capital Into US CRE (2024–2026)

Ranked by actionability for a Tel Aviv family-office principal wanting to know what GIC, ADIA, CPP, Norway, CalPERS, and APG bought in the last 90 days:

1. **NBIM All Investments Database** — Only SWF on earth with a fully searchable, downloadable US real estate transaction history. Check `nbim.no/en/investments/all-investments/` weekly.[^33][^35]
2. **CPP Investments Newsroom** — Announces specific US CRE transactions with deal terms, JV partners, and asset class. `cppinvestments.com/newsroom/`.[^83]
3. **MSCI RCA US Capital Trends Report** — Free monthly PDF with cross-border buyer share of US CRE volume. Register at msci.com/real-estate.[^109][^108]
4. **SWFI Free News Feed** — Daily SWF/pension deal alerts with asset-level granularity. `swfinstitute.org`.[^140]
5. **CBRE H2 Global Capital Flows Report** — Semi-annual cross-regional capital flow volumes ($B by corridor). Free with registration.[^113]
6. **CalPERS Investment Committee Agendas + RE Annual Program Review** — Monthly PDFs with $50B RE portfolio detail, manager list, commitments. `calpers.ca.gov/about/board/board-meetings`.[^63][^65]
7. **PERE Free Articles** — Fastest deal attribution in the market; free tier covers most major LP announcements.[^35][^87]
8. **BEA FDIUS — Direct Investment by Country and Industry** — Structural FDI flows with real estate NAICS sector; free API key.[^9][^10]
9. **US Treasury TIC Monthly + Major Foreign Holders Table** — Country-level macro capital direction signals; no login needed; `ticdata.treasury.gov/Publish/mfh.txt`.[^1][^2]
10. **CFIUS Annual Report** — Geopolitical risk overlay; identifies which countries' RE investments face US security scrutiny.[^17][^20]
11. **La Caisse (CDPQ) Press Releases** — Announces specific US RE dispositions and acquisitions. `lacaisse.com/en/news/`.[^88]
12. **Oxford Properties News** — OMERS RE arm with active US office + retail + life sci program; deal-level specificity.[^94]
13. **AFIRE Semi-Annual Survey** — Foreign institutional investor sentiment on US property types and markets; free summary.[^120][^121]
14. **GPIF Annual Report + PERE Coverage** — Japan's $1.8T pension increasing RE; names of US-focused RE fund managers (rare for Asian LP).[^58][^62]
15. **OFAC SDN XML Feed** — Daily restricted party screening for all potential LP co-investors from Gulf/MENA region.[^24][^23]

***

## Section B: Unfair-Advantage Sources Most Analysts Ignore

**Public Pension Board Agendas with Consultant Reports Attached**

The single most underused intelligence category: board meeting agendas of US public pensions include attached PDF reports from consultants (Meketa, NEPC, Callan, CBRE IM, etc.) that contain manager-level RE allocation data, co-investment partner names, and vintage commitment schedules. These are public records, posted to fund websites 10 days before each meeting.

- **CalPERS Investment Committee** `calpers.ca.gov/about/board/board-meetings` — Meketa-prepared RE quarterly reports attached as `agenda-item06e1`[^66][^67][^65]
- **WSIB Annual Report** `sib.wa.gov/docs/reports/annual/ar25.pdf` — Full private RE manager roster[^79]
- **Oregon PERS Investment Advisory Council** — Quarterly RE performance by vintage and manager
- **Florida SBA Quarterly Performance** `sbafla.com/reporting/` — Manager-level RE fund details[^76]
- **NYC Pension Boards** — Five separate investment committee agendas; combined RE exposure[^73]

**Sovereign Annual Reports with Hidden Granularity**

- **GPIF Annual Report Appendix** — Lists names of all external RE fund managers; rarely cited but directly reveals which US RE funds the world's largest pension is seeding[^58]
- **BCI QuadReal US Pension B Fund Financial Statements** — Audited fund financials at `bci.ca`; reveals NAV and property type breakdown of the QuadReal US vehicle[^99]
- **PSP Investments Annual Report** — Includes real estate net return by sub-category with US allocation narratives[^97]
- **AustralianSuper Annual Financial Report** — Reveals US CRE manager mandates in notes to financial statements; FY2024 report at australiansuper.com[^101][^150]

**NBIM Real Estate Deal Archive**

The Norway GPFG maintains a fully searchable, publicly downloadable transaction-level archive of every real estate deal ever executed — including JV partners, ownership %, property addresses, and acquisition dates. No other $1T+ SWF offers this. The Q1 2025 key figures show unlisted RE returned 2.4%, a leading indicator for the rest of the institutional market.[^151][^33]

***

## Section C: Gap Analysis — What Remains Gated and Cheapest Legitimate Path

### The Gated Data Tier

The most actionable cross-border LP flow data — transaction-level attribution linking specific SWFs and pensions to specific US assets with price, cap rate, and fund vehicle — remains behind four paywalls: **MSCI RCA full database** (~$50K+/yr, institutional pricing), **Preqin Pro** (~$20K–40K/yr), **PitchBook Pro** (similar), and **MSCI IPD** (performance benchmarking, ~$15K/yr). These platforms collectively cover over $40 trillion in CRE transactions with 200,000+ investor profiles, full fund-raising histories, LP-level commitments, and deal-level attribution that the free sources above cannot replicate. INREV and NCREIF member data (European and US non-listed fund performance with LP identities) add another $10K–20K/yr each for full access.[^112]

Additionally, the **IIF Capital Flows Tracker** database with CSV download and the **SWFI full REST API and transaction database** each cost $5K–15K/yr but are substantially cheaper entry points for structured data vs. RCA or Preqin.[^147][^139]

### Cheapest Legitimate Path (Four-Layer Stack)

**Layer 1 — Free Primary Stack (Cost: $0)**  
Deploy all Tier 1–4 free sources above: TIC, BEA FDI, CFIUS, OFAC, NBIM database, CPP newsroom, SWFI free news, CBRE + MSCI RCA free PDFs, AFIRE survey, pension board agendas, PERE/IPE free tiers, SEC EDGAR Form D. This covers ~60% of public LP deal activity for major SWFs and Canadian pensions with zero spend.

**Layer 2 — SWFI Paid API ($5K–15K/yr)**  
The SWFI REST API provides structured JSON on 10K+ transactions across SWFs, pensions, and sovereign entities with deal-level US CRE attribution — the most cost-effective structured data layer for the specific target audience (global institutional vs. US-only pension).[^139]

**Layer 3 — AFIRE Full Membership (~$500–2,500/yr)**  
Full AFIRE membership unlocks the full International Investor Survey dataset with LP-level sentiment and allocation intentions — the closest thing to a real-time intent survey of foreign institutional RE investors.[^120]

**Layer 4 — RCA Academic/MSCI Starter ($0–10K)**  
Academic researchers can apply for full MSCI RCA database access through the Institute for Private Capital (IPC) semiannually (Jan 31 and July 31 deadlines). For commercial users, MSCI offers a starter-tier data license for specific geographies that is substantially cheaper than full institutional pricing. This provides the transaction-level LP-to-asset linkage that no free source can replicate.[^112]

**Total estimated budget for institutional-grade global LP flow intelligence: $6K–20K/yr** covers ~85% of what the full MSCI RCA + Preqin Pro stack delivers, with the free sources above covering the remaining directional context.

***

## Python / cURL Quick Reference

### TIC Major Foreign Holders (No Auth Required)
```python
import pandas as pd
url = "https://ticdata.treasury.gov/Publish/mfh.txt"
df = pd.read_csv(url, skiprows=3, encoding='latin-1')
print(df.head(30))
```

### BEA FDI by Country and Industry (Free API Key Required)
```python
import requests
BEA_KEY = "YOUR_FREE_KEY"  # request at bea.gov/API/signup/index.cfm
params = {
    "UserID": BEA_KEY,
    "method": "GetData",
    "DataSetName": "MNE",
    "DirectionOfInvestment": "inward",
    "Classification": "Country",
    "Year": "2023,2022,2021",
    "TableID": "2",  # FDI position by country
    "ResultFormat": "json"
}
r = requests.get("https://apps.bea.gov/api/data/", params=params)
data = r.json()["BEAAPI"]["Results"]["Data"]
df = pd.DataFrame(data)
```

### SEC EDGAR Form D Real Estate Filter (No Auth)
```bash
curl "https://efts.sec.gov/LATEST/search-index?forms=D&dateRange=custom\
&startdt=2024-01-01&enddt=2024-12-31\
&q=%22real+estate%22+%22pooled+investment+fund%22" \
| python3 -m json.tool | head -100
```

### OFAC SDN List (No Auth)
```python
import requests, xml.etree.ElementTree as ET
r = requests.get("https://www.treasury.gov/ofac/downloads/sdn.xml")
root = ET.fromstring(r.content)
# Parse sdnEntry elements for name, program, type
for entry in root.iter('{http://tempuri.org/sdnList.xsd}sdnEntry'):
    print(entry.find('{http://tempuri.org/sdnList.xsd}lastName').text)
```

***

## Suggested Terminal Tile Architecture

| Tile Name | Primary Source(s) | Refresh Cadence |
|---|---|---|
| Global Foreign Capital Heatmap | TIC Major Foreign Holders + UNCTAD FDI | Monthly |
| FDI Country × Sector Drill-Down | BEA FDIUS by Country and Industry | Annual |
| CFIUS / Geopolitical Risk Overlay | CFIUS Annual Report + OFAC SDN | Annual / Daily |
| Norway GPFG Tracker | NBIM All Investments + Annual Report | Weekly / Annual |
| Gulf SWF Tracker (ADIA, QIA, PIF, KIA) | SWFI News + ADIA/QIA/PIF press | Daily |
| Canada LP Flow Radar (CPP, CDPQ, OTPP, OMERS, PSP, BCI) | Fund newsrooms + PERE free | Daily |
| US Mega-Pension RE Dashboard (CalPERS, CalSTRS, NYSCRF, WSIB, FL SBA) | Board agendas + Annual reports | Monthly |
| Asia LP Signal (GIC, Temasek, KIC, GPIF, AustralianSuper, IFM) | Annual reports + SWFI + PERE | Daily / Annual |
| European LP Flow (APG, PGGM, Allianz, AXA IM, Swiss Life) | IPE Real Assets (free AO) + PERE | Daily |
| Cross-Border Volume Index | MSCI RCA free monthly + CBRE free semi-annual | Monthly |
| Foreign Capital Sentiment | AFIRE semi-annual survey | Semi-annual |
| US CRE Deal Feed (International Buyer Flag) | PERE + CO + Bisnow | Daily |
| Co-Investor Restricted Party Screen | OFAC SDN XML + OpenSanctions API | Daily |
| Foreign GP Fund Radar | SEC EDGAR Form D (non-US issuer) | Weekly |

***

*Report covers data sources current as of May 2026. Rate limits, endpoints, and free-tier policies subject to change. Verify all endpoint URLs before production deployment. Israeli family offices should additionally consult local FATF/AML counsel on OFAC screening obligations when co-investing alongside Gulf SWFs.*

---

## References

1. [Treasury International Capital (TIC) System | U.S. Department of the ...](https://home.treasury.gov/data/treasury-international-capital-tic-system) - The Final Report on U.S. Portfolio Holdings of Foreign Securities at Year-end 2024 is available from...

2. [TIC Press Releases -- by topic | U.S. Department of the Treasury](https://home.treasury.gov/data/treasury-international-capital-tic-system/tic-press-releases-by-topic) - Release Dates of TIC Data · Frequently Asked Questions Regarding the TIC System and TIC Data ... 12/...

3. [Form SHL: Reports by US Issuers and Others on Foreign Ownership ...](https://www.akingump.com/en/insights/alerts/form-shl-reports-by-us-issuers-and-others-on-foreign-ownership-due-august-30-2024) - Form SHL is a mandatory survey of holdings of US securities, including equity, debt, asset-backed se...

4. [Treasury International Capital Data for March | U.S. Department of ...](https://home.treasury.gov/news/press-releases/sb0144) - About TIC Data. The monthly data on holdings of long-term securities, as well as the monthly table o...

5. [Investments - CalPERS](https://www.calpers.ca.gov/investments) - The Investment Office manages over $500 billion in assets on behalf of more than 2 million members, ...

6. [U.S. Liabilities to Foreigners from Holdings of U.S. Securities](https://home.treasury.gov/data/treasury-international-capital-tic-system/us-liabilities-to-foreigners-from-holdings-of-us-securities) - Foreign Portfolio Holdings of U.S. Securities as of 6/30/2025 (PDF). This report presents the findin...

7. [U.S. Treasury's Benchmark TIC SHL Survey and Implications for ...](https://www.dechert.com/knowledge/onpoint/2024/7/u-s--treasury-s-benchmark-tic-shl-survey-and-implications-for-in.html) - TIC SHL is a mandatory benchmark study commissioned by the Treasury and administered by the FRBNY ev...

8. [us-bea/beaapi - GitHub](https://github.com/us-bea/beaapi) - A Python library library to make it easier to retrieve and work with BEA data. For the parallel R-pa...

9. [Direct Investment by Country and Industry | U.S. Bureau of Economic ...](https://www.bea.gov/data/intl-trade-investment/direct-investment-country-and-industry) - The US direct investment abroad position, or cumulative level of investment, increased $206.3 billio...

10. [Foreign Direct Investment in the United States (FDIUS)](https://www.bea.gov/international/di1fdiop) - The activities of multinational enterprises statistics available here provide a picture of the overa...

11. [Locke Lord QuickStudy: BEA Reporting Requirements for ‎Foreign ...](https://www.troutman.com/insights/locke-lord-quickstudy-bea-reporting-requirements-for-foreign-direct-investment-in-the-united-states/) - The BEA conducts seven mandatory surveys to collect information on foreign direct investment. These ...

12. [Chapter 1 Access Economic Data via the BEA API](https://us-bea.github.io/econ-visual-guide/access-economic-data-via-the-bea-api.html) - Using the sample API call from the above example, we will retrieve Personal Consumption Expenditures...

13. [BEA API Data Retrieval User Guide - Scribd](https://www.scribd.com/document/971484873/Bea-Web-Service-API-User-Guide) - The BEA API User Guide provides instructions for accessing economic statistics published by the Bure...

14. [International Accounts - International Investment Position](https://catalog.data.gov/dataset/international-accounts-international-investment-position) - The BEA data application programming interface (API) provides programmatic access to BEA published e...

15. [U.S. International Investment Position, 3rd Quarter 2025](https://www.bea.gov/news/2026/us-international-investment-position-3rd-quarter-2025) - U.S. assets increased by $1.71 trillion to a total of $41.27 trillion at the end of the third quarte...

16. [Changes to the Direct Investment by Country and Industry News ...](https://content.govdelivery.com/accounts/USDOCBEA/bulletins/3e6517f) - BEA will no longer produce the data in two tables previously included in the full news release's sec...

17. [CFIUS Reports and Tables | U.S. Department of the Treasury](https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius/cfius-reports-and-tables) - Reports. 08/2025 - Annual Report to Congress for CY 2024 · 07/2024 - Annual Report to Congress for C...

18. [[PDF] CFIUS – ANNUAL REPORT TO CONGRESS – CY 2024](https://home.treasury.gov/system/files/206/2024-CFIUS-Annual-Report.pdf) - In 2024, the Mining, Utilities, and Construction sector accounted for 7 percent or 15 notices of the...

19. [CFIUS 2024 Annual Report: Compliance, Enforcement, and Non ...](https://www.wiley.law/alert-CFIUS-2024-Annual-Report) - Declarations: CFIUS assessed 116 covered transaction declarations in 2024, of which six were for cov...

20. [CFIUS 2024 Annual Report key takeaways | White & Case LLP](https://www.whitecase.com/insight-alert/cfius-2024-annual-report-key-takeaways) - In 2024, six declarations and three notices were filed under CFIUS's real estate regulations, which ...

21. [Shifting Currents Beneath a Calm Surface: CFIUS's 2024 Annual ...](https://www.linklaters.com/en/insights/blogs/foreigninvestmentlinks/2025/august/cfius-2024-annual-report-to-congress) - After addressing the double counting of filings for the same transactions, we found that CFIUS looke...

22. [Consolidated (non-SDN) Sanctions List - XML File - Catalog](https://catalog.data.gov/dataset/consolidated-non-sdn-sanctions-list/resource/33e078e2-be12-4c31-a8c4-adf9664a2882) - XML File URL: https://www.treasury.gov/ofac/downloads/sanctions/1.0/cons_advanced.xml cons_advanced....

23. [Information on List File Formats and Downloads](https://ofac.treasury.gov/faqs/topic/1641) - OFAC's SDN list is available in XML, fixed-field and delimited formats that can be imported into a v...

24. [US OFAC Specially Designated Nationals (SDN) List - OpenSanctions](https://www.opensanctions.org/datasets/us_ofac_sdn/) - OFAC publishes a list of individuals and companies owned or controlled by, or acting for or on behal...

25. [PIP - IMF Data - International Monetary Fund](https://data.imf.org/en/datasets/IMF.STA:PIP) - The Portfolio Investment Positions by Counterpart Economy dataset (formerly Coordinated Portfolio In...

26. [IMF/CPIS | DBnomics](https://db.nomics.world/IMF/CPIS) - [CPIS] Coordinated Portfolio Investment Survey (CPIS). Updated by provider on April 8, 2025 (12:00 A...

27. [Coordinated Portfolio Investment Survey (CPIS) | World Bank Data360](https://data360.worldbank.org/en/dataset/IMF_CPIS) - The Portfolio Investment Positions by Counterpart Economy dataset (formerly Coordinated Portfolio In...

28. [Investment statistics and trends - UNCTAD](https://unctad.org/topic/investment/investment-statistics-and-trends) - World Investment Report. The Report focuses on trends in foreign direct investment (FDI) worldwide, ...

29. [World Investment Report 2024: Investment facilitation and digital ...](https://unctad.org/publication/world-investment-report-2024) - Global foreign direct investment (FDI) fell by 2% to $1.3 trillion in 2023 amid an economic slowdown...

30. [UNCTAD: FDI Statistics by Country - globalEDGE](https://globaledge.msu.edu/global-resources/resource/2521) - Currently, FDI country fact sheets for nearly 200 economies are available, as well as a link to the ...

31. [World Investment Report | UN Trade and Development (UNCTAD)](https://unctad.org/topic/investment/world-investment-report) - The World Investment Report focuses on trends in foreign direct investment (FDI) worldwide, at the r...

32. [The fund - Norges Bank Investment Management](https://www.nbim.no/en/investments/) - The fund is a global investor with a long-term investment horizon. The aim is to achieve the highest...

33. [All investments | Norges Bank Investment Management](https://www.nbim.no/en/investments/all-investments/) - Search in all of the fund's investments by country, asset class and sector. The information is avail...

34. [Norway's sovereign wealth fund buys 98% of US office building for ...](https://www.reuters.com/business/finance/norways-sovereign-wealth-fund-buys-98-us-office-building-217-mln-2024-10-29/) - Norway's sovereign wealth fund said on Tuesday it has bought a 97.7% stake in an office property in ...

35. [NBIM quadrupled its private real estate deployment in 2024 - PERE](https://www.perenews.com/nbim-quadrupled-its-private-real-estate-deployment-in-2024/) - Norges Bank Investment Management deployed four times as much capital into private real estate last ...

36. [Annual report 2024 - Norges Bank Investment Management](https://www.nbim.no/en/news-and-insights/reports/2024/annual-report-2024/web-report-annual-report-2024/) - In 2024, 14 real estate transactions were analysed and approved by the CRO through this process, com...

37. [Norges Bank Investment Management Uses REITs as Strategic ...](https://www.reit.com/news/blog/market-commentary/norges-bank-investment-management-uses-reits-strategic-component-real) - Norges Bank Investment Management's real estate investment strategy combines 50% REITs and 50% priva...

38. [[PDF] 2024 REVIEW - Abu Dhabi Investment Authority](https://www.adia.ae/en/pr/2024/pdf/adia-annual-review-2024_final.pdf) - Investors entered 2024 with tempered expectations amidst concerns about elevated equity valuations a...

39. [News & Publications - ADIA](https://www.adia.ae/en/publications) - Read ADIA's latest news announcements, explore our annual ADIA Review, or download a comprehensive o...

40. [ADIA's Annual Review: Key Takeaways on Global Investments and ...](https://www.linkedin.com/posts/ahmedismailxyz_the-abu-dhabi-investment-authority-adia-activity-7374891998081892352-Uxrw) - Some key takeaways that stood out to me: - Estimate of 45% to 60% of ADIA's portfolio is in North Am...

41. [[PDF] ADIA 2025 - IFSWF](https://ifswf.org/print/pdf/node/5082) - ADIA's Annual Review, which is posted on ADIA's website, includes data on its investment strategy, a...

42. [Our Portfolio - GIC](https://www.gic.com.sg/our-portfolio/) - GIC publishes an annual report on the management of the government's portfolio and information on ou...

43. [GIC Reports](https://www.gic.com.sg/our-portfolio/gic-reports/) - On this page. GIC Report 2024/25. Past GIC Reports. GIC Report 2024/25. View online · Download PDF. ...

44. [[PDF] Report on the Management of the Government's Portfolio - GIC](https://www.gic.com.sg/uploads/2025/07/GIC_AR_2024-25_PRINT.pdf) - ... US$300 billion in equity, fixed income, and real estate ... Goh Chin Kiong was appointed Chief I...

45. [GIC Singapore Annual Report 2024/25: Investment | Libertify](https://www.libertify.com/interactive-library/gic-singapore-annual-report-2024-25-investment-performance/) - For the 20-year period ending 31 March 2025, GIC achieved an annualised real return of 3.8% above gl...

46. [GIC ups US equities allocation despite valuation worries](https://www.top1000funds.com/news/gic-ups-us-equities-allocation-despite-valuation-worries/) - Singapore's GIC boosted its US equities allocation in the year to March 2025 despite the expectation...

47. [Real Estate - Qatar Investment Authority](https://www.qia.qa/en/portfolio/Pages/Real-Estate.aspx) - ​​​The Real Estate team covers the entire real estate sector, including income-producing direct owne...

48. [Qatar Investment Authority - IFSWF](https://www.ifswf.org/member-profiles/qatar-investment-authority) - QIA invests in a diverse range of asset classes, including, but not limited to, credit/fixed income,...

49. [Factsheet: QIA's Key Investments | Global Finance Magazine](https://gfmag.com/economics-policy-regulation/qia-key-investments/) - The QIA is the world's eighth largest sovereign fund, with $526 billion worth of total assets, accor...

50. [Qatar Investment Authority (QIA) - Sovereign Wealth Fund Institute](https://www.swfinstitute.org/profile/598cdaa60124e9fd2d05bc5a) - Current Assets for QIA is $600,000,000,000 and SWFI has 35 periods of historical assets, 69 subsidia...

51. [Saudi Fund Invests Hundreds of Millions in Proposed NYC Skyscraper](https://www.wsj.com/real-estate/commercial/saudi-arabia-wealth-fund-nyc-midtown-tower-1b953d32) - Foreign investors purchased more than $2.1 billion of Manhattan commercial property in the first qua...

52. [Public Investment Fund Companies - Saudipedia](https://saudipedia.com/en/public-investment-fund-companies) - On October 20, 2024, the PIF announced the establishment of the Smart Residence Communities Company ...

53. [Saudi Arabia's Public Investment Fund: New Strategies, Investments ...](https://ussaudi.org/saudi-arabias-public-investment-fund-new-strategies-investments-and-diversification/) - The PIF has a total portfolio consisting of over 200 investments, including about 20 companies liste...

54. [Overview Our Portfolio Investments Korea Investment Corporation](https://www.kic.kr/en/investment/portfolio/management-status) - KIC was established in 2005 under the Korea Investment Corporation Act. As of December 2025, we had ...

55. [Investment Highlights - KIC 2024 Annual Report](https://www.kic.kr/annual-report/2024/eng/) - Investment Corporation KIC has paved the way in global financial markets. Beginning with equities an...

56. [KIC eyes total portfolio approach as real estate underperforms - PERE](https://www.perenews.com/kic-eyes-total-portfolio-approach-as-real-estate-underperforms/) - Currently, KIC allocates 22 percent of its portfolio to alternative investments, with real estate an...

57. [KIC Korea Investment Corporation](https://www.kic.kr/en/) - As of the end of December 2025, KIC manages assets of approximately USD 232.0 billion, with cumulati...

58. [[PDF] ANNUAL REPORT - GPIF](https://www.gpif.go.jp/en/performance/annual_report_fiscal_year_2024.pdf) - 【1】Our overarching goal is to contribute to the stability of the national pension system by securing...

59. [Government Pension Investment Fund](https://www.gpif.go.jp/en/) - GPIF begins building a database on alternative assets · Oct 15, 2025. GPIF Publishes the FY2024 Sust...

60. [Japan's GPIF Creates Alts Database as It Expands Exposure to ...](https://www.ai-cio.com/news/japans-gpif-creates-alts-database-as-it-expands-exposure-to-asset-class/) - The pension giant's alts holdings have ballooned to $27.3 billion from $1.3 million over the past de...

61. [[PDF] 1 Investment Results - Global Pension Transparency Benchmark |](https://global-pension-transparency-benchmark.top1000funds.com/wp-content/uploads/2021/01/GPIF-Japan_annual_report_fiscal_year_2019.pdf) - [4] Real estate. ① Overview. GPIF's real estate investment focuses on real estate funds that hold pr...

62. [Seeking higher returns, GPIF looks to increase real estate exposure](https://www.perenews.com/seeking-higher-returns-gpif-looks-to-increase-real-estate-exposure/) - According to GPIF's latest annual report, the fund increased its real estate assets under management...

63. [Board Meetings | CalPERS](https://www.calpers.ca.gov/about/board/board-meetings) - 2025 Board Attendance Report (PDF) · 2024 Board Attendance Report (PDF). The next CalPERS Board meet...

64. [Investment & Financial Reports - CalPERS](https://www.calpers.ca.gov/investments/about-investment-office/investment-financial-reports) - Access CalPERS reports and studies related to our investments. Annual Reports. 2024-25 Annual Invest...

65. [[PDF] Real Estate Annual Program Review - CalPERS](https://www.calpers.ca.gov/documents/202506-invest-agenda-item06e1-01/download?inline) - Real Estate Annual Program Review as of March 31, 2025. Agenda Item ... Portfolio Performance | Real...

66. [[PDF] Agenda Item 6a - Attachment 5 - CalPERS](https://www.calpers.ca.gov/documents/202503-invest-agenda-item06a-05-a/download?inline) - The Real Estate Portfolio had a market value of $50.1 billion at the end of the current reporting pe...

67. [[PDF] Agenda Item 6e1 - Attachment 2, Page 1 of 16 - CalPERS](https://www.calpers.ca.gov/documents/202506-invest-agenda-item06e1-02/download?inline) - The Real Estate Portfolio had a market value of $50.4 billion at the end of the current reporting pe...

68. [Reports - CalSTRS](http://www.calstrs.com/reports) - 2025 Ancillary Investment Program Annual Report. Ancillary Investment Program Annual Report. The Anc...

69. [Employer advisory committee - CalSTRS](http://www.calstrs.com/employer-advisory-committee) - CalSTRS Employer Advisory Committee agenda and materials for the November 5, 2025 meeting. Meeting a...

70. [Financial Reporting and Asset Allocation - New York State Comptroller](https://www.osc.ny.gov/common-retirement-fund/resources/financial-reporting-and-asset-allocation) - These reports provide the public with a clear view of New York State Common Retirement Fund (Fund) m...

71. [New York State Common Retirement Fund](https://www.osc.ny.gov/common-retirement-fund) - The New York State Common Retirement Fund is one of the largest public pension plans in the United S...

72. [New York State Pension Earns 1.4% in Q1 of Fiscal 2024](https://www.ai-cio.com/news/new-york-state-pension-earns-1-4-in-q1-of-fiscal-2024/) - The New York State Common Retirement Fund's asset value remained unchanged at $267.7 billion due to ...

73. [New York City Pension Funds' Returns for Fiscal Year 2025](https://comptroller.nyc.gov/reports/new-york-city-pension-funds-returns-for-fiscal-year-2025/) - Overview of Fiscal Year 2025 The Comptroller of the City of New York serves as the investment adviso...

74. [[PDF] ANNUAL INVESTMENT REPORT](https://www.sbafla.com/media/ucznhyvg/2024-2025-air-final.pdf) - Effective January 1, 2024, the SBA's Trustees approved a revised asset allocation for the FRS Pensio...

75. [Annual Investment Reports - Florida State Board of Administration](https://www.sbafla.com/reporting/annual-investment-reports/) - Annual Investment Reports. SBA 2024-2025 Investment Report. 12/29/2025. SBA 2023-2024 Investment Rep...

76. [Reporting - Florida State Board of Administration](https://www.sbafla.com/reporting/) - SBA Site Logo. Reporting; Dropdown for Reporting. Performance Reports to Trustees · Annual Debt Repo...

77. [[PDF] ANNUAL INVESTMENT REPORT](https://www.sbafla.com/media/zxxprkng/2023-2024-air-draft3625-final-updated.pdf) - Florida PRIME™ Yield vs. Benchmark Performance Data as of June 30, 2024. SBA Managed. Yield. Benchma...

78. [[PDF] State Board of Administration Management of Major Investment Funds](https://oppaga.fl.gov/Documents/Reports/25-03.pdf) - As of June 30, 2024, Florida PRIME had a market value of $25.5 billion (9.3% of the SBA's total asse...

79. [[PDF] ANNUAL REPORT - Washington State Investment Board](https://www.sib.wa.gov/docs/reports/annual/ar25.pdf) - The WSIB may invest in any real estate investment opportunity that offers the potential for attracti...

80. [[PDF] FORTY-THIRD ANNUAL REPORT WASHINGTON STATE ...](https://www.sib.wa.gov/docs/reports/annual/ar24.pdf) - The real estate portfolio investment return for the current fiscal year was -7.5 percent. Real estat...

81. [Washington State Investment Board (WSIB) - Top1000funds.com](https://www.top1000funds.com/asset_owner/washington-state-investment-board-wsib/) - Real Estate. 6.5% Tangible Assets. 15.6% Fixed Income. Website · View the annual report · Global Pen...

82. [Real Estate, Private Equity Propel Washington State Investment ...](https://www.marketsgroup.org/news/washington-state-investment-board-2) - Real Estate, Private Equity Propel Washington State Investment Board to Strong Fiscal Year. WSIB's r...

83. [Newsroom - CPP Investments](https://www.cppinvestments.com/newsroom/) - CPP Investments news releases announce our transactions and corporate activities ... real estate inv...

84. [CPP Investments Net Assets Total $632.3 Billion at 2024 Fiscal Year ...](https://www.cppinvestments.com/newsroom/cpp-investments-net-assets-total-632-3-billion-at-2024-fiscal-year-end/) - Canada Pension Plan Investment Board (CPP Investments) ended its fiscal year on March 31, 2024, with...

85. [Redwood Trust and CPP Investments Announce $750 Million ...](https://www.businesswire.com/news/home/20240319990631/en/Redwood-Trust-and-CPP-Investments-Announce-$750-Million-Strategic-Capital-Partnership) - The partnership consists of a newly formed $500 million Asset Joint Venture and a $250 million corpo...

86. [CPP Investments Returns 8% in Fiscal 2024](https://www.ai-cio.com/news/cpp-investments-returns-8-in-fiscal-2024/) - The Canada Pension Plan Investment Board announced on Wednesday that had achieved an 8% return in it...

87. [CPP Investments further reduced real estate holdings in FY 2024](https://www.perenews.com/cpp-investments-further-reduced-real-estate-holdings-in-fy-2024/) - The pension fund reduced its real estate exposure year-on-year in logistics and office, while retail...

88. [CDPQ announces the integration of its real estate subsidiaries](https://www.lacaisse.com/en/news/pressreleases/cdpq-announces-integration-its-real-estate-subsidiaries) - CDPQ today announced that it will integrate its real estate subsidiaries, Ivanhoé Cambridge and Otér...

89. [CDPQ's Ivanhoé Cambridge Sells 49% of News Corp. Building](https://www.ai-cio.com/news/cdpqs-ivanhoe-cambridge-sells-49-of-news-corp-building/) - Ivanhoé Cambridge, the real estate unit of Canadian pension fund Caisse de dépôt et placement du Qué...

90. [CDPQ rebrands, drops Ivanhoé Cambridge name amid RE ...](https://www.marketsgroup.org/news/cdpq-rebrands-under-la-caisse) - The pension fund has been operating under the rebrand of its shortened name, La Caisse, rather than ...

91. [CDPQ to Integrate its Real Estate Subsidiaries](http://pensionpulse.blogspot.com/2024/01/cdpq-to-integrate-its-real-estate.html) - By Leo Kolivakis January 24, 2024. Real Estate News Exchange reports CDPQ to integrate real estate s...

92. [Ontario Teachers' | Building a new in-house real estate team](https://www.otpp.com/en-ca/about-us/news-and-insights/global-perspectives/building-a-new-in-house-real-estate-team/) - Ontario Teachers' has established an in-house real estate team which will focus on ways to effective...

93. [Cadillac Fairview - Wikipedia](https://en.wikipedia.org/wiki/Cadillac_Fairview) - The Cadillac Fairview Corporation Limited, branded as Cadillac Fairview, is a Canadian company that ...

94. [Oxford enters US open-air retail market with acquisition of 1 million ...](https://www.oxfordproperties.com/news/oxford-enters-us-open-air-retail-market-with-acquisition-of-1-million-sq-ft-austin-based-retail-portfolio-in-jv-with-pine-tree) - By acquiring these retail centers, Oxford creates a foundation for growth in a new sector, allowing ...

95. [Related Companies and Oxford Properties Group announce joint ...](https://www.related.com/press-releases/2010-05-26/related-companies-and-oxford-properties-group-announce-joint-venture) - Oxford Properties Group partners with Related and provides additional experience and capital to crea...

96. [[PDF] Oxford Acquires Full Ownership of High-quality Western Canada ...](https://www.cppinvestments.com/wp-content/uploads/attachments/News-Release_Sale-to-Oxford_June_3_2025.pdf) - With this acquisition, Oxford, the global real estate arm of OMERS, now owns 100% of the approximate...

97. [[PDF] 2024 Annual Report - PSP Investments](https://www.investpsp.com/media/filer_public/03-our-performance/annual-report-2024/pdf/PSP-2024-annual-report-en.pdf) - 3 The Government of Canada gives PSP Investments a Reference Portfolio that communicates its risk to...

98. [Investment performance reports | PSP Investments](https://www.investpsp.com/en/investment-performance/reports/) - Annual Reports. Annual Report 2025. Date: March 31, 2025. Size: 9.7 MB. Annual Report 2024. Date: Ma...

99. [[PDF] BCI QuadReal US Pension B Pooled Fund Financial Statements](https://www.bci.ca/wp-content/uploads/2018/03/BCI-QuadRealUSPensionB-PooledFundFinancialStatements-Dec2024.pdf) - Real estate investments must be eligible investments for pension plans under the Pension. Benefits S...

100. [BCI QuadReal Realty - Morningstar DBRS](https://dbrs.morningstar.com/issuers/12260/bci-quadreal-realty) - A diversified portfolio of office, retail, industrial, and multifamily and manufactured housing asse...

101. [[PDF] 2025 Annual Report - AustralianSuper](https://www.australiansuper.com/-/media/australian-super/files/about-us/annual-reports/2025-annual-report.pdf) - CAF certifies commercial and retail real estate assets through its set of labour standards, which se...

102. [New report reveals USA is the top destination for Australian pension ...](https://smcaustralia.com/media/new-report-reveals-usa-is-the-top-destination-for-australian-pension-fund-international-investment/) - As this pool of capital has grown, IFM and Australian pension funds have looked overseas for private...

103. [IFM Investors Maps Path for Australia's Super Funds to Meet US ...](https://www.ai-cio.com/news/ifm-investors-maps-path-for-australias-super-funds-to-meet-us-infrastructure-funding-gap/) - The report, released this week as Australian superannuation fund leaders are in the U.S. for a summi...

104. [[PDF] 2024 Annual Report - AustralianSuper](https://www.australiansuper.com/-/media/australian-super/files/about-us/annual-reports/2024-annual-report.pdf) - The Balanced investment option for Choice Income accounts has delivered an average annual return of ...

105. [[PDF] 2024 Annual Report - APG](https://apg.nl/media/zlmnwuod/publication_annual-report-2024-apg-groep-nv-2024.pdf) - In addition to the transition to the new pension system, there are three other transitions that will...

106. [Annual Report 2024 - APG](https://apg.nl/en/about-apg/annual-report-2024/) - APG publishes its 2024 Annual Report. In it, we reflect on an eventful year—one in which we worked t...

107. [APG Asset Management | LinkedIn](https://www.linkedin.com/company/apg-asset-management) - APG Asset Management is one of the largest pension investors in the world and a leading global, long...

108. [US RCA Capital Trends Report - MSCI](https://www.msci.com/data-and-analytics/real-estate/us-rca-capital-trends-report) - The US RCA Capital Trends report provides a timely view of investment activity across U.S. commercia...

109. [Real Capital Analytics - MSCI](https://www.msci.com/data-and-analytics/real-estate/real-capital-analytics) - Explore the Capital Trends report for a comprehensive view of real estate investment activity and ma...

110. [Latest on US Commercial-Property Pricing - MSCI](https://www.msci.com/research-and-insights/paper/rca-commercial-property-price-indexes-rca-cppi) - This report provides insights and data on the latest monthly pricing trends in U.S. commercial real ...

111. [Real Capital Analytics - MSCI](https://app.rcanalytics.com) - Missing: free monthly download

112. [RCA data is again available to academic researchers!](https://areuea.memberclicks.net/index.php?option=com_dailyplanetblog&view=entry&category=other-conference-notices&id=235%3Arca-data-is-again-available-to-academic-researchers-) - RCA is a data and analytics solution for global commercial real estate investing and transactions, w...

113. [H2 2024 Global Real Estate Capital Flows | CBRE](https://www.cbre.com/insights/reports/h2-2024-global-real-estate-capital-flows) - Total cross-regional capital flows to North America, Europe and Asia-Pacific in H2 2024 increased by...

114. [Commercial Real Estate Investment & Lending Activity Continue to ...](https://www.cbre.com/insights/figures/q4-2025-us-capital-markets-figures) - Annual volume totaling $499 billion was 22% higher than in 2024. The CBRE Lending Momentum Index ros...

115. [Global Cross-Regional Investment Volume Nears Stability](https://www.cbre.se/insikter-och-analys/reports/global-cross-regional-investment-volume-nears-stability) - Total cross-regional capital flows between North America, Europe and Asia-Pacific were relatively un...

116. [Capital Markets - CBRE](https://www.cbre.com/insights/books/us-real-estate-market-outlook-2025/capital-markets) - CBRE expects a continued recovery for investment sales in 2025; however, investors and lenders will ...

117. [JLL 2025 Market Outlook and Trends | PDF | Investing - Scribd](https://www.scribd.com/document/837090943/jll-global-capital-outlook-2025) - The document forecasts an improving real estate cycle in 2025, with rising transaction activity and ...

118. [jll-asia-pacific-capital-tracker-1q24.pdf - Slideshare](https://www.slideshare.net/slideshow/jll-asia-pacific-capital-tracker-1q24-pdf/267955243) - In Q1 2024, Asia Pacific investment volumes reached USD 30.5 billion, a 13% increase year-over-year,...

119. [Data-Driven Decision-Making for Real Estate Portfolio Optimization Using Cloud Analytics](https://www.gajrc.com/articles/990/) - Cloud analytics is actively applied in the field of real estate investment and portfolio optimizatio...

120. [AFIRE International Investor Survey: H2 2025 Pulse Report](https://www.afire.org/survey/h22025report/) - The AFIRE H2 2025 Investor Survey, published in Summit #19, looks into the commercial real estate st...

121. [Commercial Real Estate Faces 'Major Era of Change,' per AFIRE ...](https://www.ai-cio.com/news/commercial-real-estate-faces-major-era-of-change-per-afire-pulse-report/) - Commercial real estate is facing “a major era of change,” according to the Association of Foreign In...

122. [Foreign Investors Continue to Prefer Industrial Assets, Latest AFIRE ...](https://www.wealthmanagement.com/investing-strategies/foreign-investors-continue-to-prefer-industrial-assets-latest-afire-survey-reveals) - Foreign Investors Continue to Prefer Industrial Assets, Latest AFIRE Survey Reveals. Industrial and ...

123. [Survey Shows International Investors Favor U.S. Commercial Real ...](https://www.reit.com/news/videos/survey-shows-international-investors-favor-us-commercial-real-estate) - ... Foreign Investors in Real Estate's (AFIRE) annual survey. Jim Fetgatter, chief executive of AFIR...

124. [AFIRE: Foreign investor appetite still strong for US real estate - PERE](https://www.perenews.com/afire-foreign-investor-appetite-still-strong-for-us-real-estate/) - The results of the 2012 AFIRE Annual Survey have revealed that foreign investors intend to continue ...

125. [Private Real Estate Data | Investors, Fund Managers, Funds - PERE](https://www.perenews.com/private-real-estate-data/) - Access private real estate data on funds being raised worldwide, including target sizes & strategies...

126. [Video Archives - PERE](https://www.perenews.com/content_types/video/) - Private Real Estate Data · Investor Calendar · Update your database profile · Law firm data submissi...

127. [IPE Real Assets | Market intelligence for institutional real assets ...](https://realassets.ipe.com) - Enjoy access to IPE Real Assets when you register today! Join our Membership Programme today for acc...

128. [Membership - IPE Real Assets](https://realassets.ipe.com/membership-options) - Asset Owner Access. Upon request** ... As an asset owner, you are entitled to courtesy access to IPE...

129. [IPE Real Assets - GRESB](https://www.gresb.com/nl-en/partners/ipe-real-assets/) - IPE Real Assets is the leading information resource for the institutional real assets investment ind...

130. [Library | ANREV](https://www.anrev.org/en/library/?categoryTagId%5B0%5D=19) - Global Market Insights - April 2026 · Global real estate returns recorded their quickest growth of 2...

131. [[PDF] ANREV / INREV Funds of Funds Study 2021](https://www.inrev.org/system/files/2021-07/INREV-Funds-of-Funds-Study-2021_0.pdf) - The following section is based on cash flow data included in the INREV Data Platform from which the ...

132. [A Comparison of NCREIF, INREV, and ANREV Open-End Core ...](https://www.tandfonline.com/doi/abs/10.1080/10835547.2021.2003506) - Cross-border investment in non-listed real estate is on the rise. This article aims to compare the U...

133. [Preqin Global Reports 2026](https://www.preqin.com/global-report) - The free summary brings together key findings from all five reports – covering private equity, priva...

134. [Preqin 2025 Global Report: Real Estate](https://www.preqin.com/insights/global-reports/2025-real-estate) - Total deal value across major markets shows growth in the first nine months of 2024, but investors a...

135. [Global real estate deal market shows early signs of recovery in 2024](https://www.preqin.com/about/press-release/global-real-estate-deal-market-shows-early-signs-of-recovery-in-2024-preqin-reports) - First-time fundraising rebounds in 2024 from a low base. Preqin data indicates a potential rise in i...

136. [EDGAR Full Text Search - SEC.gov](https://www.sec.gov/edgar/search/) - The new EDGAR advanced search gives you access to the full text of electronic filings since 2001.

137. [How much does it cost, what API and can I get it directly from SEC?](https://www.reddit.com/r/algotrading/comments/13i8o9s/sec_filings_how_much_does_it_cost_what_api_and/) - The SEC does have their EDGAR API which allows for direct access. There are also third-party librari...

138. [SEC Form D Leads Scraper — capital-raise filings JSON - Apify](https://apify.com/devilscrapes/sec-form-d-leads) - Scrape US SEC Form D filings — Regulation D private offerings — with issuer, offering amount, relate...

139. [SWFI Data Feeds & REST API | Sovereign Wealth Fund Institute](https://www.swfinstitute.org/services/datafeed-api) - Integrate SWFI data into your system through the Data Feeds & REST API. Access real-time insights on...

140. [Sovereign Wealth Fund Institute](https://www.swfi.com) - SWFI is a platform offering comprehensive research & analysis of global capital, investor intelligen...

141. [Sovereign Wealth Fund Institute - Wikipedia](https://en.wikipedia.org/wiki/Sovereign_Wealth_Fund_Institute) - The Sovereign Wealth Fund Institute is an American corporation that analyzes public asset owners suc...

142. [Sovereign Wealth Fund Institute (SWFI) - LinkedIn](https://www.linkedin.com/company/sovereign-wealth-fund-institute-inc-) - The Sovereign Wealth Fund Institute (SWFI) is a dedicated data and intelligence platform for institu...

143. [NCREIF Property Index (NPI)](https://user.ncreif.org/data-products/property/) - The NCREIF Property Index (NPI) is a quarterly, unleveraged composite total return for private comme...

144. [Data Products - NCREIF](https://user.ncreif.org/data-products/) - The NCREIF data products are broken out based on investment type, which are - Property, Fund, Timber...

145. [Capital Flows Tracker - IIF](https://www.iif.com/Products/Capital-Flows-Tracker) - The IIF Capital Flows Tracker includes all of our current portfolio flows data as well as the broade...

146. [IIF: Institute of International Finance](https://www.iif.com) - Global Macro Views · Capital Flows Tracker · Global Markets and Policy Insight · Podcasts · Download...

147. [Download Data | IIF](https://www.iif.com/Research/Download-Data) - It is released near the end of each month, and both data sets (portfolio flows and net capital flows...

148. [Research - IIF](https://www.iif.com/Research) - Our capital and portfolio flows databases cover annual, quarterly, monthly and daily frequencies and...

149. [Capital Flows to Emerging Market Economies - IIF](https://www.iif.com/Products/Capital-Flows) - This flagship report, which is released twice a year, provides a comprehensive assessment and foreca...

150. [[PDF] Annual Financial Report - 30 June 2024 - AustralianSuper](https://www.australiansuper.com/-/media/australian-super/files/about-us/financial-statements/2024-fund-annual-financial-report.pdf) - This Annual Financial Report was issued in September 2024 by AustralianSuper Pty Ltd ABN 94 006 457 ...

151. [Key figures 1Q 2025 | Norges Bank Investment Management](https://www.nbim.no/en/news-and-insights/1q-3q/key-figures-1q-2025/) - Data ranges from 2024-03-31 00:00:00 to 2025-03-31 00:00 ... investments was 1.6 percent, whereas in...

