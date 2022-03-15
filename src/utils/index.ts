export function ensureValue(
  collection: any,
  key: string,
  missingCallback: () => void,
) {
  const value = collection[key];
  if (value === undefined || value === null) {
    missingCallback();
    return;
  }

  return value;
}

export function ensureRelationIsBooted(relation: any) {
  if (!relation.booted) {
    throw new Error('Relationship is not booted. Make sure to call boot first');
  }
}

export function getValue(
  model: any,
  key: string,
  relation: any,
  action = 'preload',
) {
  return ensureValue(model, key, () => {
    throw new Error(
      `Cannot ${action} "${relation.relationName}", value of "${relation.model.name}.${key}" is undefined`,
    );
  });
}
