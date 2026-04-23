import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { getUnitTitle, Unit } from '../../../utils/unit';
import { Caption3Style } from '../../../theme/typography';
import { Score } from '../score';

interface ReadingProps {
  value?: number | null;
  unit?: Unit;
  isLoading?: boolean;
  style?: CSSProperties;
  showTitle?: boolean;
}

const StyledReading = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: fit-content;

  padding: ${({ theme }) => theme.spacings.s2}
    ${({ theme }) => theme.spacings.s4};
  gap: ${({ theme }) => theme.spacings.s4};

  padding: ${({ theme }) => theme.spacings.s8} 0;
`;

const StyledTitle = styled.div`
  ${Caption3Style};
  color: ${({ theme }) => theme.colors.typography.secondary};
`;

export const ScoreReading = ({
  value,
  unit,
  isLoading,
  showTitle = false,
  ...props
}: ReadingProps) => {
  return (
    <StyledReading {...props}>
      {unit && showTitle && <StyledTitle>{getUnitTitle(unit)}</StyledTitle>}
      <Score score={value || undefined} isLoading={isLoading} />
    </StyledReading>
  );
};
