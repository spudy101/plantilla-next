import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { ROUTES } from '@/config/routes';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { getCurrentUser } from '@/features/auth/session';

/**
 * Segunda barrera (la primera es proxy.ts): si el token no es válido para el backend,
 * no se renderiza nada privado.
 */
export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(ROUTES.login);
  }

  return (
    <>
      <SiteHeader
        actions={
          <>
            <span className="text-ink-soft hidden text-sm sm:inline">{user.email}</span>
            <LogoutButton />
          </>
        }
      />
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
    </>
  );
}
