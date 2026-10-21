    // -------------------------------------------------------------------------
    // 1. CONTINUOUS PATHWAYS & REACTIONS DATASET
    // Each pathway connects explicitly to upstream/downstream pathways via
    // junction IDs, and every step carries external grouped (+) and (-) lists.
    // -------------------------------------------------------------------------
    const PATHWAYS = [
      {
        id: 'glikoliz',
        number: '1',
        title: 'GLİKOLİZ (Embden-Meyerhof-Parnas Yolu)',
        compartment: 'Sitozol (Tüm Dokular)',
        netEquation: 'Glukoz + 2 NAD⁺ + 2 ADP + 2 Pᵢ → 2 Pirüvat + 2 NADH + 2 H⁺ + 2 ATP (Net) + 2 H₂O',
        entryBridge: 'Hücre dışından GLUT-1/2/3/4 taşıyıcıları ile giren Serbest Glukoz ile başlar.',
        exitBridge: 'Son ürün olan Pirüvat; (1) Mitokondride PDH ile Asetil-KoA\'ya, (2) PC ile Oksaloasetat\'a (Glukoneogenez/TCA), (3) Sitozolde LDH ile Laktat\'a, (4) ALT ile Alanin\'e bağlanır.',
        steps: [
          {
            stepNo: 'Basamak 1 (Tersinmez • Giriş Kapısı)',
            junctionId: 'j-g6p',
            substrate: 'D-Glukoz (6C)',
            product: 'Glukoz-6-Fosfat (G6P)',
            cofactors: 'ATP → ADP (Mg²⁺ bağımlı)',
            enzyme: 'Heksokinaz I–III (Dokular) / Glukokinaz [HK-IV] (Karaciğer & Pankreas β-hücresi)',
            isRateLimiting: false,
            statePreference: 'fed',
            activators: [
              'Allosterik: Yüksek kan glukozu (Glukokinaz yüksek Km / düşük afiniteye sahiptir, sadece toklukta doyar)',
              'Düzenleyici Protein: Fruktoz-1-Fosfat (Glukokinaz\'ı çekirdekteki GKRP inhibitör proteininden ayırıp sitozole salar)',
              'Hormonal: İnsülin (Karaciğerde Glukokinaz gen transkripsiyonunu güçlü şekilde indükler)'
            ],
            inhibitors: [
              'Allosterik (Ürün İnhibisyonu): Glukoz-6-Fosfat (Sadece Heksokinaz I–III\'ü allosterik olarak inhibe eder; Glukokinaz\'ı inhibe ETMEZ!)',
              'Düzenleyici Protein: Fruktoz-6-Fosfat (Glukokinaz\'ı çekirdekte GKRP proteinine bağlayarak inaktive eder)',
              'Hormonal: Glukagon (Glukokinaz sentezini baskılar)'
            ],
            crossConnections: [
              { targetPathway: 'glikojen', label: '🔗 G6P ↔ Glukoz-1-Fosfat ↔ Glikojen (Fosfoglukomutaz ile Glikojenez / Glikojenoliz Köprüsü)' },
              { targetPathway: 'hmp', label: '🔗 G6P → 6-Fosfoglukonolakton (G6PD ile Pentoz Fosfat Yolu / HMP Şantı Çıkışı)' },
              { targetPathway: 'glukoneogenez', label: '🔗 G6P → Serbest Glukoz (Karaciğer ER\'de Glukoz-6-Fosfataz ile Glukoneogenez Son Çıkışı)' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — MODY Tip 2 Diyabet ve Heksokinaz Eksikliği: Pankreas β-hücrelerinde Glukokinaz (HK-IV), hücre içi ATP/ADP oranını belirleyerek K_ATP kanallarını kapatan ve Ca²⁺ bağımlı insülin sekresyonunu tetikleyen birincil "glukoz sensörü"dür. GCK genindeki heterozigot fonksiyon kaybı mutasyonlarında (MODY Tip 2), β-hücresinin glukoz eşiği ~5 mM\'dan ~7-8 mM\'a yükselir; hastada çocukluktan itibaren hafif, ilerleyici olmayan açlık hiperglisemisi görülür. Homozigot mutasyon ise ağır kalıcı neonatal diyabet yapar. Eritrosit Heksokinaz-I eksikliğinde ise glikolitik akım azaldığı için 1,3-BPG ve 2,3-BPG düzeyi düşer; hemoglobinin O₂ afinitesi aşırı yükselir (eğri sola kayar), doku hipoksisi ve ekstravasküler hemolitik anemi gelişir.'
          },
          {
            stepNo: 'Basamak 2 (Tersinir İzomerizasyon)',
            substrate: 'Glukoz-6-Fosfat (G6P)',
            product: 'Fruktoz-6-Fosfat (F6P)',
            cofactors: 'Aldoz ↔ Ketoz izomerizasyonu',
            clinicalNote: 'PATOFİZYOLOJİ — Fosfoglukoz İzomeraz (GPI) Eksikliği ve AMF (Otokrin Motilite Faktörü): Eritrositler mitokondri içermediğinden ATP üretiminde %100 glikolize bağımlıdır. GPI eksikliğinde G6P → F6P dönüşümü aksar; eritrosit membranındaki Na⁺/K⁺-ATPaz ve Ca²⁺-ATPaz pompaları enerjisiz kalarak hücre şişmesine, membran rijiditesine ve dalakta makrofajlarca yıkıma (kronik nonsferositik hemolitik anemi) yol açar. Ayrıca tümör hücreleri tarafından hücre dışına salgılanan GPI, "Otokrin Motilite Faktörü (AMF)" gibi davranarak tümör invazyonunu ve metastazı uyarır.',
            enzyme: 'Fosfoglukoz İzomeraz (Glukoz-6-Fosfat İzomeraz)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Substrat dengesi: G6P artışı reaksiyonu ileri (glikoliz yönüne), F6P artışı geri (glukoneogenez yönüne) sürer'
            ],
            inhibitors: [
              'Yarışmalı: 6-Fosfoglukonat (Pentoz fosfat yolu ara ürünü)'
            ],
            crossConnections: [
              { targetPathway: 'hmp', label: '🔗 Pentoz Fosfat Yolu Non-Oksidatif Fazından (Transketolaz & Transaldolaz) Fruktoz-6-Fosfat buraya geri bağlanır!' }
            ]
          },
          {
            stepNo: 'Basamak 3 (⚡ HIZ KISITLAYICI BASAMAK • Tersinmez)',
            junctionId: 'j-f6p',
            substrate: 'Fruktoz-6-Fosfat (F6P)',
            product: 'Fruktoz-1,6-Bisfosfat (F1,6BP)',
            cofactors: 'ATP → ADP (Mg²⁺) | Yan Döngü: PFK-2 / FBPaz-2 ile Fruktoz-2,6-Bisfosfat (F2,6BP) sentezi',
            enzyme: 'Fosfofruktokinaz-1 (PFK-1) [Glikolizin Hız Kısıtlayıcı / Committed Enzimi]',
            isRateLimiting: true,
            statePreference: 'fed',
            activators: [
              'En Güçlü Allosterik Aktivatör: Fruktoz-2,6-Bisfosfat (F2,6BP — ATP inhibisyonunu kaldırır, F6P afinitesini artırır)',
              'Enerji Düşüklüğü Sinyalleri: AMP ve ADP (Düşük enerji şarjında glikolizi hızlandırır)',
              'Hormonal: İnsülin (Protein Fosfataz ile iki işlevli PFK-2/FBPaz-2 enzimini defosforile eder → PFK-2 aktifleşir → F2,6BP artar → PFK-1 tam hız çalışır)',
              'İnorganik Fosfat (Pᵢ) ve NH₄⁺'
            ],
            inhibitors: [
              'Allosterik (Yüksek Enerji): ATP (Enzimin hem substratı hem de allosterik inhibitörüdür)',
              'Allosterik (TCA / Lipogenez Sinyali): Sitrat (Mitokondriden sitozole çıkan Sitrat enerji bolluğunu bildirerek PFK-1\'i frenler)',
              'Asidoz Koruması: H⁺ iyonları / Düşük pH (Aşırı laktik asit birikimini önlemek için glikolizi yavaşlatır)',
              'Hormonal: Glukagon ve Epinefrin (cAMP → PKA ile PFK-2/FBPaz-2\'yi fosforile eder → FBPaz-2 aktifleşir → F2,6BP yıkılır → PFK-1 durur)'
            ],
            crossConnections: [
              { targetPathway: 'glukoneogenez', label: '🔄 Karşılıklı (Resiprokal) Bypass: Glukoneogenezde Fruktoz-1,6-Bisfosfataz-1 (FBPaz-1) bu basamağı ters yönde bypass eder!' },
              { targetPathway: 'tca', label: '🔗 TCA döngüsünden çıkan Sitrat buraya gelerek PFK-1\'i [-] inhibe eder (Pasteur etkisi bağlantısı).' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Tarui Hastalığı (GSD Tip VII — PFK-1 Eksikliği) ve Pasteur Etkisi: Kas ve eritrosit PFK-1 alt birimindeki mutasyon sonucu F6P → F1,6BP basamağı tıkanır. Egzersiz sırasında kas hücresi glikojenolizle ürettiği G6P ve F6P\'yi glikolize sokamaz; ATP üretilemediği için ağrılı kas krampları, rabdomiyoliz ve miyoglobinüri gelişir. McArdle hastalığından farklı olarak, ağızdan alınan glukoz da PFK-1 bloğuna takıldığı için egzersiz öncesi sükroz/glukoz alımı semptomları düzeltmez, aksine yağ asidi yıkımını (insülin artışıyla) baskılayarak tabloyu ağırlaştırır ("Out-of-wind" fenomeni). Eritrositlerde ise 2,3-BPG düşüklüğü ve kompanzatuvar retikülositozlu hemolitik anemi görülür.'
          },
          {
            stepNo: 'Basamak 4 & 5 (Trioz Bölünmesi ve İzomerizasyon)',
            junctionId: 'j-dhap',
            substrate: 'Fruktoz-1,6-Bisfosfat (6C)',
            product: 'Dihidroksiaseton Fosfat (DHAP, 3C) ↔ Gliseraldehit-3-Fosfat (G3P, 3C) [×2]',
            cofactors: 'Aldolaz A (Kas/Çoğu doku) & Aldolaz B (Karaciğer/Böbrek) + Trioz Fosfat İzomeraz (TPI)',
            clinicalNote: 'PATOFİZYOLOJİ — Herediter Fruktoz İntoleransı (Aldolaz B Eksikliği) ve TPI Eksikliği: Diyetle sükroz veya fruktoz alındığında karaciğerde Fruktokinaz hızla Fruktoz-1-Fosfat (F1P) üretir; ancak Aldolaz B eksikliğinde F1P parçalanamaz ve hepatosit içinde birikir. Biriken F1P hücre içi serbest inorganik fosfat (Pᵢ) havuzunu tüketir ("Fosfat Tuzağı"). Pᵢ kalmadığı için mitokondriyal ATP Sentaz durur, ATP/AMP oranı çöker; Glikojen Fosforilaz (Pᵢ bağımlı) ve FBPaz-1 inhibe olarak ağır postprandiyal hipoglisemi, sarılık, karaciğer yetmezliği ve AMP yıkımına bağlı hiperürisemi gelişir. Trioz Fosfat İzomeraz (TPI) eksikliğinde ise DHAP birikimi toksik Metilglioksal oluşumuna (ileri glikasyon son ürünleri) yol açarak hemolitik anemiye ek olarak ağır ilerleyici nörodejenerasyon (glikolitik enzimopatiler arasında en ağır ve ilerleyici nörolojik tutulumlu olandır!) yapar.',
            enzyme: 'Aldolaz A/B  ve  Trioz Fosfat İzomeraz (TPI)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Fruktoz Metabolizması Bağlantısı: Karaciğerde Fruktoz → Fruktokinaz → Fruktoz-1-P → Aldolaz B ile doğrudan DHAP + Gliseraldehit\'e bölünür (PFK-1 regülasyonunu bypass eder!)'
            ],
            inhibitors: [
              'Genetik / Toksik: Aldolaz B eksikliğinde biriken Fruktoz-1-Fosfat hücre içi Pᵢ\'yi tüketerek glikojenoliz ve glukoneogenezi inhibe eder (Herediter Fruktoz İntoleransı)',
              'TPI için: 2-Fosfoglikolat (Yarışmalı inhibitör)'
            ],
            crossConnections: [
              { targetPathway: 'lipogenez', label: '🔗 DHAP ↔ Gliserol-3-Fosfat (Gliserol-3-P Dehidrogenaz ile) → Yağ Asidi Sentezinden gelen Açil-KoA\'lar ile birleşerek Triaçilgliserol (TAG) ve Fosfolipit sentezine bağlanır!' },
              { targetPathway: 'glukoneogenez', label: '🔗 Lipolizden gelen Gliserol → Gliserol Kinaz (sadece Karaciğer/Böbrek) → Gliserol-3-P → DHAP üzerinden Glukoneogeneze girer!' },
              { targetPathway: 'hmp', label: '🔗 HMP Şantı Non-Oksidatif fazından çıkan Gliseraldehit-3-Fosfat (G3P) doğrudan buraya bağlanır!' }
            ]
          },
          {
            stepNo: 'Basamak 6 (Oksidasyon & Yüksek Enerjili Tiyoester Oluşumu)',
            substrate: '2 × Gliseraldehit-3-Fosfat (G3P)',
            product: '2 × 1,3-Bisfosfogliserat (1,3-BPG)',
            cofactors: '2 NAD⁺ + 2 Pᵢ → 2 NADH + 2 H⁺ (Aktif bölge Sistein -SH grubu)',
            enzyme: 'Gliseraldehit-3-Fosfat Dehidrogenaz (GAPDH)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Yüksek NAD⁺ / Düşük NADH oranı (Sitozolik NAD⁺\'nin LDH veya Malat-Aspartat / Gliserol-3-P mekiği ile sürekli yenilenmesi şarttır)',
              'İnorganik Fosfat (Pᵢ)'
            ],
            inhibitors: [
              'Toksin (Kenet Çözücü Yarışmalı İnhibitör): Arsenat (AsO₄³⁻ — Pᵢ yerine bağlanıp kararsız 1-arseno-3-fosfogliserat oluşturur; kendiliğinden 3-PG\'ye hidroliz olur ve 7. basamaktaki ATP kazancını sıfırlar!)',
              'Enzim Zehirleri: İyodoasetat ve Ağır Metaller (İyodoasetat aktif bölgedeki Sistein -SH grubunu alkiller; Hg²⁺ ve Pb²⁺ ise -SH grubuna bağlanarak bloke eder)',
              'Ürün İnhibisyonu: Yüksek NADH / NAD⁺ oranı (ör. Hipoksi veya Alkol metabolizması)'
            ],
            crossConnections: [
              { targetPathway: 'etz', label: '🔗 Sitozolik NADH → Malat-Aspartat Mekiği (Kalp/Karaciğer: 2.5 ATP) veya Gliserol-3-Fosfat Mekiği (Kas/Beyin: 1.5 ATP) ile Mitokondri ETZ\'ye bağlanır!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Arsenat Kenet Çözülmesi ve Rapoport-Luebering (2,3-BPG) Şantı: Beş değerlikli Arsenat (AsO₄³⁻), inorganik fosfatı (Pᵢ) taklit ederek GAPDH basamağında G3P\'ye bağlanır ve kararsız 1-arseno-3-fosfogliserat oluşturur. Bu bileşik enzim kullanmadan spontan olarak 3-Fosfogliserat\'a hidroliz olur; böylece glikoliz akışı devam ederken Fosfogliserat Kinaz (7. basamak) atlanır ve net ATP kazancı sıfıra iner! Eritrositlerde ise fizyolojik olarak 1,3-BPG\'nin ~%20\'si Bisfosfogliserat Mutaz ile 2,3-BPG\'ye çevrilir; negatif yüklü 2,3-BPG deoksihemoglobinin β-zincirleri arasındaki pozitif boşluğa (His143, Lys82) bağlanarak T (gergin) formunu stabilize eder. Yüksek irtifada, KOAH\'ta ve anemide 2,3-BPG artarak O₂-Hb eğrisini sağa kaydırır ve dokulara O₂ sunumunu kurtarır.'
          },
          {
            stepNo: 'Basamak 7 (Substrat Düzeyinde Fosforilasyon #1 • Tersinir)',
            substrate: '2 × 1,3-Bisfosfogliserat (1,3-BPG)',
            product: '2 × 3-Fosfogliserat (3-PG)',
            cofactors: '2 ADP → 2 ATP (Mg²⁺) [İlk iki basamakta harcanan 2 ATP burada geri kazanılır]',
            clinicalNote: 'PATOFİZYOLOJİ — X\'e Bağlı Fosfogliserat Kinaz (PGK) Eksikliği: Glikolizde X kromozomu üzerinde kodlanan tek enzim PGK\'dır. Eksikliğinde eritrositlerde ve merkezi sinir sisteminde ATP sentezi bozulur; ancak bloğun üstünde biriken 1,3-BPG, Rapoport-Luebering şantına kayarak eritrosit 2,3-BPG düzeyini aşırı artırır. Hastalarda kronik hemolitik anemi, egzersizle tetiklenen miyopati/rabdomiyoliz ve mental retardasyon/epilepsi üçlüsü görülür.',
            enzyme: 'Fosfogliserat Kinaz (PGK)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Yüksek ADP konsantrasyonu',
              'Mg²⁺ kofaktörü'
            ],
            inhibitors: [
              'Dolaylı Toksik Bypass: Arsenat (AsO₄³⁻) varlığında 1,3-BPG oluşamadığı için bu basamak atlanır ve net ATP üretimi 0 olur!',
              'Eritrosit 2,3-BPG Şantı: 1,3-BPG → 2,3-BPG → 3-PG yoluna saptığında da bu ATP basamağı feda edilir.'
            ],
            crossConnections: [
              { targetPathway: 'ure_aa', label: '🔗 3-Fosfogliserat → 3-Fosfohidroksipirüvat → 3-Fosfo-serin → Serin ↔ Glisin & Sistein biyosentez yolağına çıkış verir!' }
            ]
          },
          {
            stepNo: 'Basamak 8 & 9 (İzomerizasyon ve Dehidratasyon ile Süper Yüksek Enerjili PEP Oluşumu)',
            substrate: '2 × 3-Fosfogliserat (3-PG) ↔ 2 × 2-Fosfogliserat (2-PG)',
            product: '2 × Fosfoenolpirüvat (PEP) + 2 H₂O',
            cofactors: 'PGM (2,3-BPG kofaktörü) + Enolaz (Mg²⁺ veya Mn²⁺ bağımlı)',
            clinicalNote: 'PATOFİZYOLOJİ — Florür Toksisitesi ve Laboratuvar Pre-Analitik Glikoliz Blokajı: Florür iyonu (F⁻), Enolaz\'ın aktif bölgesindeki zorunlu Mg²⁺ ve Pᵢ iyonlarıyla birleşerek sıkı bağlanan bir floro-fosfat-magnezyum kompleksi oluşturur ve 2-PG\'nin bağlanmasını tamamen engeller. Alınan kan örneği bekletildiğinde eritrositler saatte ~5-7 mg/dL glukoz tüketerek yalancı hipoglisemiye neden olduğundan, gri kapaklı biyokimya tüplerine Sodyum Florür (NaF) eklenerek Enolaz durdurulur. Klinik florür zehirlenmesinde ise glikoliz blokajına ek olarak kalsiyum şelasyonu sonucu ağır hipokalsemi ve hiperkalemiye bağlı ölümcül kardiyak aritmiler gelişir.',
            enzyme: 'Fosfogliserat Mutaz (PGM)  ve  Enolaz',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Enolaz Kofaktörleri: Mg²⁺ veya Mn²⁺ (Zorunlu iki değerlikli katyonlar)',
              'PGM Kofaktörü: Eser miktarda 2,3-Bisfosfogliserat (enzimin aktif bölge Histidin kalıntısını fosforile tutar)'
            ],
            inhibitors: [
              'Klasik Laboratuvar/Klinik İnhibitör: Florür İyonu (F⁻ — Mg²⁺ ve Pᵢ ile MgF₂PO₄ kompleksi oluşturarak Enolaz\'ı güçlü şekilde bloke eder! Kan şekeri ölçüm tüplerinde [gri kapaklı NaF tüpü] eritrositlerin glukozu tüketmesini önlemek için kullanılır)',
              'PGM İnhibitörü: Vanadat'
            ],
            crossConnections: [
              { targetPathway: 'glukoneogenez', label: '🔗 PEP (Fosfoenolpirüvat), Glukoneogenezde Oksaloasetat\'tan PEPCK enzimi ile sentezlenen ortak kesişim noktasıdır!' }
            ]
          },
          {
            stepNo: 'Basamak 10 (Substrat Düzeyinde Fosforilasyon #2 • Tersinmez Çıkış) + Laktat Yan Dalı',
            junctionId: 'j-piruvat',
            substrate: '2 × Fosfoenolpirüvat (PEP)',
            product: '2 × Pirüvat (3C)  [Anaerobik Yan Dal: Pirüvat ↔ Laktat (LDH)]',
            cofactors: '2 ADP → 2 ATP (Mg²⁺, K⁺) | Laktat Dehidrogenaz (LDH): NADH + H⁺ → NAD⁺',
            enzyme: 'Pirüvat Kinaz (PK)  [ve Anaerobik Koşulda Laktat Dehidrogenaz (LDH)]',
            isRateLimiting: true,
            statePreference: 'fed',
            activators: [
              'İleri Besleme (Feed-Forward) Allosterik Aktivatör: Fruktoz-1,6-Bisfosfat (PFK-1 ürünü olan F1,6BP, aşağı akıştaki Pirüvat Kinaz\'ı doğrudan aktive ederek akışı senkronize eder!)',
              'Hormonal (Karaciğer L-İzoformu): İnsülin (Protein Fosfataz-1 ile defosforilasyon → Aktif Pirüvat Kinaz)',
              'Farmakolojik Aktivatör: Mitapivat (Pirüvat kinaz eksikliği tedavisinde kullanılan allosterik PK aktivatörü)',
              'LDH Aktivatörü: Yüksek NADH/NAD⁺ oranı (Hipoksi, eritrosit, yoğun egzersiz, etanol yıkımı)'
            ],
            inhibitors: [
              'Allosterik: ATP (Yüksek enerji), Alanin (Yeterli amino asit/yapıtaşı bulunduğunu bildirir), Asetil-KoA ve Uzun Zincirli Yağ Asitleri',
              'Hormonal (SADECE Karaciğer L-PK İzoformu!): Glukagon ve Epinefrin (cAMP → PKA ile Pirüvat Kinaz\'ı fosforile ederek İNAKTİVE eder; böylece açlıkta karaciğer glukoneogenezle ürettiği PEP\'i tekrar pirüvata harcamaz! Kas M-PK izoformu PKA ile fosforile OLMAZ)',
              'LDH İnhibitörü: Oksamat (Pirüvatın yapısal analoğu olan yarışmalı LDH inhibitörü)'
            ],
            crossConnections: [
              { targetPathway: 'pdh', label: '🔗 1. Mitokondriye Giriş (Aerobik): Pirüvat → PDH Kompleksi ile Asetil-KoA\'ya dönüşür (TCA ve Lipogenez köprüsü).' },
              { targetPathway: 'glukoneogenez', label: '🔗 2. Anaplerotik / Glukoneogenik Giriş: Pirüvat → Pirüvat Karboksilaz (PC) ile Mitokondride Oksaloasetat\'a (OAA) dönüşür.' },
              { targetPathway: 'ure_aa', label: '🔗 3. Transaminasyon (Cahill Döngüsü): Pirüvat + Glutamat ↔ Alanin + α-Ketoglutarat (ALT / GPT [Kofaktör: PLP/B6]).' },
              { targetPathway: 'glukoneogenez', label: '🔗 4. Anaerobik / Cori Döngüsü: Pirüvat ↔ Laktat (LDH); Kas ve Eritrositte üretilen Laktat kanla Karaciğere gidip tekrar Pirüvat → Glukoz\'a çevrilir.' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Pirüvat Kinaz (PK) Eksikliği (En Sık Glikolitik Enzimopati): Otozomal resesif PKLR mutasyonu sonucu olgun eritrositlerde (mitokondri olmadığı için) net ATP üretimi belirgin şekilde düşer. Na⁺/K⁺-ATPaz pompası durunca eritrosit potasyum ve su kaybederek büzüşür; periferik yaymada dikensi çıkıntılı "Ekinosit (Burr cell)" hücreleri görülür ve dalak kordonlarında ekstravasküler hemolize uğrar (splenomegali, indirekt hiperbilirübinemi, safra taşları). Bloğun gerisinde biriken PEP ve 1,3-BPG, eritrosit içi 2,3-BPG düzeyini 2-3 kat artırır; bu durum Hb-O₂ afinitesini düşürerek (sağa kayma) dokulara oksijen verilmesini kolaylaştırır ve hastaların düşük hemoglobin düzeylerini şaşırtıcı derecede iyi tolere etmesini sağlar.'
          }
        ]
      },

      // =======================================================================
      // 2. GLUKONEOGENEZ
      // =======================================================================
      {
        id: 'glukoneogenez',
        number: '2',
        title: 'GLUKONEOGENEZ (Mitokondri → Sitozol → Endoplazmik Retikulum)',
        compartment: 'Karaciğer (%90) ve Böbrek Korteksi (%10) — Mitokondri + Sitozol + ER',
        netEquation: '2 Pirüvat + 4 ATP + 2 GTP + 2 NADH + 2 H⁺ + 6 H₂O → 1 Glukoz + 4 ADP + 2 GDP + 6 Pᵢ + 2 NAD⁺',
        entryBridge: 'Glikolizin sonundaki Pirüvat (Laktat ve Alanin\'den), TCA\'daki Oksaloasetat (Propiyonil-KoA / Süksinil-KoA ve Glikojenik AA\'lardan) ve Gliserol (TAG yıkımından → DHAP) üzerinden başlar.',
        exitBridge: 'Glikolizin 7 tersinir basamağını ters yönde kullanarak F1,6BP → F6P → G6P → Serbest Kan Glukozu üretir.',
        steps: [
          {
            stepNo: 'Bypass 1A (Mitokondri Matriksi • Pirüvat Kinaz Bypass\'ının 1. Adımı)',
            substrate: 'Pirüvat (3C) + HCO₃⁻',
            product: 'Oksaloasetat (OAA, 4C)  [Mitokondri → Malat Mekiği → Sitozol OAA]',
            cofactors: 'ATP → ADP + Pᵢ | Zorunlu Koenzim: Biyotin (B7 Vitamini — ABC karboksilaz) ve Mg²⁺/Mn²⁺',
            clinicalNote: 'PATOFİZYOLOJİ — Pirüvat Karboksilaz (PC) ve Biyotin (B7) Eksikliği: PC eksikliğinde Pirüvat → Oksaloasetat (OAA) dönüşümü yapılamaz. Bunun üç yıkıcı sonucu vardır: (1) Karaciğerde Glukoneogenez durur → Ağır açlık hipoglisemisi gelişir; (2) Biriken Pirüvat LDH ile Laktat\'a ve ALT ile Alanin\'e kayar → Ağır Laktik Asidoz ve Hiperalaninemi oluşur; (3) TCA döngüsünün anaplerotik OAA desteği kesildiği için döngü yavaşlar ve nöronlarda glutamat/GABA/miyelinizasyon sentezi bozularak Leigh benzeri ensefalopati gelişir. Ayrıca OAA\'dan AST ile Aspartat üretilemediği için Üre Döngüsü (ASS basamağı) durur ve tabloya Hiperamonyemi ile Sitrülinemi eklenir!',
            enzyme: 'Pirüvat Karboksilaz (PC) [Mitokondriyal Enzim]',
            isRateLimiting: false,
            statePreference: 'fasting',
            activators: [
              'ZORUNLU Allosterik Aktivatör: Asetil-KoA (Açlıkta yağ asidi β-oksidasyonu hızlandığında mitokondride biriken Asetil-KoA, PDH\'yi [-] kapatırken Pirüvat Karboksilaz\'ı [+] zorunlu olarak açar!)',
              'Hormonal: Glukagon ve Kortizol (Gen ekspresyonunu artırır)'
            ],
            inhibitors: [
              'Allosterik: Yüksek ADP (Düşük enerji durumunda pahalı glukoneogenezi frenler)',
              'Hormonal: İnsülin (Gen ekspresyonunu baskılar)',
              'Besinsel/Toksik: Çiğ yumurta akındaki Avidin proteini (Biyotin\'i bağlayarak PC karboksilasyonunu engeller)'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 Anaplerotik Köprü: Üretilen Oksaloasetat hem Glukoneogenez öncülüdür hem de TCA Döngüsünün (Sitrat Sentaz) darboğazını dolduran ana anaplerotik moleküldür!' },
              { targetPathway: 'beta_oks', label: '🔗 β-Oksidasyondan gelen Asetil-KoA doğrudan bu enzimi [+] aktive eder (Yağ asitleri net glukoza dönüşemez ama PC\'yi aktive edip ATP/NADH sağlayarak glukoneogenezi sürdürür).' }
            ]
          },
          {
            stepNo: 'Bypass 1B (Sitozol / Mitokondri • Pirüvat Kinaz Bypass\'ının 2. Adımı)',
            substrate: 'Oksaloasetat (OAA, 4C)',
            product: 'Fosfoenolpirüvat (PEP, 3C) + CO₂',
            cofactors: 'GTP → GDP (Fosfat vericisi ve dekarboksilasyon sürükleyicisi)',
            clinicalNote: 'PATOFİZYOLOJİ — Akut Etanol (Alkol) Hipoglisemisi ve PEPCK Substrat Açlığı: Aç karnına yüksek miktarda alkol alındığında, Alkol Dehidrogenaz (ADH, sitozol) ve Aldehit Dehidrogenaz-2 (ALDH2, mitokondri) reaksiyonları aşırı miktarda NADH üreterek hücre içi NADH/NAD⁺ oranını fırlatır. Yüksek NADH; (1) Pirüvat\'ı Laktat\'a (LDH), (2) Oksaloasetat\'ı Malat\'a (MDH), (3) DHAP\'ı Gliserol-3-Fosfat\'a kilitler. Sonuçta PEPCK enzimi substratı olan Oksaloasetat\'ı bulamaz, glukoneogenez tamamen durur ve glikojen depoları da tükenmiş olan kişide komaya kadar gidebilen ağır "Alkolik Açlık Hipoglisemisi" + Laktik Asidoz + Laktatın böbrekte ürik asit atılımını yarışmalı engellemesine bağlı "Akut Gut Atağı (Hiperürisemi)" gelişir.',
            enzyme: 'Fosfoenolpirüvat Karboksikinaz (PEPCK)',
            isRateLimiting: false,
            statePreference: 'fasting',
            activators: [
              'Hormonal (Transkripsiyonel İndüksiyon): Glukagon (cAMP → PKA → CREB yoluyla PEPCK mRNA sentezini güçlü artırır)',
              'Hormonal: Kortizol (Glukokortikoid yanıt elemanı üzerinden), Epinefrin ve Tiroid Hormonu (T₃)',
              'Substrat Bağlantısı: Süksinil-KoA Sentetaz basamağında (TCA) üretilen GTP doğrudan PEPCK\'yı besler!'
            ],
            inhibitors: [
              'Hormonal: İnsülin (PEPCK gen transkripsiyonunu güçlü şekilde baskılar)',
              'Metabolik (Redoks): Akut Etanol (Alkol) alımı → Yüksek NADH/NAD⁺ oranı Oksaloasetat\'ı Malat\'a ve Pirüvat\'ı Laktat\'a kilitlediği için PEPCK substratsız kalır → Ağır Açlık Hipoglisemisi!',
              'Not: PEPCK’nın belirgin allosterik düzenlenmesi yoktur; kontrol esas olarak gen transkripsiyonu ve substrat (OAA, GTP) düzeyiyle sağlanır'
            ],
            crossConnections: [
              { targetPathway: 'glikoliz', label: '🔗 Oluşan PEP, Glikolizin 9, 8, 7, 6, 5 ve 4. tersinir basamaklarını (Enolaz → PGM → PGK → GAPDH → TPI → Aldolaz) yukarı doğru takip ederek Fruktoz-1,6-Bisfosfat\'a ulaşır!' }
            ]
          },
          {
            stepNo: 'Bypass 2 (⚡ GLUKONEOGENEZ HIZ KISITLAYICI BASAMAĞI • Sitozol)',
            substrate: 'Fruktoz-1,6-Bisfosfat (F1,6BP) + H₂O',
            product: 'Fruktoz-6-Fosfat (F6P) + Pᵢ',
            cofactors: 'Hidroliz reaksiyonu (ATP üretilmez; Mg²⁺ bağımlı)',
            clinicalNote: 'PATOFİZYOLOJİ — Fruktoz-1,6-Bisfosfataz-1 (FBPaz-1) Eksikliği: Glukoneogenezin hız kısıtlayıcı basamağı olan FBPaz-1 eksikliğinde, glikojen depoları sağlam olduğu sürece (tokluk ve erken açlıkta) kan şekeri normaldir ve Glukagon testine yanıt alınır (Von Gierke\'den temel farkı!). Ancak uzamış açlıkta, ateşli enfeksiyonlarda veya fruktoz/gliserol yüklemesi sonrasında Laktat, Alanin ve Gliserol\'den yeni glukoz üretilemez; öncüller Pirüvat ve Laktat\'ta birikerek hayatı tehdit eden ketotik hipoglisemi, ağır laktik asidoz ve hepatomegaliye yol açar.',
            enzyme: 'Fruktoz-1,6-Bisfosfataz-1 (FBPaz-1) [Hız Kısıtlayıcı Enzim]',
            isRateLimiting: true,
            statePreference: 'fasting',
            activators: [
              'Allosterik: Sitrat (Yüksek enerji ve yağ asidi oksidasyonu sinyali)',
              'Enerji Bolluğu: Yüksek ATP / düşük AMP (AMP’nin allosterik inhibisyonu kalkar)',
              'Hormonal: Glukagon ve Epinefrin (cAMP → PKA → İki işlevli PFK-2/FBPaz-2 enzimini fosforile eder → FBPaz-2 aktifleşir → Fruktoz-2,6-Bisfosfat yıkılır → FBPaz-1 üzerindeki fren kalkar!)'
            ],
            inhibitors: [
              'En Güçlü Sinyal İnhibitörü: Fruktoz-2,6-Bisfosfat (F2,6BP — Toklukta PFK-1\'i [+] açarken FBPaz-1\'i [-] kapatarak kısır döngüyü önler!)',
              'Allosterik Enerji İnhibitörü: AMP (Sinerjistik olarak F2,6BP ile birlikte FBPaz-1\'i bloke eder)',
              'Hormonal: İnsülin (F2,6BP düzeyini artırarak inhibe eder)'
            ],
            crossConnections: [
              { targetPathway: 'glikoliz', label: '🔄 PFK-1 ile Karşılıklı (Resiprokal) Kontrol Noktası: F2,6BP ve AMP ikilisi bu kavşakta akışın Glikoliz mi yoksa Glukoneogenez mi olacağını belirler.' }
            ]
          },
          {
            stepNo: 'Bypass 3 (Endoplazmik Retikulum Lümeni • Serbest Glukoz Çıkışı)',
            substrate: 'Glukoz-6-Fosfat (G6P) + H₂O',
            product: 'Serbest D-Glukoz (Kana verilir) + Pᵢ',
            cofactors: 'ER Membranında T1 (G6P taşıyıcısı), T2 (Pᵢ taşıyıcısı) ve T3 (ER glukoz taşıyıcısı; kana çıkış plazma membranındaki GLUT2 ile olur)',
            enzyme: 'Glukoz-6-Fosfataz (G6Paz) [Sadece Karaciğer ve Böbrekte vardır; Kasta ve Beyinde YOKTUR!]',
            isRateLimiting: false,
            statePreference: 'fasting',
            activators: [
              'Substrat doygunluğu: Yüksek G6P konsantrasyonu',
              'Hormonal: Glukagon ve Kortizol (Enzim sentezini artırır)'
            ],
            inhibitors: [
              'Hormonal: İnsülin',
              'Farmakolojik / Deneysel: Klorojenik asit ve Florizin türevleri (T1 translokaz inhibitörü)'
            ],
            crossConnections: [
              { targetPathway: 'glikojen', label: '🔗 Hem Glukoneogenezden hem de Karaciğer Glikojenolizinden (G1P → G6P) gelen Glukoz-6-Fosfat\'ın kana serbest glukoz olarak çıkabildiği TEK ortak kapıdır!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Von Gierke Hastalığı (GSD Tip Ia — Glukoz-6-Fosfataz /Tip Ib — T1 Translokaz Eksikliği): Hem glikojenolizin hem de glukoneogenezin son ortak çıkış kapısı kapandığı için karaciğer ve böbrek hücrelerinde devasa miktarda Glukoz-6-Fosfat (G6P) hapsolur. Bunun 4 ana patofizyolojik sonucu vardır: (1) Öğünlerden 2-3 saat sonra başlayan, epinefrin ve glukagona yanıt vermeyen ağır Açlık Hipoglisemisi; (2) Biriken G6P\'nin glikolize taşmasıyla oluşan Laktik Asidoz; (3) G6P\'nin HMP şantına taşarak aşırı Riboz-5-P → PRPP → Pürin yıkımı yapması ve laktatın renal tübülde ürat atılımını yarışmalı bloke etmesi sonucu ağır Hiperürisemi (Gut); (4) Aşırı Asetil-KoA, NADPH ve Gliserol-3-P oluşumuyla tetiklenen ağır Hipertrigliseridemi (ksantomlar, taş bebek yüzü) ve masif Hepatorenomegali. Tip Ib\'de (G6P-T1 taşıyıcı eksikliği) bunlara ek olarak nötrofil disfonksiyonu, nötropeni ve tekrarlayan bakteriyel enfeksiyonlar görülür.'
          }
        ]
      },

      // =======================================================================
      // 3. GLİKOJEN METABOLİZMASI (GLİKOJENEZ & GLİKOJENOLİZ)
      // =======================================================================
      {
        id: 'glikojen',
        number: '3',
        title: 'GLİKOJEN METABOLİZMASI (Glikojenez & Glikojenoliz)',
        compartment: 'Sitozol (Karaciğer: Kan şekeri tamponu • İskelet Kası: Kendi kasılma enerjisi)',
        netEquation: 'Glikojenez: G6P → G1P + UTP → UDP-Glukoz → Glikojen (α-1,4 & α-1,6) | Glikojenoliz: Glikojen + Pᵢ → G1P ↔ G6P',
        entryBridge: 'Glikolizin 1. basamağındaki Glukoz-6-Fosfat (G6P) kavşağından Fosfoglukomutaz enzimi ile Glukoz-1-Fosfat (G1P) oluşarak ayrılır.',
        exitBridge: 'Glikojenoliz ile açığa çıkan G1P tekrar G6P\'ye dönüşür: Karaciğerde G6Paz ile kana Glukoz olarak verilir; Kasta doğrudan Glikolize girer.',
        steps: [
          {
            stepNo: 'Köprü & Aktivasyon: G6P ↔ G1P → UDP-Glukoz',
            substrate: 'Glukoz-6-Fosfat (G6P) ↔ Glukoz-1-Fosfat (G1P)',
            product: 'UDP-Glukoz + PPᵢ (→ 2 Pᵢ)',
            cofactors: 'Fosfoglukomutaz (Glukoz-1,6-bisfosfat ara ürünü) + UDP-Glukoz Pirofosforilaz (UTP harcanır)',
            clinicalNote: 'PATOFİZYOLOJİ — Konjenital Glikozilasyon Bozukluğu (PGM1-CDG) ve Crigler-Najjar / Gilbert Bağlantısı: Fosfoglukomutaz-1 (PGM1) eksikliğinde G6P ↔ G1P dönüşümü bozulduğu için hem glikojen sentezi/yıkımı aksar hem de UDP-Glukoz ve UDP-Galaktoz eksikliği nedeniyle ER/Golgi\'de proteinlerin N-glikozilasyonu bozulur (yarık damak/bifid uvula, hepatopati, dilate kardiyomiyopati ve hipoglisemi; tedavide D-Galaktoz takviyesi kullanılır). Ayrıca UDP-Glukoz\'dan sentezlenen UDP-Glukuronat, indirekt bilirubinin UGT1A1 enzimiyle suda çözünür direkt bilirubine konjugasyonu için şarttır (UGT1A1 eksikliğinde: Gilbert sendromunda hafif ve iyi huylu indirekt hiperbilirübinemi, Crigler-Najjar Tip I’de ise ağır nörotoksik kernikterus gelişir).',
            enzyme: 'Fosfoglukomutaz  ve  UDP-Glukoz Pirofosforilaz',
            isRateLimiting: false,
            statePreference: 'fed',
            activators: [
              'İnorganik Pirofosfataz: Açığa çıkan PPᵢ\'yi hızla 2 Pᵢ\'ye hidroliz ederek reaksiyonu termodinamik olarak tek yönlü ileri çeker (+)',
              'Yüksek G6P ve UTP düzeyi'
            ],
            inhibitors: [
              'UDP ve PPᵢ birikimi'
            ],
            crossConnections: [
              { targetPathway: 'glikoliz', label: '🔗 G6P üzerinden Glikoliz ve Glukoneogenez ile doğrudan bağlıdır.' },
              { targetPathway: 'hmp', label: '🔗 UDP-Glukoz ayrıca UDP-Glukoz Dehidrogenaz ile UDP-Glukuronat\'a (Bilirubin ve ilaç detoksifikasyonu / Glukuronidasyon) bağlanır!' }
            ]
          },
          {
            stepNo: 'Glikojenez (⚡ SENTEZ HIZ KISITLAYICI BASAMAĞI) & Dallanma',
            substrate: 'UDP-Glukoz + Glikojen Primeri (Glikojenin [Tirozin ucu])',
            product: 'Glikojen [α(1→4) düz zincir + α(1→6) dallanma noktaları] + UDP',
            cofactors: 'Glikojen Sentaz (α-1,4 bağları) + Dallandırıcı Enzim [Amilo-(1,4→1,6)-transglikozilaz]',
            enzyme: 'Glikojen Sentaz [Glikojenezin Hız Kısıtlayıcı Enzimi]',
            isRateLimiting: true,
            statePreference: 'fed',
            activators: [
              'Hormonal (Kovalent Defosforilasyon): İnsülin → Protein Fosfataz-1 (PP1)\'i aktive eder ve GSK-3\'ü (Glikojen Sentaz Kinaz-3) inhibe eder → Glikojen Sentaz defosforile olarak AKTİF "a" formuna geçer!',
              'Allosterik Aktivatör: Glukoz-6-Fosfat (G6P) (Fosforile/inaktif "b" formunu bile aktive edebilir) | Serbest Glukoz (dolaylı: karaciğerde Fosforilaz a’ya bağlanarak PP1’i serbestler; PP1 Glikojen Sentaz’ı defosforile edip aktive eder)'
            ],
            inhibitors: [
              'Hormonal (Kovalent Fosforilasyon): Glukagon (Karaciğer) ve Epinefrin (Kas & Karaciğer, β-adrenerjik) → cAMP → PKA ve GSK-3 → Glikojen Sentaz\'ı fosforile ederek İNAKTİF "b" formuna çevirir!',
              'Allosterik / Geri Bildirim: Yüksek Glikojen düzeyi, Ca²⁺-Kalmodulin (kasılma sırasında sentezi durdurur)'
            ],
            crossConnections: [],
            clinicalNote: 'PATOFİZYOLOJİ — GSD Tip 0 (Glikojen Sentaz Eksikliği) ve Andersen Hastalığı (GSD Tip IV — Dallandırıcı Enzim Eksikliği): Karaciğer Glikojen Sentaz (GYS2) eksikliğinde (GSD Tip 0), karaciğerde glikojen depolanamaz (hepatomegali YOKTUR!); hastada yemekten hemen sonra glukoz glikojene çevrilemediği için postprandiyal hiperglisemi ve glukozüri, birkaç saatlik açlıkta ise ketotik hipoglisemi gelişir. Dallandırıcı enzim (GBE1) eksikliğinde (Andersen Hastalığı - GSD Tip IV) ise glikojen α(1→6) dallanmaları yapamaz; bitkisel amiloz/amilopektine benzeyen, çözünürlüğü çok düşük, uzun düz α(1→4) poli-glukozan zincirleri, yani anormal yapıda glikojen birikir. Bağışıklık sistemi bu anormal çözünmez glikojeni yabancı cisim gibi algılayarak otoimmün/inflamatuvar yanıt başlatır; erken bebeklikte ilerleyici karaciğer sirozu, portal hipertansiyon ve kalp/kas yetmezliğiyle ölüme yol açar.'
          },
          {
            stepNo: 'Glikojenoliz (⚡ YIKIM HIZ KISITLAYICI BASAMAĞI) & Dal Kırma',
            substrate: 'Glikojen (n kalıntı) + İnorganik Fosfat (Pᵢ — ATP harcanmaz, fosforoliz!)',
            product: 'Glukoz-1-Fosfat (G1P, ~%90) + Serbest Glukoz (~%10, α-1,6 dal noktasından) → G6P',
            cofactors: 'Zorunlu Koenzim: Piridoksal Fosfat (PLP / B6 Vitamini) + Dal Kırıcı Enzim (4-α-Glukanotransferaz + α-1,6-Glukozidaz)',
            enzyme: 'Glikojen Fosforilaz [Glikojenolizin Hız Kısıtlayıcı Enzimi]',
            isRateLimiting: true,
            statePreference: 'fasting',
            activators: [
              'Hormonal (Kovalent Fosforilasyon): Glukagon (Karaciğer) & Epinefrin (Kas ve Karaciğer) → cAMP → PKA → Fosforilaz Kinaz\'ı aktive eder → Glikojen Fosforilaz "b" fosforile olarak AKTİF Fosforilaz "a" formuna geçer!',
              'Sinirsel / Kasılma Sinyali (Kas): Ca²⁺-Kalmodulin (Fosforilaz Kinaz\'ın δ alt birimi Kalmodulin\'dir; kas kasılmasında artan Ca²⁺, cAMP/PKA olmadan da Fosforilaz Kinaz\'ı doğrudan aktive eder!)',
              'Allosterik (SADECE İskelet Kası!): AMP (Kasta enerji düştüğünde artan AMP, inaktif Fosforilaz "b" formunu fosforilasyona gerek kalmadan allosterik olarak aktive eder!)'
            ],
            inhibitors: [
              'Hormonal: İnsülin → PDE\'yi aktive edip cAMP\'yi düşürür ve Protein Fosfataz-1 (PP1)\'i aktive ederek Fosforilaz Kinaz ile Glikojen Fosforilaz\'ı defosforile (İnaktif "b") yapar!',
              'Allosterik (Kas & Karaciğer): ATP ve Glukoz-6-Fosfat (G6P)',
              'Allosterik (SADECE Karaciğer!): Serbest Glukoz (Toklukta karaciğere giren serbest glukoz Fosforilaz "a"ya bağlanarak konformasyonunu değiştirir ve PP1 tarafından defosforile edilmesini sağlar)'
            ],
            crossConnections: [
              { targetPathway: 'glikoliz', label: '🔗 G1P → Fosfoglukomutaz ile G6P\'ye dönüşür: Kasta doğrudan Glikolize (ATP üretimi), Karaciğerde G6Paz ile kana Serbest Glukoza gider!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Glikojen Depo Hastalıkları Ayırıcı Mekanizmaları: (1) McArdle (GSD Tip V — Kas Fosforilaz [PYGM] Eksikliği): İskelet kası egzersizde glikojeni yıkamaz; egzersizde venöz kanda Laktat yükselmez ama AMP deaminasyonu nedeniyle Amonyak (NH₃) aşırı yükselir! Ağrılı kramp ve koyu kırmızı idrar (miyoglobinüri/rabdomiyoliz) görülür; 10 dk dinlenince kasa kanla serbest yağ asitleri ve glukoz ulaştığı için egzersize devam edebilme ("İkinci Rüzgar / Second Wind" fenomeni) tipiktir. (2) Cori (GSD Tip III — Dal Kırıcı Enzim Eksikliği): Dal noktasındaki α(1→6) bağı kırılamaz (fosforilaz dal noktasına 4 glukoz kalana kadar ilerleyip durur) ve sitozolde anormal yapıda, kısa dış dallı glikojen ("Limit Dekstrin") birikir; glukoneogenez sağlam olduğu için açlık hipoglisemisi Von Gierke\'den hafiftir ve kan laktatı/ürik asidi NORMALDİR, ancak kas tutulumu (miyopati/kardiyomiyopati + CK artışı) eşlik eder. (3) Pompe (GSD Tip II — Lizozomal α-1,4-Glukozidaz [Asit Maltaz] Eksikliği): Sitozolik metabolizma tamamen normaldir (normoglisemik!); ancak otofajiyle lizozoma giren glikojen yıkılamaz, lizozomlar şişip patlayarak kalp ve iskelet kası liflerini tahrip eder ("Pompe Pompayı Bozar": Masif Kardiyomegali, gevşek bebek [floppy infant], makroglossi).' 
          }
        ]
      },

      // =======================================================================
      // 4. PENTOZ FOSFAT YOLU (HMP ŞANTI)
      // =======================================================================
      {
        id: 'hmp',
        number: '4',
        title: 'PENTOZ FOSFAT YOLU (Heksoz Monofosfat [HMP] Şantı)',
        compartment: 'Sitozol (Karaciğer, Yağ Dokusu, Adrenal Korteks, Eritrosit, Meme Bezi, Gonadlar)',
        netEquation: 'Oksidatif faz: G6P + 2 NADP⁺ + H₂O → Ribuloz-5-P + 2 NADPH + 2 H⁺ + CO₂ (ATP üretilmez ve harcanmaz!)  |  Non-oksidatif faz (net): 3 Ribuloz-5-P ⇌ 2 Fruktoz-6-P + 1 Gliseraldehit-3-P  |  4 metabolik mod: (1) NADPH ihtiyacı > R5P → non-oksidatif ürünler G6P\'ye geri döner; (2) R5P ihtiyacı > NADPH → oksidatif faz atlanır, F6P/G3P\'den R5P yapılır; (3) NADPH ve R5P eşit ihtiyaç → yalnız oksidatif faz; (4) NADPH + ATP ihtiyacı → ürünler glikolize girer',
        entryBridge: 'Glikolizin 1. basamağındaki Glukoz-6-Fosfat (G6P) kavşağından ayrılır.',
        exitBridge: 'Non-oksidatif fazda Transketolaz ve Transaldolaz enzimleriyle Fruktoz-6-Fosfat (F6P) ve Gliseraldehit-3-Fosfat (G3P) oluşturarak Glikolize kesintisiz geri bağlanır; R5P ise PRPP üzerinden nükleotid sentezine ayrılır!',
        steps: [
          {
            stepNo: 'Oksidatif Faz — Basamak 1 (⚡ HIZ KISITLAYICI BASAMAK • Tersinmez • 1. NADPH)',
            substrate: 'Glukoz-6-Fosfat (G6P) + NADP⁺',
            product: '6-Fosfoglukono-δ-lakton + NADPH + H⁺',
            cofactors: 'NADP⁺ → NADPH (G6PD, NADP⁺ bağımlı dehidrogenasyon)',
            enzyme: 'Glukoz-6-Fosfat Dehidrogenaz (G6PD) [Hız Kısıtlayıcı Enzim]',
            isRateLimiting: true,
            statePreference: 'fed',
            activators: [
              'Substrat Düzeyinde Kontrol: NADP⁺ (yüksek NADP⁺ / NADPH oranı G6PD akımını doğrudan artırır; hız NADP⁺ bulunabilirliğiyle belirlenir, NADPH ile yarışmalı inhibisyon dengelenir)',
              'Oksidatif Stres Bağlantısı: Eritrositlerde H₂O₂ detoksifikasyonu için Glutatyon Peroksidaz (Se) ve Glutatyon Redüktaz çalıştıkça NADPH tüketilir → NADP⁺ artar → G6PD aktive olur!',
              'Hormonal: İnsülin (Toklukta yağ asidi sentezi için gereken NADPH\'yi sağlamak üzere G6PD gen ekspresyonunu artırır)'
            ],
            inhibitors: [
              'En Güçlü Yarışmalı İnhibitör: NADPH (Hücrede NADPH biriktiğinde G6PD\'yi yarışmalı olarak durdurur)',
              'Allosterik (Lipogenez Freni): Uzun Zincirli Yağ Açil-KoA (Palmitoil-KoA — yağ asidi sentezi durduğunda NADPH üretimini kapatır)',
              'Steroid İnhibitör: Dehidroepiandrosteron (DHEA — memeli G6PD\'sinin yarışmasız inhibitörü)'
            ],
            crossConnections: [
              { targetPathway: 'lipogenez', label: '🔗 Üretilen NADPH; Yağ Asidi Sentezi (FAS), Kolesterol Sentezi (HMG-KoA Redüktaz), Steroid Sentezi (CYP450), Nitrik Oksit Sentezi (NOS) ve Eritrosit Glutatyon İndirgenmesini besler!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — G6PD Eksikliği ve Eritrosit Oksidatif Yıkım Mekanizması: Eritrositlerde NADPH üretiminin TEK kaynağı Pentoz Fosfat Yoludur. Üretilen NADPH, Glutatyon Redüktaz (FAD bağımlı) aracılığıyla okside glutatyonu (GSSG) indirgenmiş glutatyona (2 GSH) çevirir; GSH ise Selenyum bağımlı Glutatyon Peroksidaz ile hidrojen peroksidi (H₂O₂) suya detoksifiye eder. X\'e bağlı G6PD eksikliğinde enfeksiyonlar (nötrofilik serbest radikaller), bakla (divisin/izouramil), antimalaryaller (Primakin), Sülfonamidler, Dapson veya Nitrofurantoin alındığında H₂O₂ birikir. Biriken H₂O₂ hemoglobinin globin zincirlerindeki -SH gruplarını okside ederek çözünmez denatüre hemoglobin çökeltileri olan "Heinz Cisimcikleri"ni (metilen mavisi/kristal viyole ile boyanır) oluşturur. Dalak makrofajları bu çökeltileri eritrosit membranından ısırarak koparır ("Bite Cells / Isırılmış Hücreler") ve ağır akut hemolitik anemi, hemoglobinüri ve sarılık gelişir.'
          },
          {
            stepNo: 'Oksidatif Faz — Basamak 2 (Tersinmez Hidroliz)',
            substrate: '6-Fosfoglukono-δ-lakton + H₂O',
            product: '6-Fosfoglukonat',
            cofactors: 'H₂O (hidroliz; ATP/NADP⁺ gerekmez)',
            enzyme: '6-Fosfoglukonolaktonaz',
            isRateLimiting: false,
            statePreference: 'fed',
            activators: [
              'Substrat: 6-Fosfoglukono-δ-lakton (lakton halka hidrolizi enzimle belirgin hızlanır; spontan hidroliz de yavaş gerçekleşebilir)'
            ],
            inhibitors: [
              'Not: Belirgin allosterik düzenleme yoktur; hız kısıtlayıcı değildir. Lakton hidrolizinin gecikmesi, reaktif lakton birikimine ve yan tepkimelere yol açabilir'
            ],
            crossConnections: []
          },
          {
            stepNo: 'Oksidatif Faz — Basamak 3 (Tersinmez Oksidatif Dekarboksilasyon • 2. NADPH)',
            substrate: '6-Fosfoglukonat + NADP⁺',
            product: 'Ribuloz-5-Fosfat (5C) + CO₂ + NADPH + H⁺',
            cofactors: 'NADP⁺ → NADPH (oksidatif dekarboksilasyon)',
            enzyme: '6-Fosfoglukonat Dehidrogenaz',
            isRateLimiting: false,
            statePreference: 'fed',
            activators: [
              'Substrat/Koenzim: 6-Fosfoglukonat ve NADP⁺ (yüksek NADP⁺ / NADPH oranı akımı artırır)'
            ],
            inhibitors: [
              'Ürün İnhibisyonu: NADPH (NADP⁺ ile yarışarak enzimi baskılar)',
              'Not: Oksidatif fazın hız kısıtlayıcı basamağı G6PD\'dir; bu basamak CO₂ çıkışı ve 2. NADPH ile fazı tamamlar'
            ],
            crossConnections: []
          },
          {
            stepNo: 'Non-Oksidatif Faz — Basamak 1 (Tersinir İzomerizasyon / Epimerizasyon)',
            substrate: 'Ribuloz-5-Fosfat (Ru5P, 5C)',
            product: 'Riboz-5-Fosfat (R5P, aldoz) + Ksiluloz-5-Fosfat (Xu5P, ketoz)  [R5P → PRPP (PRPP Sentetaz) → Nükleotidler]',
            cofactors: 'Ru5P ↔ R5P: ketoz → aldoz izomerizasyonu  |  Ru5P ↔ Xu5P: C3 epimerizasyonu',
            enzyme: 'Ribuloz-5-Fosfat İzomeraz (Ru5P ↔ R5P)  &  Ribuloz-5-Fosfat 3-Epimeraz (Ru5P ↔ Xu5P)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Substrat dengesi: Hücrenin R5P (bölünen hücreler) veya NADPH/ATP (yağ dokusu/eritrosit) ihtiyacına göre iki yönde de çalışır'
            ],
            inhibitors: [
              'Not: Belirgin allosterik düzenleme yoktur; reaksiyonlar tersinirdir'
            ],
            crossConnections: [
              { targetPathway: 'lipogenez', label: '🔗 Xu5P (karaciğerde tokluk sinyali): PP2A\'yı aktive ederek ChREBP\'i defosforile eder → glikolitik ve lipojenik gen ekspresyonu artar (Harper / Lehninger)' },
              { targetPathway: 'glikoliz', label: '🔗 Xu5P → PP2A → PFK-2/FBPaz-2 defosforilasyonu → Fruktoz-2,6-Bisfosfat artışı → PFK-1 aktivasyonu (karaciğerde glikoliz uyarımı)' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Riboz-5-Fosfat İzomeraz (RPIA) Eksikliği: Çok nadir görülen otozomal resesif bir hastalıktır; lökoensefalopati ve gelişimsel bozuklukla seyreder, idrarda poliol (ribitol ve arabitol) atılımı artar.'
          },
          {
            stepNo: 'Non-Oksidatif Faz — Basamak 2 (Tersinir • 2C Aktarımı)',
            substrate: 'Ksiluloz-5-P + Riboz-5-P  |  Ksiluloz-5-P + Eritroz-4-P',
            product: 'Gliseraldehit-3-P (G3P) + Sedoheptuloz-7-P  |  Fruktoz-6-P (F6P) + G3P',
            cofactors: 'Tiyamin Pirofosfat (TPP / B1 Vitamini) + Mg²⁺ (2C glikoaldehit birimi aktarılır)',
            enzyme: 'Transketolaz (B1-TPP)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Zorunlu Koenzim (Transketolaz): Tiyamin Pirofosfat (TPP / B1 Vitamini) ve Mg²⁺',
              'Substrat yönlendirmesi: Hücrenin R5P (bölünen hücreler) veya NADPH/ATP (yağ dokusu/eritrosit) ihtiyacına göre çift yönlü çalışır'
            ],
            inhibitors: [
              'Klinik Eksiklik: Tiyamin (B1) Eksikliği (Wernicke-Korsakoff sendromu ve Beriberi\'de eritrosit Transketolaz aktivitesi düşer; tanı için eritrosit transketolaz aktivasyon testi kullanılır)',
              'Oksitiyamin (TPP antimetaboliti / yarışmalı inhibitör)'
            ],
            crossConnections: [],
            clinicalNote: 'PATOFİZYOLOJİ — Wernicke-Korsakoff Sendromu (Tiyamin / B1 Eksikliği) ve PRPP Aşırı Üretimi: Kronik alkolizm veya malnütrisyonda Tiyamin Pirofosfat (TPP) eksikliği; Transketolaz, PDH ve α-KGDH enzimlerini aynı anda felç eder. Bu hastaya tiyamin vermeden önce damardan Glukoz (dekstroz) infüzyonu yapılırsa, hızlanan glikoliz tüm kalan TPP\'yi tüketerek mamiller cisimciklerde ve talamusta akut ATP çöküşüne ve hemorajik nekroza yol açar: Konfüzyon + Oftalmopleji/Nistagmus + Ataksi (Wernicke ensefalopatisi) ve geri dönüşümsüz amnezi/konfabülasyon (Korsakoff psikozu) gelişir! Öte yandan Riboz-5-P\'den PRPP üreten PRPP Sentetaz\'ın X\'e bağlı aşırı aktivite (gain-of-function) mutasyonlarında, aşırı pürin sentezi ve yıkımı sonucu erken yaşta ağır Hiperürisemi, Gut artriti, ürik asit nefrolitiyazisi ve nörogelişimsel bozukluk ortaya çıkar.'
          },
          {
            stepNo: 'Non-Oksidatif Faz — Basamak 3 (Tersinir • 3C Aktarımı • Glikolize Geri Bağlantı)',
            junctionId: 'j-f6p',
            substrate: 'Sedoheptuloz-7-P (7C) + Gliseraldehit-3-P (G3P)',
            product: 'Eritroz-4-P (4C) + Fruktoz-6-P (F6P)',
            cofactors: 'Koenzim İSTEMEZ (3C dihidroksiaseton birimi aktarılır; aktif bölgedeki Lizin ile Schiff bazı kurar)',
            enzyme: 'Transaldolaz',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Substrat yönlendirmesi: Sedoheptuloz-7-P ve G3P artışı F6P + Eritroz-4-P oluşumunu, F6P artışı ters yönü sürer'
            ],
            inhibitors: [
              'Not: Belirgin allosterik düzenleme yoktur; akım substrat dengesine göre tersinir ilerler'
            ],
            crossConnections: [
              { targetPathway: 'glikoliz', label: '🔗 KESİNTİSİZ GERİ BAĞLANTI: Oluşan Fruktoz-6-Fosfat (Basamak 2-3 arasına) ve Gliseraldehit-3-Fosfat (Basamak 5-6 arasına) doğrudan Glikoliz omurgasına geri bağlanır!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Transaldolaz (TALDO1) Eksikliği: Nadir otozomal resesif hastalıktır; yenidoğanda hepatosplenomegali, karaciğer fonksiyon bozukluğu/siroz ve kanama eğilimi görülür. İdrarda poliol ve şeker alkolleri (eritritol, ribitol, arabitol) ile sedoheptuloz atılımı artar.'
          }
        ]
      },

      // =======================================================================
      // 5. PİRÜVAT DEHİDROGENAZ KOMPLEKSİ (PDH KÖPRÜSÜ)
      // =======================================================================
      {
        id: 'pdh',
        number: '5',
        title: 'PİRÜVAT DEHİDROGENAZ KOMPLEKSİ (PDH — Glikoliz ile TCA Arasındaki Köprü)',
        compartment: 'Mitokondri Matriksi (Pirüvat, H⁺-Pirüvat Simporter ile içeri girer)',
        netEquation: 'Pirüvat (3C) + CoA-SH + NAD⁺ → Asetil-KoA (2C) + CO₂ + NADH + H⁺ (TAMAMEN TERSİNMEZ!)',
        entryBridge: 'Glikolizin son ürünü olan Sitozolik Pirüvat (veya Laktat/Alanin\'den oluşan Pirüvat), mitokondri iç membranındaki Mitokondriyal Pirüvat Taşıyıcısı (MPC) ile matrikse girer.',
        exitBridge: 'Üretilen Asetil-KoA doğrudan TCA Döngüsüne (Sitrat Sentaz) veya Sitrat üzerinden Yağ Asidi / Kolesterol sentezine bağlanır.',
        steps: [
          {
            stepNo: 'Oksidatif Dekarboksilasyon (⚡ TERSİNMEZ MERKEZ KÖPRÜ BASAMAĞI)',
            junctionId: 'j-asetilkoa',
            substrate: 'Pirüvat (3C) + CoA-SH + NAD⁺',
            product: 'Asetil-KoA (2C) + CO₂ + NADH + H⁺',
            cofactors: '5 Zorunlu Koenzim: 1. TPP (B1), 2. Lipoik Asit (Lipoat), 3. CoA-SH (B5-Pantotenat), 4. FAD (B2), 5. NAD⁺ (B3) | E1 (Pirüvat Dehidrogenaz) + E2 (Dihidrolipoil Transasetilaz) + E3 (Dihidrolipoil Dehidrogenaz)',
            enzyme: 'Pirüvat Dehidrogenaz Kompleksi (PDH) [PDH Kinaz (-) ve PDH Fosfataz (+) ile düzenlenir]',
            isRateLimiting: true,
            statePreference: 'fed',
            activators: [
              'Kovalent Aktivasyon (PDH Fosfataz\'ı [+] Aktive Ederek E1\'i Defosforile / Aktif Yapanlar): İnsülin (yağ dokusu ve karaciğer), Ca²⁺ (kas kasılması sırasında matrikse giren Ca²⁺), Mg²⁺',
              'Allosterik Aktivasyon (PDH Kinaz\'ı [-] İnhibe Ederek PDH\'yi Aktif Tutanlar): Pirüvat (substrat bolluğu), ADP, NAD⁺, CoA-SH',
              'Farmakolojik Aktivatör: Dikloroasetat (DCA — PDH Kinaz\'ı inhibe ederek PDH\'yi aktif tutar; konjenital laktik asidoz tedavisinde kullanılır)'
            ],
            inhibitors: [
              'Kovalent İnhibisyon (PDH Kinaz\'ı [+] Aktive Ederek E1\'i Fosforile / İnaktif Yapanlar): Asetil-KoA, NADH, ATP (Yüksek enerji ve β-oksidasyon sinyalleri PDH Kinaz\'ı açarak PDH\'yi kapatır!)',
              'Doğrudan Ürün İnhibisyonu: Asetil-KoA (E2\'yi inhibe eder) ve NADH (E3\'ü inhibe eder)',
              'Ağır Metal & Toksin İnhibisyonu: Arsenit (AsO₃³⁻, üç değerlikli arsenik) ve Cıva (Hg²⁺) — E2 alt birimindeki İndirgenmiş Lipoik Asidin (-SH) sülfhidril gruplarına kovalent bağlanarak PDH, α-KGDH ve BCKDH komplekslerini felç eder!'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 1. Asetil-KoA → TCA Döngüsü (Oksaloasetat ile birleşerek Sitrat oluşturur).' },
              { targetPathway: 'lipogenez', label: '🔗 2. Asetil-KoA → Sitrat Mekiği ile Sitozole çıkarak Yağ Asidi (Palmitat) ve Kolesterol Sentezini başlatır (Karbonhidratların yağa dönüşüm yolu!).' },
              { targetPathway: 'etz', label: '🔗 3. Üretilen NADH doğrudan ETZ Kompleks I\'e elektron verir (~2.5 ATP).' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — PDH Kompleksi Eksikliği ve Arsenit Zehirlenmesi: PDH kompleksi (özellikle X\'e bağlı PDHA1 [E1α] mutasyonu) bozulduğunda, sitozolde glikolizle oluşan Pirüvat mitokondride Asetil-KoA\'ya çevrilemez ve TCA döngüsüne giremez. Hücre enerji üretemediği için yüksek beyin enerji ihtiyacına sahip fetüs/yenidoğanda korpus kallozum agenezisi, Leigh sendromu (bazal ganglion nekrozu), mikrosefali ve ağır Konjenital Laktik Asidoz (Pirüvat → Laktat ve Alanin birikimi; Laktat/Pirüvat oranı normal kalır!) gelişir. Karbonhidrat yüklemesi laktik asidozu ağırlaştırır; tedavide PDH\'yi tamamen bypass ederek doğrudan Asetil-KoA ve Asetoasetat sağlayan "Ketojenik Diyet" (yüksek yağ + saf ketojenik amino asitler olan Lösin ve Lizin), yüksek doz Tiyamin (B1) ve PDH Kinaz inhibitörü Dikloroasetat (DCA) kullanılır. Arsenit (AsO₃³⁻) ve Cıva ise E2\'deki lipoik asidin iki -SH grubunu şelatlayarak sarımsak kokulu nefes, pirinç suyu ishal ve laktik asidozla seyreden ölümcül zehirlenme yapar.'
          }
        ]
      },

      // =======================================================================
      // 6. SİTRİK ASİT DÖNGÜSÜ (TCA / KREBS DÖNGÜSÜ)
      // =======================================================================
      {
        id: 'tca',
        number: '6',
        title: 'SİTRİK ASİT DÖNGÜSÜ (TCA / Krebs / Trikarboksilik Asit Döngüsü)',
        compartment: 'Mitokondri Matriksi (Sadece Süksinat Dehidrogenaz [Kompleks II] İç Mitokondri Membranına Gömülüdür)',
        netEquation: '1 Asetil-KoA + 3 NAD⁺ + 1 FAD + 1 GDP + Pᵢ + 2 H₂O → 2 CO₂ + 3 NADH + 3 H⁺ + 1 FADH₂ + 1 GTP (Toplam = 10 ATP / Asetil-KoA)',
        entryBridge: 'PDH\'den, Yağ Asidi β-Oksidasyonundan, Ketolizden ve Ketojenik Amino Asitlerden gelen Asetil-KoA\'nın 4 karbonlu Oksaloasetat (OAA) ile birleşmesiyle başlar.',
        exitBridge: 'Hem katabolik (NADH/FADH₂ → ETZ) hem anabolik (Sitrat → Lipogenez, α-KG → AA, Süksinil-KoA → Hem, OAA/Malat → Glukoneogenez & Üre Döngüsü) amfibolik merkezdir.',
        steps: [
          {
            stepNo: 'TCA Basamak 1 (Kondenzasyon • Tersinmez Düzenleyici Basamak #1)',
            junctionId: 'j-sitrat',
            substrate: 'Asetil-KoA (2C) + Oksaloasetat (OAA, 4C) + H₂O',
            product: 'Sitrat (6C) + CoA-SH',
            cofactors: 'Sitratil-KoA ara ürünü üzerinden yüksek enerjili tiyoester hidrolizi (ΔG°′ = −31.5 kJ/mol)',
            clinicalNote: 'PATOFİZYOLOJİ — Oksaloasetat (OAA) Darboğazı ve "Karbonhidratlar Yağların Ateşinde Yanar" İlkesi: Sitrat Sentaz\'ın çalışabilmesi için ortamda mutlaka 4 karbonlu Oksaloasetat (OAA) bulunmalıdır. Uzamış açlıkta veya kontrolsüz Tip 1 Diyabette, karaciğerde OAA sürekli olarak PEPCK tarafından Glukoneogeneze çekildiği için mitokondri matriksinde OAA tükenir. Bu durumda yağ asidi β-oksidasyonundan sel gibi akan Asetil-KoA molekülleri Sitrat Sentaz üzerinden TCA döngüsüne giremez ve zorunlu olarak Ketogenez yoluna (Asetoasetat ve β-Hidroksibütirat) taşarak Diyabetik Ketoasidoz (DKA — yüksek anyon açıklı metabolik asidoz, Kussmaul solunumu, nefeste aseton kokusu) tablosunu oluşturur.',
            enzyme: 'Sitrat Sentaz (CS)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Substrat Mevcudiyeti: Oksaloasetat (OAA\'nın enzime bağlanması konformasyonel değişim yaratarak Asetil-KoA için bağlanma bölgesini oluşturur!) ve Asetil-KoA konsantrasyonu',
              'Allosterik: ADP (Düşük enerji sinyali)'
            ],
            inhibitors: [
              'Allosterik: ATP ve NADH (Yüksek enerji sinyali)',
              'Yarışmalı Geri Bildirim İnhibisyonu: Süksinil-KoA (Asetil-KoA ile yarışarak kendi üretimini geriden sınırlar!)',
              'Ürün İnhibisyonu: Sitrat',
              'Allosterik: Uzun zincirli Yağ Açil-KoA'
            ],
            crossConnections: [
              { targetPathway: 'lipogenez', label: '🔗 SİTRAT MEKİĞİ ÇIKIŞI: Toklukta İzositrat Dehidrogenaz yavaşladığında biriken Sitrat, trikarboksilat taşıyıcısıyla Sitozole çıkar → ATP-Sitrat Liyaz ile Yağ Asidi ve Kolesterol sentezini başlatır!' },
              { targetPathway: 'glikoliz', label: '🔗 Sitozole çıkan Sitrat aynı zamanda PFK-1\'i [-] inhibe ederek Glikolizi frenler.' }
            ]
          },
          {
            stepNo: 'TCA Basamak 2 (Dehidratasyon / Rehidratasyon İzomerizasyonu)',
            substrate: 'Sitrat (6C) ↔ cis-Akonitat (Ara ürün)',
            product: 'D-İzositrat (6C)',
            cofactors: 'Hem-olmayan Demir-Kükürt [4Fe-4S] kümesi içerir',
            enzyme: 'Akonitaz (Akonitat Hidrataz)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Kofaktör: Fe²⁺ (Demir-Kükürt kümesi aktif bölgede OH grubunun yerini değiştirir)'
            ],
            inhibitors: [
              'KLASİK TOKSİN (İntihar İnhibisyonu / Letal Sentez): Floroasetat (Rodentisit / fare zehiri — hücrede Floroasetil-KoA\'ya, ardından Sitrat Sentaz ile Florositrat\'a dönüşür; Florositrat Akonitaz\'ı geri dönüşümsüz bloke ederek TCA döngüsünü tamamen durdurur!)',
              'Oksidatif Stres: Süperoksit (O₂•⁻) ve Peroksinitrit ([4Fe-4S] kümesini parçalayarak enzimi inaktive eder)'
            ],
            crossConnections: [],
            clinicalNote: 'PATOFİZYOLOJİ — Floroasetat İle "Letal Sentez" (İntihar İnhibisyonu) ve Demir Homeostazı: Tarım zararlısı zehiri olan Floroasetat tek başına toksik değildir; ancak hücre içinde önce Floroasetil-KoA\'ya çevrilir, ardından Sitrat Sentaz tarafından OAA ile birleştirilerek "Florositrat"a dönüştürülür (Letal Sentez!). Florositrat, Akonitaz\'ın [4Fe-4S] aktif merkezine geri dönüşümsüz bağlanarak Sitrat → İzositrat geçişini kilitler; hücrede masif Sitrat birikir, Ca²⁺ şelasyonu (hipokalsemik tetani), hücresel ATP çöküşü, konvülsiyonlar ve ventriküler fibrilasyon gelişir. Öte yandan sitozolik Akonitaz (IRP-1), demir eksikliğinde [4Fe-4S] kümesini kaybederek apoprotein formuna geçer; Transferrin Reseptörü (TfR) mRNA\'sının 3\'-UTR bölgesindeki IRE\'lere bağlanarak yıkımını önler (hücresel demir alımını artırır) ve Ferritin mRNA\'sının 5\'-UTR bölgesine bağlanarak translasyonunu durdurur.'
          },
          {
            stepNo: 'TCA Basamak 3 (⚡ TCA HIZ KISITLAYICI BASAMAĞI • İlk CO₂ ve NADH Çıkışı)',
            junctionId: 'j-alfakg',
            substrate: 'İzositrat (6C) + NAD⁺',
            product: 'α-Ketoglutarat (5C, 2-Oksoglutarat) + CO₂ + NADH + H⁺',
            cofactors: 'Oksalosüksinat ara ürünü | Mg²⁺ veya Mn²⁺ kofaktörü',
            enzyme: 'İzositrat Dehidrogenaz (IDH) [TCA Döngüsünün Ana Hız Kısıtlayıcı Enzimi!]',
            isRateLimiting: true,
            statePreference: 'both',
            activators: [
              'En Güçlü Allosterik Aktivatör: ADP (ve bazı dokularda AMP — enerji talebi arttığında IDH\'yi hızla açar)',
              'Kasılma Sinyali: Ca²⁺ (İskelet ve kalp kasında kasılma sırasında artan Ca²⁺, IDH\'yi doğrudan aktive eder)',
              'Substrat/Koenzim: Yüksek NAD⁺ / NADH oranı, Mg²⁺ / Mn²⁺'
            ],
            inhibitors: [
              'Allosterik (Yüksek Enerji): ATP (Hücrede ATP bol olduğunda IDH kapanır → İzositrat ve Sitrat birikir → Sitrat sitozole çıkarak yağ asidi sentezine yönelir!)',
              'Allosterik / Ürün İnhibisyonu: NADH (ETZ yavaşladığında biriken NADH IDH\'yi doğrudan durdurur)'
            ],
            crossConnections: [
              { targetPathway: 'ure_aa', label: '🔗 α-KETOGLUTARAT KAVŞAĞI: α-Ketoglutarat ↔ Glutamat (Glutamat Dehidrogenaz [GDH] ve ALT/AST Transaminazlar ile) ↔ Glutamin, Prolin, Arjinin, Histidin ve GABA sentezi! Buradan ayrılan NH₄⁺ doğrudan Üre Döngüsüne girer!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — IDH1 / IDH2 Mutasyonları ve Onkometabolit D-2-Hidroksiglutarat (2-HG): Sekonder Glioblastomlarda, difüz astrositom/oligodendrogliomlarda, Akut Miyeloid Lösemide (AML) ve kondrosarkomlarda görülen somatik IDH1 (sitozolik) veya IDH2 (mitokondriyal) aktif bölge Arjinin mutasyonları, enzime yeni bir neomorfik fonksiyon kazandırır. Mutant enzim İzositrat\'ı α-KG\'ye çevirmek yerine, mevcut α-Ketoglutarat\'ı NADPH harcayarak onkometabolit olan "D-2-Hidroksiglutarat (D-2-HG)"a indirger. D-2-HG, α-KG bağımlı dioksijenazları (TET2 DNA demetilazları ve Jumonji histon demetilazları) yarışmalı olarak inhibe eder; genom çapında CpG adacık hipermetilasyonu (CIMP fenotipi) oluşur ve miyeloid/glial öncül hücrelerin farklılaşması durarak malign transformasyon gerçekleşir (Hedefe yönelik ilaçlar: İvosidenib [IDH1 inh.] ve Enasidenib [IDH2 inh.]).'
          },
          {
            stepNo: 'TCA Basamak 4 (Oksidatif Dekarboksilasyon • Tersinmez Düzenleyici Basamak #3)',
            junctionId: 'j-suksinilkoa',
            substrate: 'α-Ketoglutarat (5C) + CoA-SH + NAD⁺',
            product: 'Süksinil-KoA (4C) + CO₂ + NADH + H⁺',
            cofactors: 'PDH ile Aynı 5 Zorunlu Koenzim: TPP (B1), Lipoik Asit, CoA-SH (B5), FAD (B2), NAD⁺ (B3)',
            clinicalNote: 'PATOFİZYOLOJİ — α-KGDH Eksikliği, Dihidrolipoamid Dehidrogenaz (E3) Bozukluğu ve Nörodejenerasyon: α-KGDH kompleksi, PDH ve Dallı Zincirli Alfa-Ketoasit Dehidrogenaz (BCKDH — Akçaağaç Şurubu İdrar Hastalığı enzimi) ile aynı E3 (Dihidrolipoil Dehidrogenaz) alt birimini ve aynı 5 koenzimi (TPP, Lipoat, CoA, FAD, NAD⁺) paylaşır. E3 alt birimi mutasyonlarında (Akçaağaç Şurubu İdrar Hastalığı Tip III) her üç enzim kompleksi birden durur; hastada eşzamanlı olarak Laktik Asidoz (PDH bloğu), idrarda α-ketoglutarat artışı (α-KGDH bloğu) ve dallı zincirli amino asit/ketoasit birikimi (BCKDH bloğu) ile ağır nörolojik yıkım görülür. Ayrıca α-KGDH, mitokondride reaktif oksijen radikallerine (ROS) en duyarlı enzim olup Alzheimer ve Parkinson hastalıklarında aktivitesi belirgin şekilde azalır.',
            enzyme: 'α-Ketoglutarat Dehidrogenaz Kompleksi (α-KGDH / 2-Oksoglutarat Dehidrogenaz)',
            isRateLimiting: true,
            statePreference: 'both',
            activators: [
              'Allosterik: Ca²⁺ (Kas kasılması ve hormon sinyaliyle doğrudan aktivasyon)',
              'Allosterik: ADP ve AMP, 5 koenzim varlığı (özellikle TPP / B1)'
            ],
            inhibitors: [
              'Allosterik / Ürün İnhibisyonu: Süksinil-KoA ve NADH (Güçlü son ürün geri bildirim inhibisyonu)',
              'Allosterik: ATP ve GTP',
              'Toksin İnhibisyonu: Arsenit (AsO₃³⁻) ve Cıva (Hg²⁺) — E2 alt birimindeki Lipoik asidin -SH gruplarını bağlayarak kompleksi bloke eder!',
              'B1 (Tiyamin) Eksikliği: Wernicke ensefalopatisinde beyin α-KGDH aktivitesi ağır şekilde düşer'
            ],
            crossConnections: [
              { targetPathway: 'beta_oks', label: '🔗 1. Tek Sayıda Karbonlu Yağ Asitleri ve Valin, İzolösin, Metiyonin, Treonin → Propiyonil-KoA → D/L-Metilmalonil-KoA → Metilmalonil-KoA Mutaz (B12 Vitamini!) ile Süksinil-KoA\'ya girer!' },
              { targetPathway: 'ure_aa', label: '🔗 2. Porfirin / Hem Sentezi Çıkışı: Süksinil-KoA + Glisin → δ-Aminolevülinat (ALA Sentaz [PLP/B6] — Hem tarafından [-] inhibe edilir).' },
              { targetPathway: 'keton_kolesterol', label: '🔗 3. Ketoliz Bağlantısı: Periferik dokularda Süksinil-KoA, Tiyoforaz (SCOT) enzimiyle Asetoasetat\'ı Asetoasetil-KoA\'ya aktive eder.' }
            ]
          },
          {
            stepNo: 'TCA Basamak 5 (Substrat Düzeyinde Fosforilasyon)',
            substrate: 'Süksinil-KoA (4C) + GDP (veya ADP) + Pᵢ',
            product: 'Süksinat (4C) + GTP (veya ATP) + CoA-SH',
            cofactors: 'Yüksek enerjili tiyoester bağının kırılmasıyla fosforilasyon (Fosfohistidin ara ürünü)',
            clinicalNote: 'PATOFİZYOLOJİ — Süksinil-KoA Sentetaz (SUCLA2 / SUCLG1) Eksikliği ve Mitokondriyal DNA Tükenme Sendromu: Süksinil-KoA Sentetaz, TCA döngüsünde doğrudan yüksek enerjili fosfat bağı (GTP veya ATP) üreten tek substrat düzeyinde fosforilasyon basamağıdır. Enzimin alt birimleri aynı zamanda mitokondriyal Nükleozid Difosfat Kinaz (NDPK) ile fiziksel kompleks oluşturarak mitokondriyal DNA (mtDNA) replikasyonu için gereken dNTP havuzunu korur. SUCLA2/SUCLG1 mutasyonlarında hem TCA akışı bozulur hem de mtDNA sentezi çökerek ağır ensefalomiyopati, distoni, işitme kaybı, laktik asidoz ve Süksinil-KoA\'nın geriye doğru birikmesine bağlı hafif "Metilmalonik Asidüri" gelişir.',
            enzyme: 'Süksinil-KoA Sentetaz (Süksinat Tiyokinaz)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Substrat bolluğu: Süksinil-KoA, GDP/ADP ve Pᵢ (Mg²⁺ bağımlı)'
            ],
            inhibitors: [
              'Ürün birikimi: Yüksek GTP ve Süksinat'
            ],
            crossConnections: [
              { targetPathway: 'glukoneogenez', label: '🔗 Burada üretilen GTP, mitokondriyal PEPCK enzimine doğrudan fosfat vericisi olarak hizmet ederek Glukoneogenezi destekler!' }
            ]
          },
          {
            stepNo: 'TCA Basamak 6 (Dehidrogenasyon • ETZ Kompleks II ile Ortak Enzim!)',
            substrate: 'Süksinat (4C) + FAD (Enzime kovalent bağlı)',
            product: 'Fumarat (4C, trans izomer) + FADH₂ (→ CoQ / Ubikinon)',
            cofactors: 'FAD (Kovalent bağlı) + 3 adet Demir-Kükürt (Fe-S) merkezi (İç Mitokondri Membranına Gömülü TEK TCA Enzimi)',
            clinicalNote: 'PATOFİZYOLOJİ — SDH (Kompleks II) Mutasyonları, Onkometabolit Süksinat ve Feokromositoma / Paraganglioma: Süksinat Dehidrogenaz (SDHB, SDHD, SDHC, SDHA genleri) klasik bir tümör baskılayıcı kompleks olarak çalışır. Fonksiyon kaybı mutasyonlarında veya Malonat blokajında mitokondride biriken Süksinat sitozole çıkar ve Prolil Hidroksilaz (PHD) enzimini (α-KG bağımlı) yarışmalı olarak inhibe eder. PHD çalışamayınca Hipoksi İle İndüklenen Faktör-1α (HIF-1α) normokside bile parçalanamaz ("Psödohipoksi"); çekirdeğe geçerek VEGF ve GLUT1 sentezini uyarır ve yüksek damarlanmalı ailesel Feokromositoma, Paraganglioma ve Gastrointestinal Stromal Tümör (GİST) gelişimine yol açar.',
            enzyme: 'Süksinat Dehidrogenaz (SDH — ETZ Kompleks II)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Allosterik: Süksinat, Pᵢ, ATP ve İndirgenmiş Koenzim Q (CoQH₂)'
            ],
            inhibitors: [
              'KLASİK YARIŞMALI İNHİBİTÖR: Malonat (3 karbonlu dikarboksilik asit; Süksinat\'ın yapısal analoğudur ve aktif bölgeye bağlanarak SDH\'yi yarışmalı olarak bloke eder!)',
              'Güçlü Allosterik İnhibitör: Oksaloasetat (OAA — döngü sonunda OAA biriktiğinde SDH\'yi frenler)',
              'ETZ Kompleks II İnhibitörleri: Karboksin ve TTFA (Tenoiltrifloroaseton — elektronların Fe-S\'den CoQ\'ya geçişini bloke eder)'
            ],
            crossConnections: [
              { targetPathway: 'etz', label: '🔗 DOĞRUDAN ETZ BAĞLANTISI: Süksinat Dehidrogenaz bizzat ETZ Kompleks II\'dir! Elektronları FADH₂ üzerinden Kompleks I\'i atlayarak doğrudan Koenzim Q\'ya (Ubikinon) aktarır (~1.5 ATP).' }
            ]
          },
          {
            stepNo: 'TCA Basamak 7 & 8 (Hidratasyon & Son Oksidasyon → OAA Yenilenmesi)',
            junctionId: 'j-fumarat-oaa',
            substrate: 'Fumarat (4C) + H₂O ↔ L-Malat (4C) + NAD⁺',
            product: 'Oksaloasetat (OAA, 4C) + NADH + H⁺  [Döngü 1. Basamağa Kesintisiz Kapanır!]',
            cofactors: 'Fumaraz (Fumarat Hidrataz — stereospesifik trans katılma) + Malat Dehidrogenaz (MDH)',
            clinicalNote: 'PATOFİZYOLOJİ — Fumaraz Eksikliği ve Herediter Leiomiyomatozis-Renal Hücreli Karsinom (HLRCC): Homozigot Fumaraz (FH) eksikliğinde hem TCA döngüsü hem de Üre Döngüsünden gelen fumaratın geri dönüşümü durur; bebeklikte ağır ensefalopati, nöbetler ve idrarda fumarik/süksinik asit artışı görülür. Heterozigot germline FH mutasyonlarında ise biriken Fumarat (tıpkı Süksinat gibi) α-KG bağımlı prolil hidroksilazları inhibe edip HIF-1α\'yı aktive ederek ve KEAP1 proteinini süksinile edip NRF2\'yi açarak deride ve uterusta multipl leiomyomlar ile son derece agresif "Tip 2 Papiller Renal Hücreli Karsinom (HLRCC)" gelişimine neden olur.',
            enzyme: 'Fumaraz (Fumarat Hidrataz)  ve  Malat Dehidrogenaz (MDH)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Termodinamik Çekiş (ÇOK ÖNEMLİ!): MDH reaksiyonunun standart serbest enerjisi oldukça pozitiftir (ΔG°′ = +29.7 kJ/mol); ancak Sitrat Sentaz\'ın OAA\'yı hızla tüketmesi (çok düşük matriks [OAA]) reaksiyonu sürekli ileri (OAA yönüne) çeker!',
              'Yüksek NAD⁺ / Düşük NADH oranı'
            ],
            inhibitors: [
              'Yüksek NADH / NAD⁺ Oranı: Etanol metabolizması veya hipokside artan NADH, reaksiyonu ters yöne (OAA → Malat) çevirerek hem TCA döngüsünü hem Glukoneogenezi durdurur!',
              'Fumaraz İnhibitörü: Mezo-tartarat (Yarışmalı)'
            ],
            crossConnections: [
              { targetPathway: 'ure_aa', label: '🔗 KREBS BİSİKLETİ (TCA ↔ ÜRE DÖNGÜSÜ KÖPRÜSÜ): Üre döngüsünde Arjininosüksinat Liyaz ile açığa çıkan Fumarat buraya (Malat → OAA) girer; OAA ise AST ile Aspartat\'a dönüşerek tekrar Üre Döngüsüne (ASS basamağına) azot taşır!' },
              { targetPathway: 'glukoneogenez', label: '🔗 Malat, iç mitokondri membranından sitozole çıkarak Glukoneogenez için OAA → PEP üretir.' }
            ]
          }
        ]
      },

      // =======================================================================
      // 7. ELEKTRON TAŞIMA ZİNCİRİ (ETZ) VE OKSİDATİF FOSFORİLASYON
      // =======================================================================
      {
        id: 'etz',
        number: '7',
        title: 'ELEKTRON TAŞIMA ZİNCİRİ (ETZ) VE OKSİDATİF FOSFORİLASYON',
        compartment: 'İç Mitokondri Membranı (Kristalar) & Zarlar Arası Boşluk (Proton Gradyenti)',
        netEquation: 'NADH → Kompleks I → CoQ → Kompleks III → Sit c → Kompleks IV → ½ O₂ (10 H⁺ pompalanır ≈ 2.5 ATP) | FADH₂ → CoQ → III → IV (6 H⁺ ≈ 1.5 ATP)',
        entryBridge: 'Glikoliz (mekikler), PDH, TCA Döngüsü, Yağ Asidi β-Oksidasyonu ve Ketolizden gelen tüm NADH ve FADH₂ koenzimleri elektronlarını buraya boşaltır.',
        exitBridge: 'Yenilenen NAD⁺ ve FAD koenzimleri tüm dehidrogenaz basamaklarına geri dönerken, üretilen ATP tüm anabolik yolakları (Glukoneogenez, Üre döngüsü, Lipogenez) besler.',
        steps: [
          {
            stepNo: 'ETZ Giriş Kapıları: Kompleks I ve Kompleks II → Koenzim Q (Ubikinon) Havuzu',
            junctionId: 'j-etz',
            substrate: 'NADH + H⁺ (Kompleks I)  ve  Süksinat / FADH₂ / Açil-KoA / Gliserol-3-P (Kompleks II, ETF ve Mitokondriyal Gliserol-3-P Dehidrogenaz)',
            product: 'İndirgenmiş Ubikinol (CoQH₂) + 4 H⁺ (Kompleks I\'den zarlar arası boşluğa pompalanır; Kompleks II 0 H⁺ pompalar!)',
            cofactors: 'Kompleks I: FMN + Fe-S kümeleri | Kompleks II: FAD + Fe-S | Hareketli Taşıyıcı: Koenzim Q₁₀ (Ubikinon — lipit çözünür)',
            clinicalNote: 'PATOFİZYOLOJİ — Kompleks I Bozuklukları (LHON, MELAS, Parkinson) ve Metformin Etkisi: Mitokondriyal DNA (mtDNA) mutasyonlarında en sık etkilenen yapı Kompleks I\'dir; Leber\'in Herediter Optik Nöropatisi (LHON — genç erişkinde ağrısız santral görme kaybı) ve MELAS (Mitokondriyal Ensefalomiyopati, Laktik Asidoz ve İnme Benzeri Ataklar) gelişir. Ayrıca Rotenon ve MPTP/MPP⁺ toksinleri dopaminerjik substantia nigra nöronlarında Kompleks I\'i seçici bloke ederek Parkinson hastalığına yol açar. Tip 2 diyabet ilacı Metformin ise hepatositlerde Kompleks I\'i hafif ve geri dönüşümlü inhibe ederek hücre içi AMP/ATP oranını artırır; aktifleşen AMPK hem glukoneogenez genlerini (PEPCK/G6Paz) hem de lipogenezi (ACC) baskılar.',
            enzyme: 'Kompleks I (NADH-CoQ Oksidoredüktaz)  &  Kompleks II (Süksinat-CoQ Redüktaz)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Solunum Kontrolü (Akseptör Kontrolü): Yüksek ADP ve Pᵢ konsantrasyonu (ATP kullanıldıkça proton gradyenti boşalır ve elektron akışı hızlanır)',
              'Yüksek matriks NADH/NAD⁺ oranı ve Koenzim Q mevcudiyeti'
            ],
            inhibitors: [
              'KOMPLEKS I İNHİBİTÖRLERİ (NADH → CoQ geçişini bloke eder): Rotenon (balık/böcek zehiri), Amobarbital / Amital (barbitürat), Pierisidin A (antibiyotik), MPP⁺ (Parkinson modeli toksini), Metformin (kısmi/hafif Kompleks I inhibisyonu ile AMP/ATP oranını artırıp AMPK\'yi aktive eder!)',
              'KOMPLEKS II İNHİBİTÖRLERİ: Malonat (yarışmalı), Karboksin, TTFA (Tenoiltrifloroaseton)',
              'Statin Yan Etkisi: Statinler HMG-KoA Redüktaz\'ı inhibe ederken Farnezil-PP üzerinden Koenzim Q₁₀ (Ubikinon) sentezini de azaltabilir (Statin miyopatisi bağlantısı)'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 TCA\'daki IDH, α-KGDH ve MDH ile PDH\'den gelen NADH → Kompleks I\'e; SDH\'den gelen FADH₂ → Kompleks II\'ye bağlanır.' },
              { targetPathway: 'beta_oks', label: '🔗 β-Oksidasyonun 1. basamağındaki Açil-KoA Dehidrogenaz (FADH₂), elektronlarını ETF ve ETF:CoQ Oksidoredüktaz üzerinden doğrudan CoQ havuzuna aktarır!' }
            ]
          },
          {
            stepNo: 'Kompleks III ve Kompleks IV (Sitokrom Zinciri & O₂\'nin Suya İndirgenmesi)',
            substrate: 'CoQH₂ + 2 Sitokrom c (Fe³⁺) [Kompleks III]  →  2 Sitokrom c (Fe²⁺) + ½ O₂ + 2 H⁺ [Kompleks IV]',
            product: 'H₂O + Pompalanan Protonlar (Kompleks III: 4 H⁺ [Q Döngüsü] + Kompleks IV: 2 H⁺)',
            cofactors: 'Kompleks III: Sit b_L, b_H, Sit c₁, Rieske Fe-S | Hareketli Taşıyıcı: Sitokrom c (Suda çözünür!) | Kompleks IV: Sit a, Sit a₃ ve Bakır merkezleri (Cu_A ve Cu_B)',
            enzyme: 'Kompleks III (Sitokrom bc₁ Kompleksi)  →  Kompleks IV (Sitokrom c Oksidaz)',
            isRateLimiting: true,
            statePreference: 'both',
            activators: [
              'Yüksek ADP / Düşük Proton Motor Kuvveti (Δp)',
              'O₂ (Moleküler oksijen — son elektron alıcısı) ve Bakır (Cu²⁺) / Demir (Hem) kofaktörleri'
            ],
            inhibitors: [
              'KOMPLEKS III İNHİBİTÖRLERİ (Sit b → Sit c₁ geçişini bloke eder): Antimisin A (Streptomyces antibiyotiği), Miksotiyazol, Dimerkaprol (BAL)',
              'KOMPLEKS IV ÖLÜMCÜL İNHİBİTÖRLERİ (Sit a₃ - Cu_B merkezini bloke eder): Siyanür (CN⁻ — Fe³⁺ formuna yüksek afiniteyle bağlanır!), Karbonmonoksit (CO — Fe²⁺ formuna bağlanır), Hidrojen Sülfür (H₂S), Sodyum Azid (NaN₃)'
            ],
            crossConnections: [],
            clinicalNote: 'PATOFİZYOLOJİ — Siyanür (CN⁻) ve Karbonmonoksit (CO) Zehirlenmelerinin Biyokimyasal Mekanizması: Yangın dumanı, acı badem veya Sodyum Nitroprussid infüzyonuyla alınan Siyanür (CN⁻), Kompleks IV\'teki Sitokrom a₃\'ün ferrik (Fe³⁺) demirine yüksek afiniteyle bağlanarak elektronların moleküler oksijene (O₂) aktarımını anında durdurur ("Histotoksik Hipoksi"). Dokular kandaki oksijeni hiç kullanamadığı için venöz kan bile arteriyel kan gibi parlak kırmızı kalır (venöz pO₂ yükselir, arteriyo-venöz O₂ farkı kapanır), hücreler tamamen anaerobik glikolize geçer ve dakikalar içinde ölümcül Laktik Asidoz gelişir. Tedavide: (1) Hidroksikobalamin (B12a) doğrudan CN⁻\'yi bağlayarak idrarla atılan Siyanokobalamin (B12) oluşturur; (2) Amil/Sodyum Nitrit ise hemoglobindeki Fe²⁺\'yi Fe³⁺\'e (Methemoglobin) okside ederek CN⁻\'yi Kompleks IV\'ten koparıp Siyanomethemoglobin\'e çeker, ardından verilen Sodyum Tiyosülfat karaciğer Rhodanese enzimiyle onu Tiyosiyanat\'a çevirir. Karbonmonoksit (CO) ise hem Kompleks IV\'ün hem de Hemoglobinin Fe²⁺ formuna bağlanarak karboksihemoglobin oluşturur ve O₂ eğrisini sola kaydırır.'
          },
          {
            stepNo: 'Kompleks V (F₀F₁ ATP Sentaz) & Kemiozmotik Eşleşme (Mitchell Hipotezi)',
            substrate: 'ADP + Pᵢ + Zarlar Arası Boşluktan Matrikse Akan Protonlar (~4 H⁺ / ATP)',
            product: 'ATP + H₂O  (ANT [Adenin Nükleotid Translokaz] ile Sitozole taşınır)',
            cofactors: 'F₀ (Membran içi proton kanalı — "o"ligomisin duyarlı) + F₁ (Matrikse bakan katalitik başlık — γ alt birimi döner motor)',
            clinicalNote: 'PATOFİZYOLOJİ — Kemiozmotik Ayırıcılar (Uncouplers: 2,4-DNP, Aspirin, UCP-1) vs. Oligomisin Blokajı: İç mitokondri membranı normalde protonlara (H⁺) geçirimsizdir; protonlar matrikse sadece F₀ kanalı üzerinden dönerken ATP üretilir. Lipofilik zayıf asitler olan 2,4-Dinitrofenol (2,4-DNP, eski zayıflama ilacı) ve yüksek doz Salisilat (Aspirin zehirlenmesi), zarlar arası boşluktan H⁺ alıp matrikse taşıyarak proton gradyentini (Δp) sıfırlar. Sonuçta ATP sentezi durur, ancak Kompleks I-IV üzerindeki karşı-basınç kalktığı için elektron taşıma hızı, NADH oksidasyonu ve O₂ tüketimi maksimuma çıkar; tüm serbest enerji ISI olarak yayılır ve terleme, taşikardi, solunumsal alkaloz + metabolik asidoz ve ölümcül "Hipertermi" gelişir! Yenidoğanların kahverengi yağ dokusundaki fizyolojik ayırıcı protein Termogenin (UCP-1) ise soğukta Norepinefrin → β₃-reseptör → cAMP → PKA → HSL ile serbestleşen yağ asitleri tarafından aktive edilerek titremesiz ısı (non-shivering thermogenesis) üretir.',
            enzyme: 'Kompleks V (F₀F₁ ATP Sentaz)  ve  Adenin Nükleotid Translokaz (ANT)',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Proton Motor Kuvveti (Δp): Elektriksel potansiyel farkı (ΔΨ) + pH gradyenti (ΔpH)',
              'AYIRICILAR (Uncouplers — DİKKAT: ATP sentezini [-] durdururken, proton gradyentini yıktıkları için ETZ elektron akışını, O₂ tüketimini, NADH oksidasyonunu ve ISI üretimini [+] MAKSİMUM hıza çıkarırlar!): 2,4-Dinitrofenol (2,4-DNP), Termogenin (UCP-1 — Kahverengi yağ dokusunda fizyolojik soğuk adaptasyonu), Yüksek doz Aspirin (Salisilat — zehirlenmede hipertermi nedeni!)'
            ],
            inhibitors: [
              'ATP SENTAZ DOĞRUDAN İNHİBİTÖRLERİ (Hem ATP sentezini hem de proton birikimi nedeniyle O₂ tüketimini [-] durdurur!): Oligomisin (F₀ proton kanalını tıkar), Disikloheksilkarbodiimid (DCCD — F₀\'ı bloke eder), Aurovertin (F₁\'i bloke eder)',
              'ANT (ADP/ATP Taşıyıcı) İNHİBİTÖRLERİ: Atraktilozit (Sitozolik yüzden bağlanır) ve Bongkrekik Asit (Matriks yüzünden bağlanır; ADP içeri giremediği için ATP Sentaz ve ETZ durur)',
              'İYONOFORLAR (Membran potansiyelini bozar): Valinomisin (K⁺ iyonoforu), Nigerisin (K⁺/H⁺ değişimi)'
            ],
            crossConnections: [
              { targetPathway: 'glikoliz', label: '🔗 Üretilen ATP sitozole geçtiğinde PFK-1 ve Pirüvat Kinaz\'ı [-] frenlerken (Pasteur Etkisi), Glukoneogenez, Üre Döngüsü ve Yağ Asidi Sentezini [+] besler!' }
            ]
          }
        ]
      },

      // =======================================================================
      // 8. YAĞ ASİDİ SENTEZİ (DE NOVO LİPOGENEZ) VE TAG SENTEZİ
      // =======================================================================
      {
        id: 'lipogenez',
        number: '8',
        title: 'YAĞ ASİDİ SENTEZİ (De Novo Lipogenez) VE TRİAÇİLGLİSEROL (TAG) SENTEZİ',
        compartment: 'Sitozol (Karaciğer, Emziren Meme Bezi, Yağ Dokusu) & ER (TAG Sentezi ve Uzatma)',
        netEquation: '8 Asetil-KoA + 7 ATP + 14 NADPH + 14 H⁺ → 1 Palmitat (16C) + 8 CoA-SH + 7 ADP + 7 Pᵢ + 14 NADP⁺ + 6 H₂O',
        entryBridge: 'Toklukta Glikoliz → PDH → TCA\'da oluşan Mitokondriyal Sitrat, sitozole çıkarak Sitozolik Asetil-KoA sağlar; HMP Şantı ve Malik Enzim ise 14 NADPH sağlar.',
        exitBridge: 'Sentezlenen Palmitat (16C) → Açil-KoA\'ya çevrilip Glikolizden (DHAP) gelen Gliserol-3-Fosfat ile birleşerek Triaçilgliserol (TAG / VLDL) oluşturur.',
        steps: [
          {
            stepNo: 'Lipogenez Basamak 1: Sitrat Mekiği ve Sitozolik Asetil-KoA + NADPH Üretimi',
            substrate: 'Mitokondriyal Sitrat (6C) + ATP + CoA-SH  [Trikarboksilat Taşıyıcısı ile Sitozole Çıkar]',
            product: 'Sitozolik Asetil-KoA (2C) + Oksaloasetat (→ Malat → Malik Enzim ile Pirüvat + NADPH)',
            cofactors: 'ATP-Sitrat Liyaz (ATP harcar) + Malik Enzim (NADP⁺ → NADPH + CO₂)',
            clinicalNote: 'PATOFİZYOLOJİ — ATP-Sitrat Liyaz (ACL) Hedefli Hiperkolesterolemi Tedavisi (Bempedoik Asit): Toklukta aşırı karbonhidrat alımı sonrası mitokondriden sitozole çıkan Sitrat, ACL enzimiyle hem de novo yağ asidi sentezinin hem de kolesterol sentezinin ortak öncülü olan Sitozolik Asetil-KoA\'ya çevrilir. Yeni nesil oral hipolipidemik ilaç olan Bempedoik Asit bir ön-ilaçtır (prodrug); onu aktif bempedoil-KoA formuna dönüştüren "Çok Uzun Zincirli Açil-KoA Sentetaz-1 (ACSVL1)" enzimi sadece karaciğerde bulunur, iskelet kasında BULUNMAZ! Bu sayede Bempedoik Asit karaciğerde ACL\'yi inhibe ederek kolesterol sentezini düşürüp LDL reseptörlerini artırırken, statinlerin aksine iskelet kasında miyopati/rabdomiyoliz yan etkisi yapmaz.',
            enzyme: 'ATP-Sitrat Liyaz (ACL)  ve  Malik Enzim',
            isRateLimiting: false,
            statePreference: 'fed',
            activators: [
              'Hormonal: İnsülin (ATP-Sitrat Liyaz\'ı fosforilasyon/gen indüksiyonu ile aktive eder)',
              'Metabolik: Mitokondride yüksek ATP ve NADH nedeniyle IDH\'nin yavaşlaması ve Sitrat birikimi'
            ],
            inhibitors: [
              'Farmakolojik İnhibitör: Bempedoik Asit (Karaciğerde aktifleşerek ATP-Sitrat Liyaz\'ı [ACL] inhibe eden kolesterol ve lipogenez düşürücü ilaç!)',
              'Doğal İnhibitör: Hidroksisitrat (Garcinia cambogia ekstresi — ACL yarışmalı inhibitörü)',
              'Geri Bildirim: Uzun zincirli Açil-KoA (asıl olarak Sitrat taşınımını ve ACC’yi inhibe eder)'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 TCA Döngüsünün 1. basamağındaki Sitrat\'tan doğrudan ayrılır; oluşan Pirüvat tekrar mitokondriye döner.' },
              { targetPathway: 'keton_kolesterol', label: '🔗 Sitozolik Asetil-KoA aynı zamanda Kolesterol Sentezinin (HMG-KoA Redüktaz) başlangıç substratıdır!' }
            ]
          },
          {
            stepNo: 'Lipogenez Basamak 2 (⚡ YAĞ ASİDİ SENTEZİ HIZ KISITLAYICI BASAMAĞI)',
            substrate: 'Sitozolik Asetil-KoA (2C) + HCO₃⁻ + ATP',
            product: 'Malonil-KoA (3C) + ADP + Pᵢ',
            cofactors: 'Zorunlu Koenzim: Biyotin (B7 Vitamini — ABC Karboksilaz)',
            clinicalNote: 'PATOFİZYOLOJİ — Asetil-KoA Karboksilaz (ACC), Malonil-KoA Anahtarı ve Metabolik Disfonksiyonla İlişkili Steatotik Karaciğer Hastalığı (MASLD; eski adıyla NAFLD): İnsülin direnci ve hiperinsülinemi durumunda karaciğerde SREBP-1c sürekli aktif kalarak ACC enzimini uyarır ve yüksek miktarda Malonil-KoA üretilir. Artan Malonil-KoA bir yandan FAS üzerinden Palmitat ve Triaçilgliserol (VLDL) sentezini sürerken, diğer yandan mitokondri dış membranındaki CPT-I enzimini allosterik olarak bloke ederek yağ asitlerinin β-oksidasyonla yıkılmasını engeller; sonuçta hepatositlerde makroveziküler yağ birikimi (hepatosteatoz) ve hipertrigliseridemi gelişir.',
            enzyme: 'Asetil-KoA Karboksilaz (ACC) [Yağ Asidi Sentezinin Hız Kısıtlayıcı Enzimi]',
            isRateLimiting: true,
            statePreference: 'fed',
            activators: [
              'En Güçlü Allosterik Aktivatör: Sitrat (İnaktif ACC dimerlerini birleştirerek AKTİF filamentöz polimerlere dönüştürür!)',
              'Hormonal (Kovalent Defosforilasyon): İnsülin → Protein Fosfataz-2A (PP2A) aktivasyonu ile ACC\'yi defosforile (AKTİF) hale getirir',
              'Transkripsiyonel: İnsülin + Yüksek Karbonhidrat → SREBP-1c ve ChREBP üzerinden ACC ve FAS gen sentezini artırır'
            ],
            inhibitors: [
              'Allosterik (Son Ürün Geri Bildirimi): Palmitoil-KoA (16C) ve diğer Uzun Zincirli Yağ Açil-KoA\'lar (Aktif ACC polimerlerini yıkarak inaktif dimerlere ayırır!)',
              'Hormonal / Enerji (Kovalent Fosforilasyon): Glukagon & Epinefrin (PKA yoluyla) ve AMPK (AMP-bağımlı Protein Kinaz — düşük enerji / egzersiz veya Metformin etkisiyle ACC\'yi fosforile ederek İNAKTİVE eder!)',
              'Besinsel: Avidin (Biyotin bağlayıcı)'
            ],
            crossConnections: [
              { targetPathway: 'beta_oks', label: '🛑 KRİTİK KARŞILIKLI KONTROL OKU: Burada üretilen Malonil-KoA, mitokondri dış membranındaki CPT-I (Karnitin Palmitoiltransferaz-I) enzimini [-] doğrudan bloke ederek yeni sentezlenen yağ asitlerinin aynı anda β-oksidasyonla yıkılmasını önler!' }
            ]
          },
          {
            stepNo: 'Lipogenez Basamak 3: Yağ Asidi Sentaz (FAS) Kompleksi & TAG Sentezi Bağlantısı',
            substrate: '1 Asetil-KoA + 7 Malonil-KoA + 14 NADPH  [ve Glikolizden gelen Gliserol-3-Fosfat]',
            product: 'Palmitat (16:0) → Palmitoil-KoA + Gliserol-3-P → Fosfatidik Asit → DAG → Triaçilgliserol (TAG)',
            cofactors: 'FAS Kompleksi: ACP (Açil Taşıyıcı Protein — 4\'-Fosfopantetein [B5 Vitamini / Pantotenik Asit türevi!]) | 4 Adımlı Döngü: Kondenzasyon (-CO₂) → İndirgeme (NADPH) → Dehidratasyon (-H₂O) → İndirgeme (NADPH)',
            clinicalNote: 'PATOFİZYOLOJİ — De Novo Lipogenez, Pantotenik Asit (B5) ve Tümör Metabolizması: Yağ Asidi Sentaz (FAS) kompleksinin merkezindeki Açil Taşıyıcı Protein (ACP), B5 vitamini (Pantotenik asit) türevi olan 4\'-fosfopantetein prostetik kolunu kullanarak uzayan yağ asidi zincirini 7 katalitik bölge arasında taşır. Normal erişkin dokularda (karaciğer, yağ dokusu ve laktasyondaki meme bezi hariç) FAS ekspresyonu çok düşüktür; ancak meme, prostat ve kolon kanseri hücrelerinde yeni membran fosfolipitleri üretmek için FAS (FASN) aşırı eksprese edilir ve onkolojik ilaç hedefi olarak kullanılır.',
            enzyme: 'Yağ Asidi Sentaz Kompleksi (FAS — Çok İşlevli Dimer)  &  Açiltransferazlar (TAG Sentezi)',
            isRateLimiting: false,
            statePreference: 'fed',
            activators: [
              'Hormonal & Transkripsiyonel: İnsülin (SREBP-1c üzerinden FAS ekspresyonunu artırır ve Lipoprotein Lipaz [LPL] enzimini aktive eder)',
              'Substrat Bolluğu: Yeterli Malonil-KoA ve NADPH (HMP Şantı ve Malik Enzimden) | Transkripsiyonel: SREBP-1c ve ChREBP (bazı kaynaklarda fosforile şekerlerin allosterik etkisi de belirtilir)'
            ],
            inhibitors: [
              'Hormonal: Glukagon ve Açlık (Serbest yağ asitleri FAS ekspresyonunu baskılar)',
              'Farmakolojik / Deneysel: Serulenin (β-ketoasil sentaz bölgesi), Orlistat (tiyoesteraz bölgesi; asıl hedefi pankreatik lipazdır) / Triklosan (enoil redüktaz)'
            ],
            crossConnections: [
              { targetPathway: 'glikoliz', label: '🔗 TAG Sentezi Köprüsü: Yağ dokusunda Gliserol Kinaz OLMADIĞI için, TAG sentezi için gereken Gliserol-3-Fosfat toklukta ZORUNLU OLARAK Glikolizdeki DHAP\'tan (İnsülin → GLUT4 ile glukoz girişi sayesinde) karşılanır; açlıkta Gliseroneogenez ile Pirüvat/Laktat’tan da yapılabilir!' },
              { targetPathway: 'hmp', label: '🔗 Her 1 Palmitat molekülü için gereken 14 NADPH\'nin büyük kısmı Pentoz Fosfat Yolu (HMP Şantı) tarafından sağlanır.' }
            ]
          }
        ]
      },

      // =======================================================================
      // 9. LİPOLİZ VE YAĞ ASİDİ BETA-OKSİDASYONU
      // =======================================================================
      {
        id: 'beta_oks',
        number: '9',
        title: 'LİPOLİZ, KARNİTİN MEKİĞİ VE YAĞ ASİDİ BETA-OKSİDASYONU',
        compartment: 'Yağ Dokusu Sitozolü (Lipoliz) → Mitokondri Matriksi (β-Oksidasyon) [Çok Uzun Zincirliler ≥22C: Peroksizom]',
        netEquation: 'Palmitoil-KoA (16C) + 7 FAD + 7 NAD⁺ + 7 CoA-SH + 7 H₂O → 8 Asetil-KoA + 7 FADH₂ + 7 NADH + 7 H⁺ (Net = 106 ATP / Palmitat)',
        entryBridge: 'Açlıkta yağ dokusunda TAG yıkımıyla (HSL) kana salınan Serbest Yağ Asitleri (Albümine bağlı taşınır) dokulara girer; Gliserol ise Karaciğer Glukoneogenezine bağlanır.',
        exitBridge: 'Üretilen 8 Asetil-KoA; Kas/Kalpte doğrudan TCA Döngüsüne, Karaciğerde ise Ketogeneze ve Pirüvat Karboksilaz (+) aktivasyonuna bağlanır. Tek sayıda karbonlu yağ asitlerinden çıkan Propiyonil-KoA (3C) → Süksinil-KoA üzerinden TCA ve Glukoneogeneze girer!',
        steps: [
          {
            stepNo: 'Basamak 1: Yağ Dokusunda Lipoliz (TAG Yıkımı) & Yağ Asidi Aktivasyonu',
            substrate: 'Triaçilgliserol (TAG) → Serbest Yağ Asidi + Gliserol | Sitozolde: Yağ Asidi + ATP + CoA-SH',
            product: 'Yağ Açil-KoA + AMP + PPᵢ (Aktivasyon 2 yüksek enerjili fosfat bağı = 2 ATP eşdeğeri harcar!)',
            cofactors: 'ATGL (Adipoz Trigliserit Lipaz) → Hormona Duyarlı Lipaz (HSL) → MGL | Aktivasyon: Açil-KoA Sentetaz (Tiyokinaz)',
            clinicalNote: 'PATOFİZYOLOJİ — İnsülin Eksikliğinde Kontrolsüz Lipoliz ve Niasin (B3) Farmakolojisi: İnsülin, yağ dokusunda PDE-3B üzerinden cAMP\'yi yıkarak Hormona Duyarlı Lipaz (HSL) üzerindeki en güçlü fizyolojik frendir. Tip 1 diyabette insülin yokluğunda HSL üzerindeki bu fren kalkar; yağ dokusundan kana masif miktarda Serbest Yağ Asidi (FFA) salınır ve karaciğerde kontrolsüz ketogenezi (Diyabetik Ketoasidoz) tetikler. Farmakolojik dozda kullanılan Nikotinik Asit (Niasin / B3) ise adiposit membranındaki Gi-kenetli GPR109A reseptörünü uyararak cAMP\'yi düşürür, HSL\'yi inhibe eder, karaciğere FFA akışını keserek VLDL/LDL ve Trigliserit sentezini azaltır ve HDL\'yi en güçlü artıran ajan olarak etki gösterir (yan etkisi: prostaglandin D₂/E₂ aracılı deri kızarıklığı/flushing; aspirin ile önlenir).',
            enzyme: 'Hormona Duyarlı Lipaz (HSL) [Yağ Dokusu]  &  Uzun Zincirli Açil-KoA Sentetaz (Tiyokinaz)',
            isRateLimiting: true,
            statePreference: 'fasting',
            activators: [
              'Hormonal (cAMP → PKA ile HSL ve Perilipin Fosforilasyonu): Epinefrin, Norepinefrin (β₁/β₃-adrenerjik), Glukagon, ACTH',
              'Hormonal (Uzun Dönem): Kortizol, Büyüme Hormonu (GH), Tiroid Hormonu',
              'Farmakolojik (PDE İnhibitörleri): Kafein ve Teofilin (Fosfodiesteraz\'ı inhibe ederek cAMP yıkımını önler → Lipolizi [+] uzatır)'
            ],
            inhibitors: [
              'En Güçlü Hormonal İnhibitör: İnsülin (Fosfodiesteraz-3B\'yi [PDE-3B] aktive ederek cAMP\'yi yıkar ve PP1 ile HSL\'yi defosforile/inaktif hale getirir!)',
              'Farmakolojik Antilipolitik İlaç: Nikotinik Asit / Niasin (B3 Vitamini, yüksek doz — Adipositlerde Gi-kenetli GPR109A reseptörüne bağlanarak adenilat siklazı ve cAMP\'yi düşürür → HSL\'yi [-] inhibe eder!)',
              'Geri Bildirim: β-Hidroksibütirat (Keton cisimleri aşırı lipolizi kendi reseptörleriyle sınırlar)'
            ],
            crossConnections: [
              { targetPathway: 'glukoneogenez', label: '🔗 Lipolizle açığa çıkan Gliserol kanla Karaciğere gider → Gliserol Kinaz → Gliserol-3-P → DHAP üzerinden doğrudan Glukoneogeneze bağlanır!' }
            ]
          },
          {
            stepNo: 'Basamak 2 (⚡ β-OKSİDASYON HIZ KISITLAYICI BASAMAĞI • Karnitin Mekiği)',
            substrate: 'Sitozolik Uzun Zincirli Açil-KoA (12–20C) + L-Karnitin (Lizin & Metiyonin\'den sentezlenir)',
            product: 'Açil-Karnitin (Translokaz ile İç Membrandan Geçer) → Mitokondriyal Açil-KoA + Karnitin',
            cofactors: 'CPT-I (Dış Membran) → Karnitin-Açilkarnitin Translokaz → CPT-II (İç Membran) [Kısa/Orta zincirliler <12C karnitinsiz geçer!]',
            enzyme: 'Karnitin Palmitoiltransferaz-I (CPT-I / CAT-I) [β-Oksidasyonun Hız Kısıtlayıcı Kapısı]',
            isRateLimiting: true,
            statePreference: 'fasting',
            activators: [
              'Açlık / Glukagon & AMPK Etkisi: Glukagon ve AMPK, ACC enzimini [-] fosforile edip kapattığında Sitozolik Malonil-KoA düzeyi hızla düşer → CPT-I üzerindeki fren kalkar ve yağ asitleri mitokondriye akar!',
              'Substrat: Serbest Yağ Asitleri ve L-Karnitin (C vitamini ve Fe²⁺ bağımlı sentez)'
            ],
            inhibitors: [
              'EN ÖNEMLİ FİZYOLOJİK İNHİBİTÖR: Malonil-KoA (Toklukta Yağ Asidi Sentezinin ilk ürünü olan Malonil-KoA, CPT-I\'i doğrudan allosterik olarak bloke eder! Böylece toklukta sentezlenen yağ asitleri mitokondriye girip yıkılamaz)',
              'Hormonal: İnsülin (ACC\'yi aktive edip Malonil-KoA üreterek CPT-I\'i dolaylı kapatır)',
              'Farmakolojik İnhibitörler: Etomoksir ve Perheksilin (CPT-I inhibitörleri), Meldonyum (Karnitin biyosentez inhibitörü)'
            ],
            crossConnections: [
              { targetPathway: 'lipogenez', label: '🛑 Yağ Asidi Sentezindeki Asetil-KoA Karboksilaz (ACC) ürününden (Malonil-KoA) doğrudan buraya (-) inhibisyon oku gelir!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Karnitin Taşıyıcı (OCTN2) ve CPT-I / CPT-II Eksiklikleri: Uzun zincirli yağ asitleri (C12-C20) karnitin mekiği olmadan mitokondri matriksine giremez. Primer Sistemik Karnitin Eksikliğinde (OCTN2 renal/musküler taşıyıcı mutasyonu) karnitin idrarla kaybedilir; açlıkta karaciğer yağ asitlerini yakamadığı için keton üretemez ve glukoneogenez için gereken ATP/NADH/Asetil-KoA\'yı sağlayamaz → "Hipoketotik Hipoglisemi", hiperamonyemi, dilate kardiyomiyopati ve lipid miyopatisi gelişir. CPT-II eksikliğinin erişkin kas formunda ise uzamış egzersiz, soğuk veya açlık sonrasında kas uzun zincirli yağ asitlerini kullanamadığı için şiddetli kas ağrısı, rabdomiyoliz ve akut böbrek yetmezliği (miyoglobinüri) ortaya çıkar. Tedavide karnitin mekiğine ihtiyaç duymadan doğrudan matrikse giren "Orta Zincirli Trigliseritler (MCT — C6-C10)" ve sık karbonhidratlı beslenme uygulanır.'
          },
          {
            stepNo: 'Basamak 3: β-Oksidasyonun 4 Adımlı Spiral Döngüsü (Oksidasyon → Hidratasyon → Oksidasyon → Tiyoliz)',
            substrate: 'Mitokondriyal Açil-KoA (n Karbon)',
            product: 'Her Döngüde: 1 Asetil-KoA (2C) + 1 FADH₂ + 1 NADH + (n−2) Açil-KoA  [Tek Sayıda Karbonlularda Son 3C = Propiyonil-KoA]',
            cofactors: '1. Açil-KoA Dehidrogenaz (VLCAD/LCAD/MCAD/SCAD) [FAD] → 2. Enoil-KoA Hidrataz → 3. L-3-Hidroksiaçil-KoA Dehidrogenaz [NAD⁺] → 4. β-Ketotiyolaz [CoA-SH]',
            enzyme: 'Açil-KoA Dehidrogenaz (MCAD vb.)  →  Hidrataz  →  3-OH-Açil-KoA Dehidrogenaz  →  β-Ketotiyolaz',
            isRateLimiting: false,
            statePreference: 'fasting',
            activators: [
              'Yüksek NAD⁺ ve FAD düzeyleri (Aktif ETZ çalışması)',
              'Serbest CoA-SH mevcudiyeti'
            ],
            inhibitors: [
              'KLASİK TOKSİN (Jamaika Kusma Hastalığı): Hipoglisin A (Olgunlaşmamış Ackee meyvesi toksini — metaboliti olan MCPA-KoA, Orta ve Kısa Zincirli Açil-KoA Dehidrogenazı [MCAD / SCAD] geri dönüşümsüz bloke eder → Ağır Hipoketotik Hipoglisemi!)',
              'Ürün / Enerji İnhibisyonu: Yüksek NADH/NAD⁺ oranı (3-Hidroksiaçil-KoA Dehidrogenaz\'ı [-] durdurur), Yüksek Asetil-KoA (β-Ketotiyolaz\'ı [-] durdurur)',
              'İlaç Toksisitesi: Valproik Asit (KoA\'yı bağlayarak ve β-oksidasyon enzimlerini inhibe ederek mikroveziküler yağlanmaya yol açabilir)'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 1. Çift karbonlu yağ asitlerinden çıkan Asetil-KoA doğrudan TCA Döngüsüne (Sitrat Sentaz) girer.' },
              { targetPathway: 'keton_kolesterol', label: '🔗 2. Karaciğerde açlıkta OAA glukoneogeneze çekildiği için fazla Asetil-KoA Ketogeneze yönelir!' },
              { targetPathway: 'tca', label: '🔗 3. Tek sayıda karbonlu yağ asitlerinin son 3 karbonu olan Propiyonil-KoA → Propiyonil-KoA Karboksilaz (B7-Biyotin) → Metilmalonil-KoA Mutaz (B12-Adenozilkobalamin) → Süksinil-KoA üzerinden TCA ve Glukoneogeneze girer!' },
              { targetPathway: 'etz', label: '🔗 4. Üretilen FADH₂ (ETF → CoQ) ve NADH (Kompleks I) doğrudan ETZ\'ye elektron verir.' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — MCAD Eksikliği, Jamaika Kusma Hastalığı (Hipoglisin A), Zellweger ve Refsum Sendromları: (1) MCAD Eksikliği: Bebeklerde gece boyu açlık veya viral enfeksiyon sırasında yağ asitleri C6-C10 uzunluğuna kadar kısalır ancak daha fazla yıkılamaz; ketogenez ve glukoneogenez durarak ani bebek ölümü (SIDS), koma, Hipoketotik Hipoglisemi, kanda Oktanoilkarnitin (C8) artışı ve yağların ER\'de ω-oksidasyona sapması sonucu "Dikarboksilik Asidüri" gelişir. (2) Jamaika Kusma Hastalığı: Olgunlaşmamış Ackee meyvesindeki Hipoglisin A toksini, MCAD ve SCAD enzimlerini kovalent bloke ederek edinsel MCAD eksikliği tablosu yaratır. (3) Peroksizomal Bozukluklar: ≥22 karbonlu çok uzun zincirli yağ asitleri (VLCFA) mitokondride değil, peroksizomda yıkılır; PEX gen mutasyonlarında (Zellweger Sendromu) ve ABCD1 taşıyıcı mutasyonunda (X\'e bağlı Adrenolökodistrofi) VLCFA beyin beyaz cevherinde ve adrenal kortekste birikir. Dallı zincirli Fitanik Asit (süt/yeşil yapraklılar) ise β-karbonunda metil grubu taşıdığı için önce peroksizomda α-Oksidasyona uğramalıdır; Fitanoil-KoA α-Hidroksilaz (PHYH) eksikliğinde (Refsum Hastalığı) retinitis pigmentoza, periferik nöropati, serebellar ataksi ve iktiyozis gelişir.'
          }
        ]
      },

      // =======================================================================
      // 10. KETOGENEZ, KETOLİZ VE KOLESTEROL SENTEZİ
      // =======================================================================
      {
        id: 'keton_kolesterol',
        number: '10',
        title: 'KETOGENEZ, KETOLİZ VE KOLESTEROL SENTEZİ (HMG-KoA Kavşağı)',
        compartment: 'Ketogenez: Karaciğer Mitokondrisi • Ketoliz: Beyin/Kas/Kalp Mitokondrisi • Kolesterol Sentezi: Sitozol & ER',
        netEquation: 'Ketogenez (Mitokondri): 3 Asetil-KoA → Asetoasetil-KoA → HMG-KoA → Asetoasetat ↔ β-Hidroksibütirat | Kolesterol (Sitozol): HMG-KoA → Mevalonat → Kolesterol (27C)',
        entryBridge: 'Asetil-KoA kavşağından iki farklı kompartmana ayrılır: (1) Açlıkta Karaciğer Mitokondrisinde Ketogenez, (2) Toklukta Sitozol/ER\'de Kolesterol Sentezi.',
        exitBridge: 'Keton cisimleri kanla Beyin, Kalp ve İskelet Kasına giderek TCA\'daki Süksinil-KoA yardımıyla (Tiyoforaz) tekrar 2 Asetil-KoA\'ya dönüşür.',
        steps: [
          {
            stepNo: 'Ketogenez (⚡ KARACİĞER MİTOKONDRİSİ HIZ KISITLAYICI BASAMAĞI) & Ketoliz (Periferik Dokular)',
            substrate: '3 × Mitokondriyal Asetil-KoA (β-Oksidasyondan) → Asetoasetil-KoA → 3-Hidroksi-3-Metilglutaril-KoA (HMG-KoA)',
            product: 'Asetoasetat (4C) → D-β-Hidroksibütirat (NADH bağımlı) + Aseton (Spontan CO₂ kaybı) | Ketoliz: Asetoasetat + Süksinil-KoA → Asetoasetil-KoA → 2 Asetil-KoA',
            cofactors: 'Tiyolaz → Mitokondriyal HMG-KoA Sentaz (Hız Kısıtlayıcı!) → HMG-KoA Liyaz | Ketoliz Enzimi: Tiyoforaz (SCOT — Karaciğerde YOKTUR!)',
            enzyme: 'Mitokondriyal HMG-KoA Sentaz (mHMG-KoA Sentaz) [Ketogenez Hız Kısıtlayıcı]  &  Tiyoforaz (SCOT — Ketoliz)',
            isRateLimiting: true,
            statePreference: 'fasting',
            activators: [
              'Metabolik (Açlık & Diyabetik Ketoasidoz): Oksaloasetat\'ın PEPCK ile Glukoneogeneze çekilmesi sonucu TCA döngüsüne giremeyen Mitokondriyal Asetil-KoA taşması!',
              'Hormonal: Glukagon ve Epinefrin (Lipolizi ve CPT-I\'i açarak karaciğere yağ asidi akışını hızlandırır; PPARα üzerinden mHMG-KoA Sentaz genini indükler)',
              'Enzimatik Desüksinilasyon / Deasetilasyon: SIRT5 (süksinil grubunu kopararak) ve SIRT3 (asetil grubunu kopararak) açlıkta mHMG-KoA Sentaz\'ı aktive eder'
            ],
            inhibitors: [
              'Hormonal: İnsülin (Lipolizi ve CPT-I\'i durdurarak ketogenezi kökünden keser)',
              'Allosterik / Kovalent İnhibisyon: Süksinil-KoA (Toklukta TCA döngüsü aktifken bol olan Süksinil-KoA, mHMG-KoA Sentaz\'ı süksinile ederek inhibe eder!)',
              'Serbest CoA-SH (Yüksek düzeyde yarışmalı inhibisyon)'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 KETOLİZ-TCA KÖPRÜSÜ: Beyin, Kalp ve Kasta Asetoasetat\'ın tekrar Asetoasetil-KoA\'ya aktive edilmesi için TCA Döngüsündeki Süksinil-KoA (Tiyoforaz / SCOT enzimiyle) CoA vericisi olarak kullanılır; ortaya çıkan 2 Asetil-KoA doğrudan TCA\'ya girer!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Diyabetik Ketoasidoz (DKA), Tiyoforaz (SCOT) Eksikliği ve Kompartman Özelikleri: Karaciğer hepatositleri mitokondriyal HMG-KoA Sentaz ile günde yüzlerce gram Asetoasetat ve β-Hidroksibütirat üretir, ancak kendisinde Tiyoforaz (SCOT) enzimi bulunmadığı için ketonları tekrar Asetil-KoA\'ya çeviremez; böylece ketonların tamamı beyin, kalp, böbrek korteksi ve iskelet kasına ihraç edilir (uzamış açlıkta beyin enerji ihtiyacının %60-70\'ini ketonlardan karşılar!). Tip 1 diyabette veya ağır alkolizmde yüksek NADH/NAD⁺ oranı nedeniyle Asetoasetat\'ın büyük kısmı β-Hidroksibütirat\'a indirgenir; idrar keton stripleri (nitroprussid reaksiyonu) sadece Asetoasetat ve Aseton\'u ölçtüğü için başlangıçta yanıltıcı olarak düşük çıkabilir! Nadir görülen Tiyoforaz (SCOT) eksikliğinde ise periferik dokular ketonları hiç kullanamadığı için bebeklikten itibaren kalıcı ketozis ve enfeksiyonlarla tetiklenen ağır ketoasidoz atakları görülür.'
          },
          {
            stepNo: 'Kolesterol Sentezi (⚡ SİTOZOL & ER HIZ KISITLAYICI BASAMAĞI — Mevalonat Yolu)',
            substrate: 'Sitozolik Asetil-KoA → Asetoasetil-KoA → Sitozolik HMG-KoA + 2 NADPH + 2 H⁺',
            product: 'Mevalonat (6C) → İzopentenil-PP (IPP, 5C) → Geranil-PP (10C) → Farnezil-PP (15C) → Skualen (30C) → Lanosterol → Kolesterol (27C)',
            cofactors: '2 NADPH (HMP Şantından) | Sonraki Basamaklarda 3 ATP (Mevalonat Kinaz / Fosfomevalonat Kinaz / Dekarboksilaz) ve O₂/NADPH (Skualen Epoksidaz)',
            clinicalNote: 'PATOFİZYOLOJİ — Statin Farmakodinamiği, SREBP-2 Döngüsü ve Statin Miyopatisi / Smith-Lemli-Opitz Sendromu: Statinler (Atorvastatin, Rosuvastatin vb.) HMG-KoA Redüktaz\'ı yarışmalı inhibe ettiğinde hepatosit içi serbest kolesterol havuzu azalır. Bunu algılayan ER membran proteini SCAP, SREBP-2 transkripsiyon faktörünü Golgi\'ye taşır; burada S1P/S2P proteazlarıyla kesilen aktif SREBP-2 çekirdeğe giderek hepatosit yüzeyindeki "LDL Reseptörü (LDLR)" sayısını artırır ve kandaki aterojenik LDL-kolesterol hızla karaciğere çekilir. Ancak Mevalonat yolunun inhibisyonu aynı zamanda ara ürün olan Farnezil-PP üzerinden ETZ\'deki Koenzim Q₁₀ (Ubikinon) sentezini ve küçük G-proteinlerinin (Rho/Ras/Rab) izoprenilasyonunu da azalttığı için iskelet kasında mitokondriyal disfonksiyon, CK yüksekliği, miyalji ve rabdomiyolize (Statin Miyopatisi — özellikle gemfibrozil veya CYP3A4 inhibitörleriyle birlikte alındığında!) yol açabilir. Kolesterol sentezinin son basamağı olan 7-Dehidrokolesterol Redüktaz (DHCR7) eksikliğinde ise "Smith-Lemli-Opitz Sendromu" (mikrosefali, 2-3. ayak parmaklarında sindaktili, ambigius genitalya) gelişir.',
            enzyme: 'HMG-KoA Redüktaz (ER Membran Enzimi) [Kolesterol Sentezinin Hız Kısıtlayıcı Enzimi]',
            isRateLimiting: true,
            statePreference: 'fed',
            activators: [
              'Hormonal (Kovalent Defosforilasyon): İnsülin ve Tiroid Hormonu (T₃) → Protein Fosfataz-1 (PP1)\'i aktive ederek HMG-KoA Redüktaz\'ı defosforile (AKTİF) hale getirir!',
              'Transkripsiyonel (Sterol Sensörü): Hücre içi Kolesterol düştüğünde SCAP proteini SREBP-2\'yi ER\'den Golgi\'ye taşır → Aktif SREBP-2 çekirdeğe giderek HMG-KoA Redüktaz ve LDL Reseptör gen transkripsiyonunu [+] artırır!'
            ],
            inhibitors: [
              'KLASİK FARMAKOLOJİK İNHİBİTÖR: Statinler (Atorvastatin, Rosuvastatin, Simvastatin, Pravastatin, Lovastatin — HMG-KoA\'nın yapısal analoğu olarak HMG-KoA Redüktaz\'ı yarışmalı ve geri dönüşümlü inhibe eder!)',
              'Geri Bildirim (Feedback) İnhibisyonu: Kolesterol, Mevalonat, Oksisteroller ve Safra Asitleri (SREBP-2\'yi Insig üzerinden ER\'de hapseder ve HMG-KoA Redüktaz\'ın ubikitinasyon/proteazomal yıkımını hızlandırır)',
              'Hormonal / Enerji (Kovalent Fosforilasyon): Glukagon, Epinefrin ve AMPK (AMP-bağımlı Protein Kinaz — enzimi fosforile ederek İNAKTİVE eder!)'
            ],
            crossConnections: [
              { targetPathway: 'etz', label: '🔗 Yan Dal Bağlantıları: Ara ürün olan Farnezil-PP (15C), hem ETZ\'deki Koenzim Q (Ubikinon) sentezine, hem Dolikol (N-glikozilasyon) sentezine, hem de Ras/Rho proteinlerinin prenilasyonuna bağlanır!' },
              { targetPathway: 'hmp', label: '🔗 Kolesterolten Safra Asidi Sentezi: Kolesterol → 7α-Hidroksikolesterol (Hız Kısıtlayıcı Enzim: Kolesterol 7α-Hidroksilaz [CYP7A1] — [+] Kolesterol ile aktive, [-] Safra Asitleri/FXR ve C vitamini eksikliği ile inhibe olur!).' }
            ]
          }
        ]
      },

      // =======================================================================
      // 11. AMİNO ASİT KATABOLİZMASI VE ÜRE DÖNGÜSÜ (KREBS BİSİKLETİ)
      // =======================================================================
      {
        id: 'ure_aa',
        number: '11',
        title: 'AMİNO ASİT KATABOLİZMASI VE ÜRE DÖNGÜSÜ (TCA ile "Krebs Bisikleti" Bağlantısı)',
        compartment: 'Karaciğer: İlk 2 Basamak Mitokondri Matriksinde • Son 3 Basamak Sitozolde',
        netEquation: 'NH₄⁺ (GDH\'den) + Aspartat (AST\'den) + HCO₃⁻ + 3 ATP + H₂O → ÜRE (2 Azotlu) + Fumarat (TCA\'ya döner!) + 2 ADP + AMP + 2 Pᵢ + PPᵢ (Toplam 4 yüksek enerjili bağ harcanır)',
        entryBridge: 'Amino asitlerin amino grupları Transaminazlar (ALT/AST [PLP/B6]) ile α-Ketoglutarat\'a aktarılıp Glutamat oluşturur; Glutamat mitokondride GDH ile serbest NH₄⁺ ve α-KG verir, veya AST ile OAA\'dan Aspartat oluşturur.',
        exitBridge: 'Karbon iskeletleri Pirüvat, Asetil-KoA, Asetoasetil-KoA, α-KG, Süksinil-KoA, Fumarat ve Oksaloasetat üzerinden kesintisiz olarak TCA Döngüsü ve Glukoneogeneze bağlanır!',
        steps: [
          {
            stepNo: 'Giriş: Transaminasyon (ALT / AST) ve Oksidatif Deaminasyon (Glutamat Dehidrogenaz — GDH)',
            substrate: 'Amino Asitler + α-Ketoglutarat ↔ L-Glutamat + α-Ketoasit | Mitokondride: L-Glutamat + NAD(P)⁺ + H₂O',
            product: 'α-Ketoglutarat (TCA\'ya girer!) + Serbest NH₄⁺ (Üre Döngüsü 1. Azotu!) + NAD(P)H + H⁺',
            cofactors: 'ALT & AST Zorunlu Koenzimi: Piridoksal Fosfat (PLP / B6 Vitamini) | GDH: Hem NAD⁺ hem NADP⁺ kullanabilen benzersiz mitokondriyal enzim!',
            enzyme: 'Aminotransferazlar (ALT & AST [PLP/B6])  ve  Glutamat Dehidrogenaz (GDH)',
            isRateLimiting: false,
            statePreference: 'fasting',
            activators: [
              'GDH Allosterik Aktivatörleri (Düşük Enerji / Yıkım Yönü): ADP ve GDP (Enerji azaldığında GDH\'yi aktive ederek Glutamat\'tan α-KG üretip TCA döngüsünü besler!)',
              'Amino Asit Sinyali: Lösin (GDH\'yi allosterik aktive eder; pankreas β-hücresinde insülin salınımını uyarır)',
              'Hormonal: Kortizol ve Glukagon (Protein yıkımı ve transaminaz indüksiyonu)'
            ],
            inhibitors: [
              'GDH Allosterik İnhibitörleri (Yüksek Enerji): ATP, GTP ve NADH (Enerji yüksekken amino asitlerin oksidatif deaminasyonunu durdurur)',
              'İlaç Kaynaklı B6 (PLP) Eksikliği: İzoniazid (INH) ve Penisilamin (PLP\'yi bağlayarak ALT/AST transaminasyonunu inhibe eder)'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 GDH ile açığa çıkan α-Ketoglutarat doğrudan TCA Döngüsünün 3-4. basamağı arasına girer!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Hiperinsülinizm-Hiperamonyemi (HI/HA) Sendromu ve B6 (PLP) Eksikliği: Glutamat Dehidrogenaz (GLUD1) genindeki aktive edici mutasyonlar, enzimin GTP tarafından allosterik olarak frenlenmesini bozar. Özellikle Lösin açısından zengin proteinli bir öğün sonrasında pankreas β-hücresinde GDH aşırı çalışarak Glutamat → α-KG + NH₄⁺ + NADPH/NADH üretir; artan ATP/ADP oranı K_ATP kanallarını kapatarak uygunsuz İnsülin deşarjına (lösin duyarlı hipoglisemi) ve karaciğer/böbrekte aşırı NH₄⁺ üretimine (asemptomatik kalıcı hiperamonyemi) neden olur. Tüberküloz ilacı İzoniazid (INH) ise Piridoksal Fosfat (PLP / B6) ile inaktif hidrazon kompleksi oluşturarak hem ALT/AST transaminazları, hem GABA sentezleyen Glutamat Dekarboksilaz\'ı (nöbetler!), hem de Hem sentezleyen ALA Sentaz\'ı (sideroblastik anemi!) inhibe eder.'
          },
          {
            stepNo: 'Üre Döngüsü Basamak 1 (⚡ ÜRE DÖNGÜSÜ HIZ KISITLAYICI BASAMAĞI — Mitokondri) & Basamak 2 (OTC)',
            substrate: 'Serbest NH₄⁺ + HCO₃⁻ + 2 ATP → Karbamoil Fosfat + Ornitin (Mitokondriye ORNT1 ile girer)',
            product: 'L-Sitrülin + 2 ADP + 2 Pᵢ  [Sitrülin Mitokondriden Sitozole Çıkar]',
            cofactors: 'CPS-I Zorunlu Allosterik Aktivatörü: N-Asetilglutamat (NAG) [NAGS enzimiyle Asetil-KoA + Glutamat\'tan sentezlenir]',
            enzyme: 'Karbamoil Fosfat Sentetaz-I (CPS-I) [Hız Kısıtlayıcı]  →  Ornitin Transkarbamoilaz (OTC)',
            isRateLimiting: true,
            statePreference: 'fasting',
            activators: [
              'ZORUNLU ALLOSTERİK AKTİVATÖR (CPS-I): N-Asetilglutamat (NAG — NAG olmadan CPS-I kesinlikle çalışmaz!)',
              'NAGS Enziminin Allosterik Aktivatörü: L-Arjinin (Proteinli yemek veya protein yıkımı sonrası artan Arjinin, N-Asetilglutamat Sentaz\'ı [NAGS] aktive ederek NAG üretir → CPS-I açılır!)',
              'Hormonal / Diyet: Yüksek proteinli diyet, Glukagon ve Kortizol (Tüm üre döngüsü enzimlerinin transkripsiyonunu artırır)'
            ],
            inhibitors: [
              'Farmakolojik / Toksik İnhibitör: Valproik Asit (Antiepileptik ilaç — NAGS enzimini inhibe edip Karnitin/KoA tüketerek NAG sentezini düşürür → CPS-I durur → İlaç kaynaklı Hiperamonyemi!)',
              'Metabolik İnhibitör: Propiyonil-KoA ve Metilmalonil-KoA (Organik asidemilerde Asetil-KoA ile yarışarak NAGS\'yi inhibe eder → Sekonder Hiperamonyemi)'
            ],
            crossConnections: [
              { targetPathway: 'pdh', label: '🔗 NAG sentezi için gereken Asetil-KoA, PDH ve β-Oksidasyondan; Glutamat ise Transaminasyondan gelir.' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Hiperamonyemik Serebral Ödem ve OTC vs. CPS-I Eksikliği Ayırıcı Tanısı: Karaciğerde üre döngüsü (veya siroz nedeniyle hepatosit fonksiyonu) bozulduğunda kanda yükselen serbest Amonyak (NH₃/NH₄⁺) kan-beyin bariyerini hızla geçer. Beyin astrositlerinde: (1) NH₄⁺, Glutamat Dehidrogenaz\'ı ters yönde çalıştırarak TCA döngüsündeki α-Ketoglutarat\'ı tüketir → TCA durur ve nöronal ATP çöker; (2) Oluşan Glutamat, Glutamin Sentetaz ile bir NH₄⁺ daha bağlayarak astrosit içinde masif miktarda "Glutamin" biriktirir. Glutamin güçlü bir ozmotik aktif molekül olduğu için astrositlerin içine su çeker → Astrosit şişmesi, intrakraniyal basınç artışı, Serebral Ödem, asteriksis (flapping tremor), kusma, letarji ve koma gelişir! Ayırıcı Tanı: Hem CPS-I hem OTC eksikliğinde kanda Amonyak ve Glutamin çok yüksek, BUN ve Arjinin düşüktür; ancak OTC eksikliğinde mitokondride biriken Karbamoil Fosfat sitozole taşarak Pirimidin sentez yolağını (CPS-II → Dihidroorotat → Orotat) aşırı beslediği için idrarda belirgin "Orotik Asidüri" görülür (CPS-I ve NAGS eksikliğinde ise Karbamoil Fosfat hiç üretilemediği için idrar orotik asidi normal/düşüktür!).'
          },
          {
            stepNo: 'Üre Döngüsü Basamak 3, 4 & 5 (Sitozol — Aspartat Girişi, Fumarat Köprüsü ve Üre Çıkışı)',
            substrate: 'Sitrülin + L-Aspartat (2. Azot Kaynağı!) + ATP → Arjininosüksinat → L-Arjinin + Fumarat',
            product: 'ÜRE (Böbrekle atılır) + Ornitin (Mitokondriye geri döner) + Fumarat (TCA Döngüsüne döner!)',
            cofactors: 'ASS (ATP → AMP + PPᵢ = 2 yüksek enerjili bağ harcar!) → Arjininosüksinat Liyaz (ASL) → Arjinaz-I (Kofaktör: Mn²⁺)',
            enzyme: 'Arjininosüksinat Sentetaz (ASS)  →  Arjininosüksinat Liyaz (ASL)  →  Arjinaz-I [Sadece Karaciğerde yüksek]',
            isRateLimiting: false,
            statePreference: 'both',
            activators: [
              'Substrat bağlantısı: TCA döngüsündeki Oksaloasetat\'tan AST ile üretilen Aspartat ve ATP mevcudiyeti',
              'Arjinaz Kofaktörü: Mn²⁺ (Mangan)'
            ],
            inhibitors: [
              'Arjinaz Yarışmalı İnhibitörleri: Ornitin ve Lizin',
              'ASS İnhibitörü: α-Metil-DL-aspartat'
            ],
            crossConnections: [
              { targetPathway: 'tca', label: '🔗 KREBS BİSİKLETİ TAMAMLANIŞI: ASL basamağında açığa çıkan Fumarat → Sitozolik Fumaraz ile Malat\'a → Mitokondriye girip MDH ile Oksaloasetat\'a (OAA) dönüşür; OAA da AST ile tekrar Aspartat olarak Üre Döngüsünün 3. basamağına geri döner!' },
              { targetPathway: 'glukoneogenez', label: '🔗 Amino Asit Karbon İskeletlerinin Kesintisiz Giriş Haritası: (1) Pirüvat\'a: Ala, Ser, Gly, Cys, Thr, Trp | (2) α-KG\'ye: Glu, Gln, Pro, Arg, His | (3) Süksinil-KoA\'ya: Val, Ile, Met, Thr | (4) Fumarat\'a: Phe, Tyr | (5) OAA\'ya: Asp, Asn | (6) Saf Ketojenik (Asetil-KoA / Asetoasetat): Lösin (Leu) ve Lizin (Lys)!' }
            ],
            clinicalNote: 'PATOFİZYOLOJİ — Sitrülinemi, Arjininosüksinik Asidüri, Hiperarjininemi ve Amonyak Süpürücü Tedavi Mekanizması: (1) ASS Eksikliği (Klasik Sitrülinemi): Sitrülin ile Aspartat birleşemez; plazma Sitrülin düzeyi >1000 µmol/L\'ye çıkar ve ağır neonatal hiperamonyemi gelişir. (2) ASL Eksikliği (Arjininosüksinik Asidüri): Arjininosüksinat kırılamaz; hiperamonyemiye ek olarak kırılgan/düğümlü saç yapısı ("Trikoreksis Nodoza") ve progresif karaciğer fibrozu karakteristiktir. (3) Arjinaz-I Eksikliği: Döngünün son basamağı olduğu için hiperamonyemi nadirdir/hafiftir; ancak biriken Arjinin ve guanidino bileşikleri nörotoksik etki göstererek alt ekstremitelerde ilerleyici "Spastik Dipleji (Serebral Palsi benzeri tablo)" yapar (Tedavide diyetten Arjinin kısıtlanır; diğer üre döngüsü bozukluklarında ise Arjinin esansiyel hale geldiği için dışarıdan Arjinin VERİLİR (OTC ve CPS-I eksikliğinde Sitrülin de verilebilir; ASS/ASL eksikliğinde Sitrülin verilmez; NAGS eksikliğinde Karglumik Asit kullanılır)!). Ayrıca tüm hiperamonyemilerde alternatif azot atılımı için Sodyum Benzoat (Glisin\'i bağlayıp Hippurat olarak idrarla atar) ve Sodyum Fenilbütirat / Fenilasetat (Glutamin\'i bağlayıp Fenilasetilglutamin olarak idrarla atar) kullanılır.'
          }
        ]
      }
    ];

    // -------------------------------------------------------------------------
    // 2. 12 METABOLIC CROSSROADS / INTERSECTION HUBS DATASET
    // -------------------------------------------------------------------------
    const METABOLIC_HUBS = [
      {
        id: 'j-g6p',
        name: '1. Glukoz-6-Fosfat (G6P)',
        compartment: 'Sitozol & ER',
        badge: 'Karbonhidrat Ana Kavşağı',
        incoming: [
          'Serbest Glukoz → Heksokinaz / Glukokinaz [+] İnsülin, Glukoz | [-] G6P (HK I-III), F6P (GKRP)',
          'Glikojen → Glikojen Fosforilaz → G1P → Fosfoglukomutaz (Glikojenoliz)',
          'Fruktoz-6-Fosfat → Fosfoglukoz İzomeraz (Glukoneogenez ve HMP Non-Oksidatif dönüşü)'
        ],
        outgoing: [
          'Glikoliz: Fruktoz-6-Fosfat → PFK-1 → Pirüvat (Enerji & Asetil-KoA üretimi)',
          'Glikojenez: G1P → UDP-Glukoz → Glikojen Sentaz [+] İnsülin, G6P | [-] Glukagon, Epinefrin',
          'Pentoz Fosfat Yolu (HMP Şantı): G6PD [+] NADP⁺, İnsülin | [-] NADPH, Açil-KoA → NADPH & Riboz-5-P',
          'Glukoneogenez Son Çıkışı: Glukoz-6-Fosfataz (Sadece Karaciğer ve Böbrek ER) → Kana Serbest Glukoz'
        ]
      },
      {
        id: 'j-f6p',
        name: '2. Fruktoz-6-Fosfat (F6P) & Gliseraldehit-3-P (G3P)',
        compartment: 'Sitozol',
        badge: 'Glikoliz ↔ HMP Şantı Köprüsü',
        incoming: [
          'Glikoliz: G6P ↔ F6P ve F1,6BP ↔ G3P + DHAP',
          'HMP Şantı Non-Oksidatif Fazı: Ribuloz-5-P (5C) → Transketolaz (B1-TPP) & Transaldolaz → 2 F6P + 1 G3P'
        ],
        outgoing: [
          'PFK-1 ile Glikoliz aşağı akışı [+] F2,6BP, AMP, İnsülin | [-] ATP, Sitrat, H⁺, Glukagon',
          'FBPaz-1 ile Glukoneogenez yukarı akışı [+] Sitrat, Glukagon | [-] F2,6BP, AMP',
          'Tersinir Transketolaz/Transaldolaz ile NADPH üretmeden doğrudan Riboz-5-Fosfat (PRPP / Nükleotid) sentezi'
        ]
      },
      {
        id: 'j-dhap',
        name: '3. Dihidroksiaseton Fosfat (DHAP) ↔ Gliserol-3-Fosfat',
        compartment: 'Sitozol',
        badge: 'Karbonhidrat ↔ Lipit (TAG) Köprüsü',
        incoming: [
          'Glikoliz: Fruktoz-1,6-Bisfosfat → Aldolaz A/B → DHAP ↔ G3P',
          'Fruktoz Yıkımı (Karaciğer): Fruktoz → F1P → Aldolaz B → DHAP + Gliseraldehit',
          'Lipolizden Gelen Gliserol (Sadece Karaciğer/Böbrek): Gliserol → Gliserol Kinaz → Gliserol-3-Fosfat'
        ],
        outgoing: [
          'Triaçilgliserol (TAG) & Fosfolipit Sentezi: DHAP → Gliserol-3-P + Yağ Açil-KoA → Fosfatidik Asit → TAG',
          'Glukoneogenez: Gliserol-3-P → DHAP → F1,6BP → Glukoz (Yağlardan glukoza dönüşebilen TEK kısım Gliserol [ve Propiyonil-KoA]\'dır!)',
          'Gliserol-3-Fosfat Mekiği: Sitozolik NADH elektronlarını İç Mitokondri Membranındaki FAD → CoQ\'ya taşır (1.5 ATP)'
        ]
      },
      {
        id: 'j-piruvat',
        name: '4. Pirüvat (3C) — Sitozol/Mitokondri Dörtyol Ağzı',
        compartment: 'Sitozol & Mitokondri Matriksi',
        badge: '4 Yönlü Merkez Kavşak',
        incoming: [
          'Glikoliz: PEP → Pirüvat Kinaz [+] F1,6BP, İnsülin | [-] ATP, Alanin, Glukagon (Karaciğer)',
          'Cori Döngüsü: Laktat → Laktat Dehidrogenaz (LDH, NAD⁺ bağımlı)',
          'Cahill Döngüsü & Amino Asitler: Alanin (ALT [PLP]), Serin, Glisin, Sistein, Treonin, Triptofan',
          'Malik Enzim: Malat + NADP⁺ → Pirüvat + CO₂ + NADPH'
        ],
        outgoing: [
          '1. PDH Kompleksi (Mitokondri, Tersinmez): Pirüvat → Asetil-KoA + NADH + CO₂ [+] İnsülin, Ca²⁺, ADP | [-] Asetil-KoA, NADH, ATP, Arsenit',
          '2. Pirüvat Karboksilaz (Mitokondri, Biyotin/B7): Pirüvat → Oksaloasetat (OAA) [+] Asetil-KoA (Zorunlu!) | [-] ADP, Avidin',
          '3. Laktat Dehidrogenaz (Sitozol, Anaerobik): Pirüvat + NADH ↔ Laktat + NAD⁺',
          '4. Alanin Aminotransferaz (ALT, PLP/B6): Pirüvat + Glutamat ↔ Alanin + α-Ketoglutarat'
        ]
      },
      {
        id: 'j-asetilkoa',
        name: '5. Asetil-KoA (2C) — Tüm Yakıtların Ortak Kavşağı',
        compartment: 'Mitokondri Matriksi & Sitozol',
        badge: 'Katabolizma & Anabolizma Göbeği',
        incoming: [
          'Karbonhidratlar: Pirüvat → PDH Kompleksi (Tersinmez!)',
          'Yağ Asitleri: β-Oksidasyon spirali → β-Ketotiyolaz (Her döngüde 2C Asetil-KoA)',
          'Keton Cisimleri (Periferik Dokular): β-Hidroksibütirat → Asetoasetat → Tiyoforaz (SCOT) → 2 Asetil-KoA',
          'Ketojenik Amino Asitler: Lösin, Lizin (Saf Ketojenik) ve Ile, Phe, Tyr, Trp',
          'Etanol Metabolizması: Etanol → Asetaldehit (ADH) → Asetat (ALDH2) → Asetil-KoA'
        ],
        outgoing: [
          '1. TCA Döngüsü: + Oksaloasetat → Sitrat (Sitrat Sentaz)',
          '2. Ketogenez (Karaciğer Mitokondrisi, Açlık): mHMG-KoA Sentaz → Asetoasetat & β-Hidroksibütirat',
          '3. Yağ Asidi Sentezi (Sitozol, Tokluk): Sitrat Mekiği → Sitozolik Asetil-KoA → ACC [+] Sitrat, İnsülin | [-] Palmitoil-KoA, AMPK → Malonil-KoA → Palmitat',
          '4. Kolesterol Sentezi (Sitozol & ER): HMG-KoA Redüktaz [+] İnsülin | [-] Statinler, Kolesterol, AMPK → Mevalonat → Kolesterol',
          '5. Allosterik Sinyal: Pirüvat Karboksilaz\'ı [+] zorunlu aktive eder, PDH Kinaz\'ı [+] açarak PDH\'yi [-] inhibe eder, NAGS ile NAG (Üre döngüsü aktivatörü) oluşturur!'
        ]
      },
      {
        id: 'j-sitrat',
        name: '6. Sitrat (6C) ↔ Malonil-KoA (3C) Köprüsü',
        compartment: 'Mitokondri → Sitozol',
        badge: 'TCA ↔ Lipogenez ↔ β-Oksidasyon Kilidi',
        incoming: [
          'TCA Döngüsü Basamak 1: Oksaloasetat + Asetil-KoA → Sitrat Sentaz',
          'Toklukta yüksek ATP ve NADH nedeniyle İzositrat Dehidrogenaz (IDH) [-] inhibe olduğunda mitokondride Sitrat birikir'
        ],
        outgoing: [
          '1. TCA Döngüsü Devamı: Akonitaz ([-] Floroasetat) → İzositrat → α-Ketoglutarat',
          '2. Sitrat Mekiği ile Sitozole Çıkış: ATP-Sitrat Liyaz ([-] Bempedoik asit, Hidroksisitrat) → Sitozolik Asetil-KoA + OAA',
          '3. Allosterik Düzenleme: Sitozolik Sitrat, Yağ Asidi Sentezindeki ACC\'yi [+] güçlü şekilde aktive ederken, Glikolizdeki PFK-1\'i [-] inhibe eder ve FBPaz-1\'i [+] aktive eder!',
          '4. Malonil-KoA Freni: ACC ürünü olan Malonil-KoA, CPT-I\'i [-] bloke ederek β-oksidasyonu kilitler!'
        ]
      },
      {
        id: 'j-alfakg',
        name: '7. α-Ketoglutarat (5C) ↔ L-Glutamat Köprüsü',
        compartment: 'Mitokondri Matriksi & Sitozol',
        badge: 'TCA ↔ Amino Asit & Azot Köprüsü',
        incoming: [
          'TCA Döngüsü: İzositrat → İzositrat Dehidrogenaz (IDH — Hız Kısıtlayıcı!) [+] ADP, Ca²⁺ | [-] ATP, NADH',
          'Amino Asit Katabolizması (5C Ailesi): Glutamin, Prolin, Arjinin, Histidin → Glutamat → GDH / Transaminazlar → α-Ketoglutarat'
        ],
        outgoing: [
          '1. TCA Devamı: α-Ketoglutarat Dehidrogenaz (α-KGDH) [+] Ca²⁺ | [-] Süksinil-KoA, NADH, Arsenit → Süksinil-KoA',
          '2. Transaminasyon (ALT/AST [PLP/B6]): Amino asitlerin amino gruplarını toplayarak L-Glutamat oluşturur',
          '3. Oksidatif Deaminasyon (GDH): Glutamat ↔ α-KG + Serbest NH₄⁺ (Üre Döngüsü CPS-I\'e 1. azotu verir!)',
          '4. Nörotransmitter & Antioksidan Sentezi: Glutamat → GABA (Glutamat Dekarboksilaz [PLP/B6]) ve Glutatyon (GSH = γ-Glu-Cys-Gly)'
        ]
      },
      {
        id: 'j-suksinilkoa',
        name: '8. Süksinil-KoA (4C) — 4 Yolaklı Kavşak',
        compartment: 'Mitokondri Matriksi',
        badge: 'TCA ↔ B12/Propiyonil ↔ Hem ↔ Ketoliz',
        incoming: [
          'TCA Döngüsü: α-Ketoglutarat → α-KGDH Kompleksi (TPP, Lipoat, CoA, FAD, NAD⁺)',
          'Tek Sayıda Karbonlu Yağ Asitleri + Amino Asitler (Valin, İzolösin, Metiyonin, Treonin) + Kolesterol Yan Zinciri: Propiyonil-KoA (3C) → Propiyonil-KoA Karboksilaz (B7-Biyotin) → Metilmalonil-KoA Mutaz (B12-Adenozilkobalamin!) → Süksinil-KoA'
        ],
        outgoing: [
          '1. TCA Devamı & Glukoneogenez: Süksinil-KoA Sentetaz → Süksinat + GTP (Malat → OAA → PEPCK üzerinden net Glukoz sentezlenir!)',
          '2. Hem (Porfirin) Sentezi: Süksinil-KoA + Glisin → δ-Aminolevülinat (Hız Kısıtlayıcı: ALA Sentaz [PLP/B6] — karaciğer ALAS1: [-] Hem ve Glukoz ile baskılanır, [+] Barbitüratlar/CYP450 indükleyicileri ile indüklenir; eritroid ALAS2 ise demir/IRE ile düzenlenir, eksikliği X’e bağlı sideroblastik anemi yapar)',
          '3. Ketoliz (Periferik Dokular): Tiyoforaz (SCOT) ile Asetoasetat\'a CoA aktararak Asetoasetil-KoA oluşturur',
          '4. Allosterik Geri Bildirim: Sitrat Sentaz, α-KGDH ve mHMG-KoA Sentaz\'ı [-] inhibe eder!'
        ]
      },
      {
        id: 'j-fumarat-oaa',
        name: '9. Fumarat & Oksaloasetat (OAA) — "Krebs Bisikleti"',
        compartment: 'Mitokondri ↔ Sitozol',
        badge: 'TCA ↔ Üre Döngüsü ↔ Glukoneogenez',
        incoming: [
          'TCA Döngüsü: Süksinat → SDH (Kompleks II, [-] Malonat) → Fumarat → Fumaraz → Malat → MDH → OAA',
          'Anapleroz: Pirüvat → Pirüvat Karboksilaz ([+] Asetil-KoA, Biyotin) → OAA',
          'Üre Döngüsü (Sitozol): Arjininosüksinat → Arjininosüksinat Liyaz (ASL) → Arjinin + Fumarat',
          'Amino Asitler: Aspartat & Asparajin → OAA | Fenilalanin & Tirozin → Fumarat'
        ],
        outgoing: [
          '1. TCA Döngüsü Başlangıcı: OAA + Asetil-KoA → Sitrat (Sitrat Sentaz)',
          '2. Glukoneogenez: OAA → PEPCK (GTP) → Fosfoenolpirüvat (PEP) → Glukoz',
          '3. Üre Döngüsü 2. Azot Kaynağı: OAA + Glutamat → AST (PLP/B6) → L-Aspartat (Sitozole çıkarak ASS basamağında Sitrülin ile birleşir!)',
          '4. Malat-Aspartat Mekiği: Sitozolik NADH\'nin mitokondriye taşınmasını sağlar'
        ]
      },
      {
        id: 'j-etz',
        name: '10. NADH / FADH₂ / CoQ — Elektron Taşıma Kavşağı',
        compartment: 'İç Mitokondri Membranı',
        badge: 'Redoks & ATP Üretim Merkezi',
        incoming: [
          'Kompleks I\'e Giren NADH\'ler: PDH, İzositrat Dehidrogenaz, α-KGDH, Malat Dehidrogenaz, β-Oksidasyon (3-OH-Açil-KoA Dehidrogenaz), GDH, β-Hidroksibütirat Dehidrogenaz, Malat-Aspartat Mekiği',
          'Koenzim Q (Ubikinon) Havuzuna FADH₂ Üzerinden Doğrudan Girenler: (1) Kompleks II (Süksinat Dehidrogenaz), (2) β-Oksidasyon (Açil-KoA Dehidrogenaz / ETF-Qo), (3) Gliserol-3-Fosfat Mekiği, (4) Dihidroorotat Dehidrogenaz (FMN; Pirimidin sentezi — elektronları doğrudan CoQ’ya verir)'
        ],
        outgoing: [
          'Kompleks III ([-] Antimisin A) → Sitokrom c → Kompleks IV ([-] CN⁻, CO, H₂S, NaN₃) → H₂O',
          'Kompleks V (F₀F₁ ATP Sentaz, [-] Oligomisin) → ATP Üretimi (Ayırıcılar [2,4-DNP, Termogenin/UCP1, Aspirin] proton gradyentini ısıya dönüştürür!)'
        ]
      }
    ];

    // -------------------------------------------------------------------------
    // 3. 2D INTERACTIVE SVG MAP LAYOUT (Continuous Visual Network)
    // -------------------------------------------------------------------------
    const MAP_NODES = [
      // Compartment Background Zones are rendered first in SVG
      // Central Glycolysis / Gluconeogenesis Spine (x: 420)
      { id: 'n-glukoz', x: 420, y: 90, w: 170, h: 48, title: 'SERBEST GLUKOZ (6C)', sub: 'Kan ↔ Sitozol (GLUT 1-4)', type: 'metabolite', pathway: 'glikoliz', junctionId: 'j-g6p' },
      { id: 'n-hk', x: 420, y: 165, w: 205, h: 46, title: 'Heksokinaz / Glukokinaz', sub: 'G6Paz (ER Bypass)', type: 'enzyme', pathway: 'glikoliz', junctionId: 'j-g6p',
        plus: 'İnsülin, Glukoz, F1P', minus: 'G6P (HK I-III), F6P (GKRP)' },
      { id: 'n-g6p', x: 420, y: 245, w: 195, h: 52, title: 'GLUKOZ-6-FOSFAT (G6P)', sub: '★ Karbonhidrat Ana Kavşağı', type: 'hub', pathway: 'glikoliz', junctionId: 'j-g6p' },

      // Left Branch from G6P: Glycogen Metabolism (x: 135)
      { id: 'n-g1p', x: 135, y: 245, w: 165, h: 46, title: 'Glukoz-1-P ↔ UDP-Glc', sub: 'Fosfoglukomutaz', type: 'metabolite', pathway: 'glikojen', junctionId: 'j-g6p' },
      { id: 'n-gs-gp', x: 135, y: 150, w: 190, h: 52, title: '⚡ Glikojen Sentaz / Fosforilaz', sub: 'Glikojenez ↔ Glikojenoliz', type: 'rate-enzyme', pathway: 'glikojen', junctionId: 'j-g6p',
        plus: 'Sentaz: İnsülin, G6P | Fosf: Glukagon, Epinefrin, AMP, Ca²⁺', minus: 'Sentaz: Glukagon, GSK3 | Fosf: İnsülin, ATP, G6P' },
      { id: 'n-glikojen', x: 135, y: 65, w: 165, h: 46, title: 'GLİKOJEN DEPOSU', sub: 'α(1→4) & α(1→6) Dallar', type: 'metabolite', pathway: 'glikojen', junctionId: 'j-g6p' },

      // Right Branch from G6P: HMP Shunt (Pentose Phosphate) (x: 760)
      { id: 'n-g6pd', x: 760, y: 200, w: 190, h: 50, title: '⚡ G6PD (HMP Şantı)', sub: 'Oksidatif Faz → 2 NADPH', type: 'rate-enzyme', pathway: 'hmp', junctionId: 'j-g6p',
        plus: 'NADP⁺, İnsülin, Oksidatif Stres', minus: 'NADPH (Yarışmalı), Açil-KoA, DHEA' },
      { id: 'n-r5p', x: 760, y: 295, w: 185, h: 50, title: 'Ribuloz-5-P ↔ Riboz-5-P', sub: 'Transketolaz (B1-TPP) → PRPP', type: 'metabolite', pathway: 'hmp', junctionId: 'j-f6p' },

      // Continue Glycolysis Spine (x: 420)
      { id: 'n-f6p', x: 420, y: 340, w: 185, h: 46, title: 'FRUKTOZ-6-FOSFAT (F6P)', sub: 'HMP Geri Bağlantı Noktası', type: 'hub', pathway: 'glikoliz', junctionId: 'j-f6p' },
      { id: 'n-pfk1', x: 420, y: 425, w: 220, h: 54, title: '⚡ PFK-1  ⇄  FBPaz-1', sub: 'Glikoliz / Glukoneogenez Kilidi', type: 'rate-enzyme', pathway: 'glikoliz', junctionId: 'j-f6p',
        plus: 'PFK-1: F2,6BP, AMP, İnsülin | FBPaz-1: Sitrat, Glukagon', minus: 'PFK-1: ATP, Sitrat, H⁺ | FBPaz-1: F2,6BP, AMP' },
      { id: 'n-f16bp', x: 420, y: 510, w: 190, h: 44, title: 'Fruktoz-1,6-Bisfosfat', sub: 'Aldolaz A/B ile bölünür', type: 'metabolite', pathway: 'glikoliz', junctionId: 'j-dhap' },

      // Triose Split: G3P (x: 420) and DHAP -> Glycerol-3-P -> TAG (x: 135)
      { id: 'n-dhap', x: 135, y: 510, w: 185, h: 50, title: 'DHAP ↔ Gliserol-3-P', sub: '★ Gliserol & TAG Köprüsü', type: 'hub', pathway: 'lipogenez', junctionId: 'j-dhap' },
      { id: 'n-g3p', x: 420, y: 595, w: 205, h: 48, title: 'Gliseraldehit-3-P → 1,3-BPG', sub: 'GAPDH (NAD⁺ → NADH)', type: 'enzyme', pathway: 'glikoliz', junctionId: 'j-dhap',
        plus: 'Substrat: NAD⁺, Pᵢ | Yan dal (eritrosit): 1,3-BPG → 2,3-BPG', minus: 'Arsenat (Pᵢ yerine geçer → ATP kazanılmaz), İyodoasetat, Hg²⁺' },
      { id: 'n-pep', x: 420, y: 685, w: 205, h: 48, title: '3-PG → 2-PG → PEP', sub: 'PGK (ATP) & Enolaz (Mg²⁺)', type: 'enzyme', pathway: 'glikoliz', junctionId: 'j-piruvat',
        plus: 'Mg²⁺ / Mn²⁺, ADP', minus: 'Florür (F⁻ — Enolaz blokajı!)' },
      { id: 'n-pk', x: 420, y: 775, w: 215, h: 52, title: '⚡ Pirüvat Kinaz (PK)', sub: 'PEP + ADP → Pirüvat + ATP', type: 'rate-enzyme', pathway: 'glikoliz', junctionId: 'j-piruvat',
        plus: 'Fruktoz-1,6-BP (İleri besleme!), İnsülin', minus: 'ATP, Alanin, Asetil-KoA, Glukagon (KC)' },
      { id: 'n-piruvat', x: 420, y: 865, w: 195, h: 54, title: 'PİRÜVAT (3C)', sub: '★ 4 Yönlü Merkez Kavşak', type: 'hub', pathway: 'glikoliz', junctionId: 'j-piruvat' },

      // Branches from Pyruvate: Lactate & Alanine (x: 135, y: 865) and PEPCK/PC (x: 750, y: 775)
      { id: 'n-laktat-ala', x: 135, y: 865, w: 185, h: 52, title: 'Laktat (LDH) & Alanin (ALT)', sub: 'Cori & Cahill Döngüleri', type: 'metabolite', pathway: 'glikoliz', junctionId: 'j-piruvat',
        plus: 'LDH: Yüksek NADH/NAD⁺ | ALT: PLP (B6)', minus: 'LDH: Oksamat | ALT: İzoniazid (B6 eks.)' },
      { id: 'n-pc-pepck', x: 750, y: 790, w: 215, h: 56, title: '⚡ Pirüvat Karboksilaz & PEPCK', sub: 'Pirüvat → OAA → PEP (Glukoneogenez)', type: 'rate-enzyme', pathway: 'glukoneogenez', junctionId: 'j-piruvat',
        plus: 'PC: Asetil-KoA (Zorunlu!), Biyotin | PEPCK: Glukagon, Kortizol', minus: 'İnsülin, ADP, Etanol (Yüksek NADH), Avidin' },

      // Mitochondrial Gate: PDH Complex (x: 420, y: 985)
      { id: 'n-pdh', x: 420, y: 985, w: 220, h: 56, title: '⚡ PDH Kompleksi (Mitokondri)', sub: '5 Koenzim: TPP, Lipoat, CoA, FAD, NAD⁺', type: 'rate-enzyme', pathway: 'pdh', junctionId: 'j-asetilkoa',
        plus: 'İnsülin, Ca²⁺, Mg²⁺, ADP, Pirüvat, Dikloroasetat', minus: 'Asetil-KoA, NADH, ATP (PDH Kinaz), Arsenit (AsO₃³⁻)' },

      // MASTER HUB: ACETYL-CoA (x: 820, y: 985)
      { id: 'n-asetilkoa', x: 820, y: 985, w: 215, h: 60, title: 'ASETİL-KoA (2C)', sub: '★ Tüm Yakıtların Ortak Göbeği', type: 'hub', pathway: 'pdh', junctionId: 'j-asetilkoa' },

      // Left/Top Lipid Synthesis & Cholesterol & Ketogenesis Branches from Acetyl-CoA / Citrate
      { id: 'n-acc-fas', x: 1320, y: 260, w: 230, h: 58, title: '⚡ ACC & Yağ Asidi Sentaz (FAS)', sub: 'Sitrat → Asetil-KoA → Malonil-KoA → Palmitat', type: 'rate-enzyme', pathway: 'lipogenez', junctionId: 'j-sitrat',
        plus: 'Sitrat (Polimerizasyon!), İnsülin, NADPH', minus: 'Palmitoil-KoA, Glukagon, AMPK (Metformin) | ACL: Bempedoik Asit' },
      { id: 'n-tag', x: 1320, y: 140, w: 210, h: 50, title: 'TRİAÇİLGLİSEROL (TAG) & YAĞ', sub: 'Palmitoil-KoA + Gliserol-3-P (DHAP\'tan)', type: 'metabolite', pathway: 'lipogenez', junctionId: 'j-dhap' },
      { id: 'n-hsl-cpti', x: 1320, y: 420, w: 235, h: 58, title: '⚡ HSL (Lipoliz) & CPT-I (Karnitin)', sub: 'TAG → Yağ Asidi → Açil-Karnitin → Matriks', type: 'rate-enzyme', pathway: 'beta_oks', junctionId: 'j-sitrat',
        plus: 'Epinefrin, Glukagon, Kortizol, Karnitin, Kafein', minus: 'CPT-I: Malonil-KoA (Kilit!), Etomoksir | HSL: İnsülin, Niasin (B3)' },
      { id: 'n-betaoks', x: 1320, y: 555, w: 230, h: 56, title: 'β-Oksidasyon Spirali (MCAD vb.)', sub: 'Açil-KoA → Asetil-KoA + FADH₂ + NADH', type: 'enzyme', pathway: 'beta_oks', junctionId: 'j-asetilkoa',
        plus: 'NAD⁺, FAD, CoA-SH', minus: 'Hipoglisin A (Ackee toksini → MCAD blokajı!), NADH, Asetil-KoA' },

      // Ketogenesis & Cholesterol (x: 1320, y: 710 & 835)
      { id: 'n-hmg-red', x: 1320, y: 700, w: 230, h: 56, title: '⚡ HMG-KoA Redüktaz (Sitozol/ER)', sub: 'HMG-KoA + 2 NADPH → Mevalonat → Kolesterol', type: 'rate-enzyme', pathway: 'keton_kolesterol', junctionId: 'j-asetilkoa',
        plus: 'İnsülin, Tiroid Hormonu (T₃), SREBP-2', minus: 'Statinler (Yarışmalı!), Kolesterol, Safra Asitleri, Glukagon, AMPK' },
      { id: 'n-ketogenez', x: 1320, y: 840, w: 230, h: 56, title: '⚡ mHMG-KoA Sentaz & Tiyoforaz', sub: 'Ketogenez (KC) ↔ Ketoliz (Beyin/Kas)', type: 'rate-enzyme', pathway: 'keton_kolesterol', junctionId: 'j-asetilkoa',
        plus: 'Açlık, Glukagon, Yağ Asitleri, SIRT3', minus: 'İnsülin, Süksinil-KoA (Süksinilasyon ile inhibe eder!)' },

      // TCA CYCLE RING (Center-Bottom-Right: x around 820..1450, y around 1100..1580)
      { id: 'n-sitrat-sentaz', x: 1080, y: 1080, w: 210, h: 52, title: 'Sitrat Sentaz & Akonitaz', sub: 'OAA (4C) + Asetil-KoA (2C) → Sitrat', type: 'enzyme', pathway: 'tca', junctionId: 'j-sitrat',
        plus: 'OAA & Asetil-KoA, ADP, Fe²⁺', minus: 'ATP, NADH, Süksinil-KoA, Sitrat | Akonitaz: Floroasetat!' },
      { id: 'n-sitrat', x: 1360, y: 1080, w: 195, h: 52, title: 'SİTRAT → İZOSİTRAT (6C)', sub: '★ Sitrat Mekiği Çıkış Kavşağı', type: 'hub', pathway: 'tca', junctionId: 'j-sitrat' },
      { id: 'n-idh', x: 1620, y: 1180, w: 220, h: 56, title: '⚡ İzositrat Dehidrogenaz (IDH)', sub: 'TCA Hız Kısıtlayıcı! → NADH + CO₂', type: 'rate-enzyme', pathway: 'tca', junctionId: 'j-alfakg',
        plus: 'ADP (En güçlü!), Ca²⁺, NAD⁺, Mg²⁺', minus: 'ATP, NADH' },
      { id: 'n-alfakg', x: 1620, y: 1320, w: 205, h: 52, title: 'α-KETOGLUTARAT (5C)', sub: '★ Glutamat & AA Kavşağı', type: 'hub', pathway: 'tca', junctionId: 'j-alfakg' },
      { id: 'n-akgdh', x: 1520, y: 1465, w: 220, h: 54, title: '⚡ α-KGDH Kompleksi', sub: '5 Koenzim (B1-TPP, Lipoat...) → NADH + CO₂', type: 'rate-enzyme', pathway: 'tca', junctionId: 'j-suksinilkoa',
        plus: 'Ca²⁺ | Kofaktör: TPP (B1), Lipoat, KoA, FAD, NAD⁺', minus: 'Süksinil-KoA, NADH, ATP, Arsenit (AsO₃³⁻)' },
      { id: 'n-suksinilkoa', x: 1220, y: 1540, w: 210, h: 54, title: 'SÜKSİNİL-KoA (4C) → GTP', sub: '★ Propiyonil (B12) / Hem / Ketoliz', type: 'hub', pathway: 'tca', junctionId: 'j-suksinilkoa' },
      { id: 'n-sdh', x: 920, y: 1540, w: 215, h: 54, title: 'Süksinat Dehidrogenaz (SDH)', sub: 'ETZ Kompleks II! (FAD → FADH₂)', type: 'enzyme', pathway: 'tca', junctionId: 'j-etz',
        plus: 'Süksinat, Pᵢ, CoQ', minus: 'Malonat (Klasik yarışmalı!), Oksaloasetat, Karboksin' },
      { id: 'n-fumarat', x: 660, y: 1420, w: 195, h: 52, title: 'FUMARAT ↔ L-MALAT (4C)', sub: '★ Üre Döngüsü ("Krebs Bisikleti")', type: 'hub', pathway: 'tca', junctionId: 'j-fumarat-oaa' },
      { id: 'n-oaa', x: 760, y: 1210, w: 210, h: 56, title: 'OKSALOASETAT (OAA, 4C)', sub: '★ MDH (NADH) • TCA / Glukoneogenez / AST', type: 'hub', pathway: 'tca', junctionId: 'j-fumarat-oaa',
        plus: 'Yüksek NAD⁺, Sitrat Sentaz çekişi', minus: 'Yüksek NADH/NAD⁺ (Etanol hipoglisemisi!)' },

      // UREA CYCLE & AMINO ACID HUB (Right Side: x: 2040)
      { id: 'n-gdh-alt', x: 2040, y: 1200, w: 230, h: 56, title: 'ALT/AST [B6] & GDH', sub: 'AA ↔ Glutamat ↔ α-KG + Serbest NH₄⁺', type: 'enzyme', pathway: 'ure_aa', junctionId: 'j-alfakg',
        plus: 'GDH: ADP, GDP, Lösin | ALT/AST: PLP (B6)', minus: 'GDH: ATP, GTP, NADH | B6 eks: İzoniazid' },
      { id: 'n-cpsi', x: 2040, y: 1335, w: 235, h: 58, title: '⚡ CPS-I (Hız Kısıtlayıcı) & OTC', sub: 'NH₄⁺ + HCO₃⁻ + 2 ATP → Karbamoil-P → Sitrülin', type: 'rate-enzyme', pathway: 'ure_aa', junctionId: 'j-fumarat-oaa',
        plus: 'N-Asetilglutamat (NAG — Zorunlu!), Arjinin (NAGS [+]), Glukagon', minus: 'Valproik Asit (NAGS [-]), Propiyonil-KoA' },
      { id: 'n-ure-sitozol', x: 2040, y: 1475, w: 235, h: 58, title: 'ASS → ASL → Arjinaz-I (Mn²⁺)', sub: 'Arjininosüksinat → Arjinin + Fumarat → ÜRE + Ornitin', type: 'enzyme', pathway: 'ure_aa', junctionId: 'j-fumarat-oaa',
        plus: 'Aspartat (OAA\'dan AST ile), ATP, Mn²⁺', minus: 'Ornitin ve Lizin (Arjinaz yarışmalı [-])' },

      // ELECTRON TRANSPORT CHAIN & OXPHOS (Bottom Left: x: 250, y: 1220..1540)
      { id: 'n-etz-1-2', x: 250, y: 1230, w: 245, h: 58, title: 'ETZ Kompleks I & II → CoQ₁₀', sub: 'NADH (Kompleks I) & FADH₂ (Kompleks II / ETF)', type: 'enzyme', pathway: 'etz', junctionId: 'j-etz',
        plus: 'Yüksek ADP/ATP (Solunum kontrolü), NADH, Süksinat', minus: 'Kompleks I: Rotenon, Amobarbital, Pierisidin | II: Malonat, TTFA' },
      { id: 'n-etz-3-4', x: 250, y: 1380, w: 245, h: 58, title: '⚡ ETZ Kompleks III → Sit c → IV', sub: 'Q Döngüsü & O₂ → H₂O (III: 4 H⁺ + IV: 2 H⁺)', type: 'rate-enzyme', pathway: 'etz', junctionId: 'j-etz',
        plus: 'ADP, O₂, Cu²⁺ / Fe (Hem a/a₃)', minus: 'III: Antimisin A, BAL | IV: Siyanür (CN⁻), CO, H₂S, Azid (NaN₃)' },
      { id: 'n-atp-sentaz', x: 250, y: 1530, w: 245, h: 58, title: 'Kompleks V (F₀F₁ ATP Sentaz) & ANT', sub: 'Proton Gradyenti (Δp) → ADP + Pᵢ → ATP', type: 'enzyme', pathway: 'etz', junctionId: 'j-etz',
        plus: 'Proton Gradyenti | Ayırıcılar (Isı [+], ATP [-]): 2,4-DNP, UCP-1, Aspirin', minus: 'F₀: Oligomisin, DCCD | F₁: Aurovertin | ANT: Atraktilozit, Bongkrekik Asit' }
    ];

    const MAP_EDGES = [
      // Glycolysis & Gluconeogenesis Spine
      { from: 'n-glukoz', to: 'n-hk', label: 'Glukoz Girişi' },
      { from: 'n-hk', to: 'n-g6p', label: 'ATP → ADP | G6Paz: → Pᵢ', bi: true },
      { from: 'n-g6p', to: 'n-g1p', label: 'Fosfoglukomutaz', bi: true },
      { from: 'n-g1p', to: 'n-gs-gp', label: 'UDP-Glukoz', bi: true },
      { from: 'n-gs-gp', to: 'n-glikojen', label: 'Glikojenez / Glikojenoliz', bi: true },
      { from: 'n-g6p', to: 'n-g6pd', label: 'HMP Girişi' },
      { from: 'n-g6pd', to: 'n-r5p', label: '+2 NADPH' },
      { from: 'n-r5p', to: 'n-f6p', label: 'Transketolaz (B1) / Transaldolaz', bi: true },
      { from: 'n-r5p', to: 'n-g3p', label: 'G3P Geri Bağlantısı', bi: true },
      { from: 'n-g6p', to: 'n-f6p', label: 'İzomeraz', bi: true },
      { from: 'n-f6p', to: 'n-pfk1', label: 'F6P', bi: true },
      { from: 'n-pfk1', to: 'n-f16bp', label: 'F1,6BP', bi: true },
      { from: 'n-f16bp', to: 'n-dhap', label: 'Aldolaz', bi: true },
      { from: 'n-dhap', to: 'n-g3p', label: 'TPI', bi: true },
      { from: 'n-dhap', to: 'n-tag', label: 'Gliserol-3-P → TAG Sentezi' },
      { from: 'n-f16bp', to: 'n-g3p', label: 'G3P (×2)', bi: true },
      { from: 'n-g3p', to: 'n-pep', label: '1,3-BPG → 3-PG → 2-PG', bi: true },
      { from: 'n-pep', to: 'n-pk', label: 'PEP' },
      { from: 'n-pk', to: 'n-piruvat', label: '+2 ATP' },
      { from: 'n-piruvat', to: 'n-laktat-ala', label: 'LDH & ALT [B6]', bi: true },
      { from: 'n-piruvat', to: 'n-pc-pepck', label: 'Mitokondri PC (Biyotin)' },
      { from: 'n-pc-pepck', to: 'n-pep', label: 'OAA → PEP (GTP)' },
      { from: 'n-oaa', to: 'n-pc-pepck', label: 'Malat Mekiği → OAA' },
      { from: 'n-piruvat', to: 'n-pdh', label: 'Mitokondriye Giriş' },
      { from: 'n-pdh', to: 'n-asetilkoa', label: 'CO₂ + NADH' },

      // Acetyl-CoA Connections
      { from: 'n-asetilkoa', to: 'n-pc-pepck', label: '[+] PC Zorunlu Aktivatörü!', dashed: true },
      { from: 'n-asetilkoa', to: 'n-sitrat-sentaz', label: 'TCA Girişi (2C)' },
      { from: 'n-asetilkoa', to: 'n-ketogenez', label: 'Ketogenez / Ketoliz', bi: true },
      { from: 'n-asetilkoa', to: 'n-hmg-red', label: 'Sitozolik HMG-KoA' },

      // Citrate -> Lipogenesis & Malonyl-CoA inhibition of CPT-I
      { from: 'n-sitrat', to: 'n-acc-fas', label: 'Sitrat Mekiği (ACL)' },
      { from: 'n-acc-fas', to: 'n-tag', label: 'Palmitat (16C) → Açil-KoA' },
      { from: 'n-acc-fas', to: 'n-hsl-cpti', label: '[-] Malonil-KoA CPT-I\'i Bloke Eder!', dashed: true },
      { from: 'n-tag', to: 'n-hsl-cpti', label: 'Lipoliz (Serbest Yağ Asidi)' },
      { from: 'n-hsl-cpti', to: 'n-betaoks', label: 'Karnitin Mekiği → Matriks' },
      { from: 'n-betaoks', to: 'n-asetilkoa', label: '8 Asetil-KoA' },
      { from: 'n-betaoks', to: 'n-suksinilkoa', label: 'Tek Sayılı Karbonlu YA → Propiyonil-KoA (B7/B12)', dashed: true },

      // TCA Cycle Ring
      { from: 'n-oaa', to: 'n-sitrat-sentaz', label: 'OAA (4C)' },
      { from: 'n-sitrat-sentaz', to: 'n-sitrat', label: 'Sitrat (6C)' },
      { from: 'n-sitrat', to: 'n-idh', label: 'İzositrat' },
      { from: 'n-idh', to: 'n-alfakg', label: 'NADH + CO₂' },
      { from: 'n-alfakg', to: 'n-akgdh', label: 'α-KG (5C)' },
      { from: 'n-akgdh', to: 'n-suksinilkoa', label: 'NADH + CO₂' },
      { from: 'n-suksinilkoa', to: 'n-sdh', label: 'Süksinat + GTP' },
      { from: 'n-sdh', to: 'n-fumarat', label: 'Fumarat + FADH₂' },
      { from: 'n-fumarat', to: 'n-oaa', label: 'Malat → OAA + NADH' },

      // TCA <-> Urea Cycle ("Krebs Bicycle")
      { from: 'n-alfakg', to: 'n-gdh-alt', label: 'Glutamat ↔ α-KG', bi: true },
      { from: 'n-gdh-alt', to: 'n-cpsi', label: 'Serbest NH₄⁺ (1. Azot)' },
      { from: 'n-cpsi', to: 'n-ure-sitozol', label: 'Sitrülin (Sitozole çıkar)' },
      { from: 'n-oaa', to: 'n-ure-sitozol', label: 'AST → L-Aspartat (2. Azot)' },
      { from: 'n-ure-sitozol', to: 'n-fumarat', label: 'ASL → Fumarat (TCA\'ya döner!)' },

      // NADH / FADH2 -> Electron Transport Chain
      { from: 'n-sdh', to: 'n-etz-1-2', label: 'Kompleks II (FADH₂ → CoQ)' },
      { from: 'n-pdh', to: 'n-etz-1-2', label: 'NADH Akışı', dashed: true },
      { from: 'n-etz-1-2', to: 'n-etz-3-4', label: 'CoQH₂ (Ubikinol)' },
      { from: 'n-etz-3-4', to: 'n-atp-sentaz', label: 'Proton Gradyenti (Δp / H⁺)' }
    ];

window.BIO_DATA = { PATHWAYS, METABOLIC_HUBS, MAP_NODES, MAP_EDGES };
