import { queryOptions } from '@tanstack/react-query';
import api, { DeviceReadingParams, ReadingParams } from '../api/routes';

export const readingsQueries = {
  all: (params: ReadingParams) =>
    queryOptions({
      queryKey: ['readings', 'all', params] as const,
      queryFn: () => api.getAllReadings(params),
    }),
  device: (params: DeviceReadingParams) =>
    queryOptions({
      queryKey: ['readings', 'device', params] as const,
      queryFn: () => api.getDeviceReadings(params),
    }),
};
