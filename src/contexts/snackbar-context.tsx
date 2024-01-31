import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CLOSE_TIMEOUT,
  Snackbar as SnackbarComponent,
} from '../components/styled/snackbar';
import styled from 'styled-components';

export type SnackbarVariant = 'success' | 'error';
export type SnackbarState = 'open' | 'closing' | 'closed';

export interface Snackbar {
  id: string;
  variant: SnackbarVariant;
  text: string;
  isCloseable?: boolean;
  autoCloseTimeoutMs?: number;
}

export interface SnackbarContextType {
  openSnackbar: (snackbar: Snackbar) => void;
  closeSnackbar: () => void;
  snackbar?: Snackbar;
  state: SnackbarState;
}

const SnackbarContext = createContext<SnackbarContextType>({
  snackbar: undefined,
  state: 'open',
  openSnackbar: _val => {},
  closeSnackbar: () => {},
});

export const SnackbarContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = useState<Snackbar | undefined>(undefined);

  const [snackbarState, setSnackbarState] = useState<SnackbarState>('closed');

  const openSnackbar = (newSnackbar: Snackbar) => {
    setSnackbar(newSnackbar);
    setSnackbarState('open');
  };

  const closeSnackbar = () => {
    setSnackbarState('closing');
    setTimeout(() => {
      setSnackbarState('closed');
      setSnackbar(undefined);
    }, CLOSE_TIMEOUT);
  };

  const contextValue = useMemo(
    () => ({
      snackbar: snackbar,
      state: snackbarState,
      openSnackbar,
      closeSnackbar,
    }),
    [snackbar, snackbarState]
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => useContext(SnackbarContext);

const SnackbarWrapper = styled.div`
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  margin-top: ${({ theme }) => theme.spacings.s24};
  width: ${({ theme }) => theme.spacings.s640};
  z-index: ${({ theme }) => theme.zIndex.snackbar};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 90%;
  }
`;

export const SnackbarProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <SnackbarContextProvider>
      <SnackbarWrapper>
        <SnackbarComponent />
      </SnackbarWrapper>
      {children}
    </SnackbarContextProvider>
  );
};
