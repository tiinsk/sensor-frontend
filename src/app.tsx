import React from 'react';
import styled from 'styled-components';
import { Route, Routes } from 'react-router';
import WebFont from 'webfontloader';

import { Home } from './containers/home';
import { Device } from './containers/device';
import { Login } from './containers/login';
import { GlobalStyle } from './theme/global-style';
import { TopNav } from './components/nav/top-nav';
import { ThemeContextProvider, ThemeProvider } from './contexts/theme-context';
import { Map } from './containers/map';
import { Admin } from './containers/admin';
import { SnackbarProvider } from './contexts/snackbar-context';
import { ProtectedRoute } from './components/protected-route';

WebFont.load({
  google: {
    families: [
      'Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900',
    ],
  },
});

const StyledLoggedInLayout = styled.div`
  padding: 0 ${({ theme }) => theme.spacings.s48};
  max-width: ${({ theme }) => theme.pageWidth};
  margin: 0 auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 ${({ theme }) => theme.spacings.s8};
  }
`;

const LoggedInLayout = () => (
  <StyledLoggedInLayout>
    <SnackbarProvider>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="devices/:id" element={<Device />} />
        <Route path="map" element={<Map />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </SnackbarProvider>
  </StyledLoggedInLayout>
);

const App = () => (
  <ThemeContextProvider>
    <ThemeProvider>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <LoggedInLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  </ThemeContextProvider>
);

export default App;
