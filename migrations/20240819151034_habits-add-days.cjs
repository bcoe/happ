
exports.up = function(knex) {
  return knex.schema
    .table('habits', (table) => {
      table.json('days');
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('habits', (table) => {
      table.dropColumn('days');
    });
};
