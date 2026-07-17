import { useQuery } from '@tanstack/react-query';
import { latestQueries } from '../queries/latest-queries';
import { indexById } from '../utils/index-by-id';
import { queryClient } from '../queries/query-client';
import { ArrayResponse, LatestReadingResponse } from '../api/types';

export const useLatestReadings = () =>
  useQuery({
    ...latestQueries.all(),
    select: response => ({
      values: response.values,
      byDevice: indexById(response.values),
    }),
  });

export const useDeviceLatestReading = (deviceId: string | undefined) =>
  useQuery({
    ...latestQueries.device(deviceId ?? ''),
    enabled: Boolean(deviceId),
    initialData: () => {
      if (!deviceId) {
        return undefined;
      }

      const list = queryClient.getQueryData<
        ArrayResponse<LatestReadingResponse>
      >(latestQueries.all().queryKey);

      return list?.values.find(device => device.id === deviceId);
    },
  });
