const { getAvailabilities, addAvailability, deleteAvailability, cancelAppointmentAndRemoveAvailability, patientDetails, addAppointmentToComplete } = require('../controllers/doctorDashboardController');
const { verify } = require('../middlewares/authMiddleware');
const doctorDashboardRouter = require('express').Router();


doctorDashboardRouter.get('/availabilities',verify,getAvailabilities);
doctorDashboardRouter.post('/availabilities',verify,addAvailability);
doctorDashboardRouter.delete('/availability/:availability_id',verify,deleteAvailability);
doctorDashboardRouter.delete('/appointment/:availability_id',verify,cancelAppointmentAndRemoveAvailability);
doctorDashboardRouter.get('/patient/:patient_id',verify,patientDetails);
doctorDashboardRouter.patch('/appointment/:availability_id',verify,addAppointmentToComplete);

module.exports = doctorDashboardRouter;