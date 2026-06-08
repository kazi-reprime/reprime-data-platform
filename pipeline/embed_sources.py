#!/usr/bin/env python3
"""RePrime — Embed sources for NL discovery (Phase 4, ADR-002).

Reads `sources` from Supabase, generates embeddings for rows missing one,
writes back via PostgREST. Idempotent.

Provider: Vercel AI Gateway by default (env: AI_GATEWAY_API_KEY + AI_GATEWAY_URL);
fallback to OpenAI direct (env: OPENAI_API_KEY).
Model: env EMBEDDING_MODEL or default 'openai/text-embedding-3-small' (1536 dims).

Run from GitHub Actions cron after rest_load_catalog.py:
    python3 pipeline/embed_sources.py

Env required:
    SUPABASE_URL
    SUPABASE_SERVICE_KEY   (bypass-RLS write back to sources)
    AI_GATEWAY_API_KEY     (preferred) OR OPENAI_API_KEY
"""
from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

AI_GATEWAY_URL = os.environ.get("AI_GATEWAY_URL", "https://ai-gateway.vercel.sh/v1").rstrip("/")
AI_GATEWAY_KEY = os.environ.get("AI_GATEWAY_API_KEY", "")
OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")

EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "openai/text-embedding-3-small")
BATCH_SIZE = int(os.environ.get("EMBED_BATCH_SIZE", "100"))
MAX_ROWS = int(os.environ.get("EMBED_MAX_ROWS", "0"))   # 0 = no cap


def _log(msg: str) -> None:
    print(f"[embed_sources] {msg}", flush=True)


def _http(method: str, url: str, headers: dict, body: dict | None = None, timeout: int = 60) -> dict:
    """Minimal urllib request with JSON in/out."""
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, method=method, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
        return json.loads(raw.decode("utf-8")) if raw else {}


def _sb_headers(*, prefer: str = "") -> dict:
    h = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
    }
    if prefer:
        h["Prefer"] = prefer
    return h


def fetch_unembedded_sources() -> list[dict]:
    """Return source rows where embedded_at IS NULL."""
    url = (
        f"{SUPABASE_URL}/rest/v1/sources?"
        "select=id,name,category,provider,url,type,tier,auth&"
        "embedded_at=is.null&"
        "order=id.asc"
    )
    if MAX_ROWS:
        url += f"&limit={MAX_ROWS}"
    resp = _http("GET", url, _sb_headers())
    if not isinstance(resp, list):
        _log(f"unexpected response shape: {type(resp)}")
        return []
    return resp


def update_source_embedding(source_id: int, vec: list[float], emb_text: str) -> None:
    url = f"{SUPABASE_URL}/rest/v1/sources?id=eq.{source_id}"
    body = {
        "embedding": vec,
        "embedding_text": emb_text,
        "embedded_at": "now()",
    }
    _http("PATCH", url, _sb_headers(prefer="return=minimal"), body, timeout=30)


def _provider_request(texts: list[str]) -> list[list[float]]:
    """Call the embedding provider. Returns vectors aligned with `texts`."""
    if AI_GATEWAY_KEY:
        url = f"{AI_GATEWAY_URL}/embeddings"
        headers = {
            "Authorization": f"Bearer {AI_GATEWAY_KEY}",
            "Content-Type": "application/json",
        }
        body = {"model": EMBEDDING_MODEL, "input": texts}
    elif OPENAI_KEY:
        url = "https://api.openai.com/v1/embeddings"
        headers = {
            "Authorization": f"Bearer {OPENAI_KEY}",
            "Content-Type": "application/json",
        }
        model = EMBEDDING_MODEL.split("/", 1)[-1] if "/" in EMBEDDING_MODEL else EMBEDDING_MODEL
        body = {"model": model, "input": texts}
    else:
        raise RuntimeError("No embedding key set. Provide AI_GATEWAY_API_KEY or OPENAI_API_KEY.")

    resp = _http("POST", url, headers, body, timeout=60)
    data = resp.get("data") or []
    vecs = [item.get("embedding") for item in data]
    if len(vecs) != len(texts):
        raise RuntimeError(f"provider returned {len(vecs)} vectors for {len(texts)} inputs")
    return vecs


def build_embedding_text(row: dict) -> str:
    """Concatenate the source's discoverability text — order matters for embedding."""
    parts = [
        row.get("name", "") or "",
        row.get("provider", "") or "",
        row.get("category", "") or "",
        row.get("type", "") or "",
        row.get("tier", "") or "",
        row.get("auth", "") or "",
    ]
    return " | ".join(p.strip() for p in parts if p and p.strip())


def main() -> int:
    if not SUPABASE_URL or not SERVICE_KEY:
        _log("SUPABASE_URL and SUPABASE_SERVICE_KEY are required")
        return 2
    if not (AI_GATEWAY_KEY or OPENAI_KEY):
        _log("AI_GATEWAY_API_KEY or OPENAI_API_KEY is required")
        return 2

    rows = fetch_unembedded_sources()
    if not rows:
        _log("nothing to embed — every source has an embedding")
        return 0
    _log(f"fetched {len(rows)} sources needing embedding")

    texts = [build_embedding_text(r) for r in rows]
    total_embedded = 0
    started = time.time()

    for i in range(0, len(rows), BATCH_SIZE):
        chunk = rows[i:i + BATCH_SIZE]
        chunk_texts = texts[i:i + BATCH_SIZE]
        try:
            vecs = _provider_request(chunk_texts)
        except Exception as e:  # noqa: BLE001
            _log(f"batch {i}-{i + len(chunk)} failed once: {e!r}; retrying after 2s")
            time.sleep(2)
            try:
                vecs = _provider_request(chunk_texts)
            except Exception as e2:  # noqa: BLE001
                _log(f"batch {i}-{i + len(chunk)} failed again: {e2!r}; skipping")
                continue

        for src, vec, txt in zip(chunk, vecs, chunk_texts):
            try:
                update_source_embedding(src["id"], vec, txt)
                total_embedded += 1
            except Exception as e:  # noqa: BLE001
                _log(f"  patch failed for source id={src.get('id')}: {e!r}")

        _log(f"batch {i}-{i + len(chunk)}: embedded {len(vecs)} (running total {total_embedded})")

    elapsed = time.time() - started
    _log(f"done: {total_embedded}/{len(rows)} sources embedded in {elapsed:.1f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
