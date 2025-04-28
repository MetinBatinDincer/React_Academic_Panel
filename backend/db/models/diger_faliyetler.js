// db/models/diger_faaliyetler.js
module.exports = (sequelize, DataTypes) => {
    const DigerFaaliyet = sequelize.define('diger_faaliyetler', {
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
      faaliyet_turu: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      aciklama: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      faaliyet_tarihi: {
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
      tableName: 'diger_faaliyetler',
      timestamps: false
    });
  
    return DigerFaaliyet;
  };
  