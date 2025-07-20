const sequelize = require("../config/dbConfig");
const getYearsDifference = require("../services/patientDashboard");
const {v4 : uuidv4} = require('uuid');

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
        res.status(500).send({error : error.message})
    }
}

const bookAppointment = async(req,res) =>{
    try {
        if (!req.body.availability_id) {
            res.status(400).send({message : 'Something went wrong!'})
        }
        const availability_id = req.body.availability_id;
        
        const appointment_id = uuidv4();
        const addAppointment = await sequelize.query('INSERT INTO appointments(appointment_id,availability_id,user_id,"createdAt","updatedAt") Values(:appointment_id,:availability_id,:user_id,NOW(),NOW()) RETURNING appointment_id',{
            replacements : {appointment_id,availability_id,user_id : req.user.user_id},
            type : sequelize.QueryTypes.INSERT
        });
        const updateAvailabilities = await sequelize.query('UPDATE availabilities set is_booked=:is_booked,"updatedAt"=NOW() WHERE availability_id = :availability_id',{
            replacements : {is_booked : true,availability_id},
            type : sequelize.QueryTypes.UPDATE
        });

        return res.status(200).send({message : 'Appointment created successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message})
    }
}

const getAppointments = async(req,res) =>{
    try {
        const patient_id = req.params.id;
        const appointmentList = await sequelize.query(`Select appointments.appointment_id,appointments.status,availabilities.date,availabilities.start_time,availabilities.end_time,users.name,users.email,specializations.title
            FROM appointments
            JOIN availabilities ON appointments.availability_id = availabilities.availability_id
            JOIN users ON availabilities.user_id = users.user_id
            JOIN doctors_specializations on users.user_id = doctors_specializations.user_id
            JOIN specializations on doctors_specializations.specialization_id = specializations.specialization_id
            WHERE appointments.user_id = :user_id AND appointments."deletedAt" IS NULL AND appointments.status=:status`,{
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
                appointmentInfo[appointment_id] = {
                    name : list.name,
                    appointment_id : list.appointment_id,
                    status : list.status,
                    date : list.date,
                    start_time : list.start_time,
                    end_time : list.end_time,
                    email : list.email,
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
        return res.status(400).send({message:'Please send appointment_id.'})
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

/* `Select appointments.appointment_id,appointments.status,availabilities.date,availabilities.start_time,availabilities.end_time,users.name,users.email,specializations.title
            FROM appointments
            JOIN availabilities ON appointments.availability_id = availabilities.availability_id
            JOIN users ON availabilities.user_id = users.user_id
            JOIN doctors_specializations on users.user_id = doctors_specializations.user_id
            JOIN specializations on doctors_specializations.specialization_id = specializations.specialization_id
            WHERE appointments.user_id = 'f6dcbdbf-aaad-4cea-8350-45570445d740' AND appointments."deletedAt" is null AND appointments.status='scheduled'` */