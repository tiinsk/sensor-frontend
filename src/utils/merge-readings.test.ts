import { describe, expect, it } from 'vitest';
import { mergeDeviceCatchUpIntoCache, mergeReadings } from './merge-readings';
import { DeviceReadingResponse, Reading } from '../api/types';

const reading = (timestamp: string, avg: number): Reading => ({
  timestamp,
  avg,
  min: avg - 1,
  max: avg + 1,
});

describe('mergeReadings', () => {
  it('returns existing readings when incoming is empty', () => {
    const existing = [reading('2026-01-01T10:00:00.000Z', 20)];

    expect(mergeReadings(existing, [])).toEqual(existing);
  });

  it('appends newer readings and replaces the overlapping start', () => {
    const existing = [
      reading('2026-01-01T10:00:00.000Z', 20),
      reading('2026-01-01T10:30:00.000Z', 21),
    ];
    const incoming = [
      reading('2026-01-01T10:30:00.000Z', 22),
      reading('2026-01-01T11:00:00.000Z', 23),
    ];

    expect(mergeReadings(existing, incoming)).toEqual([
      reading('2026-01-01T10:00:00.000Z', 20),
      reading('2026-01-01T10:30:00.000Z', 22),
      reading('2026-01-01T11:00:00.000Z', 23),
    ]);
  });

  it('replaces existing bucket when timestamp matches', () => {
    const existing = [reading('2026-01-01T10:00:00.000Z', 20)];
    const incoming = [reading('2026-01-01T10:00:00.000Z', 25)];

    expect(mergeReadings(existing, incoming)).toEqual([
      reading('2026-01-01T10:00:00.000Z', 25),
    ]);
  });
});

describe('mergeDeviceCatchUpIntoCache', () => {
  it('merges incoming series per sensor type', () => {
    const existing: DeviceReadingResponse = {
      id: 'device-1',
      values: [
        {
          type: 'temperature',
          values: [reading('2026-01-01T10:00:00.000Z', 20)],
        },
        {
          type: 'humidity',
          values: [reading('2026-01-01T10:00:00.000Z', 40)],
        },
      ],
    };

    expect(
      mergeDeviceCatchUpIntoCache(existing, [
        {
          type: 'temperature',
          values: [
            reading('2026-01-01T10:00:00.000Z', 21),
            reading('2026-01-01T10:30:00.000Z', 22),
          ],
        },
      ])
    ).toEqual({
      id: 'device-1',
      values: [
        {
          type: 'temperature',
          values: [
            reading('2026-01-01T10:00:00.000Z', 21),
            reading('2026-01-01T10:30:00.000Z', 22),
          ],
        },
        {
          type: 'humidity',
          values: [reading('2026-01-01T10:00:00.000Z', 40)],
        },
      ],
    });
  });
});
