import { DateTime } from 'luxon';
import { groupBy, minBy, reduce } from 'lodash';
import { roundToNearestHalfHour } from './datetime';

export const formatGraphData = (startTimeISO, endTimeISO, temperatures) => {
  const startTime = DateTime.fromISO(roundToNearestHalfHour(startTimeISO));
  const endTime = DateTime.fromISO(roundToNearestHalfHour(endTimeISO));
  const times = [];

  let time = startTime.toUTC();

  while (time.diff(endTime).milliseconds <= 1) {
    times.push(time.toISO());
    time = time.plus({ minutes: 30 });
  }

  const roundedTemperatures = temperatures.map(t => {
    const rounded = roundToNearestHalfHour(t.created_at);

    return {
      ...t,
      rounded_time: rounded,
      diff_round_time: Math.abs(
        DateTime.fromISO(t.created_at).diff(DateTime.fromISO(rounded))
          .milliseconds
      ),
    };
  });

  const grouped = groupBy(roundedTemperatures, 'rounded_time');

  const nearest = reduce(
    grouped,
    (acc, timeGroup, time) => {
      acc[time] = minBy(timeGroup, tg => tg.diff_round_time);
      return acc;
    },
    {}
  );

  return times.reduce((timeArray, time, i) => {
    const diffFromNow = DateTime.fromISO(time).diffNow().milliseconds;

    if (!nearest[time] && diffFromNow <= 0) {
      timeArray.push({
        index: i,
        temperature: 0,
        humidity: 0,
        pressure: 0,
        rounded_time: time,
      });
    } else if (nearest[time]) {
      timeArray.push({
        index: i,
        ...nearest[time],
      });
    }

    return timeArray;
  }, []);
};
