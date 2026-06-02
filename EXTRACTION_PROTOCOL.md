# EXTRACTION_PROTOCOL.md
## Standing instruction for Claude Code — execute exactly, in order, no deviation

You are performing a **complete, audited extraction** of every data source, API, connector, MCP server, feed, and dataset described across a folder of markdown files. The files are the output of months of research. **Completeness is the only success metric.** A fast run that misses records is a failed run. A slow run that proves it missed nothing is a successful run.

You will not be trusted on your word. You will prove completeness with printed assertions. If an assertion fails, you STOP, report the exact gap, and fix it before continuing.

---

## NON-NEGOTIABLE CONTRACT (read before acting)

1. **No synthesis from memory.** Every output row must trace to a specific file and a specific location in that file. If a fact is not written in the source files, it does not go in the output. You do not "know" what FRED returns; you only record what the file says FRED returns.
2. **No external lookups in this job.** Do not browse, fetch, or search the web. Blanks stay blank. A blank is data — it tells the user what to enrich later. A guessed value is corruption.
3. **Nothing is dropped silently.** Every candidate record lands in exactly one output bucket: `Master`, `Raw`, `Review`, or `Gaps`. The buckets must sum to the committed candidate count, per file. This is a conservation law. Violating it fails the build.
4. **No sampling, no extrapolation.** Do not read three files and infer the rest. Do not stop at the first N records of a file. Do not summarize a file in place of extracting it.
5. **Fixed schema, fixed categories.** You fill a rigid schema. You do not invent columns or categories. When a value does not fit a defined enum, the value is `UNKNOWN` and the row is flagged — never forced.
6. **Gates are mandatory.** Each STEP ends with an assertion. You may not begin a step until the prior step's assertion has printed PASS.

---

## OUTPUT SCHEMA (exact columns — do not add, rename, or reorder)

```
source_name | type | provider | category | endpoint_url | auth | price_tier |
update_freq | granularity | fields_returned | cors | rate_limit |
integration_path | cre_use | source_file | source_locator | status_flag |
provenance_files | occurrence_count
```

Enums (use these literals only; anything else → UNKNOWN + flag):
- **type**: RAW_API | MCP_CONNECTOR | RSS_FEED | BULK_DOWNLOAD | SCRAPE_TARGET | DATASET_PORTAL | UNKNOWN
- **auth**: none | api_key_free | api_key_paid | oauth | paid_only | unknown
- **price_tier**: free | freemium | paid | unknown
- **granularity**: national | state | msa | county | zip | tract | address | coordinate | mixed | unknown
- **cors**: yes | no | unknown
- **integration_path**: BUY_CONNECTOR | BUILD_RAW_API | HYBRID | UNKNOWN
- **category**: economic | demographic | hazard_environmental | infrastructure | housing_re | energy | zoning_parcel | capital_markets | news_sentiment | insurance_climate | construction_pipeline | israeli | macro_indicator | other
- **status_flag**: OK | MISSING_FIELDS | UNCLASSIFIED | REVIEW

`provenance_files` and `occurrence_count` are populated only on the deduped Master tab (STEP 5). On the Raw tab they are blank.

`integration_path` is a triage judgment, not a guess about facts: BUY_CONNECTOR if the source is reachable through a ready-made connector/MCP; BUILD_RAW_API if it is a raw HTTP endpoint to integrate directly; HYBRID if both exist; UNKNOWN if the file does not make this determinable.

---

## STEP 0 — BUILD THE MANIFEST (the spine of the whole job)

Run code, not reading. In the target folder:
1. List every `.md` file. Record: `filename`, `bytes`, `sha256`, `line_count`.
2. Write `manifest.csv` with one row per file plus columns: `candidate_count` (empty for now), `rows_extracted` (empty), `status` = `PENDING`.
3. Print `N = <number of files>` and the full manifest.

**GATE 0:** Assert N equals the actual count of `.md` files in the folder (re-list and compare). Print `STEP 0 PASS — N=<n> files manifested` or STOP.

---

## STEP 0.5 — DETECT RECORD STRUCTURE PER FILE

These files came from different research engines and will NOT share one format. For each file, identify the dominant repeating unit that represents one source. Candidates, in priority order:
- labeled blocks (`SOURCE:` … `URL:` … `AUTH:` style)
- markdown table rows under a header row
- numbered or bulleted list items where each item contains a URL/endpoint
- blank-line-delimited paragraphs each containing a URL/endpoint

For each file, with code, count the **candidate records** under the detected unit. Write that number into `manifest.csv` → `candidate_count`. Print a table: `filename | detected_unit | candidate_count`.

**GATE 0.5:** Assert every file has a non-null `candidate_count`. If any file shows `candidate_count = 0`, open it, confirm it genuinely contains no source records, and log the reason in `manifest.csv` → `status = EMPTY_CONFIRMED`. Print `STEP 0.5 PASS` or STOP.

---

## STEP 1 — PER-FILE EXTRACTION LOOP (one file at a time — do not batch)

For each file in the manifest, in order:
1. Read the **entire file** start to finish. Not a sample. Not the first screen.
2. Extract every candidate record into rows of the exact schema, appending to `raw_extraction.csv`. Populate every column you can from the file text. Unknown values → the correct UNKNOWN/none/blank literal, never invented.
3. Every row gets `source_file` = filename and `source_locator` = line number or nearest section heading.
4. Set `status_flag`: `OK` if core fields (source_name, endpoint_url or provider, type) are present; `MISSING_FIELDS` if a core field is absent in the source; `UNCLASSIFIED` if type/category cannot be determined; `REVIEW` if the text is too ambiguous to place into a single row.
5. Count `rows_written_this_file`.

**GATE 1 (per file, every file):**
```
assert rows_written_this_file == candidate_count[file]
```
If not equal: STOP on this file. Print which records are unaccounted for (by locator). Re-read, reconcile, and only then continue. A record you cannot fit the schema goes to the `Review` bucket with its raw text preserved — it is NOT discarded to make the numbers match. Update `manifest.csv` → `rows_extracted` and `status = DONE`. Print `FILE <name>: candidate=<c> extracted=<e> PASS`.

Do not advance to the next file until the current file prints PASS.

---

## STEP 2 — GLOBAL RECONCILIATION (the conservation proof)

With code:
```
assert sum(manifest.rows_extracted) == sum(manifest.candidate_count)
assert every manifest row has status in {DONE, EMPTY_CONFIRMED}
assert no file status == PENDING
```
Print a coverage table: `filename | candidate_count | rows_extracted | status`, then the totals line: `TOTAL candidates=<x>  TOTAL extracted=<x>  DELTA=0`.

**GATE 2:** If DELTA ≠ 0, STOP and name every file where candidate ≠ extracted. Do not proceed. Print `STEP 2 PASS — conservation holds, 0 records lost` or STOP.

---

## STEP 3 — CLASSIFY (fixed enums only)

Pass over `raw_extraction.csv`. For each row set `type`, `category`, and `integration_path` from the enums. Anything indeterminable → UNKNOWN and set `status_flag = UNCLASSIFIED`. Do not guess to avoid an UNKNOWN — an honest UNKNOWN is the correct answer and tells the user where to look.

Print a distribution: count of rows per `type`, per `category`, per `integration_path`, and the count of `UNCLASSIFIED`.

**GATE 3:** Assert row count is unchanged from STEP 2 (classification adds no rows and drops none). Print `STEP 3 PASS — <n> rows classified, <u> UNCLASSIFIED flagged`.

---

## STEP 4 — DEDUP + PROVENANCE (build the Master tab)

Canonicalize identity by normalized `endpoint_url` (strip protocol, querystring, trailing slash); where no endpoint, fall back to `provider + source_name`. Collapse duplicates into one Master row. On each Master row:
- `provenance_files` = semicolon-joined list of every `source_file` the source appeared in
- `occurrence_count` = number of raw occurrences
- where duplicate occurrences disagree on a field, keep the most complete value and add a note in `status_flag = REVIEW` if they conflict materially

Keep `raw_extraction.csv` fully intact — it is the audit record.

**GATE 4 (second completeness check):** Assert `sum(Master.occurrence_count) == raw row count`. This proves dedup lost nothing. Print `STEP 4 PASS — <r> raw → <m> unique, occurrences reconcile`.

---

## STEP 5 — WRITE LOCAL WORKBOOK FIRST (verified artifact before any push)

Write `data_sources_registry.xlsx` with tabs:
- `Master` — deduped unique sources (full schema + provenance)
- `Raw` — every occurrence (audit)
- `Review` — records that could not be cleanly placed, with original text
- `Gaps` — every field flagged MISSING_FIELDS/UNKNOWN, listed as `source_name | missing_field | source_file` (this is the Phase-2 enrichment worklist)
- `Manifest` — the coverage ledger from STEP 2

**GATE 5:** Reopen the written workbook and assert tab row counts match the in-memory counts. Print `STEP 5 PASS — workbook verified on disk`.

---

## STEP 6 — PUSH TO DESTINATION (last, optional, never the success criterion)

Only after STEP 5 PASS. Push `Master`, `Raw`, `Review`, `Gaps`, `Manifest` to the destination the user names (Google Sheets via import/MCP, or Airtable/Supabase). After pushing, read back the destination row counts and assert they equal the local workbook. Print `STEP 6 PASS — destination matches local`.

If the destination integration is unavailable or errors, that is NOT a job failure — the verified local workbook is the deliverable. Report the push error and stop; do not retry silently or claim success.

---

## DEFINITION OF DONE

The job is done when, and only when, this block has printed:
```
STEP 0 PASS … STEP 6 PASS (or STEP 5 PASS + push-blocked report)
TOTAL candidates = TOTAL extracted   (DELTA = 0)
sum(occurrence_count) = raw row count
Files skipped: 0
Gaps enumerated (not hidden): <count>
```
"I believe I captured everything" is not done. The printed conservation proof is done.

---

## ANTI-SHORTCUT CLAUSES (explicit)

- You will NOT read a subset and pattern-match the rest.
- You will NOT stop at the first N records of a long file; chunk it internally but the per-file count assertion applies to the WHOLE file.
- You will NOT summarize a file instead of extracting its records.
- You will NOT fill a blank with a plausible value; blanks are flagged, never invented.
- You will NOT make output counts match by deleting hard-to-parse records; those go to `Review` intact.
- You will NOT declare success on a push error; the local verified workbook is the deliverable.
- If you find yourself wanting to skip a gate "to save time," that impulse is the exact failure this protocol exists to catch. Run the gate.
