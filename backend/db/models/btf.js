const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BTF = sequelize.define('btf', {
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
    bildiri_adi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    konferans_adi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    yapildigi_yer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sayfa_sayilari: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tarih: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'btf'
  });

  return BTF;
}; 