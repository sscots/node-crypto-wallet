'use strict';
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    datastateid: { type: DataTypes.INTEGER, defaultValue: 1 }
  });
  return User;
};