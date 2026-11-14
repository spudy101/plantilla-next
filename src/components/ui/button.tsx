import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-strong',
  secondary: 'border border-line bg-surface text-ink hover:bg-muted',
  ghost: 'text-ink hover:bg-muted'
} as const;

type ButtonProps = ComponentProps<'button'> & {
  variant?: keyof typeof variants;
  fullWidth?: boolean;
};

export function Button({ variant = 'primary', fullWidth, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors',
        'focus-visible:ring-brand/40 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
}
