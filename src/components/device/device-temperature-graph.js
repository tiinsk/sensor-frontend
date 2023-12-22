import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TemperatureGraph from '../common/graphs/temperatureGraph/temperature-graph';

import GraphNavigation from '../common/graphs/graph-navigation';

class DeviceTempGraph extends Component {
  render() {
    const start = this.props.data[0] ? this.props.data[0].rounded_time : null;

    return (
      <GraphNavigation
        startTime={start}
        loadOlderData={() => this.props.loadOlderData()}
      >
        <TemperatureGraph
          width={this.props.minGraphWidth}
          data={this.props.data}
        />
      </GraphNavigation>
    );
  }
}

DeviceTempGraph.propTypes = {
  data: PropTypes.array,
  loadOlderData: PropTypes.func.isRequired,
  minGraphWidth: PropTypes.number.isRequired,
};

DeviceTempGraph.defaultProps = {
  data: [],
};

export default DeviceTempGraph;
