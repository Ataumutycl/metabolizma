/* =====================================================================
   ENZİMLER — enzymesHome (sekme kökü): sınav için hızlı başvuru
   ===================================================================== */
(function () {
  'use strict';
  const U = App.ui;
  const D = App.data;

  // Enzim adı: köşeli parantez notlarını at, uzun birleşik adlarda ilk bölümü göster
  function enzParts(e) {
    const clean = String(e || '').replace(/\s*\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
    if (clean.length <= 46) return { text: clean, more: 0, full: clean };
    const parts = clean.split(/\s(?:ve|&|→|\/)\s/);
    const out = [];
    for (const p of parts) {
      if (out.length && (out[out.length - 1].split('(').length !== out[out.length - 1].split(')').length)) out[out.length - 1] += ' ' + p;
      else out.push(p);
    }
    if (out.length > 1) return { text: out[0], more: out.length - 1, full: clean };
    return { text: clean, more: 0, full: clean };
  }
  const strip = (t) => String(t || '').replace(/\s*\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();
  const key = (x) => x.pw.id + ':' + x.sIdx;
  const count = (a) => (a || []).length;

  function fields(x) {
    const s = x.st;
    return [s.enzyme, s.substrate, s.product, s.cofactors, s.clinicalNote || '']
      .concat(s.activators || [], s.inhibitors || [], (s.crossConnections || []).map(c => c.label));
  }
  function matches(x, q) {
    if (!q) return true;
    return fields(x).some(f => U.norm(f).indexOf(q) !== -1);
  }
  function visibleMatch(x, q) {
    const p = enzParts(x.st.enzyme);
    return [p.text, strip(x.st.substrate), strip(x.st.product)].some(f => U.norm(f).indexOf(q) !== -1);
  }

  function limited(list, q, max) {
    const nq = U.norm(q || '');
    const sorted = nq ? list.filter(t => U.norm(t).indexOf(nq) !== -1).concat(list.filter(t => U.norm(t).indexOf(nq) === -1)) : list;
    const first = sorted.slice(0, max);
    return first.map(t => {
      const lab = U.splitLabel(t);
      return `<div class="enz-reg-item">` +
        (lab.label ? `<b>${U.hl(lab.label, q)}</b> ` : '') + `<span>${U.hl(lab.body, q)}</span></div>`;
    }).join('') + (list.length > max ? `<div class="enz-reg-more">+${list.length - max} daha</div>` : '');
  }

  function detailHtml(x, q) {
    const s = x.st, p = enzParts(s.enzyme);
    let h = '<div class="enz-detail">';
    if (p.full !== p.text) h += `<div class="enz-dgroup"><div class="enz-dlabel">Enzim</div><div class="enz-reg-item">${U.hl(p.full, q)}</div></div>`;
    if (s.cofactors) h += `<div class="enz-dgroup"><div class="enz-dlabel">Kofaktör ve koşullar</div><div class="enz-reg-item">${U.hl(s.cofactors, q)}</div></div>`;
    if (count(s.activators)) h += `<div class="enz-dgroup is-act"><div class="enz-dlabel">${U.sign('act', 'sm')}Aktivatörler</div>${limited(s.activators, q, 3)}</div>`;
    if (count(s.inhibitors)) h += `<div class="enz-dgroup is-inh"><div class="enz-dlabel">${U.sign('inh', 'sm')}İnhibitörler ve toksinler</div>${limited(s.inhibitors, q, 3)}</div>`;
    h += `<button type="button" class="enz-goto" data-act="open" data-pw="${x.pw.id}" data-idx="${x.sIdx}">Basamağı aç${U.chevron()}</button></div>`;
    return h;
  }

  function itemHtml(x, q, open) {
    const s = x.st, p = enzParts(s.enzyme);
    const na = count(s.activators), ni = count(s.inhibitors);
    return `<div class="enz-item${open ? ' is-open' : ''}" data-key="${key(x)}">` +
      `<div class="row enz-row">` +
        `<button type="button" class="enz-open" data-act="open" data-pw="${x.pw.id}" data-idx="${x.sIdx}">` +
          `<span class="enz-body">` +
            `<span class="enz-title">${U.hl(p.text, q)}${p.more ? `<span class="enz-more"> +${p.more}</span>` : ''}</span>` +
            `<span class="row-subtitle is-clamp enz-sub">${U.hl(strip(s.substrate), q)} → ${U.hl(strip(s.product), q)}</span>` +
          `</span>` +
          `<span class="enz-acc">` +
            (s.isRateLimiting ? `<span class="enz-bolt c-rate" aria-label="Hız kısıtlayıcı">${U.icon('bolt.fill')}</span>` : '') +
            `<span class="enz-signs" aria-label="${na} aktivatör, ${ni} inhibitör"><span class="is-act">+${na}</span><span class="is-inh">−${ni}</span></span>` +
          `</span>` +
        `</button>` +
        `<button type="button" class="enz-tog" data-act="tog" aria-expanded="${open}" aria-label="Hızlı bakış">${U.icon('chevron.down')}</button>` +
      `</div>` +
      (open ? detailHtml(x, q) : '') +
    `</div>`;
  }

  /* Pane: Sınav sekmesindeki "Enzimler" bölümü (exam.js bağlar) */
  function createPane() {
    let query = '', mode = 'rate', quick = false;
    const opened = new Set();
    let root = null;

    function paint() {
      const out = root && root.querySelector('#enz-out');
      if (!out) return;
      const raw = query.trim(), q = U.norm(raw);
      let total = 0;
      let html = '';
      D.pathways.forEach(pw => {
        const items = D.allSteps.filter(x => x.pw === pw && (mode === 'all' || x.st.isRateLimiting) && matches(x, q));
        if (!items.length) return;
        total += items.length;
        const st = U.pathwayStyle(pw.id);
        html += U.section({
          header: `<span class="enz-dot" style="background:${st.color}"></span>${U.esc(st.short)}<span class="enz-hcount">${items.length}</span>`,
          cls: 'enz-sec',
          body: `<div class="list enz-list">${items.map(x => {
            const open = quick || opened.has(key(x)) || (q && !visibleMatch(x, q));
            return itemHtml(x, raw, !!open);
          }).join('')}</div>`
        });
      });
      if (!total) {
        out.innerHTML = U.empty('magnifyingglass', 'Sonuç yok', raw ? `“${raw}” için eşleşen basamak bulunamadı.` : 'Gösterilecek basamak yok.');
        return;
      }
      const noun = mode === 'rate' ? 'hız kısıtlayıcı basamak' : 'basamak';
      out.innerHTML = html + `<p class="enz-footer">${total} ${noun}${raw ? ` • “${U.esc(raw)}”` : ''}</p>`;
    }

    return {
      get quick() { return quick; },
      toggleQuick() { quick = !quick; opened.clear(); paint(); return quick; },
      render(el) {
        root = el;
        el.innerHTML =
          `<div class="enz-controls">` +
            U.searchField('enz-q', 'Enzim, kofaktör, toksin…', query) +
            U.segmented('enz-mode', [{ value: 'rate', label: 'Hız kısıtlayıcı' }, { value: 'all', label: 'Tüm basamaklar' }], mode, 'is-lg') +
          `</div><div id="enz-out"></div>`;
        U.bindSearch(el, 'enz-q', (v) => { query = v; paint(); });
        U.bindSegmented(el, 'enz-mode', (v) => { mode = v; paint(); });
        el.addEventListener('click', (e) => {
          const b = e.target.closest('[data-act]');
          if (!b) return;
          if (b.dataset.act === 'open') { App.open('step', { pw: b.dataset.pw, idx: +b.dataset.idx }); return; }
          if (b.dataset.act === 'tog') {
            const item = b.closest('.enz-item');
            const k = item.dataset.key;
            const wasOpen = item.classList.contains('is-open');
            if (wasOpen) opened.delete(k); else opened.add(k);
            const x = D.allSteps.find(s => key(s) === k);
            item.outerHTML = itemHtml(x, query.trim(), !wasOpen);
            const fresh = el.querySelector(`.enz-item[data-key="${k}"]`);
            if (fresh && !wasOpen) fresh.classList.add('enz-expanding');
          }
        });
        paint();
      }
    };
  }
  window.ExamPanes = window.ExamPanes || {};
  window.ExamPanes.enzymes = { create: createPane };

  // Uyumluluk: eski rota → Sınav sayfası (Enzimler bölümü seçili)
  App.defineRoute('enzymesHome', function (params) {
    return App.routes.examHome(Object.assign({}, params, { pane: 'enzymes' }));
  });
})();
