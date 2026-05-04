import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo bloquear APIs admin sin pasar por Supabase (la sesión se verifica en el layout)
  // Las páginas /admin/* se protegen en el server layout
  const isAdminApi = pathname.startsWith('/api/admin')
  const isPublicAdminApi = [
    '/api/admin/setup-check',
    '/api/admin/auth/login',
    '/api/admin/auth/set-session',
    '/api/admin/debug-cookies',
  ].includes(pathname)

  if (isAdminApi && !isPublicAdminApi) {
    const hasToken = !!request.cookies.get('vx-admin-token')?.value
    if (!hasToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
