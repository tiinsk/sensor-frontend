import { DeviceResponse } from '../api/types';
import { getStorageItem, setStorageItem } from './index';

export const getStorageDevices = () => {
  const savedDevices = getStorageItem('devices');
  return savedDevices ? JSON.parse(savedDevices) : [];
};

export const saveStorageDevices = (devices: DeviceResponse[]) => {
  setStorageItem('devices', devices);
};
