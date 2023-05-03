/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => {
    return knex.schema.createTable("likes", (table) => {
        table.increments("id").primary();
        table.integer("liker_id").notNullable();
        table.foreign('liker_id').references('id').inTable('users');
        table.integer("likee_id").notNullable();
        table.foreign('likee_id').references('id').inTable('users');
        table.timestamp("created_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
    return knex.schema.dropTable("likes");
};
