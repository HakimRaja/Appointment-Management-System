require('dotenv').config();
const sequelize = require('./config/dbConfig.js')

//Connect to database
sequelize.sync()
.then(()=>{
    console.log(`Database is connected at post ${process.env.DB_PORT}`)
})
.catch((err)=>{
    console.log(err)
})