# Metabolizma

iPhone için tasarlanmış, Türkçe entegre metabolizma atlası: 11 yolak, 39 basamak, şema dışı (+) aktivatör ve (−) inhibitör regülasyonu, kavşaklar, etkileşimli harita, 62 hastalık ve 60 toksin/ilaç.

**Uygulamayı aç:** https://ataumutycl.github.io/metabolizma

## iPhone'a uygulama olarak ekleme
1. Linki **Safari**'de aç.
2. Alttaki **Paylaş** düğmesine dokun.
3. **Ana Ekrana Ekle**'yi seç.

Uygulama kendi ikonuyla tam ekran açılır ve ilk açılıştan sonra internetsiz çalışır.

## Geliştirme
- Kaynak: `src/` (veri: `data*.js`, çekirdek: `core.js`, ekranlar: `views/`)
- Derleme: `node tools/build.js` → `dist/` (tek dosyalık `index.html` + PWA dosyaları). Yayın için `dist/` içeriği repo köküne kopyalanır.
- Tasarım dili: `docs/TASARIM_DILI.md`

Kaynaklar: Lehninger, Harper ve Lippincott Biyokimya. Ders çalışma amaçlıdır; klinik karar için kullanılmamalıdır.
