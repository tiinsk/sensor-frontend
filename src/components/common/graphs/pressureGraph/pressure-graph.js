import React from 'react';

import PropTypes from "prop-types";
import {additionalDefs, customPointMark} from "./additional-defs";
import {axes, commonDefs} from "../common-graph-defs";
import GraphSizeWrapper from "../graph-size-wrapper";

const defFrameProps = (dataPointCount, start, end) => ({
  ...commonDefs,
  yExtent: [990, 1030],
  yAccessor: d => {
    return d.pressure || 0;
  },
  lineStyle: (d, i) => ({
    stroke: `url(#pressure-line-gradient)`,
    strokeWidth: 5,
    fill: "none",
    opacity: 1
  }),
  showLinePoints: true,
  customPointMark: customPointMark(dataPointCount),
  axes: axes(start, end),
  additionalDefs: additionalDefs
});


const HumidityGraph = (props) => {

  const dataPointCount = props.data.length;
  const start = props.data[0] ? props.data[0].rounded_time : null;
  const end = props.data.length > 0 ? props.data[props.data.length-1].rounded_time : null;

  const frameProps = {
    ...defFrameProps(dataPointCount, start, end),
    size: [props.width, props.height],
    lines: [{coordinates: props.data}]
  };

  return (
    <GraphSizeWrapper
      width={props.width}
      frameProps={frameProps}
    />
  );
};

HumidityGraph.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number
};

HumidityGraph.defaultProps = {
  width: 700,
  height: 320
};

export default HumidityGraph;
