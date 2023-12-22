const primitiveColors = {
  air: {
    '110': '#6B40E5',
    '100': '#7747FF',
    '50': '#7747FF80',
    '20': '#3478FC80',
    '10': '#304CE04D',
  },
  water: {
    '100': '#01B8F2',
    '50': '#01B8F280',
    '20': '#34CCFC80',
    '10': '#13AFE04D',
  },
  error: {
    '130': '#930336',
    '100': '#D2044D',
    '50': '#E882A6',
    '10': '#FAE6ED',
  },
  success: {
    '130': '#117600',
    '100': '#18A800',
    '50': '#8BD480',
    '10': '#E8F6E5',
  },
  warn: {
    '130': '#A04800',
    '100': '#E56700',
    '50': '#F2B380',
    '10': '#FCF0E5',
  },
  neutral: {
    filled: {
      '100': '#000000',
      '90': '#1A1A1A',
      '80': '#333333',
      '70': '#4D4D4D',
      '60': '#666666',
      '50': '#808080',
      '40': '#999999',
      '30': '#B2B2B2',
      '20': '#CCCCCC',
      '10': '#E5E5E5',
      '08': '#EBEBEB',
      '02': '#FAFAFA',
      '00': '#FFFFFF',
    },
    dark: {
      '90': '#000000E6',
      '80': '#000000CC',
      '70': '#000000B3',
      '60': '#00000099',
      '50': '#00000080',
      '40': '#00000066',
      '30': '#0000004D',
      '20': '#00000033',
      '10': '#0000001A',
      '08': '#00000014',
      '02': '#00000005',
    },
    light: {
      '90': '#FFFFFF1A',
      '80': '#FFFFFF33',
      '70': '#FFFFFF4D',
      '60': '#FFFFFF66',
      '50': '#FFFFFF80',
      '40': '#FFFFFF99',
      '30': '#FFFFFFB3',
      '20': '#FFFFFFCC',
      '10': '#FFFFFFE6',
      '08': '#FFFFFFEB',
      '02': '#FFFFFFFA',
    },
  },
};

export const lightColors = {
  background: {
    primary: primitiveColors.neutral.filled['00'],
    secondary: primitiveColors.neutral.filled['02'],
    disabled: primitiveColors.neutral.dark['08'],
    tertiary: primitiveColors.neutral.dark['08'],
  },
  icons: {
    primary: primitiveColors.neutral.filled['100'],
    background: primitiveColors.neutral.filled['00'],
    error: primitiveColors.error['100'],
    air: primitiveColors.air['100'],
    success: primitiveColors.success['100'],
    primaryDisabled: primitiveColors.neutral.filled['50'],
    successDisabled: primitiveColors.success['50'],
  },
  buttons: {
    background: {
      primary: primitiveColors.neutral.filled['90'],
      secondary: primitiveColors.neutral.filled['08'],
      primaryDisabled: primitiveColors.neutral.filled['50'],
      secondaryDisabled: primitiveColors.neutral.dark['02'],
    },
    backgroundHover: {
      primary: primitiveColors.neutral.filled['100'],
      secondary: primitiveColors.neutral.filled['10'],
      basic: primitiveColors.neutral.filled['08'],
    },
    typography: {
      primary: primitiveColors.neutral.filled['00'],
      secondary: primitiveColors.neutral.filled['100'],
    },
  },
  typography: {
    primary: primitiveColors.neutral.filled['100'],
    secondary: primitiveColors.neutral.filled['60'],
    disabled: primitiveColors.neutral.filled['50'],
    base: primitiveColors.neutral.filled['00'],
  },
  borders: {
    primary: primitiveColors.neutral.dark['20'],
    primaryHover: primitiveColors.neutral.dark['80'],
    secondary: primitiveColors.neutral.dark['08'],
    secondaryHover: primitiveColors.neutral.dark['10'],
  },
  error: {
    background: primitiveColors.error['10'],
    typography: primitiveColors.error['130'],
    plain: primitiveColors.error['100'],
  },
  graphs: {
    background: {
      temperature: primitiveColors.neutral.dark['08'],
      temperatureHover: primitiveColors.neutral.dark['20'],
      air: primitiveColors.air['20'],
      airHover: primitiveColors.air['50'],
      water: primitiveColors.water['20'],
      waterHover: primitiveColors.water['50'],
    },
    line: {
      air: primitiveColors.air['10'],
      water: primitiveColors.water['10'],
    },
    point: {
      air: primitiveColors.air['100'],
      water: primitiveColors.water['100'],
    },
    map: {
      line: {
        primary: primitiveColors.neutral.filled['20'],
        secondary: primitiveColors.neutral.filled['08'],
      },
    },
    lines: {
      temperature: [
        '#8B18DA',
        '#E93D5C',
        '#EE410A',
        '#FFB800',
        '#23D23F',
        '#00AEF9',
        '#2718CB',
      ],
    },
  },
  shadows: {
    boxShadow: `0px 4px 30px 0px rgba(0, 0, 0, 0.05)`,
    boxShadowHover: `0px 4px 30px 0px rgba(0, 0, 0, 0.08)`,
  },
};

export type ColorTheme = typeof lightColors;

export const darkColors: ColorTheme = {
  background: {
    primary: primitiveColors.neutral.filled['100'],
    secondary: primitiveColors.neutral.filled['90'],
    disabled: primitiveColors.neutral.light['80'],
    tertiary: primitiveColors.neutral.light['80'],
  },
  icons: {
    primary: primitiveColors.neutral.filled['00'],
    background: primitiveColors.neutral.dark['90'],
    error: primitiveColors.error['100'],
    air: primitiveColors.air['100'],
    success: primitiveColors.success['100'],
    primaryDisabled: primitiveColors.neutral.filled['50'],
    successDisabled: primitiveColors.success['50'],
  },
  buttons: {
    background: {
      primary: primitiveColors.air['100'],
      secondary: primitiveColors.neutral.filled['80'],
      primaryDisabled: primitiveColors.air['50'],
      secondaryDisabled: primitiveColors.neutral.filled['90'],
    },
    backgroundHover: {
      primary: primitiveColors.air['110'],
      secondary: primitiveColors.neutral.filled['70'],
      basic: primitiveColors.neutral.filled['80'],
    },
    typography: {
      primary: primitiveColors.neutral.filled['00'],
      secondary: primitiveColors.neutral.filled['00'],
    },
  },
  typography: {
    primary: primitiveColors.neutral.filled['00'],
    secondary: primitiveColors.neutral.filled['30'],
    disabled: primitiveColors.neutral.filled['50'],
    base: primitiveColors.neutral.filled['100'],
  },
  borders: {
    primary: primitiveColors.neutral.light['80'],
    primaryHover: primitiveColors.neutral.filled['30'],
    secondary: primitiveColors.neutral.light['90'],
    secondaryHover: primitiveColors.neutral.light['90'],
  },
  error: {
    background: primitiveColors.error['130'],
    typography: primitiveColors.error['10'],
    plain: primitiveColors.error['100'],
  },
  graphs: {
    background: {
      temperature: primitiveColors.neutral.light['80'],
      temperatureHover: primitiveColors.neutral.light['70'],
      air: primitiveColors.air['20'],
      airHover: primitiveColors.air['50'],
      water: primitiveColors.water['20'],
      waterHover: primitiveColors.water['50'],
    },
    line: {
      air: primitiveColors.air['10'],
      water: primitiveColors.water['10'],
    },
    point: {
      air: primitiveColors.air['100'],
      water: primitiveColors.water['100'],
    },
    map: {
      line: {
        primary: primitiveColors.neutral.filled['70'],
        secondary: primitiveColors.neutral.filled['80'],
      },
    },
    lines: {
      temperature: [
        '#8B18DA',
        '#E93D5C',
        '#EE410A',
        '#FFB800',
        '#23D23F',
        '#00AEF9',
        '#2718CB',
      ],
    },
  },
  shadows: {
    boxShadow: `0px 4px 30px 0px rgba(255, 255, 255, 0.06)`,
    boxShadowHover: `0px 4px 30px 0px rgba(255, 255, 255, 0.13)`,
  },
};
