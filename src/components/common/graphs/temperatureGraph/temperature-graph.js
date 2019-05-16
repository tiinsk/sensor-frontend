import React from 'react';
import PropTypes from "prop-types";
import {additionalDefs, customPointMark} from "./additional-defs";
import {axes, commonDefs} from "../common-graph-defs";
import GraphSizeWrapper from "../graph-size-wrapper";

const defFrameProps = (dataPointCount, start, end) => ({
  ...commonDefs,
  yExtent: [0, 55],
  yAccessor: d => {
    return d.temperature || 0;
  },

  lineStyle: (d, i) => ({
    stroke: `url(#line-gradient)`,
    strokeWidth: 3,
    fill: "none",
    opacity: 0.3
  }),
  showLinePoints: true,
  customPointMark: customPointMark(dataPointCount),
  axes: axes(start, end),
  additionalDefs: additionalDefs
});

const TemperatureGraph = (props) => {

  const dataPointCount = props.data.length;
  const start = props.data[0] ? props.data[0].rounded_time : null;
  const end = props.data.length > 0 ? props.data[props.data.length - 1].rounded_time : null;

  const frameProps = {
    ...defFrameProps(dataPointCount, start, end),
    lines: [{coordinates: props.data}]
  };

  return (
    <GraphSizeWrapper
      width={props.width}
      frameProps={frameProps}
    />
  );
};

TemperatureGraph.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number
};

TemperatureGraph.defaultProps = {
  width: 700,
  height: 320
};

export default TemperatureGraph;
