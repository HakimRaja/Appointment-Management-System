const { getAvailabilities, addAvailability } = require('../controllers/doctorDashboardController');
const { verify } = require('../middlewares/authMiddleware');
const doctorDashboardRouter = require('express').Router();


doctorDashboardRouter.get('/availabilities/:doctor_id',verify,getAvailabilities);
doctorDashboardRouter.post('/availabilities',verify,addAvailability)

module.exports = doctorDashboardRouter;