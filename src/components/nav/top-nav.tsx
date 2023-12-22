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

export const TopNav = () => {
  const [isRightNavOpen, setRightNavOpen] = useState(false);

  return (
    <>
      <StyledNav>
        <Link to="/">
          <PageTitle>Home monitor</PageTitle>
        </Link>
        <Flex>
          <LinkButton
            iconLeft="mdiHomeMapMarker"
            text="Map"
            variant="basic"
            to="/map"
          />
          <Button
            iconLeft="mdiCogOutline"
            text="Settings"
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
