// routes/belge_turleri.js
const express = require('express');
const router = express.Router();
const { belge_turleri: BelgeTuru } = require('../db');
const authenticateToken = require('../middlewares/authenticateToken');

// Global belge türlerini listeleyen GET endpoint'i
router.get('/', authenticateToken, async (req, res) => {
  try {
    const documentTypes = await BelgeTuru.findAll();
    res.status(200).json(documentTypes);
  } catch (err) {
    console.error('Error fetching document types: ', err);
    res.status(500).json({ error: 'Document types could not be fetched', details: err.message });
  }
});

// Yeni belge türü ekleme endpoint'i (sadece admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const { tur } = req.body;
    if (!tur || typeof tur !== 'string' || tur.trim() === '') {
      return res.status(400).json({ error: 'Document type name is required' });
    }
    const newType = await BelgeTuru.create({ tur: tur.trim() });
    console.log('Yeni belge türü eklendi:', newType.dataValues);
    res.status(201).json(newType);
  } catch (err) {
    console.error('Error creating document type: ', err);
    res.status(500).json({ error: 'Could not create document type', details: err.message });
  }
});

module.exports = router;
