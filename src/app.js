import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import AppHeader from './components/header/header';
import Home from './containers/home';
import Device from './containers/device';
import Login from './containers/login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { theme } from './assets/styles/variables';
import api from './api/routes';
import { isLoggedIn } from './utils/auth';
import { GlobalStyle } from './assets/styles';

const StyledApp = styled.div`
  padding: ${props => props.theme.baseSize};

  @media (max-width: ${props => props.theme.breakpointMobile}) {
    padding: ${props => props.theme.baseSizePartial(0.25)};
  }
`;

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
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<LoggedInRoutes />} />
          </Routes>
        </Router>
      </StyledApp>
    </ThemeProvider>
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
    console.log('FETCH');
    fetchDevices();
  }, []);

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <AppHeader devices={devices} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="devices/:id" Component={Device} />
      </Routes>
    </>
  );
};

export default App;
