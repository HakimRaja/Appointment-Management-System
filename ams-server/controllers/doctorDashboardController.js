const sequelize = require("../config/dbConfig");
const {v4 : uuidv4} = require('uuid');
const getDate = require("../services/doctorDashboard");

const getAvailabilities = async (req,res) => {
    const doctors_user_id = req.params.doctor_id;
    if (!doctors_user_id) {
        return res.status(400).send({message : 'Doctors Id is missing.'})
    }
    try {
        const availabilities = await sequelize.query(`SELECT a.availability_id,a.start_time,a.end_time,a.date,a.is_booked,ap.user_id as patient_id,ap.status
            FROM availabilities a
            LEFT JOIN appointments ap ON a.availability_id = ap.availability_id AND ap."deletedAt" is NULL
            WHERE a.user_id = :doctors_user_id `,{
            replacements : {doctors_user_id},
            type : sequelize.QueryTypes.SELECT
        });

        return res.status(200).send({availabilities});
    } catch (error) {
        return res.status(500).send({error : error.message});
    }
};

const cancelAppointment = async (req,res) => {
    
    try {
        
    } catch (error) {
        return res.status(500).send({error : error.message});
    }
}

const addAvailability = async (req,res) => {
    const {timeSlots,date} = req.body;
    const user_id = req.user.user_id;
    if (!timeSlots || !date) {
        return res.status(400).send({message : 'Please send all the required fields.'});
    }
    const transaction = await sequelize.transaction();
    try {
        for (let i = 0; i < timeSlots.length; i++){
            const {start_time,end_time} = timeSlots[i].value;

            const availability_id = uuidv4();

            const dateWithTime = getDate(start_time,date);
            const availability = await sequelize.query(`INSERT INTO availabilities (availability_id,user_id,start_time,end_time,date,"createdAt","updatedAt") VALUES (:availability_id,:user_id,:start_time,:end_time,:date,NOW(),NOW())`,{
                replacements : {availability_id,user_id,start_time,end_time,date : dateWithTime},
                type : sequelize.QueryTypes.INSERT,
                transaction
            });
    }
        await transaction.commit();
        return res.status(200).send({message : 'Success'});
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).send({error : error.message});
    }
}


module.exports = {getAvailabilities,addAvailability};