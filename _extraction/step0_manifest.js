// STEP 0 — Build the manifest. Lists every .md file in C:\API.
// For each: filename, bytes, sha256, line_count.
// Writes manifest.csv. Prints N and full manifest. Asserts N matches actual.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const TARGET = "C:\\API";
const OUT_DIR = "C:\\API\\_extraction";
const MANIFEST = path.join(OUT_DIR, "manifest.csv");

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function csvRow(arr) {
  return arr.map(csvEscape).join(",");
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function lineCount(buf) {
  // Count lines: number of \n + 1 if file is non-empty and does not end with \n; else number of \n
  if (buf.length === 0) return 0;
  let n = 0;
  for (let i = 0; i < buf.length; i++) if (buf[i] === 0x0a) n++;
  // If last byte is not \n, there is a trailing line
  if (buf[buf.length - 1] !== 0x0a) n++;
  return n;
}

function listMd(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".md"))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));
}

const files = listMd(TARGET);
const N = files.length;

const rows = [
  ["filename", "bytes", "sha256", "line_count", "candidate_count", "detected_unit", "rows_extracted", "status"],
];

const records = [];
for (const name of files) {
  const full = path.join(TARGET, name);
  const buf = fs.readFileSync(full);
  const bytes = buf.length;
  const hash = sha256(buf);
  const lines = lineCount(buf);
  records.push({ filename: name, bytes, sha256: hash, line_count: lines });
  rows.push([name, bytes, hash, lines, "", "", "", "PENDING"]);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(MANIFEST, rows.map(csvRow).join("\n") + "\n", "utf8");

// Print N and full manifest
console.log(`N = ${N}`);
console.log("");
console.log("filename | bytes | sha256[:16] | line_count");
for (const r of records) {
  console.log(`${r.filename} | ${r.bytes} | ${r.sha256.slice(0, 16)} | ${r.line_count}`);
}

// GATE 0: re-list and compare
const recount = listMd(TARGET).length;
if (recount !== N) {
  console.log(`STEP 0 FAIL — initial N=${N} but recount=${recount}`);
  process.exit(1);
}
console.log("");
console.log(`STEP 0 PASS — N=${N} files manifested`);
