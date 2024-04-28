import knex from 'knex';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const isDevEnvironment = process.env.NODE_ENV === 'development';

export default function getDB() {
  const knexConnectionSettings = {
    connectionString: process.env.PG_CONNECTION_STRING ?? process.env.DATABASE_URL,
  };
  if (!(isTestEnvironment || isDevEnvironment)) {
    knexConnectionSettings.ssl = { rejectUnauthorized: false };
  }
  return knex({
    client: 'pg',
    connection: knexConnectionSettings,
  });
}
