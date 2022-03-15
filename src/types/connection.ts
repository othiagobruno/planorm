export interface IConnection {
  db_connection: 'pg' | 'mysql' | 'sqlite3';
  connection: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  migartions: {
    tableName: string;
  };
}
