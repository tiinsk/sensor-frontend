import React, { Component } from 'react';
import styled from 'styled-components/macro';
import HeaderLogo from "./header-logo";
import HeaderLink from "./header-link";
import MobileHeaderMenu from "./mobile-header-menu";
import PropTypes from "prop-types";
import DeviceSummaryDetails from "../deviceSummary/device-summary-details";


const StyledHeaderUl = styled.ul`
  display: flex;
  margin-top: ${props => props.theme.baseSizePartial(0.5)};
  margin-bottom: ${props => props.theme.baseSize};  
`;




class AppHeader extends Component {
  render() {

    const links = [
      {
        title: "Home",
        to: "/"
      }
    ];

    this.props.devices.forEach(device => {
      links.push({
        title: device.name,
        to: `/devices/${device.id}`
      });
    });

    return (
      <ul>
        <MobileHeaderMenu links={links}/>
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
        </StyledHeaderUl>
      </ul>
    );
  }
}

DeviceSummaryDetails.propTypes = {
  devices: PropTypes.array,
};

DeviceSummaryDetails.defaultProps = {
  devices: [],
};

export default AppHeader;
