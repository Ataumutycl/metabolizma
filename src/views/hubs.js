/* =====================================================================
   KAVŞAKLAR — hubsHome (sekme kökü) + hub { id }
   ===================================================================== */
(function () {
  'use strict';
  const U = App.ui;
  const D = App.data;

  // Kısa ad / grafik etiketi (veri adından türetilemeyen kavşaklar için)
  const SHORT = {
    'j-g6p': ['G6P', 'G6P'],
    'j-f6p': ['F6P & G3P', 'F6P·G3P'],
    'j-dhap': ['DHAP', 'DHAP'],
    'j-piruvat': ['Pirüvat', 'Pirüvat'],
    'j-asetilkoa': ['Asetil-KoA', 'Asetil-KoA'],
    'j-sitrat': ['Sitrat', 'Sitrat'],
    'j-alfakg': ['α-Ketoglutarat', 'α-KG'],
    'j-suksinilkoa': ['Süksinil-KoA', 'Süksinil-KoA'],
    'j-fumarat-oaa': ['Fumarat & OAA', 'Fum·OAA'],
    'j-etz': ['NADH / CoQ', 'CoQ · ETZ']
  };
  function plainName(h) { return h.name.replace(/^\s*\d+\.\s*/, ''); }
  function shortName(h) {
    if (SHORT[h.id]) return SHORT[h.id][0];
    return plainName(h).split(/\s[(—–]/)[0].trim();
  }
  function graphLabel(h) { return SHORT[h.id] ? SHORT[h.id][1] : shortName(h); }
  // Liste başlığı: " — " sonrası açıklamayı alt satıra bırak
  const LIST = {
    'j-g6p': 'Glukoz-6-Fosfat', 'j-f6p': 'Fruktoz-6-P & Gliseraldehit-3-P', 'j-dhap': 'DHAP ↔ Gliserol-3-P',
    'j-sitrat': 'Sitrat ↔ Malonil-KoA', 'j-alfakg': 'α-Ketoglutarat ↔ Glutamat', 'j-fumarat-oaa': 'Fumarat & Oksaloasetat',
    'j-etz': 'NADH / FADH₂ / CoQ'
  };
  function listTitle(h) { return LIST[h.id] || plainName(h).split(/\s[—–]\s/)[0].replace(/\s*\(\d+C\)/, '').trim(); }
  function numOf(h, i) { const m = h.name.match(/^\s*(\d+)\./); return m ? m[1] : String(i + 1); }
  function colorOf(h) {
    const s = D.stepsAtJunction(h.id)[0];
    return s ? U.pathwayStyle(s.pw.id).color : 'var(--gray)';
  }
  function numTile(h, i, size) {
    return `<span class="icon-tile is-num${size ? ' is-' + size : ''}" style="--tile:${colorOf(h)}">${U.esc(numOf(h, i))}</span>`;
  }

  /* ---------------------------------------------------------------
     Kavşak grafiği: merkezi karbon omurgası, yılan düzeni (2 sıra)
     --------------------------------------------------------------- */
  function graphHtml() {
    const hubs = D.hubs;
    const top = hubs.slice(0, 5), bot = hubs.slice(5, 10);
    const xs = [8.5, 29, 50, 71, 91.5];
    const node = (h, x, row, order) => {
      const i = hubs.indexOf(h);
      return `<button type="button" class="hub-gnode" data-hub="${h.id}" style="left:${x}%;top:${row ? 126 : 38}px;--tile:${colorOf(h)}" aria-label="${U.esc(shortName(h))}">` +
        `<span class="hub-gdot">${U.esc(numOf(h, i))}</span><span class="hub-glabel">${U.esc(graphLabel(h))}</span></button>`;
    };
    const nodes = top.map((h, k) => node(h, xs[k], 0)).join('') + bot.map((h, k) => node(h, xs[4 - k], 1)).join('');
    return `<div class="hub-graph card" role="group" aria-label="Merkezi karbon omurgası">` +
      `<div class="hub-graph-head"><span class="t-footnote c-2">Merkezi omurga</span><span class="t-footnote c-3">Glukozdan ETZ’ye</span></div>` +
      `<div class="hub-graph-body">` +
      `<svg class="hub-gline" viewBox="0 0 100 164" preserveAspectRatio="none" aria-hidden="true">` +
      `<path d="M8.5 38 H91.5 C104 38 104 126 91.5 126 H8.5" vector-effect="non-scaling-stroke"/></svg>` +
      nodes + `</div></div>`;
  }

  /* ---------------------------------------------------------------
     hubsHome
     --------------------------------------------------------------- */
  App.defineRoute('hubsHome', function () {
    return {
      title: 'Kavşaklar',
      subtitle: `Yolakların birbirine bağlandığı ${D.hubs.length} ortak molekül`,
      render(el, page) {
        const rows = D.hubs.map((h, i) =>
          U.row({
            title: U.esc(listTitle(h)),
            subtitle: U.esc(h.badge), clamp: true,
            leading: numTile(h, i),
            value: `<span class="hub-counts" aria-label="${h.incoming.length} gelen, ${h.outgoing.length} giden">` +
              `<span>${U.icon('arrow.down.right')}${h.incoming.length}</span><span>${U.icon('arrow.up.right')}${h.outgoing.length}</span></span>`,
            chevron: true, action: 'hub', cls: 'is-tall', attrs: `data-id="${h.id}"`
          }));
        el.innerHTML = graphHtml() +
          U.section({
            body: U.list(rows, { icons: true }),
            footer: 'Kavşaklar, birden fazla yolağın ortak kullandığı ara moleküllerdir. Bir kavşağa dokunarak gelen ve giden yolakları, düzenleyicileri ve ilgili basamakları görün.'
          });
        el.onclick = (e) => {
          const b = e.target.closest('[data-hub],[data-action="hub"]');
          if (!b) return;
          App.open('hub', { id: b.dataset.hub || b.dataset.id });
        };
      }
    };
  });

  /* ---------------------------------------------------------------
     hub { id }
     --------------------------------------------------------------- */
  // "Metin [+] a, b | [-] c, d → sonuç" → { main, regs: [html...], tail }
  function parseItem(text) {
    const m = /\s\[\+\]\s[^|]*?\s\|\s\[[-−]\]\s/.exec(text);
    if (!m) return { main: text, regs: [], tail: '' };
    const main = text.slice(0, m.index).trim();
    let rest = text.slice(m.index).trim();
    let tail = '';
    const ai = rest.indexOf(' → ');
    if (ai > -1) { tail = rest.slice(ai + 3).trim(); rest = rest.slice(0, ai).trim(); }
    return { main, regs: rest.split(/\s\|\s/).map(s => s.trim()).filter(Boolean), tail };
  }
  function itemHtml(text) {
    const lab = U.splitLabel(text);
    const p = parseItem(lab.body);
    return `<div class="row is-top hub-item"><span class="row-body">` +
      (lab.label ? `<span class="hub-item-label">${U.esc(lab.label)}</span>` : '') +
      `<span class="hub-item-text">${U.esc(p.main)}</span>` +
      (p.regs.length ? `<span class="hub-regs">${p.regs.map(r => `<span class="hub-reg">${U.richReg(r)}</span>`).join('')}</span>` : '') +
      (p.tail ? `<span class="hub-item-tail">${U.icon('arrow.right')}<span>${U.esc(p.tail)}</span></span>` : '') +
      `</span></div>`;
  }
  function flowSection(items, kind) {
    const inc = kind === 'in';
    return U.section({
      header: `<span class="hub-sec-ic ${inc ? 'is-in' : 'is-out'}">${U.icon(inc ? 'arrow.down.right' : 'arrow.up.right')}</span>${inc ? 'Gelen yolaklar' : 'Giden yolaklar'}`,
      cls: 'hub-flow',
      body: `<div class="list">${items.map(itemHtml).join('')}</div>`
    });
  }
  function shortEnz(e) { return String(e || '').replace(/\s*\[[^\]]*\]/g, '').replace(/\s{2,}/g, ' ').trim(); }

  App.defineRoute('hub', function (params) {
    const hub = D.hub(params.id);
    if (!hub) return { title: 'Kavşak', render(el) { el.innerHTML = U.empty('questionmark.circle', 'Kavşak bulunamadı', ''); } };
    const idx = D.hubs.indexOf(hub);
    return {
      title: shortName(hub),
      backLabel: shortName(hub),
      render(el) {
        const steps = D.stepsAtJunction(hub.id);
        const stepRows = steps.map(x => U.row({
          title: U.esc(shortEnz(x.st.enzyme)),
          subtitle: `${U.esc(x.st.substrate)} → ${U.esc(x.st.product)}`,
          clamp: true,
          leading: U.pathwayTile(x.pw.id),
          accessory: x.st.isRateLimiting ? `<span class="c-rate hub-bolt">${U.icon('bolt.fill')}</span>` : '',
          chevron: true, action: 'step', cls: 'is-tall', attrs: `data-pw="${x.pw.id}" data-idx="${x.sIdx}"`
        }));
        el.innerHTML =
          `<div class="card hub-head">` +
            `<div class="hub-head-top">${numTile(hub, idx, 'lg')}<div class="hub-head-body">` +
              `<h2 class="t-title3 hub-head-name">${U.esc(plainName(hub))}</h2></div></div>` +
            `<div class="hub-head-meta">` +
              `<span class="hub-comp">${U.icon('mappin')}${U.esc(hub.compartment)}</span>` +
              `${U.badge(hub.badge, 'is-jn', 'link')}` +
            `</div>` +
          `</div>` +
          flowSection(hub.incoming, 'in') +
          flowSection(hub.outgoing, 'out') +
          (steps.length ? U.section({
            header: 'Bu kavşaktaki basamaklar',
            body: U.list(stepRows, { icons: true }),
            footer: 'Basamağa dokunarak enzimi, düzenleyicileri ve klinik notu açın.'
          }) : '');
        el.onclick = (e) => {
          const b = e.target.closest('[data-action="step"]');
          if (b) App.open('step', { pw: b.dataset.pw, idx: +b.dataset.idx });
        };
      }
    };
  });
})();
