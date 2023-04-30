const knex = require("../knex");

class UserStats {
    // constructor({ user_id, height, weight}) {
        
    // }
    static async create(user_id, height, weight, bmi) {
        try{
            const query = "INSERT INTO user_stats (user_id, height, weight, bmi) VALUES (?, ?, ?, ?) RETURNING *";
            const { rows } = await knex.raw(query, [user_id, height, weight, bmi]);
            return rows;
        }catch(error){
            console.log(error);
            return null;
        }
    }
}

module.exports = UserStats;