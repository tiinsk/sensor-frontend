import React, { Component } from 'react';
import styled from 'styled-components/macro'
import logo from '../assets/images/logo.svg';
import '../App.css';

const AppHeader = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;


class App extends Component {
  render() {
    return (
      <div className="App">
        <AppHeader>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </AppHeader>
      </div>
    );
  }
}

export default App;
