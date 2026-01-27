import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // Admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')?.value

    if (!request.nextUrl.pathname.startsWith('/admin/auth')) {
      if (!adminSession) {
        return NextResponse.redirect(new URL('/admin/auth/login', request.url))
      }
    } else if (adminSession) {
      // Prevent infinite redirect loop if session is invalid
      // Let the login page handle the redirect if the session is valid
    }

    return NextResponse.next()
  }

  // Agent routes
  if (request.nextUrl.pathname.startsWith('/agent')) {
    await updateSession(request)
    const agentSession = request.cookies.get('session')?.value

    if (!request.nextUrl.pathname.startsWith('/agent/login')) {
      if (!agentSession) {
        return NextResponse.redirect(new URL('/agent/login', request.url))
      }
    } else if (agentSession) {
      // If on login page and has session, strictly verify it before redirecting
      // This prevents infinite loops if the session is invalid (e.g. secret changed)
      try {
        // We use a separate verify function to check validity without refreshing yet
        // A simple check is to try decrypting it.
        // If decrypt throws, it's invalid, so we stay on login page.
        // NOTE: We can't easily import `decrypt` here if it's not edge runtime compatible, 
        // but `jose` is edge compatible.
        // However, to keep it simple, we can just allow the user to stay on login page
        // if the session verification fails. 
        // But `updateSession` above ALREADY tries to decrypt it.
        // Wait, `updateSession` doesn't throw?
        // Let's rely on a simpler check: 
        // If we are on login page, we DON'T redirect to dashboard unless we are SURE.
        // But better yet: Just let the login page handle the redirect if authorized!
        // The server component `AgentLoginPage` logic is: if valid session -> redirect dashboard.
        // So we can remove the redirect *from middleware* for the login page?
        // NO, middleware protects routes.

        // Let's just remove the proactive redirect from login -> dashboard in middleware.
        // Let the page logic handle "already logged in" state.
        // This is much safer.
      } catch (e) {
        // Invalid session, stay on login
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*'],
}
