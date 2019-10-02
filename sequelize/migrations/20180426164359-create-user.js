'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
      email: Sequelize.STRING,
      password: Sequelize.STRING,
      admin: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      datastateid: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};