const knex = require("../knex");

class UserStats {
  static async create(user_id, height, weight, bmi, activity_level) {
    try {
      const query = `
        INSERT INTO user_stats (user_id, height, weight, bmi, activity_level) 
         VALUES (?, ?, ?, ?, ?) 
        RETURNING *`;
      const { rows } = await knex.raw(query, [
        user_id,
        height,
        weight,
        bmi,
        activity_level,
      ]);

      await knex.raw(
        `
        INSERT INTO users_progress (user_id, weight, bmi)
        VALUES (?, ?, ?)
      `,
        [user_id, weight, bmi]
      );
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getUserStats(user_id) {
    try {
      const query = `SELECT * FROM user_stats WHERE user_id = ?`;
      const { rows } = await knex.raw(query, [user_id]);
      return rows[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async createUserTarget(user_id, target_weight, target_duration) {
    try {
      const targetEndDate = new Date();
      targetEndDate.setDate(targetEndDate.getDate() + target_duration);
      const { rows } = await knex.raw(
        `
      INSERT INTO users_target (user_id, target_weight, target_duration, target_end_date)
      VALUES (?, ?, ?, ?) 
      RETURNING *;
      `,
        [user_id, target_weight, target_duration, targetEndDate]
      );
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

// const main = async () => {
//   const user_stats = await UserStats.getUserStats(1);
//   console.log(user_stats);
// }
// main();

module.exports = UserStats;
