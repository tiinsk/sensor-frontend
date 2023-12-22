import React from 'react';
import styled from 'styled-components';
import { Property } from 'csstype';
import { Box, BoxProps } from './box';
import { Space } from '../../theme';

interface FlexStyles {
  flex?: Property.Flex;
  flexDirection?: Property.FlexDirection;
  flexWrap?: Property.FlexWrap;
  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
  gap?: Space;
}

interface FlexProps extends FlexStyles {
  children?: React.ReactNode;
}

const StyledFlex = styled(Box)<{
  $flex?: Property.Flex;
  $flexDirection?: Property.FlexDirection;
  $flexWrap?: Property.FlexWrap;
  $justifyContent?: Property.JustifyContent;
  $alignItems?: Property.AlignItems;
  $gap?: Space;
}>`
  display: flex;
  flex: ${({ $flex }) => $flex};
  flex-direction: ${({ $flexDirection }) => $flexDirection};
  flex-wrap: ${({ $flexWrap }) => $flexWrap};
  justify-content: ${({ $justifyContent }) => $justifyContent};
  align-items: ${({ $alignItems }) => $alignItems};
  gap: ${({ theme, $gap }) => ($gap ? theme.spacings[$gap] : 0)};
`;

export const Flex = ({
  children,
  flex,
  flexDirection,
  flexWrap,
  justifyContent,
  alignItems,
  gap,
  ...props
}: FlexProps & BoxProps) => {
  return (
    <StyledFlex
      $flex={flex}
      $flexDirection={flexDirection}
      $flexWrap={flexWrap}
      $alignItems={alignItems}
      $justifyContent={justifyContent}
      $gap={gap}
      {...props}
    >
      {children}
    </StyledFlex>
  );
};
