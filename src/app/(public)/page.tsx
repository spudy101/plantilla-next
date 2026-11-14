import { ButtonLink } from '@/components/ui/button-link';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

const features = [
  { title: 'Sesión segura', text: 'Tokens en cookies httpOnly: el navegador nunca los ve.' },
  { title: 'Rutas protegidas', text: 'proxy.ts refresca la sesión y protege el panel antes de renderizar.' },
  { title: 'Lista para crecer', text: 'Organizada por features: agregar un módulo no toca los demás.' }
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-ink text-4xl font-bold tracking-tight sm:text-5xl">Tu producto empieza aquí</h1>
        <p className="text-ink-soft mt-4 text-lg">
          Base en Next.js conectada a la plantilla de microservicios: registro, login y panel privado listos.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href={ROUTES.register}>Crear cuenta</ButtonLink>
          <ButtonLink href={ROUTES.login} variant="secondary">
            Ya tengo cuenta
          </ButtonLink>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {features.map(f => (
          <Card key={f.title}>
            <h2 className="text-ink font-semibold">{f.title}</h2>
            <p className="text-ink-soft mt-2 text-sm">{f.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
