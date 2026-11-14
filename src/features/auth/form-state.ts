import { z } from 'zod';
import { isApiError } from '@/lib/api/api-error';

// Estado que devuelven las server actions a los formularios (useActionState).
// Vive aparte de actions.ts porque un archivo 'use server' solo puede exportar funciones async.

export type FormState = {
  status: 'idle' | 'error';
  /** Error general (credenciales inválidas, servidor caído, etc.) */
  message?: string;
  /** Error por campo, primer mensaje de cada uno */
  fieldErrors?: Partial<Record<string, string>>;
  /** Valores no sensibles para repoblar el formulario (nunca la contraseña) */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: 'idle' };

export function fromZodError(error: z.ZodError, values: Record<string, string> = {}): FormState {
  const { fieldErrors } = z.flattenError(error);
  return {
    status: 'error',
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors as Record<string, string[] | undefined>).map(([field, messages]) => [field, messages?.[0]])
    ),
    values
  };
}

/** Traduce un ApiError del backend (incluye errores 422 por campo) a estado de formulario. */
export function fromApiError(error: unknown, values: Record<string, string> = {}): FormState {
  if (!isApiError(error)) {
    return { status: 'error', message: 'Ocurrió un error inesperado. Intenta nuevamente.', values };
  }
  return {
    status: 'error',
    message: error.fieldErrors.length ? undefined : error.message,
    fieldErrors: Object.fromEntries(error.fieldErrors.map(e => [e.field, e.hint ? `${e.message}. ${e.hint}` : e.message])),
    values
  };
}

/** Lee un campo de texto de FormData sin romper si viene vacío o como archivo. */
export const readField = (formData: FormData, name: string): string => {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
};
