import { NextResponse } from 'next/server'


// "proxy.ts" as Next.js 16 successor to middleware.ts
// Handling authentication and route-level data prefetching.

export function proxy() {
    // 1. Authentication Check (Stub)
    // const token = request.cookies.get('auth_token')
    // if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }

    // 2. Route-level data prefetching (Stub)
    // In a real app, we might pre-fetch data here or set headers for downstream components

    const response = NextResponse.next()

    // Example: Setting a header to indicate processed by proxy
    response.headers.set('x-proxy-processed', 'true')

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
