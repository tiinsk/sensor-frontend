import Qs from 'qs';

import { authStore } from '../auth-store';
import config from '../config';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiParams {
  route: string;
  payload?: unknown;
  params?: object;
}

type ApiRequestOptions = RequestInit & {
  params?: object;
  authenticated?: boolean;
};

export const buildQuery = (params?: object): string =>
  params ? Qs.stringify(params, { arrayFormat: 'repeat' }) : '';

const buildUrl = (path: string, query?: string): string => {
  const base = `${config.api.route}/api${path}`;
  return query ? `${base}?${query}` : base;
};

const parseErrorMessage = (text: string): string => {
  try {
    const json = JSON.parse(text) as { error?: string };
    return json.error ?? text;
  } catch {
    return text || 'Request failed';
  }
};

const jsonBody = (payload?: unknown): string | undefined =>
  payload !== undefined ? JSON.stringify(payload) : undefined;

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { params, authenticated = true, ...fetchOptions } = options;
  const token = authenticated ? authStore.getToken() : null;

  const headers: Record<string, string> = {
    ...((fetchOptions.headers as Record<string, string>) ?? {}),
  };

  if (fetchOptions.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, buildQuery(params)), {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      authStore.signOut();
    }
    const text = await response.text().catch(() => response.statusText);
    throw new ApiError(response.status, parseErrorMessage(text));
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
};

const mutate = <T>(
  method: 'POST' | 'PUT',
  params: ApiParams,
  authenticated = true
): Promise<T> =>
  apiRequest<T>(params.route, {
    method,
    body: jsonBody(params.payload),
    params: params.params,
    authenticated,
  });

export const api = {
  get: <T>(params: ApiParams): Promise<T> =>
    apiRequest<T>(params.route, {
      method: 'GET',
      params: params.params,
    }),

  post: <T>(params: ApiParams, authenticated = true): Promise<T> =>
    mutate<T>('POST', params, authenticated),

  put: <T>(params: ApiParams): Promise<T> => mutate<T>('PUT', params),
};
