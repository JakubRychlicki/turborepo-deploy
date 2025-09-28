import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { NAVIGATION } from '@/config/constants'

const protectedRoutes = [NAVIGATION.DASHBOARD]
const authRoutes = [NAVIGATION.LOGIN, NAVIGATION.CONFIRMATION]

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => path.startsWith(route))
}

function isAuthRoute(path: string): boolean {
  return authRoutes.some(route => path.startsWith(route))
}

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname
  
  const sessionToken = request.cookies.get('better-auth.session_token')?.value

  if (isProtectedRoute(currentPath)) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL(NAVIGATION.LOGIN, request.url))
    }
  }

  if (isAuthRoute(currentPath)) {
    if (sessionToken) {
      return NextResponse.redirect(new URL(NAVIGATION.DASHBOARD, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|favicon-96x96.png|site.webmanifest|web-app-manifest-192x192.png|web-app-manifest-512x512.png|apple-touch-icon.png).*)',
  ],
}
