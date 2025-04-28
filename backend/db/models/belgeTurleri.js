// db/models/belgeTurleri.js
module.exports = (sequelize, DataTypes) => {
    const BelgeTuru = sequelize.define('belge_turleri', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tur: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      tableName: 'belge_turleri',
      timestamps: false,
    });
    return BelgeTuru;
  };