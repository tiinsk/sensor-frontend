import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import AppHeader from './components/header/header';
import { Home } from './containers/home';
import HomeOLD from './containers/home-OLD';
import Device from './containers/device';
import Login from './containers/login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { theme } from './theme';
import api from './api/routes';
import { isLoggedIn } from './utils/auth';
import { GlobalStyle } from './theme/global-style';
import { OldTheme } from './theme/old-theme';

const StyledApp = styled.div``;

export let FORCE_RERENDER;

const App = () => {
  const [forceReRender, setForceReRender] = useState(0);

  FORCE_RERENDER = () => setForceReRender(forceReRender + 1);

  return (
    <ThemeProvider theme={theme}>
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
  );
};

const OldLoggedInRoutes = () => {
  const [devices, setDevices] = useState([]);
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
  const [devices, setDevices] = useState([]);
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
      <Routes>
        <Route path="/" element={<Home />} />
        {/*<Route path="devices/:id" Component={Device} />*/}
      </Routes>
    </>
  );
};

export default App;
