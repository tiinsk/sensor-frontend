import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getReadingsTimeFrame,
  getStatisticsTimeFrame,
  getTimeFrame,
  getTimeFrameStaleTime,
  parseGraphTimestamp,
  toGraphHoverKey,
} from './time-frames';
import { TimeFrameOptions } from './time-frame-selector';
import { getDefaultTimeLevel } from '../../utils/time-frame';
import { DateTime, Settings } from 'luxon';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  Settings.defaultZone = 'system';
});

describe('Time frame tests', () => {
  beforeEach(() => {
    Settings.defaultZone = 'UTC';
  });
  it('Should return previous time frame (timePeriod: month)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: -1,
      level: getDefaultTimeLevel('month'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-11-01T00:00:00.000Z',
      endTime: '2023-11-30T23:59:59.999Z',
      graphStartTime: '2023-10-31T00:00:00.000Z',
      graphEndTime: '2023-12-01T23:59:59.999Z',
      graphStartLimit: '2023-10-31T12:00:00.000Z',
      graphEndLimit: '2023-11-30T11:59:59.999Z',
    });
  });

  it('Should return current time frame (timePeriod: month)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('month'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-11-21T00:00:00.000Z',
      endTime: '2023-12-21T23:59:59.999Z',
      graphStartTime: '2023-11-20T00:00:00.000Z',
      graphEndTime: '2023-12-21T23:59:59.999Z',
      graphStartLimit: '2023-11-20T12:00:00.000Z',
      graphEndLimit: '2023-12-21T11:59:59.999Z',
    });
  });

  it('Should return previous time frame in local timezone', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));
    Settings.defaultZone = 'Europe/Helsinki';

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: -1,
      level: getDefaultTimeLevel('month'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-10-31T22:00:00.000Z',
      endTime: '2023-11-30T21:59:59.999Z',
      graphStartTime: '2023-10-30T22:00:00.000Z',
      graphEndTime: '2023-12-01T21:59:59.999Z',
      graphStartLimit: '2023-10-31T10:00:00.000Z',
      graphEndLimit: '2023-11-30T09:59:59.999Z',
    });
  });

  it('Should return current time frame in local timezone', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));
    Settings.defaultZone = 'Europe/Helsinki';

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('month'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-11-20T22:00:00.000Z',
      endTime: '2023-12-21T21:59:59.999Z',
      graphStartTime: '2023-11-19T22:00:00.000Z',
      graphEndTime: '2023-12-21T21:59:59.999Z',
      graphStartLimit: '2023-11-20T10:00:00.000Z',
      graphEndLimit: '2023-12-21T09:59:59.999Z',
    });
  });

  it('Should return previous time frame (timePeriod: day)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'day',
      offsetFromNow: -1,
      level: getDefaultTimeLevel('day'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-12-20T00:00:00.000Z',
      endTime: '2023-12-20T23:59:59.999Z',
      graphStartTime: '2023-12-19T23:30:00.000Z',
      graphEndTime: '2023-12-21T00:29:59.999Z',
      graphStartLimit: '2023-12-19T23:45:00.000Z',
      graphEndLimit: '2023-12-20T23:44:59.999Z',
    });
  });

  it('Should cover local midnight for previous day in non-UTC timezone', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-16T10:00:00.000Z'));
    Settings.defaultZone = 'Europe/Helsinki';

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'day',
      offsetFromNow: -1,
      level: getDefaultTimeLevel('day'),
      showMinAndMax: true,
    };

    // Local Jul 15 00:00 Helsinki = Jul 14 21:00 UTC; ±30m graph padding.
    expect(getTimeFrame(timeFrameOptions)).toEqual({
      startTime: '2026-07-14T21:00:00.000Z',
      endTime: '2026-07-15T20:59:59.999Z',
      graphStartTime: '2026-07-14T20:30:00.000Z',
      graphEndTime: '2026-07-15T21:29:59.999Z',
      graphStartLimit: '2026-07-14T20:45:00.000Z',
      graphEndLimit: '2026-07-15T20:44:59.999Z',
    });

    expect(getReadingsTimeFrame(timeFrameOptions)).toEqual({
      level: '30 minutes',
      startTime: '2026-07-14T20:30:00.000Z',
      endTime: '2026-07-15T21:29:59.999Z',
    });
  });

  it('Should return current time frame (timePeriod: day)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'day',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('day'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-12-20T14:00:00.000Z',
      endTime: '2023-12-21T14:00:00.000Z',
      graphStartTime: '2023-12-20T13:30:00.000Z',
      graphEndTime: '2023-12-21T14:00:00.000Z',
      graphStartLimit: '2023-12-20T13:45:00.000Z',
      graphEndLimit: '2023-12-21T13:45:00.000Z',
    });
  });

  it('Should return previous time frame (timePeriod: week)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'week',
      offsetFromNow: -1,
      level: getDefaultTimeLevel('week'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-12-11T00:00:00.000Z',
      endTime: '2023-12-17T23:59:59.999Z',
      graphStartTime: '2023-12-10T00:00:00.000Z',
      graphEndTime: '2023-12-18T23:59:59.999Z',
      graphStartLimit: '2023-12-10T12:00:00.000Z',
      graphEndLimit: '2023-12-17T11:59:59.999Z',
    });
  });

  it('Should return current time frame (timePeriod: week)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z')); // = THU

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'week',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('week'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-12-15T00:00:00.000Z',
      endTime: '2023-12-21T23:59:59.999Z',
      graphStartTime: '2023-12-14T00:00:00.000Z',
      graphEndTime: '2023-12-21T23:59:59.999Z',
      graphStartLimit: '2023-12-14T12:00:00.000Z',
      graphEndLimit: '2023-12-21T11:59:59.999Z',
    });
  });

  it('Should return previous time frame (timePeriod: year)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'year',
      offsetFromNow: -1,
      level: getDefaultTimeLevel('year'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2022-01-01T00:00:00.000Z',
      endTime: '2022-12-31T23:59:59.999Z',
      graphStartTime: '2021-12-01T00:00:00.000Z',
      graphEndTime: '2023-01-31T23:59:59.999Z',
      graphStartLimit: '2021-12-17T00:00:00.000Z',
      graphEndLimit: '2022-12-16T23:59:59.999Z',
    });
  });

  it('Should return current time frame (timePeriod: year)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'year',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('year'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-01-01T00:00:00.000Z',
      endTime: '2023-12-31T23:59:59.999Z',
      graphStartTime: '2022-12-01T00:00:00.000Z',
      graphEndTime: '2023-12-31T23:59:59.999Z',
      graphStartLimit: '2022-12-17T00:00:00.000Z',
      graphEndLimit: '2023-12-16T23:59:59.999Z',
    });
  });

  it('Should return timestamp range for 30-minute reading queries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'day',
      offsetFromNow: 0,
      level: '30 minutes',
      showMinAndMax: true,
    };

    return expect(getReadingsTimeFrame(timeFrameOptions)).toEqual({
      level: '30 minutes',
      startTime: '2023-12-20T13:30:00.000Z',
      endTime: '2023-12-21T14:00:00.000Z',
    });
  });

  it('Should return date range for day, week and month reading queries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: -1,
      level: 'day',
      showMinAndMax: true,
    };

    return expect(getReadingsTimeFrame(timeFrameOptions)).toEqual({
      level: 'day',
      startDate: '2023-10-31',
      endDate: '2023-12-01',
    });
  });

  it('Should return period bounds for 30-minute statistics queries', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'day',
      offsetFromNow: 0,
      level: '30 minutes',
    };

    return expect(getStatisticsTimeFrame(timeFrameOptions)).toEqual({
      startTime: '2023-12-20T14:00:00.000Z',
      endTime: '2023-12-21T14:00:00.000Z',
    });
  });

  it('Should return period date bounds for statistics', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: -1,
      level: 'day',
    };

    return expect(getStatisticsTimeFrame(timeFrameOptions)).toEqual({
      startDate: '2023-11-01',
      endDate: '2023-11-30',
    });
  });

  it('Should format graph hover keys to match API reading timestamps', () => {
    expect(
      toGraphHoverKey(new Date('2023-12-21T14:30:00.000Z'), '30 minutes', 'UTC')
    ).toBe('2023-12-21T14:30:00.000Z');

    expect(
      toGraphHoverKey(new Date('2023-12-21T15:00:00.000Z'), 'day', 'UTC')
    ).toBe('2023-12-21');

    expect(
      toGraphHoverKey(new Date('2023-12-21T15:00:00.000Z'), 'month', 'UTC')
    ).toBe('2023-12-01');
  });

  it('Should use device timezone for graph hover keys and positions', () => {
    const helsinki = 'Europe/Helsinki';
    const june13Helsinki = DateTime.fromISO('2026-06-13T00:00:00', {
      zone: helsinki,
    }).toJSDate()!;

    expect(toGraphHoverKey(june13Helsinki, 'day', helsinki)).toBe('2026-06-13');
    expect(
      parseGraphTimestamp('2026-06-13', 'day', helsinki).toISOString()
    ).toBe('2026-06-12T21:00:00.000Z');
  });
});

describe('getTimeFrameStaleTime', () => {
  beforeEach(() => {
    Settings.defaultZone = 'UTC';
  });

  it('returns 0 for the current period', () => {
    expect(getTimeFrameStaleTime(0, 'day')).toBe(0);
    expect(getTimeFrameStaleTime(0, 'week')).toBe(0);
  });

  it('returns 10 minutes shortly after any previous period ends', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-01T00:05:00.000Z'));

    expect(getTimeFrameStaleTime(-1, 'day')).toBe(10 * 60 * 1000);
    expect(getTimeFrameStaleTime(-1, 'month')).toBe(10 * 60 * 1000);

    vi.setSystemTime(new Date('2026-01-05T00:05:00.000Z'));
    expect(getTimeFrameStaleTime(-1, 'week')).toBe(10 * 60 * 1000);
  });

  it('returns Infinity once the previous period has been closed for a while', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-15T12:00:00.000Z'));

    expect(getTimeFrameStaleTime(-1, 'month')).toBe(Infinity);

    vi.setSystemTime(new Date('2026-01-15T12:00:00.000Z'));
    expect(getTimeFrameStaleTime(-1, 'day')).toBe(Infinity);
    expect(getTimeFrameStaleTime(-1, 'week')).toBe(Infinity);
  });

  it('returns Infinity for older offsets', () => {
    expect(getTimeFrameStaleTime(-2, 'day')).toBe(Infinity);
  });
});
