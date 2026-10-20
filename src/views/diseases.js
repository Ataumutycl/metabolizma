/* =====================================================================
   HASTALIKLAR — Sınav sekmesi bölümü + disease {id} sayfası  (önek: dis-)
   ===================================================================== */
(function () {
  'use strict';
  const U = App.ui;
  const esc = U.esc;
  const K = () => window.ExamKit;

  const CATS = [
    { id: 'karbonhidrat', label: 'Karbonhidrat', color: 'var(--orange)' },
    { id: 'glikojen', label: 'Glikojen', color: 'var(--brown)' },
    { id: 'mitokondri', label: 'Mitokondri', color: 'var(--red)' },
    { id: 'lipit', label: 'Lipit', color: 'var(--yellow)' },
    { id: 'keton-kolesterol', label: 'Keton & kolesterol', color: 'var(--pink)' },
    { id: 'aminoasit-ure', label: 'Amino asit & üre', color: 'var(--teal)' },
    { id: 'eritrosit', label: 'Eritrosit', color: 'var(--purple)' }
  ];
  const catOf = (id) => CATS.find(c => c.id === id) || { id, label: id || 'Diğer', color: 'var(--gray)' };
  const INH = {
    'OR': 'Otozomal resesif', 'OD': 'Otozomal dominant', 'X-R': 'X’e bağlı resesif', 'X-D': 'X’e bağlı dominant',
    'Mitokondriyal': 'Mitokondriyal (anne soyundan)', 'Edinsel': 'Edinsel', 'Değişken': 'Kalıtım değişken'
  };
  const diseases = () => App.data.diseases || [];

  const fieldsOf = (d) => [d.name, d.aka, d.enzyme, d.gene, d.tissue, d.pearl]
    .concat(d.accumulates || [], d.deficient || [], d.findings || [], d.labs || [], d.treatment || []).filter(Boolean);

  function row(d, raw, q) {
    const own = [d.name, d.aka, d.enzyme, d.gene].filter(Boolean);
    let hit = '';
    if (q && !own.some(f => U.norm(f).indexOf(q) !== -1)) {
      const f = fieldsOf(d).find(t => U.norm(t).indexOf(q) !== -1);
      if (f) hit = `<span class="exam-hit">${U.hl(f, raw)}</span>`;
    }
    const ak = K().aka(d.aka, (x) => U.hl(x, raw));
    return U.row({
      title: U.hl(d.name, raw) + ak.badge,
      subtitle: ak.line + (d.enzyme ? `Eksik: ${U.hl(d.enzyme, raw)}` : '') + hit,
      accessory: d.inheritance ? `<span class="badge is-muted exam-inh-badge">${esc(d.inheritance)}</span>` : '',
      chevron: true, action: 'disease', cls: 'exam-row', attrs: `data-id="${esc(d.id)}"`
    });
  }

  function createPane() {
    let query = '', cat = 'all';
    let root = null;

    function paint() {
      const out = root && root.querySelector('#dis-out');
      if (!out) return;
      const raw = query.trim(), q = U.norm(raw);
      const list = diseases().filter(d => (cat === 'all' || d.category === cat) && K().match(fieldsOf(d), q));
      if (!list.length) { out.innerHTML = U.empty('magnifyingglass', 'Sonuç yok', raw ? `“${raw}” için eşleşen hastalık bulunamadı.` : 'Gösterilecek hastalık yok.'); return; }
      const cats = CATS.concat([...new Set(list.map(d => d.category))].filter(c => !CATS.some(x => x.id === c)).map(catOf));
      let html = '';
      cats.forEach(c => {
        const items = list.filter(d => d.category === c.id);
        if (!items.length) return;
        html += U.section({
          header: `<span class="exam-dot" style="background:${c.color}"></span>${esc(c.label)}<span class="exam-hcount">${items.length}</span>`,
          cls: 'exam-sec', body: U.list(items.map(d => row(d, raw, q)))
        });
      });
      out.innerHTML = html + `<p class="exam-footer">${list.length} hastalık${raw ? ` • “${esc(raw)}”` : ''}</p>`;
    }

    return {
      render(el) {
        root = el;
        const present = CATS.filter(c => diseases().some(d => d.category === c.id));
        if (cat !== 'all' && !present.some(c => c.id === cat)) cat = 'all';
        el.innerHTML = `<div class="exam-controls">` +
          U.searchField('dis-q', 'Hastalık, enzim, gen, bulgu…', query) +
          `</div>` + K().chips('dis-cat', [{ value: 'all', label: 'Tümü' }].concat(present.map(c => ({ value: c.id, label: c.label }))), cat) +
          `<div id="dis-out"></div>`;
        U.bindSearch(el, 'dis-q', (v) => { query = v; paint(); });
        K().bindChips(el, 'dis-cat', (v) => { cat = v; paint(); });
        el.addEventListener('click', (e) => {
          const b = e.target.closest('[data-action="disease"]');
          if (b) App.open('disease', { id: b.dataset.id });
        });
        paint();
      }
    };
  }
  window.ExamPanes = window.ExamPanes || {};
  window.ExamPanes.diseases = { create: createPane };

  /* ---------------- detay ---------------- */
  function strip(d) {
    const first = (a) => (a && a[0]) || '';
    const more = (a) => a && a.length > 1 ? `<span class="dis-more">+${a.length - 1}</span>` : '';
    return `<div class="card dis-mech" aria-label="Mekanizma özeti">` +
      `<div class="dis-m-enz"><span class="dis-m-k">Eksik enzim</span><span class="dis-m-v">${esc(d.enzyme || '—')}</span></div>` +
      `<div class="dis-m-arrows"><span class="is-up">${U.icon('arrow.down')}</span><span class="is-down">${U.icon('arrow.down')}</span></div>` +
      `<div class="dis-m-cols">` +
        `<div class="dis-m-box is-up"><span class="dis-m-k">Birikir</span><span class="dis-m-t">${esc(first(d.accumulates) || '—')}</span>${more(d.accumulates)}</div>` +
        `<div class="dis-m-box is-down"><span class="dis-m-k">Azalır</span><span class="dis-m-t">${esc(first(d.deficient) || '—')}</span>${more(d.deficient)}</div>` +
      `</div></div>`;
  }

  App.defineRoute('disease', function (params) {
    const d = App.data.disease(params.id);
    if (!d) return { title: 'Hastalık', render(el) { el.innerHTML = U.empty('questionmark.circle', 'Kayıt bulunamadı', ''); } };
    const c = catOf(d.category);
    return {
      title: d.name,
      largeTitle: false,
      render(el) {
        const badges = [`<span class="badge" style="background:color-mix(in srgb, ${c.color} 16%, transparent);color:var(--label)">${esc(c.label)}</span>`];
        if (d.inheritance) badges.push(`<span class="badge is-clin">${esc(d.inheritance)}</span>`);
        if (d.tissue) badges.push(`<span class="badge is-tint">${esc(d.tissue)}</span>`);
        const kv = [];
        if (d.enzyme) kv.push(`<div><div class="k">Enzim / protein</div><div class="v">${esc(d.enzyme)}</div></div>`);
        if (d.gene) kv.push(`<div><div class="k">Gen</div><div class="v exam-gene">${esc(d.gene)}</div></div>`);
        if (d.inheritance) kv.push(`<div><div class="k">Kalıtım</div><div class="v">${esc(INH[d.inheritance] || d.inheritance)}${INH[d.inheritance] && INH[d.inheritance] !== d.inheritance ? ` <small>(${esc(d.inheritance)})</small>` : ''}</div></div>`);
        el.innerHTML =
          `<div class="exam-head">${U.tile(d.category === 'eritrosit' || d.category === 'mitokondri' ? 'cross.case' : 'stethoscope', c.color, 'xl')}` +
            `<div class="exam-head-body"><h2 class="t-title2 exam-head-name">${esc(d.name)}</h2>` +
            (d.aka ? `<p class="exam-head-aka">${esc(d.aka)}</p>` : '') +
            `<div class="exam-head-badges">${badges.join('')}</div></div></div>` +
          strip(d) +
          (kv.length ? U.section({ header: 'Eksik enzim', cls: 'exam-sec', body: `<div class="exam-kv">${kv.join('')}</div>` }) : '') +
          K().items('Biriken', d.accumulates, 'is-acc') +
          K().items('Azalan / üretilemeyen', d.deficient, 'is-def') +
          K().items('Klinik bulgular', d.findings) +
          K().items('Laboratuvar', d.labs) +
          K().items('Tedavi', d.treatment, 'is-ok') +
          K().pearl(d.pearl) +
          K().steps(d.links);
        K().bindOpen(el);
      }
    };
  });
})();
