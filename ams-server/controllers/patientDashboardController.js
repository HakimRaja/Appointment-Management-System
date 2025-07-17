const sequelize = require("../config/dbConfig");
const getYearsDifference = require("../services/patientDashboard");

const getDoctorsList = async (req,res) => {
    try {
        const doctorsList = await sequelize.query(`SELECT users.user_id,users.name,users.email,phones.phone_number,doctors.experience,specializations.title,availabilities.availability_id,availabilities.date,availabilities.start_time,availabilities.end_time 
            FROM users 
            JOIN phones ON users.user_id=phones.user_id
            JOIN doctors ON users.user_id=doctors.user_id
            JOIN doctors_specializations ON users.user_id =doctors_specializations.user_id
            JOIN specializations ON doctors_specializations.specialization_id=specializations.specialization_id 
            JOIN availabilities ON users.user_id = availabilities.user_id
            WHERE users.role = :role AND availabilities.is_booked = :is_booked AND availabilities.date > NOW()`,{
                replacements : {role : 'doctor' , is_booked : false},
                type : sequelize.QueryTypes.SELECT
            }); // availabilities and specializations are mostly more then one row
        if (doctorsList.length === 0){
            return res.status(200).send({check : false});
        }
        
            const doctorsInfo = {};
            doctorsList.forEach((list =>{
                const docId = list.user_id;
                if(!doctorsInfo[docId]){
                    doctorsInfo[docId] = {
                        user_id : docId,
                        name:list.name,
                        email:list.email,
                        phone:list.phone_number,
                        experience:getYearsDifference(list.experience),
                        specializations:new Set(),
                        availabilities : new Map()
                    }
                }
                doctorsInfo[docId].specializations.add(list.title);
    
                if (!(doctorsInfo[docId].availabilities.has(list.availability_id))) {
                    doctorsInfo[docId].availabilities.set(list.availability_id, {
                        availability_id : list.availability_id,
                        date : list.date,
                        start_time : list.start_time,
                        end_time : list.end_time
                    })
                }
            }));
            const finalDoctors = Object.values(doctorsInfo).map(doc =>({
                ...doc,
                specializations : Array.from(doc.specializations),
                availabilities : Array.from(doc.availabilities.values())
            }))
        
        res.status(200).send({finalDoctors});
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = getDoctorsList;