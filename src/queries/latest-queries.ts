import { queryOptions } from '@tanstack/react-query';
import api from '../api/routes';

export const latestQueries = {
  all: () =>
    queryOptions({
      queryKey: ['latest'] as const,
      queryFn: () => api.getAllLatest(),
    }),
  device: (deviceId: string) =>
    queryOptions({
      queryKey: ['latest', deviceId] as const,
      queryFn: () => api.getDeviceLatestReadings(deviceId),
    }),
};
