'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Permission.init({
    permission_id: {type : DataTypes.UUID,
      allowNull : false,
      unique : true,
      primaryKey : true ,//also foreign key from users table 
      defaultValue: DataTypes.UUIDV4,
    },
    permission: {type : DataTypes.STRING,
      allowNull :false
    },
    role: {type : DataTypes.ENUM('doctor','patient','admin') , allowNull : false}
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions',
    timestamps : true,
    paranoid : true
  });
  return Permission;
};