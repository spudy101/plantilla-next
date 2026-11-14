// Contratos de iam-service (plantilla-microservicio).

export type UserRole = {
  code: 'ADMIN' | 'OPERATOR' | 'CLIENT';
  name: string;
};

export type User = {
  userId: string;
  email: string;
  role: UserRole | null;
  status: 'ACTIVE' | 'BLOCKED';
  lastLoginAt: string | null;
  createdAt: string | null;
};

export type TokenPair = {
  tokenType: 'Bearer';
  accessToken: string;
  refreshToken: string;
  /** Vida del access token en segundos */
  expiresIn: number;
  sessionId: string;
  user?: User;
};
