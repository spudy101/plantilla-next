import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/site-header';

/** Layout centrado para login y registro. proxy.ts saca de aquí a quien ya tiene sesión. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </>
  );
}
