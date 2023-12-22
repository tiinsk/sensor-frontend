import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import humLogo from '../../assets/icons/humidity.svg';

const StyledDeviceHumidityDiv = styled.div`
  grid-area: humidity;

  font-family: ${props => props.theme.fontTitle};
  color: white;
  font-size: 1.8rem;
  white-space: nowrap;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: ${props => props.theme.breakpointMobile}) {
    justify-content: flex-start;
  }
`;

const StyledHumidityImg = styled.img`
  margin-right: ${props => props.theme.baseSizePartial(0.5)};
`;

class DeviceSummaryHumidity extends Component {
  render() {
    const roundedHumidity = `${
      this.props.humidity ? this.props.humidity.toFixed(0) : ' -- '
    } %`;

    return (
      <StyledDeviceHumidityDiv>
        <StyledHumidityImg src={humLogo} alt="humidity" />
        {roundedHumidity}
      </StyledDeviceHumidityDiv>
    );
  }
}

DeviceSummaryHumidity.propTypes = {
  humidity: PropTypes.number,
};

DeviceSummaryHumidity.defaultProps = {
  humidity: 0,
};

export default DeviceSummaryHumidity;
