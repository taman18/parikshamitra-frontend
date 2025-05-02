// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const isLoggedIn = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

//   const protectedRoutes = ['/dashboard', '/tests', '/admin'];
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   );

//   if (isProtectedRoute && !isLoggedIn) {
//     const loginUrl = new URL('/signIn', request.url);
//     return NextResponse.redirect(loginUrl);
//   }


//   return NextResponse.next();
// }
