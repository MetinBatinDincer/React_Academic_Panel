// db/index.js
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('KouDb', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  logging: console.log, // SQL sorgularını logla
});

// Veritabanı bağlantısını test et
sequelize.authenticate()
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı.');
  })
  .catch(err => {
    console.error('Veritabanına bağlanılamadı:', err);
  });

const db = {};

// db/models klasöründeki tüm .js dosyalarını yükleyelim:
const modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath)
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    console.log(`Model yükleniyor: ${file}`);
    const model = require(path.join(modelsPath, file))(sequelize, DataTypes);
    db[model.name] = model;
    console.log(`Model yüklendi: ${model.name}`);
  });

/* İlişkilendirmeler */

// 1. Users ↔ Basvurular
if (db.users && db.basvurular) {
  db.users.hasMany(db.basvurular, { foreignKey: 'kullanici_id' });
  db.basvurular.belongsTo(db.users, { foreignKey: 'kullanici_id' });
}

// 2. Ilanlar ↔ Basvurular
if (db.ilanlar && db.basvurular) {
  db.ilanlar.hasMany(db.basvurular, { foreignKey: 'ilan_id' });
  db.basvurular.belongsTo(db.ilanlar, { foreignKey: 'ilan_id' });
}
//ilanlar ↔ kriterler 
if (db.ilanlar && db.kriterler){
  db.ilanlar.hasMany(db.kriterler, {foreignKey: 'ilan_id'})
  db.kriterler.belongsTo(db.ilanlar, { foreignKey: 'ilan_id'})
}

// 2.1. Users ↔ Ilanlar (ilanı oluşturan kullanıcı)
if (db.users && db.ilanlar) {
  db.users.hasMany(db.ilanlar, { foreignKey: 'olusturan_id' });
  db.ilanlar.belongsTo(db.users, { foreignKey: 'olusturan_id' });
}

// 3. Basvurular ↔ Belgeler
if (db.basvurular && db.belgeler) {
  db.basvurular.hasMany(db.belgeler, { foreignKey: 'basvuru_id' });
  db.belgeler.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 4. Basvurular ↔ Degerlendirmeler
if (db.basvurular && db.degerlendirmeler) {
  db.basvurular.hasMany(db.degerlendirmeler, { foreignKey: 'basvuru_id' });
  db.degerlendirmeler.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 4.1. Users (as Jüri) ↔ Degerlendirmeler
if (db.users && db.degerlendirmeler) {
  db.users.hasMany(db.degerlendirmeler, { foreignKey: 'juri_id' });
  db.degerlendirmeler.belongsTo(db.users, { foreignKey: 'juri_id' });
}

// 5. Basvurular ↔ Yayinlar
if (db.basvurular && db.yayinlar) {
  db.basvurular.hasMany(db.yayinlar, { foreignKey: 'basvuru_id' });
  db.yayinlar.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 6. Basvurular ↔ Projeler
if (db.basvurular && db.projeler) {
  db.basvurular.hasMany(db.projeler, { foreignKey: 'basvuru_id' });
  db.projeler.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 7. Basvurular ↔ Ders_Yukleri
if (db.basvurular && db.ders_yukleri) {
  db.basvurular.hasMany(db.ders_yukleri, { foreignKey: 'basvuru_id' });
  db.ders_yukleri.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 8. Basvurular ↔ Idari_Gorevler
if (db.basvurular && db.idari_gorevler) {
  db.basvurular.hasMany(db.idari_gorevler, { foreignKey: 'basvuru_id' });
  db.idari_gorevler.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 9. Basvurular ↔ Diger_Faaliyetler
if (db.basvurular && db.diger_faaliyetler) {
  db.basvurular.hasMany(db.diger_faaliyetler, { foreignKey: 'basvuru_id' });
  db.diger_faaliyetler.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 10. Basvurular ↔ Danismanliklar
if (db.basvurular && db.danismanliklar) {
  db.basvurular.hasMany(db.danismanliklar, { foreignKey: 'basvuru_id' });
  db.danismanliklar.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 11. Basvurular ↔ Puanlar (1:1 ilişki)
if (db.basvurular && db.puanlar) {
  db.basvurular.hasOne(db.puanlar, { foreignKey: 'basvuru_id' });
  db.puanlar.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// İlanlar ile ilan_belge_turu arasındaki ilişki
if (db.ilanlar && db.ilan_belge_turu) {
  db.ilanlar.hasMany(db.ilan_belge_turu, { foreignKey: 'ilan_id' });
  db.ilan_belge_turu.belongsTo(db.ilanlar, { foreignKey: 'ilan_id' });
}

// İlanlar ile Jüri üyeleri arasındaki ilişki
if (db.ilanlar && db.ilan_juri && db.users) {
  // İlan-Jüri ilişkisi (many-to-many)
  db.ilanlar.belongsToMany(db.users, { 
    through: db.ilan_juri,
    foreignKey: 'ilan_id',
    otherKey: 'juri_id',
    as: 'juriUyeleri'
  });
  
  db.users.belongsToMany(db.ilanlar, {
    through: db.ilan_juri,
    foreignKey: 'juri_id',
    otherKey: 'ilan_id',
    as: 'degerlendirilecekIlanlar'
  });
}

// Belge Türleri ile ilan_belge_turu arasındaki ilişki – alias kullanıyoruz
if (db.belge_turleri && db.ilan_belge_turu) {
  db.ilan_belge_turu.belongsTo(db.belge_turleri, {
    foreignKey: 'belge_turu_id',
    as: 'belgeTuru'
  });
  db.belge_turleri.hasMany(db.ilan_belge_turu, {
    foreignKey: 'belge_turu_id',
    as: 'ilanBelgeTuru'
  });
}

// 12. Basvurular ↔ Makaleler
if (db.basvurular && db.makaleler) {
  db.basvurular.hasMany(db.makaleler, { foreignKey: 'basvuru_id' });
  db.makaleler.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 13. Belgeler ↔ Makaleler
if (db.belgeler && db.makaleler) {
  db.belgeler.hasMany(db.makaleler, { foreignKey: 'belge_id' });
  db.makaleler.belongsTo(db.belgeler, { foreignKey: 'belge_id' });
}

// 14. Basvurular ↔ BTF
if (db.basvurular && db.btf) {
  db.basvurular.hasMany(db.btf, { foreignKey: 'basvuru_id' });
  db.btf.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 15. Basvurular ↔ Atiflar
if (db.basvurular && db.atiflar) {
  db.basvurular.hasMany(db.atiflar, { foreignKey: 'basvuru_id' });
  db.atiflar.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

// 16. Basvurular ↔ Kitaplar
if (db.basvurular && db.kitaplar) {
  db.basvurular.hasMany(db.kitaplar, { foreignKey: 'basvuru_id' });
  db.kitaplar.belongsTo(db.basvurular, { foreignKey: 'basvuru_id' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Tabloları otomatik oluştur (eğer veritabanında yoksa)
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Veritabanı ve tablolar senkronize edildi!');
    // Mevcut tabloları listele
    return sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  })
  .then(([results]) => {
    console.log('Mevcut tablolar:', results.map(r => r.table_name));
  })
  .catch(err => {
    console.error('Senkronizasyon hatası:', err);
    console.error('Hata detayı:', err.original || err);
  });

module.exports = db;
