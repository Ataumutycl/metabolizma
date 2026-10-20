/* =====================================================================
   ARA — searchHome (sekme kökü)
   ===================================================================== */
(function () {
  'use strict';
  const U = App.ui;
  const D = App.data;
  const SUGGEST = ['PFK-1', 'Sitrat', 'Malonil-KoA', 'Arsenit', 'Siyanür', 'Florür', 'B1 (Tiamin)', 'Statin', 'Asetil-KoA', 'Karnitin', 'Üre', 'McArdle', 'Dimerkaprol'];
  const STEP_CAP = 30;

  const strip = (t) => String(t || '').replace(/\s*\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
  const tokensOf = (q) => U.norm(q.trim()).split(/\s+/).filter(Boolean);

  // Birden çok sözcüğü vurgular (norm uzunluğu korur → indeksler 1:1)
  function mark(text, toks) {
    const raw = String(text == null ? '' : text);
    if (!toks.length) return U.esc(raw);
    const n = U.norm(raw);
    const ranges = [];
    toks.forEach(t => { let i = 0, k; while ((k = n.indexOf(t, i)) !== -1) { ranges.push([k, k + t.length]); i = k + t.length; } });
    if (!ranges.length) return U.esc(raw);
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [ranges[0].slice()];
    for (let i = 1; i < ranges.length; i++) {
      const l = merged[merged.length - 1];
      if (ranges[i][0] <= l[1]) l[1] = Math.max(l[1], ranges[i][1]); else merged.push(ranges[i].slice());
    }
    let out = '', p = 0;
    merged.forEach(r => { out += U.esc(raw.slice(p, r[0])) + '<mark class="hl">' + U.esc(raw.slice(r[0], r[1])) + '</mark>'; p = r[1]; });
    return out + U.esc(raw.slice(p));
  }
  // Eşleşme çevresinde ~90 karakterlik parça
  function snippet(text, toks, phrase) {
    const raw = String(text);
    const n = U.norm(raw);
    let k = phrase ? n.indexOf(phrase) : -1;
    if (k < 0) { for (const t of toks) { k = n.indexOf(t); if (k >= 0) break; } }
    const W = 90;
    let a = 0, b = raw.length;
    if (raw.length > W) {
      a = Math.max(0, k - 30); b = Math.min(raw.length, a + W); a = Math.max(0, b - W);
      if (a > 0) { const sp = raw.indexOf(' ', a); if (sp > -1 && sp < k) a = sp + 1; }
    }
    return (a > 0 ? '…' : '') + mark(raw.slice(a, b), toks) + (b < raw.length ? '…' : '');
  }

  /* ---- arama dizini ---- */
  function stepFields(x) {
    const s = x.st, f = [];
    f.push(['Enzim', s.enzyme], ['Substrat', s.substrate], ['Ürün', s.product], ['Kofaktör', s.cofactors]);
    (s.activators || []).forEach(a => f.push(['Aktivatör', a]));
    (s.inhibitors || []).forEach(a => f.push(['İnhibitör', a]));
    (s.crossConnections || []).forEach(c => f.push(['Bağlantı', c.label.replace(/^[^\wÇĞİÖŞÜçğıöşü]+/, '')]));
    f.push(['Klinik', s.clinicalNote || ''], ['Basamak', s.stepNo]);
    f.push(['Yolak', x.pw.title + ' ' + x.pw.compartment]);
    return f.map(([l, t]) => ({ label: l, text: t, n: U.norm(t) }));
  }
  const STEP_INDEX = D.allSteps.map(x => { const f = stepFields(x); return { x, f, all: f.map(z => z.n).join(' \u0001 ') }; });
  const HUB_INDEX = D.hubs.map(h => {
    const f = [['Ad', h.name], ['Rozet', h.badge], ['Bölme', h.compartment]]
      .concat(h.incoming.map(t => ['Gelen', t]), h.outgoing.map(t => ['Giden', t]))
      .map(([l, t]) => ({ label: l, text: t, n: U.norm(t) }));
    return { h, f, all: f.map(z => z.n).join(' \u0001 ') };
  });
  const PW_INDEX = D.pathways.map(pw => {
    const f = [['Ad', pw.title], ['Bölme', pw.compartment], ['Denklem', pw.netEquation], ['Giriş', pw.entryBridge], ['Çıkış', pw.exitBridge]]
      .map(([l, t]) => ({ label: l, text: t || '', n: U.norm(t || '') }));
    return { pw, f, all: f.map(z => z.n).join(' \u0001 ') };
  });

  // Klinik veri kümeleri (yüklendiğinde geç okunur)
  let CLIN = null;
  function clinIndex() {
    const dl = App.data.diseases || [], tl = App.data.toxins || [];
    if (CLIN && CLIN.nd === dl.length && CLIN.nt === tl.length) return CLIN;
    const mk = (pairs) => pairs.filter(p => p[1] && String(p[1]).trim()).map(([l, t]) => ({ label: l, text: String(t), n: U.norm(t) }));
    const dis = dl.map(d => {
      const f = mk([['Ad', d.name], ['Diğer ad', d.aka], ['Eksik', d.enzyme], ['Gen', d.gene], ['Doku', d.tissue]]
        .concat((d.accumulates || []).map(t => ['Birikir', t]), (d.deficient || []).map(t => ['Azalır', t]), (d.findings || []).map(t => ['Bulgu', t]),
          (d.labs || []).map(t => ['Laboratuvar', t]), (d.treatment || []).map(t => ['Tedavi', t]), [['İpucu', d.pearl]]));
      return { d, f, all: f.map(z => z.n).join(' \u0001 ') };
    });
    const tox = tl.map(t => {
      const f = mk([['Ad', t.name], ['Diğer ad', t.aka], ['Hedef', t.target], ['Mekanizma', t.mechanism], ['Sonuç', t.effect],
        ['Klinik', t.clinical], ['Antidot', t.antidote], ['İpucu', t.pearl]]);
      return { t, f, all: f.map(z => z.n).join(' \u0001 ') };
    });
    CLIN = { nd: dl.length, nt: tl.length, dis, tox };
    return CLIN;
  }

  function run(q) {
    const phrase = U.norm(q.trim());
    const toks = tokensOf(q);
    const hit = (e) => toks.every(t => e.all.indexOf(t) !== -1);
    const pick = (fs) => fs.find(z => z.n.indexOf(phrase) !== -1) || fs.find(z => z.n.indexOf(toks[0]) !== -1) || fs[0];
    const steps = [];
    STEP_INDEX.forEach(e => {
      if (!hit(e)) return;
      const fi = e.f.findIndex(z => z.n.indexOf(phrase) !== -1);
      const f = fi >= 0 ? e.f[fi] : pick(e.f);
      // sıralama: enzim 0, substrat/ürün 1, diğerleri 2..; tam öbek eşleşmesi öne
      const rank = (fi === 0 ? 0 : fi === 1 || fi === 2 ? 1 : fi >= 0 ? 2 : 3);
      steps.push({ x: e.x, f, rank, order: e.x.flat });
    });
    steps.sort((a, b) => a.rank - b.rank || a.order - b.order);
    const hubs = [];
    HUB_INDEX.forEach(e => { if (hit(e)) hubs.push({ h: e.h, f: pick(e.f) }); });
    const pws = [];
    PW_INDEX.forEach(e => { if (hit(e)) pws.push({ pw: e.pw, f: pick(e.f) }); });
    const ci = clinIndex();
    const rankC = (e) => { const i = e.f.findIndex(z => z.n.indexOf(phrase) !== -1); return i === 0 ? 0 : i === 1 || i === 2 ? 1 : i >= 0 ? 2 : 3; };
    const dis = [], tox = [];
    ci.dis.forEach(e => { if (hit(e)) dis.push({ d: e.d, f: pick(e.f), rank: rankC(e) }); });
    ci.tox.forEach(e => { if (hit(e)) tox.push({ t: e.t, f: pick(e.f), rank: rankC(e) }); });
    dis.sort((a, b) => a.rank - b.rank); tox.sort((a, b) => a.rank - b.rank);
    return { steps, hubs, pws, dis, tox, toks, phrase };
  }

  App.defineRoute('searchHome', function () {
    let query = '';
    let cap = STEP_CAP;
    let input = null;
    let lastOut = null;

    const remember = (q) => {
      q = (q || '').trim();
      if (q.length < 2) return;
      const list = [q].concat((App.state.recentSearches || []).filter(r => U.norm(r) !== U.norm(q))).slice(0, 8);
      App.setState({ recentSearches: list });
    };

    return {
      title: 'Ara',
      render(el, page) {
        el.innerHTML = U.searchField('srch-q', 'Enzim, metabolit, toksin, yolak…', query, true) + `<div id="srch-out" class="srch-out"></div>`;
        input = U.bindSearch(el, 'srch-q', (v) => { query = v; cap = STEP_CAP; paint(); });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') remember(input.value); });
        input.addEventListener('blur', () => { const o = lastOut; if (o && (o.steps.length + o.hubs.length + o.pws.length + o.dis.length + o.tox.length)) remember(input.value); });
        el.addEventListener('click', (e) => {
          const b = e.target.closest('[data-act]');
          if (!b) return;
          const a = b.dataset.act;
          if (a === 'fill') { setQuery(b.dataset.q); remember(b.dataset.q); return; }
          if (a === 'clear') { App.setState({ recentSearches: [] }); paint(); return; }
          if (a === 'more') { cap += STEP_CAP; paint(true); return; }
          remember(query);
          if (a === 'step') App.open('step', { pw: b.dataset.pw, idx: +b.dataset.idx });
          else if (a === 'hub') App.open('hub', { id: b.dataset.id });
          else if (a === 'pathway') App.open('pathway', { id: b.dataset.id });
          else if (a === 'disease') App.open('disease', { id: b.dataset.id });
          else if (a === 'toxin') App.open('toxin', { id: b.dataset.id });
        });
        paint();
      },
      onShow() {
        // iOS yalnızca kullanıcı hareketiyle odaklar; yine de dene
        if (input && !query) setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (e) { /* yok */ } }, 80);
      }
    };

    function setQuery(v) {
      query = v; cap = STEP_CAP;
      if (input) {
        input.value = v;
        input.parentElement.querySelector('.search-clear').classList.toggle('hidden', !v);
        try { input.focus({ preventScroll: true }); } catch (e) { /* yok */ }
      }
      paint();
    }

    function paint(keepScroll) {
      const host = input && input.closest('.page-content');
      const box = host && host.querySelector('#srch-out');
      if (!box) return;
      const q = query.trim();
      if (!q) { lastOut = null; box.innerHTML = idleHtml(); return; }
      const r = run(q);
      lastOut = r;
      const total = r.steps.length + r.hubs.length + r.pws.length + r.dis.length + r.tox.length;
      if (!total) { box.innerHTML = U.empty('magnifyingglass', 'Sonuç yok', `“${q}” için eşleşme bulunamadı. Başka bir yazım veya kısaltma deneyin.`); return; }
      let h = '';
      if (r.steps.length) {
        const shown = r.steps.slice(0, cap);
        const left = r.steps.length - shown.length;
        h += U.section({
          header: `Basamaklar <span class="srch-count">${r.steps.length}</span>`,
          body: U.list(shown.map(m => stepRow(m, r)), { icons: true }),
          footer: left > 0 ? `<button type="button" class="srch-more" data-act="more">${left} sonuç daha göster</button>` : ''
        });
      }
      if (r.dis.length) h += U.section({ header: `Hastalıklar <span class="srch-count">${r.dis.length}</span>`, body: U.list(r.dis.map(m => disRow(m, r)), { icons: true }) });
      if (r.tox.length) h += U.section({ header: `Toksin ve ilaçlar <span class="srch-count">${r.tox.length}</span>`, body: U.list(r.tox.map(m => toxRow(m, r)), { icons: true }) });
      if (r.hubs.length) h += U.section({ header: `Kavşaklar <span class="srch-count">${r.hubs.length}</span>`, body: U.list(r.hubs.map(m => hubRow(m, r)), { icons: true }) });
      if (r.pws.length) h += U.section({ header: `Yolaklar <span class="srch-count">${r.pws.length}</span>`, body: U.list(r.pws.map(m => pwRow(m, r)), { icons: true }) });
      box.innerHTML = h;
    }

    function idleHtml() {
      const rec = App.state.recentSearches || [];
      let h = U.section({
        header: 'Önerilen',
        body: `<div class="srch-chips">${SUGGEST.map(s => `<button type="button" class="chip" data-act="fill" data-q="${U.esc(s)}">${U.esc(s)}</button>`).join('')}</div>`
      });
      if (rec.length) {
        h += `<section class="section"><div class="srch-rec-head"><h2 class="section-header">Son aramalar</h2>` +
          `<button type="button" class="srch-clear" data-act="clear">Temizle</button></div>` +
          U.list(rec.map(r => U.row({ title: U.esc(r), leading: `<span class="srch-rec-ic">${U.icon('clock')}</span>`, action: 'fill', attrs: `data-act="fill" data-q="${U.esc(r)}"`, cls: 'srch-rec' })), { icons: false }) +
          `</section>`;
      } else {
        h += `<p class="srch-hint">Enzim, substrat, kofaktör, toksin, ilaç, hastalık, klinik not, kavşak ve yolak adlarında arar. Türkçe karakterler isteğe bağlıdır.</p>`;
      }
      return h;
    }

    function stepRow(m, r) {
      const s = m.x.st, st = U.pathwayStyle(m.x.pw.id);
      const showEnzymeLine = m.f.label === 'Enzim' || m.f.label === 'Basamak';
      const snip = showEnzymeLine
        ? `${mark(strip(s.substrate), r.toks)} → ${mark(strip(s.product), r.toks)}`
        : `<span class="srch-field">${U.esc(m.f.label)}</span> ${snippet(m.f.text, r.toks, r.phrase)}`;
      return U.row({
        title: mark(strip(s.enzyme), r.toks),
        titleCls: 'srch-title',
        subtitle: `<span class="srch-pw" style="--c:${st.color}">${U.esc(st.short)}</span>` + `<span class="srch-snip">${snip}</span>`,
        leading: U.pathwayTile(m.x.pw.id),
        accessory: s.isRateLimiting ? `<span class="c-rate srch-bolt">${U.icon('bolt.fill')}</span>` : '',
        chevron: true, action: 'step', cls: 'is-tall srch-row', attrs: `data-act="step" data-pw="${m.x.pw.id}" data-idx="${m.x.sIdx}"`
      });
    }
    function clinSub(m, base, r) {
      return m.f.label === 'Ad' || m.f.label === 'Diğer ad' || m.f.label === 'Eksik' || m.f.label === 'Hedef'
        ? `<span class="srch-snip">${base}</span>`
        : `<span class="srch-field">${U.esc(m.f.label)}</span> <span class="srch-snip">${snippet(m.f.text, r.toks, r.phrase)}</span>`;
    }
    function disRow(m, r) {
      const d = m.d, ak = window.ExamKit.aka(d.aka, (x) => mark(x, r.toks));
      return U.row({
        title: mark(d.name, r.toks) + ak.badge, titleCls: 'srch-title',
        subtitle: ak.line + clinSub(m, d.enzyme ? 'Eksik: ' + mark(d.enzyme, r.toks) : '', r),
        leading: U.tile('stethoscope', 'var(--clinical)'),
        chevron: true, action: 'disease', cls: 'is-tall srch-row', attrs: `data-act="disease" data-id="${U.esc(d.id)}"`
      });
    }
    function toxRow(m, r) {
      const t = m.t, ak = window.ExamKit.aka(t.aka, (x) => mark(x, r.toks));
      return U.row({
        title: mark(t.name, r.toks) + ak.badge, titleCls: 'srch-title',
        subtitle: ak.line + clinSub(m, t.target ? 'Hedef: ' + mark(t.target, r.toks) : '', r),
        leading: U.tile('flask', 'var(--inhibitor)'),
        chevron: true, action: 'toxin', cls: 'is-tall srch-row', attrs: `data-act="toxin" data-id="${U.esc(t.id)}"`
      });
    }
    function hubRow(m, r) {
      const i = D.hubs.indexOf(m.h);
      const mm = m.h.name.match(/^\s*(\d+)\./);
      const s0 = D.stepsAtJunction(m.h.id)[0];
      const col = s0 ? U.pathwayStyle(s0.pw.id).color : 'var(--gray)';
      return U.row({
        title: mark(m.h.name.replace(/^\s*\d+\.\s*/, ''), r.toks), titleCls: 'srch-title',
        subtitle: m.f.label === 'Ad' ? U.esc(m.h.badge) : `<span class="srch-field">${m.f.label === 'Gelen' ? 'Gelen' : m.f.label === 'Giden' ? 'Giden' : U.esc(m.f.label)}</span> <span class="srch-snip">${snippet(m.f.text, r.toks, r.phrase)}</span>`,
        leading: `<span class="icon-tile is-num" style="--tile:${col}">${mm ? mm[1] : i + 1}</span>`,
        chevron: true, action: 'hub', cls: 'is-tall srch-row', attrs: `data-act="hub" data-id="${m.h.id}"`
      });
    }
    function pwRow(m, r) {
      return U.row({
        title: mark(D.pathwayTitle(m.pw), r.toks), titleCls: 'srch-title',
        subtitle: m.f.label === 'Ad' ? `<span class="srch-snip">${U.esc(m.pw.steps.length)} basamak</span>` : `<span class="srch-field">${U.esc(m.f.label)}</span> <span class="srch-snip">${snippet(m.f.text, r.toks, r.phrase)}</span>`,
        leading: U.pathwayTile(m.pw.id),
        chevron: true, action: 'pathway', cls: 'is-tall srch-row', attrs: `data-act="pathway" data-id="${m.pw.id}"`
      });
    }
  });
})();
