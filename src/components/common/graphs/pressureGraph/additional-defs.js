import React from 'react';
import { colorGradient } from '../../../../utils/pressure-colors';

export const additionalDefs = [
  <linearGradient
    x1="0%"
    y1="0%"
    x2="0%"
    y2="100%"
    id="bar-gradient-1"
    key="bar-gradient-1"
  >
    <stop stopColor="#183843" offset="0%" />
    <stop stopColor="#051B21" offset="53.2271923%" />
    <stop stopColor="#021116" offset="100%" />
  </linearGradient>,
  <linearGradient
    x1="0%"
    y1="0%"
    x2="0%"
    y2="100%"
    id="bar-gradient-2"
    key="bar-gradient-2"
  >
    <stop stopColor="#2C4354" offset="0%" />
    <stop stopColor="#152532" offset="53.3375297%" />
    <stop stopColor="#0D1922" offset="100%" />
  </linearGradient>,
  <linearGradient
    x1="0%"
    y1="0%"
    x2="0%"
    y2="100%"
    id="bar-gradient-3"
    key="bar-gradient-3"
  >
    <stop stopColor="#414C66" offset="0%" />
    <stop stopColor="#262F44" offset="51.2472772%" />
    <stop stopColor="#192132" offset="100%" />
  </linearGradient>,
  <linearGradient
    x1="0%"
    y1="0%"
    x2="0%"
    y2="100%"
    id="bar-gradient-4"
    key="bar-gradient-4"
  >
    <stop stopColor="#454A6F" offset="0%" />
    <stop stopColor="#2B2F4C" offset="52.5527116%" />
    <stop stopColor="#1E213A" offset="100%" />
  </linearGradient>,
  <linearGradient
    x1="0%"
    y1="0%"
    x2="0%"
    y2="100%"
    id="bar-gradient-5"
    key="bar-gradient-5"
  >
    <stop stopColor="#52517D" offset="0%" />
    <stop stopColor="#2D2C52" offset="57.8140875%" />
    <stop stopColor="#201F3E" offset="100%" />
  </linearGradient>,
  <linearGradient
    x1="0%"
    y1="0%"
    x2="0%"
    y2="100%"
    id="bar-gradient-6"
    key="bar-gradient-6"
  >
    <stop stopColor="#745F88" offset="0%" />
    <stop stopColor="#473558" offset="51.9488864%" />
    <stop stopColor="#31233F" offset="100%" />
  </linearGradient>,
  <linearGradient
    x1="0%"
    y1="0%"
    x2="0%"
    y2="100%"
    id="bar-gradient-7"
    key="bar-gradient-7"
  >
    <stop stopColor="#A07892" offset="0%" />
    <stop stopColor="#69445D" offset="52.8913566%" />
    <stop stopColor="#512E46" offset="100%" />
  </linearGradient>,
];

export const customPointMark =
  dataPointCount =>
  ({ d, xy, yScale }) => {
    const minutes = new Date(d.rounded_time).getMinutes();

    const largeOffset = 0;
    const smallOffset = 0;

    const yLarge = yScale(990) - yScale(xy.yBottom);
    const ySmall = yScale(990) - yScale(xy.yBottom);

    //hide first and last point
    if (d.index === 0) return <g />;

    if (minutes) {
      return (
        <g className="half-hour-mark">
          <rect
            fill={`url(#bar-gradient-${colorGradient(d.pressure)})`}
            opacity={0.6}
            width={6}
            height={ySmall >= 0 ? ySmall : 0}
            x={-3}
            y={smallOffset}
          />
          <circle fill="white" stroke="none" r={3} />
        </g>
      );
    }

    return (
      <g>
        <text
          className="unit-text"
          x={-45}
          y={4}
          style={{ transform: 'rotate(90deg)' }}
        >
          {d.pressure.toFixed(1)}
        </text>
        <rect
          fill={`url(#bar-gradient-${colorGradient(d.pressure)})`}
          width={12}
          height={yLarge >= 0 ? yLarge : 0}
          x={-6}
          y={largeOffset}
        />
        <g transform="translate(-3, 9)" fill="white" fillOpacity="0.6">
          <circle cx="6" cy="3" r="1" />
          <circle cx="6" cy="29" r="1" />
          <circle cx="1" cy="3" r="1" />
          <circle cx="5" cy="12" r="1" />
          <circle cx="4" cy="23" r="1" />
          <circle cx="2.5" cy="7.5" r="0.5" />
          <circle cx="4.5" cy="5.5" r="0.5" />
          <circle cx="3.5" cy="14.5" r="0.5" />
          <circle cx="1.5" cy="23.5" r="0.5" />
          <circle cx="3.5" cy="25.5" r="0.5" />
          <circle cx="5.5" cy="41.5" r="0.5" />
          <circle cx="1.5" cy="37.5" r="0.5" />
          <circle cx="1.5" cy="32.5" r="0.5" />
          <circle cx="6.5" cy="20.5" r="0.5" />
          <circle cx="3.5" cy="0.5" r="0.5" />
        </g>
        <circle fill="white" strokeWidth={0} r={6} />
      </g>
    );
  };
