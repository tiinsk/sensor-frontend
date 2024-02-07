import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CLOSE_TIMEOUT,
  Snackbar as SnackbarComponent,
} from '../components/styled/snackbar';
import styled from 'styled-components';

export type SnackbarVariant = 'success' | 'error';
export type SnackbarState = 'open' | 'closing' | 'closed';

const AUTO_CLOSE_TIMEOUT_MS = 5000;

export interface Snackbar {
  variant: SnackbarVariant;
  title: string;
  body?: string;
  isCloseable?: boolean;
  isAutoCloseable?: boolean;
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

  const autoCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSnackbarOpen = (newSnackbar: Snackbar) => {
    setSnackbar(newSnackbar);
    setSnackbarState('open');

    if (newSnackbar.isAutoCloseable) {
      autoCloseTimeout.current = setTimeout(() => {
        closeSnackbar();
      }, AUTO_CLOSE_TIMEOUT_MS);
    }
  };

  const openSnackbar = (newSnackbar: Snackbar) => {
    if (snackbarState !== 'closed') {
      closeSnackbar();
      setTimeout(() => {
        setSnackbarOpen(newSnackbar);
      }, CLOSE_TIMEOUT);
    } else {
      setSnackbarOpen(newSnackbar);
    }
  };

  const closeSnackbar = () => {
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current);
    }
    autoCloseTimeout.current = null;
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
  width: ${({ theme }) => theme.spacings.s640};
  z-index: ${({ theme }) => theme.zIndex.snackbar};
  height: 0;

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
