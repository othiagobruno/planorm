import { Knex } from 'knex';

import { Injector } from '../decorators/inject';
import { BelongsTo } from '../relations/BelongsTo';
import { IColumnOptions } from '../types/model';

export default class BaseModel {
  // Primary Key
  static primaryKey: string;

  // Booted BaseModel
  static booted: boolean;

  // Table Column
  static $columns: Array<IColumnOptions> = [];

  // KNex Connection
  private static connection?: Knex = Injector.get<Knex>('connection');

  // Table Name
  static tableName: string;

  // Relations
  static $relations: Map<string, any>;

  static boot() {
    if (!this.hasOwnProperty('booted')) {
      this.booted = false;
    }
    if (this.booted === true) {
      return;
    }
    this.booted = true;
  }

  static query() {
    this.connection = Injector.get<Knex>('connection');
    return this.connection.queryBuilder().from(this.tableName);
  }

  static $setTableName(tableName: string) {
    this.tableName = tableName;
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

  static $addRelation(
    name: string,
    type: any,
    relatedModel: () => BaseModel,
    options: any,
  ) {
    switch (type) {
      // case 'hasOne':
      //   this.$addHasOne(name, relatedModel, options);
      //   break;
      // case 'hasMany':
      //   this.$addHasMany(name, relatedModel, options);
      //   break;
      case 'belongsTo':
        this.$addBelongsTo(name, relatedModel, options);
        break;
      // case 'manyToMany':
      //   this.$addManyToMany(name, relatedModel, options as any);
      //   break;
      // case 'hasManyThrough':
      //   this.$addHasManyThrough(name, relatedModel, options as any);
      //   break;
      default:
        throw new Error(`${type} is not a supported relation type`);
    }
  }

  static $addBelongsTo(name: string, relatedModel: () => any, options: any) {
    this.$relations.set(name, new BelongsTo(name, relatedModel, options, this));
  }

  static async count(): Promise<number> {
    const countValue = await this.query().count('id as c');
    return countValue?.[String(0)]?.c;
  }

  static findById(id: number | string) {
    return this.query().where({ [this.primaryKey]: id });
  }

  static async insert(obj: any): Promise<object> {
    const [id] = await this.query().insert(obj);
    const savedObj = await this.findById(id);
    return savedObj;
  }
}
