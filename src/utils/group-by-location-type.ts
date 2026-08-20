import { LatestReadingResponse, LocationType } from '../api/types';
import { isFreshReading } from './latest-stale-time';
import { Unit, units } from './unit';

export type GroupedLocationType = Exclude<LocationType, null>;

export type LocationSensorStats = {
  avg: number | null;
  min: number | null;
  max: number | null;
  count: number;
};

export type LocationGroupStats = Record<Unit, LocationSensorStats> & {
  latestTimestamp: string | null;
};

export type LocationTypeGroupStats = LocationGroupStats & {
  locationType: GroupedLocationType;
};

const summarize = (values: number[]): LocationSensorStats => {
  if (values.length === 0)
    return {
      avg: null,
      min: null,
      max: null,
      count: 0,
    };

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

  return { avg, min, max, count: values.length };
};

const latestTimestampFor = (devices: LatestReadingResponse[]) => {
  const timestamps = devices
    .map(device => device.reading?.timestamp)
    .filter((timestamp): timestamp is string => Boolean(timestamp));

  if (timestamps.length === 0) return null;

  return timestamps.reduce((latest, timestamp) => {
    if (timestamp > latest) return timestamp;
    return latest;
  });
};

const freshDevices = (devices: LatestReadingResponse[]) => {
  const latestTimestamp = latestTimestampFor(devices);
  if (!latestTimestamp) return [];

  return devices.filter(device => {
    const timestamp = device.reading?.timestamp;
    if (!timestamp) return false;
    return isFreshReading(timestamp, latestTimestamp);
  });
};

const statsForDevices = (
  devices: LatestReadingResponse[]
): LocationGroupStats => {
  const latestTimestamp = latestTimestampFor(devices);
  const fresh = freshDevices(devices);
  const sensors = units.reduce<Record<Unit, LocationSensorStats>>(
    (acc, unit) => {
      const values = fresh
        .map(device => device.reading?.[unit])
        .filter((value): value is number => typeof value === 'number');
      acc[unit] = summarize(values);
      return acc;
    },
    {} as Record<Unit, LocationSensorStats>
  );

  return {
    ...sensors,
    latestTimestamp,
  };
};

// Groups devices by location type ('inside', 'outside').
// Devices with no location type are skipped. Later, include them as
// individual entries keyed by device id, e.g.
// { inside: ..., outside: ..., [deviceId]: ..., [otherDeviceId]: ... } or
// { inside: ..., outside: ..., unknown: { [deviceId]: ..., [otherDeviceId]: ... } }
export const groupByLocationType = (
  values: LatestReadingResponse[]
): LocationTypeGroupStats[] => {
  const grouped = values.reduce<
    Partial<Record<GroupedLocationType, LatestReadingResponse[]>>
  >((acc, item) => {
    const { type } = item.location;
    if (!type) return acc;
    (acc[type] ??= []).push(item);
    return acc;
  }, {});

  return (Object.keys(grouped) as GroupedLocationType[])
    .sort((a, b) => a.localeCompare(b))
    .map(type => ({
      ...statsForDevices(grouped[type]!),
      locationType: type,
    }));
};
