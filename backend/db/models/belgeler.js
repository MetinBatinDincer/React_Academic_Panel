// models/belgeler.js
module.exports = (sequelize, DataTypes) => {
    const Belge = sequelize.define('belgeler', {
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
      ilan_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // ilan için belge eklenebilsin
        references: {
          model: 'ilanlar',
          key: 'id'
        }
      },
      belge_turu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dosya_yolu: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      
      yuklenme_tarihi: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    }, {
      tableName: 'belgeler',
      timestamps: false
    });
  
    return Belge;
  };
  