export const colorGradient = humidity => {
  if (humidity <= 995) return 1;
  if (humidity <= 1000) return 2;
  if (humidity <= 1005) return 3;
  if (humidity <= 1010) return 4;
  if (humidity <= 1015) return 5;
  if (humidity <= 1020) return 6;
  if (humidity > 1020) return 7;
};
