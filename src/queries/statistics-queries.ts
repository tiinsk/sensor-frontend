import { queryOptions } from '@tanstack/react-query';
import api, { DeviceStatisticsParams } from '../api/routes';
import { StatisticsTimeFrame } from '../components/selectors/time-frames';

export const statisticsQueries = {
  all: (params: StatisticsTimeFrame) =>
    queryOptions({
      queryKey: ['statistics', 'all', params] as const,
      queryFn: () => api.getAllStatistics(params),
    }),
  device: (params: DeviceStatisticsParams) =>
    queryOptions({
      queryKey: ['statistics', 'device', params] as const,
      queryFn: () => api.getAllDeviceStatistics(params),
    }),
};
