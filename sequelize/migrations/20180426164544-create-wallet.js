'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('wallets', {
      id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
      name: Sequelize.STRING,
      address: { type: Sequelize.STRING, allowNull: false },
      public: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      datastateid: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('wallets');
  }
};