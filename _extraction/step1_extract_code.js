// STEP 1 — Code-based extraction for files with deterministic structure.
// Handles wide_table_rows, h3_headers, h3_labeled_blocks unit types.
// Writes raw_extraction.csv (append) and updates manifest.csv rows_extracted.
// GATE 1 per file: rows_written_this_file == candidate_count[file]. STOP on mismatch.

const fs = require("fs");
const path = require("path");

const TARGET = "C:\\API";
const OUT_DIR = "C:\\API\\_extraction";
const MANIFEST = path.join(OUT_DIR, "manifest.csv");
const RAW = path.join(OUT_DIR, "raw_extraction.csv");

// --- CSV utils ---
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

// --- Schema ---
const SCHEMA = [
  "source_name", "type", "provider", "category", "endpoint_url", "auth", "price_tier",
  "update_freq", "granularity", "fields_returned", "cors", "rate_limit",
  "integration_path", "cre_use", "source_file", "source_locator", "status_flag",
  "provenance_files", "occurrence_count"
];
function blankRecord() {
  const r = {};
  for (const k of SCHEMA) r[k] = "";
  return r;
}

// --- Header → schema mapping for wide tables ---
function mapHeaderToSchema(h) {
  const t = h.toLowerCase().replace(/\*/g, "").trim();
  if (!t) return null;
  if (/^(#|num|number)$/i.test(t)) return "_index";
  if (/^(source[ _]?name|^source$|^name$|^tool$|^repo$|^repo\b.*name|^repository$|^provider$|^publisher$|^api$|^product$|^service$|^source\/name|^entry$)/i.test(t) ||
      /^repo \(/i.test(t)) return "source_name";
  if (/source[ _]?name|^name\b|^tool\/api$|^tool$|^repo \(org\/name\)|^repository|^api name|^api\/source|^service name|^company|^vendor/i.test(t)) return "source_name";
  if (/url|endpoint|exact (url|endpoint|fetch)|github url|fetch url|api url|link\b|hyperlink/i.test(t)) return "endpoint_url";
  if (/^category$|^categor|^type$|^domain$|^sector$|^asset class|^class$|^segment$/i.test(t)) return "category";
  if (/auth|api key|key required|access|requires/i.test(t)) return "auth";
  if (/price|pricing|cost|tier|free vs|fee|paid|annual cost|^est\..*cost|subscription|plan/i.test(t)) return "price_tier";
  if (/update|frequency|refresh|last commit|update freq/i.test(t)) return "update_freq";
  if (/granularity|geographic|geo[ -]?(level|granularity)|geography/i.test(t)) return "granularity";
  if (/^cors$/i.test(t)) return "cors";
  if (/rate[ -]?limit|quota|throttle|free[- ]tier[ -]?rate/i.test(t)) return "rate_limit";
  if (/cre use|use case|cre relevance|terminal tile|dashboard tile|tile$|tile\/|tile name|^tile|application|widget|panel/i.test(t)) return "cre_use";
  if (/fields|output|return|specific fields|data fields|^format$|data format|return[ _]?type/i.test(t)) return "fields_returned";
  if (/license$/i.test(t)) return "_license";
  if (/language$/i.test(t)) return "_language";
  if (/stars$/i.test(t)) return "_stars";
  if (/production[ -]?readiness/i.test(t)) return "_production";
  if (/one[ -]?line|description|notes|gotchas|comment|details|^what (it )?(provides|does|returns)|why|details|justification|driver|strategic|^method$|^how to use/i.test(t)) return "_notes";
  if (/cross[ -]?verifi/i.test(t)) return "_cross_ref";
  if (/feature/i.test(t)) return "_features";
  if (/dd$|ops$|score|driver/i.test(t)) return "_score";
  return "_other";
}

// --- Clean field value (strip markdown) ---
function clean(s) {
  if (s == null) return "";
  let v = String(s);
  v = v.replace(/<br\s*\/?>/gi, " · ");
  v = v.replace(/`+/g, "");
  // Markdown link [text](url) → keep text + (url)
  v = v.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
  // Bold/italic markers
  v = v.replace(/\*\*/g, "").replace(/__/g, "");
  v = v.replace(/^\*+|\*+$/g, "");
  v = v.replace(/\s+/g, " ").trim();
  return v;
}

// Extract first URL from a string
function firstUrl(s) {
  if (!s) return "";
  const m = String(s).match(/https?:\/\/[^\s\)\]\>\"'`,]+/);
  return m ? m[0].replace(/[.,;:]+$/, "") : "";
}

// --- Find tables in markdown text ---
function findTables(lines) {
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i].trim();
    if (l.startsWith("|") && l.endsWith("|") && l.length > 2) {
      const sep = (lines[i+1] || "").trim();
      const isSep = /^\|[\s:|\-]+\|$/.test(sep) && sep.includes("-");
      if (isSep) {
        const cols = l.split("|").slice(1, -1).map(s => s.trim());
        let j = i + 2;
        const dataRows = [];
        while (j < lines.length) {
          const dl = lines[j].trim();
          if (dl.startsWith("|") && dl.endsWith("|")) {
            if (/^\|[\s:|\-]+\|$/.test(dl) && dl.includes("-")) { j++; continue; }
            const cells = dl.split("|").slice(1, -1).map(s => s.trim());
            dataRows.push({ line: j + 1, cells });
            j++;
          } else break;
        }
        if (cols.length >= 2) tables.push({ start_line: i + 1, headers: cols, col_count: cols.length, data_rows: dataRows });
        i = j; continue;
      }
    }
    i++;
  }
  return tables;
}

// --- Extract wide-table record ---
function extractWideTableRecord(filename, table, dataRow) {
  const r = blankRecord();
  r.source_file = filename;
  r.source_locator = `line ${dataRow.line}`;
  // Map each column
  const notes = [];
  for (let i = 0; i < table.headers.length; i++) {
    const headerRaw = clean(table.headers[i]);
    const valueRaw = clean(dataRow.cells[i] || "");
    if (!valueRaw) continue;
    const field = mapHeaderToSchema(headerRaw);
    if (field === "source_name") r.source_name = r.source_name || valueRaw;
    else if (field === "endpoint_url") {
      r.endpoint_url = r.endpoint_url || (firstUrl(valueRaw) || valueRaw);
    }
    else if (field === "category") r.category = r.category || valueRaw;
    else if (field === "auth") r.auth = r.auth || valueRaw;
    else if (field === "price_tier") r.price_tier = r.price_tier || valueRaw;
    else if (field === "update_freq") r.update_freq = r.update_freq || valueRaw;
    else if (field === "granularity") r.granularity = r.granularity || valueRaw;
    else if (field === "cors") r.cors = r.cors || valueRaw;
    else if (field === "rate_limit") r.rate_limit = r.rate_limit || valueRaw;
    else if (field === "cre_use") {
      r.cre_use = r.cre_use ? `${r.cre_use} | ${headerRaw}: ${valueRaw}` : valueRaw;
    }
    else if (field === "fields_returned") {
      r.fields_returned = r.fields_returned ? `${r.fields_returned} | ${headerRaw}: ${valueRaw}` : valueRaw;
    }
    else if (field === "provider") r.provider = r.provider || valueRaw;
    else {
      // Other / notes
      notes.push(`${headerRaw}: ${valueRaw}`);
    }
  }
  if (notes.length) {
    // Append to cre_use as notes
    r.cre_use = r.cre_use ? `${r.cre_use} | ${notes.join(" | ")}` : notes.join(" | ");
  }
  // Fallbacks
  if (!r.endpoint_url) {
    // Try to find a URL in any cell
    for (const cell of dataRow.cells) {
      const u = firstUrl(cell);
      if (u) { r.endpoint_url = u; break; }
    }
  }
  // status_flag
  const hasCoreSource = !!r.source_name;
  const hasUrl = !!r.endpoint_url;
  const hasProvider = !!r.provider;
  if (hasCoreSource && (hasUrl || hasProvider)) r.status_flag = "OK";
  else r.status_flag = "MISSING_FIELDS";
  return r;
}

// --- Extract h3-driven record (with following 2-col table or labeled lines) ---
function extractH3Record(filename, lines, h3LineIdx, nextH3LineIdx, h3Text) {
  const r = blankRecord();
  r.source_file = filename;
  r.source_locator = `line ${h3LineIdx + 1}: ${h3Text.slice(0, 80)}`;
  // Strip leading "E-01 ·" / "A1." / "1\." numbering
  let name = h3Text.replace(/^[A-Z]?[-]?\d+[A-Za-z]?[\\)]?\.\s*/, "")
                    .replace(/^[A-Z]\-\d+\s*[·•:]\s*/, "")
                    .replace(/^[A-Z]\d+\s*[·•:]\s*/, "")
                    .replace(/^\d+\\?\.\s*/, "")
                    .trim();
  r.source_name = name;
  // Scan content between h3 and next h3
  const start = h3LineIdx + 1;
  const end = nextH3LineIdx;
  // 1. Look for 2-col "Field | Detail" tables
  const block = lines.slice(start, end);
  const blockTables = findTables(block);
  let twoColData = null;
  for (const t of blockTables) {
    if (t.col_count === 2) {
      twoColData = t;
      break;
    }
  }
  if (twoColData) {
    for (const row of twoColData.data_rows) {
      const labelRaw = clean(row.cells[0] || "");
      const valueRaw = clean(row.cells[1] || "");
      if (!labelRaw || !valueRaw) continue;
      const field = mapHeaderToSchema(labelRaw);
      if (field === "source_name") r.source_name = r.source_name || valueRaw;
      else if (field === "endpoint_url") r.endpoint_url = r.endpoint_url || (firstUrl(valueRaw) || valueRaw);
      else if (field === "category") r.category = r.category || valueRaw;
      else if (field === "auth") r.auth = r.auth || valueRaw;
      else if (field === "price_tier") r.price_tier = r.price_tier || valueRaw;
      else if (field === "update_freq") r.update_freq = r.update_freq || valueRaw;
      else if (field === "granularity") r.granularity = r.granularity || valueRaw;
      else if (field === "cors") r.cors = r.cors || valueRaw;
      else if (field === "rate_limit") r.rate_limit = r.rate_limit || valueRaw;
      else if (field === "cre_use") r.cre_use = r.cre_use ? `${r.cre_use} | ${labelRaw}: ${valueRaw}` : valueRaw;
      else if (field === "fields_returned") r.fields_returned = r.fields_returned ? `${r.fields_returned} | ${labelRaw}: ${valueRaw}` : valueRaw;
      else if (field === "provider") r.provider = r.provider || valueRaw;
      else {
        // Other label, append to cre_use as note
        r.cre_use = r.cre_use ? `${r.cre_use} | ${labelRaw}: ${valueRaw}` : `${labelRaw}: ${valueRaw}`;
      }
    }
  }
  // 2. Look for labeled lines like "**URL:** value" or "URL: value" in code blocks or text
  // Includes inline form: "**URL:** cred-iq.com | **API:** Yes | **Pricing:** $20K/yr"
  const text = block.join("\n");
  // Single-line inline labels
  const inlineRe = /\*\*\s*([^*:]+?)\s*[:：]\*\*\s*([^|*\n]+?)(?=\s*\||\s*$|\s*\*\*)/g;
  let m;
  while ((m = inlineRe.exec(text)) !== null) {
    const labelRaw = clean(m[1]);
    const valueRaw = clean(m[2]);
    if (!labelRaw || !valueRaw) continue;
    const field = mapHeaderToSchema(labelRaw);
    if (field === "source_name" && !r.source_name) r.source_name = valueRaw;
    else if (field === "endpoint_url" && !r.endpoint_url) r.endpoint_url = firstUrl(valueRaw) || valueRaw;
    else if (field === "category" && !r.category) r.category = valueRaw;
    else if (field === "auth" && !r.auth) r.auth = valueRaw;
    else if (field === "price_tier" && !r.price_tier) r.price_tier = valueRaw;
    else if (field === "update_freq" && !r.update_freq) r.update_freq = valueRaw;
    else if (field === "granularity" && !r.granularity) r.granularity = valueRaw;
    else if (field === "cors" && !r.cors) r.cors = valueRaw;
    else if (field === "rate_limit" && !r.rate_limit) r.rate_limit = valueRaw;
    else if (field === "cre_use") r.cre_use = r.cre_use ? `${r.cre_use} | ${labelRaw}: ${valueRaw}` : valueRaw;
    else if (field === "fields_returned") r.fields_returned = r.fields_returned ? `${r.fields_returned} | ${labelRaw}: ${valueRaw}` : valueRaw;
    else if (field === "provider" && !r.provider) r.provider = valueRaw;
    else {
      // Other inline label, append
      r.cre_use = r.cre_use ? `${r.cre_use} | ${labelRaw}: ${valueRaw}` : `${labelRaw}: ${valueRaw}`;
    }
  }
  // 3. Look for labeled lines inside code blocks (NAME:, ENDPOINT:, etc.)
  // Code blocks delimited by ```
  let inCode = false;
  for (let i = start; i < end; i++) {
    const ln = lines[i];
    if (/^```/.test(ln.trim())) { inCode = !inCode; continue; }
    if (!inCode) continue;
    const lm = ln.match(/^\s*([A-Z][A-Z0-9_ ]{1,30}?)\s*:\s+(.+)$/);
    if (lm) {
      const labelRaw = clean(lm[1]);
      const valueRaw = clean(lm[2]);
      if (!labelRaw || !valueRaw) continue;
      const field = mapHeaderToSchema(labelRaw);
      if (field === "source_name" && !r.source_name) r.source_name = valueRaw;
      else if (field === "endpoint_url" && !r.endpoint_url) r.endpoint_url = firstUrl(valueRaw) || valueRaw;
      else if (field === "category" && !r.category) r.category = valueRaw;
      else if (field === "auth" && !r.auth) r.auth = valueRaw;
      else if (field === "price_tier" && !r.price_tier) r.price_tier = valueRaw;
      else if (field === "update_freq" && !r.update_freq) r.update_freq = valueRaw;
      else if (field === "granularity" && !r.granularity) r.granularity = valueRaw;
      else if (field === "cors" && !r.cors) r.cors = valueRaw;
      else if (field === "rate_limit" && !r.rate_limit) r.rate_limit = valueRaw;
      else if (field === "cre_use") r.cre_use = r.cre_use ? `${r.cre_use} | ${labelRaw}: ${valueRaw}` : valueRaw;
      else if (field === "fields_returned") r.fields_returned = r.fields_returned ? `${r.fields_returned} | ${labelRaw}: ${valueRaw}` : valueRaw;
      else if (field === "provider" && !r.provider) r.provider = valueRaw;
      else {
        r.cre_use = r.cre_use ? `${r.cre_use} | ${labelRaw}: ${valueRaw}` : `${labelRaw}: ${valueRaw}`;
      }
    }
  }
  // Fallback URL search
  if (!r.endpoint_url) {
    const u = firstUrl(text);
    if (u) r.endpoint_url = u;
  }
  // Use any leading paragraph as description if cre_use empty
  if (!r.cre_use) {
    // First non-table, non-label paragraph
    let para = "";
    for (let i = start; i < end; i++) {
      const ln = lines[i].trim();
      if (!ln) { if (para) break; continue; }
      if (ln.startsWith("|") || ln.startsWith("```") || ln.startsWith("#")) { if (para) break; continue; }
      if (/^\*\*[^*]+\*\*\s*:/.test(ln)) { if (para) break; continue; }
      para += " " + ln;
      if (para.length > 300) break;
    }
    r.cre_use = clean(para).slice(0, 500);
  }
  // status_flag
  if (r.source_name && (r.endpoint_url || r.provider)) r.status_flag = "OK";
  else r.status_flag = "MISSING_FIELDS";
  return r;
}

// --- Per-file extractors ---
function extractFile(filename, candidate, unit) {
  const full = path.join(TARGET, filename);
  const text = fs.readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/);
  let rows = [];

  if (unit === "wide_table_rows") {
    const tables = findTables(lines).filter(t => t.col_count >= 3);
    for (const t of tables) {
      for (const dr of t.data_rows) {
        rows.push(extractWideTableRecord(filename, t, dr));
      }
    }
  } else if (unit === "h3_headers" || unit === "h3_labeled_blocks") {
    // Find all H3 lines and their indices
    const h3 = [];
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^###\s+(.+)$/);
      if (m) h3.push({ idx: i, text: m[1].trim() });
    }
    // Filter out non-record H3s heuristically:
    //   - subtitle (immediately after H1 at line 1-3): "### A Complete Reference..."
    //   - panel/widget designations at end of file
    const filtered = h3.filter((h, k) => {
      const t = h.text.toLowerCase();
      // Subtitle (one of the first 3 H3s, no numbering prefix, no URL nearby)
      if (k < 2 && !/^[a-z]?\-?\d+/i.test(h.text) && !/^[A-Z]\d/.test(h.text) && !/\bsofr|\bbea|\bsec|\bcensus|\bbls|\bfred|\bfema/i.test(h.text)) {
        // Likely a subtitle if no data-source keywords
        const isSubtitle = /reference|guide|compendium|overview|introduction|how to|methodology/i.test(h.text);
        if (isSubtitle) return false;
      }
      // Panel/widget design notes: contains "Panel" or "Widget" without record numbering prefix
      if (/\bpanel\b|\bwidget\b|\bdashboard\s+kit\b/i.test(h.text) && !/^[A-Z]?\d/.test(h.text)) {
        return false;
      }
      return true;
    });
    for (let k = 0; k < filtered.length; k++) {
      const cur = filtered[k];
      const next = filtered[k + 1] ? filtered[k + 1].idx : lines.length;
      rows.push(extractH3Record(filename, lines, cur.idx, next, cur.text));
    }
  } else {
    throw new Error(`Unsupported unit: ${unit} for file ${filename}`);
  }

  return rows;
}

// --- Main ---
const manifestText = fs.readFileSync(MANIFEST, "utf8");
const manifest = parseCsv(manifestText);
const mHeader = manifest[0];
const mRows = manifest.slice(1).filter(r => r.length >= mHeader.length - 2 && r[0]);

const idx = (k) => mHeader.indexOf(k);
const I_FILENAME = idx("filename");
const I_CC = idx("candidate_count");
const I_DETUNIT = idx("detected_unit");
const I_EXTRACTED = idx("rows_extracted");
const I_STATUS = idx("status");
const I_METHOD = idx("method");

// Initialize raw_extraction.csv with header (overwrite)
fs.writeFileSync(RAW, SCHEMA.join(",") + "\n", "utf8");

let totalExtracted = 0;
const perFileReport = [];
let fail = null;

for (const row of mRows) {
  const fname = row[I_FILENAME];
  const cc = parseInt(row[I_CC], 10) || 0;
  const unit = row[I_DETUNIT];
  const method = row[I_METHOD];

  if (method === "none" || row[I_STATUS] === "EMPTY_CONFIRMED") {
    row[I_EXTRACTED] = "0";
    perFileReport.push({ fname, candidate: cc, extracted: 0, status: "EMPTY_CONFIRMED" });
    continue;
  }
  if (method !== "code") {
    perFileReport.push({ fname, candidate: cc, extracted: "deferred", status: "DEFERRED_SUBAGENT" });
    continue;
  }

  let extracted = [];
  try {
    extracted = extractFile(fname, cc, unit);
  } catch (e) {
    fail = `Extraction failed for ${fname}: ${e.message}`;
    break;
  }

  // Write to CSV
  const outRows = extracted.map(r => SCHEMA.map(k => r[k] !== undefined ? r[k] : ""));
  fs.appendFileSync(RAW, csvWrite(outRows));

  row[I_EXTRACTED] = String(extracted.length);
  totalExtracted += extracted.length;

  // GATE 1 per file
  const ok = extracted.length === cc;
  perFileReport.push({ fname, candidate: cc, extracted: extracted.length, status: ok ? "DONE" : "MISMATCH" });
  if (ok) {
    row[I_STATUS] = "DONE";
    console.log(`FILE ${fname}: candidate=${cc} extracted=${extracted.length} PASS`);
  } else {
    console.log(`FILE ${fname}: candidate=${cc} extracted=${extracted.length} *** MISMATCH ***`);
  }
}

// Save manifest back
fs.writeFileSync(MANIFEST, csvWrite([mHeader, ...mRows]), "utf8");

console.log("");
console.log("=== STEP 1 SUMMARY (code-extract only) ===");
let mismatch = 0;
for (const r of perFileReport) {
  if (r.status === "MISMATCH") mismatch++;
}
console.log(`Code files: ${perFileReport.filter(r => r.status === "DONE" || r.status === "MISMATCH").length}`);
console.log(`Subagent files: ${perFileReport.filter(r => r.status === "DEFERRED_SUBAGENT").length}`);
console.log(`Empty confirmed: ${perFileReport.filter(r => r.status === "EMPTY_CONFIRMED").length}`);
console.log(`Total code-extracted rows: ${totalExtracted}`);
console.log(`Mismatches: ${mismatch}`);

if (fail) {
  console.log(`FAIL: ${fail}`);
  process.exit(1);
}

if (mismatch > 0) {
  console.log(`STEP 1 INCOMPLETE — ${mismatch} files mismatch; resolve before continuing.`);
  process.exit(1);
}

console.log("STEP 1 (code-extract) PASS — all code-extracted files reconcile. Subagent files pending.");
