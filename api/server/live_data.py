"""Serve live API data for the terminal."""
import json
from pathlib import Path

LIVE_PATH = Path(__file__).parent.parent / "data" / "live" / "live_market_data.json"


def _load_live() -> dict:
    if not LIVE_PATH.exists():
        return {}
    with open(LIVE_PATH) as f:
        return json.load(f)


def get_live_ticker() -> dict:
    """Build terminal ticker from real API data."""
    d = _load_live()
    fred = d.get("fred", {})
    nyfed = d.get("nyfed_sofr", {})
    crypto = d.get("crypto", {})

    sofr_rates = nyfed.get("refRates", [])
    sofr_ai = next((r for r in sofr_rates if r.get("type") == "SOFRAI"), None)

    treasury_10y = fred.get("10Y_Treasury_Yield", {})
    mortgage_30y = fred.get("30Y_Fixed_Mortgage_Rate", {})
    cre_delinq = fred.get("CRE_Delinquency_Rate", {})
    rental_vacancy = fred.get("Rental_Vacancy_Rate", {})
    unemployment = fred.get("Unemployment_Rate", {})

    def _delta(item):
        try:
            curr = float(item.get("value", 0))
            prev = float(item.get("prev_value", 0))
            return round(curr - prev, 2)
        except (ValueError, TypeError):
            return 0

    ticker_items = [
        {"label": "10-Yr Treasury", "value": f'{treasury_10y.get("value", "—")}%', "change": f'{_delta(treasury_10y):+.2f}', "direction": "up" if _delta(treasury_10y) > 0 else "down" if _delta(treasury_10y) < 0 else "neutral", "source": f'FRED ({treasury_10y.get("date", "")})'},
        {"label": "SOFR", "value": f'{sofr_ai.get("average30day", "—") if sofr_ai else "—"}%', "change": f'{sofr_ai.get("average30day", 0) - sofr_ai.get("average90day", 0):+.2f}' if sofr_ai else "—", "direction": "down" if sofr_ai and sofr_ai.get("average30day", 0) < sofr_ai.get("average90day", 0) else "up", "source": "NY Fed"},
        {"label": "30Y Mortgage", "value": f'{mortgage_30y.get("value", "—")}%', "change": f'{_delta(mortgage_30y):+.2f}', "direction": "up" if _delta(mortgage_30y) > 0 else "down" if _delta(mortgage_30y) < 0 else "neutral", "source": f'FRED ({mortgage_30y.get("date", "")})'},
        {"label": "Fed Funds", "value": f'{fred.get("Fed_Funds_Rate", {}).get("value", "—")}%', "change": "0.00", "direction": "neutral", "source": "FRED"},
        {"label": "CRE Delinquency", "value": f'{cre_delinq.get("value", "—")}%', "change": f'{_delta(cre_delinq):+.2f}', "direction": "up" if _delta(cre_delinq) > 0 else "down", "source": "FRED"},
        {"label": "Rental Vacancy", "value": f'{rental_vacancy.get("value", "—")}%', "change": f'{_delta(rental_vacancy):+.1f}', "direction": "up" if _delta(rental_vacancy) > 0 else "down", "source": "FRED/Census"},
        {"label": "Unemployment", "value": f'{unemployment.get("value", "—")}%', "change": f'{_delta(unemployment):+.1f}', "direction": "up" if _delta(unemployment) > 0 else "down", "source": "FRED/BLS"},
        {"label": "Bitcoin", "value": f'${int(float(crypto.get("bitcoin", {}).get("usd", 0))):,}', "change": f'{crypto.get("bitcoin", {}).get("usd_24h_change", 0):.1f}%', "direction": "down" if crypto.get("bitcoin", {}).get("usd_24h_change", 0) < 0 else "up", "source": "CoinGecko"},
    ]
    return {"ticker": ticker_items, "updated_at": d.get("fetched_at", "")}


def get_live_market() -> dict:
    """Full live market data."""
    d = _load_live()
    fred = d.get("fred", {})
    nyfed = d.get("nyfed_sofr", {})

    return {
        "fred": fred,
        "reits": d.get("reits", {}),
        "crypto": d.get("crypto", {}),
        "weather": d.get("weather", {}),
        "walkscore": d.get("walkscore", {}),
        "energy": d.get("eia_gas", []),
        "indices": d.get("indices", {}),
        "nyfed": nyfed,
        "treasury": d.get("treasury_yields", []),
        "bls": d.get("bls", {}),
        "fetched_at": d.get("fetched_at", ""),
    }


def get_live_reits() -> dict:
    """REIT stock prices."""
    d = _load_live()
    return {"reits": d.get("reits", {}), "fetched_at": d.get("fetched_at", "")}


def get_live_property_context() -> dict:
    """Property-specific context data."""
    d = _load_live()
    fred = d.get("fred", {})
    ws = d.get("walkscore", {})
    wx = d.get("weather", {})

    return {
        "property": {
            "address": "1305 N. 9th Avenue, Pensacola, FL 32503",
            "walk_score": ws.get("walkscore"),
            "walk_description": ws.get("description"),
            "transit_score": ws.get("transit", {}).get("score") if isinstance(ws.get("transit"), dict) else None,
            "bike_score": ws.get("bike", {}).get("score") if isinstance(ws.get("bike"), dict) else None,
        },
        "weather": {
            "temp_f": wx.get("main", {}).get("temp"),
            "description": wx.get("weather", [{}])[0].get("description") if wx.get("weather") else None,
            "humidity": wx.get("main", {}).get("humidity"),
            "wind_mph": wx.get("wind", {}).get("speed"),
        },
        "market_context": {
            "median_home_price_us": fred.get("Median_Sale_Price_US", {}).get("value"),
            "case_shiller_index": fred.get("Case_Shiller_Home_Price_Index", {}).get("value"),
            "housing_starts_k": fred.get("Housing_Starts", {}).get("value"),
            "building_permits_k": fred.get("Building_Permits", {}).get("value"),
            "homeownership_rate": fred.get("Homeownership_Rate", {}).get("value"),
            "rental_vacancy_rate": fred.get("Rental_Vacancy_Rate", {}).get("value"),
            "mortgage_30y": fred.get("30Y_Fixed_Mortgage_Rate", {}).get("value"),
            "mortgage_15y": fred.get("15Y_Fixed_Mortgage_Rate", {}).get("value"),
            "gas_price": d.get("eia_gas", [{}])[0].get("value") if d.get("eia_gas") else None,
        },
    }
