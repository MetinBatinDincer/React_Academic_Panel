// models/degerlendirmeler.js
module.exports = (sequelize, DataTypes) => {
    const Degerlendirme = sequelize.define('degerlendirmeler', {
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
      juri_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Jüri üyeleri users tablosunda tutuluyorsa
          key: 'id'
        }
      },
      puan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      degerlendirme_metni: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      degerlendirme_tarihi: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    }, {
      tableName: 'degerlendirmeler',
      timestamps: false
    });
  
    return Degerlendirme;
  };
  