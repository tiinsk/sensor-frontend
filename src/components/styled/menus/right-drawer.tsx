import React, { PropsWithChildren, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, ButtonProps } from '../buttons';

import {
  autoUpdate,
  FloatingFocusManager,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { RightDrawerContext } from './right-drawer-context';

const WIDTH = '300px';

interface RightDrawerProps {
  buttonProps: ButtonProps;
}

export const DrawerWrapper = styled.div`
  position: relative;
`;

export const StyledDrawer = styled.div<{ $isOpen: boolean }>`
  width: ${WIDTH};
  position: fixed;
  top: 0;
  bottom: 0;
  right: ${({ $isOpen }) => ($isOpen ? 0 : `-${WIDTH}`)};

  z-index: ${({ theme }) => theme.zIndex.menus};

  background-color: ${({ theme }) => theme.colors.background.primary};
  box-shadow: ${({ theme }) => theme.colors.shadows.boxShadow};

  transition: right 0.1s ease-in;
`;

export const RightDrawer: React.FC<PropsWithChildren<RightDrawerProps>> = ({
  buttonProps,
  children,
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isHidden, setHidden] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setHidden(true);
      }, 200);
    } else {
      setHidden(false);
    }
  }, [isOpen]);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  });
  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const drawerContext = React.useMemo(
    () => ({
      isOpen,
      setOpen,
    }),
    [isOpen, setOpen]
  );

  return (
    <DrawerWrapper {...props}>
      <Button {...buttonProps} onClick={() => setOpen(!isOpen)} />
      <RightDrawerContext.Provider value={drawerContext}>
        <FloatingFocusManager
          context={context}
          modal={true}
          disabled={isHidden}
        >
          <StyledDrawer
            $isOpen={isOpen}
            ref={refs.setFloating}
            aria-hidden={isHidden}
            style={{ visibility: isHidden ? 'hidden' : 'visible' }}
            {...getFloatingProps()}
          >
            {children}
          </StyledDrawer>
        </FloatingFocusManager>
      </RightDrawerContext.Provider>
    </DrawerWrapper>
  );
};
