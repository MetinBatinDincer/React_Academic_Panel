// db/models/ilanlar.js
module.exports = (sequelize, DataTypes) => {
  const Ilan = sequelize.define('ilanlar', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    baslik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aciklama: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    baslangic_tarihi: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    bitis_tarihi: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    olusturan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    olusturulma_tarihi: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'ilanlar',
    timestamps: false,
  });
  return Ilan;
};
