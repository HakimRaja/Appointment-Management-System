const getDoctorsList = require('../controllers/patientDashboardController');
const { verify } = require('../middlewares/authMiddleware');

const patientDashboardRouter = require('express').Router();


patientDashboardRouter.get('/doctors',verify,getDoctorsList);
patientDashboardRouter.get('/book',verify,getDoctorsList);

module.exports = patientDashboardRouter;