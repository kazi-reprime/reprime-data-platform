# RePrime Data Platform

**Institutional CRE intelligence powered by 611 data sources, 14 live API layers, and a Python serverless search engine.**

Live: [reprime-data-platform.vercel.app](https://reprime-data-platform.vercel.app)
Repo: [github.com/kazi-reprime/reprime-data-platform](https://github.com/kazi-reprime/reprime-data-platform)

---

## What This Is

A full-stack commercial real estate data platform that aggregates government APIs, market feeds, environmental databases, demographic datasets, FX rates, crypto prices, and news sentiment into a single property intelligence interface. Enter any US address — the system geocodes it, fans out queries to 14+ APIs in parallel, and returns a comprehensive intelligence report in under 10 seconds.

Built for RePrime Group, a commercial real estate investment firm specializing in institutional-scale acquisitions across every US asset class and market condition.

## Live Products

| Page | URL | Purpose |
|------|-----|---------|
| Company Site | [/site](https://reprime-data-platform.vercel.app/site) | Investor-facing landing with live market ticker, team, references |
| Dashboard | [/](https://reprime-data-platform.vercel.app/) | Executive command center: portfolio, pipeline, rates, source health |
| Terminal | [/terminal](https://reprime-data-platform.vercel.app/terminal) | Bloomberg-grade deal intelligence: property analysis, capital stack |
| Explore | [/explore](https://reprime-data-platform.vercel.app/explore) | Property search engine: address lookup across 611 sources |

## Search API

**Endpoint:** `GET /api/search?address=<any US address>`

**Example:**
```
https://reprime-data-platform.vercel.app/api/search?address=350+5th+Ave+New+York+NY
```

**Returns:** JSON with geocode (FIPS, tract, block), FEMA flood zone, EPA cleanup sites, FRED rates, crypto prices, FX rates (ILS/EUR/GBP), GDELT news sentiment, Federal Register filings, FDIC data, weather alerts, Redfin listings, OSM POIs, CDC social vulnerability, FCC broadband, multi-currency valuation ($10M in USD/ILS/BTC/ETH/EUR/GBP), and 6 financing options.

**Sources queried in parallel (per search):**

| Source | Data | Auth |
|--------|------|------|
| Census Geocoder | Address to lat/lon + FIPS state/county/tract/block | Free, no key |
| FEMA NFHL | Exact flood zone by coordinates (Zone A/AE/V/X) | Free, no key |
| FEMA OpenFEMA | Disaster declarations by state | Free, no key |
| EPA Cleanups | Superfund/brownfield sites within 2km radius | Free, no key |
| FRED | Treasury 10Y, Mortgage 30Y, Fed Funds, Unemployment | Free, no key |
| CoinGecko | Bitcoin + Ethereum in USD and ILS | Free, no key |
| Frankfurter/ECB | FX rates: ILS, EUR, GBP, CAD, JPY | Free, no key |
| Bank of Israel | Official USD/ILS exchange rate | Free, no key |
| GDELT | Area news sentiment with tone scoring | Free, no key |
| Federal Register | Latest CRE regulatory filings | Free, no key |
| FDIC BankFind | Recent bank failures | Free, no key |
| NWS | Active weather alerts by coordinates | Free, no key |
| Redfin Stingray | Location autocomplete + nearby listings | Internal API |
| OSM Overpass | Points of interest within 800m | Free, no key |
| CDC SVI | Social vulnerability index (block group) | Free, no key |
| FCC Broadband | ISP availability by coordinates | Free, no key |

## Data Sources

611 cataloged endpoints across 14 categories. Full registry in `data_sources_611.csv`.

| Category | Count | Key Sources |
|----------|-------|-------------|
| Government & Regulatory | 89 | FRED, BLS, Census, HUD, SEC EDGAR, Federal Register |
| Property Transactions | 95 | County records, Zillow Research, Redfin |
| Capital Markets | 25 | FDIC BankFind, FINRA TRACE, Fed H.8, Treasury |
| Hazard & Environmental | 38 | FEMA NFHL, EPA Envirofacts/Superfund/TRI/RCRA, USGS |
| Zoning & Parcels | 40+ | City-level ArcGIS/Socrata (LA, Chicago, NYC, Miami, etc.) |
| Macro Indicators | 20+ | FRED, BLS CPI, CoinGecko, Frankfurter FX, GDELT |
| Israeli Market | 15+ | Bank of Israel, CBS Lamas, data.gov.il |
| Demographics | 12 | CDC SVI, Census ACS, IRS migration, BLS LAUS |
| News & Sentiment | 14 | GDELT, Federal Register, RSS feeds |
| Energy & Infrastructure | 12 | ERCOT, EIA, FCC broadband, CMS healthcare |
| Construction Pipeline | 10 | Census permits, city-level permit APIs |
| Housing & RE | 8 | Freddie Mac PMMS, Zillow Research, HUD FMR |

## Architecture

```
reprime-data-platform/
├── api/
│   ├── search.py              # Python serverless — 14 parallel API calls
│   └── requirements.txt       # stdlib only, no external deps
├── site.html                  # Company landing page
├── index.html                 # Executive dashboard
├── terminal.html              # Deal intelligence terminal
├── explore.html               # Property search + data explorer
├── dashboard.html             # Portfolio dashboard
├── data/                      # Pre-cached JSON from aggregator
│   ├── live/ticker.json       # FRED rates, crypto, FX
│   ├── live/market.json       # Full market snapshot
│   ├── deal/intelligence.json # FEMA, EPA, FDIC, earthquakes
│   └── ...                    # 20+ cached endpoints
├── images/                    # Property OM images (30 files)
├── scraper/aggregate.py       # Batch data aggregator (15 endpoints)
├── data_sources_611.csv       # Master source registry
├── CLAUDE.md                  # AI coding instructions
├── vercel.json                # Deployment config
└── RePrime_Data_Platform_Architecture_v1.docx
```

## Design System

All 4 pages share identical:

- **Font:** Poppins (300-800) + JetBrains Mono for data
- **Colors:** Navy #0E3470, Gold #BC9C45, Blue #1D5FB8, Bright #00A1FF, Teal #009080
- **Themes:** 4 modes — Dark, Light (white), Midnight (deep navy), Gold (warm amber)
- **Effects:** Glassmorphism (backdrop-filter blur), animated mesh gradient, scroll reveal, particle canvas
- **Navigation:** Shared sticky nav with Platform/Dashboard/Terminal/Explore + theme toggle
- **Theme persistence:** localStorage key `rp-theme` syncs across all pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Static HTML/CSS/JS, Poppins, JetBrains Mono, glassmorphism |
| Backend | Python serverless (Vercel), stdlib only (urllib, json, ssl, concurrent.futures) |
| Hosting | Vercel (static + Python serverless), GitHub auto-deploy |
| Data | Pre-cached JSON on CDN + real-time API fan-out |
| Geocoding | Census Geocoder (free, no key) + Nominatim fallback |
| FX/Crypto | Bank of Israel, CoinGecko, Frankfurter (ECB-sourced) |
| Repo | github.com/kazi-reprime/reprime-data-platform |

## Team

| Name | Title |
|------|-------|
| Gideon Gratsiani | Founder — 30+ years CRE, 1,000+ auction acquisitions |
| Shirel Ben Harroush | CEO — Strategic partnerships, capital markets |
| Chaim Abrahams | COO — Operations, fund management |
| Steve Philipp | AVP Acquisitions / Head of Technology |
| Col. Yaron Sitbon | Israel Operations |
| Adir Yonasi | VP, Investor Relations |
| Nikoloz Samkharadze | Developer — Large-scale construction |
| Abhisar Laza | Creative Director |
| Hunter Schultz | Analyst |

## RePrime Ecosystem

| Product | URL |
|---------|-----|
| RePrime Group | [reprime.com](https://reprime.com) |
| Investor Portal | [info.reprimeterminal.com](https://info.reprimeterminal.com) |
| Broker Portal | [broker.reprimeterminal.com](https://broker.reprimeterminal.com) |
| RePrime Pro (Israel) | [reprimepro.co.il](https://reprimepro.co.il) |
| Overnights | [overnights.com](https://www.overnights.com) |
| CRE-Pro | [cre-pro.com](https://cre-pro.com) |
| Data Platform | [reprime-data-platform.vercel.app](https://reprime-data-platform.vercel.app) |

## Contact

- **Address:** 123 North Lawler St, Postville, IA 52162
- **Phone:** 888-770-8770
- **Email:** info@reprime.com

## License

MIT
