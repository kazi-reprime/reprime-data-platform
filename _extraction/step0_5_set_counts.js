// STEP 0.5 — Set per-file candidate_count and detected_unit on manifest.
// Counts come from step0_5_report.json + manual review for ambiguous files.
const fs = require("fs");
const path = require("path");

const OUT_DIR = "C:\\API\\_extraction";
const MANIFEST = path.join(OUT_DIR, "manifest.csv");

// Per-file candidate count + detected unit + extraction method
// detected_unit values:
//   wide_table_rows = each data row in a markdown table with >=3 columns
//   h3_headers = each H3 header is one record (detail in following 2-col table or labeled lines)
//   h3_subsections = each H3 in a narrative document represents one section/vendor
//   bold_numbered_plus_table = combined bold-numbered records + table rows
//   narrative_with_table = mixed prose + table (subagent)
//   numbered_backslash_dot = numbered items "21\." style (subagent)
//   EMPTY_CONFIRMED = no records
const PLAN = {
  "Agency Multifamily & Government Housing Data Layer  CRE Intelligence Terminal (1).md": { count: 55, unit: "wide_table_rows", method: "code" },
  "Agency Multifamily & Government Housing Data Layer  CRE Intelligence Terminal.md":     { count: 55, unit: "wide_table_rows", method: "code" },
  "compass_artifact_wf-5f02d687-92af-4e88-a59b-55245ba3ca7c_text_markdown.md":             { count: 65, unit: "bold_numbered_plus_table", method: "subagent" },
  "CRE API Endpoint Catalog  100-Endpoint Master Reference.md":                           { count: 100, unit: "h3_headers", method: "code" },
  "CRE Data Acquisition Cost Model.md":                                                   { count: 19, unit: "h3_subsections", method: "subagent" },
  "CRE Intelligence Terminal  Complete API Data Map (May 2026).md":                       { count: 104, unit: "wide_table_rows", method: "code" },
  "CRE Intelligence Terminal  Complete RSS, API & Regulatory Feed Directory.md":          { count: 139, unit: "wide_table_rows", method: "code" },
  "CRE Intelligence Terminal — Production-Ready API Recipe Book.md":                      { count: 50, unit: "h2_recipes_with_variants", method: "subagent" },
  "CRE Investment Platform Financial Ticker API Reference Guide.md":                      { count: 29, unit: "h3_labeled_blocks", method: "code" },
  "CRE Platform UI Library Guide  12-Category Visual Widget Stack.md":                    { count: 75, unit: "wide_table_rows", method: "code" },
  "EXTRACTION_PROTOCOL.md":                                                                { count: 0,  unit: "EMPTY_CONFIRMED", method: "none" },
  "Free & Freemium Data Sources for Tracking Israeli Institutional Capital in US Real Estate.md": { count: 25, unit: "h3_headers", method: "code" },
  "Free & Freemium US Commercial Real Estate Cap Rate Data  The Definitive Source Directory.md":  { count: 107, unit: "wide_table_rows", method: "code" },
  "Free & Freemium US Migration, Demographics & Labor Data Sources — MSA ZIP Intelligence Map for CRE Terminal.md": { count: 68, unit: "wide_table_rows", method: "code" },
  "Free & Freemium US Tenant Distress + CMBS Loan Watchlist Data Source Map.md":          { count: 60, unit: "wide_table_rows", method: "code" },
  "Free & Low-Cost CRE Market Intelligence Data Sources.md":                              { count: 29, unit: "h3_headers", method: "code" },
  "Global Institutional Capital Flows Into US CRE  Free & Freemium Data Source Map (2024–2026).md": { count: 63, unit: "wide_table_rows", method: "code" },
  "healthcare-cre-datasources.md":                                                         { count: 58, unit: "wide_table_rows", method: "code" },
  "Industrial & Logistics CRE Demand-Signal Intelligence Layer  Free Endpoint-Grade Data Sources.md": { count: 68, unit: "wide_table_rows", method: "code" },
  "Insurance Shock Intelligence Stack  Complete Free & Freemium Data Source Map for US Property Insurance Risk (2024–2026).md": { count: 81, unit: "wide_table_rows", method: "code" },
  "Israeli Financial Data Engine — Source Reference for US CRE Intelligence Terminal.md":  { count: 75, unit: "wide_table_rows", method: "code" },
  "Open-Source GitHub Arsenal for a US CRE Intelligence Terminal.md":                      { count: 51, unit: "wide_table_rows", method: "code" },
  "Power-Constrained Markets & Data-Center Site Selection  Exhaustive Free Freemium Data Source Map for US CRE Intelligence Terminal.md": { count: 63, unit: "wide_table_rows", method: "code" },
  "RePrime Terminal — Global Capital Context Bridge Layer  Free API Source Book.md":      { count: 139, unit: "wide_table_rows", method: "code" },
  "RePrime_Terminal_Master_Tools_APIs_Inventory (1).md":                                   { count: 283, unit: "wide_table_rows", method: "code" },
  "Terminal_Intelligence_Brief.md":                                                         { count: 73, unit: "narrative_with_table", method: "subagent" },
  "Terminal_Master_Tool_Intelligence_Inventory.md":                                         { count: 118, unit: "wide_table_rows", method: "code" },
  "Terminal_Master_Tool_Inventory (2).md":                                                  { count: 118, unit: "h3_headers", method: "code" },
  "Terminal_Research_Prompts_May2026.md":                                                   { count: 56, unit: "numbered_backslash_dot", method: "subagent" },
  "US Commercial Construction Pipeline & Cost Data  Bloomberg-Terminal Source Map.md":     { count: 114, unit: "wide_table_rows", method: "code" },
  "US CRE Capital Markets & CMBS Free Data Source Map — Terminal Intelligence Stack.md":   { count: 99, unit: "wide_table_rows", method: "code" },
  "US CRE Intelligence Terminal  Complete Free Data Source Catalog.md":                    { count: 69, unit: "wide_table_rows", method: "code" },
  "US CRE Intelligence Terminal  Demand-Signal Data Source Directory.md":                  { count: 65, unit: "wide_table_rows", method: "code" },
  "US Economic Development Incentives  Free & Freemium Data Source Map.md":                { count: 51, unit: "wide_table_rows", method: "code" },
  "US Hospitality & Travel Demand  Free Freemium Data Source Map for CRE Intelligence Terminal.md": { count: 79, unit: "wide_table_rows", method: "code" },
  "US Macro & Sentiment Indicator Layer — CRE Intelligence Terminal (1).md":               { count: 113, unit: "wide_table_rows", method: "code" },
  "US Macro & Sentiment Indicator Layer — CRE Intelligence Terminal.md":                   { count: 113, unit: "wide_table_rows", method: "code" },
  "US Retail Pulse & Office Return-to-Work  Free Data Source Master Map (2024–2026).md":   { count: 54, unit: "wide_table_rows", method: "code" },
  "US Zoning, Entitlement & Parcel Data  Free Freemium Source Map for CRE Intelligence Terminals.md": { count: 84, unit: "wide_table_rows", method: "code" },
};

// --- CSV utilities (RFC 4180-ish) ---
function parseCsv(text) {
  const rows = [];
  let cur = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\r") { /* skip */ }
      else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else field += c;
    }
  }
  if (field !== "" || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows;
}

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function csvWrite(rows) {
  return rows.map((r) => r.map(csvEscape).join(",")).join("\n") + "\n";
}

// --- Main ---
const text = fs.readFileSync(MANIFEST, "utf8");
const rows = parseCsv(text);
const header = rows[0];
const dataRows = rows.slice(1).filter((r) => r.length >= header.length - 2 && r[0]);

// Add "method" column if not present
let idxMethod = header.indexOf("method");
if (idxMethod === -1) { header.push("method"); idxMethod = header.length - 1; }
const idxFilename = header.indexOf("filename");
const idxCandidateCount = header.indexOf("candidate_count");
const idxDetectedUnit = header.indexOf("detected_unit");
const idxStatus = header.indexOf("status");

let missing = [];
let total = 0;
const summary = [];

for (const row of dataRows) {
  while (row.length < header.length) row.push("");
  const fname = row[idxFilename];
  const plan = PLAN[fname];
  if (!plan) {
    missing.push(fname);
    continue;
  }
  row[idxCandidateCount] = String(plan.count);
  row[idxDetectedUnit] = plan.unit;
  row[idxMethod] = plan.method;
  if (plan.unit === "EMPTY_CONFIRMED") {
    row[idxStatus] = "EMPTY_CONFIRMED";
  } else {
    row[idxStatus] = "READY";
  }
  total += plan.count;
  summary.push({ fname, count: plan.count, unit: plan.unit, method: plan.method });
}

if (missing.length) {
  console.log(`STEP 0.5 FAIL — files not in plan:`);
  for (const m of missing) console.log(`  - ${m}`);
  process.exit(1);
}

// Sanity: GATE 0.5 — every file has candidate_count set (numeric, or EMPTY_CONFIRMED)
let gateFail = false;
for (const row of dataRows) {
  const c = row[idxCandidateCount];
  const s = row[idxStatus];
  if (c === "" || c === null || c === undefined) {
    console.log(`STEP 0.5 FAIL — file has null candidate_count: ${row[idxFilename]}`);
    gateFail = true;
  }
  if (c === "0" && s !== "EMPTY_CONFIRMED") {
    console.log(`STEP 0.5 FAIL — file has 0 candidates but not EMPTY_CONFIRMED: ${row[idxFilename]}`);
    gateFail = true;
  }
}
if (gateFail) process.exit(1);

// Write updated manifest
const out = [header, ...dataRows];
fs.writeFileSync(MANIFEST, csvWrite(out), "utf8");

// Print summary
console.log("Per-file plan:");
console.log("filename | candidate_count | detected_unit | method");
console.log("---");
for (const s of summary) {
  const short = s.fname.length > 60 ? s.fname.slice(0, 57) + "..." : s.fname;
  console.log(`${short.padEnd(62)} | ${String(s.count).padStart(4)} | ${s.unit.padEnd(28)} | ${s.method}`);
}
console.log("");
console.log(`Total files: ${dataRows.length}`);
console.log(`Total candidate records: ${total}`);
console.log(`Subagent files: ${summary.filter(s => s.method === "subagent").length}`);
console.log(`Code-extract files: ${summary.filter(s => s.method === "code").length}`);
console.log(`EMPTY_CONFIRMED: ${summary.filter(s => s.method === "none").length}`);
console.log("");
console.log(`STEP 0.5 PASS — all files have candidate_count, conservation begins`);
