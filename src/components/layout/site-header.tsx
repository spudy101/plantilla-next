import Link from 'next/link';
import type { ReactNode } from 'react';
import { ROUTES } from '@/config/routes';

/** Header común: marca a la izquierda, acciones (según contexto) a la derecha. */
export function SiteHeader({ actions }: { actions?: ReactNode }) {
  return (
    <header className="border-line bg-surface border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href={ROUTES.home} className="text-ink text-lg font-semibold">
          Plantilla
        </Link>
        <nav className="flex items-center gap-2">{actions}</nav>
      </div>
    </header>
  );
}
