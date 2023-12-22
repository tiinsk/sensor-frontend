import React, { Component } from 'react';
import api from '../api/routes';
import Loading from '../components/common/loading';
import DeviceItem from '../components/device/device-item';
import { DateTime } from 'luxon';
import { formatGraphData } from '../utils/graph-data-formatter';
import { useParams } from 'react-router-dom';

class DeviceOLD extends Component {
  constructor(props) {
    super(props);

    const endTime = new Date().toISOString();
    const startTime = DateTime.fromISO(endTime).minus({ days: 2 }).toISO();

    this.state = {
      loading: true,
      summary: {},
      extremes: {},
      graphData: [],
      loadedDays: 0,
      startTime,
      endTime,
    };
  }

  componentDidMount() {
    this.fetchData(
      this.props.params.id,
      this.state.startTime,
      this.state.endTime
    );
  }

  componentDidUpdate(newProps) {
    if (newProps.params.id !== this.props.params.id) {
      this.setState({
        graphData: [],
        loadedDays: 0,
        loading: true,
      });

      const endTime = new Date().toISOString();
      const startTime = DateTime.fromISO(endTime).minus({ days: 2 }).toISO();

      this.fetchData(newProps.params.id, startTime, endTime);
    }
  }

  async fetchData(id, startTime, endTime) {
    const [summaries, extremes, graphData] = await Promise.all([
      api.getAllDeviceReadingsNow(id),
      api.getAllDeviceExtremes(id),
      api.getAllReadings(id, {
        start: startTime,
        end: endTime,
        include: ['temperature', 'humidity', 'pressure'],
        limit: 400,
      }),
    ]);

    this.setState({
      loading: false,
      summary: summaries,
      extremes: extremes,
      graphData:
        graphData && graphData.values
          ? [...graphData.values, ...this.state.graphData]
          : this.state.graphData,
      loadedDays: this.state.loadedDays + 1,
      startTime,
    });
  }

  loadOlderData() {
    const newStartTime = DateTime.fromISO(this.state.startTime)
      .minus({ days: 2 })
      .toISO();
    const newEndTime = DateTime.fromISO(this.state.startTime)
      .minus({ milliseconds: 1 })
      .toISO();

    return this.fetchData(this.props.params.id, newStartTime, newEndTime);
  }

  render() {
    const whole24HTimes = formatGraphData(
      this.state.startTime,
      this.state.endTime,
      this.state.graphData
    );

    return (
      <div>
        {this.state.loading ? (
          <Loading />
        ) : (
          <DeviceItem
            device={this.state.summary}
            details={this.state.extremes}
            graphData={whole24HTimes}
            minGraphWidth={1300 * this.state.loadedDays}
            loadOlderData={() => this.loadOlderData()}
          />
        )}
      </div>
    );
  }
}

const DeviceWithRouter = () => {
  let params = useParams();
  return <DeviceOLD params={params} />;
};

export default DeviceWithRouter;
