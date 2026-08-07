import { lightColors, darkColors } from './colors';
import { darkTheme as darkThemeV2, lightTheme as lightThemeV2 } from './v2';

const breakpoints = {
  lg: '1200px',
  md: '900px',
  sm: '600px',
};

export const radius = {
  '0': '0',
  '4': '0.4rem',
  '8': '0.8rem',
  '12': '1.2rem',
  '16': '1.6rem',
  '24': '2.4rem',
  full: '9999px',
} as const;

export type Radius = keyof typeof radius;

const variables = {
  pageWidth: '1800px',
  fonts: {
    fontBody: 'Roboto, sans-serif',
    fontHeader: 'Roboto, sans-serif',
    sans: 'Quicksand, sans-serif',
    mono: '"Space Mono", monospace',
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
  breakpoints,
  radius,
  mediaQueries: {
    sm: `@media (max-width: ${breakpoints.sm})`,
    md: `@media (max-width: ${breakpoints.md})`,
    lg: `@media (max-width: ${breakpoints.lg})`,
  },
  spacings: {
    s2: '0.2rem',
    s4: '0.4rem',
    s8: '0.8rem',
    s12: '1.2rem',
    s16: '1.6rem',
    s24: '2.4rem',
    s32: '3.2rem',
    s40: '4.0rem',
    s48: '4.8rem',
    s64: '6.4rem',
    s80: '8.0rem',
    s96: '9.6rem',
    s128: '12.8rem',
    s192: '19.2rem',
    s640: '64.0rem',
  },
  zIndex: {
    menus: 1000,
    snackbar: 1001,
  },
};

export type Space = keyof (typeof variables)['spacings'];

export const lightTheme = {
  ...variables,
  colors: lightColors,
  v2: lightThemeV2,
} as const;

export const darkTheme = {
  ...variables,
  colors: darkColors,
  v2: darkThemeV2,
} as const;

export type CustomTheme = typeof lightTheme & { v2: typeof lightThemeV2 };
