# Clinical datasets — schema (contract between data workers and UI worker)

Both files are plain scripts (no modules), loaded right after `src/data.js` and before `core.js`.
All text in natural Turkish, medical-school level, concise, sentence case (no ALL CAPS shouting), no emoji.
Use the same notation as data.js: [+] activator, [-] inhibitor, subscripts (H₂O, NAD⁺), arrows →.

## src/data-diseases.js
```js
window.BIO_DISEASES = [
  {
    id: 'mcardle',                       // kebab/ascii, unique
    name: 'McArdle hastalığı',           // display name
    aka: 'GSD tip V',                    // optional alias / classification
    category: 'glikojen',                // one of: karbonhidrat | glikojen | mitokondri | lipit | keton-kolesterol | aminoasit-ure | eritrosit
    enzyme: 'Kas glikojen fosforilazı',  // deficient enzyme / transporter / protein
    gene: 'PYGM',                        // optional
    inheritance: 'OR',                   // 'OR' (otozomal resesif) | 'OD' | 'X-R' | 'X-D' | 'Mitokondriyal' | 'Edinsel' | 'Değişken'
    tissue: 'İskelet kası',              // optional, main affected tissue
    accumulates: ['Kasta glikojen (normal yapıda)'],          // what builds up
    deficient: ['Egzersizde kas ATP’si', 'Venöz laktat artışı yok'], // what is lacking / not produced
    findings: ['Egzersizle kramp ve miyalji', 'Miyoglobinüri', '“İkinci rüzgar” fenomeni'],
    labs: ['Egzersizle CK ↑', 'İskemik egzersiz testinde laktat yükselmez, amonyak yükselir'],
    treatment: ['Egzersiz öncesi sükroz', 'Ağır anaerobik egzersizden kaçınma'],
    pearl: 'Tarui’den farkı: oral glukoz/sükroz McArdle’da semptomları düzeltir.', // one-line exam tip
    links: [{ pw: 'glikojen', idx: 2 }]  // steps in data.js PATHWAYS (pw id + index in pw.steps) — MUST be verified
  }
];
```

## src/data-toxins.js
```js
window.BIO_TOXINS = [
  {
    id: 'arsenit',
    name: 'Arsenit',
    aka: 'AsO₃³⁻',                       // optional
    kind: 'toksin',                      // 'toksin' | 'ilac' | 'deneysel' | 'fizyolojik'  (fizyolojik: e.g. UCP-1)
    target: 'Lipoik asit (PDH ve α-KGDH E2)', // enzyme/complex/cofactor targeted
    action: 'inhibitor',                 // 'inhibitor' | 'ayirici' (uncoupler) | 'aktivator' | 'substrat-analogu'
    mechanism: 'Lipoatın iki -SH grubuna bağlanarak E2 alt birimini bloke eder.',
    effect: 'Pirüvat ve α-KG oksidasyonu durur; laktik asidoz.',          // metabolic consequence
    clinical: 'Pirinç suyu ishali, sarımsak kokulu nefes, Mees çizgileri.', // optional clinical picture / indication
    antidote: 'Dimerkaprol (BAL)',       // optional
    pearl: 'Arsenat (AsO₄³⁻) ise GAPDH basamağında Pᵢ yerine geçer.',      // optional one-line exam tip
    links: [{ pw: 'pdh', idx: 0 }, { pw: 'tca', idx: 3 }]                 // verified step references
  }
];
```

Rules: every `links` entry must point to a step that actually mentions the disease/agent or the relevant enzyme — verify by reading data.js (PATHWAYS order and steps). Prefer facts already stated in data.js clinicalNote / inhibitors (they were reviewed); add standard textbook facts only when certain (Lippincott/Harper/Lehninger/TUS). Never invent numbers.
