// models/users.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tc: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soyad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dogumYili: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'dogumyili'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sifre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'aday',
    }
  }, {
    tableName: 'users',
    timestamps: false,
    hooks: {
      beforeCreate: (user, options) => {
        if (user.ad) {
          user.ad = user.ad.charAt(0).toLocaleUpperCase('tr-TR') + user.ad.slice(1).toLocaleLowerCase('tr-TR');
        }
        if (user.soyad) {
          user.soyad = user.soyad.toLocaleUpperCase('tr-TR');
        }
      },
      beforeUpdate: (user, options) => {
        if (user.ad) {
          user.ad = user.ad.charAt(0).toLocaleUpperCase('tr-TR') + user.ad.slice(1).toLocaleLowerCase('tr-TR');
        }
        if (user.soyad) {
          user.soyad = user.soyad.toLocaleUpperCase('tr-TR');
        }
      }
    }
  });

  return User;
};
