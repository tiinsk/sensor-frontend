import { useQuery } from '@tanstack/react-query';
import { ArrayResponse, DeviceResponse } from '../api/types';
import { deviceQueries } from '../queries/device-queries';
import { queryClient } from '../queries/query-client';

export const useDevices = (params?: { includeDisabled?: boolean }) =>
  useQuery({
    ...deviceQueries.list(params),
    select: response => response.values,
  });

export const useDevice = (deviceId: string | undefined) =>
  useQuery({
    ...deviceQueries.detail(deviceId ?? ''),
    enabled: Boolean(deviceId),
    initialData: () => {
      if (!deviceId) {
        return undefined;
      }

      const list = queryClient.getQueryData<ArrayResponse<DeviceResponse>>(
        deviceQueries.list().queryKey
      );

      return list?.values.find(device => device.id === deviceId);
    },
  });
