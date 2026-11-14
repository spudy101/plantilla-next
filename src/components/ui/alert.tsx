import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const tones = {
  error: 'border-danger/30 bg-danger/10 text-danger',
  info: 'border-brand/30 bg-brand/10 text-brand-strong',
  success: 'border-success/30 bg-success/10 text-success'
} as const;

export function Alert({ tone = 'error', children }: { tone?: keyof typeof tones; children: ReactNode }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cn('rounded-lg border px-3 py-2 text-sm', tones[tone])}>
      {children}
    </div>
  );
}
