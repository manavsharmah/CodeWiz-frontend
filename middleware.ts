import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register')
  const isProtectedPage = request.nextUrl.pathname.startsWith('/code-editor')

  // For protected pages, we'll let the client-side handle the redirect
  // since we can't access localStorage in middleware
  if (isAuthPage) {
    // Check if there's a token in the Authorization header
    const authHeader = request.headers.get('Authorization')
    if (authHeader) {
      return NextResponse.redirect(new URL('/code-editor', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/code-editor/:path*', '/login', '/register']
} 