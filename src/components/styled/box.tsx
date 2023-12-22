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

export interface BoxProps extends Paddings, Margins {
  children?: React.ReactNode;
  component?: React.ElementType;

  p?: Space;
  px?: Space;
  py?: Space;

  m?: Space;
  mx?: Space;
  my?: Space;
}

const StyledBox = styled.div<{
  $pt?: Space;
  $pb?: Space;
  $pl?: Space;
  $pr?: Space;
  $mt?: Space;
  $mb?: Space;
  $ml?: Space;
  $mr?: Space;
}>`
  display: block;

  padding-left: ${({ theme, $pl }) => ($pl ? theme.spacings[$pl] : 0)};
  padding-right: ${({ theme, $pr }) => ($pr ? theme.spacings[$pr] : 0)};
  padding-bottom: ${({ theme, $pb }) => ($pb ? theme.spacings[$pb] : 0)};
  padding-top: ${({ theme, $pt }) => ($pt ? theme.spacings[$pt] : 0)};

  margin-left: ${({ theme, $ml }) => ($ml ? theme.spacings[$ml] : 0)};
  margin-right: ${({ theme, $mr }) => ($mr ? theme.spacings[$mr] : 0)};
  margin-bottom: ${({ theme, $mb }) => ($mb ? theme.spacings[$mb] : 0)};
  margin-top: ${({ theme, $mt }) => ($mt ? theme.spacings[$mt] : 0)};
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
    $pl: pl || px || p,
    $pr: pr || px || p,
    $pt: pt || py || p,
    $pb: pb || py || p,

    $ml: ml || mx || m,
    $mr: mr || mx || m,
    $mt: mt || my || m,
    $mb: mb || my || m,
  };

  return (
    <StyledBox {...paddingsAndMargins} {...props} as={component}>
      {children}
    </StyledBox>
  );
};
