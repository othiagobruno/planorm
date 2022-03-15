import { ensureRelationIsBooted, getValue } from '../../utils';

export class BelongsTo {
  public readonly type = 'belongsTo';
  public booted = false;

  public serializeAs =
    this.options.serializeAs === undefined
      ? this.relationName
      : this.options.serializeAs;

  public foreignKey: string;
  public foreignKeyColumName: string;

  public localKey: string;
  public localKeyColumName: string;

  public onQueryHook = this.options.onQuery;

  constructor(
    public relationName: string,
    public relatedModel: () => any,
    private options: any,
    public model: any,
  ) {}

  private isRelatedRow(parent: any, related: any) {
    return (
      related[this.localKey] !== undefined &&
      parent[this.foreignKey] === related[this.localKey]
    );
  }

  public setRelated(parent: any, related: any): void {
    ensureRelationIsBooted(this);
    if (related === undefined) {
      return;
    }
    parent.$setRelated(this.relationName, related);
  }

  public client(parent: any, client: any): any {
    ensureRelationIsBooted(this);
    console.log(parent, client);
  }

  public hydrateForPersistance(parent: any, related: any) {
    parent[this.foreignKey] = getValue(
      related,
      this.localKey,
      this,
      'associate',
    );
  }
}
