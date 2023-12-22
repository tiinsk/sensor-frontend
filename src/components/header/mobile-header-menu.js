import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";

import MobileHeaderLink from "./mobile-header-link";
import closeIcon from '../../assets/icons/navigation/close.svg';
import menuIcon from "../../assets/icons/navigation/menu.svg";

const StyledHeaderMenu = styled.div`
  display: none;
  @media (max-width: ${props => props.theme.breakpointMobile}){
    display: block;
  }
`;

const StyledMenuButton = styled.button`
  display: inline-block;
  padding: 12px;
  
  cursor: pointer;
  
  border: none;
  background: none;
  outline: none;
`;

const StyledMobileMenu = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
    
  background: ${props => props.theme.colors.darkBlueDarkest};
  z-index: ${props => props.theme.zIndexMenus};
  
  display: ${props => props.open ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCloseButton = styled.button`
  cursor: pointer;

  border: none;
  background: none;
  outline: none;
  
  padding: ${props => props.theme.baseSizePartial(1)};
  
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledLogoutButton = styled.button`
  background: none;
  border: none;
  padding: ${({theme}) => theme.baseSizePartial(0.5)};
  outline: none;
  
  position: absolute;
  right: 0;
  bottom: 0;
  
  color: ${({theme}) => theme.colors.lightBlue};
  text-transform: uppercase;
  
  cursor: pointer;
`;

class MobileHeaderMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  toggleMenu() {
    if(this.state.open) {
      document.body.classList.remove('mobile-menu-open');
    } else {
      document.body.classList.add('mobile-menu-open');
    }

    this.setState({
      open: !this.state.open
    });
  }

  closeMenu() {
    document.body.classList.remove('mobile-menu-open');
    this.setState({open: false});
  }

  render() {
    return (
      <StyledHeaderMenu>
        <StyledMenuButton onClick={() => this.toggleMenu()}>
          <img src={menuIcon} alt="main menu"/>
        </StyledMenuButton>
        <StyledMobileMenu open={this.state.open}>
          {
            this.props.links.map(link => (
              <MobileHeaderLink
                key={link.to}
                title={link.title}
                to={link.to}
                onClick={() => this.closeMenu()}
              />
            ))
          }
          <StyledCloseButton onClick={() => this.toggleMenu()}>
            <img src={closeIcon} alt="close"/>
          </StyledCloseButton>
          <StyledLogoutButton onClick={() => this.props.onLogout()}>Logout</StyledLogoutButton>
        </StyledMobileMenu>
      </StyledHeaderMenu>
    );
  }
}

MobileHeaderMenu.propTypes = {
  links: PropTypes.array,
  onLogout: PropTypes.func
};

MobileHeaderMenu.defaultProps = {
  links: []
};

export default MobileHeaderMenu;
