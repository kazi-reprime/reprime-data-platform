/* RePrime Group content layer — real company data scraped from reprime.com.
   Reads /data/reprime.json (refreshed by pipeline/scrape_reprime.py on the cron)
   and renders branded sections into any anchor present on the page:
     #rp-stats #rp-portals #rp-services #rp-operate #rp-close
     #rp-market #rp-partners #rp-testimonials #rp-team #rp-faq #rp-contact
   Only sections whose anchor exists are rendered. Styling uses brand tokens
   from rp-shell.css so it matches every page. Nothing is hardcoded per-page. */
(function () {
  "use strict";
  var DATA = "/data/reprime.json";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[<>&]/g, function (c) { return { "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]; }); };
  var $ = function (id) { return document.getElementById(id); };

  var R = {};

  R.stats = function (el, d) {
    el.innerHTML =
      '<div style="display:grid;grid-template-columns:repeat(' + d.stats.length + ',1fr);gap:1px;background:var(--border);border-radius:16px;overflow:hidden;max-width:1280px;margin:0 auto">' +
      d.stats.map(function (s) {
        return '<div style="background:var(--card-bg);backdrop-filter:blur(20px);padding:28px 18px;text-align:center">' +
          '<div style="font-family:\'JetBrains Mono\',monospace;font-size:30px;font-weight:800;color:var(--gold)">' + esc(s.value) + '</div>' +
          '<div style="font-size:11px;font-weight:500;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:4px">' + esc(s.label) + '</div></div>';
      }).join("") + '</div>';
  };

  R.portals = function (el, d) {
    el.innerHTML = section("Who We Serve", "Three doors into RePrime", "") +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:1280px;margin:0 auto">' +
      d.portals.map(function (p) {
        return card(
          '<div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:10px">' + esc(p.audience) + '</div>' +
          '<div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px">' + esc(p.title) + '</div>' +
          '<div style="font-size:13px;color:var(--muted);font-weight:300;line-height:1.5;margin-bottom:18px">' + esc(p.desc) + '</div>' +
          '<a href="' + esc(p.url) + '" target="_blank" rel="noopener" class="btn btn-gold" style="font-size:13px">' + esc(p.cta) + ' →</a>');
      }).join("") + '</div>';
  };

  R.services = function (el, d) {
    el.innerHTML = section("What We Do", "A fully integrated CRE platform", "Vertically integrated: disciplined acquisitions, strategic development, operational oversight, and construction execution — scalable value across diversified U.S. commercial real estate markets.") +
      grid(d.services.map(function (s) {
        return card('<div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:8px">' + esc(s.title) + '</div><div style="font-size:13px;color:var(--muted);font-weight:300;line-height:1.5">' + esc(s.desc) + '</div>');
      }), 3);
  };

  R.operate = function (el, d) {
    el.innerHTML = section("How We Operate", "Discipline, speed, certainty", "") +
      grid(d.operate.map(function (s) {
        return card('<div style="font-size:15px;font-weight:600;color:var(--gold);margin-bottom:8px">' + esc(s.title) + '</div><div style="font-size:13px;color:var(--muted);font-weight:300;line-height:1.5">' + esc(s.desc) + '</div>');
      }), 4);
  };

  R.close = function (el, d) {
    el.innerHTML = section("One Deal. Five Ways to Close.", "Backed by our partner network", "Each buyer group brings a different structure. Every broker submission is evaluated by all five groups independently — you choose. Cap-rate differentials are indicative only and vary by asset, structure, and market.") +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;max-width:1280px;margin:0 auto">' +
      d.close_options.map(function (o) {
        return card(
          '<div style="display:inline-block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#000;background:var(--grad-gold);padding:3px 9px;border-radius:99px;margin-bottom:10px">' + esc(o.tag) + '</div>' +
          '<div style="font-size:16px;font-weight:700;color:var(--text)">' + esc(o.name) + '</div>' +
          '<div style="font-size:12px;color:var(--gold);font-weight:600;margin:2px 0 8px">' + esc(o.timeline) + '</div>' +
          '<div style="font-size:12px;color:var(--muted);font-weight:300;line-height:1.5;margin-bottom:12px">' + esc(o.desc) + '</div>' +
          '<div style="font-family:\'JetBrains Mono\',monospace;font-size:12px;color:var(--text2,var(--text))">' + esc(o.size) + '</div>' +
          '<div style="font-family:\'JetBrains Mono\',monospace;font-size:11px;color:var(--muted)">' + esc(o.pricing) + '</div>');
      }).join("") + '</div>';
  };

  R.market = function (el, d) {
    el.innerHTML = section("Market Pulse", "CRE intelligence, sourced", "Live institutional benchmarks. Every number sourced.") +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;max-width:1280px;margin:0 auto">' +
      d.market.map(function (m) {
        return card(
          '<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">' + esc(m.label) + '</div>' +
          '<div style="font-family:\'JetBrains Mono\',monospace;font-size:20px;font-weight:700;color:var(--text)">' + esc(m.value) + '</div>' +
          '<div style="font-size:10px;color:var(--gold);margin-top:4px">' + esc(m.source) + '</div>', "16px");
      }).join("") + '</div>';
  };

  R.partners = function (el, d) {
    var chips = d.partners.map(function (p) {
      return '<span style="display:inline-block;padding:8px 18px;margin:5px;background:var(--surface);border:1px solid var(--border);border-radius:8px;font-size:12px;font-weight:500;color:var(--text2,var(--text));white-space:nowrap">' + esc(p) + '</span>';
    }).join("");
    el.innerHTML = section("Partners & Lender Network", "Institutions we've transacted with", "") +
      '<div style="max-width:1280px;margin:0 auto;text-align:center">' + chips + '</div>' +
      '<div style="max-width:900px;margin:14px auto 0;text-align:center;font-size:10px;color:var(--dim)">' + esc(d.trademark_disclaimer) + '</div>';
  };

  R.testimonials = function (el, d) {
    el.innerHTML = section("In Their Words", "Every institution put it in writing", "Titles and affiliations are shown as at the time of the transaction and may have changed since.") +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;max-width:1280px;margin:0 auto">' +
      d.testimonials.map(function (t) {
        return card(
          '<div style="font-size:14px;color:var(--text);font-weight:300;line-height:1.5;font-style:italic">"' + esc(t.quote) + '"</div>' +
          '<div style="margin-top:14px;font-size:13px;font-weight:600;color:var(--gold)">' + esc(t.org) + '</div>' +
          '<div style="font-size:11px;color:var(--muted)">' + esc(t.property) + '</div>' +
          '<div style="font-size:11px;color:var(--dim);margin-top:4px">— ' + esc(t.by) + '</div>');
      }).join("") + '</div>';
  };

  R.team = function (el, d) {
    el.innerHTML = section("Leadership", "The people driving RePrime Group", "Not consultants. Real estate operators with decades of hands-on experience.") +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;max-width:1280px;margin:0 auto">' +
      d.team.map(function (m, i) {
        return '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:16px;padding:24px;text-align:center;transition:border-color .3s">' +
          '<img src="' + esc(m.photo) + '" alt="' + esc(m.name) + '" loading="lazy" style="width:96px;height:96px;border-radius:50%;object-fit:cover;margin:0 auto 14px;display:block;border:2px solid var(--gold)" onerror="this.style.display=\'none\'">' +
          '<div style="font-size:16px;font-weight:700;color:var(--text)">' + esc(m.name) + '</div>' +
          '<div style="font-size:12px;color:var(--gold);font-weight:500;margin:2px 0 10px">' + esc(m.role) + '</div>' +
          '<div style="font-size:12px;color:var(--muted);font-weight:300;line-height:1.5">' + esc(m.blurb) + '</div>' +
          '<div onclick="__rpBio(' + i + ')" style="margin-top:10px;font-size:11px;color:var(--gold);cursor:pointer;font-weight:600">Read bio ▾</div>' +
          '<div id="rpbio-' + i + '" style="display:none;margin-top:10px;font-size:12px;color:var(--text2,var(--text));font-weight:300;line-height:1.55;text-align:left">' + esc(m.bio) + '</div></div>';
      }).join("") + '</div>';
  };

  R.faq = function (el, d) {
    el.innerHTML = section("FAQ", "Questions, answered", "") +
      '<div style="max-width:860px;margin:0 auto">' +
      d.faq.map(function (f, i) {
        return '<div style="border-bottom:1px solid var(--border)">' +
          '<div onclick="__rpFaq(' + i + ')" style="display:flex;justify-content:space-between;gap:12px;padding:16px 4px;cursor:pointer;font-size:15px;font-weight:600;color:var(--text)"><span>' + esc(f.q) + '</span><span id="rpfaqi-' + i + '" style="color:var(--gold)">+</span></div>' +
          '<div id="rpfaq-' + i + '" style="display:none;padding:0 4px 16px;font-size:13px;color:var(--muted);font-weight:300;line-height:1.6">' + esc(f.a) + '</div></div>';
      }).join("") + '</div>';
  };

  R.contact = function (el, d) {
    var c = d.contact;
    el.innerHTML = section("Contact", "Start a direct conversation", "Whether you're submitting a deal, evaluating opportunities, or exploring strategic alignment — our team responds with speed, clarity, and institutional precision.") +
      '<div style="max-width:700px;margin:0 auto;display:flex;flex-wrap:wrap;gap:12px;justify-content:center">' +
      pill("✉️ " + esc(c.email), "mailto:" + esc(c.email)) +
      pill("📞 " + esc(c.phone), esc(c.phone_link)) +
      pill("📍 " + esc(c.address), "#") +
      pill("Submit a Deal →", esc(c.submit_deal)) + '</div>';
  };

  R.terminal = function (el, d) {
    var t = d.terminal; if (!t) return;
    el.innerHTML = section("RePrime Terminal — Investor Access", t.headline, t.subhead) +
      '<div style="max-width:1000px;margin:0 auto;text-align:center">' +
        '<div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:99px;background:var(--surface);border:1px solid var(--border);font-size:11px;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:18px">' + esc(t.status) + '</div>' +
        '<div style="font-size:14px;color:var(--muted);font-weight:300;line-height:1.7;max-width:700px;margin:0 auto 20px">' + esc(t.founding_note) + '</div>' +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">' +
          t.ctas.map(function (c, i) { return '<a href="' + esc(c.url) + '" target="_blank" rel="noopener" class="btn ' + (i === 0 ? "btn-gold" : "btn-glass") + '">' + esc(c.label) + ' →</a>'; }).join("") +
        '</div>' +
        '<div style="font-size:11px;color:var(--dim);margin-top:16px">' + esc(t.disclaimer) + '</div></div>';
  };

  R.membership = function (el, d) {
    var t = d.terminal; if (!t) return;
    el.innerHTML = section("Membership", "Three lanes. One terminal.", t.tagline) +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;max-width:1280px;margin:0 auto;align-items:start">' +
      t.tiers.map(function (tier) {
        return '<div style="background:var(--card-bg);border:1px solid ' + (tier.popular ? "var(--gold)" : "var(--border)") + ';border-radius:16px;padding:26px;position:relative">' +
          (tier.popular ? '<div style="position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--grad-gold);color:#000;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;padding:4px 12px;border-radius:99px">Most Popular</div>' : "") +
          '<div style="font-size:16px;font-weight:700;color:var(--text)">' + esc(tier.name) + '</div>' +
          '<div style="font-family:\'JetBrains Mono\',monospace;font-size:26px;font-weight:800;color:var(--gold);margin:6px 0 2px">' + esc(tier.price) + '</div>' +
          '<div style="font-size:11px;color:var(--green);font-weight:600;margin-bottom:6px">' + esc(tier.comp) + '</div>' +
          '<div style="font-size:12px;color:var(--muted);font-weight:300;line-height:1.5;margin-bottom:14px">' + esc(tier.lane) + '</div>' +
          '<div>' + tier.features.map(function (f) { return '<div style="display:flex;gap:8px;align-items:flex-start;font-size:12px;color:var(--text2,var(--text));font-weight:300;margin-bottom:7px"><span style="color:var(--gold)">✓</span><span>' + esc(f) + '</span></div>'; }).join("") + '</div></div>';
      }).join("") + '</div>' +
      '<div style="max-width:700px;margin:18px auto 0;text-align:center;font-size:11px;color:var(--dim)">' + esc(t.disclaimer) + '</div>';
  };

  /* ---- helpers ---- */
  function section(label, title, desc) {
    return '<div style="max-width:1280px;margin:0 auto 28px;text-align:center">' +
      '<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--gold);margin-bottom:10px">' + esc(label) + '</div>' +
      '<div style="font-size:clamp(24px,3vw,34px);font-weight:700;color:var(--text);line-height:1.15">' + esc(title) + '</div>' +
      (desc ? '<div style="font-size:14px;color:var(--muted);font-weight:300;max-width:640px;margin:12px auto 0;line-height:1.6">' + esc(desc) + '</div>' : "") + '</div>';
  }
  function card(inner, pad) {
    return '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:16px;padding:' + (pad || "24px") + ';transition:border-color .3s">' + inner + '</div>';
  }
  function grid(cards, cols) {
    return '<div style="display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:16px;max-width:1280px;margin:0 auto">' + cards.join("") + '</div>';
  }
  function pill(text, href) {
    return '<a href="' + href + '"' + (href.indexOf("http") === 0 ? ' target="_blank" rel="noopener"' : "") + ' style="display:inline-flex;align-items:center;gap:6px;padding:12px 20px;background:var(--surface);border:1px solid var(--border);border-radius:10px;font-size:13px;color:var(--text);font-weight:500">' + text + '</a>';
  }

  window.__rpBio = function (i) { var e = $("rpbio-" + i); if (e) e.style.display = e.style.display === "none" ? "block" : "none"; };
  window.__rpFaq = function (i) { var e = $("rpfaq-" + i), ic = $("rpfaqi-" + i); if (e) { var open = e.style.display === "none"; e.style.display = open ? "block" : "none"; if (ic) ic.textContent = open ? "–" : "+"; } };

  function render(d) {
    var map = { "rp-stats": R.stats, "rp-portals": R.portals, "rp-services": R.services, "rp-operate": R.operate, "rp-close": R.close, "rp-market": R.market, "rp-partners": R.partners, "rp-testimonials": R.testimonials, "rp-team": R.team, "rp-faq": R.faq, "rp-contact": R.contact, "rp-terminal": R.terminal, "rp-membership": R.membership };
    Object.keys(map).forEach(function (id) {
      var el = $(id);
      if (el) { try { map[id](el, d); el.style.margin = el.style.margin || "64px 0"; } catch (e) { /* leave anchor empty on error */ } }
    });
  }

  function init() {
    fetch(DATA).then(function (r) { return r.json(); }).then(render).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
