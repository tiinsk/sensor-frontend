import React, { Component } from 'react';
import styled from 'styled-components/macro';
import {StyledReading} from "../common/reading";

const StyledDetailSection= styled.div`
  padding: 0 ${props => props.theme.baseSizePartial(0.25)};
  margin-bottom: 0;
  width: 50%;
  
  @media (max-width: ${props => props.theme.breakpointSmallWindow}){  
    display: flex;
    padding: 0;
    justify-content: space-around;
    
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
