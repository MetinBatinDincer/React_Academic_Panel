const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Atiflar = sequelize.define('atiflar', {
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
    atif_yapilan_yazar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    atif_yapilan_makale: {
      type: DataTypes.STRING,
      allowNull: false
    },
    atif_yapan_yazar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    atif_yapan_makale: {
      type: DataTypes.STRING,
      allowNull: false
    },
    atif_yili: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    tableName: 'atiflar'
  });

  return Atiflar;
}; 