import { TimeFrameOptions, TimePeriod } from './time-frame-selector';
import { DateTime, DateTimeUnit } from 'luxon';

interface TimeFrame {
  startTime: string;
  endTime: string;
  graphStartTime: string;
  graphEndTime: string;
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
      return { weeks: 1 };
    case 'month':
      return { months: 1 };
    case 'year':
      return { months: 12 };
    default:
      return { days: 0 };
  }
};

export const getEndTime = (offsetFromNow: number, timePeriod: TimePeriod) => {
  if (offsetFromNow === 0) {
    return DateTime.now().toUTC().toISO();
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

const roundToNext30Mins = (date: string) => {
  const dateTime = DateTime.fromISO(date);
  const minutes = 30 - (dateTime.minute % 30);
  return dateTime
    .plus({ minutes })
    .set({ second: 0, millisecond: 0 })
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
    return roundToNext30Mins(
      DateTime.now()
        .minus(getTimePeriodMaxUnitAmount(timePeriod))
        .toUTC()
        .toISO()!
    );
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

  return {
    startTime: startTime!,
    endTime: endTime!,
    graphEndTime: graphEndTime!,
    graphStartTime: graphStartTime!,
  };
};
