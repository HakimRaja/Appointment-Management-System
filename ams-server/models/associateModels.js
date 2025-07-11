const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const permission = require('./permission.js')(sequelize,Sequelize.DataTypes);
const doctor = require('./doctor.js')(sequelize,Sequelize.DataTypes);
const user  = require('./user.js')(sequelize,Sequelize.DataTypes);
const phone = require('./phone.js')(sequelize,Sequelize.DataTypes);


const models = {
    user , phone ,doctor , permission
};

Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

module.exports = {
    Sequelize,
    sequelize,
    ...models
}