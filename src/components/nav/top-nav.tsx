import React from 'react';
import styled from 'styled-components';
import { PageTitle } from '../styled/typography';
import { Link } from 'react-router-dom';
import { Flex } from '../styled/flex';
import { LinkButton } from '../styled/buttons/link';
import { Button } from '../styled/buttons';

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacings.s24}
    ${({ theme }) => theme.spacings.s48};
`;

export const TopNav = () => {
  return (
    <StyledNav>
      <Link to="/" style={{ textDecoration: 'none' }}>
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
          onClick={() => console.log('not yet implemented')}
        />
      </Flex>
    </StyledNav>
  );
};
