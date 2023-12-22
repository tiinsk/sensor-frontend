import React, { useState } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { Caption2, PageTitle } from '../styled/typography';
import { Link } from 'react-router-dom';
import { Flex } from '../styled/flex';
import { LinkButton } from '../styled/buttons/link';
import { Button } from '../styled/buttons';
import { Toggle } from '../styled/inputs/toggle';
import { useThemeContext } from '../../contexts/theme-context';

const WIDTH = '300px';

const OpenStyle = ({ theme }: { theme: DefaultTheme }) => css`
  right: 0;
`;

const StyledNav = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: -${WIDTH};
  bottom: 0;
  width: ${WIDTH};

  background-color: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  display: flex;
  flex-direction: column;

  padding: ${({ theme }) => theme.spacings.s24}
    ${({ theme }) => theme.spacings.s24};

  transition: right 0.1s ease-in;

  ${({ $isOpen }) => $isOpen && OpenStyle};
`;

const ThemeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacings.s16};

  padding-bottom: ${({ theme }) => theme.spacings.s16};

  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
`;

interface RightNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightNav = ({ isOpen, onClose }: RightNavProps) => {
  const { theme, changeTheme } = useThemeContext();

  return (
    <StyledNav $isOpen={isOpen}>
      <Flex justifyContent="flex-end" mb="s16">
        <Button
          iconLeft="mdiChevronRight"
          text="Settings"
          variant="basic"
          onClick={onClose}
        />
      </Flex>
      <ThemeSection>
        <Caption2>Theme</Caption2>
        <Toggle
          name="theme-toggle"
          text="Use dark mode"
          isSelected={theme === 'dark'}
          onChange={() => changeTheme(theme === 'dark' ? 'light' : 'dark')}
        />
      </ThemeSection>
      <Flex flexDirection="column" alignItems="flex-start" mt="s24">
        <Button
          iconLeft="mdiShieldAccount"
          text="Admin Settings"
          variant="basic"
          onClick={() => {}}
        />
        <Button
          iconLeft="mdiLogoutVariant"
          text="Logout"
          variant="basic"
          onClick={() => {}}
        />
      </Flex>
    </StyledNav>
  );
};
