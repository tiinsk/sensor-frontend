import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,700,700i|Lato:100,100i,300,300i,400,400i,700,700i,900,900i|Roboto:300,300i,400,400i');
  
  html {
    font-size: 62.5%;
  }
  
  *{
    box-sizing: border-box;
  }
  
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style-type: none;
    }
  }
`;
