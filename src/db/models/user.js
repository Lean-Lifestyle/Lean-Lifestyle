const knex = require("../knex");
const authUtils = require("../../utils/auth-utils");

class User {
  #passwordHash = null;
  constructor({ id, username, password }) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password;
  }

  static async list() {
    try {
      const query = "SELECT * FROM users";
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

  static async create(
    username,
    password,
    email,
    first_name,
    last_name,
    gender,
    date_of_birth
  ) {
    try {
      const passwordHash = await authUtils.hashPassword(password);
      const query = `INSERT INTO users (username, password, email, first_name, last_name, gender, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`;
      const {
        rows: [user],
      } = await knex.raw(query, [
        username,
        passwordHash,
        email,
        first_name,
        last_name,
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

  update = async (username) => {
    // dynamic queries are easier if you add more properties
    try {
      const [updatedUser] = await knex("users")
        .where({ id: this.id })
        .update({ username })
        .returning("*");
      return updatedUser ? new User(updatedUser) : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  isValidPassword = async (password) =>
    await authUtils.isValidPassword(password, this.#passwordHash);
}

module.exports = User;
