# RePrime Data Platform — Agent Instructions

## Project Context
611 real estate data sources aggregated into a unified Python platform.
Target: RePrime Terminal (mishorim.vercel.app, reprimeterminal.com)

## Agent Rules
1. Always check brain/PROJECT_BRAIN.md for context before coding
2. Use code-review-graph tools before Grep/Glob/Read
3. Each new connector needs: YAML config + connector code + unit test
4. Follow the BaseConnector interface — never make raw HTTP calls outside connectors
5. All data must pass through the normalization pipeline
6. Israeli sources are CRITICAL priority — handle shekel/ILS formatting carefully
7. Rate limit every connector — respect source update frequencies
8. Log every scrape run with source ID, timestamp, record count, status

## Source Config Format (scrapers/configs/*.yaml)
```yaml
id: REPR-0156
name: FRED API
provider: Federal Reserve Bank of St. Louis
category: economic
connector_type: rest_api
auth_type: api_key  # or: none, oauth2, session
endpoint: https://api.stlouisfed.org/fred/series/observations
params:
  series_id: MORTGAGE30US
  api_key: ${FRED_API_KEY}
  file_type: json
schedule: daily
priority: critical
```

## Testing Requirements
- Every connector: test with mocked HTTP responses
- Integration tests: hit real endpoints (rate-limited)
- Minimum 80% coverage per module
