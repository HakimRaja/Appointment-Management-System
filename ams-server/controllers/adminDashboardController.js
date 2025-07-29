const sequelize = require("../config/dbConfig");
const { getUsers } = require("../services/adminDashboard");
const { getNotValidatedArray } = require("../services/authServices")

const getAllUsers = async (req,res) => {
    const admin_id = req.user.user_id;
    try {
        const users = await getUsers(admin_id);
        return res.status(200).send({users});
    } catch (error) {
        return res.status(500).send({error : error?.message});
    }
}

const getNonValidatedUsers = async(req,res) =>{
    try {
        const arr = await getNotValidatedArray();
        return res.status(200).json(arr);
    } catch (error) {
        return res.status(500).send({error : error.message})
    }
}

const addNonValidatedUser = async(req,res) =>{
    try {
        const user_email = req.body.emailofuser;
        const arr = await getNotValidatedArray();
        if(arr.includes(user_email)){
            return res.status(400).send({message : 'User is already not validated!'});
        }
        const updateUser = await sequelize.query('UPDATE users set is_validated=:value,updatedAt=NOW() WHERE email=:email',{
            replacements : {value : false , email : user_email},
            type : sequelize.QueryTypes.UPDATE
        });
        res.status(202).send({invalidate_users : arr.push(user_email)});
    } catch (error) {
        res.status(400).send({message : error.message});
    }
}
const RemoveNonValidatedUser = async(req,res) =>{
    try {
        const user_email = req.body.emailofuser;
        const arr = await getNotValidatedArray();
        if(!arr.includes(user_email)){
            return res.status(400).send({message : 'User is already validated!'});
        }
        const updateUser = await sequelize.query('UPDATE users set is_validated=:value,updatedAt=NOW() WHERE email=:email',{
            replacements : {value : true , email : user_email},
            type : sequelize.QueryTypes.UPDATE
        });
        res.status(202).send({invalidate_users : arr.push(arr.splice(arr.indexOf(user_email),1))});
    } catch (error) {
        res.status(400).send({message : error.message});
    }
}

module.exports = {addNonValidatedUser , getNonValidatedUsers ,RemoveNonValidatedUser,getAllUsers}