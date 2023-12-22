export type Unit = 'temperature' | 'humidity' | 'pressure';

export const getUnit = (unit: Unit): string | undefined => {
  switch (unit) {
    case 'temperature':
      return '°C';
    case 'humidity':
      return '%';
    case 'pressure':
      return 'mBar';
    default:
      return undefined;
  }
};
