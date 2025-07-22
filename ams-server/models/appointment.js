'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.User , {
        foreignKey : 'user_id',
        as : 'patient'
      });
      Appointment.belongsTo(models.Availability , {
        foreignKey : 'availability_id',
        as : 'availability'
      });
      Appointment.hasOne(models.CheckUpDetail , {
        foreignKey : 'appointment_id',
        as : 'check_up_detail'
      });
      Appointment.hasOne(models.PatientReview , {
        foreignKey : 'appointment_id',
        as : 'review'
      });
      Appointment.hasOne(models.Payment , {
        foreignKey : 'appointment_id',
        as : 'payment'
      });
    }
  }
  Appointment.init({
    appointment_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    availability_id : {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('cancelled', 'scheduled', 'completed'),
      allowNull: false,
      defaultValue: 'scheduled'
    }
  }, {
    sequelize,
    modelName: 'Appointment',
    tableName : 'appointments',
    timestamps : true,
    paranoid : true
  });
  return Appointment;
};