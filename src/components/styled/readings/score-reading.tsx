import React, { CSSProperties } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { getUnitTitle, Unit } from '../../../utils/unit';
import {
  BodyBoldStyle,
  Caption2Style,
  Caption3Style,
} from '../../../theme/typography';
import { Score } from '../score';

type ReadingSizeVariant = 'default' | 'small';

interface ReadingProps {
  sizeVariant?: ReadingSizeVariant;
  value?: number | null;
  unit?: Unit;
  isLoading?: boolean;
  style?: CSSProperties;
  showTitle?: boolean;
}

const StyledValue = styled.p`
  ${Caption3Style};
  margin-right: ${({ theme }) => theme.spacings.s4};
`;

const StyledUnit = styled.p`
  ${Caption3Style};
`;

const DefaultStyle = ({ theme }: { theme: DefaultTheme }) => css`
  ${StyledValue} {
    ${BodyBoldStyle};
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 2rem;
      line-height: 2.4rem;
    }
  }

  ${StyledUnit} {
    ${Caption2Style};
  }
  padding: ${({ theme }) => theme.spacings.s8} 0;
`;

const StyledReading = styled.div<{
  $sizeVariant: ReadingSizeVariant;
}>`
  display: flex;
  align-items: center;
  flex-direction: column;

  padding: ${({ theme }) => theme.spacings.s2}
    ${({ theme }) => theme.spacings.s4};
  gap: ${({ theme }) => theme.spacings.s4};

  ${({ $sizeVariant }) => $sizeVariant === 'default' && DefaultStyle};
`;

const StyledTitle = styled.div`
  ${Caption3Style};
  color: ${({ theme }) => theme.colors.typography.secondary};
`;

export const ScoreReading = ({
  sizeVariant = 'default',
  value,
  unit,
  isLoading,
  showTitle = false,
  ...props
}: ReadingProps) => {
  return (
    <StyledReading {...props} $sizeVariant={sizeVariant}>
      {unit && showTitle && <StyledTitle>{getUnitTitle(unit)}</StyledTitle>}
      <Score score={value || undefined} isLoading={isLoading} />
    </StyledReading>
  );
};
