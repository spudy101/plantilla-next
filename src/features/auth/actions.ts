'use server';

import { redirect } from 'next/navigation';
import { ROUTES, safeRedirectPath } from '@/config/routes';
import { authApi } from './auth.api';
import { fromApiError, fromZodError, readField, type FormState } from './form-state';
import { loginSchema, registerSchema } from './schemas';
import { clearSession, getAccessToken, setSession } from './session';

// Server actions de autenticación. Corren en el servidor: los tokens que devuelve
// el backend van directo a cookies httpOnly y nunca llegan al navegador.
// Ojo: redirect() lanza una excepción interna, por eso va FUERA del try/catch.

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = { email: readField(formData, 'email') };
  const parsed = loginSchema.safeParse({ ...values, password: readField(formData, 'password') });
  if (!parsed.success) {
    return fromZodError(parsed.error, values);
  }

  try {
    await setSession(await authApi.login(parsed.data));
  } catch (error) {
    return fromApiError(error, values);
  }

  redirect(safeRedirectPath(readField(formData, 'next')));
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = {
    firstName: readField(formData, 'firstName'),
    lastName: readField(formData, 'lastName'),
    email: readField(formData, 'email')
  };
  const parsed = registerSchema.safeParse({
    ...values,
    password: readField(formData, 'password'),
    confirmPassword: readField(formData, 'confirmPassword')
  });
  if (!parsed.success) {
    return fromZodError(parsed.error, values);
  }

  try {
    await authApi.register(parsed.data);
    // Inicio de sesión automático después del registro.
    await setSession(await authApi.login({ email: parsed.data.email, password: parsed.data.password }));
  } catch (error) {
    return fromApiError(error, values);
  }

  redirect(ROUTES.dashboard);
}

export async function logoutAction(): Promise<void> {
  const token = await getAccessToken();
  if (token) {
    // Revoca la sesión en el backend; si falla igual se limpia localmente.
    await authApi.logout(token).catch(() => undefined);
  }
  await clearSession();
  redirect(ROUTES.home);
}
