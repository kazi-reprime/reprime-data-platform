"""Deal intelligence data extraction for enhanced terminal."""
import json
import os
from pathlib import Path
from collections import defaultdict

DATA_DIR = Path(__file__).parent.parent / "data" / "scraped"


def _load(source_id: str) -> dict | None:
    path = DATA_DIR / f"{source_id}.json"
    if not path.exists():
        return None
    with open(path) as f:
        return json.load(f)


def get_property_comps() -> dict:
    """Get comparable property data from NYC PLUTO and permits."""
    data = _load("REPR-0260")
    if not data:
        return {"parcels": [], "total": 0}
    records = data.get("records", [])
    # Filter for office-like properties (landuse 5 = commercial/office)
    office_parcels = [
        {
            "address": r.get("address", ""),
            "borough": r.get("borough", ""),
            "zipcode": r.get("zipcode", ""),
            "zone": r.get("zonedist1", ""),
            "building_class": r.get("bldgclass", ""),
            "land_use": r.get("landuse", ""),
            "assessed_land": float(r.get("assessland", 0) or 0),
            "assessed_total": float(r.get("assesstot", 0) or 0),
            "year_built": r.get("yearbuilt", ""),
            "floors": r.get("numfloors", ""),
            "units_total": r.get("unitstotal", ""),
            "building_area_sf": int(float(r.get("bldgarea", 0) or 0)),
            "price_per_sf": round(float(r.get("assesstot", 0) or 0) / max(float(r.get("bldgarea", 1) or 1), 1), 2),
        }
        for r in records[:100]
        if r.get("bldgarea") and float(r.get("bldgarea", 0) or 0) > 5000
    ]
    return {
        "total_parcels": len(records),
        "comparable_properties": office_parcels[:20],
        "source": "NYC MapPLUTO (REPR-0260)",
    }


def get_building_permits() -> dict:
    """Get building permit data from multiple cities."""
    permits = []
    permit_sources = [
        ("REPR-1208", "Chicago"),
        ("REPR-1206", "NYC DOB NOW"),
        ("REPR-1207", "NYC DOB Legacy"),
        ("REPR-1213", "Dallas"),
    ]
    for sid, city in permit_sources:
        data = _load(sid)
        if not data:
            continue
        recs = data.get("records", [])
        for r in recs[:10]:
            permits.append({
                "city": city,
                "permit_type": r.get("permit_type", r.get("job_type", "")),
                "address": r.get("street_number", r.get("house__", "")) + " " + r.get("street_direction", r.get("street_name", "")),
                "issue_date": r.get("issue_date", r.get("issuance_date", "")),
                "work_description": r.get("work_description", r.get("job_description", ""))[:100] if r.get("work_description") or r.get("job_description") else "",
                "source_id": sid,
            })
    return {
        "total_permits": len(permits),
        "permits": permits[:30],
        "sources": [s[0] for s in permit_sources],
    }


def get_news_sentiment() -> dict:
    """Get news articles relevant to real estate."""
    news_sources = [
        ("REPR-0692", "Bloomberg Markets"),
        ("REPR-0693", "Bloomberg Economics"),
        ("REPR-0694", "Bloomberg Industries"),
        ("REPR-0702", "Commercial Observer"),
        ("REPR-0705", "Connect CRE"),
        ("REPR-0722", "Federal Reserve"),
        ("REPR-0729", "CFPB"),
        ("REPR-0675", "Federal Register"),
        ("REPR-0202", "Calculated Risk"),
        ("REPR-2087", "Coresight Research"),
    ]
    articles = []
    sources_used = []
    for sid, name in news_sources:
        data = _load(sid)
        if not data:
            continue
        recs = data.get("records", [])
        feed_articles = [r for r in recs if r.get("title")]
        if feed_articles:
            sources_used.append({"id": sid, "name": name, "count": len(feed_articles)})
            for r in feed_articles:
                # Simple sentiment from keywords
                title = (r.get("title", "") or "").lower()
                sentiment = "neutral"
                if any(w in title for w in ["surge", "rise", "gain", "grow", "boom", "record", "strong"]):
                    sentiment = "positive"
                elif any(w in title for w in ["fall", "drop", "crash", "decline", "weak", "loss", "risk", "crisis"]):
                    sentiment = "negative"
                articles.append({
                    "title": r.get("title", ""),
                    "link": r.get("link", ""),
                    "published": r.get("published", ""),
                    "source": name,
                    "source_id": sid,
                    "sentiment": sentiment,
                    "summary": (r.get("summary", "") or "")[:200],
                })
    # Sort by published date
    articles.sort(key=lambda x: x.get("published", ""), reverse=True)
    sentiment_counts = defaultdict(int)
    for a in articles:
        sentiment_counts[a["sentiment"]] += 1
    return {
        "total_articles": len(articles),
        "articles": articles[:50],
        "sources": sources_used,
        "sentiment_summary": dict(sentiment_counts),
    }


def get_financing_data() -> dict:
    """Compile financing/lending data from multiple sources."""
    sofr_data = _load("REPR-0980")
    fdic_data = _load("REPR-0184")
    treasury_data = _load("REPR-1973")

    # SOFR
    sofr = {}
    if sofr_data:
        rates = sofr_data["records"][0].get("refRates", [])
        sofr_ai = next((r for r in rates if r.get("type") == "SOFRAI"), None)
        if sofr_ai:
            sofr = {
                "sofr_30d": sofr_ai.get("average30day"),
                "sofr_90d": sofr_ai.get("average90day"),
                "sofr_180d": sofr_ai.get("average180day"),
            }

    # Lending products simulation based on real rates
    base_rate = sofr.get("sofr_30d", 3.59)
    products = [
        {
            "product": "Agency (Fannie/Freddie)",
            "rate_range": f"{base_rate + 1.5:.2f}% - {base_rate + 2.0:.2f}%",
            "ltv": "65-80%",
            "term": "5-10 yr",
            "amort": "30 yr",
            "min_dscr": "1.25x",
            "best_for": "Stabilized multifamily",
        },
        {
            "product": "CMBS",
            "rate_range": f"{base_rate + 2.0:.2f}% - {base_rate + 2.8:.2f}%",
            "ltv": "60-75%",
            "term": "5-10 yr",
            "amort": "30 yr",
            "min_dscr": "1.30x",
            "best_for": "Stabilized office/retail",
        },
        {
            "product": "Bank Portfolio",
            "rate_range": f"{base_rate + 2.2:.2f}% - {base_rate + 3.0:.2f}%",
            "ltv": "60-70%",
            "term": "3-7 yr",
            "amort": "25 yr",
            "min_dscr": "1.35x",
            "best_for": "Relationship borrowers",
        },
        {
            "product": "Bridge/Transitional",
            "rate_range": f"{base_rate + 3.0:.2f}% - {base_rate + 5.0:.2f}%",
            "ltv": "70-80%",
            "term": "1-3 yr",
            "amort": "IO",
            "min_dscr": "1.10x",
            "best_for": "Value-add / lease-up",
        },
        {
            "product": "Mezzanine",
            "rate_range": f"{base_rate + 5.0:.2f}% - {base_rate + 8.0:.2f}%",
            "ltv": "75-90%",
            "term": "2-5 yr",
            "amort": "IO",
            "min_dscr": "1.00x",
            "best_for": "Gap financing",
        },
        {
            "product": "Construction",
            "rate_range": f"{base_rate + 3.5:.2f}% - {base_rate + 5.5:.2f}%",
            "ltv": "55-65% LTC",
            "term": "18-36 mo",
            "amort": "IO + funded",
            "min_dscr": "N/A",
            "best_for": "Ground-up / major rehab",
        },
    ]

    # FDIC aggregate
    fdic_agg = {}
    if fdic_data:
        banks = [r for r in fdic_data.get("records", []) if "data" in r]
        fdic_agg = {
            "total_cre_billions": round(sum(b["data"].get("LNRENRES", 0) for b in banks) / 1_000_000, 1),
            "total_re_billions": round(sum(b["data"].get("LNRE", 0) for b in banks) / 1_000_000, 1),
            "total_construction_billions": round(sum(b["data"].get("LNRECONS", 0) for b in banks) / 1_000_000, 1),
            "bank_count": len(banks),
        }

    return {
        "benchmark_rates": sofr,
        "lending_products": products,
        "fdic_aggregate": fdic_agg,
        "sources": ["NY Fed SOFR (REPR-0980)", "FDIC BankFind (REPR-0184)", "Treasury.gov (REPR-1973)"],
    }


def get_environmental_risk() -> dict:
    """Environmental and flood risk data."""
    fema_claims = _load("REPR-0029")
    fema_policies = _load("REPR-0078")
    fema_disasters = _load("REPR-0079")

    result = {"flood": {}, "disasters": [], "policies": {}}

    if fema_claims:
        claims = fema_claims["records"][0].get("FimaNfipClaims", [])
        fl_claims = [c for c in claims if c.get("state") == "FL"]
        total_paid = sum(float(c.get("amountPaidOnBuildingClaim", 0) or 0) for c in fl_claims)
        result["flood"] = {
            "total_claims": len(claims),
            "florida_claims": len(fl_claims),
            "florida_total_paid": round(total_paid, 2),
            "source": "FEMA NFIP Claims (REPR-0029)",
        }

    if fema_disasters:
        declarations = fema_disasters["records"][0].get("DisasterDeclarationsSummaries", [])
        fl_disasters = [d for d in declarations if d.get("state") == "FL"][:10]
        result["disasters"] = [
            {
                "title": d.get("declarationTitle"),
                "date": d.get("declarationDate", "")[:10],
                "type": d.get("incidentType"),
                "county": d.get("designatedArea", ""),
            }
            for d in fl_disasters
        ]

    if fema_policies:
        policies = fema_policies["records"][0].get("FimaNfipPolicies", [])
        fl_policies = [p for p in policies if p.get("propertyState") == "FL"]
        result["policies"] = {
            "total_policies": len(policies),
            "florida_policies": len(fl_policies),
            "source": "FEMA NFIP Policies (REPR-0078)",
        }

    return result


def get_deal_intelligence() -> dict:
    """Full deal intelligence package."""
    return {
        "property_comps": get_property_comps(),
        "building_permits": get_building_permits(),
        "news_sentiment": get_news_sentiment(),
        "financing": get_financing_data(),
        "environmental": get_environmental_risk(),
    }
