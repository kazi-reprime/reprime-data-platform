/* RePrime — centralized Supabase browser config (Phase 2 task 2.3)
 *
 * Single source of truth for the Supabase URL + anon (publishable) key.
 * Every browser file (sb.js, panels.js, viz.js, globe.js, dashboard.html,
 * wall.html, data-coverage.html) reads from `window.RP_SB` instead of
 * inlining its own copy.
 *
 * Rotation is now a 1-file edit (this file) instead of a 7-file edit.
 *
 * The anon key is RLS-bound (read-only via policies in pipeline/schema.sql).
 * Service-role keys are NEVER allowed in client code.
 */
(function () {
  'use strict';
  if (window.RP_SB) return; // already loaded

  var URL = 'https://gugcmsqrscqqqltdtgkz.supabase.co';
  var ANON_KEY = 'sb_publishable_J5zIiHNf1VqpQ7r14SevFw__MbvlEpm';

  function headers() {
    return { apikey: ANON_KEY, Authorization: 'Bearer ' + ANON_KEY };
  }

  function rest(path, opts) {
    opts = opts || {};
    var h = headers();
    if (opts.headers) Object.keys(opts.headers).forEach(function (k) { h[k] = opts.headers[k]; });
    return fetch(URL + '/rest/v1/' + path, { headers: h, method: opts.method || 'GET', body: opts.body });
  }

  /**
   * Call a Postgres function via PostgREST RPC endpoint.
   * Used by Phase 4 NL source discovery (match_sources RPC).
   */
  function rpc(fn, args) {
    return fetch(URL + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers()),
      body: JSON.stringify(args || {})
    });
  }

  window.RP_SB = {
    URL: URL,
    KEY: ANON_KEY,
    headers: headers,
    rest: rest,
    rpc: rpc
  };
})();
