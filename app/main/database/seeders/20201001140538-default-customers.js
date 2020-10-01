'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Customers', [
      {        
        name: 'Primeiro cliente',
        type: 'cliente',
        mail: 'primeirocliente@email.com.br',
        phone: '69998982244',
        address: 'Enderço primeiro cliente, 8888',
        createdAt:new Date(),
        updatedAt: new Date()
      },
      {        
        name: 'Primeira empresa',
        type: 'empresa',
        mail: 'primeiroempresa@email.com.br',
        phone: '69998988888',
        address: 'Enderço primeira empresa, 4444',
        createdAt:new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Customers', null, {});
  }
};
