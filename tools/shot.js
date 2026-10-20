// Kullanım: node tools/shot.js <çıktı.png> [--dark] [--w 393 --h 852] [--steps '<JSON dizi>']
// steps: [{"eval":"js"}, {"tap":"css-seçici"}, {"wait":300}, {"type":["#id","metin"]}, {"shot":"ad.png"}]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const out = args[0];
(async () => {
  const browser = await chromium.launch({ executablePath: undefined });
  const ctx = await browser.newContext({
    viewport: { width: +opt('w', 393), height: +opt('h', 852) },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    colorScheme: args.includes('--dark') ? 'dark' : 'light',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ' ' + m.text()); });
  await page.addInitScript(() => { try { sessionStorage.clear(); localStorage.clear(); } catch (e) {} });
  await page.goto('file://' + path.join(__dirname, '..', 'dist', 'index.html'));
  await page.addStyleTag({ content: ':root{--safe-top:59px!important;--safe-bottom:34px!important}' });
  await page.waitForTimeout(400);
  const steps = JSON.parse(opt('steps', '[]'));
  for (const s of steps) {
    if (s.eval) { const r = await page.evaluate(s.eval); if (r !== undefined) console.log('eval →', JSON.stringify(r).slice(0, 2000)); }
    if (s.tap) { await page.locator(s.tap).first().tap(); }
    if (s.type) { await page.locator(s.type[0]).first().fill(s.type[1]); }
    if (s.scroll) { await page.evaluate(([sel, y]) => { const el = document.querySelector(sel); el.scrollTop = y; el.dispatchEvent(new Event('scroll')); }, s.scroll); }
    if (s.wait) await page.waitForTimeout(s.wait);
    if (s.shot) await page.screenshot({ path: s.shot });
    if (!s.wait && !s.shot) await page.waitForTimeout(550);
  }
  if (out && out !== '-') await page.screenshot({ path: out });
  if (errors.length) console.log(errors.join('\n'));
  await browser.close();
})();
