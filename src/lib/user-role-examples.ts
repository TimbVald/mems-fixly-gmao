import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Role } from "@/db/types";

/**
 * Exemples d'utilisation des helpers d'authentification et de gestion des rôles
 */

// ============================================================================
// EXEMPLES D'UTILISATION DANS LES PAGES (page.tsx ou layout.tsx)
// ============================================================================

/*
// Exemple 1: Page réservée aux administrateurs
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

// Exemple 2: Page réservée aux techniciens et administrateurs
import { requireRole } from "@/lib/auth-helpers";

export default async function TechnicianPage() {
  const { user } = await requireRole("TECHNICIEN");
  
  return (
    <div>
      <h1>Page Technicien</h1>
      <p>Bienvenue {user.name}, vous êtes {user.role}</p>
    </div>
  );
}

// Exemple 3: Vérification conditionnelle du rôle
import { getCurrentUser, hasRole } from "@/lib/auth-helpers";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const isAdmin = await hasRole("ADMIN");
  const isTechnician = await hasRole("TECHNICIEN");
  
  if (!user) {
    redirect("/signin");
  }
  
  return (
    <div>
      <h1>Tableau de bord</h1>
      <p>Bienvenue {user.name}</p>
      
      {isAdmin && (
        <div>
          <h2>Section Administrateur</h2>
          <p>Contenu réservé aux administrateurs</p>
        </div>
      )}
      
      {isTechnician && (
        <div>
          <h2>Section Technicien</h2>
          <p>Contenu réservé aux techniciens et administrateurs</p>
        </div>
      )}
    </div>
  );
}
*/

// ============================================================================
// EXEMPLES DE MISE À JOUR DES RÔLES AVEC DRIZZLE
// ============================================================================

/**
 * Met à jour le rôle d'un utilisateur
 */
export async function updateUserRole(userId: string, newRole: Role): Promise<void> {
  await db
    .update(users)
    .set({ role: newRole, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/**
 * Exemple d'utilisation dans une API route ou server action
 */
export async function promoteUserToAdmin(userId: string): Promise<void> {
  await updateUserRole(userId, "ADMIN");
}

export async function promoteUserToTechnician(userId: string): Promise<void> {
  await updateUserRole(userId, "TECHNICIEN");
}

export async function demoteUserToPersonnel(userId: string): Promise<void> {
  await updateUserRole(userId, "PERSONNEL");
}

/**
 * Récupère tous les utilisateurs avec leur rôle
 */
export async function getAllUsersWithRoles() {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      matricule: users.matricule,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.name);
}

/**
 * Récupère les utilisateurs par rôle
 */
export async function getUsersByRole(role: Role) {
  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      matricule: users.matricule,
    })
    .from(users)
    .where(eq(users.role, role));
}

/**
 * Compte les utilisateurs par rôle
 */
export async function countUsersByRole() {
  const allUsers = await db.select({ role: users.role }).from(users);
  
  return allUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<Role, number>);
}

// ============================================================================
// EXEMPLES DE SERVER ACTIONS
// ============================================================================

/*
// Exemple de server action pour mettre à jour un rôle
"use server";

import { requireRole } from "@/lib/auth-helpers";
import { updateUserRole } from "@/lib/user-role-examples";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userId: string, newRole: Role) {
  // Seuls les administrateurs peuvent modifier les rôles
  await requireRole("ADMIN");
  
  await updateUserRole(userId, newRole);
  
  // Revalider les pages qui affichent les utilisateurs
  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
}
*/