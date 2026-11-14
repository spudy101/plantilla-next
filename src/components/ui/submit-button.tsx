'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './button';

type SubmitButtonProps = {
  children: ReactNode;
  pendingText: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
};

/** Botón de submit que se deshabilita solo mientras el <form> padre está enviando. */
export function SubmitButton({ children, pendingText, variant, fullWidth }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} fullWidth={fullWidth} disabled={pending} aria-busy={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}
