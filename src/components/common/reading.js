import React, { Component } from 'react';
import styled from 'styled-components/macro';
import PropTypes from "prop-types";
import humidity from '../../assets/icons/types/humidity.svg';
import pressure from '../../assets/icons/types/pressure.svg';
import temperature from '../../assets/icons/types/temperature.svg';
import triangleUp from '../../assets/icons/value-types/triangle-up.svg';
import triangleDown from '../../assets/icons/value-types/triangle-down.svg';
import week from '../../assets/icons/period/week.svg';
import month from '../../assets/icons/period/month.svg';

export const StyledReading= styled.div`
  --height: 40px;
  
  display: flex;
  align-items: center;
  
  background: ${props => props.theme.colors.blueReadingValue};
  
  width: 160px;
  max-width: 100%;
  height: var(--height);
  border-radius: 2px;
  
  margin: ${props => props.theme.baseSizePartial(1/3)} 0;
  
  @media (max-width: ${props => props.theme.breakpointMobile}){
    width: 100%;
  }
`;

const StyledIconDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  
  background: ${props => props.theme.colors.blueReadingIcon};
  border-radius: 2px;
  width: calc(var(--height) + 6px);
  height: calc(var(--height) + 2px);
`;

const StyledIconRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const StyledValueDiv = styled.div`
  min-width: 55px;
  height: var(--height);
  
  flex-grow: 1;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  font-family: ${props => props.theme.fontTitle};
  font-size: ${props => props.theme.fontSizeDefault};
  font-weight: ${props => props.theme.fontWeightLight};
  color: white;
`;

const StyledUnitDiv = styled.div`
  background: ${props => props.theme.colors.blueReadingUnit};
  
  height: var(--height);
  min-width: var(--height);
  
  padding: 0 3px;
  border-radius: 2px;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  font-family: ${props => props.theme.fontTitle};
  font-size: ${props => props.unit === 'pressure' ? props.theme.fontSizeXSmall : props.theme.fontSizeDefault
  };
  font-weight: ${props => props.theme.fontWeightLight};
  color: white;
`;

class Reading extends Component {
  render() {

    let icon, unit;
    switch (this.props.unit) {
      case 'humidity':
        icon = humidity;
        unit = '%';
        break;
      case 'pressure':
        icon = pressure;
        unit = 'mBar';
        break;
      default:
        icon = temperature;
        unit = '°C';
        break;
    }

    const roundValue = this.props.value ? this.props.value.toFixed(1) : ' -- ';

    return (
      <StyledReading>
        <StyledIconDiv>
          <img src={icon} alt={this.props.unit}/>
          <StyledIconRight>
            <img src={this.props.type === 'min' ? triangleDown : triangleUp} alt={this.props.type}/>
            <img src={this.props.period === 'week' ? week : month} alt={this.props.period}/>
          </StyledIconRight>
        </StyledIconDiv>
        <StyledValueDiv>
          {roundValue}
        </StyledValueDiv>
        <StyledUnitDiv unit={this.props.unit}>
          {unit}
        </StyledUnitDiv>
      </StyledReading>
    );
  }
}

Reading.propTypes = {
  value: PropTypes.number,
  unit: PropTypes.oneOf(['humidity', 'pressure', 'temperature']),
  period: PropTypes.oneOf(['week', 'month']),
  type: PropTypes.oneOf(['min', 'max'])
};

Reading.defaultProps = {
  value: 0
};

export default Reading;
