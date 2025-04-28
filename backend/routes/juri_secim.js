const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { users: User, ilanlar: Ilan, ilan_juri: IlanJuri, basvurular: Basvuru } = require('../db');
const { Op } = require('sequelize');

// Yönetici yetkisi kontrolü
const checkManagerRole = (req, res, next) => {
  if (req.user.rol !== 'yonetici') {
    return res.status(403).json({ error: 'Bu işlem için yönetici yetkisi gereklidir.' });
  }
  next();
};

// Tüm jüri üyelerini listele
router.get('/juri-listesi', authenticateToken, checkManagerRole, async (req, res) => {
  try {
    const juriListesi = await User.findAll({
      where: { rol: 'juri' },
      attributes: ['id', 'ad', 'soyad', 'email'],
      order: [['ad', 'ASC'], ['soyad', 'ASC']]
    });

    res.json(juriListesi);
  } catch (err) {
    console.error('Jüri listesi getirilemedi:', err);
    res.status(500).json({ error: 'Jüri listesi alınırken bir hata oluştu.' });
  }
});

// İlanın mevcut jüri üyelerini getir
router.get('/ilan/:ilan_id/juriler', authenticateToken, checkManagerRole, async (req, res) => {
  try {
    const { ilan_id } = req.params;
    
    const ilan = await Ilan.findByPk(ilan_id, {
      include: [{
        model: User,
        as: 'juriUyeleri',
        attributes: ['id', 'ad', 'soyad', 'email'],
        through: { attributes: ['atanma_tarihi'] }
      }]
    });

    if (!ilan) {
      return res.status(404).json({ error: 'İlan bulunamadı.' });
    }

    res.json(ilan.juriUyeleri);
  } catch (err) {
    console.error('İlanın jüri üyeleri getirilemedi:', err);
    res.status(500).json({ error: 'Jüri üyeleri alınırken bir hata oluştu.' });
  }
});

// İlana jüri ata
router.post('/ilan/:ilan_id/juri-ata', authenticateToken, checkManagerRole, async (req, res) => {
  try {
    const { ilan_id } = req.params;
    const { juri_ids } = req.body; // Seçilen jüri ID'lerinin listesi

    if (!Array.isArray(juri_ids)) {
      return res.status(400).json({ error: 'Jüri listesi geçerli değil.' });
    }

    // İlanı kontrol et
    const ilan = await Ilan.findByPk(ilan_id);
    if (!ilan) {
      return res.status(404).json({ error: 'İlan bulunamadı.' });
    }

    // Seçilen jürilerin gerçekten jüri rolüne sahip olduğunu kontrol et
    const juriKullanicilar = await User.findAll({
      where: {
        id: { [Op.in]: juri_ids },
        rol: 'juri'
      }
    });

    if (juriKullanicilar.length !== juri_ids.length) {
      return res.status(400).json({ error: 'Bazı seçilen kullanıcılar jüri rolüne sahip değil.' });
    }

    // Mevcut jüri atamalarını sil
    await IlanJuri.destroy({ where: { ilan_id } });

    // Yeni jüri atamalarını oluştur
    const atamalar = juri_ids.map(juri_id => ({
      ilan_id,
      juri_id,
      atanma_tarihi: new Date()
    }));

    await IlanJuri.bulkCreate(atamalar);

    res.json({ message: 'Jüri ataması başarıyla güncellendi.' });
  } catch (err) {
    console.error('Jüri ataması yapılamadı:', err);
    res.status(500).json({ error: 'Jüri ataması yapılırken bir hata oluştu.' });
  }
});

// İlandan jüri üyesini çıkar
router.delete('/ilan/:ilan_id/juri/:juri_id', authenticateToken, checkManagerRole, async (req, res) => {
  try {
    const { ilan_id, juri_id } = req.params;

    const silinen = await IlanJuri.destroy({
      where: { ilan_id, juri_id }
    });

    if (silinen === 0) {
      return res.status(404).json({ error: 'Belirtilen jüri ataması bulunamadı.' });
    }

    res.json({ message: 'Jüri üyesi ilandan çıkarıldı.' });
  } catch (err) {
    console.error('Jüri üyesi çıkarılamadı:', err);
    res.status(500).json({ error: 'Jüri üyesi çıkarılırken bir hata oluştu.' });
  }
});

// Jürinin kendisine atanan ilanları getir
router.get('/atanan-ilanlar', authenticateToken, async (req, res) => {
  try {
    // Kullanıcının jüri olduğunu kontrol et
    if (req.user.rol !== 'juri') {
      return res.status(403).json({ error: 'Bu işlem için jüri yetkisi gereklidir.' });
    }

    const juri_id = req.user.id;

    // Jüriye atanan ilanları getir
    const atananIlanlar = await Ilan.findAll({
      include: [{
        model: User,
        as: 'juriUyeleri',
        where: { id: juri_id },
        attributes: [],
        through: { attributes: [] }
      }],
      attributes: [
        'id',
        'baslik',
        'aciklama',
        'kategori',
        'baslangic_tarihi',
        'bitis_tarihi',
        'olusturulma_tarihi'
      ]
    });

    res.json(atananIlanlar);
  } catch (err) {
    console.error('Atanan ilanlar getirilemedi:', err);
    res.status(500).json({ error: 'Atanan ilanlar alınırken bir hata oluştu.' });
  }
});

// İlana yapılan başvuruları getir (Jüri için)
router.get('/ilan/:ilan_id/basvurular', authenticateToken, async (req, res) => {
  try {
    // Kullanıcının jüri olduğunu kontrol et
    if (req.user.rol !== 'juri') {
      return res.status(403).json({ error: 'Bu işlem için jüri yetkisi gereklidir.' });
    }

    const { ilan_id } = req.params;
    const juri_id = req.user.id;

    // Jürinin bu ilana atanmış olduğunu kontrol et
    const atama = await IlanJuri.findOne({
      where: { ilan_id, juri_id }
    });

    if (!atama) {
      return res.status(403).json({ error: 'Bu ilana atanmış jüri değilsiniz.' });
    }

    // İlana yapılan başvuruları getir
    const basvurular = await Basvuru.findAll({
      where: { ilan_id },
      include: [{
        model: User,
        attributes: ['id', 'ad', 'soyad', 'email']
      }],
      attributes: [
        'id',
        'durum',
        'basvuru_tarihi',
        'guncelleme_tarihi'
      ]
    });

    res.json(basvurular);
  } catch (err) {
    console.error('Başvurular getirilemedi:', err);
    res.status(500).json({ error: 'Başvurular alınırken bir hata oluştu.' });
  }
});

module.exports = router; 