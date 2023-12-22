export const colorGradient = humidity => {
  if (humidity <= 15) return 1;
  if (humidity <= 30) return 2;
  if (humidity <= 45) return 3;
  if (humidity <= 60) return 4;
  if (humidity <= 75) return 5;
  if (humidity <= 90) return 6;
  if (humidity > 90) return 7;
};
