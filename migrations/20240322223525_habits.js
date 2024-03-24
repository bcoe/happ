/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('habits', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
      table.uuid('user_id').notNullable();
      table.string('name', 1024).notNullable();
      table.boolean('active').notNullable().defaultTo(true);
      table.foreign('user_id').references('id').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('habits');
};
