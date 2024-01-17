import React from 'react';
import styled from 'styled-components';
import { Caption2 } from '../styled/typography';
import { Flex } from '../styled/flex';
import { Button } from '../styled/buttons';
import { Toggle } from '../styled/inputs/toggle';
import { useThemeContext } from '../../contexts/theme-context';
import { useRightDrawerContext } from '../styled/menus/right-drawer-context';
import { removeJWTToken } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { LinkButton } from '../styled/buttons/link';
import { Blueprint } from '../../assets/icons/blueprint';

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
  const navigate = useNavigate();
  const { theme, changeTheme } = useThemeContext();
  const { setOpen } = useRightDrawerContext();

  const onLogout = () => {
    removeJWTToken();
    navigate('/login', { replace: true });
  };

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
          <LinkButton
            iconLeft={<Blueprint />}
            text="Map"
            variant="basic"
            to="/map"
          />
        )}
        <LinkButton
          iconLeft="mdiShieldAccount"
          text="Admin Settings"
          variant="basic"
          to="/admin"
        />
        <Button
          iconLeft="mdiLogoutVariant"
          text="Logout"
          variant="basic"
          onClick={onLogout}
        />
      </Flex>
    </StyledNav>
  );
};
