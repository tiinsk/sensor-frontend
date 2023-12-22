import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import DetailColumn from "./detail-column";
import Reading from "../common/reading";
import DetailSection from "./detail-section";
import DeviceSummaryTempGraph from "./device-summary-temp-graph";


const StyledDeviceSummaryDetails = styled.div`
  background: ${props => props.theme.colors.darkBlueDarkest};
  
  margin-top: 3px;
  display: flex;
  
  box-shadow: #2A324B 0 2px 26px 12px;
  
  @media (max-width: ${props => props.theme.breakpointHomeGraphSmall}){
    flex-wrap: wrap;
  }
`;

const StyledValues = styled.div`
  width: 50%;
  padding: ${props => props.theme.baseSize};

  display: flex;  
  flex-wrap: wrap;
  justify-content: space-around;
  
  
  @media (max-width: ${props => props.theme.breakpointHomeGraphSmall}){
    flex: 0 0 100%;
  }
`;

class DeviceSummaryDetails extends Component {
  render() {

    return (
      <StyledDeviceSummaryDetails>
        <StyledValues>
          <DetailColumn title="Temperatures">
            <DetailSection>
              <Reading
                unit="temperature"
                period="week"
                type="max"
                value={this.props.details.max_temperature_week}
              />
              <Reading
                unit="temperature"
                period="week"
                type="min"
                value={this.props.details.min_temperature_week}
              />
            </DetailSection>
            <DetailSection>
              <Reading
                unit="temperature"
                period="month"
                type="max"
                value={this.props.details.max_temperature_month}
              />
              <Reading
                unit="temperature"
                period="month"
                type="min"
                value={this.props.details.min_temperature_month}
              />
            </DetailSection>
          </DetailColumn>
          {this.props.sensors.includes('humidity') ?
            <DetailColumn title="Humidity">
              <DetailSection>
              <Reading
              unit="humidity"
              period="week"
              type="max"
              value={this.props.details.max_humidity_week}
              />
              <Reading
              unit="humidity"
              period="week"
              type="min"
              value={this.props.details.min_humidity_week}
              />
              </DetailSection>
              <DetailSection>
              <Reading
              unit="humidity"
              period="month"
              type="max"
              value={this.props.details.max_humidity_month}
              />
              <Reading
              unit="humidity"
              period="month"
              type="min"
              value={this.props.details.min_humidity_month}
              />
              </DetailSection>
            </DetailColumn> : ''
          }
          {this.props.sensors.includes('pressure') ?
            <DetailColumn title="Pressure">
              <DetailSection>
                <Reading
                  unit="pressure"
                  period="week"
                  type="max"
                  value={this.props.details.max_pressure_week}
                />
                <Reading
                  unit="pressure"
                  period="week"
                  type="min"
                  value={this.props.details.min_pressure_week}
                />
              </DetailSection>
              <DetailSection>
                <Reading
                  unit="pressure"
                  period="month"
                  type="max"
                  value={this.props.details.max_pressure_month}
                />
                <Reading
                  unit="pressure"
                  period="month"
                  type="min"
                  value={this.props.details.min_pressure_month}
                />
              </DetailSection>
            </DetailColumn> : ''
          }
        </StyledValues>
        <DeviceSummaryTempGraph
          data={this.props.graphData}
          deviceId={this.props.device.device}
        />
      </StyledDeviceSummaryDetails>
    );
  }
}

DeviceSummaryDetails.propTypes = {
  device: PropTypes.object,
  details: PropTypes.object,
  sensors: PropTypes.array
};

DeviceSummaryDetails.defaultProps = {
  device: {},
  details: {},
  sensors: []
};

export default DeviceSummaryDetails;
