import React, { useEffect, useRef } from 'react';
import { Reading } from '../../api/types';
import {
  TimeFrameOptions,
  TimePeriod,
  ValueType,
} from '../selectors/time-frame-selector';
import { useGraphSizeContext } from './graph-size-context';
import * as d3 from 'd3';
import styled, { css, useTheme } from 'styled-components';
import { DateTime } from 'luxon';
import { GraphTooltip } from '../styled/tooltips/graph-tooltip';
import { getEndTime, getStartTime } from '../selectors/time-frames';
import { MinMax } from '../../utils/readings';

export const MIN_TEMP = -30;
export const MAX_TEMP = 90;
const SMALL_GRAPH_LIMIT = 500;

const formatAxes = (date: Date, timePeriod: TimePeriod) => {
  const dateTime = DateTime.fromJSDate(date);
  switch (timePeriod) {
    case 'day':
      return dateTime.toFormat('HH');
    case 'week':
      return dateTime.toFormat('ccc');
    case 'month':
      return dateTime.toFormat('dd.');
    case 'year':
      return dateTime.toFormat('MMM');
  }
};

const getAxisTicks = (timePeriod: TimePeriod) => {
  switch (timePeriod) {
    case 'day':
      return d3.timeMinute.every(30);
    case 'week':
      return d3.timeDay.every(1);
    case 'month':
      return d3.timeDay.every(1);
    case 'year':
      return d3.timeMonth.every(1);
  }
};

interface GraphProps {
  deviceId: string;
  data: Reading[];
  options: TimeFrameOptions;
  valueType: ValueType;
  hoveredDate?: string;
  onHover: (date?: string) => void;
  showAxis?: boolean;
  minMax?: MinMax;
}

const Every2ndHourTick = ({
  $startsFromHalfHour,
}: {
  $startsFromHalfHour: boolean;
}) => css`
  .tick {
    display: none;
  }

  //As 24h graph contains data point in 30min intervals, every 2nd hour is every 4th value.
  //Depending on current time, first value can be half an hour past, different value must be shown.
  // for example: [14:30, 15:00, 15:30, 16:00, 16:30, 17:00, 17:30] => [15:00, 17:00]
  // or: [14:00, 14:30, 15:00, 15:30, 16:00, 16:30, 17:00] => [15:00, 17:00]
  .tick:nth-of-type(${$startsFromHalfHour ? '4n-2' : '4n-1'}) {
    display: initial;
  }
`;

const Every2ndTick = css`
  .tick {
    display: none;
  }
  .tick:nth-of-type(2n) {
    display: initial;
  }
`;

const TickG = styled.g<{
  $width: number;
  $timePeriod: TimePeriod;
  $startsFromHalfHour: boolean;
}>`
  ${({ $timePeriod }) => $timePeriod === 'day' && Every2ndHourTick};

  ${({ $width, $timePeriod }) =>
    $width < SMALL_GRAPH_LIMIT && $timePeriod === 'month' && Every2ndTick};
`;

const Every2ndHourUnit = ({
  $startsFromHalfHour,
}: {
  $startsFromHalfHour: boolean;
}) => css`
  .unit-text {
    display: none;
  }

  //See Every2ndHourTick comment for more info
  &:nth-of-type(${$startsFromHalfHour ? '4n-2' : '4n-1'}) {
    .unit-text {
      display: initial;
    }
  }
`;

const Every2ndUnit = () => css`
  .unit-text {
    display: none;
  }
  &:nth-of-type(2n) {
    .unit-text {
      display: initial;
    }
  }
`;

const PointG = styled.g<{
  $valueType: ValueType;
  $isHovered: boolean;
  $width: number;
  $timePeriod: TimePeriod;
  $startsFromHalfHour: boolean;
}>`
  cursor: pointer;
  rect {
    fill: ${({ theme, $valueType, $isHovered }) =>
      $isHovered
        ? theme.colors.graphs.background[$valueType].hover
        : theme.colors.graphs.background[$valueType].primary};
  }

  ${({ $timePeriod }) => $timePeriod === 'day' && Every2ndHourUnit};

  ${({ $width, $timePeriod }) =>
    $width < SMALL_GRAPH_LIMIT && $timePeriod === 'month' && Every2ndUnit};
`;

const HoverableRect = styled.rect<{ $isHovered: boolean }>`
  fill: ${({ theme, $isHovered }) =>
    $isHovered ? theme.colors.graphs.background.hover : 'transparent'};
`;

export const Graph = ({
  deviceId,
  data,
  options,
  valueType,
  hoveredDate,
  onHover,
  minMax,
  showAxis = true,
}: GraphProps) => {
  const { colors } = useTheme();
  const gx = useRef<SVGGElement>(null);
  const { width, height } = useGraphSizeContext();

  const endTime = getEndTime(options.offsetFromNow, options.timePeriod)!;
  const startTime = getStartTime(options.offsetFromNow, options.timePeriod)!;

  const max = minMax?.max || Math.max(...data?.map(r => r.max || 0));
  const min = minMax?.min || Math.min(...data?.map(r => r.min || 0));

  const margins = {
    left: 10,
    bottom: 20,
    right: 0,
    top: 20,
  };

  const x = d3.scaleTime(
    [new Date(startTime), new Date(endTime)],
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

  const hoverBlockInterval = getAxisTicks(options.timePeriod);

  const hoverBlocks = hoverBlockInterval ? x.ticks(hoverBlockInterval) : [];
  const tickWidth = (width - margins.left - margins.right) / hoverBlocks.length;

  useEffect(() => {
    if (gx.current) {
      void d3.select(gx.current).call(
        d3
          .axisBottom<Date>(x)
          .tickArguments([getAxisTicks(options.timePeriod)])
          .tickFormat((d, i) => formatAxes(d, options.timePeriod))
          .tickSize(0)
      );
    }
  }, [gx, x]);

  const hoveredDatapoint = data.find(d => d.time === hoveredDate);

  const tooltipContent = hoveredDatapoint && {
    ...hoveredDatapoint,
    position: {
      x: x(new Date(hoveredDatapoint.time)),
      y: y(hoveredDatapoint.avg || 0),
    },
  };

  const startsFromHalfHour =
    options.timePeriod === 'day' &&
    data.length > 0 &&
    DateTime.fromISO(data[0].time).minute !== 30;

  return (
    <>
      <svg
        width={width}
        height={height}
        onMouseLeave={e => {
          e.stopPropagation();
          onHover(undefined);
        }}
      >
        {showAxis && (
          <TickG
            $width={width}
            $timePeriod={options.timePeriod}
            ref={gx}
            strokeWidth={0}
            transform={`translate(0,${height - margins.bottom})`}
            $startsFromHalfHour={startsFromHalfHour}
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
            const date = new Date(d.time);
            if (date < new Date(startTime) || date > new Date(endTime))
              return null;

            const minMaxHeight = Math.abs(y(d.min || 0) - y(d.max || 0));
            return (
              <PointG
                key={i}
                $valueType={valueType}
                transform={`translate(${x(new Date(d.time))}, ${y(
                  d.avg || 0
                )})`}
                $isHovered={d.time === hoveredDate}
                $width={width}
                $timePeriod={options.timePeriod}
                $startsFromHalfHour={startsFromHalfHour}
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
        {hoverBlocks.map((d, i) => (
          <HoverableRect
            key={i}
            y={y(max) - margins.top}
            x={x(d) - tickWidth / 2}
            height={height}
            width={tickWidth > 0 ? tickWidth : 0}
            $isHovered={hoveredDate === d.toISOString()}
            onMouseEnter={e => onHover(d.toISOString())}
          />
        ))}
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
