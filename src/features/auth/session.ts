import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { isApiError } from '@/lib/api/api-error';
import { authApi } from './auth.api';
import { buildSessionCookies, SESSION_COOKIE_NAMES, SESSION_COOKIES } from './session-cookies';
import type { TokenPair, User } from './types';

// Sesión del lado del servidor. Escribir cookies solo es posible en server actions
// y route handlers; leerlas, en cualquier server component.

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIES.access)?.value;
}

export async function hasSession(): Promise<boolean> {
  const store = await cookies();
  return store.has(SESSION_COOKIES.access) || store.has(SESSION_COOKIES.refresh);
}

export async function setSession(tokens: TokenPair): Promise<void> {
  const store = await cookies();
  for (const { name, value, options } of buildSessionCookies(tokens)) {
    store.set(name, value, options);
  }
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  for (const name of SESSION_COOKIE_NAMES) {
    store.delete(name);
  }
}

/**
 * Usuario autenticado o null. `cache` lo deduplica dentro de un mismo request:
 * el layout privado y la página pueden llamarlo sin pegarle dos veces al backend.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }
  try {
    return await authApi.me(token);
  } catch (error) {
    if (isApiError(error) && error.isUnauthorized) {
      return null;
    }
    throw error;
  }
});
