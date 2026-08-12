import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
    width: 100vw;
    overflow-x: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    background-color: ${({ theme }) => theme.v2.colors.surface.base['30']};
  }
  
  p {
    margin: 0;
  }
  
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style-type: none;
    }
  }
  a {
    text-decoration: none;
  }

  [aria-haspopup="listbox"] {
    user-select: none;
  }

  [role="listbox"] {
    outline: 0;
  }

  [role="option"] {
    outline: 0;
  }
`;
