const { JSONCookie } = require("cookie-parser");
const knex = require("../knex");

class Like {
  static async showLikes(id) {
    try {
      const result = await knex.raw(
        `
        SELECT likee_id, COUNT(*) AS likee_count
          FROM likes
          WHERE likee_id = ?
          GROUP BY likee_id;
        `,
        [id]
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async whoLiked(id) {
    try {
      const result = await knex.raw(
        `
        SELECT username FROM users
        JOIN likes ON users.id = likes.liker_id
        WHERE likes.likee_id = ?
      `,
        [id]
      );
      console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  static async create(liker_id, likee_id) {
    try {
      const createLike = await knex.raw(
        `
          INSERT INTO likes (liker_id, likee_id)
          SELECT ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM likes WHERE liker_id = ? AND likee_id = ?
          )
          returning *;
        `,
        [liker_id, likee_id, liker_id, likee_id]
      );
      return createLike.rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = Like;
