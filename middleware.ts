import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ⚡ Security & Performance Headers
  const headers = {
    // Security
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  // Apply headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // ⚡ Add cache headers for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next/static') ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot|css|js)$/)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // ⚡ Add cache headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
