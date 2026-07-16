import { useQuery } from '@tanstack/react-query';
import { latestQueries } from '../queries/latest-queries';
import { indexById } from '../utils/index-by-id';

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
  });
