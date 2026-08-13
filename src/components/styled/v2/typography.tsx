import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from '../box';
import {
  BodyStyle,
  BodyLightStyle,
  Caption1Style,
  Caption2Style,
  LabelStyle,
  H1Style,
  H2Style,
  H3Style,
  H4Style,
  MonoBodyStyle,
  MonoCaption1Style,
  MonoCaption2Style,
  MonoLabelStyle,
  MonoH1Style,
  MonoH2Style,
  MonoH3Style,
  MonoH4Style,
  PageTitleStyle,
} from '../../../theme/v2/typography';
import { Skeleton } from '../../../assets/loading/skeleton';
import { Font, Space } from '../../../theme';

interface TypographyProps extends BoxProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  isLoading?: boolean;
  loadingWidth?: Space;
  font?: Font;
}

const StyledH1 = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? H1Style : MonoH1Style)};
`;

export const H1 = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="H1" width={loadingWidth} />;
  }

  return (
    <StyledH1 {...props} component="h1" $font={font}>
      {children}
    </StyledH1>
  );
};

const StyledH2 = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? H2Style : MonoH2Style)};
`;

export const H2 = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="H2" width={loadingWidth} />;
  }

  return (
    <StyledH2 {...props} component="h2" $font={font}>
      {children}
    </StyledH2>
  );
};

const StyledH3 = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? H3Style : MonoH3Style)};
`;

export const H3 = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="H3" width={loadingWidth} />;
  }

  return (
    <StyledH3 {...props} component="h3" $font={font}>
      {children}
    </StyledH3>
  );
};

const StyledH4 = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? H4Style : MonoH4Style)};
`;

export const H4 = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="H4" width={loadingWidth} />;
  }

  return (
    <StyledH4 {...props} component="h4" $font={font}>
      {children}
    </StyledH4>
  );
};

const StyledBodyLight = styled(Box)`
  ${BodyLightStyle};
`;

export const BodyLight = ({
  children,
  isLoading,
  loadingWidth,
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="Body" width={loadingWidth} />;
  }

  return (
    <StyledBodyLight {...props} component="p">
      {children}
    </StyledBodyLight>
  );
};

const StyledBody = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? BodyStyle : MonoBodyStyle)};
`;

export const Body = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="Body" width={loadingWidth} />;
  }

  return (
    <StyledBody {...props} component="p" $font={font}>
      {children}
    </StyledBody>
  );
};

const StyledPageTitle = styled(Box)`
  ${PageTitleStyle};
`;

export const PageTitle = ({
  children,
  isLoading,
  loadingWidth,
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="PageTitle" width={loadingWidth} />;
  }

  return (
    <StyledPageTitle {...props} component="span">
      {children}
    </StyledPageTitle>
  );
};

const StyledCaption1 = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? Caption1Style : MonoCaption1Style)};
`;

export const Caption1 = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="Caption1" width={loadingWidth} />;
  }

  return (
    <StyledCaption1 {...props} component="p" $font={font}>
      {children}
    </StyledCaption1>
  );
};

const StyledCaption2 = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? Caption2Style : MonoCaption2Style)};
`;

export const Caption2 = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="Caption2" width={loadingWidth} />;
  }

  return (
    <StyledCaption2 {...props} component="p" $font={font}>
      {children}
    </StyledCaption2>
  );
};

const StyledLabel = styled(Box)<{ $font: Font }>`
  ${({ $font }) => ($font === 'sans' ? LabelStyle : MonoLabelStyle)};
`;

export const Label = ({
  children,
  isLoading,
  loadingWidth,
  font = 'sans',
  ...props
}: TypographyProps) => {
  if (isLoading) {
    return <Skeleton variant="Label" width={loadingWidth} />;
  }

  return (
    <StyledLabel {...props} component="label" $font={font}>
      {children}
    </StyledLabel>
  );
};
