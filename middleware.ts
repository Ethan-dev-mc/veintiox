import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo bloquear APIs admin sin pasar por Supabase (la sesión se verifica en el layout)
  // Las páginas /admin/* se protegen en el server layout
  const isAdminApi = pathname.startsWith('/api/admin')
  const isPublicAdminApi = [
    '/api/admin/setup-check',
    '/api/admin/auth/login',
  ].includes(pathname)

  if (isAdminApi && !isPublicAdminApi) {
    // Para APIs admin, verificar que existe la cookie de sesión de Supabase
    const cookies = request.cookies.getAll()
    const hasAuthCookie = cookies.some(
      (c) => c.name.startsWith('sb-') && c.name.includes('-auth-token')
    )
    if (!hasAuthCookie) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
