'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      appointment_id : {
      
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references : {
          model : 'appointments',
          key : 'appointment_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
     
    },
    payment_status : {
      type : Sequelize.ENUM('completed','pending'),
      allowNull : false
    },
    amount : {
      type : Sequelize.INTEGER,
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
      deletedAt : {
        type : Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};