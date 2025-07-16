'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DoctorSpecialization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DoctorSpecialization.belongsTo(models.Doctor, {foreignKey : 'user_id'});
      DoctorSpecialization.belongsTo(models.Specialization , {foreignKey : 'specialization_id'})
    }
  }
  DoctorSpecialization.init({
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUID,
      allowNull : false
    },
    user_id: {
      type : DataTypes.UUID,
      allowNull : false
    },
    specialization_id: {
      type : DataTypes.UUID,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'DoctorSpecialization',
    tableName: 'doctors_specializations',
    timeStamps:true,
    paranoid : true
  });
  return DoctorSpecialization;
};