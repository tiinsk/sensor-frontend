import React from 'react';
import styled from 'styled-components';
import { Box, BoxProps } from './box';
import {
  BodyLightStyle,
  BodyStyle,
  Caption2LightStyle,
  Caption2Style,
  Caption3Style,
  H1Style,
  H2Style,
  H3Style,
  PageTitleStyle,
} from '../../theme/typography';

const StyledH1 = styled(Box)`
  ${H1Style};
`;

export const H1 = ({
  children,
  ...props
}: { children?: React.ReactNode } & BoxProps) => {
  return (
    <StyledH1 {...props} component="h1">
      {children}
    </StyledH1>
  );
};

const StyledH2 = styled(Box)`
  ${H2Style};
`;

export const H2 = ({
  children,
  ...props
}: { children?: React.ReactNode } & BoxProps) => {
  return (
    <StyledH2 {...props} component="h2">
      {children}
    </StyledH2>
  );
};

const StyledH3 = styled(Box)`
  ${H3Style};
`;

export const H3 = ({
  children,
  ...props
}: { children?: React.ReactNode } & BoxProps) => {
  return (
    <StyledH3 {...props} component="h3">
      {children}
    </StyledH3>
  );
};

const StyledBodyLight = styled(Box)`
  ${BodyLightStyle};
`;

export const BodyLight = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & BoxProps) => {
  return (
    <StyledBodyLight {...props} component="p">
      {children}
    </StyledBodyLight>
  );
};

const StyledBody = styled(Box)`
  ${BodyStyle};
`;

export const Body = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & BoxProps) => {
  return (
    <StyledBody {...props} component="p">
      {children}
    </StyledBody>
  );
};

const StyledPageTitle = styled(Box)`
  ${PageTitleStyle};
`;

export const PageTitle = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & BoxProps) => {
  return (
    <StyledPageTitle {...props} component="span">
      {children}
    </StyledPageTitle>
  );
};

const StyledCaption2Light = styled(Box)`
  ${Caption2LightStyle};
`;

export const Caption2Light = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & BoxProps) => {
  return (
    <StyledCaption2Light {...props} component="p">
      {children}
    </StyledCaption2Light>
  );
};

const StyledCaption2 = styled(Box)`
  ${Caption2Style};
`;

export const Caption2 = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & BoxProps) => {
  return (
    <StyledCaption2 {...props} component="p">
      {children}
    </StyledCaption2>
  );
};

const StyledCaption3 = styled(Box)`
  ${Caption3Style};
`;

export const Caption3 = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
} & BoxProps) => {
  return (
    <StyledCaption3 {...props} component="p">
      {children}
    </StyledCaption3>
  );
};
