import knex, { Knex } from 'knex';
import { IConnection } from '../types/connection';

export class PlanoOrm {
  private conn: Knex;

  constructor(config: IConnection) {
    this.conn = knex(config);
  }

  get() {
    return this.conn;
  }
}
