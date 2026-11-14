// Error tipado para cualquier respuesta no exitosa del backend.
// Mismo contrato que ApiResponse/AppError de plantilla-microservicio.

export type FieldError = { field: string; message: string; hint?: string | null };

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string | null = null,
    public readonly fieldErrors: FieldError[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;
