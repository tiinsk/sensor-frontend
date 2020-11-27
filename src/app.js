import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components/macro'
import AppHeader from "./components/header/header";
import Home from "./containers/home";
import Device from "./containers/device";
import Login from "./containers/login";
import {BrowserRouter as Router, Route, Redirect, Switch} from "react-router-dom";
import { theme } from './assets/styles/variables';
import api from "./api/routes";
import {isLoggedIn} from "./utils/auth";

const StyledApp = styled.div`
  padding: ${props => props.theme.baseSize};
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    padding: ${props => props.theme.baseSizePartial(0.25)};
  }
`;

export let FORCE_RERENDER;

const App = () => {
  const [forceReRender, setForceReRender] = useState(0);

  FORCE_RERENDER = () => setForceReRender(forceReRender+1);

  return (
    <ThemeProvider theme={theme}>
      <StyledApp>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login}/>
            <LoggedInRoutes/>
          </Switch>
        </Router>
      </StyledApp>
    </ThemeProvider>
  );
}

const LoggedInRoutes = () => {
  const [devices, setDevices] = useState([]);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await api.getAllDevices();
      if(devices && devices.values) {
        setDevices(devices.values);
      }
    };
    console.log("FETCH");
    fetchDevices();
  }, []);

  if(!loggedIn) {
    return <Redirect to={'/login'}/>
  }

  return (
    <>
      <AppHeader devices={devices}/>
      <Route exact path="/" component={Home} />
      <Route exact path="/devices/:id" component={Device}/>
    </>
  );
}

export default App;
