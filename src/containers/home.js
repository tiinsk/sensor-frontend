import React, { Component } from 'react';
import api from '../api/routes';
import DeviceSummaryItem from "../components/deviceSummary/device-summary-item";
import Loading from "../components/common/loading";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      deviceSummaries: [],
      deviceExtremes: []
    };
  }

  async componentWillMount() {

    const [summaries, extremes] = await Promise.all([
      api.getNow(),
      api.getExtremes()
    ]);

    this.setState({
      loading: false,
      deviceSummaries: summaries,
      deviceExtremes: extremes.reduce((acc, curr) => {
        acc[curr.device] = curr;
        return acc;
      }, {})
    });
  }

  render() {
    return (
      <div>
        { this.state.loading ?
          <Loading/> :
          this.state.deviceSummaries.map(device => (
            <DeviceSummaryItem
              key={device.device}
              device={{
                ...device,
              }}
              details={this.state.deviceExtremes[device.device]}
            />
          ))
        }
      </div>
    );
  }
}

export default Home;
