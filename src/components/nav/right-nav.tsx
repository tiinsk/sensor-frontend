import React from 'react';
import styled from 'styled-components';
import { Caption2 } from '../styled/typography';
import { Flex } from '../styled/flex';
import { Button } from '../styled/buttons';
import { Toggle } from '../styled/inputs/toggle';
import { useThemeContext } from '../../contexts/theme-context';
import { useRightDrawerContext } from '../styled/menus/right-drawer-context';

const StyledNav = styled.div`
  display: flex;
  flex-direction: column;

  padding: ${({ theme }) => theme.spacings.s24}
    ${({ theme }) => theme.spacings.s24};
`;

const ThemeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacings.s16};

  padding-bottom: ${({ theme }) => theme.spacings.s16};

  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
`;

export const RightNav = ({ isMobile }: { isMobile: boolean }) => {
  const { theme, changeTheme } = useThemeContext();
  const { setOpen } = useRightDrawerContext();

  return (
    <StyledNav>
      <Flex justifyContent="flex-end" mb="s16">
        {isMobile ? (
          <Button
            iconLeft="mdiChevronRight"
            variant="basic"
            onClick={() => setOpen(false)}
          />
        ) : (
          <Button
            iconLeft="mdiChevronRight"
            text="Settings"
            variant="basic"
            onClick={() => setOpen(false)}
          />
        )}
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
        {isMobile && (
          <Button
            iconLeft="mdiHomeMapMarker"
            text="Map"
            variant="basic"
            onClick={() => {}}
          />
        )}
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
