'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Specialization.hasMany(models.Doctor,{
        foreignKey : 'specialization_id',
        as : 'doctors'
      })
    }
  }
  Specialization.init({
    specialization_id : {
      type : DataTypes.UUID,
      primaryKey : true,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull :false,
      unique  :true
    }
  }, {
    sequelize,
    modelName: 'Specialization',
    tableName: 'specializations',
    timestamps:true,
    paranoid: true
  });
  return Specialization;
};