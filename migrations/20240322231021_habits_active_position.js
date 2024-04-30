/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable('habits_active_position', (table) => {
      table.specificType('sorted_habit_ids', 'uuid ARRAY')
      table.uuid('user_id').notNullable();
      table.primary(['user_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('habits_active_position');
};
