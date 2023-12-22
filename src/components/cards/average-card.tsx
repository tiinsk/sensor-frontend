import React from 'react';
import styled from 'styled-components';
import { Unit } from '../../utils/unit';
import { Body, Caption2 } from '../styled/typography';
import { Reading } from '../styled/readings';
import { Flex } from '../styled/flex';

const StyledDeviceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.s16};
  padding: ${({ theme }) => theme.spacings.s16};

  flex-basis: 33%;

  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};
`;

const TimeGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  width: 1px;
  background-color: ${({ theme }) => theme.colors.borders.secondary};
`;

interface AverageMinMax {
  avg?: number | null;
  min?: number | null;
  max?: number | null;
}

interface AverageCardProps {
  day: AverageMinMax;
  week: AverageMinMax;
  month: AverageMinMax;

  unit?: Unit;
  title: string;
  isLoading?: boolean;
}

export const AverageCard = ({
  title,
  unit,
  day,
  week,
  month,
  isLoading,
}: AverageCardProps) => {
  return (
    <StyledDeviceCard>
      <Body>{title}</Body>
      <Flex justifyContent="space-between">
        <TimeGroup>
          <Caption2 mb="s8">Day</Caption2>
          <Reading
            value={day.avg}
            unit={unit}
            sizeVariant="small"
            variant="avg"
            isLoading={isLoading}
          />
          <Reading
            value={day.max}
            unit={unit}
            variant="max"
            sizeVariant="small"
            isLoading={isLoading}
          />
          <Reading
            value={day.min}
            unit={unit}
            variant="min"
            sizeVariant="small"
            isLoading={isLoading}
          />
        </TimeGroup>
        <Divider />
        <TimeGroup>
          <Caption2 mb="s8">Week</Caption2>
          <Reading
            value={week.avg}
            unit={unit}
            sizeVariant="small"
            variant="avg"
            isLoading={isLoading}
          />
          <Reading
            value={week.max}
            unit={unit}
            variant="max"
            sizeVariant="small"
            isLoading={isLoading}
          />
          <Reading
            value={week.min}
            unit={unit}
            variant="min"
            sizeVariant="small"
            isLoading={isLoading}
          />
        </TimeGroup>
        <Divider />
        <TimeGroup>
          <Caption2 mb="s8">Month</Caption2>
          <Reading
            value={month.avg}
            unit={unit}
            sizeVariant="small"
            variant="avg"
            isLoading={isLoading}
          />
          <Reading
            value={month.max}
            unit={unit}
            variant="max"
            sizeVariant="small"
            isLoading={isLoading}
          />
          <Reading
            value={month.min}
            unit={unit}
            variant="min"
            sizeVariant="small"
            isLoading={isLoading}
          />
        </TimeGroup>
      </Flex>
    </StyledDeviceCard>
  );
};
