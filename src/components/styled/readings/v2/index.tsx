import React from 'react';
import styled, { css } from 'styled-components';

import {
  Skeleton,
  SkeletonPulseStyle,
} from '../../../../assets/loading/skeleton';
import {
  LabelStyle,
  MonoBodyStyle,
  MonoCaption1Style,
} from '../../../../theme/v2/typography';
import { useReadingColor } from '../../../../utils/graph-color';
import { getUnit, getUnitTitle, type Unit } from '../../../../utils/unit';
import { IconColor, IconType, MdiIcon } from '../../mdi-icon';

export type ReadingVariant = 'default' | 'min' | 'max' | 'avg' | 'colorMarker';
export type ReadingSize = 'default' | 'small';

export type ReadingProps = {
  variant?: ReadingVariant;
  size?: ReadingSize;
  value?: number | null;
  unit?: Unit;
  isLoading?: boolean;
  showTitle?: boolean;
};

const getSkeletonVariant = (size: ReadingSize) => {
  if (size === 'small') return 'Caption1';
  return 'Body';
};

const getIndicator = (variant: ReadingVariant) => {
  if (variant === 'min') {
    return {
      type: 'mdiChevronDown' as IconType,
      color: 'pressure' as IconColor,
    };
  }
  if (variant === 'max') {
    return { type: 'mdiChevronUp' as IconType, color: 'error' as IconColor };
  }
  return undefined;
};

const formatValue = (value?: number | null) => {
  if (value === null || value === undefined) {
    return '--';
  }
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1);
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.spacings.s2};
`;

const Title = styled.p`
  ${LabelStyle};
`;

const Row = styled.div<{ $variant: ReadingVariant; $size: ReadingSize }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.s4};
  padding: ${({ $size, theme }) =>
    $size === 'small' ? `${theme.spacings.s2} 0` : 0};
`;

const ValueGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.s2};
  white-space: nowrap;
`;

const ValueText = styled.span<{ $size: ReadingSize }>`
  ${({ $size }) => $size === 'small' && MonoCaption1Style};
  ${({ $size }) => $size === 'default' && MonoBodyStyle};
`;

const UnitText = styled.span`
  ${LabelStyle};
  color: ${({ theme }) => theme.v2.colors.text.tertiary};
`;

const LoadingColorMarkerStyle = css`
  ${SkeletonPulseStyle};
  background-color: ${({ theme }) => theme.colors.background.tertiary};
`;

const ColorMarker = styled.span<{ $isLoading?: boolean }>`
  width: ${({ theme }) => theme.spacings.s8};
  height: ${({ theme }) => theme.spacings.s8};
  border-radius: ${({ theme }) => theme.radius.full};
  flex-shrink: 0;
  ${({ $isLoading }) => $isLoading && LoadingColorMarkerStyle};
`;

const Prefix = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacings.s24};
  flex-shrink: 0;
`;

const AvgLabel = styled.span`
  ${LabelStyle};
  text-transform: uppercase;
  color: ${({ theme }) => theme.v2.colors.text.tertiary};
`;

export const Reading = ({
  variant = 'default',
  size = 'default',
  value,
  unit,
  isLoading,
  showTitle = false,
}: ReadingProps) => {
  const unitLabel = unit ? getUnit(unit) : undefined;
  const unitTitle = unit ? getUnitTitle(unit) : undefined;
  const indicator = getIndicator(variant);
  const markerColor = useReadingColor(value ?? 0, unit);

  return (
    <Root role="group" aria-label={unitTitle}>
      {showTitle && <Title aria-hidden="true">{unitTitle}</Title>}
      <Row $variant={variant} $size={size}>
        {variant !== 'default' && (
          <Prefix>
            {variant === 'avg' && <AvgLabel>AVG</AvgLabel>}
            {variant === 'colorMarker' && (
              <ColorMarker
                $isLoading={isLoading}
                style={{
                  backgroundColor: !isLoading ? markerColor : undefined,
                }}
              />
            )}
            {indicator && (
              <MdiIcon
                type={indicator.type}
                size={size === 'default' ? 's16' : 's12'}
                color={indicator.color}
              />
            )}
          </Prefix>
        )}
        {isLoading ? (
          <Skeleton variant={getSkeletonVariant(size)} width="s32" />
        ) : (
          <ValueGroup>
            <ValueText $size={size}>{formatValue(value)}</ValueText>
            {unitLabel && <UnitText>{unitLabel}</UnitText>}
          </ValueGroup>
        )}
      </Row>
    </Root>
  );
};
