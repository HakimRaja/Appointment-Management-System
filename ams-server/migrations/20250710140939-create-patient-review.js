'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patient_reviews', {
      appointment_id : {
      
        type: DataTypes.UUID,
        primaryKey: true,
        references : {
          model : 'appointments',
          key : 'appointment_id'
        },
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE',
        allowNull : false
    },
    stars : {
      type : DataTypes.ENUM(1,2,3,4,5),
      allowNull : false
    },
    review : {
      type : DataTypes.STRING,
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
    await queryInterface.dropTable('patient_reviews');
  }
};