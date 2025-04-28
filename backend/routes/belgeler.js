// routes/belgeler.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Modeller (belgeler, basvurular)
const { belgeler: Belge, basvurular: Basvuru } = require('../db');

// Token doğrulama
const authenticateToken = require('../middlewares/authenticateToken');

// Multer Storage ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // uploads klasörüne kaydeder
  },
  filename: (req, file, cb) => {
    // Eşsiz dosya ismi
    const ext = path.extname(file.originalname); // .pdf vb.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// "belge" alanını tek dosya kabul eden middleware
const upload = multer({ storage });

// 1) Aday, dosya yükleme isteği gönderir
// POST /api/belgeler/upload
router.post('/upload', authenticateToken, upload.single('belge'), async (req, res) => {
  try {
    const { basvuru_id, belge_turu } = req.body;

    // Bu başvuru var mı, adaya mı ait?
    const basvuru = await Basvuru.findByPk(basvuru_id);
    if (!basvuru) {
      return res.status(404).json({ error: 'Başvuru bulunamadı' });
    }
    if (basvuru.kullanici_id !== req.user.id) {
      return res.status(403).json({ error: 'Bu başvuru size ait değil.' });
    }

    // Multer ile yüklenen dosya bilgisi
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    // Dosyanın diskteki path'i
    const filePath = req.file.path;

    // Veritabanına kaydet
    const yeniBelge = await Belge.create({
      basvuru_id,
      belge_turu,
      dosya_yolu: filePath
    });

    return res.status(201).json({
      message: 'Belge yüklendi',
      belge: yeniBelge
    });
  } catch (error) {
    console.error('Belge yükleme hatası:', error);
    return res.status(500).json({ error: 'Dosya yüklemede sunucu hatası' });
  }
});

// 2) Belgeleri listeleme (isteğe bağlı)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Admin tümünü görebilir, aday sadece kendi basvurularına ait belgeleri görmek istiyorsa
    // buraya da isAdmin kontrolü ekleyebilirsiniz.
    const all = await Belge.findAll();
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Belgeler alınamadı' });
  }
});

module.exports = router;
