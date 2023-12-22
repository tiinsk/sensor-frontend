import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,700,700i|Lato:100,100i,300,300i,400,400i,700,700i,900,900i|Roboto:300,300i,400,400i');

html {
  font-size: 62.5%;
}

body {
  margin: 0;
  padding: 0;
  background: #2d3246;//#282D41;

  font-family: "Open Sans", sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  &.mobile-menu-open {
    max-height: 100vh;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }
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

h1 {
  font-family: "Lato", sans-serif;
  text-transform: uppercase;
  font-size: 2.3rem;
  font-weight: 300;
  color: white;
  margin: 12.5px 0;
}

h2 {
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 1.8rem;
  color: white;
  margin: 12.5px 0;
}

h3 {
  font-family: "Lato", sans-serif;
  text-transform: uppercase;
  font-size: 1.4rem;
  font-weight: 300;
  color: #8397B1;
}
`;
