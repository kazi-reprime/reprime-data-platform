// STEP 5 — Write local workbook (data_sources_registry.xlsx) with tabs:
//   Master, Raw, Review, Gaps, Manifest.
// Reopen the written workbook and assert tab row counts match in-memory counts.
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const OUT_DIR = "C:\\API\\_extraction";
const RAW = path.join(OUT_DIR, "raw_extraction.csv");
const MASTER = path.join(OUT_DIR, "master.csv");
const MANIFEST = path.join(OUT_DIR, "manifest.csv");
const REGISTRY_LOCAL = path.join(OUT_DIR, "data_sources_registry.xlsx");
const REGISTRY_TOP = "C:\\API\\data_sources_registry.xlsx";

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

const SCHEMA = [
  "source_name", "type", "provider", "category", "endpoint_url", "auth", "price_tier",
  "update_freq", "granularity", "fields_returned", "cors", "rate_limit",
  "integration_path", "cre_use", "source_file", "source_locator", "status_flag",
  "provenance_files", "occurrence_count"
];

// --- Read inputs ---
const rawAll = parseCsv(fs.readFileSync(RAW, "utf8"));
const rawHeader = rawAll[0];
const rawData = rawAll.slice(1).filter(r => r.length === SCHEMA.length);

const masterAll = parseCsv(fs.readFileSync(MASTER, "utf8"));
const masterHeader = masterAll[0];
const masterData = masterAll.slice(1).filter(r => r.length === SCHEMA.length);

const manifestAll = parseCsv(fs.readFileSync(MANIFEST, "utf8"));
const manifestHeader = manifestAll[0];
const manifestData = manifestAll.slice(1).filter(r => r.length >= 2 && r[0]);

// --- Build Review tab (rows where status_flag == REVIEW) ---
const reviewRows = masterData.filter(r => {
  const sIdx = SCHEMA.indexOf("status_flag");
  return r[sIdx] === "REVIEW";
});

// --- Build Gaps tab: every field flagged MISSING_FIELDS / UNKNOWN per row ---
// Columns: source_name | missing_field | source_file
const gapsHeader = ["source_name", "missing_field", "source_file"];
const gapsRows = [];
const gapFields = ["endpoint_url", "provider", "auth", "price_tier", "update_freq", "granularity", "fields_returned", "rate_limit", "cre_use"];
const fileIdx = SCHEMA.indexOf("source_file");
const nameIdx = SCHEMA.indexOf("source_name");
const typeIdx = SCHEMA.indexOf("type");
const catIdx = SCHEMA.indexOf("category");
const ipIdx = SCHEMA.indexOf("integration_path");
for (const r of masterData) {
  for (const f of gapFields) {
    const fi = SCHEMA.indexOf(f);
    if (!r[fi] || r[fi] === "UNKNOWN") {
      gapsRows.push([r[nameIdx], f, r[fileIdx]]);
    }
  }
  if (r[typeIdx] === "UNKNOWN") gapsRows.push([r[nameIdx], "type", r[fileIdx]]);
  if (r[catIdx] === "other" || r[catIdx] === "UNKNOWN") gapsRows.push([r[nameIdx], "category", r[fileIdx]]);
  if (r[ipIdx] === "UNKNOWN") gapsRows.push([r[nameIdx], "integration_path", r[fileIdx]]);
}

// --- Build workbook ---
function arrToSheet(headerRow, dataRows) {
  return XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
}

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, arrToSheet(masterHeader, masterData), "Master");
XLSX.utils.book_append_sheet(wb, arrToSheet(rawHeader, rawData), "Raw");
XLSX.utils.book_append_sheet(wb, arrToSheet(masterHeader, reviewRows), "Review");
XLSX.utils.book_append_sheet(wb, arrToSheet(gapsHeader, gapsRows), "Gaps");
XLSX.utils.book_append_sheet(wb, arrToSheet(manifestHeader, manifestData), "Manifest");

XLSX.writeFile(wb, REGISTRY_LOCAL);
// Also write a copy at C:\API for easy access
fs.copyFileSync(REGISTRY_LOCAL, REGISTRY_TOP);

// --- GATE 5: reopen and assert tab row counts match ---
const wb2 = XLSX.readFile(REGISTRY_LOCAL);
function sheetRowCount(name) {
  const ws = wb2.Sheets[name];
  if (!ws) return -1;
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
  return range.e.r - range.s.r; // minus header row
}

const tabs = {
  Master:   { expected: masterData.length,   got: sheetRowCount("Master") },
  Raw:      { expected: rawData.length,      got: sheetRowCount("Raw") },
  Review:   { expected: reviewRows.length,   got: sheetRowCount("Review") },
  Gaps:     { expected: gapsRows.length,     got: sheetRowCount("Gaps") },
  Manifest: { expected: manifestData.length, got: sheetRowCount("Manifest") },
};

let fail = false;
console.log("Tab counts (expected vs on disk):");
for (const [name, c] of Object.entries(tabs)) {
  const ok = c.got === c.expected;
  if (!ok) fail = true;
  console.log(`  ${name.padEnd(10)} expected=${String(c.expected).padStart(5)}  got=${String(c.got).padStart(5)}  ${ok ? "OK" : "MISMATCH"}`);
}
console.log("");
if (fail) {
  console.log("STEP 5 FAIL — workbook tab row counts diverge from memory.");
  process.exit(1);
}
console.log(`Workbook written: ${REGISTRY_LOCAL}`);
console.log(`Workbook copy:    ${REGISTRY_TOP}`);
console.log(`STEP 5 PASS — workbook verified on disk.`);
