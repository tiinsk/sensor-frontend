import React  from 'react';
import styled from 'styled-components/macro';
import PropTypes from "prop-types";
import { useHistory } from 'react-router-dom';
import {removeJWTToken} from "../../utils/auth";

import HeaderLogo from "./header-logo";
import HeaderLink from "./header-link";
import MobileHeaderMenu from "./mobile-header-menu";
import DeviceSummaryDetails from "../deviceSummary/device-summary-details";

export const StyledHeaderUl = styled.ul`
  display: flex;
  margin-top: ${props => props.theme.baseSizePartial(0.5)};
  margin-bottom: ${props => props.theme.baseSize};  
`;

const StyledLogoutButton = styled.button`
  background: none;
  border: none;
  margin-left: auto;
  padding: ${({theme}) => theme.baseSizePartial(0.5)};
  outline: none;
  
  color: ${({theme}) => theme.colors.lightBlue};
  text-transform: uppercase;
  
  cursor: pointer;
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    display: none;
  }
`;

const AppHeader = ({devices}) => {
  const history = useHistory();

  const links = [
    {
      title: "Home",
      to: "/"
    }
  ];

  devices.forEach(device => {
    links.push({
      title: device.name,
      to: `/devices/${device.id}`
    });
  });

  const onLogout = () => {
    removeJWTToken();
    history.replace('/login');
  }

  return (
    <ul>
      <MobileHeaderMenu links={links} onLogout={onLogout}/>
      <StyledHeaderUl>
        <HeaderLogo/>
        {
          links.map(link => (
            <HeaderLink
              key={link.to}
              title={link.title}
              to={link.to}
            />
          ))
        }
        <StyledLogoutButton onClick={onLogout}>Logout</StyledLogoutButton>
      </StyledHeaderUl>
    </ul>
  );
}

DeviceSummaryDetails.propTypes = {
  devices: PropTypes.array,
};

DeviceSummaryDetails.defaultProps = {
  devices: [],
};

export default AppHeader;
