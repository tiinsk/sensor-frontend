import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../api/client';
import { authStore } from '../auth-store';
import { futureExp, makeTestJwt, pastExp } from '../test/jwt-fixture';
import { ProtectedRoute } from './protected-route';

const renderWithRoute = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<p>login page</p>} />
        <Route
          path="/protected-route"
          element={
            <ProtectedRoute>
              <p>protected content</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    localStorage.clear();
    authStore.signOut();
  });

  it('renders children when authenticated', () => {
    authStore.signIn(makeTestJwt({ exp: futureExp() }));

    renderWithRoute('/protected-route');

    expect(screen.getByText('protected content')).toBeInTheDocument();
    expect(screen.queryByText('login page')).not.toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    renderWithRoute('/protected-route');

    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('redirects to /login when token is expired', () => {
    authStore.signIn(makeTestJwt({ exp: pastExp() }));

    renderWithRoute('/protected-route');

    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('redirects to login after an authenticated API call returns 401', async () => {
    authStore.signIn(makeTestJwt({ exp: futureExp() }));

    renderWithRoute('/protected-route');

    expect(screen.getByText('protected content')).toBeInTheDocument();

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' })
    );

    await act(async () => {
      await expect(apiRequest('/users')).rejects.toMatchObject({ status: 401 });
    });

    await waitFor(() => {
      expect(screen.getByText('login page')).toBeInTheDocument();
      expect(screen.queryByText('protected content')).not.toBeInTheDocument();
    });
  });
});
