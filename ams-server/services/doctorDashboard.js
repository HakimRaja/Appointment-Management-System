const sequelize = require("../config/dbConfig");
const {v4 : uuidv4} = require('uuid');
const getDate = require("../utils/doctorDashboard");
const get = async (doctors_user_id) => {
    try {
        console.log(doctors_user_id);
        const availabilities = await sequelize.query(`SELECT a.availability_id,a.start_time,a.end_time,a.date,a.is_booked,ap.user_id as patient_id,ap.status
            FROM availabilities a
            LEFT JOIN appointments ap ON a.availability_id = ap.availability_id AND ap."deletedAt" is NULL
            WHERE a.user_id = :doctors_user_id AND a."deletedAt" IS NULL`,{
            replacements : {doctors_user_id},
            type : sequelize.QueryTypes.SELECT
        });
        return availabilities;
    } catch (error) {
        throw error;
    }
}

const insert = async (timeSlots,date,user_id) => {
    const transaction = await sequelize.transaction();
    try {
        const insetions = timeSlots.map((slot)=> {
            const {start_time,end_time} = slot.value;
            const availability_id = uuidv4();
            const dateWithTime = getDate(start_time,date);
            const availability = sequelize.query(`INSERT INTO availabilities (availability_id,user_id,start_time,end_time,date,"createdAt","updatedAt") VALUES (:availability_id,:user_id,:start_time,:end_time,:date,NOW(),NOW())`,{
                replacements : {availability_id,user_id,start_time,end_time,date : dateWithTime},
                type : sequelize.QueryTypes.INSERT,
                transaction
            });
        });
        await Promise.all(insetions);
        await transaction.commit();
        return true;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const deleteSlot = async(availability_id) =>{
    try {
        //multiple users will be using this hence i will check if the availability is really free or not, if this is free then is will just delete
     const check = await sequelize.query(`SELECT * FROM appointments where availability_id = :availability_id`,{
        replacements : {availability_id},
        type : sequelize.query.SELECT
     })
     if (check[0].length > 0) {
        return false;
     }
     const del = await sequelize.query(`UPDATE availabilities set "deletedAt" = NOW() where availability_id=:availability_id`,{
        replacements : {availability_id},
        type : sequelize.QueryTypes.UPDATE
     });

     return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {get,insert,deleteSlot}