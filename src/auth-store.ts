import api from './api/routes';

const STORAGE_TOKEN = 'auth';

export interface AuthSnapshot {
  token: string | null;
}

type Listener = () => void;
const listeners = new Set<Listener>();

const readSnapshot = (): AuthSnapshot => ({
  token: localStorage.getItem(STORAGE_TOKEN),
});

const emit = () => {
  cachedSnapshot = readSnapshot();
  listeners.forEach(fn => fn());
};

let cachedSnapshot: AuthSnapshot = readSnapshot();
let extendPromise: Promise<void> | null = null;

export const authStore = {
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot: (): AuthSnapshot => cachedSnapshot,

  getToken: (): string | null => cachedSnapshot.token,

  signIn: (token: string): void => {
    localStorage.setItem(STORAGE_TOKEN, token);
    emit();
  },

  signOut: (): void => {
    localStorage.removeItem(STORAGE_TOKEN);
    emit();
  },

  extendSession: (): Promise<void> => {
    if (!extendPromise) {
      extendPromise = (async () => {
        const { token } = await api.extendSession();
        authStore.signIn(token);
      })().finally(() => {
        extendPromise = null;
      });
    }

    return extendPromise;
  },
};
