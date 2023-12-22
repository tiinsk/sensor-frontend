import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const StyledMobileHeaderLi = styled.li`
  display: flex;
  align-items: center;

  white-space: nowrap;

  &:not(:last-of-type) {
    margin-bottom: ${props => props.theme.baseSizePartial(0.5)};
  }
`;

const StyledLink = styled(NavLink)`
  display: block;

  text-decoration: none;
  color: ${props => props.theme.colors.lightBlue};
  font-family: ${props => props.theme.fontTitle};
  font-weight: ${props => props.theme.fontWeightRegular};
  font-size: ${props => props.theme.fontSizeLarge};
  padding: ${props => props.theme.baseSizePartial(0.25)}
    ${props => props.theme.baseSizePartial(0.5)};

  &.active {
    color: ${props => props.theme.colors.lightBlueBrighter};
    font-weight: ${props => props.theme.fontWeightBold};

    border-bottom: 2px solid ${props => props.theme.colors.greenBright};
  }
`;

class MobileHeaderLink extends Component {
  render() {
    return (
      <StyledMobileHeaderLi>
        <StyledLink to={this.props.to} onClick={() => this.props.onClick()}>
          {this.props.title}
        </StyledLink>
      </StyledMobileHeaderLi>
    );
  }
}

MobileHeaderLink.propTypes = {
  title: PropTypes.string,
  to: PropTypes.string,
};

MobileHeaderLink.defaultProps = {
  title: '',
  to: '/',
};

export default MobileHeaderLink;
