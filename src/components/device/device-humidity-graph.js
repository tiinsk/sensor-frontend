import React, { Component } from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components';

import GraphNavigation from "../common/graphs/graph-navigation";
import HumidityGraph from "../common/graphs/humidityGraph/humidity-graph";


const StyledHumidityGraph = styled.div`
  margin-top: ${props => props.theme.baseSizePartial(0.25)};
`;

class DeviceHumidityGraph extends Component {
  render() {
    const start = this.props.data[0] ? this.props.data[0].rounded_time : null;

    return (
      <StyledHumidityGraph>
        <GraphNavigation
          startTime={start}
          loadOlderData={() => this.props.loadOlderData()}
        >
          <HumidityGraph
            width={this.props.minGraphWidth}
            data={this.props.data}
          />
        </GraphNavigation>
      </StyledHumidityGraph>
    );
  }
}

DeviceHumidityGraph.propTypes = {
  data: PropTypes.array,
  loadOlderData: PropTypes.func.isRequired,
  minGraphWidth: PropTypes.number.isRequired,
};

DeviceHumidityGraph.defaultProps = {
  data: []
};

export default DeviceHumidityGraph;
