import React, { Component } from 'react';
import styled from 'styled-components';
import {StyledReading} from "../common/reading";

const StyledDetailSection= styled.div`
  width: 50%;

  padding-left: ${props => props.theme.baseSizePartial(0.25)};
  display: flex;
  
  ${StyledReading}:not(:first-of-type) {
    margin-left: ${props => props.theme.baseSizePartial(0.25)};
  }
  
  @media (max-width: ${props => props.theme.breakpointHomeGraphSmall}){
    flex-wrap: wrap;
    padding: 0 ${props => props.theme.baseSizePartial(0.25)};
    margin-bottom: 0;
    
    ${StyledReading}:not(:first-of-type) {
      margin-left: 0;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpointSmallWindow}){  
    justify-content: space-around;
    padding: 0;
    flex-wrap: initial;
    
    &:not(:first-of-type) {
      padding-left: ${props => props.theme.baseSizePartial(0.25)};
    }
    
    ${StyledReading}:not(:first-of-type) {
      margin-left: ${props => props.theme.baseSizePartial(0.25)};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpointMobile}){  
    display: initial;
    
     ${StyledReading}:not(:first-of-type) {
      margin-left: 0;
    }
  }
`;

class DetailSection extends Component {
  render() {

    return (
      <StyledDetailSection>
        {this.props.children}
      </StyledDetailSection>
    );
  }
}
export default DetailSection;
