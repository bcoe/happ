/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(knex.fn.uuid());
      table.string('email', 1024).notNullable();
      table.string('account_type', 64).notNullable();
      table.unique(['email', 'account_type'], {
        indexName: 'email_account_type_idx',
        useConstraint: true,
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
  return knex.schema.dropTable('users');
};
