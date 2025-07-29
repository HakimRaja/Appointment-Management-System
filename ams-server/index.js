require('dotenv').config();
const db = require('./models/associateModels.js');
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoutes.js');
const adminDashboardRouter = require('./routes/adminDashboardRoutes.js');
const addContentToSpecialization = require('./services/helper_functions/addContentToSpecialization.js');
const patientDashboardRouter = require('./routes/patientDashboardRoutes.js');
const doctorDashboardRouter = require('./routes/doctorDashboardRoutes.js');
const app = new express();
const PORT = process.env.PORT;




app.use(cors());
app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/admindashboard',adminDashboardRouter);
app.use('/api/patientdashboard',patientDashboardRouter);
app.use('/api/doctordashboard',doctorDashboardRouter);
//add data in specialization using IIFE
// (async () => {
//     await addContentToSpecialization();
// })()
db.sequelize.authenticate()
.then(()=>{
    console.log(`Database is connected at post ${process.env.DB_PORT}`);
    app.listen(PORT , ()=>{
        console.log(`Server is running at port ${PORT}`)
    })
})
.catch((err)=>{
    console.log(err)
})