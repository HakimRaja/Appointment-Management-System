const sequelize = require("../config/dbConfig");

const getUsers = async (admin_id) => {
    try {
        const users = await sequelize.query(`SELECT u.user_id,u.name,u.email,p.phone_number,u.role,u.is_validated
            FROM users u
            LEFT JOIN phones p ON u.user_id = p.user_id
            WHERE user_id != :admin_id`,{
            replacements : {admin_id},
            type : sequelize.QueryTypes.SELECT
        });
        return users;
    } catch (error) {
        throw error;
    }
}

module.exports = {getUsers};