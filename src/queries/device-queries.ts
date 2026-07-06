import { queryOptions } from '@tanstack/react-query';
import api from '../api/routes';

export const deviceQueries = {
  list: (params?: { includeDisabled?: boolean }) =>
    queryOptions({
      queryKey: ['devices', 'all', params ?? {}] as const,
      queryFn: () => api.getAllDevices(params),
      refetchOnMount: 'always',
    }),
  detail: (deviceId: string) =>
    queryOptions({
      queryKey: ['devices', 'device', deviceId] as const,
      queryFn: () => api.getDevice(deviceId),
    }),
};
