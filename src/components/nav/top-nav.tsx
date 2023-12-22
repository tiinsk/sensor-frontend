import React, { useState } from 'react';
import styled from 'styled-components';
import { PageTitle } from '../styled/typography';
import { Link } from 'react-router-dom';
import { Flex } from '../styled/flex';
import { LinkButton } from '../styled/buttons/link';
import { Button } from '../styled/buttons';
import { RightNav } from './right-nav';

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacings.s24} 0;
`;

const MobileHiddenLinkButton = styled(LinkButton)`
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`;

const MobileHiddenButton = styled(Button)`
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`;

const MobileOnlyButton = styled(Button)`
  display: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
  }
`;

export const TopNav = () => {
  const [isRightNavOpen, setRightNavOpen] = useState(false);

  return (
    <>
      <StyledNav>
        <Link to="/">
          <PageTitle>Home monitor</PageTitle>
        </Link>
        <Flex>
          <MobileHiddenLinkButton
            iconLeft="mdiHomeMapMarker"
            text="Map"
            variant="basic"
            to="/map"
          />
          <MobileHiddenButton
            iconLeft="mdiCogOutline"
            text="Settings"
            variant="basic"
            onClick={() => setRightNavOpen(!isRightNavOpen)}
          />
          <MobileOnlyButton
            iconLeft="mdiMenu"
            variant="basic"
            onClick={() => setRightNavOpen(!isRightNavOpen)}
          />
        </Flex>
      </StyledNav>
      <RightNav
        isOpen={isRightNavOpen}
        onClose={() => setRightNavOpen(false)}
      />
    </>
  );
};
