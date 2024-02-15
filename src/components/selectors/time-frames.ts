import { TimeFrameOptions, TimePeriod } from './time-frame-selector';
import { DateTime, DateTimeUnit } from 'luxon';

interface TimeFrame {
  startTime: string;
  endTime: string;
  graphStartTime: string;
  graphEndTime: string;
  graphStartLimit: string;
  graphEndLimit: string;
}

export const addTimePeriod = (
  date: string,
  timePeriod: TimePeriod,
  addValue: number
) => {
  return DateTime.fromISO(date)
    .plus({
      year: timePeriod === 'year' ? addValue : 0,
      month: timePeriod === 'month' ? addValue : 0,
      week: timePeriod === 'week' ? addValue : 0,
      day: timePeriod === 'day' ? addValue : 0,
    })
    .toUTC()
    .toISO();
};

export const getTimePeriodMaxUnitAmount = (timePeriod: DateTimeUnit) => {
  switch (timePeriod) {
    case 'day':
      return { days: 1 };
    case 'week':
      return { days: 6 };
    case 'month':
      return { months: 1 };
    case 'year':
      return { months: 11 };
    default:
      return { days: 0 };
  }
};

export const getTimePeriodHalfUnitAmount = (timePeriod: DateTimeUnit) => {
  switch (timePeriod) {
    case 'day':
      return { minutes: 15 };
    case 'week':
      return { hours: 12 };
    case 'month':
      return { hours: 12 };
    case 'year':
      return { days: 15 };
    default:
      return { days: 0 };
  }
};

const roundToNext30Mins = (date: string) => {
  const dateTime = DateTime.fromISO(date);
  const minutes = 30 - (dateTime.minute % 30);
  return dateTime
    .plus({ minutes })
    .set({ second: 0, millisecond: 0 })
    .toUTC()
    .toISO();
};

export const getEndTime = (offsetFromNow: number, timePeriod: TimePeriod) => {
  if (offsetFromNow === 0) {
    switch (timePeriod) {
      case 'day':
        return roundToNext30Mins(DateTime.now().toUTC().toISO()!);
      case 'week':
        return DateTime.now().endOf('day').toUTC().toISO();
      case 'month':
        return DateTime.now().endOf('day').toUTC().toISO();
      case 'year':
        return DateTime.now().endOf('month').toUTC().toISO();
    }
  }

  const reducedDate = addTimePeriod(
    DateTime.now().toUTC().toISO()!,
    timePeriod,
    offsetFromNow
  )!;
  return DateTime.fromISO(reducedDate).endOf(timePeriod).toUTC().toISO();
};

export const getGraphEndTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  const endOfPeriod = getEndTime(offsetFromNow, timePeriod)!;

  if (offsetFromNow === 0) {
    return endOfPeriod;
  }

  return DateTime.fromISO(endOfPeriod)
    .plus({
      months: timePeriod === 'year' ? 1 : 0,
      days: ['month', 'week'].includes(timePeriod) ? 1 : 0,
      minutes: timePeriod === 'day' ? 30 : 0,
    })
    .toUTC()
    .toISO();
};

export const getStartTime = (offsetFromNow: number, timePeriod: TimePeriod) => {
  const endTime = getEndTime(offsetFromNow, timePeriod)!;
  const endDateTime = DateTime.fromISO(endTime);
  const endOfPeriod = endDateTime.endOf(timePeriod);

  const isFullTimePeriod = endDateTime
    .toUTC()
    .hasSame(endOfPeriod.toUTC(), 'minute');

  if (offsetFromNow === 0 && !isFullTimePeriod) {
    switch (timePeriod) {
      case 'day':
        return roundToNext30Mins(
          DateTime.now()
            .minus(getTimePeriodMaxUnitAmount(timePeriod))
            .toUTC()
            .toISO()!
        );
      case 'week':
        return DateTime.now()
          .minus(getTimePeriodMaxUnitAmount(timePeriod))
          .startOf('day')
          .toUTC()
          .toISO();
      case 'month':
        return DateTime.now()
          .minus(getTimePeriodMaxUnitAmount(timePeriod))
          .startOf('day')
          .toUTC()
          .toISO();
      case 'year':
        return DateTime.now()
          .minus(getTimePeriodMaxUnitAmount(timePeriod))
          .startOf('month')
          .toUTC()
          .toISO();
    }
  }
  return DateTime.fromISO(endTime).startOf(timePeriod).toUTC().toISO();
};

export const getGraphStartTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  const startTime = getStartTime(offsetFromNow, timePeriod)!;

  return DateTime.fromISO(startTime)
    .minus({
      months: timePeriod === 'year' ? 1 : 0,
      days: ['month', 'week'].includes(timePeriod) ? 1 : 0,
      minutes: timePeriod === 'day' ? 30 : 0,
    })
    .toUTC()
    .toISO();
};

export const getGraphStartLimit = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  const startTime = getStartTime(offsetFromNow, timePeriod)!;

  return DateTime.fromISO(startTime)
    .minus(getTimePeriodHalfUnitAmount(timePeriod))
    .toUTC()
    .toISO();
};

export const getGraphEndLimit = (
  offsetFromNow: number,
  timePeriod: TimePeriod
) => {
  const endTime = getEndTime(offsetFromNow, timePeriod)!;

  return DateTime.fromISO(endTime)
    .minus(getTimePeriodHalfUnitAmount(timePeriod))
    .toUTC()
    .toISO();
};

//Returns all graph related start and end times.
// startTime: date time of the first data point visible in graph
//endTime: date time of the last data point visible in graph
//graphStartTime: date time of the first data point that will be outside the visible graph (so that it looks like that the graph will continue from all left to right without any gap).
//graphEndTime: same as graphStartTime but for end time.
//graphStartLimit: graph x-axis start point. Point where graph's first "hover block" starts, aka (startTime - graphStartTime) / 2.
//graphEndLimit: same as graphStartLimit, but for end time.
export const getTimeFrame = (timeframeOptions: TimeFrameOptions): TimeFrame => {
  const startTime = getStartTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod
  );

  const endTime = getEndTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod
  );

  const graphStartTime = getGraphStartTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod
  );

  const graphEndTime = getGraphEndTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod
  );

  const graphStartLimit = getGraphStartLimit(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod
  );

  const graphEndLimit = getGraphEndLimit(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod
  );

  return {
    startTime: startTime!,
    endTime: endTime!,
    graphEndTime: graphEndTime!,
    graphStartTime: graphStartTime!,
    graphStartLimit: graphStartLimit!,
    graphEndLimit: graphEndLimit!,
  };
};
