import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isFreshReading,
  oldestLatestReadingTimestamp,
  READING_INTERVAL_MS,
  staleTimeUntilNextReading,
} from './latest-stale-time';
import { LatestReadingResponse } from '../api/types';

afterEach(() => {
  vi.useRealTimers();
});

describe('staleTimeUntilNextReading', () => {
  it('returns 0 when timestamp or dataUpdatedAt is missing', () => {
    expect(staleTimeUntilNextReading(undefined, Date.now())).toBe(0);
    expect(staleTimeUntilNextReading('2026-07-17T12:00:00.000Z', 0)).toBe(0);
  });

  it('returns remaining interval based on reading age at fetch time', () => {
    const readingTime = new Date('2026-07-17T12:00:00.000Z').getTime();
    const fetchedAt = readingTime + 60_000; // reading was 1 minute old

    expect(
      staleTimeUntilNextReading('2026-07-17T12:00:00.000Z', fetchedAt)
    ).toBe(READING_INTERVAL_MS - 60_000);
  });

  it('returns 0 when the reading age already exceeds the interval', () => {
    const readingTime = new Date('2026-07-17T12:00:00.000Z').getTime();
    const fetchedAt = readingTime + READING_INTERVAL_MS + 60_000;

    expect(
      staleTimeUntilNextReading('2026-07-17T12:00:00.000Z', fetchedAt)
    ).toBe(0);
  });
});

describe('isFreshReading', () => {
  it('includes readings within two intervals of the latest timestamp', () => {
    expect(
      isFreshReading('2026-07-17T12:00:00.000Z', '2026-07-17T12:20:00.000Z')
    ).toBe(true);
  });

  it('excludes readings older than two intervals', () => {
    expect(
      isFreshReading('2026-07-17T11:59:00.000Z', '2026-07-17T12:20:00.000Z')
    ).toBe(false);
  });
});

describe('oldestLatestReadingTimestamp', () => {
  it('returns the oldest reading timestamp among devices', () => {
    const values = [
      { reading: { timestamp: '2026-07-17T12:05:00.000Z' } },
      { reading: { timestamp: '2026-07-17T12:01:00.000Z' } },
      { reading: undefined },
    ] as LatestReadingResponse[];

    expect(oldestLatestReadingTimestamp(values)).toBe(
      '2026-07-17T12:01:00.000Z'
    );
  });

  it('returns undefined when no timestamps exist', () => {
    expect(oldestLatestReadingTimestamp([])).toBeUndefined();
    expect(
      oldestLatestReadingTimestamp([
        { reading: undefined },
      ] as LatestReadingResponse[])
    ).toBeUndefined();
  });
});
