// db/models/danismanliklar.js
module.exports = (sequelize, DataTypes) => {
    const Danismanlik = sequelize.define('danismanliklar', {
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
      ogrenci_sayisi: {
        type: DataTypes.INTEGER,
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
      tableName: 'danismanliklar',
      timestamps: false
    });
  
    return Danismanlik;
  };
  