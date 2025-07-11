'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.phone , {
        foreignKey : 'user_id',
        as : 'phones'
      });
      user.hasOne(models.doctor , {
        foreignKey : 'user_id',
        as : 'doctor'
      })
    }
  }
  user.init({
    user_id : {
      type : DataTypes.UUID,
      unique : true,
      allowNull : false,
      primaryKey : true
  },
    name: {type : DataTypes.STRING,
      allowNull : false
     },
    email: {
      type : DataTypes.STRING,
      unique : true,
      allowNull : false
  },
    password : {
      type : DataTypes.STRING,
      allowNull : false
  },
    age: {
      type : DataTypes.INTEGER,
      allowNull : false
  },
  role : {type : DataTypes.ENUM('doctor','patient','admin') , allowNull : false}
  }, {
    sequelize,
    modelName: 'user',
    tableName : 'user',
    timestamps : true,
    paranoid : true
  });
  return user;
};