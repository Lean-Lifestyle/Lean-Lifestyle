/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_stats').insert([
    {
      user_id: 18,
      height: 162,
      weight: 60,
      BMI: 22.9
    }
  ]);
};
