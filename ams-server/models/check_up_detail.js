'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CheckUpDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CheckUpDetail.belongsTo(models.Appointment , {
        foreignKey : 'appointment_id',
        as : 'appointment'
      })
    }
  }
  CheckUpDetail.init({
    appointment_id : {
      
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
     
    },
    observation : {
      type : DataTypes.STRING,
      allowNull : false
    },
    follow_ups : {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'CheckUpDetail',
    tableName: 'check_up_details',
    timestamps: true,
    paranoid : true
  });
  return CheckUpDetail;
};