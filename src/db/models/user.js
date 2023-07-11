const knex = require("../knex");
const authUtils = require("../../utils/auth-utils");

class User {
  #passwordHash = null;
  constructor({ id, username, password, height, weight, bmi, activity_level }) {
    this.id = id;
    this.username = username;
    this.height = height;
    this.weight = weight;
    this.bmi = bmi;
    this.activity_level = activity_level;
    
    this.#passwordHash = password;
  }
  static async list() {
    try {
      const query = `SELECT users.id, users.username, user_stats.height, user_stats.weight, user_stats.bmi, user_stats.activity_level FROM users JOIN user_stats on users.id = user_stats.user_id`;
      const { rows } = await knex.raw(query);
      return rows.map((user) => new User(user));
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async find(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const {
        rows: [user],
      } = await knex.raw(query, [id]);
      return user ? new User(user) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async findByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username = ?";
      const {
        rows: [user],
      } = await knex.raw(query, [username]);
      return user ? new User(user) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const {
        rows: [user],
      } = await knex.raw(query, [email]);
      return user ? new User(user) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  static async create(username, password, email, gender, date_of_birth) {
    try {
      const passwordHash = await authUtils.hashPassword(password);
      const query = `INSERT INTO users (username, password, email, gender, date_of_birth)
        VALUES (?, ?, ?, ?, ?) RETURNING *`;
      const {
        rows: [user],
      } = await knex.raw(query, [
        username,
        passwordHash,
        email,
        gender,
        date_of_birth,
      ]);
      return new User(user);
    } catch (err) {
      console.error(err);
      return null;
    }
  }


  
  static async deleteAll() {
    try {
      return knex.raw("TRUNCATE users;");
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  updateWeight = async (weight) => {
    try {
      const getHeight = await knex.raw(
        `
          SELECT height FROM user_stats
          WHERE user_id = ?
        `,
        [this.id]
      );
      const height = getHeight.rows[0].height;
      const bmi = (weight / (height / 100) ** 2).toFixed(3);
      const [update] = await knex("user_stats")
        .update({
          weight,
          bmi,
        })
        .where({ user_id: this.id })
        .returning("*");
      await knex.raw(
        `
        INSERT INTO users_progress (user_id, weight, bmi)
        VALUES (?, ?, ?)
      `,
        [this.id, weight, bmi]
      );
      return update;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static userProgress = async (id) => {
    try {
      const result = await knex.raw(
        `
        SELECT a.id, a.created_at as "joined", a.username, a.gender, a.date_of_birth, p.weight as "changed_weight", p.created_at as "time", u.weight, u.height, u.bmi, u.activity_level, t.target_weight
        FROM users_progress p
        JOIN user_stats u ON u.user_id = p.user_id
        JOIN users a ON a.id = p.user_id
        JOIN users_target t ON t.user_id = p.user_id
        WHERE p.user_id = ?;
      `,
        [id]
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static async uploadImage(id, image) {
    try {
      const result = await knex.raw(
        `
        INSERT INTO user_images (user_id, image_link)
        VALUES (?, ?)
        ON CONFLICT (user_id) DO UPDATE
          SET image_link = EXCLUDED.image_link;
        `,
        [id, image]
      );

      return result.rows;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async sendImage(id) {
    try {
      const result = await knex.raw(
        `
        SELECT image_link FROM user_images
        WHERE user_id = ?
        `,
        [id]
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }

  isValidPassword = async (password) =>
    await authUtils.isValidPassword(password, this.#passwordHash);
}

module.exports = User;
