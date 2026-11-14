import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = { title: 'Ingresar' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  return (
    <Card>
      <h1 className="text-ink text-2xl font-semibold">Ingresar</h1>
      <p className="text-ink-soft mt-1 mb-6 text-sm">Bienvenido de vuelta.</p>
      <LoginForm next={next} />
    </Card>
  );
}
