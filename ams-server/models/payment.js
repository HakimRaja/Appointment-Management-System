'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Payment.belongsTo(models.Appointment , {
        foreignKey : 'appointment_id',
        as : 'appointment'
      })
    }
  }
  Payment.init({
    appointment_id : {
      
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
   
  },
  payment_status : {
    type : DataTypes.ENUM('completed','pending'),
    allowNull : false
  },
  amount : {
    type : DataTypes.INTEGER,
    allowNull : false
  }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName : 'payments',
    timestamps : true,
    paranoid : true
  });
  return Payment;
};