// Build a slim "Top Sources" CSV that fits in a single create_file MCP call.
// Pulls top N rows by occurrence_count from master.csv, keeping only essential cols.
const fs = require("fs");
const path = require("path");

const MASTER = "C:\\API\\_extraction\\master.csv";
const SLIM = "C:\\API\\_extraction\\master_slim_top.csv";

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

const text = fs.readFileSync(MASTER, "utf8");
const all = parseCsv(text);
const header = all[0];
const data = all.slice(1).filter(r => r.length === header.length);

const idx = (k) => header.indexOf(k);
const I_NAME = idx("source_name");
const I_PROV = idx("provider");
const I_CAT = idx("category");
const I_TYPE = idx("type");
const I_URL = idx("endpoint_url");
const I_AUTH = idx("auth");
const I_PRICE = idx("price_tier");
const I_CRE = idx("cre_use");
const I_OCC = idx("occurrence_count");

// Truncate function
function trunc(s, n) {
  if (!s) return "";
  s = String(s);
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

// Sort by occurrence_count desc, then by name
const sorted = data.slice().sort((a, b) => {
  const oa = parseInt(a[I_OCC], 10) || 0;
  const ob = parseInt(b[I_OCC], 10) || 0;
  if (ob !== oa) return ob - oa;
  return (a[I_NAME] || "").localeCompare(b[I_NAME] || "");
});

// Keep top 300 + slim columns
const N = 300;
const top = sorted.slice(0, N);

const slimHeader = ["rank", "source_name", "provider", "category", "type", "endpoint_url", "auth", "price_tier", "cre_use_short", "occurrence_count"];
const slimRows = top.map((r, i) => [
  String(i + 1),
  trunc(r[I_NAME], 80),
  trunc(r[I_PROV], 40),
  r[I_CAT],
  r[I_TYPE],
  trunc(r[I_URL], 120),
  trunc(r[I_AUTH], 40),
  trunc(r[I_PRICE], 40),
  trunc(r[I_CRE], 120),
  r[I_OCC],
]);

fs.writeFileSync(SLIM, csvWrite([slimHeader, ...slimRows]), "utf8");

const stat = fs.statSync(SLIM);
console.log(`Wrote ${SLIM}`);
console.log(`Rows: ${slimRows.length}, file bytes: ${stat.size}`);
