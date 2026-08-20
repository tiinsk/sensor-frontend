import React, { useId } from 'react';
import styled, { useTheme } from 'styled-components';

import {
  Caption2Style,
  LabelStyle,
  MonoBodyStyle,
} from '../../../theme/v2/typography';
import {
  getGraphColorScale,
  useReadingColor,
} from '../../../utils/graph-color';
import { getUnit, getUnitTitle, type Unit } from '../../../utils/unit';
import { Reading } from '../readings/v2';

const SIZE = 91;
const INNER = 65;
const TICK_COUNT = 44;
const TICK_WIDTH = 3;
const TICK_LENGTH = 10;
const TICK_RADIUS = 1;

export type ScaleProps = {
  value: number;
  unit?: Unit;
  min?: number | null;
  max?: number | null;
};

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 1.8rem;
  width: fit-content;
`;

const GaugeColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.s4};
`;

const MinMax = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding-right: ${({ theme }) => theme.spacings.s4};
`;

const Title = styled.p`
  ${LabelStyle};
`;

const Gauge = styled.div`
  position: relative;
  width: ${SIZE / 10}rem;
  height: ${SIZE / 10}rem;
  flex-shrink: 0;
`;

const Ring = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const Center = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: ${INNER / 10}rem;
  height: ${INNER / 10}rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.v2.colors.surface.elevated['30']};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacings.s2};
`;

const ValueText = styled.span`
  ${MonoBodyStyle};
`;

const UnitText = styled.span`
  ${Caption2Style};
  color: ${({ theme }) => theme.v2.colors.text.tertiary};
`;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const Scale = ({ value, unit, min, max }: ScaleProps) => {
  const theme = useTheme();
  const labelId = useId();
  const [scaleMin, scaleMax] = getGraphColorScale(unit);
  const scaleValue = clamp(value, scaleMin, scaleMax);
  const progress =
    scaleMax === scaleMin ? 0 : (scaleValue - scaleMin) / (scaleMax - scaleMin);
  const filledCount = Math.round(progress * TICK_COUNT);
  const activeColor = useReadingColor(value, unit);
  const inactiveColor = theme.v2.colors.surface.deep['20'];
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const tickCenterR = SIZE / 2 - TICK_LENGTH / 2;
  const unitLabel = unit ? getUnit(unit) : undefined;
  const title = unit ? getUnitTitle(unit) : undefined;
  const showMinMax = min != null || max != null;

  const displayValue = Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);

  const accessibleLabel = [title, displayValue, unitLabel]
    .filter(Boolean)
    .join(' ');

  return (
    <Root role="img" aria-labelledby={labelId}>
      <span id={labelId} hidden>
        {accessibleLabel}
      </span>
      <GaugeColumn>
        {title && <Title>{title}</Title>}
        <Gauge>
          <Ring viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
            {Array.from({ length: TICK_COUNT }, (_, index) => {
              const angleDeg = 90 + (index / TICK_COUNT) * 360;
              const angle = (angleDeg * Math.PI) / 180;
              const x = cx + Math.cos(angle) * tickCenterR;
              const y = cy + Math.sin(angle) * tickCenterR;
              const isActive = index < filledCount;

              return (
                <rect
                  key={index}
                  x={x - TICK_WIDTH / 2}
                  y={y - TICK_LENGTH / 2}
                  width={TICK_WIDTH}
                  height={TICK_LENGTH}
                  rx={TICK_RADIUS}
                  fill={isActive ? activeColor : inactiveColor}
                  transform={`rotate(${angleDeg - 90} ${x} ${y})`}
                />
              );
            })}
          </Ring>
          <Center>
            <ValueText>{displayValue}</ValueText>
            {unitLabel && <UnitText>{unitLabel}</UnitText>}
          </Center>
        </Gauge>
      </GaugeColumn>
      {showMinMax && (
        <MinMax>
          {max != null && (
            <Reading variant="max" value={max} unit={unit} size="small" />
          )}
          {min != null && (
            <Reading variant="min" value={min} unit={unit} size="small" />
          )}
        </MinMax>
      )}
    </Root>
  );
};
