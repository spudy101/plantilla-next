import { getEnv } from '@/lib/env';
import { ApiError, type FieldError } from './api-error';

// Cliente HTTP del SERVIDOR hacia el api-gateway. Solo se usa en server components,
// server actions y proxy.ts: el navegador nunca llama al backend directo (patrón BFF).
// (getEnv() falla si alguien lo importa desde un componente cliente.)

const REQUEST_TIMEOUT_MS = 10_000;

/** Forma estándar de respuesta del backend (ApiResponse). */
type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  metadata?: unknown;
  errorCode?: string;
  errors?: unknown;
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Access token para endpoints protegidos */
  token?: string;
};

const toFieldErrors = (errors: unknown): FieldError[] =>
  Array.isArray(errors)
    ? errors
        .filter((e): e is FieldError => typeof e?.field === 'string' && typeof e?.message === 'string')
        .map(({ field, message, hint }) => ({ field, message, hint: hint ?? null }))
    : [];

export async function apiFetch<T>(path: string, { method = 'GET', body, token }: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getEnv().API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch {
    throw new ApiError(503, 'No pudimos conectar con el servidor. Intenta nuevamente.', 'NETWORK_ERROR');
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      response.status,
      payload?.message ?? 'Ocurrió un error inesperado',
      payload?.errorCode ?? null,
      toFieldErrors(payload?.errors)
    );
  }

  return payload.data;
}
