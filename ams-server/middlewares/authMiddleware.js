const validator = require("validator");
const jwt = require('jsonwebtoken');
const { getNotValidatedArray } = require("../services/authServices");

const checkSignUpBodyMiddleWare = (req,res,next) =>{
    try {
        const {name , email , password,role,dob,phone} = req.body;
        if (!req.body || !name || !email || !password || !role || !dob ||!phone) {
            return res.status(400).send('Please provide complete details')
        }
        if(!validator.isEmail(email))
            return res.status(400).json({message : "Valid Email required!"});
        if(!(password.length > 7))
            return res.status(400).json({message : "Strong Password required!"});
        if (!['admin', 'doctor', 'patient'].includes(req.body.role)) {
            return res.status(400).send("Invalid role");
          }
        next();
    } catch (error) {
        return res.status(400).send({message : 'Please provide complete details'})
    }
    
}
const checkLogInBodyMiddleWare = (req,res,next) =>{
    try {
        const {email , password} = req.body;
        if (!req.body ||!email || !password ) {
            return res.status(400).send('Please provide complete details')
        }
        if(!validator.isEmail(email))
            return res.status(400).json("Valid Email required!");
        // if(!(password.length > 7))
        //     return res.status(400).json("Strong Password required!");
        next();
    } catch (error) {
        return res.status(400).send({message :'Please provide complete details'})
    }
    
}
const verify =async (req,res,next) =>{
    const authHeader  = req.headers.authorization;
    // console.log(authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).send({message : 'token missing or malformed'}); // unauthorized
    }
    const token = authHeader.split(" ")[1]
    // console.log(token);
    // console.log(process.env.JWT_SECRET_KEY);
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(data);
        const arr = await getNotValidatedArray();
        // console.log(arr);
        if(arr.includes(data.email)){
            return res.status(400).send({message : 'Your token has been revoked!'});
        }
        // console.log('working fine')
        req.user = data;
        next();
    } catch (error) {
        return res.status(403).send({message : 'Invalid or expired token'});
    }
}

module.exports = {checkSignUpBodyMiddleWare , checkLogInBodyMiddleWare ,verify}