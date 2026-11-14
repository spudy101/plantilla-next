// Rutas de la app en un solo lugar: links, redirects y proxy.ts usan estas constantes.

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard'
} as const;

/** Requieren sesión (incluye subrutas: /dashboard/settings, etc.). */
export const PROTECTED_PREFIXES: readonly string[] = [ROUTES.dashboard];

/** Solo para visitantes: con sesión activa redirigen al dashboard. */
export const AUTH_ROUTES: readonly string[] = [ROUTES.login, ROUTES.register];

export const isProtectedPath = (pathname: string) =>
  PROTECTED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const isAuthPath = (pathname: string) => AUTH_ROUTES.includes(pathname);

/**
 * Evita open redirects (OWASP): solo acepta rutas internas ("/algo"), nunca
 * "//otro-dominio.com" ni URLs absolutas.
 */
export const safeRedirectPath = (value: unknown, fallback: string = ROUTES.dashboard): string => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback;
  }
  return value;
};
