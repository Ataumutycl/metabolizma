/* =====================================================================
   HARİTA — interaktif 2B metabolik harita (Apple Maps / Freeform hissi)
   SVG bir kez kurulur; kaydırma / yakınlaştırma yalnızca tek <g> üzerindeki
   transform ile (requestAnimationFrame) yapılır. Jestler: Pointer Events.
   ===================================================================== */
(function () {
  'use strict';

  const D = App.data;
  const UI = App.ui;
  const esc = UI.esc;

  /* ---------------------------- Sabitler ---------------------------- */
  const WORLD = { w: 2400, h: 1750 };
  const FIT_BOX = { x: 10, y: 10, w: 2380, h: 1710 };          // sığdırılan içerik
  const CLAMP_BOX = { x0: -120, x1: 2530, y0: 0, y1: 1750 };    // sürükleme sınırı
  const MAX_SCALE = 2.5;
  const MIN_SCALE_ABS = 0.15;
  const SLOP = 8;

  const ZONES = [
    { id: 'cyto', x: 25, y: 25, w: 1660, h: 895, color: 'var(--blue)', label: 'SİTOZOL & ENDOPLAZMİK RETİKULUM', short: 'SİTOZOL', sub: 'Glikoliz, HMP, glikojen, lipogenez, kolesterol', lx: 650, ly: 66, fx: 690, fy: 108 },
    { id: 'matrix', x: 520, y: 935, w: 1360, h: 760, color: 'var(--orange)', label: 'MİTOKONDRİ MATRİKSİ', short: 'MATRİKS', sub: 'PDH köprüsü, TCA döngüsü, β-oksidasyon, ketogenez', lx: 1100, ly: 985, fx: 900, fy: 1668 },
    { id: 'imm', x: 25, y: 1140, w: 470, h: 555, color: 'var(--purple)', label: 'İÇ MİTOKONDRİ MEMBRANI', short: 'İÇ MEMBRAN', sub: 'Elektron taşıma zinciri (I–V)', lx: 50, ly: 1190, fx: 48, fy: 1210 },
    { id: 'urea', x: 1900, y: 1120, w: 465, h: 575, color: 'var(--cyan)', label: 'ÜRE DÖNGÜSÜ & AA', short: 'ÜRE', sub: 'Mitokondri + sitozol', lx: 1926, ly: 1160, fx: 1926, fy: 1184 }
  ];

  const TYPE_LABEL = { hub: 'Kavşak', 'rate-enzyme': 'Hız kısıtlayıcı enzim', enzyme: 'Enzim', metabolite: 'Metabolit' };

  /* ---------------------------- Yardımcılar ---------------------------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const FONT = '-apple-system, "SF Pro Text", system-ui, "Helvetica Neue", Roboto, sans-serif';
  let _ctx = null;
  function measure(text, size, weight) {
    if (!_ctx) { try { _ctx = document.createElement('canvas').getContext('2d'); } catch (e) { _ctx = false; } }
    if (!_ctx) return text.length * size * 0.56;
    _ctx.font = `${weight || 400} ${size}px ${FONT}`;
    return _ctx.measureText(text).width;
  }
  // Metni genişliğe sığdır: önce küçült, sonra kırp
  function fitText(text, maxW, fs, min, weight) {
    let size = fs, w = measure(text, size, weight);
    if (w <= maxW) return { t: text, fs: size };
    size = Math.max(min, +(fs * maxW / w * 0.97).toFixed(2));
    w = measure(text, size, weight);
    if (w <= maxW) return { t: text, fs: size };
    let t = text;
    while (t.length > 3 && measure(t + '…', size, weight) > maxW) t = t.slice(0, -1);
    return { t: t.trimEnd() + '…', fs: size };
  }
  // En fazla n satıra sar
  function wrapText(text, maxW, size, weight, maxLines) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = '';
    for (let i = 0; i < words.length; i++) {
      const test = cur ? cur + ' ' + words[i] : words[i];
      if (measure(test, size, weight) <= maxW || !cur) cur = test;
      else { lines.push(cur); cur = words[i]; }
      if (lines.length === maxLines) break;
    }
    if (lines.length < maxLines && cur) lines.push(cur);
    const used = lines.join(' ').length;
    const total = words.join(' ').length;
    if (used < total) {
      let last = lines[lines.length - 1];
      while (last.length > 2 && measure(last + '…', size, weight) > maxW) last = last.slice(0, -1);
      lines[lines.length - 1] = last.trimEnd().replace(/[,;:]$/, '') + '…';
    }
    return lines;
  }
  // BÜYÜK HARFLİ başlığı okunur hale getir (kısa kısaltmalar korunur)
  const KEEP = /^(DHAP|GLUT|HMG|CPS|OTC|PFK|TCA|HMP|PDH|ETZ|ATP|GTP|NADH|NADPH|KoA|CoA)$/;
  function cleanTitle(s) {
    s = String(s || '').replace(/^⚡\s*/, '').replace(/\s{2,}/g, ' ').trim();
    return s.replace(/[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû]+/g, (w) => {
      if (w.length <= 3 || KEEP.test(w) || /[a-zçğıöşü]/.test(w)) return w;
      const l = w.toLocaleLowerCase('tr-TR');
      return l.charAt(0).toLocaleUpperCase('tr-TR') + l.slice(1);
    });
  }
  // Parantez dışındaki virgüllerden böl
  function splitTop(s) {
    const out = []; let depth = 0, cur = '';
    s = String(s);
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if ('([{'.includes(ch)) depth++;
      else if (')]}'.includes(ch)) depth = Math.max(0, depth - 1);
      const numComma = ch === ',' && /\d/.test(s[i - 1] || '') && /\d/.test(s[i + 1] || '');
      if (ch === ',' && depth === 0 && !numComma) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out.filter(Boolean);
  }
  function parseRegs(str) {
    return String(str || '').split(/\s*\|\s*/).map((g) => {
      let label = '', body = g;
      const m = g.match(/^([^:,()]{1,22}):\s*(.+)$/);
      if (m) { label = m[1].trim(); body = m[2]; }
      return { label, items: splitTop(body) };
    }).filter(g => g.items.length);
  }
  const bolt = (cls) => `<path class="${cls}" d="M13.4 1.8c.4-.5 1.2-.1 1.1.5L13.6 10h5.2c.6 0 .9.7.5 1.1L10.6 22.2c-.4.5-1.2.1-1.1-.5l.9-7.7H5.2c-.6 0-.9-.7-.5-1.1z"/>`;

  /* ---------------------------- Harita geometrisi ---------------------------- */
  const nodeById = {};
  D.mapNodes.forEach(n => { nodeById[n.id] = n; });

  function edgeGeom(a, b) {
    const cx1 = a.x + a.w / 2, cy1 = a.y + a.h / 2, cx2 = b.x + b.w / 2, cy2 = b.y + b.h / 2;
    const dx = cx2 - cx1, dy = cy2 - cy1;
    const overlapX = (a.w + b.w) / 2 - Math.abs(dx);
    let sx, sy, ex, ey, c1x, c1y, c2x, c2y;
    if (overlapX > 12 && Math.abs(dy) > 4) {
      const down = dy > 0;
      sx = cx1; ex = cx2;
      sy = down ? a.y + a.h : a.y; ey = down ? b.y - 3 : b.y + b.h + 3;
      const k = Math.max(18, Math.abs(ey - sy) * 0.5) * (down ? 1 : -1);
      c1x = sx; c1y = sy + k; c2x = ex; c2y = ey - k;
    } else {
      const right = dx > 0;
      sx = right ? a.x + a.w : a.x; ex = right ? b.x - 3 : b.x + b.w + 3;
      sy = cy1; ey = cy2;
      const k = Math.max(18, Math.abs(ex - sx) * 0.5) * (right ? 1 : -1);
      c1x = sx + k; c1y = sy; c2x = ex - k; c2y = ey;
    }
    const f = (n) => +n.toFixed(1);
    return {
      d: `M${f(sx)} ${f(sy)}C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(ex)} ${f(ey)}`,
      mx: (sx + 3 * c1x + 3 * c2x + ex) / 8,
      my: (sy + 3 * c1y + 3 * c2y + ey) / 8
    };
  }

  /* ---------------------------- SVG kurulumu ---------------------------- */
  function buildNode(n) {
    const ps = UI.pathwayStyle(n.pathway);
    const kind = n.type === 'hub' ? 'hub' : n.type === 'rate-enzyme' ? 'rate' : n.type === 'enzyme' ? 'enz' : 'met';
    const rx = kind === 'met' ? Math.min(n.h / 2, 20) : kind === 'hub' ? 15 : 11;
    const title = cleanTitle(n.title);
    const padX = kind === 'met' ? 18 : kind === 'enz' || kind === 'rate' ? 22 : 16;
    const ft = fitText(title, n.w - padX - 12, kind === 'hub' ? 14 : 13, 10, kind === 'hub' ? 700 : 600);
    const fs = fitText(n.sub || '', n.w - 20, 11, 9, 400);
    const ty = n.sub ? n.h / 2 - 3 : n.h / 2 + 4.5;
    const cx = n.w / 2 + (kind === 'enz' || kind === 'rate' ? 3 : 0);
    let s = `<g class="map-node k-${kind}" data-node="${n.id}" data-pw="${n.pathway}" transform="translate(${n.x} ${n.y})" style="--pc:${ps.color}">`;
    s += `<rect class="map-hit" x="-12" y="-12" width="${n.w + 24}" height="${n.h + 24}" rx="${rx + 10}"/>`;
    s += `<rect class="map-sh" x="0" y="2.5" width="${n.w}" height="${n.h}" rx="${rx}"/>`;
    s += `<rect class="map-card" width="${n.w}" height="${n.h}" rx="${rx}"/>`;
    s += `<rect class="map-tint" width="${n.w}" height="${n.h}" rx="${rx}"/>`;
    if (kind === 'enz' || kind === 'rate') s += `<rect class="map-strip" x="8" y="11" width="3.5" height="${n.h - 22}" rx="1.75"/>`;
    if (kind === 'hub') s += `<rect class="map-ring" width="${n.w}" height="${n.h}" rx="${rx}"/>`;
    if (kind === 'rate') s += `<rect class="map-ring is-rate" width="${n.w}" height="${n.h}" rx="${rx}"/>`;
    s += `<text class="map-t" x="${cx}" y="${ty + 4.5}" font-size="${ft.fs}">${esc(ft.t)}</text>`;
    if (n.sub) s += `<text class="map-s" x="${cx}" y="${n.h / 2 + 14.5}" font-size="${fs.fs}">${esc(fs.t)}</text>`;
    if (kind === 'rate') {
      s += `<g class="map-bolt" transform="translate(${n.w - 9} -4)"><circle r="10.5"/><g transform="translate(-6.5 -6.5) scale(.54)">${bolt('')}</g></g>`;
    }
    s += `<rect class="map-selring" x="-5" y="-5" width="${n.w + 10}" height="${n.h + 10}" rx="${rx + 5}"/>`;
    s += `</g>`;
    return s;
  }

  function buildReg(n, kind) {
    const isAct = kind === 'act';
    const text = isAct ? n.plus : n.minus;
    const boxW = 200, gap = 48;
    const lines = wrapText(text, boxW - 18, 11, 500, 2);
    const boxH = 28 + lines.length * 14;
    const cy = n.y + n.h / 2;
    const bx = isAct ? n.x - gap - boxW : n.x + n.w + gap;
    const by = cy - boxH / 2;
    const innerX = isAct ? bx + boxW : bx;      // kutu tarafı
    const nodeX = isAct ? n.x : n.x + n.w;      // düğüm tarafı
    const midX = (innerX + nodeX) / 2;
    let s = `<g class="map-reg is-${kind}" data-for="${n.id}">`;
    s += `<rect class="map-regbox" x="${bx}" y="${by}" width="${boxW}" height="${boxH}" rx="10"/>`;
    s += `<text class="map-regcap" x="${bx + 10}" y="${by + 15}">${isAct ? 'Aktivatörler' : 'İnhibitörler'}</text>`;
    lines.forEach((l, i) => { s += `<text class="map-regtx" x="${bx + 10}" y="${by + 30 + i * 14}">${esc(l)}</text>`; });
    if (isAct) {
      s += `<path class="map-regline" d="M${innerX} ${cy}H${nodeX - 7}"/>`;
      s += `<path class="map-regarrow" d="M${nodeX - 9} ${cy - 5.5}L${nodeX - 1} ${cy}L${nodeX - 9} ${cy + 5.5}z"/>`;
    } else {
      s += `<path class="map-regline" d="M${innerX} ${cy}H${nodeX + 3}"/>`;
      s += `<path class="map-regline is-bar" d="M${nodeX + 3} ${cy - 8}V${cy + 8}"/>`;
    }
    s += `<circle class="map-regdot" cx="${midX}" cy="${cy}" r="8.5"/>`;
    s += `<text class="map-regsign" x="${midX}" y="${cy + 5.2}">${isAct ? '+' : '−'}</text>`;
    s += `</g>`;
    return s;
  }

  function buildSvg() {
    const used = new Set();
    let edges = '';
    D.mapEdges.forEach((e, i) => {
      const a = nodeById[e.from], b = nodeById[e.to];
      if (!a || !b) return;
      used.add(a.pathway);
      const g = edgeGeom(a, b);
      const ps = UI.pathwayStyle(a.pathway);
      edges += `<g class="map-edge-g" data-from="${e.from}" data-to="${e.to}" style="--ec:${ps.color}">`;
      edges += `<path class="map-edge${e.dashed ? ' is-dashed' : ''}" d="${g.d}"` +
        ` marker-end="url(#map-ah-${a.pathway})"${e.bi ? ` marker-start="url(#map-ah-${a.pathway})"` : ''}/>`;
      if (e.label) {
        const lab = fitText(e.label, 170, 11, 9.5, 500);
        const w = Math.ceil(measure(lab.t, lab.fs, 500)) + 16;
        edges += `<g class="map-elabel" transform="translate(${g.mx.toFixed(1)} ${g.my.toFixed(1)})">` +
          `<rect x="${-w / 2}" y="-9.5" width="${w}" height="19" rx="9.5"/>` +
          `<text y="4" font-size="${lab.fs}">${esc(lab.t)}</text></g>`;
      }
      edges += `</g>`;
    });

    let markers = '';
    used.forEach((pw) => {
      const c = UI.pathwayStyle(pw).color;
      markers += `<marker id="map-ah-${pw}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse">` +
        `<path d="M1 1L9 5L1 9L2.8 5z" style="fill:${c}" class="map-ah"/></marker>`;
    });

    let zones = '';
    ZONES.forEach((z) => {
      zones += `<g class="map-zone" style="--zc:${z.color}">` +
        `<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="34"/>` +
        `<text class="map-zl" x="${z.lx}" y="${z.ly}">${esc(z.label)}</text>` +
        `<text class="map-zs" x="${z.lx}" y="${z.ly + 28}">${esc(z.sub)}</text>` +
        `<text class="map-zf" x="${z.fx}" y="${z.fy}">${esc(z.short)}</text>` +
        `</g>`;
    });

    let regs = '', nodes = '';
    D.mapNodes.forEach((n) => {
      if (n.plus) regs += buildReg(n, 'act');
      if (n.minus) regs += buildReg(n, 'inh');
      nodes += buildNode(n);
    });

    return `<svg class="map-svg lv-0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" role="img" aria-label="Metabolizma haritası">` +
      `<defs>${markers}</defs>` +
      `<g class="map-world">` +
      `<g class="map-zones">${zones}</g><g class="map-edges">${edges}</g><g class="map-regs">${regs}</g><g class="map-nodes">${nodes}</g>` +
      `</g></svg>`;
  }

  /* ---------------------------- Sayfa ---------------------------- */
  App.defineRoute('mapHome', () => {
    let unState = null;
    let cleanup = null;
    return {
      title: 'Harita',
      fullBleed: true,
      navClear: true,
      render(el, page) {
        if (cleanup) cleanup();
        page.el.classList.add('map-page');
        cleanup = mountMap(el, page);
        if (!unState) unState = App.onState((patch) => {
          if ('mapRegulators' in patch && api && api.syncRegs) api.syncRegs();
        });
      },
      onShow() { api && api.measure && api.measure(); },
      onDestroy() { if (cleanup) cleanup(); if (unState) unState(); unState = null; }
    };
  });

  let api = null; // etkin harita örneği (debug + onState)

  function mountMap(root, page) {
    const icon = UI.icon;
    root.innerHTML =
      `<div class="map-root">` +
        `<div class="map-vp" data-role="vp">${buildSvg()}</div>` +
        `<div class="map-title"><div class="map-title-main">Metabolizma haritası</div>` +
          `<div class="map-title-sub">${D.mapNodes.length} düğüm · ${D.mapEdges.length} bağlantı</div></div>` +
        `<div class="map-ctrl" role="toolbar" aria-label="Harita denetimleri">` +
          `<button type="button" data-act="zin" aria-label="Yakınlaştır">${icon('plus')}</button>` +
          `<button type="button" data-act="zout" aria-label="Uzaklaştır">${icon('minus')}</button>` +
          `<button type="button" data-act="fit" aria-label="Sığdır">${icon('arrow.up.left.and.arrow.down.right')}</button>` +
          `<button type="button" data-act="reg" aria-label="Düzenleyicileri göster/gizle"></button>` +
          `<button type="button" data-act="legend" aria-label="Harita rehberi">${icon('info.circle')}</button>` +
        `</div>` +
        `<div class="map-scale" aria-hidden="true"></div>` +
      `</div>`;

    const rootEl = root.querySelector('.map-root');
    const vp = root.querySelector('.map-vp');
    const svg = vp.querySelector('.map-svg');
    const world = svg.querySelector('.map-world');
    const scaleEl = root.querySelector('.map-scale');
    const regBtn = root.querySelector('[data-act="reg"]');
    const titleEl = root.querySelector('.map-title');

    /* ---------- Görünüm durumu ---------- */
    const view = { tx: 0, ty: 0, s: 0.2 };
    let vw = 0, vh = 0;
    let fitS = 0.2;
    let minS = MIN_SCALE_ABS;
    let pristine = true;       // kullanıcı henüz oynamadı → yeniden boyutlanınca tekrar sığdır
    let dirty = true;
    let anim = null;
    let inertia = null;
    let rafId = 0;
    let lv = -1;
    let scaleTimer = 0, lastPct = '', scaleOn = false;
    let lastDraw = 0;

    function insets() {
      const r = vp.getBoundingClientRect();
      let top = 66 + 44, bottom = 90;
      const t = titleEl.getBoundingClientRect();
      if (t.height) top = t.bottom - r.top + 10;
      const tb = document.querySelector('.tabbar');
      if (tb) { const b = tb.getBoundingClientRect(); if (b.height && b.top > r.top) bottom = r.bottom - b.top + 8; }
      return { top, bottom, side: 12 };
    }
    function fitView() {
      const ins = insets();
      const aw = Math.max(50, vw - ins.side * 2), ah = Math.max(50, vh - ins.top - ins.bottom);
      const s = Math.min(aw / FIT_BOX.w, ah / FIT_BOX.h);
      const cxw = FIT_BOX.x + FIT_BOX.w / 2, cyw = FIT_BOX.y + FIT_BOX.h / 2;
      const cxs = vw / 2, cys = ins.top + ah / 2;
      return { s, tx: cxs - cxw * s, ty: cys - cyw * s };
    }
    function clampView(v) {
      const m = Math.min(140, vw * 0.3, vh * 0.3);
      v.s = clamp(v.s, minS, MAX_SCALE);
      v.tx = clamp(v.tx, m - CLAMP_BOX.x1 * v.s, vw - m - CLAMP_BOX.x0 * v.s);
      v.ty = clamp(v.ty, m - CLAMP_BOX.y1 * v.s, vh - m - CLAMP_BOX.y0 * v.s);
      return v;
    }
    function zoomAtView(newS, cx, cy, from) {
      from = from || view;
      newS = clamp(newS, minS, MAX_SCALE);
      const wx = (cx - from.tx) / from.s, wy = (cy - from.ty) / from.s;
      return clampView({ s: newS, tx: cx - wx * newS, ty: cy - wy * newS });
    }

    /* ---------- Çizim (tek transform) ---------- */
    function levelFor(s) { return s < 0.28 ? 0 : s < 0.5 ? 1 : s < 0.7 ? 2 : 3; }
    function draw() {
      dirty = false;
      world.style.transform = `matrix(${view.s},0,0,${view.s},${view.tx},${view.ty})`;
      // nokta ızgarası (arka plan)
      let gs = 40 * view.s;
      while (gs < 16) gs *= 4;
      vp.style.backgroundSize = `${gs}px ${gs}px`;
      vp.style.backgroundPosition = `${view.tx}px ${view.ty}px`;
      const l = levelFor(view.s);
      if (l !== lv) { svg.classList.remove('lv-0', 'lv-1', 'lv-2', 'lv-3'); svg.classList.add('lv-' + l); lv = l; }
    }
    function showScale() {
      const pct = Math.round(view.s * 100) + '%';
      if (pct !== lastPct) { lastPct = pct; scaleEl.textContent = pct; }
      if (!scaleOn) { scaleOn = true; scaleEl.classList.add('is-on'); }
      clearTimeout(scaleTimer);
      scaleTimer = setTimeout(() => { scaleOn = false; scaleEl.classList.remove('is-on'); }, 1100);
    }
    function frame(now) {
      rafId = 0;
      const dt = Math.min(48, now - (lastDraw || now)); lastDraw = now;
      let moving = false;
      if (anim) {
        const p = clamp((now - anim.t0) / anim.dur, 0, 1);
        const e = 1 - Math.pow(1 - p, 3.4);
        const s = Math.exp(anim.ls0 + (anim.ls1 - anim.ls0) * e);
        const cx = anim.c0x + (anim.c1x - anim.c0x) * e, cy = anim.c0y + (anim.c1y - anim.c0y) * e;
        view.s = s; view.tx = vw / 2 - cx * s; view.ty = vh / 2 - cy * s;
        dirty = true; moving = true;
        if (p >= 1) { const to = anim.to; anim = null; view.s = to.s; view.tx = to.tx; view.ty = to.ty; moving = false; }
      }
      if (inertia) {
        const k = Math.exp(-dt / 330);
        inertia.vx *= k; inertia.vy *= k;
        const wantX = view.tx + inertia.vx * dt, wantY = view.ty + inertia.vy * dt;
        view.tx = wantX; view.ty = wantY;
        clampView(view);
        if (Math.abs(view.tx - wantX) > 0.01) inertia.vx = 0;
        if (Math.abs(view.ty - wantY) > 0.01) inertia.vy = 0;
        dirty = true; moving = true;
        if (Math.hypot(inertia.vx, inertia.vy) < 0.02) { inertia = null; moving = false; }
      }
      if (dirty) draw();
      if (moving || dirty) schedule();
      else lastDraw = 0;
    }
    function schedule() { dirty = true; if (!rafId) rafId = requestAnimationFrame(frame); }
    function stopMotion() { anim = null; inertia = null; }

    function animateTo(to, dur) {
      to = clampView({ s: to.s, tx: to.tx, ty: to.ty });
      const c0 = { x: (vw / 2 - view.tx) / view.s, y: (vh / 2 - view.ty) / view.s };
      const c1 = { x: (vw / 2 - to.tx) / to.s, y: (vh / 2 - to.ty) / to.s };
      inertia = null;
      anim = { t0: performance.now(), dur: dur || 360, ls0: Math.log(view.s), ls1: Math.log(to.s), c0x: c0.x, c0y: c0.y, c1x: c1.x, c1y: c1.y, to };
      lastDraw = 0;
      pristine = false;
      schedule(); showScale();
    }
    function setView(v) {
      stopMotion();
      clampView(v);
      view.s = v.s; view.tx = v.tx; view.ty = v.ty;
      schedule(); showScale();
    }
    function fit(animate) {
      const v = fitView();
      if (animate === false) { setView(v); pristine = true; } else { animateTo(v, 420); pristine = true; }
    }
    function zoomTo(scale, cx, cy, animate) {
      cx = cx == null ? vw / 2 : cx; cy = cy == null ? vh / 2 : cy;
      const to = zoomAtView(scale, cx, cy);
      if (animate === false) { setView(to); pristine = false; } else animateTo(to, 320);
    }
    function zoomBy(f, cx, cy) { zoomTo(view.s * f, cx, cy); }

    /* ---------- Ölçüm ---------- */
    function measureVp() {
      const r = vp.getBoundingClientRect();
      const nw = Math.round(r.width), nh = Math.round(r.height);
      if (!nw || !nh) return;
      const first = !vw;
      const ow = vw, oh = vh;
      vw = nw; vh = nh;
      const f = fitView();
      fitS = f.s;
      minS = Math.min(MIN_SCALE_ABS, fitS * 0.82);
      if (first || (pristine && !anim)) {
        stopMotion(); view.s = f.s; view.tx = f.tx; view.ty = f.ty;
        // Dar (dikey) ekranda tüm harita okunamayacak kadar küçülür: glikoliz omurgasından okunur ölçekte başla
        if (first && vw < 600) {
          const g = nodeById['n-g6p'];
          const s0 = 0.5, ins = insets();
          view.s = s0;
          view.tx = vw / 2 - (g.x + g.w / 2) * s0;
          view.ty = ins.top + 12 - (g.y - 200) * s0;
          clampView(view);
          pristine = false;
        }
      }
      else {
        // merkezi koru
        view.tx += (vw - ow) / 2; view.ty += (vh - oh) / 2;
        clampView(view);
      }
      schedule();
    }
    const ro = new ResizeObserver(() => measureVp());
    ro.observe(vp);
    const onWinResize = () => measureVp();
    window.addEventListener('resize', onWinResize);
    window.addEventListener('orientationchange', onWinResize);
    measureVp();

    /* ---------- Düzenleyici anahtarı ---------- */
    function syncRegs() {
      const on = App.state.mapRegulators !== false;
      svg.classList.toggle('no-reg', !on);
      regBtn.innerHTML = icon(on ? 'eye' : 'eye.slash');
      regBtn.classList.toggle('is-off', !on);
      regBtn.setAttribute('aria-pressed', String(on));
    }
    syncRegs();

    /* ---------- Seçim vurgusu ---------- */
    let selId = null;
    const nodeEls = {};
    svg.querySelectorAll('.map-node').forEach(g => { nodeEls[g.dataset.node] = g; });
    const regEls = svg.querySelectorAll('.map-reg');
    const edgeEls = svg.querySelectorAll('.map-edge-g');
    function setSelection(id) {
      selId = id;
      svg.classList.toggle('has-sel', !!id);
      const n = id ? nodeById[id] : null;
      const rel = new Set();
      if (n) D.mapNodes.forEach(m => { if (m.id === id || (n.junctionId && m.junctionId === n.junctionId)) rel.add(m.id); });
      Object.keys(nodeEls).forEach(k => {
        nodeEls[k].classList.toggle('is-sel', k === id);
        nodeEls[k].classList.toggle('is-rel', rel.has(k));
      });
      regEls.forEach(r => r.classList.toggle('is-rel', rel.has(r.dataset.for)));
      edgeEls.forEach(e => e.classList.toggle('is-rel', rel.has(e.dataset.from) || rel.has(e.dataset.to)));
    }

    /* ---------- Düğüm sayfası (sheet) ---------- */
    function focusNode(n) {
      // düğümü, açılan sheet'in üstündeki görünür alana taşı
      const visH = vh * 0.46;
      const ccx = n.x + n.w / 2, ccy = n.y + n.h / 2;
      const s = Math.max(view.s, 0.62);
      const sx = ccx * s + view.tx, sy = ccy * s + view.ty;
      const inside = s === view.s && sx > 40 && sx < vw - 40 && sy > 100 && sy < visH - 30;
      if (inside) return;
      const targetY = Math.max(110, (visH + 90) / 2);
      animateTo({ s, tx: vw / 2 - ccx * s, ty: targetY - ccy * s }, 420);
    }
    function openNode(id) {
      const n = nodeById[id];
      if (!n) return;
      setSelection(id);
      focusNode(n);
      openNodeSheet(n, {
        onClose: () => { if (selId === id) setSelection(null); }
      });
    }

    /* ---------- Jestler ---------- */
    const ptrs = new Map();
    let g = null;            // etkin hareket
    let lastTap = { t: 0, x: 0, y: 0 };
    let pendingTap = 0;
    const samples = [];
    function local(e) { const r = vp.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function startPinch() {
      const [a, b] = [...ptrs.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      g.pinch = { d0: d, s0: view.s, wx: (mx - view.tx) / view.s, wy: (my - view.ty) / view.s, mx0: mx, my0: my, changed: false };
    }
    vp.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const p = local(e);
      const wasMoving = !!(anim || inertia);
      if (ptrs.size === 0) {
        g = { moved: false, multi: false, t0: e.timeStamp, target: e.target, sx: p.x, sy: p.y, lx: p.x, ly: p.y, wasMoving, pinch: null };
        samples.length = 0;
        samples.push({ t: e.timeStamp, x: p.x, y: p.y });
      }
      stopMotion();
      try { vp.setPointerCapture(e.pointerId); } catch (_) { /* yok */ }
      ptrs.set(e.pointerId, { x: p.x, y: p.y, t0: e.timeStamp });
      if (ptrs.size === 2 && g) { g.multi = true; g.moved = true; g.tapT0 = e.timeStamp; startPinch(); }
      else if (ptrs.size > 2) { /* üçüncü parmak yok sayılır */ }
      vp.classList.add('is-grab');
      pristine = false;
    });
    vp.addEventListener('pointermove', (e) => {
      const q = ptrs.get(e.pointerId);
      if (!q || !g) return;
      const p = local(e);
      q.x = p.x; q.y = p.y;
      if (ptrs.size >= 2 && g.pinch) {
        const [a, b] = [...ptrs.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const pn = g.pinch;
        if (Math.abs(d - pn.d0) > 14 || Math.hypot(mx - pn.mx0, my - pn.my0) > 14) pn.changed = true;
        const s = clamp(pn.s0 * d / pn.d0, minS * 0.9, MAX_SCALE * 1.06);
        view.s = s; view.tx = mx - pn.wx * s; view.ty = my - pn.wy * s;
        clampView(view);
        schedule(); showScale();
        return;
      }
      if (ptrs.size !== 1) return;
      if (!g.moved) {
        if (Math.hypot(p.x - g.sx, p.y - g.sy) < SLOP) return;
        g.moved = true; g.lx = p.x; g.ly = p.y;
      }
      view.tx += p.x - g.lx; view.ty += p.y - g.ly;
      g.lx = p.x; g.ly = p.y;
      clampView(view);
      samples.push({ t: e.timeStamp, x: p.x, y: p.y });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();
      schedule(); showScale();
    });
    function endPointer(e, cancelled) {
      const q = ptrs.get(e.pointerId);
      if (!q || !g) return;
      const p = local(e);
      ptrs.delete(e.pointerId);
      try { vp.releasePointerCapture(e.pointerId); } catch (_) { /* yok */ }
      if (ptrs.size === 1) {
        // pinch → tek parmak pan'e dön
        const [r] = [...ptrs.values()];
        if (g.pinch && !g.pinch.changed && !cancelled && e.timeStamp - g.tapT0 < 260) {
          // iki parmakla dokunma → uzaklaştır
          const mx = (q.x + r.x) / 2, my = (q.y + r.y) / 2;
          g.twoTap = true;
          zoomBy(0.5, mx, my);
        }
        g.lx = r.x; g.ly = r.y; g.sx = r.x; g.sy = r.y; g.pinch = null; g.moved = true; g.multi = true;
        samples.length = 0;
        return;
      }
      if (ptrs.size > 0) return;
      vp.classList.remove('is-grab');
      const gg = g; g = null;
      if (cancelled) return;
      if (gg.multi) {
        return;
      }
      if (!gg.moved) {
        if (e.timeStamp - gg.t0 > 700) return;
        handleTap(p.x, p.y, gg.target, gg.wasMoving, e.timeStamp);
        return;
      }
      // momentum
      const now = e.timeStamp;
      const first = samples[0], last = samples[samples.length - 1];
      if (first && last && last !== first && now - last.t < 70) {
        const dt = Math.max(16, last.t - first.t);
        let vx = (last.x - first.x) / dt, vy = (last.y - first.y) / dt;
        const sp = Math.hypot(vx, vy);
        if (sp > 3.5) { vx *= 3.5 / sp; vy *= 3.5 / sp; }
        if (sp > 0.12) { inertia = { vx, vy }; lastDraw = 0; schedule(); }
      }
    }
    vp.addEventListener('pointerup', (e) => endPointer(e, false));
    vp.addEventListener('pointercancel', (e) => endPointer(e, true));
    vp.addEventListener('lostpointercapture', (e) => { if (ptrs.has(e.pointerId) && !e.isPrimary) return; });

    function handleTap(x, y, target, wasMoving, ts) {
      if (wasMoving) { lastTap.t = 0; return; }   // hareketi durduran dokunuş
      const now = performance.now();
      const nodeEl = target && target.closest && target.closest('[data-node]');
      if (now - lastTap.t < 320 && Math.hypot(x - lastTap.x, y - lastTap.y) < 36) {
        // çift dokunma → yakınlaştır
        clearTimeout(pendingTap); pendingTap = 0;
        setSelection(null);
        lastTap.t = 0;
        if (view.s >= MAX_SCALE * 0.92) fit(true);
        else zoomTo(view.s < 1 ? Math.max(1.05, view.s * 2.4) : view.s * 2, x, y);
        return;
      }
      lastTap = { t: now, x, y };
      clearTimeout(pendingTap);
      if (nodeEl) {
        const id = nodeEl.dataset.node;
        setSelection(id);
        pendingTap = setTimeout(() => { pendingTap = 0; openNode(id); }, 190);
      } else if (selId) setSelection(null);
    }

    /* Fare tekerleği / trackpad */
    vp.addEventListener('wheel', (e) => {
      e.preventDefault();
      stopMotion();
      pristine = false;
      const p = local(e);
      const lineMode = e.deltaMode === 1;
      const dy = lineMode ? e.deltaY * 16 : e.deltaY, dx = lineMode ? e.deltaX * 16 : e.deltaX;
      const mouseWheel = !e.ctrlKey && !lineMode && e.deltaX === 0 && Math.abs(dy) >= 50 && Number.isInteger(dy);
      if (e.ctrlKey || lineMode || mouseWheel) {
        const f = Math.exp(-dy * (e.ctrlKey ? 0.012 : 0.0016));
        const to = zoomAtView(view.s * f, p.x, p.y);
        view.s = to.s; view.tx = to.tx; view.ty = to.ty;
      } else {
        view.tx -= dx; view.ty -= dy;
        clampView(view);
      }
      schedule(); showScale();
    }, { passive: false });

    /* Kontroller */
    rootEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const act = b.dataset.act;
      if (act === 'zin') zoomBy(1.7);
      else if (act === 'zout') zoomBy(1 / 1.7);
      else if (act === 'fit') fit(true);
      else if (act === 'reg') {
        const on = !(App.state.mapRegulators !== false);
        App.setState({ mapRegulators: on });
        syncRegs();
        App.toast(on ? 'Düzenleyiciler gösterildi' : 'Düzenleyiciler gizlendi');
      } else if (act === 'legend') openLegend();
    });
    // Tarayıcı sayfa yakınlaştırmasını / bağlam menüsünü engelle
    vp.addEventListener('contextmenu', (e) => e.preventDefault());
    vp.addEventListener('dragstart', (e) => e.preventDefault());

    /* Hata ayıklama ve dış erişim */
    api = {
      measure: measureVp, syncRegs,
      view: () => ({ s: view.s, tx: view.tx, ty: view.ty, vw, vh, fitS, lv, inertia, rafId }),
      zoomTo: (s, cx, cy, animate) => zoomTo(s, cx, cy, animate),
      fit: (animate) => fit(animate),
      pan: (dx, dy) => setView({ s: view.s, tx: view.tx + dx, ty: view.ty + dy }),
      focus: (id, s, animate) => {
        const n = nodeById[id]; if (!n) return;
        const sc = s || 1;
        const v = { s: sc, tx: vw / 2 - (n.x + n.w / 2) * sc, ty: vh / 2 - (n.y + n.h / 2) * sc };
        if (animate === false) { setView(v); pristine = false; } else animateTo(v, 360);
      },
      inspect: (id) => openNode(id)
    };
    window.__map = api;

    return function cleanup() {
      ro.disconnect();
      window.removeEventListener('resize', onWinResize);
      window.removeEventListener('orientationchange', onWinResize);
      cancelAnimationFrame(rafId);
      clearTimeout(pendingTap); clearTimeout(scaleTimer);
      if (api && window.__map === api) { window.__map = null; }
      api = null;
    };
  }

  /* ---------------------------- Düğüm sayfası içeriği ---------------------------- */
  function regCard(kind, str) {
    const groups = parseRegs(str);
    if (!groups.length) return '';
    const cls = kind === 'act' ? 'is-act' : 'is-inh';
    const body = groups.map(gr =>
      `<div class="map-reggrp">${gr.label ? `<div class="map-reglab">${esc(gr.label)}</div>` : ''}` +
      `<div class="map-pills">${gr.items.map(i => `<span class="map-pill ${cls}">${UI.sign(kind, 'sm')}<span>${esc(i)}</span></span>`).join('')}</div></div>`
    ).join('');
    return UI.section({
      header: kind === 'act' ? 'Aktivatörler' : 'İnhibitörler',
      body: `<div class="card map-regcard ${cls}">${body}</div>`
    });
  }

  function hubBlock(hub) {
    const group = (title, items, iconName, cls) => {
      if (!items || !items.length) return '';
      const rows = items.map((t, i) =>
        `<div class="map-li${i >= 3 ? ' is-extra hidden' : ''}"><span class="map-li-ic ${cls}">${UI.icon(iconName)}</span><span class="map-li-tx">${UI.richReg(t)}</span></div>`
      ).join('');
      const more = items.length > 3 ? `<button type="button" class="map-more" data-more>Tümü (${items.length})</button>` : '';
      return UI.section({ header: `${title} · ${items.length}`, body: `<div class="list map-lilist">${rows}${more}</div>` });
    };
    return `<div class="map-hubhead"><span class="icon-tile" style="--tile:var(--junction)">${UI.icon('link')}</span>` +
      `<div class="map-hubhead-tx"><div class="t-headline">${esc(hub.name)}</div>` +
      `<div class="t-footnote c-2">${esc(hub.compartment || '')}</div></div></div>` +
      group('Gelen yolaklar', hub.incoming, 'arrow.down', 'is-in') +
      group('Giden yolaklar', hub.outgoing, 'arrow.up.right', 'is-out');
  }

  function findStep(n) {
    if (!n.junctionId) return null;
    const c = D.allSteps.filter(x => x.st.junctionId === n.junctionId);
    return c.find(x => x.pw.id === n.pathway) || c[0] || null;
  }

  function openNodeSheet(n, opts) {
    const ps = UI.pathwayStyle(n.pathway);
    const hub = n.junctionId ? D.hub(n.junctionId) : null;
    const title = cleanTitle(n.title);
    const typeBadge = n.type === 'rate-enzyme' ? UI.rateBadge()
      : n.type === 'hub' ? UI.badge(TYPE_LABEL.hub, 'is-jn', 'link')
      : n.type === 'enzyme' ? UI.badge(TYPE_LABEL.enzyme, 'is-tint', 'atom')
      : UI.badge(TYPE_LABEL.metabolite, '', 'drop');
    const hasHubRoute = typeof App.routes.hub === 'function';
    const sheet = App.sheet({
      title,
      detent: 'medium',
      passive: false,
      onClose: opts && opts.onClose,
      render(body, sh) {
        body.innerHTML =
          `<div class="map-sh-head">` +
            `<div class="hstack wrap"><span class="map-pwchip">${UI.pathwayTile(n.pathway)}<span>${esc(ps.short)}</span></span>${typeBadge}</div>` +
            (title.length > 26 ? `<div class="t-title3 map-sh-title">${esc(title)}</div>` : '') +
            (n.sub ? `<div class="t-subhead c-2 map-sh-sub">${esc(n.sub)}</div>` : '') +
          `</div>` +
          `<div class="map-actions">` +
            `<button type="button" class="btn is-filled is-block" data-a="flow">${UI.icon('arrow.triangle.branch')}Akış şemasında aç</button>` +
            (hub && hasHubRoute ? `<button type="button" class="btn is-tinted is-block" data-a="hub">${UI.icon('link')}Kavşağı aç</button>` : '') +
          `</div>` +
          (n.plus ? regCard('act', n.plus) : '') +
          (n.minus ? regCard('inh', n.minus) : '') +
          (hub ? UI.section({ header: 'Kavşak', body: `<div class="card map-hubcard">${hubBlock(hub)}</div>` }) : '');
        body.addEventListener('click', (e) => {
          const more = e.target.closest('[data-more]');
          if (more) {
            const list = more.closest('.map-lilist');
            list.querySelectorAll('.is-extra').forEach(x => x.classList.remove('hidden'));
            more.remove();
            return;
          }
          const b = e.target.closest('[data-a]');
          if (!b) return;
          const a = b.dataset.a;
          sh.close();
          if (a === 'flow') {
            const st = findStep(n);
            if (st && App.routes.step) App.open('step', { pw: st.pw.id, idx: st.sIdx }, { tab: 'pathways' });
            else if (App.routes.pathway) App.open('pathway', { id: n.pathway }, { tab: 'pathways' });
          } else if (a === 'hub' && hub) {
            App.open('hub', { id: hub.id }, { tab: 'hubs' });
          }
        });
      }
    });
    return sheet;
  }

  /* ---------------------------- Rehber (legend) ---------------------------- */
  function openLegend() {
    const zone = (c, name, text) => UI.row({
      leading: `<span class="map-sw" style="--zc:${c}"></span>`, title: name, subtitle: text, cls: 'is-tall'
    });
    const pv = (cls, inner) => `<span class="map-pv ${cls}">${inner || ''}</span>`;
    const boltIc = `<svg class="map-pv-bolt" viewBox="0 0 24 24" aria-hidden="true">${bolt('')}</svg>`;
    App.sheet({
      title: 'Harita rehberi',
      detent: 'medium',
      render(body) {
        body.innerHTML =
          UI.section({
            header: 'Bölmeler',
            body: UI.list([
              zone('var(--blue)', 'Sitozol & ER', 'Glikoliz, HMP, glikojen, lipogenez, kolesterol'),
              zone('var(--orange)', 'Mitokondri matriksi', 'PDH, TCA döngüsü, β-oksidasyon, ketogenez'),
              zone('var(--purple)', 'İç mitokondri membranı', 'Elektron taşıma zinciri ve oksidatif fosforilasyon'),
              zone('var(--cyan)', 'Üre döngüsü', 'Mitokondri ve sitozol arasında paylaşılır')
            ], { icons: true })
          }) +
          UI.section({
            header: 'Düğüm türleri',
            body: UI.list([
              UI.row({ leading: pv('is-met'), title: 'Metabolit', subtitle: 'Yolaklar arasında akan ara ürün', cls: 'is-tall' }),
              UI.row({ leading: pv('is-enz'), title: 'Enzim', subtitle: 'Reaksiyonu katalizler', cls: 'is-tall' }),
              UI.row({ leading: pv('is-rate', boltIc), title: 'Hız kısıtlayıcı enzim', subtitle: 'Turuncu halka ve yıldırım simgesi', cls: 'is-tall' }),
              UI.row({ leading: pv('is-hub'), title: 'Kavşak', subtitle: 'Yolakların birleştiği metabolit; yolak renginde halka', cls: 'is-tall' })
            ], { icons: true })
          }) +
          UI.section({
            header: 'Oklar ve düzenleyiciler',
            body: UI.list([
              UI.row({ leading: `<span class="map-lg-ic">${UI.icon('arrow.right')}</span>`, title: 'Akış yönü', subtitle: 'Çift uçlu ok tersinir; kesikli çizgi dolaylı bağlantı', cls: 'is-tall' }),
              UI.row({ leading: `<span class="map-lg-ic">${UI.sign('act', 'lg')}</span>`, title: 'Aktivatör', subtitle: 'Yaklaştırınca düğümün solunda görünür', cls: 'is-tall' }),
              UI.row({ leading: `<span class="map-lg-ic">${UI.sign('inh', 'lg')}</span>`, title: 'İnhibitör', subtitle: 'Düğümün sağında; düz uçlu çizgiyle basılır', cls: 'is-tall' })
            ], { icons: true }),
            footer: 'İpucu: çift dokunarak yakınlaştırın, iki parmakla dokunarak uzaklaştırın.'
          });
      }
    });
  }
})();
