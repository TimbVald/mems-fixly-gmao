import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/db/types";

/**
 * Helper pour vérifier le rôle de l'utilisateur dans les pages Next.js App Router
 * Redirige vers /signin si l'utilisateur n'est pas connecté
 * Redirige vers /unauthorized si l'utilisateur n'a pas le rôle requis
 */
export async function requireRole(requiredRole: Role): Promise<{ user: { id: string; name: string; email: string; role: Role } }> {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers())
  });

  // Vérifier si l'utilisateur est connecté
  if (!session?.user) {
    redirect("/signin");
  }

  // Vérifier le rôle de l'utilisateur
  const userRole = session.user.role as Role;
  
  // Hiérarchie des rôles : ADMIN > TECHNICIEN > PERSONNEL
  const roleHierarchy: Record<Role, number> = {
    PERSONNEL: 1,
    TECHNICIEN: 2,
    ADMIN: 3,
  };

  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  if (userRoleLevel < requiredRoleLevel) {
    redirect("/unauthorized");
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: userRole,
    },
  };
}

/**
 * Helper pour obtenir la session utilisateur actuelle
 * Retourne null si l'utilisateur n'est pas connecté
 */
export async function getCurrentUser(): Promise<{ id: string; name: string; email: string; role: Role } | null> {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers())
  });

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role as Role,
  };
}

/**
 * Helper pour vérifier si l'utilisateur a un rôle spécifique ou supérieur
 */
export async function hasRole(requiredRole: Role): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then(mod => mod.headers())
  });

  if (!session?.user) {
    return false;
  }

  const userRole = session.user.role as Role;
  
  const roleHierarchy: Record<Role, number> = {
    PERSONNEL: 1,
    TECHNICIEN: 2,
    ADMIN: 3,
  };

  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
}