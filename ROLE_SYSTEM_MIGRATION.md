# Migration du système d'organisations vers un système de rôles simple

## Vue d'ensemble

Ce projet a été migré d'un système d'organisations Better Auth vers un système de rôles simple basé sur un champ `role` dans la table `users`.

## Changements effectués

### 1. Schéma de base de données

- ✅ Ajout du champ `role` dans la table `users` avec les valeurs : `'ADMIN' | 'TECHNICIEN' | 'PERSONNEL'`
- ✅ Suppression des tables `organizations`, `members`, `invitations`
- ✅ Suppression du champ `activeOrganizationId` de la table `sessions`

### 2. Configuration Better Auth

- ✅ Suppression du plugin `organization`
- ✅ Configuration du champ `role` comme champ additionnel utilisateur
- ✅ Adaptation de l'adaptateur Drizzle pour ne plus inclure les tables d'organisations

### 3. Helpers d'authentification

- ✅ Création de `src/lib/auth-helpers.ts` avec :
  - `requireRole(role: Role)` : Protection des pages avec redirection automatique
  - `getCurrentUser()` : Récupération de l'utilisateur actuel
  - `hasRole(role: Role)` : Vérification conditionnelle des rôles

### 4. Types TypeScript

- ✅ Définition du type `Role = 'ADMIN' | 'TECHNICIEN' | 'PERSONNEL'`
- ✅ Types `User` et `Session` mis à jour

## Utilisation

### Protection des pages

```typescript
// Page réservée aux administrateurs
import { requireRole } from "@/lib/auth-helpers";

export default async function AdminPage() {
  const { user } = await requireRole("ADMIN");
  
  return (
    <div>
      <h1>Page Administrateur</h1>
      <p>Bienvenue {user.name}, vous êtes {user.role}</p>
    </div>
  );
}
```

### Vérification conditionnelle

```typescript
import { getCurrentUser, hasRole } from "@/lib/auth-helpers";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const isAdmin = await hasRole("ADMIN");
  
  return (
    <div>
      <h1>Tableau de bord</h1>
      {isAdmin && <AdminSection />}
    </div>
  );
}
```

### Mise à jour des rôles

```typescript
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Mettre à jour le rôle d'un utilisateur
await db
  .update(users)
  .set({ role: 'ADMIN', updatedAt: new Date() })
  .where(eq(users.id, userId));
```

## Hiérarchie des rôles

Le système utilise une hiérarchie de rôles :

1. **PERSONNEL** (niveau 1) : Accès de base
2. **TECHNICIEN** (niveau 2) : Accès technicien + personnel
3. **ADMIN** (niveau 3) : Accès complet

Quand vous utilisez `requireRole("TECHNICIEN")`, les utilisateurs avec le rôle `TECHNICIEN` ou `ADMIN` auront accès.

## Migration de la base de données

1. Exécutez le fichier de migration : `migrations/add-user-role-remove-organizations.sql`
2. Vérifiez que tous les utilisateurs ont un rôle assigné
3. Testez les fonctionnalités d'authentification

## Fichiers créés/modifiés

### Nouveaux fichiers
- `src/lib/auth-helpers.ts` - Helpers d'authentification
- `src/lib/user-role-examples.ts` - Exemples d'utilisation
- `src/app/unauthorized/page.tsx` - Page d'accès refusé
- `migrations/add-user-role-remove-organizations.sql` - Migration SQL

### Fichiers modifiés
- `src/db/schema.ts` - Ajout du champ role, suppression des tables d'organisations
- `src/db/types.ts` - Types mis à jour
- `src/lib/auth.ts` - Configuration Better Auth simplifiée
- `src/server/users.ts` - Fonctions utilisateur adaptées

## Avantages du nouveau système

- ✅ **Simplicité** : Plus de gestion complexe d'organisations
- ✅ **Performance** : Moins de jointures en base de données
- ✅ **Maintenabilité** : Code plus simple et direct
- ✅ **Flexibilité** : Système de rôles hiérarchique
- ✅ **TypeScript** : Types stricts pour la sécurité

## Notes importantes

- Les redirections se font vers `/signin` (non connecté) ou `/unauthorized` (pas les droits)
- Le rôle par défaut est `PERSONNEL`
- La session inclut automatiquement le rôle utilisateur
- Toutes les requêtes sont optimisées pour PostgreSQL (Neon)