/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('habits_active_position', (table) => {
      table.uuid('habit_id');
      table.uuid('user_id').notNullable();
      table.integer('position').unsigned();
      table.primary(['user_id', 'position']);
      table.foreign('habit_id').references('id').inTable('habits');
      table.foreign('user_id').references('id').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('habits_active_position');
};
