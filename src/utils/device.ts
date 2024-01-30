import { DeviceType } from '../api/types';

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
