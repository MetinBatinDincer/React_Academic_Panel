const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Kitaplar = sequelize.define('kitaplar', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    basvuru_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'basvurular',
        key: 'id'
      }
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: true
    },
    yazar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kitap_adi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    yayinevi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    baski_sayisi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    yayimlandigi_yer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    yil: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'kitaplar'
  });

  return Kitaplar;
}; 