// db/models/makaleler.js
module.exports = (sequelize, DataTypes) => {
    const Makale = sequelize.define('makaleler', {
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
      kategori: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      yazar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      makale_ad: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dergi_ad: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cilt_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sayfa: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      yil: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      yazar_rolu: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      arkkv: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      brkk: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: 'makaleler',
      timestamps: false
    });
  
    return Makale;
  };
  