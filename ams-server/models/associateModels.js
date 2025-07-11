const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig');

const PatientReview = require('./patient_review.js')(sequelize,Sequelize.DataTypes);
const CheckUpDetail = require('./check_up_detail.js')(sequelize,Sequelize.DataTypes);
const Payment = require('./payment.js')(sequelize,Sequelize.DataTypes);
const Appointment = require('./appointment.js')(sequelize,Sequelize.DataTypes);
const PatientHistory = require('./patientHistory.js')(sequelize,Sequelize.DataTypes);
const Availability = require('./availability.js')(sequelize,Sequelize.DataTypes);
const Permission = require('./permission.js')(sequelize,Sequelize.DataTypes);
const Doctor = require('./doctor.js')(sequelize,Sequelize.DataTypes);
const User  = require('./user.js')(sequelize,Sequelize.DataTypes);
const Phone = require('./phone.js')(sequelize,Sequelize.DataTypes);


const models = {
    User , Phone ,Doctor , Permission , PatientHistory , Availability , Appointment , CheckUpDetail , Payment , PatientReview
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