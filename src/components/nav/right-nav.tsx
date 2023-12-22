import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { PageTitle } from '../styled/typography';
import { Link } from 'react-router-dom';
import { Flex } from '../styled/flex';
import { LinkButton } from '../styled/buttons/link';
import { Button } from '../styled/buttons';

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
    ${({ theme }) => theme.spacings.s40};

  transition: right 0.1s ease-in;

  ${({ $isOpen }) => $isOpen && OpenStyle};
`;

interface RightNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightNav = ({ isOpen, onClose }: RightNavProps) => {
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
      <Flex flexDirection="column" alignItems="flex-start">
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
