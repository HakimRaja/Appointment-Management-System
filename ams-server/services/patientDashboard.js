const sequelize = require("../config/dbConfig");
const getYearsDifference = require("../utils/patientDashboard");
const {v4 : uuidv4} = require('uuid');

const getDoctors = async (user_id,pageNumber,doctorsPerPage,input) => {
    try {
        const limit = doctorsPerPage;
        const offset = (pageNumber-1) * doctorsPerPage;
        const doctors = await sequelize.query(`SELECT u.user_id,u.name,u.email,p.phone_number,d.experience
            FROM users u
            JOIN phones p ON u.user_id=p.user_id
            JOIN doctors d ON u.user_id=d.user_id
            WHERE u.role = :role AND u.name ILIKE CONCAT('%',:input,'%')
            ORDER BY d.experience 
            LIMIT :limit OFFSET :offset`,{
            replacements : {role : 'doctor',input,limit,offset},
            type : sequelize.QueryTypes.SELECT
        });
        if (doctors.length === 0){
            return [];
        }
        let i=offset+1;
        const userIds = doctors.map((doc)=> {
            doc.picture = `https://hakimraja.github.io/AMS-assets/images/male/doctor${i}.jpg`;
            i++;
            return doc.user_id;
        });
        const specialization = await sequelize.query(`SELECT ds.user_id,s.title
            FROM doctors_specializations ds
            JOIN specializations s ON ds.specialization_id = s.specialization_id
            WHERE ds.user_id IN (:userIds)`,{
                replacements : {userIds},
                type : sequelize.QueryTypes.SELECT
            });
        const availability = await sequelize.query(`SELECT a.user_id,a.availability_id,a.date,a.start_time,a.end_time,a.is_booked,ap.user_id as booked_by
            FROM availabilities a
            LEFT JOIN appointments ap ON a.availability_id = ap.availability_id AND ap."deletedAt" is null
            WHERE a.user_id IN (:userIds) AND a."deletedAt" IS NULL AND (ap.status IS NULL OR ap.status != :status OR a.is_booked =:is_booked) AND a.date > NOW()`,{
                replacements : {userIds,status : 'cancelled',is_booked : false},
                type : sequelize.QueryTypes.SELECT
            })
        const finalDoctors = doctors.map((doc) =>{
           const experience = getYearsDifference(doc.experience);
           const experienceString = `${experience[0]>=1 ? `${experience[0]} year and`:''} ${experience[1]} months`;

           const specializations = specialization.filter(spec => spec.user_id === doc.user_id).map(spec => spec.title);
           
           const availabilities =  availability.filter(avail => avail.user_id === doc.user_id).map(a => {
                
                const {availability_id,date,start_time,end_time,is_booked} = a;
                return {availability_id,date,start_time,end_time,is_booked,booked_by_me :  user_id === a.booked_by}})

           return {...doc,
            experience : experienceString,
            specializations,
            availabilities}
        })
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

const appointments = async (patient_id,pageNumber,appointmentsPerPage) => {
    const limit = appointmentsPerPage;
    const offset = (pageNumber-1)*appointmentsPerPage;
    try {
        const appointments = await sequelize.query(`Select ap.appointment_id,ap.status,a.user_id as doctor_id,a.date,a.start_time,a.end_time,u.name,u.email
            FROM appointments ap
            JOIN availabilities a ON ap.availability_id = a.availability_id
            JOIN users u ON a.user_id = u.user_id
            WHERE ap.user_id = :user_id AND ap."deletedAt" IS NULL
            ORDER BY a.date DESC
            LIMIT :limit OFFSET :offset
            `,{
            replacements : {user_id : patient_id,limit,offset},
            type : sequelize.QueryTypes.SELECT
        })
        if (appointments.length === 0) {
            return []
        }
        const doctorIds = appointments.map(ap => ap.doctor_id);

        const specialization = await sequelize.query(`Select ds.user_id,s.title
            FROM doctors_specializations ds
            JOIN specializations s on ds.specialization_id = s.specialization_id
            WHERE ds.user_id IN (:doctorIds)`,{
            replacements : {doctorIds},
            type : sequelize.QueryTypes.SELECT
        });
        const finalAppointments = appointments.map(ap => ({
            ...ap,
            specializations : specialization
                .filter(sp => sp.user_id === ap.doctor_id)
                .map(sp => sp.title)
        }))

        return finalAppointments;
    } catch (error) {
        throw error;
    }
}

const deleteAppointmentAndUpdateAvailability = async(appointment_id) =>{
    const transaction = await sequelize.transaction();
    try {
        const data = await sequelize.query(`UPDATE appointments set status=:status,"deletedAt"=NOW() WHERE appointment_id=:appointment_id RETURNING availability_id`,{
            replacements : {status : 'cancelled' , appointment_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction
        })
        const availability_id = data[0][0]?.availability_id;
        const updateAvailabilities = await sequelize.query(`UPDATE availabilities set is_booked=:is_booked,"updatedAt"=NOW() where availability_id=:availability_id`,{
            replacements : {is_booked : false , availability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction
        })
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const availabilitiesForUpdate = async (patient_id,doctor_id) => {
    try {
        const getAvailabilities = await sequelize.query(`SELECT a.availability_id,a.start_time,a.end_time,a.date,a.is_booked,ap.user_id
            from availabilities a
            left join appointments ap ON a.availability_id = ap.availability_id AND ap."deletedAt" is null
            WHERE a.user_id=:doctor_id and (ap.status is null OR ap.status!=:status OR a.is_booked=:is_booked) and a.date > NOW()`,{
            replacements : {doctor_id,status : 'cancelled',is_booked : false},
            type : sequelize.QueryTypes.SELECT
        })
        const availabilities = getAvailabilities.map(avail => ({...avail , booked_by_me : avail?.user_id == patient_id}));
        return availabilities;
    } catch (error) {
        throw error;
    }
}

const update = async (appointment_id,availability_id) => {
    const transaction = await sequelize.transaction();
    try {
        const oldAppointment  = await sequelize.query(`SELECT availability_id from appointments where appointment_id = :appointment_id`,{
            replacements : {appointment_id},
            type : sequelize.QueryTypes.SELECT
        });
        if (oldAppointment.length < 1) {
            return false;
        }
        const oldAvailability_id = oldAppointment[0].availability_id;
        const updateAppointment = await sequelize.query(`UPDATE appointments set availability_id = :availability_id,status=:status,"updatedAt" = NOW() where appointment_id = :appointment_id AND "deletedAt" IS NULL`,{
            replacements : {availability_id,status : 'scheduled',appointment_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction
        });
        const updateAvailability = await sequelize.query(`UPDATE availabilities set is_booked=:is_booked,"updatedAt" = NOW() where availability_id = :availability_id`,{
            replacements : {is_booked : true,availability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction
        });
        const updateOldAvailability = await sequelize.query(`UPDATE availabilities set is_booked=:is_booked,"updatedAt" = NOW() where availability_id=:oldAvailability_id`,{
            replacements : {is_booked : false,oldAvailability_id},
            type : sequelize.QueryTypes.UPDATE,
            transaction
        });
        transaction.commit();
        return true;
    } catch (error) {
        transaction.rollback();
        throw error;
    }
}

module.exports = {getDoctors,book,appointments,deleteAppointmentAndUpdateAvailability,availabilitiesForUpdate,update};