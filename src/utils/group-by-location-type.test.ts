import { describe, expect, it } from 'vitest';
import { LatestReadingResponse } from '../api/types';
import { groupByLocationType } from './group-by-location-type';

const reading = (
  timestamp: string,
  values: Partial<NonNullable<LatestReadingResponse['reading']>> = {}
): NonNullable<LatestReadingResponse['reading']> => ({
  temperature: null,
  humidity: null,
  pressure: null,
  timestamp,
  battery: 3000,
  co2: null,
  nox: null,
  pm25: null,
  voc: null,
  airQuality: null,
  ...values,
});

const device = (
  locationType: LatestReadingResponse['location']['type'],
  deviceReading?: LatestReadingResponse['reading']
): LatestReadingResponse => ({
  id: 'device',
  name: 'device',
  location: { x: 0, y: 0, type: locationType },
  sensor_info: ['temperature'],
  reading: deviceReading,
});

describe('groupByLocationType', () => {
  it('averages min and max per sensor for inside and outside', () => {
    const result = groupByLocationType([
      device(
        'inside',
        reading('2026-01-01T01:00:00.000Z', {
          temperature: 20,
          humidity: 40,
          co2: 800,
        })
      ),
      device(
        'inside',
        reading('2026-01-01T01:05:00.000Z', {
          temperature: 24,
          humidity: 50,
          co2: 1000,
        })
      ),
      device(
        'outside',
        reading('2026-01-01T02:00:00.000Z', {
          temperature: 10,
          pm25: 5,
        })
      ),
      device(
        null,
        reading('2026-01-01T03:00:00.000Z', {
          temperature: 99,
        })
      ),
    ]);

    expect(result).toMatchObject([
      {
        locationType: 'inside',
        temperature: { avg: 22, min: 20, max: 24, count: 2 },
        humidity: { avg: 45, min: 40, max: 50, count: 2 },
        co2: { avg: 900, min: 800, max: 1000, count: 2 },
        pressure: { avg: null, min: null, max: null, count: 0 },
        latestTimestamp: '2026-01-01T01:05:00.000Z',
      },
      {
        locationType: 'outside',
        temperature: { avg: 10, min: 10, max: 10, count: 1 },
        pm25: { avg: 5, min: 5, max: 5, count: 1 },
        humidity: { avg: null, min: null, max: null, count: 0 },
        latestTimestamp: '2026-01-01T02:00:00.000Z',
      },
    ]);
  });

  it('keeps devices within two reading intervals of the latest', () => {
    const result = groupByLocationType([
      device(
        'inside',
        reading('2026-01-02T12:20:00.000Z', { temperature: 20 })
      ),
      device(
        'inside',
        reading('2026-01-02T12:05:00.000Z', { temperature: 24 })
      ),
    ]);

    expect(result).toMatchObject([
      {
        locationType: 'inside',
        temperature: { avg: 22, min: 20, max: 24, count: 2 },
      },
    ]);
  });

  it('excludes devices older than two reading intervals behind the latest', () => {
    const result = groupByLocationType([
      device(
        'inside',
        reading('2026-01-02T12:00:00.000Z', { temperature: 20 })
      ),
      device(
        'inside',
        reading('2026-01-01T10:00:00.000Z', { temperature: 99 })
      ),
    ]);

    expect(result).toMatchObject([
      {
        locationType: 'inside',
        temperature: { avg: 20, min: 20, max: 20, count: 1 },
        latestTimestamp: '2026-01-02T12:00:00.000Z',
      },
    ]);
  });
});
