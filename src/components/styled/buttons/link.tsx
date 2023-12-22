import React from 'react';
import styled from 'styled-components';
import { LinkProps } from 'react-router-dom';

import {
  ButtonContent,
  ButtonProps,
  ButtonStyle,
  ButtonVariant,
} from './index';

export const StyledLinkButton = styled.a<{ $variant: ButtonVariant }>`
  ${ButtonStyle};
`;

export const LinkButton = ({
  variant = 'primary',
  text,
  iconLeft,
  iconRight,
  disabled,
  ...props
}: ButtonProps & LinkProps) => {
  return (
    <StyledLinkButton $variant={variant} {...props}>
      <ButtonContent
        iconLeft={iconLeft}
        iconRight={iconRight}
        text={text}
        disabled={disabled}
      />
    </StyledLinkButton>
  );
};
