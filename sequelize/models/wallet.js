'use strict';
module.exports = (sequelize, DataTypes) => {
  let Wallet = sequelize.define('wallet', {
    name: DataTypes.STRING,
    address: { type: DataTypes.STRING, allowNull: false },
    public: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    datastateid: { type: DataTypes.INTEGER, defaultValue: 1 }
  });
  return Wallet;
};