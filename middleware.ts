/**
 * RePrime Data Platform — Edge Middleware
 *
 * Phase 2 task 2.7: per-IP rate limit on /api/search.
 *
 * Strategy:
 *   - 30 requests per 60 seconds per IP for /api/search.
 *   - Edge-isolate-local Map as first-line defense (per region/isolate).
 *     When Upstash Redis is wired (UPSTASH_REDIS_REST_URL + _TOKEN env), swap
 *     in cross-region state — see TODO below.
 *
 * Headers on 429:
 *   - Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 * Headers on 200:
 *   - X-RateLimit-Limit, X-RateLimit-Remaining
 */
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/search'],
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

function ipFromRequest(req: NextRequest): string {
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

function maybeGc() {
  if (Math.random() < 0.001) {
    const now = Math.floor(Date.now() / 1000);
    for (const [key, entry] of BUCKETS) {
      if (now - entry.windowStart >= WINDOW_SECONDS * 2) BUCKETS.delete(key);
    }
  }
}

export default function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api/search')) return NextResponse.next();
  maybeGc();

  const ip = ipFromRequest(req);
  const { allowed, remaining, reset } = check(ip);
  const limitHeaders = {
    'X-RateLimit-Limit': String(LIMIT),
    'X-RateLimit-Remaining': String(Math.max(0, remaining)),
    'X-RateLimit-Reset': String(reset),
  };

  if (!allowed) {
    const retryAfter = Math.max(1, reset - Math.floor(Date.now() / 1000));
    return new NextResponse(
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
          ...limitHeaders,
        },
      }
    );
  }

  const res = NextResponse.next();
  Object.entries(limitHeaders).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}
