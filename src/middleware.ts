import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

const protectedRoutes = [
  '/dashboard',
  '/users',
  '/class',
  '/subjects',
  '/questions',
  '/logout',
  '/tests',
];

const publicRoutes = [
  '/signIn',
  '/signUp',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/signIn', request.url));
  }
  if (token && publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();

}


export const config = {
  matcher: ['/dashboard/:path*', '/users/:path*', '/class/:path*', '/subjects/:path*', '/questions/:path*', '/logout', '/tests/:path*', '/signIn', '/signUp'],
};
