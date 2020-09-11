'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Products', [
      {
        name: 'P02',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'P05',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'P08',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'P10',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'P13',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'P20',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'P45',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Água',
        price: 10,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
