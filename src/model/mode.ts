import { Knex } from 'knex';
import { head } from 'lodash';
import { BelongsTo } from '../relations/BelongsTo';
import { IColumnOptions } from '../types/model';

export default class BaseModel {
  public static primaryKey: string;
  public static booted: boolean;
  public static $columns: Array<IColumnOptions> = [];
  public static $relationsDefinitions: Map<string, any>;
  private connection?: Knex;
  private table: string;
  public static $adapter: any;
  idAttribute?: string;

  public static boot() {
    if (!this.hasOwnProperty('booted')) {
      this.booted = false;
    }
    if (this.booted === true) {
      return;
    }
    this.booted = true;
  }

  getClient() {
    return this.connection.select(this.table);
  }

  public static $addColumn(name: string, options: IColumnOptions) {
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

  public static $addRelation(
    name: string,
    type: any,
    relatedModel: () => any,
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

  protected static $addBelongsTo(
    name: string,
    relatedModel: () => any,
    options: any,
  ) {
    this.$relationsDefinitions.set(
      name,
      new BelongsTo(name, relatedModel, options, this),
    );
  }

  async count(column = '*'): Promise<number> {
    const client = this.getClient();
    const countValue = await client.count(`${column} as c`);
    return countValue[0].c;
  }

  async findById(id: number | string): Promise<object> {
    const where = {};
    const client = this.getClient();
    where[this.idAttribute] = id;
    return await client.where(where).then(head);
  }

  async insert(obj: any): Promise<object> {
    const client = this.getClient();
    const [id] = await client.insert(obj);
    const savedObj = await this.findById(id);

    return savedObj;
  }
}
