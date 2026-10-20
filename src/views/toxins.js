/* =====================================================================
   TOKSİN & İLAÇ — Sınav sekmesi bölümü + toxin {id} sayfası  (önek: tox-)
   ===================================================================== */
(function () {
  'use strict';
  const U = App.ui;
  const esc = U.esc;
  const K = () => window.ExamKit;

  const KINDS = [
    { value: 'toksin', label: 'Toksin' }, { value: 'ilac', label: 'İlaç' },
    { value: 'deneysel', label: 'Deneysel' }, { value: 'fizyolojik', label: 'Fizyolojik' }
  ];
  const kindLabel = (k) => (KINDS.find(x => x.value === k) || { label: k || '' }).label;
  // action → görünüm
  const ACT = {
    'inhibitor': { label: 'İnhibitör', cls: 'is-inh', color: 'var(--inhibitor)', sign: 'inh' },
    'ayirici': { label: 'Ayırıcı', cls: 'is-clin', color: 'var(--clinical)', sign: null },
    'aktivator': { label: 'Aktivatör', cls: 'is-act', color: 'var(--activator)', sign: 'act' },
    'substrat-analogu': { label: 'Substrat analoğu', cls: 'is-rate', color: 'var(--rate)', sign: 'inh' }
  };
  const actOf = (a) => ACT[a] || { label: a || '', cls: '', color: 'var(--gray)', sign: null };
  const toxins = () => App.data.toxins || [];
  const fieldsOf = (t) => [t.name, t.aka, t.target, t.mechanism, t.effect, t.clinical, t.antidote, t.pearl, kindLabel(t.kind), actOf(t.action).label].filter(Boolean);
  const firstPw = (t) => { const l = (t.links || [])[0]; return l ? l.pw : null; };

  function accessory(t) {
    const a = actOf(t.action);
    if (a.sign) return `<span class="tox-acc">${U.sign(a.sign)}</span>`;
    return `<span class="badge ${a.cls}">${esc(a.label)}</span>`;
  }
  function row(t, raw, q) {
    const own = [t.name, t.aka, t.target].filter(Boolean);
    let hit = '';
    if (q && !own.some(f => U.norm(f).indexOf(q) !== -1)) {
      const f = fieldsOf(t).find(x => U.norm(x).indexOf(q) !== -1);
      if (f) hit = `<span class="exam-hit">${U.hl(f, raw)}</span>`;
    }
    const ak = K().aka(t.aka, (x) => U.hl(x, raw));
    return U.row({
      title: U.hl(t.name, raw) + ak.badge,
      subtitle: ak.line + (t.target ? `Hedef: ${U.hl(t.target, raw)}` : '') + hit,
      accessory: accessory(t),
      chevron: true, action: 'toxin', cls: 'exam-row', attrs: `data-id="${esc(t.id)}"`
    });
  }

  function createPane() {
    let query = '', kind = 'all', root = null;

    function paint() {
      const out = root && root.querySelector('#tox-out');
      if (!out) return;
      const raw = query.trim(), q = U.norm(raw);
      const list = toxins().filter(t => (kind === 'all' || t.kind === kind) && K().match(fieldsOf(t), q));
      if (!list.length) { out.innerHTML = U.empty('magnifyingglass', 'Sonuç yok', raw ? `“${raw}” için eşleşen kayıt bulunamadı.` : 'Gösterilecek kayıt yok.'); return; }
      let html = '';
      const groups = App.data.pathways.map(pw => ({ id: pw.id, items: list.filter(t => firstPw(t) === pw.id) }));
      groups.push({ id: null, items: list.filter(t => !firstPw(t) || !App.data.pathway(firstPw(t))) });
      groups.forEach(g => {
        if (!g.items.length) return;
        const st = g.id ? U.pathwayStyle(g.id) : { color: 'var(--gray)', short: 'Diğer' };
        html += U.section({
          header: `<span class="exam-dot" style="background:${st.color}"></span>${esc(st.short)}<span class="exam-hcount">${g.items.length}</span>`,
          cls: 'exam-sec', body: U.list(g.items.map(t => row(t, raw, q)))
        });
      });
      out.innerHTML = html + `<p class="exam-footer">${list.length} kayıt${raw ? ` • “${esc(raw)}”` : ''}</p>`;
    }

    return {
      render(el) {
        root = el;
        const present = KINDS.filter(k => toxins().some(t => t.kind === k.value));
        if (kind !== 'all' && !present.some(k => k.value === kind)) kind = 'all';
        el.innerHTML = `<div class="exam-controls">` + U.searchField('tox-q', 'Toksin, ilaç, hedef, antidot…', query) + `</div>` +
          K().chips('tox-kind', [{ value: 'all', label: 'Tümü' }].concat(present), kind) + `<div id="tox-out"></div>`;
        U.bindSearch(el, 'tox-q', (v) => { query = v; paint(); });
        K().bindChips(el, 'tox-kind', (v) => { kind = v; paint(); });
        el.addEventListener('click', (e) => {
          const b = e.target.closest('[data-action="toxin"]');
          if (b) App.open('toxin', { id: b.dataset.id });
        });
        paint();
      }
    };
  }
  window.ExamPanes = window.ExamPanes || {};
  window.ExamPanes.toxins = { create: createPane };

  /* ---------------- detay ---------------- */
  function connector(action) {
    const a = actOf(action);
    const col = a.color;
    let line;
    if (action === 'aktivator') line = `<path d="M2 14h50" stroke="${col}" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M45 7l8 7-8 7" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    else if (action === 'ayirici') line = `<path d="M2 14h50" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="2 5.5" fill="none"/><path d="M45 7l8 7-8 7" stroke="${col}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    else line = `<path d="M2 14h46" stroke="${col}" stroke-width="2.4" stroke-linecap="round" fill="none"${action === 'substrat-analogu' ? ' stroke-dasharray="6 4"' : ''}/><path d="M51 5v18" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/>`;
    return `<span class="tox-conn">` +
      (a.sign ? U.sign(a.sign, 'sm') : `<span class="tox-conn-sp"></span>`) +
      `<svg viewBox="0 0 56 28" aria-hidden="true">${line}</svg></span>`;
  }

  App.defineRoute('toxin', function (params) {
    const t = App.data.toxin(params.id);
    if (!t) return { title: 'Kayıt', render(el) { el.innerHTML = U.empty('questionmark.circle', 'Kayıt bulunamadı', ''); } };
    const a = actOf(t.action);
    const para = (txt) => `<div class="exam-items"><div class="tox-p reading">${esc(txt)}</div></div>`;
    const sec = (h, txt) => txt ? U.section({ header: h, cls: 'exam-sec', body: para(txt) }) : '';
    return {
      title: t.name,
      largeTitle: false,
      render(el) {
        const tileIcon = t.kind === 'ilac' ? 'cross.case' : t.kind === 'fizyolojik' ? 'leaf' : 'flask';
        el.innerHTML =
          `<div class="exam-head">${U.tile(tileIcon, a.color, 'xl')}` +
            `<div class="exam-head-body"><h2 class="t-title2 exam-head-name">${esc(t.name)}</h2>` +
            (t.aka ? `<p class="exam-head-aka">${esc(t.aka)}</p>` : '') +
            `<div class="exam-head-badges"><span class="badge is-tint">${esc(kindLabel(t.kind))}</span><span class="badge ${a.cls}">${esc(a.label)}</span></div></div></div>` +
          (t.target ? U.section({ header: 'Hedef', cls: 'exam-sec', body:
            `<div class="card tox-diag"><span class="tox-pill is-agent" style="background:color-mix(in srgb, ${a.color} 15%, transparent)">${esc(t.name)}</span>${connector(t.action)}<span class="tox-pill is-target">${esc(t.target)}</span></div>` }) : '') +
          sec('Mekanizma', t.mechanism) +
          sec('Metabolik sonuç', t.effect) +
          sec('Klinik tablo', t.clinical) +
          (t.antidote ? `<section class="section exam-sec"><div class="exam-antidote">${U.icon('shield')}<div><b>Antidot</b><span>${esc(t.antidote)}</span></div></div></section>` : '') +
          K().pearl(t.pearl) +
          K().steps(t.links);
        K().bindOpen(el);
      }
    };
  });
})();
