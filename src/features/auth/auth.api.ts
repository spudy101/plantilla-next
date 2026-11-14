import { apiFetch } from '@/lib/api/http';
import type { LoginInput, RegisterInput } from './schemas';
import type { TokenPair, User } from './types';

// Llamadas a iam-service (a través del gateway). Solo servidor.

export const authApi = {
  login: (input: LoginInput) => apiFetch<TokenPair>('/api/v1/auth/login', { method: 'POST', body: input }),

  register: ({ firstName, lastName, email, password }: RegisterInput) =>
    apiFetch<User>('/api/v1/auth/register', { method: 'POST', body: { firstName, lastName, email, password } }),

  refresh: (refreshToken: string) => apiFetch<TokenPair>('/api/v1/auth/refresh', { method: 'POST', body: { refreshToken } }),

  logout: (token: string) => apiFetch<null>('/api/v1/auth/logout', { method: 'POST', token }),

  me: (token: string) => apiFetch<User>('/api/v1/auth/me', { token })
};
