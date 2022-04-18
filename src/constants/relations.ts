export type ModelRelationTypes = {
  readonly __opaque_type: 'hasOne' | 'hasMany' | 'belongsTo' | 'manyToMany';
};

export enum Relations {
  belongsTo = 'belongsTo',
  hasOne = 'hasOne',
  hasMany = 'hasMany',
  manyToMany = 'manyToMany',
}
