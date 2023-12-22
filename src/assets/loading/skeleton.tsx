import React, { CSSProperties } from 'react';
import styled, { useTheme } from 'styled-components';
import { Space } from '../../theme';

type SkeletonVariant =
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'Body'
  | 'PageTitle'
  | 'Caption2'
  | 'Caption3';

interface SkeletonProps {
  variant: SkeletonVariant;
  width?: Space;
  style?: CSSProperties;
}

const StyledSkeleton = styled.div`
  @keyframes skeleton-animation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  animation: 2s ease-in-out 0.5s infinite normal none running skeleton-animation;

  background-color: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.spacings.s4};
`;

const getHeight = (variant: SkeletonVariant) => {
  switch (variant) {
    case 'H1':
      return '4.1rem';
    case 'H2':
      return '3.4rem';
    case 'H3':
      return '2.8rem';
    case 'H4':
      return '2.4rem';
    case 'PageTitle':
      return '2rem';
    case 'Body':
      return '2.4rem';
    case 'Caption2':
      return '1.4rem';
    case 'Caption3':
      return '1.2rem';
  }
};

export const Skeleton = ({
  variant,
  width,
  style,
  ...props
}: SkeletonProps) => {
  const { spacings } = useTheme();
  return (
    <StyledSkeleton
      style={{
        width: width ? spacings[width] : '100%',
        height: getHeight(variant),
        ...style,
      }}
      {...props}
    />
  );
};
