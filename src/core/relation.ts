import { underscore } from 'inflection';
import RelationType from './enums/relation-type';
import { RelationError } from './errors';
import { flattenArray } from './utils';

export default class Relation {
  origin: any;
  target: string;
  type: any;
  name: string;

  constructor(origin: any, target: string, type: string, foreignKey: string) {
    this.origin = origin;

    // Get the target's registered Model if target is a string
    const modelRegistry = origin.registry;
    this.target = typeof target === 'string' ? modelRegistry[target] : target;

    this.type = type;
    if (foreignKey) this.foreignKey = foreignKey;
  }

  foreignKey() {
    return this.isTypeFromOne
      ? `${underscore(this.origin.name)}_id`
      : `${underscore(this.target.name)}_id`;
  }

  get OriginAttribute() {
    return this.isTypeFromOne ? this.foreignKey : this.target.primaryKey;
  }

  get TargetAttribute() {
    return this.isTypeFromOne ? this.Origin.primaryKey : this.foreignKey;
  }

  get isTypeFromOne() {
    return (
      [RelationType.MANY_TO_ONE, RelationType.MANY_TO_MANY].indexOf(this.type) <
      0
    );
  }

  /**
   * Creates a many-to-many Relation from a one-to many Relation.
   * @param {string|Model} Interim Name or static reference to the pivot Model.
   * @param {string} [foreignKey] Foreign key in this Model.
   * @param {string} [otherKey] Foreign key in the Interim Model.
   * @returns {Relation}
   */
  through(Interim, foreignKey, otherKey) { // eslint-disable-line
    // TODO
    return this;
  }

  /**
   * Creates a query based on the given origin Model instances.
   * @param {Object[]} originInstances Origin Model instances.
   * @returns {QueryBuilder}
   */
  createQuery(originInstances) {
    const { OriginAttribute, TargetAttribute } = this;

    return this.Target.query().whereIn(
      OriginAttribute,
      originInstances.length > 0 // Pass a mock value if necessary
        ? originInstances.map((model) => model[TargetAttribute])
        : [`originInstance.${TargetAttribute}`],
    );
  }

  /**
   * Applies the relation by executing subqueries on the origin Model instances.
   * @param {...Object} originInstances Origin Model instances.
   * @throws {RelationError}
   * @returns {Promise}
   */
  applyAsync(...originInstances) {
    const models = flattenArray(originInstances);
    const { OriginAttribute, TargetAttribute } = this;

    // Create and then execute the query, handling Model bindings
    return this.createQuery(models).then((relatedModels) => {
      for (const relatedModel of relatedModels) {
        // Pair up the related Model with its origin
        const foreignValue = relatedModel[OriginAttribute];
        const originInstance = models.find(
          (model) => model[TargetAttribute] === foreignValue,
        );

        if (originInstance) {
          if (originInstance[this.name] === undefined) {
            // Initially set the origin's related property
            if (this.type === RelationType.ONE_TO_MANY) {
              originInstance[this.name] = [relatedModel];
            } else {
              originInstance[this.name] = relatedModel;
            }
          } else {
            // Modify the origin instance's related property if possible
            if (this.type === RelationType.ONE_TO_MANY) {
              originInstance[this.name].push(relatedModel);
            } else {
              throw new RelationError();
            }
          }
        }
      }
    });
  }
}
