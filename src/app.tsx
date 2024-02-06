import React, { useState } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import WebFont from 'webfontloader';

import { Home } from './containers/home';
import { Device } from './containers/device';
import { Login } from './containers/login';
import { isLoggedIn } from './storage/auth';
import { GlobalStyle } from './theme/global-style';
import { TopNav } from './components/nav/top-nav';
import { ThemeContextProvider, ThemeProvider } from './contexts/theme-context';
import { Map } from './containers/map';
import { Admin } from './containers/admin';
import { SnackbarProvider } from './contexts/snackbar-context';

WebFont.load({
  google: {
    families: [
      'Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900',
    ],
  },
});

const StyledLoggedInRoutes = styled.div`
  padding: 0 ${({ theme }) => theme.spacings.s48};
  max-width: ${({ theme }) => theme.pageWidth};
  margin: 0 auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 ${({ theme }) => theme.spacings.s8};
  }
`;

export let FORCE_RERENDER: () => void;

const App = () => {
  const [forceReRender, setForceReRender] = useState(0);

  FORCE_RERENDER = () => setForceReRender(forceReRender + 1);

  return (
    <ThemeContextProvider>
      <ThemeProvider>
        <GlobalStyle />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<LoggedInRoutes />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ThemeContextProvider>
  );
};

const LoggedInRoutes = () => {
  const loggedIn = isLoggedIn();

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <StyledLoggedInRoutes>
      <SnackbarProvider>
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="devices/:id" Component={Device} />
          <Route path="map" Component={Map} />
          <Route path="admin" Component={Admin} />
        </Routes>
      </SnackbarProvider>
    </StyledLoggedInRoutes>
  );
};

export default App;
