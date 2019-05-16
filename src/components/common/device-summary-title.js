import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from "prop-types";
import DeviceLogo from "../deviceSummary/device-logo";
import DeviceSummaryTemperature from "../deviceSummary/device-summary-temperature";
import DeviceSummaryHumidity from "./device-summary-humidity";

const StyledSummaryTitleDiv = styled.div`
  background: ${props => props.theme.colors.darkBlue};
  
  border-radius: 3px;
  padding: ${props => props.theme.baseSizePartial(3/4)} ${props => props.theme.baseSize};
  
  position: relative;
  z-index: 1;
  
  display: grid;
  grid-template-areas: 
    "logo title temperature humidity"
    "logo title temperature humidity";
  grid-template-columns: fit-content(30%) minmax(15%, 200px) 1fr 2fr;
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    grid-template-areas: 
      "logo title temperature"
      "logo humidity temperature";
    grid-template-columns: fit-content(30%) 1fr fit-content(15%);
  }
`;

const StyledDeviceTitleH2 = styled.h2`
  grid-area: title;

  margin-right: ${props => props.theme.baseSize};  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    margin-top: ${props => props.theme.baseSizePartial(0.5)};
  }
`;

const DeviceSummaryTitle = props => {
  return(
    <StyledSummaryTitleDiv>
      <DeviceLogo isInside={props.isInside}/>
      <StyledDeviceTitleH2>
        {props.name}
      </StyledDeviceTitleH2>
      <DeviceSummaryTemperature
        temperature={props.temperature}
        maxTemperature={props.maxTemperature}
        minTemperature={props.minTemperature}
        timestamp={props.timestamp}
      />
      {
        props.sensors.includes('humidity') ?
        <DeviceSummaryHumidity
          humidity={props.humidity}
        /> : ''
      }
    </StyledSummaryTitleDiv>
  );
};

DeviceSummaryTitle.propTypes = {
  name: PropTypes.string,
  deviceId: PropTypes.string,
  temperature: PropTypes.number,
  maxTemperature: PropTypes.number,
  minTemperature: PropTypes.number,
  humidity: PropTypes.number,
  pressure: PropTypes.number,
  isInside: PropTypes.bool,
  sensors: PropTypes.array,
  timestamp: PropTypes.string
};

DeviceSummaryTitle.defaultProps = {
  name: '',
  deviceId: '',
  temperature: 0,
  maxTemperature: 0,
  minTemperature: 0,
  humidity: 0,
  pressure: 0,
  isInside: true,
  sensors: [],
  default: null
};

export default DeviceSummaryTitle;
