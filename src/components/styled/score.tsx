import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { BodyStyle } from '../../theme/typography';
import { Skeleton } from '../../assets/loading/skeleton';

export interface ScoreProps {
  score?: number;
  isLoading?: boolean;
}

const RADIUS = 88;
const STROKE_WIDTH = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function clampScore(raw: number): number {
  return Math.min(100, Math.max(0, Number(raw)));
}

function progressStroke(theme: DefaultTheme, value: number): string {
  if (value === 0) return theme.colors.score.base;

  const SEGMENT_SIZE = 33;
  const MAX_SEGMENT_INDEX = 2;

  const segment = Math.min(
    MAX_SEGMENT_INDEX,
    Math.floor((value - 1) / SEGMENT_SIZE)
  );
  const segmentStart = segment * SEGMENT_SIZE;
  const segmentSpan =
    segment === MAX_SEGMENT_INDEX ? 100 - segmentStart : SEGMENT_SIZE;
  const percentage = ((value - segmentStart) / segmentSpan) * 100;

  const from = theme.colors.score.fill[segment];
  const to = theme.colors.score.fill[segment + 1];

  return `color-mix(in oklab, ${from} ${
    100 - percentage
  }%, ${to} ${percentage}%)`;
}

const StyledScore = styled.div`
  position: relative;
  width: ${({ theme }) => theme.spacings.s64};
  height: ${({ theme }) => theme.spacings.s64};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SvgWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(90deg);
`;

const TrackCircle = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.score.base};
`;

const ProgressCircle = styled.circle<{ $value: number }>`
  fill: none;
  transition:
    stroke-dashoffset 0.3s ease,
    stroke 0.2s ease;
  stroke: ${({ theme, $value }) => progressStroke(theme, $value)};
`;

const CenterColumn = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.s12};
  align-items: center;
  color: ${({ theme }) => theme.colors.typography.primary};
`;

const Value = styled.p`
  ${BodyStyle};
  margin: 0;
  text-align: center;
`;

export const Score = ({ score = 0, isLoading }: ScoreProps) => {
  const clamped = clampScore(score);
  const strokeDashoffset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <StyledScore>
      <SvgWrapper>
        <Svg viewBox="0 0 192 192" aria-hidden>
          <TrackCircle cx={96} cy={96} r={RADIUS} strokeWidth={STROKE_WIDTH} />
          {clamped > 0 && (
            <ProgressCircle
              $value={clamped}
              cx={96}
              cy={96}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
            />
          )}
        </Svg>
      </SvgWrapper>
      <CenterColumn>
        {isLoading ? (
          <Skeleton variant="Body" width="s32" />
        ) : (
          <Value>{clamped.toFixed(0)}</Value>
        )}
      </CenterColumn>
    </StyledScore>
  );
};
