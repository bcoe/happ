/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
    return knex.schema
      .createTable('daily_habit_metrics', (table) => {
        table.date('date');
        table.integer('habits_completed').notNullable();
        table.integer('total_habits_for_day').notNullable();
        table.uuid('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.unique(['user_id', 'date']);
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = function (knex) {
    return knex.schema.dropTable('daily_habit_metrics');
  };
  