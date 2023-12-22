import React from 'react';
import styled from 'styled-components';
import { Unit } from '../../utils/unit';
import { Caption2 } from '../styled/typography';
import { Reading } from '../styled/readings';

const StyledDeviceCard = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacings.s16};

  flex-basis: 33%;

  justify-content: space-between;

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
  avg?: number;
  min?: number;
  max?: number;
}

interface AverageCardProps {
  day: AverageMinMax;
  week: AverageMinMax;
  month: AverageMinMax;

  unit?: Unit;
  title: string;
}

export const AverageCard = ({
  title,
  unit,
  day,
  week,
  month,
}: AverageCardProps) => {
  return (
    <StyledDeviceCard>
      <TimeGroup>
        <Caption2>Day</Caption2>
        <Reading value={day.avg} unit={unit} />
        <Reading
          value={day.max}
          unit={unit}
          variant="max"
          sizeVariant="small"
        />
        <Reading
          value={day.min}
          unit={unit}
          variant="min"
          sizeVariant="small"
        />
      </TimeGroup>
      <Divider />
      <TimeGroup>
        <Caption2>Week</Caption2>
        <Reading value={week.avg} unit={unit} />
        <Reading
          value={week.max}
          unit={unit}
          variant="max"
          sizeVariant="small"
        />
        <Reading
          value={week.min}
          unit={unit}
          variant="min"
          sizeVariant="small"
        />
      </TimeGroup>
      <Divider />
      <TimeGroup>
        <Caption2>Month</Caption2>
        <Reading value={month.avg} unit={unit} />
        <Reading
          value={month.max}
          unit={unit}
          variant="max"
          sizeVariant="small"
        />
        <Reading
          value={month.min}
          unit={unit}
          variant="min"
          sizeVariant="small"
        />
      </TimeGroup>
    </StyledDeviceCard>
  );
};
