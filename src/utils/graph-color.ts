import * as d3 from 'd3';

import { Unit } from './unit';
import { useTheme } from 'styled-components';

export const MIN_TEMP = -30;
export const MAX_TEMP = 90;

export const getGraphColorScale = (valueType?: Unit) => {
  switch (valueType) {
    case 'temperature':
      return [MIN_TEMP, MAX_TEMP];
    case 'humidity':
      return [0, 100];
    case 'pressure':
      return [870, 1085];
    case 'co2':
      return [600, 2100];
    case 'nox':
      return [1, 500];
    case 'pm25':
      return [5, 55];
    case 'voc':
      return [0, 500];
    case 'airQuality':
      return [0, 100];
    default:
      return [0, 100];
  }
};

export const useReadingColor = (value: number, unit?: Unit) => {
  const { colors } = useTheme();
  const lineColors = unit
    ? colors.graphs.lines[unit]
    : colors.graphs.lines.default;
  const yColor = d3.scaleLinear(getGraphColorScale(unit), [1, 0]);
  const colorInterpolation = d3.interpolateRgbBasis([...lineColors]);
  return colorInterpolation(yColor(value));
};
