import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { NavLink } from "react-router-dom";

const StyledHeaderLi = styled.li`
  display: flex;
  align-items: center;
  
  margin-left: ${props => props.theme.baseSize};
  white-space: nowrap;
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    display: none;
  }
`;

const StyledLink = styled(NavLink)`
  display: block;

  text-decoration: none;
  color: ${props => props.theme.colors.lightBlue};
  font-family: ${props => props.theme.fontTitle};
  font-weight: ${props => props.theme.fontWeightRegular};
  font-size: ${props => props.theme.fontSizeLarge};
  padding: ${props => props.theme.baseSizePartial(0.25)} ${props => props.theme.baseSizePartial(0.5)};
  
  &.active {
    color: ${props => props.theme.colors.lightBlueBrighter};
    font-weight: ${props => props.theme.fontWeightBold};
    border-bottom: 2px solid ${props => props.theme.colors.greenBright};
  }
`;


class HeaderLink extends Component {
  render() {
    return (
      <StyledHeaderLi>
        <StyledLink
          to={this.props.to}
          activeClassName="active"
          exact
        >
          {this.props.title}
        </StyledLink>
      </StyledHeaderLi>
    );
  }
}

HeaderLink.propTypes = {
  title: PropTypes.string,
  to: PropTypes.string
};

HeaderLink.defaultProps = {
  title: '',
  to: '/'
};

export default HeaderLink;
