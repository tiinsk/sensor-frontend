import React from 'react';
import styled from 'styled-components';
import { Link, LinkProps } from 'react-router-dom';

import {
  ButtonContent,
  ButtonProps,
  ButtonStyle,
  ButtonVariant,
  SizeVariant,
} from './index';

export const StyledLinkButton = styled(Link)<{
  $variant: ButtonVariant;
  $sizeVariant: SizeVariant;
}>`
  ${ButtonStyle};
`;

export const LinkButton = ({
  variant = 'primary',
  sizeVariant = 'default',
  text,
  iconLeft,
  iconRight,
  disabled,
  buttonRef,
  ...props
}: ButtonProps & LinkProps & { buttonRef?: React.Ref<HTMLAnchorElement> }) => {
  return (
    <StyledLinkButton
      ref={buttonRef}
      $variant={variant}
      $sizeVariant={sizeVariant}
      {...props}
    >
      <ButtonContent
        sizeVariant={sizeVariant}
        iconLeft={iconLeft}
        iconRight={iconRight}
        text={text}
        disabled={disabled}
      />
    </StyledLinkButton>
  );
};
