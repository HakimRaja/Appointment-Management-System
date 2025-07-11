const { addNonValidatedUser, getNonValidatedUsers, RemoveNonValidatedUser } = require('../controllers/adminDashboardController');
const {checkPostRequestBody, checkGetRequestBody} = require('../middlewares/adminDashboarMiddleware');
const { verify } = require('../middlewares/authMiddleware');

const adminDashboardRouter = require('express').Router();

adminDashboardRouter.get('/getnonvalidatedusers',verify,checkGetRequestBody,getNonValidatedUsers);
adminDashboardRouter.patch('/addnonvalidated',verify,checkPostRequestBody,addNonValidatedUser);
adminDashboardRouter.patch('/removefromnonvalidated',verify,checkPostRequestBody,RemoveNonValidatedUser);
module.exports = adminDashboardRouter;