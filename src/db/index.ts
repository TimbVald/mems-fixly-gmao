import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Configuration plus robuste pour éviter les erreurs ECONNRESET
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // Nombre maximum de connexions
  idle_timeout: 20, // Timeout en secondes pour les connexions inactives
  connect_timeout: 10, // Timeout de connexion en secondes
  prepare: false, // Désactive les prepared statements pour éviter certains problèmes
});

export const db = drizzle(client, { schema });

export type DB = typeof db;