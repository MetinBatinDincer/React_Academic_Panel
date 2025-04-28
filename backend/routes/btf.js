const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { btf: BTF } = require('../db');

// Yeni BTF ekleme
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id, yazar, bildiri_adi, konferans_adi, yapildigi_yer, sayfa_sayilari, tarih } = req.body;
    
    const yeniBTF = await BTF.create({
      basvuru_id,
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

// Başvuruya ait tüm BTF'leri getirme
router.get('/basvuru/:basvuru_id', authenticateToken, async (req, res) => {
  try {
    const { basvuru_id } = req.params;
    const btfler = await BTF.findAll({
      where: { basvuru_id }
    });
    res.json(btfler);
  } catch (err) {
    console.error('BTF getirme hatası:', err);
    res.status(500).json({ error: 'BTF\'ler getirilirken bir hata oluştu.' });
  }
});

// Belirli bir BTF'yi güncelleme
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const guncellenecekAlanlar = req.body;
    
    const btf = await BTF.findByPk(id);
    if (!btf) {
      return res.status(404).json({ error: 'BTF bulunamadı.' });
    }

    await btf.update(guncellenecekAlanlar);
    res.json(btf);
  } catch (err) {
    console.error('BTF güncelleme hatası:', err);
    res.status(500).json({ error: 'BTF güncellenirken bir hata oluştu.' });
  }
});

// BTF silme
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const btf = await BTF.findByPk(id);
    
    if (!btf) {
      return res.status(404).json({ error: 'BTF bulunamadı.' });
    }

    await btf.destroy();
    res.json({ message: 'BTF başarıyla silindi.' });
  } catch (err) {
    console.error('BTF silme hatası:', err);
    res.status(500).json({ error: 'BTF silinirken bir hata oluştu.' });
  }
});

module.exports = router; 