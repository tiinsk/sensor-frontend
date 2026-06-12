import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authStore } from '../auth-store';
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
