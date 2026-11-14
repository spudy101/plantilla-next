import { z } from 'zod';

// Mismas reglas que el backend (BaseValidator): validar en el front es para la UX,
// la validación que manda es la del servidor.

const PASSWORD_MIN = 10;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

// Primero normaliza (trim + minúsculas) y después valida el formato.
const email = z.string().trim().toLowerCase().pipe(z.email({ message: 'Ingresa un correo válido' }));

const personName = (label: string) =>
  z
    .string()
    .trim()
    .min(2, { message: `${label} debe tener al menos 2 caracteres` })
    .max(50, { message: `${label} no puede superar 50 caracteres` })
    .regex(NAME_REGEX, { message: `${label} solo puede contener letras` });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { message: 'Ingresa tu contraseña' })
});

export const registerSchema = z
  .object({
    firstName: personName('El nombre'),
    lastName: personName('El apellido'),
    email,
    password: z
      .string()
      .min(PASSWORD_MIN, { message: `Mínimo ${PASSWORD_MIN} caracteres` })
      .regex(/[a-z]/, { message: 'Debe incluir una minúscula' })
      .regex(/[A-Z]/, { message: 'Debe incluir una mayúscula' })
      .regex(/\d/, { message: 'Debe incluir un número' })
      .regex(/[^A-Za-z0-9]/, { message: 'Debe incluir un carácter especial' }),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
