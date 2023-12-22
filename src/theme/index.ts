import { lightColors, darkColors } from './colors';

const variables = {
  fonts: {
    fontBody: 'Roboto, sans-serif',
    fontHeader: 'Roboto, sans-serif',
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
  breakpoints: {
    xxlgSize: '1900px',
    xlgSize: '1600px',
    lgSize: '1200px',
    mdSize: '999px',
    smSize: '799px',
    xsSize: '499px',
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
  },
  zIndex: {
    menus: 1000,
  },
};

export type Space = keyof (typeof variables)['spacings'];

export const lightTheme = {
  ...variables,
  colors: lightColors,
} as const;

export const darkTheme = {
  ...variables,
  colors: darkColors,
} as const;

export type CustomTheme = typeof lightTheme;
