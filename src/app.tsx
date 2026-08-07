import React from 'react';
import styled from 'styled-components';
import { Route, Routes } from 'react-router';
import WebFont from 'webfontloader';

import { Home } from './containers/home';
import { Home as HomeV2 } from './containers/v2/home';
import { Device } from './containers/device';
import { Login } from './containers/login';
import { GlobalStyle } from './theme/global-style';
import { GlobalStyle as GlobalStyleV2 } from './theme/v2/global-style';
import { TopNav } from './components/nav/top-nav';
import { TopNav as TopNavV2 } from './components/nav/v2/top-nav';
import { ThemeContextProvider, ThemeProvider } from './contexts/theme-context';
import { Map } from './containers/map';
import { Admin } from './containers/admin';
import { SnackbarProvider } from './contexts/snackbar-context';
import { ProtectedRoute } from './components/protected-route';

WebFont.load({
  google: {
    families: [
      'Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900',
      'Quicksand:wght@300;400;500;700',
      'Space Mono:wght@400;700',
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
  <>
    <GlobalStyle />
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
  </>
);

const LoggedInLayoutV2 = () => (
  <>
    <GlobalStyleV2 />
    <StyledLoggedInLayout>
      <SnackbarProvider>
        <TopNavV2 />
        <Routes>
          <Route path="/" element={<HomeV2 />} />
        </Routes>
      </SnackbarProvider>
    </StyledLoggedInLayout>
  </>
);

const App = () => (
  <ThemeContextProvider>
    <ThemeProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <>
              <GlobalStyle />
              <Login />
            </>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <LoggedInLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/v2/*"
          element={
            <ProtectedRoute>
              <LoggedInLayoutV2 />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  </ThemeContextProvider>
);

export default App;
