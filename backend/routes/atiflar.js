const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

// DB Models
const { atiflar: Atiflar } = require('../db');

// Tüm atıfları getir
router.get('/', authenticateToken, async (req, res) => {
  try {
    const atiflarList = await Atiflar.findAll();
    res.json(atiflarList);
  } catch (err) {
    console.error('Atıflar getirme hatası:', err);
    res.status(500).json({ error: 'Atıflar getirilirken bir hata oluştu.' });
  }
});

// Belirli bir atıfı getir
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const atif = await Atiflar.findByPk(id);
    
    if (!atif) {
      return res.status(404).json({ error: 'Atıf bulunamadı.' });
    }
    
    res.json(atif);
  } catch (err) {
    console.error('Atıf getirme hatası:', err);
    res.status(500).json({ error: 'Atıf getirilirken bir hata oluştu.' });
  }
});

// Yeni bir atıf oluştur
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      basvuru_id, 
      kategori, 
      atif_yapilan_yazar, 
      atif_yapilan_makale, 
      atif_yapan_yazar, 
      atif_yapan_makale, 
      atif_yili 
    } = req.body;
    
    if (!basvuru_id || !atif_yapilan_yazar || !atif_yapilan_makale || !atif_yapan_yazar || !atif_yapan_makale || !atif_yili) {
      return res.status(400).json({ error: 'Eksik veya geçersiz bilgi.' });
    }
    
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
    res.status(500).json({ error: 'Atıf oluşturulurken bir hata oluştu.' });
  }
});

// Atıfı güncelle
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      kategori, 
      atif_yapilan_yazar, 
      atif_yapilan_makale, 
      atif_yapan_yazar, 
      atif_yapan_makale, 
      atif_yili 
    } = req.body;
    
    const atif = await Atiflar.findByPk(id);
    
    if (!atif) {
      return res.status(404).json({ error: 'Atıf bulunamadı.' });
    }
    
    await atif.update({
      kategori,
      atif_yapilan_yazar,
      atif_yapilan_makale,
      atif_yapan_yazar,
      atif_yapan_makale,
      atif_yili
    });
    
    res.json(atif);
  } catch (err) {
    console.error('Atıf güncelleme hatası:', err);
    res.status(500).json({ error: 'Atıf güncellenirken bir hata oluştu.' });
  }
});

// Atıfı sil
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const atif = await Atiflar.findByPk(id);
    
    if (!atif) {
      return res.status(404).json({ error: 'Atıf bulunamadı.' });
    }
    
    await atif.destroy();
    
    res.json({ message: 'Atıf başarıyla silindi.' });
  } catch (err) {
    console.error('Atıf silme hatası:', err);
    res.status(500).json({ error: 'Atıf silinirken bir hata oluştu.' });
  }
});

module.exports = router; 