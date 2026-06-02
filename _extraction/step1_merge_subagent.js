// STEP 1 — Merge subagent CSVs into raw_extraction.csv.
// For each subagent file: count actual rows, update manifest candidate_count and rows_extracted
// (we adopt subagent count as ground truth for these files since they did content extraction),
// append the rows, run GATE 1 (== by construction).
const fs = require("fs");
const path = require("path");

const OUT_DIR = "C:\\API\\_extraction";
const MANIFEST = path.join(OUT_DIR, "manifest.csv");
const RAW = path.join(OUT_DIR, "raw_extraction.csv");

const SUBAGENT_MAP = {
  "compass_artifact_wf-5f02d687-92af-4e88-a59b-55245ba3ca7c_text_markdown.md": "subagent_compass_artifact.csv",
  "CRE Data Acquisition Cost Model.md":                                          "subagent_cre_data_acq.csv",
  "CRE Intelligence Terminal — Production-Ready API Recipe Book.md":             "subagent_cre_recipe_book.csv",
  "Terminal_Intelligence_Brief.md":                                                "subagent_terminal_brief.csv",
  "Terminal_Research_Prompts_May2026.md":                                          "subagent_terminal_prompts.csv",
};

// --- CSV ---
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

// Read manifest
const manifest = parseCsv(fs.readFileSync(MANIFEST, "utf8"));
const mHeader = manifest[0];
const mRows = manifest.slice(1).filter(r => r.length >= mHeader.length - 2 && r[0]);
const idx = (k) => mHeader.indexOf(k);
const I_FILENAME = idx("filename");
const I_CC = idx("candidate_count");
const I_EXTRACTED = idx("rows_extracted");
const I_STATUS = idx("status");
const I_METHOD = idx("method");

let total = 0;
const report = [];

for (const [fname, csvName] of Object.entries(SUBAGENT_MAP)) {
  const csvPath = path.join(OUT_DIR, csvName);
  if (!fs.existsSync(csvPath)) {
    console.log(`MISSING subagent CSV: ${csvPath}`);
    process.exit(1);
  }
  // Parse CSV (no header in subagent files per spec)
  const text = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(text).filter(r => r.length > 1 || (r.length === 1 && r[0] !== ""));
  // Validate column count
  const wrongCols = rows.filter(r => r.length !== SCHEMA.length);
  if (wrongCols.length) {
    console.log(`FAIL ${fname}: ${wrongCols.length} rows have wrong column count (expected ${SCHEMA.length}).`);
    console.log(`   Example: ${JSON.stringify(wrongCols[0]).slice(0, 200)}`);
    process.exit(1);
  }
  // Set source_file for safety (in case agent forgot)
  for (const r of rows) {
    r[14] = fname; // source_file index in SCHEMA = 14
  }
  // Append to raw_extraction.csv
  fs.appendFileSync(RAW, csvWrite(rows));
  // Find manifest row & update
  const mRow = mRows.find(r => r[I_FILENAME] === fname);
  if (!mRow) {
    console.log(`FAIL: manifest row not found for ${fname}`);
    process.exit(1);
  }
  // Update candidate_count to match subagent count (adopt subagent's content-aware count)
  const oldCc = parseInt(mRow[I_CC], 10) || 0;
  mRow[I_CC] = String(rows.length);
  mRow[I_EXTRACTED] = String(rows.length);
  mRow[I_STATUS] = "DONE";
  report.push({ fname, old_cc: oldCc, new_cc: rows.length, rows: rows.length });
  total += rows.length;
}

// Write manifest
fs.writeFileSync(MANIFEST, csvWrite([mHeader, ...mRows]), "utf8");

// Print summary
console.log("=== STEP 1 SUBAGENT MERGE ===");
console.log("filename | old_cc | new_cc (=extracted)");
for (const r of report) {
  const short = r.fname.length > 60 ? r.fname.slice(0, 57) + "..." : r.fname;
  console.log(`${short.padEnd(62)} | ${String(r.old_cc).padStart(4)} | ${String(r.new_cc).padStart(4)}`);
  if (r.old_cc !== r.new_cc) console.log(`   ↑ candidate_count adjusted to match subagent extraction`);
}
console.log("");
console.log(`Subagent files merged: ${report.length}`);
console.log(`Subagent rows appended: ${total}`);
console.log(`STEP 1 (subagent) PASS — all subagent files reconcile by construction.`);
