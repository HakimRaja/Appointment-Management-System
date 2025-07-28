const {get, insert, deleteSlot, cancelAndDelete, patient, complete} = require('../services/doctorDashboard')

const getAvailabilities = async (req,res) => {
    const doctors_user_id = req?.user?.user_id;
    if (!doctors_user_id) {
        return res.status(400).send({message : 'Doctors Id is missing.'})
    }
    try {
        const availabilities = await get(doctors_user_id);
        return res.status(200).send({availabilities});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message});
    }
};

const addAvailability = async (req,res) => {
    const {selectedSlots,selectedDate} = req.body.payload;
    const user_id = req.user.user_id;
    if (!selectedSlots || !selectedDate) {
        return res.status(400).send({message : 'timeslots and date are required'});
    }
    try {
        const inserions = await insert(selectedSlots,selectedDate,user_id);
        return res.status(200).send({message : 'Success'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message});
    }
}

const deleteAvailability = async (req,res) => {
    const {availability_id} = req.params;
    if (!availability_id) {
        return res.status(400).send({message : 'availability_id is missing.'});
    }
    try {
     const del = await deleteSlot(availability_id);
     if (!del) {
        return res.status(400).send({message : `Appointment is booked with this Slot.`})
     }     
     return res.status(200).send({message : 'Success'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : error.message});
    }
}

const cancelAppointmentAndRemoveAvailability = async (req,res) => {
    const {availability_id} = req.params;
    if (!availability_id) {
        return res.status(400).send({message : 'availability_id is missing.'});
    }
    try {
        const result = await cancelAndDelete(availability_id);
        return res.status(200).send({message : 'Success'})
    } catch (error) {
        console.log(error);
        return res.status(500).send({error:error.message});
    }
}

const patientDetails = async (req,res) => {
    const {patient_id} = req.params;
    if (!patient_id) {
        return res.status(400).send({message : 'patient_id is missing.'})
    }
    try {
        const patientDetails = await patient(patient_id);
        return res.status(200).send({patientDetails})
    } catch (error) {
        console.log(error);
        return res.status(500).send({message : error.message});
    }
}

const addAppointmentToComplete = async (req,res) => {
    const {availability_id} = req.params;
    if (!availability_id) {
        return res.status(400).send({message : 'Availability_id is missing .'})
    }
    try {
        const result = await complete(availability_id);
        return res.status(200).send({message : 'Success'});
    } catch (error) {
        return res.status(500).send({message : error.message});
    }
}

module.exports = {getAvailabilities,addAvailability,deleteAvailability,cancelAppointmentAndRemoveAvailability,patientDetails,addAppointmentToComplete};