import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

import { MdiIcon } from '../mdi-icon';
import { IconType } from '../mdi-icon';
import { BodyStyle, Caption2Style } from '../../../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'basic';
export type SizeVariant = 'default' | 'small';

const PrimaryStyle = css`
  background-color: ${({ theme }) => theme.colors.buttons.background.primary};

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.buttons.backgroundHover.primary};
  }

  &:disabled {
    background-color: ${({ theme }) =>
      theme.colors.buttons.background.primaryDisabled};
  }

  color: ${({ theme }) => theme.colors.buttons.typography.primary};
`;
const SecondaryStyle = css`
  background-color: ${({ theme }) => theme.colors.buttons.background.secondary};

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.buttons.backgroundHover.secondary};
  }

  &:disabled {
    background-color: ${({ theme }) =>
      theme.colors.buttons.background.secondaryDisabled};
  }

  color: ${({ theme }) => theme.colors.buttons.typography.secondary};
`;
const BasicStyle = css`
  background-color: transparent;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.buttons.backgroundHover.basic};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.typography.disabled};
  }

  color: ${({ theme }) => theme.colors.typography.primary};
`;

const ButtonText = styled.span<{ $sizeVariant: SizeVariant }>`
  ${({ $sizeVariant }) =>
    $sizeVariant === 'default' ? BodyStyle : Caption2Style};
`;

const SmallStyle = ({ theme }: { theme: DefaultTheme }) => css`
  padding: ${theme.spacings.s8} ${theme.spacings.s12};
  border-radius: ${theme.spacings.s4};
`;

export const ButtonStyle = ({
  theme,
  $variant,
  $sizeVariant,
}: {
  theme: DefaultTheme;
  $variant: ButtonVariant;
  $sizeVariant: SizeVariant;
}) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;

  transition: padding 0.1s ease-in;

  padding: ${theme.spacings.s12};
  border-width: 0;
  border-radius: ${theme.spacings.s8};

  outline: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.typography.primary} !important;
  }

  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  ${$variant === 'primary' && PrimaryStyle};
  ${$variant === 'secondary' && SecondaryStyle};
  ${$variant === 'basic' && BasicStyle};
  ${$sizeVariant === 'small' && SmallStyle};
`;

export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $sizeVariant: SizeVariant;
}>`
  ${ButtonStyle};
`;

export interface ButtonProps {
  variant?: ButtonVariant;
  sizeVariant?: SizeVariant;
  iconLeft?: IconType;
  text?: string;
  iconRight?: IconType;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  tabIndex?: number;
}

export const ButtonContent = ({
  iconLeft,
  iconRight,
  text,
  sizeVariant = 'default',
}: ButtonProps) => {
  const iconSize = sizeVariant === 'default' ? 's24' : 's16';
  return (
    <>
      {iconLeft && (
        <MdiIcon
          size={iconSize}
          type={iconLeft}
          mr={text ? 's16' : undefined}
        />
      )}
      {text && <ButtonText $sizeVariant={sizeVariant}>{text}</ButtonText>}
      {iconRight && <MdiIcon size={iconSize} type={iconRight} ml="s16" />}
    </>
  );
};

export const Button = ({
  variant = 'primary',
  sizeVariant = 'default',
  text,
  iconLeft,
  iconRight,
  disabled,
  onClick,
  buttonRef,
  tabIndex,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={variant}
      $sizeVariant={sizeVariant}
      disabled={disabled}
      onClick={onClick}
      ref={buttonRef}
      tabIndex={tabIndex}
      {...props}
    >
      <ButtonContent
        sizeVariant={sizeVariant}
        iconLeft={iconLeft}
        iconRight={iconRight}
        text={text}
        disabled={disabled}
      />
    </StyledButton>
  );
};
