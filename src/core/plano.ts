import knex, { Knex } from 'knex';
import { Injector } from '../decorators/inject';

import { IConnection } from '../types/connection';

export class PlanoOrm {
  private conn: Knex;
  static booted = false;

  public static boot() {
    if (!this.hasOwnProperty('booted')) {
      this.booted = false;
    }
    if (this.booted === true) {
      return;
    }
    this.booted = true;
  }

  create(config: IConnection) {
    this.conn = knex(config);
    Injector.register('connection', this.conn);
    return this.conn;
  }
}
