'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('phone', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique  :true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'user',
          key : 'user_id'
        },
        onUpdate : 'CASCADE',
        onDelete: 'CASCADE'
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },deletedAt: { // For paranoid true
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('phone');
  }
};