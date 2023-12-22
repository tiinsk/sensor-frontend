import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledDetailColumn = styled.div`
  max-width: 33.3%;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  h3 {
    margin: 0;
    padding: ${props => props.theme.baseSizePartial(0.25)};
    flex: 0 0 100%;
  }

  @media (max-width: ${props => props.theme.breakpointSmallWindow}) {
    width: 100%;
    max-width: initial;

    h3 {
      padding: ${props => props.theme.baseSizePartial(0.25)} 0;
    }
  }

  @media (max-width: ${props => props.theme.breakpointMobile}) {
  }
`;

class DetailColumn extends Component {
  render() {
    return (
      <StyledDetailColumn>
        <h3>{this.props.title}</h3>
        {this.props.children}
      </StyledDetailColumn>
    );
  }
}

DetailColumn.propTypes = {
  title: PropTypes.string,
};

DetailColumn.defaultProps = {
  title: '',
};

export default DetailColumn;
