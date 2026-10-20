const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [w,h,scheme] of [[375,667,'light'],[430,932,'dark'],[320,568,'light']]) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, isMobile:true, hasTouch:true, colorScheme:scheme, deviceScaleFactor:1 });
    const p = await ctx.newPage(); const errs=[];
    p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
    await p.goto('file://'+path.join(__dirname,'..','dist','index.html')); await p.waitForTimeout(400);
    const check = async (label) => {
      await p.waitForTimeout(650);
      const r = await p.evaluate(() => { const pg=document.querySelector('.tab-scene.is-active .page:last-child'); const sc=pg.querySelector('.page-scroll');
        const over=[...pg.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+1&&!e.closest('.map-viewport,.chip-row,[class*=map-]')}).slice(0,3).map(e=>e.className+':'+Math.round(e.getBoundingClientRect().right));
        return {sw:sc.scrollWidth,cw:sc.clientWidth,over}; });
      if (r.sw>r.cw+1 || r.over.length) console.log(w, scheme, label, JSON.stringify(r));
    };
    for (const t of ['pathways','map','hubs','enzymes','search']) { await p.locator(`.tab-item[data-tab=${t}]`).tap(); await check('tab '+t); }
    await p.locator('.tab-item[data-tab=pathways]').tap();
    const D = await p.evaluate(()=>App.data.pathways.map(x=>[x.id,x.steps.length]));
    for (const [id,n] of D) { await p.evaluate(id=>App.open('pathway',{id}),id); await check('pw '+id); await p.evaluate(()=>App.pop({animate:false})); }
    await p.evaluate(()=>App.open('step',{pw:'glikoliz',idx:0})); await check('step0');
    for (let i=1;i<39;i++){ await p.evaluate(()=>{const b=[...document.querySelectorAll('.tab-scene.is-active .page:last-child .float-toolbar button')].pop(); b.click();}); await check('step '+i); }
    await p.evaluate(()=>App.open('legend')); await check('legend');
    await p.locator('.tab-item[data-tab=hubs]').tap();
    const H = await p.evaluate(()=>App.data.hubs.map(h=>h.id));
    for (const id of H) { await p.evaluate(id=>App.open('hub',{id}),id); await check('hub '+id); await p.evaluate(()=>App.pop({animate:false})); }
    await p.locator('.tab-item[data-tab=enzymes]').tap(); await p.evaluate(()=>{const s=document.querySelector('.tab-scene.is-active [data-segmented] button:last-child'); s&&s.click()}); await check('enz all');
    await p.locator('.tab-item[data-tab=search]').tap(); await p.locator('#srch-q').fill('koa'); await check('search koa');
    await p.evaluate(()=>App.openSettings()); await p.waitForTimeout(600);
    console.log(w,h,scheme,'errors:',errs.length?errs.slice(0,5):'none');
    await ctx.close();
  }
  await b.close();
})();
