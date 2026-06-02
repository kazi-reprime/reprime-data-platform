// STEP 3 — Classify. Set type, category, integration_path per row using fixed enums.
// UNKNOWN where indeterminable; status_flag → UNCLASSIFIED.
// Print distribution. Assert row count unchanged.
const fs = require("fs");
const path = require("path");

const OUT_DIR = "C:\\API\\_extraction";
const RAW = path.join(OUT_DIR, "raw_extraction.csv");

function parseCsv(text) {
  const rows = [];
  let cur = []; let field = ""; let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i+1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\r") {}
      else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else field += c;
    }
  }
  if (field !== "" || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows;
}
function csvEscape(v) { if (v == null) return ""; const s = String(v); return /[",\r\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; }
function csvWrite(rows) { return rows.map(r => r.map(csvEscape).join(",")).join("\n") + "\n"; }

const SCHEMA = [
  "source_name", "type", "provider", "category", "endpoint_url", "auth", "price_tier",
  "update_freq", "granularity", "fields_returned", "cors", "rate_limit",
  "integration_path", "cre_use", "source_file", "source_locator", "status_flag",
  "provenance_files", "occurrence_count"
];

// File → default category map (used when row content is generic)
const FILE_CATEGORY = {
  "Agency Multifamily & Government Housing Data Layer  CRE Intelligence Terminal (1).md": "housing_re",
  "Agency Multifamily & Government Housing Data Layer  CRE Intelligence Terminal.md":     "housing_re",
  "compass_artifact_wf-5f02d687-92af-4e88-a59b-55245ba3ca7c_text_markdown.md":             "mixed",
  "CRE API Endpoint Catalog  100-Endpoint Master Reference.md":                           "mixed",
  "CRE Data Acquisition Cost Model.md":                                                   "infrastructure",
  "CRE Intelligence Terminal  Complete API Data Map (May 2026).md":                       "mixed",
  "CRE Intelligence Terminal  Complete RSS, API & Regulatory Feed Directory.md":          "news_sentiment",
  "CRE Intelligence Terminal — Production-Ready API Recipe Book.md":                      "news_sentiment",
  "CRE Investment Platform Financial Ticker API Reference Guide.md":                      "macro_indicator",
  "CRE Platform UI Library Guide  12-Category Visual Widget Stack.md":                    "other",
  "EXTRACTION_PROTOCOL.md":                                                                "other",
  "Free & Freemium Data Sources for Tracking Israeli Institutional Capital in US Real Estate.md": "israeli",
  "Free & Freemium US Commercial Real Estate Cap Rate Data  The Definitive Source Directory.md": "capital_markets",
  "Free & Freemium US Migration, Demographics & Labor Data Sources — MSA ZIP Intelligence Map for CRE Terminal.md": "demographic",
  "Free & Freemium US Tenant Distress + CMBS Loan Watchlist Data Source Map.md":          "capital_markets",
  "Free & Low-Cost CRE Market Intelligence Data Sources.md":                              "mixed",
  "Global Institutional Capital Flows Into US CRE  Free & Freemium Data Source Map (2024–2026).md": "capital_markets",
  "healthcare-cre-datasources.md":                                                         "other",
  "Industrial & Logistics CRE Demand-Signal Intelligence Layer  Free Endpoint-Grade Data Sources.md": "infrastructure",
  "Insurance Shock Intelligence Stack  Complete Free & Freemium Data Source Map for US Property Insurance Risk (2024–2026).md": "insurance_climate",
  "Israeli Financial Data Engine — Source Reference for US CRE Intelligence Terminal.md":  "israeli",
  "Open-Source GitHub Arsenal for a US CRE Intelligence Terminal.md":                      "other",
  "Power-Constrained Markets & Data-Center Site Selection  Exhaustive Free Freemium Data Source Map for US CRE Intelligence Terminal.md": "energy",
  "RePrime Terminal — Global Capital Context Bridge Layer  Free API Source Book.md":      "macro_indicator",
  "RePrime_Terminal_Master_Tools_APIs_Inventory (1).md":                                   "other",
  "Terminal_Intelligence_Brief.md":                                                         "other",
  "Terminal_Master_Tool_Intelligence_Inventory.md":                                         "other",
  "Terminal_Master_Tool_Inventory (2).md":                                                  "other",
  "Terminal_Research_Prompts_May2026.md":                                                   "mixed",
  "US Commercial Construction Pipeline & Cost Data  Bloomberg-Terminal Source Map.md":     "construction_pipeline",
  "US CRE Capital Markets & CMBS Free Data Source Map — Terminal Intelligence Stack.md":   "capital_markets",
  "US CRE Intelligence Terminal  Complete Free Data Source Catalog.md":                    "mixed",
  "US CRE Intelligence Terminal  Demand-Signal Data Source Directory.md":                  "demographic",
  "US Economic Development Incentives  Free & Freemium Data Source Map.md":                "economic",
  "US Hospitality & Travel Demand  Free Freemium Data Source Map for CRE Intelligence Terminal.md": "economic",
  "US Macro & Sentiment Indicator Layer — CRE Intelligence Terminal (1).md":               "macro_indicator",
  "US Macro & Sentiment Indicator Layer — CRE Intelligence Terminal.md":                   "macro_indicator",
  "US Retail Pulse & Office Return-to-Work  Free Data Source Master Map (2024–2026).md":   "economic",
  "US Zoning, Entitlement & Parcel Data  Free Freemium Source Map for CRE Intelligence Terminals.md": "zoning_parcel",
};

// Category keyword scoring (for row-level disambiguation when file is mixed)
const CATEGORY_KEYWORDS = {
  economic:              [/employment|labor|unemployment|wage|payroll|bls\b|qcew|laus|jobs|gdp|economic activity|business cycle|industry|naics|ces|jolts|consumer/i],
  demographic:           [/demograph|population|household|race|age|gender|education|income|poverty|acs\b|census\b(?! geocod)|migration|movers|cbp|zbp/i],
  hazard_environmental:  [/flood|wildfire|hurricane|tornado|seismic|earthquake|fema|noaa|nws|usgs|envirofacts|brownfield|superfund|epa\b|hazard|wetland|disaster|storm/i],
  infrastructure:        [/broadband|fcc bdc|transit|gtfs|transit feeds|tiger|geocoder|geocod|street network|osm|openstreetmap|overture|mapbox|osmnx|maplibre|highway|fhwa|usdot|deck\.gl|h3|scrap|proxy|fivetran|snowflake|aws|gcp|cloud|warehouse|infrastructure|cdn|api gateway|kafka|redis|vector db|embedding|warehouse|elt|etl/i],
  housing_re:            [/housing|rental|rent\b|vacancy|tenant|multifamily|apartment|rentcast|zillow|apartmentlist|hud\b|chas|fmr\b|housing index|hpi|mortgage30|case shiller/i],
  energy:                [/energy|electricity|natural gas|solar|pvwatts|nrel|nlr\b|eia\b|utility|grid|power|kwh|kw\b|battery|renewable/i],
  zoning_parcel:         [/zoning|parcel|attom|reonomy|regrid|datatree|cherre|cotality|corelogic|propertyradar|estated|datatrace|county assessor|recorder|deed|cadastre|land use/i],
  capital_markets:       [/cmbs|cre clo|trepp|cred[ -]?iq|nareit|reit\b|equity|bond|treasury|sofr|libor|fed funds|cap rate|noi\b|origination|delinquency|special servicing|sec edgar|10-?k\b|10-?q\b|nci|fdic|bankregdata|debtx|loan|nonperforming|servicer/i],
  news_sentiment:        [/gdelt|news|rss|feed\b|article|sentiment|federal register|fomc calendar|hearing|congressional|press release|edgar full|tone|gdelt doc|newsapi|beckers|modern healthcare|globes|calcalist|mjbiz|green market/i],
  insurance_climate:     [/insurance|premium|first street|hazardhub|climatecheck|cli?mate\b|nfip|carrier|exposure|underwriting risk/i],
  construction_pipeline: [/construction|building permits|permits|dodge|constructconnect|cmd\b|c-?30\b|new construction|pipeline starts|completions|new supply|building boom/i],
  israeli:               [/israel|israeli|tase\b|tel aviv|bank of israel|boi\b|cbs\b lamas|cbs gov\.il|magna|tsa|shahar|galil|maot|mashkanta|migdal|phoenix insurance|harel|menora|clal|altshuler|gazit|azrieli|alony-hetz|globes|calcalist|isa magna|usd\/ils|ils\b|sheqel|shekel/i],
  macro_indicator:       [/macro|fred\b|federal reserve|ny fed|fed funds|treasury yield|vix\b|dxy\b|us treasury|cpi\b|inflation|10[- ]?year|3[- ]?month|2y\b|yield curve|sofr\b|ecb|gold spot|brent|wti|copper|lumber|bitcoin|crypto|s&p 500|dow jones|sentiment indicator|consumer sentiment/i],
  other:                 [/^$/], // fallback only
};

// Type detection
function detectType(row) {
  const url = (row.endpoint_url || "").toLowerCase();
  const name = (row.source_name || "").toLowerCase();
  const cu = (row.cre_use || "").toLowerCase();
  const fr = (row.fields_returned || "").toLowerCase();
  const file = (row.source_file || "").toLowerCase();
  const blob = `${url} ${name} ${cu} ${fr}`;

  if (/\bmcp\b|model context protocol/i.test(blob)) return "MCP_CONNECTOR";
  if (/\brss\b|rss feed|\.rss\b|feed\.xml/i.test(blob)) return "RSS_FEED";
  if (/bulk (csv|download|zip|ftp)|\.zip\b|bulk file|ftp:\/\/|\.tar\.|tarball/i.test(blob)) return "BULK_DOWNLOAD";
  if (/scrap(e|er|ing)|web ?scrape|html parse|no api/i.test(blob)) return "SCRAPE_TARGET";
  if (/dataset portal|data\.gov|opendata|socrata|ckan/i.test(blob)) return "DATASET_PORTAL";
  if (/api\.|/.test(url) && /https?:\/\//.test(url)) return "RAW_API";
  if (/api\b|endpoint|rest|graphql|json|xbrl|sdmx/i.test(blob) && /https?:\/\//.test(url)) return "RAW_API";
  if (/https?:\/\//.test(url)) return "RAW_API";
  return "UNKNOWN";
}

function detectCategory(row) {
  const file = row.source_file;
  const blob = `${row.source_name || ""} ${row.cre_use || ""} ${row.fields_returned || ""} ${row.provider || ""}`;
  // Score each enum category
  const scores = {};
  for (const [cat, patterns] of Object.entries(CATEGORY_KEYWORDS)) {
    if (cat === "other") continue;
    let score = 0;
    for (const p of patterns) if (p.test(blob)) score++;
    scores[cat] = score;
  }
  // Pick highest score; if tied or zero, use file default
  let best = null, bestScore = 0;
  for (const [cat, sc] of Object.entries(scores)) {
    if (sc > bestScore) { bestScore = sc; best = cat; }
  }
  const fileDefault = FILE_CATEGORY[file];
  if (bestScore >= 1) return best;
  if (fileDefault && fileDefault !== "mixed") return fileDefault;
  return "other";
}

function detectIntegrationPath(row) {
  const blob = `${row.source_name || ""} ${row.cre_use || ""} ${row.provider || ""}`.toLowerCase();
  const hasMcp = /\bmcp\b|connector|connect/.test(blob);
  const hasUrl = /https?:\/\//.test(row.endpoint_url || "");
  if (hasMcp && hasUrl) return "HYBRID";
  if (hasMcp) return "BUY_CONNECTOR";
  if (hasUrl) return "BUILD_RAW_API";
  return "UNKNOWN";
}

// --- Main ---
const text = fs.readFileSync(RAW, "utf8");
const all = parseCsv(text);
const header = all[0];
const data = all.slice(1).filter(r => r.length === SCHEMA.length || r.length === SCHEMA.length - 1);

const idx = {};
SCHEMA.forEach((k, i) => idx[k] = i);

const initialCount = data.length;

let typeCounts = {};
let catCounts = {};
let pathCounts = {};
let unclassified = 0;

for (const row of data) {
  // Pad to schema length
  while (row.length < SCHEMA.length) row.push("");
  const obj = {};
  SCHEMA.forEach((k, i) => obj[k] = row[i] || "");
  const t = detectType(obj);
  const cat = detectCategory(obj);
  const ip = detectIntegrationPath(obj);
  row[idx.type] = t;
  row[idx.category] = cat;
  row[idx.integration_path] = ip;
  if (t === "UNKNOWN" || cat === "other" || ip === "UNKNOWN") {
    // Mark UNCLASSIFIED only if all three are unknown OR if status was OK (don't downgrade other flags)
    if (t === "UNKNOWN" && cat === "other" && ip === "UNKNOWN") {
      if (row[idx.status_flag] === "OK") row[idx.status_flag] = "UNCLASSIFIED";
      unclassified++;
    }
  }
  typeCounts[t] = (typeCounts[t] || 0) + 1;
  catCounts[cat] = (catCounts[cat] || 0) + 1;
  pathCounts[ip] = (pathCounts[ip] || 0) + 1;
}

// Write back
const out = [header, ...data];
fs.writeFileSync(RAW, csvWrite(out), "utf8");

// Print distributions
const sortBy = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);
console.log("Type distribution:");
for (const [k, v] of sortBy(typeCounts)) console.log(`  ${k.padEnd(18)} ${v}`);
console.log("");
console.log("Category distribution:");
for (const [k, v] of sortBy(catCounts)) console.log(`  ${k.padEnd(24)} ${v}`);
console.log("");
console.log("Integration_path distribution:");
for (const [k, v] of sortBy(pathCounts)) console.log(`  ${k.padEnd(18)} ${v}`);
console.log("");
console.log(`UNCLASSIFIED (all three UNKNOWN/other): ${unclassified}`);

const finalCount = data.length;
if (finalCount !== initialCount) {
  console.log(`STEP 3 FAIL — row count changed: initial=${initialCount}, final=${finalCount}`);
  process.exit(1);
}
console.log(`STEP 3 PASS — ${finalCount} rows classified, ${unclassified} UNCLASSIFIED flagged.`);
