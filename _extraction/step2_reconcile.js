// STEP 2 — Global reconciliation. The conservation proof.
// assert sum(rows_extracted) == sum(candidate_count)
// assert every manifest row has status in {DONE, EMPTY_CONFIRMED}
// assert no file status == PENDING
const fs = require("fs");
const path = require("path");

const OUT_DIR = "C:\\API\\_extraction";
const MANIFEST = path.join(OUT_DIR, "manifest.csv");
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

const m = parseCsv(fs.readFileSync(MANIFEST, "utf8"));
const header = m[0];
const dataRows = m.slice(1).filter(r => r.length >= header.length - 2 && r[0]);
const idx = (k) => header.indexOf(k);
const I_FILENAME = idx("filename");
const I_CC = idx("candidate_count");
const I_EX = idx("rows_extracted");
const I_STATUS = idx("status");

let totalCc = 0, totalEx = 0;
let mismatches = [];
let pending = [];
let badStatus = [];

console.log("filename | candidate_count | rows_extracted | status");
console.log("-".repeat(110));
for (const r of dataRows) {
  const fname = r[I_FILENAME];
  const cc = parseInt(r[I_CC], 10) || 0;
  const ex = parseInt(r[I_EX], 10) || 0;
  const st = r[I_STATUS];
  totalCc += cc;
  totalEx += ex;
  const short = fname.length > 60 ? fname.slice(0, 57) + "..." : fname;
  console.log(`${short.padEnd(62)} | ${String(cc).padStart(4)} | ${String(ex).padStart(4)} | ${st}`);
  if (cc !== ex && st !== "EMPTY_CONFIRMED") mismatches.push({ fname, cc, ex });
  if (st === "PENDING") pending.push(fname);
  if (st !== "DONE" && st !== "EMPTY_CONFIRMED") badStatus.push({ fname, status: st });
}

// Count raw rows
const rawText = fs.readFileSync(RAW, "utf8");
const rawRows = parseCsv(rawText);
const rawDataCount = rawRows.length - 1; // minus header

console.log("");
console.log(`TOTAL candidates=${totalCc}  TOTAL extracted=${totalEx}  DELTA=${totalCc - totalEx}`);
console.log(`Raw extraction CSV row count: ${rawDataCount}`);
console.log("");

let fail = false;
if (totalCc !== totalEx) { console.log(`FAIL — sum mismatch: candidates=${totalCc}, extracted=${totalEx}`); fail = true; }
if (rawDataCount !== totalEx) { console.log(`FAIL — raw CSV (${rawDataCount}) ≠ manifest extracted total (${totalEx})`); fail = true; }
if (mismatches.length) { console.log(`FAIL — per-file mismatches: ${mismatches.length}`); for (const m of mismatches) console.log(`  ${m.fname}: cc=${m.cc} ex=${m.ex}`); fail = true; }
if (pending.length) { console.log(`FAIL — files still PENDING: ${pending.length}`); for (const p of pending) console.log(`  ${p}`); fail = true; }
if (badStatus.length) { console.log(`FAIL — files with bad status: ${badStatus.length}`); for (const b of badStatus) console.log(`  ${b.fname}: ${b.status}`); fail = true; }

if (fail) process.exit(1);

console.log(`STEP 2 PASS — conservation holds, 0 records lost. Total records under management: ${totalEx}`);
