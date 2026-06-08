/**
 * RePrime Data Platform — Routing Middleware
 *
 * Phase 2 task 2.7: per-IP rate limit on /api/search.
 *
 * Framework-agnostic: uses only standard Web Platform types (Request,
 * Response, URL) — no `next/server` dependency. Vercel's Routing
 * Middleware product picks this up automatically.
 *
 * Strategy:
 *   - 30 requests per 60 seconds per IP for /api/search.
 *   - Edge-isolate-local Map as first-line defense (per region/isolate).
 *     When Upstash Redis is wired (UPSTASH_REDIS_REST_URL + _TOKEN env),
 *     swap in cross-region state — see TODO below.
 *
 * Returns:
 *   - undefined (let request through) for allowed requests.
 *   - 429 Response with Retry-After + rate-limit headers for blocked.
 */

export const config = {
  matcher: '/api/search',
};

const WINDOW_SECONDS = 60;
const LIMIT = 30;

interface BucketEntry {
  count: number;
  windowStart: number; // epoch seconds
}

// Edge-isolate-local Map. Per-region, per-isolate. NOT global.
// TODO: replace with Upstash Redis call for global cross-region limits.
const BUCKETS: Map<string, BucketEntry> = new Map();

function ipFromRequest(req: Request): string {
  const xff = req.headers.get('x-forwarded-for') || '';
  const xri = req.headers.get('x-real-ip') || '';
  const ip = (xff.split(',')[0] || xri || '').trim();
  return ip || 'unknown';
}

function check(key: string): { allowed: boolean; remaining: number; reset: number } {
  const now = Math.floor(Date.now() / 1000);
  const entry = BUCKETS.get(key);
  if (!entry || now - entry.windowStart >= WINDOW_SECONDS) {
    BUCKETS.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: LIMIT - 1, reset: now + WINDOW_SECONDS };
  }
  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0, reset: entry.windowStart + WINDOW_SECONDS };
  }
  entry.count += 1;
  return { allowed: true, remaining: LIMIT - entry.count, reset: entry.windowStart + WINDOW_SECONDS };
}

function maybeGc(): void {
  if (Math.random() < 0.001) {
    const now = Math.floor(Date.now() / 1000);
    for (const [key, entry] of BUCKETS) {
      if (now - entry.windowStart >= WINDOW_SECONDS * 2) BUCKETS.delete(key);
    }
  }
}

export default function middleware(req: Request): Response | undefined {
  const url = new URL(req.url);
  if (!url.pathname.startsWith('/api/search')) return undefined;

  maybeGc();

  const ip = ipFromRequest(req);
  const { allowed, remaining, reset } = check(ip);

  if (!allowed) {
    const retryAfter = Math.max(1, reset - Math.floor(Date.now() / 1000));
    return new Response(
      JSON.stringify({
        error: 'rate_limited',
        message: `Too many requests. Limit: ${LIMIT} per ${WINDOW_SECONDS} seconds.`,
        retry_after_seconds: retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(LIMIT),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
        },
      }
    );
  }

  // Allowed — let the request pass through to the upstream handler.
  // (Framework-agnostic Routing Middleware can't mutate downstream response
  // headers when returning undefined, so X-RateLimit-* are only set on 429.
  // Remaining/Reset can be inspected via /api/search itself if needed.)
  return undefined;
}
