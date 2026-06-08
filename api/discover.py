"""RePrime — NL source discovery (Phase 4, ADR-002).

GET /api/discover?q=<natural-language query>&k=<count, default 10>

Flow:
  1. Validate query (5-200 chars).
  2. Embed query via Vercel AI Gateway (or OpenAI direct).
  3. Call Supabase RPC match_sources(query_embedding, match_count, min_similarity).
  4. Return ranked sources as JSON.

Stdlib only (urllib + http.server) to keep cold start light.

Env required:
  AI_GATEWAY_API_KEY + AI_GATEWAY_URL  (preferred)  OR  OPENAI_API_KEY
  SUPABASE_URL + SUPABASE_ANON_KEY

CORS allow-list mirrors api/search.py (Phase 2.8).
"""
from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler


SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

AI_GATEWAY_URL = os.environ.get("AI_GATEWAY_URL", "https://ai-gateway.vercel.sh/v1").rstrip("/")
AI_GATEWAY_KEY = os.environ.get("AI_GATEWAY_API_KEY", "")
OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")

EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "openai/text-embedding-3-small")

MIN_Q_LEN = 5
MAX_Q_LEN = 200
DEFAULT_K = 10
MAX_K = 50
MIN_SIM = 0.2

_ALLOWED_ORIGINS_EXACT = (
    "https://reprime-data-platform.vercel.app",
    "https://www.reprimeterminal.com",
    "https://reprimeterminal.com",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
)
_ALLOWED_ORIGIN_SUFFIXES = (
    "-kazi-reprimes-projects.vercel.app",
    ".vercel.app",
)


def _http(method: str, url: str, headers: dict, body: dict | None = None, timeout: int = 20) -> dict:
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, method=method, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        return json.loads(raw.decode("utf-8")) if raw else {}


def embed_query(text: str) -> list[float]:
    if AI_GATEWAY_KEY:
        url = f"{AI_GATEWAY_URL}/embeddings"
        headers = {"Authorization": f"Bearer {AI_GATEWAY_KEY}", "Content-Type": "application/json"}
        body = {"model": EMBEDDING_MODEL, "input": text}
    elif OPENAI_KEY:
        url = "https://api.openai.com/v1/embeddings"
        headers = {"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"}
        model = EMBEDDING_MODEL.split("/", 1)[-1] if "/" in EMBEDDING_MODEL else EMBEDDING_MODEL
        body = {"model": model, "input": text}
    else:
        raise RuntimeError("No embedding key set")

    resp = _http("POST", url, headers, body, timeout=20)
    data = resp.get("data") or []
    if not data:
        raise RuntimeError("provider returned no embedding")
    vec = data[0].get("embedding")
    if not isinstance(vec, list) or len(vec) != 1536:
        raise RuntimeError(f"unexpected embedding shape (len={len(vec) if isinstance(vec, list) else 'N/A'})")
    return vec


def match_sources(query_embedding: list[float], k: int) -> list[dict]:
    url = f"{SUPABASE_URL}/rest/v1/rpc/match_sources"
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
    }
    body = {"query_embedding": query_embedding, "match_count": k, "min_similarity": MIN_SIM}
    resp = _http("POST", url, headers, body, timeout=15)
    if not isinstance(resp, list):
        raise RuntimeError(f"RPC returned unexpected shape: {type(resp)}")
    return resp


_SAFE_CHARS = re.compile(r"[\x00-\x1f\x7f]+")


def sanitize_query(q: str) -> str:
    q = _SAFE_CHARS.sub(" ", q)
    return " ".join(q.split())


class handler(BaseHTTPRequestHandler):  # noqa: N801
    def _allowed_origin(self) -> str | None:
        origin = (self.headers.get("Origin") or "").strip()
        if not origin:
            return None
        if origin in _ALLOWED_ORIGINS_EXACT:
            return origin
        try:
            parsed = urllib.parse.urlparse(origin)
            host = (parsed.hostname or "").lower()
            for suf in _ALLOWED_ORIGIN_SUFFIXES:
                if host.endswith(suf):
                    return origin
        except Exception:
            pass
        return None

    def _cors_headers(self) -> None:
        origin = self._allowed_origin()
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Max-Age", "600")

    def _send(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._cors_headers()
        self.send_header("Cache-Control", "public, max-age=60")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):  # noqa: N802
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):  # noqa: N802
        try:
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            q_raw = (params.get("q", [""])[0] or "").strip()
            try:
                k = int(params.get("k", [str(DEFAULT_K)])[0])
            except ValueError:
                k = DEFAULT_K
            k = max(1, min(MAX_K, k))

            q = sanitize_query(q_raw)
            if len(q) < MIN_Q_LEN:
                return self._send(400, {"error": "query_too_short", "message": f"Query must be at least {MIN_Q_LEN} chars."})
            if len(q) > MAX_Q_LEN:
                return self._send(400, {"error": "query_too_long", "message": f"Query must be at most {MAX_Q_LEN} chars."})

            if not SUPABASE_URL or not SUPABASE_ANON_KEY:
                return self._send(503, {"error": "not_configured", "message": "Supabase env not set."})
            if not (AI_GATEWAY_KEY or OPENAI_KEY):
                return self._send(503, {"error": "not_configured", "message": "Embedding provider env not set."})

            vec = embed_query(q)
            results = match_sources(vec, k)

            return self._send(200, {
                "query": q,
                "k": k,
                "model": EMBEDDING_MODEL,
                "results": results,
                "count": len(results),
            })
        except urllib.error.HTTPError as e:
            try:
                body = e.read().decode("utf-8", errors="replace")
            except Exception:
                body = ""
            return self._send(502, {"error": "upstream_http", "status": e.code, "body": body[:500]})
        except Exception as e:  # noqa: BLE001
            return self._send(500, {"error": "internal", "message": str(e)[:200]})
