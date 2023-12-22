import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import logo from '../../assets/icons/home-logo.svg';

export const StyledHeaderLogo = styled.li`
  flex-grow: 1;
  max-width: 400px;
  list-style: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

const StyledLogoSpan = styled.h1`
  text-decoration: none;
`;


class HeaderLogo extends Component {
  render() {
    return (
      <StyledHeaderLogo>
        <StyledLink to="/">
          <img src={logo} alt="" />
          <StyledLogoSpan>Home monitor</StyledLogoSpan>
        </StyledLink>
      </StyledHeaderLogo>
    );
  }
}

export default HeaderLogo;
