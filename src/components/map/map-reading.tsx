import React from 'react';
import styled, { css, DefaultTheme, useTheme } from 'styled-components';
import { Unit } from '../../utils/unit';
import { H4 } from '../styled/typography';
import { Reading } from '../styled/readings';
import { Flex } from '../styled/flex';
import * as d3 from 'd3';
import { MAX_TEMP, MIN_TEMP } from '../graphs/graph';
import { DateTime } from 'luxon';
import { getTimeAgoString } from '../../utils/datetime';
import { Tag } from '../styled/tag';

const StyledMapReading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingStyle = ({ theme }: { theme: DefaultTheme }) => css`
  background-image: radial-gradient(
    50% 50% at 50% 50%,
    ${theme.colors.background.tertiary} 0%,
    rgba(255, 255, 255, 0) 100%
  );
`;

const DefaultStyle = ({
  $color,
}: {
  $color: { r: number; g: number; b: number };
}) => css`
  background-image: radial-gradient(
    50% 50% at 50% 50%,
    ${`rgba(${$color.r}, ${$color.g}, ${$color.b}, 0.25)`} 0%,
    rgba(255, 255, 255, 0) 100%
  );
`;

const BackgroundCircle = styled.div<{
  $color: { r: number; g: number; b: number };
  $isLoading: boolean;
}>`
  position: absolute;
  width: ${({ theme }) => theme.spacings.s128};
  height: ${({ theme }) => theme.spacings.s128};

  ${({ $isLoading }) => ($isLoading ? LoadingStyle : DefaultStyle)};
`;

const ColorCircle = styled.div`
  padding: ${({ theme }) => theme.spacings.s8};
  border-radius: ${({ theme }) => theme.spacings.s16};
`;

const InnerCircle = styled.div`
  width: ${({ theme }) => theme.spacings.s12};
  height: ${({ theme }) => theme.spacings.s12};
  border-radius: ${({ theme }) => theme.spacings.s8};
`;

interface AverageMinMax {
  avg?: number | null;
  min?: number | null;
  max?: number | null;
  created_at?: string;
}

interface MapReadingProps {
  reading: AverageMinMax;
  unit: Unit;
  title: string;
  isLoading?: boolean;
  variant?: 'latest' | 'avg';
}

export const MapReading = ({
  title,
  unit,
  reading,
  isLoading,
  variant = 'latest',
}: MapReadingProps) => {
  const { colors, spacings } = useTheme();
  const yColor = d3.scaleLinear([MIN_TEMP, MAX_TEMP], [1, 0]);
  const colorInterpolation = d3.interpolateRgbBasis(colors.graphs.lines[unit]);

  const color = colorInterpolation(yColor(reading.avg || 0));

  const [r, g, b] = color
    .replace('rgb(', '')
    .replace(')', '')
    .split(', ')
    .map(value => parseInt(value));

  const timeDiff = reading.created_at
    ? Math.abs(DateTime.fromISO(reading.created_at).diffNow('minutes').minutes)
    : 0;
  const tagVariant = timeDiff > 20 ? 'error' : 'default';

  return (
    <StyledMapReading>
      <BackgroundCircle $isLoading={!!isLoading} $color={{ r, g, b }} />
      <ColorCircle
        style={{
          backgroundColor: isLoading
            ? colors.background.tertiary
            : `rgba(${r},${g}, ${b}, 0.25)`,
        }}
      >
        <InnerCircle
          style={{
            backgroundColor: isLoading ? colors.background.tertiary : color,
          }}
        />
      </ColorCircle>
      <H4 mt="s4">{title}</H4>
      <Flex flexDirection="column" alignItems="center">
        <Reading
          value={reading.avg}
          unit={unit}
          sizeVariant={variant === 'latest' ? 'default' : 'small'}
          variant={variant === 'latest' ? 'default' : 'avg'}
          isLoading={isLoading}
          style={{
            padding: variant === 'latest' ? spacings.s4 : undefined,
            width: 'fit-content',
          }}
        />
        {variant === 'latest' && (
          <Tag
            variant={tagVariant}
            text={getTimeAgoString(reading.created_at)}
            isLoading={isLoading}
          />
        )}
        <Flex flexDirection="column">
          <Reading
            value={reading.max}
            unit={unit}
            variant="max"
            sizeVariant="small"
            isLoading={isLoading}
          />
          <Reading
            value={reading.min}
            unit={unit}
            variant="min"
            sizeVariant="small"
            isLoading={isLoading}
          />
        </Flex>
      </Flex>
    </StyledMapReading>
  );
};
