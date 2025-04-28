const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { kitaplar: Kitap } = require('../db');

// Yeni kitap ekleme
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id, yazar, kitap_adi, yayinevi, baski_sayisi, yayimlandigi_yer, yil } = req.body;
    
    const yeniKitap = await Kitap.create({
      basvuru_id,
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

// Başvuruya ait tüm kitapları getirme
router.get('/basvuru/:basvuru_id', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const kitaplar = await Kitap.findAll({
      where: { basvuru_id }
    });
    res.json(kitaplar);
  } catch (err) {
    console.error('Kitapları getirme hatası:', err);
    res.status(500).json({ error: 'Kitaplar getirilirken bir hata oluştu.' });
  }
});

// Belirli bir kitabı güncelleme
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const guncellenecekAlanlar = req.body;
    
    const kitap = await Kitap.findByPk(id);
    if (!kitap) {
      return res.status(404).json({ error: 'Kitap bulunamadı.' });
    }

    await kitap.update(guncellenecekAlanlar);
    res.json(kitap);
  } catch (err) {
    console.error('Kitap güncelleme hatası:', err);
    res.status(500).json({ error: 'Kitap güncellenirken bir hata oluştu.' });
  }
});

// Kitap silme
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const kitap = await Kitap.findByPk(id);
    
    if (!kitap) {
      return res.status(404).json({ error: 'Kitap bulunamadı.' });
    }

    await kitap.destroy();
    res.json({ message: 'Kitap başarıyla silindi.' });
  } catch (err) {
    console.error('Kitap silme hatası:', err);
    res.status(500).json({ error: 'Kitap silinirken bir hata oluştu.' });
  }
});

module.exports = router; 