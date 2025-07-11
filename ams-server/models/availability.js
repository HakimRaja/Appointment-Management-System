'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Availability.belongsTo(models.Doctor , {
        foreignKey : 'user_id',
        as : 'doctor'
      })
    }
  }
  Availability.init({
    availabilty_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    day: {
      type: DataTypes.ENUM(
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ),
      allowNull: false
    },
    start_timeSlot: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_timeSlot: {
      type: DataTypes.TIME,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Availability',
    tableName: 'availabilities',
    timestamps:true,
    paranoid:true
  });
  return Availability;
};