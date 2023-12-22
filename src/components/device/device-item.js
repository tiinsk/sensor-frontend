import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DeviceSummaryTitle from '../common/device-summary-title';
import DeviceExtremeValues from './device-extreme-values';
import DeviceTempGraph from './device-temperature-graph';
import DeviceHumidityGraph from './device-humidity-graph';
import DevicePressureGraph from './device-pressure-graph';

const StyledDeviceItem = styled.div`
  &:not(:last-of-type) {
    margin-bottom: ${props => props.theme.baseSize};
  }
`;

class DeviceItem extends Component {
  render() {
    const sensors = this.props.device.sensor_info
      ? this.props.device.sensor_info.sensors
      : [];
    return (
      <StyledDeviceItem>
        <DeviceSummaryTitle
          name={this.props.device.name}
          deviceId={this.props.device.deviceId}
          temperature={this.props.device.temperature}
          maxTemperature={this.props.device.max_temperature}
          minTemperature={this.props.device.min_temperature}
          humidity={this.props.device.humidity}
          pressure={this.props.device.pressure}
          isInside={this.props.device.location_type === 'inside'}
          sensors={sensors}
        />
        <DeviceExtremeValues
          device={this.props.device}
          details={this.props.details}
          sensors={sensors}
        />
        <DeviceTempGraph
          data={this.props.graphData}
          minGraphWidth={this.props.minGraphWidth}
          loadOlderData={() => this.props.loadOlderData()}
        />
        {sensors.includes('humidity') ? (
          <DeviceHumidityGraph
            data={this.props.graphData}
            minGraphWidth={this.props.minGraphWidth}
            loadOlderData={() => this.props.loadOlderData()}
          />
        ) : (
          ''
        )}
        {sensors.includes('pressure') ? (
          <DevicePressureGraph
            data={this.props.graphData}
            minGraphWidth={this.props.minGraphWidth}
            loadOlderData={() => this.props.loadOlderData()}
          />
        ) : (
          ''
        )}
      </StyledDeviceItem>
    );
  }
}

DeviceItem.propTypes = {
  device: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  graphData: PropTypes.array.isRequired,
  minGraphWidth: PropTypes.number.isRequired,
  loadOlderData: PropTypes.func.isRequired,
};

export default DeviceItem;
