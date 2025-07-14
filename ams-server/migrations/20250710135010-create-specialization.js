'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('specializations', {
      specialization_id : {
        type : Sequelize.UUID,
        primaryKey : true,
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull :false,
        unique  :true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('specializations');
  }
};