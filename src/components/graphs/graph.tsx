import React, { useEffect, useRef } from 'react';
import { GraphSizeWrapper } from './graph-size-wrapper';
import { Reading } from '../../api/types';
import { TimeFrameOptions, TimePeriod } from '../selectors/time-frame-selector';
import { useGraphSizeContext } from './graph-size-context';
import * as d3 from 'd3';
import { useTheme } from 'styled-components';

const MIN_TEMP = -30;
const MAX_TEMP = 90;

const formatAxes = (date: Date, timePeriod: TimePeriod) => {
  switch (timePeriod) {
    case 'day':
      return `${date.getMonth() + 1} / ${date.getDate()}`;
    case 'week':
      return `${date.getMonth() + 1} / ${date.getDate()}`;
    case 'month':
      return `${date.getDate()}.`;
    case 'year':
      return `${date.getMonth() + 1} / ${date.getDate()}`;
  }
};

interface GraphProps {
  deviceId: string;
  data: Reading[];
  options: TimeFrameOptions;
}

export const Graph = ({ deviceId, data, options }: GraphProps) => {
  const { colors } = useTheme();
  const gx = useRef<SVGGElement>(null);
  const { width, height } = useGraphSizeContext();

  const start = options.startTime;
  const end = options.endTime;

  const max = Math.max(...data?.map(r => r.max || 0));
  const min = Math.min(...data?.map(r => r.min || 0));

  const margins = {
    left: 10,
    bottom: 20,
    right: 0,
    top: 20,
  };

  const x = d3.scaleTime(
    [new Date(start), new Date(end)],
    [margins.left, width - margins.right]
  );

  const y = d3.scaleLinear([min, max], [height - margins.bottom, margins.top]);

  const yColor = d3.scaleLinear([MIN_TEMP, MAX_TEMP], [1, 0]);
  const colorInterpolation = d3.interpolateRgbBasis(
    colors.graphs.lines.temperature
  );

  const steps = d3.ticks(max, min, 10);

  const colorSteps = steps.map((s, i) => ({
    color: colorInterpolation(yColor(s)),
    offset: i / steps.length,
    opacity: (1 - i / steps.length) * 0.5,
  }));

  const line = d3.line<Reading>(
    d => x(new Date(d.time)),
    d => y(d.avg || 0)
  );

  const area = d3.area<Reading>(
    d => x(new Date(d.time)),
    () => y(min) + margins.bottom,
    d => y(d.avg || 0)
  );

  useEffect(() => {
    if (gx.current) {
      void d3.select(gx.current).call(
        d3
          .axisBottom<Date>(x)
          .tickFormat((d, i) => formatAxes(d, options.timePeriod))
          .tickSize(0)
      );
    }
  }, [gx, x]);

  return (
    <GraphSizeWrapper>
      <svg width={width} height={height}>
        <g
          ref={gx}
          strokeWidth={0}
          transform={`translate(0,${height - margins.bottom})`}
        />
        <path
          fill="none"
          strokeWidth="1.5"
          d={line(data) || undefined}
          stroke={`url(#line-gradient-${deviceId})`}
        />
        <path
          fill={`url(#area-gradient-${deviceId})`}
          d={area(data) || undefined}
        />
        <g fill="currentColor">
          {data.map((d, i) => (
            <g
              key={i}
              transform={`translate(${x(new Date(d.time))}, ${y(d.avg || 0)})`}
            >
              <text className="unit-text" x={-10} y={-10}>
                {d.avg?.toFixed(1) || 0}
              </text>
              <circle r="3" fill={colorInterpolation(yColor(d.avg || 0))} />
            </g>
          ))}
        </g>
        <linearGradient
          id={`line-gradient-${deviceId}`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={0}
          y1={y(max)}
          y2={y(min)}
        >
          {colorSteps.map((colorStep, i) => (
            <stop
              key={colorStep.color}
              offset={`${colorStep.offset}`}
              stopColor={colorStep.color}
            />
          ))}
        </linearGradient>
        <linearGradient
          id={`area-gradient-${deviceId}`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={0}
          y1={y(max)}
          y2={y(min)}
        >
          {colorSteps.map((colorStep, i) => (
            <stop
              key={colorStep.color}
              offset={`${colorStep.offset}`}
              stopColor={colorStep.color}
              stopOpacity={colorStep.opacity}
            />
          ))}
        </linearGradient>
      </svg>
    </GraphSizeWrapper>
  );
};
