import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Redirect old locale routes to root
  if (pathname.startsWith('/en') || pathname.startsWith('/es')) {
    const newPath = pathname.replace(/^\/(en|es)/, '') || '/'
    const newUrl = new URL(newPath, request.url)
    return NextResponse.redirect(newUrl)
  }

  // Add English language header for SEO
  const response = NextResponse.next()
  response.headers.set('Content-Language', 'en')
  
  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
