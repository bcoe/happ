/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable('habits_daily', (table) => {
      table.uuid('habit_id');
      table.date('date');
      table.string('name', 1024).notNullable();
      table.boolean('status').notNullable().defaultTo(false);
      table.uuid('user_id').notNullable();

      table.primary(['habit_id', 'date']);
      table.unique('habit_id');
      table.foreign('habit_id').references('id').inTable('habits');
      table.foreign('user_id').references('id').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('habits_daily');
};
