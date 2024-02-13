import { DeviceResponse, ReadingsResponse } from '../api/types';
import { groupBy } from 'lodash';

export interface MinMax {
  min?: number;
  max?: number;
}

const getMinMax = (
  devices: DeviceResponse[],
  readings: { [id: string]: ReadingsResponse | undefined }
) => {
  return devices.reduce(
    (acc: MinMax, curr: DeviceResponse) => {
      const deviceReadings = readings[curr.id]?.values;
      const deviceMax = deviceReadings
        ? Math.max(...deviceReadings?.map(r => r.max || 0))
        : undefined;
      const deviceMin = deviceReadings
        ? Math.min(...deviceReadings?.map(r => r.min || 0))
        : undefined;
      return {
        max: acc.max && deviceMax && acc.max > deviceMax ? acc.max : deviceMax,
        min: acc.min && deviceMin && acc.min < deviceMin ? acc.min : deviceMin,
      };
    },
    { max: undefined, min: undefined }
  );
};

//Groups devices by device location type ('inside', 'outside', or null). Returns min and max value for each group. If device location type is null, device min and max value is not grouped with any other device.
// Example return value {inside: {min: 20, max: 24}, outside: {min: 10, max: 15}, deviceIdWithoutLocationType: {min: 12, max: 14}}
export const getMinAndMaxGroupedByDeviceLocationType = (
  devices: DeviceResponse[],
  readings: { [id: string]: ReadingsResponse | undefined }
): { [locationType: string]: MinMax } => {
  const groupedDevices = groupBy(devices, d =>
    d.location.type ? d.location.type : d.id
  );

  return Object.keys(groupedDevices).reduce<{
    [locationType: string]: MinMax;
  }>((acc, curr) => {
    acc[curr] = getMinMax(groupedDevices[curr], readings);
    return acc;
  }, {});
};
