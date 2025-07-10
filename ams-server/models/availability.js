'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  availability.init({
    availabilty_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    mon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'availability',
  });
  return availability;
};