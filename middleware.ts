import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas admin que requieren autenticación
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isLoginPage = pathname === '/admin/login'
  const isSetupPage = pathname === '/admin/setup'
  const isSetupCheck = pathname === '/api/admin/setup-check'
  const isLoginApi   = pathname === '/api/admin/auth/login'

  if (!isAdminRoute && !isAdminApi) return NextResponse.next()
  if (isSetupCheck || isLoginApi) return NextResponse.next()

  // Crear cliente Supabase con cookies
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Setup solo accesible si NO hay sesión activa
  if (isSetupPage) {
    if (session) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    return response
  }

  // Login siempre accesible
  if (isLoginPage) {
    if (session) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    return response
  }

  // Todo lo demás de admin requiere sesión
  if (!session) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
