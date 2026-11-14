import 'server-only';
import { isApiError } from '@/lib/api/api-error';
import { apiFetch } from '@/lib/api/http';
import type { Profile } from './types';

export const profileApi = {
  /**
   * El perfil lo crea person-service al consumir el evento de registro (asíncrono):
   * justo después de registrarse puede no existir todavía → null en vez de error.
   */
  async getMine(token: string): Promise<Profile | null> {
    try {
      return await apiFetch<Profile>('/api/v1/persons/me', { token });
    } catch (error) {
      if (isApiError(error) && error.isNotFound) {
        return null;
      }
      throw error;
    }
  }
};
