import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { IconType, MdiIcon } from '../mdi-icon';
import { Caption2 } from '../typography';
import { Box } from '../box';

type TagVariant = 'default' | 'error';

interface TagProps {
  variant?: TagVariant;
  text?: string;
  iconLeft?: IconType;
}

const ErrorStyle = ({ theme }: { theme: DefaultTheme }) => css`
  background-color: ${theme.colors.error.background};
  color: ${theme.colors.error.typography};
  padding-left: ${({ theme }) => theme.spacings.s4};
`;

const StyledTag = styled.div<{
  $variant: TagVariant;
}>`
  display: flex;
  align-items: center;

  padding: ${({ theme }) => theme.spacings.s4}
    ${({ theme }) => theme.spacings.s8};
  border-radius: ${({ theme }) => theme.spacings.s12};
  width: fit-content;

  color: ${({ theme }) => theme.colors.typography.secondary};
  padding-left: 0;

  ${({ $variant }) => $variant === 'error' && ErrorStyle};
`;

const getIconType = (variant: TagVariant): IconType | undefined => {
  switch (variant) {
    case 'error':
      return 'mdiAlertCircleOutline';
    default:
      return undefined;
  }
};

export const Tag = ({ variant = 'default', text, ...props }: TagProps) => {
  const iconType = getIconType(variant);
  return (
    <StyledTag {...props} $variant={variant}>
      {iconType && <MdiIcon mr="s8" type={iconType} size="s16" />}
      <Caption2>{text}</Caption2>
    </StyledTag>
  );
};
