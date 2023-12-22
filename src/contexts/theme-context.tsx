import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../theme';

type Theme = 'light' | 'dark';

export interface ThemeContextType {
  changeTheme: (newTheme: Theme) => void;
  theme?: Theme;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  changeTheme: _val => {},
});

export const ThemeContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [themeState, setTheme] = useState<Theme>('light');

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const contextValue = useMemo(
    () => ({
      theme: themeState,
      changeTheme,
    }),
    [themeState]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { theme } = useThemeContext();

  return (
    <>
      <StyledThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        {children}
      </StyledThemeProvider>
    </>
  );
};
