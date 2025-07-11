require('dotenv').config();
const db = require('./models/associateModels.js')

//Connect to database
// sequelize.sync()
// .then(()=>{
//     console.log(`Database is connected at post ${process.env.DB_PORT}`)
// })
// .catch((err)=>{
//     console.log(err)
// })

db.sequelize.authenticate()
.then(()=>{
    console.log(`Database is connected at post ${process.env.DB_PORT}`)
})
.catch((err)=>{
    console.log(err)
})