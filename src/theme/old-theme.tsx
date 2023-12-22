import React from 'react';
import { ThemeProvider } from 'styled-components';

import { theme } from '../assets/styles/variables';

import { GlobalStyle } from '../assets/styles';

export const OldTheme = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme as any}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};
