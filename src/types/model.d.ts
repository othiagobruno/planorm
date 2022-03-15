export interface IColumnOptions {
  isPrimary?: boolean;
  columnName?: string;
  serializeAs?: string;
  name?: string;
}

export interface IRelation {
  id?: string;
  foreignKey?: string;
}
