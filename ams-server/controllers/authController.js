const sequelize = require('../config/dbConfig.js');
const {hashPassword,comparePassword,generateToken ,getNotValidatedArray, checkPhoneNumber} = require('../services/authServices.js')
const {v4 : uuidv4} = require('uuid');

const signUpUser = async(req,res)=>{
    // console.log('idher')
    try {
        const {name , email , password,role,dob,phone} = req.body;
        const [existingUser] = await sequelize.query('SELECT * FROM "users" WHERE email = :email',{
            replacements :{email},
            type : sequelize.QueryTypes.SELECT
        });
        // console.log({name , email , password,role,dob,phone});
        // console.log(existingUser.user_id);
        if (existingUser) {
            return res.status(400).send({message : 'user already exists'})
        }
        if (!checkPhoneNumber(phone)) {
            return res.status(400).send({message : 'please provide correct phone number.'})
        }
        //now based on role we will be saving information
        const hashedPass = await hashPassword(password);
        const userId = uuidv4();
        const isValidated = true;
        let newUser;
        if(role == 'admin'){
            [newUser] = await sequelize.query('INSERT INTO users(user_id,name,email,password,dob,role,is_validated,"createdAt","updatedAt") VALUES(:user_id,:name,:email, :password,:dob,:role,:is_validated, NOW(), NOW()) RETURNING user_id',{
                replacements : {user_id:userId,name,email , password : hashedPass,dob,role,is_validated : isValidated},
                type : sequelize.QueryTypes.INSERT
            });//returns [rows , metadata]
            
        }
        else if(role == 'doctor'){
            const {specialization , experience} = req.body;
            if (!specialization || !experience) {
                return res.status(400).json({ message: 'Please provide complete information!' });
            }

            [newUser] = await sequelize.query('INSERT INTO users(user_id,name,email,password,dob,role,is_validated,"createdAt","updatedAt") VALUES(:user_id,:name,:email, :password,:dob,:role,:is_validated, NOW(), NOW()) RETURNING user_id',{
                replacements : {user_id:userId,name,email , password : hashedPass,dob,role,is_validated : isValidated},
                type : sequelize.QueryTypes.INSERT
            });//returns [rows , metadata]
            [newDoctor] = await sequelize.query('INSERT INTO doctors(user_id,experience,"createdAt","updatedAt") VALUES(:user_id,:experience, NOW(), NOW()) RETURNING user_id',{
                replacements : {user_id:userId,experience : req.body.experience},
                type : sequelize.QueryTypes.INSERT
            });//returns [rows , metadata]
            for (let i = 0; i < specialization.length; i++) {
                const id = uuidv4();
                const specializationId = specialization[i].value;
                const [newDoctorsSpecialization] = await sequelize.query('INSERT INTO doctors_specializations(id,user_id,specialization_id,"createdAt","updatedAt") VALUES(:id,:userId,:specializationId,NOW(),NOW()) RETURNING id' ,{
                    replacements : {id : id,userId : userId,specializationId : specializationId},
                    type : sequelize.QueryTypes.INSERT
                });
            }
            
        }
        else if(role == 'patient'){
            if (req.body.history) {
                [newUser] = await sequelize.query('INSERT INTO users(user_id,name,email,password,dob,role,is_validated,"createdAt","updatedAt") VALUES(:user_id,:name,:email, :password,:dob,:role,:is_validated, NOW(), NOW()) RETURNING user_id',{
                    replacements : {user_id:userId,name,email , password : hashedPass,dob,role,is_validated : isValidated},
                    type : sequelize.QueryTypes.INSERT
                });//returns [rows , metadata]
                const patientHistoryId = uuidv4();
                const [newPatient] = await sequelize.query('INSERT INTO patient_histories(patient_history_id,user_id,history,"createdAt","updatedAt") VALUES(:patient_history_id,:user_id,:history, NOW(), NOW()) RETURNING patient_history_id',{
                    replacements : {patient_history_id : patientHistoryId,user_id:userId,history : req.body.history},
                    type : sequelize.QueryTypes.INSERT
                });//returns [rows , metadata]
                
            }
            else{
                return res.status(400).send({message : 'please provide patient history'})
            }
        }
        const phoneId = uuidv4();
        const [newPhone] = await sequelize.query('INSERT INTO phones(phone_id,user_id,phone_number,"createdAt","updatedAt") VALUES(:phoneId,:userId,:phone,NOW(),NOW()) RETURNING phone_id', {
            replacements : {phoneId,userId,phone},
            type : sequelize.QueryTypes.INSERT
        })
        const token = generateToken({user_id : userId , name : name ,role : role})
        return res.status(201).send({user_id : userId  ,token : token,name : name,role :role })

    } catch (error) {
        res.status(500).send({ message : error.message });
    }
    }

const logInUser = async(req,res) =>{
        try {
            const {email,password} = req.body;
            const [user] = await sequelize.query('SELECT * FROM "users" WHERE email = :email',{
                replacements : {email},
                type : sequelize.QueryTypes.SELECT
            });
            if(!user){
                return res.status(401).send({message : 'Invalid Username'})
            };
            const isMatch =await comparePassword(password,user.password);
            if(!isMatch){
                return res.status(401).send({message : 'Invalid Password'})
            }
            let arr = await getNotValidatedArray();
            if (arr.includes(email)) {
                return res.status(400).send({message : 'You are not allowed the access the resources!'});
            }
            const token = generateToken({user_id : user.user_id , name : user.name ,role : user.role})
            res.status(202).json({token : token , user_id : user.user_id , name : user.name ,role : user.role});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        }
    
const getSpecializations = async(req,res)=>{
    try {
        const specializations = await sequelize.query('SELECT specialization_id,title from specializations',{
            type : sequelize.QueryTypes.SELECT
        })
        return res.status(200).send({specializations : specializations})
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const checkAuthorization = (req,res) =>{
    return res.status(200).send({check : true, user_id : req.user.user_id , name : req.user.name , role : req.user.role})
}

module.exports = {logInUser , signUpUser,getSpecializations,checkAuthorization};