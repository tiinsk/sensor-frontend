import React from 'react';
import styled from 'styled-components';
import { PageTitle } from '../../styled/v2/typography';
import { Link } from 'react-router';
import { Flex } from '../../styled/flex';
import { LinkButton } from '../../styled/buttons/v2/link';
import { RightNav } from './right-nav';
import { RightDrawer } from '../../styled/menus/v2/right-drawer';
import { Blueprint } from '../../../assets/icons/blueprint';
import { App } from '../../../assets/icons/app';

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacings.s24} 0;
  padding-bottom: ${({ theme }) => theme.spacings.s12};
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.s8};
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
        <StyledLink to="/v2">
          <App color="accent" />
          <PageTitle>Home monitor V2</PageTitle>
        </StyledLink>
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
