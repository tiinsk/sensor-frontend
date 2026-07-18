import { ValueType } from '../components/selectors/time-frame-selector';

export const indexByType = <T>(
  values: { type: ValueType; values: T }[]
): Partial<Record<ValueType, T>> =>
  values.reduce<Partial<Record<ValueType, T>>>((acc, item) => {
    acc[item.type] = item.values;
    return acc;
  }, {});
