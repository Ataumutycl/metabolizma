# Metabolizma — Görsel Tasarım Dili

Uygulamanın tüm ekranları bu kurallarla yapılmıştır. Amaç, uygulamanın Apple'ın kendi uygulamalarından biri (Sağlık, Ayarlar, Fitness) gibi hissettirmesidir: sakin, ferah, hiyerarşisi net ve dokunması keyifli.

Kaynak dosyalar: `src/tokens.css` (değişkenler) ve `src/components.css` (bileşenler).

---

## 1. İlkeler

1. **İçerik önde, arayüz geride.** Kalın çerçeveler, parlamalar, gradyan yüzeyler ve emoji kullanılmaz. Hiyerarşi; yazı ağırlığı, renk tonu (birincil, ikincil, üçüncül etiket) ve boşlukla kurulur.
2. **Tek anlam, tek renk.** Her biyokimyasal kavramın tüm uygulamada aynı rengi ve ikonu vardır (bkz. §3).
3. **Biyokimya notasyonuna sadık kalmak.** Aktivasyon (+) işaretli bir okla, inhibisyon ise (−) işaretli düz başlı "T" çizgisiyle (⊣) gösterilir. Reaksiyonlar yukarıdan aşağıya akar: substrat, enzim, ürün.
4. **Başparmak dostu.** Her dokunma alanı en az 44×44 pt'dir. Gezinme alttaki yüzen sekme çubuğuyla yapılır. Geri dönmek için ekranın sol kenarından kaydırmak yeterlidir.
5. **Açık ve koyu mod eşit önemdedir.** Her renk iki modda da tanımlıdır. Tema varsayılan olarak sisteme uyar; istenirse elle seçilebilir.

## 2. Renk sistemi

iOS sistem renkleri birebir kullanılır. Koyu modda her renk Apple'ın koyu varyantına geçer.

| Rol | Açık | Koyu |
|---|---|---|
| Arka plan (gruplu) | `#F2F2F7` | `#000000` |
| Kart / hücre | `#FFFFFF` | `#1C1C1E` |
| Kart içi kutu | `#F2F2F7` | `#2C2C2E` |
| Birincil etiket | `#000000` | `#FFFFFF` |
| İkincil etiket | `rgba(60,60,67,.60)` | `rgba(235,235,245,.60)` |
| Üçüncül etiket | `rgba(60,60,67,.30)` | `rgba(235,235,245,.30)` |
| Ayırıcı (0.5 px) | `rgba(60,60,67,.29)` | `rgba(84,84,88,.60)` |
| Vurgu (tint) | Mavi `#007AFF` | `#0A84FF` |

## 3. Anlamsal roller

| Kavram | Renk | İkon | Kullanım |
|---|---|---|---|
| (+) Aktivatör | Yeşil | + dairesi, ok | Allosterik aktivatör, hormon, kofaktör |
| (−) İnhibitör / toksin | Kırmızı | − dairesi, T-çizgi | Geri bildirim, fosforilasyon, ilaç, zehir |
| Hız kısıtlayıcı basamak | Turuncu | Şimşek | Yolağın taahhüt (committed) basamağı |
| Kavşak / köprü | Turkuaz | Zincir halkası | Yolaklar arası ortak molekül |
| Klinik korelasyon | Mor | Stetoskop | Patofizyoloji ve hastalık mekanizması |
| Tokluk (insülin) | Yeşil | Yaprak | Defosforilasyonla aktifleşen basamaklar |
| Açlık (glukagon) | İndigo | Ay | cAMP/PKA ile fosforilasyon |

Rozetler ve renkli kutular, rengin %11–14 karışımlı yumuşak bir zeminini (`--*-soft`) ve okunurluğu yüksek koyu tonunu (`--*-text`) kullanır.

### Yolak renkleri (Ayarlar uygulaması tarzı ikon kareleri)

| # | Yolak | Renk | İkon |
|---|---|---|---|
| 1 | Glikoliz | Mavi | Aşağı ok (yıkım) |
| 2 | Glukoneogenez | Yeşil | Yukarı ok (sentez) |
| 3 | Glikojen | İndigo | Katmanlar (depo) |
| 4 | Pentoz fosfat | Teal | Kalkan (NADPH, antioksidan) |
| 5 | PDH köprüsü | Sarı | Çizgiye ok (geçiş) |
| 6 | TCA döngüsü | Turuncu | Döngü |
| 7 | ETZ ve oksidatif fosforilasyon | Mor | Batarya (ATP) |
| 8 | Lipogenez | Mint | Damla (yağ) |
| 9 | β-Oksidasyon | Pembe | Alev (yakım) |
| 10 | Keton ve kolesterol | Kahve | Altıgen halka (sterol) |
| 11 | Üre döngüsü | Camgöbeği | N (azot) |

Harita kompartmanları: Sitozol mavi, mitokondri matriksi turuncu, iç mitokondri membranı mor, üre döngüsü camgöbeği.

## 4. Tipografi

Yazı tipi San Francisco'dur (`-apple-system`). Harici font yüklenmez, bu yüzden çevrimdışı ve hızlı çalışır. Ölçek, iOS Dynamic Type'ın "Large" (varsayılan) boyutudur. iPhone'daki Metin Boyutu ayarı otomatik olarak uygulanır (`-apple-system-body`). Uygulama içindeki Görünüm > Yazı Boyutu ayarı buna ayrıca çarpan ekler.

| Stil | Boyut / satır | Ağırlık | Kullanım |
|---|---|---|---|
| Large Title | 34 / 41 | Bold | Sekme kök başlıkları |
| Title 1 | 28 / 34 | Bold | Hero başlıklar |
| Title 2 | 22 / 28 | Bold | Basamak enzim adı |
| Title 3 | 20 / 25 | Semibold | Öne çıkan bölüm başlığı |
| Headline | 17 / 22 | Semibold | Satır başlığı, klinik not başlığı |
| Body | 17 / 22 | Regular | Liste metni |
| Okuma | 17 / 25 | Regular | Uzun klinik notlar (`.reading`) |
| Subhead | 15 / 20 | Regular | Alt başlıklar |
| Footnote | 13 / 18 | Regular | Bölüm başlığı (BÜYÜK HARF) ve dipnot |
| Caption 1 / 2 | 12 / 16, 11 / 13 | Regular / Semibold | Rozet, etiket |

Başlıklar cümle düzeninde yazılır. Veri setindeki BÜYÜK HARFLİ başlıklar ekranda otomatik olarak okunur biçime çevrilir.

## 5. Boşluk, ızgara ve köşeler

- **4 pt ızgara:** 4, 8, 12, 16, 20, 24, 32, 40.
- **Yatay kenar boşluğu:** 16 pt (Pro Max ve Plus'ta 20 pt).
- **Köşe yarıçapları:** rozet 6, kart içi kutu 10, ikon karesi 8 / 12 / 16, liste bölümü ve kart 22, sheet 28, kapsül 999. Bu büyük ve sürekli eğriler iOS 26 hissini verir.
- **Güvenli alanlar:** Çentik, Dynamic Island ve ana ekran çubuğu için `env(safe-area-inset-*)` her yerde hesaba katılır.

## 6. Materyaller (Liquid Glass)

- **Cam:** yarı saydam zemin, `blur(22px) saturate(180%)`, 0.5 px iç parlak kenar ve yumuşak yüzen gölge. Sekme çubuğu, gezinti düğmeleri, harita kontrolleri ve araç çubukları bu materyali kullanır.
- **Gezinti çubuğu:** Başta şeffaftır. Büyük başlık kaydırılıp kaybolunca buzlu cam zemin ve satır içi başlık belirir.
- **Sheet:** Büyük açıldığında arkadaki sayfa %92 ölçeğe küçülür ve köşeleri yuvarlanır (iOS kart yığını hissi). Orta yükseklikte açıldığında arkadaki sayfa olduğu gibi kalır.

## 7. Bileşenler

| Bileşen | Sınıf | Not |
|---|---|---|
| Gruplu liste | `.section`, `.list`, `.row` | Inset grouped, 0.5 px ayırıcı, ikonlu satırda ayırıcı girintisi |
| Renkli ikon karesi | `.icon-tile` | Ayarlar uygulaması tarzı, hafif üst parlaklık |
| Rozet | `.badge.is-rate/act/inh/jn/clin/fed/fast` | Kapsül, 22 pt |
| İşaret dairesi | `.sign.is-act/is-inh` | (+) yeşil, (−) kırmızı |
| Segmentli kontrol | `.segmented` | Kayan beyaz "thumb", iOS yay eğrisi |
| Arama alanı | `.search-field` | Türkçe ve aksan duyarsız arama |
| Düğmeler | `.btn.is-filled/tinted/gray/plain`, `.glass-btn` | 50 pt dolu, 44 pt cam daire |
| Anahtar | `.switch` | iOS toggle |
| Sheet | `App.sheet()` | Orta/büyük yükseklik, tutamaktan sürüklenebilir |
| Yüzen araç çubuğu | `.float-toolbar` | Sekme çubuğunun üstünde (Önceki / Sonraki) |

## 8. Hareket

- **Push/pop:** 420 ms, `cubic-bezier(.32,.72,0,1)`. Arka sayfa %28 paralaksla kayar ve hafif kararır.
- **Kenardan geri kaydırma:** Parmağı takip eder. Ekran genişliğinin %35'ini geçince ya da hızlı fırlatınca bırakılan sayfa kapanır.
- **Sheet:** 500 ms, aynı eğri. Hızlı aşağı fırlatma sheet'i kapatır.
- **Dokunma geri bildirimi:** Satırlar 120 ms'de vurgulanır, düğmeler 0.92–0.97 ölçeğe iner.
- "Hareketi Azalt" açıksa tüm süreler sıfırlanır.

## 9. Bilgi mimarisi

```
Sekme çubuğu
├── Yolaklar   → Yolak (kesintisiz basamak omurgası) → Basamak (reaksiyon diyagramı, (+)/(−), bağlantılar, klinik)
├── Harita     → 2B entegre harita (kaydır, iki parmakla yakınlaştır, çift dokun) → düğüm sheet'i
├── Kavşaklar  → Kavşak (gelen/giden yolaklar, kavşaktaki basamaklar)
├── Enzimler   → Hız kısıtlayıcı / tüm basamaklar, hızlı bakış (sınav tekrarı)
└── Ara        → Basamak, kavşak ve yolaklarda vurgulu arama
```

Basamak sayfasındaki Önceki / Sonraki düğmeleri (ve yatay kaydırma) 11 yolağın 39 basamağını **kesintisiz** dolaşır. Bu, orijinal uygulamanın "kesintisiz şema" fikrinin iPhone'a uyarlanmış hâlidir.
