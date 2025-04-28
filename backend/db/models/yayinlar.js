// models/yayinlar.js
module.exports = (sequelize, DataTypes) => {
    const Yayin = sequelize.define('yayinlar', {
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
      yayinin_adi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dergi_adi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      kategori: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      q_degeri: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      yazar_sirasi: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      baslik_yazar_mi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      yayin_tarihi: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      atif_sayisi: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      belge_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'belgeler',
          key: 'id'
        }
      }
    }, {
      tableName: 'yayinlar',
      timestamps: false
    });
    return Yayin;
  };
  