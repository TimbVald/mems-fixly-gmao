"use client";

import { Suspense, useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getCurrentUser } from "@/server/users";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Composant de chargement avec message de bienvenue
function WelcomeLoader({ user }: { user: User | null }) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    if (user) {
      // Afficher le chargement pendant 2 secondes
      const timer1 = setTimeout(() => {
        setShowWelcome(true);
      }, 1500);

      // Puis afficher le message de bienvenue pendant 2 secondes
      const timer2 = setTimeout(() => {
        setLoadingComplete(true);
      }, 3500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [user]);

  if (loadingComplete) {
    return null;
  }

  const getRoleDisplayName = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Gestionnaire';
      case 'technician':
        return 'Technicien';
      case 'personnel':
        return 'Personnel';
      default:
        return role;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4">
        {!showWelcome ? (
          <>
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-brand-500" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-brand-200 rounded-full animate-pulse"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Connexion en cours...
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Préparation de votre espace de travail
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-green-200 rounded-full animate-ping"></div>
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Bienvenue !
              </h2>
              {user && (
                <>
                  <p className="text-lg font-medium text-brand-600 dark:text-brand-400">
                    {user.name}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
                    {getRoleDisplayName(user.role)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Accès au tableau de bord en cours...
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Composant de chargement simple pour le fallback
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeComplete, setWelcomeComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          setUser({
            id: user?.currentUser?.id,
            name: user?.currentUser?.name || 'Utilisateur',
            email: user?.currentUser?.email,
            role: user?.currentUser?.role || 'PERSONNEL'
          });
          setShowWelcome(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
      } finally {
        // Délai minimum pour afficher le chargement
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    checkAuth();
  }, []);

  // Écouter la fin du message de bienvenue
  useEffect(() => {
    if (showWelcome && user) {
      const timer = setTimeout(() => {
        setWelcomeComplete(true);
      }, 4000); // 4 secondes pour le message de bienvenue complet

      return () => clearTimeout(timer);
    }
  }, [showWelcome, user]);

  // Afficher le chargement initial
  if (isLoading) {
    return <LoadingSpinner message="Vérification de la session..." />;
  }

  // Afficher le message de bienvenue si l'utilisateur est connecté et que le message n'est pas terminé
  if (showWelcome && user && !welcomeComplete) {
    return <WelcomeLoader user={user} />;
  }

  // Afficher le contenu normal
  return (
    <Suspense fallback={fallback || <LoadingSpinner message="Chargement..." />}>
      {children}
    </Suspense>
  );
}