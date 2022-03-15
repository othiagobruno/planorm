import BaseModel from '../model/mode';
import { IColumnOptions } from '../types/model';

export const column = (options?: IColumnOptions) => {
  return function decorateAsColumn(target, property) {
    const Model = target.constructor as typeof BaseModel;
    Model.boot();
    Model.$addColumn(property, options);
  };
};
