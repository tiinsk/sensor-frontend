import { queryOptions } from '@tanstack/react-query';
import api, { DeviceReadingParams, ReadingParams } from '../api/routes';
import { ArrayResponse, ReadingsResponse } from '../api/types';
import {
  TimeFrameOptions,
  ValueType,
} from '../components/selectors/time-frame-selector';
import {
  getCatchUpReadingsTimeFrame,
  getReadingsTimeFrame,
} from '../components/selectors/time-frames';
import { READING_INTERVAL_MS } from '../utils/latest-stale-time';
import { mergeCatchUpIntoCache } from '../utils/merge-readings';
import { queryClient } from './query-client';

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
  catchUp: (options: TimeFrameOptions) =>
    queryOptions({
      queryKey: ['readings', 'catch-up', options] as const,
      queryFn: async () => {
        const valueType: ValueType = options.valueType ?? 'temperature';
        const readingsQueryKey = readingsQueries.all({
          ...getReadingsTimeFrame(options),
          type: valueType,
        }).queryKey;
        const catchUpQueryKey = readingsQueries.catchUp(options).queryKey;

        if (!queryClient.getQueryData(readingsQueryKey)) {
          return null;
        }

        const caughtUpAt =
          queryClient.getQueryState(catchUpQueryKey)?.dataUpdatedAt ||
          queryClient.getQueryState(readingsQueryKey)?.dataUpdatedAt;

        if (!caughtUpAt) {
          return null;
        }

        const catchUpRange = getCatchUpReadingsTimeFrame(
          new Date(caughtUpAt).toISOString(),
          options
        );
        if (!catchUpRange) {
          return null;
        }

        const response = await api.getAllReadings({
          ...catchUpRange,
          type: valueType,
        });

        queryClient.setQueryData<ArrayResponse<ReadingsResponse>>(
          readingsQueryKey,
          cache => mergeCatchUpIntoCache(cache, response.values)
        );

        return null;
      },
      initialData: () => null,
      staleTime: READING_INTERVAL_MS,
      refetchInterval: READING_INTERVAL_MS,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
    }),
};
