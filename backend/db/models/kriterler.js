module.exports = (sequelize, DataTypes) => {
    const Kriter = sequelize.define('kriterler', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kategori: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      makaleler_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      //bilimsel toplantı faliyetleri puanı
      btf_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      kitaplar_puani: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      atiflar_puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      toplam_puan: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },
      ilan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ilanlar',
          key: 'id'
        }
      },
      olusturulma_tarihi: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    }, {
      tableName: 'kriterler',
      timestamps: false,
    });
    return Kriter;
  };
  