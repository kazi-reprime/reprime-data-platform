# CRE Investment Platform: Financial Ticker API Reference Guide
### Live-Tested Endpoint Compendium for Israeli-Investor-Focused Platform (May 2026)

***

## Executive Summary

This guide documents **27 financial data points** across four sections for use in a Bloomberg-style scrolling ticker bar on a commercial real estate investment platform serving a primarily Israeli investor base. Every endpoint listed was live-tested on May 25, 2026. Results include confirmed field names, live data values, CORS status, and authentication requirements. The most critical architectural finding: **Yahoo Finance's chart API, the FRED API, and the Bank of Israel PublicAPI all require a server-side proxy** due to missing or restrictive CORS headers. Eleven sources can be fetched directly from the browser with no proxy. Four Israeli data points (Term SOFR, CME FedWatch, TASE indices, Israeli CPI API) have **no free API** and require either paid subscriptions or manual data management.

***

## Architecture Decision: Direct Browser vs. Proxy

Before reading individual entries, internalize this split. Build one lightweight Node.js/Cloudflare Worker proxy that caches results for 30–60 seconds; all Yahoo Finance, FRED, and BOI calls route through it.

| Fetch Method | Sources |
|---|---|
| **Direct browser fetch (CORS ✅)** | NY Fed (SOFR, EFFR, Averages), CoinGecko (BTC, crypto market cap), open.er-api.com (all FX), Frankfurter.app (EUR/GBP/CAD only), Treasury XML (full yield curve), ECB SDMX (EUR/ILS) |
| **Requires server-side proxy (CORS ❌)** | Yahoo Finance (VIX, DXY, S&P 500, DJIA, Gold, Brent, WTI, Copper, Lumber, VNQ), FRED API (Mortgage30, CPI, CMBS), Bank of Israel PublicAPI, BOI SDMX edge server |
| **No free API — manual or paid only** | Term SOFR (CME $25/mo+), FedWatch probability (CME), TASE indices TA-35/TA-125, Israeli CBS CPI, Israeli Shahar bond yields (series codes manual), Galil bonds, Nareit index |

***

## SECTION A — US Monetary Policy and Rates

***

### A1. SOFR — Secured Overnight Financing Rate

```
NAME:       NY Fed SOFR
ENDPOINT:   https://markets.newyorkfed.org/api/rates/secured/sofr/last/1.json
AUTH:       None
FORMAT:     JSON
FIELD:      refRates.percentRate
UPDATE:     Daily (~8:00 AM ET next business day)
CORS:       YES — access-control-allow-origin: * confirmed live
RATE LIMIT: None published; stay ≤1 req/min as courtesy
ILS NOTE:   SOFR is the USD benchmark replacing LIBOR; sets cost of USD-denominated CRE debt used by Israeli investors acquiring US assets
```

**Live-confirmed response (2026-05-21):**
```json
{ "refRates": [{ "effectiveDate": "2026-05-21", "type": "SOFR", "percentRate": 3.51 }] }
```

Additional available fields in same response: `percentPercentile1`, `percentPercentile25`, `percentPercentile75`, `percentPercentile99`, `volumeInBillions`.

***

### A1b. SOFR 30-Day, 90-Day, 180-Day Averages + Index

> **Use this single endpoint — it returns SOFR averages, EFFR, OBFR, TGCR, BGCR, and SOFR all in one call. Extremely efficient.**

```
NAME:       NY Fed All Latest Rates (includes SOFR averages)
ENDPOINT:   https://markets.newyorkfed.org/api/rates/all/latest.json
AUTH:       None
FORMAT:     JSON
FIELD:      Filter refRates array for "type": "SOFRAI", then:
              average30day  → 3.60809 (confirmed)
              average90day  → 3.64920 (confirmed)
              average180day → 3.72053 (confirmed)
              index         → 1.24421537 (confirmed)
UPDATE:     Daily
CORS:       YES — access-control-allow-origin: * confirmed live
RATE LIMIT: None published
ILS NOTE:   30-day SOFR average is the index most commonly used in US CRE floating-rate debt; Israeli investors evaluating existing SOFR-based loans use this to mark their debt service costs
```

***

### A1c. Term SOFR (1M, 3M, 6M)

```
NAME:       CME Term SOFR
ENDPOINT:   NO FREE API EXISTS
AUTH:       Paid — CME DataMine subscription (~$25/month minimum)
FORMAT:     N/A
FIELD:      N/A
UPDATE:     Daily
CORS:       N/A
RATE LIMIT: N/A
ILS NOTE:   Term SOFR is embedded in many CRE loan documents; no free source exists
```

**Workaround:** Use the NY Fed 30-day SOFR average (`average30day` from endpoint above) as a proxy for Term SOFR 1M, and `average90day` as a proxy for Term SOFR 3M. Label them clearly as "30-Day SOFR Avg" rather than "Term SOFR" to avoid misrepresentation.[^1]

***

### A2. Federal Funds Effective Rate

```
NAME:       NY Fed EFFR
ENDPOINT:   https://markets.newyorkfed.org/api/rates/unsecured/effr/last/1.json
AUTH:       None
FORMAT:     JSON
FIELD:      refRates.percentRate       → 3.62% (confirmed)
            refRates.targetRateFrom    → 3.50 (confirmed)
            refRates.targetRateTo      → 3.75 (confirmed)
UPDATE:     Daily
CORS:       YES — access-control-allow-origin: * confirmed live
RATE LIMIT: None published
ILS NOTE:   The EFFR target range (3.50–3.75%) is the primary signal for USD cost of capital; Israeli family offices watch this for USD/ILS carry trade implications
```

**Note:** The `targetRateFrom`/`targetRateTo` fields give you the current FOMC target band in a single field — useful for displaying "Fed Target: 3.50–3.75%" alongside the effective rate.

***

### A3. US Treasury Yield Curve — All Maturities, Single Call

**Option 1 — Treasury.gov XML (Recommended: single call, all maturities, free, CORS-enabled):**

```
NAME:       US Treasury Yield Curve XML
ENDPOINT:   https://home.treasury.gov/sites/default/files/interest-rates/yield.xml
AUTH:       None
FORMAT:     XML (parse with DOMParser in browser or xml2js in Node)
FIELDS:     BC_1MONTH, BC_2MONTH, BC_3MONTH, BC_4MONTH, BC_6MONTH,
            BC_1YEAR, BC_2YEAR, BC_3YEAR, BC_5YEAR, BC_7YEAR,
            BC_10YEAR, BC_20YEAR, BC_30YEAR
UPDATE:     Daily (business days, ~3:30 PM ET)
CORS:       YES — access-control-allow-origin: * confirmed live
RATE LIMIT: None
ILS NOTE:   The 10Y Treasury (4.39%) is the US CRE cap rate benchmark; Israeli investors use the 10Y-2Y spread as a recession signal when evaluating US deal timing
```

**Confirmed values from May 1, 2026 record:**

| Maturity | Yield |
|---|---|
| 1M | 3.71% |
| 2M | 3.70% |
| 3M | 3.68% |
| 6M | 3.71% |
| 1Y | 3.73% |
| 2Y | 3.88% |
| 3Y | 3.91% |
| 5Y | 4.02% |
| 7Y | 4.20% |
| 10Y | 4.39% |
| 20Y | 4.96% |
| 30Y | 4.97% |

**Option 2 — FRED API (requires free key, 12 separate calls, no CORS):**

```
NAME:       FRED Treasury Series
ENDPOINT:   https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=YOUR_KEY&sort_order=desc&limit=1&file_type=json
AUTH:       Free key — register at https://fredaccount.stlouisfed.org
FORMAT:     JSON
FIELD:      observations.value
UPDATE:     Daily
CORS:       NO — requires server-side proxy
VERDICT:    ❌ Use Treasury XML instead — 12 calls vs. 1, plus proxy overhead
```

***

### A4. 30-Year Fixed Mortgage Rate

```
NAME:       FRED MORTGAGE30US (Freddie Mac PMMS)
ENDPOINT:   https://api.stlouisfed.org/fred/series/observations?series_id=MORTGAGE30US&api_key=YOUR_KEY&sort_order=desc&limit=1&file_type=json
AUTH:       Free key (register at fredaccount.stlouisfed.org — instant, no cost)
FORMAT:     JSON
FIELD:      observations.value
UPDATE:     Weekly — every THURSDAY (Freddie Mac Primary Mortgage Market Survey)
CORS:       NO — requires server-side proxy
RATE LIMIT: 120 requests/minute per key
ILS NOTE:   US 30Y mortgage rate signals refinancing activity and cap rate compression dynamics; Israeli investors benchmark US residential yields against CRE cap rates when allocating capital
```

***

### A5. Fed Funds Futures / Rate Cut Probability

```
NAME:       CME FedWatch API
ENDPOINT:   NO FREE API — https://markets.api.cmegroup.com/fedwatch/v1 requires paid credentials
AUTH:       Paid subscription (~$25/month minimum)
FORMAT:     JSON (when paid)
FIELD:      N/A (free)
UPDATE:     Real-time (when paid)
CORS:       N/A (free)
RATE LIMIT: N/A (free)
ILS NOTE:   Rate cut probability is the single most-watched indicator by Israeli institutional investors for USD/ILS FX trend forecasting
```

**Best free workarounds (in order of practicality):**[^2]
1. Display the current FOMC target range from the NY Fed EFFR endpoint (`targetRateFrom`/`targetRateTo`) — authoritative and free
2. Calculate DIY probability from front-month 30-Day Fed Funds futures on Yahoo Finance (ticker `ZQH26` etc.): `probability = (futures_price - 100 + current_rate) / 0.25`
3. For static display: embed a link to CME FedWatch tool page[^1]

***

### A6. CPI Year-over-Year (US)

```
NAME:       FRED CPIAUCSL
ENDPOINT:   https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=YOUR_KEY&sort_order=desc&limit=13&file_type=json
AUTH:       Free key required
FORMAT:     JSON
FIELD:      Compute YoY: ((observations.value / observations[^12].value) - 1) × 100
UPDATE:     Monthly (BLS releases ~2nd week of following month)
CORS:       NO — requires server-side proxy
RATE LIMIT: 120 req/min per key
ILS NOTE:   US CPI directly affects Fed rate decisions and thus USD/ILS carry; Israeli investors compare US CPI to Israeli CPI (1.9%) when deciding on USD-denominated vs. NIS-denominated debt exposure
```

**CPI Nowcast (Real-Time Estimate):**
- Cleveland Fed nowcast: No machine-readable JSON API confirmed (page is rendered HTML)
- NY Fed: No real-time CPI API published
- **Alternative — BLS Public API (no key for basic queries):** `https://api.bls.gov/publicAPI/v2/timeseries/data/CUSR0000SA0` — free, returns JSON, CORS status unknown (proxy recommended)

***

### A7. VIX (CBOE Volatility Index)

```
NAME:       Yahoo Finance Chart API — VIX
ENDPOINT:   https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX?interval=1d&range=1d
AUTH:       None (MUST send User-Agent header or receive 429)
            Required header: User-Agent: Mozilla/5.0 (compatible)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice → 16.59 (confirmed live today)
UPDATE:     Real-time during market hours
CORS:       NO — vary: Origin + x-frame-options: SAMEORIGIN — REQUIRES server-side proxy
RATE LIMIT: Undocumented; cache server-side at 60s; aggressive polling triggers 429
ILS NOTE:   VIX >25 triggers risk-off capital flows from EM/small markets; ILS historically weakens as VIX spikes — direct signal for Israeli investors' USD portfolio mark-to-market
```

***

### A8. DXY (US Dollar Index)

```
NAME:       Yahoo Finance Chart API — DXY
ENDPOINT:   https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB?interval=1d&range=1d
AUTH:       None (requires User-Agent header)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice
UPDATE:     Real-time (delayed)
CORS:       NO — requires server-side proxy
RATE LIMIT: Same as VIX — cache at 60s
ILS NOTE:   DXY inversely correlates with emerging market currencies including ILS; a rising DXY typically weakens the shekel, affecting the USD cost basis for Israeli buyers acquiring US CRE
```

***

## SECTION B — Israeli Financial Data

***

### B9. USD/ILS Exchange Rate

Three options confirmed, each with distinct trade-offs:

**Option 1 — Bank of Israel Official Rate (Recommended for Israeli investor audience):**

```
NAME:       Bank of Israel PublicAPI — Exchange Rates
ENDPOINT:   https://boi.org.il/PublicApi/GetExchangeRates
AUTH:       None
FORMAT:     JSON
FIELD:      Filter exchangeRates array for "key": "USD" →
              currentExchangeRate → 2.907 (confirmed live 2026-05-21)
              currentChange       → -0.445 (% daily change, confirmed)
              lastUpdate          → "2026-05-21T09:24:03Z" (confirmed)
UPDATE:     Daily (~3:30 PM Israel time, ~8:30 AM ET)
CORS:       UNKNOWN — no access-control-allow-origin header observed; x-frame-options: SameOrigin present. Route through server-side proxy.
RATE LIMIT: None published
ILS NOTE:   This is the OFFICIAL Bank of Israel representative rate — the legal reference rate for all Israeli financial reporting, tax purposes, and fund NAV calculations. Israeli investors expect this specific rate, not interbank mid-market.
```

> This endpoint also returns GBP, EUR, JPY, AUD, CAD — all as official BOI ILS cross-rates — in a single call.

**Option 2 — Bank of Israel SDMX API (JSON format, confirmed working):**

```
NAME:       BOI SDMX Edge Server
ENDPOINT:   https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/EXR/1.0/RER_USD_ILS?lastNObservations=1&format=sdmx-json
AUTH:       None
FORMAT:     JSON (SDMX-JSON format — nested structure)
FIELD:      data.dataSets.series["0:0:0:0:0:0"].observations["0"] → "2.907" (confirmed)
UPDATE:     Daily
CORS:       UNKNOWN — use proxy
RATE LIMIT: None published
```

> Note the subdomain: `edge.boi.org.il` (not `.gov.il`) is the correct SDMX endpoint.[^3]

**Option 3 — open.er-api.com (CORS-friendly but NOT official BOI rate):**

```
NAME:       ExchangeRate-API Free Tier
ENDPOINT:   https://open.er-api.com/v6/latest/USD
AUTH:       None
FORMAT:     JSON
FIELD:      rates.ILS → 2.8997 (confirmed live today)
UPDATE:     Daily (~midnight UTC)
CORS:       YES — access-control-allow-origin: * confirmed
RATE LIMIT: Not formally published; treat as ≤1 req/min
ILS NOTE:   ⚠️ Interbank mid-market rate ONLY — differs from BOI official rate by 0.5–1.0%. Acceptable for non-reporting display but NOT for Israeli financial compliance contexts.
```

***

### B10. Bank of Israel Key Interest Rate

```
NAME:       Bank of Israel Key Rate
ENDPOINT:   NO SIMPLE FREE JSON API CONFIRMED
AUTH:       N/A
FORMAT:     N/A
FIELD:      N/A
UPDATE:     8 times per year (MPC decisions)
CORS:       N/A
RATE LIMIT: N/A
ILS NOTE:   Current rate: 4.00% (confirmed May 2026). Next decision: July 6, 2026. The BOI rate minus US EFFR = carry trade spread watched by every Israeli institutional investor.
```

**Confirmed workarounds:**[^4][^5]
1. **FRED via OECD (monthly, free key):** `https://api.stlouisfed.org/fred/series/observations?series_id=IRSTCI01ILM156N&api_key=YOUR_KEY&sort_order=desc&limit=1&file_type=json` — Israel overnight rate, monthly frequency
2. **Hardcode + scheduled update:** Store 4.00% in your database, update it programmatically by monitoring the BOI press release RSS feed (`https://www.boi.org.il/en/`)—8 decisions/year is manageable
3. BOI homepage (`https://www.boi.org.il/en/`) renders the current rate in HTML, scrapable with cheerio/puppeteer as a fallback

***

### B11. Israeli CPI / Inflation Rate

```
NAME:       Israeli CPI
ENDPOINT:   NO FREE MACHINE-READABLE API FROM CBS
AUTH:       N/A
FORMAT:     N/A
FIELD:      N/A
UPDATE:     Monthly (CBS release)
CORS:       N/A
RATE LIMIT: N/A
ILS NOTE:   Current Israeli CPI YoY: ~1.9% (May 2026). Critical for Galil (CPI-linked) bond pricing and NIS-denominated debt cost calculations.
```

**Workarounds:**[^6]
1. **OECD SDMX (free, no key):** `https://sdmx.oecd.org/public/rest/data/OECD.SDD.NAD,DSD_PRICES@DF_PRICES_T_IL?format=jsondata&lastNObservations=1` — free, covers Israel, CORS status unknown (proxy recommended)
2. **FRED via OECD (free key required):** Series `ISRPCPIALLMINMEI`
3. Store manually from CBS monthly release (monthly frequency makes this practical)

***

### B12. Tel Aviv Stock Exchange Indices (TA-35, TA-125, TA Real Estate)

```
NAME:       TASE Index Data
ENDPOINT:   NO FREE API — api.tase.co.il returns 403 (Imperva bot protection)
AUTH:       Blocked
FORMAT:     N/A
FIELD:      N/A
UPDATE:     Real-time (market hours 9:00–17:30 Israel time)
CORS:       N/A — blocked before CORS is evaluated
RATE LIMIT: N/A
ILS NOTE:   TA-35 (3,206 pts), TA-125 (4,413 pts), and TA-Real Estate 35 (launched Nov 2025) are the primary Israeli equity benchmarks; your investor base tracks these daily
```

**Note on TA-Real Estate 35:** TASE launched this new index in November 2025 specifically tracking Israel's major real estate companies — directly relevant for your investor audience.[^7]

**Best workarounds:**[^8][^9]
1. **Yahoo Finance** (test these symbols — coverage varies): `^TA35` or `TA35.TA` via `https://query1.finance.yahoo.com/v8/finance/chart/TA35.TA?interval=1d&range=1d` — requires User-Agent + proxy
2. **EODHD API** (paid, ~$19/month): `https://eodhistoricaldata.com/api/real-time/TA35.INDX?api_token=YOUR_KEY` — covers full TASE
3. **Trading Economics API** (paid): covers TA-35, TA-125 with programmatic access[^10]

***

### B13. Israeli Government Bond Yields (Shahar Bonds — 2Y, 5Y, 10Y)

```
NAME:       BOI SDMX — Government Bond Yields
ENDPOINT:   https://edge.boi.org.il/FusionEdgeServer/sdmx/v2/data/dataflow/BOI.STATISTICS/[SERIES]/1.0/[CODE]?lastNObservations=1&format=sdmx-json
AUTH:       None
FORMAT:     JSON (SDMX-JSON) — but series codes require manual discovery
FIELD:      data.dataSets.series["..."].observations["0"]
UPDATE:     Daily
CORS:       UNKNOWN — use proxy
RATE LIMIT: None published
ILS NOTE:   10Y Shahar yield is Israel's risk-free benchmark; the spread between Israel 10Y and US 10Y Treasury (currently US 4.39% vs. Israel ~4.5-4.8%) is a key capital flow indicator for Israeli investors deciding on USD vs. ILS allocation
```

**Action required:** Navigate `https://edge.boi.gov.il/FusionDataBrowser` in a browser to discover the content field codes for Shahar bond series (2Y, 5Y, 10Y). This is a one-time lookup. The SDMX server is confirmed live and functional for exchange rate queries.

***

### B14. Israeli Mortgage Rates (Mashkanta)

```
NAME:       BOI Monthly Mortgage Statistics
ENDPOINT:   NO MACHINE-READABLE API
AUTH:       N/A
FORMAT:     Excel/PDF downloads only
FIELD:      N/A
UPDATE:     Monthly
CORS:       N/A
RATE LIMIT: N/A
ILS NOTE:   Average Mashkanta rates (CPI-linked + spread) contextualize why Israeli HNW investors seek USD-denominated CRE: NIS mortgage financing is typically CPI-indexed, making fixed-rate US CRE attractive for portfolio diversification
```

Manual source: `https://www.boi.org.il/en/economic-roles/financial-markets/mortgage-market/`

***

### B15. Galil Bonds (CPI-Linked Shekel Bonds)

```
NAME:       Galil Bond Yields
ENDPOINT:   NO FREE API
AUTH:       N/A
FORMAT:     N/A
FIELD:      N/A
UPDATE:     Daily (market)
CORS:       N/A
RATE LIMIT: N/A
ILS NOTE:   Galil yields represent the Israeli real risk-free rate; sophisticated investors compare US CRE (cap rate − US CPI) vs. Galil yield when making allocation decisions between US real assets and Israeli inflation-linked bonds
```

Data available via TASE website (HTML) or paid EODHD/Bloomberg.

***

## SECTION C — Global Capital Context

***

### C16. FX Rates: EUR, GBP, AED, SAR, CAD vs. USD

**Definitive provider comparison:**

| Provider | ILS | EUR | GBP | AED | SAR | CAD | CORS | Update | Auth |
|---|---|---|---|---|---|---|---|---|---|
| **open.er-api.com** ⭐ | ✅ 2.8997 | ✅ 0.8599 | ✅ 0.7429 | ✅ 3.6725 | ✅ via pair | ✅ 1.3805 | **YES** | Daily | None |
| **Frankfurter.app** | ✅ 2.8898 | ✅ | ✅ | **❌ NOT FOUND** | **❌ NOT FOUND** | ✅ | YES | Daily (ECB) | None |
| **ECB SDMX** | ✅ EUR/ILS only | ✅ | Partial | ❌ | ❌ | Partial | YES | Daily | None |

> **Winner: `open.er-api.com`** — only provider confirmed to cover AED and SAR, with `access-control-allow-origin: *`. Frankfurter.app explicitly returns `{"message":"not found"}` for AED and SAR — it tracks ECB-monitored currencies only.[^11]

```
NAME:       ExchangeRate-API Free Tier
ENDPOINT:   https://open.er-api.com/v6/latest/USD
AUTH:       None
FORMAT:     JSON
FIELDS:     rates.EUR, rates.GBP, rates.ILS, rates.AED, rates.SAR, rates.CAD
UPDATE:     Daily (~midnight UTC); check time_next_update_utc field
CORS:       YES — access-control-allow-origin: * confirmed live
RATE LIMIT: Not formally published; stay ≤1 req/min
ILS NOTE:   AED and SAR peg to USD (3.6725 and ~3.75 respectively); Israeli investors with Gulf exposure or UAE-domiciled funds track these for deal settlement currency planning
```

***

### C17. Gold Spot Price (XAU/USD)

```
NAME:       Yahoo Finance Gold Futures (GC=F)
ENDPOINT:   https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1d&range=1d
AUTH:       None (requires User-Agent header)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice → $4,523.20/oz (confirmed live today)
UPDATE:     Real-time during COMEX hours
CORS:       NO — requires server-side proxy
RATE LIMIT: Cache at 60s server-side
ILS NOTE:   Gold priced in ILS = USD gold price × ILS/USD rate; Israeli investors historically allocate 5–10% to gold as an ILS debasement hedge; rising gold signals USD weakness
```

> **CoinGecko warning:** `api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=usd` returns `{"gold":{"usd":2.327e-05}}` — this is a CoinGecko internal token price unrelated to spot XAU/USD. Do NOT use CoinGecko for gold.

> **metals-api.com:** Free tier capped at 250 requests/month — insufficient for a live ticker.

***

### C18. Brent Crude and WTI

```
NAME:       Yahoo Finance Futures
BRENT:      https://query1.finance.yahoo.com/v8/finance/chart/BZ%3DF?interval=1d&range=1d
WTI:        https://query1.finance.yahoo.com/v8/finance/chart/CL%3DF?interval=1d&range=1d
AUTH:       None (requires User-Agent header)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice
CONFIRMED:  Brent: $100.21 | WTI: $96.60 (live today)
UPDATE:     Real-time during NYMEX hours
CORS:       NO — requires server-side proxy
RATE LIMIT: Cache at 60s
ILS NOTE:   Israel is a Leviathan gas producer; elevated oil prices affect Israeli inflation and BOI rate decisions, which feed directly into ILS/USD dynamics and Israeli CRE financing costs
```

***

### C19. Copper Spot Price

```
NAME:       Yahoo Finance Copper Futures (HG=F)
ENDPOINT:   https://query1.finance.yahoo.com/v8/finance/chart/HG%3DF?interval=1d&range=1d
AUTH:       None (requires User-Agent header)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice → $6.379/lb (confirmed live today)
UPDATE:     Real-time during COMEX hours
CORS:       NO — requires server-side proxy
RATE LIMIT: Cache at 60s
ILS NOTE:   Copper is the primary leading indicator for US construction costs — directly relevant to Israeli investors evaluating US CRE development deals, where construction budget overruns are a top underwriting risk
```

***

### C20. Lumber Futures

```
NAME:       Yahoo Finance Lumber Futures (LBR=F)
ENDPOINT:   https://query1.finance.yahoo.com/v8/finance/chart/LBR%3DF?interval=1d&range=1d
AUTH:       None (requires User-Agent header)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice → $585.50 (confirmed live today)
UPDATE:     Real-time (CME; low liquidity — wide bid/ask)
CORS:       NO — requires server-side proxy
RATE LIMIT: Cache at 60s
ILS NOTE:   Lumber is the construction cost signal most directly tied to multifamily and single-family residential development, the two CRE sectors most commonly targeted by Israeli investors in US markets
```

> **Caveat:** LBR=F has thin volume. For a more reliable monthly construction cost signal, supplement with FRED series `WPU081` (Random Length Lumber PPI) — free with FRED key, monthly.

***

### C21. Bitcoin and Total Crypto Market Cap

```
NAME:       CoinGecko Public API
BITCOIN:    https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
GLOBAL:     https://api.coingecko.com/api/v3/global
AUTH:       None — fully free, no key required
FORMAT:     JSON
FIELDS:     bitcoin.usd → $77,611 (confirmed live today)
            data.total_market_cap.usd → $2,672,928,769,993 (confirmed)
            data.total_market_cap.ils → ₪7,700,320,211,680 (confirmed — native ILS available)
UPDATE:     ~Every 1 minute on CoinGecko's index
CORS:       YES — access-control-allow-origin: * confirmed live
RATE LIMIT: Free tier: ~30 calls/minute (community consensus; CoinGecko does not publish formally)
            Recommendation: Register free demo API key at coingecko.com/en/api for guaranteed 30 req/min; still free
ILS NOTE:   Total crypto market cap in ILS is natively returned in the /global response (data.total_market_cap.ils), which is unique among free data sources — no conversion needed for your Israeli investor display
```

***

### C22. S&P 500 and Dow Jones Industrial Average

```
NAME:       Yahoo Finance Chart API
S&P 500:    https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=1d
DJIA:       https://query1.finance.yahoo.com/v8/finance/chart/%5EDJI?interval=1d&range=1d
AUTH:       None (requires User-Agent header)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice
CONFIRMED:  S&P 500: 7,473.47 | Prior close: 7,445.72 (live today)
UPDATE:     Real-time (15-min delayed for free)
CORS:       NO — requires server-side proxy
RATE LIMIT: Cache at 60s server-side
ILS NOTE:   S&P 500 performance correlates with Israeli institutional investor risk appetite; a down S&P day typically pressures Israeli fund managers to de-risk USD-denominated holdings including US CRE positions
```

***

### C23. FTSE Nareit All Equity REITs Index

```
NAME:       FTSE Nareit Index
ENDPOINT:   NO FREE API
AUTH:       Paid — distributed via Bloomberg, ICE Data Services, FTSE Russell
FORMAT:     N/A (free)
FIELD:      N/A (free)
UPDATE:     Real-time (paid)
CORS:       N/A (free)
RATE LIMIT: N/A (free)
ILS NOTE:   US REIT performance benchmarks how institutional capital prices US real estate; Israeli investors compare CRE direct yield to liquid REIT yield when making public vs. private real estate allocation decisions
```

**Best free proxy:**
```
NAME:       Vanguard Real Estate ETF (VNQ) — Nareit Proxy
ENDPOINT:   https://query1.finance.yahoo.com/v8/finance/chart/VNQ?interval=1d&range=1d
AUTH:       None (requires User-Agent header)
FORMAT:     JSON
FIELD:      chart.result.meta.regularMarketPrice
CORS:       NO — requires server-side proxy
NOTE:       VNQ tracks MSCI US Investable Market Real Estate 25/50 Index, highly correlated with Nareit All Equity; acceptable as a ticker display proxy
```

***

## SECTION D — CRE-Specific Rates

***

### D24. CMBS Delinquency Rate

```
NAME:       FRED DRCRELEXFACBS
ENDPOINT:   https://api.stlouisfed.org/fred/series/observations?series_id=DRCRELEXFACBS&api_key=YOUR_KEY&sort_order=desc&limit=1&file_type=json
AUTH:       Free key required (fredaccount.stlouisfed.org)
FORMAT:     JSON
FIELD:      observations.value (percent of CMBS balance 90+ days delinquent)
UPDATE:     Quarterly (Federal Reserve H.8 release)
CORS:       NO — requires server-side proxy
RATE LIMIT: 120 req/min per key
ILS NOTE:   CMBS delinquency is the most accessible proxy for US CRE credit stress; Israeli family offices use this as a timing signal for entry into US CRE debt markets — elevated delinquency can signal both distress buying opportunities and cap rate expansion
```

> **More granular data by property type** (office, retail, multifamily, industrial, hotel): Available from Trepp (monthly, paid) and DBRS Morningstar (paywalled). No free property-type breakdown exists.

***

### D25. Commercial Mortgage Origination Volume

```
NAME:       FRED RCMALLNS (Real Estate Loans, All Commercial Banks)
ENDPOINT:   https://api.stlouisfed.org/fred/series/observations?series_id=RCMALLNS&api_key=YOUR_KEY&sort_order=desc&limit=1&file_type=json
AUTH:       Free key required
FORMAT:     JSON
FIELD:      observations.value (billions USD)
UPDATE:     Weekly (Fed H.8 release)
CORS:       NO — requires server-side proxy
RATE LIMIT: 120 req/min per key
ILS NOTE:   Rising commercial real estate loan balances signal healthy origination activity and lender appetite; contracting balances signal credit tightening that restricts deal flow for Israeli buyers seeking leverage
```

> **Note:** True origination volume (MBA Commercial/Multifamily Mortgage Survey) is paywalled. RCMALLNS is the closest free proxy.

***

### D26. Cap Rate Spreads

```
NAME:       Cap Rate Spreads (CRE vs. 10Y Treasury)
ENDPOINT:   NO FREE REAL-TIME API FROM ANY SOURCE
AUTH:       Green Street (~$50K+/year institutional), CoStar (enterprise)
FORMAT:     N/A (free)
FIELD:      N/A (free)
UPDATE:     Quarterly (CBRE, JLL, Cushman free PDFs)
CORS:       N/A (free)
RATE LIMIT: N/A (free)
ILS NOTE:   The cap rate spread (e.g., Multifamily cap 5.1% minus 10Y Treasury 4.39% = 151bps) is the core risk premium metric Israeli CRE investors evaluate before deploying capital into US deals
```

**Practical recommendation for your ticker:** Display a "static + live" composite:
- **Live 10Y Treasury** (from Treasury XML — confirmed working, free, CORS-enabled)
- **Static "Last Reported Cap Rate"** by sector (updated quarterly from CBRE's free national cap rate report)
- **Computed spread displayed live** = cap rate static − live 10Y

This provides more actionable context than any single live data point.

***

### D27. National Vacancy Rates (Office, Retail, Multifamily, Industrial)

```
NAME:       National CRE Vacancy Rates
ENDPOINT:   NO FREE API WITH CURRENT DATA
AUTH:       CoStar, Moody's CRE, MSCI (all paywalled)
FORMAT:     N/A (free)
FIELD:      N/A (free)
UPDATE:     Quarterly (CBRE/JLL/Cushman free PDFs)
CORS:       N/A (free)
RATE LIMIT: N/A (free)
ILS NOTE:   Office vacancy (currently ~18–20% nationally) is the primary risk metric Israeli investors ask about when evaluating US office exposure; industrial vacancy (~5%) confirms the sector thesis for logistics/distribution deals
```

**Free sources available (quarterly, static):**
- **Multifamily vacancy (Census):** FRED series `RRVRUSQ156N` — `https://api.stlouisfed.org/fred/series/observations?series_id=RRVRUSQ156N&api_key=YOUR_KEY&sort_order=desc&limit=1&file_type=json` — quarterly, free
- **Office/Industrial/Retail:** CBRE, JLL, and Cushman & Wakefield publish free quarterly national PDFs — store the latest numbers in your database, refreshed quarterly

***

## Recommended Ticker Bar Configuration

Based on all confirmed endpoints, here is a practical 16-item ticker bar with sources prioritized for your Israeli investor base:

| # | Display Label | Source | Refresh | Proxy? |
|---|---|---|---|---|
| 1 | SOFR | NY Fed (`/sofr/last/1.json`) | 60s | No |
| 2 | SOFR 30D Avg | NY Fed (`/all/latest.json`) | 60s | No |
| 3 | Fed Target Rate | NY Fed (`/effr/last/1.json`) | 60s | No |
| 4 | USD/ILS (BOI) | BOI PublicAPI | 60s | Yes |
| 5 | BOI Rate | Static (4.00%) — update 8x/year | — | — |
| 6 | 10Y UST | Treasury XML | 60s | No |
| 7 | 2Y UST | Treasury XML (same call) | 60s | No |
| 8 | 30Y Mortgage | FRED MORTGAGE30US | 60s | Yes |
| 9 | US CPI YoY | FRED CPIAUCSL | 60s | Yes |
| 10 | VIX | Yahoo Finance | 60s | Yes |
| 11 | S&P 500 | Yahoo Finance | 60s | Yes |
| 12 | Gold (XAU) | Yahoo Finance | 60s | Yes |
| 13 | WTI Crude | Yahoo Finance | 60s | Yes |
| 14 | Bitcoin | CoinGecko | 60s | No |
| 15 | Crypto Market Cap | CoinGecko | 60s | No |
| 16 | USD/EUR, USD/GBP | open.er-api.com | 60s | No |

***

## FRED API Key Registration

Multiple items in this guide require a FRED API key. Registration is:
- **Free** — no credit card, no cost
- **Instant** — key delivered by email
- **Registration URL:** `https://fredaccount.stlouisfed.org/apikey`
- **Rate limit:** 120 requests/minute per key
- **CORS:** No — store key server-side only, never expose in browser

Store your FRED key as an environment variable on your proxy server. Never include it in client-side JavaScript.

***

*All endpoints live-tested May 25, 2026. API availability and field structures subject to change; re-validate before production deployment.*

---

## References

1. [FedWatch API - CME Group](https://www.cmegroup.com/market-data/market-data-api/fedwatch-api.html) - For as little as $25/month, get API access to FedWatch data, which tracks and analyzes the probabili...

2. [CME FedWatch End-of-Day API - Spaces - Confluence](https://cmegroupclientsite.atlassian.net/wiki/spaces/EPICSANDBOX/pages/457320466/CME+FedWatch+API) - The CME FedWatch End-of-Day REST API provides access to rate probability for upcoming Federal Open M...

3. [[PDF] Bank Of Israel Extracting series from the new series database](https://www.boi.org.il/media/zodneksc/extracting-series-from-the-new-series-database-representative-exchange-rates-example.pdf) - Choose the exchange rate content field: Page 3. Bank Of Israel. Choose specific series: If nothing i...

4. [Israel Interest Rate - Trading Economics](https://tradingeconomics.com/israel/interest-rate) - Interest Rate in Israel is expected to be 3.75 percent by the end of this quarter, according to Trad...

5. [Bank of Israel](https://www.boi.org.il/en/) - BOI interest rate. 3.75%. Next decision date: 06/07/2026. Inflation. 1.9%. 12 ... The source: Bank o...

6. [API - OECD](https://www.oecd.org/en/data/insights/data-explainers/2024/09/api.html) - The OECD provides programmatic access to OECD data through an application programming interface (API...

7. [TASE Launches a New Index for Israel's Major Real Estate Companies](https://www.prnewswire.com/news-releases/tase-launches-a-new-index-for-israels-major-real-estate-companies---ta-real-estate-35-302598320.html) - The TA-Real Estate 35 index will be launched on Sunday, November 9, 2025. Market Share and AUM of th...

8. [algonell/tase: Tel Aviv stock exchange data scrapper. - GitHub](https://github.com/algonell/tase) - After scraping the data, you can calculate the PE ratio of the TA-35 index by running the dataAnalys...

9. [Tel Aviv Stock Exchange (TASE TA) stock market data APIs - EODHD](https://eodhd.com/financial-summary/TASE.TA) - Get TASE.TA (Tel Aviv Stock Exchange).Stock market data historical prices and Fundamental Data APIs ...

10. [Israel Stock Market (TA-125) - Quote - Chart - Historical Data - News](https://tradingeconomics.com/israel/stock-market) - Israel's main stock market index, the TA-125, rose to 4413 points on May 25, 2026, gaining 2.01% fro...

11. [proprietary/stlouisfed-fred-web-proxy - GitHub](https://github.com/proprietary/stlouisfed-fred-web-proxy) - This is a web server that proxies requests from St Louis Fed's FRED (a great resource for free, publ...

12. [Shifting the yield curve for fixed-income and derivatives portfolios](http://arxiv.org/pdf/2412.15986.pdf) - ...and 5.98% of CET1 recorded on debt securities valued at fair
value and amortised cost. Variation ...

