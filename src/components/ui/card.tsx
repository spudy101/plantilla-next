import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils/cn';

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('border-line bg-surface rounded-2xl border p-6 shadow-sm', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 className={cn('text-ink text-lg font-semibold', className)} {...props} />;
}
