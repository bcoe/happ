/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable('habits_daily', (table) => {
      table.uuid('habit_id');
      table.date('date');
      table.boolean('status').notNullable().defaultTo(false);
      table.foreign('habit_id').references('id').inTable('habits');
      table.primary(['habit_id', 'date']);
      table.unique('habit_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('habits_daily');
};
