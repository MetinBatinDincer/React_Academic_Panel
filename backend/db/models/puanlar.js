// db/models/puanlar.js
module.exports = (sequelize, DataTypes) => {
    const Puan = sequelize.define('puanlar', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      basvuru_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'basvurular',
          key: 'id'
        }
      },
      makaleler_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      //bilimsel toplantı faliyetleri puanı
      btf_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      kitaplar_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      atiflar_puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      toplam_puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      juri_makaleler_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      //bilimsel toplantı faliyetleri puanı
      juri_btf_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      juri_kitaplar_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      juri_atiflar_puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      juri_toplam_puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      guncelleme_tarihi: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      juri_raporu: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'değerlendirilmedi'
      },
      juri_yorumu: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      }
    }, {
      tableName: 'puanlar',
      timestamps: false
    });
  
    return Puan;
  };
  