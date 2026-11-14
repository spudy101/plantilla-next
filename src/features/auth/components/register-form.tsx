'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/config/routes';
import { registerAction } from '../actions';
import { initialFormState } from '../form-state';

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialFormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state.message && <Alert>{state.message}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="firstName" label="Nombre" error={errors.firstName}>
          <Input name="firstName" autoComplete="given-name" defaultValue={state.values?.firstName} required />
        </FormField>
        <FormField id="lastName" label="Apellido" error={errors.lastName}>
          <Input name="lastName" autoComplete="family-name" defaultValue={state.values?.lastName} required />
        </FormField>
      </div>

      <FormField id="email" label="Correo electrónico" error={errors.email}>
        <Input name="email" type="email" autoComplete="email" defaultValue={state.values?.email} required />
      </FormField>

      <FormField
        id="password"
        label="Contraseña"
        error={errors.password}
        hint="Mínimo 10 caracteres, con mayúscula, minúscula, número y carácter especial."
      >
        <Input name="password" type="password" autoComplete="new-password" required />
      </FormField>

      <FormField id="confirmPassword" label="Repite la contraseña" error={errors.confirmPassword}>
        <Input name="confirmPassword" type="password" autoComplete="new-password" required />
      </FormField>

      <Button type="submit" fullWidth disabled={pending} aria-busy={pending}>
        {pending ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>

      <p className="text-ink-soft text-center text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link href={ROUTES.login} className="text-brand font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
