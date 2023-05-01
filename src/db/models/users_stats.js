const knex = require("../knex");

class UserStats {
    static async create(user_id, height, weight, bmi, activity_level) {
        try{
            const query = "INSERT INTO user_stats (user_id, height, weight, bmi, activity_level) VALUES (?, ?, ?, ?, ?) RETURNING *";
            const { rows } = await knex.raw(query, [user_id, height, weight, bmi, activity_level]);
            return rows;
        }catch(error){
            console.log(error);
            return null;
        }
    }
}

module.exports = UserStats;