"""Backend contract tests for the consolidated search engine (api/search.py).

Run:  pytest tests/test_search.py -v
Markers:
  unit         — no network, fast (validation, helpers)
  integration  — hits live free APIs (geocode + fan-out)
"""
import importlib.util
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _load():
    spec = importlib.util.spec_from_file_location("rp_search", os.path.join(ROOT, "api", "search.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


search = _load()


# --- unit: input validation (no network) ----------------------------------- #
@pytest.mark.unit
@pytest.mark.parametrize("addr", ["", "  ", "abc"])
def test_short_address_returns_400(addr):
    r = search.run_search(addr)
    assert r["_http_status"] == 400
    assert "error" in r


@pytest.mark.unit
def test_overlong_address_returns_400():
    r = search.run_search("x" * 501)
    assert r["_http_status"] == 400


@pytest.mark.unit
def test_state_abbr_helper():
    assert search._state_to_abbr("Florida") == "FL"
    assert search._state_to_abbr("CA") == "CA"
    assert search._state_to_abbr("") == ""


@pytest.mark.unit
def test_registry_has_expected_layers():
    # the engine should expose its free-source fan-out + derived sources
    assert len(search.SOURCES) >= 15
    assert "fred_rates" in search.SOURCES
    assert "fema_flood" in search.SOURCES
    assert "valuation" in search.DERIVED


# --- integration: live fan-out (network) ----------------------------------- #
@pytest.mark.integration
def test_white_house_returns_real_sources():
    r = search.run_search("1600 Pennsylvania Ave NW, Washington, DC 20500")
    assert r["_http_status"] == 200
    m = r["query_metadata"]
    # White House coordinates (Census geocoder)
    assert 38.85 < m["lat"] < 38.95
    assert -77.10 < m["lon"] < -77.00
    # at least 8 real sources should succeed (FEMA/EPA may be blocked in CI)
    assert m["total_sources_succeeded"] >= 8
    assert any(s["source"] == "fred_rates" and s["status"] == "ok" for s in r["sources_summary"])


@pytest.mark.integration
def test_ungeocodable_returns_400():
    r = search.run_search("zzzzz nonexistent fake road qqqq")
    assert r["_http_status"] == 400


@pytest.mark.integration
def test_valuation_requires_user_value():
    r = search.run_search("350 5th Ave, New York, NY 10118")
    val = r["sources"].get("valuation", {})
    # with no ?value provided, valuation must NOT fabricate a number
    assert val.get("status") == "needs_input"

    r2 = search.run_search("350 5th Ave, New York, NY 10118", user_value=10_000_000)
    val2 = r2["sources"].get("valuation", {})
    assert val2.get("status") == "ok"
    assert val2["input_usd"] == 10_000_000
    assert "ILS" in val2["converted"]


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-v"]))
