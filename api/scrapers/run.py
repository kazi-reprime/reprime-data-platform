"""Run scrapers for one or more data sources."""
from __future__ import annotations
import asyncio
import argparse
import structlog
from .config_loader import load_all_yaml_configs, load_csv_sources
from .connectors.base import ConnectorType, ScrapeResult
from .connectors.rest_api import RestApiConnector
from .connectors.rss import RssConnector
from .connectors.socrata import SocrataConnector
from .connectors.arcgis import ArcGisConnector

logger = structlog.get_logger()

CONNECTOR_MAP = {
    ConnectorType.REST_API: RestApiConnector,
    ConnectorType.RSS: RssConnector,
    ConnectorType.SOCRATA: SocrataConnector,
    ConnectorType.ARCGIS: ArcGisConnector,
}

async def run_source(source_id: str) -> ScrapeResult | None:
    all_configs = load_all_yaml_configs() or load_csv_sources()
    config = next((c for c in all_configs if c.id == source_id), None)
    if not config:
        logger.error("source.not_found", source_id=source_id)
        return None
    connector_cls = CONNECTOR_MAP.get(config.connector_type)
    if not connector_cls:
        logger.error("connector.unsupported", type=config.connector_type)
        return None
    connector = connector_cls(config)
    try:
        return await connector.run()
    finally:
        await connector.close()

async def run_category(category: str) -> list[ScrapeResult]:
    configs = load_csv_sources()
    matching = [c for c in configs if c.category.value == category]
    logger.info("category.run", category=category, count=len(matching))
    results = []
    for config in matching:
        connector_cls = CONNECTOR_MAP.get(config.connector_type)
        if not connector_cls:
            continue
        connector = connector_cls(config)
        try:
            results.append(await connector.run())
        finally:
            await connector.close()
    return results

async def run_all(max_concurrent: int = 10) -> list[ScrapeResult]:
    configs = load_csv_sources()
    semaphore = asyncio.Semaphore(max_concurrent)
    async def _run_one(config):
        async with semaphore:
            cls = CONNECTOR_MAP.get(config.connector_type)
            if not cls:
                return None
            conn = cls(config)
            try:
                return await conn.run()
            finally:
                await conn.close()
    tasks = [_run_one(c) for c in configs]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if isinstance(r, ScrapeResult)]

def main():
    parser = argparse.ArgumentParser(description="RePrime Data Scraper")
    parser.add_argument("--source", help="Run single source by ID (e.g. REPR-0156)")
    parser.add_argument("--category", help="Run all sources in category")
    parser.add_argument("--all", action="store_true", help="Run all 611 sources")
    parser.add_argument("--concurrent", type=int, default=10)
    args = parser.parse_args()
    if args.source:
        result = asyncio.run(run_source(args.source))
        if result:
            print(f"{result.source_name}: {result.status} ({result.record_count} records)")
    elif args.category:
        results = asyncio.run(run_category(args.category))
        ok = sum(1 for r in results if r.status == "success")
        print(f"{args.category}: {ok}/{len(results)} succeeded")
    elif args.all:
        results = asyncio.run(run_all(args.concurrent))
        ok = sum(1 for r in results if r.status == "success")
        print(f"All sources: {ok}/{len(results)} succeeded")

if __name__ == "__main__":
    main()
