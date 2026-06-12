import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authStore } from '../auth-store';
import { makeTestJwt } from '../test/jwt-fixture';
import { ApiError, apiRequest } from './client';

describe('apiRequest', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('adds bearer token when available', async () => {
    vi.spyOn(authStore, 'getToken').mockReturnValue('token-123');
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    const result = await apiRequest<{ ok: boolean }>('/users');

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/users',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-123',
        }),
      })
    );
  });

  it('signs out and throws ApiError on 401 when authenticated', async () => {
    vi.spyOn(authStore, 'getToken').mockReturnValue('token-123');
    const signOutSpy = vi
      .spyOn(authStore, 'signOut')
      .mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' })
    );

    await expect(apiRequest('/users')).rejects.toBeInstanceOf(ApiError);
    expect(signOutSpy).toHaveBeenCalledTimes(1);
  });

  it('parses error message from JSON body', async () => {
    vi.spyOn(authStore, 'getToken').mockReturnValue(null);
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Unauthorized user' }), {
        status: 401,
      })
    );

    await expect(
      apiRequest('/login', { authenticated: false })
    ).rejects.toEqual(
      expect.objectContaining({
        status: 401,
        message: 'Unauthorized user',
      })
    );
  });

  it('extends session before authenticated requests when token is near expiry', async () => {
    const nearExpiryToken = makeTestJwt({
      exp: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60,
    });
    authStore.signIn(nearExpiryToken);
    const fetchMock = vi.mocked(fetch);
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ token: 'renewed-token' }), {
          status: 200,
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );

    const result = await apiRequest<{ ok: boolean }>('/users');

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain('/api/session/extend');
    expect(authStore.getToken()).toBe('renewed-token');
    expect(
      (fetchMock.mock.calls[1][1]?.headers as Record<string, string>)
        .Authorization
    ).toBe('Bearer renewed-token');
  });

  it('does not extend when token has more than 30 days left', async () => {
    authStore.signIn(
      makeTestJwt({
        exp: Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60,
      })
    );
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    await apiRequest('/users');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain('/api/users');
  });

  it('does not extend the session extend endpoint itself', async () => {
    authStore.signIn(
      makeTestJwt({
        exp: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60,
      })
    );
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ token: 'new-token' }), { status: 200 })
    );

    const result = await apiRequest<{ token: string }>('/session/extend', {
      method: 'POST',
    });

    expect(result).toEqual({ token: 'new-token' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not sign out on 401 when unauthenticated request', async () => {
    vi.spyOn(authStore, 'getToken').mockReturnValue(null);
    const signOutSpy = vi
      .spyOn(authStore, 'signOut')
      .mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' })
    );

    await expect(
      apiRequest('/login', { method: 'POST', authenticated: false })
    ).rejects.toBeInstanceOf(ApiError);
    expect(signOutSpy).not.toHaveBeenCalled();
  });
});
