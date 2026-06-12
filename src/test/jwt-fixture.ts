const toBase64Url = (value: string): string =>
  btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export const makeTestJwt = (payload: Record<string, unknown>): string => {
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = toBase64Url(JSON.stringify(payload));
  return `${header}.${body}.test-signature`;
};

export const futureExp = (): number => Math.floor(Date.now() / 1000) + 3600;

export const pastExp = (): number => Math.floor(Date.now() / 1000) - 3600;
