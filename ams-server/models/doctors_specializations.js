'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorsSpecializations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Doctors_Specializations.init({
    id : {
      type : DataTypes.UUID
    },
    user_id: DataTypes.UUID,
    specialization_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'DoctorsSpecializations',
    tableName: 'doctors_specializations',
    timeStamps:true,
    paranoid : true
  });
  return DoctorsSpecializations;
};