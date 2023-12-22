import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from "prop-types";
import triangleDownIcon from '../../assets/icons/value-types/triangle-down.svg';
import triangleUpIcon from '../../assets/icons/value-types/triangle-up.svg';
import warningYellow from '../../assets/icons/warnings/warning-yellow.svg';
import warningRed from '../../assets/icons/warnings/warning-red.svg';
import warningOrange from '../../assets/icons/warnings/warning-orange.svg';
import {DateTime} from "luxon";


const StyledDeviceTempDiv = styled.div`
  grid-area: temperature; 
  
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  @media (max-width: ${props => props.theme.breakpointMobile}){
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

const StyledDeviceTempSpan = styled.span`
  font-family: ${props => props.theme.fontTitle};
  color: white;
  font-size: 3.4rem;
  //margin-right: ${props => props.theme.baseSize_1_2};
  white-space: nowrap;
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    font-size: 3.0rem;
    margin: ${props => props.theme.baseSizePartial(0.25)} 0;
  }
`;

const StyledUltimateWrapperDiv = styled.div`
  flex-grow: 1;
  justify-content: space-evenly;
  
  display: flex;
  
  @media (max-width: ${props => props.theme.breakpointSmallWindow}){
    flex-wrap: wrap;
  }
  @media (max-width: ${props => props.theme.breakpointMobile}){
    justify-content: flex-end;
  }
`;

const StyledDeviceUltimateTempSpan = styled.span`
  font-family: ${props => props.theme.fontTitle};
  color: white;
  font-size: ${props => props.theme.fontSizeDefault};
  font-weight: ${props => props.theme.fontWeightLight};
  margin-left: ${props => props.theme.baseSizePartial(0.5)};
  white-space: nowrap;
  
  img {
    margin-right: 5px;
  }
  
  @media (max-width: ${props => props.theme.breakpointSmallWindow}){
    margin-top:  2px;
    margin-bottom:  2px;
  }
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    margin-right: 0;
  }
`;

const StyledWarning = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
`;

class DeviceSummaryTemperature extends Component {

  render() {
    const roundedTemp = `${this.props.temperature ? this.props.temperature.toFixed(1) : ' -- '} °C`;
    const roundedMaxTemp = `${this.props.maxTemperature ? this.props.maxTemperature.toFixed(1) : ' -- '} °C`;
    const roundedMinTemp = `${this.props.minTemperature ? this.props.minTemperature.toFixed(1) : ' -- '} °C`;

    const timeDiff = Math.abs(DateTime.fromISO(this.props.timestamp).diffNow('minutes').minutes);

    let warning = '';

    const timestamp = DateTime.fromISO(this.props.timestamp).toFormat('ccc dd.LL.yy HH:mm');

    let warningTimeStamp = '';

    if(timeDiff > 720) {
      warning = <img src={warningRed} alt=""/>;
      warningTimeStamp = `Temperature captured ${-DateTime.fromISO(this.props.timestamp).diffNow('days').days.toFixed(0)} days ago`;
    } else if(timeDiff > 60) {
      warning = <img src={warningOrange} alt=""/>;
      warningTimeStamp = `Temperature captured ${-DateTime.fromISO(this.props.timestamp).diffNow('minutes').minutes.toFixed(0)} minutes ago`;
    } else if(timeDiff > 15) {
      warning = <img src={warningYellow} alt=""/>;
      warningTimeStamp = `Temperature captured ${-DateTime.fromISO(this.props.timestamp).diffNow('minutes').minutes.toFixed(0)} minutes ago`;
    }

    return (
      <StyledDeviceTempDiv>
        <StyledWarning title={warningTimeStamp}>
          {warning}
        </StyledWarning>
        <StyledDeviceTempSpan title={timestamp}>
          {roundedTemp}
        </StyledDeviceTempSpan>
        <StyledUltimateWrapperDiv>
          <StyledDeviceUltimateTempSpan>
            <img src={triangleUpIcon} alt=""/>
            {roundedMaxTemp}
          </StyledDeviceUltimateTempSpan>
          <StyledDeviceUltimateTempSpan>
            <img src={triangleDownIcon} alt=""/>
            {roundedMinTemp}
          </StyledDeviceUltimateTempSpan>
        </StyledUltimateWrapperDiv>
      </StyledDeviceTempDiv>
    );
  }
}

DeviceSummaryTemperature.propTypes = {
  temperature: PropTypes.number,
  maxTemperature: PropTypes.number,
  minTemperature: PropTypes.number,
  timestamp: PropTypes.string
};

DeviceSummaryTemperature.defaultProps = {
  temperature: 0,
  maxTemperature: 0,
  minTemperature: 0,
  timestamp: null,

};

export default DeviceSummaryTemperature;
