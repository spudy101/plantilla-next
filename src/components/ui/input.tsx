import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

type InputProps = ComponentProps<'input'> & { invalid?: boolean };

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'border-line bg-surface text-ink h-10 w-full rounded-lg border px-3 text-sm transition-colors',
        'placeholder:text-ink-soft focus:border-brand focus:ring-brand/20 focus:ring-2 focus:outline-none',
        invalid && 'border-danger focus:border-danger focus:ring-danger/20',
        className
      )}
      {...props}
    />
  );
}
