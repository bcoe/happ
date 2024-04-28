/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable('habits_active_position', (table) => {
      table.increments('position');
      table.uuid('user_id').notNullable();
      table.uuid('prev_habit');
      table.uuid('next_habit');
      table.uuid('habit_id');
      table.foreign('habit_id').references('id').inTable('habits');
      table.foreign('prev_habit').references('id').inTable('habits');
      table.foreign('next_habit').references('id').inTable('habits');
      table.foreign('user_id').references('id').inTable('users');
      table.primary(['user_id', 'position']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('habits_active_position');
};
