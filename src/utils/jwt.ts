interface JwtPayload {
  exp?: number;
}

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    // JWT uses base64url (- and _); atob() expects standard base64 (+ and /).
    return JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    ) as JwtPayload;
  } catch {
    return null;
  }
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const EXTEND_THRESHOLD_DAYS = 30;

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
};

export const daysUntilExpiry = (token: string): number | null => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;
  return (payload.exp * 1000 - Date.now()) / MS_PER_DAY;
};

export const shouldExtendSession = (token: string): boolean => {
  const days = daysUntilExpiry(token);
  if (days === null) return false;
  return days > 0 && days < EXTEND_THRESHOLD_DAYS;
};
