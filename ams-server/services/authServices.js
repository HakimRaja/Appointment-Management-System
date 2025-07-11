const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/dbConfig');


const hashPassword =async (pass) =>{
    return await bcrypt.hash(pass,10);
};

const comparePassword = async (pass,hashedPass) =>{
    return await bcrypt.compare(pass,hashedPass);
}

const generateToken = (payload) =>{
    return jwt.sign(payload,process.env.JWT_SECRET_KEY , {expiresIn : '1h'});
}

const getNotValidatedArray =async () =>{
    try {
        const users = await sequelize.query(
          'SELECT * FROM "users" WHERE is_validated = :isValidated',
          {
            replacements: { isValidated: false },
            type: sequelize.QueryTypes.SELECT,
          }
        );
    
        return users.map(user => user.email); // returns array of usernames
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
        return []; // return empty list on failure
      }
}

module.exports = {hashPassword , comparePassword , generateToken, getNotValidatedArray};