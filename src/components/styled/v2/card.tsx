import React, { ReactNode } from 'react';
import styled from 'styled-components';

export type CardProps = {
  children?: ReactNode;
};

const Root = styled.div`
  background-color: ${({ theme }) => theme.v2.colors.surface.deep['10']};
  border-radius: ${({ theme }) => theme.radius['4']};
  padding: ${({ theme }) => `${theme.spacings.s16}`};
`;

export const Card = ({ children }: CardProps) => {
  return <Root>{children}</Root>;
};
