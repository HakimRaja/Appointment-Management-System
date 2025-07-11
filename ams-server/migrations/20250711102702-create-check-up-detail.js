'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('check_up_details', {
      appointment_id : {
      
        type: Sequelize.UUID,
        primaryKey: true,
        references : {
          model : 'appointments',
          key : 'appointment_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' ,
        allowNull: false
     
    },
    observation : {
      type : Sequelize.STRING,
      allowNull : false
    },
    follow_ups : {
      type : Sequelize.STRING,
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
    await queryInterface.dropTable('check_up_details');
  }
};