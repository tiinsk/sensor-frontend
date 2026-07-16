import {
  TimeFrameOptions,
  TimeLevel,
  TimePeriod,
} from './time-frame-selector';
import { DateTime, DateTimeUnit } from 'luxon';

const toUtcIso = (dateTime: DateTime): string => dateTime.toUTC().toISO()!;

// Day queries use UTC timestamps. Week/month/year use the viewer's local calendar.
export const getQueryTimezone = (timePeriod: TimePeriod): string =>
  timePeriod === 'day' ? 'UTC' : DateTime.local().zoneName;

const now = (timezone: string): DateTime =>
  DateTime.now().setZone(timezone);

const fromUtcIso = (iso: string, timezone: string): DateTime =>
  DateTime.fromISO(iso, { zone: 'utc' }).setZone(timezone);

const toCalendarDate = (iso: string, timezone: string): string =>
  fromUtcIso(iso, timezone).toISODate()!;

// d3 ticks are instants; map them to the device calendar date used by the API.
export const parseGraphTimestamp = (
  timestamp: string,
  level: TimeLevel,
  timezone: string
): Date => {
  if (level === '30 minutes') {
    return new Date(timestamp);
  }

  return DateTime.fromISO(timestamp, { zone: timezone })
    .startOf('day')
    .toUTC()
    .toJSDate()!;
};

export const toGraphHoverKey = (
  date: Date,
  level: TimeLevel,
  timezone: string
): string => {
  if (level === '30 minutes') {
    return date.toISOString();
  }

  const zoned = DateTime.fromJSDate(date).setZone(timezone);

  if (level === 'month') {
    return zoned.startOf('month').toISODate()!;
  }

  return zoned.toISODate()!;
};

interface TimeFrame {
  startTime: string;
  endTime: string;
  graphStartTime: string;
  graphEndTime: string;
  graphStartLimit: string;
  graphEndLimit: string;
}

export type ReadingsTimeFrame =
  | {
      level: '30 minutes';
      startTime: string;
      endTime: string;
    }
  | {
      level: Exclude<TimeLevel, '30 minutes'>;
      startDate: string;
      endDate: string;
    };

export const addTimePeriod = (
  date: string,
  timePeriod: TimePeriod,
  addValue: number,
  timezone: string
) => {
  return toUtcIso(
    fromUtcIso(date, timezone).plus({
      year: timePeriod === 'year' ? addValue : 0,
      month: timePeriod === 'month' ? addValue : 0,
      week: timePeriod === 'week' ? addValue : 0,
      day: timePeriod === 'day' ? addValue : 0,
    })
  );
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

const roundToNext30Mins = (dateTime: DateTime) => {
  const minutes = 30 - (dateTime.minute % 30);
  return toUtcIso(
    dateTime.plus({ minutes }).set({ second: 0, millisecond: 0 })
  );
};

export const getEndTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod,
  timezone: string
) => {
  if (offsetFromNow === 0) {
    const current = now(timezone);
    switch (timePeriod) {
      case 'day':
        return roundToNext30Mins(current);
      case 'week':
      case 'month':
        return toUtcIso(current.endOf('day'));
      case 'year':
        return toUtcIso(current.endOf('month'));
    }
  }

  const reducedDate = addTimePeriod(
    toUtcIso(now(timezone)),
    timePeriod,
    offsetFromNow,
    timezone
  );
  return toUtcIso(fromUtcIso(reducedDate, timezone).endOf(timePeriod));
};

export const getGraphEndTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod,
  timezone: string
) => {
  const endOfPeriod = getEndTime(offsetFromNow, timePeriod, timezone)!;

  if (offsetFromNow === 0) {
    return endOfPeriod;
  }

  return toUtcIso(
    fromUtcIso(endOfPeriod, timezone).plus({
      months: timePeriod === 'year' ? 1 : 0,
      days: ['month', 'week'].includes(timePeriod) ? 1 : 0,
      minutes: timePeriod === 'day' ? 30 : 0,
    })
  );
};

export const getStartTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod,
  timezone: string
) => {
  const endTime = getEndTime(offsetFromNow, timePeriod, timezone)!;
  const endDateTime = fromUtcIso(endTime, timezone);
  const endOfPeriod = endDateTime.endOf(timePeriod);
  const isFullTimePeriod = endDateTime.hasSame(endOfPeriod, 'minute');

  if (offsetFromNow === 0 && !isFullTimePeriod) {
    const current = now(timezone);
    switch (timePeriod) {
      case 'day':
        return roundToNext30Mins(
          current.minus(getTimePeriodMaxUnitAmount(timePeriod))
        );
      case 'week':
      case 'month':
        return toUtcIso(
          current.minus(getTimePeriodMaxUnitAmount(timePeriod)).startOf('day')
        );
      case 'year':
        return toUtcIso(
          current.minus(getTimePeriodMaxUnitAmount(timePeriod)).startOf('month')
        );
    }
  }

  return toUtcIso(endDateTime.startOf(timePeriod));
};

export const getGraphStartTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod,
  timezone: string
) => {
  const startTime = getStartTime(offsetFromNow, timePeriod, timezone)!;

  return toUtcIso(
    fromUtcIso(startTime, timezone).minus({
      months: timePeriod === 'year' ? 1 : 0,
      days: ['month', 'week'].includes(timePeriod) ? 1 : 0,
      minutes: timePeriod === 'day' ? 30 : 0,
    })
  );
};

export const getGraphStartLimit = (
  offsetFromNow: number,
  timePeriod: TimePeriod,
  timezone: string
) => {
  const startTime = getStartTime(offsetFromNow, timePeriod, timezone)!;

  return toUtcIso(
    fromUtcIso(startTime, timezone).minus(
      getTimePeriodHalfUnitAmount(timePeriod)
    )
  );
};

export const getGraphEndLimit = (
  offsetFromNow: number,
  timePeriod: TimePeriod,
  timezone: string
) => {
  const endTime = getEndTime(offsetFromNow, timePeriod, timezone)!;

  return toUtcIso(
    fromUtcIso(endTime, timezone).minus(getTimePeriodHalfUnitAmount(timePeriod))
  );
};

//Returns all graph related start and end times.
// startTime: date time of the first data point visible in graph
//endTime: date time of the last data point visible in graph
//graphStartTime: date time of the first data point that will be outside the visible graph (so that it looks like that the graph will continue from all left to right without any gap).
//graphEndTime: same as graphStartTime but for end time.
//graphStartLimit: graph x-axis start point. Point where graph's first "hover block" starts, aka (startTime - graphStartTime) / 2.
//graphEndLimit: same as graphStartLimit, but for end time.
export const getTimeFrame = (timeframeOptions: TimeFrameOptions): TimeFrame => {
  const timezone = getQueryTimezone(timeframeOptions.timePeriod);

  const startTime = getStartTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod,
    timezone
  );

  const endTime = getEndTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod,
    timezone
  );

  const graphStartTime = getGraphStartTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod,
    timezone
  );

  const graphEndTime = getGraphEndTime(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod,
    timezone
  );

  const graphStartLimit = getGraphStartLimit(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod,
    timezone
  );

  const graphEndLimit = getGraphEndLimit(
    timeframeOptions.offsetFromNow,
    timeframeOptions.timePeriod,
    timezone
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

export type StatisticsTimeFrame =
  | {
      startTime: string;
      endTime: string;
    }
  | {
      startDate: string;
      endDate: string;
    };

export const getReadingsTimeFrame = (
  timeframeOptions: TimeFrameOptions
): ReadingsTimeFrame => {
  const timezone = getQueryTimezone(timeframeOptions.timePeriod);
  const { graphStartTime, graphEndTime } = getTimeFrame(timeframeOptions);

  if (timeframeOptions.level === '30 minutes') {
    return {
      level: timeframeOptions.level,
      startTime: graphStartTime,
      endTime: graphEndTime,
    };
  }

  return {
    level: timeframeOptions.level,
    startDate: toCalendarDate(graphStartTime, timezone),
    endDate: toCalendarDate(graphEndTime, timezone),
  };
};

// Statistics use period bounds, not graph padding. Readings fetch extra buckets
// on each side so the line chart does not look cut off at the edges; min/max on
// the card should reflect the selected period only.
export const getStatisticsTimeFrame = (
  timeframeOptions: TimeFrameOptions
): StatisticsTimeFrame => {
  const timezone = getQueryTimezone(timeframeOptions.timePeriod);
  const { startTime, endTime } = getTimeFrame(timeframeOptions);

  if (timeframeOptions.level === '30 minutes') {
    return { startTime, endTime };
  }

  return {
    startDate: toCalendarDate(startTime, timezone),
    endDate: toCalendarDate(endTime, timezone),
  };
};

const RECENT_PERIOD_STALE_TIME_MS = 10 * 60 * 1000; // = 10 min

// Current period stays fresh. offset <= -2 is historical. offset -1 is the last
// closed period: late readings can still arrive briefly after any period ends
// (day/week/month/year boundary).
export const getTimeFrameStaleTime = (
  offsetFromNow: number,
  timePeriod: TimePeriod,
  at: DateTime = DateTime.now()
): number => {
  if (offsetFromNow === 0) {
    return 0;
  }

  if (offsetFromNow !== -1) {
    return Infinity;
  }

  const timezone = getQueryTimezone(timePeriod);
  const periodEnd = getEndTime(-1, timePeriod, timezone);
  if (!periodEnd) {
    return RECENT_PERIOD_STALE_TIME_MS;
  }

  const msSincePeriodEnd =
    at.toMillis() - fromUtcIso(periodEnd, timezone).toMillis();

  if (msSincePeriodEnd >= 0 && msSincePeriodEnd < RECENT_PERIOD_STALE_TIME_MS) {
    return RECENT_PERIOD_STALE_TIME_MS;
  }

  return Infinity;
};
