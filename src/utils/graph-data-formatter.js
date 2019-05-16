import DateTime from "luxon/src/datetime";
import {groupBy, minBy, reduce} from "lodash";
import {roundToNearestHalfHour} from "./datetime";

export const formatGraphData = (startTimeISO, endTimeISO, temperatures) => {
  const startTime = DateTime.fromISO(roundToNearestHalfHour(startTimeISO));
  const endTime = DateTime.fromISO(roundToNearestHalfHour(endTimeISO));
  const times = [];

  let time = startTime.toUTC();

  //console.log(startTime.toISO(), roundToNearestHalfHour(startTime.toISO()));

  while (time.diff(endTime).milliseconds <= 1) {
    times.push(time.toISO());
    time = time.plus({minutes: 30});
  }

  //console.log("times", times);

  const roundedTemperatures = temperatures.map(t => {
    const rounded = roundToNearestHalfHour(t.created_at);

    return {
      ...t,
      rounded_time: rounded,
      diff_round_time: Math.abs(DateTime.fromISO(t.created_at).diff(DateTime.fromISO(rounded)).milliseconds)
    }
  });

  const grouped = groupBy(roundedTemperatures, 'rounded_time');

  const nearest = reduce(grouped, (acc, timeGroup, time) => {
    acc[time] = minBy(timeGroup, tg => tg.diff_round_time);
    return acc;
  }, {});

  //console.log("nearest", nearest);

  return times.map((time, i) => {
    if (!nearest[time]) {
      return {
        index: i,
        temperature: 0,
        humidity: 0,
        pressure: 0,
        rounded_time: time,

      }
    }
    else return {
      index: i,
      ...nearest[time]
    };
  });
};
