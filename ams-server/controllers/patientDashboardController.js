const sequelize = require("../config/dbConfig");
const getYearsDifference = require("../services/patientDashboard");
const {v4 : uuidv4} = require('uuid');

const getDoctorsList = async (req,res) => {
    try {
        const doctorsList = await sequelize.query(`SELECT u.user_id,u.name,u.email,p.phone_number,d.experience,s.title,a.availability_id,a.date,a.start_time,a.end_time,a.is_booked,ap.user_id as booked_by
            FROM users u
            JOIN phones p ON u.user_id=p.user_id
            JOIN doctors d ON u.user_id=d.user_id
            JOIN doctors_specializations ds ON u.user_id =ds.user_id
            JOIN specializations s ON ds.specialization_id=s.specialization_id 
            JOIN availabilities a ON u.user_id = a.user_id
            LEFT JOIN appointments ap ON a.availability_id = ap.availability_id 
            WHERE u.role = :role AND (ap.status IS NULL OR ap.status != :status OR a.is_booked =:is_booked) AND a.date > NOW()`,{
                replacements : {role : 'doctor' , status : 'cancelled',is_booked : false},
                type : sequelize.QueryTypes.SELECT
            }); // availabilities and specializations are mostly more then one row
        if (doctorsList.length === 0){
            return res.status(200).send({check : false});
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
                        booked_by_me : req.user.user_id === booked_by
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
        res.status(500).send({error : error.message})
    }
}

const bookAppointment = async(req,res) =>{
    if (!req.body.availability_id) {
        return res.status(400).send({message : 'Please provide availability id!'})
    }
    const availability_id = req.body.availability_id;
    const transaction = await sequelize.transaction();
    try {
        const appointment_id = uuidv4();
        const checkAppointments = await sequelize.query(`SELECT * FROM appointments WHERE availability_id=:availability_id AND "deletedAt" IS NULL`,{
            replacements : {availability_id},
            type : sequelize.QueryTypes.SELECT
        })
        if (checkAppointments.length > 0) {
            return res.status(400).send({message : 'This Slot is already Booked!'});
        }
        const addAppointment = await sequelize.query('INSERT INTO appointments(appointment_id,availability_id,user_id,"createdAt","updatedAt") Values(:appointment_id,:availability_id,:user_id,NOW(),NOW()) RETURNING appointment_id',{
            replacements : {appointment_id,availability_id,user_id : req.user.user_id},
            type : sequelize.QueryTypes.INSERT,
            transaction : transaction
        });
        const updateAvailabilities = await sequelize.query('UPDATE availabilities set is_booked=:is_booked,"updatedAt"=NOW() WHERE availability_id = :availability_id',{
            replacements : {is_booked : true,availability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction : transaction
        });
        await transaction.commit();
        return res.status(200).send({message : 'Appointment created successfully'});
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        return res.status(500).send({error : error.message})
    }
}

const getAppointments = async(req,res) =>{
    try {
        const patient_id = req.params.id;
        const appointmentList = await sequelize.query(`Select ap.appointment_id,ap.status,a.date,a.start_time,a.end_time,u.name,u.email,s.title
            FROM appointments ap
            JOIN availabilities a ON ap.availability_id = a.availability_id
            JOIN users u ON a.user_id = u.user_id
            JOIN doctors_specializations ds on u.user_id = ds.user_id
            JOIN specializations s on ds.specialization_id = s.specialization_id
            WHERE ap.user_id = :user_id AND ap."deletedAt" IS NULL AND ap.status=:status`,{
            replacements : {user_id : patient_id , status : 'scheduled'},
            type : sequelize.QueryTypes.SELECT
        });
        if (appointmentList.length === 0) {
            return res.status(200).send(false);
        }
        const appointmentInfo = {};
        appointmentList.forEach((list)=>{
            const appointment_id = list.appointment_id;
            if(!appointmentInfo[appointment_id]){
                const {name , status ,date , start_time , end_time ,email} = list;
                appointmentInfo[appointment_id] = {
                    name,
                    appointment_id,
                    status,
                    date,
                    start_time,
                    end_time,
                    email,
                    specializations : new Set()
                }
            }
            appointmentInfo[appointment_id].specializations.add(list.title)
        });
        const finalAppointments = Object.values(appointmentInfo).map(info => ({...info,specializations : Array.from(info.specializations) }));

        return res.status(200).send({finalAppointments});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message})
    }
};

const deleteAppointment = async (req,res) => {
    if (!req.params.id) {
        return res.status(400).send({message:'Appointment Id is missing.'})
    }
    const appointment_id = req.params.id;
    const t = await sequelize.transaction();
    try {
        const data = await sequelize.query(`UPDATE appointments set status=:status,"deletedAt"=NOW() WHERE appointment_id=:appointment_id RETURNING availability_id`,{
            replacements : {status : 'cancelled' , appointment_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction:t
        })
        const availability_id = data[0][0]?.availability_id;
        const updateAvailabilities = await sequelize.query(`UPDATE availabilities set is_booked=:is_booked,"updatedAt"=NOW() where availability_id=:availability_id`,{
            replacements : {is_booked : false , availability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction : t
        })
        await t.commit();
        res.status(200).send(true);
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).send({error : error.message})
    }
}

module.exports = {getDoctorsList,bookAppointment,getAppointments,deleteAppointment};
