// Contrato de person-service (GET /api/v1/persons/me).

export type Profile = {
  personId: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  nationalId: string | null;
  phone: string | null;
  updatedAt: string | null;
};
