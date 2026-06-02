# RePrime Data Platform

## What This Project Is
A Python-based data aggregation platform connecting 611 real estate data sources to the RePrime Terminal.

## Project Structure
```
api/
  brain/              # Project knowledge
  scrapers/connectors/  # Base + specialized connectors
  scrapers/configs/     # Per-source YAML configs
  pipeline/             # Ingestion, normalization, enrichment
  storage/schemas/      # SQLAlchemy models
  server/routes/        # FastAPI endpoints
  frontend/             # Next.js dashboard
  data/sources_611.csv  # Master source list
  config/               # Environment configs
  tests/                # Unit + integration + e2e
```

## Key Commands
```bash
python -m api.scrapers.run --source REPR-0156   # Single source
python -m api.scrapers.run --category housing_re # By category
python -m api.server                             # FastAPI server
python -m pytest tests/                          # Tests
```

## Conventions
- Each source: YAML config in scrapers/configs/{REPR_ID}.yaml
- All connectors inherit BaseConnector
- Async/await for all I/O
- Never hardcode API keys (use env vars)
- Tests required (80%+ coverage)
- Immutable data patterns throughout

## Current Phase: Foundation + Top 20 APIs
