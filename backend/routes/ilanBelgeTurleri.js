// routes/ilanBelgeTurleri.js
const express = require('express');
const router = express.Router();
const { ilan_belge_turu: IlanBelgeTuru, belge_turleri: BelgeTuru } = require('../db');
const authenticateToken = require('../middlewares/authenticateToken');

// GET /api/admin/ilan-belge-turleri/:id/belge-turleri
router.get('/:id/belge-turleri', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await IlanBelgeTuru.findAll({
      where: { ilan_id: id },
      include: [{
        model: BelgeTuru,
        as: 'belgeTuru',
        attributes: ['id', 'tur'],
      }],
    });

    const docs = rows.map(row => ({
      id: row.belgeTuru.id,
      tur: row.belgeTuru.tur,
    }));

    res.json(docs);
  } catch (err) {
    console.error('Belge türleri alınamadı:', err.message);
    res.status(500).json({ error: 'Belge türleri alınamadı', details: err.message });
  }
});

module.exports = router;
