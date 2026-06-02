"""RePrime /api/health — liveness + build metadata (Vercel Python function)."""
import json
import os
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler

VERSION = "4.0-consolidated"
_BOOT = time.time()


class handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802
        body = json.dumps({
            "status": "ok",
            "version": VERSION,
            "service": "reprime-data-platform",
            "uptime_seconds": round(time.time() - _BOOT, 1),
            "region": os.environ.get("VERCEL_REGION", "local"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.end_headers()
