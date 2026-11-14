'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { loginAction } from '../actions';
import { initialFormState } from '../form-state';

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialFormState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state.message && <Alert>{state.message}</Alert>}
      <input type="hidden" name="next" value={next ?? ''} />

      <FormField id="email" label="Correo electrónico" error={state.fieldErrors?.email}>
        <Input name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </FormField>

      <FormField id="password" label="Contraseña" error={state.fieldErrors?.password}>
        <Input name="password" type="password" autoComplete="current-password" required />
      </FormField>

      <Button type="submit" fullWidth disabled={pending} aria-busy={pending}>
        {pending ? 'Ingresando…' : 'Ingresar'}
      </Button>

      <p className="text-ink-soft text-center text-sm">
        ¿No tienes cuenta?{' '}
        <Link href={ROUTES.register} className="text-brand font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
