import { useSyncExternalStore } from 'react';
import { authStore, type AuthSnapshot } from '../auth-store';
import { isTokenExpired } from '../utils/jwt';

type AuthContextValue = AuthSnapshot & {
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
};

export const useAuth = (): AuthContextValue => {
  const { token } = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot
  );

  const isAuthenticated = token !== null && !isTokenExpired(token);

  return {
    token,
    isAuthenticated,
    signIn: authStore.signIn,
    signOut: authStore.signOut,
  };
};
