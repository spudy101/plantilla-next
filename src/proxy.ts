import { NextResponse, type NextRequest } from 'next/server';
import { isAuthPath, isProtectedPath, ROUTES } from '@/config/routes';
import { authApi } from '@/features/auth/auth.api';
import { buildSessionCookies, SESSION_COOKIE_NAMES, SESSION_COOKIES } from '@/features/auth/session-cookies';
import type { TokenPair } from '@/features/auth/types';

/**
 * proxy.ts (Next 16, antes middleware.ts): corre ANTES de renderizar cada página.
 *
 * 1. Refresca la sesión: si el access token expiró pero hay refresh token, lo rota
 *    contra el backend y deja las cookies nuevas en la respuesta Y en el request
 *    actual (así la página que se renderiza ya ve el token nuevo).
 * 2. Protege rutas privadas → /login?next=...
 * 3. Saca de /login y /register a quien ya tiene sesión.
 *
 * No reemplaza la verificación real: el layout privado vuelve a validar con el backend.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = isProtectedPath(pathname);
  const isAuthPage = isAuthPath(pathname);

  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  let hasAccess = request.cookies.has(SESSION_COOKIES.access);
  const refreshToken = request.cookies.get(SESSION_COOKIES.refresh)?.value;
  let refreshed: TokenPair | null = null;

  if (!hasAccess && refreshToken) {
    refreshed = await authApi.refresh(refreshToken).catch(() => null);
    hasAccess = Boolean(refreshed);
  }

  if (isProtected && !hasAccess) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return withClearedSession(NextResponse.redirect(loginUrl));
  }

  if (isAuthPage && hasAccess) {
    return withSession(NextResponse.redirect(new URL(ROUTES.dashboard, request.url)), refreshed);
  }

  if (refreshed) {
    for (const { name, value } of buildSessionCookies(refreshed)) {
      request.cookies.set(name, value);
    }
    return withSession(NextResponse.next({ request }), refreshed);
  }

  // Refresh token inválido en una página de auth: se limpia para no reintentar en cada visita.
  return refreshToken && !hasAccess ? withClearedSession(NextResponse.next()) : NextResponse.next();
}

function withSession(response: NextResponse, tokens: TokenPair | null) {
  if (tokens) {
    for (const { name, value, options } of buildSessionCookies(tokens)) {
      response.cookies.set(name, value, options);
    }
  }
  return response;
}

function withClearedSession(response: NextResponse) {
  for (const name of SESSION_COOKIE_NAMES) {
    response.cookies.delete(name);
  }
  return response;
}

export const config = {
  // Todas las páginas excepto assets, imágenes y archivos con extensión.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
