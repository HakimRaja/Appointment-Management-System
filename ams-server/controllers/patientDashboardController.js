const sequelize = require("../config/dbConfig");
const { getDoctors, book, appointments, deleteAppointmentAndUpdateAvailability, availabilitiesForUpdate, update } = require("../services/patientDashboard");

const getDoctorsList = async (req,res) => {
    const user_id = req.user.user_id;
    try {
        const finalDoctors = await getDoctors(user_id);
        if (!finalDoctors) {
            return res.status(200).send({check : false});
        }
        res.status(200).send({finalDoctors});
    } catch (error) {
        res.status(500).send({error : error.message})
    }
}

const bookAppointment = async(req,res) =>{
    if (!req.body.availability_id) {
        return res.status(400).send({message : 'Please provide availability id!'})
    }
    const user_id = req.user.user_id;
    const availability_id = req.body.availability_id;
   
    try {
        const booking = await book(availability_id,user_id)
        if (!booking) {
            return res.status(400).send({message : 'This Slot is already Booked!'});
        }
        
        return res.status(200).send({message : 'Appointment created successfully'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message})
    }
}

const getAppointments = async(req,res) =>{
    try {
        const patient_id = req.params.id;
        const finalAppointments = await appointments(patient_id);
        if (!finalAppointments) {
            return res.status(200).send(false);
        }

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
    try {
        const data = await deleteAppointmentAndUpdateAvailability(appointment_id);
        res.status(200).send(true);
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message})
    }
};

const getAvailabilitiesForUpdate = async(req,res)=>{
    const patient_id = req.user.user_id;
    const {doctor_id} = req.params;
    if (!doctor_id) {
        return res.status(400).send({message:'DoctorId is missing.'})
    }
    try {
        const availabilities = await availabilitiesForUpdate(patient_id,doctor_id);
        return res.status(200).send({availabilities})
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message})
    }
}

const updateAppointments = async (req,res) => {
    const {appointment_id} = req.params;
    const {availability_id} = req.body;
    if (!appointment_id || ! availability_id) {
        return res.status(400).send({message : 'appointment_id and availability_id are missing.'});
    }

    try {
        const callUpdate  = await update(appointment_id,availability_id);
        if (!callUpdate) {
            return res.status(400).send({message : 'appointment_id is not valid'});
        }
        
        return res.status(200).send(true);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({error : error.message})
    }
}

module.exports = {getDoctorsList,bookAppointment,getAppointments,deleteAppointment,getAvailabilitiesForUpdate,updateAppointments};
