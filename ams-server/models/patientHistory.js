'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PatientHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PatientHistory.belongsTo(models.User , {
        foreignKey : 'user_id',
        as : 'user'
      })
    }
  }
  PatientHistory.init({
    patient_history_id : {
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
      primaryKey : true,
      allowNull:false,
      unique : true
    },
    user_id : {
      type : DataTypes.UUID,
      allowNull : false
    },
    history: {type : DataTypes.STRING , 
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'PatientHistory',
    tableName: 'patient_histories',
    timestamps : true,
    paranoid : true
  });
  return PatientHistory;
};