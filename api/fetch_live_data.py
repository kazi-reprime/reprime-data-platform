"""Fetch live data from all 13 API sources and save to scraped directory."""
import asyncio
import json
import os
from datetime import datetime
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

DATA_DIR = Path(__file__).parent / "data" / "live"
DATA_DIR.mkdir(parents=True, exist_ok=True)

FRED_KEY = os.environ.get("FRED_API_KEY", "")
CENSUS_KEY = os.environ.get("CENSUS_API_KEY", "")
BLS_KEY = os.environ.get("BLS_API_KEY", "")
BEA_KEY = os.environ.get("BEA_API_KEY", "")
EIA_KEY = os.environ.get("EIA_API_KEY", "")
FINNHUB_KEY = os.environ.get("FINNHUB_API_KEY", "")
ALPHA_KEY = os.environ.get("ALPHA_VANTAGE_API_KEY", "")
COINGECKO_KEY = os.environ.get("COINGECKO_API_KEY", "")
TWELVE_KEY = os.environ.get("TWELVE_DATA_API_KEY", "")
WALK_KEY = os.environ.get("WALK_SCORE_API_KEY", "")
WEATHER_KEY = os.environ.get("OPENWEATHER_API_KEY", "")
DATA_GOV_KEY = os.environ.get("DATA_GOV_API_KEY", "")


async def fetch_all():
    async with httpx.AsyncClient(timeout=30) as c:
        results = {}

        # 1. FRED — Treasury 10Y, 30Y Mortgage, Fed Funds, SOFR, CPI, Unemployment
        fred_series = {
            "DGS10": "10Y_Treasury_Yield",
            "DGS30": "30Y_Treasury_Yield",
            "DGS2": "2Y_Treasury_Yield",
            "DGS5": "5Y_Treasury_Yield",
            "MORTGAGE30US": "30Y_Fixed_Mortgage_Rate",
            "MORTGAGE15US": "15Y_Fixed_Mortgage_Rate",
            "FEDFUNDS": "Fed_Funds_Rate",
            "SOFR": "SOFR_Rate",
            "CPIAUCSL": "CPI_All_Urban",
            "UNRATE": "Unemployment_Rate",
            "HOUST": "Housing_Starts",
            "PERMIT": "Building_Permits",
            "CSUSHPISA": "Case_Shiller_Home_Price_Index",
            "MSPUS": "Median_Sale_Price_US",
            "DRCRELEXFACBS": "CRE_Delinquency_Rate",
            "BOGZ1FL073065503Q": "CMBS_Outstanding",
            "RRVRUSQ156N": "Rental_Vacancy_Rate",
            "RSAHORUSQ156S": "Homeownership_Rate",
            "GDP": "GDP",
            "INDPRO": "Industrial_Production",
        }
        print("Fetching FRED data (20 series)...")
        fred_data = {}
        for series_id, label in fred_series.items():
            try:
                r = await c.get(
                    f"https://api.stlouisfed.org/fred/series/observations",
                    params={
                        "series_id": series_id,
                        "api_key": FRED_KEY,
                        "file_type": "json",
                        "sort_order": "desc",
                        "limit": 5,
                    },
                )
                d = r.json()
                obs = d.get("observations", [])
                if obs:
                    latest = obs[0]
                    prev = obs[1] if len(obs) > 1 else {}
                    fred_data[label] = {
                        "series_id": series_id,
                        "value": latest.get("value"),
                        "date": latest.get("date"),
                        "prev_value": prev.get("value"),
                        "prev_date": prev.get("date"),
                    }
                    print(f"  {label}: {latest.get('value')} ({latest.get('date')})")
            except Exception as e:
                print(f"  {label}: ERROR - {e}")
        results["fred"] = fred_data

        # 2. BLS — CPI, Employment, Wages
        print("\nFetching BLS data...")
        try:
            bls_r = await c.post(
                "https://api.bls.gov/publicAPI/v2/timeseries/data/",
                json={
                    "seriesid": [
                        "CUSR0000SA0",  # CPI-U All Items
                        "CUUR0000SA0L1E",  # CPI-U Less Food & Energy
                        "CES0000000001",  # Total Nonfarm Employment
                        "LNS14000000",  # Unemployment Rate
                    ],
                    "startyear": "2025",
                    "endyear": "2026",
                    "registrationkey": BLS_KEY,
                },
            )
            bls_data = bls_r.json()
            results["bls"] = bls_data.get("Results", {})
            series_list = results["bls"].get("series", [])
            for s in series_list:
                sid = s.get("seriesID", "")
                latest = s.get("data", [{}])[0]
                print(f"  {sid}: {latest.get('value')} ({latest.get('year')}-{latest.get('periodName')})")
        except Exception as e:
            print(f"  BLS ERROR: {e}")
            results["bls"] = {}

        # 3. Census — Pensacola MSA Demographics
        print("\nFetching Census data (Pensacola MSA)...")
        try:
            census_r = await c.get(
                "https://api.census.gov/data/2022/acs/acs5",
                params={
                    "get": "B01003_001E,B19013_001E,B25077_001E,B25064_001E,B25003_001E,B25003_002E,B25003_003E",
                    "for": "metropolitan statistical area/micropolitan statistical area:37860",
                    "key": CENSUS_KEY,
                },
            )
            census_data = census_r.json()
            if len(census_data) > 1:
                headers = census_data[0]
                values = census_data[1]
                results["census_pensacola"] = dict(zip(headers, values))
                print(f"  Population: {values[0]}, Median Income: ${values[1]}, Median Home Value: ${values[2]}")
        except Exception as e:
            print(f"  Census ERROR: {e}")
            results["census_pensacola"] = {}

        # 4. BEA — GDP
        print("\nFetching BEA GDP data...")
        try:
            bea_r = await c.get(
                "https://apps.bea.gov/api/data/",
                params={
                    "UserID": BEA_KEY,
                    "method": "GetData",
                    "DataSetName": "NIPA",
                    "TableName": "T10101",
                    "Frequency": "Q",
                    "Year": "2025,2026",
                    "ResultFormat": "JSON",
                },
            )
            results["bea_gdp"] = bea_r.json().get("BEAAPI", {}).get("Results", {})
            print(f"  GDP data fetched")
        except Exception as e:
            print(f"  BEA ERROR: {e}")

        # 5. Finnhub — REIT stock prices
        print("\nFetching Finnhub REIT data...")
        reit_tickers = ["O", "PLD", "AMT", "PSA", "SPG", "WELL", "DLR", "EQR", "VNO", "BXP"]
        reit_data = {}
        for ticker in reit_tickers:
            try:
                r = await c.get(
                    f"https://finnhub.io/api/v1/quote",
                    params={"symbol": ticker, "token": FINNHUB_KEY},
                )
                q = r.json()
                reit_data[ticker] = {
                    "current": q.get("c"),
                    "change": q.get("d"),
                    "change_pct": q.get("dp"),
                    "high": q.get("h"),
                    "low": q.get("l"),
                    "open": q.get("o"),
                    "prev_close": q.get("pc"),
                }
                print(f"  {ticker}: ${q.get('c')} ({q.get('dp')}%)")
            except Exception as e:
                print(f"  {ticker}: ERROR - {e}")
        results["reits"] = reit_data

        # 6. CoinGecko — Bitcoin, Ethereum
        print("\nFetching CoinGecko crypto...")
        try:
            cg_r = await c.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={
                    "ids": "bitcoin,ethereum",
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                    "include_market_cap": "true",
                    "x_cg_demo_api_key": COINGECKO_KEY,
                },
            )
            results["crypto"] = cg_r.json()
            btc = results["crypto"].get("bitcoin", {})
            print(f"  BTC: ${btc.get('usd')} ({btc.get('usd_24h_change', 0):.1f}%)")
        except Exception as e:
            print(f"  Crypto ERROR: {e}")

        # 7. OpenWeather — Pensacola current weather
        print("\nFetching Pensacola weather...")
        try:
            wx_r = await c.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"q": "Pensacola,FL,US", "appid": WEATHER_KEY, "units": "imperial"},
            )
            results["weather"] = wx_r.json()
            w = results["weather"]
            print(f"  {w.get('name')}: {w.get('main',{}).get('temp')}°F, {w.get('weather',[{}])[0].get('description')}")
        except Exception as e:
            print(f"  Weather ERROR: {e}")

        # 8. Walk Score — Property location
        print("\nFetching Walk Score for 1305 N 9th Ave...")
        try:
            ws_r = await c.get(
                "https://api.walkscore.com/score",
                params={
                    "format": "json",
                    "address": "1305 N 9th Avenue Pensacola FL 32503",
                    "lat": 30.4275,
                    "lon": -87.2075,
                    "wsapikey": WALK_KEY,
                },
            )
            results["walkscore"] = ws_r.json()
            ws = results["walkscore"]
            print(f"  Walk Score: {ws.get('walkscore')} ({ws.get('description')})")
        except Exception as e:
            print(f"  Walk Score ERROR: {e}")

        # 9. EIA — Energy prices
        print("\nFetching EIA energy data...")
        try:
            eia_r = await c.get(
                "https://api.eia.gov/v2/petroleum/pri/gnd/data/",
                params={
                    "api_key": EIA_KEY,
                    "frequency": "weekly",
                    "data[0]": "value",
                    "facets[product][]": "EPM0",
                    "facets[duoarea][]": "NUS",
                    "sort[0][column]": "period",
                    "sort[0][direction]": "desc",
                    "length": 4,
                },
            )
            results["eia_gas"] = eia_r.json().get("response", {}).get("data", [])
            if results["eia_gas"]:
                print(f"  Gas price: ${results['eia_gas'][0].get('value')}/gal ({results['eia_gas'][0].get('period')})")
        except Exception as e:
            print(f"  EIA ERROR: {e}")

        # 10. Twelve Data — VIX, S&P 500
        print("\nFetching Twelve Data market indices...")
        try:
            td_r = await c.get(
                "https://api.twelvedata.com/quote",
                params={"symbol": "SPX,VIX,DJI", "apikey": TWELVE_KEY},
            )
            results["indices"] = td_r.json()
            for k, v in results["indices"].items():
                if isinstance(v, dict):
                    print(f"  {v.get('name','')}: {v.get('close','')} ({v.get('percent_change','')}%)")
        except Exception as e:
            print(f"  Twelve Data ERROR: {e}")

        # 11. NY Fed SOFR (direct, no key needed)
        print("\nFetching NY Fed SOFR...")
        try:
            sofr_r = await c.get("https://markets.newyorkfed.org/api/rates/all/latest.json")
            results["nyfed_sofr"] = sofr_r.json()
            rates = results["nyfed_sofr"].get("refRates", [])
            for rate in rates[:5]:
                print(f"  {rate.get('type')}: {rate.get('percentRate', rate.get('average30day', ''))}")
        except Exception as e:
            print(f"  NY Fed ERROR: {e}")

        # 12. Treasury Daily Yield Curve
        print("\nFetching Treasury yield curve...")
        try:
            ty_r = await c.get(
                "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates",
                params={"sort": "-record_date", "page[size]": 20},
            )
            results["treasury_yields"] = ty_r.json().get("data", [])
            if results["treasury_yields"]:
                print(f"  Latest: {results['treasury_yields'][0].get('record_date')} - {results['treasury_yields'][0].get('security_desc')}: {results['treasury_yields'][0].get('avg_interest_rate_amt')}%")
        except Exception as e:
            print(f"  Treasury ERROR: {e}")

        # Save all results
        output = {
            "fetched_at": datetime.now().isoformat(),
            "api_count": 12,
            **results,
        }
        out_path = DATA_DIR / "live_market_data.json"
        with open(out_path, "w") as f:
            json.dump(output, f, indent=2, default=str)
        print(f"\n✅ All data saved to {out_path}")
        print(f"   File size: {out_path.stat().st_size / 1024:.1f} KB")
        return output


if __name__ == "__main__":
    asyncio.run(fetch_all())
