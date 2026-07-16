export const indexById = <T extends { id: string }>(
  values: T[]
): Record<string, T | undefined> =>
  values.reduce<Record<string, T | undefined>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
