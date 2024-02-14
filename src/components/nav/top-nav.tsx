import React from 'react';
import styled from 'styled-components';
import { PageTitle } from '../styled/typography';
import { Link } from 'react-router-dom';
import { Flex } from '../styled/flex';
import { LinkButton } from '../styled/buttons/link';
import { RightNav } from './right-nav';
import { RightDrawer } from '../styled/menus/right-drawer';
import { Blueprint } from '../../assets/icons/blueprint';

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacings.s24} 0;
  padding-bottom: ${({ theme }) => theme.spacings.s12};
`;

const MobileHiddenLinkButton = styled(LinkButton)`
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`;

const MobileHiddenRightDrawer = styled(RightDrawer)`
  display: flex;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: none;
  }
`;

const MobileRightDrawer = styled(RightDrawer)`
  display: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: flex;
  }
`;

export const TopNav = () => {
  return (
    <>
      <StyledNav>
        <Link to="/">
          <PageTitle>Home monitor</PageTitle>
        </Link>
        <Flex>
          <MobileHiddenLinkButton
            iconLeft={<Blueprint />}
            text="Map"
            variant="basic"
            to="/map"
          />
          <MobileHiddenRightDrawer
            buttonProps={{
              iconLeft: 'mdiCogOutline',
              text: 'Settings',
              variant: 'basic',
            }}
          >
            <RightNav isMobile={false} />
          </MobileHiddenRightDrawer>
          <MobileRightDrawer
            buttonProps={{
              iconLeft: 'mdiMenu',
              variant: 'basic',
            }}
          >
            <RightNav isMobile={true} />
          </MobileRightDrawer>
        </Flex>
      </StyledNav>
    </>
  );
};
