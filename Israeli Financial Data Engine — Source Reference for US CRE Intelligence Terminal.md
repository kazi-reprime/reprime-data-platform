# Israeli Financial Data Engine
## Source Reference for US CRE Intelligence Terminal — Israeli Investor Dashboard Layer

> **Context:** This reference documents every free, endpoint-grade Israeli financial data source required to power the welcome-mat dashboard of a US commercial real estate intelligence terminal whose investor base is predominantly Israeli. All sources have been verified against primary documentation as of May 2026. Current BoI rate: **3.75%** (cut 25 bps on 25 May 2026). Current USD/ILS spot: ~2.87.[^1][^2]

***

## Master Source Table

> Grouped by tile/data type. **Auth = "None"** means no API key required. Latency = time from event to data availability.

### FX — USD/ILS Spot

| Source | URL | Format | Auth | English | Cadence | Latency | Live Tile | License |
|--------|-----|--------|------|---------|---------|---------|-----------|---------|
| **BoI Representative Rate — JSON** | `https://boi.org.il/PublicApi/GetExchangeRate?key=USD` | JSON | None | Y | Business day ~15:15 IST | ~0 min | USD/ILS official rate + daily Δ% | Public domain (Israeli govt) |
| **BoI Representative Rate — XML all CCY** | `https://boi.org.il/PublicApi/GetExchangeRates?asXml=true` | XML | None | Y | Business day ~15:30 IST | ~15 min after JSON | All BoI FX rates bulk | Public domain |
| **BoI EDGE SDMX — USD series** | `https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/EXR/1.0/RER_USD_ILS?format=csv` | CSV/XML/JSON | None | Y | Daily ~15:45 IST | ~30 min after pub | Historical USD/ILS back to 1990s | Public domain |
| **Frankfurter (ECB-sourced)** | `https://api.frankfurter.dev/v2/rates?base=USD&symbols=ILS` | JSON | None | Y | ECB business day ~16:00 CET | ~15 min | USD/ILS cross-check (ECB basis) | Open-source / ECB reference |
| **exchangerate.host** | `https://api.exchangerate.host/live?source=USD&currencies=ILS` | JSON | API key (free tier) | Y | Real-time (multiple updates/day) | ~1–2 min | USD/ILS intraday bridge | Proprietary / commercial use restricted on free tier |
| **ExchangeRate-API free** | `https://v6.exchangerate-api.com/v6/{KEY}/latest/USD` | JSON | Free API key | Y | Hourly on free plan | ~1 hr | USD/ILS cross-check | Free: 1,500 req/month; base must be EUR on free tier[^3] |
| **Yahoo Finance ILS=X** | `https://finance.yahoo.com/quote/ILS=X/` (scrape/yfinance library) | JSON (yfinance) | None (unofficial) | Y | Intraday | ~1–5 min delay | USD/ILS real-time widget | Unofficial; no redistribution |
| **ECB Reference — EUR/ILS via SDMX** | `https://data-api.ecb.europa.eu/service/data/EXR/D.ILS.EUR.SP00.A?format=jsondata` | JSON | None | Y | ECB business day ~16:00 CET | ~15 min | EUR/ILS official | ECB open data |

> **Note:** ECB does not publish USD/ILS directly. Derive: USD/ILS = EUR/ILS ÷ EUR/USD. ILS is not in the Frankfurter default currency list (ECB-sourced, 32 currencies); use BoI as the authoritative USD/ILS source and Frankfurter only for USD/EUR/GBP triangulation.[^4][^5][^6]

***

### Rates — Bank of Israel Interest Rate

| Source | URL | Format | Auth | English | Cadence | Latency | Live Tile | License |
|--------|-----|--------|------|---------|---------|---------|-----------|---------|
| **BoI Public API — current rate** | `https://boi.org.il/PublicApi/GetInterest` | JSON `{"currentInterest":3.75,"nextInterestDate":"..."}` | None | Y | Updated each decision (~8×/year) | Real-time on publication | Policy rate tile + next decision date | Public domain[^7] |
| **BoI EDGE — rate history series** | `https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/IR/1.0/` | CSV/XML/SDMX-JSON | None | Y | Decision-day update | Minutes | Rate history chart | Public domain[^8][^9] |
| **BoI Monetary Policy page (HTML)** | `https://www.boi.org.il/en/economic-roles/monetary-policy/` | HTML | None | Y | Each decision | Minutes | Rate narrative / press release | Fair use |
| **BIS policy rate dataset** | `https://www.bis.org/statistics/cbpol.htm` | CSV/XLSX | None | Y | Monthly | ~1 month lag | Historical rate series backup | BIS open data[^10] |
| **2026 Decision Calendar** | `https://www.boi.org.il/en/economic-roles/monetary-policy/interest-rate-announcement-dates-2026/` | HTML table | None | Y | Annual | N/A | Next decision countdown tile | Public domain[^11] |

**2026 Remaining Rate Decision Dates (16:00 IST):** 6 Jul · 21 Oct · 23 Nov[^11]

***

### Equity Indices — TASE TA-35, TA-125, Sector Indices

| Source | URL | Format | Auth | English | Cadence | Latency | Live Tile | License |
|--------|-----|--------|------|---------|---------|---------|-----------|---------|
| **TASE market.tase.co.il — TA-35** | `https://market.tase.co.il/en/market_data/index/137/major_data` (TA-125 = index/137; TA-35 = index/142; TA-Real Estate 35 launched Nov 2025) | HTML/scrape | None (public web) | Y | Real-time during trading (Sun–Thu) | ~15 min delay (website) | TA-35 / TA-125 index tiles | TASE proprietary — display only |
| **TASE Data Hub API** | `https://api.tase.co.il` (commercial registration required) | JSON REST | API key (paid) | Y | Real-time / EOD | Real-time | All TASE indices & tickers | TASE Data Hub license[^12] |
| **Yahoo Finance ^TA35.TA / ^TA125.TA** | `https://finance.yahoo.com/quote/%5ETA125.TA/` | JSON (yfinance) | None (unofficial) | Y | 15-min delayed | ~15 min | TA-35 / TA-125 tiles | Unofficial; no redistribution |
| **TradingView TASE:TA35** | `https://www.tradingview.com/symbols/TASE-TA35/` | Embed widget | None (free widget) | Y | Real-time | ~15 min | Chart embed | TradingView widget terms[^13] |
| **TA-Real Estate index (TASE)** | `https://market.tase.co.il/en/market_data/index/182/major_data` (TA-Investment Properties in Israel)[^14] | HTML | None | Y | Real-time | 15 min | RE sector index tile | TASE proprietary |

> **TASE API Availability:** TASE launched the **TASE Data Hub** in September 2020 as a commercial API (JSON, REST, real-time + EOD + historical). Free public machine-readable JSON endpoints are **not exposed** on market.tase.co.il — the public site is HTML only. Maya (maya.tase.co.il) exposes disclosures in HTML/XML/XBRL/PDF but not market data JSON. For free index data, use Yahoo Finance (unofficial) or TradingView widget embeds.[^15][^12]

**Full TASE Index Catalogue (key entries):**
- TA-35 (blue-chip 35), TA-90 (mid-cap), TA-125 (composite), TA-Equal Weight 35
- TA-Real Estate 35 (launched Nov 9, 2025 — 35 largest RE stocks)[^16]
- TA-Investment Properties in Israel[^14]
- TA-Banks-5, TA-Insurance, TA-Technology, TA-Food, TA-Biomed

***

### Bond Yields — Shahar (Fixed) & Galil (CPI-Linked)

| Source | URL | Format | Auth | English | Cadence | Latency | Live Tile | License |
|--------|-----|--------|------|---------|---------|---------|-----------|---------|
| **BoI EDGE — Bond Yields (Shahar/Galil)** | `https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/IR/1.0/` (content field: bond yields to maturity) | CSV/XML/SDMX-JSON | None | Y | Daily | End-of-day | Shahar 2Y/5Y/10Y/30Y yields | Public domain[^8][^9] |
| **BoI Bonds stats page** | `https://www.boi.org.il/en/economic-roles/statistics/money-and-debt-aggregates/` | HTML + Excel download | None | Y | Daily (Excel) | 1 day | Yield curve table | Public domain |
| **Investing.com Israel bonds** | `https://www.investing.com/rates-bonds/israel-20-year-bond-yield` | HTML | None | Y | Real-time | ~15 min | IL 2Y/5Y/10Y/20Y/30Y tiles | Investing.com ToS — display only[^17] |
| **FRED St. Louis — Israel 10Y** | `https://fred.stlouisfed.org/series/IRLTLT01ILM156N` | JSON/CSV | None (FRED API key optional) | Y | Monthly (OECD/IMF sourced) | ~1 month lag | 10Y benchmark (monthly) | CC0 / FRED open data[^18] |
| **World Bank / Trading Economics** | `https://tradingeconomics.com/israel/government-bond-yield` | HTML | None | Y | Daily OTC | ~1 day | Yield reference | TE proprietary — display only[^19] |

> **Shahar vs. Galil spread** = breakeven inflation expectation. BoI publishes this directly on the **Inflation Expectations** page at `boi.org.il/en/economic-roles/statistics/` as a downloadable series in the EDGE warehouse.

***

### Inflation & Macro — Israeli CPI (Madad), GDP, Unemployment

| Source | URL | Format | Auth | English | Cadence | Latency | Live Tile | License |
|--------|-----|--------|------|---------|---------|---------|-----------|---------|
| **CBS API — CPI headline (id=120010)** | `https://api.cbs.gov.il/index/data/price?id=120010&format=json` | JSON/XML | None | Y | Monthly, 15th of month ~18:30 | Minutes after pub | CPI YoY % tile | CBS open data[^20][^21] |
| **CBS API — Housing Services sub-index** | `https://api.cbs.gov.il/index/data/price?id=120011&format=json` (approximate — confirm via catalog) | JSON | None | Y | Monthly | Minutes | Housing CPI sub-index tile | CBS open data |
| **CBS API — Construction Cost Index (Madad Tashomet HaBniya)** | `https://api.cbs.gov.il/index/data/price?id=130040&format=json` (confirm code via `https://api.cbs.gov.il/index/catalog/tree`) | JSON | None | Y | Monthly, 15th | Minutes | Madad construction index tile | CBS open data[^20][^22] |
| **CBS API — Housing Price Index (Mehiron)** | `https://api.cbs.gov.il/index/data/price?id=130080&format=json` (confirm code via catalog — bi-monthly) | JSON | None | Y | Bi-monthly | Minutes | House price index tile | CBS open data[^20] |
| **CBS API — catalog tree (all indices)** | `https://api.cbs.gov.il/index/catalog/tree` | JSON/XML | None | Y | Static | N/A | Series code lookup | CBS open data[^20] |
| **CBS SDMX — unemployment, GDP** | `https://apis.cbs.gov.il/sdmx/data/oecd/stes/1?format=json` (OECD STES short-term indicators) | JSON | None | Y | Monthly/Quarterly | ~1–2 months | Unemployment rate tile | CBS open data[^23] |
| **CBS English homepage** | `https://www.cbs.gov.il/en/Pages/default.aspx` | HTML + Excel/CSV | None | Y | Per release | N/A | Publication links | CBS open data |
| **CBS Construction Starts & Building Permits** | Via CBS SDMX or Excel publication at `cbs.gov.il/en/Statistics/` (quarterly) | Excel/CSV | None | Y | Quarterly | ~45 days after quarter | Dwellings started tile | CBS open data[^24][^25] |

> **CPI note:** The Madad (מדד) as colloquially used by Israeli real estate investors refers to the **Construction Cost Index** (Madad Tashomet HaBniya), not the general CPI. Both are published by CBS monthly on the 15th. The Housing Price Index (Mehiron) is bi-monthly.[^20][^22][^26]

***

### Inflation Expectations

| Source | URL | Format | Auth | English | Cadence | Latency | Live Tile | License |
|--------|-----|--------|------|---------|---------|---------|-----------|---------|
| **BoI Inflation Expectations page** | `https://www.boi.org.il/en/economic-roles/statistics/` → "Inflation Expectations and Inflation Forecasts" | Excel/CSV via EDGE | None | Y | Monthly (survey) / Daily (breakeven from market) | 1 day | 12-month inflation expectations tile | Public domain |
| **BoI EDGE — Breakeven series** | `https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/IR/1.0/` (select breakeven/Galil-Shahar spread series) | CSV | None | Y | Daily | End-of-day | Breakeven inflation chart | Public domain |
| **Trading Economics** | `https://tradingeconomics.com/israel/inflation-expectations` | HTML | None | Y | Monthly | ~1 day | 1.70% (May 2026)[^27] | TE proprietary |
| **MoF Survey of Forecasters** | `https://mof.gov.il/hon` (Capital Market, Insurance and Savings Authority publications) | PDF/Excel | None | Y | Quarterly | ~1 month | Consensus forecaster range | Public domain |

***

### Pension Allocation — Gemel & Provident Fund Flows

| Source | URL | Format | Auth | English | Cadence | Latency | What It Powers | License |
|--------|-----|--------|------|---------|---------|---------|----------------|---------|
| **Gemelnet (CMA portal)** | `http://gemelnet.cma.gov.il` | HTML + downloadable Excel/CSV per fund | None (Hebrew portal) | **N** (Hebrew only) | Monthly returns; annual allocation breakdown | ~45 days after period | Fund-level return & allocation comparison | Public domain — Hebrew only[^28] |
| **Pensianet** | `https://pensianet.cma.gov.il` | HTML + Excel | None | **N** (Hebrew) | Monthly | ~45 days | Pension fund NAV and return | Public domain — Hebrew only |
| **Capital Market Authority (CMA / CMISA)** | `https://www.gov.il/en/departments/units/department_cma` | HTML + reports | None | Y (English summary only) | Semi-annual full report | ~3 months | Regulatory filings on insurance & pension | Public domain[^29] |
| **Doch Tkufati (Quarterly Report) — Form 5** | Via Maya TASE or Magna ISA: search TASE symbol for Harel (HARL), Phoenix (PHOE1), Clal (CLIS), Migdal (MDGL), Menora (MORA) | HTML/XML/PDF on Maya | None | **N** (Hebrew filings) | Quarterly (45 days after quarter-end) | ~45 days | Insurance nostro CRE allocation | TASE/ISA open disclosure[^15] |

> **Key Gemel/Insurance Data Caveat:** Fund-level alternative asset (real estate) allocations are buried in quarterly and annual reports filed on Maya/Magna, in Hebrew. There is no structured API for CRE sub-allocation. Recommended workflow: pull quarterly reports for the Big 5 insurance/pension houses (Harel, Phoenix, Clal, Migdal, Menora) from Maya, filter for "נדל"ן בחו"ל" (real estate abroad) line items.[^30][^31]

***

### Israeli Government Bond Yields — Additional Cross-Checks

| Source | URL | Format | Auth | English | Cadence | Latency | What It Powers | License |
|--------|-----|--------|------|---------|---------|---------|----------------|---------|
| **BoI Yield Curve paper/methodology** | `https://www.boi.org.il/boi_files/Statistics/mns0603e_a.pdf` | PDF | None | Y | Reference | N/A | Understanding zero-coupon curves | Public domain[^32] |
| **Investing.com Israel 2Y/5Y/10Y/30Y** | `https://www.investing.com/rates-bonds/israel-20-year-bond-yield` | HTML | None | Y | Real-time OTC | ~15 min | Yield monitor tiles | Investing.com ToS[^17] |
| **FRED IRLTLT01ILM156N** | `https://api.stlouisfed.org/fred/series/observations?series_id=IRLTLT01ILM156N&api_key={KEY}&file_type=json` | JSON | Free FRED key | Y | Monthly (OECD) | ~1 month | Historical 10Y series | CC0[^18] |

***

### Securities Disclosures — Maya (TASE) & Magna (ISA)

| Source | URL | Format | Auth | English | Cadence | Latency | What It Powers | License |
|--------|-----|--------|------|---------|---------|---------|----------------|---------|
| **Maya TASE — all company filings** | `https://maya.tase.co.il/en/reports/companies` | HTML/XML/XBRL/PDF | None | Y (English search available) | Real-time as filed | Minutes | Disclosure feed for Israeli REITs & insurance cos | TASE open disclosure[^33][^34] |
| **Magna ISA** | `https://magna.isa.gov.il` | HTML/XML/PDF/XBRL | None | Y (partial) | Real-time as filed | Minutes | Full issuer filings backup | ISA open disclosure[^15][^35] |
| **Magna — Key Filing Codes for Foreign RE:** | Form 5 = Doch Tkufati (quarterly); Form 20 = Annual Report (Doch Shnati); Form 6K equivalent = immediate reports; search term: "נדל"ן" or "נכסים בחו"ל" | HTML | None | Partial | Quarterly / Annual | 45 days / 3 months | CRE nostro allocation tracking | ISA open disclosure |

***

### Israeli REITs on TASE — Maya Equivalent of EDGAR

| Company | TASE Ticker | Maya Link | Market.tase.co.il | Sector |
|---------|------------|-----------|-------------------|--------|
| Azrieli Group | AZRG | `https://maya.tase.co.il/en/company/azrg` | Full data page | Mixed-use REIT / malls |
| Amot Investments | AMOT | `https://maya.tase.co.il/en/company/amot` | Full data page | Office / industrial |
| Reit 1 | REIT1 | `https://market.tase.co.il/en/market_data/security/01098920/major_data`[^36] | Full data page | Residential REIT |
| Sella Real Estate | SELL | `https://market.tase.co.il/en/market_data/security/01109644/major_data`[^37] | Full data page | Commercial RE |
| Mishorim Real Estate | MISH | `https://market.tase.co.il/en/market_data/security/1105196/major_data`[^38] | Full data page | Commercial RE |
| Big Shopping Centers | BIG | `https://maya.tase.co.il/en/company/big` | Full data page | Retail malls |
| Melisron | MLSR | `https://maya.tase.co.il/en/company/mlsr` | Full data page | Retail malls |

> All filings (quarterly, annual, immediate reports) are publicly accessible on Maya without authentication. Reports are filed in Hebrew with English summaries available for major issuers. XBRL-tagged financial statements are machine-readable.[^34][^33][^15]

***

### Macro Release Calendars

| Source | URL | Format | Auth | English | Cadence | What It Powers |
|--------|-----|--------|------|---------|---------|----------------|
| **BoI Rate Decision Dates 2026** | `https://www.boi.org.il/en/economic-roles/monetary-policy/interest-rate-announcement-dates-2026/` | HTML table | None | Y | Annual | Rate decision countdown tile[^11] |
| **CBS Release Schedule** | `https://www.cbs.gov.il/en/Statistics/` (release calendar linked per publication) | HTML | None | Y | Annual | CPI / housing data countdown tile |
| **BoI Financial Stability Report** | `https://www.boi.org.il/en/communication-and-publications/regular-publications/financial-stability/` | PDF (semi-annual) | None | Y | June + December | FSR narrative tile[^39][^40] |
| **IMF Israel SDDS+ calendar** | `https://dsbb.imf.org/sddsplus/dqaf-base/country/ISR/category/BOP00` | HTML | None | Y | Quarterly | BoP FDI release timing[^41] |
| **Semerenkogroup calendar summary** | `https://semerenkogroup.com/israel-2026-official-data-release-calendar-for-rates-and-inflation/` | HTML | None | Y | Annual | Quick reference calendar[^42] |

***

### USD/ILS Forwards & Option-Implied Volatility

| Source | URL | Format | Auth | English | Cadence | Note |
|--------|-----|--------|------|---------|---------|------|
| **BoI EDGE — FX derivatives / implied vol** | `https://edge.boi.gov.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/` → content field: "Risk and Volatility in Foreign Exchange Market" | CSV/XML | None | Y | Daily | BoI publishes implied vol derived from options market[^1] |
| **Bundesbank USD/ILS options research** | Historical academic reference — no live free feed[^43] | PDF | N/A | Y | Research | Reference only |
| **Bloomberg / LSEG** | Commercial terminals only | — | Paid | Y | Real-time | No free equivalent for live NDF/vol data |

> **Honest gap:** Free, live USD/ILS NDF forward rates and option-implied vol are **not available from any free endpoint**. The BoI EDGE warehouse has historical vol statistics. For live vol, a Bloomberg terminal or LSEG Workspace subscription is required. Approximate NDF pricing can be inferred from the BoI interest rate differential + CIP adjustment as a proxy.

***

### BoI Balance of Payments & Money Aggregates

| Data Product | URL / EDGE Series | Format | Cadence | English | License |
|-------------|-------------------|--------|---------|---------|---------|
| **BoP Quarterly Tables (incl. outbound RE FDI)** | `https://www.boi.org.il/en/economic-roles/statistics/external-sector/the-economy-s-balance-of-payments/` + EDGE series `BOP` | Excel/CSV | Quarterly, ~45 days lag[^44][^41] | Y | Public domain |
| **M1 / M2 Money Aggregates** | `https://www.boi.org.il/en/economic-roles/statistics/money-and-debt-aggregates/monetary-aggregates/` + EDGE series `M1`, `M2` | CSV/Excel | Monthly | Y | Public domain[^45] |
| **Banking System Statistics** | `https://www.boi.org.il/en/economic-roles/statistics/` → Banking section | Excel/CSV | Monthly | Y | Public domain |
| **Financial Stability Report (semi-annual)** | `https://www.boi.org.il/en/communication-and-publications/regular-publications/financial-stability/` | PDF | June + December | Y | Public domain[^39][^46][^47] |
| **EDGE Data Browser (all series)** | `https://edge.boi.gov.il/FusionDataBrowser` | Interactive + CSV/Excel/SDMX-JSON | Real-time intraday | Bilingual | Public domain[^48][^8] |

> The **EDGE data warehouse** at `edge.boi.gov.il` is the single most powerful free Israeli financial data endpoint. It exposes virtually all BoI statistical series (exchange rates, interest rates, monetary aggregates, BoP, banking stats, yield curves) via a standardized SDMX v2 REST API with CSV, Excel, XML, and SDMX-JSON output formats, no authentication required.[^8][^9][^7]

***

### English News Bridges — RSS Confirmation

| Outlet | RSS Available | RSS URL | Note |
|--------|--------------|---------|------|
| **Globes English** | **YES** | `https://en.globes.co.il/WebService/rss/rssfeeds.aspx?cat=1` (main) + per-category feeds incl. real estate[^49][^50] | RSS 2.0; full English CRE + markets coverage |
| **CTech (Calcalist)** | **YES** | `https://www.calcalistech.com/rss/` (standard WordPress-style endpoint)[^51][^52] | English; Israel tech focus; business/economy overlap |
| **Times of Israel** | **YES** | `https://www.timesofisrael.com/feed/`[^53] | Full-site RSS; business section: `https://www.timesofisrael.com/business/feed/` |
| **Israel Hayom Business** | **Partial** | No dedicated English business RSS confirmed; primary site is Hebrew | English content at israelhayom.com/category/business/ — RSS endpoint not confirmed |

***

## Part A — 8 Highest-Signal Tiles for a Tel Aviv Family-Office Principal

These eight data points, rendered live on the dashboard welcome mat, will immediately signal to an Israeli investor that the platform was built for them:

1. **BoI Interest Rate tile** — Shows 3.75% (cut 25 bps, 25 May 2026) with the next decision date (6 Jul 2026) as a countdown. Powers every mortgage and cap-rate conversation. Source: `boi.org.il/PublicApi/GetInterest` (JSON, zero-auth, real-time on decision day).[^7][^1]

2. **USD/ILS spot with 1-day, 1-week, 1-year change** — The shekel is at ~2.87, its strongest level since 1993, a 20%+ appreciation over 12 months. Every Israeli investor is mentally converting USD asset values to NIS. Source: BoI representative rate JSON (authoritative) + Yahoo Finance ILS=X (intraday fill).[^2]

3. **TA-35 & TA-125 index levels** — TASE up 71%+ YoY. The psychological anchor: when Israeli equity wealth is up, US CRE appetite rises. Source: Yahoo Finance yfinance (free, 15-min delay) or TradingView embed.[^13]

4. **Israeli CPI (Madad) YoY %** — April 2026: 1.9%, within the 1–3% target band for nine consecutive months. Directly linked to Galil bond yields and construction contract escalation clauses. Source: CBS API `api.cbs.gov.il/index/data/price?id=120010`.[^54]

5. **Shahar 10Y yield + Galil 10Y breakeven** — Current Israel 10Y ~3.85%. The breakeven spread (Galil vs. Shahar) is the market's real-time inflation gauge and anchors cap-rate discussions. Source: BoI EDGE series + Investing.com backup.[^19]

6. **TA-Real Estate 35 index** (launched Nov 2025) — The new 35-stock Israeli RE equity benchmark. A sophisticated Israeli family office tracks this as a proxy for domestic RE confidence. Source: TASE market page (HTML scrape or TradingView embed).[^16]

7. **Construction Cost Index (Madad Tashomet HaBniya)** — April 2026: 142.6 points, +3.0% YoY. Every Israeli investor buying pre-construction US assets knows this index by name. The dashboard showing it builds instant credibility. Source: CBS API.[^26]

8. **Israel Inflation Expectations (12-month)** — May 2026: 1.70%, down from 2.3% in March. BoI rate-cut catalyst and shekel-strength signal. Source: BoI EDGE breakeven series or Trading Economics HTML scrape.[^27]

***

## Part B — Data Sources Behind a Paywall and Cheapest Entry

| Data | Paywall | Cheapest Entry |
|------|---------|----------------|
| **TASE real-time market data (JSON API)** | TASE Data Hub requires commercial subscription[^12] | Free workaround: Yahoo Finance yfinance Python library (unofficial, 15-min delay) or TradingView widget embed; for production, TASE Data Hub starter tier or iTick API[^55] |
| **USD/ILS live NDF forwards & implied vol** | Bloomberg / LSEG only | No free source; proxy with BoI EDGE historical vol series; budget ~$500–$2,000/mo for Bloomberg/LSEG feed |
| **Insurance Nostro CRE allocation (structured)** | No structured machine-readable free source; reports exist but are Hebrew PDFs | Pull quarterly Doch Tkufati from Maya for Big 5 insurers (free, Hebrew), parse with LLM; or subscribe to Fitch Connect / S&P Capital IQ for structured allocation tables (~$10k+/yr) |
| **Gemel fund asset allocation (machine-readable)** | gemelnet.cma.gov.il is free but Hebrew-only, no API | Scrape/translate Hebrew Excel downloads; alternatively GamalPlus app data; no cheaper structured API exists |
| **Intraday TASE tick data** | ICE Data Services / Bloomberg[^56] | iTick API has TASE coverage with paid tiers; Twelve Data has some TASE coverage at lower price points[^57] |
| **BoI/IMF FX options vol (GARCH historical)** | Research papers only[^58] | BoI EDGE publishes some vol metrics; Deutsche Bundesbank research provides historical USD/ILS option vol datasets for academic use[^43] |

***

## Part C — Data-License Risk Note

The BoI, CBS, and Israeli government datasets (EDGE warehouse, representative exchange rates, CPI API, monetary aggregates) are published as **public domain / government open data** under Israeli law and the IMF SDDS+ framework, and carry no meaningful redistribution risk for a financial terminal. However, two material license risks exist. First, **TASE market data** (index levels, security prices) is proprietary to the Tel Aviv Stock Exchange under the TASE Data Regulations; displaying real-time or delayed TASE prices without a Data Hub license agreement constitutes a terms-of-service violation, even via Yahoo Finance yfinance — any production deployment must execute a TASE Data Hub commercial agreement. Second, **Maya and Magna disclosures** (PDFs, XBRLs, company reports) are publicly accessible for read/display purposes but systematic bulk redistribution of filing content may trigger ISA regulations on unauthorized data aggregation; the ISA's Innovation Authority pilot program provides a path to licensed API access for qualifying fintechs. Third, Yahoo Finance's terms explicitly prohibit automated scraping and commercial redistribution of its data — it is acceptable for internal prototyping but not for a production client-facing terminal. The safest architecture layers BoI EDGE (zero-license-risk) for FX and macro, a licensed TASE Data Hub subscription for index tiles, CBS open API for CPI and construction indices, and Hebrew-parsed Maya filings for pension/insurance nostro intelligence.[^21][^35][^12][^8][^7]

---

## References

1. [Bank of Israel](https://www.boi.org.il/en/) - Contributing to the prosperity of Israel and the welfare of its citizens · The Monetary Committee de...

2. [Israeli Shekel - Quote - Chart - Historical Data - News](https://tradingeconomics.com/israel/currency) - The USD/ILS exchange rate fell to 2.8744 on May 26, 2026, down 0.13% from the previous session. Over...

3. [ExchangeRate-API Pricing & Best Alternative (2026) - CurrencyFreaks](https://currencyfreaks.com/blog/ExchangeRate-Api-Pricing-Alternative) - Paid plans start at $13.99/month, while the free plan allows 1500 API calls per month. What Is the B...

4. [Frankfurter | Free exchange rates API](https://frankfurter.dev) - Free, open-source exchange rates API sourcing from 82 central banks. Current and historical rates fo...

5. [Frankfurter Currency Exchange Rates API - Formula Bot](https://www.formulabot.com/datasets/frankfurter-currency) - The API is free, open-source, requires no authentication, and has no usage limits. What You Can Do. ...

6. [Euro foreign exchange reference rates - European Central Bank](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) - The reference rates are usually updated at around 16:00 CET every working day, except on TARGET clos...

7. [שאלות ותשובות על השימוש באתר החדש | בנק ישראל](https://boi.org.il/qawebsite/) - ניתן לצרוך את השערים בפורמט XML בכתובת: Boi.org.il/PublicApi/GetExchangeRates?asXML=true. עוד. לאן נ...

8. [[PDF] Bank Of Israel Extracting representative exchange rates from the ...](https://www.boi.org.il/media/tzxbuhhj/extracting-representative-exchange-rates-from-the-new-series-database.pdf) - This explanation is with regard to the representative exchange rates, but it can be drawn upon for i...

9. [[PDF] Bank Of Israel Extracting series from the new series database](https://www.boi.org.il/media/zodneksc/extracting-series-from-the-new-series-database-representative-exchange-rates-example.pdf) - Choose the exchange rate content field: Page 3. Bank Of Israel. Choose specific series: If nothing i...

10. [Central bank policy rates - overview | BIS Data Portal](https://www.bis.org/statistics/cbpol.htm) - The central bank policy rates data set features long time series for more than 40 advanced and emerg...

11. [2026 Interest rate announcement dates - בנק ישראל](https://www.boi.org.il/en/economic-roles/monetary-policy/interest-rate-announcement-dates-2026/) - 2026 Interest rate announcement dates. ​​​These announcements will be published at 16:00 in the resp...

12. [TASE Data Hub: The Tel-Aviv Stock Exchange is Launching a Data ...](https://www.prnewswire.com/news-releases/tase-data-hub-the-tel-aviv-stock-exchange-is-launching-a-data-system-that-allows-for-the-first-time-direct-immediate-and-seamless-access-to-tase-market-data-301135641.html) - TASE Data Hub will offer, through the smart money product, novel information on the activities of th...

13. [TA35 Index Charts and Quotes - TradingView](https://www.tradingview.com/symbols/TASE-TA35/) - View live TA-35 Index chart to track latest index dynamics. TASE:TA35 ideas, forecasts and market ne...

14. [TA-Investment Properties in Israel Major Data | TASE Site](https://market.tase.co.il/en/market_data/index/182/major_data) - View key market data for TA-Investment Properties in Israel, including last index value, turnover, p...

15. [[PDF] israel-28-february-2018.pdf - IFRS Foundation](https://www.ifrs.org/content/dam/ifrs/publications/jurisdictions/filing-profiles/israel-28-february-2018.pdf) - Files are publicly available on the Tel Aviv Stock Exchange website (maya.tase.co.il) and on the ISA...

16. [TASE Launches a New Index for Israel's Major Real Estate Companies](https://finance.yahoo.com/news/tase-launches-index-israels-major-120000684.html) - Since the beginning of 2025, the TA-Real Estate index increased by 36%. The new index will be launch...

17. [Israel 20-Year Bond Yield - Investing.com](https://www.investing.com/rates-bonds/israel-20-year-bond-yield) - Israel 20-Year Bond Yield ; Prev. Close. 4.084 ; Day's Range: 4.082 ; 52 wk Range: 3.636 ; Price: 11...

18. [Interest Rates: Long-Term Government Bond Yields: 10-Year: Main ...](https://fred.stlouisfed.org/series/IRLTLT01ILM156N) - Graph and download economic data for Interest Rates: Long-Term Government Bond Yields: 10-Year: Main...

19. [Israel 10-Year Government Bond Yield - Quote - Chart - Historical Data](https://tradingeconomics.com/israel/government-bond-yield) - Israel 10 Year Government Bond Yield decreased to 3.67%, the lowest since July 2023. Over the past 4...

20. [מדדי מחירים באמצעות API - הלשכה המרכזית לסטטיסטיקה](https://www.cbs.gov.il/he/Pages/%D7%9E%D7%93%D7%93%D7%99-%D7%9E%D7%97%D7%99%D7%A8%D7%99%D7%9D-%D7%91%D7%90%D7%9E%D7%A6%D7%A2%D7%95%D7%AA-API.aspx) - הנחיות למשיכת מדדים באמצעות ממשק ה-API. ה-API מספק סט פקודות שבאמצעותו ניתן למשוך את רשימת הנושאים ש...

21. [CBS Site - API interface](https://www.cbs.gov.il/en/Pages/Api-interface.aspx?fireglass_rsn=true) - An application that the public uses to retrieve data from the CBS databases automatically, convenien...

22. [What is the Construction Cost Index? - Buyitinisrael](https://www.buyitinisrael.com/guide/what-is-the-construction-cost-index/) - The Construction Cost Index (also known as the Construction Input Index) reflects estimated changes ...

23. [CBS Site - Api-SDMX](https://www.cbs.gov.il/en/Pages/Api-SDMX.aspx) - Instructions for Retrieving Time Series in SDMX Format Using the API ; To retrieve OECD series data ...

24. [Not just Tel Aviv: which Israeli city led in new housing starts this year?](https://www.ynetnews.com/real-estate/article/sk5avn9ole) - Israel's housing market saw a rise in new construction starts and building permits from July 2024–Ju...

25. [Israel Dwellings Started - Trading Economics](https://tradingeconomics.com/israel/housing-starts) - Israel Dwellings Started ; Building Permits, 13202.00, Units ; Home Ownership Rate, 68.00, percent ;...

26. [Israel Madad Index 2026: History Table + Payment Calculator | Adesco](https://www.adesco.co.il/madad-index-israel) - The Israel Madad index is 142.6 as of April 2026 - up 3.0% over the past 12 months. Full monthly his...

27. [Israel Inflation Expectations - Trading Economics](https://tradingeconomics.com/israel/inflation-expectations) - Inflation Expectations in Israel increased to 1.70 percent in May from 1.60 percent in April of 2026...

28. [גמל נט - מערכת להשוואת קופות גמל](http://gemelnet.cma.gov.il) - במערכת להשוואת קופות גמל תוכלו לקבל מידע מפורט אודות תשואות קופות הגמל הפועלות בישראל, להשוות ביניהן...

29. [The Capital Market, Insurance and Savings Authority - Gov.il](https://www.gov.il/en/departments/units/department_cma) - The Capital Market, Insurance and Savings Authority oversees financial services in the insurance, pe...

30. [What is Competitive Landscape of Harel Insurance Investments ...](https://portersfiveforce.com/blogs/competitors/harel-group) - Founded in 1935, Harel has grown into Israel's second-largest insurance and financial group by gross...

31. [Israel Life And Non-Life Insurance Company List - Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/life-non-life-insurance-market-in-israel/companies) - Top 5 Israel Life And Non-Life Insurance Companies · Harel Insurance Investments & Finance Services ...

32. [[PDF] The Estimation of Nominal and Real Yield Curves from Government ...](https://www.boi.org.il/boi_files/Statistics/mns0603e_a.pdf) - The Bank of Israel uses the CPI curve for the derivation of market expected inflation. The zero-coup...

33. [Companies Disclosures - מאיה](https://maya.tase.co.il/en/reports/companies) - Gain insights with real time financial data and comprehensive financial disclosure. Stay ahead with ...

34. [Today's Companies Financial Disclosures | MAYA - TASE Site](https://maya.tase.co.il/en/) - Discover timely updates on the stock market today. Explore reports on publicly listed companies for ...

35. [Pilot Program with the Israel Securities Authority - 2nd Call for ...](https://innovationisrael.org.il/en/calls_for_proposal/pilot-program-with-the-israel-securities-authority-2nd-call-for-proposals/) - Assistance will include access to public MAGNA (Electronic Public Disclosure System) reports' databa...

36. [Shares:REIT 1 01098920 Major Data | TASE Site](https://market.tase.co.il/en/market_data/security/01098920/major_data) - View key market data for REIT 1, including last price, high, low, turnover, market cap., yields, and...

37. [Shares:SELLA REAL EST 01109644 Major Data | TASE Site](https://market.tase.co.il/en/market_data/security/01109644/major_data) - View key market data for SELLA REAL EST, including last price, high, low, turnover, market cap., yie...

38. [Shares:MISHORIM 01105196 Major Data | TASE Site](https://market.tase.co.il/en/market_data/security/1105196/major_data) - View key market data for MISHORIM, including last price, high, low, turnover, market cap., yields, a...

39. [Financial Stability Reports | בנק ישראל](https://www.boi.org.il/en/communication-and-publications/regular-publications/financial-stability/) - The first semiannual report is a full report containing an analysis of all exposure channels and pot...

40. [Financial Stability Report for the first half of 2024 | בנק ישראל](https://www.boi.org.il/en/communication-and-publications/regular-publications/financial-stability/financial-stability-report-for-the-first-half-of-2024/) - The Financial Stability Report for the first half of 2024 reviews the financial developments during ...

41. [Israel - Balance of payments - Dissemination Standards Bulletin Board](https://dsbb.imf.org/sddsplus/dqaf-base/country/ISR/category/BOP00) - Direct investment. The main source is the direct reporting of companies who report directly to Bank ...

42. [Bank Of Israel 2026 Calendar: Rates, CPI & Housing Data](https://semerenkogroup.com/israel-2026-official-data-release-calendar-for-rates-and-inflation/) - Planned rate decision dates in 2026 (all at 16:00 Israel time):. 5 January 2026 (Monday); 26 Februar...

43. [[PDF] Evidence from the USD/ILS options market](https://www.bundesbank.de/resource/blob/890030/b78ad69b10d3d5f34faa1b2e8bf1771f/mL/2022-06-07-dkp-20-appendix-data.pdf) - The BF spread measures the difference between the average implied volatility of two. (e.g. 10-∆) opt...

44. [The Economy's Balance of Payments - בנק ישראל](https://www.boi.org.il/en/economic-roles/statistics/external-sector/the-economy-s-balance-of-payments/) - The balance of payments reflects economic transactions made between the economy and other economies ...

45. [Monetay Aggregates | בנק ישראל](https://www.boi.org.il/en/economic-roles/statistics/money-and-debt-aggregates/monetary-aggregates/) - Monetary aggregates are broad measures of how much money exists in the economy. Broad money is the m...

46. [Financial Stability Report for the second half of 2024 - בנק ישראל](https://www.boi.org.il/en/communication-and-publications/regular-publications/financial-stability/financial-stability-report-for-the-second-half-of-2024/) - To the Full report. Key Points: The financial system in Israel is showing high resilience against th...

47. [Financial Stability Report for the second half of 2024 - בנק ישראל](https://www.boi.org.il/en/communication-and-publications/press-releases/11-2-25a-en/) - The Financial Stability Report for the second half of 2024 reviews the financial developments during...

48. [The Bank of Israel's new website - בנק ישראל](https://boi.org.il/en/the-bank-of-israel-s-new-website/) - Economic data, such as interest rates, exchange rates, and so forth, now have a new format on the si...

49. [Globes via RSS](https://en.globes.co.il/en/article-globes-online-via-rss-850820) - Globes RSS feeds (RSS 2.0 format). Click on the orange button for each RSS feed you require. This wi...

50. [Top 20 Israel News RSS Feeds](https://rss.feedspot.com/israel_news_rss_feeds/) - Globes RSS Feed. Globes RSS Feed en.globes.co.il/WebServic.. Follow RSS Website en.globes.co.il/en. ...

51. [RSS - CTech](https://www.calcalistech.com/tags/RSS) - RSS - Looking for information on RSS? All the information, articles, latest news and analysis on RSS...

52. [CTech | Ctech](https://www.calcalistech.com) - CTech - Israeli Tech and Start up News. ... calcalist logo dots. Hot Topics: AI| · Cybersecurity| · ...

53. [RSS - The Times of Israel](https://www.timesofisrael.com/feed/) - No information is available for this page. · Learn why

54. [Israel Inflation Rate - Trading Economics](https://tradingeconomics.com/israel/inflation-cpi) - Inflation Rate in Israel remained unchanged at 1.90 percent in April. Inflation Rate in Israel is ex...

55. [TASE Israel Stock API Guide: Python Tutorial for Real-Time Data ...](https://blog.itick.org/en/stock-api/tase-israel-stock-api-python-tutorial) - iTick, a specialized financial data provider, offers real-time market data API solutions with compre...

56. [Tel-Aviv Stock Exchange (TASE) | ICE Developer Portal](https://developer.ice.com/fixed-income-data-services/catalog/tel-aviv-stock-exchange-tase) - Enrich front office systems with ICE's Data API solution, providing intraday access to fixed income ...

57. [Tel Aviv Stock Exchange Ltd. (TASE) - Overview - Twelve Data](https://twelvedata.com/markets/684453/stock/tase/tase) - Comprehensive market data for Tel Aviv Stock Exchange Ltd. (TASE). Explore various metrics, charts, ...

58. [[PDF] Bank of Israel Research Department](https://www.boi.org.il/media/rpoff42p/dp202210e.pdf) - Using confidential daily data, we analyze how the intervention episode of the Bank of Israel (BOI) f...

