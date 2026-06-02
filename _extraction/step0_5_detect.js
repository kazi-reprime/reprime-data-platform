// STEP 0.5 — Detect record structure per file.
// For each file, run multiple pattern counts. Heuristically pick the
// dominant record unit. Print all counts so I can verify manually.
const fs = require("fs");
const path = require("path");

const TARGET = "C:\\API";
const OUT_DIR = "C:\\API\\_extraction";
const MANIFEST_IN = path.join(OUT_DIR, "manifest.csv");
const MANIFEST_OUT = MANIFEST_IN;
const REPORT = path.join(OUT_DIR, "step0_5_report.json");

// --- CSV utils (RFC 4180-ish) ---
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

// --- Pattern detectors ---
function countHeaders(lines, level) {
  const re = new RegExp(`^#{${level}}\\s+\\S`);
  let n = 0;
  for (const l of lines) if (re.test(l)) n++;
  return n;
}

function listHeaders(lines, level) {
  const re = new RegExp(`^#{${level}}\\s+(.+)$`);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (m) out.push({ line: i + 1, text: m[1].trim() });
  }
  return out;
}

// Find markdown tables. A table = consecutive lines that start with | and contain |.
// First row = header, second = separator (---), rest = data.
function findTables(lines) {
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    if (l.startsWith("|") && l.endsWith("|") && l.length > 2) {
      // try to find a separator row at i+1
      const sep = (lines[i + 1] || "").trim();
      const isSep = /^\|[\s:|\-]+\|$/.test(sep) && sep.includes("-");
      if (isSep) {
        const cols = l.split("|").slice(1, -1).map((s) => s.trim());
        let j = i + 2;
        const dataRows = [];
        while (j < lines.length) {
          const dl = lines[j].trim();
          if (dl.startsWith("|") && dl.endsWith("|")) {
            // skip duplicate separator rows
            if (/^\|[\s:|\-]+\|$/.test(dl) && dl.includes("-")) { j++; continue; }
            dataRows.push({ line: j + 1, raw: dl });
            j++;
          } else break;
        }
        tables.push({
          start_line: i + 1,
          header_cols: cols,
          col_count: cols.length,
          data_row_count: dataRows.length,
          data_rows: dataRows,
        });
        i = j;
        continue;
      }
    }
    i++;
  }
  return tables;
}

// "Labeled record block" — looks for repeating field-label lines that mark records.
// e.g., "**SOURCE:**", "**URL:**", "**ENDPOINT:**", "**NAME:**"
function countLabelOccurrences(text, labels) {
  const re = new RegExp(`(?:^|\\n)\\s*(?:\\*\\*)?(?:${labels.join("|")})(?:\\*\\*)?\\s*:`, "gi");
  return (text.match(re) || []).length;
}

// Numbered items at start of line: 1. or 1) ...
function countNumberedItems(lines) {
  const re = /^\s*\d+[.)]\s+\S/;
  let n = 0;
  for (const l of lines) if (re.test(l)) n++;
  return n;
}

// Bullet items containing a URL
function countBulletWithUrl(lines) {
  const re = /^\s*[-*+]\s+.*https?:\/\//;
  let n = 0;
  for (const l of lines) if (re.test(l)) n++;
  return n;
}

// Distinct URLs in file
function countDistinctUrls(text) {
  const urls = (text.match(/https?:\/\/[^\s\)\]\>\"'`,]+/g) || []).map((u) => u.replace(/[.,;:]+$/, ""));
  const set = new Set(urls.map((u) => u.toLowerCase()));
  return { total: urls.length, distinct: set.size };
}

// Bold numbered prefix at start of line: **1. ...** or **1\. ...** etc.
function countBoldNumberedPrefix(lines) {
  const re = /^\s*\*\*\s*\d+[.\\)]+\s*\S/;
  let n = 0;
  for (const l of lines) if (re.test(l)) n++;
  return n;
}

// Bold numbered prefix with newlines inside the bold (e.g. "**1\\. CRED iQ**" or "**1.** Some text")
function countBoldNumberedInline(text) {
  const re = /\*\*\s*(\d+)\s*[.\\)]+\s+[^*\n]+\*\*/g;
  const m = text.match(re) || [];
  return m.length;
}

// --- Main ---
const manifestRows = parseCsv(fs.readFileSync(MANIFEST_IN, "utf8"));
const header = manifestRows[0];
const dataRows = manifestRows.slice(1).filter((r) => r.length >= header.length - 2 && r[0]);

const idxFilename = header.indexOf("filename");
const idxCandidateCount = header.indexOf("candidate_count");
const idxDetectedUnit = header.indexOf("detected_unit");
const idxStatus = header.indexOf("status");

const report = [];

for (const row of dataRows) {
  const fname = row[idxFilename];
  const full = path.join(TARGET, fname);
  const text = fs.readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/);

  const h2 = countHeaders(lines, 2);
  const h3 = countHeaders(lines, 3);
  const h4 = countHeaders(lines, 4);
  const h5 = countHeaders(lines, 5);
  const tables = findTables(lines);
  const wideTables = tables.filter((t) => t.col_count >= 3);
  const narrowTables = tables.filter((t) => t.col_count === 2);
  const wideTableDataRows = wideTables.reduce((s, t) => s + t.data_row_count, 0);
  const narrowTableDataRows = narrowTables.reduce((s, t) => s + t.data_row_count, 0);
  const labels = countLabelOccurrences(text, [
    "SOURCE", "NAME", "ENDPOINT", "URL", "API", "PROVIDER", "DATA SOURCE", "FEED",
  ]);
  const numberedItems = countNumberedItems(lines);
  const bulletWithUrl = countBulletWithUrl(lines);
  const urls = countDistinctUrls(text);
  const boldNumberedPrefix = countBoldNumberedPrefix(lines);
  const boldNumberedInline = countBoldNumberedInline(text);

  const entry = {
    filename: fname,
    h2, h3, h4, h5,
    table_count: tables.length,
    wide_tables: wideTables.length,
    narrow_tables: narrowTables.length,
    wide_table_data_rows: wideTableDataRows,
    narrow_table_data_rows: narrowTableDataRows,
    table_breakdown: wideTables.map((t) => ({ cols: t.col_count, rows: t.data_row_count, header_preview: t.header_cols.slice(0, 5).join(" | ") })),
    labeled_field_occurrences: labels,
    numbered_items: numberedItems,
    bullet_with_url: bulletWithUrl,
    bold_numbered_prefix: boldNumberedPrefix,
    bold_numbered_inline: boldNumberedInline,
    distinct_urls: urls.distinct,
    total_urls: urls.total,
  };
  report.push(entry);
}

fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), "utf8");

// Print a compact table
console.log("filename | h2 | h3 | h4 | tables | wide_rows | narrow_rows | labels | bold# | dist_urls");
console.log("---");
for (const r of report) {
  const short = r.filename.length > 60 ? r.filename.slice(0, 57) + "..." : r.filename;
  console.log(
    [
      short.padEnd(62),
      String(r.h2).padStart(3),
      String(r.h3).padStart(3),
      String(r.h4).padStart(3),
      String(r.table_count).padStart(3),
      String(r.wide_table_data_rows).padStart(4),
      String(r.narrow_table_data_rows).padStart(4),
      String(r.labeled_field_occurrences).padStart(4),
      String(r.bold_numbered_inline).padStart(4),
      String(r.distinct_urls).padStart(4),
    ].join(" | ")
  );
}

console.log("");
console.log(`Report written: ${REPORT}`);
