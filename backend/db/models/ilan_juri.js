module.exports = (sequelize, DataTypes) => {
  const IlanJuri = sequelize.define('ilan_juri', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ilan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ilanlar',
        key: 'id'
      }
    },
    juri_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    atanma_tarihi: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'ilan_juri',
    timestamps: false
  });

  return IlanJuri;
}; 