import { queryOptions } from '@tanstack/react-query';
import api from '../api/routes';
import {
  oldestLatestReadingTimestamp,
  READING_INTERVAL_MS,
  staleTimeUntilNextReading,
} from '../utils/latest-stale-time';

export const latestQueries = {
  all: () =>
    queryOptions({
      queryKey: ['latest'] as const,
      queryFn: () => api.getAllLatest(),
      staleTime: query =>
        staleTimeUntilNextReading(
          oldestLatestReadingTimestamp(query.state.data?.values ?? []),
          query.state.dataUpdatedAt
        ),
      refetchInterval: READING_INTERVAL_MS,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
    }),
  device: (deviceId: string) =>
    queryOptions({
      queryKey: ['latest', deviceId] as const,
      queryFn: () => api.getDeviceLatestReadings(deviceId),
      staleTime: query =>
        staleTimeUntilNextReading(
          query.state.data?.reading?.timestamp,
          query.state.dataUpdatedAt
        ),
      refetchInterval: READING_INTERVAL_MS,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
    }),
};
