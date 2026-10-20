const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [w,h,s] of [[320,568,'light'],[393,852,'dark']]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile:true, hasTouch:true, colorScheme:s });
  const p = await ctx.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+path.join(__dirname,'..','dist','index.html')); await p.waitForTimeout(400);
  await p.locator('.tab-item[data-tab=enzymes]').tap(); await p.waitForTimeout(400);
  const ids = await p.evaluate(()=>[App.data.diseases.map(d=>['disease',d.id]),App.data.toxins.map(t=>['toxin',t.id])].flat());
  let bad=0;
  for (const [r,id] of ids) {
    await p.evaluate(([r,id])=>App.open(r,{id},{animate:false}),[r,id]); await p.waitForTimeout(120);
    const o = await p.evaluate(()=>{const pg=document.querySelector('.tab-scene.is-active .page:last-child');const sc=pg.querySelector('.page-scroll');return sc.scrollWidth>sc.clientWidth+1 || [...pg.querySelectorAll('*')].some(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1})});
    if (o) { bad++; console.log('overflow', r, id); }
    await p.evaluate(()=>App.pop({animate:false}));
  }
  console.log(w, s, ids.length, 'pages, overflow', bad, 'errors', errs.slice(0,3));
  await ctx.close(); }
  await b.close();
})();
