const {getDoctorsList , bookAppointment, getAppointments, deleteAppointment} = require('../controllers/patientDashboardController');
const { verify } = require('../middlewares/authMiddleware');

const patientDashboardRouter = require('express').Router();


patientDashboardRouter.get('/doctors',verify,getDoctorsList);
patientDashboardRouter.post('/book',verify,bookAppointment);
patientDashboardRouter.get('/appointments/:id',verify,getAppointments);
patientDashboardRouter.delete('/appointment/:id',verify,deleteAppointment)

module.exports = patientDashboardRouter;