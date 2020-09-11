'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('PaymentMethods', [
      {
        paymentMethodName: 'dinheiro',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        paymentMethodName: 'cartão',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PaymentMethods', null, {});
  }
};
