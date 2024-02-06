import { DeviceType } from '../api/types';
import { ValueType } from '../components/selectors/time-frame-selector';

export const getDeviceTypeName = (type: DeviceType) => {
  switch (type) {
    case 'ruuvi':
      return 'Ruuvi';
    case 'sensorbug':
      return 'SensorBug';
    default:
      return '';
  }
};

export const getDeviceSensors = (type: DeviceType): ValueType[] => {
  switch (type) {
    case 'ruuvi':
      return ['temperature', 'humidity', 'pressure'];
    case 'sensorbug':
      return ['temperature'];
    default:
      return [];
  }
};
