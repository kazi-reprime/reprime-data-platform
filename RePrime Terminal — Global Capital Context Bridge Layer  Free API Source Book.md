# RePrime Terminal — Global Capital Context Bridge Layer: Free API Source Book

**Owner:** Gideon Menachem Gratsiani · RePrime Group  
**Date:** May 26, 2026  
**Scope:** All free-endpoint-grade sources for the US ↔ Israel capital bridge layer — FX, equities, REIT indices, rates/yields, commodities, volatility, spreads, market calendars, REIT tickers, and mortgage rates.  
**Status:** v1.0 — production reference for engine plumbing.

***

## Master Reference Table

> Grouped by category. Columns: **Source | Exact Endpoint URL | Free-Tier Rate Limit | Real-Time vs Delayed | Format | Auth | Commercial Redistribution** | **Latency / Update** | **Tile or Sparkline Powered**

***

### CATEGORY A — FX (Foreign Exchange)

| Source | Exact Endpoint URL | Free-Tier Rate Limit | RT vs Delayed | Format | Auth | Commercial Redist. | Update Cadence | Tile Powered |
|---|---|---|---|---|---|---|---|---|
| **Frankfurter v2** (ECB-backed) | `https://api.frankfurter.dev/v2/rates?base=USD&symbols=ILS,EUR,GBP` | **Unlimited** (rate-limited to prevent abuse; no monthly cap)[^1] | EOD — ECB publishes ~16:00 CET daily[^2] | JSON | None[^1] | **No** — ECB reference data; non-commercial redistribution only[^1] | Daily business days | USD/ILS, USD/EUR, USD/GBP tiles |
| **Frankfurter v1** (legacy, still active) | `https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS,EUR,GBP` | Unlimited[^3] | EOD | JSON | None[^3] | No | Daily | Sparkline fallback |
| **exchangerate.host** | `https://api.exchangerate.host/live?source=USD&currencies=ILS,EUR,GBP` | Not explicitly capped; EOD data at 00:05 GMT[^4] | EOD (prior day)[^4] | JSON | API key (free tier) | Verify TOS — sourced from ECB + banks[^5] | Daily | USD/ILS secondary source |
| **ExchangeRate-API free** | `https://v6.exchangerate-api.com/v6/{KEY}/latest/USD` | **1,500 req/month**; base must be USD on free tier[^6] | EOD (24h refresh)[^6] | JSON | API key (free signup) | No commercial redistribution on free tier[^6] | Daily | USD/ILS, USD/EUR fallback |
| **Open Exchange Rates free** | `https://openexchangerates.org/api/latest.json?app_id={KEY}&symbols=ILS,EUR,GBP` | **1,000 req/month**, USD base only on free[^7] | Hourly refresh[^7] | JSON | App ID (free signup)[^7] | No | Hourly | USD/ILS hourly tile |
| **Fixer.io free tier** | `http://data.fixer.io/api/latest?access_key={KEY}&symbols=ILS,EUR,GBP` | **100 req/month**[^8] | Hourly[^8] | JSON | API key | No | Hourly | Backup only — too limited for always-on |
| **Yahoo Finance (unofficial)** — FX | `https://query1.finance.yahoo.com/v8/finance/chart/ILS=X?interval=1d&range=5d` | Throttled (no official limit — informal ~2,000 req/day before 429)[^9][^10] | ~15 min delayed[^11] | JSON | None (crumb/cookie sometimes required)[^9] | **No** — ToS prohibits redistribution[^10] | ~15 min | USD/ILS live tile (primary unofficial source) |
| **Yahoo Finance** — USD/ILS quote | `https://query1.finance.yahoo.com/v8/finance/chart/ILS=X` | See above | ~15 min delayed[^11] | JSON | None | No | ~15 min | USD/ILS sparkline |
| **Stooq free CSV** — USD/ILS | `https://stooq.com/q/d/l/?s=usdils&i=d` | Unofficial, no stated limit; polite use ~100–500/day[^12][^13] | EOD[^12] | CSV | None | Unclear — Polish service, ToS ambiguous | EOD | USD/ILS historical charting |
| **Bank of Israel (BOI) — Official** | `https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/EXR/1.0/?c%5BDATA_TYPE%5D=OF00&format=csv` | **Unlimited — official government API**[^14] | Published ~3:30 PM Israel Time (15:30 IST)[^14] | XML / CSV / JSON[^14] | None[^14] | **Yes — government open data** | Daily (1× business day)[^14] | USD/ILS **authoritative** reference tile |
| **Bank of Israel — XML live feed** | `https://www.boi.org.il/PublicApi/GetExchangeRates?asXml=true` | Unlimited[^14] | ~15 min post-publication revision (3:45 PM IST)[^14] | XML | None | Yes | Daily + intra-day revision | USD/ILS ticker with IST timestamp |
| **CoinGecko** (for crypto cross-pairs) | `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,ils` | **30 calls/min, 10,000 calls/month** (with free demo key)[^15] | ~seconds[^15] | JSON | Free API key[^15] | No redistribution on free tier | ~real-time | BTC/ILS, ETH/ILS bridge cross |

***

### CATEGORY B — Equities and ETFs (Stock Quote APIs)

| Source | Endpoint URL | Free Limit | RT vs Delayed | US Equity | Israeli Equity | ETF | REIT Coverage | Auth | Notes |
|---|---|---|---|---|---|---|---|---|---|
| **Yahoo Finance v8 quote** | `https://query1.finance.yahoo.com/v8/finance/quote?symbols=VNQ,IYR,REM,MORT,SPY,QQQ` | ~2,000 req/day informal[^16] | ~15 min delayed | ✅ | ✅ (TASE via `.TA` suffix) | ✅ | ✅ Full | None / cookie | Unofficial; crumb auth sometimes triggered[^9] |
| **Yahoo Finance v8 chart** | `https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=1y` | Same as above | ~15 min | ✅ | ✅ | ✅ | ✅ | None | Best for OHLCV sparklines; supports ILS=X, ^VIX, ^MOVE |
| **Stooq CSV** | `https://stooq.com/q/d/l/?s={ticker}&i=d` (e.g., `s=vnq.us`) | No stated limit; informal ~200–500/day[^13] | EOD | ✅ | Limited | ✅ | ✅ | None | Good for S&P 500 (`^spx`), Nasdaq (`^ndq`); EOD only |
| **Twelve Data free** | `https://api.twelvedata.com/quote?symbol={TICKER}&apikey={KEY}` | **800 API credits/day** (~8 calls on real-time)[^17] | 15 min delayed on free | ✅ | Limited | ✅ | ✅ | Free API key[^17] | Solid for US ETFs; limited Israeli access |
| **Alpha Vantage free** | `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={TICKER}&apikey={KEY}` | **25 calls/day**[^18] | EOD + some RT delayed | ✅ | No | ✅ | ✅ | Free API key[^19] | Very restrictive limit; premium at $49.99/mo |
| **Marketstack free** | `http://api.marketstack.com/v1/eod?access_key={KEY}&symbols={TICKER}` | **100 req/month** EOD only[^20] | EOD | ✅ | No | Limited | Limited | Free key[^20] | Too limited for always-on dashboard |
| **Polygon.io free** | `https://api.polygon.io/v2/aggs/ticker/{TICKER}/prev?apiKey={KEY}` | **Unlimited historical** (prior-day close); real-time requires paid[^18] | EOD on free | ✅ | No | ✅ | ✅ | Free key | Excellent for EOD; real-time = $29/mo |
| **IEX Cloud** | N/A — **SHUT DOWN August 31, 2024**[^21][^22] | — | — | — | — | — | — | — | Do not use; migrated users to Bluesky API[^23] |
| **EOD Historical Data free** | `https://eodhistoricaldata.com/api/real-time/{TICKER}?api_token=demo` | Demo key: limited tickers only[^24] | EOD | ✅ | ✅ (TASE) | ✅ | ✅ | Free demo key | Demo key is `demo`; good TASE coverage on paid tiers |
| **Finnhub free** | `https://finnhub.io/api/v1/quote?symbol={TICKER}&token={KEY}` | **60 calls/min** (free tier)[^25] | Real-time US; 15 min delayed otherwise[^26] | ✅ | Limited | ✅ | ✅ | Free API key[^27] | Best free real-time US equity option among keyed APIs |
| **Tiingo free** | `https://api.tiingo.com/tiingo/daily/{TICKER}/prices?token={KEY}` | **500 unique symbols/month; 50 req/hour**[^28][^29] | EOD | ✅ | No | ✅ | ✅ | Free API key | $30/mo individual; $50/mo commercial[^28] |

***

### CATEGORY C — REIT Index Providers

| Index | Free Resource | URL | Format | Update | Coverage |
|---|---|---|---|---|---|
| **FTSE Nareit All Equity REITs** | Monthly Factsheet PDF | `https://research.ftserussell.com/Analytics/FactSheets/Home/DownloadSingleIssue?issueName=FNER&isManual=False`[^30] | PDF | Monthly[^31] | All equity REIT sectors |
| **FTSE Nareit All REITs Daily Returns** | Daily PDF | `https://www.reit.com/sites/default/files/returns/DomesticReturns.pdf`[^32] | PDF | Daily[^32] | Full Nareit family |
| **FTSE Nareit Summary** | Monthly Summary PDF | `https://www.reit.com/sites/default/files/returns/sum.pdf`[^31] | PDF | Monthly[^31] | Total returns by sector |
| **FTSE Nareit Media Factsheet** | Latest factsheet | `https://www.reit.com/sites/default/files/2026-01/MediaFactSheet_Dec-2025.pdf`[^33] | PDF | Monthly | Index-level performance |
| **MSCI US REIT Index** | Factsheet | `https://www.msci.com/www/fact-sheet/msci-us-reit-index/07851608`[^34] | PDF | Monthly | Equity REITs, free-float weighted[^35] |
| **MSCI US REIT Constituent Changes** | Public list PDF | `https://app2.msci.com/eqb/reit/MSCI_Feb26_USREITPublicList.pdf`[^36] | PDF | Per rebalance | Additions/deletions |
| **S&P Dow Jones REIT indices** | Via FRED `SP500-60010` series | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=SP500-60010` | CSV | Daily | S&P 500 Real Estate sector |
| **Bloomberg REIT index** | Not free — Bloomberg Terminal only | — | — | — | No free structured endpoint |
| **FTSE Russell (Russell 2000/3000)** | Factsheet search portal | `https://research.ftserussell.com/Analytics/FactSheets/Home/Search/`[^37] | PDF | Monthly[^38] | Russell 2000, 3000, REIT subindices |
| **Russell 3000 Factsheet** | Direct PDF | `https://research.ftserussell.com/Analytics/FactSheets/temp/889a7a8d-b35d-4a8f-b84c-590572d12024.pdf`[^38] | PDF | Monthly | ~98% US investable market[^38] |

> **Structured download note:** FTSE Nareit and MSCI do not offer a free JSON/REST API for index levels. For a machine-readable time series, use Yahoo Finance tickers: `^FNER` (FTSE Nareit Equity REITs), `^RMZ` (MSCI US REIT), or proxy ETFs `VNQ`, `IYR`, `REM`, `MORT` via the Yahoo v8 chart endpoint.

***

### CATEGORY D — US Treasury Yields and SOFR

| Series | URL | Format | Auth | Update | Notes |
|---|---|---|---|---|---|
| **US Treasury Daily Yield Curve XML (all)** | `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/pages/xml?data=daily_treasury_yield_curve&field_tdr_date_value=all`[^39] | XML | None | Daily ~6 PM ET[^40] | Par yield curve 1990–present; 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y[^40] |
| **US Treasury Yield XML (today only)** | `https://home.treasury.gov/sites/default/files/interest-rates/yield.xml`[^39] | XML | None | Daily | Latest rates only; fastest to parse for live tile |
| **FRED DGS10 (10Y)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10`[^41] | CSV | Free API key (optional)[^42] | Daily | 10-Year constant maturity Treasury yield |
| **FRED DGS2 (2Y)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS2` | CSV | Free API key | Daily | 2-Year yield — used for US10Y–US2Y spread |
| **FRED DGS30 (30Y)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS30` | CSV | Free API key | Daily | 30-Year yield |
| **FRED MORTGAGE30US** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE30US`[^43] | CSV | Free API key | Weekly (Thursday)[^44] | 30-year fixed mortgage average |
| **FRED H.15 (all maturities)** | `https://www.federalreserve.gov/releases/h15/summary/` | HTML + CSV | None | Daily | Fed Board's own H.15 release |
| **SOFR — NY Fed official** | `https://www.newyorkfed.org/markets/reference-rates/sofr`[^45] | Web/CSV | None | Daily ~8 AM ET[^45] | Overnight SOFR rate; primary source |
| **FRED SOFR series** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=SOFR` | CSV | Free API key | Daily | SOFR via FRED — T+1 lag |
| **FRED SOFR Averages/Index** | `https://alfred.stlouisfed.org/release?rd=2025-01-23&rid=483`[^46] | JSON/CSV | Free API key | Daily | 30/90/180-day compounded averages |

***

### CATEGORY E — Commodities

#### E1 — Gold and Precious Metals

| Source | URL | Format | Auth | Update | Notes |
|---|---|---|---|---|---|
| **FRED GOLDAMGBD228NLBM** (London PM fix in USD) | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=GOLDAMGBD228NLBM` | CSV | Free key | Daily | LBMA gold PM fix in USD; most reliable free source[^47] |
| **LBMA gold PM JSON** (direct from lbma.org.uk) | `https://prices.lbma.org.uk/json/gold_pm.json`[^48] | JSON | None | Daily (PM auction) | USD, GBP, EUR; free but unofficial direct URL[^48] |
| **World Gold Council API** | `https://fsapi.gold.org/api/goldprice/v11/chart/price/usd/oz/{timestamp_start},` | JSON | None (unofficial) | Daily[^49] | Historical gold prices; as of March 2025, LBMA data removed from WGC website[^49] — use FRED instead |
| **Yahoo Finance Gold** | `https://query1.finance.yahoo.com/v8/finance/chart/GC=F` | JSON | None | 15 min delayed | Gold futures continuous contract |

#### E2 — Crude Oil and Natural Gas

| Source | URL | Format | Auth | Update | Notes |
|---|---|---|---|---|---|
| **EIA API — WTI Spot Price** | `https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key={KEY}&frequency=daily&data=value&facets[series][]=RWTC` | JSON | Free EIA key (no cost)[^50] | Daily/weekly | Authoritative WTI spot price |
| **EIA API — Brent Spot Price** | Same endpoint; series = `RBRTE` | JSON | Free EIA key | Daily | Authoritative Brent spot price[^51] |
| **FRED DCOILWTICO (WTI)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILWTICO` | CSV | Free key | Daily | WTI via FRED; T+1 lag vs EIA |
| **FRED DCOILBRENTEU (Brent)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILBRENTEU` | CSV | Free key | Daily | Brent crude via FRED |
| **Henry Hub Nat Gas — FRED** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DHHNGSP` | CSV | Free key | Daily | Henry Hub natural gas spot price |
| **Yahoo Finance WTI** | `https://query1.finance.yahoo.com/v8/finance/chart/CL=F` | JSON | None | 15 min | WTI front-month futures |

#### E3 — Metals, Lumber, and Other Commodities

| Source | URL | Format | Auth | Update | Notes |
|---|---|---|---|---|---|
| **FRED PCOPPUSDM (Copper, monthly)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=PCOPPUSDM`[^47] | CSV | Free key | Monthly | Global copper price; LME-sourced via IMF[^52] |
| **Yahoo Finance Copper Futures** | `https://query1.finance.yahoo.com/v8/finance/chart/HG=F` | JSON | None | 15 min delayed | Near real-time copper futures |
| **Yahoo Finance Lumber Futures** | `https://query1.finance.yahoo.com/v8/finance/chart/LBR=F` | JSON | None | 15 min delayed | CME Random Length Lumber (LBR=F) |
| **FRED PIORECRUSDM (Iron Ore)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=PIORECRUSDM` | CSV | Free key | Monthly | Iron ore price via IMF |
| **FRED PALUMUSDM (Aluminum)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=PALUMUSDM` | CSV | Free key | Monthly | LME aluminum price |
| **Yahoo Finance Silver** | `https://query1.finance.yahoo.com/v8/finance/chart/SI=F` | JSON | None | 15 min | Silver futures |

***

### CATEGORY F — Volatility Indices

| Index | Source | URL | Format | Auth | Update | Notes |
|---|---|---|---|---|---|---|---|
| **VIX (CBOE)** | CBOE CDN — historical daily CSV | `https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX_History.csv`[^53] | CSV | None | Daily | Full history back to 1990; free and machine-readable[^53] |
| **VIX — Yahoo Finance** | Yahoo v8 chart | `https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX` | JSON | None | 15 min delayed | Good for live sparkline |
| **VIXCLS — FRED** | FRED series | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=VIXCLS`[^54] | CSV | Free key | Daily | CBOE VIX via FRED — 1990 to present[^54] |
| **MOVE Index (ICE BofA)** | Yahoo Finance (unofficial) | `https://query1.finance.yahoo.com/v8/finance/chart/%5EMOVE`[^55] | JSON | None | Delayed | ICE MOVE Bond Vol Index; no free structured download from ICE[^56] |
| **MOVE — Investing.com** | Manual historical data | `https://www.investing.com/indices/ice-bofaml-move-historical-data`[^57] | HTML (scrape) | None | EOD | Not API-grade; scrape only |
| **OVX (Oil VIX)** | CBOE CDN | `https://cdn.cboe.com/api/global/us_indices/daily_prices/OVX_History.csv` | CSV | None | Daily | CBOE Crude Oil ETF Volatility Index |
| **GVZ (Gold VIX)** | CBOE CDN | `https://cdn.cboe.com/api/global/us_indices/daily_prices/GVZ_History.csv` | CSV | None | Daily | CBOE Gold ETF Volatility Index |
| **VIX9D, VIX3M, VIX6M** | CBOE CDN | Pattern: `https://cdn.cboe.com/api/global/us_indices/daily_prices/VIX9D_History.csv` | CSV | None | Daily | Short- and medium-term VIX term structure |

***

### CATEGORY G — US Dollar Index and Broad TWI

| Source | URL | Format | Auth | Update | Notes |
|---|---|---|---|---|---|
| **DXY (ICE US Dollar Index)** — Yahoo Finance | `https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB` | JSON | None | 15 min delayed | Six-currency basket (EUR, JPY, GBP, CAD, SEK, CHF); informal Yahoo endpoint |
| **DXY via Stooq** | `https://stooq.com/q/d/l/?s=dxy` | CSV | None | EOD | DXY historical; more stable than Yahoo for bulk pulls |
| **FRED DTWEXBGS (Broad TWI)** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DTWEXBGS`[^58] | CSV | Free key | Daily (monthly update lag)[^59] | 26-currency trade-weighted dollar index; Fed Board official; base 2006=100[^60] |
| **Fed H.10 Narrow TWI** | `https://www.federalreserve.gov/releases/h10/summary/` | HTML + CSV | None | Weekly | Fed Board narrow dollar index; USD vs 7 major currencies |

***

### CATEGORY H — Cryptocurrency Bridge

| Source | URL | Auth | Rate Limit | Update | Notes |
|---|---|---|---|---|---|
| **CoinGecko — BTC/ETH prices** | `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,ils,eur` | Free demo key[^15] | 30 calls/min, 10,000/month[^15] | ~seconds | Also returns ILS pricing — useful for Israeli LP context |
| **CoinGecko — historical** | `https://api.coingecko.com/api/v3/coins/{id}/market_chart?vs_currency=usd&days=30` | Same | Same | Near real-time | 30-day OHLCV for sparklines |
| **Binance public klines** | `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30` | None (public) | **6,000 weight/min**; klines = 2 weight each[^61] | Real-time | No auth for market data; most generous free rate limit |
| **Binance spot price** | `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT` | None | Same as above | Real-time | Simplest endpoint for BTC/USD live tile |

***

### CATEGORY I — Yield Spreads (Computed)

Each spread is computed by the engine from two free legs — no dedicated free spread API exists.

| Spread | Leg 1 (Source) | Leg 2 (Source) | Formula | Tile Name |
|---|---|---|---|---|
| **US10Y minus Israel10Y** | DGS10 via FRED CSV | Bank of Israel 10Y Government Bond yield — `https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/GRS/1.0/?c%5BDATA_TYPE%5D=OF00&format=csv`[^14] | `DGS10 − BOI_10Y` | US–IL 10Y Spread |
| **US10Y minus US2Y (Yield Curve)** | DGS10 FRED | DGS2 FRED | `DGS10 − DGS2` | Yield Curve (2s10s) |
| **BAA minus 10Y (Credit Spread)** | FRED `DBAA` (Moody's BAA) CSV | FRED `DGS10` | `DBAA − DGS10` | BAA Credit Spread |
| **Mortgage Spread** | FRED `MORTGAGE30US` | FRED `DGS10` | `MORTGAGE30US − DGS10` | Mortgage-Treasury Spread |
| **AAA minus BAA (Investment Grade Spread)** | FRED `DAAA` | FRED `DBAA` | `DBAA − DAAA` | IG Credit Spread |
| **OAS (Option-Adjusted) Spreads** | FRED `BAMLC0A0CM` (ICE BofA US Corp OAS) | — | Direct series | Corporate Bond OAS |

**Israel 10Y Note:** Bank of Israel publishes government bond yield series. The series code for the 10Y Israel Government Bond is in the BOI Statistics database under the GRS content field. Free, no auth.[^14]

***

### CATEGORY J — Market Open / Close Calendars

| Exchange | Source | URL | Format | Auth | Notes |
|---|---|---|---|---|---|
| **NYSE/Nasdaq US holidays** | NYSE official page | `https://www.nyse.com/markets/hours-calendars`[^62] | HTML | None | Structured holiday table; 2026–2028[^62] |
| **Nasdaq holiday schedule** | Nasdaq official | `https://www.nasdaq.com/market-activity/stock-market-holiday-schedule`[^63] | HTML | None | 2026 calendar included[^63] |
| **NYSE holiday JSON** | market-holidays npm / unofficial | `https://raw.githubusercontent.com/rymur/nyse-market-hours/main/nyse-market-hours.json` | JSON | None | Community-maintained; verify against NYSE official |
| **TASE trading schedule** | TASE official | `https://www.tase.co.il/en/content/knowledge_center/trading_vacation_schedule`[^64] | HTML | None | As of Jan 4, 2026, TASE trades Mon–Fri[^64] |
| **TASE TA-Real Estate 35 ETFs** | TASE market data | `https://market.tase.co.il/en/market_data/index/149/tracking_products/etf`[^65] | HTML | None | ETFs tracking new TA-RealEstate index (launched Nov 9, 2025)[^66] |
| **LSE / FRA trading hours** | tradinghours.com | `https://tradinghours.com/exchanges/lse` | HTML | None | Covers LSE, Euronext Frankfurt, TASE, CME |
| **exchange-calendar (Python)** | PyPI | `pip install exchange-calendars` | Python lib | None | Programmatic open/close for 50+ exchanges including XTAE (TASE) |

***

### CATEGORY K — Mortgage Rates (Primary Sources)

| Source | URL | Format | Auth | Update | Notes |
|---|---|---|---|---|---|
| **Freddie Mac PMMS — Current** | `https://www.freddiemac.com/pmms`[^67] | HTML | None | Weekly Thursday noon ET[^44] | 30-yr fixed; **primary market rate benchmark** — 6.51% as of May 21, 2026[^67] |
| **Freddie Mac PMMS Archive** | `https://www.freddiemac.com/pmms/pmms_archives`[^68] | HTML/CSV download | None | Weekly | Historical rates back to 1971[^68] |
| **FRED MORTGAGE30US** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE30US` | CSV | Free key | Weekly | Same Freddie Mac PMMS data via FRED[^43] |
| **FRED MORTGAGE15US** | `https://fred.stlouisfed.org/graph/fredgraph.csv?id=MORTGAGE15US` | CSV | Free key | Weekly | 15-year fixed |
| **Mortgage News Daily** | `https://www.mortgagenewsdaily.com/mortgage-rates` | HTML | None | Daily | Daily survey; more current than weekly PMMS |
| **MBA Weekly Apps Survey** | `https://www.mba.org/news-and-research/research-and-economics/single-family-research/weekly-applications-survey` | HTML | None | Weekly Wednesday | Applications volume + rate data |
| **Bankrate** | `https://www.bankrate.com/mortgages/mortgage-rates/` | HTML | None | Daily | Rate comparison; no free API |

***

### CATEGORY L — REIT-Specific Tickers

#### L1 — REIT ETFs

| Ticker | Name | Exchange | Yahoo URL | Index Tracked | Coverage |
|---|---|---|---|---|---|
| **VNQ** | Vanguard Real Estate ETF | NYSE Arca | `https://finance.yahoo.com/quote/VNQ/`[^69] | MSCI US Investable Market Real Estate 25/50 | Broad equity REITs; largest by AUM |
| **VNQI** | Vanguard Global ex-US Real Estate ETF | NYSE Arca | Yahoo: `VNQI` | S&P Global ex-US Property Index | International REIT |
| **IYR** | iShares US Real Estate ETF | NYSE Arca | Yahoo: `IYR` | Dow Jones US Real Estate Capped | US equity REITs |
| **RWR** | SPDR Dow Jones REIT ETF | NYSE Arca | Yahoo: `RWR` | Dow Jones US Select REIT | US equity REITs |
| **FREL** | Fidelity MSCI Real Estate ETF | NYSE Arca | Yahoo: `FREL` | MSCI USA IMI Real Estate | Broad sector exposure |
| **REM** | iShares Mortgage Real Estate ETF | Nasdaq | `https://finance.yahoo.com/quote/REM/`[^70] | FTSE NAREIT All Mortgage Capped | Mortgage REITs (mREITs) |
| **MORT** | VanEck Mortgage REIT Income ETF | NYSE Arca | `https://finance.yahoo.com/quote/MORT/`[^71] | MVIS US Mortgage REITs | Pure-play mREITs; 27 holdings[^72] |

#### L2 — Key REIT Constituents

| Ticker | Name | Sector | Yahoo Endpoint |
|---|---|---|---|
| **PLD** | Prologis | Industrial/Logistics | `query1.finance.yahoo.com/v8/finance/chart/PLD` |
| **EQIX** | Equinix | Data Center REIT | `…chart/EQIX` |
| **AMT** | American Tower | Cell Tower REIT | `…chart/AMT` |
| **SPG** | Simon Property Group | Retail REIT (Mall) | `…chart/SPG` |
| **CCI** | Crown Castle | Cell Tower REIT | `…chart/CCI` |
| **EQR** | Equity Residential | Multifamily REIT | `…chart/EQR` |
| **WELL** | Welltower | Healthcare REIT | `…chart/WELL` |

> **Engine note:** All seven constituents are directly relevant to Israeli LP deal context — PLD/EQIX for industrial comps, EQR for multifamily cap rate reference, SPG for retail anchor context.

***

### CATEGORY M — Israeli ETFs on TASE (Real Estate Exposure)

| Fund Name | Hebrew Name | TASE Symbol | Underlying Real Estate Exposure | Free Data Source |
|---|---|---|---|---|
| **KSEM Real Estate** | קסם נדל"ן | Available on TASE | Tracks Israeli real estate companies index; includes developers and property cos.[^65] | TASE market data site; EOD via Yahoo Finance `.TA` suffix |
| **TACHLIT Real Estate** | תכלית נדל"ן | TACHLIT.TA | Broader TASE real estate sector; passive index fund | Yahoo Finance or EOD Historical Data |
| **MTF Real Estate** | מור נדל"ן | MTF.TA | Similar index exposure; managed by Meitav | TASE portal |
| **Harel Sal Real Estate** | הראל סל נדל"ן | HREL.TA | Passive tracking of Israeli real estate companies | Yahoo Finance `.TA` suffix |
| **TA-Real Estate 35 ETFs** | ת"א נדל"ן 35 | Multiple | Tracks TA-RealEstate 35 index (launched Nov 9, 2025) — 35 largest Israeli property companies[^66] | `https://market.tase.co.il/en/market_data/index/149/tracking_products/etf`[^65] |

> **Note:** TASE switched to Monday–Friday trading as of January 4, 2026, aligning better with US market hours — reduces the Sunday data gap that historically complicated cross-market context tiles.[^64]

***

## Section 1 — Free-Tier Rate Limit Summary (FX APIs)

| Provider | Free Req/Month | Free Base Currency | ILS Coverage | Latency | License / Commercial |
|---|---|---|---|---|---|
| Frankfurter v2 | **Unlimited** | Any | ✅ Yes (33 currencies includes ILS)[^2][^1] | EOD | No commercial redistribution |
| Bank of Israel (BOI) | **Unlimited** | ILS-centric | ✅ Authoritative[^14] | Daily 3:30 PM IST | **Yes — government open data** |
| Open Exchange Rates free | 1,000 | USD only[^7] | ✅ Yes | Hourly | No |
| ExchangeRate-API free | 1,500 | USD only[^6] | ✅ Yes | Daily | No |
| Fixer.io free | 100[^8] | EUR only on free | ✅ Yes | Hourly | No |
| exchangerate.host | Not stated | USD | ✅ Yes[^4] | EOD | Verify ToS |
| Yahoo Finance (ILS=X) | ~2,000/day informal | N/A | ✅ Yes[^11] | ~15 min | **No — ToS bars redistribution** |
| CoinGecko | 10,000/month | Flexible | ✅ Yes (as quote currency)[^15] | ~seconds | No |

***

## Section 2 — Deprecated, Discontinued, or Rate-Crippled Providers (2024–2026)

**Critical stability note for always-on public dashboard design:**

1. **IEX Cloud — DEAD.** Shut down August 31, 2024 after acquisition; all API products retired. Any codebase using IEX Cloud endpoints must migrate. The closest free-tier replacement is Finnhub (60 calls/min) or Yahoo Finance v8 (unofficial).[^10][^21][^22][^25]

2. **Yahoo Finance v8/v7 — Fragile, not dead.** The Yahoo Finance unofficial JSON endpoints remain the most widely-used free quote source, but Yahoo has intermittently enforced cookie/crumb authentication, broken integrations for days at a time, and ToS explicitly prohibits commercial redistribution. For a public-facing terminal, these endpoints carry legal and reliability risk. Use only for internal engine calculations behind a cache layer. Do **not** serve Yahoo data direct to Israeli LPs without a compliant intermediary.[^9][^10]

3. **Marketstack free — Too restrictive.** 100 req/month on free tier is unusable for any polling loop. Treat as a manual lookup tool only.[^20]

4. **Alpha Vantage free — Throttled severely.** 25 calls/day as of 2025–2026. At that rate, you cannot refresh even 25 tickers per day. Premium at $49.99/mo required for production use.[^18]

5. **World Gold Council API (gold.org) — Partially broken.** As of March 18, 2025, LBMA Gold Price historical data removed from WGC website at LBMA's request. Use FRED `GOLDAMGBD228NLBM` as replacement.[^49]

6. **Fixer.io free — Near-useless.** 100 calls/month is consumed in hours. EUR-only base on free tier makes ILS conversion indirect. Upgrade required for any production app.[^8]

7. **exchangerate.host — Stable but shifting.** Was briefly free-unlimited pre-2023; now requires signup. EOD-only, positioned as "free" but with usage monitoring.[^4]

8. **LBMA direct endpoint (lbma.org.uk/json/gold_pm.json)** — Currently accessible without auth but undocumented and subject to removal without notice. Mirror FRED `GOLDAMGBD228NLBM` as primary.[^48]

9. **Tiingo free — Commercially restrictive.** Individual plan $30/mo, commercial $50/mo. Free tier rate-limited (500 symbols/month, 50 req/hour). For a dashboard serving Israeli LPs as external users, the commercial license is required.[^28][^29]

10. **CoinGecko — Reduced free tier (2024 change).** Demo key limited to 10,000 calls/month, 30 calls/min. No-key access was further reduced (5–15 calls/min without key). For production crypto tiles, register a free demo key.[^15]

**Most stable free sources for always-on dashboard (ranked):**
1. FRED — all series (government, free API key, 120 req/min, no redistribution restriction on computed derivatives)[^42]
2. Bank of Israel API — government open data, unlimited, authoritative[^14]
3. US Treasury XML — government, unlimited, no auth[^39]
4. CBOE CDN CSV (VIX, OVX, GVZ) — government-grade; stable CDN URL[^53]
5. Frankfurter — unlimited but ECB-sourced, EOD only, no commercial redistribution[^1]
6. Binance public klines — real-time, high limits, no auth, but crypto only[^61]

***

## Section 3 — USD/ILS Source Ranking by Latency and License

**Objective:** Best free real-time-to-near-real-time USD/ILS source for a live tile on a capital bridge dashboard serving Israeli investors.

| Rank | Source | Latency | License | Rate Limit | Notes |
|---|---|---|---|---|---|
| #1 | **Bank of Israel Official API** | Daily 3:30 PM IST (authoritative fixings); XML available ~3:45 PM IST[^14] | **Government open data — commercial use OK**[^14] | Unlimited[^14] | Only source with legal certainty for LP-facing display. Represents the official "representative rate" set daily by BOI at 1 PM IST, published ~3:30 PM. |
| #2 | **Yahoo Finance ILS=X** (`ILS=X`) | ~15 min delayed interbank mid-rate[^11] | No — ToS bars redistribution[^10] | ~2,000/day informal | Best intra-day refresh rate of all free options; use behind a server-side cache for internal terminal calculations only |
| #3 | **Open Exchange Rates free** | Hourly[^7] | No commercial | 1,000/month[^7] | USD-base required; good for hourly tile fallback |
| #4 | **Frankfurter v2** | EOD ~16:00 CET[^2] | No commercial redistribution | Unlimited[^1] | ECB reference rate — reflects ECB's daily publication, not interbank spot; adequate for end-of-day context tile |
| #5 | **Stooq CSV** (usdils) | EOD | Unclear ToS | No stated limit | Good for historical charting; not suitable for live tile |

**Recommended architecture:** Show BOI official rate with IST timestamp as the "closing rate" tile. Show Yahoo Finance ILS=X (cached every 15 min server-side) as an "intra-day indicative" badge. Label clearly as "indicative — not for transactions."

***

## Section 4 — FRED API Quick Reference

All FRED series endpoints follow the same pattern with a free API key (register at research.stlouisfed.org):

```
https://fred.stlouisfed.org/graph/fredgraph.csv?id={SERIES_ID}
```

Key series for the RePrime capital bridge layer:

| Series ID | Description |
|---|---|
| `DGS10` | US 10-Year Treasury Yield |
| `DGS2` | US 2-Year Treasury Yield |
| `DGS30` | US 30-Year Treasury Yield |
| `MORTGAGE30US` | 30-Year Fixed Mortgage Rate (Freddie Mac PMMS) |
| `SOFR` | Secured Overnight Financing Rate |
| `VIXCLS` | CBOE VIX Index |
| `DTWEXBGS` | Nominal Broad US Dollar Index (26 currencies) |
| `GOLDAMGBD228NLBM` | London PM Gold Fix (USD/troy oz) |
| `DCOILWTICO` | WTI Crude Oil Spot Price |
| `DCOILBRENTEU` | Brent Crude Oil Spot Price |
| `DHHNGSP` | Henry Hub Natural Gas Spot Price |
| `PCOPPUSDM` | Copper Price (monthly, IMF/LME) |
| `DBAA` | Moody's BAA Corporate Bond Yield |
| `DAAA` | Moody's AAA Corporate Bond Yield |
| `BAMLC0A0CM` | ICE BofA US Corp Bond OAS |
| `SP500` | S&P 500 Level |
| `NASDAQCOM` | Nasdaq Composite |
| `DTWEXBGS` | Broad Dollar Index |

FRED API rate limit: 120 requests/minute with API key; free, no cost, government data.[^42]

***

## Section 5 — 12 Must-Have Global Bridge Tiles for Israeli CRE Investor Audience

For a 99%-Israeli LP audience evaluating US commercial real estate, these 12 tiles provide the capital context that translates a US cap rate into a risk-adjusted decision:

| # | Tile | Why It Matters to Israeli LP | Source |
|---|---|---|---|
| **1** | **USD/ILS rate** (BOI official + intra-day indicative) | Every dollar-denominated return converts to shekels; 1% currency move wipes a 50bps yield advantage | BOI API + Yahoo ILS=X |
| **2** | **US 10-Year Treasury Yield** | Risk-free rate anchor; sets the floor for cap rate expectations | FRED DGS10 |
| **3** | **US–Israel 10Y Yield Spread** | Direct signal of relative risk compensation between US and Israeli bonds; affects LP hurdle rate | FRED DGS10 minus BOI 10Y |
| **4** | **30-Year Mortgage Rate (PMMS)** | Directly prices debt for US CRE — every 50bps move changes DSCR materially | FRED MORTGAGE30US |
| **5** | **Mortgage–Treasury Spread** | Tells whether mortgage credit conditions are tightening; widening = lenders pulling back | MORTGAGE30US minus DGS10 |
| **6** | **FTSE Nareit All Equity REIT** (via VNQ or ^FNER) | Benchmark for how the public REIT market prices the same assets under deal analysis | Yahoo Finance VNQ / ^FNER |
| **7** | **FTSE Nareit Mortgage REIT** (via REM or MORT) | mREIT spreads signal credit availability in commercial real estate debt | Yahoo Finance REM / MORT |
| **8** | **VIX** | Overall fear gauge; above 25 = LP capital calls become difficult; above 35 = deal pause territory | CBOE CDN CSV + FRED VIXCLS |
| **9** | **MOVE Index** | Bond market volatility; drives mortgage rate volatility — the most direct precursor to rate spikes | Yahoo Finance ^MOVE |
| **10** | **DXY / Broad TWI** | Dollar strength affects Israeli LP returns on exit; shekel/dollar dynamic amplified by DXY | FRED DTWEXBGS + Yahoo DX-Y.NYB |
| **11** | **WTI Crude Oil** | Proxy for US economic health and inflation expectations; feeds into cap rate compression thesis | EIA API / FRED DCOILWTICO |
| **12** | **Gold** | Israeli LPs frequently hold gold as a reserve hedge; contextualizes real yield environment | FRED GOLDAMGBD228NLBM |

**Display recommendation:** Tiles 1–3 should appear in a prominent "Israel bridge" band at the top of the global context panel, in Hebrew-labeled format (USD/ILS בתאריך BOI), then tiles 4–12 in the standard US macro band below.

***

## Section 6 — Spread Computation Recipes

```python
# All legs from FRED CSV; free API key recommended

import pandas as pd

def get_fred(series_id, api_key=""):
    url = f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}"
    return pd.read_csv(url, parse_dates=["DATE"], index_col="DATE")

# 2s10s Yield Curve
dgs10 = get_fred("DGS10")["DGS10"]
dgs2  = get_fred("DGS2")["DGS2"]
curve_2s10s = dgs10 - dgs2  # negative = inverted curve

# Mortgage Spread
mort30 = get_fred("MORTGAGE30US")["MORTGAGE30US"]
mortgage_spread = mort30 - dgs10

# BAA Credit Spread
baa = get_fred("DBAA")["DBAA"]
baa_spread = baa - dgs10

# AAA-BAA spread (quality spread)
aaa = get_fred("DAAA")["DAAA"]
quality_spread = baa - aaa

# US-Israel 10Y Spread (Israel 10Y from BOI API)
# BOI endpoint returns ILS-denominated government bond yields
# Series: GRS (Government Bond Rates), 10-year tenor
boi_10y_url = "https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/GRS/1.0/?c%5BDATA_TYPE%5D=OF00&format=csv"
```

***

*End of RePrime Terminal Global Capital Bridge Layer API Sourcebook v1.0*  
*Next revision: update when Bank of Israel adds REST JSON endpoint for bond yields, or when Frankfurter v2 adds ILS to its 33-currency basket.*

---

## References

1. [Frankfurter | Free exchange rates API](https://frankfurter.dev) - Free, open-source exchange rates API sourcing from 82 central banks. Current and historical rates fo...

2. [Frankfurter Currency Exchange Rates API - Formula Bot](https://www.formulabot.com/datasets/frankfurter-currency) - Rates are updated every working day around 16:00 CET. The API is free, open-source, requires no auth...

3. [v1 API documentation - Frankfurter](https://frankfurter.dev/v1/) - Frankfurter provides endpoints to retrieve latest rates, historical data, or time series. Latest Rat...

4. [ExchangeRate Host: Free Forex & Currency Exchange Rate API](https://exchangerate.host) - Access real-time, free exchange rates and forex data with our currency exchange rate API. Reliable, ...

5. [Free Exchange Rate API for Forex & Currency Conversion](https://exchangerate.host/pricing) - Exchangerates.host is a REST API that is a service for current and historical foreign exchange rates...

6. [ExchangeRate-API Pricing & Best Alternative (2026) - CurrencyFreaks](https://currencyfreaks.com/blog/ExchangeRate-Api-Pricing-Alternative) - Paid plans start at $13.99/month, while the free plan allows 1500 API calls per month. What Is the B...

7. [Pricing and App ID Signup - Open Exchange Rates](https://openexchangerates.org/signup) - Find the plan that's right for you. All accounts have access to the Open Exchange Rates API, with li...

8. [Free Exchange Rate APIs Compared: 2026 Guide - UniRateAPI](https://unirateapi.com/articles/free-exchange-rate-apis-compared) - A 1000-request monthly limit is plenty for a small app but useless for high-traffic platforms. ... B...

9. [Yahoo Finance API - GET quotes returns "Invalid Cookie"](https://stackoverflow.com/questions/76059562/yahoo-finance-api-get-quotes-returns-invalid-cookie) - I'm now getting the error response 'Unauthorised - Invalid Cookie' on every single device I call it ...

10. [gadicc/yahoo-finance2: Unofficial API for Yahoo Finance - GitHub](https://github.com/gadicc/yahoo-finance2) - This project is neither created nor endorsed by Yahoo Inc. Yahoo does not provide any official API t...

11. [USD/ILS (ILS=X) - Yahoo Finance](https://finance.yahoo.com/quote/ILS=X/) - CCY - Delayed Quote • ILS. USD/ILS (ILS=X). 2.8713 -0.0063 (-0.22%). MARKET_TIME_NOTICE_OPEN. Chart ...

12. [Download free market data from Stooq.com - Chartoasis.com](https://www.chartoasis.com/free-data-download-stooq-help-cop3/) - How to download free market data for Polish, Japanese, German, USA and Hungarian stocks from Stooq.c...

13. [Historical Data | Good source for .csv imports | Stooq - Quotes](https://forum.portfolio-performance.info/t/historical-data-good-source-for-csv-imports-stooq/37973) - There's a Download data in csv file… link at the bottom of the page. You may need to click the Show ...

14. [[PDF] Bank Of Israel Extracting representative exchange rates from the ...](https://www.boi.org.il/media/tzxbuhhj/extracting-representative-exchange-rates-from-the-new-series-database.pdf) - Extraction using API. The URL is comprised of a fixed portion, together with a number of parameters ...

15. [CoinGecko API Free Tier Rate Limits | PDF | Computing - Scribd](https://www.scribd.com/document/905105279/Free-CoinGecko-api-limit) - The CoinGecko API offers a free tier with a rate limit of 30 calls per minute and a monthly quota of...

16. [Yahoo Finance API (2025) - File Exchange - MATLAB Central](https://www.mathworks.com/matlabcentral/fileexchange/181747-yahoo-finance-api-2025?s_tid=FX_rc3_behav) - Unofficial endpoint. Yahoo Finance's chart API is undocumented and may change or throttle. This code...

17. [Trial - Twelve Data Support](https://support.twelvedata.com/en/articles/5335783-trial) - Twelve Data offers several subscription tiers: a Basic (Free) plan with limited daily credits, Grow,...

18. [Financial Data APIs Compared: Polygon vs IEX Cloud vs Alpha ...](https://www.ksred.com/the-complete-guide-to-financial-data-apis-building-your-own-stock-market-data-pipeline-in-2025/) - The free tier provides basic data, but you'll need a paid plan for historical data and higher rate l...

19. [Alpha Vantage: Free Stock APIs in JSON & Excel](https://www.alphavantage.co) - Alpha Vantage offers free stock APIs in JSON and CSV formats for realtime and historical stock marke...

20. [Powerful Stock Data API - Real-Time & Historical Market Data](https://marketstack.com/pricing) - If you will stay below 100 monthly requests and only need end-of-day data, you can go for the Free P...

21. [IEX Cloud API Service Closure and Alternatives](https://iexcloud.org) - The IEX Cloud API products were officially retired on August 31, 2024. Initially designed to enhance...

22. [Dissecting the IEX Cloud Closure: Retrospection & Outlook](https://dev.to/eva_87b1a75318574919fe929/dissecting-the-iex-cloud-closure-retrospection-outlook-1751) - On May 31, 2024, IEX Group announced it would retire all IEX Cloud API products by August 31, 2024 t...

23. [IEX Cloud Replacement — Stock Data API | Apify Actor](https://apify.com/nexgendata/iex-cloud-replacement) - Why this exists: IEX Cloud shut down August 31, 2024 after being acquired by IEXSD. Thousands of fin...

24. [Commodities API: Historical Prices for Oil, Gas, Metals & Agriculture ...](https://eodhd.com/financial-apis/commodities-api-historical-prices-for-oil-gas-metals-agriculture-beta) - The EODHD Commodities API provides historical price data for 23 commodity series sourced from the Fe...

25. [Pricing for global company fundamentals, stock API market data and ...](https://finnhub.io/pricing) - Finnhub - Free stock API for realtime market data, global company ... 60 API calls/minute. Market da...

26. [API Documentation | Finnhub - Free APIs for realtime stock, forex ...](https://finnhub.io/docs/api) - If your limit is exceeded, you will receive a response with status code 429 . On top of all plan's l...

27. [Finnhub Stock APIs - Real-time stock prices, Company ...](https://finnhub.io) - Access real-time stock API, institutional-grade fundamental and alternative data to supercharge your...

28. [Tiingo API Pricing](https://www.tiingo.com/about/pricing) - We make our pricing simple for individuals and commercial use. It is simply $30/month (or $300/year)...

29. [Finding The Best Stock Price API: Top 11 Stock APIs in 2024 - Tiingo](https://www.tiingo.com/blog/best-stock-price-api/) - Generous free tier with 100 requests per day. Paid plans offer higher request limits. Rate limits ca...

30. [[PDF] FTSE Nareit All Equity REITs Index](https://research.ftserussell.com/Analytics/FactSheets/Home/DownloadSingleIssue?issueName=FNER&isManual=False) - The FTSE Nareit All Equity REITs index contains all tax-qualified REITs with more than 50 percent of...

31. [[PDF] FTSE Nareit U.S. Real Estate Index Series](https://www.reit.com/sites/default/files/returns/sum.pdf) - 1 The FTSE Nareit Real Estate 50™ is designed to measure the performance of larger and more frequent...

32. [[PDF] FTSE Nareit U.S. Real Estate Index Series Daily Returns](https://www.reit.com/sites/default/files/returns/DomesticReturns.pdf) - 1 The FTSE Nareit Real Estate 50™ is designed to measure the performance of larger and more frequent...

33. [[PDF] Nareit®](https://www.reit.com/sites/default/files/2026-01/MediaFactSheet_Dec-2025.pdf) - 1 The FTSE Nareit Real Estate 50™ is designed to measure the performance of larger and more frequent...

34. [[PDF] MSCI US REIT Index (USD)](https://www.msci.com/www/fact-sheet/msci-us-reit-index/07851608) - The MSCI US REIT Index is a free float-adjusted market capitalization weighted index that is compris...

35. [MSCI US REIT REIT Index](https://www.msci.com/indexes/index/128456) - The MSCI US REIT Index is a free float-adjusted market capitalization weighted index that is compris...

36. [[PDF] MSCI US REIT Index - February 10, 2026](https://app2.msci.com/eqb/reit/MSCI_Feb26_USREITPublicList.pdf) - This document and all of the information contained in it, including without limitation all text, dat...

37. [All Factsheets - FTSE Russell Research Portal](https://research.ftserussell.com/Analytics/FactSheets/Home/Search/) - The definitions and calculations used in the FTSE Factsheets and Monthly Index Review documents are ...

38. [[PDF] Russell 3000 Index](https://research.ftserussell.com/Analytics/FactSheets/temp/889a7a8d-b35d-4a8f-b84c-590572d12024.pdf) - The Russell 3000® Index measures the performance of the largest 3,000. US companies designed to repr...

39. [Developer Notice - XML changes | U.S. Department of the Treasury](https://home.treasury.gov/developer-notice-xml-changes) - New URLS for XML feedS as of February 4, 2022. The URLs replacing the data.treasury.gov feeds are: D...

40. [Treasury Daily Interest Rate XML Feed | U.S. Department of the ...](https://home.treasury.gov/treasury-daily-interest-rate-xml-feed) - The Treasury Daily Interest Rate Feed provides daily interest rate data in Extensible Markup Languag...

41. [Market Yield on U.S. Treasury Securities at 10-Year Constant ...](https://fred.stlouisfed.org/series/DGS10) - View a 10-year yield estimated from the average yields of a variety of Treasury securities with diff...

42. [St. Louis Fed Web Services: FRED® API](https://fred.stlouisfed.org/docs/api/fred/) - The FRED® API, Version 2 is ideal for anyone who is interested to retrieve observations for all seri...

43. [30-Year Fixed Rate Mortgage Average in the United States - FRED](https://fred.stlouisfed.org/series/MORTGAGE30US) - View data of the average interest rate, calculated weekly, of fixed-rate mortgages with a 30-year re...

44. [Freddie Mac Updates Its Mortgage Rate Survey](https://nationalmortgageprofessional.com/news/freddie-mac-updates-its-mortgage-rate-survey) - Beginning Thursday, Freddie Mac will debut a revised version of its Primary Mortgage Market Survey (...

45. [Secured Overnight Financing Rate Data](https://www.newyorkfed.org/markets/reference-rates/sofr) - The Secured Overnight Financing Rate (SOFR) is a broad measure of the cost of borrowing cash overnig...

46. [SOFR Averages and Index Data, Release Date: 2025-01-23](https://alfred.stlouisfed.org/release?rd=2025-01-23&rid=483&t=3-month&rt=3-month&ob=pv&od=desc) - Release: SOFR Averages and Index Data, 4 real-time economic data series, ALFRED: Download and graph ...

47. [Global price of Copper (PCOPPUSDM) | FRED | St. Louis Fed](https://fred.stlouisfed.org/series/PCOPPUSDM) - Graph and download economic data for Global price of Copper (PCOPPUSDM) from Jan 1992 to Mar 2026 ab...

48. [Retrieving gold prices - Portfolio Performance Handbuch](https://help.portfolio-performance.info/en/how-to/gold-prices/) - So, the following URL will display the gold prices from September 4, 2023 until today (note the comm...

49. [Gold Spot Prices & Market History | World Gold Council](https://www.gold.org/goldhub/data/gold-prices) - As of 18 March 2025, only limited LBMA Gold Price data is available on our website. Historical LBMA ...

50. [eafpres/oil_prices: Retrieve oil price data from eia.gov - GitHub](https://github.com/eafpres/oil_prices) - This function uses the API available from the US Government website eia.gov to retrieve historical o...

51. [Brent crude and WTI oil prices from US EIA - GitHub](https://github.com/datasets/oil-prices) - Brent and WTI (Western Texas Intermediate) Spot Prices (Annual/ Monthly/ Weekly/ Daily) from EIA US ...

52. [Global price of Copper (PCOPPUSDM) - FRED](https://fred.stlouisfed.org/graph/?id=PCOPPUSDM%2C) - Graph and download economic data for Global price of Copper from Jan 1992 to Mar 2026 about copper, ...

53. [CBOE Volatility Index - DataHub.io](https://datahub.io/core/finance-vix) - The CBOE Volatility Index (VIX) measures expected 30-day volatility of the S&P 500, derived from opt...

54. [CBOE Volatility Index: VIX (VIXCLS) | FRED | St. Louis Fed](https://fred.stlouisfed.org/series/VIXCLS) - Graph and download economic data for CBOE Volatility Index: VIX (VIXCLS) from 1990-01-02 to 2026-05-...

55. [ICE BofAML MOVE Index (^MOVE) Charts, Data & News](https://finance.yahoo.com/quote/%5EMOVE/) - Find the latest information on ICE BofAML MOVE Index (^MOVE) including data, charts, related news an...

56. [ICE Data Indices - MOVE Index](https://developer.ice.com/fixed-income-data-services/catalog/ice-data-indices-move-index) - The ICE BofA U.S. Bond Market Option Volatility Estimate Index (MOVE) is the leading indicator of fi...

57. [ICE BofAML MOVE Historical Data - Investing.com](https://www.investing.com/indices/ice-bofaml-move-historical-data) - Explore the complete ICE BofAML MOVE historical data, offering detailed insights into daily prices, ...

58. [Nominal Broad U.S. Dollar Index (DTWEXBGS) | FRED | St. Louis Fed](https://fred.stlouisfed.org/series/DTWEXBGS) - Graph and download economic data for Nominal Broad U.S. Dollar Index (DTWEXBGS) from 2006-01-02 to 2...

59. [Trade Weighted USD Index: Broad, Goods and Services (DTWEXBGS)](https://webvar.com/marketplace/products/financial-services-data/prodview-gpdgzbqfzjrwk) - This product contains a historical time-series data of the Trade Weighted U.S. Dollar Index: Broad, ...

60. [DTWEXBGS: Trade-Weighted US Dollar Index Daily Data - Eco3min](https://eco3min.fr/en/us-dollar-index-dataset-dtwexbgs/) - DTWEXBGS: Daily Trade-Weighted Broad US Dollar Index from FRED (2006–2026) ; Latest Value. 119.28. M...

61. [Frequently Asked Questions on API - Binance](https://www.binance.com/en/support/faq/detail/360004492232) - What are the limits? · 6,000 request weight per minute (keep in mind that this is not necessarily th...

62. [Holidays & Trading Hours - NYSE](https://www.nyse.com/markets/hours-calendars) - Trading Hours · Pre-Opening Session: 6:30 a.m. ET Orders can be entered and will be queued until the...

63. [US Stock Market Holiday Schedule - Nasdaq](https://www.nasdaq.com/market-activity/stock-market-holiday-schedule) - Nasdaq trading hours are as follows, Monday through Friday: The Nasdaq Stock Market: Opens: 9:30 am ...

64. [TASE Trading and Vacation Schedules](https://www.tase.co.il/en/content/knowledge_center/trading_vacation_schedule) - As of January 4th, 2026, the trading on TASE takes place Monday to Friday. Clearing takes place Sund...

65. [TA-RealEstate Index Tracking ETFs | TASE Site](https://market.tase.co.il/en/market_data/index/149/tracking_products/etf) - View ETFs tracking TA-RealEstate, including Etf name, exposure profile, classification, last price, ...

66. [TASE Launches a New Index for Israel's Major Real Estate Companies](https://finance.yahoo.com/news/tase-launches-index-israels-major-120000684.html) - Since the beginning of 2025, the TA-Real Estate index increased by 36%. The new index will be launch...

67. [Mortgage Rates - Freddie Mac](https://www.freddiemac.com/pmms) - The 30-year fixed-rate mortgage averaged 6.51% this week. As rates fluctuate, aspiring buyers should...

68. [Freddie Mac Mortgage Market Survey Archive](https://www.freddiemac.com/pmms/pmms_archives) - Find weekly and monthly mortgage-rate data, from the current week back to 1971, when Freddie Mac's P...

69. [Vanguard Real Estate Index Fund ETF Shares (VNQ) - Yahoo Finance](https://finance.yahoo.com/quote/VNQ/) - 233.10 +0.89%. HOLDINGS: VNQ. VIEW_MORE. TOP_N_HOLDINGS. SYMBOLCOMPANYASSET_PERCENT ... REIT ETFs in...

70. [iShares Mortgage Real Estate Capped ETF (REM) - Yahoo Finance](https://finance.yahoo.com/quote/REM/) - Cboe US - Delayed Quote • USD. iShares Mortgage Real Estate Capped ETF ... 17.38 +0.19%. HOLDINGS: R...

71. [VanEck Mortgage REIT Income ETF (MORT) - Yahoo Finance](https://finance.yahoo.com/quote/MORT/) - REM iShares Mortgage Real Estate Capped ETF. 21.72 -0.46% ; BIZD VanEck BDC Income ETF. 12.38 -1.12%...

72. [VanEck Mortgage REIT Income ETF (US) | Holdings & Performance](https://www.vaneck.com/us/en/investments/mortgage-reit-income-mort/) - MORT - Overview, Holdings & Performance. The ETF provides pure mortgage REIT exposure which tracks a...

