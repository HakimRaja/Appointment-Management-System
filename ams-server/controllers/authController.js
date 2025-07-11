const sequelize = require('../config/dbConfig.js');
const {hashPassword,comparePassword,generateToken ,getNotValidatedArray} = require('../services/authServices.js')
const {v4 : uuidv4} = require('uuid');

const signUpUser = async(req,res)=>{
    try {
        const {name , email , password,role,dob} = req.body;
        const [existingUser] = await sequelize.query('SELECT * FROM "users" WHERE email = :email',{
            replacements :{email},
            type : sequelize.QueryTypes.SELECT
        });
        // console.log(existingUser.user_id);
        if (existingUser) {
            return res.status(400).send({message : 'user already exists'})
        }
        const hashedPass = await hashPassword(password);
        const userId = uuidv4();
        const isValidated = false;
        const [newUser] = await sequelize.query('INSERT INTO users(user_id,name,email,password,dob,role,is_validated,"createdAt","updatedAt") VALUES(:user_id,:name,:email, :password,:dob,:role,:is_validated, NOW(), NOW()) RETURNING user_id',{
            replacements : {user_id:userId,name,email , password : hashedPass,dob,role,is_validated : isValidated},
            type : sequelize.QueryTypes.INSERT
        });//returns [rows , metadata]
        return res.status(201).send({message : `user Created with user_id : ${newUser[0].user_id}`})
    } catch (error) {
        res.status(500).json({ error: error.message });
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
            const token = generateToken({user_id : user.user_id , email : user.email ,role : user.role})
            res.status(202).json({token : token});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        }
        
module.exports = {logInUser , signUpUser};