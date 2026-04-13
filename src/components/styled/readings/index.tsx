import React, { CSSProperties } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { IconColor, IconType, MdiIcon } from '../mdi-icon';
import { getUnit, getUnitTitle, Unit } from '../../../utils/unit';
import {
  BodyBoldStyle,
  BodyStyle,
  Caption2Style,
  Caption3Style,
  H3Style,
} from '../../../theme/typography';
import { Skeleton } from '../../../assets/loading/skeleton';
import { CustomIcon, CustomIconType } from '../custom-icon';
import { Caption3 } from '../typography';

type ReadingVariant = 'default' | 'min' | 'max' | 'avg';
type ReadingSizeVariant = 'default' | 'small';

interface ReadingProps {
  variant?: ReadingVariant;
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
  align-items: flex-start;
  flex-direction: column;

  padding: ${({ theme }) => theme.spacings.s2}
    ${({ theme }) => theme.spacings.s4};
  width: 100%;

  ${({ $sizeVariant }) => $sizeVariant === 'default' && DefaultStyle};
`;

const StyledReadingValue = styled.div`
  display: flex;
  align-items: center;
`;

const AvgText = styled.span`
  color: ${({ theme }) => theme.colors.typography.secondary};
  font-size: 1rem;
  line-height: 1rem;
  font-family: ${({ theme }) => theme.fonts.fontBody};
  text-transform: uppercase;
  padding-right: ${({ theme }) => theme.spacings.s8};
  padding-top: ${({ theme }) => theme.spacings.s4};
  padding-bottom: ${({ theme }) => theme.spacings.s4};
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

const getCustomIcon = (unit?: Unit): CustomIconType | undefined => {
  if (unit === 'airQuality') return undefined;

  return unit;
};

export const Reading = ({
  variant = 'default',
  sizeVariant = 'default',
  value,
  unit,
  isLoading,
  showTitle = false,
  ...props
}: ReadingProps) => {
  const aggregateIconType = getIconType(variant);
  const customIconType = getCustomIcon(unit);
  const unitStr = unit && getUnit(unit);
  const roundedValue =
    value !== null && value !== undefined ? value.toFixed(1) : '--';
  return (
    <StyledReading {...props} $sizeVariant={sizeVariant}>
      {unit && showTitle && <Caption3>{getUnitTitle(unit)}</Caption3>}
      <StyledReadingValue>
        {aggregateIconType && (
          <MdiIcon
            mr="s12"
            type={aggregateIconType}
            size="s16"
            color={getIconColor(variant)}
          />
        )}
        {customIconType && variant === 'default' && (
          <CustomIcon type={customIconType} size="s16" />
        )}
        {variant === 'avg' && <AvgText>Avg</AvgText>}
        {isLoading ? (
          <Skeleton
            variant={sizeVariant === 'default' ? 'H3' : 'Caption3'}
            width={sizeVariant === 'default' ? undefined : 's48'}
          />
        ) : (
          <>
            <StyledValue>{roundedValue}</StyledValue>
            {unitStr && <StyledUnit>{unitStr}</StyledUnit>}
          </>
        )}
      </StyledReadingValue>
    </StyledReading>
  );
};
