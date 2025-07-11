require('dotenv').config();
const db = require('./models/associateModels.js');
const express = require('express');
const authRouter = require('./routes/authRoutes.js');
const adminDashboardRouter = require('./routes/adminDashboardRoutes.js');
const app = new express();
const PORT = process.env.PORT;



//Connect to database
// sequelize.sync()
// .then(()=>{
//     console.log(`Database is connected at post ${process.env.DB_PORT}`)
// })
// .catch((err)=>{
//     console.log(err)
// })
app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/admindashboard',adminDashboardRouter);

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