import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { MdiIcon } from '../../mdi-icon';
import { IconType } from '../../mdi-icon';
import { BodyStyle } from '../../../../theme/v2/typography';
import { Box } from '../../box';

export type ButtonVariant = 'primary' | 'secondary' | 'basic';
export type SizeVariant = 'default' | 'small';

const PrimaryStyle = css`
  background-color: ${({ theme }) => theme.v2.colors.surface.accent.default};
  color: ${({ theme }) => theme.v2.colors.text.onAccent.default};

  &:hover {
    background-color: ${({ theme }) =>
      theme.v2.colors.surface.accent.hover};
  }

  &:disabled,
  &[aria-disabled='true'] {
    background-color: ${({ theme }) => theme.v2.colors.surface.accent.disabled};
    color: ${({ theme }) => theme.v2.colors.text.onAccent.disabled};
  }
`;

const SecondaryStyle = css`
  background-color: ${({ theme }) => theme.v2.colors.surface.deep['20']};
  color: ${({ theme }) => theme.v2.colors.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.v2.colors.surface.deep['30']};
  }

  &:disabled,
  &[aria-disabled='true'] {
    background-color: ${({ theme }) => theme.v2.colors.surface.deep['10']};
    color: ${({ theme }) => theme.v2.colors.text.disabled};
  }
`;

const BasicStyle = css`
  background-color: transparent;
  color: ${({ theme }) => theme.v2.colors.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.v2.colors.surface.deep['10']};
  }

  &:disabled,
  &[aria-disabled='true'] {
    color: ${({ theme }) => theme.v2.colors.text.disabled};
  }
`;

const ButtonText = styled.span`
  ${BodyStyle};
`;

const SmallStyle = ({ theme }: { theme: DefaultTheme }) => css`
  padding: ${theme.spacings.s2} ${theme.spacings.s8};
  gap: ${theme.spacings.s8};
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
  gap: ${theme.spacings.s16};
  width: fit-content;
  height: fit-content;

  transition: padding 0.1s ease-in;

  padding: ${theme.spacings.s12};
  border-width: 0;
  border-radius: ${theme.radius['4']};

  outline: none;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.v2.colors.text.primary} !important;
  }

  cursor: pointer;

  &:disabled,
  &[aria-disabled='true'] {
    cursor: default;
    pointer-events: none;
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
  iconLeft?: IconType | React.ReactNode;
  text?: string;
  iconRight?: IconType | React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  tabIndex?: number;
}

export const ButtonContent = ({
  iconLeft,
  iconRight,
  text,
  sizeVariant,
}: ButtonProps) => {
  const iconSize = sizeVariant === 'default' ? 's24' : 's16';
  return (
    <>
      {iconLeft && typeof iconLeft === 'string' && (
        <MdiIcon size={iconSize} type={iconLeft as IconType} />
      )}
      {iconLeft && typeof iconLeft !== 'string' && <Box>{iconLeft}</Box>}
      {text && <ButtonText>{text}</ButtonText>}
      {iconRight && typeof iconRight === 'string' && (
        <MdiIcon size={iconSize} type={iconRight as IconType} />
      )}
      {iconRight && typeof iconRight !== 'string' && <Box>{iconRight}</Box>}
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
