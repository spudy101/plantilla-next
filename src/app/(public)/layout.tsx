import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { ButtonLink } from '@/components/ui/button-link';
import { ROUTES } from '@/config/routes';
import { hasSession } from '@/features/auth/session';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const loggedIn = await hasSession();

  return (
    <>
      <SiteHeader
        actions={
          loggedIn ? (
            <ButtonLink href={ROUTES.dashboard}>Ir a mi panel</ButtonLink>
          ) : (
            <>
              <ButtonLink href={ROUTES.login} variant="secondary">
                Ingresar
              </ButtonLink>
              <ButtonLink href={ROUTES.register}>Crear cuenta</ButtonLink>
            </>
          )
        }
      />
      <main>{children}</main>
    </>
  );
}
