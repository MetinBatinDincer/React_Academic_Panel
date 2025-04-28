const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { 
  basvurular: Basvuru, 
  users: User,
  makaleler: Makaleler,
  btf,
  kitaplar: Kitaplar,
  atiflar: Atiflar,
  degerlendirmeler,
  puanlar
} = require('../db');

// ▶ ADAY: Yeni başvuru oluştur
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { ilan_id } = req.body;
    const kullanici_id = req.user.id;

    const existing = await Basvuru.findOne({ where: { ilan_id, kullanici_id } });
    if (existing) return res.status(400).json({ error: 'Bu ilana zaten başvurdunuz.' });

    const yeni = await Basvuru.create({ ilan_id, kullanici_id });
    res.status(201).json(yeni);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Başvuru oluşturulamadı.' });
  }
});

// ▶ ADAY: Kendi başvurularını listele
router.get('/', authenticateToken, async (req, res) => {
  try {
    const liste = await Basvuru.findAll({ where: { kullanici_id: req.user.id } });
    res.json(liste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Başvurular getirilemedi.' });
  }
});

// ▶ ADAY: Başvuruyu sil (durumu "Beklemede" ise)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const basvuru = await Basvuru.findByPk(req.params.id);
    if (!basvuru || basvuru.kullanici_id !== req.user.id) return res.status(404).json({ error: 'Başvuru bulunamadı.' });
    if (basvuru.durum !== 'Beklemede') return res.status(400).json({ error: 'Sadece beklemedeki başvuru silinebilir.' });

    await basvuru.destroy();
    res.json({ message: 'Başvuru silindi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Başvuru silinemedi.' });
  }
});

// ▶ ADMIN: Tüm başvuruları listele
router.get('/all', authenticateToken, async (req, res) => {
  if (req.user.rol !== 'yonetici') return res.status(403).json({ error: 'Yetersiz yetki.' });
  const all = await Basvuru.findAll();
  res.json(all);
});

// ▶ ADMIN: Başvuru durumunu güncelle
router.put('/:id/status', authenticateToken, async (req, res) => {
  if (req.user.rol !== 'yonetici') return res.status(403).json({ error: 'Yetersiz yetki.' });
  const { durum } = req.body;
  const basvuru = await Basvuru.findByPk(req.params.id);
  if (!basvuru) return res.status(404).json({ error: 'Başvuru bulunamadı.' });

  basvuru.durum = durum;
  basvuru.guncelleme_tarihi = new Date();
  await basvuru.save();
  res.json(basvuru);
});

// ▶ YÖNETİCİ: Belirli bir ilana yapılan başvuruları getir
router.get('/ilan/:ilan_id', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol !== 'yonetici') {
      return res.status(403).json({ error: 'Yetersiz yetki.' });
    }

    console.log(`${req.params.ilan_id} ID'li ilana yapılan başvurular getiriliyor...`);
    console.log('User modeli:', User); // User modelini kontrol et

    const basvurular = await Basvuru.findAll({
      where: { ilan_id: req.params.ilan_id },
      include: [{
        model: User,
        attributes: ['id', 'ad', 'soyad', 'email'],
        required: true
      }],
      order: [['basvuru_tarihi', 'DESC']]
    });

    console.log('Ham başvuru verileri:', JSON.stringify(basvurular, null, 2));

    const formattedBasvurular = basvurular.map(basvuru => {
      const plainBasvuru = basvuru.get({ plain: true });
      console.log('Düzleştirilmiş başvuru verisi:', plainBasvuru);
      return {
        ...plainBasvuru,
        basvuru_tarihi: plainBasvuru.basvuru_tarihi ? new Date(plainBasvuru.basvuru_tarihi).toLocaleDateString('tr-TR') : null,
        guncelleme_tarihi: plainBasvuru.guncelleme_tarihi ? new Date(plainBasvuru.guncelleme_tarihi).toLocaleDateString('tr-TR') : null
      };
    });

    console.log('Formatlanmış başvurular:', JSON.stringify(formattedBasvurular, null, 2));
    res.json(formattedBasvurular);
  } catch (err) {
    console.error('Başvurular getirilirken hata:', err);
    console.error('Hata detayı:', err.original || err);
    res.status(500).json({ 
      error: 'Başvurular getirilemedi.',
      message: err.message 
    });
  }
});

// Makaleler için rotalar
router.post('/:basvuru_id/makaleler', authenticateToken, async (req, res) => {
  try {
    const basvuru_id = parseInt(req.params.basvuru_id);
    if (isNaN(basvuru_id)) {
      return res.status(400).json({ error: 'Geçersiz başvuru ID' });
    }

    // Başvurunun varlığını kontrol et
    const basvuru = await Basvuru.findByPk(basvuru_id);
    if (!basvuru) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }

    const { kategori, yazar, makale_ad, dergi_ad, cilt_no, sayfa, yil, yazar_rolu } = req.body;
    
    // Debug için konsola yazdır
    console.log('Gelen basvuru_id:', basvuru_id);
    console.log('Gelen veri:', req.body);
    
    const yeniMakale = await Makaleler.create({
      basvuru_id,
      kategori,
      yazar,
      makale_ad,
      dergi_ad,
      cilt_no: parseInt(cilt_no) || null,
      sayfa: parseInt(sayfa) || null,
      yil: parseInt(yil) || null,
      yazar_rolu
    });

    res.status(201).json(yeniMakale);
  } catch (err) {
    console.error('Makale oluşturma hatası:', err);
    res.status(500).json({ 
      error: 'Makale eklenirken bir hata oluştu.',
      details: err.message 
    });
  }
});

router.get('/:basvuru_id/makaleler', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const makalelerList = await Makaleler.findAll({
      where: { basvuru_id: parseInt(basvuru_id) }
    });
    console.log('Bulunan makaleler:', makalelerList);
    res.json(makalelerList);
  } catch (err) {
    console.error('Makaleleri getirme hatası:', err);
    res.status(500).json({ error: 'Makaleler getirilirken bir hata oluştu.' });
  }
});

// BTF için rotalar
router.post('/:basvuru_id/btf', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const { kategori, yazar, bildiri_adi, konferans_adi, yapildigi_yer, sayfa_sayilari, tarih } = req.body;
    
    const yeniBTF = await btf.create({
      basvuru_id,
      kategori,
      yazar,
      bildiri_adi,
      konferans_adi,
      yapildigi_yer,
      sayfa_sayilari,
      tarih
    });

    res.status(201).json(yeniBTF);
  } catch (err) {
    console.error('BTF oluşturma hatası:', err);
    res.status(500).json({ error: 'BTF eklenirken bir hata oluştu.' });
  }
});

router.get('/:basvuru_id/btf', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const btfler = await btf.findAll({
      where: { basvuru_id }
    });
    res.json(btfler);
  } catch (err) {
    console.error('BTF getirme hatası:', err);
    res.status(500).json({ error: 'BTF\'ler getirilirken bir hata oluştu.' });
  }
});

// Kitaplar için rotalar
router.post('/:basvuru_id/kitaplar', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const { kategori, yazar, kitap_adi, yayinevi, baski_sayisi, yayimlandigi_yer, yil } = req.body;
    
    const yeniKitap = await Kitaplar.create({
      basvuru_id,
      kategori,
      yazar,
      kitap_adi,
      yayinevi,
      baski_sayisi,
      yayimlandigi_yer,
      yil
    });

    res.status(201).json(yeniKitap);
  } catch (err) {
    console.error('Kitap oluşturma hatası:', err);
    res.status(500).json({ error: 'Kitap eklenirken bir hata oluştu.' });
  }
});

router.get('/:basvuru_id/kitaplar', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const kitaplarList = await Kitaplar.findAll({
      where: { basvuru_id: parseInt(basvuru_id) }
    });
    console.log('Bulunan kitaplar:', kitaplarList);
    res.json(kitaplarList);
  } catch (err) {
    console.error('Kitapları getirme hatası:', err);
    res.status(500).json({ error: 'Kitaplar getirilirken bir hata oluştu.' });
  }
});

// Jüri değerlendirmesini getir
router.get('/:basvuru_id/degerlendirme', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const juri_id = req.user.id;

    const degerlendirme = await degerlendirmeler.findOne({
      where: {
        basvuru_id: parseInt(basvuru_id),
        juri_id: juri_id
      }
    });

    res.json(degerlendirme);
  } catch (err) {
    console.error('Değerlendirme getirme hatası:', err);
    res.status(500).json({ error: 'Değerlendirme bilgileri getirilemedi.' });
  }
});

// Jüri değerlendirmesi kaydetme/güncelleme endpoint'i
router.post('/:basvuru_id/degerlendirme', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const { 
      degerlendirme_metni, 
      durum, 
      makaleler_puani,
      btf_puani,
      kitaplar_puani,
      atiflar_puani,
      toplam_puan,
      juri_raporu,
      juri_yorumu
    } = req.body;
    const juri_id = req.user.id;

    console.log('Gelen değerlendirme verileri:', { 
      basvuru_id, 
      degerlendirme_metni, 
      durum, 
      makaleler_puani,
      btf_puani,
      kitaplar_puani,
      atiflar_puani,
      toplam_puan,
      juri_raporu,
      juri_yorumu,
      juri_id 
    });

    // Başvuruyu bul
    const basvuru = await Basvuru.findByPk(basvuru_id);
    if (!basvuru) {
      return res.status(404).json({ error: 'Başvuru bulunamadı.' });
    }

    // Jüri yetkisi kontrolü
    if (req.user.rol !== 'juri' && req.user.rol !== 'yonetici') {
      return res.status(403).json({ error: 'Bu işlem için jüri yetkisi gereklidir.' });
    }

    // Mevcut değerlendirmeyi kontrol et
    let degerlendirme = await degerlendirmeler.findOne({
      where: {
        basvuru_id: parseInt(basvuru_id),
        juri_id: juri_id
      }
    });

    // Puanlar tablosunu bul veya oluştur
    let puan = await puanlar.findOne({
      where: { basvuru_id: parseInt(basvuru_id) }
    });

    if (!puan) {
      puan = await puanlar.create({
        basvuru_id: parseInt(basvuru_id),
        juri_makaleler_puani: parseFloat(makaleler_puani) || 0,
        juri_btf_puani: parseFloat(btf_puani) || 0,
        juri_kitaplar_puani: parseFloat(kitaplar_puani) || 0,
        juri_atiflar_puan: parseFloat(atiflar_puani) || 0,
        juri_toplam_puan: parseFloat(toplam_puan) || 0,
        juri_raporu: juri_raporu || 'değerlendirilmedi',
        juri_yorumu: juri_yorumu || null,
        guncelleme_tarihi: new Date()
      });
    } else {
      await puan.update({
        juri_makaleler_puani: parseFloat(makaleler_puani) || 0,
        juri_btf_puani: parseFloat(btf_puani) || 0,
        juri_kitaplar_puani: parseFloat(kitaplar_puani) || 0,
        juri_atiflar_puan: parseFloat(atiflar_puani) || 0,
        juri_toplam_puan: parseFloat(toplam_puan) || 0,
        juri_raporu: juri_raporu || 'değerlendirilmedi',
        juri_yorumu: juri_yorumu || null,
        guncelleme_tarihi: new Date()
      });
    }

    // Başvuruyu güncelle
    await basvuru.update({
      durum: juri_raporu || basvuru.durum,
      guncelleme_tarihi: new Date()
    });

    let message = '';
    if (degerlendirme) {
      console.log('Mevcut değerlendirme güncelleniyor:', degerlendirme.id);
      // Mevcut değerlendirmeyi güncelle
      await degerlendirme.update({
        puan: parseFloat(toplam_puan) || 0,
        degerlendirme_metni: juri_yorumu,
        degerlendirme_tarihi: new Date()
      });
      message = 'Değerlendirme başarıyla güncellendi.';
    } else {
      console.log('Yeni değerlendirme oluşturuluyor');
      // Yeni değerlendirme oluştur
      degerlendirme = await degerlendirmeler.create({
        basvuru_id: parseInt(basvuru_id),
        juri_id: juri_id,
        puan: parseFloat(toplam_puan) || 0,
        degerlendirme_metni: juri_yorumu,
        degerlendirme_tarihi: new Date()
      });
      message = 'Değerlendirme başarıyla kaydedildi.';
    }

    console.log('İşlem sonucu:', { message, degerlendirme: degerlendirme.toJSON(), puan: puan.toJSON() });

    res.json({ 
      message,
      basvuru,
      degerlendirme,
      puan
    });
  } catch (err) {
    console.error('Değerlendirme kaydetme/güncelleme hatası:', err);
    res.status(500).json({ 
      error: 'Değerlendirme kaydedilirken/güncellenirken bir hata oluştu.',
      details: err.message 
    });
  }
});

// Atıflar için rotalar
router.post('/:basvuru_id/atiflar', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const { kategori, atif_yapilan_yazar, atif_yapilan_makale, atif_yapan_yazar, atif_yapan_makale, atif_yili } = req.body;
    
    const yeniAtif = await Atiflar.create({
      basvuru_id,
      kategori,
      atif_yapilan_yazar,
      atif_yapilan_makale,
      atif_yapan_yazar,
      atif_yapan_makale,
      atif_yili
    });

    res.status(201).json(yeniAtif);
  } catch (err) {
    console.error('Atıf oluşturma hatası:', err);
    res.status(500).json({ error: 'Atıf eklenirken bir hata oluştu.' });
  }
});

router.get('/:basvuru_id/atiflar', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const atiflar = await Atiflar.findAll({
      where: { basvuru_id }
    });
    res.json(atiflar);
  } catch (err) {
    console.error('Atıfları getirme hatası:', err);
    res.status(500).json({ error: 'Atıflar getirilirken bir hata oluştu.' });
  }
});

// Güncelleme ve silme işlemleri için ortak rotalar
router.put('/:basvuru_id/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id, type, id } = req.params;
    const guncellenecekAlanlar = req.body;
    
    let model;
    switch(type) {
      case 'makaleler':
        model = Makaleler;
        break;
      case 'btf':
        model = btf;
        break;
      case 'kitaplar':
        model = Kitaplar;
        break;
      case 'atiflar':
        model = Atiflar;
        break;
      default:
        return res.status(400).json({ error: 'Geçersiz tip.' });
    }

    const kayit = await model.findOne({
      where: {
        id,
        basvuru_id
      }
    });

    if (!kayit) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    await kayit.update(guncellenecekAlanlar);
    res.json(kayit);
  } catch (err) {
    console.error('Güncelleme hatası:', err);
    res.status(500).json({ error: 'Kayıt güncellenirken bir hata oluştu.' });
  }
});

router.delete('/:basvuru_id/:type/:id', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id, type, id } = req.params;
    
    let model;
    switch(type) {
      case 'makaleler':
        model = Makaleler;
        break;
      case 'btf':
        model = btf;
        break;
      case 'kitaplar':
        model = Kitaplar;
        break;
      case 'atiflar':
        model = Atiflar;
        break;
      default:
        return res.status(400).json({ error: 'Geçersiz tip.' });
    }

    const kayit = await model.findOne({
      where: {
        id,
        basvuru_id
      }
    });

    if (!kayit) {
      return res.status(404).json({ error: 'Kayıt bulunamadı.' });
    }

    await kayit.destroy();
    res.json({ message: 'Kayıt başarıyla silindi.' });
  } catch (err) {
    console.error('Silme hatası:', err);
    res.status(500).json({ error: 'Kayıt silinirken bir hata oluştu.' });
  }
});

// Puanları getir
router.get('/:basvuru_id/puanlar', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const puan = await puanlar.findOne({
      where: { basvuru_id: parseInt(basvuru_id) }
    });
    res.json(puan);
  } catch (err) {
    console.error('Puanları getirme hatası:', err);
    res.status(500).json({ error: 'Puanlar getirilirken bir hata oluştu.' });
  }
});

module.exports = router;
