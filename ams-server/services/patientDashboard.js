const sequelize = require("../config/dbConfig");
const getYearsDifference = require("../utils/patientDashboard");
const {v4 : uuidv4} = require('uuid');

const getDoctors = async (user_id) => {
    try {
        const doctorsList = await sequelize.query(`SELECT u.user_id,u.name,u.email,p.phone_number,d.experience,s.title,a.availability_id,a.date,a.start_time,a.end_time,a.is_booked,ap.user_id as booked_by
            FROM users u
            JOIN phones p ON u.user_id=p.user_id
            JOIN doctors d ON u.user_id=d.user_id
            JOIN doctors_specializations ds ON u.user_id =ds.user_id
            JOIN specializations s ON ds.specialization_id=s.specialization_id 
            JOIN availabilities a ON u.user_id = a.user_id AND a."deletedAt" IS NULL
            LEFT JOIN appointments ap ON a.availability_id = ap.availability_id AND ap."deletedAt" is null
            WHERE u.role = :role AND (ap.status IS NULL OR ap.status != :status OR a.is_booked =:is_booked) AND a.date > NOW()`,{
                replacements : {role : 'doctor' , status : 'cancelled',is_booked : false},
                type : sequelize.QueryTypes.SELECT
            }); // availabilities and specializations are mostly more then one row
        if (doctorsList.length === 0){
            return false;
        }
        
            const doctorsInfo = {};
            doctorsList.forEach((list =>{
                const docId = list.user_id;
                if(!doctorsInfo[docId]){
                    const experience = getYearsDifference(list.experience);
                    const experienceString = `${experience[0]>=1 ? `${experience[0]} year and`:''} ${experience[1]} months`;
                    const {name , email , phone_number} = list;
                    doctorsInfo[docId] = {
                        user_id : docId,
                        name,
                        email,
                        phone:phone_number,
                        experience: experienceString,
                        specializations:new Set(),
                        availabilities : new Map()
                    }
                }
                doctorsInfo[docId].specializations.add(list.title);
    
                if (!(doctorsInfo[docId].availabilities.has(list.availability_id))) {
                    const {availability_id , date , start_time ,end_time , is_booked , booked_by} = list;
                    doctorsInfo[docId].availabilities.set(list.availability_id, {
                        availability_id,
                        date,
                        start_time,
                        end_time,
                        is_booked,
                        booked_by_me :  user_id === booked_by
                    })
                }
            }));
            const finalDoctors = Object.values(doctorsInfo).map(doc =>({
                ...doc,
                specializations : Array.from(doc.specializations),
                availabilities : Array.from(doc.availabilities.values())
            }));
            return finalDoctors;
    } catch (error) {
        throw error;
    }
}

const book = async(availability_id,user_id)=> {
    const transaction = await sequelize.transaction();
    try {
        const appointment_id = uuidv4();
        const checkAppointments = await sequelize.query(`SELECT * FROM appointments WHERE availability_id=:availability_id AND "deletedAt" IS NULL`,{
            replacements : {availability_id},
            type : sequelize.QueryTypes.SELECT
        })
        if (checkAppointments.length > 0) {
            return false;
        }
        const addAppointment = await sequelize.query('INSERT INTO appointments(appointment_id,availability_id,user_id,"createdAt","updatedAt") Values(:appointment_id,:availability_id,:user_id,NOW(),NOW()) RETURNING appointment_id',{
            replacements : {appointment_id,availability_id,user_id},
            type : sequelize.QueryTypes.INSERT,
            transaction : transaction
        });
        const updateAvailabilities = await sequelize.query('UPDATE availabilities set is_booked=:is_booked,"updatedAt"=NOW() WHERE availability_id = :availability_id',{
            replacements : {is_booked : true,availability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction : transaction
        });
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {getDoctors,book}