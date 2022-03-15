export class BelongsToQueryClient {
  constructor(public relation: any, private parent: any, private client: any) {}

  public static query(client: any, relation: any, rows: any) {
    const query = new BelongsToQueryBuilder(
      client.knexQuery(),
      client,
      rows,
      relation,
    );

    typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
    return query;
  }

  public static eagerQuery(client: any, relation: any, rows: any) {
    const query = new BelongsToQueryBuilder(
      client.knexQuery(),
      client,
      rows,
      relation,
    );

    query.isRelatedPreloadQuery = true;
    typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
    return query;
  }

  public static subQuery(client: any, relation: any) {
    const query = new BelongsToSubQueryBuilder(
      client.knexQuery(),
      client,
      relation,
    );

    typeof relation.onQueryHook === 'function' && relation.onQueryHook(query);
    return query;
  }

  public query(): any {
    return BelongsToQueryClient.query(this.client, this.relation, this.parent);
  }

  public async associate(related: any) {
    await managedTransaction(this.parent.$trx || this.client, async (trx) => {
      related.$trx = trx;
      await related.save();

      this.relation.hydrateForPersistance(this.parent, related);
      this.parent.$trx = trx;
      await this.parent.save();
    });
  }

  public async dissociate() {
    this.parent[this.relation.foreignKey] = null;
    await this.parent.save();
  }
}
