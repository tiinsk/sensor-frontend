import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import WebFont from 'webfontloader';

import AppHeader from './components/header/header';
import { Home } from './containers/home';
import HomeOLD from './containers/home-OLD';
import Device from './containers/device';
import Login from './containers/login';
import api from './api/routes';
import { isLoggedIn } from './utils/auth';
import { GlobalStyle } from './theme/global-style';
import { OldTheme } from './theme/old-theme';
import { TopNav } from './components/nav/top-nav';
import { ThemeContextProvider, ThemeProvider } from './contexts/theme-context';
import { DeviceResponse } from './api/types';

WebFont.load({
  google: {
    families: [
      'Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900',
    ],
  },
});

const StyledApp = styled.div``;

export let FORCE_RERENDER: () => void;

const App = () => {
  const [forceReRender, setForceReRender] = useState(0);

  FORCE_RERENDER = () => setForceReRender(forceReRender + 1);

  return (
    <ThemeContextProvider>
      <ThemeProvider>
        <GlobalStyle />
        <StyledApp>
          <Router>
            <Routes>
              <Route path="/old/login" element={<Login />} />
              <Route path="/old/*" element={<OldLoggedInRoutes />} />
              <Route path="/*" element={<LoggedInRoutes />} />
            </Routes>
          </Router>
        </StyledApp>
      </ThemeProvider>
    </ThemeContextProvider>
  );
};

const OldLoggedInRoutes = () => {
  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await api.getAllDevices();
      if (devices && devices.values) {
        setDevices(devices.values);
      }
    };
    fetchDevices();
  }, []);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <OldTheme>
        <AppHeader devices={devices} />
        <Routes>
          <Route path="/" element={<HomeOLD />} />
          <Route path="devices/:id" Component={Device} />
        </Routes>
      </OldTheme>
    </>
  );
};

const LoggedInRoutes = () => {
  const [devices, setDevices] = useState<DeviceResponse[]>([]);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await api.getAllDevices();
      if (devices && devices.values) {
        setDevices(devices.values);
      }
    };
    fetchDevices();
  }, []);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="devices/:id" Component={Device} />*/}
      </Routes>
    </>
  );
};

export default App;
