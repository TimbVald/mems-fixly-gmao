import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
 
	// Vérifier si l'utilisateur accède à une route protégée
	const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') || 
	                       request.nextUrl.pathname.startsWith('/dashboard') ||
	                       request.nextUrl.pathname.startsWith('/profile');
 
	// Si c'est une route protégée et qu'il n'y a pas de session
	if (isProtectedRoute && !sessionCookie) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}
 
	// Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
	const isAuthRoute = request.nextUrl.pathname.startsWith('/signin') || 
	                   request.nextUrl.pathname.startsWith('/signup');
 
	if (isAuthRoute && sessionCookie) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}
 
	return NextResponse.next();
}
 
export const config = {
	matcher: [
		// Routes protégées
		"/admin/:path*",
		"/dashboard/:path*", 
		"/profile/:path*",
		// Routes d'authentification
		"/signin",
		"/signup"
	],
};