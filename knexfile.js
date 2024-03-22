require('dotenv').config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.DB,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
  }
};
