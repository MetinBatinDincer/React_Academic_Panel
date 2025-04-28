// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Hata ayıklama için genel error handler middleware
app.use((err, req, res, next) => {
  console.error('Hata detayı:', err);
  console.error('Hata stack:', err.stack);
  res.status(500).json({ 
    error: 'Sunucu hatası oluştu',
    message: err.message,
    path: req.path
  });
});

// Rota işleyicilerinde oluşan hataları yakala
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function(data) {
    console.log('Response data:', data);
    return oldJson.call(this, data);
  };
  next();
});

app.get('/', (req, res) => {
  res.send('nodejs çalıştı');
});

// Rota dosyalarını import et
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

const adminIlanlarRoutes = require('./routes/ilanlar');
app.use('/api/admin/ilanlar', adminIlanlarRoutes);

const belgeRoutes = require('./routes/belgeler');
app.use('/api/belgeler', belgeRoutes);

const publicIlanlarRoutes = require('./routes/publicIlanlar');
app.use('/api/ilanlar', publicIlanlarRoutes);

const basvuruRoutes = require('./routes/basvurular');
app.use('/api/basvurular', basvuruRoutes);

const belgeTurleriRoutes = require('./routes/belge_turleri');
app.use('/api/belge_turleri', belgeTurleriRoutes);

// İlan belge türleri için ayrı bir yol
const ilanBelgeTurleriRoutes = require('./routes/ilanBelgeTurleri');
app.use('/api/admin/ilan-belge-turleri', ilanBelgeTurleriRoutes);

const kriterlerRouter = require('./routes/kriterler'); 
app.use('/api/ilanlar', kriterlerRouter);

const puanlarRouter = require('./routes/puanlar');
app.use('/api/basvurular', puanlarRouter);

const juriSecimRouter = require('./routes/juri_secim');
app.use('/api/juri-secim', juriSecimRouter);

// Atıflar için router'ı ekle
const atiflarRouter = require('./routes/atiflar');
app.use('/api/atiflar', atiflarRouter);

const authenticateToken = require('./middlewares/authenticateToken');
app.get('/api/protected-route', authenticateToken, (req, res) => {
  const userId = req.user.id;
  res.json({ message: `Hoşgeldin kullanıcı ID: ${userId}` });
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} üzerinde çalışıyor.`);
});
