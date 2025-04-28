// db/models/idari_gorevler.js
module.exports = (sequelize, DataTypes) => {
    const IdariGorev = sequelize.define('idari_gorevler', {
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
      gorev_adi: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: 'idari_gorevler',
      timestamps: false
    });
  
    return IdariGorev;
  };
  