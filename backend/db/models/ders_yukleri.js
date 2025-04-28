// db/models/ders_yukleri.js
module.exports = (sequelize, DataTypes) => {
    const DersYuku = sequelize.define('ders_yukleri', {
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
      ders_adi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      yil: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      donem: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ders_yuk: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
      },
      puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      belge_yolu: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    }, {
      tableName: 'ders_yukleri',
      timestamps: false
    });
  
    return DersYuku;
  };
  