const knex = require('../knex');

class Like{
    static async list(id){
        try{
            const result = await knex.raw(`
            SELECT liker_id, likee_id, COUNT(*) AS likee_count
            FROM likes
            WHERE likee_id =?
            GROUP BY liker_id, likee_id;`, [id]);
            console.log(result.rows);
            return result.rows;
        }catch(err){
            console.error(err);
            return null;
        }
    }
    static async create(liker_id, likee_id){
        try{
            const result = await knex.raw(`
            INSERT INTO likes (liker_id, likee_id)
            SELECT ?, ?
            WHERE NOT EXISTS (
              SELECT 1 FROM likes WHERE liker_id = ? AND likee_id = ?
            )
            RETURNING *;
            `, [liker_id, likee_id, liker_id, likee_id]);
            return result.rows[0];
        }catch(error){
            console.log(error)
            return null;
        }
    }
}

// const we = Like.create(1, 3);
// console.log(we.then((x) => console.log(x)));


module.exports = Like;