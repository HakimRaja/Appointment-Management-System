'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PatientReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PatientReview.belongsTo(models.Appointment , {
        foreignKey : 'appointment_id',
        as : 'appointment'
      })
    }
  }
  PatientReview.init({
    appointment_id : {
      
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull : false
      
  },
  stars : {
    type : DataTypes.ENUM('1','2','3','4','5'),
    allowNull : false
  },
  review : {
    type : DataTypes.STRING,
    allowNull : false
  },
  }, {
    sequelize,
    modelName: 'PatientReview',
    tableName : 'patient_reviews',
    timestamps: true,
    paranoid: true
  });
  return PatientReview;
};