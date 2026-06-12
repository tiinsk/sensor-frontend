import { describe, expect, it } from 'vitest';
import {
  daysUntilExpiry,
  decodeJwtPayload,
  isTokenExpired,
  shouldExtendSession,
} from './jwt';
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

describe('daysUntilExpiry', () => {
  it('returns days remaining for a future exp', () => {
    const token = makeTestJwt({
      exp: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60,
    });

    expect(daysUntilExpiry(token)).toBeGreaterThan(9);
    expect(daysUntilExpiry(token)).toBeLessThanOrEqual(10);
  });

  it('returns null when exp is missing', () => {
    expect(daysUntilExpiry(makeTestJwt({ sub: 'user' }))).toBeNull();
  });
});

describe('shouldExtendSession', () => {
  it('returns true when less than 30 days remain', () => {
    const token = makeTestJwt({
      exp: Math.floor(Date.now() / 1000) + 15 * 24 * 60 * 60,
    });

    expect(shouldExtendSession(token)).toBe(true);
  });

  it('returns false when more than 30 days remain', () => {
    const token = makeTestJwt({
      exp: Math.floor(Date.now() / 1000) + 45 * 24 * 60 * 60,
    });

    expect(shouldExtendSession(token)).toBe(false);
  });

  it('returns false when token is expired', () => {
    expect(shouldExtendSession(makeTestJwt({ exp: pastExp() }))).toBe(false);
  });
});
