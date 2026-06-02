"""Load source configurations from CSV and YAML files."""

from __future__ import annotations

import csv
import os
from pathlib import Path
from typing import Any

import yaml

from .connectors.base import AuthType, ConnectorType, SourceCategory, SourceConfig

CONFIGS_DIR = Path(__file__).parent / "configs"
CSV_PATH = Path(__file__).parent.parent / "data" / "sources_611.csv"


def _resolve_env_vars(params: dict[str, Any]) -> dict[str, Any]:
    """Replace ${VAR} placeholders with environment variable values."""
    resolved = {}
    for key, value in params.items():
        if isinstance(value, str) and value.startswith("${") and value.endswith("}"):
            env_key = value[2:-1]
            resolved[key] = os.environ.get(env_key, "")
        else:
            resolved[key] = value
    return resolved


def load_yaml_config(yaml_path: Path) -> SourceConfig:
    """Load a single source config from a YAML file."""
    with open(yaml_path) as f:
        data = yaml.safe_load(f)

    return SourceConfig(
        id=data["id"],
        name=data["name"],
        provider=data.get("provider", ""),
        category=SourceCategory(data.get("category", "other")),
        connector_type=ConnectorType(data.get("connector_type", "rest_api")),
        auth_type=AuthType(data.get("auth_type", "none")),
        endpoint=data["endpoint"],
        params=_resolve_env_vars(data.get("params", {})),
        headers=data.get("headers", {}),
        schedule=data.get("schedule", "daily"),
        priority=data.get("priority", "medium"),
        rate_limit_per_minute=data.get("rate_limit_per_minute", 60),
        timeout_seconds=data.get("timeout_seconds", 30),
        monthly_cost_usd=data.get("monthly_cost_usd", 0.0),
        notes=data.get("notes", ""),
    )


def load_all_yaml_configs() -> list[SourceConfig]:
    """Load all YAML configs from the configs directory."""
    configs = []
    if CONFIGS_DIR.exists():
        for path in sorted(CONFIGS_DIR.glob("*.yaml")):
            configs.append(load_yaml_config(path))
    return configs


def _detect_connector_type(row: dict[str, str]) -> str:
    """Infer connector type from CSV row."""
    source_type = row.get("Source Type", "").lower()
    endpoint = row.get("Endpoint URL", "").lower()

    if "rss" in source_type or "atom" in source_type:
        return "rss"
    if "dataset" in source_type:
        return "bulk_download"
    if "arcgis" in endpoint or "featureserver" in endpoint or "mapserver" in endpoint:
        return "arcgis"
    if "socrata" in row.get("Notes", "").lower() or "data.cityof" in endpoint:
        return "socrata"
    if "sdmx" in endpoint:
        return "sdmx"
    return "rest_api"


def _detect_auth_type(row: dict[str, str]) -> str:
    """Infer auth type from CSV row."""
    auth = row.get("Auth Required", "")
    if "no auth" in auth.lower():
        return "none"
    if "api key" in auth.lower() or "free api key" in auth.lower():
        return "api_key"
    return "none"


def load_csv_sources() -> list[SourceConfig]:
    """Load all 611 sources from the master CSV."""
    configs = []
    if not CSV_PATH.exists():
        return configs

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            source_id = row.get("ID", "")
            if not source_id:
                continue

            category_raw = row.get("Category", "other").lower().strip()
            try:
                category = SourceCategory(category_raw)
            except ValueError:
                category = SourceCategory.OTHER

            configs.append(SourceConfig(
                id=source_id,
                name=row.get("Source Name", ""),
                provider=row.get("Provider", ""),
                category=category,
                connector_type=ConnectorType(_detect_connector_type(row)),
                auth_type=AuthType(_detect_auth_type(row)),
                endpoint=row.get("Endpoint URL", ""),
                schedule=row.get("Update Frequency", "daily").lower() or "daily",
                priority="critical" if category_raw in ("housing_re", "israeli", "capital_markets", "zoning_parcel") else "medium",
                monthly_cost_usd=float(row.get("Monthly Cost (USD)", "0").replace("$", "").replace(",", "") or 0),
                notes=row.get("Notes", ""),
            ))
    return configs
