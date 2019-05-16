export const roundToNearestHalfHour = (dateISOString) => {
  const rounded = new Date(dateISOString);
  rounded.setMilliseconds(Math.round(rounded.getMilliseconds() / 1000) * 1000);
  rounded.setSeconds(Math.round(rounded.getSeconds() / 60) * 60);
  rounded.setMinutes(Math.round(rounded.getMinutes() / 30) * 30);
  return rounded.toISOString()
};
