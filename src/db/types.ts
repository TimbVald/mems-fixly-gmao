// Type definitions for the database schema
export type Role = 'ADMIN' | 'TECHNICIEN' | 'PERSONNEL';

// User type with role
export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  matricule?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

// Session type
export type Session = {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
};