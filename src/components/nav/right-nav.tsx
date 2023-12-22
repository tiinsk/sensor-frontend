import React, { useEffect, useState } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { Caption2 } from '../styled/typography';
import { Flex } from '../styled/flex';
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
  z-index: ${({ theme }) => theme.zIndex.menus};

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

const MobileOnlyButton = styled(Button)`
  display: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
  }
`;

const MobileHiddenButton = styled(Button)`
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`;

interface RightNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightNav = ({ isOpen, onClose }: RightNavProps) => {
  const { theme, changeTheme } = useThemeContext();
  const [isHidden, setHidden] = useState(!isOpen);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setHidden(true);
      }, 200);
    } else {
      setHidden(false);
    }
  }, [isOpen]);

  return (
    <StyledNav
      $isOpen={isOpen}
      aria-hidden={isHidden}
      style={{ visibility: isHidden ? 'hidden' : 'visible' }}
    >
      <Flex justifyContent="flex-end" mb="s16">
        <MobileHiddenButton
          iconLeft="mdiChevronRight"
          text="Settings"
          variant="basic"
          onClick={onClose}
        />
        <MobileOnlyButton
          iconLeft="mdiChevronRight"
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
        <MobileOnlyButton
          iconLeft="mdiHomeMapMarker"
          text="Map"
          variant="basic"
          onClick={() => {}}
        />
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
