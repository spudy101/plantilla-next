import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './schemas';

const valid = {
  firstName: 'Ana',
  lastName: 'Pérez',
  email: '  Ana@Example.com ',
  password: 'Segura#2026x',
  confirmPassword: 'Segura#2026x'
};

describe('registerSchema', () => {
  it('normaliza el email', () => {
    expect(registerSchema.parse(valid).email).toBe('ana@example.com');
  });

  it('exige la política de contraseña del backend', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'corta', confirmPassword: 'corta' });
    expect(result.success).toBe(false);
  });

  it('valida que las contraseñas coincidan', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'Otra#2026xx' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword']);
  });
});

describe('loginSchema', () => {
  it('rechaza emails inválidos', () => {
    expect(loginSchema.safeParse({ email: 'no-email', password: 'x' }).success).toBe(false);
  });
});
