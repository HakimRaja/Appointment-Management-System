const {v4 : uuidv4} = require('uuid');
const sequelize = require("../../config/dbConfig");

const addContentToSpecialization = async() =>{
    const medicalSpecializations = [
        "Allergy and Immunology",
        "Anesthesiology",
        "Cardiology",
        "Cardiothoracic Surgery",
        "Colon and Rectal Surgery",
        "Dermatology",
        "Emergency Medicine",
        "Endocrinology, Diabetes & Metabolism",
        "Family Medicine",
        "Gastroenterology",
        "General Surgery",
        "Geriatric Medicine",
        "Hematology",
        "Infectious Disease",
        "Internal Medicine",
        "Nephrology",
        "Neurology",
        "Neurosurgery",
        "Nuclear Medicine",
        "Obstetrics and Gynecology (OB/GYN)",
        "Oncology",
        "Ophthalmology",
        "Orthopedic Surgery",
        "Otolaryngology (ENT)",
        "Pathology",
        "Pediatrics",
        "Physical Medicine and Rehabilitation (Physiatry)",
        "Plastic Surgery",
        "Preventive Medicine",
        "Psychiatry",
        "Pulmonology",
        "Radiation Oncology",
        "Radiology (Diagnostic)",
        "Rheumatology",
        "Sleep Medicine",
        "Sports Medicine",
        "Urology",
        "Vascular Surgery",
    ];
    try {
        for (let index = 0; index < medicalSpecializations.length; index++) {
            const specializationId = uuidv4(); 
            const element = medicalSpecializations[index];
            const [specialization] = await sequelize.query('INSERT INTO specializations(specialization_id,title,"createdAt","updatedAt") VALUES(:specializationId,:title,NOW(),NOW()) RETURNING specialization_id',{
                replacements : {specializationId,title : element},
                type : sequelize.QueryTypes.INSERT
            })
        }
        console.log('done'); 
    } catch (error) {
        console.log(error);
    }

}

module.exports = addContentToSpecialization;