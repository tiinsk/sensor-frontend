import { useQuery } from '@tanstack/react-query';
import { TimeFrameOptions } from '../components/selectors/time-frame-selector';
import {
  getStatisticsTimeFrame,
  getTimeFrameStaleTime,
} from '../components/selectors/time-frames';
import { statisticsQueries } from '../queries/statistics-queries';
import { indexById } from '../utils/index-by-id';

export const useStatistics = (options: TimeFrameOptions) => {
  const hasValueType = options.valueType !== undefined;

  return useQuery({
    ...statisticsQueries.all(getStatisticsTimeFrame(options)),
    enabled: hasValueType,
    staleTime: getTimeFrameStaleTime(options.offsetFromNow, options.timePeriod),
    select: response => indexById(response.values),
  });
};
