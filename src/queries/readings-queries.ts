import { queryOptions } from '@tanstack/react-query';
import api, { DeviceReadingParams, ReadingParams } from '../api/routes';
import {
  ArrayResponse,
  DeviceReadingResponse,
  ReadingsResponse,
} from '../api/types';
import {
  TimeFrameOptions,
  ValueType,
} from '../components/selectors/time-frame-selector';
import {
  getCatchUpReadingsTimeFrame,
  getReadingsTimeFrame,
} from '../components/selectors/time-frames';
import { READING_INTERVAL_MS } from '../utils/latest-stale-time';
import {
  mergeCatchUpIntoCache,
  mergeDeviceCatchUpIntoCache,
} from '../utils/merge-readings';
import { queryClient } from './query-client';

export const DEVICE_GRAPH_READING_TYPES: ValueType[] = [
  'temperature',
  'humidity',
  'pressure',
  'co2',
  'nox',
  'pm25',
  'voc',
  'airQuality',
];

const catchUpQueryOptions = {
  initialData: () => null,
  staleTime: READING_INTERVAL_MS,
  refetchInterval: READING_INTERVAL_MS,
  refetchIntervalInBackground: false,
  refetchOnWindowFocus: true,
} as const;

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
      ...catchUpQueryOptions,
    }),
  deviceCatchUp: (deviceId: string, options: TimeFrameOptions) =>
    queryOptions({
      queryKey: ['readings', 'device-catch-up', deviceId, options] as const,
      queryFn: async () => {
        const readingsQueryKey = readingsQueries.device({
          deviceId,
          ...getReadingsTimeFrame(options),
          types: DEVICE_GRAPH_READING_TYPES,
        }).queryKey;
        const catchUpQueryKey = readingsQueries.deviceCatchUp(
          deviceId,
          options
        ).queryKey;

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

        const response = await api.getDeviceReadings({
          deviceId,
          ...catchUpRange,
          types: DEVICE_GRAPH_READING_TYPES,
        });

        queryClient.setQueryData<DeviceReadingResponse>(
          readingsQueryKey,
          cache => mergeDeviceCatchUpIntoCache(cache, response.values)
        );

        return null;
      },
      ...catchUpQueryOptions,
    }),
};
