import React, { Component } from 'react';
import styled from 'styled-components/macro';
import loadingIcon from "../../assets/icons/loading.svg";

export const StyledLoading= styled.div`
  @keyframes rotation {
    from {transform: rotate(-45deg);}
    to {transform: rotate(315deg);}
  }
  
  display: flex;
  justify-content: center;
  
  margin: ${props => props.theme.baseSizePartial(2)} 0;
  
  img {
    animation-name: rotation;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.62, 0.37, 0.57, 0.84);
  } 
`;

class Loading extends Component {
  render() {

    return (
      <StyledLoading>
        <img src={loadingIcon} alt="Loading..."/>
      </StyledLoading>
    );
  }
}
export default Loading;
