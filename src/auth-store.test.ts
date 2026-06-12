import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import api from './api/routes';
import { authStore } from './auth-store';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    authStore.signOut();
  });

  it('returns null token by default', () => {
    expect(authStore.getToken()).toBeNull();
    expect(authStore.getSnapshot()).toEqual({ token: null });
  });

  it('persists token on signIn', () => {
    authStore.signIn('token-abc');

    expect(authStore.getToken()).toBe('token-abc');
    expect(localStorage.getItem('auth')).toBe('token-abc');
  });

  it('clears token on signOut', () => {
    authStore.signIn('token-abc');
    authStore.signOut();

    expect(authStore.getToken()).toBeNull();
    expect(localStorage.getItem('auth')).toBeNull();
  });

  it('notifies subscribers on signIn and signOut', () => {
    const listener = vi.fn();
    const unsubscribe = authStore.subscribe(listener);

    authStore.signIn('token-abc');
    authStore.signOut();
    unsubscribe();

    expect(listener).toHaveBeenCalledTimes(2);
  });

  describe('extendSession', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('saves the renewed token', async () => {
      vi.spyOn(api, 'extendSession').mockResolvedValueOnce({
        token: 'renewed-token',
      });

      await authStore.extendSession();

      expect(api.extendSession).toHaveBeenCalledTimes(1);
      expect(authStore.getToken()).toBe('renewed-token');
    });

    it('deduplicates concurrent calls', async () => {
      vi.spyOn(api, 'extendSession').mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ token: 'renewed-token' }), 50)
          )
      );

      await Promise.all([
        authStore.extendSession(),
        authStore.extendSession(),
      ]);

      expect(api.extendSession).toHaveBeenCalledTimes(1);
      expect(authStore.getToken()).toBe('renewed-token');
    });
  });
});
