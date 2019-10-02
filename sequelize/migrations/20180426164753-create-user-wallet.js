'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usertowallets',
      {
        id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        active: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
        userId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        walletId: {
          allowNull: false,
          type: Sequelize.BIGINT,
          references: {
            model: 'wallets',
            key: 'id',
          },
        },
        datastateid: { type: Sequelize.INTEGER, defaultValue: 1 },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      },
      {
        indexes: [
          {
            unique: true,
            fields: ['userId', 'active']
          }
        ]
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('usertowallets');
  }
};