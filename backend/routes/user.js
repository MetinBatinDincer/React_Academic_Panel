// backend/routes/user.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { users:User } = require('../db'); // User modelini doğru şekilde alıyoruz

router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id; // req.user, middleware'den eklenen doğru özellik
  const user = await User.findOne({ where: { id: userId } });
  console.log('Bulunan kullanıcı:', user);
  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  }
  res.json({
    id: user.id,
    tc: user.tc,
    ad: user.ad,
    soyad: user.soyad,
    email: user.email,
    rol: user.rol,
    dogumYili: user.dogumYili
  });
});

module.exports = router;
