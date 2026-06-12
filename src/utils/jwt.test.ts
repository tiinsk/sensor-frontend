import { describe, expect, it } from 'vitest';
import { decodeJwtPayload, isTokenExpired } from './jwt';
import { futureExp, makeTestJwt, pastExp } from '../test/jwt-fixture';

describe('decodeJwtPayload', () => {
  it('decodes a valid payload', () => {
    const exp = futureExp();
    const token = makeTestJwt({ exp, sub: 'user' });

    expect(decodeJwtPayload(token)).toEqual({ exp, sub: 'user' });
  });

  it('returns null for malformed tokens', () => {
    expect(decodeJwtPayload('not-a-jwt')).toBeNull();
    expect(decodeJwtPayload('a.b')).toBeNull();
  });
});

describe('isTokenExpired', () => {
  it('returns false when exp is in the future', () => {
    expect(isTokenExpired(makeTestJwt({ exp: futureExp() }))).toBe(false);
  });

  it('returns true when exp is in the past', () => {
    expect(isTokenExpired(makeTestJwt({ exp: pastExp() }))).toBe(true);
  });

  it('returns false when exp is missing', () => {
    expect(isTokenExpired(makeTestJwt({ sub: 'user' }))).toBe(false);
  });
});
