'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Phone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Phone.belongsTo(models.User , {
        foreignKey : 'user_id',
        as : 'user'
      })
    }
  }
  Phone.init({
    phone_id : {
      type : DataTypes.UUID,
      unique : true,
      allowNull : false,
      primaryKey : true,
      defaultValue: DataTypes.UUIDV4,
  },
    user_id: {
      type : DataTypes.UUID,
      allowNull : false,
  },
    phone_number: {
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'Phone',
    tableName : 'phones',
    timestamps : true,
    paranoid : true
  });
  return Phone;
};