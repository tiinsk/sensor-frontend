import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getReadingsTimeFrame,
  getStatisticsTimeFrame,
  getTimeFrame,
  parseGraphTimestamp,
  toGraphHoverKey,
} from './time-frames';
import { TimeFrameOptions } from './time-frame-selector';
import { getDefaultTimeLevel } from '../../utils/time-frame';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Time frame tests', () => {
  it('Should return previous time frame (timePeriod: month)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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

  it('Should return previous time frame when timezone is not UTC', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-120);

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

  it('Should return current time frame when timezone is not UTC', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-120);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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

  it('Should return current time frame (timePeriod: day)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-21T13:30Z'));
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(0);

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
      toGraphHoverKey(new Date('2023-12-21T14:30:00.000Z'), '30 minutes')
    ).toBe('2023-12-21T14:30:00.000Z');

    expect(toGraphHoverKey(new Date('2023-12-21T15:00:00.000Z'), 'day')).toBe(
      '2023-12-21'
    );

    expect(toGraphHoverKey(new Date('2023-12-21T15:00:00.000Z'), 'month')).toBe(
      '2023-12-01'
    );
  });

  it('Should use local calendar dates for hover keys east of UTC', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-180);

    // Local 13 Jun 2026 00:00 in UTC+3 is still 12 Jun in UTC.
    const localJune13Midnight = new Date(2026, 5, 13);

    expect(toGraphHoverKey(localJune13Midnight, 'day')).toBe('2026-06-13');
    expect(parseGraphTimestamp('2026-06-13', 'day').getTime()).toBe(
      localJune13Midnight.getTime()
    );
  });
});
