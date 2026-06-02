# US Hospitality & Travel Demand: Free/Freemium Data Source Map
## Bloomberg-Style CRE Intelligence Terminal — Tier 1: Hospitality Stack
*Prepared for Israeli Family Office & Institutional LP Audience | May 2026*

***

## Executive Summary

This map catalogs every free and freemium data source powering a live RevPAR and Travel Demand ticker stack across all 28 source categories specified. The terminal architecture requires three signal layers: (1) **daily/weekly lagging actuals** (CoStar/STR free press, TSA throughput, gaming revenues); (2) **monthly leading indicators** (NTTO arrivals, BTS T-100, NPS visitation, gaming handles); and (3) **quarterly pipeline context** (Lodging Econometrics, EDGAR XBRL, CBRE/JLL reports). All free-tier data collectively covers national and Top-25-MSA RevPAR, supply pipeline by chain scale, STR crossover, and demand vectors without a single paid subscription—though with meaningful data-lag and granularity trade-offs documented in the Notes column below.

***

## Master Data Source Table

| # | Source Name | Exact URL / Endpoint | Free vs Freemium | Free-Tier Rate Limit / Quota | Geographic Granularity | Update Frequency | Data Format | Auth Required | Specific Fields Available (Free) | Cross-Verifiable With | Terminal Tile | Notes / Gotchas |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **1** | **CoStar / STR Weekly Hotel Performance (via LodgingMagazine digest)** | `https://lodgingmagazine.com/tag/costar/` | **Free** | Unlimited (public editorial) | Top-25 MSA + National | Weekly (Monday release, prior week data) | HTML/web scrape | None | National + top-25 MSA: Occupancy %, ADR ($), RevPAR ($), YoY % change | STR press via HospitalityNet; AHLA monthly | **Primary RevPAR Ticker** | CoStar acquired STR in 2019. Free weekly digest published via LodgingMagazine and HospitalityNet 24–48 hrs after STR release. No API; scrape HTML table. Chain-scale breakdown not in free digest—only national/top-25 aggregates.[^1][^2][^3] |
| **2** | **STR Weekly Insights via HospitalityNet** | `https://www.hospitalitynet.org/search/q-STR+weekly+insights` | **Free** | Unlimited (editorial) | National + Top-25 MSA | Weekly | HTML | None | Occupancy, ADR, RevPAR, YoY change; some chain-scale commentary | CoStar news, AHLA outlook | RevPAR Ticker / Chain Scale tile | Press release format. Search "STR Weekly Insights" + date. Some releases include chain-scale highlights (Luxury vs Economy divergence). Inconsistent structured format—NLP parsing required.[^4][^5] |
| **3** | **HotelNewsNow.com (CoStar STR editorial)** | `https://www.hotelnewsnow.com` | **Free** | Unlimited | National, top-25 MSA, some regional | Weekly/daily news | HTML / RSS | None | RevPAR trends, chain scale commentary, supply pipeline updates, STR press digest | Lodging Magazine CoStar digest | RevPAR news feed tile | RSS: `https://www.hotelnewsnow.com/rss`. Newsletters available free. Full STR data tables are subscription (STR STAR). Editorial commentary quotes chain-scale RevPAR directional data weekly.[^6] |
| **4** | **CoStar News — Hotels Section** | `https://www.costar.com/news/hotels` | **Free** | Unlimited (register for newsletter) | National, MSA | Daily | HTML | Email signup (free) | Top-25 MSA weekly occupancy/ADR/RevPAR snippets; quarterly trends; transaction news | STR press, REIT 10-Q filings | RevPAR Ticker feed | Free newsletter subscription delivers weekly performance table to inbox. No API. Sign-up at costar.com/news/hotels. Major paywall for benchmarking platform; free tier = press digests only.[^7][^8] |
| **5** | **Actabl HotelData.com — Free Benchmarks** | `https://hoteldata.com` | **Free** | Unlimited | National; state-level; chain scale | Quarterly reports; real-time dashboard TBD | Web / PDF | None | RevPAR, ADR, GOP%, labor costs; chain-scale comparisons; state-level benchmarks | CoStar/STR weekly, REIT 10-Q | RevPAR / Chain Scale tile | Launched July 2025 by Actabl. Inaugural report: 2025–2026 Budget Planning Guide. Data sourced from thousands of US hotels. Free, no registration. Chain-scale breakdown available. Cross-verify with REIT earnings.[^9][^10][^11] |
| **6** | **PwC US Hospitality Directions** | `https://www.pwc.com/us/en/industries/consumer-markets/hospitality-leisure/us-hospitality-directions.html` | **Free** | Unlimited | National; chain-scale | Bimonthly/quarterly | PDF / HTML | None | RevPAR forecast by chain scale; ADR, occupancy outlook; supply pipeline narrative; macro drivers | CBRE Hotels, STR/CoStar press | Supply Pipeline / Forecast tile | Free quarterly PDF. Cites STR data with PwC overlay. December 2025 edition forecasts 2026 RevPAR +0.9%, ADR +1.1%. Luxury supply growing fastest. No MSA breakdown in free version.[^12][^13][^14] |
| **7** | **AHLA Resource Center — Monthly Outlook & Surveys** | `https://www.ahla.com/resource-center` | **Free** (some gated) | Unlimited for public reports | National | Monthly surveys; quarterly state-of-industry | PDF / HTML | None (some member-only) | Hotel lodging preference data, segment performance indicators, business vs leisure travel split, inflation impact | US Travel TTI, MMGY Portrait | Demand Sentiment tile | Holiday Outlook surveys free. Full State of the Industry reports may require AHLA membership. Public research reports downloadable without account. Cross-ref: Morning Consult survey data cited.[^15][^16][^17] |
| **8** | **CBRE Hotels Research** | `https://www.cbre.com/insights` (filter: Hotels) | **Free** (selective) | Unlimited for published reports | National; major market; chain scale | Quarterly | PDF | None | Investor intentions, RevPAR by market type (urban, resort), cap rate trends, investment volume | JLL Hotels outlook, PwC Directions | Acquisition Signal / Cap Rate tile | 2025 Investor Intentions Survey shows 94% expect stable or increased hotel investment. H2 2025 Global Hotel Outlook free. Full MSA-by-MSA data requires CBRE client access. Free reports go national/segment.[^18][^19][^20] |
| **9** | **JLL Hotels & Hospitality — Investment Outlook** | `https://www.jll.com/en-us/insights/market-outlook/global-hotel-investment` | **Free** | Unlimited | Global / National / Segment | Annual (Feb) + mid-year | PDF | None | Hotel investment volume, debt market conditions, RevPAR growth forecasts, transaction activity, cap rates | CBRE Hotels, HVS, CoStar | Investment Flow / Cap Rate tile | 2026 Global Hotel Investment Outlook (Feb 2026) free PDF download. "Robust increase" forecast. World Cup host city RevPAR mid-double-digit growth. No MSA-level free data. AFIRE partnership publishes excerpts.[^21][^22][^23] |
| **10** | **HVS Hotel Cost Estimating Guide (Free)** | `https://www.hotelcostestimatingguide.com` | **Free** | Unlimited | National / chain scale tiers | Annual (May) | PDF | None | CapEx construction costs, FF&E renovation costs by chain scale (Economy, Midscale, Upscale, Upper Upscale, Luxury); 2025 edition active | JLL Development Cost Survey, Lodging Econometrics pipeline | Development Cost / Pipeline tile | 17th annual edition released May 2025 by Nehmer + Associates & HVS Design. Fully free download, no registration. Critical for underwriting renovation budgets. Also see HVS U.S. Hotel Development Cost Survey (free at hvs.com).[^24][^25][^26] |
| **11** | **Lodging Econometrics — Quarterly Pipeline Press Releases** | `https://lodgingeconometrics.com/tag/construction-pipeline-trend-report/` | **Free** (press digests) | Unlimited | National; chain scale; top cities by project count | Quarterly (Q1–Q4) | HTML / press release | None | Total pipeline projects + rooms by chain scale (Luxury, Upper Upscale, Upscale, Upper Midscale, Midscale, Economy); under construction; starts within 12 months; early planning; brand conversions; top 10 cities by pipeline | STR supply, AHLA, CBRE pipeline | Supply Pipeline / 24-Month Forward tile | Q1 2026: 6,020 projects / 705,825 rooms, down ~5% YoY. Upper Midscale leads (2,279 projects). Dallas #1 city. Full city-by-city MSA breakdown, franchisor data, and opening lists require paid subscription. Press releases are free and highly granular at chain scale level.[^27][^28][^29][^30][^31] |
| **12** | **AirDNA — Free City Dashboards** | `https://www.airdna.co/vacation-rental-data` | **Freemium** | Free: market overview only; limited historical; no CSV export | MSA / neighborhood | Monthly aggregate (delayed) | Web dashboard | Free account required (email) | Active listings count, average occupancy %, average daily rate, RevPAR (STR), seasonality curve | Inside Airbnb, CoStar/STR RevPAR | STR Crossover / Airbnb Supply tile | Free tier shows directional data for 120K+ markets. AirDNA tracks 10M+ Airbnb/Vrbo properties. Paid plans ($595+/yr) required for CSV, historical, comp set, forward-looking data. Free tier sufficient for supply trend direction only. 2026 outlook: supply reaccelerating faster than demand.[^32][^33][^34][^35] |
| **13** | **Inside Airbnb — Open Source CSV Downloads** | Base: `https://data.insideairbnb.com/{country}/{state}/{city}/{date}/data/listings.csv.gz` Example NYC: `https://data.insideairbnb.com/united-states/ny/new-york-city/2025-12-04/data/listings.csv.gz` Index: `https://insideairbnb.com/explore/` | **Free** | Unlimited (open data) | ~40 US MSAs (see below) | Quarterly scrapes (irregular) | CSV.gz / GeoJSON | None | Listing ID, host ID, neighborhood, room type, price/night, minimum nights, availability (365-day calendar), reviews/month, last review date, estimated occupancy (proxy), coordinates | AirDNA free dashboard, CoStar/STR RevPAR | STR Supply Map / Competitive Overlay tile | US cities covered: NYC, LA, Chicago, SF, Seattle, DC, Boston, Austin, Denver, Nashville, New Orleans, Portland, Dallas, Houston, Hawaii, San Diego, San Mateo, Santa Clara, Santa Cruz, Twin Cities, Columbus, Albany, Asheville, Bozeman, Jersey City, Newark, Oakland, Pacific Grove, Rhode Island, Rochester, Salem OR. Clark County NV (Las Vegas area). URL pattern: `data.insideairbnb.com/united-states/[state-abbrev]/[city-slug]/[YYYY-MM-DD]/data/listings.csv.gz`. National US archive also available. No API rate limits.[^36][^37][^38] |
| **14** | **TSA Checkpoint Daily Throughput** | `https://www.tsa.gov/coronavirus/passenger-throughput` Python: `import requests, pandas as pd; r=requests.get('https://www.tsa.gov/coronavirus/passenger-throughput'); df=pd.read_html(r.text)` data.gov: `https://catalog.data.gov/dataset/covid-19-passenger-throughput` | **Free** | Unlimited | National (no airport breakdown on public page) | Daily (updated next business day ~8am ET) | HTML table (scrape) / data.gov catalog | None | Daily checkpoint traveler count; same-day prior year comparison (2-year lookback); YoY % | BTS airline passengers, NTTO arrivals | Travel Demand Ticker (primary leading indicator) | THE single highest-frequency free hospitality signal. Data published daily by TSA.gov. Use requests+pandas to scrape HTML table (direct pd.read_html returns 403; use requests workaround). data.gov catalog last checked May 2026. GitHub: mikelor/tsathroughput for historical CSV back to 2018. Airport-level data available via FOIA request only.[^39][^40][^41][^42] |
| **15** | **BTS TranStats — T-100 Domestic & International Segment** | `https://www.transtats.bts.gov/Tables.asp?QO_VQ=EEE` Download tool: `https://www.transtats.bts.gov/DL_SelectFields.aspx` Direct table: T-100 Domestic All Carriers | **Free** | Unlimited | Airport / state / city-pair level | Monthly (2-month lag) | CSV download (manual or scripted) | None | Passengers, freight, mail by carrier/origin/destination/service class; departures performed; available seats; load factor (calculated) | TSA daily, NTTO I-94, DB1B | Air Demand by MSA tile | Latest available: February 2026 as of May 2026. T-100 Domestic + International combined available. DB1B (10% ticket sample) available quarterly at `transtats.bts.gov/TableInfo.asp?DB_ID=125`. No API—download via web form; can be automated with `requests` POST to download URL.[^43][^44][^45][^46][^47] |
| **16** | **NTTO / ITA — I-94 International Visitor Arrivals** | `https://www.trade.gov/i-94-arrivals-program` Data hub: `https://data.commerce.gov/i-94-arrivals-monthly-quarterly-and-annual` Excel workbooks: ITA provides monthly Excel download via trade.gov | **Free** | Unlimited | National; by country of origin; by port of entry | Monthly (2–3 month lag) | Excel / web dashboard | None | Total non-US resident arrivals; overseas visitor volume; arrivals by country (Canada, Mexico, UK, Germany, France, etc.); YoY % | BTS T-100, US Customs CBP, AHLA | International Demand tile | NTTO forecasts 85M international visitors to US in 2026 (up from 72.4M in 2024). New interactive I-94 Visitor Arrivals Monitors launched 2021. Monthly Excel workbooks remain free. Overseas arrivals down 2.9% YoY in Aug 2025—important geopolitical signal for Tel Aviv principals.[^48][^49][^50][^51][^52] |
| **17** | **US Customs and Border Protection (CBP) Border Crossing Data** | BTS portal: `https://data.bts.gov/stories/s/jswi-2e7b` data.gov: `https://catalog.data.gov/dataset/visitor-arrivals-program-i-94-data-2f38a` CBP operational stats: `https://www.cbp.gov/newsroom/stats` | **Free** | Unlimited | Port of entry level; state; national | Monthly | CSV / Excel | None | Trucks, buses, vehicles, pedestrians entering US; inbound passengers by port (Canada/Mexico border); I-94 arrivals (with NTTO) | NTTO I-94, BTS T-100 | Cross-Border Arrivals tile | BTS compiles CBP data into clean datasets. September 2025 report shows land crossings from Canada -3.7% YoY. Useful for Canada-source leisure demand to northern US hotel markets. Air arrivals tracked via NTTO I-94 program.[^53][^54][^55] |
| **18** | **US Travel Association — Travel Forecasts & TTI** | Forecasts: `https://www.ustravel.org/research/travel-forecasts` Travel Price Index: `https://www.ustravel.org/research/travel-price-index` Snapshots: `https://www.ustravel.org/us-travel-snapshot-{month-year}` PDF archive: `https://www.ustravel.org/sites/default/files/...` | **Free** | Unlimited | National; sector-level | Seasonal forecasts (Spring/Fall/Winter); monthly TPI; quarterly snapshots | PDF / HTML | None | Total travel spending (leisure + business); domestic vs international split; hotel demand index; airline demand; TPI (hotel prices, airfare, fuel); inbound visitor decline/growth | NTTO arrivals, BTS, AHLA | Macro Demand Forecast tile | Spring 2026 forecast: total travel spending $1.37T in 2026, domestic up 0.9%. TPI April 2026: hotel prices +4.3% YoY, airfare +20.7%. Business travel $319B in 2026. US Travel Snapshot is a monthly free PDF. TTI (Travel Trends Index) is quarterly—tracks hotel room nights and air passengers.[^56][^50][^57][^58] |
| **19** | **GBTA Business Travel Index (BTI) — Free Excerpts** | `https://gbta.org/research-and-advocacy/` Executive summary: `https://gbta.org/wp-content/uploads/GBTA-BTI-Report_2025_Executive-Summary-FINAL.pdf` | **Freemium** | Free executive summary; full report requires GBTA membership | Global / national business travel | Annual forecast; quarterly pulse surveys | PDF / HTML | None (for exec summary) | Global business travel spend forecast; airfare trends; hotel rate trends; corporate booking intent; policy uncertainty impact | US Travel TTI, BTS T-100, Marriott/Hilton 10-Q | Corporate Travel Demand tile | 2025 BTI: global business travel to hit $1.57T, new record high. CWT + GBTA jointly publish. Airfares -2.2% in 2025 after +4.8% in 2024. Full BTI tables require membership. Free exec summary sufficient for directional signaling. 43% of travel professionals now optimistic for late 2025 (up from 28%).[^59][^60][^61][^62][^63] |
| **20** | **Hotel REIT 10-Q / 10-K — EDGAR XBRL API (No Auth)** | EDGAR API: `https://data.sec.gov/submissions/CIK0000001061937.json` (Host Hotels CIK) CompanyFacts: `https://data.sec.gov/api/xbrl/companyfacts/CIK0000001061937.json` EDGAR Full-Text: `https://efts.sec.gov/LATEST/search-index?q=%22RevPAR%22&dateRange=custom&startdt=2025-01-01&forms=10-Q` Key CIKs: Host=1061937, Park Hotels=1617063, Apple Hosp.=1418121, RLJ=1511808, Summit=1497645 | **Free** | Unlimited (SEC EDGAR is public) | By REIT portfolio (MSA-weighted); chain scale via brand disclosure | Quarterly (10-Q: 45 days post quarter-end; 10-K: 60-90 days) | JSON (XBRL) / HTML filing | None | Comparable hotel RevPAR, ADR, occupancy YoY%; Total RevPAR; comparable hotel revenue; EBITDA; systemwide RevPAR by segment (for franchisors); guidance ranges | CoStar/STR weekly, CBRE Hotels | REIT Performance Dashboard tile | EDGAR APIs require NO authentication. Free XBRL data via `data.sec.gov`. Host Hotels Q1 2026: Comparable Total RevPAR $418.20 (+4.6% YoY). RevPAR is disclosed in the financial highlights section of each 10-Q. Franchisor 10-Ks (Marriott, Hilton, Hyatt, IHG, Wyndham, Choice) also disclose systemwide RevPAR by chain scale/region quarterly.[^64][^65][^66][^67] |
| **21** | **Marriott International — Quarterly RevPAR by Region/Segment** | SEC filing: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=MAR&type=10-Q&dateb=&owner=include&count=10` | **Free** | Unlimited | Global + North America; brand/chain scale | Quarterly | HTML / XBRL | None | Systemwide RevPAR %, ADR %, occupancy %; NA Full Service, NA Select Service; international; luxury vs full service vs select | Hilton 10-Q, IHG Annual, CoStar | Chain Scale Benchmark tile | Marriott discloses RevPAR by segment (luxury, premium, select) in quarterly earnings tables. Cross-reference with Hilton (HLT), Hyatt (H), IHG (annual + interim), Choice Hotels (CHH), Wyndham (WH). Combined these 5 franchisors cover ~85% of US branded hotel inventory.[^68] |
| **22** | **NPS Visitor Use Statistics — Monthly Park Visitation** | Dashboard: `https://www.nps.gov/subjects/socialscience/visitor-use-statistics-dashboard.htm` IRMA data portal: `https://irma.nps.gov/Stats/` CSV download: `https://catalog.data.gov/dataset/nps-visitor-use-statistics-data-package-2025` Files: `Main_State_Data.csv`, `Main_Data.csv` | **Free** | Unlimited | National; by park unit; by state | Monthly (annual release Q1 following year; dashboard shows monthly) | CSV / PDF | None | Recreation visits by month/park/state; overnight stays; recreation visitor hours; visitor spending estimates | US Travel TTI, TSA throughput | Leisure Demand / National Parks tile | 323M recreation visits in 2025 (down 2.7% from 2024 record). Monthly data on IRMA portal back to 1979. CSV files on data.gov updated annually. Monthly dashboard shows real-time 2025 data by park. 26 parks set new records in 2025. Correlates with nearby hotel markets (Yellowstone→Jackson WY, Zion→St. George UT, Grand Canyon→Flagstaff AZ).[^69][^70][^71] |
| **23** | **Nevada Gaming Control Board — Monthly Strip/Statewide Revenue** | `https://www.gaming.nv.gov/about-us/gaming-revenue-information-gri/` Direct PDF example: `https://www.gaming.nv.gov/contentassets/a7958398526e4e309d248ea35a2a20dd/september-2025-monthly-revenue-report.pdf` | **Free** | Unlimited | Nevada statewide; Las Vegas Strip; Downtown; Clark County unincorporated; Reno/Sparks; other counties | Monthly (30-day lag) | PDF | None | Gaming win ($); slot revenue; table game revenue; 1-month, 3-month, 12-month comparisons; by geographic area | AGA State of the States; CoStar Las Vegas RevPAR | Las Vegas Hotel Demand tile | Las Vegas Strip Dec 2025: $827.7M (down 6% YoY). Full 2024 NV statewide: record $15.6B. PDF links use predictable naming convention: `/[month-year]-monthly-revenue-report.pdf`. No API; scrape PDF. Gaming revenue is a leading indicator for luxury/upper-upscale Las Vegas hotel performance.[^72][^73][^74][^75] |
| **24** | **NJ Division of Gaming Enforcement — Atlantic City Monthly** | `https://www.njoag.gov/about/divisions-and-offices/division-of-gaming-enforcement-home/financial-and-statistical-information/monthly-gross-revenue-reports/` | **Free** | Unlimited | Atlantic City (9 casinos) + statewide internet gaming | Monthly (30-day lag) | PDF | None | Casino win by property; slots/tables/internet gaming split; YoY comparison; gaming taxes | NGCB Nevada, AGA State of the States | Atlantic City Demand tile | April 2025: total gaming revenue $536.6M (+5% YoY); internet gaming $235.2M (+25.2%). NJ internet gaming now regularly exceeds in-person. PDF archive at UNLV Gaming Library: `gaming.library.unlv.edu/reports/`.[^76][^77][^78][^79] |
| **25** | **AGA State of the States — Annual Commercial Gaming Report** | `https://www.americangaming.org/resources/state-of-the-states-2025/` PDF: `https://www.americangaming.org/wp-content/uploads/2025/05/AGA-State-of-the-States-2025.pdf` | **Free** | Unlimited | All 38 commercial gaming states; national | Annual (published May each year) | PDF | None | Revenue by state; tax revenue; employment; casino count; sports betting handle; iGaming; YoY growth | NGCB Nevada, NJ DGE, individual state GCBs | Gaming Market Overview tile | 2024: US commercial gaming revenue $72.04B, +7.5% YoY, 4th consecutive record year. 28 of 38 states set annual records. iGaming growing 29.5% YTD through May 2025. Cross-reference with individual state gaming control boards for monthly data.[^80][^81][^82][^83] |
| **26** | **NTTO / Trade.gov — International Air Travel Statistics (I-92)** | `https://www.trade.gov/us-international-air-travel-statistics-i-92-data` Interactive monitor: `https://www.trade.gov/i-94-arrivals-program` | **Free** | Unlimited | Airport/gateway level; by country; national | Monthly (2–3 month lag) | Excel / web | None | International air passenger enplanements to/from US; by carrier (US vs foreign flag); by country; by citizenship | BTS T-100, NTTO I-94 | International Gateway Demand tile | US-international enplanements Aug 2025: 25.6M (+1.2% YoY), at 104.7% of 2019 levels. Overseas visitation down 2.9% YoY in same month. Key signal for international-demand-dependent markets (NYC, Miami, LA, Las Vegas, Orlando).[^49][^54] |
| **27** | **US Travel Association — Travel Price Index (TPI)** | `https://www.ustravel.org/research/travel-price-index` | **Free** | Unlimited | National (based on CPI components) | Monthly | HTML / PDF | None | Hotel price inflation YoY%; airfare %; fuel %; food away from home %; composite TPI; vs broader CPI | BLS CPI, AHLA, CoStar ADR | ADR Inflation tile | TPI April 2026: hotel prices +4.3% YoY (reversal from earlier declines), airfare +20.7% (highest since 2022 rebound), overall TPI +7.8% YoY. Largest monthly increase in 2+ years driven by fuel surge.[^56] |
| **28** | **CLIA — State of the Cruise Industry Annual Report** | `https://cruising.org/resources/state-cruise-industry-report-2025` | **Free** | Unlimited | Global / North American ports | Annual (May) | PDF / Web | None | Global passenger volume forecast; vessel count; passenger capacity; economic impact; port-level calls (limited) | Port authority data; NTTO arrivals | Cruise-Adjacent Hotel Demand tile | 2025 report: industry forecast to welcome 37.7M ocean passengers; 310 ocean-going vessels. Free PDF download. For port-level cruise call data, supplement with individual port authority reports (PortMiami, Port Everglades, Port Canaveral, Port of Seattle).[^84][^85] |
| **29** | **MMGY Global — Portrait of American Travelers (Annual)** | `https://www.mmgyglobal.com` (annual reports page) Quarterly: `https://mmgyintel.com/` | **Freemium** | Free exec summaries; full reports $2,500 | National; segment (leisure vs business; demographics) | Annual (full); quarterly pulse | PDF | None (exec summary) | Vacation intentions, trip frequency, spend per trip, lodging preference (hotel vs STR vs other), travel budget ($5,051 avg in 2025), loyalty program impact | GBTA BTI, US Travel TTI, AHLA surveys | Consumer Demand Sentiment tile | Q4 2024 free summary: 8 in 10 US adults plan vacation in next 12 months; avg budget $5,051; 4.1 trips/person projected for 2025. Full Portrait report ($2,500/yr) contains MSA preferences and chain scale affinity. Global Compass 2025 free PDF available at mmgy.com.[^86][^87][^88] |
| **30** | **Knowland (by Cendyn) — Meeting & Events Free Snippets** | `https://www.knowland.com` (press releases and blog) | **Freemium** | Free: press summaries and quarterly trend reports; no data API | National; top meeting markets | Quarterly | HTML / PDF | None (for press) | Meeting and event booking pace; group room nights by market; event recovery vs 2019; top vertical markets generating group demand | Cvent data, GBTA BTI, CoStar group segment RevPAR | Group Demand tile | Knowland now owned by Cendyn. Full meeting intelligence platform is subscription. Free quarterly trend reports and industry press releases show directional group demand recovery. Supplement with Cvent blog: `cvent.com/en/blog/hospitality/event-hospitality-trends`.[^89][^90][^91] |
| **31** | **BTS Border Crossing Data** | `https://data.bts.gov/stories/s/jswi-2e7b` Socrata API: `https://data.transportation.gov/resource/keg4-3bc2.json` | **Free** | Unlimited (Socrata open API; no key required) | Port of entry; state; US–Canada / US–Mexico | Monthly | JSON / CSV | None | Vehicle crossings; pedestrian crossings; bus passengers; trains; containers; by port of entry | CBP operational stats; NTTO I-94 | Land Border Demand tile | Socrata JSON API at data.transportation.gov is queryable without API key. Filter by state, port, date range. Example: `?State=New+York&Measure=Personal+Vehicles&$limit=1000`. Useful for Canadian inbound leisure demand to NY, WA, MI, MN hotel markets.[^53][^92][^93] |
| **32** | **SEC EDGAR Full-Text Search — RevPAR in 10-Q Filings** | `https://efts.sec.gov/LATEST/search-index?q=%22RevPAR%22&forms=10-Q&dateRange=custom&startdt=2025-01-01` EDGAR XBRL API: `https://data.sec.gov/api/xbrl/companyfacts/CIK{##########}.json` | **Free** | 10 requests/second (no auth needed) | By company portfolio; MSA weighted | Quarterly (10-Q) | JSON / HTML | None | RevPAR %, ADR %, occupancy %; same-store hotel revenue; brand/scale segment commentary in MD&A section | CoStar/STR weekly for benchmark | REIT / Franchisor Comp table | Key Hotel REIT CIKs: Host Hotels & Resorts = 1061937; Park Hotels = 1617063; Apple Hospitality = 1418121; RLJ Lodging = 1511808; Pebblebrook = 1474098; Summit = 1497645; Sunstone = 1295810; DiamondRock = 1299922; Xenia = 1616000; Chesapeake Lodging (acquired by Park). Franchisors: Marriott = MAR, Hilton = HLT, Hyatt = H, IHG (UK-listed, uses 20-F), Choice = CHH, Wyndham = WH, Accor (Paris-listed).[^94][^65][^66][^67] |
| **33** | **Lodging Econometrics — Global Pipeline Free Summaries** | `https://lodgingeconometrics.com` (tag: construction-pipeline-trend-report) | **Free** (press summaries) | Unlimited | National + top-10 US cities by pipeline | Quarterly | HTML press release | None | US pipeline total by chain scale; under construction; starts in 12 months; early planning; new openings YTD; brand conversions; city leaders | STR supply pipeline (paid), CBRE pipeline | Supply Pipeline / 24-Month Forward tile | Q1 2026 US pipeline: 6,020 projects / 705,825 rooms (-5% YoY projects, -3% YoY rooms). Phoenix: most 2026 openings forecast. Dallas: largest pipeline (184 projects). Luxury hits record 102 projects. Press releases are fully detailed at chain-scale level.[^27][^28][^29][^30][^31] |
| **34** | **PwC Emerging Trends in Real Estate — Hospitality Section** | `https://www.pwc.com/us/en/industries/financial-services/asset-wealth-management/real-estate/emerging-trends-in-real-estate-pwc-us.html` | **Free** | Unlimited | National; segment; market attractiveness rankings | Annual (Oct/Nov) | PDF | None | Top hotel investment markets; buy/hold/sell signals by market; luxury vs economy divergence; cap rate outlook; investment survey data | JLL, CBRE Hotels, AHLA | Hotel Investment Ranking tile | 2025 edition highlights luxury vs economy bifurcation. NYC ranked most attractive for 2nd consecutive year due to Airbnb restrictions and strong international demand. Free PDF.[^14] |

***

## Part A: Top 15 Highest-Leverage Sources for a National RevPAR Ticker

These 15 sources, ranked by data frequency, immediacy, and direct RevPAR signal quality:

| Rank | Source | Why It Belongs Here | Lag |
|---|---|---|---|
| 1 | **TSA Daily Checkpoint Throughput** | Highest-frequency free travel demand signal; daily update; directly proxies hotel arrivals nationwide | Next business day |
| 2 | **CoStar/STR Weekly Digest (LodgingMagazine)** | National + Top-25 MSA Occupancy/ADR/RevPAR with YoY comparison; direct RevPAR values | 7–8 days |
| 3 | **STR Weekly via HospitalityNet** | Same CoStar/STR data, often with chain-scale commentary; secondary distribution channel | 7–10 days |
| 4 | **Actabl HotelData.com** | Free chain-scale RevPAR, ADR, GOP% benchmarks from thousands of US hotels; state-level; quarterly | ~60 days |
| 5 | **Lodging Econometrics Quarterly Pipeline** | 24-month supply pipeline by chain scale; most granular free supply-side signal | 30–45 days post quarter |
| 6 | **Hotel REIT 10-Q (EDGAR XBRL)** | Actual comparable RevPAR from 15+ publicly traded hotel portfolios; no auth required | 45 days post quarter |
| 7 | **Marriott/Hilton/Hyatt/IHG/Choice/Wyndham 10-Q** | Systemwide RevPAR by chain scale/brand; covers ~85% of branded US supply | 45 days post quarter |
| 8 | **PwC US Hospitality Directions** | Free bimonthly forecast with chain-scale RevPAR outlook and macro overlay | Quarterly |
| 9 | **NTTO I-94 International Arrivals** | International demand vector; critical for NYC/Miami/LA/Las Vegas markets | 2–3 months |
| 10 | **BTS T-100 Airline Segment Data** | City-pair passenger volumes by MSA; domestic air demand leading hotel occupancy | ~60 days |
| 11 | **US Travel TPI + Forecasts** | ADR inflation tracking via hotel CPI component; seasonal demand forecast | Monthly TPI; seasonal forecasts |
| 12 | **Nevada NGCB Monthly Gaming Revenue** | Las Vegas-specific leading demand indicator; strip revenue vs RevPAR correlation | ~30 days |
| 13 | **Inside Airbnb Open CSV** | STR supply count, nightly prices, and occupancy proxy for 40 US MSAs; cross-check RevPAR compression | Quarterly |
| 14 | **GBTA BTI Executive Summary** | Corporate travel demand forward signal; ADR and hotel rate trends by sector | Annual |
| 15 | **AGA State of the States** | Gaming-market hotel demand context for Las Vegas, Atlantic City, regional casino hotels | Annual |

***

## Part B: Unfair-Advantage Sources — Leading STR/CoStar by Days or Weeks

These three sources provide **predictive leading signals** that move ahead of official STR/CoStar weekly releases:

### 1. TSA Daily Checkpoint Throughput (Leads by 7–14 days)
TSA data published the next business day allows construction of a 7-day rolling average of air traveler volume—the best free proxy for hotel arrivals at major airport-connected MSAs. During peak leisure weekends (Memorial Day, July 4, Labor Day), TSA throughput spikes precede hotel RevPAR jumps by 1–2 weeks. The STR weekly report capturing that same weekend is released 10–12 days later. **A terminal watching TSA can call direction of the coming RevPAR print with ~80% accuracy at the national level.**[^39][^40]

### 2. Inside Airbnb Open Data (Leads STR supply data by 30–90 days)
Inside Airbnb scrapes Airbnb's own availability calendars and publishes raw listing counts and occupancy proxies on a quarterly (roughly) basis for 40 US cities—completely free, no registration. This data shows STR supply growth in near real-time before CoStar/STR's paid supply pipeline updates. In markets like Nashville, Austin, Denver, and Honolulu, Inside Airbnb supply surges have predictably preceded hotel RevPAR compression by one to two STR reporting periods. The `listings.csv.gz` files also show 365-day forward availability calendars, giving a quasi-forward-booking proxy.[^36][^37]

### 3. Lodging Econometrics Quarterly Pipeline (Leads RevPAR supply-side impact by 12–24 months)
LE's free press releases publish projects under construction, projects starting in the next 12 months, and projects in early planning—all by chain scale and by city. This is the most granular **24-month forward supply signal** available without cost. When LE shows 197 projects in Dallas (Q3 2025 report), that supply will hit market over the following 24 months. Knowing that upper-midscale supply is concentrated in secondary markets while luxury is growing fastest at record pace (102 projects Q1 2026) allows the terminal to pre-position RevPAR forecasts before the market sees the compression or bifurcation.[^27][^31]

**Bonus Unfair Advantage:** NJ Division of Gaming Enforcement and Nevada NGCB publish gaming handles 30 days before the next CoStar/STR weekly report covers the same period. A spike in Strip gaming win is correlated with increased ADR premium pricing at luxury Las Vegas properties in the same 30-day window.

***

## Part C: Gap Analysis — What's Behind Paid Walls and Cheapest Legitimate Path

### What Is Gated

The most operationally critical hospitality data sits behind expensive paywalls:

**STR STAR Reports (CoStar)** — The full STR competitive benchmarking platform (occupancy, ADR, RevPAR, flow-through, market penetration by property and comp set, daily data, MSA-level segmented by chain scale) is the industry gold standard. Subscription pricing is not publicly disclosed but widely cited at $5,000–$15,000/yr per property for operators; market-level data packages for investors run materially higher. What you get free is the top-25-market national aggregate (no chain-scale breakdown, no submarket, no daily granularity).

**Kalibri Labs** — Forward-looking RevPAR analytics, direct vs OTA channel mix, and net ADR (after distribution costs) are fully gated. No free tier. Kalibri is particularly valuable for underwriting because it adjusts gross ADR for OTA fees and loyalty point costs—often a 15–25% difference from headline ADR. Subscription pricing undisclosed; estimated $10,000–$50,000/yr for institutional access.

**AirDNA Full Platform** — Free tier shows market-level directional data. The subscription ($595/yr for a single market Research plan, higher for multi-market) unlocks CSV export, historical data, forward-looking RevPAR by comp set, Airbnb vs Vrbo split, regulatory flag layers, and revenue projections. The free alternative (Inside Airbnb) provides raw listing counts but not processed occupancy estimates or revenue.

**Lodging Magazine / Hotel News Now Premium Data** — Full STR market daily reports with chain-scale breakdown are subscription-only.

**Hotel Investment Today (STR/CoStar)** — Forward booking pace data (STR's forward STAR) is paid. Free press releases only reference directional pace vs prior year without absolute values.[^95][^96]

### Cheapest Legitimate Path

For a terminal targeting Israeli family offices and institutional LPs investing in US CRE hospitality, the **minimum viable paid stack** to close all critical data gaps is:

1. **AirDNA Research Plan** (~$595/yr per market, $2,000–5,000/yr for multi-market package) — closes the STR crossover data gap with actual occupancy, ADR, RevPAR for Airbnb/Vrbo; CSV export; 3-year history.
2. **STR STAR Market Report subscription** (negotiate directly with CoStar; institutional pricing $20,000–$50,000/yr) — closes the chain-scale-by-MSA weekly gap.
3. **Kalibri Labs** (negotiate; $15,000–30,000/yr) — optional but adds net RevPAR and distribution cost intelligence critical for underwriting.

**Total paid floor for terminal-grade data: ~$25,000–$55,000/yr.** The free/freemium stack documented above delivers approximately 60–70% of the intelligence value at zero marginal cost, sufficient to power a functioning RevPAR ticker, travel demand dashboard, and 24-month supply pipeline view for institutional LPs reviewing US hospitality assets.

For the terminal's Israeli family office audience, the **free stack alone supports**: This week's US hotel RevPAR by chain scale direction (via CoStar/STR press + Actabl HotelData.com) ✓; Top-25 MSA performance with date stamps (via CoStar/LodgingMagazine weekly) ✓; Short-term rental supply growth by market (Inside Airbnb quarterly) ✓; 24-month supply pipeline by market and chain scale (Lodging Econometrics quarterly) ✓; International demand vectors (NTTO I-94) ✓.

***

## Inside Airbnb: US City URL Reference Table

| City | State | Base URL Pattern |
|---|---|---|
| New York City | NY | `data.insideairbnb.com/united-states/ny/new-york-city/{date}/data/listings.csv.gz` |
| Los Angeles | CA | `data.insideairbnb.com/united-states/ca/los-angeles/{date}/data/listings.csv.gz` |
| Chicago | IL | `data.insideairbnb.com/united-states/il/chicago/{date}/data/listings.csv.gz` |
| San Francisco | CA | `data.insideairbnb.com/united-states/ca/san-francisco/{date}/data/listings.csv.gz` |
| Seattle | WA | `data.insideairbnb.com/united-states/wa/seattle/{date}/data/listings.csv.gz` |
| Washington DC | DC | `data.insideairbnb.com/united-states/dc/washington-dc/{date}/data/listings.csv.gz` |
| Boston | MA | `data.insideairbnb.com/united-states/ma/boston/{date}/data/listings.csv.gz` |
| Austin | TX | `data.insideairbnb.com/united-states/tx/austin/{date}/data/listings.csv.gz` |
| Denver | CO | `data.insideairbnb.com/united-states/co/denver/{date}/data/listings.csv.gz` |
| Nashville | TN | `data.insideairbnb.com/united-states/tn/nashville/{date}/data/listings.csv.gz` |
| New Orleans | LA | `data.insideairbnb.com/united-states/la/new-orleans/{date}/data/listings.csv.gz` |
| San Diego | CA | `data.insideairbnb.com/united-states/ca/san-diego/{date}/data/listings.csv.gz` |
| Dallas | TX | `data.insideairbnb.com/united-states/tx/dallas/{date}/data/listings.csv.gz` |
| Hawaii | HI | `data.insideairbnb.com/united-states/hi/hawaii/{date}/data/listings.csv.gz` |
| Clark County (Las Vegas) | NV | `data.insideairbnb.com/united-states/nv/clark-county-nv/{date}/data/listings.csv.gz` |
| Portland | OR | `data.insideairbnb.com/united-states/or/portland/{date}/data/listings.csv.gz` |
| Twin Cities | MN | `data.insideairbnb.com/united-states/mn/twin-cities-msa/{date}/data/listings.csv.gz` |
| Asheville | NC | `data.insideairbnb.com/united-states/nc/asheville/{date}/data/listings.csv.gz` |

*Date format: YYYY-MM-DD. Find available dates at `insideairbnb.com/explore/`. Download with `wget` or Python `requests`.*[^38][^37][^36]

***

## Key Hotel REIT EDGAR CIK Reference

| Company | Ticker | EDGAR CIK | Chain Scale Focus |
|---|---|---|---|
| Host Hotels & Resorts | HST | 1061937 | Upper Upscale, Luxury |
| Park Hotels & Resorts | PK | 1617063 | Upper Upscale |
| Apple Hospitality REIT | APLE | 1418121 | Upscale, Upper Midscale |
| RLJ Lodging Trust | RLJ | 1511808 | Upscale, Upper Midscale |
| Summit Hotel Properties | INN | 1497645 | Upscale, Upper Midscale |
| Pebblebrook Hotel Trust | PEB | 1474098 | Upper Upscale, Lifestyle |
| Sunstone Hotel Investors | SHO | 1295810 | Upper Upscale |
| DiamondRock Hospitality | DRH | 1299922 | Upper Upscale, Upscale |
| Xenia Hotels & Resorts | XHR | 1616000 | Upper Upscale, Upscale |
| Ryman Hospitality Properties | RHP | 1014473 | Upper Upscale (convention) |
| Service Properties Trust | SVC | 945394 | Upper Midscale, Midscale |
| Chatham Lodging Trust | CLDT | 1475045 | Upscale, Upper Midscale |

*XBRL endpoint: `https://data.sec.gov/api/xbrl/companyfacts/CIK{10-digit-padded}.json`*[^64][^65][^67]

***

## Current Market Context (For Tel Aviv Principal Review)

As of May 2026, based on sourced free data:
- **US National RevPAR** (full-year 2025): Occupancy 62.3% (-1.2% YoY); ADR $160.54 (+0.9%); RevPAR declined YoY for first time since 2020[^97]
- **Q1 2026 trajectory**: Turning positive — Host Hotels comparable Total RevPAR $418.20 (+4.6% YoY); week of Feb 8–14, 2026 national RevPAR $103.35 (+4.6%)[^3][^64]
- **Chain Scale outlook 2026**: Luxury leading; economy lagging; PwC forecasts overall RevPAR +0.9% in 2026[^12][^13]
- **Supply pipeline**: 6,020 projects / 705,825 rooms in Q1 2026 (-5% YoY) — supply growth decelerating, favorable for existing owners[^31]
- **STR crossover**: AirDNA 2026 outlook — STR supply reaccelerating faster than demand; resort and suburban markets most at risk of compression[^98]
- **International demand headwind**: Overseas arrivals down 2.9% YoY Aug 2025; US running $50B travel trade deficit; critical for gateway city RevPAR[^49][^50]
- **TSA throughput** (leading indicator): Travel Price Index April 2026 at +7.8% YoY — highest since post-pandemic rebound — suggesting demand remains firm despite macro uncertainty[^56]

---

## References

1. [CoStar: U.S. Hotel Industry Reports Negative Yearly Comparisons](https://lodgingmagazine.com/costar-u-s-hotel-industry-reports-negative-yearly-comparisons-7/) - The U.S. hotel industry reported negative year-over-year comparisons, according to CoStar's latest d...

2. [CoStar: U.S. Hotel Industry Reports Positive Yearly Comparisons](https://lodgingmagazine.com/costar-u-s-hotel-industry-closes-march-with-positive-yearly-comparisons/) - The U.S. hotel industry reported positive year-over-year comparisons, according to CoStar's latest d...

3. [CoStar: U.S. Hotel Industry Reports Positive Year-Over-Year ...](https://lodgingmagazine.com/costar-u-s-hotel-industry-reports-positive-year-over-year-comparisons-4/) - The U.S. hotel industry reported positive year-over-year comparisons, according to CoStar's latest d...

4. [STR Weekly Insights: 6-12 April 2025 - Hospitality Net](https://www.hospitalitynet.org/news/4126819/str-weekly-insights-6-12-april-2025) - Excluding eclipse markets, all chain scales except Economy posted positive RevPAR with a relatively ...

5. [STR Weekly Insights: 31 August – 6 September 2025 - Hospitality Net](https://www.hospitalitynet.org/news/4128916/str-weekly-insights-31-august-6-september-2025) - U.S. revenue per available room (RevPAR) dropped 0.7% in the week ending 6 September 2025. This was ...

6. [Articles by Stephanie Ricca | CoStar News Hotels Journalist](https://muckrack.com/stephanie-ricca/articles) - Editorial director at Hotel News Now/STR, now part of CoStar Group. Subscribe to our free Daily Upda...

7. [News | Hotels - CoStar](https://www.costar.com/news/hotels) - Get CoStar's latest information for hotel decisionmakers delivered to your inbox. Sign Up Now! Searc...

8. [2025 hospitality market outlook | with Jan Freitag from Costar Group](https://www.youtube.com/watch?v=b82W0Rw0OLw) - In this insightful episode of Hotel Moment, Karen Stephens speaks with Jan Freitag, National Directo...

9. [Actabl Launches HotelData.com as New Data-Backed Industry ...](https://www.prnewswire.com/news-releases/actabl-launches-hoteldatacom-as-new-data-backed-industry-resource-for-hoteliers-debuts-inaugural-budget-planning-guide-302507474.html) - HotelData.com is a free data resource hub created by Actabl to provide hotel owners, operators, and ...

10. [Actabl launches free resource HotelData.com - hotelbusiness.com](https://hotelbusiness.com/actabl-launches-free-resource-hoteldata-com/) - The 2025–2026 Budget Planning Guide breaks down key metrics, such as labor costs, RevPAR, ADR and GO...

11. [Q4 2025 + Full Year 2025 Hotel Profitability Report - Actabl](https://actabl.com/resources/q4-2025-profit-report/) - The Q4 2025 + Full Year 2025 Hotel Profitability Report from HotelData.com breaks down performance a...

12. [US Hospitality Directions: hotel industry report - PwC](https://www.pwc.com/us/en/industries/consumer-markets/hospitality-leisure/us-hospitality-directions.html) - US Hospitality Directions: December 2025 · Where demand is heading next · AI is reshaping both trave...

13. [US lodging industry to see slow, stable growth in 2026: report](https://www.hoteldive.com/news/PwC-hospitality-directions-outlook-lodging-2026/809205/) - In 2026, growth for the U.S. lodging industry will slow down following a period of post-COVID-19 res...

14. [Hospitality industry outlook - PwC](https://www.pwc.com/us/en/industries/financial-services/asset-wealth-management/real-estate/emerging-trends-in-real-estate-pwc-uli/property-type-outlook/hospitality.html) - In Emerging Trends in Real Estate® 2025, we highlighted the growing performance gap between luxury a...

15. [AHLA Survey Provides Confusing Holiday Outlook](https://www.insidehs.com/ahla-survey-provides-confusing-holiday-outlook/) - The 2025 Holiday Outlook: American Travelers Choose Hotels, But Inflation Looms. A new survey commis...

16. [Hospitality Outlook 2025 | AHLA](https://www.ahla.com/resource/hospitality-outlook-2025) - The 2025 Hospitality Outlook report from Allied member Colliers highlights moderate improvement in t...

17. [Resource Center - American Hotel & Lodging Association (AHLA)](https://www.ahla.com/resource-center) - AHLA's growing resource library contains research & reports, operational resources, and members-only...

18. [2025 U.S. Hotel Investor Intentions Survey - CBRE](https://www.cbre.com/insights/reports/2025-us-hotel-investor-intentions-survey) - Almost all respondents (94%) expect hotel investment to remain the same or increase in 2025, up from...

19. [H2 2025 Global Hotel Outlook | CBRE](https://www.cbre.com/insights/reports/h2-2025-global-hotel-outlook) - Global hotel markets are showing mixed momentum, with RevPAR growth expected in Europe, Asia-Pacific...

20. [Hotel Brand Performance 2025 | CBRE](https://www.cbre.com/insights/reports/hotel-brand-performance-2025) - Figure 2: Percentage of Hotel Brands With Above- & Below-Average RevPAR Growth. Source: Choice, Hilt...

21. [Investment market dynamics for the hotel sector are looking up in 2026](https://www.jll.com/en-us/newsroom/2026-global-hotel-investment-outlook-report) - JLL's 2026 Global Hotel Investment Outlook forecasts robust investment growth driven by strengthenin...

22. [Global hotel investment volumes to see 'robust increase' in 2026: JLL](https://www.hoteldive.com/news/global-hotel-investment-volumes-to-see-robust-increase-in-2026-jll/812429/) - Global hotel investment volumes are expected to see a “continued robust increase” in 2026, in part d...

23. [Global Hotel Investment Outlook 2026 - JLL](https://www.jll.com/en-us/insights/market-outlook/global-hotel-investment) - Download the full report to gain crucial insights and stay ahead in the rapidly evolving world of gl...

24. [Nehmer, HVS Design release guide for estimating renovation costs](https://www.hotelmanagement.net/design/nehmer-hvs-design-release-guide-estimating-renovation-costs) - The 2025 Hotel Cost Estimating Guide by Jonathan Nehmer + Associates and HVS Design evaluates costs ...

25. [Nehmer and HVS Design Release 2025 Hotel Cost Estimating Guide](https://www.hvs.com/news/10172/nehmer-and-hvs-design-release-2025-hotel-cost-estimating-guide) - The 2025 Hotel Cost Estimating Guide evaluates costs in a variety of hotel tiers, including Economy,...

26. [HVS U.S. Hotel Development Cost Survey 2025](https://www.hvs.com/article/10219-hvs-us-hotel-development-cost-survey-2025) - The HVS U.S. Hotel Development Cost Survey sets forth averages of development costs in each defined ...

27. [U.S. Hotel Construction Pipeline Holds Steady in Q3](https://www.asianhospitality.com/us-hotel-construction-pipeline-q3/) - The U.S. hotel construction pipeline held steady in the third quarter with 6,205 projects, according...

28. [U.S. Hotel Construction Pipeline Increases in All Project Stages ...](https://lodgingeconometrics.com/u-s-hotel-construction-pipeline-increases-in-all-project-stages-year-over-year/) - At the close of the first quarter, projects currently under construction stand at 1,051 projects/140...

29. [Lodging Econometrics Shares Findings From Hotel Pipeline Report](https://lodgingmagazine.com/lodging-econometrics-u-s-hotel-construction-pipeline-shows-steady-activity-in-q4-2025/) - New hotel openings in 2025 reached 640 with 74,079 rooms in the U.S., expanding the nation's hotel s...

30. [U.S. Hotel Construction Pipeline Remains Steady Year-Over-Year ...](https://lodgingeconometrics.com/extended-stay-hotels-comprising-40-of-total-projects-in-u-s-hotel-construction-pipeline/) - U.S. Hotel Construction Pipeline Remains Steady Year-Over-Year, with Extended-Stay Hotels Comprising...

31. [US hotel construction pipeline down roughly 5% YOY in Q1 2026](https://www.hoteldive.com/news/hotel-construction-pipeline-q1-2026/818665/) - The total U.S. hotel construction pipeline stood at 6,020 projects, or 705,825 rooms, in the first q...

32. [AirDNA subscription plans](https://help.airdna.co/en/articles/8062197-airdna-subscription-plans) - With any AirDNA account, you can explore every short-term rental market around the world. We have th...

33. [AirDNA | Short-Term Rental Data Analytics | Vrbo & Airbnb Data](https://www.airdna.co) - AirDNA tracks 10M+ Airbnb and Vrbo rentals across 120K markets. The original STR data platform since...

34. [US 2026 Short-Term Rental Outlook Report - AirDNA](https://www.airdna.co/outlook-report) - AirDNA 2026 Outlook: demand forecasts, ADR trends, and the best investment window since 2021. STR pr...

35. [Meet the All-New AirDNA - AirDNA Product Update](https://www.airdna.co/blog/all-new-airdna) - The free account also gets you vital information like rates, occupancy insights, market overview met...

36. [Explore the Data | Inside Airbnb](https://insideairbnb.com/explore/) - Inside Airbnb has collected data on dozens of cities and countries around the world. NEW! We now hav...

37. [Data Assumptions | Inside Airbnb](https://insideairbnb.com/data-assumptions/) - The data utilizes public information compiled from the Airbnb web-site including the availabiity cal...

38. [AirBnB - The Examples Book](https://the-examples-book.com/projects/data-sets/AirBnB) - This data is provided in the original format provided by AirBnB. The URLs where this data was downlo...

39. [Department of Homeland Security - COVID-19 Passenger Throughput](http://catalog.data.gov/dataset/covid-19-passenger-throughput) - Since the beginning of the COVID-19 pandemic, TSA has published the daily passenger checkpoint throu...

40. [How to Pull TSA Checkpoint Passenger Data - bbgatch](https://www.bbgatch.com/projects/tsa/2022-03-15-pulling-plotting-tsa-data/2022-03-15-how-to-pull-tsa-data.html) - This article explains about half-way through, each row in an HTML table is denoted with the tr ("tab...

41. [GitHub - hunj/tsa-passenger-throughput](https://github.com/hunj/tsa-passenger-throughput) - TSA Checkpoint Travel Numbers visualization using chart.js Data can be found at https://www.tsa.gov/...

42. [Average Daily Number of People Screened at TSA Checkpoints](https://www.bts.gov/browse-statistical-products-and-data/info-gallery/average-daily-number-people-screened-tsa-0) - Figure. This line graph shows the average daily number of people screened by the Transportation Secu...

43. [Airline Industry Datasets - Jason Blevins](https://jblevins.org/notes/airline-data) - The Airline Origin and Destination Survey Databank 1B (DB1B) is a 10% random sample of airline passe...

44. [Mining T-100: When Sheer Volume Meets Load Factor – Air Lab](https://airlab.fiu.edu/mining-t-100-when-sheer-volume-meets-load-factor/) - T-100 includes domestic non-stop segment data reported by both U.S. and foreign airline carriers and...

45. [U.S. DOT Data - Flight BI](https://flightbi.com/usdot/) - Certificated U.S. air carriers report monthly air carrier traffic information using Form T-100. The ...

46. [Data Bank 28DS - T-100 Domestic Segment Data (World Area Code)](https://www.bts.gov/browse-statistical-products-and-data/bts-publications/data-bank-28ds-t-100-domestic-segment-data) - To download airline CD documentation, go to Airline Information for Download | Bureau of Transportat...

47. [Using Airline Data on TranStats - YouTube](https://www.youtube.com/watch?v=DgX8dkq70vI) - TranStats webpage: https://www.transtats.bts.gov/ TranStats T-100 Traffic Data Practice Video (sampl...

48. [NTTO Forecast of International Visitation to the United States](https://www.trade.gov.http.akamai-trials.com/feature-article/ntto-forecast-international-visitation-united-states) - NTTO forecasts total international visitors to the United States will increase to 77.1 million in 20...

49. [NTTO: August 2025 Travel to/from U.S.](https://www.inboundtravel.org/news/ntto-august-2025-travel-to-from-us) - NTTO: August 2025 Travel to/from U.S. · International Air Passenger Enplanements To & From the Unite...

50. [U.S. Travel Snapshot April 2025](https://www.ustravel.org/us-travel-snapshot-april-2025) - South America: 10% decrease in visits in March after a flat February (Department of Commerce). These...

51. [I-94 Arrivals: Monthly, Quarterly and Annual | Commerce Data Hub](https://data.commerce.gov/i-94-arrivals-monthly-quarterly-and-annual) - Monthly international visitation data are collected and reported by the National Travel and Tourism ...

52. [A NEW WAY TO VIEW INTERNATIONAL TRAVEL - NTTO's I-94 ...](https://www.trade.gov/feature-article/new-way-view-international-travel-nttos-i-94-visitor-arrivals-monitors) - NTTO now displays data summaries and graphic visualizations on total overseas visits to the United S...

53. [Border Crossing Data: September 2025](https://www.bts.gov/newsroom/border-crossing-data-september-2025) - In September 2025, the number of trucks entering the U.S. from Canada was 454,488, a 3.7% decrease f...

54. [U.S. International Air Travel Statistics (I-92 data)](https://www.trade.gov/us-international-air-travel-statistics-i-92-data) - Dive into U.S. International Air Travel Statistics - I-92 Data! CBP and NTTO provide these air trave...

55. [Visitor Arrivals Program (I-94 Data) - Catalog - Data.gov](https://catalog.data.gov/dataset/visitor-arrivals-program-i-94-data-2f38a) - ... visitor arrivals to the United States. The National Travel and Tourism Office (NTTO) manages the...

56. [Travel Price Index (2026-05-12) - U.S. Travel Association](https://www.ustravel.org/research/travel-price-index) - The Travel Price Index (TPI) rose 7.8% year over year, and 1.9% from March on a seasonally adjusted ...

57. [U.S. Travel Forecast (2026-05-07)](https://www.ustravel.org/research/travel-forecasts) - International inbound travel spending fell 2.4% in 2025 to $175 billion but is expected to rebound 1...

58. [[PDF] US Travel Forecast | Winter 2025](https://www.ustravel.org/system/files?file=2025-01%2FUS_Travel_Forecast_Tables_Winter2025.pdf) - Transient. $187.1 B. $75.4 B. $98.0 B. $147.7 B. $155.9 B. $160.4 B. $166.1 B. $170.3 B. $173.9 B. $...

59. [2025 GBTA Business Travel Index Outlook Forecast - YouTube](https://www.youtube.com/watch?v=eNrR5yfWs4w) - Watch the unveiling video for the much-anticipated 2025 GBTA Business Travel Index Outlook – Annual ...

60. [Business Travel Optimism Rebounds as Evolving Patterns, Policies ...](https://gbta.org/business-travel-optimism-rebounds-as-evolving-patterns-policies-and-technologies-shape-the-industry-according-to-latest-gbta-poll/) - One-third of global buyers (35%) expect their company's 2025 travel volume will decline due to U.S. ...

61. [Global Business Travel and Events Prices Set to Stabilize Through ...](https://gbta.org/global-business-travel-and-events-prices-set-to-stabilize-through-2025-and-2026-amid-looming-economic-uncertainty/) - Global Business Travel Spending to Reach $1.57 Trillion in 2025 Amid Trade Policy Uncertainty and Ec...

62. [Global Business Travel Association - GBTA](https://gbta.org) - Annual Global Report & Forecast. GBTA 2025 Business Travel Index Outlook. GBTA BTI™ is an exhaustive...

63. [[PDF] Business Travel Index Outlook 2025](https://gbta.org/wp-content/uploads/GBTA-BTI-Report_2025_Executive-Summary-FINAL.pdf) - The 2025 BTI™ marks the 17th consecutive global business travel outlook and is the most comprehensiv...

64. [Host Hotels & Resorts, Inc. Reports Results for the First Quarter 2026](https://www.hosthotels.com/Press-Releases/2026/PressRelease_28156) - Comparable hotel Total RevPAR was $418.20 for the first quarter of 2026, representing an increase of...

65. [EDGAR Application Programming Interfaces (APIs) - SEC.gov](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) - Currently included in the APIs are the submissions history by filer and the XBRL data from financial...

66. [sec-api - PyPI](https://pypi.org/project/sec-api/) - The API supports downloading all EDGAR form types, including 10-K, 10-Q, 8-K, 13-F, S-1, 424B4, and ...

67. [SEC EDGAR Data - XBRL US](https://xbrl.us/academic-repository/sec-edgar-data/) - The public can access XBRL for free via SEC EDGAR Financial Statements Data Sets and ...

68. [mar-20241231 - SEC.gov](https://www.sec.gov/Archives/edgar/data/1048286/000162828025004818/mar-20241231.htm) - On the investor relations portion of our website, Marriott.com/investor, we provide a link to our el...

69. [NPS Visitor Use Statistics Data Package, 2025 - Catalog - Data.gov](http://catalog.data.gov/dataset/nps-visitor-use-statistics-data-package-2025) - This data package contains data collected from 1979-2025. Detailed instructions for the units that c...

70. [Visitor Use Data - Social Science (U.S. National Park Service)](https://www.nps.gov/subjects/socialscience/visitor-use-statistics-dashboard.htm) - The National Park Service reported 323 million recreation visits in calendar year 2025. · 406 of the...

71. [Public Interest in National Parks Remains Strong as Visits Top 323 ...](https://www.nps.gov/orgs/1207/03-13-26-2025-visitation-statsitics.htm) - The Visitation Statistics Dashboard on NPS.gov provides recreation visit data for every park in the ...

72. [[PDF] NEVADA GAMING CONTROL BOARD Monthly Revenue Report ...](https://www.gaming.nv.gov/contentassets/a7958398526e4e309d248ea35a2a20dd/september-2025-monthly-revenue-report.pdf) - This report is a summary of information provided by nonrestricted gaming licensees who file Monthly ...

73. [Nevada gaming win down in December; Strip fell 6%](https://www.reviewjournal.com/business/casinos-gaming/nevada-gaming-win-down-in-december-strip-fell-6-3612968/) - Strip operators reported $827.7 million in revenue in December, down from $881.3 million during the ...

74. [Gaming Revenue Information - Nevada Gaming Control Board](https://www.gaming.nv.gov/about-us/gaming-revenue-information-gri/) - The Monthly Revenue Report is a summary of revenue information for nonrestricted gaming activity. Ea...

75. [2024 was a record year for Nevada gaming revenue, but not on the ...](https://thenevadaindependent.com/article/2024-was-a-record-year-for-nevada-gaming-revenue-but-not-on-the-strip) - Nevada casino revenue tops $15.6 billion while Las Vegas resorts saw a 1 percent dip in 2024 to $8.8...

76. [New Jersey Online Gambling Revenue By Operator And Game](https://www.playnj.com/revenue/) - ... Division of Gaming Enforcement releases monthly Atlantic City casino revenue reports for each lo...

77. [NJ gaming revenue hits $536M, led by online casinos (updated)](https://njbiz.com/nj-internet-gaming-revenue-april-2025/) - New Jersey's internet gaming surged to $235.2M in April, outpacing in-person casino revenue yet agai...

78. [[PDF] Atlantic City January 2025 - UNLV Center for Gaming Research](https://gaming.library.unlv.edu/reports/2025_01_AC.pdf) - This report contains a summary of monthly revenue figures released by the New Jersey Division of Gam...

79. [[PDF] division of gaming enforcement - data sources - NJ.gov](https://www.nj.gov/lps/ge/docs/OpenDataInitiative.pdf) - Information contained on these reports include totals for: average units; win; drop/handle; win perc...

80. [American Gaming Association Releases State-By-State Analysis of ...](https://www.prnewswire.com/news-releases/american-gaming-association-releases-state-by-state-analysis-of-us-commercial-casino-industry-300700583.html) - AGA's annual State of the States report includes state-by-state analyses of revenue, tax data and wa...

81. [AGA Commercial Gaming Revenue Tracker and Detailed Financial ...](https://soloazar.com/en/category/reports-and-data/aga-commercial-gaming-revenue-tracker-and-detailed-financial-reporting) - In May, traditional casino slot machines and table games generated revenue of $4.45 billion, 3.9 per...

82. [State of the States 2025 - American Gaming Association](https://www.americangaming.org/resources/state-of-the-states-2025/) - AGA's annual State of the States report details the commercial gaming industry's financial performan...

83. [[PDF] AGA-State-of-the-States-2025.pdf - American Gaming Association](https://www.americangaming.org/wp-content/uploads/2025/05/AGA-State-of-the-States-2025.pdf) - With detailed information on the U.S. gaming market and financial performance data for every commerc...

84. [New 2025 State of the Cruise Industry Report Shows Cruising is a ...](https://cruising.org/news/new-2025-state-cruise-industry-report-shows-cruising-vibrant-tourism-sector-growing-steadily) - CLIA's 2025 State of the Cruise Industry report shows that cruising continues to be one of the most ...

85. [State of the Cruise Industry Report 2025](https://cruising.org/resources/state-cruise-industry-report-2025) - In 2025, the industry is forecast to welcome 37.7 million ocean-going passengers and reach 310 ocean...

86. [U.S. Travel Demand Reaches Four-Year High as Americans Plan to ...](https://mmgyintel.com/mmgy-report-u-s-travel-demand-reaches-four-year-high-as-americans-plan-to-travel-more-and-spend-bigger-in-2025/) - MMGY Report: U.S. Travel Demand Reaches Four-Year High as Americans Plan to Travel More and Spend Bi...

87. [MMGY Global's Portrait of American Travelers Survey Reveals ...](https://www.mmgyglobal.com/news/mmgy-globals-portrait-of-american-travelers-survey-reveals-significant-shifts-in-what-is-influencing-travelers-most/) - The results paint a picture of rapidly changing priorities amongst travelers, driven by growing conc...

88. [[PDF] Global - MMGY](https://www.mmgy.com/wp-content/uploads/2025/02/MMGY_2025_GlobalCompass.pdf) - In 2025, we're going to see travelers redefining the language of travel – beyond just what's afforda...

89. [Knowland: Event Intelligence & Hospitality Sales Solutions](https://www.knowland.com) - Knowland is the leader in meeting and event intelligence for the hospitality industry. Discover our ...

90. [The Cvent source: 2025 year in review and what's next for events](https://www.youtube.com/watch?v=dZMKHXvlshc) - The biggest demand shifts of 2025—and what they mean for your 2026 strategy · How planner and market...

91. [2025 Event & Hospitality Trends | Cvent Blog](https://www.cvent.com/en/blog/hospitality/event-hospitality-trends) - 2025 Event & Hospitality Trends: What Hotel and Venues Need to Know · Use data insights to understan...

92. [Intro to TransBorder and BorderCrossing Data Programs - YouTube](https://www.youtube.com/watch?v=3HtOz_6kDQs) - Bureau of Transportation Statistics (BTS) TransBorder Freight Data: https://data.bts.gov/stories/s/m...

93. [Department of Transportation - Open Data Portal | Department of ...](https://data.transportation.gov) - Border Crossings by Mode, Border, and State. Learn about border crossing data. Takata Recall - Prior...

94. [hlt-20241231 - SEC.gov](https://www.sec.gov/Archives/edgar/data/1585689/000158568925000008/hlt-20241231.htm) - Hampton by Hilton hotels around the world provide guests high-quality and thoughtfully designed acco...

95. [STR projects July 4 holiday performance | Hotel Investment Today](https://www.hotelinvestmenttoday.com/Forecasts/STR-projects-July-4-holiday-performance) - Forward STAR data for 2025 shows occupancy on the books for the holiday weekend trending similar to ...

96. [CoStar with STR Benchmark](https://www.costar.com/products/str-benchmark) - The only hotel benchmarking solution integrating revenue, expenses, profit, and full property‑lifecy...

97. [CoStar: U.S. hotel occupancy, RevPAR down YOY in 2025](https://www.hotelmanagement.net/data-trends/costar-us-hotel-occupancy-revpar-down-yoy-2025) - CoStar: U.S. hotel occupancy, RevPAR down YOY in 2025 · Occupancy: 62.3 percent (-1.2 percent) · Ave...

98. [2026 STR Outlook: Growth, Risks, and Opportunities - AirDNA](https://www.airdna.co/podcast/str-data-lab-episode-162) - The short-term rental market experienced a dramatic shift in 2025, with supply growth slowing to app...

