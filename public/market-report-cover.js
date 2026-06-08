/* RePrime Group — Editorial Market Report Cover
 *
 * Editorial-style quarterly market report panel — photo-led left,
 * large display headline + 6-KPI grid right with YoY delta badges.
 * Pure DOM construction, RePrime gold/navy palette, original code.
 *
 * Mounts into #rp-market-report.
 */
(function () {
  'use strict';
  var el = document.getElementById('rp-market-report');
  if (!el) return;

  var COVER = {
    quarter: 'Q3 2025',
    title: 'TRENDS',
    subtitle: 'RePrime Group · Institutional CRE Insights',
    market: 'Top 25 U.S. Markets',
    category: 'Multifamily · Office · Industrial · Retail · Mixed-Use',
    image: '/images/om_p1_img1.jpeg',
    kpis: [
      { label: 'Median Sales Price',  value: '$1.65M',  delta:  3.0, source: 'CoreLogic' },
      { label: 'Median PPSF',         value: '$697',    delta:  0.0, source: 'CoStar' },
      { label: 'Active Listings',     value: '2,273',   delta:  8.0, source: 'MLS Aggregate' },
      { label: 'Sold Listings',       value: '633',     delta: -2.0, source: 'MLS Aggregate' },
      { label: 'Avg. Days on Market', value: '85',      delta: 12.0, source: 'Public Records' },
      { label: 'Total Volume',        value: '$5.9B',   delta: -0.8, source: 'RePrime Catalog' }
    ]
  };

  function deltaBadge(d) {
    var s = document.createElement('span');
    var pos = d > 0, neg = d < 0;
    var color = pos ? 'var(--green,#22c55e)' : (neg ? 'var(--red,#ef4444)' : 'var(--muted,#94a3b8)');
    s.style.cssText = 'display:inline-block;margin-left:8px;font-size:11px;font-weight:600;color:' + color +
                      ";font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums slashed-zero";
    s.textContent = (pos ? '+' : '') + d.toFixed(1) + '%';
    return s;
  }

  function buildKpiCell(k) {
    var cell = document.createElement('div');
    cell.style.cssText = 'padding:18px 0;border-bottom:1px solid var(--border,rgba(255,255,255,.08))';

    var labelRow = document.createElement('div');
    labelRow.style.cssText = 'font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#94a3b8);margin-bottom:8px';
    labelRow.textContent = k.label;
    cell.appendChild(labelRow);

    var valueRow = document.createElement('div');
    valueRow.style.cssText = 'display:flex;align-items:baseline;gap:0';
    var val = document.createElement('span');
    val.style.cssText = "font-family:'Fraunces','Poppins',serif;font-size:38px;font-weight:300;color:var(--text);letter-spacing:-0.02em;font-variant-numeric:tabular-nums slashed-zero";
    val.textContent = k.value;
    valueRow.appendChild(val);
    valueRow.appendChild(deltaBadge(k.delta));
    cell.appendChild(valueRow);

    var src = document.createElement('div');
    src.style.cssText = 'font-size:9px;color:var(--muted,#94a3b8);opacity:.7;margin-top:4px;letter-spacing:.04em;text-transform:uppercase';
    src.textContent = 'Source · ' + k.source + ' · YoY';
    cell.appendChild(src);

    return cell;
  }

  function shell() {
    el.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'rp-glass-2';
    wrap.style.cssText = 'max-width:1280px;margin:24px auto;overflow:hidden;display:grid;grid-template-columns:minmax(280px,5fr) 7fr;gap:0;align-items:stretch';

    var photo = document.createElement('div');
    photo.style.cssText = 'position:relative;min-height:560px;background-image:linear-gradient(135deg,rgba(15,30,61,.4),rgba(2,6,23,.2)),url(\'' + COVER.image + '\');background-size:cover;background-position:center';
    var photoOverlay = document.createElement('div');
    photoOverlay.style.cssText = 'position:absolute;left:0;right:0;bottom:0;padding:24px;background:linear-gradient(to top, rgba(2,6,23,.92), rgba(2,6,23,0))';
    var photoTitle = document.createElement('div');
    photoTitle.style.cssText = 'font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--gold,#BC9C45);margin-bottom:4px';
    photoTitle.textContent = 'Featured Cover';
    var photoSub = document.createElement('div');
    photoSub.style.cssText = 'font-size:13px;color:var(--text);font-weight:500';
    photoSub.textContent = 'Reviewed Sample · Multifamily, South Florida';
    photoOverlay.appendChild(photoTitle); photoOverlay.appendChild(photoSub);
    photo.appendChild(photoOverlay);

    var right = document.createElement('div');
    right.style.cssText = 'padding:48px 48px 36px;display:flex;flex-direction:column;min-width:0';

    var eyebrow = document.createElement('div');
    eyebrow.style.cssText = 'font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--muted,#94a3b8);margin-bottom:8px';
    eyebrow.textContent = COVER.quarter + ' — Market Report';

    var title = document.createElement('h1');
    title.style.cssText = "font-family:'Fraunces','Poppins',serif;font-size:clamp(56px,9vw,96px);font-weight:300;line-height:.95;letter-spacing:-0.04em;color:var(--text);margin:0 0 16px";
    title.textContent = COVER.title;

    var subtitle = document.createElement('div');
    subtitle.style.cssText = 'font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text);margin-bottom:6px';
    subtitle.textContent = COVER.subtitle;

    var category = document.createElement('div');
    category.style.cssText = 'font-size:11px;color:var(--muted,#94a3b8);margin-bottom:24px';
    category.textContent = COVER.market + ' · ' + COVER.category;

    var divider = document.createElement('div');
    divider.style.cssText = 'height:1px;background:var(--border,rgba(255,255,255,.12));margin:12px 0 8px';

    var marketLine = document.createElement('div');
    marketLine.style.cssText = "font-family:'Fraunces','Poppins',serif;font-size:24px;font-weight:400;color:var(--text);margin:18px 0 6px";
    marketLine.textContent = COVER.market;
    var sub2 = document.createElement('div');
    sub2.style.cssText = 'font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted,#94a3b8);margin-bottom:6px';
    sub2.textContent = COVER.category;

    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 36px;margin-top:14px';
    COVER.kpis.forEach(function (k) { grid.appendChild(buildKpiCell(k)); });

    var footer = document.createElement('div');
    footer.style.cssText = 'margin-top:auto;padding-top:18px;display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:8px';
    var footL = document.createElement('div');
    footL.style.cssText = 'font-size:9px;color:var(--muted,#94a3b8);max-width:60%;line-height:1.5';
    footL.textContent = '* Sample data. Aggregated from public records + RePrime catalog. Reviewed / Sourced / Advised — no claim of ownership.';
    var footR = document.createElement('a');
    footR.href = '/wall';
    footR.style.cssText = 'font-size:11px;color:var(--gold,#BC9C45);text-decoration:none;font-weight:700;letter-spacing:.05em';
    footR.textContent = 'RePrime Group / RePrime Terminal →';
    footer.appendChild(footL); footer.appendChild(footR);

    right.appendChild(eyebrow);
    right.appendChild(title);
    right.appendChild(subtitle);
    right.appendChild(category);
    right.appendChild(divider);
    right.appendChild(marketLine);
    right.appendChild(sub2);
    right.appendChild(grid);
    right.appendChild(footer);

    wrap.appendChild(photo);
    wrap.appendChild(right);
    el.appendChild(wrap);

    var style = document.createElement('style');
    style.textContent = '@media(max-width:880px){#rp-market-report > div{grid-template-columns:1fr!important}}';
    el.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', shell);
  else shell();
})();
