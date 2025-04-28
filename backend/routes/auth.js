const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const soap = require('soap');
const { users: User } = require('../db');

const saltRounds = 10;
const jwtSecret = 'your_jwt_secret_here'; // Prod’da .env’den oku
const WSDL_URL = 'https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?WSDL';

// TC Kimlik doğrulama fonksiyonu (inline)
async function verifyTCIdentity(tcNo, ad, soyad, dogumYili) {
  const args = {
    TCKimlikNo: String(tcNo),
    Ad: ad.toLocaleUpperCase('tr'),
    Soyad: soyad.toLocaleUpperCase('tr'),
    DogumYili: Number(dogumYili),
  };

  console.log('[SOAP DEBUG] Request args:', args);

  return new Promise((resolve, reject) => {
    soap.createClient(WSDL_URL, (err, client) => {
      if (err) {
        console.error('[SOAP ERROR] createClient:', err);
        return reject(err);
      }

      client.TCKimlikNoDogrula(args, (err, result) => {
        if (err) {
          console.error('[SOAP ERROR] TCKimlikNoDogrula:', err);
          return reject(err);
        }

        console.log('[SOAP DEBUG] Raw response:', JSON.stringify(result, null, 2));

        const direct = result?.TCKimlikNoDogrulaResult;
        const nested = result?.TCKimlikNoDogrulaResponse?.TCKimlikNoDogrulaResult;
        resolve(direct === true || nested === true);
      });
    });
  });
}

// REGISTER
router.post('/register', async (req, res) => {
  const { tc, ad, soyad, dogumYili, email, sifre } = req.body;

  try {
    if (await User.findOne({ where: { tc } })) {
      return res.status(400).json({ error: 'Bu TC numarasıyla kayıtlı kullanıcı var.' });
    }

    const isValidTC = await verifyTCIdentity(tc, ad, soyad, dogumYili);
    if (!isValidTC) {
      return res.status(400).json({ error: 'TC doğrulaması başarısız.' });
    }

    const hashedPassword = await bcrypt.hash(sifre, saltRounds);
    const newUser = await User.create({ tc, ad, soyad, dogumYili, email, sifre: hashedPassword });

    res.status(201).json({ message: 'Kayıt başarılı', user: newUser });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { tc, sifre } = req.body;

  try {
    const user = await User.findOne({ where: { tc } });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı.' });

    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch) return res.status(400).json({ error: 'Şifre yanlış.' });

    const token = jwt.sign({ id: user.id, tc: user.tc, rol: user.rol }, jwtSecret, { expiresIn: '5h' });
    res.json({ message: 'Giriş başarılı', token });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;



