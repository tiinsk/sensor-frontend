import {
  ArrayResponse,
  DeviceReadingResponse,
  Reading,
  ReadingsResponse,
} from '../api/types';
import { ValueType } from '../components/selectors/time-frame-selector';

/**
 * Merge ordered readings. Incoming is a suffix starting at/after some existing
 * point (catch-up); overlapping timestamps are replaced.
 */
export const mergeReadings = (
  existing: Reading[],
  incoming: Reading[]
): Reading[] => {
  if (incoming.length === 0) {
    return existing;
  }
  if (existing.length === 0) {
    return incoming;
  }

  const firstIncomingTs = incoming[0].timestamp;
  const overlapAt = existing.findIndex(
    reading => reading.timestamp >= firstIncomingTs
  );
  const kept = overlapAt === -1 ? existing : existing.slice(0, overlapAt);

  return kept.concat(incoming);
};

const replaceDeviceReadings = (
  existing: ArrayResponse<ReadingsResponse> | undefined,
  deviceId: string,
  mergedValues: Reading[]
): ArrayResponse<ReadingsResponse> => {
  const values = existing?.values ?? [];
  const deviceIndex = values.findIndex(entry => entry.id === deviceId);

  // This is a bit unneccessary at the moment, since the home page lists only devices that /devices request has fetched.
  // If new device is added after the initial fetch, this new device data will not be shown to the user.
  if (deviceIndex === -1) {
    return {
      count: values.length + 1,
      limit: existing?.limit ?? values.length + 1,
      values: [...values, { id: deviceId, values: mergedValues }],
    };
  }

  const nextValues = [...values];
  nextValues[deviceIndex] = { id: deviceId, values: mergedValues };

  return {
    count: existing?.count ?? nextValues.length,
    limit: existing?.limit ?? nextValues.length,
    values: nextValues,
  };
};

export const mergeCatchUpIntoCache = (
  existingCache: ArrayResponse<ReadingsResponse> | undefined,
  incomingByDevice: ReadingsResponse[]
): ArrayResponse<ReadingsResponse> | undefined =>
  incomingByDevice.reduce((cache, { id, values: incoming }) => {
    if (incoming.length === 0) {
      return cache;
    }

    const existing = cache?.values.find(entry => entry.id === id)?.values ?? [];

    return replaceDeviceReadings(cache, id, mergeReadings(existing, incoming));
  }, existingCache);

const replaceTypeReadings = (
  existing: DeviceReadingResponse,
  type: ValueType,
  mergedValues: Reading[]
): DeviceReadingResponse => ({
  ...existing,
  values: existing.values.map(entry =>
    entry.type === type ? { type, values: mergedValues } : entry
  ),
});

/** Merge catch-up sensor series into a single-device readings cache. */
export const mergeDeviceCatchUpIntoCache = (
  existingCache: DeviceReadingResponse | undefined,
  incomingByType: DeviceReadingResponse['values']
): DeviceReadingResponse | undefined => {
  if (!existingCache) {
    return existingCache;
  }

  return incomingByType.reduce((cache, { type, values: incoming }) => {
    if (incoming.length === 0) {
      return cache;
    }

    const existing =
      cache.values.find(entry => entry.type === type)?.values ?? [];

    return replaceTypeReadings(cache, type, mergeReadings(existing, incoming));
  }, existingCache);
};
