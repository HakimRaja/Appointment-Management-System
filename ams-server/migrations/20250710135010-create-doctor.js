'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctor', {
      user_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references : {
          model : 'user',
          key : 'user_id'
        },
        onUpdate : 'CASCADE',
        onDelete: 'CASCADE'
      },
      specialization: {
        type: Sequelize.STRING
      },
      experience: {
        type: Sequelize.DATE
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
        type: Sequelize.DATE
      }
  
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctor');
  }
};