const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs>
 <linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#3EA3FF"/><stop offset="0.55" stop-color="#2F6BFF"/><stop offset="1" stop-color="#5A3FE0"/></linearGradient>
 <radialGradient id="sh" cx="0.3" cy="0.12" r="0.9"><stop offset="0" stop-color="#fff" stop-opacity="0.32"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></radialGradient>
 <filter id="d" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#1a1060" flood-opacity="0.35"/></filter>
</defs>
<rect width="1024" height="1024" fill="url(#g)"/><rect width="1024" height="1024" fill="url(#sh)"/>
<g transform="translate(0 50)">
<g filter="url(#d)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="512" cy="600" r="178" stroke-width="44"/>
  <path d="M512 250 V 392" stroke-width="44"/>
  <path d="M648 566 L690 618 L732 566" stroke-width="40"/>
  <path d="M376 634 L334 582 L292 634" stroke-width="40"/>
</g>
<g filter="url(#d)">
  <circle cx="512" cy="196" r="64" fill="#fff"/>
  <circle cx="512" cy="422" r="42" fill="#fff"/>
  <circle cx="512" cy="600" r="56" fill="#FFD60A"/>
</g>
</g>
</svg>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  await p.setContent(`<html><body style="margin:0">${svg}</body></html>`);
  for (const s of [512, 192, 180]) {
    await p.setViewportSize({ width: s, height: s });
    await p.evaluate((s) => { const e = document.querySelector('svg'); e.setAttribute('width', s); e.setAttribute('height', s); }, s);
    await p.screenshot({ path: path.join(__dirname, '..', 'dist', `icon-${s}.png`) });
  }
  await b.close();
})();
