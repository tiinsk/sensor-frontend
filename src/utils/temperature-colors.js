import colors from '../assets/styles/colors';

export const color = temperature => {
  if (temperature <= 0) return colors.temperatureColors[6];
  if (temperature <= 5) return colors.temperatureColors[5];
  if (temperature <= 10) return colors.temperatureColors[4];
  if (temperature <= 15) return colors.temperatureColors[3];
  if (temperature <= 20) return colors.temperatureColors[2];
  if (temperature <= 25) return colors.temperatureColors[1];
  if (temperature > 25) return colors.temperatureColors[0];
};

export const colorGradient = temperature => {
  if (temperature <= 2.5) return 5;
  if (temperature <= 7.5) return 4;
  if (temperature <= 12.5) return 3;
  if (temperature <= 17.5) return 2;
  if (temperature <= 22.5) return 1;
  if (temperature > 22.5) return 0;
};
