import React from 'react';
import styled from 'styled-components';
import { Property } from 'csstype';
import { Box } from './box';
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

const StyledFlex = styled(Box)<FlexStyles>`
  display: flex;
  flex: ${({ flex }) => flex};
  flex-direction: ${({ flexDirection }) => flexDirection};
  flex-wrap: ${({ flexWrap }) => flexWrap};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  gap: ${({ theme, gap }) => (gap ? theme.spacings[gap] : 0)};
`;

export const Flex = ({ children, ...props }: FlexProps) => {
  return <StyledFlex {...props}>{children}</StyledFlex>;
};
