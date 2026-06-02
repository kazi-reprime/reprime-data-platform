// STEP 4 — Dedup + provenance. Build the Master tab.
// Canonicalize by normalized endpoint_url; fallback provider+source_name.
// provenance_files = ; joined source_files. occurrence_count = number of raw occurrences.
// Keep raw_extraction.csv intact.
// Assert sum(Master.occurrence_count) == raw row count.
const fs = require("fs");
const path = require("path");

const OUT_DIR = "C:\\API\\_extraction";
const RAW = path.join(OUT_DIR, "raw_extraction.csv");
const MASTER = path.join(OUT_DIR, "master.csv");

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

function normUrl(u) {
  if (!u) return "";
  let s = String(u).trim().toLowerCase();
  // strip protocol
  s = s.replace(/^https?:\/\//, "");
  // strip trailing slash + querystring + fragment
  s = s.split("?")[0].split("#")[0].replace(/\/$/, "");
  // strip "www."
  s = s.replace(/^www\./, "");
  return s;
}

function normName(s) {
  if (!s) return "";
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function identityKey(row) {
  const url = row.endpoint_url;
  const n = normUrl(url);
  if (n && /\./.test(n)) return `url::${n}`;
  // fallback: provider+source_name
  const p = normName(row.provider);
  const s = normName(row.source_name);
  if (s) return `name::${p}::${s}`;
  return null; // skip empty rows from grouping
}

const text = fs.readFileSync(RAW, "utf8");
const all = parseCsv(text);
const header = all[0];
const data = all.slice(1).filter(r => r.length === SCHEMA.length && r.some(v => v !== ""));
const initial = data.length;

// Group by identity key
const groups = new Map();
const noKey = [];
for (const r of data) {
  const obj = {};
  SCHEMA.forEach((k, i) => obj[k] = r[i] || "");
  const k = identityKey(obj);
  if (!k) { noKey.push(obj); continue; }
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(obj);
}

// Build master rows
const masterRows = [];
const conflictFiles = new Set();
for (const [k, members] of groups) {
  const master = {};
  for (const f of SCHEMA) master[f] = "";
  // Take most-complete value per field
  const fieldsToConsolidate = ["source_name", "type", "provider", "category", "endpoint_url", "auth", "price_tier", "update_freq", "granularity", "fields_returned", "cors", "rate_limit", "integration_path", "cre_use", "status_flag"];
  for (const fld of fieldsToConsolidate) {
    let best = "";
    for (const m of members) {
      const v = m[fld] || "";
      if (v && v.length > best.length) best = v;
    }
    master[fld] = best;
  }
  // Source file fields → list of original files (de-duped)
  const files = Array.from(new Set(members.map(m => m.source_file).filter(Boolean)));
  master.source_file = files.join("; ");
  master.source_locator = members.map(m => `${m.source_file}@${m.source_locator}`).join(" || ");
  master.provenance_files = files.join("; ");
  master.occurrence_count = String(members.length);
  // If material conflict (different non-empty values for endpoint_url/auth/price_tier across members), flag REVIEW
  for (const fld of ["endpoint_url", "auth", "price_tier"]) {
    const distinct = new Set(members.map(m => (m[fld] || "").trim()).filter(Boolean));
    if (distinct.size > 1) {
      if (master.status_flag === "OK") master.status_flag = "REVIEW";
    }
  }
  masterRows.push(master);
}

// Also add no-key rows as singleton master rows (status REVIEW)
for (const obj of noKey) {
  const master = { ...obj };
  master.occurrence_count = "1";
  master.provenance_files = obj.source_file || "";
  if (master.status_flag === "OK") master.status_flag = "REVIEW";
  masterRows.push(master);
}

// Conservation check
const sumOcc = masterRows.reduce((s, m) => s + (parseInt(m.occurrence_count, 10) || 0), 0);
if (sumOcc !== initial) {
  console.log(`STEP 4 FAIL — sum(Master.occurrence_count)=${sumOcc} != raw row count=${initial}`);
  process.exit(1);
}

// Write master.csv
const out = [SCHEMA, ...masterRows.map(m => SCHEMA.map(k => m[k] !== undefined ? m[k] : ""))];
fs.writeFileSync(MASTER, csvWrite(out), "utf8");

console.log(`Raw rows: ${initial}`);
console.log(`Master rows (deduped unique): ${masterRows.length}`);
console.log(`Sum of occurrence_count: ${sumOcc}`);
console.log(`STEP 4 PASS — ${initial} raw → ${masterRows.length} unique, occurrences reconcile.`);
