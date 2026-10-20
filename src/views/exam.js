/* =====================================================================
   SINAV — examHome (sekme kökü) + paylaşılan yardımcılar (ExamKit)
   Bölümler: Enzimler | Hastalıklar | Toksin & ilaç
   ===================================================================== */
(function () {
  'use strict';
  const U = App.ui;
  const esc = U.esc;
  const SKEY = 'exam.pane';
  const PANES = [
    { value: 'enzymes', label: 'Enzimler' },
    { value: 'diseases', label: 'Hastalıklar' },
    { value: 'toxins', label: 'Toksin & ilaç' }
  ];

  const strip = (t) => String(t || '').replace(/\s*\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim();

  /* ---------------- paylaşılan yardımcılar ---------------- */
  const Kit = window.ExamKit = {
    strip,
    // Yatay kaydırmalı filtre çipleri
    chips(id, opts, value) {
      return `<div class="chip-row exam-chips" data-chips="${esc(id)}" role="radiogroup">` +
        opts.map(o => `<button type="button" class="chip${o.value === value ? ' is-on' : ''}" role="radio" aria-checked="${o.value === value}" data-value="${esc(o.value)}">${esc(o.label)}</button>`).join('') + `</div>`;
    },
    bindChips(root, id, onChange) {
      const row = root.querySelector(`[data-chips="${id}"]`);
      if (!row) return;
      row.addEventListener('click', (e) => {
        const b = e.target.closest('.chip'); if (!b) return;
        row.querySelectorAll('.chip').forEach(c => { const on = c === b; c.classList.toggle('is-on', on); c.setAttribute('aria-checked', String(on)); });
        onChange(b.dataset.value);
      });
    },
    // Madde listesi kartı (madde işaretli)
    items(header, list, cls) {
      if (!list || !list.length) return '';
      return U.section({
        header, cls: 'exam-sec ' + (cls || ''),
        body: `<div class="exam-items">${list.map(t => `<div class="exam-li">${esc(t)}</div>`).join('')}</div>`
      });
    },
    pearl(text) {
      if (!text) return '';
      return `<section class="section exam-sec"><div class="exam-pearl">` +
        `<div class="exam-pearl-head">${U.icon('sparkles')}<span>Sınav ipucu</span></div>` +
        `<p class="exam-pearl-text">${esc(text)}</p></div></section>`;
    },
    // "İlgili basamaklar" satırları
    steps(links) {
      const rows = [];
      (links || []).forEach(l => {
        const st = App.data.step(l.pw, l.idx), pw = App.data.pathway(l.pw);
        if (!st || !pw) return;
        const sty = U.pathwayStyle(pw.id);
        const nm = 'Basamak ' + (+l.idx + 1);
        rows.push(U.row({
          title: esc(strip(st.enzyme).split(/\s(?:ve|&|\/)\s/)[0]),
          subtitle: `${esc(sty.short)} • ${esc(nm)}`,
          leading: U.pathwayTile(pw.id), chevron: true, action: 'step', cls: 'is-top',
          attrs: `data-pw="${esc(l.pw)}" data-idx="${+l.idx}"`
        }));
      });
      if (!rows.length) return '';
      return U.section({ header: 'İlgili basamaklar', body: U.list(rows, { icons: true }), cls: 'exam-sec' });
    },
    // Detay sayfalarında basamak / çapraz açma
    bindOpen(el) {
      el.addEventListener('click', (e) => {
        const b = e.target.closest('[data-action="step"]');
        if (b) App.open('step', { pw: b.dataset.pw, idx: +b.dataset.idx });
      });
    },
    // Takma ad: kısaysa rozet, uzunsa ayrı satır
    aka(aka, hl) {
      if (!aka) return { badge: '', line: '' };
      return aka.length <= 16 ? { badge: `<span class="badge">${hl(aka)}</span>`, line: '' } : { badge: '', line: `<span class="exam-aka-line">${hl(aka)}</span>` };
    },
    // Metin içinde tüm alanlarda arama
    match(fields, q) { return !q || fields.some(f => U.norm(f).indexOf(q) !== -1); }
  };

  /* ---------------- examHome ---------------- */
  function stored() { try { return sessionStorage.getItem(SKEY); } catch (e) { return null; } }
  function store(v) { try { sessionStorage.setItem(SKEY, v); } catch (e) { /* yok */ } }

  App.defineRoute('examHome', function (params) {
    let pane = (params && params.pane) || stored();
    if (!PANES.some(p => p.value === pane)) pane = 'enzymes';
    const inst = {};

    function getPane(name) {
      if (!inst[name]) {
        const reg = window.ExamPanes && window.ExamPanes[name];
        inst[name] = reg ? reg.create() : null;
      }
      return inst[name];
    }
    function syncQuick(page) {
      const b = page.navbar && page.navbar.querySelector('[data-trailing="0"]');
      if (!b) return;
      const on = pane === 'enzymes';
      b.style.display = on ? '' : 'none';
      const p = inst.enzymes;
      const q = !!(p && p.quick);
      b.classList.toggle('is-on', q);
      b.setAttribute('aria-pressed', String(q));
    }
    function mount(page) {
      const host = page.content.querySelector('#exam-pane');
      if (!host) return;
      const d = document.createElement('div');
      host.replaceChildren(d);
      const p = getPane(pane);
      if (p) p.render(d, page);
      else d.innerHTML = U.empty('clock', 'Hazırlanıyor…', '');
      syncQuick(page);
    }

    return {
      title: 'Sınav',
      subtitle: 'Hızlı tekrar ve başvuru',
      trailing: [{
        icon: 'list.bullet', label: 'Hızlı bakış', tint: true,
        onClick(e, page, btn) {
          const p = getPane('enzymes');
          if (pane !== 'enzymes' || !p) return;
          p.toggleQuick();
          syncQuick(page);
        }
      }],
      render(el, page) {
        el.innerHTML = `<div class="exam-seg">${U.segmented('exam-pane-seg', PANES, pane, 'is-lg')}</div><div id="exam-pane"></div>`;
        U.bindSegmented(el, 'exam-pane-seg', (v) => { pane = v; store(v); mount(page); });
        mount(page);
        setTimeout(() => syncQuick(page), 0);
      }
    };
  });
})();
