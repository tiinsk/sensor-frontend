import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { authStore } from '../auth-store';
import { futureExp, makeTestJwt, pastExp } from '../test/jwt-fixture';
import { useAuth } from './auth-context';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    authStore.signOut();
  });

  it('is unauthenticated by default', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('updates snapshot on sign in and sign out', () => {
    const token = makeTestJwt({ exp: futureExp() });
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.signIn(token);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(token);

    act(() => {
      result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('is unauthenticated when token is expired', () => {
    const expiredToken = makeTestJwt({ exp: pastExp() });
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.signIn(expiredToken);
    });

    expect(result.current.token).toBe(expiredToken);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
