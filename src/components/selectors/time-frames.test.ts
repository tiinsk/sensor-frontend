import { getDefaultTimeLevel, getTimeFrame } from './time-frames';
import { TimeFrameOptions } from './time-frame-selector';

describe('Time frame tests', () => {
  it('Should return previous time frame (timePeriod: month)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: -1,
      level: getDefaultTimeLevel('day'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-11-01T00:00:00.000Z',
      endTime: '2023-11-30T23:59:59.999Z',
      graphStartTime: '2023-10-31T00:00:00.000Z',
      graphEndTime: '2023-12-01T23:59:59.999Z',
    });
  });

  it('Should return current time frame (timePeriod: month)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('day'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-11-21T13:30:00.000Z',
      endTime: '2023-12-21T13:30:00.000Z',
      graphStartTime: '2023-11-20T13:30:00.000Z',
      graphEndTime: '2023-12-21T13:30:00.000Z',
    });
  });

  it('Should return previous time frame when timezone is not UTC', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => -120);

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
    });
  });

  it('Should return current time frame when timezone is not UTC', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => -120);

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'month',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('day'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-11-21T13:30:00.000Z',
      endTime: '2023-12-21T13:30:00.000Z',
      graphStartTime: '2023-11-20T13:30:00.000Z',
      graphEndTime: '2023-12-21T13:30:00.000Z',
    });
  });

  it('Should return previous time frame (timePeriod: day)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

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
    });
  });

  it('Should return current time frame (timePeriod: day)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'day',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('day'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-12-20T13:30:00.000Z',
      endTime: '2023-12-21T13:30:00.000Z',
      graphStartTime: '2023-12-20T13:00:00.000Z',
      graphEndTime: '2023-12-21T13:30:00.000Z',
    });
  });

  it('Should return previous time frame (timePeriod: week)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

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
    });
  });

  it('Should return current time frame (timePeriod: week)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'week',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('week'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2023-12-14T13:30:00.000Z',
      endTime: '2023-12-21T13:30:00.000Z',
      graphStartTime: '2023-12-13T13:30:00.000Z',
      graphEndTime: '2023-12-21T13:30:00.000Z',
    });
  });

  it('Should return previous time frame (timePeriod: year)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

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
    });
  });

  it('Should return current time frame (timePeriod: year)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-12-21T13:30'));
    Date.prototype.getTimezoneOffset = jest.fn(() => 0);

    const timeFrameOptions: TimeFrameOptions = {
      timePeriod: 'year',
      offsetFromNow: 0,
      level: getDefaultTimeLevel('year'),
      showMinAndMax: true,
    };
    const timeFrame = getTimeFrame(timeFrameOptions);
    return expect(timeFrame).toEqual({
      startTime: '2022-12-21T13:30:00.000Z',
      endTime: '2023-12-21T13:30:00.000Z',
      graphStartTime: '2022-11-21T13:30:00.000Z',
      graphEndTime: '2023-12-21T13:30:00.000Z',
    });
  });
});
