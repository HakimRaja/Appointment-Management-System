'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class check_up_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  check_up_details.init({
    check_up_detail_id: DataTypes.INTEGER,
    appointment_id: DataTypes.INTEGER,
    observation: DataTypes.STRING,
    follow_ups: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'check_up_details',
  });
  return check_up_details;
};