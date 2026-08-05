import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TimeFrameOptions,
  ValueType,
} from '../components/selectors/time-frame-selector';
import {
  getReadingsTimeFrame,
  getStatisticsTimeFrame,
  getTimeFrameStaleTime,
} from '../components/selectors/time-frames';
import { readingsQueries } from '../queries/readings-queries';
import { statisticsQueries } from '../queries/statistics-queries';
import { indexById } from '../utils/index-by-id';
import { indexByType } from '../utils/index-by-type';
import { READING_INTERVAL_MS } from '../utils/latest-stale-time';

const DEVICE_GRAPH_READING_TYPES: ValueType[] = [
  'temperature',
  'humidity',
  'pressure',
  'co2',
  'nox',
  'pm25',
  'voc',
  'airQuality',
];

export const useDeviceTimeFrameReadings = (
  deviceId: string | undefined,
  options: TimeFrameOptions
) =>
  useQuery({
    ...readingsQueries.device({
      deviceId: deviceId ?? '',
      ...getReadingsTimeFrame(options),
      types: DEVICE_GRAPH_READING_TYPES,
    }),
    enabled: Boolean(deviceId),
    staleTime: getTimeFrameStaleTime(options.offsetFromNow, options.timePeriod),
    select: response => indexByType(response.values),
  });

export const useTimeFrameData = (options: TimeFrameOptions) => {
  const valueType = options.valueType;
  const hasValueType = valueType !== undefined;

  const readingsParams = {
    ...getReadingsTimeFrame(options),
    type: valueType ?? 'temperature',
  };
  const statisticsParams = getStatisticsTimeFrame(options);
  const staleTime = getTimeFrameStaleTime(
    options.offsetFromNow,
    options.timePeriod
  );
  const isLive = options.offsetFromNow === 0;

  const readingsQuery = useQuery({
    ...readingsQueries.all(readingsParams),
    enabled: hasValueType,
    staleTime,
  });
  const statisticsQuery = useQuery({
    ...statisticsQueries.all(statisticsParams),
    enabled: hasValueType,
    staleTime,
    refetchInterval: isLive ? READING_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: isLive,
  });

  const readingsByDevice = useMemo(
    () => indexById(readingsQuery.data?.values ?? []),
    [readingsQuery.data]
  );

  const statisticsByDevice = useMemo(
    () => indexById(statisticsQuery.data?.values ?? []),
    [statisticsQuery.data]
  );

  if (!hasValueType) {
    return {
      readingsByDevice: {},
      statisticsByDevice: {},
      isPendingReadings: false,
      isPendingStatistics: false,
    };
  }

  return {
    readingsByDevice,
    statisticsByDevice,
    isPendingReadings: readingsQuery.isPending,
    isPendingStatistics: statisticsQuery.isPending,
  };
};
