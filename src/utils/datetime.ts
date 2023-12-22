import { DateTime } from 'luxon';

export const roundToNearestHalfHour = (dateISOString: string) => {
  const rounded = new Date(dateISOString);
  rounded.setMilliseconds(Math.round(rounded.getMilliseconds() / 1000) * 1000);
  rounded.setSeconds(Math.round(rounded.getSeconds() / 60) * 60);
  rounded.setMinutes(Math.round(rounded.getMinutes() / 30) * 30);
  return rounded.toISOString();
};

const units: Intl.RelativeTimeFormatUnit[] = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
];

export const getTimeAgoString = (date: string) => {
  let dateTime = DateTime.fromISO(date);
  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find(unit => diff.get(unit) !== 0) || 'second';

  const relativeFormatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'always',
  });
  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};

export const getUTCTime = (date: string) => {
  return DateTime.fromISO(date).toUTC().toISO()!;
};
