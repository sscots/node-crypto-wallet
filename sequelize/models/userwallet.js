'use strict';

module.exports = (sequelize, DataTypes) => {
  let UserWallet = sequelize.define('usertowallet',
    {
      active: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      walletId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Wallet',
          key: 'id',
        },
      },
      datastateid: { type: DataTypes.INTEGER, defaultValue: 1 }
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

  return UserWallet;
};