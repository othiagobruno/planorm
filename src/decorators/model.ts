import BaseModel from '../model/mode';
import { IColumnOptions } from '../types/model';

export const Column = (options?: IColumnOptions) => {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor as typeof BaseModel;
    Model.boot();
    Model.$addColumn(property, options);
  };
};

export const Table = (tableName: string) => {
  return (Model: any) => {
    Model.boot();
    Model.$setTableName(tableName);
    return Model;
  };
};
