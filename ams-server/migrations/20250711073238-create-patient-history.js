'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patient_histories', {
      patient_history_id : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4,
        primaryKey : true,
        allowNull:false,
        unique : true
      },
      user_id : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4,
        allowNull : false
      },
      history: {type : Sequelize.STRING , 
        allowNull : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt:{
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('patient_histories');
  }
};