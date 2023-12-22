import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import logoInside from '../../assets/icons/loaction-types/inside.svg';
import logoOutside from '../../assets/icons/loaction-types/outside.svg';

const StyledDeviceSLogo = styled.div`
  grid-area: logo;
  align-self: center;

  display: flex;
  justify-content: center;
  align-items: center;

  background: ${props => props.theme.colors.darkBlueDarker};

  height: 45px;
  width: 45px;
  border-radius: 50%;
  padding: ${props => props.theme.baseSizePartial(0.5)};
  margin-right: ${props => props.theme.baseSize};
`;

class DeviceLogo extends Component {
  render() {
    return (
      <StyledDeviceSLogo>
        <img src={this.props.isInside ? logoInside : logoOutside} alt="" />
      </StyledDeviceSLogo>
    );
  }
}

DeviceLogo.propTypes = {
  isInside: PropTypes.bool,
};

DeviceLogo.defaultProps = {
  isInside: true,
};

export default DeviceLogo;
