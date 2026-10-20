// Tek dosyalık index.html + PWA dosyalarını dist/ içine üretir.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const src = (p) => fs.readFileSync(path.join(root, 'src', p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, 'src', p));

const cssFiles = ['tokens.css', 'components.css', 'views/pathways.css', 'views/map.css', 'views/hubs.css', 'views/enzymes.css', 'views/search.css', 'views/diseases.css', 'views/toxins.css', 'views/exam.css'];
const jsFiles = ['data.js', 'data-diseases.js', 'data-toxins.js', 'data-summaries.js', 'core.js', 'views/pathways.js', 'views/map.js', 'views/hubs.js', 'views/enzymes.js', 'views/search.js', 'views/diseases.js', 'views/toxins.js', 'views/exam.js', 'main.js'];

const css = cssFiles.filter(exists).map(f => `/* ==== ${f} ==== */\n` + src(f)).join('\n');
const js = jsFiles.filter(exists).map(f => `/* ==== ${f} ==== */\n` + src(f)).join('\n;\n');

const pwa = process.argv.includes('--no-pwa') ? '' : [
  '<link rel="manifest" href="manifest.webmanifest">',
  '<link rel="apple-touch-icon" href="icon-180.png">',
  '<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">'
].join('\n  ');

let html = src('index.html')
  .replace('<!--HEAD_LINKS-->', pwa)
  .replace('/*CSS*/', () => css)
  .replace('/*JS*/', () => js.replace(/<\/script/gi, '<\\/script'));

const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify({
  name: 'Metabolizma — Entegre Yolaklar Atlası',
  short_name: 'Metabolizma',
  lang: 'tr',
  start_url: './',
  scope: './',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#F2F2F7',
  theme_color: '#F2F2F7',
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
  ]
}, null, 2));
fs.writeFileSync(path.join(out, 'sw.js'), `const C='metabolizma-v${Date.now()}';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
`);
console.log('dist/index.html', (html.length / 1024).toFixed(1) + ' KB');

// Claude Artifact sürümü: iskelet (doctype/head/body) yayıncı tarafından eklenir.
{
  const styleBlock = html.match(/<style>[\s\S]*?<\/style>/)[0];
  const scriptBlock = html.match(/<script>[\s\S]*<\/script>/)[0];
  const art = `<title>Metabolizma Atlası</title>
<meta name="theme-color" content="#F2F2F7">
${styleBlock}
<div id="app"></div>
${scriptBlock}
`;
  fs.writeFileSync(path.join(out, 'artifact.html'), art);
}
