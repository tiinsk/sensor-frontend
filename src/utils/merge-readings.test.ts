import { describe, expect, it } from 'vitest';
import { mergeReadings } from './merge-readings';
import { Reading } from '../api/types';

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
