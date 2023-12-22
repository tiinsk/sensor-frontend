import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
    color: ${({ theme }) => theme.colors.typography.primary};
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    padding: 0 ${({ theme }) => theme.spacings.s48};
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
`;
