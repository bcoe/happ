/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema.createTable('notes', (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
    table.uuid('user_id').notNullable();
    table.date('date').notNullable();
    table.text('note').notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.unique(['user_id', 'date']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('notes');
};
