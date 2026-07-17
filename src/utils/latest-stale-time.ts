import { LatestReadingResponse } from '../api/types';

export const READING_INTERVAL_MS = 10 * 60 * 1000;

export const staleTimeUntilNextReading = (
  readingTimestamp: string | undefined,
  dataUpdatedAt: number
): number => {
  if (!readingTimestamp || !dataUpdatedAt) {
    return 0;
  }

  const ageAtFetch = dataUpdatedAt - new Date(readingTimestamp).getTime();
  return Math.max(0, READING_INTERVAL_MS - ageAtFetch);
};

export const oldestLatestReadingTimestamp = (
  values: LatestReadingResponse[]
): string | undefined =>
  values.reduce<string | undefined>((oldest, entry) => {
    const timestamp = entry.reading?.timestamp;
    if (
      !timestamp ||
      (oldest && new Date(timestamp).getTime() >= new Date(oldest).getTime())
    ) {
      return oldest;
    }
    return timestamp;
  }, undefined);
