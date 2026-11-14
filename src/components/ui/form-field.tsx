import { cloneElement, isValidElement, type ReactElement } from 'react';

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  /** Un único control (Input, select…). Recibe id, aria-describedby e invalid automáticamente. */
  children: ReactElement<{ id?: string; 'aria-describedby'?: string; invalid?: boolean }>;
};

/** Label + control + mensaje de error/ayuda, accesible (label for, aria-describedby). */
export function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-ink text-sm font-medium">
        {label}
      </label>
      {isValidElement(children) ? cloneElement(children, { id, 'aria-describedby': describedBy, invalid: Boolean(error) }) : children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-danger text-xs">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-ink-soft text-xs">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
