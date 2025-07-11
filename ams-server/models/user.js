'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Phone , {
        foreignKey : 'user_id',
        as : 'phones'
      });
      User.hasOne(models.Doctor , {
        foreignKey : 'user_id',
        as : 'doctor'
      });
      User.hasMany(models.PatientHistory , {
        foreignKey : 'user_id',
        as : 'patient_histories'
      });
      User.hasMany(models.Appointment , {
        foreignKey : 'user_id1',
        as : 'appointment_as_patient'
      });
      User.hasMany(models.Appointment , {
        foreignKey : 'user_id2',
        as : 'appointment_as_doctor'
      })
    }
  }
  User.init({
    user_id : {
      type : DataTypes.UUID,
      unique : true,
      allowNull : false,
      primaryKey : true,
      defaultValue: DataTypes.UUIDV4,
  },
    name: {type : DataTypes.STRING,
      allowNull : false
     },
    email: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false
  },
    password : {
      type : DataTypes.STRING,
      allowNull : false
  },
    dob: {
      type : DataTypes.DATE,
      allowNull : false
  },
  role : {type : DataTypes.ENUM('doctor','patient','admin') , allowNull : false}
  }, {
    sequelize,
    modelName: 'User',
    tableName : 'users',
    timestamps : true,
    paranoid : true
  });
  return User;
};