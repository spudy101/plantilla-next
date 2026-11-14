import type { TokenPair } from './types';

// Definición ÚNICA de las cookies de sesión. La usan las server actions (vía
// next/headers) y proxy.ts (vía NextResponse), así nunca divergen.
//
// Los tokens viven en cookies httpOnly: JavaScript del navegador no puede leerlos,
// lo que elimina el robo de tokens por XSS.

export const SESSION_COOKIES = {
  access: 'pm_at',
  refresh: 'pm_rt'
} as const;

// El cookie del access token muere un poco ANTES que el JWT: así proxy.ts refresca
// a tiempo y nunca se manda al backend un token a punto de expirar.
const CLOCK_SKEW_SECONDS = 30;
const DEFAULT_REFRESH_MAX_AGE = 8 * 60 * 60; // tope de sesión del backend (8 h)

export type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
};

export type SessionCookie = { name: string; value: string; options: CookieOptions };

const baseOptions = () => ({
  httpOnly: true,
  // En `next start` local sobre http las cookies "secure" no se guardan: por eso depende del entorno.
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
});

/** Lee el `exp` de un JWT SIN verificarlo (solo para calcular la vida del cookie). */
export function decodeJwtExp(token: string): number | null {
  const payload = token.split('.')[1];
  if (!payload) {
    return null;
  }
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: unknown };
    return typeof exp === 'number' ? exp : null;
  } catch {
    return null;
  }
}

export function buildSessionCookies(tokens: Pick<TokenPair, 'accessToken' | 'refreshToken' | 'expiresIn'>, now = Date.now()) {
  const refreshExp = decodeJwtExp(tokens.refreshToken);
  const refreshMaxAge = refreshExp ? Math.max(refreshExp - Math.floor(now / 1000), 1) : DEFAULT_REFRESH_MAX_AGE;

  return [
    {
      name: SESSION_COOKIES.access,
      value: tokens.accessToken,
      options: { ...baseOptions(), maxAge: Math.max(tokens.expiresIn - CLOCK_SKEW_SECONDS, 1) }
    },
    {
      name: SESSION_COOKIES.refresh,
      value: tokens.refreshToken,
      options: { ...baseOptions(), maxAge: refreshMaxAge }
    }
  ] satisfies SessionCookie[];
}

export const SESSION_COOKIE_NAMES = Object.values(SESSION_COOKIES);
