import React, { useEffect, useRef, useState } from 'react';
import { Reading } from '../../api/types';
import {
  TimeFrameOptions,
  TimePeriod,
  ValueType,
} from '../selectors/time-frame-selector';
import { useGraphSizeContext } from './graph-size-context';
import * as d3 from 'd3';
import styled, { useTheme } from 'styled-components';
import { DateTime } from 'luxon';
import { GraphTooltip, TooltipContent } from '../styled/tooltips/graph-tooltip';

const MIN_TEMP = -30;
const MAX_TEMP = 90;

const formatAxes = (date: Date, timePeriod: TimePeriod) => {
  const dateTime = DateTime.fromJSDate(date);
  switch (timePeriod) {
    case 'day':
      return dateTime.toFormat('hh:mm');
    case 'week':
      return dateTime.toFormat('ccc');
    case 'month':
      return dateTime.toFormat('dd.');
    case 'year':
      return dateTime.toFormat('MMM');
  }
};

interface GraphProps {
  deviceId: string;
  data: Reading[];
  options: TimeFrameOptions;
  valueType: ValueType;
  showAxis?: boolean;
}

const PointG = styled.g<{ $valueType: ValueType }>`
  cursor: pointer;
  rect {
    fill: ${({ theme, $valueType }) =>
      theme.colors.graphs.background[$valueType].primary};
  }
  &:hover {
    rect {
      fill: ${({ theme, $valueType }) =>
        theme.colors.graphs.background[$valueType].hover};
    }
  }
`;

export const Graph = ({
  deviceId,
  data,
  options,
  valueType,
  showAxis = true,
}: GraphProps) => {
  const [tooltipContent, setTooltip] = useState<TooltipContent | undefined>(
    undefined
  );
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
    colors.graphs.lines[valueType]
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
    <>
      <svg width={width} height={height}>
        {showAxis && (
          <g
            ref={gx}
            strokeWidth={0}
            transform={`translate(0,${height - margins.bottom})`}
          />
        )}
        <path
          fill="none"
          strokeWidth="1.5"
          d={line(data) || undefined}
          stroke={`url(#line-gradient-${deviceId}-${valueType})`}
        />
        <path
          fill={`url(#area-gradient-${deviceId}-${valueType})`}
          d={area(data) || undefined}
        />
        <g fill="currentColor">
          {data.map((d, i) => {
            const minMaxHeight = Math.abs(y(d.min || 0) - y(d.max || 0));
            return (
              <PointG
                key={i}
                $valueType={valueType}
                transform={`translate(${x(new Date(d.time))}, ${y(
                  d.avg || 0
                )})`}
                onMouseEnter={e => {
                  const circleElem = e.currentTarget
                    .querySelector('circle')
                    ?.getBoundingClientRect();
                  if (circleElem) {
                    setTooltip({
                      date: d.time,
                      reading: d,
                      position: { x: circleElem.x, y: circleElem.y },
                    });
                  }
                }}
                onMouseLeave={e => setTooltip(undefined)}
              >
                {options.showMinAndMax && (
                  <rect
                    y={-(y(d.avg || 0) - y(d.max || 0))}
                    x={-5}
                    rx={4}
                    height={minMaxHeight}
                    width={10}
                  />
                )}
                <circle r="3" fill={colorInterpolation(yColor(d.avg || 0))} />
                <text className="unit-text" x={-10} y={-10}>
                  {d.avg?.toFixed(1) || 0}
                </text>
              </PointG>
            );
          })}
        </g>
        <linearGradient
          id={`line-gradient-${deviceId}-${valueType}`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={0}
          y1={y(max)}
          y2={y(min)}
        >
          {colorSteps.map((colorStep, i) => (
            <stop
              key={i}
              offset={`${colorStep.offset}`}
              stopColor={colorStep.color}
            />
          ))}
        </linearGradient>
        <linearGradient
          id={`area-gradient-${deviceId}-${valueType}`}
          gradientUnits="userSpaceOnUse"
          x1={0}
          x2={0}
          y1={y(max)}
          y2={y(min)}
        >
          {colorSteps.map((colorStep, i) => (
            <stop
              key={i}
              offset={`${colorStep.offset}`}
              stopColor={colorStep.color}
              stopOpacity={colorStep.opacity}
            />
          ))}
        </linearGradient>
      </svg>
      <GraphTooltip
        tooltipContent={tooltipContent}
        timePeriod={options.timePeriod}
        valueType={valueType}
      />
    </>
  );
};
