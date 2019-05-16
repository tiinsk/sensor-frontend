import React, { Component } from 'react';
import PropTypes from "prop-types";
import styled from 'styled-components/macro';
import api from "../../api/routes";
import TemperatureGraph from "../common/graphs/temperatureGraph/temperature-graph";
import DateTime from "luxon/src/datetime";

import {formatGraphData} from "../../utils/graph-data-formatter";
import GraphNavigation from "../common/graphs/graph-navigation";
import Loading from "../common/loading";

const StyledDeviceSummaryGraph = styled.div`
  width: 50%;
  
  @media (max-width: ${props => props.theme.breakpointHomeGraphSmall}){
    width: 100%;
  }
`;

class DeviceSummaryTempGraph extends Component {
  constructor(props) {
    super(props);

    const endTime = (new Date()).toISOString();
    const startTime = DateTime.fromISO(endTime).minus({days: 1}).toISO();

    this.state = {
      temperatures: [],
      loading: true,
      loadedDays: 0,
      startTime,
      endTime
    };
  }

  async componentWillMount() {
    this.fetchData(this.state.startTime, this.state.endTime);
  }

  loadOlderData() {
    const newStartTime = DateTime.fromISO(this.state.startTime).minus({days: 1}).toISO();
    const newEndTime = DateTime.fromISO(this.state.startTime).minus({milliseconds: 1}).toISO();

    return this.fetchData(newStartTime, newEndTime);
  }

  async fetchData(startTime, endTime) {
    const temperatures = await api.getAllReadings(this.props.deviceId, {
      start: startTime,
      end: endTime,
      include: ['temperature'],
      limit: 200
    });

    this.setState({
      startTime,
      temperatures: [...temperatures.values, ...this.state.temperatures],
      loadedDays: this.state.loadedDays +1,
      loading: false
    });
  }

  render() {
    const whole24HTimes = formatGraphData(this.state.startTime, this.state.endTime, this.state.temperatures);

    return (
        <StyledDeviceSummaryGraph>
          { this.state.loading ? <Loading/> :
            <GraphNavigation
              minWidth={700*this.state.loadedDays}
              height={320}
              startTime={this.state.startTime}
              loadOlderData={this.loadOlderData.bind(this)}
            >
              <TemperatureGraph
                height={320}
                width={700*this.state.loadedDays}
                data={whole24HTimes}
              />
            </GraphNavigation>
          }
        </StyledDeviceSummaryGraph>
    );
  }
}

DeviceSummaryTempGraph.propTypes = {
  deviceId: PropTypes.string.isRequired,
};

export default DeviceSummaryTempGraph;
