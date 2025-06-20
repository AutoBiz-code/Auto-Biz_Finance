
// This file is intentionally left blank.
// If you previously had Clerk middleware, it has been removed.
// You can add Next.js middleware here if needed for other purposes.
// For Firebase Auth, route protection is typically handled client-side
// or via server-side checks in API routes / Server Components.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Example: Basic logging, or you can add more complex logic here
  // console.log('Middleware triggered for:', request.nextUrl.pathname);
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sign-in
     * - sign-up
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)',
  ],
}
