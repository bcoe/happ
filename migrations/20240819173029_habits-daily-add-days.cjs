exports.up = function(knex) {
  return knex.schema
    .table('habits_daily', (table) => {
      table.json('days');
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('habits_daily', (table) => {
      table.dropColumn('days');
    });
};
