#!/usr/bin/env python3
"""
RePrime Group — Terminal Data Intelligence Engine
Complete Data Source Reference Guide
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import Color, black, white, HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib import colors

# ── Brand Colors ──
NAVY = Color(14/255, 52/255, 112/255)
GOLD = Color(188/255, 156/255, 69/255)
GREEN = Color(0/255, 169/255, 128/255)
RED = Color(255/255, 116/255, 116/255)
LIGHT_NAVY = Color(14/255, 52/255, 112/255, 0.08)
LIGHT_GOLD = Color(188/255, 156/255, 69/255, 0.12)
GRAY = Color(0.45, 0.45, 0.45)
LIGHT_GRAY = Color(0.92, 0.92, 0.92)
DARK_TEXT = Color(0.15, 0.15, 0.15)

OUTPUT = "/sessions/wizardly-eager-wright/mnt/API/Terminal_Data_Sources_Reference_Guide.pdf"

# ── Document Setup ──
doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.75*inch,
    rightMargin=0.75*inch,
    topMargin=0.75*inch,
    bottomMargin=0.75*inch,
)

PAGE_W = letter[0] - 1.5*inch  # usable width

# ── Styles ──
styles = getSampleStyleSheet()

def make_style(name, **kw):
    base = kw.pop("parent", styles["Normal"])
    return ParagraphStyle(name, parent=base, **kw)

s_cover_company = make_style("CoverCompany", fontName="Helvetica-Bold", fontSize=24,
    textColor=NAVY, alignment=TA_CENTER, spaceAfter=18)
s_cover_product = make_style("CoverProduct", fontName="Helvetica", fontSize=18,
    textColor=GOLD, alignment=TA_CENTER, spaceAfter=14)
s_cover_sub = make_style("CoverSub", fontName="Helvetica", fontSize=14,
    textColor=black, alignment=TA_CENTER, spaceAfter=10)
s_cover_tag = make_style("CoverTag", fontName="Helvetica", fontSize=11,
    textColor=GRAY, alignment=TA_CENTER, spaceAfter=6)
s_cover_conf = make_style("CoverConf", fontName="Helvetica", fontSize=10,
    textColor=GRAY, alignment=TA_CENTER)

s_h1 = make_style("H1", fontName="Helvetica-Bold", fontSize=16, textColor=NAVY,
    spaceAfter=4, spaceBefore=2)
s_h2 = make_style("H2", fontName="Helvetica-Bold", fontSize=12, textColor=NAVY,
    spaceAfter=2, spaceBefore=6)
s_h3 = make_style("H3", fontName="Helvetica-Bold", fontSize=11, textColor=NAVY,
    spaceAfter=1, spaceBefore=4)

s_body = make_style("Body", fontName="Helvetica", fontSize=9.5, textColor=DARK_TEXT,
    leading=13, alignment=TA_JUSTIFY, spaceAfter=6)
s_body_small = make_style("BodySmall", fontName="Helvetica", fontSize=9, textColor=DARK_TEXT,
    leading=12, alignment=TA_LEFT, spaceAfter=3)
s_kv = make_style("KV", fontName="Helvetica", fontSize=8.5, textColor=DARK_TEXT,
    leading=11, spaceAfter=1)
s_src_name = make_style("SrcName", fontName="Helvetica-Bold", fontSize=10.5,
    textColor=NAVY, spaceAfter=0, spaceBefore=6)
s_bold_label = make_style("BoldLabel", fontName="Helvetica-Bold", fontSize=9.5,
    textColor=DARK_TEXT, spaceAfter=4)
s_faq_q = make_style("FAQQ", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY,
    spaceBefore=10, spaceAfter=2)
s_faq_a = make_style("FAQA", fontName="Helvetica", fontSize=9.5, textColor=DARK_TEXT,
    leading=13, spaceAfter=6, leftIndent=12, alignment=TA_JUSTIFY)
s_tier_subtitle = make_style("TierSub", fontName="Helvetica-Oblique", fontSize=9.5,
    textColor=GRAY, spaceAfter=8)

# ── Helpers ──
def gold_line():
    return HRFlowable(width="100%", thickness=1, color=GOLD, spaceBefore=2, spaceAfter=4)

def thin_navy_line():
    return HRFlowable(width="100%", thickness=0.5, color=NAVY, spaceBefore=1, spaceAfter=3)

def source_block(name, fields):
    """Create a formatted source entry block."""
    elems = []
    elems.append(Paragraph(name, s_src_name))
    elems.append(HRFlowable(width="100%", thickness=0.75, color=GOLD, spaceBefore=1, spaceAfter=3))
    for k, v in fields:
        safe_v = v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        safe_k = k.replace("&", "&amp;")
        elems.append(Paragraph(
            f'<b><font color="#{NAVY.hexval()[2:]}">{safe_k}</font></b>  {safe_v}', s_kv))
    elems.append(Spacer(1, 6))
    return KeepTogether(elems)

def tier2_block(name, fields):
    elems = []
    elems.append(Paragraph(name, s_src_name))
    elems.append(HRFlowable(width="100%", thickness=0.75, color=GOLD, spaceBefore=1, spaceAfter=3))
    for k, v in fields:
        safe_v = v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        safe_k = k.replace("&", "&amp;")
        elems.append(Paragraph(
            f'<b><font color="#{NAVY.hexval()[2:]}">{safe_k}</font></b>  {safe_v}', s_kv))
    elems.append(Spacer(1, 5))
    return KeepTogether(elems)

def tier3_block(name, fields):
    elems = []
    elems.append(Paragraph(name, make_style("T3Name", fontName="Helvetica-Bold", fontSize=10,
        textColor=NAVY, spaceAfter=0, spaceBefore=4)))
    elems.append(HRFlowable(width="100%", thickness=0.5, color=GOLD, spaceBefore=1, spaceAfter=2))
    for k, v in fields:
        safe_v = v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        safe_k = k.replace("&", "&amp;")
        elems.append(Paragraph(
            f'<b><font color="#{NAVY.hexval()[2:]}">{safe_k}</font></b>  {safe_v}', s_kv))
    elems.append(Spacer(1, 4))
    return elems  # no KeepTogether for tier3 — they're short enough

navy_hex = "0E3470"
gold_hex = "BC9C45"

# ══════════════════════════════════════════════════════════════
# BUILD STORY
# ══════════════════════════════════════════════════════════════
story = []

# ────────────── PAGE 1: COVER ──────────────
story.append(Spacer(1, 2.0*inch))
story.append(Paragraph("REPRIME GROUP", s_cover_company))
story.append(Spacer(1, 0.25*inch))
story.append(Paragraph("Terminal Data Intelligence Engine", s_cover_product))
story.append(Spacer(1, 0.35*inch))
story.append(HRFlowable(width="50%", thickness=2, color=GOLD, spaceBefore=0, spaceAfter=14))
story.append(Paragraph("Complete Data Source Reference Guide", s_cover_sub))
story.append(Spacer(1, 0.15*inch))
story.append(Paragraph("Free · Freemium · Paid — Every Source, Every Endpoint, Every Price", s_cover_tag))
story.append(Spacer(1, 2.5*inch))
story.append(Paragraph("Confidential — June 2026", s_cover_conf))
story.append(PageBreak())

# ────────────── PAGE 2: EXECUTIVE SUMMARY ──────────────
story.append(Paragraph("Executive Summary", s_h1))
story.append(gold_line())
story.append(Spacer(1, 6))

story.append(Paragraph(
    "Terminal ingests data from <b>63 core intelligence sources</b> across three access tiers. "
    "<b>Tier 1 (29 sources)</b> requires zero authentication — these are US government systems "
    "(Federal Reserve, Treasury, FEMA, EPA, SEC, BLS, Census) that have been publicly operational "
    "for 10–30 years. <b>Tier 2 (14 sources)</b> requires a free API key — one-time registration, "
    "30–120 seconds each, no credit card, permanent keys. <b>Tier 3 (20 sources)</b> are "
    "institutional-grade paid vendors activated as deal flow justifies the spend.", s_body))

story.append(Spacer(1, 8))
story.append(Paragraph("<b>Key Architecture Decision:</b>", s_bold_label))
story.append(Paragraph(
    "Even at full Tier 3 deployment (~$300K/year in data costs), Terminal processes 100+ deals/day. "
    "At 50 deals/day across 250 working days = 12,500 deals/year. Data cost per deal = <b>$24</b>. "
    "A single successful CRE acquisition generates returns that pay for a decade of data costs.", s_body))

story.append(Spacer(1, 12))
story.append(Paragraph("Tier Breakdown", s_h2))
story.append(Spacer(1, 4))

tier_data = [
    ["Tier", "Sources", "Annual Cost", "Registration", "Key Stat"],
    ["No Auth", "29", "$0", "None needed", "10–30 years operational"],
    ["Free Key", "14", "$0", "15 min total", "Permanent, no CC"],
    ["Paid", "20", "$2K–$300K", "Vendor contract", "Activated on demand"],
    ["TOTAL", "63", "$0–$300K", "—", "—"],
]

tier_table = Table(tier_data, colWidths=[PAGE_W*0.14, PAGE_W*0.12, PAGE_W*0.18, PAGE_W*0.24, PAGE_W*0.32])
tier_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 9),
    ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
    ("BACKGROUND", (0, -1), (-1, -1), LIGHT_NAVY),
    ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
    ("ALIGN", (1, 0), (1, -1), "CENTER"),
    ("ALIGN", (2, 0), (2, -1), "CENTER"),
    ("GRID", (0, 0), (-1, -1), 0.5, NAVY),
    ("ROWBACKGROUNDS", (0, 1), (-1, -2), [white, Color(0.97, 0.97, 0.97)]),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(tier_table)
story.append(PageBreak())

# ────────────── PAGES 3-6: TIER 1 ──────────────
story.append(Paragraph("TIER 1: ZERO AUTHENTICATION REQUIRED", s_h1))
story.append(gold_line())
story.append(Paragraph(
    "These endpoints require nothing. No API key, no registration, no account. Call them right now.",
    s_tier_subtitle))
story.append(Spacer(1, 4))

# Source 1
story.append(source_block("1. NY Fed SOFR", [
    ("Provider:", "Federal Reserve Bank of New York"),
    ("Endpoint:", "https://markets.newyorkfed.org/api/rates/secured/sofr/last/1.json"),
    ("Data Returned:", "Secured Overnight Financing Rate, percentile 1/25/75/99, volume in billions"),
    ("Update Frequency:", "Daily ~8:00 AM ET, T+1 business day"),
    ("CORS:", "Yes (Access-Control-Allow-Origin: *)"),
    ("Format:", "JSON"),
    ("CRE Use:", "Benchmark floating-rate index; directly prices CRE bridge loans, construction financing, CMBS coupon resets. Live test 2026-06-01: returned 3.63%."),
]))

# Source 2
story.append(source_block("2. NY Fed EFFR", [
    ("Provider:", "Federal Reserve Bank of New York"),
    ("Endpoint:", "https://markets.newyorkfed.org/api/rates/unsecured/effr/last/1.json"),
    ("Data Returned:", "Federal Funds Effective Rate, target range (from/to), percentiles, volume"),
    ("Update Frequency:", "Daily ~8:00 AM ET"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "Fed policy rate; governs short-term borrowing cost for all CRE debt. Live test: returned 3.62%, target 3.50–3.75%."),
]))

# Source 3
story.append(source_block("3. NY Fed All Rates", [
    ("Provider:", "Federal Reserve Bank of New York"),
    ("Endpoint:", "https://markets.newyorkfed.org/api/rates/all/latest.json"),
    ("Data Returned:", "SOFR 30-day (3.61%), 90-day (3.65%), 180-day (3.72%) averages plus index, EFFR, OBFR, TGCR, BGCR — all in one call"),
    ("Update Frequency:", "Daily"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "30-day SOFR average is the index most commonly used in floating-rate CRE debt; one call replaces 8 separate lookups."),
]))

# Source 4
story.append(source_block("4. FRED CSV Endpoints", [
    ("Provider:", "Federal Reserve Bank of St. Louis"),
    ("Endpoint Pattern:", "https://fred.stlouisfed.org/graph/fredgraph.csv?id={SERIES_ID}"),
    ("Key Series:", "DGS10 (10Y Treasury, cap rate anchor), MORTGAGE30US (30Y mortgage), SOFR (daily), DRCRELEXFACBS (CRE delinquency), H8B3219NCBCMG (CRE loan balances weekly), DGS2 (2Y yield for spread calc), DFII10 (10Y TIPS real rate)"),
    ("Update Frequency:", "Varies — daily to quarterly depending on series"),
    ("CORS:", "No (server-side proxy required)"),
    ("Format:", "CSV"),
    ("CRE Use:", "The single most important free data source for CRE — 800,000+ economic time series covering every rate, spread, and macro indicator."),
]))

# Source 5
story.append(source_block("5. US Treasury Yield Curve", [
    ("Provider:", "US Department of the Treasury"),
    ("Endpoint:", "https://home.treasury.gov/sites/default/files/interest-rates/yield.xml"),
    ("Data Returned:", "Par yield curve all maturities (1M, 2M, 3M, 4M, 6M, 1Y, 2Y, 3Y, 5Y, 7Y, 10Y, 20Y, 30Y) in single call"),
    ("Update Frequency:", "Daily ~6 PM ET"),
    ("CORS:", "No"),
    ("Format:", "XML"),
    ("CRE Use:", "Full yield curve widget; 2Y–10Y spread is strongest leading recession signal for CRE demand."),
]))

# Source 6
story.append(source_block("6. FEMA Disaster Declarations", [
    ("Provider:", "FEMA"),
    ("Endpoint:", "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries"),
    ("Data Returned:", "Disaster type, declaration date, state, county, designated areas, program types"),
    ("Update Frequency:", "Real-time"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "Property-level disaster history screening; insurance risk assessment."),
]))

# Source 7
story.append(source_block("7. FEMA NFHL Flood Zones", [
    ("Provider:", "FEMA"),
    ("Endpoint:", "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer"),
    ("Data Returned:", "Flood zone designation (A, AE, X, VE), Base Flood Elevation, Special Flood Hazard Area, FIRM effective date"),
    ("Update Frequency:", "As revised with map amendments"),
    ("CORS:", "Yes"),
    ("Format:", "ArcGIS REST / WFS / WMS"),
    ("CRE Use:", "Most critical free layer for coastal MSA risk scoring; required for federal flood insurance eligibility determination."),
]))

# Source 8
story.append(source_block("8. USGS Earthquake", [
    ("Provider:", "US Geological Survey"),
    ("Endpoint:", "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"),
    ("Data Returned:", "Magnitude, location (lat/lon), depth, time, felt reports"),
    ("Update Frequency:", "Real-time"),
    ("CORS:", "Yes"),
    ("Format:", "GeoJSON"),
    ("CRE Use:", "Seismic risk assessment for West Coast, New Madrid zone, and Oklahoma (induced seismicity)."),
]))

# Source 9
story.append(source_block("9. EPA Envirofacts", [
    ("Provider:", "US Environmental Protection Agency"),
    ("Endpoint:", "https://data.epa.gov/efservice/"),
    ("Data Returned:", "Superfund (NPL) sites, Toxic Release Inventory, brownfields, air quality, water discharges"),
    ("Update Frequency:", "Varies by dataset"),
    ("CORS:", "Yes"),
    ("Format:", "JSON / CSV"),
    ("CRE Use:", "Address-level environmental contamination screening; Phase I ESA triggering."),
]))

# Source 10
story.append(source_block("10. NOAA Sea Level Rise", [
    ("Provider:", "NOAA Office for Coastal Management"),
    ("Endpoint:", "https://coast.noaa.gov/arcgis/rest/services/dc_slr/slr_{N}ft/MapServer (N=0–10)"),
    ("Data Returned:", "Inundation extent at 0–10 ft sea level rise scenarios, depth rasters, vulnerability index"),
    ("Update Frequency:", "Periodically updated with new models"),
    ("CORS:", "Yes"),
    ("Format:", "ArcGIS REST"),
    ("CRE Use:", "Essential for Miami, Houston, NYC, Charleston, Tampa properties — long-term climate risk overlay."),
]))

# Source 11
story.append(source_block("11. NWS Weather Alerts", [
    ("Provider:", "National Weather Service"),
    ("Endpoint:", "https://api.weather.gov/alerts"),
    ("Data Returned:", "Active weather warnings, watches, advisories by geographic area"),
    ("Update Frequency:", "Real-time"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "Current-conditions context for property assessment."),
]))

# Source 12
story.append(source_block("12. Federal Register API", [
    ("Provider:", "Federal Register (GPO)"),
    ("Endpoint:", "https://www.federalregister.gov/api/v1/documents.json?conditions[term]=real+estate"),
    ("Data Returned:", "Federal rules, proposed rules, notices filterable by agency (HUD, FDIC, OCC, SEC, CFPB, FinCEN)"),
    ("Update Frequency:", "Daily"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "Real-time regulatory intelligence affecting CRE lending, compliance, reporting."),
]))

# Source 13
story.append(source_block("13. SEC EDGAR Full-Text Search", [
    ("Provider:", "US Securities and Exchange Commission"),
    ("Endpoint:", "https://efts.sec.gov/LATEST/search-index"),
    ("Data Returned:", "Full-text search across all SEC filings (8-K, 10-K, 10-Q, etc.)"),
    ("Update Frequency:", "Real-time"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "REIT event monitoring — acquisitions, dispositions, debt issuances, material events. Live test returned 1,756 CRE-related 8-K filings."),
]))

# Source 14
story.append(source_block("14. BLS LAUS v1", [
    ("Provider:", "Bureau of Labor Statistics"),
    ("Endpoint:", "https://api.bls.gov/publicAPI/v1/timeseries/data/{seriesID}"),
    ("Data Returned:", "Unemployment rate, labor force, employed/unemployed counts by county/MSA"),
    ("Update Frequency:", "Monthly"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "Labor market health for submarket selection; tenant financial stress indicator. v1 = no key needed, limited to 25 series/day and 10 years."),
]))

# Source 15
story.append(source_block("15. GDELT News", [
    ("Provider:", "GDELT Project"),
    ("Endpoint:", "https://api.gdeltproject.org/api/v2/doc/doc?query=CMBS+commercial+real+estate&mode=artlist&format=json&timespan=24h&maxrecords=250"),
    ("Data Returned:", "Global news articles matching CRE keywords, tone/sentiment analysis, source countries"),
    ("Update Frequency:", "Near real-time (15-minute updates)"),
    ("CORS:", "No"),
    ("Format:", "JSON / CSV"),
    ("CRE Use:", "News ticker feed; sentiment analysis on CRE sectors; coverage volume tracking."),
]))

# Source 16
story.append(source_block("16. Frankfurter FX", [
    ("Provider:", "European Central Bank via Frankfurter.dev"),
    ("Endpoint:", "https://api.frankfurter.dev/v1/latest?base=USD&symbols=ILS,EUR,GBP"),
    ("Data Returned:", "Exchange rates vs 30+ currencies sourced from ECB reference rates"),
    ("Update Frequency:", "Daily EOD (~16:00 CET)"),
    ("CORS:", "No"),
    ("Format:", "JSON"),
    ("CRE Use:", "USD/ILS ticker for Israeli investor base. Live test: USD/ILS = 2.8155."),
]))

# Source 17
story.append(source_block("17. Bank of Israel FX", [
    ("Provider:", "Bank of Israel"),
    ("Endpoint:", "https://www.boi.org.il/PublicApi/GetExchangeRates?asXml=true"),
    ("Data Returned:", "Official representative USD/ILS rate"),
    ("Update Frequency:", "Daily at ~3:30 PM Israel time"),
    ("CORS:", "No"),
    ("Format:", "XML"),
    ("CRE Use:", "Authoritative USD/ILS for Israeli investor return calculations. Government open data — unlimited, no auth."),
]))

# Source 18
story.append(source_block("18. CoinGecko Basic", [
    ("Provider:", "CoinGecko"),
    ("Endpoint:", "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"),
    ("Data Returned:", "Crypto prices (BTC, ETH, stablecoins)"),
    ("Update Frequency:", "Real-time"),
    ("CORS:", "Yes"),
    ("Format:", "JSON"),
    ("CRE Use:", "BTC/USD ticker. Live test: $71,329."),
]))

# Sources 19-29 (brief)
brief_sources = [
    ("19. Census TIGER Boundaries", [
        ("Provider:", "US Census Bureau"),
        ("Endpoint:", "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/"),
        ("Data:", "Census tract, block group, county, MSA, ZIP boundaries as vector geometries"),
        ("CRE Use:", "Geospatial base layer for all demographic and economic overlays; property-to-tract mapping."),
    ]),
    ("20. HUD Opportunity Zones / QCT", [
        ("Provider:", "US Dept. of Housing and Urban Development"),
        ("Endpoint:", "https://hudgis-hud.opendata.arcgis.com/"),
        ("Data:", "Opportunity Zones (IRC §1400Z), Qualified Census Tracts, Difficult Development Areas"),
        ("CRE Use:", "Tax incentive screening for investors; identifies OZ-eligible parcels."),
    ]),
    ("21. OSM Overpass API", [
        ("Provider:", "OpenStreetMap Foundation"),
        ("Endpoint:", "https://overpass-api.de/api/interpreter"),
        ("Data:", "POI locations (grocery, transit, schools, hospitals), road network, land use"),
        ("CRE Use:", "Walk-score proxy; amenity density analysis; competitive landscape mapping."),
    ]),
    ("22. MRLC NLCD Land Cover", [
        ("Provider:", "Multi-Resolution Land Characteristics Consortium"),
        ("Endpoint:", "https://www.mrlc.gov/data-services-page"),
        ("Data:", "30-meter land cover classification (developed, forest, agriculture, wetland, etc.)"),
        ("CRE Use:", "Development potential assessment; impervious surface analysis for stormwater."),
    ]),
    ("23. Microsoft Building Footprints", [
        ("Provider:", "Microsoft / GitHub"),
        ("Endpoint:", "https://github.com/microsoft/USBuildingFootprints"),
        ("Data:", "ML-derived building footprints for every structure in the US (130M+ buildings)"),
        ("CRE Use:", "Building inventory, density analysis, development pattern tracking."),
    ]),
    ("24. Zillow Research CSV", [
        ("Provider:", "Zillow Research"),
        ("Endpoint:", "https://www.zillow.com/research/data/"),
        ("Data:", "ZHVI (Home Value Index), ZORI (Rent Index), inventory, days-on-market by ZIP/MSA"),
        ("CRE Use:", "Residential market context for multifamily underwriting; rent growth trends."),
    ]),
    ("25. NOAA Storm Events", [
        ("Provider:", "NOAA / NCEI"),
        ("Endpoint:", "https://www.ncdc.noaa.gov/stormevents/ftp.jsp"),
        ("Data:", "Historical severe weather events with damage estimates, locations, narratives"),
        ("CRE Use:", "Property insurance risk modeling; historical storm damage by county."),
    ]),
    ("26. NOAA Climate Normals", [
        ("Provider:", "NOAA / NCEI"),
        ("Endpoint:", "https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals"),
        ("Data:", "30-year climate normals (temperature, precipitation, degree days) by station"),
        ("CRE Use:", "Energy cost modeling; climate risk baseline for property operations."),
    ]),
    ("27. USDA Cropland Data Layer", [
        ("Provider:", "USDA NASS"),
        ("Endpoint:", "https://nassgeodata.gmu.edu/CropScape/"),
        ("Data:", "30-meter crop-type classification covering all US agricultural land"),
        ("CRE Use:", "Agricultural land valuation; development conversion potential for fringe parcels."),
    ]),
    ("28. FBI UCR Crime Data", [
        ("Provider:", "FBI Criminal Justice Information Services"),
        ("Endpoint:", "https://api.usa.gov/crime/fbi/cde/"),
        ("Data:", "Uniform Crime Reporting data by agency, state, and national level"),
        ("CRE Use:", "Property-level crime risk scoring; tenant/resident safety assessment."),
    ]),
    ("29. US Treasury Auction Results", [
        ("Provider:", "US Treasury / TreasuryDirect"),
        ("Endpoint:", "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/"),
        ("Data:", "Auction results, debt outstanding, average interest rates on federal debt"),
        ("CRE Use:", "Treasury market supply dynamics; real-time auction demand signals."),
    ]),
]

for name, fields in brief_sources:
    story.append(source_block(name, fields))

story.append(PageBreak())

# ────────────── PAGES 7-8: TIER 2 ──────────────
story.append(Paragraph("TIER 2: FREE API KEY REQUIRED", s_h1))
story.append(gold_line())
story.append(Paragraph(
    "One-time registration. 30–120 seconds. Permanent keys. No credit card.",
    s_tier_subtitle))
story.append(Spacer(1, 4))

# FRED API — expanded
story.append(tier2_block("1. FRED API (Federal Reserve Economic Data)", [
    ("Registration:", "https://fred.stlouisfed.org/docs/api/api_key.html"),
    ("Rate Limit:", "120 requests/minute"),
    ("Data Scope:", "800,000+ time series — the most comprehensive free economic database in the world"),
    ("CORS:", "No (server-side proxy required)"),
    ("Format:", "JSON / XML"),
    ("Top 15 CRE-Critical Series:", "DGS10 (10Y Treasury), DGS2 (2Y Treasury), DGS30 (30Y Treasury), MORTGAGE30US (30Y mortgage rate), SOFR (Secured Overnight Financing Rate), DRCRELEXFACBS (CRE loan delinquency rate), H8B3219NCBCMG (weekly CRE loan balances), HOUST (housing starts), PERMIT (building permits), CPIAUCSL (CPI — inflation), UNRATE (unemployment rate), GDPNOW (Atlanta Fed GDP nowcast), UMCSENT (consumer sentiment), COMREPUSQ159N (commercial RE price index), BOGZ1FL075035503Q (Z.1 Flow of Funds CRE)"),
]))

story.append(tier2_block("2. Census Bureau API", [
    ("Registration:", "https://api.census.gov/data/key_signup.html"),
    ("Rate Limit:", "500 requests/day (soft limit; generally higher in practice)"),
    ("Data Scope:", "ACS 5-year, ACS 1-year, Decennial Census, Economic Census, Population Estimates"),
    ("Key CRE Series:", "Median household income, population growth, housing tenure, vacancy rates, commute times, poverty rates by tract"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("3. BLS API v2", [
    ("Registration:", "https://data.bls.gov/registrationEngine/"),
    ("Rate Limit:", "500 requests/day, 50 series per query, 20 years of data"),
    ("Data Scope:", "CPI, PPI, employment, wages, occupational data — all at metro/county level"),
    ("Key CRE Series:", "LAUS unemployment by county, CPI-U shelter component, QCEW employment by NAICS"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("4. BEA (Bureau of Economic Analysis)", [
    ("Registration:", "https://apps.bea.gov/API/signup/"),
    ("Rate Limit:", "100 requests/minute"),
    ("Data Scope:", "GDP by metro, personal income by county, regional price parities, industry output"),
    ("Key CRE Series:", "GDP by MSA, per capita personal income, regional price parities (RPP) for rent-adjusted comparisons"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("5. EIA (Energy Information Administration)", [
    ("Registration:", "https://www.eia.gov/opendata/register.php"),
    ("Rate Limit:", "Generous (undisclosed soft limit)"),
    ("Data Scope:", "Energy prices (electricity, natural gas, petroleum), consumption, generation by state"),
    ("Key CRE Series:", "Commercial electricity rates by state, natural gas prices, energy expenditure forecasts"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("6. Finnhub", [
    ("Registration:", "https://finnhub.io/register"),
    ("Rate Limit:", "60 calls/minute (free tier)"),
    ("Data Scope:", "Real-time stock quotes, company financials, earnings, SEC filings, economic calendar"),
    ("Key CRE Series:", "REIT stock prices (VNQ, SPG, PLD, O), earnings surprises, insider trades"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("7. Polygon.io", [
    ("Registration:", "https://polygon.io/dashboard/signup"),
    ("Rate Limit:", "5 calls/minute (free tier), delayed quotes"),
    ("Data Scope:", "Stocks, options, forex, crypto; historical aggregates, trade-level data"),
    ("Key CRE Series:", "REIT index tracking, sector rotation signals, VIX correlation"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("8. Alpha Vantage", [
    ("Registration:", "https://www.alphavantage.co/support/#api-key"),
    ("Rate Limit:", "25 requests/day (free tier)"),
    ("Data Scope:", "Stock time series, forex, crypto, technical indicators, fundamental data"),
    ("Key CRE Series:", "Treasury yield time series, mortgage REIT dividend yields, sector performance"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("9. Walk Score", [
    ("Registration:", "https://www.walkscore.com/professional/api-sign-up.php"),
    ("Rate Limit:", "5,000 calls/day (free tier)"),
    ("Data Scope:", "Walk Score, Transit Score, Bike Score for any US lat/lon"),
    ("Key CRE Series:", "Walk Score (0–100), Transit Score, Bike Score — strong rent premium correlators"),
    ("CORS:", "No"),
]))

story.append(tier2_block("10. OpenWeather", [
    ("Registration:", "https://openweathermap.org/appid"),
    ("Rate Limit:", "1,000 calls/day (free tier)"),
    ("Data Scope:", "Current weather, 5-day forecast, historical weather, air pollution index"),
    ("Key CRE Series:", "Severe weather alerts, historical temperature extremes, air quality by property location"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("11. HUD User", [
    ("Registration:", "https://www.huduser.gov/hudapi/public/register"),
    ("Rate Limit:", "Undisclosed (generous)"),
    ("Data Scope:", "Fair Market Rents, income limits, LIHTC, Section 8, housing affordability data"),
    ("Key CRE Series:", "FMR by ZIP (Section 8 rent ceiling), income limits for LIHTC underwriting, housing affordability index"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("12. Regulations.gov", [
    ("Registration:", "https://api.data.gov/signup/"),
    ("Rate Limit:", "1,000 calls/hour"),
    ("Data Scope:", "Federal regulatory docket search, proposed rules, public comments"),
    ("Key CRE Series:", "HUD, FDIC, OCC, CFPB proposed rules affecting CRE lending and compliance"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("13. CoinGecko Demo API", [
    ("Registration:", "https://www.coingecko.com/en/api/pricing"),
    ("Rate Limit:", "30 calls/minute"),
    ("Data Scope:", "Crypto market data, historical prices, exchange volumes, DeFi protocols"),
    ("Key CRE Series:", "BTC/USD, stablecoin market cap, DeFi TVL — alternative capital flow indicators"),
    ("CORS:", "Yes"),
]))

story.append(tier2_block("14. Twelve Data", [
    ("Registration:", "https://twelvedata.com/register"),
    ("Rate Limit:", "800 calls/day (free tier), 8 calls/minute"),
    ("Data Scope:", "Real-time and historical stock/forex/crypto, technical indicators, fundamentals"),
    ("Key CRE Series:", "REIT ETF tracking, forex pairs (USD/ILS, EUR/USD), yield curve time series"),
    ("CORS:", "Yes"),
]))

story.append(PageBreak())

# ────────────── PAGES 9-10: TIER 3 ──────────────
story.append(Paragraph("TIER 3: PAID — INSTITUTIONAL GRADE", s_h1))
story.append(gold_line())
story.append(Paragraph(
    "Activated as deal flow justifies the spend. Each source below is a vendor relationship.",
    s_tier_subtitle))
story.append(Spacer(1, 4))

tier3_sources = [
    ("1. CoStar", [
        ("URL:", "https://www.costar.com"),
        ("Annual Cost:", "$25,000–$50,000 per seat"),
        ("Data:", "CRE comps (sales, leases), property details, tenant information, market analytics, vacancy/absorption"),
        ("CRE Use:", "Gold-standard CRE comparable database; required for institutional-quality underwriting."),
    ]),
    ("2. MSCI Real Capital Analytics (RCA)", [
        ("URL:", "https://www.msci.com/real-assets"),
        ("Annual Cost:", "$30,000–$60,000"),
        ("Data:", "Verified $2.5M+ CRE transaction data, cap rate trends, capital flows by metro/sector"),
        ("CRE Use:", "Transaction-level pricing intelligence; cap rate trend analysis; investor tracking."),
    ]),
    ("3. Trepp", [
        ("URL:", "https://www.trepp.com"),
        ("Annual Cost:", "$20,000–$45,000"),
        ("Data:", "CMBS loan-level data, delinquency, special servicing, CLO analytics"),
        ("CRE Use:", "CMBS surveillance; distressed debt screening; maturity wall analysis."),
    ]),
    ("4. Yardi Matrix", [
        ("URL:", "https://www.yardimatrix.com"),
        ("Annual Cost:", "$15,000–$35,000"),
        ("Data:", "Multifamily rent comps, property-level financials, pipeline tracking"),
        ("CRE Use:", "Multifamily underwriting — rent comps, occupancy trends, new supply pipeline."),
    ]),
    ("5. Moody's CRE", [
        ("URL:", "https://cre.moodysanalytics.com"),
        ("Annual Cost:", "$20,000–$50,000"),
        ("Data:", "Property valuations, forecasted NOI, loss severity models, MSA forecasts"),
        ("CRE Use:", "Default probability models; portfolio-level risk analytics; regulatory stress testing."),
    ]),
    ("6. Reonomy", [
        ("URL:", "https://www.reonomy.com"),
        ("Annual Cost:", "$10,000–$25,000"),
        ("Data:", "Property ownership, debt records, tax assessment, building details, owner contact info"),
        ("CRE Use:", "Off-market deal sourcing; owner identification; debt maturity screening."),
    ]),
    ("7. Cherre", [
        ("URL:", "https://www.cherre.com"),
        ("Annual Cost:", "$25,000–$75,000"),
        ("Data:", "Unified CRE data platform — tax, deed, mortgage, permit, environmental, demographics"),
        ("CRE Use:", "Data warehouse integration; property-level enrichment from 30+ underlying sources."),
    ]),
    ("8. Placer.ai", [
        ("URL:", "https://www.placer.ai"),
        ("Annual Cost:", "$15,000–$40,000"),
        ("Data:", "Foot traffic analytics, visitor demographics, trade area analysis, cross-shopping"),
        ("CRE Use:", "Retail/hospitality underwriting — actual foot traffic vs. pro forma assumptions."),
    ]),
    ("9. ATTOM Data", [
        ("URL:", "https://www.attomdata.com"),
        ("Annual Cost:", "$5,000–$25,000"),
        ("Data:", "Property tax, deed, mortgage, foreclosure, hazard risk, school ratings"),
        ("CRE Use:", "Comprehensive property enrichment; foreclosure pipeline monitoring; hazard risk."),
    ]),
    ("10. Precisely (formerly Pitney Bowes)", [
        ("URL:", "https://www.precisely.com"),
        ("Annual Cost:", "$10,000–$30,000"),
        ("Data:", "Address verification, geocoding, parcel boundaries, property attributes"),
        ("CRE Use:", "Address normalization and geocoding backbone; parcel-level geometry."),
    ]),
    ("11. CoreLogic", [
        ("URL:", "https://www.corelogic.com"),
        ("Annual Cost:", "$15,000–$40,000"),
        ("Data:", "MLS data, property valuations (AVM), mortgage performance, natural hazard risk"),
        ("CRE Use:", "Residential comp data for multifamily; AVM validation; flood/fire/wind risk scoring."),
    ]),
    ("12. S&P Global Market Intelligence", [
        ("URL:", "https://www.spglobal.com/marketintelligence"),
        ("Annual Cost:", "$25,000–$60,000"),
        ("Data:", "Bank financial data, CRE loan portfolios, credit ratings, economic forecasts"),
        ("CRE Use:", "Lender analysis; bank CRE concentration ratios; credit market intelligence."),
    ]),
    ("13. Bloomberg Terminal", [
        ("URL:", "https://www.bloomberg.com/professional/"),
        ("Annual Cost:", "$25,000 per seat"),
        ("Data:", "Real-time financial data, CMBS pricing, yield curves, economic releases, news"),
        ("CRE Use:", "Real-time market data backbone (note: Terminal pulls much of the same underlying data for free)."),
    ]),
    ("14. Reis (Moody's)", [
        ("URL:", "https://www.reis.com"),
        ("Annual Cost:", "$15,000–$35,000"),
        ("Data:", "Submarket-level rent, vacancy, absorption forecasts for office, retail, industrial, multifamily"),
        ("CRE Use:", "Submarket supply/demand forecasting; rent growth projections for DCF models."),
    ]),
    ("15. Green Street", [
        ("URL:", "https://www.greenstreet.com"),
        ("Annual Cost:", "$20,000–$50,000"),
        ("Data:", "REIT analytics, CPPI (property price index), sector outlooks, NAV estimates"),
        ("CRE Use:", "Public-market CRE pricing signals; REIT vs. private market spread analysis."),
    ]),
    ("16. Lightbox (formerly DMP/EDR)", [
        ("URL:", "https://www.lightboxre.com"),
        ("Annual Cost:", "$10,000–$30,000"),
        ("Data:", "Environmental risk reports, Phase I database, property tax, demographics, parcel data"),
        ("CRE Use:", "Environmental due diligence; Phase I ESA database searches; parcel mapping."),
    ]),
    ("17. Axiometrics (RealPage)", [
        ("URL:", "https://www.realpage.com/analytics/"),
        ("Annual Cost:", "$12,000–$30,000"),
        ("Data:", "Multifamily market analytics, rent forecasts, pipeline tracking, lease transaction data"),
        ("CRE Use:", "Multifamily rent forecasting; competitive set analysis; new supply impact modeling."),
    ]),
    ("18. CompStak", [
        ("URL:", "https://www.compstak.com"),
        ("Annual Cost:", "$8,000–$20,000"),
        ("Data:", "Lease comps (office, retail, industrial) — crowdsourced from brokers, verified"),
        ("CRE Use:", "Lease comparable analysis; effective rent benchmarking; tenant credit analysis."),
    ]),
    ("19. Orbital Insight", [
        ("URL:", "https://www.orbitalinsight.com"),
        ("Annual Cost:", "$20,000–$50,000"),
        ("Data:", "Satellite imagery analytics — parking lot occupancy, construction progress, land use change"),
        ("CRE Use:", "Alternative data for retail traffic, warehouse utilization, development monitoring."),
    ]),
    ("20. Dun & Bradstreet", [
        ("URL:", "https://www.dnb.com"),
        ("Annual Cost:", "$5,000–$25,000"),
        ("Data:", "Business credit reports, company financials, industry classification, corporate linkage"),
        ("CRE Use:", "Tenant credit analysis; business health scoring; corporate family tree for lease guarantor analysis."),
    ]),
]

for name, fields in tier3_sources:
    for el in tier3_block(name, fields):
        story.append(el)

story.append(PageBreak())

# ────────────── PAGE 11: INVESTOR FAQ ──────────────
story.append(Paragraph("Frequently Asked Questions", s_h1))
story.append(gold_line())
story.append(Spacer(1, 8))

faqs = [
    ("Q: If the data is free, can it disappear?",
     "A: These are Federal Reserve (operational since 1991), Bureau of Labor Statistics (since 1884), "
     "Census Bureau (since 1790), FEMA (National Flood Insurance Act of 1968). They are mandated by "
     "federal law. The Federal Reserve Act, the Census Act (Title 13 USC), and the Budget and Accounting "
     "Act of 1921 legally require these agencies to publish this data. Their APIs have been stable for "
     "10–30 years. Defunding would require an act of Congress."),

    ("Q: Is free data low quality?",
     "A: Bloomberg charges $25,000/year to display the same NY Fed SOFR rate and BLS employment data "
     "that Terminal pulls directly from the source for free. The data is identical — Bloomberg is a "
     "display layer. Terminal goes to the source, eliminating the middleman and the cost."),

    ("Q: What’s the real moat?",
     "A: The data is accessible to anyone who knows where to look. The 4-stage analytical pipeline, "
     "59 underwriting models, adversarial challenge engine, and provenance spine are not. The moat is "
     "not the data — it’s the intelligence layer that transforms 63 raw feeds into actionable CRE "
     "deal recommendations in under 90 seconds. Time to replicate: 12–18 months."),

    ("Q: What if paid sources get too expensive?",
     "A: Even at full Tier 3 deployment ($300K/year), Terminal processes 12,500+ deals/year — that’s "
     "$24 per deal analyzed. A single successful CRE acquisition generating even modest returns pays "
     "for a decade of data costs. The ROI is asymmetric: data cost is fixed, deal value is unbounded."),

    ("Q: How long does full deployment take?",
     "A: Tier 1 (29 sources): zero setup, operational immediately. Tier 2 (14 sources): under 15 minutes "
     "of registration. Tier 3 (20 sources): activated incrementally as deal volume justifies each vendor. "
     "Terminal is production-ready on Day 1 with 43 free sources."),

    ("Q: What happens if an API goes down?",
     "A: Terminal implements graceful degradation. Each data source has a staleness threshold. If SOFR "
     "hasn’t updated in 24 hours, the system flags it and falls back to the last known good value "
     "with a confidence adjustment. No single source failure blocks deal analysis."),
]

for q, a in faqs:
    story.append(Paragraph(q, s_faq_q))
    story.append(Paragraph(a, s_faq_a))

story.append(PageBreak())

# ────────────── PAGE 12: REGISTRATION CHECKLIST ──────────────
story.append(Paragraph("Appendix: Tier 2 Registration Checklist", s_h1))
story.append(gold_line())
story.append(Spacer(1, 6))
story.append(Paragraph(
    "Complete all 14 registrations below to unlock full Tier 2 access. Total time: under 15 minutes.",
    s_body))
story.append(Spacer(1, 8))

checklist_data = [
    ["#", "Source", "Registration URL", "Time", "Status"],
    ["1", "FRED API", "fred.stlouisfed.org/docs/api/api_key.html", "60 sec", "☐"],
    ["2", "Census Bureau", "api.census.gov/data/key_signup.html", "60 sec", "☐"],
    ["3", "BLS v2", "data.bls.gov/registrationEngine/", "60 sec", "☐"],
    ["4", "BEA", "apps.bea.gov/API/signup/", "60 sec", "☐"],
    ["5", "EIA", "www.eia.gov/opendata/register.php", "60 sec", "☐"],
    ["6", "Finnhub", "finnhub.io/register", "30 sec", "☐"],
    ["7", "Polygon.io", "polygon.io/dashboard/signup", "60 sec", "☐"],
    ["8", "Alpha Vantage", "alphavantage.co/support/#api-key", "30 sec", "☐"],
    ["9", "Walk Score", "walkscore.com/professional/api-sign-up.php", "90 sec", "☐"],
    ["10", "OpenWeather", "openweathermap.org/appid", "60 sec", "☐"],
    ["11", "HUD User", "huduser.gov/hudapi/public/register", "90 sec", "☐"],
    ["12", "Regulations.gov", "api.data.gov/signup/", "60 sec", "☐"],
    ["13", "CoinGecko Demo", "coingecko.com/en/api/pricing", "60 sec", "☐"],
    ["14", "Twelve Data", "twelvedata.com/register", "60 sec", "☐"],
]

col_widths = [PAGE_W*0.06, PAGE_W*0.18, PAGE_W*0.46, PAGE_W*0.14, PAGE_W*0.16]
checklist_table = Table(checklist_data, colWidths=col_widths)
checklist_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, 0), 9),
    ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
    ("FONTSIZE", (0, 1), (-1, -1), 8.5),
    ("ALIGN", (0, 0), (0, -1), "CENTER"),
    ("ALIGN", (3, 0), (3, -1), "CENTER"),
    ("ALIGN", (4, 0), (4, -1), "CENTER"),
    ("FONTSIZE", (4, 1), (4, -1), 14),  # bigger checkbox
    ("GRID", (0, 0), (-1, -1), 0.5, NAVY),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, Color(0.97, 0.97, 0.97)]),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 4),
]))
story.append(checklist_table)

story.append(Spacer(1, 16))
story.append(Paragraph(
    '<b>Total registration time: under 15 minutes</b>', s_bold_label))
story.append(Spacer(1, 8))
story.append(Paragraph(
    "After completing all registrations, store API keys in Terminal’s encrypted credential vault. "
    "Keys are permanent and do not expire unless revoked.",
    s_body))

# ── Page number footer ──
def add_page_number(canvas, doc):
    page_num = canvas.getPageNumber()
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GRAY)
    # Footer line
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(0.5)
    canvas.line(0.75*inch, 0.55*inch, letter[0] - 0.75*inch, 0.55*inch)
    # Page number right
    canvas.drawRightString(letter[0] - 0.75*inch, 0.4*inch, f"Page {page_num}")
    # Footer left
    canvas.drawString(0.75*inch, 0.4*inch, "RePrime Group — Terminal Data Intelligence Engine")
    canvas.restoreState()

def add_cover_footer(canvas, doc):
    """No page number on cover."""
    pass

# ── Build ──
doc.build(story, onFirstPage=add_cover_footer, onLaterPages=add_page_number)
print(f"PDF generated: {OUTPUT}")
