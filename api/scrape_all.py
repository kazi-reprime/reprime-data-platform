"""
RePrime Master Scraper — Scrape all 602 non-paid data sources.
Handles: REST API, RSS/Atom, ArcGIS, Socrata, Dataset portals
Skips: Paid APIs (monthly_cost > $0)
"""
import asyncio
import csv
import json
import os
import sys
import time
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from dataclasses import dataclass, field, asdict

import httpx
import feedparser
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Setup logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.dev.ConsoleRenderer(),
    ]
)
log = structlog.get_logger()

CSV_PATH = Path(__file__).parent / "data" / "sources_611.csv"
OUTPUT_DIR = Path(__file__).parent / "data" / "scraped"
REPORT_DIR = Path(__file__).parent / "data" / "reports"

# Concurrency settings
MAX_CONCURRENT = 20
REQUEST_TIMEOUT = 25
BATCH_PAUSE = 0.1  # seconds between batches


@dataclass
class SourceRecord:
    id: str
    name: str
    provider: str
    category: str
    endpoint: str
    source_type: str
    auth_type: str
    cost: float
    notes: str = ""


@dataclass 
class ScrapeResult:
    source_id: str
    source_name: str
    category: str
    status: str  # success, error, skip, timeout
    record_count: int = 0
    sample_fields: list = field(default_factory=list)
    error: str = ""
    duration_ms: int = 0
    endpoint: str = ""
    data_hash: str = ""


def load_sources() -> list[SourceRecord]:
    """Load all 602 non-paid sources from CSV."""
    sources = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if len(row) < 16:
                continue
            cost_str = row[3].replace("$", "").replace(",", "").strip()
            try:
                cost = float(cost_str) if cost_str else 0.0
            except ValueError:
                cost = 0.0
            
            if cost > 0:
                continue  # Skip paid
            
            sources.append(SourceRecord(
                id=row[15] if len(row) > 15 else "",
                name=row[2],
                provider=row[1],
                category=row[12] if len(row) > 12 else "other",
                endpoint=row[4],
                source_type=row[11] if len(row) > 11 else "",
                auth_type=row[7] if len(row) > 7 else "",
                cost=cost,
                notes=row[14] if len(row) > 14 else "",
            ))
    return sources


def detect_type(source: SourceRecord) -> str:
    """Detect connector type from source metadata."""
    st = source.source_type.lower()
    ep = source.endpoint.lower()
    notes = source.notes.lower()
    
    if "rss" in st or "atom" in st or ep.endswith("/feed/") or ep.endswith(".xml") or "rss" in ep:
        return "rss"
    if "arcgis" in ep or "featureserver" in ep or "mapserver" in ep:
        return "arcgis"
    if "socrata" in notes or ("data.cityof" in ep and ".gov" in ep):
        return "socrata"
    if "dataset" in st.lower():
        return "portal"
    return "rest"


@retry(
    stop=stop_after_attempt(2),
    wait=wait_exponential(multiplier=0.5, min=1, max=10),
    retry=retry_if_exception_type((httpx.TimeoutException, httpx.ConnectError)),
    reraise=True,
)
async def fetch_url(client: httpx.AsyncClient, url: str, params: dict | None = None) -> httpx.Response:
    """Fetch URL with retry."""
    return await client.get(url, params=params, follow_redirects=True)


async def scrape_rest(client: httpx.AsyncClient, source: SourceRecord) -> ScrapeResult:
    """Scrape a REST API endpoint."""
    start = time.monotonic()
    try:
        resp = await fetch_url(client, source.endpoint)
        data = resp.json() if "json" in resp.headers.get("content-type", "") else {"raw": resp.text[:2000]}
        
        records = []
        if isinstance(data, list):
            records = data
        elif isinstance(data, dict):
            for key in ("results", "data", "records", "features", "observations",
                        "result", "items", "rows", "entries", "series", "value"):
                if key in data and isinstance(data[key], list):
                    records = data[key]
                    break
            if not records:
                records = [data]
        
        sample_fields = list(records[0].keys())[:10] if records and isinstance(records[0], dict) else []
        h = hashlib.sha256(json.dumps(records[:3], default=str).encode()).hexdigest()[:12]
        
        # Save data
        save_data(source.id, records[:500])  # Cap at 500 per source for now
        
        return ScrapeResult(
            source_id=source.id, source_name=source.name, category=source.category,
            status="success", record_count=len(records), sample_fields=sample_fields,
            duration_ms=int((time.monotonic() - start) * 1000),
            endpoint=source.endpoint, data_hash=h,
        )
    except httpx.TimeoutException:
        return ScrapeResult(source_id=source.id, source_name=source.name, category=source.category,
                          status="timeout", error="Request timed out", endpoint=source.endpoint,
                          duration_ms=int((time.monotonic() - start) * 1000))
    except Exception as e:
        return ScrapeResult(source_id=source.id, source_name=source.name, category=source.category,
                          status="error", error=str(e)[:200], endpoint=source.endpoint,
                          duration_ms=int((time.monotonic() - start) * 1000))


async def scrape_rss(client: httpx.AsyncClient, source: SourceRecord) -> ScrapeResult:
    """Scrape an RSS/Atom feed."""
    start = time.monotonic()
    try:
        resp = await fetch_url(client, source.endpoint)
        feed = feedparser.parse(resp.text)
        records = [
            {"title": e.get("title", ""), "link": e.get("link", ""),
             "published": e.get("published", ""), "summary": e.get("summary", "")[:300]}
            for e in feed.entries
        ]
        save_data(source.id, records)
        return ScrapeResult(
            source_id=source.id, source_name=source.name, category=source.category,
            status="success", record_count=len(records),
            sample_fields=["title", "link", "published", "summary"],
            duration_ms=int((time.monotonic() - start) * 1000), endpoint=source.endpoint,
        )
    except Exception as e:
        return ScrapeResult(source_id=source.id, source_name=source.name, category=source.category,
                          status="error", error=str(e)[:200], endpoint=source.endpoint,
                          duration_ms=int((time.monotonic() - start) * 1000))


async def scrape_arcgis(client: httpx.AsyncClient, source: SourceRecord) -> ScrapeResult:
    """Query an ArcGIS Feature Server."""
    start = time.monotonic()
    try:
        base = source.endpoint.rstrip("/")
        if "/query" not in base:
            base += "/query"
        params = {"where": "1=1", "outFields": "*", "f": "json", "resultRecordCount": "100", "returnGeometry": "false"}
        resp = await fetch_url(client, base, params=params)
        data = resp.json()
        features = data.get("features", [])
        records = [{**f.get("attributes", {})} for f in features]
        save_data(source.id, records)
        sample_fields = list(records[0].keys())[:10] if records else []
        return ScrapeResult(
            source_id=source.id, source_name=source.name, category=source.category,
            status="success", record_count=len(records), sample_fields=sample_fields,
            duration_ms=int((time.monotonic() - start) * 1000), endpoint=source.endpoint,
        )
    except Exception as e:
        return ScrapeResult(source_id=source.id, source_name=source.name, category=source.category,
                          status="error", error=str(e)[:200], endpoint=source.endpoint,
                          duration_ms=int((time.monotonic() - start) * 1000))


async def scrape_portal(client: httpx.AsyncClient, source: SourceRecord) -> ScrapeResult:
    """Probe a dataset portal for available data."""
    start = time.monotonic()
    try:
        resp = await fetch_url(client, source.endpoint)
        ct = resp.headers.get("content-type", "")
        if "json" in ct:
            data = resp.json()
            records = data if isinstance(data, list) else [data]
        else:
            # HTML portal — extract metadata
            records = [{"portal_url": source.endpoint, "status_code": resp.status_code,
                       "content_type": ct, "size_bytes": len(resp.content)}]
        save_data(source.id, records[:100])
        return ScrapeResult(
            source_id=source.id, source_name=source.name, category=source.category,
            status="success", record_count=len(records),
            duration_ms=int((time.monotonic() - start) * 1000), endpoint=source.endpoint,
        )
    except Exception as e:
        return ScrapeResult(source_id=source.id, source_name=source.name, category=source.category,
                          status="error", error=str(e)[:200], endpoint=source.endpoint,
                          duration_ms=int((time.monotonic() - start) * 1000))


def save_data(source_id: str, records: list) -> None:
    """Save scraped records to JSON file."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUTPUT_DIR / f"{source_id}.json"
    with open(path, "w") as f:
        json.dump({
            "source_id": source_id,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "record_count": len(records),
            "records": records,
        }, f, default=str, indent=2)


async def scrape_one(sem: asyncio.Semaphore, client: httpx.AsyncClient, source: SourceRecord) -> ScrapeResult:
    """Scrape a single source with semaphore control."""
    async with sem:
        conn_type = detect_type(source)
        if conn_type == "rss":
            return await scrape_rss(client, source)
        elif conn_type == "arcgis":
            return await scrape_arcgis(client, source)
        elif conn_type == "portal":
            return await scrape_portal(client, source)
        else:
            return await scrape_rest(client, source)


async def main():
    sources = load_sources()
    print(f"\n{'='*60}")
    print(f"  RePrime Scraper — {len(sources)} non-paid sources")
    print(f"{'='*60}")
    
    # Classify
    types = {}
    for s in sources:
        t = detect_type(s)
        types[t] = types.get(t, 0) + 1
    for t, c in sorted(types.items(), key=lambda x: -x[1]):
        print(f"  {t:>10}: {c} sources")
    print()
    
    # Auth filter
    no_auth = [s for s in sources if "no auth" in s.auth_type.lower() or not s.auth_type.strip()]
    needs_key = [s for s in sources if "api key" in s.auth_type.lower() or "free api key" in s.auth_type.lower()]
    other_auth = [s for s in sources if s not in no_auth and s not in needs_key]
    
    print(f"  No auth (scraping now):  {len(no_auth)}")
    print(f"  Needs API key (noting): {len(needs_key)}")
    print(f"  Other/unclear auth:     {len(other_auth)}")
    print()
    
    # Scrape all that don't need auth + try others too (many "need key" endpoints still return partial data)
    to_scrape = no_auth + other_auth  # Start with no-auth + unclear
    
    sem = asyncio.Semaphore(MAX_CONCURRENT)
    results = []
    
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(REQUEST_TIMEOUT),
        limits=httpx.Limits(max_connections=MAX_CONCURRENT, max_keepalive_connections=10),
        follow_redirects=True,
    ) as client:
        # Batch 1: No-auth sources
        print(f"[Batch 1] Scraping {len(to_scrape)} no-auth sources...")
        tasks = [scrape_one(sem, client, s) for s in to_scrape]
        batch_results = await asyncio.gather(*tasks, return_exceptions=True)
        for r in batch_results:
            if isinstance(r, ScrapeResult):
                results.append(r)
            elif isinstance(r, Exception):
                results.append(ScrapeResult(source_id="?", source_name="?", category="?", status="error", error=str(r)[:200]))
        
        success_1 = sum(1 for r in results if r.status == "success")
        print(f"  Batch 1 done: {success_1}/{len(to_scrape)} succeeded")
        
        # Batch 2: Try API-key sources (many will return data without key or with partial data)
        print(f"\n[Batch 2] Probing {len(needs_key)} API-key sources...")
        tasks2 = [scrape_one(sem, client, s) for s in needs_key]
        batch2_results = await asyncio.gather(*tasks2, return_exceptions=True)
        for r in batch2_results:
            if isinstance(r, ScrapeResult):
                results.append(r)
            elif isinstance(r, Exception):
                results.append(ScrapeResult(source_id="?", source_name="?", category="?", status="error", error=str(r)[:200]))
        
        success_2 = sum(1 for r in results if r.status == "success") - success_1
        print(f"  Batch 2 done: {success_2}/{len(needs_key)} succeeded")
    
    # Generate report
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    
    success = [r for r in results if r.status == "success"]
    errors = [r for r in results if r.status == "error"]
    timeouts = [r for r in results if r.status == "timeout"]
    
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_sources": len(sources),
        "total_scraped": len(results),
        "success": len(success),
        "errors": len(errors),
        "timeouts": len(timeouts),
        "total_records": sum(r.record_count for r in success),
        "by_category": {},
        "results": [asdict(r) for r in results],
    }
    
    for r in results:
        cat = r.category or "other"
        if cat not in report["by_category"]:
            report["by_category"][cat] = {"success": 0, "error": 0, "timeout": 0, "records": 0}
        report["by_category"][cat][r.status] = report["by_category"][cat].get(r.status, 0) + 1
        report["by_category"][cat]["records"] += r.record_count
    
    report_path = REPORT_DIR / f"scrape_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_path, "w") as f:
        json.dump(report, f, default=str, indent=2)
    
    # Print summary
    print(f"\n{'='*60}")
    print(f"  SCRAPE COMPLETE")
    print(f"{'='*60}")
    print(f"  Total attempted:  {len(results)}")
    print(f"  Succeeded:        {len(success)}")
    print(f"  Errors:           {len(errors)}")
    print(f"  Timeouts:         {len(timeouts)}")
    print(f"  Total records:    {sum(r.record_count for r in success):,}")
    print(f"  Report saved:     {report_path}")
    print(f"  Data dir:         {OUTPUT_DIR}")
    print()
    
    # Top categories
    print("  By category:")
    for cat, stats in sorted(report["by_category"].items(), key=lambda x: -x[1]["records"]):
        print(f"    {cat:>25}: {stats['success']} ok, {stats.get('error',0)} err, {stats['records']:,} records")
    
    # Top errors
    if errors:
        print(f"\n  Top error patterns:")
        err_types = {}
        for e in errors:
            key = e.error.split(":")[0][:50] if e.error else "unknown"
            err_types[key] = err_types.get(key, 0) + 1
        for err, count in sorted(err_types.items(), key=lambda x: -x[1])[:10]:
            print(f"    {count:>4}x  {err}")
    
    print(f"\n  Data files: {len(list(OUTPUT_DIR.glob('*.json')))} JSON files saved")
    print()


if __name__ == "__main__":
    asyncio.run(main())
