import { darkColors, lightColors } from './colors';

export const lightTheme = {
  colors: lightColors,
} as const;

export const darkTheme = {
  colors: darkColors,
} as const;

export type CustomTheme = typeof lightTheme;
