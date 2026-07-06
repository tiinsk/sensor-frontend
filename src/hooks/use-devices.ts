import { useQuery } from '@tanstack/react-query';
import { deviceQueries } from '../queries/device-queries';

export const useDevices = (params?: { includeDisabled?: boolean }) =>
  useQuery({
    ...deviceQueries.list(params),
    select: response => response.values,
  });

export const useDevice = (deviceId: string | undefined) =>
  useQuery({
    ...deviceQueries.detail(deviceId ?? ''),
    enabled: Boolean(deviceId),
  });
