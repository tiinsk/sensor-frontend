import { useQuery } from '@tanstack/react-query';
import { TimeFrameOptions } from '../components/selectors/time-frame-selector';
import {
  getStatisticsTimeFrame,
  getTimeFrameStaleTime,
} from '../components/selectors/time-frames';
import { statisticsQueries } from '../queries/statistics-queries';
import { indexById } from '../utils/index-by-id';
import { getDefaultTimeLevel } from '../utils/time-frame';

export const useStatistics = (options: TimeFrameOptions) => {
  const hasValueType = options.valueType !== undefined;

  return useQuery({
    ...statisticsQueries.all(getStatisticsTimeFrame(options)),
    enabled: hasValueType,
    staleTime: getTimeFrameStaleTime(options.offsetFromNow, options.timePeriod),
    select: response => indexById(response.values),
  });
};

export const useDeviceStatistics = (
  deviceId: string | undefined,
  options: Pick<TimeFrameOptions, 'timePeriod' | 'offsetFromNow' | 'level'>
) =>
  useQuery({
    ...statisticsQueries.device({
      deviceId: deviceId ?? '',
      ...getStatisticsTimeFrame(options),
    }),
    enabled: Boolean(deviceId),
    staleTime: getTimeFrameStaleTime(options.offsetFromNow, options.timePeriod),
    select: response => response.statistics,
  });

export const useDeviceAverageStatistics = (deviceId: string | undefined) => {
  const day = useDeviceStatistics(deviceId, {
    timePeriod: 'day',
    offsetFromNow: 0,
    level: getDefaultTimeLevel('day'),
  });
  const week = useDeviceStatistics(deviceId, {
    timePeriod: 'week',
    offsetFromNow: 0,
    level: getDefaultTimeLevel('week'),
  });
  const month = useDeviceStatistics(deviceId, {
    timePeriod: 'month',
    offsetFromNow: 0,
    level: getDefaultTimeLevel('month'),
  });

  return {
    day: day.data,
    week: week.data,
    month: month.data,
    isPending: day.isPending || week.isPending || month.isPending,
  };
};
