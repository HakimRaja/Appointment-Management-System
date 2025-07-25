const { getAvailabilities, addAvailability, deleteAvailability } = require('../controllers/doctorDashboardController');
const { verify } = require('../middlewares/authMiddleware');
const doctorDashboardRouter = require('express').Router();


doctorDashboardRouter.get('/availabilities',verify,getAvailabilities);
doctorDashboardRouter.post('/availabilities',verify,addAvailability);
doctorDashboardRouter.delete('/availability/:availability_id',verify,deleteAvailability);

module.exports = doctorDashboardRouter;