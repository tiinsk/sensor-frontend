import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import DeviceSummaryTitle from "../common/device-summary-title";
import DeviceSummaryDetails from "./device-summary-details";

const StyledDeviceSummaryItem = styled.div`
  &:not(:last-of-type) {
    margin-bottom: ${props => props.theme.baseSize};
  }
`;

class DeviceSummaryItem extends Component {
  render() {
    return (
      <StyledDeviceSummaryItem>
        <DeviceSummaryTitle
          name={this.props.device.name}
          deviceId={this.props.device.deviceId}
          temperature={this.props.device.temperature}
          maxTemperature={this.props.device.max_temperature}
          minTemperature={this.props.device.min_temperature}
          humidity={this.props.device.humidity}
          pressure={this.props.device.pressure}
          isInside={this.props.device.location_type === 'inside'}
          sensors={this.props.device.sensor_info ? this.props.device.sensor_info.sensors: []}
          timestamp={this.props.device.created_at}
        />
        <DeviceSummaryDetails
          device={this.props.device}
          details={this.props.details}
          sensors={this.props.device.sensor_info ? this.props.device.sensor_info.sensors: []}
        />
      </StyledDeviceSummaryItem>
    );
  }
}

DeviceSummaryItem.propTypes = {
  device: PropTypes.object,
  details: PropTypes.object
};

DeviceSummaryItem.defaultProps = {
  device: {},
  details: {}
};

export default DeviceSummaryItem;
