import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
    color: ${({ theme }) => theme.colors.typography.primary};
    width: 100vw;
    overflow-x: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.background.secondary};
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
    color: ${({ theme }) => theme.colors.typography.primary};
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
