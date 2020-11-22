import React, { Component } from 'react';
import styled, { ThemeProvider } from 'styled-components/macro'
import AppHeader from "./components/header/header";
import Home from "./containers/home";
import Device from "./containers/device";
import {BrowserRouter as Router, Route} from "react-router-dom";
import { theme } from './assets/styles/variables';
import api from "./api/routes";

const StyledApp = styled.div`
  padding: ${props => props.theme.baseSize};
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    padding: ${props => props.theme.baseSizePartial(0.25)};
  }
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      devices: []
    }
  }

  async componentWillMount() {
    const devices = await api.getAllDevices();

    this.setState({
      devices: devices.values
    });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledApp>
          <Router>
            <AppHeader devices={this.state.devices}/>
            <Route exact path="/" component={Home} />
            <Route exact path="/devices/:id" component={Device}/>
          </Router>
        </StyledApp>
      </ThemeProvider>
    );
  }
}

export default App;
