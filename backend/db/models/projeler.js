// db/models/projeler.js
module.exports = (sequelize, DataTypes) => {
    const Proje = sequelize.define('projeler', {
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
      proje_adi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      proje_turu: {
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
      butce: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: true,
      },
      aday_rolu: {
        type: DataTypes.STRING,
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
      tableName: 'projeler',
      timestamps: false
    });
  
    return Proje;
  };
  