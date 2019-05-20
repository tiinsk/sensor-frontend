import DateTime from "luxon/src/datetime";
import React from "react";
import {scaleTime} from "d3-scale";
import styled from 'styled-components/macro';

export const axes = (start, end) => [
  {
    orient: "top",
    baseline: false,
    tickFormat: (e, rest) => {
      const hours = e.getHours();
      const evenDate = e.getDate() % 2 === 0;
      const date = DateTime.fromJSDate(e).toFormat("ccc dd.LL.yy");

      let hourText;

      if (e.toISOString() === start) hourText = "";
      else if (hours % 2 === 1) hourText = "|";
      else hourText = `${DateTime.fromJSDate(e).toFormat('h a')}`;

      return (
        <text
          textAnchor="middle"
          className={`
            axis-label
            ${hours % 2 === 1 ? 'hour-tick' : ''}
            ${evenDate ? 'even-date' : ''}
          `}
        >
          {
            hours === 12 && e.toISOString() !== start ?
            <tspan className="date" overflow="auto" dx={0} dy={-7}>{date}</tspan> : ""
          }
          <tspan x={0} y={15}>{hourText}</tspan>
        </text>
      );
    },
    tickLineGenerator: ({xy}) => {
      return(
        <rect
          key={xy.x1}
          x={xy.x1-0.5}
          className="tick-line"
          width={1}
          height={xy.y2-xy.y1}
        />
      );
    }
    /*axisAnnotationFunction: function(e){console.log("Here's the axis that you clicked on:",e)}*/
  }
];


export const commonDefs = {
  margin: {
    left: -7,
    bottom: 0,
    right: 25,
    top: 40
  },
  xScaleType: scaleTime(),
  xAccessor: d => {
    return new Date(d.rounded_time);
  },
  baseMarkProps: { forceUpdate: true },
  hoverAnnotation: true,
  tooltipContent: (d) => {
    const minutes = new Date(d.rounded_time).getMinutes();
    if (minutes) {
      return (
        <div
          className="hover-unit-text"
        >
          {d.temperature.toFixed(1)}
          <div className="pointer"/>
        </div>
      )
    }
  }
};

export const StyledResponsiveXYFrame = styled.div`
  .frame-elements {
    background: ${props => props.theme.colors.blueGraphBackground};
  }
  
  .axis-label {
    fill: #cacaca;
    font-family: ${props => props.theme.fontTitle};
    font-size: ${props => props.theme.fontSizeXXXSmall};
    font-weight: ${props => props.theme.fontWeightLight};
    text-transform: lowercase;
    
    .date {
      text-transform: capitalize;
    }
    &.even-date {
      fill: ${props => props.theme.colors.blueEvenDate};
    }
  }
  
  .unit-text {
    fill: white;
    font-family: ${props => props.theme.fontTitle};
    font-size: ${props => props.theme.fontSizeXXXSmall};
    font-weight: ${props => props.theme.fontWeightLight};
  } 
  .tick-line {
      fill: ${props => props.theme.colors.blueTickLine};
  }
  .hover-unit-text {
    background: ${props => props.theme.colors.blueHoverBackground};
    padding: 5px;
    border-radius: 2px;
  
    color: ${props => props.theme.colors.blueEvenDate};
    font-family: ${props => props.theme.fontTitle};
    font-size: ${props => props.theme.fontSizeXXXSmall};
    font-weight: ${props => props.theme.fontWeightLight};
    
    position: relative;
    top: -35px;
    left: -50%;
    
    .pointer {
      background: ${props => props.theme.colors.blueHoverBackground};
   
      width: 10px;
      height: 10px;
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
    
  }
  
  circle.frame-hover {
    stroke: transparent;
    r: 0;
  }
`;
