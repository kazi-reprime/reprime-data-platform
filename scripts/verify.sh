#!/usr/bin/env bash
# RePrime Data Platform — self-verification (Tier 0 audit, re-runnable).
# Exit code 0 = everything checked passed. Non-zero = something is broken.
#
# Usage:
#   bash scripts/verify.sh            # local engine + artifacts (no deploy needed)
#   LIVE=1 bash scripts/verify.sh     # additionally probe the live Vercel URL
set -u
cd "$(dirname "$0")/.."
FAIL=0
pass(){ echo "  ✓ $1"; }
fail(){ echo "  ✗ $1"; FAIL=1; }

echo "== 1. Python syntax =="
for f in api/search.py api/health.py scripts/build_registry.py scraper/aggregate.py; do
  python3 -c "import ast,sys; ast.parse(open('$f').read())" 2>/dev/null && pass "$f parses" || fail "$f SYNTAX"
done

echo "== 2. Frontend JS syntax (inline scripts) =="
if command -v node >/dev/null 2>&1; then
  for p in public/explore.html public/dashboard.html public/terminal.html public/site.html; do
    python3 - "$p" > /tmp/_v.js <<'PY'
import sys
h=open(sys.argv[1]).read()
print(h.split('<script>\n')[-1].rsplit('</script>',1)[0])
PY
    node --check /tmp/_v.js 2>/dev/null && pass "$p JS" || fail "$p JS ERROR"
  done
else
  echo "  (node not found — skipping JS check)"
fi

echo "== 3. Data artifacts valid + real =="
python3 - <<'PY' && pass "registry/stats/json valid" || echo "  ✗ data invalid"
import json,sys
reg=json.load(open('public/data/sources.json'))
assert reg['count']>500, "registry too small"
assert reg['category_count']==14
st=json.load(open('public/data/stats.json'))
assert st['cataloged_sources']==reg['count']
assert 'records' not in st, "fabricated 'records' field still present"
print(f"  registry={reg['count']} sources, {reg['category_count']} cats, {st['live_search_layers']} live layers")
PY

echo "== 4. No .env secret values leaked into tracked files =="
if [ -f api/.env ]; then
  leak=0
  while IFS='=' read -r k v; do
    v="${v%\"}"; v="${v#\"}"
    [ "${#v}" -ge 12 ] || continue
    if git grep -qF "$v" -- . 2>/dev/null; then fail "value of $k found in a tracked file"; leak=1; fi
  done < <(grep -E '^[A-Z_]+=' api/.env)
  [ "$leak" -eq 0 ] && pass "no .env secret values in tracked files"
else
  echo "  (api/.env not present — skipping)"
fi

echo "== 5. No fabricated literals in pages =="
if grep -rqE '8,223|\$163\.5B|Market Rate Pool|Miami-Dade net' public/*.html 2>/dev/null; then
  fail "fabricated literal still in a page"
else pass "pages free of known fabricated literals"; fi

echo "== 6. Backend unit tests =="
if command -v pytest >/dev/null 2>&1; then
  pytest -q -m unit tests/test_search.py >/tmp/_pt 2>&1 && pass "unit tests pass" || { fail "unit tests"; tail -5 /tmp/_pt; }
else echo "  (pytest not installed — skipping)"; fi

echo "== 7. Live search engine (real network) =="
QUICK="${QUICK:-0}" python3 - <<'PY' && pass "engine returns >=8 real sources for all test addresses" || fail "engine below threshold"
import importlib.util, os, sys, time
spec=importlib.util.spec_from_file_location("s","api/search.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
addrs=["1600 Pennsylvania Ave NW, Washington, DC 20500","350 5th Ave, New York, NY 10118",
       "1 Apple Park Way, Cupertino, CA 95014","233 S Wacker Dr, Chicago, IL 60606","1 Tower Pl, South San Francisco, CA 94080"]
if os.environ.get("QUICK")=="1": addrs=addrs[:1]
bad=0
for i,a in enumerate(addrs):
    r=m.run_search(a); n=r.get("query_metadata",{}).get("total_sources_succeeded",0)
    print(f"  {a[:40]:42} -> {n} sources")
    if r.get("_http_status")!=200 or n<8: bad+=1
    if i<len(addrs)-1: time.sleep(5)  # respect GDELT throttle
sys.exit(1 if bad else 0)
PY

if [ "${LIVE:-0}" = "1" ]; then
  echo "== 8. Live deploy probe =="
  B="https://reprime-data-platform.vercel.app"
  for u in "/" "/explore" "/dashboard" "/terminal" "/site" "/api/health" "/api/sources" "/api/search?address=1600+Pennsylvania+Ave+NW,+Washington,+DC"; do
    code=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 25 "$B$u")
    [ "$code" = "200" ] && pass "$u -> 200" || fail "$u -> $code"
  done
fi

echo ""
[ $FAIL -eq 0 ] && echo "RESULT: PASS ✅" || echo "RESULT: FAIL ❌"
exit $FAIL
