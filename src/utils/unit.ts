export type Unit =
  | 'temperature'
  | 'humidity'
  | 'pressure'
  | 'co2'
  | 'nox'
  | 'pm25'
  | 'voc'
  | 'airQuality';

export const units: Unit[] = [
  'temperature',
  'humidity',
  'pressure',
  'co2',
  'nox',
  'pm25',
  'voc',
  'airQuality',
];

export const getUnit = (unit: Unit): string | undefined => {
  switch (unit) {
    case 'temperature':
      return '°C';
    case 'humidity':
      return '%';
    case 'pressure':
      return 'mBar';
    case 'co2':
      return 'ppm';
    case 'nox':
      return undefined;
    case 'pm25':
      return 'μg/㎥';
    case 'voc':
      return undefined;
    case 'airQuality':
      return undefined;
    default:
      return undefined;
  }
};

export const getUnitTitle = (unit: Unit): string | undefined => {
  switch (unit) {
    case 'temperature':
      return 'Temperature';
    case 'humidity':
      return 'Humidity';
    case 'pressure':
      return 'Pressure';
    case 'co2':
      return 'CO2';
    case 'nox':
      return 'NOx';
    case 'pm25':
      return 'PM2.5';
    case 'voc':
      return 'VOC index';
    case 'airQuality':
      return 'Air Quality';
    default:
      return undefined;
  }
};
