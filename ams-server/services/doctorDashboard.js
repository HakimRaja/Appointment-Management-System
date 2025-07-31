const sequelize = require("../config/dbConfig");
const {v4 : uuidv4} = require('uuid');
const getDate = require("../utils/doctorDashboard");
const get = async (doctors_user_id,selectedDate,pageNumber,slotsPerPage) => {
    try {
        const limit = slotsPerPage;
        const offset = (pageNumber-1)*slotsPerPage;
        const today = new Date().toISOString().split('T')[0];
        let query;
        if (selectedDate === today) {
            query = `SELECT a.availability_id,a.start_time,a.end_time,a.date,a.is_booked,ap.user_id as patient_id,ap.status
            FROM availabilities a
            LEFT JOIN appointments ap ON a.availability_id = ap.availability_id AND ap."deletedAt" is NULL
            WHERE a.user_id = :doctors_user_id AND (a.date::date =:selectedDate::date AND (a.date::time > NOW()::time OR ap.status IS NOT NULL)) AND a."deletedAt" IS NULL
            ORDER BY a.start_time
            LIMIT :limit OFFSET :offset`
        } else {
            query = `SELECT a.availability_id,a.start_time,a.end_time,a.date,a.is_booked,ap.user_id as patient_id,ap.status
            FROM availabilities a
            LEFT JOIN appointments ap ON a.availability_id = ap.availability_id AND ap."deletedAt" is NULL
            WHERE a.user_id = :doctors_user_id AND a.date::date =:selectedDate::date AND a."deletedAt" IS NULL
            ORDER BY a.start_time
            LIMIT :limit OFFSET :offset`
        }
        const availabilities = await sequelize.query(query,{
            replacements : {doctors_user_id,selectedDate,limit,offset},
            type : sequelize.QueryTypes.SELECT
        });
        return availabilities;
    } catch (error) {
        throw error;
    }
}

const getAll = async (doctors_user_id) => {
    try {
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

const cancelAndDelete = async (availability_id) => {
    const transaction = await sequelize.transaction();
    try {
        const patientEmail = await sequelize.query(`SELECT u.email,u.name,av.date,av.start_time,av.end_time        	FROM availabilities av            JOIN appointments ap ON av.availability_id = ap.availability_id AND ap."deletedAt" is null JOIN users u ON ap.user_id= u.user_id WHERE av.availability_id=:availability_id AND av."deletedAt" IS null`,{
                replacements : {availability_id},
                type : sequelize.QueryTypes.SELECT
            })
        const cancelAppointment = await sequelize.query(`UPDATE appointments set status = :status,"updatedAt"=NOW() where availability_id=:availability_id and "deletedAt" IS NULL`,{
            replacements : {status : 'cancelled',availability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction
        })
        const deleteAvailability = await sequelize.query(`UPDATE availabilities set "deletedAt"=NOW() where availability_id = :availability_id`,{
            replacements : {availability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction
        })
        await transaction.commit();
        return patientEmail[0];
    } catch (error) {
        await transaction.rollback()
        throw error;
    }
}

const patient = async (patient_id) => {
    try {
        const patient = await sequelize.query(`SELECT u.name,u.email,p.phone_number,ph.history
            from users u
            LEFT JOIN phones p ON u.user_id = p.user_id
            LEFT JOIN patient_histories ph ON u.user_id = ph.user_id
            WHERE u.user_id = :patient_id`,{
                replacements : {patient_id},
                type : sequelize.QueryTypes.SELECT
            })
            return patient[0];
    } catch (error) {
        throw error;
    }
}

const complete = async (availability_id) => {
    try {
        const addToComplete = await sequelize.query(`UPDATE appointments set status=:status,"updatedAt"=NOW() WHERE availability_id=:availability_id AND "deletedAt" IS NULL`,{
            replacements : {status : 'completed',availability_id},
            type : sequelize.QueryTypes.SELECT
        })
        return true;
    } catch (error) {
        throw error;
    }
}

module.exports = {get,insert,deleteSlot,cancelAndDelete,patient,complete,getAll}