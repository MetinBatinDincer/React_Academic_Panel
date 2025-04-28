const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

// DB Model
const { kriterler: Kriter } = require('../db');

// =======================
// Kriter EKLEME (POST)
// Endpoint: POST /ilanlar/:ilan_id/kriterler
// =======================
router.post('/:ilan_id/kriterler', authenticateToken, async (req, res) => {
  try {
    // Yalnızca 'yönetici' rolüne izin veriyoruz
    if (req.user.rol !== 'yonetici') {
      return res.status(403).json({ message: 'Yetersiz yetki, sadece yönetici bu işlemi gerçekleştirebilir.' });
    }

    const { ilan_id } = req.params;
    const { kategori, makaleler_puani, btf_puani, kitaplar_puani, atiflar_puan } = req.body;

    // Gerekli alanların kontrolü
    if (!kategori) {
      return res.status(400).json({ error: 'kategori alanı zorunludur.' });
    }

    // Puanları sayıya çeviriyoruz veya varsayılanı 0 olarak ayarlıyoruz
    const mP = parseFloat(makaleler_puani) || 0;
    const bP = parseFloat(btf_puani) || 0;
    const kP = parseFloat(kitaplar_puani) || 0;
    const aP = parseFloat(atiflar_puan) || 0;
    const toplam_puan = mP + bP + kP + aP;

    // Yeni kriter kaydını oluşturuyoruz
    const yeniKriter = await Kriter.create({
      ilan_id,
      kategori,
      makaleler_puani: mP,
      btf_puani: bP,
      kitaplar_puani: kP,
      atiflar_puan: aP,
      toplam_puan
    });

    res.status(201).json(yeniKriter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kriter eklenirken bir hata oluştu.' });
  }
});

// =======================
// Kriter GÜNCELLEME (PUT)
// Endpoint: PUT /ilanlar/:ilan_id/kriterler/:kriter_id
// =======================
router.put('/:ilan_id/kriterler/:kriter_id', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol !== 'yönetici') {
      return res.status(403).json({ message: 'Yetersiz yetki, sadece yönetici bu işlemi gerçekleştirebilir.' });
    }

    const { ilan_id, kriter_id } = req.params;
    const { kategori, makaleler_puani, btf_puani, kitaplar_puani, atiflar_puan } = req.body;

    const kriter = await Kriter.findOne({ where: { id: kriter_id, ilan_id } });
    if (!kriter) {
      return res.status(404).json({ error: 'Kriter bulunamadı.' });
    }

    const updatedData = {};
    if (kategori !== undefined) updatedData.kategori = kategori;
    if (makaleler_puani !== undefined) updatedData.makaleler_puani = parseFloat(makaleler_puani);
    if (btf_puani !== undefined) updatedData.btf_puani = parseFloat(btf_puani);
    if (kitaplar_puani !== undefined) updatedData.kitaplar_puani = parseFloat(kitaplar_puani);
    if (atiflar_puan !== undefined) updatedData.atiflar_puan = parseFloat(atiflar_puan);

    // Toplam puanı yeniden hesaplıyoruz
    const newM = updatedData.makaleler_puani ?? kriter.makaleler_puani;
    const newB = updatedData.btf_puani ?? kriter.btf_puani;
    const newK = updatedData.kitaplar_puani ?? kriter.kitaplar_puani;
    const newA = updatedData.atiflar_puan ?? kriter.atiflar_puan;
    updatedData.toplam_puan = newM + newB + newK + newA;

    const updatedKriter = await kriter.update(updatedData);
    res.json(updatedKriter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kriter güncellenirken bir hata oluştu.' });
  }
});

// =======================
// Kriter LİSTELEME (GET)
// Endpoint: GET /ilanlar/:ilan_id/kriterler
// =======================
router.get('/:ilan_id/kriterler', async (req, res) => {
  try {
    const { ilan_id } = req.params;
    const kriterList = await Kriter.findAll({ where: { ilan_id }, order: [['id', 'ASC']] });
    res.json(kriterList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kriterler listelenirken bir hata oluştu.' });
  }
});

// =======================
// Kriter DETAY (GET)
// Endpoint: GET /ilanlar/:ilan_id/kriterler/:kriter_id
// =======================
router.get('/:ilan_id/kriterler/:kriter_id', async (req, res) => {
  try {
    const { ilan_id, kriter_id } = req.params;
    const kriter = await Kriter.findOne({ where: { id: kriter_id, ilan_id } });
    if (!kriter) {
      return res.status(404).json({ error: 'Kriter bulunamadı.' });
    }
    res.json(kriter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kriter bilgisi getirilirken bir hata oluştu.' });
  }
});

module.exports = router;

