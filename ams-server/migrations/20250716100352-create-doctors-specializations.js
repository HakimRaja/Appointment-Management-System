'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctors_specializations', {
      id : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue : Sequelize.UUID,
        allowNull : false,
        unique : true
      },
      user_id: {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'doctors',
          key : 'user_id'
        },
        onDelete : 'CASCADE'
      },
      specialization_id: {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'specializations',
          key : 'specialization_id'
        },
        onDelete : 'CASCADE'
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
    await queryInterface.dropTable('doctors_specializations');
  }
};