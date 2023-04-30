/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('users_progress', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.foreign("user_id").references("id").inTable("users");
        table.float('weight').notNullable();
        table.float('bmi').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable('users_progress');
};