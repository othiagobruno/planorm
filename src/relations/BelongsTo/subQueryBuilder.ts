import { Knex } from 'knex';

export class BelongsToSubQueryBuilder {
  protected appliedConstraints = false;
  knexQuery;
  client;

  constructor(builder: Knex.QueryBuilder, client: any, private relation: any) {
    this.knexQuery = builder;
    this.client = client;
  }

  /**
   * The keys for constructing the join query
   */
  protected getRelationKeys(): string[] {
    return [this.relation.foreignKey];
  }

  /**
   * Clones the current query
   */
  public clone() {
    const clonedQuery = new BelongsToSubQueryBuilder(
      this.knexQuery.clone(),
      this.client,
      this.relation,
    );

    this.applyQueryFlags(clonedQuery);

    clonedQuery.appliedConstraints = this.appliedConstraints;
    clonedQuery.debug(this.debugQueries);
    clonedQuery.reporterData(this.customReporterData);

    return clonedQuery;
  }

  /**
   * Applies constraint to limit rows to the current relationship
   * only.
   */
  protected applyConstraints() {
    if (this.appliedConstraints) {
      return;
    }

    this.appliedConstraints = true;

    const relatedTable = this.relation.relatedModel().table;
    const localTable = this.relation.model.table;
    let tablePrefix = relatedTable;

    /**
     * In case of self joins, we must alias the table selection
     */
    if (relatedTable === localTable) {
      this.knexQuery.from(`${relatedTable} as ${this.selfJoinAlias}`);
      tablePrefix = this.selfJoinAlias;
    }

    this.wrapExisting().where(
      `${tablePrefix}.${this.relation.localKeyColumName}`,
      this.client.ref(`${localTable}.${this.relation.foreignKeyColumName}`),
    );
  }
}
