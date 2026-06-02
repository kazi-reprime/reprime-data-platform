// Splits a base64-encoded version of a file into multiple chunks, each safe
// for the Read tool's per-line cap. Each chunk is a SINGLE LINE of base64
// chars (no newlines inside), well under the per-line truncation cap.
//
// Usage: node split_b64.js <input_file> <chunk_size_bytes_b64> <output_prefix>
const fs = require("fs");
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log("usage: node split_b64.js <input> <chunk_b64_bytes> <out_prefix>");
  process.exit(1);
}
const [input, chunkSizeStr, prefix] = args;
const chunkSize = parseInt(chunkSizeStr, 10);

const buf = fs.readFileSync(input);
const b64 = buf.toString("base64");
const total = b64.length;
let parts = 0;
for (let i = 0; i < total; i += chunkSize) {
  const chunk = b64.slice(i, i + chunkSize);
  const out = `${prefix}.part${String(parts).padStart(3, "0")}.txt`;
  fs.writeFileSync(out, chunk, "utf8");
  parts++;
}
console.log(`Input: ${input}`);
console.log(`Total b64 bytes: ${total}`);
console.log(`Chunk size: ${chunkSize} bytes per file`);
console.log(`Parts written: ${parts}`);
console.log(`Prefix: ${prefix}.partNNN.txt`);
