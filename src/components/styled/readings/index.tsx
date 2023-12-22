import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { IconColor, IconType, MdiIcon } from '../mdi-icon';
import { getUnit, Unit } from '../../../utils/unit';
import { BodyStyle, Caption3Style, H3Style } from '../../../theme/typography';
import { Box } from '../box';

type ReadingVariant = 'default' | 'min' | 'max';
type ReadingSizeVariant = 'default' | 'small';

interface ReadingProps {
  variant?: ReadingVariant;
  sizeVariant?: ReadingSizeVariant;
  value: number;
  unit?: Unit;
}

const StyledValue = styled.p`
  ${Caption3Style};
`;

const StyledUnit = styled.p`
  ${Caption3Style};
`;

const DefaultStyle = ({ theme }: { theme: DefaultTheme }) => css`
  ${StyledValue} {
    ${H3Style};
  }

  ${StyledUnit} {
    ${BodyStyle};
  }
  padding: ${({ theme }) => theme.spacings.s8} 0;
`;

const StyledReading = styled.div<{
  $sizeVariant: ReadingSizeVariant;
}>`
  display: flex;
  align-items: center;

  padding: ${({ theme }) => theme.spacings.s2}
    ${({ theme }) => theme.spacings.s4};
  width: fit-content;

  ${({ $sizeVariant }) => $sizeVariant === 'default' && DefaultStyle};
`;

const getIconType = (variant: ReadingVariant): IconType | undefined => {
  switch (variant) {
    case 'min':
      return 'mdiChevronDown';
    case 'max':
      return 'mdiChevronUp';
    default:
      return undefined;
  }
};

const getIconColor = (variant: ReadingVariant): IconColor | undefined => {
  switch (variant) {
    case 'min':
      return 'air';
    case 'max':
      return 'error';
    default:
      return undefined;
  }
};

export const Reading = ({
  variant = 'default',
  sizeVariant = 'default',
  value,
  unit,
  ...props
}: ReadingProps) => {
  const iconType = getIconType(variant);
  const unitStr = unit && getUnit(unit);
  const roundedValue = value.toFixed(1);
  return (
    <StyledReading {...props} $sizeVariant={sizeVariant}>
      {iconType && (
        <MdiIcon
          mr="s8"
          type={iconType}
          size="s16"
          color={getIconColor(variant)}
        />
      )}
      <StyledValue>{roundedValue}</StyledValue>
      {unitStr && <StyledUnit>{unitStr}</StyledUnit>}
    </StyledReading>
  );
};
