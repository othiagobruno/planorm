import { Knex } from 'knex';

import { Injector } from '../decorators/inject';
import { Exception } from '../exceptions/Exception';
import { IColumnOptions } from '../types/model';

export default class BaseModel {
  /**
   * Primary Key
   */
  static primaryKey: string;

  /**
   * Booted BaseModel
   */
  static booted: boolean;

  /**
   * Table Columns
   */
  static $columns: Array<IColumnOptions> = [];

  /**
   * KNex Connection
   */
  private static connection?: Knex = Injector.get<Knex>('connection');

  /**
   * Table Name
   */
  static tableName: string;

  /**
   * Relations
   */
  static $relations: Map<string, any>;

  /**
   * Boot Load
   */
  static boot() {
    if (!this.hasOwnProperty('booted')) {
      this.booted = false;
    }
    if (this.booted === true) {
      return;
    }
    this.booted = true;
  }

  static $setTableName(tableName: string) {
    this.tableName = tableName;
  }

  static addRelation(model: any, type: string) {
    this.$relations[type] = model;
  }

  static $addColumn(name: string, options: IColumnOptions) {
    const column: IColumnOptions = {
      name: name,
      isPrimary: options?.isPrimary || false,
      columnName: options?.columnName || name,
      serializeAs: options?.serializeAs || name,
    };

    if (column.isPrimary) {
      this.primaryKey = name;
    }

    this.$columns.push(column);
    return column;
  }

  static query() {
    this.connection = Injector.get<Knex>('connection');
    return this.connection(this.tableName).select(
      this.$columns.map((a) => a.name),
    );
  }

  static async count(): Promise<number> {
    const countValue = await this.query().count('id as c');
    return countValue?.[String(0)]?.c;
  }

  static async create(obj: any): Promise<object> {
    if (obj === undefined) {
      throw new Exception('"create" expects a value. Received undefined');
    }
    const [id] = await this.query().insert(obj);
    const savedObj = await this.find(id);
    return savedObj;
  }

  public static async first() {
    return this.query().first();
  }

  public static async findBy(key: string, value: any) {
    if (value === undefined) {
      throw new Exception('"findByOrFail" expects a value. Received undefined');
    }
    return this.query().where(key, value).first();
  }

  public static async find(value: any) {
    if (value === undefined) {
      throw new Exception('"findOrFail" expects a value. Received undefined');
    }
    return this.findBy(this.primaryKey, value);
  }

  public static async all() {
    return this.query().orderBy(this.primaryKey, 'desc');
  }
}
