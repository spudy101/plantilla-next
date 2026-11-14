import { ButtonLink } from '@/components/ui/button-link';
import { ROUTES } from '@/config/routes';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-brand text-sm font-semibold">404</p>
      <h1 className="text-ink text-2xl font-semibold">Página no encontrada</h1>
      <ButtonLink href={ROUTES.home}>Volver al inicio</ButtonLink>
    </main>
  );
}
