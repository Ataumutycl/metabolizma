/* =====================================================================
   YOLAKLAR — pathwaysHome, pathway, step, legend
   "Kesintisiz Adım Adım Şema" — yerel iOS gezintisi olarak yeniden kuruldu.
   ===================================================================== */
(function () {
  'use strict';
  const U = App.ui;
  const esc = U.esc;
  const D = App.data;
  const PW = D.pathways;
  const ALL = D.allSteps;

  /* ---------------------------------------------------------------
     Yardımcılar
     --------------------------------------------------------------- */
  const GROUPS = [
    { title: 'Karbonhidrat', ids: ['glikoliz', 'glukoneogenez', 'glikojen', 'hmp'] },
    { title: 'Mitokondri merkezi', ids: ['pdh', 'tca', 'etz'] },
    { title: 'Lipit', ids: ['lipogenez', 'beta_oks', 'keton_kolesterol'] },
    { title: 'Azot', ids: ['ure_aa'] }
  ];
  const LIST_TITLE = {
    glikoliz: 'Glikoliz',
    glukoneogenez: 'Glukoneogenez',
    glikojen: 'Glikojen metabolizması',
    hmp: 'Pentoz fosfat yolu',
    pdh: 'Pirüvat dehidrogenaz',
    tca: 'Sitrik asit döngüsü',
    etz: 'Elektron taşıma zinciri',
    lipogenez: 'Yağ asidi ve TAG sentezi',
    beta_oks: 'Lipoliz ve β-oksidasyon',
    keton_kolesterol: 'Ketogenez ve kolesterol',
    ure_aa: 'Amino asit yıkımı ve üre'
  };
  const COMP_SHORT = {
    glikoliz: 'Sitozol',
    glukoneogenez: 'Mitokondri, sitozol, ER',
    glikojen: 'Sitozol',
    hmp: 'Sitozol',
    pdh: 'Mitokondri matriksi',
    tca: 'Mitokondri matriksi',
    etz: 'İç mitokondri membranı',
    lipogenez: 'Sitozol, ER',
    beta_oks: 'Sitozol, mitokondri',
    keton_kolesterol: 'Mitokondri, sitozol',
    ure_aa: 'Mitokondri, sitozol'
  };
  const listTitle = (pw) => LIST_TITLE[pw.id] || U.titleCase(pw.title).replace(/\s*\(.*$/, '');
  const compShort = (pw) => COMP_SHORT[pw.id] || pw.compartment.split(/[(:•&]/)[0].trim();
  const shortOf = (id) => U.pathwayStyle(id).short;
  const totalSteps = ALL.length;
  const rateCount = (pw) => pw.steps.filter(s => s.isRateLimiting).length;
  const stateCounts = (pw, state) => {
    let active = 0, supp = 0;
    pw.steps.forEach(s => { const k = D.stateInfo(s, state).kind; if (k === 'active') active++; else if (k === 'suppressed') supp++; });
    return { active, supp };
  };
  const stripLead = (s) => String(s || '').replace(/^[^\p{L}\p{N}(\[]+/u, '').trim();
  const hubName = (h) => String(h.name || '').replace(/^\d+\.\s*/, '');

  // Enzim adı: kısa (gezinti başlığı / diyagram) ve tam (üst bilgi)
  function enzymeShort(e) {
    let s = String(e || '').replace(/\s+/g, ' ').trim();
    s = s.split(/ \[| \(| \/| ve | & | → /)[0].trim();
    return s || String(e || '');
  }
  // Gezinti başlığı: uzunsa parantez içi kısaltma
  function navTitle(e) {
    const sh = enzymeShort(e);
    if (sh.length <= 15) return sh;
    const m = String(e || '').replace(/\s+/g, ' ').match(/^[^(\[]*\(([^()\s\/—]{2,12})\s*(?:[\/—]|\))/);
    if (m && /[A-ZÇĞİÖŞÜ0-9].*[A-ZÇĞİÖŞÜ0-9]/.test(m[1])) return m[1];
    let out = '';
    sh.split(' ').forEach(w => { if (!out || (out + " " + w).length <= 15) out = out ? out + ' ' + w : w; });
    return out.length < sh.length ? out.replace(/[-,]$/, '') + '…' : out;
  }
  function enzymeParts(e) {
    const s = String(e || '').replace(/\s+/g, ' ').trim();
    const m = s.match(/^(.*?)\s*\[([^\[\]]*)\]\s*$/);
    if (m && m[1]) return { main: m[1], note: m[2] };
    return { main: s, note: '' };
  }
  // Basamak adı: ad + not
  function stepTitle(st) {
    let { name, note } = U.parseStepNo(st.stepNo);
    if (!note) {
      const i = name.indexOf(':');
      if (i > 0 && i <= 34) { note = name.slice(i + 1).trim(); name = name.slice(0, i).trim(); }
    }
    return { name, note };
  }
  const hubFirst = (a) => a && a.length;

  /* Düzenleyici oklar (diyagram + açıklama sayfası ortak) */
  function arrowSVG(kind) {
    if (kind === 'act') {
      return `<svg class="pw-ar is-act" viewBox="0 0 76 40" aria-hidden="true">` +
        `<line x1="22" y1="20" x2="62" y2="20" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>` +
        `<path d="M60 11.5L74 20 60 28.5z" fill="currentColor"/>` +
        `<circle cx="12" cy="20" r="11" fill="currentColor"/>` +
        `<path d="M12 14.5v11M6.5 20h11" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`;
    }
    return `<svg class="pw-ar is-inh" viewBox="0 0 76 40" aria-hidden="true">` +
      `<line x1="4" y1="20" x2="54" y2="20" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>` +
      `<rect x="1" y="8" width="4.4" height="24" rx="2.2" fill="currentColor"/>` +
      `<circle cx="64" cy="20" r="11" fill="currentColor"/>` +
      `<path d="M58.5 20h11" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`;
  }
  const downArrow = () => `<svg class="pw-rx-down" viewBox="0 0 20 30" aria-hidden="true"><line x1="10" y1="1.5" x2="10" y2="22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M3.5 18.5L10 27l6.5-8.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* Tepkime diyagramı: substrat → (enzim) → ürün, yanlarda (+) / (−) */
  function reactionDiagram(o) {
    return `<div class="pw-rx" style="--pw-c:${o.color}">` +
      `<div class="pw-rx-box"><span class="pw-rx-cap">Substrat</span><span class="pw-rx-txt">${esc(o.sub)}</span></div>` +
      downArrow() +
      `<div class="pw-rx-mid">` +
        `<div class="pw-rx-side is-act">${arrowSVG('act')}<span>${o.nAct} aktivatör</span></div>` +
        `<div class="pw-rx-enz${o.rate ? ' is-rate' : ''}">${o.rate ? `<span class="pw-rx-bolt">${U.icon('bolt.fill')}</span>` : ''}<span>${esc(String(o.enz).replace(/-(?=\d)/g, '\u2011'))}</span></div>` +
        `<div class="pw-rx-side is-inh">${arrowSVG('inh')}<span>${o.nInh} inhibitör</span></div>` +
      `</div>` +
      downArrow() +
      `<div class="pw-rx-box is-prod"><span class="pw-rx-cap">Ürün</span><span class="pw-rx-txt">${esc(o.prod)}</span></div>` +
    `</div>`;
  }

  function stateBadge(st) {
    const si = D.stateInfo(st);
    if (!si.kind) return '';
    const ic = si.cls === 'is-fed' ? 'leaf' : si.cls === 'is-fast' ? 'moon' : null;
    return U.badge(si.label, si.cls, ic);
  }

  /* ===============================================================
     1) pathwaysHome
     =============================================================== */
  const STATE_TEXT = {
    all: {
      icon: 'circle.lefthalf', color: 'var(--gray)', head: 'Standart görünüm',
      body: 'Tüm basamaklar eşit vurguyla gösterilir. Tokluk ya da açlık seçerek hangi basamakların öne çıktığını ve hangilerinin baskılandığını görün.',
      focus: []
    },
    fed: {
      icon: 'leaf', color: 'var(--green)', head: 'Tokluk • insülin baskın',
      body: 'Protein fosfatazlar (PP1/PP2A) çalışır. Defosforilasyonla anabolik enzimler (glikojen sentaz, PDH, ACC) aktifleşir; katabolik enzimler (fosforilaz, HSL) durur.',
      focus: ['Glikoliz', 'Glikojenez', 'Pentoz fosfat', 'PDH', 'Yağ asidi sentezi', 'Kolesterol sentezi']
    },
    fasting: {
      icon: 'moon', color: 'var(--indigo)', head: 'Açlık • glukagon ve epinefrin',
      body: 'Glukagon/epinefrin → cAMP → PKA (enerji stresinde ayrıca AMPK). Fosforilasyonla katabolik enzimler (fosforilaz, HSL) aktifleşir; anabolik enzimler (glikojen sentaz, ACC, PDH) durur.',
      focus: ['Glikojenoliz', 'Glukoneogenez', 'Lipoliz', 'β-Oksidasyon', 'Ketogenez', 'Üre döngüsü']
    }
  };

  function stateBodyHTML() {
    const s = App.state.metabolicState || 'all';
    const t = STATE_TEXT[s];
    const cls = s === 'fed' ? 'is-fed' : 'is-fast';
    return `<div class="pw-state-head">${U.tile(t.icon, t.color, 'sm')}<span class="t-headline">${esc(t.head)}</span></div>` +
      `<p class="t-subhead c-2 pw-state-text">${esc(t.body)}</p>` +
      (t.focus.length ? `<div class="pw-focus"><span class="t-caption1 c-2 w-semibold">Öne çıkan yolaklar</span><div class="pw-focus-chips">${t.focus.map(f => U.badge(f, cls)).join('')}</div></div>` : '');
  }

  function pathwayRowsHTML() {
    const state = App.state.metabolicState || 'all';
    return GROUPS.map(g => {
      const rows = g.ids.map(id => D.pathway(id)).filter(Boolean).map(pw => {
        const rc = rateCount(pw);
        let acc = '';
        if (rc) acc += `<span class="badge is-rate pw-mini" title="Hız kısıtlayıcı basamak">${U.icon('bolt.fill')}${rc}</span>`;
        if (state !== 'all') {
          const c = stateCounts(pw, state);
          if (c.active) acc += `<span class="badge ${state === 'fed' ? 'is-fed' : 'is-fast'} pw-mini">${U.icon(state === 'fed' ? 'leaf' : 'moon')}${c.active}</span>`;
          else if (c.supp) acc += `<span class="badge is-muted pw-mini">Baskılı</span>`;
        }
        return U.row({
          title: esc(listTitle(pw)),
          subtitle: `${esc(compShort(pw))} • ${pw.steps.length} basamak`,
          leading: U.pathwayTile(pw.id, 'lg'),
          accessory: acc,
          chevron: true,
          action: 'open-pw',
          attrs: `data-id="${pw.id}"`,
          cls: 'is-tall'
        });
      });
      return U.section({ header: esc(g.title), body: U.list(rows, { icons: true, cls: 'pw-list-lg' }) });
    }).join('');
  }

  App.defineRoute('pathwaysHome', () => {
    let unsub = null, selfChange = false;
    return {
      title: 'Yolaklar',
      subtitle: `${PW.length} entegre yolak • ${totalSteps} basamak`,
      trailing: [{ icon: 'textformat.size', label: 'Görünüm', onClick: () => App.openSettings() }],
      render(el, page) {
        const state = App.state.metabolicState || 'all';
        el.innerHTML =
          U.section({
            header: 'Fizyolojik durum',
            footer: 'Seçim tüm sekmelerde geçerlidir; basamaklar buna göre vurgulanır.',
            body: `<div class="card pw-state">` +
              U.segmented('pw-state', [
                { value: 'all', label: 'Standart' },
                { value: 'fed', label: 'Tokluk', icon: 'leaf' },
                { value: 'fasting', label: 'Açlık', icon: 'moon' }
              ], state, 'is-lg') +
              `<div class="pw-state-body" id="pw-state-body" aria-live="polite">${stateBodyHTML()}</div></div>`
          }) +
          `<div id="pw-home-list">${pathwayRowsHTML()}</div>` +
          U.section({
            header: 'Okuma',
            body: U.list([
              U.row({ title: 'Tüm yolakları kesintisiz oku', subtitle: `Glikoliz’den başlayarak ${totalSteps} basamak`, leading: U.tile('book', 'var(--blue)', 'lg'), chevron: true, action: 'read-all', cls: 'is-tall' }),
              U.row({ title: 'Simgeler ve renkler', subtitle: 'Şemayı okuma anahtarı', leading: U.tile('info.circle', 'var(--gray)', 'lg'), chevron: true, action: 'legend', cls: 'is-tall' })
            ], { icons: true, cls: 'pw-list-lg' })
          });

        U.bindSegmented(el, 'pw-state', (v) => { selfChange = true; App.setState({ metabolicState: v }); selfChange = false; });
        if (!el._pwBound) {
          el._pwBound = true;
          el.addEventListener('click', (e) => {
            const b = e.target.closest('[data-action]');
            if (!b) return;
            const a = b.dataset.action;
            if (a === 'open-pw') App.open('pathway', { id: b.dataset.id });
            else if (a === 'read-all') App.open('step', { pw: ALL[0].pw.id, idx: 0 });
            else if (a === 'legend') App.open('legend');
          });
        }
        if (!unsub) unsub = App.onState(() => {
          if (selfChange) {
            const body = el.querySelector('#pw-state-body'); if (body) body.innerHTML = stateBodyHTML();
            const list = el.querySelector('#pw-home-list'); if (list) list.innerHTML = pathwayRowsHTML();
          } else page.refresh();
        });
      },
      onDestroy() { unsub && unsub(); unsub = null; }
    };
  });

  /* ===============================================================
     2) pathway
     =============================================================== */
  function stepCardHTML(pw, st, i) {
    const t = stepTitle(st);
    const si = D.stateInfo(st);
    const na = (st.activators || []).length, ni = (st.inhibitors || []).length;
    const badges = [
      st.isRateLimiting ? U.rateBadge() : '',
      stateBadge(st),
      st.junctionId ? U.badge('Kavşak', 'is-jn', 'link') : ''
    ].join('');
    return `<div class="pw-node-row">` +
      `<div class="pw-rail"><span class="pw-node">${i + 1}</span></div>` +
      `<button type="button" class="pw-step${si.kind === 'suppressed' ? ' is-suppressed' : ''}" data-action="open-step" data-pw="${pw.id}" data-idx="${i}">` +
        `<span class="pw-step-name">${esc(t.name)}</span>` +
        (t.note ? `<span class="pw-step-note">${esc(t.note)}</span>` : '') +
        `<span class="pw-step-rx"><span class="pw-sub">${esc(st.substrate)}</span>${U.icon('arrow.right', 'pw-rx-arrow')}<strong class="pw-prod">${esc(st.product)}</strong></span>` +
        `<span class="pw-step-enz">${esc(enzymeParts(st.enzyme).main)}</span>` +
        `<span class="pw-step-foot"><span class="pw-step-badges">${badges}</span>` +
          `<span class="pw-counts"><span class="pw-cnt">${U.sign('act', 'sm')}${na}</span><span class="pw-cnt">${U.sign('inh', 'sm')}${ni}</span></span></span>` +
      `</button></div>`;
  }

  App.defineRoute('pathway', (params) => {
    const pw = D.pathway(params.id) || PW[0];
    const pIdx = PW.indexOf(pw);
    const style = U.pathwayStyle(pw.id);
    let unsub = null;
    return {
      title: style.short,
      subtitle: `${pw.steps.length} basamak${rateCount(pw) ? ` • ${rateCount(pw)} hız kısıtlayıcı` : ''}`,
      render(el, page) {
        const state = App.state.metabolicState || 'all';
        // Durum notu
        let note = '';
        if (state !== 'all') {
          const c = stateCounts(pw, state);
          const nm = state === 'fed' ? 'Tokluk' : 'Açlık';
          const cls = state === 'fed' ? 'is-fed' : 'is-fast';
          let msg;
          if (c.active && c.supp) msg = `${nm} durumunda bu yolakta ${c.active} basamak aktif, ${c.supp} basamak baskılanır. Baskılanan basamaklar soluk gösterilir.`;
          else if (c.active) msg = `${nm} durumunda bu yolakta ${c.active} basamak aktif.`;
          else if (c.supp) msg = `${nm} durumunda bu yolağın ${c.supp} basamağı baskılanır; soluk gösterilir.`;
          else msg = `${nm} durumu bu yolağın basamaklarını belirgin biçimde değiştirmez.`;
          note = `<div class="pw-note ${cls}">${U.icon(state === 'fed' ? 'leaf' : 'moon')}<span>${esc(msg)}</span></div>`;
        }
        const header =
          `<div class="card pw-head" style="--pw-c:${style.color}">` +
            `<div class="pw-head-top">${U.pathwayTile(pw.id, 'xl')}` +
              `<div class="pw-head-text"><h2 class="t-title3 pw-head-title">${esc(D.pathwayTitle(pw))}</h2>` +
              `<div class="pw-comp">${U.icon('mappin')}<span>${esc(pw.compartment)}</span></div></div></div>` +
            note +
            `<div class="pw-eq-wrap"><div class="pw-label">Net denklem</div><div class="inset-box pw-eq">${esc(pw.netEquation)}</div></div>` +
            `<div class="pw-bridges">` +
              `<div class="pw-bridge">${U.tile('arrow.right.to.line', 'var(--junction)')}<div><div class="pw-label">Giriş</div><div class="t-subhead">${esc(pw.entryBridge)}</div></div></div>` +
              `<div class="pw-bridge">${U.tile('arrow.up.right', 'var(--junction)')}<div><div class="pw-label">Çıkış</div><div class="t-subhead">${esc(pw.exitBridge)}</div></div></div>` +
            `</div></div>`;

        const spine = `<div class="pw-spine" style="--pw-c:${style.color}">${pw.steps.map((st, i) => stepCardHTML(pw, st, i)).join('')}</div>`;

        const next = PW[pIdx + 1], prev = PW[pIdx - 1];
        const navRows = [];
        if (next) navRows.push(U.row({ title: esc(listTitle(next)), subtitle: `Sonraki yolak • ${next.steps.length} basamak`, leading: U.pathwayTile(next.id, 'lg'), chevron: true, action: 'open-pw', attrs: `data-id="${next.id}"`, cls: 'is-tall' }));
        if (prev) navRows.push(U.row({ title: esc(listTitle(prev)), subtitle: `Önceki yolak • ${prev.steps.length} basamak`, leading: U.pathwayTile(prev.id, 'lg'), chevron: true, action: 'open-pw', attrs: `data-id="${prev.id}"`, cls: 'is-tall' }));

        el.innerHTML = header +
          `<div class="pw-spacer"></div>` +
          U.section({ header: 'Basamaklar', prominent: true, cls: 'pw-steps-sec', body: spine }) +
          (navRows.length ? U.section({ header: 'Devam', body: U.list(navRows, { icons: true, cls: 'pw-list-lg' }), footer: next ? `Çıkış köprüsü ${esc(shortOf(next.id))} yolağıyla sürer.` : '' }) : '');

        if (!el._pwBound) {
          el._pwBound = true;
          el.addEventListener('click', (e) => {
            const b = e.target.closest('[data-action]');
            if (!b) return;
            if (b.dataset.action === 'open-step') App.open('step', { pw: b.dataset.pw, idx: +b.dataset.idx });
            else if (b.dataset.action === 'open-pw') App.open('pathway', { id: b.dataset.id });
          });
        }
        if (!unsub) unsub = App.onState(() => page.refresh());
      },
      onDestroy() { unsub && unsub(); unsub = null; }
    };
  });

  /* ===============================================================
     3) step
     =============================================================== */
  function paragraphs(text) {
    const sents = String(text || '').split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ"“])/);
    const out = []; let cur = '';
    sents.forEach(s => {
      cur = cur ? cur + ' ' + s : s;
      if (cur.length > 260) { out.push(cur); cur = ''; }
    });
    if (cur) { if (out.length && cur.length < 90) out[out.length - 1] += ' ' + cur; else out.push(cur); }
    return out;
  }

  function regRows(list, kind) {
    return (list || []).map(txt => {
      const p = U.splitLabel(txt);
      return `<div class="row is-top pw-reg">${U.sign(kind, '')}` +
        `<div class="row-body">${p.label ? `<span class="pw-reg-label ${kind === 'inh' ? 'c-inh' : 'c-act'}">${esc(p.label)}</span>` : ''}` +
        `<span class="pw-reg-body">${U.richReg(p.body)}</span></div></div>`;
    }).join('');
  }

  App.defineRoute('step', (params) => {
    let cur = Math.max(0, D.flatIndex(params.pw, +params.idx || 0));
    let unsub = null, busy = false, pageRef = null;

    const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function toolbarHTML() {
      return `<button type="button" class="glass-btn pw-tb" data-tb="prev" aria-label="Önceki basamak">${U.icon('chevron.left')}<span>Önceki</span></button>` +
        `<span class="glass-btn pw-tb-count" aria-live="polite"></span>` +
        `<button type="button" class="glass-btn pw-tb" data-tb="next" aria-label="Sonraki basamak"><span>Sonraki</span>${U.icon('chevron.right')}</button>`;
    }
    function syncToolbar() {
      const tb = pageRef && pageRef.toolbar; if (!tb) return;
      tb.querySelector('.pw-tb-count').textContent = `${cur + 1} / ${totalSteps}`;
      tb.querySelector('[data-tb=prev]').disabled = cur <= 0;
      tb.querySelector('[data-tb=next]').disabled = cur >= totalSteps - 1;
    }

    function contentHTML() {
      const x = ALL[cur], pw = x.pw, st = x.st;
      const style = U.pathwayStyle(pw.id);
      const t = stepTitle(st);
      const ep = enzymeParts(st.enzyme);
      const enzCls = ep.main.length > 78 ? 't-headline' : ep.main.length > 44 ? 't-title3' : 't-title2';
      const na = (st.activators || []).length, ni = (st.inhibitors || []).length;
      const cof = String(st.cofactors || '').split(/\s*\|\s*/).filter(Boolean);

      const head =
        `<div class="pw-sh" style="--pw-c:${style.color}">` +
          `<button type="button" class="pw-chip" data-action="open-pw" data-id="${pw.id}">${U.pathwayTile(pw.id)}<span>${esc(style.short)}</span>${U.chevron()}</button>` +
          `<div class="pw-sh-step"><span class="pw-sh-name">${esc(t.name)}</span>${t.note ? `<span class="pw-sh-note"> • ${esc(t.note)}</span>` : ''}</div>` +
          `<h2 class="pw-sh-enz ${enzCls}">${esc(ep.main)}</h2>` +
          (ep.note ? `<p class="t-subhead c-2 pw-sh-sub">${esc(ep.note)}</p>` : '') +
          (cof.length ? `<div class="pw-cof">${U.icon('flask')}<div>${cof.map(c => `<div>${esc(c)}</div>`).join('')}</div></div>` : '') +
          `<div class="pw-sh-badges">${st.isRateLimiting ? U.rateBadge() : ''}${stateBadge(st)}${st.junctionId ? U.badge('Kavşak', 'is-jn', 'link') : ''}</div>` +
        `</div>`;

      const diagram = U.section({
        body: `<div class="card pw-rx-card">${reactionDiagram({ sub: st.substrate, prod: st.product, enz: enzymeShort(st.enzyme), nAct: na, nInh: ni, rate: st.isRateLimiting, color: style.color })}</div>`
      });

      const regSec = (kind, title, list) => !list || !list.length ? '' : U.section({
        header: `${U.sign(kind)}<span>${title}</span><span class="pw-count">${list.length}</span>`,
        prominent: true, cls: 'pw-sec',
        body: `<div class="list pw-reg-list">${regRows(list, kind)}</div>`
      });

      // Bağlantılar
      const conns = [];
      (st.crossConnections || []).forEach((c, i) => {
        conns.push(U.row({
          title: `<span class="pw-conn-text">${U.richReg(stripLead(c.label))}</span>`,
          subtitle: `Yolak: ${esc(shortOf(c.targetPathway))}`,
          leading: U.tile('link', 'var(--junction)'), chevron: true, action: 'open-pw', attrs: `data-id="${esc(c.targetPathway)}"`, cls: 'is-top'
        }));
      });
      const hub = st.junctionId ? D.hub(st.junctionId) : null;
      if (hub && App.routes.hub) {
        conns.push(U.row({
          title: `<span class="pw-conn-text">Kavşak: ${esc(hubName(hub))}</span>`,
          subtitle: esc(hub.badge || 'Metabolik kavşak'),
          leading: U.tile('point.3.connected', 'var(--junction)'), chevron: true, action: 'open-hub', attrs: `data-id="${esc(hub.id)}"`, cls: 'is-top'
        }));
      }
      const connSec = conns.length ? U.section({
        header: `${U.icon('link')}<span>Bağlantılar</span>`, prominent: true, cls: 'pw-sec is-jn',
        body: U.list(conns, { icons: true, cls: 'pw-conn-list' })
      }) : '';

      // Çapraz bağlantılar: bu basamağa işaret eden hastalık / toksin kayıtları
      const refs = (list) => (list || []).filter(r => (r.links || []).some(l => l.pw === pw.id && +l.idx === x.sIdx));
      const relRows = (list, kind) => list.map(r => U.row({
        title: esc(r.name), subtitle: esc(kind === 'disease' ? (r.enzyme ? 'Eksik: ' + r.enzyme : (r.aka || '')) : (r.target ? 'Hedef: ' + r.target : (r.aka || ''))),
        leading: U.tile(kind === 'disease' ? 'cross.case' : 'flask', kind === 'disease' ? 'var(--clinical)' : 'var(--inhibitor)'),
        chevron: true, action: kind === 'disease' ? 'open-dis' : 'open-tox', attrs: `data-id="${esc(r.id)}"`, cls: 'is-top'
      }));
      const relAll = App.routes.disease ? refs(D.diseases) : [], relTox = App.routes.toxin ? refs(D.toxins) : [];
      // Klinik nottaki hastalıklar karta, nota geçmeyen ama ilgili olanlar ayrı listeye
      const skip = CLIN_EXCLUDE[pw.id + ':' + x.sIdx] || [];
      const relDis = relAll.filter(d => !skip.includes(d.id));
      const relOther = relAll.filter(d => skip.includes(d.id));
      clinDiseases = relDis;

      // Klinik korelasyon: kısa özet + eşleşen hastalıklar; dokununca hastalık sayfasına götürmeyi önerir
      let clin = '';
      if (st.clinicalNote) {
        const c = U.splitClinical(st.clinicalNote);
        const sum = (window.BIO_CLINICAL_SUMMARY || {})[pw.id + ':' + x.sIdx];
        const tappable = relDis.length > 0;
        const chips = relDis.map(d => `<span class="pw-clin-chip">${U.icon('cross.case')}${esc(d.name)}</span>`).join('');
        clin = U.section({
          header: `${U.icon('stethoscope')}<span>Klinik korelasyon</span>`, prominent: true, cls: 'pw-sec is-clin',
          body: `<div class="card pw-clin${tappable ? ' is-tappable' : ''}"${tappable ? ' role="button" tabindex="0" data-action="clin-go" aria-label="İlgili hastalık sayfasına git"' : ''}>` +
            `<div class="pw-clin-kicker">Patofizyoloji özeti</div>` +
            `<h3 class="t-headline pw-clin-title">${esc(sum ? sum.title : c.title)}</h3>` +
            (sum ? `<p class="reading">${esc(sum.text)}</p>` : '') +
            (chips ? `<div class="pw-clin-chips">${chips}</div>` : '') +
            `<div class="pw-clin-full" hidden>${paragraphs(c.body).map(p => `<p class="reading">${esc(p)}</p>`).join('')}</div>` +
            `<div class="pw-clin-foot">` +
              `<button type="button" class="pw-clin-more" data-action="clin-more" aria-expanded="false">${sum ? 'Tamamını oku' : 'Metni göster'}</button>` +
              (tappable ? `<span class="pw-clin-go">${relDis.length > 1 ? relDis.length + ' hastalık' : 'Hastalık sayfası'}${U.icon('chevron.right')}</span>` : '') +
            `</div></div>`
        });
      }

      const relSec = (relOther.length ? U.section({
        header: `${U.icon('cross.case')}<span>Diğer ilgili hastalıklar</span>`, prominent: true, cls: 'pw-sec is-clin',
        body: U.list(relRows(relOther, 'disease'), { icons: true, cls: 'pw-conn-list' })
      }) : '') + (relTox.length ? U.section({
        header: `${U.icon('flask')}<span>İlgili toksin ve ilaçlar</span>`, prominent: true, cls: 'pw-sec is-clin',
        body: U.list(relRows(relTox, 'toxin'), { icons: true, cls: 'pw-conn-list' })
      }) : '');

      return head + diagram + regSec('act', 'Aktivatörler', st.activators) + regSec('inh', 'İnhibitörler', st.inhibitors) + connSec + clin + relSec;
    }

    let clinDiseases = [];
    // Basamağa bağlı olup klinik notta geçmeyen hastalıklar (karta değil, ayrı listeye)
    const CLIN_EXCLUDE = {
      'glikoliz:3': ['esansiyel-fruktozuri'],
      'glikojen:2': ['hers-gsd-6', 'gsd-9-fosforilaz-kinaz'],
      'tca:3': ['klasik-msud', 'x-bagli-sideroblastik-anemi'],
      'tca:6': ['etanol-hipoglisemisi'],
      'beta_oks:2': ['vlcad-eksikligi', 'lchad-eksikligi'],
      'ure_aa:0': ['fenilketonuri', 'klasik-msud']
    };
    function gotoDisease(id) {
      try { sessionStorage.setItem('exam.pane', 'diseases'); } catch (e) { /* yok */ }
      App.open('disease', { id }, { tab: 'enzymes' });
    }
    function askDisease() {
      const list = clinDiseases;
      if (!list.length) return;
      if (list.length === 1) {
        const d = list[0];
        App.alert({
          title: d.name,
          message: 'Bu klinik korelasyon Hastalıklar bölümündeki bir kayıtla eşleşiyor. Hastalık sayfasına gidilsin mi?',
          actions: [{ label: 'Vazgeç', style: 'cancel' }, { label: 'Git', style: 'default', onSelect: () => gotoDisease(d.id) }]
        });
      } else {
        App.actionSheet({
          title: 'İlgili hastalıklar',
          message: 'Bu klinik korelasyon birden fazla hastalıkla eşleşiyor. Hangisine gidilsin?',
          actions: list.map(d => ({ label: d.name, sub: d.enzyme ? 'Eksik: ' + d.enzyme : (d.aka || ''), icon: U.tile('cross.case', 'var(--clinical)'), onSelect: () => gotoDisease(d.id) }))
        });
      }
    }
    function draw(fresh) {
      if (!pageRef) return;
      pageRef.content.innerHTML = contentHTML();
      pageRef.setTitle(navTitle(ALL[cur].st.enzyme));
      syncToolbar();
    }

    function go(delta) {
      const n = cur + delta;
      if (busy || n < 0 || n >= totalSteps || !pageRef) return;
      const el = pageRef.content;
      const dir = delta > 0 ? 1 : -1;
      if (reduce() || !el.animate) { cur = n; draw(); pageRef.scroller.scrollTop = 0; return; }
      busy = true;
      const out = el.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-dir * 28}px)` }], { duration: 130, easing: 'ease-in', fill: 'forwards' });
      out.onfinish = () => {
        cur = n; draw(); pageRef.scroller.scrollTop = 0;
        out.cancel();
        const inn = el.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 280, easing: 'cubic-bezier(0.32,0.72,0,1)' });
        inn.onfinish = () => { busy = false; };
        inn.oncancel = () => { busy = false; };
      };
    }

    return {
      title: navTitle(ALL[cur].st.enzyme),
      largeTitle: false,
      toolbar: toolbarHTML(),
      render(el, page) {
        pageRef = page;
        el.innerHTML = contentHTML();
        syncToolbar();
        if (!el._pwBound) {
          el._pwBound = true;
          el.addEventListener('click', (e) => {
            const b = e.target.closest('[data-action]');
            if (!b) return;
            const a = b.dataset.action;
            if (a === 'open-pw') App.open('pathway', { id: b.dataset.id });
            else if (a === 'open-hub') App.open('hub', { id: b.dataset.id });
            else if (a === 'open-dis') App.open('disease', { id: b.dataset.id });
            else if (a === 'open-tox') App.open('toxin', { id: b.dataset.id });
            else if (a === 'clin-more') {
              e.stopPropagation();
              const full = b.closest('.pw-clin').querySelector('.pw-clin-full');
              const open = full.hidden;
              full.hidden = !open;
              b.setAttribute('aria-expanded', String(open));
              b.textContent = open ? 'Daralt' : (window.BIO_CLINICAL_SUMMARY && window.BIO_CLINICAL_SUMMARY[ALL[cur].pw.id + ':' + ALL[cur].sIdx] ? 'Tamamını oku' : 'Metni göster');
            }
            else if (a === 'clin-go') askDisease();
          });
          page.toolbar.addEventListener('click', (e) => {
            const b = e.target.closest('[data-tb]'); if (!b || b.disabled) return;
            go(b.dataset.tb === 'next' ? 1 : -1);
          });
          // Yatay kaydırma ile önceki / sonraki
          let sx = 0, sy = 0, ok = false;
          page.scroller.addEventListener('touchstart', (e) => {
            const t = e.touches[0];
            ok = e.touches.length === 1 && t.clientX > 30;
            sx = t.clientX; sy = t.clientY;
          }, { passive: true });
          page.scroller.addEventListener('touchend', (e) => {
            if (!ok) return; ok = false;
            const t = e.changedTouches[0];
            const dx = t.clientX - sx, dy = t.clientY - sy;
            if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.8) go(dx < 0 ? 1 : -1);
          }, { passive: true });
          page.scroller.addEventListener('touchcancel', () => { ok = false; }, { passive: true });
        }
        if (!unsub) unsub = App.onState(() => { if (!busy) draw(); });
      },
      onDestroy() { unsub && unsub(); unsub = null; pageRef = null; }
    };
  });

  /* ===============================================================
     4) legend
     =============================================================== */
  App.defineRoute('legend', () => ({
    title: 'Simgeler ve renkler',
    subtitle: 'Şemayı okuma anahtarı',
    render(el) {
      const glyph = (html) => `<span class="pw-glyph">${html}</span>`;
      const tint = (c) => `style="--pw-c:${c}"`;

      const regs = U.list([
        U.row({ title: 'Aktivatör', subtitle: 'Enzimi hızlandırır: allosterik etki, hormon ya da substrat artışı. Ok enzime doğru gider.', leading: glyph(arrowSVG('act')), cls: 'is-tall' }),
        U.row({ title: 'İnhibitör', subtitle: 'Enzimi yavaşlatır ya da durdurur. Düz uçlu çubuk (⊣) enzimi engeller.', leading: glyph(arrowSVG('inh')), cls: 'is-tall' })
      ], { cls: 'pw-legend-list' });

      const marks = U.list([
        U.row({ title: 'Hız kısıtlayıcı basamak', subtitle: 'Yolağın hızını belirleyen, çoğunlukla tersinmez basamak.', leading: U.tile('bolt.fill', 'var(--rate)', 'lg'), cls: 'is-tall' }),
        U.row({ title: 'Kavşak', subtitle: 'Başka yolaklarla kesişen ara ürün. Dokununca bağlantılı yolağa ya da kavşağa gider.', leading: U.tile('link', 'var(--junction)', 'lg'), cls: 'is-tall' }),
        U.row({ title: 'Klinik korelasyon', subtitle: 'Enzim eksikliği ve hastalık bağlantıları.', leading: U.tile('stethoscope', 'var(--clinical)', 'lg'), cls: 'is-tall' })
      ], { icons: true, cls: 'pw-list-lg' });

      const states = U.list([
        U.row({ title: 'Tokluk', subtitle: 'İnsülin baskındır. Toklukta aktif basamaklar yeşil rozetle işaretlenir.', leading: U.tile('leaf', 'var(--green)', 'lg'), accessory: U.badge('Toklukta aktif', 'is-fed', 'leaf'), cls: 'is-tall' }),
        U.row({ title: 'Açlık', subtitle: 'Glukagon ve epinefrin baskındır. Açlıkta aktif basamaklar indigo rozetle işaretlenir.', leading: U.tile('moon', 'var(--indigo)', 'lg'), accessory: U.badge('Açlıkta aktif', 'is-fast', 'moon'), cls: 'is-tall' }),
        U.row({ title: 'Baskılanan basamak', subtitle: 'Seçili durumda frenlenen basamaklar soluk görünür.', leading: U.tile('minus', 'var(--gray)', 'lg'), accessory: U.badge('Baskılanır', 'is-muted'), cls: 'is-tall' })
      ], { icons: true, cls: 'pw-list-lg' });

      const sample =
        `<div class="card pw-rx-card">${reactionDiagram({ sub: 'Substrat', prod: 'Ürün', enz: 'Enzim', nAct: 2, nInh: 2, rate: true, color: 'var(--blue)' })}</div>`;

      const pathRows = PW.map(pw => U.row({
        title: esc(listTitle(pw)), subtitle: esc(shortOf(pw.id)) === esc(listTitle(pw)) ? `${pw.steps.length} basamak` : `${esc(shortOf(pw.id))} • ${pw.steps.length} basamak`,
        leading: U.pathwayTile(pw.id, 'lg'), chevron: true, action: 'open-pw', attrs: `data-id="${pw.id}"`, cls: 'is-tall'
      }));

      const comps = [
        ['var(--blue)', 'Sitozol', 'Glikoliz, pentoz fosfat, glikojen, yağ asidi sentezi'],
        ['var(--orange)', 'Mitokondri matriksi', 'PDH, TCA döngüsü, β-oksidasyon, ketogenez'],
        ['var(--purple)', 'İç mitokondri membranı', 'Elektron taşıma zinciri ve oksidatif fosforilasyon'],
        ['var(--cyan)', 'Üre döngüsü', 'Azot atımı; mitokondri ve sitozol arasında işler']
      ];
      const compRows = comps.map(c => U.row({
        title: esc(c[1]), subtitle: esc(c[2]),
        leading: `<span class="pw-swatch" style="--pw-c:${c[0]}"></span>`, cls: 'is-tall'
      }));

      el.innerHTML =
        U.section({ header: 'Düzenleyiciler', body: regs }) +
        U.section({ header: 'İşaretler', body: marks }) +
        U.section({ header: 'Fizyolojik durum', body: states }) +
        U.section({ header: 'Bir basamağı okumak', body: sample, footer: 'Substrat yukarıdan girer, enzimde dönüşür ve ürün olarak aşağıdan çıkar. Soldaki yeşil ok aktivatör, sağdaki kırmızı çubuk inhibitör sayısını gösterir. Turuncu halka hız kısıtlayıcı enzimi belirtir.' }) +
        U.section({ header: 'Yolak renkleri', body: U.list(pathRows, { icons: true, cls: 'pw-list-lg' }) }) +
        U.section({ header: 'Hücre bölmeleri (harita)', body: U.list(compRows, { icons: true, cls: 'pw-list-lg' }) });

      if (!el._pwBound) {
        el._pwBound = true;
        el.addEventListener('click', (e) => {
          const b = e.target.closest('[data-action="open-pw"]');
          if (b) App.open('pathway', { id: b.dataset.id });
        });
      }
    }
  }));
})();
