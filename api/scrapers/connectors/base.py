"""Base connector for all 611 data sources."""

from __future__ import annotations

import abc
import hashlib
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

logger = structlog.get_logger()


class AuthType(str, Enum):
    NONE = "none"
    API_KEY = "api_key"
    OAUTH2 = "oauth2"
    SESSION = "session"


class ConnectorType(str, Enum):
    REST_API = "rest_api"
    SOCRATA = "socrata"
    ARCGIS = "arcgis"
    RSS = "rss"
    SDMX = "sdmx"
    BULK_DOWNLOAD = "bulk_download"
    HTML_SCRAPER = "html_scraper"


class SourceCategory(str, Enum):
    CAPITAL_MARKETS = "capital_markets"
    ZONING_PARCEL = "zoning_parcel"
    HOUSING_RE = "housing_re"
    ISRAELI = "israeli"
    HAZARD_ENVIRONMENTAL = "hazard_environmental"
    MACRO_INDICATOR = "macro_indicator"
    INFRASTRUCTURE = "infrastructure"
    DEMOGRAPHIC = "demographic"
    ECONOMIC = "economic"
    CONSTRUCTION_PIPELINE = "construction_pipeline"
    NEWS_SENTIMENT = "news_sentiment"
    ENERGY = "energy"
    INSURANCE_CLIMATE = "insurance_climate"
    OTHER = "other"


@dataclass(frozen=True)
class SourceConfig:
    """Immutable configuration for a single data source."""

    id: str
    name: str
    provider: str
    category: SourceCategory
    connector_type: ConnectorType
    auth_type: AuthType
    endpoint: str
    params: dict[str, Any] = field(default_factory=dict)
    headers: dict[str, str] = field(default_factory=dict)
    schedule: str = "daily"
    priority: str = "medium"
    rate_limit_per_minute: int = 60
    timeout_seconds: int = 30
    monthly_cost_usd: float = 0.0
    notes: str = ""


@dataclass(frozen=True)
class ScrapedRecord:
    """Immutable record from a scrape run."""

    source_id: str
    category: str
    timestamp: datetime
    data: dict[str, Any]
    raw_hash: str
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class ScrapeResult:
    """Immutable result of a connector run."""

    source_id: str
    source_name: str
    started_at: datetime
    completed_at: datetime
    status: str  # "success" | "partial" | "error"
    record_count: int
    records: tuple[ScrapedRecord, ...]
    error_message: str = ""


class BaseConnector(abc.ABC):
    """Abstract base for all data source connectors.

    Subclasses implement `fetch_data()` and optionally `parse_response()`.
    The base handles HTTP, retries, rate limiting, and result packaging.
    """

    def __init__(self, config: SourceConfig) -> None:
        self._config = config
        self._client: httpx.AsyncClient | None = None
        self._last_request_time: float = 0.0
        self._request_count: int = 0

    @property
    def config(self) -> SourceConfig:
        return self._config

    @property
    def source_id(self) -> str:
        return self._config.id

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(self._config.timeout_seconds),
                follow_redirects=True,
                http2=True,
            )
        return self._client

    async def _rate_limit(self) -> None:
        """Enforce per-source rate limiting."""
        if self._config.rate_limit_per_minute <= 0:
            return
        min_interval = 60.0 / self._config.rate_limit_per_minute
        elapsed = time.monotonic() - self._last_request_time
        if elapsed < min_interval:
            import asyncio
            await asyncio.sleep(min_interval - elapsed)
        self._last_request_time = time.monotonic()
        self._request_count += 1

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        reraise=True,
    )
    async def _make_request(
        self,
        url: str,
        method: str = "GET",
        params: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
        json_body: dict[str, Any] | None = None,
    ) -> httpx.Response:
        """Make an HTTP request with retry and rate limiting."""
        await self._rate_limit()
        client = await self._get_client()

        merged_headers = {**self._config.headers, **(headers or {})}
        merged_params = {**self._config.params, **(params or {})}

        log = logger.bind(
            source_id=self.source_id,
            url=url,
            method=method,
        )
        log.info("connector.request")

        response = await client.request(
            method=method,
            url=url,
            params=merged_params,
            headers=merged_headers,
            json=json_body,
        )
        response.raise_for_status()
        return response

    @staticmethod
    def _hash_data(data: Any) -> str:
        """Create a content hash for deduplication."""
        import json
        content = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    def _make_record(self, data: dict[str, Any], **metadata: Any) -> ScrapedRecord:
        """Create an immutable scraped record."""
        return ScrapedRecord(
            source_id=self.source_id,
            category=self._config.category.value,
            timestamp=datetime.now(timezone.utc),
            data=data,
            raw_hash=self._hash_data(data),
            metadata=metadata,
        )

    @abc.abstractmethod
    async def fetch_data(self) -> list[dict[str, Any]]:
        """Fetch raw data from the source. Subclasses must implement."""
        ...

    def parse_response(self, raw_data: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Optional: transform raw data before record creation. Default passthrough."""
        return raw_data

    async def run(self) -> ScrapeResult:
        """Execute the full scrape cycle: fetch -> parse -> package."""
        started = datetime.now(timezone.utc)
        log = logger.bind(source_id=self.source_id, source_name=self._config.name)

        try:
            log.info("connector.start")
            raw_data = await self.fetch_data()
            parsed = self.parse_response(raw_data)

            records = tuple(self._make_record(item) for item in parsed)

            result = ScrapeResult(
                source_id=self.source_id,
                source_name=self._config.name,
                started_at=started,
                completed_at=datetime.now(timezone.utc),
                status="success",
                record_count=len(records),
                records=records,
            )
            log.info("connector.success", record_count=len(records))
            return result

        except Exception as exc:
            log.error("connector.error", error=str(exc))
            return ScrapeResult(
                source_id=self.source_id,
                source_name=self._config.name,
                started_at=started,
                completed_at=datetime.now(timezone.utc),
                status="error",
                record_count=0,
                records=(),
                error_message=str(exc),
            )

    async def close(self) -> None:
        """Close the HTTP client."""
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None
