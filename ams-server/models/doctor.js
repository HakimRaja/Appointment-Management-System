'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Doctor.belongsTo(models.User , {
        foreignKey : 'user_id',
        as : 'user'
      });
      Doctor.hasMany(models.Availability, {
        foreignKey : 'user_id',
        as : 'availabilties'
      })
    }
  }
  Doctor.init({
    user_id: {type : DataTypes.UUID,
      allowNull : false,
      unique : true,
      primaryKey : true //also foreign key from users table 
    },
    specialization:{type : DataTypes.STRING,
      allowNull : false,
    },
    experience: {type : DataTypes.DATE,
      allowNull : false
    },
  }, {
    sequelize,
    modelName: 'Doctor',
    tableName : 'doctors',
    timestamps : true,
    paranoid  :true
  });
  return Doctor;
};