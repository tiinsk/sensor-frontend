import React from 'react';
import styled from 'styled-components';
import { Box } from './box';
import {
  BodyLightStyle,
  BodyStyle,
  Caption1Style,
  Caption2LightStyle,
  Caption2Style,
  Caption3Style,
  H1Style,
  H2Style,
  H3Style,
} from '../../theme/typography';

const StyledH1 = styled(Box)`
  ${H1Style};
`;

export const H1 = ({ children, ...props }: { children?: React.ReactNode }) => {
  return (
    <StyledH1 {...props} component="h1">
      {children}
    </StyledH1>
  );
};

const StyledH2 = styled(Box)`
  ${H2Style};
`;

export const H2 = ({ children, ...props }: { children?: React.ReactNode }) => {
  return (
    <StyledH2 {...props} component="h2">
      {children}
    </StyledH2>
  );
};

const StyledH3 = styled(Box)`
  ${H3Style};
`;

export const H3 = ({ children, ...props }: { children?: React.ReactNode }) => {
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
}) => {
  return (
    <StyledBodyLight {...props} component="body">
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
}) => {
  return (
    <StyledBody {...props} component="body">
      {children}
    </StyledBody>
  );
};

const StyledCaption1 = styled(Box)`
  ${Caption1Style};
`;

export const Caption1 = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
}) => {
  return (
    <StyledCaption1 {...props} component="body">
      {children}
    </StyledCaption1>
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
}) => {
  return (
    <StyledCaption2Light {...props} component="body">
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
}) => {
  return (
    <StyledCaption2 {...props} component="body">
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
}) => {
  return (
    <StyledCaption3 {...props} component="body">
      {children}
    </StyledCaption3>
  );
};
