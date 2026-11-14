'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/** Error boundary global: cualquier error no controlado de una página cae aquí. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Punto único para enviar a Sentry/Datadog cuando se integre.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-ink text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-ink-soft text-sm">
        Ocurrió un error inesperado.{error.digest && ` Código: ${error.digest}`}
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </main>
  );
}
