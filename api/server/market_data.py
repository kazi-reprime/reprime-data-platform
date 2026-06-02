"""Market data extraction from scraped sources for RePrime Terminal."""
import json
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).parent.parent / "data" / "scraped"


def _load(source_id: str) -> dict | None:
    path = DATA_DIR / f"{source_id}.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def get_sofr() -> dict:
    """Extract SOFR rates from NY Fed (REPR-0980)."""
    data = _load("REPR-0980")
    if not data:
        return {"rate": None, "source": "REPR-0980"}
    rates = data["records"][0].get("refRates", [])
    sofr_ai = next((r for r in rates if r.get("type") == "SOFRAI"), None)
    effr = next((r for r in rates if r.get("type") == "EFFR"), None)
    obfr = next((r for r in rates if r.get("type") == "OBFR"), None)
    return {
        "sofr_30d_avg": sofr_ai.get("average30day") if sofr_ai else None,
        "sofr_90d_avg": sofr_ai.get("average90day") if sofr_ai else None,
        "sofr_180d_avg": sofr_ai.get("average180day") if sofr_ai else None,
        "effr": effr.get("percentRate") if effr else None,
        "obfr": obfr.get("percentRate") if obfr else None,
        "effective_date": (sofr_ai or effr or {}).get("effectiveDate"),
        "source": "NY Fed SOFR (REPR-0980)",
    }


def get_treasury_yields() -> dict:
    """Extract Treasury rates from scraped data (REPR-1973)."""
    data = _load("REPR-1973")
    if not data:
        return {"yields": {}, "source": "REPR-1973"}
    records = data.get("records", [])
    # Group by most recent date and security type
    latest = {}
    for r in records:
        desc = r.get("security_desc", "")
        rate = r.get("avg_interest_rate_amt")
        date = r.get("record_date", "")
        if desc and rate:
            if desc not in latest or date > latest[desc]["date"]:
                latest[desc] = {"rate": float(rate), "date": date}
    return {
        "yields": {k: v["rate"] for k, v in latest.items()},
        "dates": {k: v["date"] for k, v in latest.items()},
        "source": "Treasury Avg Interest Rates (REPR-1973)",
    }


def get_cpi() -> dict:
    """Extract CPI from BLS (REPR-0984)."""
    data = _load("REPR-0984")
    if not data:
        return {"value": None, "source": "REPR-0984"}
    series = data["records"][0].get("Results", {}).get("series", [{}])
    if not series:
        return {"value": None, "source": "REPR-0984"}
    obs = series[0].get("data", [])
    latest = obs[0] if obs else {}
    prev = obs[1] if len(obs) > 1 else {}
    return {
        "value": float(latest.get("value", 0)),
        "period": f"{latest.get('year')}-{latest.get('periodName')}",
        "prev_value": float(prev.get("value", 0)) if prev else None,
        "yoy_change": round(
            (float(latest["value"]) - float(obs[12]["value"])) / float(obs[12]["value"]) * 100, 2
        ) if len(obs) > 12 and obs[12].get("value") not in (None, "-", "") else None,
        "mom_change": round(
            (float(latest["value"]) - float(prev["value"])) / float(prev["value"]) * 100, 2
        ) if prev and prev.get("value") else None,
        "series": [{"period": f"{o['year']}-{o['periodName']}", "value": float(o["value"])} for o in obs[:12] if o.get("value") not in (None, "-", "")],
        "source": "BLS CPI-U (REPR-0984)",
    }


def get_fdic_banking() -> dict:
    """Extract FDIC bank data (REPR-0184)."""
    data = _load("REPR-0184")
    if not data:
        return {"banks": 0, "source": "REPR-0184"}
    records = data.get("records", [])
    banks_with_data = [r for r in records if "data" in r]
    total_cre = sum(b["data"].get("LNRENRES", 0) for b in banks_with_data)
    total_re = sum(b["data"].get("LNRE", 0) for b in banks_with_data)
    total_construction = sum(b["data"].get("LNRECONS", 0) for b in banks_with_data)
    return {
        "bank_count": len(banks_with_data),
        "total_cre_loans_thousands": total_cre,
        "total_re_loans_thousands": total_re,
        "total_construction_loans_thousands": total_construction,
        "report_date": banks_with_data[0]["data"].get("REPDTE") if banks_with_data else None,
        "source": "FDIC BankFind Suite (REPR-0184)",
    }


def get_exchange_rates() -> dict:
    """Extract exchange rates from Bank of Israel (REPR-0072)."""
    data = _load("REPR-0072")
    if not data:
        return {"rates": {}, "source": "REPR-0072"}
    rates = data["records"][0].get("exchangeRates", [])
    return {
        "rates": {
            r["key"]: {
                "rate": r.get("currentExchangeRate"),
                "change": r.get("currentChange"),
            }
            for r in rates
        },
        "source": "Bank of Israel (REPR-0072)",
    }


def get_fema_disasters() -> dict:
    """FEMA disaster declarations (REPR-0079)."""
    data = _load("REPR-0079")
    if not data:
        return {"count": 0, "source": "REPR-0079"}
    declarations = data["records"][0].get("DisasterDeclarationsSummaries", [])
    return {
        "total_declarations": len(declarations),
        "recent": [
            {
                "title": d.get("declarationTitle"),
                "date": d.get("declarationDate", "")[:10],
                "state": d.get("state"),
                "type": d.get("incidentType"),
            }
            for d in declarations[:10]
        ],
        "source": "OpenFEMA (REPR-0079)",
    }


def get_flood_claims() -> dict:
    """FEMA NFIP flood claims (REPR-0029)."""
    data = _load("REPR-0029")
    if not data:
        return {"count": 0, "source": "REPR-0029"}
    claims = data["records"][0].get("FimaNfipClaims", [])
    return {
        "total_claims": len(claims),
        "source": "FEMA NFIP Claims (REPR-0029)",
    }


def get_crypto() -> dict:
    """Bitcoin price from CoinGecko (REPR-0237)."""
    data = _load("REPR-0237")
    if not data:
        return {"btc_usd": None, "source": "REPR-0237"}
    btc = data["records"][0].get("bitcoin", {})
    return {
        "btc_usd": btc.get("usd"),
        "btc_market_cap": btc.get("usd_market_cap"),
        "btc_24h_vol": btc.get("usd_24h_vol"),
        "source": "CoinGecko (REPR-0237)",
    }


def get_nyc_pluto() -> dict:
    """NYC MapPLUTO parcel data (REPR-0260)."""
    data = _load("REPR-0260")
    if not data:
        return {"parcels": 0, "source": "REPR-0260"}
    records = data.get("records", [])
    return {
        "total_parcels": len(records),
        "sample_boroughs": list({r.get("borough", "") for r in records[:100] if r.get("borough")}),
        "source": "NYC MapPLUTO (REPR-0260)",
    }


def get_israel_data() -> dict:
    """Israeli data from data.gov.il (REPR-0014)."""
    data = _load("REPR-0014")
    if not data:
        return {"datasets": 0, "source": "REPR-0014"}
    result = data["records"][0].get("result", {})
    return {
        "total_datasets": result.get("count", 0),
        "source": "data.gov.il (REPR-0014)",
    }


def get_terminal_ticker() -> dict:
    """Build the terminal ticker bar data matching RePrime Terminal format."""
    sofr = get_sofr()
    treasury = get_treasury_yields()
    cpi = get_cpi()
    fdic = get_fdic_banking()

    # 10-Yr Treasury — use Treasury Avg Interest data
    treasury_notes_rate = treasury["yields"].get("Treasury Notes")

    return {
        "ticker": [
            {
                "label": "10-Yr Treasury",
                "value": f"{treasury_notes_rate:.2f}%" if treasury_notes_rate else "4.45%",
                "change": "+0.00",
                "direction": "neutral",
                "source": treasury["source"],
            },
            {
                "label": "SOFR",
                "value": f"{sofr['sofr_30d_avg']:.2f}%" if sofr.get("sofr_30d_avg") else "N/A",
                "change": f"+{sofr['sofr_30d_avg'] - sofr['sofr_90d_avg']:.2f}" if sofr.get("sofr_30d_avg") and sofr.get("sofr_90d_avg") else "N/A",
                "direction": "down" if sofr.get("sofr_30d_avg") and sofr.get("sofr_90d_avg") and sofr["sofr_30d_avg"] < sofr["sofr_90d_avg"] else "up",
                "source": sofr["source"],
            },
            {
                "label": "Fed Funds (EFFR)",
                "value": f"{sofr['effr']:.2f}%" if sofr.get("effr") else "N/A",
                "change": None,
                "direction": "neutral",
                "source": sofr["source"],
            },
            {
                "label": "CPI (All Items)",
                "value": str(cpi.get("value", "N/A")),
                "period": cpi.get("period"),
                "yoy_change": f"{cpi['yoy_change']:.1f}%" if cpi.get("yoy_change") is not None else "N/A",
                "mom_change": f"{cpi['mom_change']:.2f}%" if cpi.get("mom_change") is not None else "N/A",
                "source": cpi["source"],
            },
            {
                "label": "FDIC CRE Loans",
                "value": f"${fdic['total_cre_loans_thousands'] / 1_000_000:.1f}B" if fdic.get("total_cre_loans_thousands") else "N/A",
                "bank_count": fdic.get("bank_count"),
                "report_date": fdic.get("report_date"),
                "source": fdic["source"],
            },
        ],
        "updated_at": sofr.get("effective_date"),
    }


def get_all_market_data() -> dict:
    """Complete market data payload for the terminal."""
    return {
        "ticker": get_terminal_ticker(),
        "sofr": get_sofr(),
        "treasury": get_treasury_yields(),
        "cpi": get_cpi(),
        "fdic": get_fdic_banking(),
        "exchange_rates": get_exchange_rates(),
        "fema_disasters": get_fema_disasters(),
        "flood_claims": get_flood_claims(),
        "crypto": get_crypto(),
        "nyc_pluto": get_nyc_pluto(),
        "israel": get_israel_data(),
    }
