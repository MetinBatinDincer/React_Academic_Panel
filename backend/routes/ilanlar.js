// routes/ilanlar.js
const express = require('express');
const router = express.Router();
// Dikkat: model ismi "ilan_belge_turu" olarak tanımlandığı için bu şekilde import ediyoruz
const { ilanlar: Ilan, ilan_belge_turu: IlanBelgeTuru } = require('../db');
const authenticateToken = require('../middlewares/authenticateToken');

// Admin yetkisi kontrolü
function isAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Yetersiz yetki' });
  }
  next();
}

// Yeni ilan ekleme (POST /api/admin/ilanlar)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { baslik, aciklama, kategori, baslangic_tarihi, bitis_tarihi, requiredDocuments } = req.body;
    
    // İlanı oluştur
    const newIlan = await Ilan.create({
      baslik,
      aciklama,
      kategori,
      baslangic_tarihi,
      bitis_tarihi,
      olusturan_id: req.user.id,
      olusturulma_tarihi: new Date()
    });
    
    // Seçilen belge türleri (ID'leri) varsa, ilan_belge_turu tablosuna ekle
    if (requiredDocuments && Array.isArray(requiredDocuments)) {
      await Promise.all(
        requiredDocuments.map(async (docTypeId) => {
          return IlanBelgeTuru.create({
            ilan_id: newIlan.id,
            belge_turu_id: docTypeId
          });
        })
      );
    }
    
    res.status(201).json({ message: 'İlan oluşturuldu', ilan: newIlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'İlan oluşturulurken hata oluştu' });
  }
});

// İlan güncelleme (PUT /api/admin/ilanlar/:id)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { baslik, aciklama, kategori, baslangic_tarihi, bitis_tarihi, requiredDocuments } = req.body;
    const ilan = await Ilan.findByPk(id);
    if (!ilan) {
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }
    
    // İlan güncelleme
    await ilan.update({
      baslik: baslik !== undefined ? baslik : ilan.baslik,
      aciklama: aciklama !== undefined ? aciklama : ilan.aciklama,
      kategori: kategori !== undefined ? kategori : ilan.kategori,
      baslangic_tarihi: baslangic_tarihi !== undefined ? baslangic_tarihi : ilan.baslangic_tarihi,
      bitis_tarihi: bitis_tarihi !== undefined ? bitis_tarihi : ilan.bitis_tarihi
    });

    // Eğer requiredDocuments gönderildiyse, önce eski ilişkileri silip, yeni ekleyelim
    if (requiredDocuments && Array.isArray(requiredDocuments)) {
      await IlanBelgeTuru.destroy({ where: { ilan_id: id } });
      await Promise.all(
        requiredDocuments.map(async (docTypeId) => {
          return IlanBelgeTuru.create({
            ilan_id: id,
            belge_turu_id: docTypeId
          });
        })
      );
    }
    
    res.json({ message: 'İlan güncellendi', ilan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'İlan güncellenirken hata oluştu' });
  }
});

// İlan silme (DELETE /api/admin/ilanlar/:id)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const ilan = await Ilan.findByPk(id);
    if (!ilan) {
      return res.status(404).json({ error: 'İlan bulunamadı' });
    }
    // Önce, ilgili ilana bağlı tüm "ilan_belge_turu" kayıtlarını sil
    await IlanBelgeTuru.destroy({ where: { ilan_id: id } });
    // Sonrasında, ilanın kendisini sil
    await ilan.destroy();
    res.json({ message: 'İlan silindi' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'İlan silinirken hata oluştu' });
  }
});

module.exports = router;
