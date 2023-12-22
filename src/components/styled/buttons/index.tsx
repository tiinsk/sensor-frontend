import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

import { MdiIcon } from '../mdi-icon';
import { IconType } from '../mdi-icon';
import { BodyStyle } from '../../../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'basic';

const PrimaryStyle = css`
  background-color: ${({ theme }) => theme.colors.buttons.background.primary};

  &:disabled {
    background-color: ${({ theme }) =>
      theme.colors.buttons.background.primaryDisabled};
  }

  color: ${({ theme }) => theme.colors.buttons.typography.primary};
`;
const SecondaryStyle = css`
  background-color: ${({ theme }) => theme.colors.buttons.background.secondary};

  &:disabled {
    background-color: ${({ theme }) =>
      theme.colors.buttons.background.secondaryDisabled};
  }

  color: ${({ theme }) => theme.colors.buttons.typography.secondary};
`;
const BasicStyle = css`
  background-color: transparent;

  &:disabled {
    color: ${({ theme }) => theme.colors.typography.disabled};
  }

  &:hover {
    padding: ${({ theme }) => theme.spacings.s12};
    text-decoration: underline;
  }

  color: ${({ theme }) => theme.colors.typography.primary};
`;

const ButtonText = styled.span`
  ${BodyStyle};
`;

export const ButtonStyle = ({
  theme,
  $variant,
}: {
  theme: DefaultTheme;
  $variant: ButtonVariant;
}) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;

  transition: padding 0.1s ease-in;

  padding: ${theme.spacings.s12};
  border-radius: ${theme.spacings.s8};

  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:hover {
    padding: ${theme.spacings.s16};
  }

  ${$variant === 'primary' && PrimaryStyle};
  ${$variant === 'secondary' && SecondaryStyle};
  ${$variant === 'basic' && BasicStyle};
`;

export const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  ${ButtonStyle};
`;

export interface ButtonProps {
  variant?: ButtonVariant;
  iconLeft?: IconType;
  text?: string;
  iconRight?: IconType;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonContent = ({ iconLeft, iconRight, text }: ButtonProps) => {
  return (
    <>
      {iconLeft && <MdiIcon type={iconLeft} mr="s16" />}
      <ButtonText>{text}</ButtonText>
      {iconRight && <MdiIcon type={iconRight} ml="s16" />}
    </>
  );
};

export const Button = ({
  variant = 'primary',
  text,
  iconLeft,
  iconRight,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={variant}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <ButtonContent
        iconLeft={iconLeft}
        iconRight={iconRight}
        text={text}
        disabled={disabled}
      />
    </StyledButton>
  );
};
