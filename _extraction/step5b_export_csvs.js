// STEP 5b — Export per-tab CSVs (Review.csv, Gaps.csv) for Google Sheets upload.
// Master, Raw, Manifest already exist as .csv. Generate the two missing tabs.
const fs = require("fs");
const path = require("path");

const OUT_DIR = "C:\\API\\_extraction";
const MASTER = path.join(OUT_DIR, "master.csv");
const REVIEW = path.join(OUT_DIR, "review.csv");
const GAPS = path.join(OUT_DIR, "gaps.csv");

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

const all = parseCsv(fs.readFileSync(MASTER, "utf8"));
const header = all[0];
const data = all.slice(1).filter(r => r.length === SCHEMA.length);
const statusIdx = SCHEMA.indexOf("status_flag");

const review = data.filter(r => r[statusIdx] === "REVIEW");
fs.writeFileSync(REVIEW, csvWrite([header, ...review]), "utf8");

// Gaps: per row, list every flagged field
const gapsHeader = ["source_name", "missing_field", "source_file"];
const gapsRows = [];
const fileIdx = SCHEMA.indexOf("source_file");
const nameIdx = SCHEMA.indexOf("source_name");
const typeIdx = SCHEMA.indexOf("type");
const catIdx = SCHEMA.indexOf("category");
const ipIdx = SCHEMA.indexOf("integration_path");
const gapFields = ["endpoint_url", "provider", "auth", "price_tier", "update_freq", "granularity", "fields_returned", "rate_limit", "cre_use"];
for (const r of data) {
  for (const f of gapFields) {
    const fi = SCHEMA.indexOf(f);
    if (!r[fi] || r[fi] === "UNKNOWN") gapsRows.push([r[nameIdx], f, r[fileIdx]]);
  }
  if (r[typeIdx] === "UNKNOWN") gapsRows.push([r[nameIdx], "type", r[fileIdx]]);
  if (r[catIdx] === "other" || r[catIdx] === "UNKNOWN") gapsRows.push([r[nameIdx], "category", r[fileIdx]]);
  if (r[ipIdx] === "UNKNOWN") gapsRows.push([r[nameIdx], "integration_path", r[fileIdx]]);
}
fs.writeFileSync(GAPS, csvWrite([gapsHeader, ...gapsRows]), "utf8");

console.log(`review.csv: ${review.length} rows`);
console.log(`gaps.csv: ${gapsRows.length} rows`);
