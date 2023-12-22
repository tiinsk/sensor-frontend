import React, { Component } from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import GraphNavigation from "../common/graphs/graph-navigation";
import PressureGraph from "../common/graphs/pressureGraph/pressure-graph";


const StyledPressureGraph = styled.div`
  margin-top: ${props => props.theme.baseSizePartial(0.25)};
`;

class DevicePressureGraph extends Component {
  render() {
    const start = this.props.data[0] ? this.props.data[0].rounded_time : null;

    return (
      <StyledPressureGraph>
        <GraphNavigation
          startTime={start}
          loadOlderData={() => this.props.loadOlderData()}
        >
          <PressureGraph
            width={this.props.minGraphWidth}
            data={this.props.data}
          />
        </GraphNavigation>
      </StyledPressureGraph>
    );
  }
}

DevicePressureGraph.propTypes = {
  data: PropTypes.array,
  loadOlderData: PropTypes.func.isRequired,
  minGraphWidth: PropTypes.number.isRequired,
};

DevicePressureGraph.defaultProps = {
  data: []
};

export default DevicePressureGraph;
