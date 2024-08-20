exports.up = function(knex) {
  return knex.schema
    .table('users', (table) => {
      table.string('access_token', 2048);
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('users', (table) => {
      table.dropColumn('access_token');
    });
};
