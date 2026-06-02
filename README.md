# RePrime Data Platform

> Real estate intelligence platform aggregating **611 data sources** with **13 live API integrations** to deliver institutional-grade deal analysis for commercial real estate investors.

[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkazi-reprime%2Freprime-data-platform)

---

## 🚀 One-Click Vercel Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkazi-reprime%2Freprime-data-platform&env=FRED_API_KEY,CENSUS_API_KEY,BLS_API_KEY,BEA_API_KEY,EIA_API_KEY,FINNHUB_API_KEY,ALPHA_VANTAGE_API_KEY,COINGECKO_API_KEY,TWELVE_DATA_API_KEY,WALK_SCORE_API_KEY,OPENWEATHER_API_KEY,DATA_GOV_API_KEY&project-name=reprime-data-platform&repository-name=reprime-data-platform)

Click the button above to deploy directly to Vercel. You'll be prompted to add the 12 API keys during setup.



## 🎯 What This Platform Does

The RePrime Data Platform is a comprehensive real estate intelligence system that:

1. **Scrapes 611 data sources** — Government APIs (FRED, Census, BLS, FDIC, FEMA, EPA, SEC EDGAR), dataset portals (NYC, Chicago, Dallas Open Data), RSS feeds (Bloomberg, Federal Reserve, CFPB)
2. **Integrates 13 live APIs** — Real-time data from FRED, BLS, Census, BEA, Finnhub, CoinGecko, Walk Score, OpenWeather, EIA, Alpha Vantage, Twelve Data, NY Fed, Treasury
3. **Powers 3 web experiences** — Investor-facing site, deal intelligence terminal, internal data dashboard
4. **Delivers institutional-grade analysis** — Cap rates, NOI, financing options, comparables, news sentiment, environmental risk

## 🌐 Live Pages

| Page | URL | Description |
|------|-----|-------------|
| **RePrime Site** | `/site` | Data-focused company website with intelligence pipeline visualization, 611 sources breakdown, live market data, featured deal showcase |
| **Deal Terminal** | `/terminal` | Full property intelligence — real OM photos, tenant roster, capital stack, SOFR-indexed financing, comps, news sentiment, flood risk |
| **Data Dashboard** | `/` | Internal stats dashboard with scrape coverage, category breakdown, source search |

## 📊 Data Coverage

- **611** sources across **14** market categories
- **549** successfully scraped (91% coverage)
- **8,223** records collected
- **30+** real property images extracted from offering memorandum
- **9** paid APIs intentionally excluded (free-source first approach)

### Category Breakdown
- `capital_markets` — 88 sources (REITs, debt markets, securities)
- `zoning_parcel` — 69 sources (NYC PLUTO, building permits, zoning)
- `hazard_environmental` — 47 sources (FEMA flood, EPA brownfields)
- `news_sentiment` — 39 sources (Bloomberg, Federal Reserve, CFPB)
- `macro_indicator` — 37 sources (FRED economic series)
- `infrastructure` — 30 sources (DOT, FCC broadband, HRSA)
- `demographic` — 25 sources (Census ACS, HUD)
- `israeli` — 23 sources (Bank of Israel, CBS, data.gov.il)
- `economic` — 19 sources (BLS, BEA, World Bank)
- `housing_re` — 12 sources (FRED housing series)
- `insurance_climate` — 7 sources (NFIP, climate data)
- `construction_pipeline` — 6 sources (Census construction spending)
- `energy` — 33 sources (EIA, ERCOT)
- `other` — 176 sources (specialized REITs, alternative data)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Pages                        │
│   /site (company)  │  /terminal (deal)  │  / (dashboard)│
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────┐
│              FastAPI Server (uvicorn)                    │
│   25+ endpoints across /api/live, /api/deal, /api/*     │
└─────────────────┬───────────────────────────────────────┘
                  │
       ┌──────────┼──────────┐
       │          │          │
┌──────▼────┐ ┌──▼─────┐ ┌──▼────────┐
│ Scrapers  │ │ Live    │ │ Static    │
│ (552 JSON)│ │ APIs    │ │ Images    │
│           │ │ (13)    │ │ (30 OM)   │
└───────────┘ └─────────┘ └───────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- pip

### Installation

```bash
# Clone the repo
git clone https://github.com/kazi-reprime/reprime-data-platform.git
cd reprime-data-platform

# Install dependencies
pip install -r requirements.txt

# Configure API keys (copy from .env.example and fill in)
cp api/.env.example api/.env
# Edit api/.env with your API keys

# Fetch fresh data from all 13 APIs
python3 -m api.fetch_live_data

# Start the server
python3 -m uvicorn api.server.app:app --host 0.0.0.0 --port 8001 --reload
```

### Access the Platform
- **Company Site**: http://localhost:8001/site
- **Deal Terminal**: http://localhost:8001/terminal
- **Dashboard**: http://localhost:8001/
- **API Docs**: http://localhost:8001/docs

## 🔑 API Keys Required

Free API keys from these providers (register links below):

| API | Free Tier | Register |
|-----|-----------|----------|
| FRED | Unlimited | https://fred.stlouisfed.org/docs/api/api_key.html |
| Census | Unlimited | https://api.census.gov/data/key_signup.html |
| BLS | 500/day | https://www.bls.gov/developers/ |
| BEA | Unlimited | https://apps.bea.gov/API/signup/ |
| EIA | Unlimited | https://www.eia.gov/opendata/ |
| Finnhub | 60/min | https://finnhub.io/ |
| Alpha Vantage | 25/day | https://www.alphavantage.co/ |
| CoinGecko | 30/min | https://www.coingecko.com/en/api |
| Twelve Data | 800/day | https://twelvedata.com/ |
| Walk Score | 5000/day | https://www.walkscore.com/professional/ |
| OpenWeather | 60/min | https://openweathermap.org/api |

## 📡 API Endpoints

### Market Data (Live)
```
GET /api/live/ticker       # Real-time market ticker
GET /api/live/market       # Full live market data (FRED, REITs, crypto)
GET /api/live/reits        # 10 REIT prices from Finnhub
GET /api/live/property     # Property context (Walk Score, weather)
GET /api/live/refresh      # Re-fetch all 13 APIs
```

### Deal Intelligence
```
GET /api/deal/intelligence # Full deal intelligence package
GET /api/deal/comps        # Comparable properties (NYC PLUTO)
GET /api/deal/permits      # Building permits (multi-city)
GET /api/deal/news         # News sentiment from 10 RSS feeds
GET /api/deal/financing    # 6 lending products with live SOFR rates
GET /api/deal/environmental # FEMA flood claims and disasters
```

### Scraped Data
```
GET /api/stats             # Aggregate scrape statistics
GET /api/sources           # List 611 sources (paginated, filterable)
GET /api/sources/{id}      # Individual source metadata + records
GET /api/categories        # 14 market categories with counts
```

### Market Specifics
```
GET /api/market/sofr       # NY Fed SOFR rates
GET /api/market/cpi        # BLS CPI with history
GET /api/market/treasury   # Treasury avg interest rates
GET /api/market/fdic       # FDIC bank loan aggregates
GET /api/market/crypto     # Bitcoin/Ethereum prices
GET /api/market/fema       # FEMA disaster declarations
```

## 🏢 Featured Deal: Pensacola, FL Government Office

The platform is showcased with a real deal — **1305 N. 9th Avenue, Pensacola, FL**:

- **Purchase Price**: $6,000,000 ($500K below OM ask)
- **Cap Rate**: 8.95% (going-in)
- **NOI**: $537,174 annual
- **IRR (5yr)**: 21.79%
- **Cash on Cash**: 28.07% (with seller mezz)
- **Tenants**: FL Department of Children & Families (DCF), FL Department of Juvenile Justice (DJJ)
- **Credit**: AAA/Aaa State of Florida
- **WALT**: 7.4 years
- **Occupancy**: 100%

Real property images extracted from the offering memorandum are served at `/images/om_p*.jpeg`.

## 📁 Project Structure

```
reprime-data-platform/
├── api/
│   ├── server/
│   │   ├── app.py              # FastAPI app with 25+ routes
│   │   ├── live_data.py        # 13-API live data layer
│   │   ├── market_data.py      # Scraped data extraction
│   │   └── deal_intel.py       # Deal intelligence (comps, news, financing)
│   ├── scrapers/
│   │   ├── connectors/         # BaseConnector + 4 specialized
│   │   ├── configs/            # Per-source YAML configs
│   │   └── config_loader.py    # CSV + YAML source loader
│   ├── frontend/
│   │   ├── index.html          # Data dashboard
│   │   ├── site.html           # RePrime Group website
│   │   ├── terminal.html       # Deal intelligence terminal
│   │   └── images/             # 30 real property photos from OM
│   ├── data/
│   │   ├── sources_611.csv     # Master source list
│   │   ├── scraped/            # 552 JSON files (8,223 records)
│   │   ├── live/               # Live API cache
│   │   └── reports/            # Generated Excel/text reports
│   ├── fetch_live_data.py      # Live data fetcher (13 APIs)
│   ├── generate_reports.py     # Excel/PDF report generator
│   ├── scrape_all.py           # Master batch scraper (602 sources)
│   └── .env.example            # API key template
├── requirements.txt
├── vercel.json                 # Vercel deployment config
└── README.md
```

## 🛠️ Tech Stack

- **Backend**: Python 3.12, FastAPI, uvicorn, httpx, asyncio
- **Data**: pandas, openpyxl, feedparser, tenacity, structlog
- **Frontend**: Vanilla HTML/CSS/JS (no build step), Inter + JetBrains Mono fonts
- **APIs**: 13 free-tier integrations (FRED, BLS, Finnhub, CoinGecko, etc.)

## 📈 Deployment

### Vercel (recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

The `vercel.json` is preconfigured to serve the FastAPI app as a serverless function.

### Local Production
```bash
python3 -m uvicorn api.server.app:app --host 0.0.0.0 --port 8001 --workers 4
```

## 📝 Reports

The platform generates institutional-grade reports:

```bash
python3 -m api.generate_reports
```

Outputs:
- **Excel report** (3 sheets): Summary, All Sources, Errors
- **Text report**: Executive summary, category breakdown, top 20 sources

## 🔐 Security

- API keys stored in `.env` (never committed)
- `.gitignore` excludes secrets, raw data dumps
- CORS configured for `*` (restrict in production)
- No PII collected or stored

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 👥 Team

Built by RePrime Group — Institutional commercial real estate with 30+ years experience.

- **Founder**: Gideon Gratsiani
- **CEO**: Shirel Ben Harroush
- **AVP Acquisitions & Head of Tech**: Steve Philipp

📍 123 North Lawler St, Postville, IA 52162
📧 info@reprime.com
📞 888-770-8770

---

**Powered by 611 data sources + 13 live APIs**
