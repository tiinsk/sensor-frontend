import React, { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

export type CardProps = {
  children?: ReactNode;
  style?: CSSProperties;
};

const Root = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.v2.colors.surface.deep['10']};
  border-radius: ${({ theme }) => theme.radius['4']};
  padding: ${({ theme }) => `${theme.spacings.s16}`};
`;

export const Card = ({ children, style }: CardProps) => {
  return <Root style={style}>{children}</Root>;
};
