'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DelivererId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Employees',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      CustomerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id',
        },
        onDelete: 'SET NULL'
      },
      RevenueId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Revenues',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      paidValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      changeValue: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      nf: {
        type: Sequelize.STRING,
      },
      delivered: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sales');
  }
};