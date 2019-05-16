import React from "react";
import {color, colorGradient} from "../../../../utils/temperature-colors";

export const additionalDefs = [
  <linearGradient key="0" x1="13.8214449%" y1="15.2807454%" x2="84.3159606%" y2="85.8151869%" id="gradient-color-0">
    <stop stopColor="#FBC469" offset="0%"/>
    <stop stopColor="#E3A47B" offset="100%"/>
  </linearGradient>,
  <linearGradient key="1" x1="13.8214449%" y1="15.2807454%" x2="84.3159606%" y2="85.8151869%" id="gradient-color-1">
    <stop stopColor="#E3A47B" offset="0%"/>
    <stop stopColor="#CA8181" offset="100%"/>
  </linearGradient>,
  <linearGradient key="2" x1="13.8214449%" y1="15.2807454%" x2="84.3159606%" y2="85.8151869%" id="gradient-color-2">
    <stop stopColor="#CA8181" offset="0%"/>
    <stop stopColor="#AE7FAA" offset="100%"/>
  </linearGradient>,
  <linearGradient key="3" x1="13.8214449%" y1="15.2807454%" x2="84.3159606%" y2="85.8151869%" id="gradient-color-3">
    <stop stopColor="#AE7FAA" offset="0%"/>
    <stop stopColor="#7A71A6" offset="100%"/>
  </linearGradient>,
  <linearGradient key="4" x1="13.8214449%" y1="15.2807454%" x2="84.3159606%" y2="85.8151869%" id="gradient-color-4">
    <stop stopColor="#7A71A6" offset="0%"/>
    <stop stopColor="#687BB4" offset="100%"/>
  </linearGradient>,
  <linearGradient key="5" x1="13.8214449%" y1="15.2807454%" x2="84.3159606%" y2="85.8151869%" id="gradient-color-5">
    <stop stopColor="#687BB4" offset="0%"/>
    <stop stopColor="#71B6BE" offset="100%"/>
  </linearGradient>,
  <linearGradient key="6" x1="50%" y1="0%" x2="50%" y2="100%" id="line-gradient">
    <stop stopColor="#FBC469" offset="0%"/>
    <stop stopColor="#DFA27B" offset="14.6686792%"/>
    <stop stopColor="#B6899A" offset="29.1693773%"/>
    <stop stopColor="#827FAE" offset="42.9171787%"/>
    <stop stopColor="#7179A6" offset="57.1660298%"/>
    <stop stopColor="#738CB5" offset="71.6667279%"/>
    <stop stopColor="#7298B4" offset="85.3781735%"/>
    <stop stopColor="#7298B4" offset="100%"/>
  </linearGradient>
];

export const customPointMark = (dataPointCount) => ({d, xy, yScale}) => {
  const minutes = new Date(d.rounded_time).getMinutes();
  const y = yScale(0) - yScale(xy.yBottom);

  //hide first and last point
  if (d.index === 0) return <g/>;

  if (minutes) {
    return (
      <g className="half-hour-mark">
        <rect
          fill="#40613C"
          opacity={0.45}
          width={3}
          height={y}
          x={-1}
        />
        <circle
          fill={color(d.temperature)}
          stroke="none"
          r={4}
        />
      </g>
    );
  }

  return (
    <g>
      <text
        className="unit-text"
        x={-10}
        y={-20}
      >
        {d.temperature.toFixed(1)}
      </text>
      <rect
        fill="#40613C"
        width={3}
        height={y}
        x={-1}
      />
      <circle
        stroke={`url(#gradient-color-${colorGradient(d.temperature)})`}
        strokeWidth={3}
        fill="#2C323E"
        r={6}
      />
    </g>
  );
};
