import { queryOptions } from '@tanstack/react-query';
import api from '../api/routes';

export const deviceQueries = {
  list: (params?: { includeDisabled?: boolean }) =>
    queryOptions({
      queryKey: ['devices', params ?? {}] as const,
      queryFn: () => api.getAllDevices(params),
    }),
  detail: (deviceId: string) =>
    queryOptions({
      queryKey: ['devices', deviceId] as const,
      queryFn: () => api.getDevice(deviceId),
    }),
};
