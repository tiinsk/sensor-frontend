import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TimeFrameOptions } from '../components/selectors/time-frame-selector';
import {
  getReadingsTimeFrame,
  getStatisticsTimeFrame,
} from '../components/selectors/time-frames';
import { readingsQueries } from '../queries/readings-queries';
import { statisticsQueries } from '../queries/statistics-queries';

const indexByDeviceId = <T extends { id: string }>(
  values: T[]
): Record<string, T | undefined> =>
  values.reduce<Record<string, T | undefined>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

export const useTimeFrameData = (options: TimeFrameOptions) => {
  const valueType = options.valueType;
  const hasValueType = valueType !== undefined;

  const readingsParams = {
    ...getReadingsTimeFrame(options),
    type: valueType ?? 'temperature',
  };
  const statisticsParams = getStatisticsTimeFrame(options);

  const readingsQuery = useQuery({
    ...readingsQueries.all(readingsParams),
    enabled: hasValueType,
  });
  const statisticsQuery = useQuery({
    ...statisticsQueries.all(statisticsParams),
    enabled: hasValueType,
  });

  const readingsByDevice = useMemo(
    () => indexByDeviceId(readingsQuery.data?.values ?? []),
    [readingsQuery.data]
  );

  const statisticsByDevice = useMemo(
    () => indexByDeviceId(statisticsQuery.data?.values ?? []),
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
