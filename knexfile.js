require("dotenv").config();
const path = require("path");

const migrationsDirectory = path.join(`${__dirname}/./src/db/migrations`);
const migrationsStub = path.join(`${__dirname}/./migration-stub`);

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST || "127.0.0.1",
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASS || "postgres",
      database: process.env.PG_DB || "lean-lifestyle",
    },
    migrations: {
      directory: migrationsDirectory,
      stub: migrationsStub,
    },
  },
  test: {
    client: "pg",
    connection: {
      host: process.env.PG_HOST || "127.0.0.1",
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASS || "postgres",
      database: process.env.database || "lean-lifestyle",
    },
  },
  production: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      directory: migrationsDirectory,
      stub: migrationsStub,
    },
  },
};
