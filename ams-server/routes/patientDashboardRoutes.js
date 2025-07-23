const {getDoctorsList , bookAppointment, getAppointments, deleteAppointment, getAvailabilitiesForUpdate, updateAppointments} = require('../controllers/patientDashboardController');
const { verify } = require('../middlewares/authMiddleware');

const patientDashboardRouter = require('express').Router();


patientDashboardRouter.get('/doctors',verify,getDoctorsList);
patientDashboardRouter.post('/book',verify,bookAppointment);
patientDashboardRouter.get('/appointments/:id',verify,getAppointments);
patientDashboardRouter.delete('/appointment/:id',verify,deleteAppointment);
patientDashboardRouter.get('/appointment/:doctor_id',verify,getAvailabilitiesForUpdate);
patientDashboardRouter.patch('/appointment/:appointment_id',verify,updateAppointments);

module.exports = patientDashboardRouter;