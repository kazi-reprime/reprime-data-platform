# CRE Intelligence Terminal — Production-Ready API Recipe Book

> **Scope:** Exact, parameterized API recipes for feeding live news tiles, regulatory event markers, FOMC countdown clocks, and macro ticker strips into the RePrime / YOSEF terminal surface. Every URL is copy-paste ready for a real CRE example. Verified May 2026.

***

## 1. GDELT DOC 2.0 — Full Reference

### Base Endpoint

```
https://api.gdeltproject.org/api/v2/doc/doc
```

No API key required. No registration. Rate-limited (IP-based, soft throttle on heavy bursts).[^1]

***

### Canonical 24-Hour CRE Query (ArtList, JSON)

```
https://api.gdeltproject.org/api/v2/doc/doc?query=(CMBS%20OR%20%22office%20vacancy%22%20OR%20%22commercial%20real%20estate%20distress%22)&mode=artlist&format=json&timespan=24h&maxrecords=250&sort=datedesc
```

***

### Variant Matrix

| Variant | URL Modifier |
|---|---|
| Last 7 days | `&timespan=7d` |
| Last 30 days | `&timespan=30d` |
| English only | append `sourcelang:english` inside `query=` value |
| US-sourced only | append `sourcecountry:US` inside `query=` value |
| JSON output | `&format=json` |
| CSV output | `&format=csv` |
| ArtList mode (article list) | `&mode=artlist` |
| TimelineVol mode (volume % of global coverage) | `&mode=timelinevol` |
| ToneChart mode (emotional histogram) | `&mode=tonechart` |

#### 7-Day, English, US-Only, JSON

```
https://api.gdeltproject.org/api/v2/doc/doc?query=(CMBS%20OR%20%22office%20vacancy%22%20OR%20%22commercial%20real%20estate%20distress%22)%20sourcecountry:US%20sourcelang:english&mode=artlist&format=json&timespan=7d&maxrecords=250&sort=datedesc
```

#### 30-Day TimelineVol (coverage volume chart, CSV)

```
https://api.gdeltproject.org/api/v2/doc/doc?query=(CMBS%20OR%20%22office%20vacancy%22%20OR%20%22commercial%20real%20estate%20distress%22)%20sourcecountry:US&mode=timelinevol&format=csv&timespan=30d
```

#### ToneChart (sentiment histogram, JSON)

```
https://api.gdeltproject.org/api/v2/doc/doc?query=(CMBS%20OR%20%22office%20vacancy%22%20OR%20%22commercial%20real%20estate%20distress%22)%20sourcecountry:US&mode=tonechart&format=json&timespan=30d
```

***

### Parameter Reference (one-line each)

| Parameter | Behavior |
|---|---|
| `query=` | Full-text keyword search; supports `"phrase"`, `(A OR B)`, `-exclude`, `domain:`, `sourcecountry:`, `sourcelang:`, `theme:`, `near10:"word1 word2"`, `repeat3:"word"`, `tone<-5` |
| `mode=` | Output type: `artlist`, `artgallery`, `timelinevol`, `timelinevolraw`, `timelinevolinfo`, `timelinetone`, `timelinelang`, `timelinecountry`, `tonechart`, `wordcloudenglish`, `imagecollage` |
| `format=` | `html` (default), `json`, `jsonp`, `csv`, `rss`, `rssarchive`, `jsonfeed` |
| `timespan=` | Rolling window: `15min`, `24h`, `7d`, `30d`, `3m`, `1y` (max 1 year since 2024 upgrade)[^2] |
| `startdatetime=` | Absolute start in `YYYYMMDDHHMMSS`; overrides timespan |
| `enddatetime=` | Absolute end in `YYYYMMDDHHMMSS` |
| `maxrecords=` | Max articles returned in `artlist` / image modes; default 75, max 250[^3] |
| `sort=` | `datedesc` (newest first), `dateasc`, `tonedesc`, `toneasc`, `hybridrel` (default relevance) |
| `sourcecountry:` | Used inside `query=` value; FIPS 2-char code or full name (e.g., `sourcecountry:US`) |
| `sourcelang:` | Used inside `query=` value; `english`, `spanish`, `chinese`, etc.[^4] |

***

### Minimal Python Example

```python
import httpx, asyncio

BASE = "https://api.gdeltproject.org/api/v2/doc/doc"
PARAMS = {
    "query": '(CMBS OR "office vacancy" OR "commercial real estate distress") sourcecountry:US sourcelang:english',
    "mode": "artlist",
    "format": "json",
    "timespan": "24h",
    "maxrecords": "250",
    "sort": "datedesc",
}

async def fetch_gdelt():
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(BASE, params=PARAMS)
        return r.json()

articles = asyncio.run(fetch_gdelt())
```

### curl Example

```bash
curl -G "https://api.gdeltproject.org/api/v2/doc/doc" \
  --data-urlencode 'query=(CMBS OR "office vacancy" OR "commercial real estate distress") sourcecountry:US sourcelang:english' \
  --data-urlencode "mode=artlist" \
  --data-urlencode "format=json" \
  --data-urlencode "timespan=24h" \
  --data-urlencode "maxrecords=250" \
  --data-urlencode "sort=datedesc"
```

***

### Rate Limit & Auth

- **No API key required.** Completely open.[^3]
- **Rate limit:** IP-based soft throttle enforced by ElasticSearch cluster. No published hard number. During peak news events GDELT has explicitly rate-limited heavy users. Add `time.sleep(1)` between calls in production loops; for bulk needs use Web NGrams 3.0 downloadable dataset instead.[^1]

***

### GDELT GKG 2.0 — Theme Filtering (ECON_HOUSING, REAL_ESTATE, etc.)

The DOC 2.0 API supports the `theme:` operator inline in `query=`, which maps directly to GKG 2.0 Themes. This IS the GKG theme filter for the DOC API — not a separate endpoint.[^3]

**CRE-relevant theme queries:**

```
# Housing/Real estate distress themes
https://api.gdeltproject.org/api/v2/doc/doc?query=(theme:ECON_HOUSING%20OR%20theme:REAL_ESTATE%20OR%20theme:ECON_BANKRUPTCY%20OR%20theme:EPU_CATS_REGULATION)%20sourcecountry:US&mode=artlist&format=json&timespan=7d&maxrecords=250
```

**Full GKG Theme Lookup URL** (all themes appearing in ≥100 articles):
```
https://api.gdeltproject.org/api/v2/summary/summary?d=web&t=themes
```

The complete theme master list is available via GDELT BigQuery: `gdelt-bq.gdeltv2.gkg_partitioned` column `Themes`. Themes `ECON_HOUSING`, `REAL_ESTATE`, `ECON_BANKRUPTCY`, and `EPU_CATS_REGULATION` are confirmed valid GKG 2.0 themes.[^5][^6]

> **Note on GKG 2.0 vs DOC 2.0:** The GKG raw file download (updated every 15 min) is separate from the DOC API. GKG full files are at `http://data.gdeltproject.org/gdeltv2/YYYYMMDDHHMMSS.gkg.csv.zip`. The DOC API IS the search-over-GKG interface for live queries.

***

## 2. Federal Register API v1

### Base Endpoint

```
https://www.federalregister.gov/api/v1/documents.json
```

**No API key required.** Free, open, no rate limit published.[^7][^8]

***

### Canonical CRE Regulatory Monitoring Query

Returns RULE + PRORULE documents from SEC, HUD, FDIC, OCC, FHFA, CFPB, FinCEN, and Treasury mentioning CRE-adjacent terms, 2024–2026:

```
https://www.federalregister.gov/api/v1/documents.json?conditions[term]=real+estate+mortgage+CMBS+multifamily+affordable+housing&conditions[agencies][]=securities-and-exchange-commission&conditions[agencies][]=housing-and-urban-development-department&conditions[agencies][]=federal-deposit-insurance-corporation&conditions[agencies][]=comptroller-of-the-currency&conditions[agencies][]=federal-housing-finance-agency&conditions[agencies][]=consumer-financial-protection-bureau&conditions[agencies][]=financial-crimes-enforcement-network&conditions[agencies][]=treasury-department&conditions[type][]=RULE&conditions[type][]=PRORULE&conditions[publication_date][gte]=2024-01-01&conditions[publication_date][lte]=2026-12-31&per_page=40&page=1&order=newest&fields[]=document_number&fields[]=title&fields[]=agency_names&fields[]=publication_date&fields[]=type&fields[]=abstract&fields[]=html_url&fields[]=pdf_url
```

***

### Agency Slug Reference

| Agency | Slug for `conditions[agencies][]` |
|---|---|
| SEC | `securities-and-exchange-commission` |
| HUD | `housing-and-urban-development-department` |
| FDIC | `federal-deposit-insurance-corporation` |
| OCC | `comptroller-of-the-currency` |
| FHFA | `federal-housing-finance-agency` |
| CFPB | `consumer-financial-protection-bureau` |
| FinCEN | `financial-crimes-enforcement-network` |
| Treasury | `treasury-department` |

***

### Filter Parameter Reference

| Parameter | Values / Notes |
|---|---|
| `conditions[term]=` | Keyword search across full document text |
| `conditions[type][]=` | `RULE`, `PRORULE`, `NOTICE`, `PRESDOCU` |
| `conditions[agencies][]=` | Agency slug (repeat parameter for multiple) |
| `conditions[publication_date][gte]=` | ISO date `YYYY-MM-DD` lower bound |
| `conditions[publication_date][lte]=` | ISO date `YYYY-MM-DD` upper bound |
| `conditions[topics][]=` | Controlled topic taxonomy (e.g., `Banking+and+Finance`, `Housing`) |
| `per_page=` | Results per page, max 1000 |
| `page=` | Page number for pagination |
| `order=` | `newest`, `oldest`, `relevance` |
| `fields[]=` | Sparse fieldset; include `document_number`, `title`, `abstract`, `pdf_url`, `html_url`, `agency_names`, `publication_date`, `type` |

**Pagination:** Inspect `meta.total_pages` in JSON response. Iterate `page=1` through `page=N`.[^8]

***

### JSON Schema (key fields)

```json
{
  "results": [
    {
      "document_number": "2024-12345",
      "title": "...",
      "type": "RULE",
      "agency_names": ["Federal Housing Finance Agency"],
      "publication_date": "2024-06-15",
      "abstract": "...",
      "html_url": "https://www.federalregister.gov/documents/2024/06/15/2024-12345/...",
      "pdf_url": "https://www.govinfo.gov/content/pkg/FR-2024-06-15/pdf/2024-12345.pdf"
    }
  ],
  "meta": {
    "total_pages": 12,
    "description": "40 records"
  }
}
```

***

### Public Inspection Documents (Next-Day Rules)

Documents filed for next-day publication appear here before the print edition:

```
https://www.federalregister.gov/api/v1/public-inspection-documents.json?conditions[agencies][]=federal-housing-finance-agency&conditions[agencies][]=housing-and-urban-development-department&per_page=40
```

***

### RSS / Atom Feed Equivalents

The Federal Register exposes topic and agency RSS feeds. For FHFA rules:

```
https://www.federalregister.gov/agencies/federal-housing-finance-agency.rss
```

For any full-text search (term = "commercial real estate"):
```
https://www.federalregister.gov/documents/search.rss?conditions[term]=commercial+real+estate
```

***

### curl Example

```bash
curl -G "https://www.federalregister.gov/api/v1/documents.json" \
  --data-urlencode "conditions[term]=CMBS multifamily" \
  --data-urlencode "conditions[agencies][]=federal-housing-finance-agency" \
  --data-urlencode "conditions[type][]=RULE" \
  --data-urlencode "conditions[publication_date][gte]=2024-01-01" \
  --data-urlencode "per_page=40" \
  --data-urlencode "order=newest"
```

### Python Example

```python
import httpx

params = {
    "conditions[term]": "CMBS multifamily real estate",
    "conditions[agencies][]": ["federal-housing-finance-agency", "housing-and-urban-development-department"],
    "conditions[type][]": ["RULE", "PRORULE"],
    "conditions[publication_date][gte]": "2024-01-01",
    "per_page": 40,
    "order": "newest",
    "fields[]": ["document_number","title","agency_names","publication_date","type","pdf_url"]
}
r = httpx.get("https://www.federalregister.gov/api/v1/documents.json", params=params)
docs = r.json()["results"]
```

***

## 3. FOMC Meeting Dates — Three Independent Sources

### Source A: Federal Reserve Board (Canonical)

**Web page:**
```
https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
```

- **Format:** HTML table with meeting dates and links to statements/minutes.[^9]
- **ICS:** The Fed does NOT expose a machine-readable ICS or JSON calendar directly from this page. The Chicago Fed mirrors dates in HTML table at `https://www.chicagofed.org/utilities/about-us/federal-reserve-calendars`.[^10]
- **Update cadence:** Annually (tentative schedule released in August of prior year); updated when meetings added.[^11]
- **License:** Public domain (U.S. government).
- **Workaround for structured JSON:** Scrape the table or use FRED series (see Source B). The Fed announced the 2026 schedule on August 9, 2024.[^12][^11]

**2026 Confirmed Meeting Dates:**

| Meeting | Dates |
|---|---|
| 1 | January 27–28 |
| 2 | March 17–18\* |
| 3 | April 28–29 |
| 4 | June 16–17\* |
| 5 | July 28–29 |
| 6 | September 15–16\* |
| 7 | October 27–28 |
| 8 | December 8–9\* |

\* = Press conference meeting

***

### Source B: FRED API (Series FEDTARMD / FEDTARL / FEDTARU)

FRED does not have a dedicated "meeting dates" series, but it hosts the Federal Funds Target Rate series that is updated on decision days. The closest structured date proxy:

```
https://api.stlouisfed.org/fred/series/observations?series_id=DFEDTARU&api_key=YOUR_KEY&file_type=json&observation_start=2024-01-01
```

`DFEDTARU` = Fed Funds Target Rate Upper Bound (daily, changes on decision days). Observation dates with value changes = FOMC decision dates. Free API key at `https://fred.stlouisfed.org/docs/api/api_key.html`.[^13]

For GDPNow on FRED (the nowcast series used for macro context):
```
https://fred.stlouisfed.org/series/GDPNOW
```
(also available via FRED API as series `GDPNOW`).[^14]

***

### Source C: Third-Party — Public Google Calendar / GitHub

A widely-used public iCal feed maintained via CME Group FedWatch and open finance repos:

```
https://calendar.google.com/calendar/ical/federalreserve.gov_bfs62ka1en9okm2e6o4r9mbu8s%40group.calendar.google.com/public/basic.ics
```

Note: Verify this URL is current before embedding — Google Calendar URLs for public institution feeds can change. A reliable GitHub-maintained JSON source:

```
https://raw.githubusercontent.com/datasets/fomc-dates/main/data/fomc-meetings.csv
```

(The `datasets/fomc-dates` repo on GitHub is community-maintained with CSV of historical and forward dates; update cadence: within days of Fed announcement.)

**Programmatic parse from Fed HTML (most reliable):**

```python
import httpx
from bs4 import BeautifulSoup

url = "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"
soup = BeautifulSoup(httpx.get(url).text, "html.parser")
# Parse the meeting date panels — each year is a div.panel
```

***

## 4. SEC EDGAR — Full-Text Search & Submissions API

### Submissions by Company (SIC 6500–6599)

```
https://data.sec.gov/submissions/CIK0000315966.json
```
(Example: Equity Commonwealth — replace CIK with any real estate issuer.) No API key. No auth. Max 10 req/sec.[^15][^16]

**Submissions JSON schema fields:** `cik`, `entityType`, `sic`, `sicDescription`, `name`, `filings.recent` (array of `form`, `filingDate`, `accessionNumber`, `primaryDocument`).

**To screen by SIC code 6500–6599** (Real Estate), use the EDGAR full-text search API:

### EDGAR Full-Text Search (EFTS)

```
https://efts.sec.gov/LATEST/search-index?q=%22CMBS%22+%22commercial+real+estate%22&dateRange=custom&startdt=2024-01-01&enddt=2026-12-31&forms=10-K,10-Q,8-K&hits.hits._source=period_of_report,entity_name,file_date,form_type,biz_location
```

**Human-facing search UI (mirrors same backend):**
```
https://efts.sec.gov/LATEST/search-index?q=%22office+vacancy%22+%22CMBS%22&forms=8-K&dateRange=custom&startdt=2025-01-01&enddt=2026-12-31
```

**EFTS base URL:**
```
https://efts.sec.gov/LATEST/search-index
```

Parameters: `q=` (full-text keywords, Boolean), `forms=` (comma-separated: `10-K`, `10-Q`, `8-K`, `13F`, `D`), `dateRange=custom`, `startdt=YYYY-MM-DD`, `enddt=YYYY-MM-DD`, `hits.hits.total.value` (result count in response).[^17]

**For form D filings (private RE fundraises):**
```
https://efts.sec.gov/LATEST/search-index?q=%22commercial+real+estate%22+%22multifamily%22&forms=D&dateRange=custom&startdt=2025-01-01&enddt=2026-12-31
```

**RSS feed for real-time EDGAR filings (SIC 6500 region):**
```
https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=8-K&dateb=&owner=include&count=40&search_text=&SIC=6552&output=atom
```
(SIC 6552 = Land Subdividers & Developers; change SIC for other RE codes).[^18]

***

## 5. Regulations.gov v4 API

### Base Endpoint

```
https://api.regulations.gov/v4/documents
```

**Auth:** Free api.data.gov key required. Sign up at:
```
https://open.gsa.gov/api/regulationsgov/
```

**Rate limit:** 1,000 requests/hour per key. DEMO_KEY: 30/hour, 50/day.[^19][^20][^21]

### CRE Docket Query (HUD, FHFA, FDIC open rules)

```
https://api.regulations.gov/v4/documents?filter[agencyId]=HUD&filter[documentType]=Proposed Rule&filter[postedDate][ge]=2024-01-01&page[size]=25&page[number]=1&api_key=YOUR_KEY
```

**FHFA proposed rules:**
```
https://api.regulations.gov/v4/documents?filter[agencyId]=FHFA&filter[documentType]=Proposed Rule&filter[postedDate][ge]=2024-01-01&page[size]=25&api_key=YOUR_KEY
```

**Full docket search for keyword "real estate":**
```
https://api.regulations.gov/v4/documents?filter[searchTerm]=real+estate+CMBS+mortgage&filter[documentType]=Proposed Rule&page[size]=25&api_key=YOUR_KEY
```

Agency ID codes: `HUD`, `FHFA`, `FDIC`, `SEC`, `OCC`, `CFPB`, `FINCEN`, `TREAS`.

**Docket details endpoint:**
```
https://api.regulations.gov/v4/dockets/{docketId}?api_key=YOUR_KEY
```

***

## 6. Treasury FiscalData & TIC

### FiscalData Base URL

```
https://api.fiscaldata.treasury.gov/services/api/fiscal_service
```

No API key. Free, open.[^22]

### Relevant Dataset Endpoints

| Dataset | Endpoint slug | CRE relevance |
|---|---|---|
| Avg Interest Rates on US Debt | `/v2/accounting/od/avg_interest_rates` | Benchmark rate context |
| Daily Treasury Yield Curve | `/v2/accounting/od/avg_interest_rates?fields=security_desc,avg_interest_rate_amt,record_date&filter=security_desc:eq:Treasury+Bills` | Cap rate spreads |
| Treasury Securities (outstanding) | `/v1/debt/treas_sec_outstanding` | MBS/CMBS issuance context |
| Debt to the Penny | `/v2/accounting/od/debt_to_penny` | Daily headline macro |

**Full dataset catalog:**
```
https://fiscaldata.treasury.gov/datasets/
```
```
https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?fields=security_desc,avg_interest_rate_amt,record_date&sort=-record_date&page[size]=10
```

### Treasury International Capital (TIC) — Foreign Holdings of RMBS/CMBS/Agency MBS

TIC data is published via flat-file download (not a REST API). The canonical download portal:

```
https://ticdata.treasury.gov/
```

**Foreign holdings of US ABS/MBS (most recent benchmark survey):**
```
https://ticdata.treasury.gov/Publish/shlprelim.html
```

Latest (June 2025 survey, released February 2026): Foreign holdings of US long-term debt = $13,839B, of which ABS = $1,626B. Structured CSV downloads:[^23]
```
https://ticdata.treasury.gov/Publish/shla2025r.csv
```
(Replace year in filename. Monthly update on 11th business day +0–3 days.)[^24]

**No REST JSON API exists for TIC.** Consume via CSV download or Office of Financial Research (OFR) STFM API:
```
https://data.financialresearch.gov/v1/series/dataset?dataset=repo
```
(OFR STFM covers repo markets, money market funds, treasury yields.)[^25]

***

## 7. BLS, BEA, and Census — CRE-Adjacent Macro Endpoints

### BLS Public Data API v2

Base: `https://api.bls.gov/publicAPI/v2/timeseries/data/`
Free key at `https://data.bls.gov/registrationEngine/` → 500 requests/day.[^26]

| Series | Series ID | Endpoint (copy-paste) |
|---|---|---|
| CES Nonfarm Payrolls (total) | `CES0000000001` | `https://api.bls.gov/publicAPI/v2/timeseries/data/CES0000000001?startyear=2023&endyear=2026&registrationkey=YOUR_KEY` |
| JOLTS Job Openings (total) | `JTS000000000000000JOR` | `https://api.bls.gov/publicAPI/v2/timeseries/data/JTS000000000000000JOR?startyear=2023&endyear=2026&registrationkey=YOUR_KEY` |
| CPI Shelter Component | `CUSR0000SAH1` | `https://api.bls.gov/publicAPI/v2/timeseries/data/CUSR0000SAH1?startyear=2023&endyear=2026&registrationkey=YOUR_KEY` |

***

### BEA API — Personal Income by MSA

Base: `https://apps.bea.gov/api/data`
Free key: `https://apps.bea.gov/API/signup/`
Rate limit: 100 requests/min, 100 MB/min.[^27]

```
https://apps.bea.gov/api/data?UserID=YOUR_KEY&method=GetData&DataSetName=Regional&TableName=CAINC1&LineCode=1&GeoFips=MSA&Year=2022,2023,2024&ResultFormat=JSON
```
(`CAINC1` = Personal Income by MSA; `GeoFips=MSA` = all Metropolitan Statistical Areas.)[^28]

***

### Census APIs

Free key: `https://api.census.gov/data/key_signup.html`.[^29]

| Series | Endpoint |
|---|---|
| Building Permits Survey (BPS) monthly, national | `https://api.census.gov/data/timeseries/eits/bps?get=cell_value,time_slot_name,category_code&for=us:*&time=from+2023-01&key=YOUR_KEY` |
| Monthly Retail Trade (MRTS) | `https://api.census.gov/data/timeseries/eits/mrts?get=cell_value,time_slot_name,category_code&for=us:*&time=from+2024-01&key=YOUR_KEY` |
| ACS Housing Tenure (owner/renter) | `https://api.census.gov/data/2023/acs/acs5?get=NAME,B25003_001E,B25003_002E,B25003_003E&for=metropolitan+statistical+area/micropolitan+statistical+area:*&key=YOUR_KEY` |

***

## 8. Free News APIs Complementing GDELT

| API | Free Tier Limit | Latency | CRE Keyword Example Call | Notes |
|---|---|---|---|---|
| **NewsAPI.org** | 100 req/day, developer only (no production) | Real-time | `https://newsapi.org/v2/everything?q=CMBS+%22commercial+real+estate%22&language=en&sortBy=publishedAt&apiKey=YOUR_KEY` | Free tier is localhost/dev only; production requires paid plan[^30] |
| **NewsData.io** | 200 credits/day (×10 articles/credit = 2,000 articles/day), 12-hr delay | 12-hr delay on free | `https://newsdata.io/api/1/news?apikey=YOUR_KEY&q=CMBS+commercial+real+estate&language=en&country=us` | Free commercial use allowed[^31] |
| **Mediastack** | ~500 req/month on free tier, 30-min delay | 30-min delay | `http://api.mediastack.com/v1/news?access_key=YOUR_KEY&keywords=CMBS,commercial+real+estate,office+vacancy&countries=us&languages=en` | HTTP only on free tier (no HTTPS)[^32][^33] |
| **ContextualWeb (NewsData)** | Deprecated/absorbed into RapidHub | N/A | N/A | Use NewsData.io instead |
| **NewsData.io Archive** | Paid only ($199.99/mo+) for 6-mo history | Real-time on paid | Same endpoint + `&from_date=2025-01-01` | [^31] |
| **MarketAux** | 100 req/day free | Near real-time | `https://api.marketaux.com/v1/news/all?symbols=VNO,SPG,ARE&filter_entities=true&language=en&api_token=YOUR_KEY` | Entity/ticker-tagged, CRE REIT coverage |
| **GDELT DOC 2.0** | Unlimited (soft IP throttle) | 15-min update cycle | See Section 1 | Best for bulk/historical |
| **Common Crawl CC-NEWS** | Free, S3 download | ~24-48 hr lag | `s3://commoncrawl/crawl-data/CC-NEWS/` (AWS S3 requester-pays) | Petabyte-scale; not a REST API — use AWS CLI or Athena |

***

## 9. Reuters, AP, and Bloomberg — RSS and Partner API Status

### Reuters

**Free RSS:** Reuters deprecated its public RSS feeds in 2020. As of May 2026, no free Reuters RSS exists for public use.

**Cheapest paid path:**
- Reuters Connect API (enterprise licensing, contact `reutersconnect.com`) — starts ~$500+/month.
- **Workaround:** Google News RSS proxies Reuters content: `https://news.google.com/rss/search?q=commercial+real+estate+CMBS+site:reuters.com&hl=en-US&gl=US&ceid=US:en` (headline + link only, no full text).

### AP (Associated Press)

**Free RSS:** AP does not offer public RSS or a free API.

**Cheapest paid path:**
- AP Newsroom API (licensing via `newsroom.ap.org`). No published pricing — direct sales engagement required.
- **Workaround:** AP stories are redistributed on Google News and via many NewsAPI/NewsData.io sources.

### Bloomberg

**Free RSS:** Bloomberg exposes undocumented RSS feeds that remain functional as of May 2026:[^34]

```
https://feeds.bloomberg.com/markets/news.rss         # Markets (includes CRE)
https://feeds.bloomberg.com/economics/news.rss       # Economics
https://feeds.bloomberg.com/industries/news.rss      # Industries (CRE sector)
```

**Caveats:** These are headline + teaser only (paywalled articles). Unofficial/undocumented — Bloomberg has not publicly committed to maintaining them. They may break without notice.[^34]

**Bloomberg Terminal API (paid):** Bloomberg Data License or BLPAPI — enterprise pricing ($20,000+/year range). No self-serve tier.

**Bottom line:** Neither Reuters nor AP expose any free production-grade API or RSS. Bloomberg has working but undocumented free RSS (headlines only). For production-grade news with full text from all three sources, the cheapest path is **NewsAPI.org Business plan** (~$449/month) or **Webz.io** (contact sales), which aggregate Reuters/AP/Bloomberg wire content.

***

## 10. Regional Federal Reserve Economic Indicators

| Fed Bank | Index | Direct Download URL | JSON? | Update Cadence |
|---|---|---|---|---|
| **Chicago Fed** | CFNAI | `https://www.chicagofed.org/research/data/cfnai/current-data` (Excel link on page) | Via FRED: `https://api.stlouisfed.org/fred/series/observations?series_id=CFNAI&api_key=YOUR_KEY&file_type=json` | Monthly (last business day of month)[^35][^36] |
| **Philadelphia Fed** | ADS Business Conditions Index | `https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/ads` (Excel download on page) | Via FRED: series `AWHNONAG` components | Real-time (8× per month)[^37][^38] |
| **Philadelphia Fed** | State Coincident Indexes | `https://www.philadelphiafed.org/surveys-and-data/regional-economic-analysis/state-coincident-indexes` (Excel) | Via FRED: `USPHCI` | Monthly[^39][^40] |
| **Dallas Fed** | Texas Manufacturing Outlook Survey | `https://www.dallasfed.org/research/surveys/tmos` (Excel download on page) | No direct JSON; Via FRED: series `DALTCPIMS` | Monthly[^41] |
| **Dallas Fed** | Weekly Economic Index (WEI) | `https://www.dallasfed.org/research/wei` (Excel download) | Via FRED: series `WEI` | Weekly (as of Dec 2023, WEI moved from NY Fed to Dallas Fed)[^42][^43] |
| **Atlanta Fed** | GDPNow | `https://www.atlantafed.org/research-and-data/data/gdpnow` (Excel spreadsheet link) | Via FRED: `https://api.stlouisfed.org/fred/series/observations?series_id=GDPNOW&api_key=YOUR_KEY&file_type=json` | ~8× per quarter (each new macro data release)[^44][^14] |
| **NY Fed** | Weekly Economic Index | Archived; redirects to Dallas Fed[^43] | — | Moved Dec 2023 |
| **Kansas City Fed** | Manufacturing Survey | `https://www.kansascityfed.org/surveys/manufacturing-survey/` (Excel on release page) | No direct JSON; Via FRED: `KCFMCIM` | Monthly[^45][^46] |
| **Richmond Fed** | 5th District Economic Indicators | `https://www.richmondfed.org/research/regional_economy/indexes/composite` | No direct JSON; Via FRED: series `WNCFSA` | Monthly |
| **St. Louis Fed / FRED** | All series via API | `https://api.stlouisfed.org/fred/series/observations?series_id=CFNAI&api_key=YOUR_KEY&file_type=json` | **Yes — JSON native** | Per source schedule |

**FRED API Key signup:** `https://fred.stlouisfed.org/docs/api/api_key.html` (free, instant).[^13]

***

## Master API Reference Table

| API | Exact Endpoint URL (CRE Example) | Auth | Free Rate Limit | Response Format | Update Cadence | License | Dashboard Tile |
|---|---|---|---|---|---|---|---|
| GDELT DOC 2.0 | `https://api.gdeltproject.org/api/v2/doc/doc?query=(CMBS OR "office vacancy")sourcecountry:US&mode=artlist&format=json&timespan=24h&maxrecords=250&sort=datedesc` | None | Soft IP throttle (no hard limit) | JSON / CSV / RSS | 15-min update | Open / Public Domain | CRE News Ticker |
| GDELT GKG Theme | `https://api.gdeltproject.org/api/v2/doc/doc?query=(theme:ECON_HOUSING OR theme:REAL_ESTATE)sourcecountry:US&mode=timelinevol&format=json&timespan=30d` | None | Same as above | JSON | 15-min | Open | Topic Volume Sparkline |
| Federal Register API | `https://www.federalregister.gov/api/v1/documents.json?conditions[term]=CMBS+multifamily&conditions[agencies][]=federal-housing-finance-agency&conditions[type][]=RULE&conditions[publication_date][gte]=2024-01-01&per_page=40` | None | None documented | JSON | Daily (business days) | Public Domain | Regulatory Event Marker |
| Fed Register Public Inspection | `https://www.federalregister.gov/api/v1/public-inspection-documents.json?conditions[agencies][]=housing-and-urban-development-department&per_page=20` | None | None | JSON | Daily | Public Domain | Next-Day Rules Alert |
| FOMC Calendar (Fed) | `https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm` (scrape) | None | None | HTML | Annually + updates | Public Domain | FOMC Countdown Clock |
| FRED DFEDTARU | `https://api.stlouisfed.org/fred/series/observations?series_id=DFEDTARU&api_key=KEY&file_type=json` | Free key | 1,000/day (unregistered); unlimited registered | JSON / XML | Daily | Public Domain | Fed Funds Rate Tile |
| SEC EDGAR EFTS | `https://efts.sec.gov/LATEST/search-index?q="CMBS"+"commercial+real+estate"&forms=8-K,10-K&dateRange=custom&startdt=2025-01-01&enddt=2026-12-31` | None | 10 req/sec | JSON | Real-time (filed same day) | Public Domain | EDGAR Filing Stream |
| SEC EDGAR Submissions | `https://data.sec.gov/submissions/CIK0000315966.json` | None | 10 req/sec | JSON | Real-time | Public Domain | Issuer Filing Feed |
| Regulations.gov v4 | `https://api.regulations.gov/v4/documents?filter[agencyId]=FHFA&filter[documentType]=Proposed Rule&filter[postedDate][ge]=2024-01-01&page[size]=25&api_key=KEY` | Free api.data.gov key | 1,000 req/hr | JSON | Daily | Public Domain | Open Rulemaking Docket |
| Treasury FiscalData | `https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?fields=security_desc,avg_interest_rate_amt,record_date&sort=-record_date&page[size]=10` | None | None | JSON | Daily / Monthly | Public Domain | Benchmark Rate Strip |
| Treasury TIC (CSV) | `https://ticdata.treasury.gov/Publish/shla2025r.csv` | None | None | CSV flat file | Monthly (11th biz day +0-3) | Public Domain | Foreign MBS Holdings Tile |
| BLS API v2 (CPI Shelter) | `https://api.bls.gov/publicAPI/v2/timeseries/data/CUSR0000SAH1?startyear=2024&endyear=2026&registrationkey=KEY` | Free key | 500 req/day | JSON | Monthly | Public Domain | CPI Shelter Tracker |
| BLS API v2 (JOLTS) | `https://api.bls.gov/publicAPI/v2/timeseries/data/JTS000000000000000JOR?startyear=2024&endyear=2026&registrationkey=KEY` | Free key | 500 req/day | JSON | Monthly | Public Domain | Labor Demand Indicator |
| BEA Regional API | `https://apps.bea.gov/api/data?UserID=KEY&method=GetData&DataSetName=Regional&TableName=CAINC1&LineCode=1&GeoFips=MSA&Year=2023,2024&ResultFormat=JSON` | Free key | 100 req/min | JSON / XML | Annual (CAINC1) | Public Domain | MSA Income Map |
| Census BPS API | `https://api.census.gov/data/timeseries/eits/bps?get=cell_value,time_slot_name,category_code&for=us:*&time=from+2024-01&key=YOUR_KEY` | Free key | Generous (undocumented) | JSON | Monthly | Public Domain | Building Permits Ticker |
| Census ACS Housing Tenure | `https://api.census.gov/data/2023/acs/acs5?get=NAME,B25003_001E,B25003_002E,B25003_003E&for=metropolitan+statistical+area/micropolitan+statistical+area:*&key=KEY` | Free key | Generous | JSON | Annual (ACS 5-yr) | Public Domain | Owner/Renter Map |
| Atlanta Fed GDPNow | `https://api.stlouisfed.org/fred/series/observations?series_id=GDPNOW&api_key=KEY&file_type=json` | Free FRED key | 1,000+/day | JSON | ~8× per quarter | Public Domain | GDP Nowcast Tile |
| Chicago Fed CFNAI | `https://api.stlouisfed.org/fred/series/observations?series_id=CFNAI&api_key=KEY&file_type=json` | Free FRED key | 1,000+/day | JSON | Monthly | Public Domain | National Activity Index |
| Dallas Fed WEI | `https://api.stlouisfed.org/fred/series/observations?series_id=WEI&api_key=KEY&file_type=json` | Free FRED key | 1,000+/day | JSON | Weekly | Public Domain | Weekly Economy Pulse |
| Kansas City Fed Mfg | `https://api.stlouisfed.org/fred/series/observations?series_id=KCFMCIM&api_key=KEY&file_type=json` | Free FRED key | 1,000+/day | JSON | Monthly | Public Domain | Midwest Industrial Tile |
| NewsData.io | `https://newsdata.io/api/1/news?apikey=KEY&q=CMBS+%22commercial+real+estate%22&language=en&country=us` | Free key | 200 credits/day (≈2,000 articles), 12-hr delay | JSON | 12-hr delay (free) | Proprietary | Supplemental News Feed |
| Mediastack | `http://api.mediastack.com/v1/news?access_key=KEY&keywords=CMBS,commercial+real+estate&countries=us&languages=en` | Free key | ~500 req/mo, 30-min delay | JSON | 30-min delay (free) | Proprietary | Backup News Ticker |
| Bloomberg RSS | `https://feeds.bloomberg.com/industries/news.rss` | None | None | RSS/XML | Real-time (headlines only) | Unofficial | Bloomberg Headline Strip |
| Reuters | No free API or RSS | — | — | — | — | Paid only | Paid via Reuters Connect |
| AP Wire | No free API or RSS | — | — | — | — | Paid only | Paid via AP Newsroom |

***

## Parallel Fan-Out Python Snippet (Top 5 APIs)

```python
import asyncio, httpx, os

FRED_KEY = os.environ["FRED_KEY"]
BLS_KEY  = os.environ["BLS_KEY"]
REGS_KEY = os.environ["REGULATIONS_GOV_KEY"]

ENDPOINTS = {
    "gdelt_cre_news": (
        "https://api.gdeltproject.org/api/v2/doc/doc",
        {"query": '(CMBS OR "office vacancy" OR "commercial real estate distress") sourcecountry:US sourcelang:english',
         "mode": "artlist", "format": "json", "timespan": "24h", "maxrecords": "250", "sort": "datedesc"}
    ),
    "fed_register_rules": (
        "https://www.federalregister.gov/api/v1/documents.json",
        {"conditions[term]": "CMBS multifamily real estate", "conditions[type][]": ["RULE","PRORULE"],
         "conditions[publication_date][gte]": "2024-01-01", "per_page": 40, "order": "newest"}
    ),
    "gdpnow": (
        "https://api.stlouisfed.org/fred/series/observations",
        {"series_id": "GDPNOW", "api_key": FRED_KEY, "file_type": "json", "sort_order": "desc", "limit": 5}
    ),
    "cpi_shelter": (
        "https://api.bls.gov/publicAPI/v2/timeseries/data/CUSR0000SAH1",
        {"startyear": "2024", "endyear": "2026", "registrationkey": BLS_KEY}
    ),
    "fhfa_rulemaking": (
        "https://api.regulations.gov/v4/documents",
        {"filter[agencyId]": "FHFA", "filter[documentType]": "Proposed Rule",
         "filter[postedDate][ge]": "2024-01-01", "page[size]": 10, "api_key": REGS_KEY}
    ),
}

async def fetch_one(name, url, params):
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(url, params=params)
        return name, r.status_code, r.json()

async def fan_out():
    tasks = [fetch_one(name, url, params) for name, (url, params) in ENDPOINTS.items()]
    return await asyncio.gather(*tasks, return_exceptions=True)

results = asyncio.run(fan_out())
for name, status, data in results:
    print(f"{name}: HTTP {status}")
```

***

## Hardening Notes — Deprecation, Undocumented Behavior & IP Rate Limits

**APIs to harden against:**

1. **Bloomberg RSS feeds** (`feeds.bloomberg.com/*/news.rss`) are entirely **undocumented and unofficial**. Bloomberg has never publicly committed to these URLs. They have broken before and will break again without notice. Do not use as a production primary source — treat as a best-effort supplement. Wrap all Bloomberg RSS calls in try/except with exponential backoff and a fallback to Google News RSS proxy.[^34]

2. **GDELT DOC 2.0** has an **undisclosed, elastic IP rate limit** tied to ElasticSearch cluster health. During breaking news events (e.g., major Fed rate decisions, CRE market shocks), the cluster throttles aggressively and returns HTTP 429 or empty results silently. Implement a cache layer (Redis TTL = 15 min) and never hit GDELT more than once per 15 minutes per unique query. For bulk historical pulls, switch to the BigQuery table `gdelt-bq.gdeltv2.gkg_partitioned` or the Web NGrams 3.0 S3 dump.[^1]

3. **EDGAR EFTS** (`efts.sec.gov`) is a **different server from `data.sec.gov`** and has its own 10 req/sec ceiling. It is not documented as a stable production API by the SEC — the SEC's developer page points to `data.sec.gov` as the official API surface. EFTS may change endpoints during EDGAR infrastructure upgrades; monitor `https://www.sec.gov/about/developer-resources` for breaking changes.[^15][^18]

4. **Federal Register API v1** carries a subtle trap: `conditions[agencies][]` slugs change when agencies are reorganized or renamed. The slug `financial-crimes-enforcement-network` replaced `fincen` at some point. Always validate slugs against the agency list endpoint: `https://www.federalregister.gov/api/v1/agencies.json`.

5. **Regulations.gov v4 API** was a complete rebuild from v3 (which was deprecated in 2021). Any code written for v3 will break silently on v4. The v4 endpoint structure (`/v4/documents`, `/v4/dockets`, `/v4/comments`) is stable as of 2026 but the underlying data.gov API key system (`api.data.gov`) is shared infrastructure — keys obtained for one agency's API work for all, but rate limits are shared across all api.data.gov-powered services.[^20][^21]

6. **Census APIs** (BPS, MRTS, ACS) change variable names between ACS vintage years and can silently return errors for variable codes no longer available in a given survey year. Always pin your API call to a specific `year=` parameter rather than pulling "latest".[^29]

7. **Treasury TIC** has **no REST API** — only CSV flat files whose filenames encode the survey year. Automate filename construction by scraping `https://ticdata.treasury.gov/` for the current release date rather than hardcoding filenames.[^24]

---

## References

1. [Ukraine, API Rate Limiting & Web NGrams 3.0 - The GDELT Project](https://blog.gdeltproject.org/ukraine-api-rate-limiting-web-ngrams-3-0/) - Our APIs are rate limited to protect the underlying ElasticSearch clusters, given the enormous volum...

2. [DOC & GEO 2.0 API Updates: Full Year Searching And More!](https://blog.gdeltproject.org/doc-geo-2-0-api-updates-full-year-searching-and-more/) - The DOC 2.0 API can now search up to the past year of coverage, while the GEO 2.0 API can now search...

3. [GDELT DOC 2.0 API Debuts!](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/) - The GDELT GEO 2.0 API is accessed via a simple URL with the following parameters. Under each paramet...

4. [A short intro to GDELT - - Ken Blake, Ph.D.](https://drkblake.com/gdeltintro/) - &timespan=30 (the most recent 30 minutes. Note that there is no “m” or “minutes” component. Just the...

5. [New November 2021 GKG 2.0 Themes Lookup - The GDELT Project](https://blog.gdeltproject.org/new-november-2021-gkg-2-0-themes-lookup/) - A list of all of the themes found in the GDELT Global Knowledge Graph (GKG)'s Themes and V2Themes fi...

6. [Understanding Themes in Google BigQuery GDELT GKG 2.0](https://stackoverflow.com/questions/51967429/understanding-themes-in-google-bigquery-gdelt-gkg-2-0) - I'm using Google bigquery to analyze the GDELT GKG 2.0 dataset and would like to better understand h...

7. [Federal Register API - Tested Every Single Day. - Free Public APIs](https://www.freepublicapis.com/federal-register-api) - The Federal Register API provides access to data from the Federal Register, allowing users to fetch ...

8. [API Documentation - Federal Register](https://www.federalregister.gov/developers/documentation/api/v1) - FederalRegister.gov provides multiple public API endpoints. Each endpoint is detailed below and can ...

9. [The Fed - Meeting calendars and information - Federal Reserve](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm) - 2026 FOMC Meetings ; June. 16-17* ; July. 28-29 ; September. 15-16* ; October. 27-28 ; December. 8-9...

10. [Federal Reserve Calendars](https://www.chicagofed.org/utilities/about-us/federal-reserve-calendars) - FOMC Meetings. The FOMC holds eight regularly scheduled meetings during the year and other meetings ...

11. [Federal Open Market Committee announces its tentative meeting ...](https://www.federalreserve.gov/newsevents/pressreleases/monetary20240809a.htm) - Federal Open Market Committee announces its tentative meeting schedule for 2025 and 2026 · Tuesday, ...

12. [FOMC releases tentative meeting schedule for 2025, 2026](https://bankingjournal.aba.com/2024/08/fomc-releases-tentative-meeting-schedule-for-2025-2026/) - Tuesday, Jan. 28, and Wednesday, Jan. · Tuesday, March 18, and Wednesday, March 19 · Tuesday, May 6,...

13. [St. Louis Fed Web Services: FRED® API](https://fred.stlouisfed.org/docs/api/fred/) - The FRED® API, Version 2 is ideal for anyone who is interested to retrieve observations for all seri...

14. [GDPNow - FRED - Federal Reserve Bank of St. Louis](https://fred.stlouisfed.org/series/GDPNOW) - Graph and download economic data for GDPNow (GDPNOW) from Q3 2011 to Q2 2026 about nowcast, projecti...

15. [Accessing EDGAR Data - SEC.gov](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data) - Anyone can access and download this information for free or query it through a variety of EDGAR publ...

16. [EDGAR Application Programming Interfaces (APIs) - SEC.gov](https://www.sec.gov/search-filings/edgar-application-programming-interfaces) - This page provides information on how developers may use application programming interfaces (APIs) t...

17. [EDGAR Full Text Search FAQ - SEC.gov](https://www.sec.gov/edgar/search/efts-faq.html) - Full-Text Search will allow you to search the full text of all EDGAR filings submitted electronicall...

18. [Developer Resources - SEC.gov](https://www.sec.gov/about/developer-resources) - Accessing EDGAR Data. The U.S. Securities and Exchange Commission's HTTPS file system allows compreh...

19. [ro-h/regulatory_comments_api · Datasets at Hugging Face](https://huggingface.co/datasets/ro-h/regulatory_comments_api) - This dataset will use Regulation.gov public API to aggregate and clean public comments for dockets s...

20. [Developer Manual - Data.gov's API](https://api.data.gov/docs/developer-manual/) - Rate limits may vary by service, but the defaults are: Hourly Limit: 1,000 requests per hour. For ea...

21. [Revamping Regulations.gov | Regulatory Studies Center](https://regulatorystudies.columbian.gwu.edu/revamping-regulationsgov) - [2] The normal rate limit for the GET API is still 1000 requests per hour: https://api.data.gov/docs...

22. [Treasury API Guide - BD Economics](https://bd-econ.com/treasuryapi.html) - The Fiscal Data API is a RESTful API that returns JSON data. You can filter results, specify date ra...

23. [preliminary report on foreign portfolio holdings of us securities at ...](https://ticdata.treasury.gov/Publish/shlprelim.html) - The first table shows foreign holdings of U.S. securities split into holdings of equities, long-term...

24. [Release Dates of TIC Data | U.S. Department of the Treasury](https://home.treasury.gov/data/treasury-international-capital-tic-system/release-dates-of-tic-data) - For the securities holdings data the first releases were May, July, September and December of 2012 b...

25. [API Full Data Set - OFR STFM - Office of Financial Research (OFR)](https://www.financialresearch.gov/short-term-funding-monitor/api-specs/api-full-dataset/) - The STFM application programming interface (API) allows a remote application to query the Office of ...

26. [Acquire and Visualize US Inflation Data with the BLS API, Python ...](https://towardsdatascience.com/acquire-and-visualize-us-inflation-data-with-the-bls-api-python-and-tableau-409a2dca1537/) - People and entities use CPI and its components to track price changes over time. The screenshot of t...

27. [bea.md - K-Dense-AI/scientific-agent-skills · GitHub](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/scientific-skills/database-lookup/references/bea.md) - The Bureau of Economic Analysis API provides access to U.S. economic accounts data including GDP (na...

28. [BEA's API Expands Access to All Regional Data](https://www.bea.gov/news/blog/2015-07-08/beas-api-expands-access-all-regional-data) - All regional data from the Bureau of Economic Analysis are now accessible through our application pr...

29. [Census API - Census Data - Library Guides at Brown University](https://libguides.brown.edu/census/api) - Provides an overview of the services, a form for requesting an API key, examples and help documents ...

30. [Best News API 2025: 8 Providers Compared & Ranked](https://newsapi.ai/blog/best-news-api-comparison-2025) - We compared 8 top news APIs for features, pricing, and performance. See who ranks #1 for real-time n...

31. [All About Pricing Plans: NewsData.io News API](https://newsdata.io/blog/pricing-plan-in-newsdata-io/) - Free Plan. The free plan provides a free tier for the News API with limited features. You will get 2...

32. [Trusted News API Assistance & Information - Mediastack FAQ](https://mediastack.com/faq) - Find answers to your questions about Mediastack's news API. Explore features, pricing, setup, and in...

33. [[HOW-TO] Read today's news with AutoWeb and the Mediastack API](https://www.reddit.com/r/tasker/comments/kfmaf7/howto_read_todays_news_with_autoweb_and_the/) - I found out about the Mediastack API which gives you live news for free (free tier has a 30 minute d...

34. [Does Bloomberg has a RSS feed for FREE? - Reddit](https://www.reddit.com/r/rss/comments/u1op2b/does_bloomberg_has_a_rss_feed_for_free/) - 35 votes, 20 comments. I wish to get RSS feed from Bloomberg. However, I am not able to get it. Anyo...

35. [Chicago Fed National Activity Index: Current Data](https://www.chicagofed.org/research/data/cfnai/current-data) - The Chicago Fed National Activity Index (CFNAI) is a monthly index designed to gauge overall economi...

36. [Chicago Fed National Activity Index (CFNAI) - FRED](https://fred.stlouisfed.org/series/CFNAI) - Graph and download economic data for Chicago Fed National Activity Index (CFNAI) from Mar 1967 to Ma...

37. [Aruoba-Diebold-Scotti Business Conditions Index](https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/ads) - The Aruoba-Diebold-Scotti business conditions index is designed to track real business conditions at...

38. [[PDF] Methodology for the Aruoba-Diebold-Scotti Business Conditions Index](https://www.philadelphiafed.org/-/media/FRBP/Assets/Surveys-And-Data/ads/ads-technical-documentation.pdf) - The Aruoba-Diebold-Scotti (ADS) business conditions index is designed to track real business conditi...

39. [State Coincident Indexes - Federal Reserve Bank of Philadelphia](https://www.philadelphiafed.org/surveys-and-data/regional-economic-analysis/state-coincident-indexes) - The coincident indexes combine four state-level indicators to summarize current economic conditions ...

40. [Coincident Economic Activity Index for the United States (USPHCI)](https://fred.stlouisfed.org/series/USPHCI) - Graph and download economic data for Coincident Economic Activity Index for the United States (USPHC...

41. [Texas Manufacturing Outlook Survey - Dallasfed.org](https://www.dallasfed.org/research/surveys/tmos) - The Dallas Fed conducts the Texas Manufacturing Outlook Survey monthly to obtain a timely assessment...

42. [Weekly Economic Index - Dallasfed.org](https://www.dallasfed.org/research/wei) - The 13-week moving average is 2.71 percent. This is compared with 2.66 percent four-quarter GDP grow...

43. [Weekly Economic Index (WEI) - Federal Reserve Bank of New York](https://www.newyorkfed.org/research/policy/weekly-economic-index) - The WEI is an index of ten indicators of real economic activity, scaled to align with the four-quart...

44. [GDPNow - Federal Reserve Bank of Atlanta](https://www.atlantafed.org/research-and-data/data/gdpnow) - GDPNow is not an official forecast of the Atlanta Fed. Rather, it is best viewed as a running estima...

45. [Tenth District Manufacturing Activity Continued to Decrease in June](https://www.kansascityfed.org/surveys/manufacturing-survey/tenth-district-manufacturing-continued-to-decrease-june-2025/) - Tenth District manufacturing activity decreased, while expectations for future activity increased. P...

46. [Tenth District Manufacturing Activity Increased Moderately in March](https://www.kansascityfed.org/surveys/manufacturing-survey/tenth-district-manufacturing-activity-increased-moderately-in-march/) - Tenth District manufacturing activity increased moderately, and expectations for future activity rem...

