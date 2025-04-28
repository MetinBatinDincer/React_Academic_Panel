// routes/publicIlanlar.js

const express = require('express');
const router = express.Router();

// 'ilanlar' modelini db'den alıyoruz.
const { ilanlar: Ilan } = require('../db');

// Herkese açık ilan listeleme endpoint'i
router.get('/', async (req, res) => {
  try {
    const ilanlar = await Ilan.findAll({
      order: [['olusturulma_tarihi', 'DESC']]
    });
    console.log('İlanlar başarıyla getirildi:', ilanlar.length);
    res.json({ ilanlar });
  } catch (err) {
    console.error('İlanlar getirilirken hata oluştu:', err);
    console.error('Hata detayı:', err.original || err);
    res.status(500).json({ 
      error: 'İlanlar getirilirken hata oluştu',
      message: err.message 
    });
  }
});

// Tekil ilan getirme endpoint'i
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`${id} ID'li ilan getiriliyor...`);

    const ilan = await Ilan.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!ilan) {
      console.log(`${id} ID'li ilan bulunamadı.`);
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }
    
    console.log(`${id} ID'li ilan başarıyla getirildi:`, ilan.baslik);
    res.json(ilan);
  } catch (err) {
    console.error(`${req.params.id} ID'li ilan getirilirken hata oluştu:`, err);
    console.error('Hata detayı:', err.original || err);
    res.status(500).json({ 
      error: 'İlan getirilirken hata oluştu',
      message: err.message 
    });
  }
});

module.exports = router;
