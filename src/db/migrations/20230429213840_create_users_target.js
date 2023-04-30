/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('users_target', (table) => {
        table.integer('user_id').notNullable();
        table.foreign("user_id").references("id").inTable("users");
        table.float('target_weight').notNullable();
        table.float('target_height').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable('users_target');
};