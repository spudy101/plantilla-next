import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Plantilla', template: '%s · Plantilla' },
  description: 'Plantilla front en Next.js conectada a plantilla-microservicio'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
