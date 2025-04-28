const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { makaleler: Makale } = require('../db');

// Yeni makale ekleme
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id, kategori, yazar, makale_ad, dergi_ad, cilt_no, sayfa, yil, yazar_rolu } = req.body;
    
    const yeniMakale = await Makale.create({
      basvuru_id,
      kategori,
      yazar,
      makale_ad,
      dergi_ad,
      cilt_no,
      sayfa,
      yil,
      yazar_rolu
    });

    res.status(201).json(yeniMakale);
  } catch (err) {
    console.error('Makale oluşturma hatası:', err);
    res.status(500).json({ error: 'Makale eklenirken bir hata oluştu.' });
  }
});

// Başvuruya ait tüm makaleleri getirme
router.get('/basvuru/:basvuru_id', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const makaleler = await Makale.findAll({
      where: { basvuru_id }
    });
    res.json(makaleler);
  } catch (err) {
    console.error('Makaleleri getirme hatası:', err);
    res.status(500).json({ error: 'Makaleler getirilirken bir hata oluştu.' });
  }
});

// Belirli bir makaleyi güncelleme
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const guncellenecekAlanlar = req.body;
    
    const makale = await Makale.findByPk(id);
    if (!makale) {
      return res.status(404).json({ error: 'Makale bulunamadı.' });
    }

    await makale.update(guncellenecekAlanlar);
    res.json(makale);
  } catch (err) {
    console.error('Makale güncelleme hatası:', err);
    res.status(500).json({ error: 'Makale güncellenirken bir hata oluştu.' });
  }
});

// Makale silme
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const makale = await Makale.findByPk(id);
    
    if (!makale) {
      return res.status(404).json({ error: 'Makale bulunamadı.' });
    }

    await makale.destroy();
    res.json({ message: 'Makale başarıyla silindi.' });
  } catch (err) {
    console.error('Makale silme hatası:', err);
    res.status(500).json({ error: 'Makale silinirken bir hata oluştu.' });
  }
});

module.exports = router; 