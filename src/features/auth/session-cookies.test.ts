import { describe, expect, it } from 'vitest';
import { buildSessionCookies, decodeJwtExp, SESSION_COOKIES } from './session-cookies';

const fakeJwt = (payload: object) =>
  ['header', Buffer.from(JSON.stringify(payload)).toString('base64url'), 'signature'].join('.');

describe('decodeJwtExp', () => {
  it('lee el exp del payload', () => {
    expect(decodeJwtExp(fakeJwt({ exp: 1_900_000_000 }))).toBe(1_900_000_000);
  });

  it('devuelve null con tokens inválidos', () => {
    expect(decodeJwtExp('no-es-un-jwt')).toBeNull();
    expect(decodeJwtExp('a.%%%.c')).toBeNull();
  });
});

describe('buildSessionCookies', () => {
  const now = 1_800_000_000_000;

  it('el access cookie muere antes que el token y el refresh dura hasta su exp', () => {
    const [access, refresh] = buildSessionCookies(
      { accessToken: 'a', refreshToken: fakeJwt({ exp: now / 1000 + 3600 }), expiresIn: 900 },
      now
    );
    expect(access).toMatchObject({ name: SESSION_COOKIES.access, value: 'a', options: { httpOnly: true, maxAge: 870 } });
    expect(refresh?.options.maxAge).toBe(3600);
  });
});
