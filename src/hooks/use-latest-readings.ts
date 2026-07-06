import { useQuery } from '@tanstack/react-query';
import { LatestReadingResponse } from '../api/types';
import { latestQueries } from '../queries/latest-queries';

export type LatestByDevice = Record<string, LatestReadingResponse | undefined>;

export const indexLatestByDevice = (
  values: LatestReadingResponse[]
): LatestByDevice =>
  values.reduce<LatestByDevice>((acc, reading) => {
    acc[reading.id] = reading;
    return acc;
  }, {});

export const useLatestReadings = () =>
  useQuery({
    ...latestQueries.all(),
    select: response => ({
      values: response.values,
      byDevice: indexLatestByDevice(response.values),
    }),
  });

export const useDeviceLatestReading = (deviceId: string | undefined) =>
  useQuery({
    ...latestQueries.device(deviceId ?? ''),
    enabled: Boolean(deviceId),
  });
