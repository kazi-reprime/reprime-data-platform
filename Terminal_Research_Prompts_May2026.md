**THE TERMINAL**

**Visual Intelligence Layer — Research Prompts**

5 searches · Run in parallel · Copy-paste ready

War Room Seed Project · May 2026 · Confidential

**PLATFORM SETTINGS (read before running)**

**Perplexity (Searches 1 and 2\)**

Mode: Pro Search (toggle ON at the top of the input box).

Focus: All (not Academic, not Writing, not YouTube).

Pro Search does multi-step reasoning. It will take 2–4 minutes per prompt. Let it finish. Do not interrupt.

Run Search 1 and Search 2 in two separate Perplexity tabs simultaneously.

**Claude Deep Research (Search 3\)**

Open a brand new chat on claude.ai. NOT inside any project.

Click the model picker and select Deep Research.

Paste the entire prompt. Deep Research will run 5–15 minutes and produce a structured report. Do not interrupt it.

**Gemini (Searches 4 and 5\)**

Use Gemini Advanced (2.5 Pro if available, otherwise 2.5 Flash).

Settings: Google Search extension must be ON. Turn OFF all other extensions (Maps, YouTube, Flights, Hotels, Workspace). You only need Google Search.

Run Search 4 and Search 5 in two separate Gemini tabs simultaneously.

**SEARCH 1 — PERPLEXITY**

**FEEDS THE: Top-of-page Bloomberg-style scrolling ticker on info.reprimeterminal.com and reprime-broker-portal**

**WIDGET SHAPE: 12–20 tokens scrolling horizontally, each showing \[Label\] \[Value\] \[▴/▾ delta\] \[source\], updating every 30–60 seconds**

**AUDIENCE CONTEXT: 99% of our investors are Israeli. USD/ILS, Bank of Israel rates, and Tel Aviv market data are as important as SOFR and the 10-Year Treasury.**

Copy everything below this line into Perplexity Pro Search:

I am building a commercial real estate investment platform. My investors are primarily Israeli (99%).

I need to build a Bloomberg-style scrolling ticker bar across the top of my public website that shows

12–20 live-updating financial data points, refreshing every 30–60 seconds.

For EVERY source below, I need you to find and confirm: the exact API endpoint URL (not the

documentation page, the actual URL I would fetch), whether it requires an API key or is fully

open, whether it returns JSON, the exact field names in the response that contain the number

I want, the update frequency, and whether it has CORS headers that allow direct browser fetch

or requires a server-side proxy.

SECTION A — US MONETARY POLICY AND RATES

1\. SOFR (Secured Overnight Financing Rate): I believe the NY Fed publishes this at

   https://markets.newyorkfed.org/api/rates/secured/sofr/last/1.json — confirm this endpoint

   is live, confirm the JSON field name for the rate, confirm no auth needed, confirm CORS.

   Also find: 30-Day Average SOFR, 90-Day Average SOFR, and Term SOFR (1M/3M/6M) if

   published freely by CME or any other source.

2\. Federal Funds Effective Rate: I believe NY Fed also publishes this. Find the exact endpoint.

3\. US Treasury Yield Curve: I need ALL maturities (1M, 2M, 3M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y,

   20Y, 30Y) from a single API call. Options I know about:

   — US Treasury Fiscal Data API at api.fiscaldata.treasury.gov

   — FRED API at api.stlouisfed.org (series DGS1MO, DGS3MO, DGS6MO, DGS1, DGS2, DGS5,

     DGS10, DGS20, DGS30)

   For each: confirm the endpoint, confirm the JSON field for the yield value, tell me which

   one returns ALL maturities in a SINGLE call vs requiring 12 separate calls.

4\. 30-Year Fixed Mortgage Rate: FRED series MORTGAGE30US. Confirm endpoint and update day.

5\. Fed Funds Futures / Rate Cut Probability: Is there ANY free API that returns the CME FedWatch

   implied probability of the next rate cut? This is displayed on every Bloomberg terminal.

   If no free API exists, is there a free source I can scrape with a schedule?

6\. CPI (YoY): FRED series CPIAUCSL. Confirm endpoint. Also: is there a "CPI nowcast" or

   real-time inflation estimate API from the Cleveland Fed or NY Fed?

7\. VIX (CBOE Volatility Index): Is there a free API for the current VIX level? I have heard

   CBOE does not publish a free real-time feed. Confirm. If not free real-time, what is the

   cheapest source? Does Yahoo Finance or any other provider have a free delayed VIX endpoint?

8\. DXY (US Dollar Index): Same question as VIX — any free API?

SECTION B — ISRAELI FINANCIAL DATA (critical — my investor base is Israeli)

9\. USD/ILS exchange rate: I need a free API that returns the Bank of Israel official rate, not

   an interbank mid-market rate. I believe Bank of Israel publishes at:

   https://edge.bfrm.io/api/v1/rates?symbols=USDILS or similar. Find the exact endpoint.

   Also: Frankfurter.app, ExchangeRate-API (open.er-api.com), ECB SDMX — which of these

   includes ILS? At what refresh frequency?

10\. Bank of Israel Key Interest Rate: The Bank of Israel sets a monetary policy rate. Is there

    an API endpoint that returns the current Bank of Israel rate? Check boi.org.il for any

    developer API or data download.

11\. Israeli CPI / Inflation Rate: Does the Israeli Central Bureau of Statistics (CBS, cbs.gov.il)

    have a public API that returns the latest CPI figure?

12\. Tel Aviv Stock Exchange indices: TA-35, TA-125, TA Real Estate index — are any of these

    available via a free API? Check tase.co.il for developer resources.

13\. Israeli Government Bond Yields: 2Y, 5Y, 10Y Shahar bonds. Any free API?

14\. Israeli Mortgage Rates (Mashkanta): Average Israeli mortgage rate. Any free source?

15\. Shekel-denominated CPI-linked bond yields (Galil bonds) — any free data?

SECTION C — GLOBAL CAPITAL CONTEXT

16\. USD/EUR, USD/GBP, USD/AED, USD/SAR, USD/CAD: These matter because institutional

    capital flows into US CRE from Europe, Gulf states, and Canada. Confirm which free FX APIs

    cover ALL of these currencies. I need: Frankfurter.app, open.er-api.com, ECB SDMX —

    compare their coverage, update frequency, and reliability.

17\. Gold spot price (XAU/USD): Free API. Risk-off proxy. Check CoinGecko, metals-api.com,

    goldprice.org. Which is truly free with no trial limit?

18\. Brent Crude and WTI: Energy prices affect industrial and logistics CRE operating costs.

    Any free API for oil spot prices?

19\. Copper spot price: Construction cost leading indicator. Free API?

20\. Lumber futures or index: Same — construction cost signal. Free API?

21\. Bitcoin and total crypto market cap: CoinGecko api.coingecko.com/api/v3/global and

    api.coingecko.com/api/v3/simple/price?ids=bitcoin\&vs\_currencies=usd — confirm these are

    still free, no key, with CORS. What is the rate limit?

22\. S\&P 500 and Dow Jones: Any free delayed (15-min) API for US equity indices?

23\. FTSE Nareit All Equity REITs Index: This is the benchmark for US REIT performance.

    Any free API or data download? Nareit publishes monthly data — is there a structured feed?

SECTION D — CRE-SPECIFIC RATES FOR THE TICKER

24\. CMBS Delinquency Rate (overall): FRED series DRCRELEXFACBS. Confirm endpoint.

    Is there a more granular free source that breaks this out by property type (office vs retail

    vs multifamily vs industrial)?

25\. Commercial Mortgage Origination Volume: Any free API or quarterly data download?

    Does the Mortgage Bankers Association publish this freely?

26\. Cap Rate Spreads (CRE cap rate minus 10Y Treasury): This is the single most important

    metric in CRE investing. Any free source? Even a quarterly update would be valuable.

    Does the NCREIF publish any free data? Does Green Street have a free tier?

27\. National Office Vacancy Rate, National Retail Vacancy, National Multifamily Vacancy,

    National Industrial Vacancy: Any free quarterly or monthly data source for these four

    numbers? Census Housing Vacancy Survey covers residential — does it cover commercial?

    Does Moody’s/REIS publish any free summary? Does CBRE, JLL, or Cushman publish

    a free quarterly national vacancy report with actual numbers (not just a PDF)?

For every source you confirm, give me this exact format:

  NAME: \[source name\]

  ENDPOINT: \[exact fetch URL\]

  AUTH: \[none / free key at URL / paid\]

  FORMAT: \[JSON / XML / CSV\]

  FIELD: \[exact JSON path to the number, e.g., data\[0\].rate or observations\[0\].value\]

  UPDATE: \[real-time / daily / weekly / monthly / quarterly\]

  CORS: \[yes / no / unknown\]

  RATE LIMIT: \[X per Y\]

  ILS NOTE: \[relevant for Israeli investors because...\]

**SEARCH 2 — PERPLEXITY**

**FEEDS THE: CRE Market Intelligence Dashboard — a full-page section on info.reprimeterminal.com showing US CRE fundamentals by geography**

**WIDGET SHAPES: US choropleth heatmap (state-level color coding), MSA-level bar charts, property-type comparison tables, trend sparklines**

**THE PROBLEM I AM SOLVING: CoStar charges $100K+/year for this data. I need to build a visually impressive CRE market dashboard using ONLY free and under-$1K/year sources. It does not need to be CoStar-grade granular. National and state-level data displayed beautifully is better than no data at all.**

Copy everything below this line into a SECOND Perplexity Pro Search tab:

I need to build a visual CRE (commercial real estate) market intelligence dashboard on my website

using ONLY free or very cheap (under $1,000/year) data sources. The dashboard should show US

commercial real estate market fundamentals with geographic breakdowns.

For every source, I need: exact API endpoint or download URL, geographic granularity

(national/state/MSA/county), property type coverage (office/retail/multifamily/industrial),

update frequency, and format (JSON API/CSV download/PDF to parse).

SECTION A — VACANCY RATES (the most visually impactful CRE metric)

1\. Census Housing Vacancy Survey (HVS): I know this exists at census.gov. Does it cover

   COMMERCIAL vacancy or only residential? What is the API endpoint? What geographic level?

   How frequently updated?

2\. HUD USPS Vacancy Data: I have heard that USPS mail carriers mark addresses as vacant

   during delivery, and HUD aggregates this into a dataset. Is this real? Where is it?

   What geographic level? Is it available via API or only download? Does it distinguish

   commercial from residential?

3\. Census County Business Patterns: Does this provide data I can use as a PROXY for commercial

   occupancy? (Active business establishments per county \= occupied commercial space proxy)

   What is the API endpoint? What NAICS codes correspond to CRE-heavy sectors?

4\. CoStar / CBRE / JLL / Cushman & Wakefield / Colliers / Newmark — do ANY of these publish

   free quarterly reports with ACTUAL vacancy rate numbers (not behind a paywall) for the

   top 20 US MSAs? I mean downloadable structured data, not marketing PDFs.

   Search specifically for: CBRE quarterly vacancy report download, JLL office vacancy

   data free, Cushman Wakefield market report data.

5\. National Association of Realtors (NAR): Do they publish any commercial vacancy data?

6\. Federal Reserve: Do any of the regional Fed banks (NY Fed, Chicago Fed, Dallas Fed, etc.)

   publish CRE vacancy or occupancy data in their economic reports? Is it structured?

7\. Any state-level data: Do California (CAR), New York, Texas, Florida, Illinois publish

   state-level CRE vacancy or occupancy data via an API or structured download?

SECTION B — RENT TRENDS AND ABSORPTION

8\. Zillow Research Data: I know Zillow publishes ZHVI (home values) and ZORI (rent index)

   as free CSV downloads at zillow.com/research/data. Are these updated monthly? What is

   the geographic granularity (MSA/county/ZIP)? Is there a JSON API or only CSV?

   CRITICAL: Does Zillow publish any COMMERCIAL rent data, or only residential?

9\. ApartmentList: I know they publish monthly rent reports. Is there a structured data

   download or API? What geographic level? Is it free?

10\. Redfin Data Center: What data does redfin.com/news/data-center offer? Is it commercial

    or only residential? What format? Free?

11\. NAHB Housing Market Index: Is this an API or only a press release? Can I get historical

    series? Is there a commercial-specific component?

12\. NMHC Quarterly Survey of Apartment Market Conditions: Is this freely accessible as

    structured data? Or only a PDF summary?

13\. BLS Quarterly Census of Employment and Wages (QCEW): I want to use employment GROWTH

    by MSA as a PROXY for commercial space demand. What is the API endpoint? Can I filter

    by NAICS 531 (Real Estate) and NAICS 236 (Construction)? What geographic level?

14\. Census Building Permits Survey: New construction \= future supply. Is there an API?

    What geographic level? Monthly or quarterly? Can I filter commercial vs residential?

SECTION C — CAP RATES AND TRANSACTION DATA

15\. Are there ANY free sources for commercial real estate cap rates by property type and

    market? This is the holy grail. I know CompStak ($40K+/yr) and CoStar ($100K+/yr)

    charge heavily. Are there ANY alternatives?

    — Does NCREIF publish any free data?

    — Does the American Council of Life Insurers (ACLI) publish CRE mortgage data with

      implied cap rates?

    — Does the Federal Reserve Senior Loan Officer Opinion Survey include CRE cap rate data?

    — Does MSCI Real Capital Analytics publish any free aggregate cap rate data?

    — Are there any academic datasets (Wharton, MIT, NYU) with CRE transaction data?

    — Do any county recorder systems publish commercial deed transfers with enough detail

      to compute cap rates (sale price \+ NOI)?

16\. RCA CPPI (Commercial Property Price Index): MSCI publishes the RCA CPPI. Is any

    version of it free? Monthly or quarterly national aggregate?

17\. FHFA House Price Index: I know this is residential. But does FHFA publish anything

    on commercial property values?

SECTION D — DISTRESS AND MATURITY DATA

18\. CMBS delinquency by property type: FRED has the aggregate CMBS delinquency rate.

    Is there any free source that breaks it into office/retail/multifamily/industrial/hotel?

19\. Commercial mortgage maturity schedule: The $2.2 trillion maturity wall. Is there a free

    structured data source for total CRE debt maturing by year and property type?

    Does MBA publish this? Does Trepp publish any free aggregate?

20\. Bank CRE loan concentration: BankRegData.com shows CRE/Tier-1 ratios. Is there an API?

    What about FDIC BankFind — can I query it for all banks with CRE concentration \> 300%?

21\. Special servicing rates: Any free data source, even quarterly aggregate?

SECTION E — CONSTRUCTION AND SUPPLY PIPELINE

22\. Census Building Permits (commercial-specific): I need new construction starts for

    office, retail, warehouse, and apartment buildings. Is the Census Building Permits API

    granular enough to filter by building type? What building-type codes correspond to

    commercial categories?

23\. Census Construction Spending: Does this break out private CRE construction by type?

24\. Dodge Construction Network: Any free tier or free data summary?

25\. ConstructConnect / CMD: Any free data?

SECTION F — DEMOGRAPHICS AS DEMAND PROXIES (for the geographic heatmap)

26\. Census ACS 5-Year API: Which exact TABLE IDs give me:

    — Total population by state and MSA

    — Population growth (5-year change)

    — Median household income

    — Renter vs owner ratio

    — Employment by industry

    — Household formation rate

    Give me the exact API call format for each.

27\. Census Population Estimates: For the most recent population estimate (updated annually),

    what is the endpoint?

28\. IRS SOI Migration Data: County-to-county migration patterns. How to access? API or

    download? This shows where people are MOVING TO \= where multifamily demand is growing.

29\. BLS Local Area Unemployment Statistics (LAUS): Unemployment by MSA. Exact API endpoint?

For every source you confirm, give me this format:

  NAME: \[source\]

  ENDPOINT: \[exact URL\]

  GRANULARITY: \[national / state / MSA / county / ZIP\]

  PROPERTY TYPES: \[all CRE / office+retail+MF+industrial / residential only / N/A\]

  UPDATE: \[frequency\]

  FORMAT: \[JSON API / CSV download / PDF\]

  FREE: \[yes / free key / paid\]

  VISUAL USE: \[one sentence on how this becomes a chart or heatmap on a CRE dashboard\]

**SEARCH 3 — CLAUDE DEEP RESEARCH**

**FEEDS THE: Broker portal Step 1 auto-enrich (address-level property intelligence that appears the moment a broker enters an address)**

**ALSO FEEDS: Risk overlays, environmental data, and neighborhood fingerprint widgets across both sites**

**WHY DEEP RESEARCH: This search requires cross-referencing government data portals that do not surface well in standard search. Deep Research can follow links across data.gov, api.census.gov, EPA, FEMA, USGS, HUD, and DOT to find endpoints that normal search misses.**

Copy everything below this line into a new Claude chat with Deep Research selected:

I am building a commercial real estate investment platform with a broker submission portal.

When a broker enters a property address, the platform should auto-populate a "Market Intelligence"

panel with 10–15 data tiles, each showing a specific metric about that location with a source

citation and as-of date.

I need you to do an exhaustive search of every US government API and free data source that

returns ADDRESS-LEVEL or ZIP-LEVEL or CENSUS-TRACT-LEVEL data relevant to commercial real estate.

For each source, I need: exact API endpoint URL (the URL I would fetch, not the docs page),

input parameters (does it take lat/lng, ZIP, FIPS code, address string?), output format (JSON/XML),

whether authentication is required, rate limits, and whether it has CORS headers.

CATEGORY 1 — ECONOMIC AND EMPLOYMENT (address or ZIP-level)

Search data.gov, api.census.gov, and BLS for every endpoint that returns:

— Unemployment rate by county or MSA (BLS LAUS — what is the exact API endpoint?)

— Employment by industry (NAICS) by county (BLS QCEW — exact endpoint?)

— Median household income by census tract (Census ACS — which table? B19013?)

— Poverty rate by tract (Census ACS — which table?)

— Business establishment count by ZIP (Census County Business Patterns — endpoint?)

— Job growth rate by MSA (any source)

— Commute time / transportation to work (Census ACS table B08301?)

CATEGORY 2 — DEMOGRAPHICS (tract or ZIP-level)

Search Census ACS for every table that returns:

— Total population and population growth

— Age distribution (important for multifamily: 25–34 age cohort \= peak renter demand)

— Household formation rate

— Owner vs renter occupancy ratio

— Education attainment (correlates with office demand)

— Vehicle ownership (transit demand proxy)

For each: give me the exact ACS table ID and the API call format.

CATEGORY 3 — ENVIRONMENTAL AND HAZARD (address or coordinate-level)

Search every federal agency for endpoints returning:

— FEMA flood zone by coordinate or address (NFHL WMS, or is there a REST API?)

— EPA Superfund/NPL proximity (Envirofacts — what is the radius search endpoint?)

— EPA Toxic Release Inventory (TRI) near a coordinate

— EPA brownfields near a coordinate

— USGS earthquake probability by location (is there an API for the USGS seismic hazard model?)

— NOAA storm event frequency by county (is there an API for the Storm Events Database?)

— CDC Environmental Health data by tract

— Radon zone by county (EPA or state EPAs)

— Wetlands near a parcel (USFWS National Wetlands Inventory — WMS or API?)

— Air quality index (AQI) by ZIP (EPA AirNow — exact endpoint?)

— Soil type and composition (USDA NRCS Web Soil Survey — API?)

— Noise levels (FAA airport noise contours — any API?)

CATEGORY 4 — INFRASTRUCTURE AND AMENITIES (coordinate-level)

— Walk Score, Transit Score, Bike Score (walkscore.com — is free tier still available?)

— Nearest transit stops (OpenStreetMap Overpass — exact query format for transit stops

  within 1km of a lat/lng?)

— School quality within catchment (GreatSchools API — still free? Alternatives?)

— SchoolDigger API — free tier?

— EV charging stations (Open Charge Map — exact endpoint?)

— Hospitals within radius (OpenStreetMap Overpass?)

— Grocery stores within radius (OpenStreetMap Overpass?)

— Internet service quality by address (FCC Broadband Map — any API?)

— Crime rate by address or tract (FBI UCR API, or any better source?)

— Fire station response time (any public data?)

— Highway access and traffic volume (DOT FHWA TMAS API? NPMRDS?)

CATEGORY 5 — HOUSING AND REAL ESTATE SPECIFIC (ZIP or tract-level)

— HUD Fair Market Rents by ZIP (is there an API?)

— HUD Income Limits by area

— HUD USPS Vacancy Data (addresses flagged as vacant by mail carriers)

— Census Housing Units (total, occupied, vacant by tract)

— Census Building Permits by county (new construction pipeline)

— Zillow Home Value Index by ZIP (free CSV — can it be used as a web API proxy?)

— FHFA House Price Index by MSA

— Property tax rates by county (any free source?)

— Opportunity Zones (CDFI Fund — is there a lookup API by tract?)

— Low-Income Housing Tax Credit (LIHTC) properties near an address

— Qualified Census Tracts (QCT) lookup

CATEGORY 6 — ENERGY AND UTILITIES (address or ZIP-level)

— Electricity rates by ZIP or utility territory (EIA — exact API?)

— Natural gas rates (EIA)

— Solar irradiance / solar potential (NREL PVWatts API?)

— Energy Star building scores (EPA Portfolio Manager — any public API?)

— Utility company territory lookup (OpenEI?)

CATEGORY 7 — ZONING AND LAND USE

— Is there ANY free nationwide zoning lookup API by address or parcel?

— Municipal zoning code databases — are any cities publishing their zoning maps via API?

  (Check: NYC ZoLa, LA ZIMAS, Chicago Zoning Map, Houston permitting data)

— USDA land use classification

— NLCD (National Land Cover Database) — API for land use by coordinate?

CATEGORY 8 — ISRAEL-SPECIFIC (for our Israeli investor audience)

— Bank of Israel exchange rates API (USD/ILS official rate)

— Bank of Israel interest rate data API

— Israeli Central Bureau of Statistics (CBS) APIs for housing, CPI, construction

— Tel Aviv Stock Exchange data APIs (TA-35, TA-125, Real Estate index)

— Israeli mortgage rate data

— Any Israeli government open data portal with real estate or economic APIs

I expect this search to return 80–120 individual endpoints across all categories.

For each, give me this format:

  SOURCE: \[Agency / Provider\]

  NAME: \[specific dataset name\]

  ENDPOINT: \[exact URL to fetch, with example parameters\]

  INPUT: \[what the endpoint takes: lat/lng, FIPS, ZIP, address, tract ID\]

  OUTPUT: \[JSON / XML / GeoJSON / CSV\]

  AUTH: \[none / free API key (where to register) / paid\]

  UPDATE: \[real-time / daily / weekly / monthly / quarterly / annual\]

  CORS: \[yes / no / unknown\]

  RATE LIMIT: \[calls per period\]

  CRE USE: \[one sentence: what visual widget this becomes on a CRE platform\]

**SEARCH 4 — GEMINI**

**FEEDS THE: The visual component library — every JavaScript library needed to RENDER the data as beautiful dark-theme financial widgets**

**ALSO: CSS animation techniques, WebGL effects, micro-interaction libraries**

**CONTEXT: The site uses React 18, Next.js 15, Tailwind CSS, Tremor (Tremor is already installed). Navy (\#0E3470) and gold (\#BC9C45) color scheme. Dark theme.**

Copy everything below this line into Gemini:

I am building a commercial real estate investment platform with a dark navy/gold color scheme.

Tech stack: React 18, Next.js 15, Tailwind CSS, Tremor.js (already installed).

I need to find every free JavaScript library and technique for rendering live financial data

as beautiful visual widgets.

For each library: npm package name, GitHub URL, stars count, gzipped bundle size,

last npm publish date, React 18 compatibility, and a one-line description.

CATEGORY 1 — SCROLLING TICKERS (Bloomberg-style rate strips)

Search for: react scrolling ticker financial, react marquee stock price,

react horizontal scroll auto, react-fast-marquee, react-ticker.

I need: variable speed, pause on hover, RTL support (important — Hebrew), gold/green/red

delta indicators, source citation labels under each token.

Also search for any pure CSS-only marquee techniques that avoid JS entirely.

CATEGORY 2 — ANIMATED NUMBER COUNTERS

Search for: react-countup, react-odometer, react-spring number animation,

framer-motion number counter, use-count-up.

I need: spring physics (not linear), decimal point support, currency formatting,

percentage formatting, locale-aware (Israeli number formatting uses periods for thousands).

CATEGORY 3 — FINANCIAL CHARTS AND SPARKLINES

Search for: lightweight-charts (TradingView), react-sparklines, react-trend,

react-mini-chart, peity, sparkline-svg.

I specifically need: tiny inline sparklines under 5KB that can render inside a table cell

or next to a number. Also: yield curve chart component, area chart with gradient fill,

candlestick chart for historical prices.

Also: does Tremor.js (which I already have) have sparkline support?

CATEGORY 4 — US CHOROPLETH MAP (state-level heatmap)

Search for: react-simple-maps, react-us-map, d3-geo react, topojson react,

react-usa-map, datamaps react.

I need: US state boundaries with hover tooltips, click-to-zoom to MSA level,

custom color scale (navy-to-gold gradient), responsive sizing, dark background.

Also: can Mapbox GL JS or MapLibre GL JS render a choropleth without tiles (just boundaries)?

CATEGORY 5 — GAUGE / RADIAL METER

Search for: react-gauge-component, react-d3-speedometer, react-circular-progressbar,

react-minimal-gauge.

I need: semicircle gauge for metrics like "Market Cycle Position" or "Distress Index",

dark theme, gold accent, animated needle or fill.

CATEGORY 6 — ANIMATED GLOBE / 3D MAP

Search for: react-globe.gl, globe.gl, three-globe, cobe (the tiny one used by Vercel),

cesium react, mapbox-gl globe.

I need: dark globe with gold/amber glowing dots at specific coordinates,

slow auto-rotation, responsive, under 100KB ideally. The Vercel-style mini globe (cobe)

is the aesthetic I want. Confirm: is cobe still maintained? What is the bundle size?

CATEGORY 7 — REAL-TIME ACTIVITY FEED / LOG

Search for: react-activity-feed, react-timeline, react-event-timeline,

react-chat-ui (as a base for feed rendering).

I need: a vertically scrolling feed showing anonymized events like

"Class A Office, Phoenix — under review · 2h ago" with animated entry.

CATEGORY 8 — CSS AND WEBGL AMBIENT EFFECTS

Search for: meshgradient.com, react-particles (tsparticles), vanta.js, react-three-fiber

backgrounds, shader-gradient, granim.js.

I need: dark-theme animated background effects for hero sections.

Gold particle flow, abstract geometric patterns, mesh gradients.

Must respect prefers-reduced-motion and not kill mobile performance.

CATEGORY 9 — SKELETON LOADERS AND LOADING STATES

Search for: react-loading-skeleton, react-content-loader, react-placeholder.

I need skeletons that look like financial widgets (chart outlines, number placeholders,

ticker-bar placeholders), not generic gray boxes.

CATEGORY 10 — MICRO-INTERACTION LIBRARIES

Search for: framer-motion (I know this), react-spring, auto-animate,

motion (the new standalone from Framer), @formkit/auto-animate.

I need: scroll-triggered animations (elements appear on scroll),

hover-lift effects on cards, smooth accordion/expand, page transition animations.

Which of these is smallest? Which has the best React 18 support?

CATEGORY 11 — SOUND DESIGN (optional)

Search for: howler.js, tone.js, use-sound react hook.

I need: very subtle tick/click sounds when rate-ticker updates, soft chime on form completion.

What is the lightest option?

CATEGORY 12 — RTL (RIGHT-TO-LEFT) SUPPORT

Search for: which of the above libraries support RTL layout natively?

My platform has an Israeli Hebrew version. The ticker, charts, and maps all need

to work in RTL mode without breaking. Flag any library that is known to break on RTL.

**SEARCH 5 — GEMINI**

**FEEDS THE: The deep corners — obscure data sources, GitHub repos, academic datasets, and API marketplaces that standard search misses**

**THIS IS THE "FIND WHAT I DON'T KNOW I'M MISSING" SEARCH**

Copy everything below this line into a second Gemini tab:

I am building a commercial real estate intelligence platform. I have already identified the

standard government APIs (FRED, Census, BLS, FEMA, EPA, USGS, NOAA, FDIC, HUD).

I have already identified the major CRE vendors (CoStar, CompStak, CRED iQ, Trepp, ATTOM).

I need you to find the sources I do NOT already know about. Go deep into corners that

standard searches miss.

SEARCH SET 1 — API MARKETPLACES

Search RapidAPI.com for: commercial real estate, property data, vacancy rates, cap rates,

rent analysis, CMBS, real estate analytics.

Search APILayer.com for: real estate, property, housing.

Search API Ninjas for: real estate, property, housing.

Search ProgrammableWeb.com for: commercial real estate APIs.

For each hit: name, URL, pricing, what it returns.

SEARCH SET 2 — GITHUB OPEN SOURCE

Search GitHub for: CRE data aggregator, commercial real estate scraper,

real estate market data python, vacancy rate tracker, CMBS data parser,

FRED real estate, census housing API wrapper, zoning lookup API.

I want: repos with 50+ stars that aggregate or scrape CRE data from public sources.

Also search for: awesome-real-estate-data, awesome-commercial-real-estate,

any curated lists of real estate data APIs.

SEARCH SET 3 — ACADEMIC AND RESEARCH DATASETS

Search for: MIT Center for Real Estate data, Wharton real estate data,

NYU Furman Center data, Lincoln Institute of Land Policy data,

NCREIF data access, Urban Institute housing data, Brookings real estate.

Any academic institution that publishes CRE data freely?

SEARCH SET 4 — INTERNATIONAL CAPITAL FLOW DATA

I need to show where capital flows into US CRE from globally. Search for:

— BIS (Bank for International Settlements) cross-border real estate investment data

— IMF capital flow data

— UNCTAD FDI data (by sector: does it break out real estate?)

— Treasury International Capital (TIC) data — does it show foreign buying of US real estate?

— CFIUS annual report data (foreign investment reviews in US real estate)

— FIRPTA data (withholding on foreign investment in US real property)

— Association of Foreign Investors in Real Estate (AFIRE) survey data

SEARCH SET 5 — ISRAELI DATA SOURCES (deep dive)

My investor base is 99% Israeli. Search specifically for:

— Bank of Israel API documentation (boi.org.il/en/Pages/Default.aspx — is there a

  developer section with REST APIs?)

— Israeli CBS (Central Bureau of Statistics) API at cbs.gov.il — do they have a

  programmatic data access service? What datasets?

— Tel Aviv Stock Exchange API (tase.co.il) — any free data endpoints?

— Israeli Ministry of Finance API — government bond yields, budget data?

— Israeli Land Authority (Minhal) data — any public datasets on land transactions?

— Madlan.co.il (Israel’s Zillow equivalent) — any API or data scraping option?

— Yad2.co.il real estate data — any API?

— Israel Innovation Authority data

— Globes / Calcalist financial data feeds — any structured API?

— Israeli pension fund allocation data (Gemel) — can I show how much Israeli institutional

  capital is flowing into US real estate?

SEARCH SET 6 — REAL-TIME NEWS AND SENTIMENT

— GDELT Project: confirm the exact API endpoint for filtering news by topic (commercial

  real estate, CMBS, office vacancy, interest rates). What is the query format?

— Federal Register API: I want to show when new CRE-affecting regulations are proposed.

  What is the endpoint? Can I filter by agency (SEC, HUD, FDIC, OCC)?

— FOMC meeting calendar: is there a structured API for upcoming Fed meeting dates?

— Congressional hearing calendar: when CRE legislation is on the docket. Any API?

— SEC EDGAR: can I pull recent Form D filings for real estate offerings? Endpoint?

— Google Trends API: can I query interest in "office vacancy" or "commercial real estate

  crash" as a sentiment indicator? Is there a free programmatic API or only the web tool?

SEARCH SET 7 — INSURANCE AND CLIMATE RISK (free sources only)

— FEMA National Flood Insurance Program (NFIP) claims by ZIP — API?

— State insurance rate filings (especially Florida, California, Texas) — any API?

— NOAA climate normals by station (30-year averages) — API?

— First Street Foundation — is there any free tier or limited free API?

— USDA Plant Hardiness Zone Map — API for climate zone by coordinate?

— National Interagency Fire Center (NIFC) wildfire data — API?

For every source found, give me: name, URL, pricing, what data it returns,

and a one-line note on how an Israeli CRE investor would use it.

**WHEN YOU BRING RESULTS BACK TO THIS CHAT**

Paste each result into a separate message here. Label them:

SEARCH 1 RESULT (Perplexity — Ticker rates and FX)

SEARCH 2 RESULT (Perplexity — CRE market dashboard data)

SEARCH 3 RESULT (Claude Deep Research — Address-level intelligence)

SEARCH 4 RESULT (Gemini — Visual component libraries)

SEARCH 5 RESULT (Gemini — Deep corners and Israeli data)

If any result is too long for one message, break into parts: SEARCH 2 RESULT PART 1, SEARCH 2 RESULT PART 2, etc.

I will synthesize all five into a master widget catalog: widget slot → data source → visual component → placement on page → effort estimate → regulatory note.

© 2026 RePrime Group · War Room Seed Project · Confidential