import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Note: In client-side we use localStorage, but middleware needs cookies or headers
  const { pathname } = request.nextUrl;

  // Define public routes
  const isPublicRoute = pathname === '/login' || pathname === '/signup' || pathname === '/';

  // For now, since I'm using localStorage for tokens, middleware won't have access to it easily.
  // A better production approach would be using cookies for tokens.
  // However, I will implement a basic client-side check in a Layout component for now,
  // or use cookies if preferred. I'll stick to client-side protection for simplicity with localStorage.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
