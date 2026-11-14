import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-strong',
  secondary: 'border border-line bg-surface text-ink hover:bg-muted'
} as const;

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: keyof typeof variants };

/** Link con apariencia de botón (navegación, no acciones). */
export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
