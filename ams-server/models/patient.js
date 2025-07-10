'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  patient.init({
    user_id: DataTypes.INTEGER,
    disease_history: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'patient',
  });
  return patient;
};