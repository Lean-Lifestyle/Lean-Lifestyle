/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable('user_stats', (table) => {
        table.integer('user_id').notNullable().unique();
        table.foreign("user_id").references("id").inTable("users");
        table.float('height').notNullable();
        table.float('weight').notNullable();
        table.float('bmi').notNullable();
        table.string('activity_level').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable('user_stats');
};
