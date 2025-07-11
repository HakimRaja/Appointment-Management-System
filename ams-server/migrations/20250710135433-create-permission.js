'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permission', {
      permission_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      permission: {
        type: Sequelize.STRING,
        allowNull : false
      },
      role: {
        type: Sequelize.ENUM('doctor','patient','admin') , allowNull : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt : {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permission');
  }
};