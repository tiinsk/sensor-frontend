import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TimeFrameOptions } from '../components/selectors/time-frame-selector';
import {
  getReadingsTimeFrame,
  getStatisticsTimeFrame,
  getTimeFrameStaleTime,
} from '../components/selectors/time-frames';
import { readingsQueries } from '../queries/readings-queries';
import { statisticsQueries } from '../queries/statistics-queries';
import { indexById } from '../utils/index-by-id';

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

  const readingsQuery = useQuery({
    ...readingsQueries.all(readingsParams),
    enabled: hasValueType,
    staleTime,
  });
  const statisticsQuery = useQuery({
    ...statisticsQueries.all(statisticsParams),
    enabled: hasValueType,
    staleTime,
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
