import React from 'react';
import styled from 'styled-components';
import { Space } from '../../theme';

interface Paddings {
  pt?: Space;
  pb?: Space;
  pl?: Space;
  pr?: Space;
}

interface Margins {
  mt?: Space;
  mb?: Space;
  ml?: Space;
  mr?: Space;
}

interface BoxProps extends Paddings, Margins {
  children?: React.ReactNode;
  component?: React.ElementType;

  p?: Space;
  px?: Space;
  py?: Space;

  m?: Space;
  mx?: Space;
  my?: Space;
}

const StyledBox = styled.div<Paddings & Margins>`
  display: block;

  padding-left: ${({ theme, pl }) => (pl ? theme.spacings[pl] : 0)};
  padding-right: ${({ theme, pr }) => (pr ? theme.spacings[pr] : 0)};
  padding-bottom: ${({ theme, pb }) => (pb ? theme.spacings[pb] : 0)};
  padding-top: ${({ theme, pt }) => (pt ? theme.spacings[pt] : 0)};

  margin-left: ${({ theme, ml }) => (ml ? theme.spacings[ml] : 0)};
  margin-right: ${({ theme, mr }) => (mr ? theme.spacings[mr] : 0)};
  margin-bottom: ${({ theme, mb }) => (mb ? theme.spacings[mb] : 0)};
  margin-top: ${({ theme, mt }) => (mt ? theme.spacings[mt] : 0)};
`;

export const Box = ({
  children,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  component,
  ...props
}: BoxProps) => {
  const paddingsAndMargins = {
    paddingLeft: pl || px || p,
    paddingRight: pr || px || p,
    paddingTop: pt || py || p,
    paddingBottom: pb || py || p,

    marginLeft: ml || mx || m,
    marginRight: mr || mx || m,
    marginTop: mt || my || m,
    marginBottom: mb || my || m,
  };

  return (
    <StyledBox {...paddingsAndMargins} {...props} as={component}>
      {children}
    </StyledBox>
  );
};
