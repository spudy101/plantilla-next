import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = { title: 'Crear cuenta' };

export default function RegisterPage() {
  return (
    <Card>
      <h1 className="text-ink text-2xl font-semibold">Crear cuenta</h1>
      <p className="text-ink-soft mt-1 mb-6 text-sm">Te toma menos de un minuto.</p>
      <RegisterForm />
    </Card>
  );
}
