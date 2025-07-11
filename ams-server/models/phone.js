'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class phone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      phone.belongsTo(models.user , {
        foreignKey : 'user_id',
        as : 'user'
      })
    }
  }
  phone.init({
    id : {
      type : DataTypes.UUID,
      unique : true,
      allowNull : false,
      primaryKey : true
  },
    user_id: {
      type : DataTypes.UUID,
      allowNull : false
  },
    phone_number: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'phone',
    tableName : 'phone',
    timestamps : true,
    paranoid : true
  });
  return phone;
};