const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

// DB Model
const { puanlar: Puan } = require('../db');

// =======================
// Puan OLUŞTURMA / SİSTEM GÜNCELLEME (POST)
// Endpoint: POST /basvurular/:basvuru_id/puanlar
// Sistem, makale/btf/kitap/atıf puanlarını hesaplayıp gönderir.
// =======================
router.post('/:basvuru_id/puanlar', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const { makaleler_puani, btf_puani, kitaplar_puani, atiflar_puan } = req.body;
 
    // Sistemden gelen puanları sayıya çeviriyoruz veya 0 olarak ayarlıyoruz
    const mP = parseFloat(makaleler_puani) || 0;
    const bP = parseFloat(btf_puani) || 0;
    const kP = parseFloat(kitaplar_puani) || 0;
    const aP = parseFloat(atiflar_puan) || 0;
    const toplam_puan = mP + bP + kP + aP;

    // Yeni puan kaydını oluşturuyoruz
    const yeniPuan = await Puan.create({
      basvuru_id,
      makaleler_puani: mP,
      btf_puani: bP,
      kitaplar_puani: kP,
      atiflar_puan: aP,
      toplam_puan
    });

    res.status(201).json(yeniPuan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Puan oluşturulurken bir hata oluştu.' });
  }
});

// =======================
// SİSTEM PUAN GÜNCELLEME (PUT)
// Endpoint: PUT /basvurular/:basvuru_id/puanlar/system
// Oldukça benzer, sadece sistem puanları günceller.
// =======================
router.put('/:basvuru_id/puanlar/system', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const { makaleler_puani, btf_puani, kitaplar_puani, atiflar_puan } = req.body;

    const puan = await Puan.findOne({ where: { basvuru_id } });
    if (!puan) return res.status(404).json({ error: 'Puan kaydı bulunamadı.' });

    const mP = parseFloat(makaleler_puani) || 0;
    const bP = parseFloat(btf_puani) || 0;
    const kP = parseFloat(kitaplar_puani) || 0;
    const aP = parseFloat(atiflar_puan) || 0;
    const toplam_puan = mP + bP + kP + aP;

    const updated = await puan.update({
      makaleler_puani: mP,
      btf_puani: bP,
      kitaplar_puani: kP,
      atiflar_puan: aP,
      toplam_puan,
      guncelleme_tarihi: new Date()
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sistem puanları güncellenirken bir hata oluştu.' });
  }
});

// =======================
// JURİ PUAN GÜNCELLEME (PUT)
// Endpoint: PUT /basvurular/:basvuru_id/puanlar/juri
// Jüri üyeleri kendi puanlarını gönderir, rol kontrolü yok.
// =======================
router.put('/:basvuru_id/puanlar/juri', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const {
      juri_makaleler_puani,
      juri_btf_puani,
      juri_kitaplar_puani,
      juri_atiflar_puan,
      juri_raporu
    } = req.body;

    const puan = await Puan.findOne({ where: { basvuru_id } });
    if (!puan) return res.status(404).json({ error: 'Puan kaydı bulunamadı.' });

    const jmP = parseFloat(juri_makaleler_puani) || 0;
    const jbP = parseFloat(juri_btf_puani) || 0;
    const jkP = parseFloat(juri_kitaplar_puani) || 0;
    const jaP = parseFloat(juri_atiflar_puan) || 0;
    const juri_toplam = jmP + jbP + jkP + jaP;

    const updated = await puan.update({
      juri_makaleler_puani: jmP,
      juri_btf_puani: jbP,
      juri_kitaplar_puani: jkP,
      juri_atiflar_puan: jaP,
      juri_toplam_puan: juri_toplam,
      juri_raporu: juri_raporu || 'değerlendirilmedi',
      guncelleme_tarihi: new Date()
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Jüri puanları güncellenirken bir hata oluştu.' });
  }
});

// =======================
// JURİ RAPORU GÜNCELLEME (PUT)
// Endpoint: PUT /basvurular/:basvuru_id/puanlar/juri-raporu
// Sadece jüri raporunu günceller
// =======================
router.put('/:basvuru_id/puanlar/juri-raporu', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const { juri_raporu } = req.body;

    if (!juri_raporu) {
      return res.status(400).json({ error: 'Jüri raporu boş olamaz.' });
    }

    const puan = await Puan.findOne({ where: { basvuru_id } });
    if (!puan) return res.status(404).json({ error: 'Puan kaydı bulunamadı.' });

    const updated = await puan.update({
      juri_raporu,
      guncelleme_tarihi: new Date()
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Jüri raporu güncellenirken bir hata oluştu.' });
  }
});

// =======================
// PUANLARI GETİRME (GET)
// Endpoint: GET /basvurular/:basvuru_id/puanlar
// Tüm puan bilgilerini çeker (sistem + jüri)
// =======================
router.get('/:basvuru_id/puanlar', async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const puan = await Puan.findOne({ where: { basvuru_id } });
    if (!puan) return res.status(404).json({ error: 'Puan kaydı bulunamadı.' });
    res.json(puan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Puan bilgileri getirilirken bir hata oluştu.' });
  }
});

module.exports = router;
