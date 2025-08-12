"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Composant de chargement simple
function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  // Simplification drastique : on laisse le middleware gérer l'authentification
  // AuthGuard devient juste un wrapper qui affiche le contenu
  // Le middleware s'occupe de rediriger les utilisateurs non authentifiés
  
  return (
    <Suspense 
      fallback={
        fallback || <LoadingSpinner message="Chargement..." />
      }
    >
      {children}
    </Suspense>
  );
}