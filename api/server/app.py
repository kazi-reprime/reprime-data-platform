"""FastAPI server for the RePrime Data Platform."""
import json
import os
from collections import defaultdict
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

DATA_DIR = Path(__file__).parent.parent / "data" / "scraped"
CSV_PATH = Path(__file__).parent.parent / "data" / "sources_611.csv"
REPORT_DIR = Path(__file__).parent.parent / "data" / "reports"
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"

app = FastAPI(
    title="RePrime Data Platform",
    description="Aggregated real estate data from 611 sources",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/images", StaticFiles(directory=str(FRONTEND_DIR / "images")), name="images")


def _load_source_index() -> dict:
    """Load CSV into a dict keyed by REPR-ID."""
    import csv
    index = {}
    if not CSV_PATH.exists():
        return index
    with open(CSV_PATH, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sid = row.get("ID", "").strip()
            if sid:
                index[sid] = {
                    "id": sid,
                    "name": row.get("Source Name", "").strip(),
                    "provider": row.get("Provider", "").strip(),
                    "category": row.get("Category", "").strip(),
                    "endpoint": row.get("Endpoint URL", "").strip(),
                    "auth": row.get("Auth Required", "none").strip(),
                    "cost": row.get("Monthly Cost (USD)", "0").strip(),
                    "source_type": row.get("Source Type", "").strip(),
                    "notes": row.get("Notes", "").strip(),
                }
    return index


def _load_scraped(source_id: str) -> Optional[dict]:
    """Load a scraped JSON file."""
    path = DATA_DIR / f"{source_id}.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def _build_stats() -> dict:
    """Build aggregate statistics from scraped data."""
    index = _load_source_index()
    scraped_ids = {p.stem for p in DATA_DIR.glob("*.json")} if DATA_DIR.exists() else set()

    by_category = defaultdict(lambda: {"total": 0, "scraped": 0, "records": 0})
    by_status = {"scraped": 0, "not_scraped": 0, "error": 0, "paid_skipped": 0}
    total_records = 0

    for sid, meta in index.items():
        cat = meta.get("category", "other") or "other"
        cost = meta.get("cost", "0")
        try:
            cost_str = cost.replace("$","").replace(",","") if cost else "0"; cost_val = float(cost_str) if cost_str else 0
        except ValueError:
            cost_val = 0

        by_category[cat]["total"] += 1

        if cost_val > 0:
            by_status["paid_skipped"] += 1
            continue

        if sid in scraped_ids:
            data = _load_scraped(sid)
            if data:
                rc = data.get("record_count", 0)
                recs = data.get("records", [])
                is_error = (rc == 1 and len(recs) == 1 and "error_code" in (recs[0] if recs else {}))
                if is_error:
                    by_status["error"] += 1
                else:
                    by_status["scraped"] += 1
                    by_category[cat]["scraped"] += 1
                    by_category[cat]["records"] += rc
                    total_records += rc
            else:
                by_status["not_scraped"] += 1
        else:
            by_status["not_scraped"] += 1

    return {
        "total_sources": len(index),
        "total_scraped_files": len(scraped_ids),
        "total_records": total_records,
        "by_status": dict(by_status),
        "by_category": {k: dict(v) for k, v in sorted(by_category.items())},
    }


@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Serve the dashboard."""
    html_path = FRONTEND_DIR / "index.html"
    if html_path.exists():
        return HTMLResponse(html_path.read_text())
    return HTMLResponse("<h1>RePrime Data Platform</h1><p>Dashboard loading...</p>")


@app.get("/site", response_class=HTMLResponse)
async def site():
    """Serve the RePrime Group website."""
    html_path = FRONTEND_DIR / "site.html"
    if html_path.exists():
        return HTMLResponse(html_path.read_text())
    return HTMLResponse("<h1>Loading...</h1>")


@app.get("/terminal", response_class=HTMLResponse)
async def terminal():
    """Serve the full terminal intelligence page."""
    html_path = FRONTEND_DIR / "terminal.html"
    if html_path.exists():
        return HTMLResponse(html_path.read_text())
    return HTMLResponse("<h1>Terminal loading...</h1>")


@app.get("/api/stats")
async def stats():
    """Aggregate statistics."""
    return _build_stats()


@app.get("/api/sources")
async def list_sources(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
):
    """List all sources with filtering."""
    index = _load_source_index()
    scraped_ids = {p.stem for p in DATA_DIR.glob("*.json")} if DATA_DIR.exists() else set()

    sources = []
    for sid, meta in index.items():
        scraped = sid in scraped_ids
        entry = {**meta, "scraped": scraped}

        if category and meta.get("category", "").lower() != category.lower():
            continue
        if status == "scraped" and not scraped:
            continue
        if status == "missing" and scraped:
            continue
        if search and search.lower() not in json.dumps(meta).lower():
            continue
        sources.append(entry)

    total = len(sources)
    start = (page - 1) * limit
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "sources": sources[start : start + limit],
    }


@app.get("/api/sources/{source_id}")
async def get_source(source_id: str):
    """Get source metadata + scraped data."""
    index = _load_source_index()
    meta = index.get(source_id)
    if not meta:
        return {"error": "Source not found"}
    data = _load_scraped(source_id)
    return {
        "meta": meta,
        "scraped": data is not None,
        "record_count": data.get("record_count", 0) if data else 0,
        "scraped_at": data.get("scraped_at") if data else None,
        "records": data.get("records", [])[:100] if data else [],
    }


@app.get("/api/sources/{source_id}/records")
async def get_records(
    source_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
):
    """Paginated records for a source."""
    data = _load_scraped(source_id)
    if not data:
        return {"error": "No data for this source"}
    records = data.get("records", [])
    start = (page - 1) * limit
    return {
        "source_id": source_id,
        "total": len(records),
        "page": page,
        "records": records[start : start + limit],
    }


@app.get("/api/categories")
async def list_categories():
    """List all categories with counts."""
    index = _load_source_index()
    cats = defaultdict(int)
    for meta in index.values():
        cats[meta.get("category", "other")] += 1
    return {"categories": dict(sorted(cats.items(), key=lambda x: -x[1]))}


@app.get("/api/market")
async def market_data():
    """Full market data for terminal ticker and widgets."""
    from api.server.market_data import get_all_market_data
    return get_all_market_data()


@app.get("/api/market/ticker")
async def market_ticker():
    """Terminal ticker bar data."""
    from api.server.market_data import get_terminal_ticker
    return get_terminal_ticker()


@app.get("/api/market/sofr")
async def market_sofr():
    """SOFR rates."""
    from api.server.market_data import get_sofr
    return get_sofr()


@app.get("/api/market/cpi")
async def market_cpi():
    """CPI data."""
    from api.server.market_data import get_cpi
    return get_cpi()


@app.get("/api/market/fdic")
async def market_fdic():
    """FDIC banking data."""
    from api.server.market_data import get_fdic_banking
    return get_fdic_banking()


@app.get("/api/market/treasury")
async def market_treasury():
    """Treasury yields."""
    from api.server.market_data import get_treasury_yields
    return get_treasury_yields()


@app.get("/api/market/crypto")
async def market_crypto():
    """Crypto prices."""
    from api.server.market_data import get_crypto
    return get_crypto()


@app.get("/api/market/exchange-rates")
async def market_fx():
    """Exchange rates (Bank of Israel)."""
    from api.server.market_data import get_exchange_rates
    return get_exchange_rates()


@app.get("/api/market/fema")
async def market_fema():
    """FEMA disaster data."""
    from api.server.market_data import get_fema_disasters
    return get_fema_disasters()


@app.get("/api/deal/intelligence")
async def deal_intelligence():
    """Full deal intelligence package."""
    from api.server.deal_intel import get_deal_intelligence
    return get_deal_intelligence()


@app.get("/api/deal/comps")
async def deal_comps():
    """Comparable properties."""
    from api.server.deal_intel import get_property_comps
    return get_property_comps()


@app.get("/api/deal/permits")
async def deal_permits():
    """Building permits."""
    from api.server.deal_intel import get_building_permits
    return get_building_permits()


@app.get("/api/deal/news")
async def deal_news():
    """News sentiment."""
    from api.server.deal_intel import get_news_sentiment
    return get_news_sentiment()


@app.get("/api/deal/financing")
async def deal_financing():
    """Financing products and rates."""
    from api.server.deal_intel import get_financing_data
    return get_financing_data()


@app.get("/api/deal/environmental")
async def deal_environmental():
    """Environmental and flood risk."""
    from api.server.deal_intel import get_environmental_risk
    return get_environmental_risk()


@app.get("/api/live/ticker")
async def live_ticker():
    """Live ticker from real API keys."""
    from api.server.live_data import get_live_ticker
    return get_live_ticker()


@app.get("/api/live/market")
async def live_market():
    """Full live market data from all APIs."""
    from api.server.live_data import get_live_market
    return get_live_market()


@app.get("/api/live/reits")
async def live_reits():
    """Live REIT prices from Finnhub."""
    from api.server.live_data import get_live_reits
    return get_live_reits()


@app.get("/api/live/property")
async def live_property():
    """Property context (Walk Score, weather, market)."""
    from api.server.live_data import get_live_property_context
    return get_live_property_context()


@app.get("/api/live/refresh")
async def live_refresh():
    """Re-fetch all live data from APIs."""
    import subprocess
    subprocess.Popen(["python3", "-m", "api.fetch_live_data"], cwd="/Users/mkazi/Downloads/API")
    return {"status": "refresh started"}




@app.get("/api/property/search")
async def property_search(q: str = ""):
    """Live property search — geocodes address and fetches data from 8+ sources."""
    if not q:
        return {"error": "Provide ?q=<address> parameter"}
    from api.property.search import search_property
    return await search_property(q)




@app.on_event("startup")
async def startup_event():
    """Start the 24/7 background scheduler on app boot."""
    try:
        from api.scheduler import start_scheduler
        app.state.scheduler = start_scheduler()
        print("✓ Background scheduler started")
    except Exception as e:
        print(f"⚠ Scheduler not started: {e}")


@app.get("/api/health")
async def health():
    scraped_count = len(list(DATA_DIR.glob("*.json"))) if DATA_DIR.exists() else 0
    return {"status": "healthy", "scraped_files": scraped_count}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
