// db/models/ilanBelgeTuru.js
module.exports = (sequelize, DataTypes) => {
    const IlanBelgeTuru = sequelize.define('ilan_belge_turu', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ilan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      belge_turu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      tableName: 'ilan_belge_turu',
      timestamps: false,
    });
    return IlanBelgeTuru;
  };