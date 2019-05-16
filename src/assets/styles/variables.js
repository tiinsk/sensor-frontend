import colors from './colors';

const breakpointMobile = 650;

export const theme = {
  fontTitle: '"Lato", sans-serif',
  fontRoboto: '"Roboto", sans-serif',
  fontBody: '"Open Sans", sans-serif',

  fontWeightThin: '100',
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',
  fontWeightHeavy: '900',

  fontSizeXXLarge: '3rem',
  fontSizeXLarge: '2rem',
  fontSizeLarge: '1.8rem',

  fontSizeDefault: '1.5rem',

  fontSizeMedium: '1.4rem',
  fontSizeSmall: '1.3rem',
  fontSizeXSmall: '1.2rem',
  fontSizeXXSmall: '1.1rem',
  fontSizeXXXSmall: '1rem',

  breakpointMobileValue: breakpointMobile,

  breakpointSmallWindow: '1000px',
  breakpointHomeGraphSmall: '1350px',
  breakpointMobile: `${breakpointMobile}px`,

  baseSize: '25px',
  baseSizePartial: (part) => `${part*25}px`,

  zIndexMenus: '1000',
  colors: colors
};
