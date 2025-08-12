import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Routes qui nécessitent une authentification
const protectedRoutes = ['/dashboard', '/interventions', '/equipments', '/stocks', '/users'];

// Routes d'authentification (accessibles seulement si non connecté)
const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password'];

// Routes publiques (accessibles à tous)
const publicRoutes = ['/', '/unauthorized'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignorer les fichiers statiques et les API d'auth
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/api/auth') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  try {
    // Vérifier la session utilisateur
    const session = await auth.api.getSession({
      headers: request.headers
    });

    const isAuthenticated = !!session?.user;
    
    // Vérifier si la route est protégée
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    // Vérifier si c'est une route d'authentification
    const isAuthRoute = authRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    // Vérifier si c'est une route publique
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route
    );

    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
    if (!isAuthenticated && isProtectedRoute) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Si l'utilisateur est authentifié et essaie d'accéder aux pages d'auth
    if (isAuthenticated && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Permettre l'accès aux routes publiques
    return NextResponse.next();
  } catch (error) {
    // En cas d'erreur, rediriger vers signin pour les routes protégées seulement
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};