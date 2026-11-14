import { describe, expect, it } from 'vitest';
import { isAuthPath, isProtectedPath, ROUTES, safeRedirectPath } from './routes';

describe('safeRedirectPath (anti open-redirect)', () => {
  it('acepta rutas internas', () => {
    expect(safeRedirectPath('/dashboard?tab=1')).toBe('/dashboard?tab=1');
  });

  it.each(['https://malo.com', '//malo.com', '/\\malo.com', '', null, undefined])('rechaza %s', value => {
    expect(safeRedirectPath(value)).toBe(ROUTES.dashboard);
  });
});

describe('clasificación de rutas', () => {
  it('protege el dashboard y sus subrutas, no rutas parecidas', () => {
    expect(isProtectedPath('/dashboard')).toBe(true);
    expect(isProtectedPath('/dashboard/settings')).toBe(true);
    expect(isProtectedPath('/dashboards')).toBe(false);
  });

  it('identifica páginas de auth', () => {
    expect(isAuthPath('/login')).toBe(true);
    expect(isAuthPath('/')).toBe(false);
  });
});
