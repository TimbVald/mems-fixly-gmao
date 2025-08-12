-- Migration: Ajouter le champ role à la table users et supprimer les tables d'organisations
-- Date: $(date)
-- Description: Remplace le système d'organisations par un champ role direct dans la table users

-- 1. Ajouter le champ role à la table users
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'PERSONNEL' NOT NULL;

-- 2. Créer l'enum pour les rôles si il n'existe pas déjà
DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM ('PERSONNEL', 'TECHNICIEN', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Modifier le type de la colonne role pour utiliser l'enum
ALTER TABLE "user" ALTER COLUMN "role" TYPE role_enum USING "role"::role_enum;

-- 4. Migrer les données existantes des membres vers les utilisateurs (si applicable)
-- Cette section est optionnelle et dépend de vos données existantes
/*
UPDATE "user" 
SET "role" = m."role"::role_enum
FROM "member" m 
WHERE "user"."id" = m."userId" 
AND m."role" IS NOT NULL;
*/

-- 5. Supprimer la colonne activeOrganizationId de la table session
ALTER TABLE "session" DROP COLUMN IF EXISTS "activeOrganizationId";

-- 6. Supprimer les tables liées aux organisations
DROP TABLE IF EXISTS "invitation" CASCADE;
DROP TABLE IF EXISTS "member" CASCADE;
DROP TABLE IF EXISTS "organization" CASCADE;

-- 7. Créer un index sur le champ role pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "user" ("role");

-- 8. Mettre à jour les contraintes et les index
-- Vérifier que l'index unique sur l'email existe toujours
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_unique" ON "user" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "user_matricule_unique" ON "user" ("matricule") WHERE "matricule" IS NOT NULL;