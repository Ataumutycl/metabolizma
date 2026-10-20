const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport:{width:393,height:852}, isMobile:true, hasTouch:true });
  const p = await ctx.newPage();
  await p.goto('file://'+path.join(__dirname,'..','dist','index.html')); await p.waitForTimeout(400);
  await p.evaluate(()=>App.open('pathway',{id:'tca'})); await p.waitForTimeout(600);
  const cdp = await ctx.newCDPSession(p);
  const depth = () => p.evaluate(()=>App.current.stack.length);
  console.log('before', await depth());
  const t = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type==='touchEnd'?[]:[{x,y}] });
  await t('touchStart', 8, 400);
  for (let x=20; x<=260; x+=20) { await t('touchMove', x, 402); await p.waitForTimeout(16); }
  await t('touchEnd'); await p.waitForTimeout(700);
  console.log('after swipe', await depth());
  // sheet drag-to-dismiss
  await p.evaluate(()=>App.openSettings()); await p.waitForTimeout(700);
  await t('touchStart', 196, 75); for (let y=90; y<=600; y+=40){ await t('touchMove',196,y); await p.waitForTimeout(16);} await t('touchEnd'); await p.waitForTimeout(700);
  console.log('sheets left', await p.evaluate(()=>document.querySelectorAll('.sheet').length), 'scaled', await p.evaluate(()=>document.documentElement.classList.contains('has-sheet-large')));
  await b.close();
})();
