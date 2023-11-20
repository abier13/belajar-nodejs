// const { queryInterface } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Users',
      'NationId',
      {
        type: Sequelize.UUID,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'NationId');
  },
};
