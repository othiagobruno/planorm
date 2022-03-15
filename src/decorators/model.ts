import BaseModel from '../model/model';
import { IColumnOptions, IRelation } from '../types/model';

export const Column = (options?: IColumnOptions) => {
  return function decorator(target, property) {
    const Model = target.constructor as typeof BaseModel;
    Model.boot();
    Model.$addColumn(property, options);
  };
};

export const BeforeSave = () => {
  return function decorator(target, _property) {
    const _model = target.constructor as typeof BaseModel;
    console.log(_model);
    // add hook BeforeSave
  };
};

export const AfterSave = () => {
  return function decorator(target, _property) {
    const _model = target.constructor as typeof BaseModel;
    console.log(_model);
    // add hook AfterSave
  };
};

export const HasOne = (_modelRow, _options?: IRelation) => {
  return function decorator(target, _property) {
    const _model = target.constructor as typeof BaseModel;
    console.log(_model);
    // add relation HasOne
  };
};

export const OneToMany = (_modelRow, _options?: IRelation) => {
  return function decorator(target, _property) {
    const _model = target.constructor as typeof BaseModel;
    console.log(_model);
    // add relation OneToMany
  };
};

export const ManyToOne = (_modelRow, _options?: IRelation) => {
  return function decorator(target, _property) {
    const _model = target.constructor as typeof BaseModel;
    console.log(_model);
    // add relation ManyToOne
  };
};

export const BelongsTo = (_modelRow, _options?: IRelation) => {
  return function decorator(target, _property) {
    const _model = target.constructor as typeof BaseModel;
    console.log(_model);
    // add relation BelongsTo
  };
};

export const Table = (tableName: string) => {
  return (Model: any) => {
    Model.boot();
    Model.$setTableName(tableName);
    return Model;
  };
};
