import { z } from 'zod';

// Variables de entorno del SERVIDOR validadas al primer uso (fail-fast con mensaje claro).
// Lazy a propósito: `next build` no debe exigir API_URL para compilar páginas estáticas.
//
// No usa el paquete `server-only` porque proxy.ts (que no corre como server component)
// también la necesita; en su lugar, falla explícito si se ejecuta en el navegador.

const envSchema = z.object({
  API_URL: z.url({ message: 'API_URL debe ser una URL válida (p.ej. http://localhost:4000)' }),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
});

type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (typeof window !== 'undefined') {
    throw new Error('getEnv() solo puede usarse en el servidor');
  }
  if (!cached) {
    const parsed = envSchema.safeParse({ API_URL: process.env.API_URL, NODE_ENV: process.env.NODE_ENV });
    if (!parsed.success) {
      throw new Error(`Configuración inválida: ${parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
    }
    cached = parsed.data;
  }
  return cached;
}
