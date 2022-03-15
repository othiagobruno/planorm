import 'dotenv/config';

export const databaseConfig = {
  client: process.env.DB_CONNECTION,
  connection: {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB_NAME,
  },
};
