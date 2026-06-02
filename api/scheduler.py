"""24/7 background scheduler for refreshing market data.

Runs APScheduler that periodically:
- Fetches live market data from all 13 APIs (hourly)
- Refreshes scraped sources (daily)
- Cleans old cache (daily)
"""
import asyncio
import logging
from datetime import datetime
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger("scheduler")


async def refresh_market_data():
    """Hourly: refresh live market data from all 13 APIs."""
    log.info("🔄 Refreshing live market data...")
    try:
        from api.fetch_live_data import fetch_all
        await fetch_all()
        log.info("✓ Live data refreshed")
    except Exception as e:
        log.error(f"✗ Market refresh failed: {e}")


async def refresh_scraped_sources():
    """Daily: re-scrape all 611 sources."""
    log.info("🔄 Refreshing 611 scraped sources (this takes ~15min)...")
    try:
        import subprocess
        subprocess.Popen(["python3", "-m", "api.scrape_all"], cwd=str(Path(__file__).parent.parent))
        log.info("✓ Scrape job started in background")
    except Exception as e:
        log.error(f"✗ Scrape failed: {e}")


async def log_status():
    """Every 5 min: log heartbeat."""
    log.info(f"💓 Scheduler alive · {datetime.utcnow().isoformat()}")


def start_scheduler():
    """Start all background jobs."""
    scheduler = AsyncIOScheduler()
    # Refresh live data every hour
    scheduler.add_job(refresh_market_data, IntervalTrigger(hours=1), id="live_data", replace_existing=True, misfire_grace_time=300)
    # Re-scrape all sources daily at 3 AM UTC
    scheduler.add_job(refresh_scraped_sources, CronTrigger(hour=3, minute=0), id="full_scrape", replace_existing=True)
    # Heartbeat every 5 min
    scheduler.add_job(log_status, IntervalTrigger(minutes=5), id="heartbeat", replace_existing=True)
    scheduler.start()
    log.info("🚀 Scheduler started — hourly market refresh, daily full scrape")
    return scheduler


if __name__ == "__main__":
    async def main():
        sched = start_scheduler()
        # Initial run
        await refresh_market_data()
        # Keep alive
        try:
            while True:
                await asyncio.sleep(60)
        except (KeyboardInterrupt, SystemExit):
            sched.shutdown()

    asyncio.run(main())
