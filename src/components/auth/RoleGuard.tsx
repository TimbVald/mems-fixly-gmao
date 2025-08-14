"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { getCurrentUser } from "@/server/users";

type Role = "ADMIN" | "TECHNICIEN" | "PERSONNEL";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface RoleGuardProps {
  children: React.ReactNode;
}

// Configuration des permissions par rôle
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["*"], // Accès à toutes les pages
  TECHNICIEN: [
    "/interventions/requests",
    "/interventions/requests/add",
    "/interventions/requests/*", // Accès aux pages de détail des demandes
    "/interventions/work-orders",
    "/interventions/work-orders/*", // Accès aux pages de détail des ordres
    "/interventions/reports/add",
    "/interventions/reports/calendar",
    "/interventions/reports/*", // Accès aux pages de détail des rapports
  ],
  PERSONNEL: [
    "/fiche-chantier",
    "/fiche-chantier/add",
    "/fiche-chantier/*", // Accès aux pages de détail et d'édition
  ]
};

// Pages qui nécessitent une vérification de rôle
const PROTECTED_ROUTES = [
  "/equipements",
  "/fiche-chantier",
  "/interventions",
  "/personnel",
  "/stocks",
];

export default function RoleGuard({ children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const session = await authClient.getSession();
        const currentRole = await getCurrentUser()
        
        if (!currentRole?.currentUser) {
          // Utilisateur non connecté, redirection vers la page de connexion
        //   router.push("/auth/signin");
          return;
        }

        const userData = currentRole.currentUser as User;
        setUser(userData);

        // Vérifier si la route actuelle nécessite une vérification de rôle
        const isProtectedRoute = PROTECTED_ROUTES.some(route => 
          pathname.startsWith(route)
        );

        if (!isProtectedRoute) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Vérifier les permissions
        const userPermissions = ROLE_PERMISSIONS[userData.role];
        
        // L'ADMIN a accès à tout
        if (userData.role === "ADMIN") {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Vérifier si l'utilisateur a accès à la route actuelle
        const hasAccess = userPermissions.some(permission => {
          // Vérification exacte
          if (permission === pathname) return true;
          
          // Vérification pour les routes dynamiques (ex: /fiche-chantier/[id])
          if (permission.endsWith("/*")) {
            const basePath = permission.slice(0, -2);
            return pathname.startsWith(basePath);
          }
          
          // Vérification pour les sous-routes
          return pathname.startsWith(permission + "/");
        });

        if (!hasAccess) {
          router.push("/unauthorized");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
        router.push("/auth/signin");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [pathname, router]);

  // Affichage du loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Vérification des permissions...</span>
        </div>
      </div>
    );
  }

  // Afficher le contenu seulement si autorisé
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// Hook personnalisé pour obtenir les informations de l'utilisateur
export function useUserRole() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const session = await authClient.getSession();
        const currentRole = await getCurrentUser()

        if (currentRole?.currentUser) {
          setUser(currentRole.currentUser as User);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, isLoading };
}

// Fonction utilitaire pour vérifier si un utilisateur a accès à une route
export function hasRouteAccess(userRole: Role, route: string): boolean {
  if (userRole === "ADMIN") return true;
  
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.some(permission => {
    if (permission === route) return true;
    if (permission.endsWith("/*")) {
      const basePath = permission.slice(0, -2);
      return route.startsWith(basePath);
    }
    return route.startsWith(permission + "/");
  });
}