/* =====================================================================
   METABOLİZMA — Çekirdek
   İkonlar, UI yardımcıları, durum, sekmeler, gezinti yığını (push/pop,
   kenardan kaydırarak geri), büyük başlık, sheet, toast, rotalar.
   Görünümler (views/*.js) yalnızca bu API'yi kullanır.
   ===================================================================== */
(function () {
  'use strict';

  const D = window.BIO_DATA;

  /* ------------------------------------------------------------------
     İKONLAR — SF Symbols benzeri, 24x24, currentColor
     ------------------------------------------------------------------ */
  const S = 'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
  const F = 'fill="currentColor"';
  const ICONS = {
    'chevron.right': `<path ${S} stroke-width="2.4" d="M9 5l7 7-7 7"/>`,
    'chevron.left': `<path ${S} stroke-width="2.4" d="M15 4.5L7.5 12l7.5 7.5"/>`,
    'chevron.down': `<path ${S} stroke-width="2.2" d="M5 9l7 7 7-7"/>`,
    'xmark': `<path ${S} stroke-width="2.3" d="M6 6l12 12M18 6L6 18"/>`,
    'xmark.circle.fill': `<path ${F} fill-rule="evenodd" d="M12 2a10 10 0 110 20 10 10 0 010-20zm-3.3 5.3a1 1 0 00-1.4 1.4L10.6 12l-3.3 3.3a1 1 0 101.4 1.4l3.3-3.3 3.3 3.3a1 1 0 001.4-1.4L13.4 12l3.3-3.3a1 1 0 00-1.4-1.4L12 10.6z"/>`,
    'plus': `<path ${S} stroke-width="2.2" d="M12 5v14M5 12h14"/>`,
    'minus': `<path ${S} stroke-width="2.2" d="M5 12h14"/>`,
    'magnifyingglass': `<circle ${S} stroke-width="2.1" cx="10.5" cy="10.5" r="6.5"/><path ${S} stroke-width="2.3" d="M15.5 15.5L20 20"/>`,
    'bolt.fill': `<path ${F} d="M13.4 1.8c.4-.5 1.2-.1 1.1.5L13.6 10h5.2c.6 0 .9.7.5 1.1L10.6 22.2c-.4.5-1.2.1-1.1-.5l.9-7.7H5.2c-.6 0-.9-.7-.5-1.1z"/>`,
    'link': `<path ${S} d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.3 1.3"/><path ${S} d="M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.3-1.3"/>`,
    'stethoscope': `<path ${S} d="M5 3v5a5 5 0 0010 0V3"/><path ${S} d="M10 13v2.5a5 5 0 0010 0V13"/><circle ${S} cx="20" cy="11" r="2"/><path ${S} d="M4 3h2M14 3h2"/>`,
    'cross.case': `<rect ${S} x="3" y="7" width="18" height="13" rx="3"/><path ${S} d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M12 10.5v6M9 13.5h6"/>`,
    'arrow.right': `<path ${S} stroke-width="2.1" d="M4 12h15M13 6l6 6-6 6"/>`,
    'arrow.down': `<path ${S} stroke-width="2.1" d="M12 4v15M6 13l6 6 6-6"/>`,
    'arrow.up.right': `<path ${S} stroke-width="2.1" d="M7 17L17 7M9 7h8v8"/>`,
    'arrow.down.right': `<path ${S} stroke-width="2.1" d="M7 7l10 10M17 9v8H9"/>`,
    'arrow.2.circlepath': `<path ${S} d="M20 11a8 8 0 00-14.3-4.9L4 8"/><path ${S} d="M4 3.5V8h4.5"/><path ${S} d="M4 13a8 8 0 0014.3 4.9L20 16"/><path ${S} d="M20 20.5V16h-4.5"/>`,
    'arrow.triangle.branch': `<circle ${S} cx="6" cy="5" r="2.2"/><circle ${S} cx="18" cy="5" r="2.2"/><circle ${S} cx="12" cy="19" r="2.2"/><path ${S} d="M6 7.2v1.3a4 4 0 004 4h4a4 4 0 004-4V7.2M12 12.5v4.3"/>`,
    'point.3.connected': `<circle ${S} cx="12" cy="4.8" r="2.3"/><circle ${S} cx="4.8" cy="18" r="2.3"/><circle ${S} cx="19.2" cy="18" r="2.3"/><path ${S} d="M10.9 6.9L5.9 15.9M13.1 6.9l5 9M7.1 18h9.8"/>`,
    'map': `<path ${S} d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path ${S} d="M9 4v14M15 6v14"/>`,
    'square.grid': `<rect ${S} x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect ${S} x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect ${S} x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect ${S} x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>`,
    'list.bullet': `<path ${S} d="M9 6h11M9 12h11M9 18h11"/><circle ${F} cx="4.5" cy="6" r="1.4"/><circle ${F} cx="4.5" cy="12" r="1.4"/><circle ${F} cx="4.5" cy="18" r="1.4"/>`,
    'info.circle': `<circle ${S} cx="12" cy="12" r="9"/><path ${S} stroke-width="2.1" d="M12 11v5.5"/><circle ${F} cx="12" cy="7.7" r="1.25"/>`,
    'textformat.size': `<path ${S} d="M3 18l4.5-11L12 18M4.6 14.3h5.8"/><path ${S} d="M13 18l3.5-8.5L20 18M14.3 15.2h4.4"/>`,
    'eye': `<path ${S} d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle ${S} cx="12" cy="12" r="3"/>`,
    'eye.slash': `<path ${S} d="M2.5 12S6 5.5 12 5.5c1.8 0 3.3.5 4.6 1.3M21.5 12s-3.5 6.5-9.5 6.5c-1.8 0-3.3-.5-4.6-1.3"/><path ${S} d="M4 20L20 4"/>`,
    'arrow.up.left.and.arrow.down.right': `<path ${S} d="M4 10V4h6M4 4l6.5 6.5M20 14v6h-6M20 20l-6.5-6.5"/>`,
    'sun': `<circle ${S} cx="12" cy="12" r="4"/><path ${S} d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7L5.3 5.3"/>`,
    'moon': `<path ${S} d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>`,
    'circle.lefthalf': `<circle ${S} cx="12" cy="12" r="8.5"/><path ${F} d="M12 3.5a8.5 8.5 0 000 17z"/>`,
    'leaf': `<path ${S} d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15"/><path ${S} d="M5 19l8-8"/>`,
    'flame': `<path ${S} d="M12 21.5c-4 0-7-2.8-7-6.6 0-3.4 2.4-5.4 3.7-8.1.3 1.9 1.2 3 2.3 3.6C11 7 12.6 4.6 15 2.5c.2 3.3 4 6 4 11.4 0 4.2-3 7.6-7 7.6z"/>`,
    'drop': `<path ${S} d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 01-13 0C5.5 10 12 3 12 3z"/>`,
    'shield': `<path ${S} d="M12 3l7.5 3v5.5c0 4.8-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.7-7.5-9.5V6z"/><path ${S} d="M9 12l2.2 2.2L15.5 10"/>`,
    'square.stack': `<path ${S} d="M12 3l9 4.5-9 4.5-9-4.5z"/><path ${S} d="M3 12l9 4.5 9-4.5"/><path ${S} d="M3 16.5L12 21l9-4.5"/>`,
    'hexagon': `<path ${S} d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><circle ${S} cx="12" cy="12" r="3"/>`,
    'atom': `<circle ${F} cx="12" cy="12" r="1.8"/><ellipse ${S} cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse ${S} cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse ${S} cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>`,
    'arrow.right.to.line': `<path ${S} d="M3 12h12M10 6.5l5.5 5.5-5.5 5.5M20 5v14"/>`,
    'battery': `<rect ${S} x="2.5" y="7" width="17" height="10" rx="2.5"/><path ${S} stroke-width="2.4" d="M22 10.5v3"/><path ${S} d="M11.5 8.8L9 12.2h3.5L10 15.5"/>`,
    'n.circle': `<circle ${S} cx="12" cy="12" r="9"/><path ${S} stroke-width="2.1" d="M9 16.5v-9l6 9v-9"/>`,
    'mappin': `<path ${S} d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0C18.5 15 12 21 12 21z"/><circle ${S} cx="12" cy="10" r="2.3"/>`,
    'book': `<path ${S} d="M12 6.5C10 5 7.5 4.5 3.5 4.5v14c4 0 6.5.5 8.5 2 2-1.5 4.5-2 8.5-2v-14c-4 0-6.5.5-8.5 2z"/><path ${S} d="M12 6.5v14"/>`,
    'checkmark': `<path ${S} stroke-width="2.4" d="M5 12.5l4.5 4.5L19 7.5"/>`,
    'sparkles': `<path ${S} d="M10 3.5l1.7 4.8 4.8 1.7-4.8 1.7L10 16.5l-1.7-4.8L3.5 10l4.8-1.7z"/><path ${S} d="M18 14l.8 2.2 2.2.8-2.2.8L18 20l-.8-2.2-2.2-.8 2.2-.8z"/>`,
    'flask': `<path ${S} d="M9 3h6M10 3v6L4.6 18.2A1.8 1.8 0 006.2 21h11.6a1.8 1.8 0 001.6-2.8L14 9V3"/><path ${S} d="M7 15h10"/>`,
    'function': `<path ${S} d="M14.5 4.5c-2 0-3 1-3.4 3L9.5 17c-.4 2-1.4 3-3.4 3M7.5 10h7"/><path ${S} d="M14 13l5 6M19 13l-5 6"/>`,
    'questionmark.circle': `<circle ${S} cx="12" cy="12" r="9"/><path ${S} stroke-width="2.1" d="M9.4 9.3a2.7 2.7 0 015.2 1c0 1.8-2.6 2.3-2.6 4"/><circle ${F} cx="12" cy="17.3" r="1.2"/>`,
    'clock': `<circle ${S} cx="12" cy="12" r="9"/><path ${S} d="M12 7v5l3.5 2"/>`
  };
  function icon(name, cls) {
    const body = ICONS[name] || ICONS['questionmark.circle'];
    return `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ''}>${body}</svg>`;
  }

  /* ------------------------------------------------------------------
     YOLAK GÖRSEL KİMLİĞİ (renk + ikon)
     ------------------------------------------------------------------ */
  const PATHWAY_STYLE = {
    glikoliz:         { color: 'var(--blue)',   icon: 'arrow.down.right',     short: 'Glikoliz' },
    glukoneogenez:    { color: 'var(--green)',  icon: 'arrow.up.right',       short: 'Glukoneogenez' },
    glikojen:         { color: 'var(--indigo)', icon: 'square.stack',         short: 'Glikojen' },
    hmp:              { color: 'var(--teal)',   icon: 'shield',               short: 'Pentoz Fosfat' },
    pdh:              { color: 'var(--yellow)', icon: 'arrow.right.to.line',  short: 'PDH Köprüsü' },
    tca:              { color: 'var(--orange)', icon: 'arrow.2.circlepath',   short: 'TCA Döngüsü' },
    etz:              { color: 'var(--purple)', icon: 'battery',              short: 'ETZ & OksFos' },
    lipogenez:        { color: 'var(--mint)',   icon: 'drop',                 short: 'Lipogenez' },
    beta_oks:         { color: 'var(--pink)',   icon: 'flame',                short: 'β-Oksidasyon' },
    keton_kolesterol: { color: 'var(--brown)',  icon: 'hexagon',              short: 'Keton & Kolesterol' },
    ure_aa:           { color: 'var(--cyan)',   icon: 'n.circle',             short: 'Üre Döngüsü' }
  };
  function pathwayStyle(id) { return PATHWAY_STYLE[id] || { color: 'var(--gray)', icon: 'flask', short: id }; }

  /* ------------------------------------------------------------------
     METİN YARDIMCILARI
     ------------------------------------------------------------------ */
  function esc(str) {
    if (str == null) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // Türkçe duyarlı, aksan-duyarsız tek karakter normalizasyonu (uzunluk korunur)
  const NORM_CACHE = new Map();
  function normChar(c) {
    let r = NORM_CACHE.get(c);
    if (r !== undefined) return r;
    r = c.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (r === 'ı') r = 'i';
    r = r.charAt(0) || c;
    NORM_CACHE.set(c, r);
    return r;
  }
  function norm(s) {
    s = String(s == null ? '' : s);
    let out = '';
    for (let i = 0; i < s.length; i++) out += normChar(s[i]);
    return out;
  }
  // Kaçışlı + arama vurgulu metin
  function hl(text, query) {
    const raw = String(text == null ? '' : text);
    const q = norm((query || '').trim());
    if (!q) return esc(raw);
    const n = norm(raw);
    let out = '', i = 0, idx;
    while ((idx = n.indexOf(q, i)) !== -1) {
      out += esc(raw.slice(i, idx)) + '<mark class="hl">' + esc(raw.slice(idx, idx + q.length)) + '</mark>';
      i = idx + q.length;
    }
    return out + esc(raw.slice(i));
  }
  // "Allosterik: metin" → { label: 'Allosterik', body: 'metin' }
  function splitLabel(text) {
    const s = String(text || '');
    const i = s.indexOf(':');
    const pre = i > 0 ? s.slice(0, i) : '';
    if (i > 0 && i <= 48 && pre.split('(').length === pre.split(')').length) {
      return { label: s.slice(0, i).trim(), body: s.slice(i + 1).trim() };
    }
    return { label: '', body: s };
  }
  // "PATOFİZYOLOJİ — Başlık: gövde" → { title, body }
  function splitClinical(text) {
    let s = String(text || '').replace(/^PATOF[İI]ZYOLOJ[İI]\s*[—–-]\s*/i, '');
    const i = s.indexOf(':');
    if (i > 0 && i < 160) return { title: s.slice(0, i).trim(), body: s.slice(i + 1).trim() };
    return { title: '', body: s };
  }
  // Metin içindeki [+] / [-] / (+) / (−) işaretlerini renkli işaret dairesine çevirir (kaçış uygular)
  function richReg(text, query) {
    let h = hl(text, query);
    h = h.replace(/\[\+\]|\(\+\)/g, '<span class="sign is-act is-sm" aria-label="aktivatör">+</span>');
    h = h.replace(/\[[-−]\]|\([-−]\)/g, '<span class="sign is-inh is-sm" aria-label="inhibitör">−</span>');
    return h;
  }
  // "Basamak 3 (⚡ HIZ KISITLAYICI BASAMAK • Tersinmez)" → { name: 'Basamak 3', note: 'Tersinmez' }
  function parseStepNo(stepNo) {
    const s = String(stepNo || '');
    const m = s.match(/^([^(]+)\((.*)\)\s*$/);
    if (!m) return { name: s.trim(), note: '' };
    const note = m[2].split('•').map(x => x.replace(/⚡?\s*HIZ KISITLAYICI( BASAMAK)?/i, '').trim()).filter(Boolean).join(' • ');
    return { name: m[1].trim(), note };
  }
  // BÜYÜK HARFLİ başlığı okunur başlık biçimine çevirir (parantez içi korunur)
  function titleCase(s) {
    s = String(s || '');
    const lower = (w) => w.toLocaleLowerCase('tr-TR');
    const keep = /^(TCA|HMP|PDH|ETZ|TAG|ER|ATP|ADP|NADH|NADPH|FADH₂|KoA|CoA|GLUT|PFK|DNA|RNA|AA|II|III|IV|V|β|α)$/;
    return s.replace(/[A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû₂-]+/g, (w, off) => {
      if (keep.test(w) || /[a-zçğıöşü]/.test(w)) return w;
      if (/^(VE|İLE|VEYA)$/.test(w) && off > 0) return lower(w);
      const l = lower(w);
      return l.charAt(0).toLocaleUpperCase('tr-TR') + l.slice(1);
    });
  }

  /* ------------------------------------------------------------------
     VERİ YARDIMCILARI
     ------------------------------------------------------------------ */
  const ALL_STEPS = [];
  D.PATHWAYS.forEach((pw, pIdx) => pw.steps.forEach((st, sIdx) => ALL_STEPS.push({ pw, st, pIdx, sIdx, flat: ALL_STEPS.length })));
  const Data = {
    pathways: D.PATHWAYS,
    hubs: D.METABOLIC_HUBS,
    mapNodes: D.MAP_NODES,
    mapEdges: D.MAP_EDGES,
    allSteps: ALL_STEPS,
    diseases: window.BIO_DISEASES || [],
    toxins: window.BIO_TOXINS || [],
    disease: (id) => (window.BIO_DISEASES || []).find(d => d.id === id),
    toxin: (id) => (window.BIO_TOXINS || []).find(t => t.id === id),
    pathway: (id) => D.PATHWAYS.find(p => p.id === id),
    hub: (id) => D.METABOLIC_HUBS.find(h => h.id === id),
    step: (pwId, idx) => { const pw = D.PATHWAYS.find(p => p.id === pwId); return pw ? pw.steps[idx] : null; },
    flatIndex: (pwId, idx) => ALL_STEPS.findIndex(x => x.pw.id === pwId && x.sIdx === idx),
    stepsAtJunction: (jid) => ALL_STEPS.filter(x => x.st.junctionId === jid),
    pathwayTitle: (pw) => titleCase(pw.title),
    // durum: 'all' | 'fed' | 'fasting' → { kind: 'active'|'suppressed'|null, label }
    stateInfo(step, state) {
      state = state || App.state.metabolicState;
      if (state === 'fed') {
        if (step.statePreference === 'fed') return { kind: 'active', cls: 'is-fed', label: 'Toklukta aktif' };
        if (step.statePreference === 'fasting') return { kind: 'suppressed', cls: 'is-muted', label: 'Toklukta baskılanır' };
      } else if (state === 'fasting') {
        if (step.statePreference === 'fasting') return { kind: 'active', cls: 'is-fast', label: 'Açlıkta aktif' };
        if (step.statePreference === 'fed') return { kind: 'suppressed', cls: 'is-muted', label: 'Açlıkta frenlenir' };
      }
      return { kind: null, cls: '', label: '' };
    }
  };

  /* ------------------------------------------------------------------
     UI PARÇALARI (HTML dizgisi döndürür)
     ------------------------------------------------------------------ */
  const UI = {
    icon, esc, hl, norm, splitLabel, splitClinical, richReg, parseStepNo, titleCase, pathwayStyle,
    chevron: () => `<svg class="row-chevron" viewBox="0 0 9 15" aria-hidden="true"><path d="M1.5 1.5L7.5 7.5L1.5 13.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    tile(iconName, color, size) {
      return `<span class="icon-tile${size ? ' is-' + size : ''}" style="--tile:${color}">${icon(iconName)}</span>`;
    },
    pathwayTile(pwId, size) { const s = pathwayStyle(pwId); return UI.tile(s.icon, s.color, size); },
    badge(text, cls, iconName) {
      return `<span class="badge ${cls || ''}">${iconName ? icon(iconName) : ''}${esc(text)}</span>`;
    },
    rateBadge: () => `<span class="badge is-rate">${icon('bolt.fill')}Hız kısıtlayıcı</span>`,
    sign: (kind, size) => `<span class="sign ${kind === 'inh' ? 'is-inh' : 'is-act'}${size ? ' is-' + size : ''}" aria-hidden="true">${kind === 'inh' ? '−' : '+'}</span>`,
    section({ header, footer, body, prominent, id, cls }) {
      return `<section class="section${cls ? ' ' + cls : ''}"${id ? ` id="${id}"` : ''}>` +
        (header ? `<h2 class="section-header${prominent ? ' is-prominent' : ''}">${header}</h2>` : '') +
        body +
        (footer ? `<p class="section-footer">${footer}</p>` : '') + `</section>`;
    },
    // rows: dizi HTML; opts.icons → ikon girintili ayırıcı
    list(rows, opts) {
      opts = opts || {};
      return `<div class="list${opts.icons ? ' has-icons' : ''}${opts.cls ? ' ' + opts.cls : ''}">${rows.join('')}</div>`;
    },
    // Tek satır. action → data-action (App.delegate ile yakalanır)
    row({ title, subtitle, value, leading, accessory, chevron, action, attrs, cls, clamp, titleCls }) {
      const tag = action ? 'button' : 'div';
      return `<${tag} class="row${cls ? ' ' + cls : ''}"${action ? ` type="button" data-action="${esc(action)}"` : ''}${attrs ? ' ' + attrs : ''}>` +
        (leading || '') +
        `<span class="row-body"><span class="row-title${titleCls ? ' ' + titleCls : ''}" style="display:block">${title || ''}</span>` +
        (subtitle ? `<span class="row-subtitle${clamp ? ' is-clamp' : ''}" style="display:block">${subtitle}</span>` : '') + `</span>` +
        (value ? `<span class="row-value">${value}</span>` : '') +
        (accessory ? `<span class="row-accessory">${accessory}</span>` : '') +
        (chevron ? UI.chevron() : '') +
        `</${tag}>`;
    },
    // Segmentli kontrol: options [{value,label,icon}]; değişimde onChange(value)
    segmented(id, options, value, cls) {
      return `<div class="segmented${cls ? ' ' + cls : ''}" role="radiogroup" data-segmented="${esc(id)}">` +
        `<span class="segmented-thumb"></span>` +
        options.map(o => `<button type="button" role="radio" aria-checked="${o.value === value}" data-value="${esc(o.value)}">${o.icon ? icon(o.icon) : ''}<span>${esc(o.label)}</span></button>`).join('') +
        `</div>`;
    },
    searchField(id, placeholder, value, lg) {
      return `<label class="search-field${lg ? ' is-lg' : ''}">${icon('magnifyingglass')}` +
        `<input id="${esc(id)}" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${esc(placeholder)}" value="${esc(value || '')}">` +
        `<button type="button" class="search-clear${value ? '' : ' hidden'}" aria-label="Temizle">${icon('xmark.circle.fill')}</button></label>`;
    },
    empty(iconName, title, text) {
      return `<div class="empty">${icon(iconName)}<div class="empty-title">${esc(title)}</div><div class="t-subhead">${esc(text || '')}</div></div>`;
    }
  };

  /* Segmentli kontrol + arama alanı davranışı (kök element içinde bağlar) */
  function bindSegmented(root, id, onChange) {
    const seg = root.querySelector(`[data-segmented="${id}"]`);
    if (!seg) return;
    const thumb = seg.querySelector('.segmented-thumb');
    const btns = [...seg.querySelectorAll('button')];
    const place = () => {
      const i = Math.max(0, btns.findIndex(b => b.getAttribute('aria-checked') === 'true'));
      const w = (seg.clientWidth - 4) / btns.length;
      thumb.style.width = w + 'px';
      thumb.style.transform = `translateX(${i * w}px)`;
    };
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-checked', String(x === b)));
      place();
      onChange && onChange(b.dataset.value);
    }));
    requestAnimationFrame(place);
    new ResizeObserver(place).observe(seg);
  }
  function bindSearch(root, id, onInput) {
    const input = root.querySelector('#' + id);
    if (!input) return;
    const clear = input.parentElement.querySelector('.search-clear');
    let t;
    input.addEventListener('input', () => {
      clear.classList.toggle('hidden', !input.value);
      clearTimeout(t); t = setTimeout(() => onInput(input.value), 90);
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
    clear.addEventListener('click', (e) => { e.preventDefault(); input.value = ''; clear.classList.add('hidden'); onInput(''); input.focus(); });
    return input;
  }
  UI.bindSegmented = bindSegmented;
  UI.bindSearch = bindSearch;

  /* ------------------------------------------------------------------
     DURUM (kalıcı)
     ------------------------------------------------------------------ */
  const STORE_KEY = 'metabolizma.v2';
  const defaults = { metabolicState: 'all', theme: 'system', textScale: 1, mapRegulators: true, recentSearches: [] };
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; } catch (e) { saved = {}; }
  const listeners = new Set();

  /* ------------------------------------------------------------------
     UYGULAMA
     ------------------------------------------------------------------ */
  const App = {
    data: Data,
    ui: UI,
    state: Object.assign({}, defaults, saved),
    tabs: [],            // [{ id, title, icon, root, scene, stack: [] }]
    current: null,       // aktif sekme
    routes: {},

    setState(patch) {
      Object.assign(App.state, patch);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(App.state)); } catch (e) { /* gizli mod */ }
      applyAppearance();
      listeners.forEach(fn => { try { fn(patch, App.state); } catch (e) { console.error(e); } });
    },
    onState(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    /* Rota: App.defineRoute('step', ({pw, idx}) => PageSpec) */
    defineRoute(name, factory) { App.routes[name] = factory; },
    /* Mevcut sekmeye rota push eder. opts.tab → önce o sekmeye geçer; opts.reset → sekme köküne döner */
    open(name, params, opts) {
      opts = opts || {};
      const factory = App.routes[name];
      if (!factory) { console.warn('Rota yok:', name); return; }
      if (opts.tab && (!App.current || App.current.id !== opts.tab)) App.switchTab(opts.tab, { silent: true });
      if (opts.reset) App.popToRoot(App.current, false);
      App.push(factory(params || {}), { animate: opts.animate !== false });
    },

    registerTab(def) { App.tabs.push(Object.assign({ stack: [] }, def)); },

    /* PageSpec:
       { title, largeTitle (bool, vars. true), subtitle, plain (bool: beyaz zemin),
         fullBleed (bool: kaydırma yok, navbar şeffaf), navClear (bool),
         trailing: [{ icon, label, onClick, id, tint }], backLabel,
         render(contentEl, page) — içeriği doldurur,
         onShow(page), onHide(page), onDestroy(page), toolbar (html) }
       page: { el, scroller, content, navbar, spec, setTitle(t), refresh() } */
    push(spec, opts) {
      opts = opts || {};
      const tab = App.current;
      const prev = tab.stack[tab.stack.length - 1];
      const page = buildPage(spec, tab);
      tab.scene.appendChild(page.el);
      tab.stack.push(page);
      renderPage(page);
      if (prev && opts.animate !== false) {
        page.el.classList.add('is-offright', 'has-shadow');
        page.el.getBoundingClientRect();
        page.el.classList.add('anim'); prev.el.classList.add('anim');
        page.el.classList.remove('is-offright'); page.el.classList.add('is-current');
        prev.el.classList.add('is-behind');
        afterTransition(page.el, () => {
          page.el.classList.remove('anim', 'has-shadow'); prev.el.classList.remove('anim');
          prev.el.style.visibility = 'hidden';
        });
      } else {
        page.el.classList.add('is-current');
        if (prev) { prev.el.classList.add('is-behind'); prev.el.style.visibility = 'hidden'; }
      }
      prev && prev.spec.onHide && prev.spec.onHide(prev);
      spec.onShow && spec.onShow(page);
      return page;
    },
    pop(opts) {
      opts = opts || {};
      const tab = App.current;
      if (tab.stack.length < 2) return;
      const page = tab.stack.pop();
      const prev = tab.stack[tab.stack.length - 1];
      prev.el.style.visibility = '';
      const done = () => { page.spec.onDestroy && page.spec.onDestroy(page); page.el.remove(); };
      if (opts.animate !== false) {
        page.el.classList.add('anim', 'has-shadow'); prev.el.classList.add('anim');
        page.el.getBoundingClientRect();
        page.el.style.transform = ''; prev.el.style.transform = ''; prev.el.style.filter = '';
        page.el.classList.remove('is-current'); page.el.classList.add('is-offright');
        prev.el.classList.remove('is-behind');
        afterTransition(page.el, () => { prev.el.classList.remove('anim'); done(); });
      } else {
        prev.el.classList.remove('is-behind'); prev.el.style.transform = ''; prev.el.style.filter = '';
        done();
      }
      prev.spec.onShow && prev.spec.onShow(prev);
    },
    popToRoot(tab, animate) {
      tab = tab || App.current;
      while (tab.stack.length > 2) {
        const p = tab.stack.splice(1, 1)[0];
        p.spec.onDestroy && p.spec.onDestroy(p); p.el.remove();
      }
      if (tab.stack.length === 2) {
        const saveCur = App.current; App.current = tab;
        App.pop({ animate });
        App.current = saveCur;
      }
    },
    switchTab(id, opts) {
      opts = opts || {};
      const tab = App.tabs.find(t => t.id === id);
      if (!tab) return;
      if (App.current === tab) {
        // Aktif sekmeye tekrar dokunma: köke dön, sonra en üste kaydır (iOS davranışı)
        if (!opts.silent) {
          if (tab.stack.length > 1) App.popToRoot(tab, true);
          else { const top = tab.stack[0]; top && top.scroller.scrollTo({ top: 0, behavior: 'smooth' }); }
        }
        return;
      }
      const prevTab = App.current;
      if (prevTab) {
        prevTab.scene.classList.remove('is-active');
        const top = prevTab.stack[prevTab.stack.length - 1];
        top && top.spec.onHide && top.spec.onHide(top);
      }
      App.current = tab;
      if (!tab.stack.length) {
        App.push(tab.root(), { animate: false });
      } else {
        const top = tab.stack[tab.stack.length - 1];
        top.spec.onShow && top.spec.onShow(top);
      }
      tab.scene.classList.add('is-active');
      tab.scene.classList.remove('rise-in'); void tab.scene.offsetWidth; tab.scene.classList.add('rise-in');
      document.querySelectorAll('.tab-item').forEach(b => {
        const on = b.dataset.tab === id;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      try { sessionStorage.setItem('metabolizma.tab', id); } catch (e) { /* yok */ }
    },
    topPage() { const t = App.current; return t && t.stack[t.stack.length - 1]; },

    /* SHEET: { title, render(bodyEl, sheet), detent: 'medium'|'large', passive (arkadaki sayfa etkileşimli kalır),
                onClose, headerLeading (html) } → { el, body, close(), setDetent(d) } */
    sheet(opts) { return openSheet(opts); },
    toast(msg) {
      let t = document.querySelector('.toast');
      if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
      t.textContent = msg;
      requestAnimationFrame(() => t.classList.add('is-on'));
      clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('is-on'), 1800);
    },

    /* UYARI: { title, message, actions: [{ label, style: 'cancel'|'default'|'destructive', onSelect }] } */
    alert(opts) { return openDialog('alert', opts); },
    /* EYLEM MENÜSÜ: { title, message, actions: [{ label, sub, icon (html), style, onSelect }] } — iptal otomatik eklenir */
    actionSheet(opts) { return openDialog('sheet', opts); },
    openSettings() { openSettingsSheet(); },
  };
  window.App = App;

  /* ------------------------------------------------------------------
     SAYFA OLUŞTURMA
     ------------------------------------------------------------------ */
  function buildPage(spec, tab) {
    const el = document.createElement('section');
    el.className = 'page' + (spec.plain ? ' is-plain' : '') + (spec.fullBleed ? ' is-fullbleed' : '') + (spec.toolbar ? ' has-toolbar' : '');
    el.setAttribute('aria-label', spec.title || '');
    const depth = tab.stack.length;
    const large = spec.largeTitle !== false && !spec.fullBleed;
    const prevTitle = depth > 0 ? (tab.stack[depth - 1].spec.backLabel || tab.stack[depth - 1].spec.title || 'Geri') : '';
    // Uzun başlıkta (iOS gibi) geri düğmesi yalnızca ok olur ve başlığa yer açar
    const backText = (spec.title || '').length > 16 ? '' : (prevTitle.length > 12 ? 'Geri' : prevTitle);
    el.innerHTML =
      `<header class="navbar${spec.navClear ? ' is-clear' : ''}${large ? '' : ' show-title'}${(!large && !spec.fullBleed) ? ' is-solid' : ''}">` +
        `<div class="nav-leading">${depth > 0 ? `<button type="button" class="glass-btn${backText ? '' : ' is-icon'}" data-nav="back" aria-label="Geri: ${esc(prevTitle)}">${icon('chevron.left')}${backText ? `<span style="font-size:17px;max-width:30vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(backText)}</span>` : ''}</button>` : ''}</div>` +
        `<div class="nav-title">${esc(spec.title || '')}</div>` +
        `<div class="nav-trailing">${(spec.trailing || []).map((b, i) => `<button type="button" class="glass-btn is-icon${b.tint ? ' is-tint' : ''}" data-trailing="${i}"${b.id ? ` id="${esc(b.id)}"` : ''} aria-label="${esc(b.label || '')}">${icon(b.icon)}</button>`).join('')}</div>` +
      `</header>` +
      `<div class="page-scroll">` +
        (large ? `<div class="large-title-wrap"><h1 class="t-large-title">${esc(spec.title || '')}</h1>${spec.subtitle ? `<p class="large-title-sub">${spec.subtitle}</p>` : ''}</div>` : '') +
        `<div class="page-content${spec.flush || spec.fullBleed ? ' is-flush' : ''}"></div>` +
      `</div>` +
      (spec.toolbar ? `<div class="float-toolbar">${spec.toolbar}</div>` : '');
    const page = {
      el, spec, tab,
      navbar: el.querySelector('.navbar'),
      scroller: el.querySelector('.page-scroll'),
      content: el.querySelector('.page-content'),
      toolbar: el.querySelector('.float-toolbar'),
      setTitle(t) {
        spec.title = t;
        el.querySelector('.nav-title').textContent = t;
        const lt = el.querySelector('.t-large-title'); if (lt) lt.textContent = t;
      },
      refresh() { renderPage(page); }
    };
    // Gezinti düğmeleri
    const back = el.querySelector('[data-nav="back"]');
    back && back.addEventListener('click', () => App.pop());
    el.querySelectorAll('[data-trailing]').forEach(b => b.addEventListener('click', (e) => {
      const def = spec.trailing[+b.dataset.trailing];
      def && def.onClick && def.onClick(e, page, b);
    }));
    // Büyük başlık daralması
    if (large) {
      const lt = el.querySelector('.large-title-wrap');
      let ticking = false;
      page.scroller.addEventListener('scroll', () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const y = page.scroller.scrollTop;
          const th = lt.offsetHeight - 6;
          page.navbar.classList.toggle('is-scrolled', y > th);
          // Aşağı çekince büyük başlık hafifçe büyür (iOS esnekliği)
          lt.style.transform = y < 0 ? `scale(${Math.min(1.08, 1 + (-y) / 900)})` : '';
          lt.style.transformOrigin = 'left center';
        });
      }, { passive: true });
    } else if (!spec.fullBleed) {
      page.scroller.addEventListener('scroll', () => {
        page.navbar.classList.toggle('is-scrolled', page.scroller.scrollTop > 2);
      }, { passive: true });
    }
    attachEdgeSwipe(page);
    return page;
  }
  function renderPage(page) {
    try { page.spec.render && page.spec.render(page.content, page); }
    catch (e) { console.error(e); page.content.innerHTML = UI.empty('questionmark.circle', 'Bir sorun oluştu', String(e && e.message || e)); }
  }
  function afterTransition(el, fn) {
    let called = false;
    const h = (e) => { if (e && e.target !== el) return; if (called) return; called = true; el.removeEventListener('transitionend', h); fn(); };
    el.addEventListener('transitionend', h);
    setTimeout(h, 520);
  }

  /* Kenardan kaydırarak geri (interaktif) */
  function attachEdgeSwipe(page) {
    const el = page.el;
    let sx = 0, sy = 0, dx = 0, active = false, decided = false, lastX = 0, lastT = 0, vx = 0;
    el.addEventListener('touchstart', (e) => {
      const tab = page.tab;
      if (tab.stack.length < 2 || tab.stack[tab.stack.length - 1] !== page) return;
      const t = e.touches[0];
      if (e.touches.length !== 1 || t.clientX > 28) return;
      sx = t.clientX; sy = t.clientY; dx = 0; active = true; decided = false; lastX = sx; lastT = e.timeStamp; vx = 0;
    }, { passive: true });
    el.addEventListener('touchmove', (e) => {
      if (!active) return;
      const t = e.touches[0];
      const mx = t.clientX - sx, my = t.clientY - sy;
      if (!decided) {
        if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;
        decided = true;
        if (Math.abs(my) > Math.abs(mx) || mx < 0) { active = false; return; }
        const prev = page.tab.stack[page.tab.stack.length - 2];
        prev.el.style.visibility = '';
        el.classList.add('has-shadow');
      }
      e.preventDefault();
      dx = Math.max(0, mx);
      const dt = e.timeStamp - lastT || 16; vx = (t.clientX - lastX) / dt; lastX = t.clientX; lastT = e.timeStamp;
      const w = el.clientWidth;
      const p = Math.min(1, dx / w);
      const prev = page.tab.stack[page.tab.stack.length - 2];
      el.style.transform = `translate3d(${dx}px,0,0)`;
      prev.el.style.transform = `translate3d(${-28 + 28 * p}%,0,0)`;
      prev.el.style.filter = `brightness(${0.92 + 0.08 * p})`;
    }, { passive: false });
    const end = () => {
      if (!active) return;
      active = false;
      if (!decided) return;
      const w = el.clientWidth;
      const prev = page.tab.stack[page.tab.stack.length - 2];
      if (dx > w * 0.35 || vx > 0.45) {
        App.pop({ animate: true });
      } else {
        el.classList.add('anim'); prev.el.classList.add('anim');
        el.style.transform = ''; prev.el.style.transform = ''; prev.el.style.filter = '';
        afterTransition(el, () => { el.classList.remove('anim', 'has-shadow'); prev.el.classList.remove('anim'); prev.el.style.visibility = 'hidden'; });
      }
    };
    el.addEventListener('touchend', end, { passive: true });
    el.addEventListener('touchcancel', end, { passive: true });
  }

  /* ------------------------------------------------------------------
     SHEET
     ------------------------------------------------------------------ */
  function openSheet(opts) {
    opts = opts || {};
    const scrim = document.createElement('div');
    scrim.className = 'sheet-scrim' + (opts.passive ? ' is-passive' : '');
    const el = document.createElement('div');
    el.className = 'sheet';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', opts.passive ? 'false' : 'true');
    el.setAttribute('aria-label', opts.title || '');
    el.innerHTML =
      `<div class="sheet-grabber" aria-hidden="true"></div>` +
      `<div class="sheet-header"><div>${opts.headerLeading || ''}</div><div class="sheet-title">${esc(opts.title || '')}</div>` +
      `<div class="sheet-close"><button type="button" class="glass-btn is-icon" aria-label="Kapat">${icon('xmark')}</button></div></div>` +
      `<div class="sheet-body"></div>`;
    document.body.appendChild(scrim); document.body.appendChild(el);
    const body = el.querySelector('.sheet-body');
    let detent = opts.detent || 'large';
    const H = () => el.offsetHeight;
    const offsetFor = (d) => d === 'medium' ? Math.max(0, H() - Math.round(window.innerHeight * 0.52)) : 0;
    const api = {
      el, body, closed: false,
      setDetent(d) { detent = d; syncBehind(); el.style.transform = `translate3d(0,${offsetFor(d)}px,0)`; body.style.paddingBottom = d === 'medium' ? `calc(${offsetFor(d)}px + var(--s6))` : ''; },
      setTitle(t) { el.querySelector('.sheet-title').textContent = t; },
      close() {
        if (api.closed) return; api.closed = true;
        el.style.transform = 'translate3d(0,100%,0)'; scrim.classList.remove('is-open');
        api.detentNow = null;
        setTimeout(() => { el.remove(); scrim.remove(); }, 480);
        opts.onClose && opts.onClose();
        const i = openSheets.indexOf(api); if (i >= 0) openSheets.splice(i, 1);
        syncBehind();
      }
    };
    function syncBehind() {
      api.detentNow = api.closed ? null : detent;
      const large = !opts.passive && openSheets.concat(api.closed ? [] : [api]).some(x => x.detentNow === 'large');
      document.documentElement.classList.toggle('has-sheet-large', large);
    }
    openSheets.push(api);
    try { opts.render && opts.render(body, api); } catch (e) { console.error(e); }
    el.getBoundingClientRect();
    requestAnimationFrame(() => { scrim.classList.add('is-open'); api.setDetent(detent); });
    el.querySelector('.sheet-close button').addEventListener('click', api.close);
    scrim.addEventListener('click', api.close);

    // Sürükleme: tutamak + başlıktan her zaman, gövdeden yalnızca en üstteyken
    let sy = 0, base = 0, dy = 0, dragging = false, fromBody = false, lastY = 0, lastT = 0, vy = 0;
    const start = (e, isBody) => {
      if (e.touches.length !== 1) return;
      fromBody = isBody;
      if (isBody && body.scrollTop > 0 && detent === 'large') return;
      sy = e.touches[0].clientY; base = offsetFor(detent); dy = 0; dragging = true; lastY = sy; lastT = e.timeStamp; vy = 0;
    };
    const move = (e) => {
      if (!dragging) return;
      const y = e.touches[0].clientY;
      dy = y - sy;
      if (fromBody && detent === 'large' && dy < 0) { dragging = false; return; }
      if (fromBody && detent === 'medium' && dy < 0 && body.scrollTop > 0) { dragging = false; return; }
      e.preventDefault();
      const dt = e.timeStamp - lastT || 16; vy = (y - lastY) / dt; lastY = y; lastT = e.timeStamp;
      let off = base + dy;
      if (off < 0) off = off / 4; // üstte direnç
      el.classList.add('is-dragging');
      el.style.transform = `translate3d(0,${off}px,0)`;
    };
    const end = () => {
      if (!dragging) return; dragging = false;
      el.classList.remove('is-dragging');
      const off = base + dy;
      const mid = offsetFor('medium');
      if (vy > 0.9 || off > H() * 0.72 || (detent === 'medium' && off > mid + 90)) { api.close(); return; }
      if (opts.detents === 'large-only') { api.setDetent('large'); return; }
      if (vy < -0.5 || off < mid / 2) api.setDetent('large');
      else api.setDetent(opts.allowMedium === false ? 'large' : 'medium');
    };
    [el.querySelector('.sheet-grabber'), el.querySelector('.sheet-header')].forEach(h => {
      h.addEventListener('touchstart', (e) => start(e, false), { passive: true });
    });
    body.addEventListener('touchstart', (e) => start(e, true), { passive: true });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', end, { passive: true });
    el.addEventListener('touchcancel', end, { passive: true });
    return api;
  }
  function openDialog(kind, opts) {
    opts = opts || {};
    const scrim = document.createElement('div');
    scrim.className = 'dialog-scrim';
    const el = document.createElement('div');
    el.setAttribute('role', kind === 'alert' ? 'alertdialog' : 'dialog');
    el.setAttribute('aria-modal', 'true');
    const actions = (opts.actions || []).slice();
    const head = (opts.title || opts.message) ? `<div class="alert-title">${esc(opts.title || '')}</div>${opts.message ? `<div class="alert-msg">${esc(opts.message)}</div>` : ''}` : '';
    if (kind === 'alert') {
      if (!actions.length) actions.push({ label: 'Tamam', style: 'default' });
      el.className = 'alert';
      el.innerHTML = `<div class="alert-body">${head}</div><div class="alert-actions${actions.length > 2 ? ' is-stacked' : ''}">` +
        actions.map((a, i) => `<button type="button" class="alert-btn${a.style ? ' is-' + a.style : ''}" data-i="${i}">${esc(a.label)}</button>`).join('') + `</div>`;
    } else {
      const main = actions.filter(a => a.style !== 'cancel');
      const cancel = actions.find(a => a.style === 'cancel') || { label: 'Vazgeç', style: 'cancel' };
      if (!actions.includes(cancel)) actions.push(cancel);
      el.className = 'action-sheet';
      el.innerHTML = `<div class="action-group">${head ? `<div class="action-head">${head}</div>` : ''}` +
        main.map(a => `<button type="button" class="action-item${a.icon ? ' has-icon' : ''}${a.style ? ' is-' + a.style : ''}" data-i="${actions.indexOf(a)}">${a.icon || ''}<span>${esc(a.label)}${a.sub ? `<span class="action-sub">${esc(a.sub)}</span>` : ''}</span></button>`).join('') +
        `</div><div class="action-group"><button type="button" class="action-item is-cancel" data-i="${actions.indexOf(cancel)}">${esc(cancel.label)}</button></div>`;
    }
    document.body.appendChild(scrim); document.body.appendChild(el);
    let done = false;
    const close = (a) => {
      if (done) return; done = true;
      scrim.classList.remove('is-open'); el.classList.remove('is-open');
      document.removeEventListener('keydown', onKey, true);
      setTimeout(() => { scrim.remove(); el.remove(); }, 420);
      if (a && a.onSelect) setTimeout(() => a.onSelect(), kind === 'alert' ? 120 : 260);
    };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(actions.find(a => a.style === 'cancel')); } };
    document.addEventListener('keydown', onKey, true);
    el.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) close(actions[+b.dataset.i]); });
    scrim.addEventListener('click', () => { if (kind === 'sheet') close(actions.find(a => a.style === 'cancel')); });
    requestAnimationFrame(() => { scrim.classList.add('is-open'); el.classList.add('is-open'); });
    return { close: () => close(null) };
  }
  const openSheets = [];
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (openSheets.length) openSheets[openSheets.length - 1].close();
      else if (App.current && App.current.stack.length > 1) App.pop();
    }
  });

  /* ------------------------------------------------------------------
     GÖRÜNÜM (tema + yazı boyutu)
     ------------------------------------------------------------------ */
  function applyAppearance() {
    const root = document.documentElement;
    // 'system' iken yalnızca kendi koyduğumuz özniteliği kaldır (barındırıcı ortamın temasına dokunma)
    if (App.state.theme === 'system') { if (root.dataset.appTheme) { root.removeAttribute('data-theme'); delete root.dataset.appTheme; } }
    else { root.setAttribute('data-theme', App.state.theme); root.dataset.appTheme = '1'; }
    root.style.setProperty('--ts', String(App.state.textScale || 1));
    const attr = root.getAttribute('data-theme');
    const dark = attr ? attr === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    let m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#000000' : '#F2F2F7');
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyAppearance);

  const TEXT_SCALES = [0.88, 0.94, 1, 1.08, 1.18, 1.3];
  function openSettingsSheet() {
    App.sheet({
      title: 'Görünüm',
      detent: 'large',
      render(body, sheetApi) {
        const draw = () => {
          const ti = Math.max(0, TEXT_SCALES.indexOf(App.state.textScale));
          body.innerHTML =
            UI.section({ header: 'Tema', body: `<div class="card" style="padding:12px">${UI.segmented('theme', [
              { value: 'system', label: 'Sistem', icon: 'circle.lefthalf' },
              { value: 'light', label: 'Açık', icon: 'sun' },
              { value: 'dark', label: 'Koyu', icon: 'moon' }], App.state.theme, 'is-lg')}</div>` }) +
            UI.section({ header: 'Yazı Boyutu', footer: 'Uzun klinik notlar ve listeler bu boyuta göre ölçeklenir. iPhone Ayarlar’daki Metin Boyutu da dikkate alınır.', body:
              `<div class="card"><div class="hstack" style="gap:14px"><span style="font-size:13px;font-weight:600">A</span>` +
              `<input id="ts-range" type="range" min="0" max="${TEXT_SCALES.length - 1}" step="1" value="${ti}" style="flex:1;accent-color:var(--tint)" aria-label="Yazı boyutu">` +
              `<span style="font-size:22px;font-weight:600">A</span></div>` +
              `<p class="reading" style="margin:14px 0 0">Fosfofruktokinaz-1, glikolizin hız kısıtlayıcı enzimidir; F2,6BP ile aktive, ATP ve sitrat ile inhibe olur.</p></div>` }) +
            UI.section({ header: 'Rehber', body: UI.list([
              UI.row({ title: 'Simgeler ve Renkler', subtitle: 'Şemayı okuma anahtarı', leading: UI.tile('book', 'var(--blue)'), chevron: true, action: 'legend' }),
              UI.row({ title: 'iPhone’a Uygulama Olarak Ekle', subtitle: 'Paylaş › Ana Ekrana Ekle', leading: UI.tile('square.grid', 'var(--gray)'), chevron: true, action: 'install' })
            ], { icons: true }) }) +
            `<p class="t-footnote c-2" style="text-align:center;margin:8px 0 0">Lehninger, Harper ve Lippincott Biyokimya referanslı.<br>${Data.pathways.length} yolak • ${Data.allSteps.length} basamak • ${Data.hubs.length} kavşak</p>`;
          UI.bindSegmented(body, 'theme', (v) => App.setState({ theme: v }));
          body.querySelector('#ts-range').addEventListener('input', (e) => App.setState({ textScale: TEXT_SCALES[+e.target.value] }));
          body.querySelector('[data-action="legend"]').addEventListener('click', () => {
            if (App.routes.legend) { sheetApi.close(); App.open('legend'); }
          });
          body.querySelector('[data-action="install"]').addEventListener('click', () => {
            App.sheet({ title: 'Ana Ekrana Ekle', detent: 'medium', render(b) {
              b.innerHTML = UI.list([
                UI.row({ title: 'Safari’de alttaki <b>Paylaş</b> düğmesine dokunun', leading: UI.tile('arrow.up.right', 'var(--blue)') }),
                UI.row({ title: '<b>Ana Ekrana Ekle</b> seçeneğini seçin', leading: UI.tile('plus', 'var(--gray)') }),
                UI.row({ title: 'Uygulama tam ekran ve çevrimdışı açılır', leading: UI.tile('checkmark', 'var(--green)') })
              ], { icons: true });
            } });
          });
        };
        draw();
      }
    });
  }

  /* ------------------------------------------------------------------
     BAŞLAT
     ------------------------------------------------------------------ */
  App.start = function () {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) document.documentElement.classList.add('ios-dynamic-type');
    if (window.navigator.standalone) document.documentElement.classList.add('is-standalone');
    applyAppearance();
    const app = document.getElementById('app');
    const bar = document.createElement('nav');
    bar.className = 'tabbar';
    bar.setAttribute('role', 'tablist');
    App.tabs.forEach(t => {
      const scene = document.createElement('div');
      scene.className = 'tab-scene';
      scene.dataset.tab = t.id;
      app.appendChild(scene);
      t.scene = scene;
      bar.insertAdjacentHTML('beforeend', `<button type="button" class="tab-item" role="tab" data-tab="${t.id}" aria-selected="false">${icon(t.icon)}<span>${esc(t.title)}</span></button>`);
    });
    app.appendChild(bar);
    bar.addEventListener('click', (e) => { const b = e.target.closest('.tab-item'); b && App.switchTab(b.dataset.tab); });
    let first = App.tabs[0].id;
    try { const s = sessionStorage.getItem('metabolizma.tab'); if (s && App.tabs.some(t => t.id === s)) first = s; } catch (e) { /* yok */ }
    App.switchTab(first);
    // iOS: çift dokunma yakınlaştırmasını ve uzun basma menüsünü bastır (harita kendi hareketlerini yönetir)
    document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    // Çevrimdışı önbellek
    if ('serviceWorker' in navigator && location.protocol === 'https:' && window.top === window.self) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  };
})();
