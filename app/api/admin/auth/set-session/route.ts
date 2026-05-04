import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { access_token, refresh_token } = await req.json()
  if (!access_token) return NextResponse.json({ error: 'No token' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: { user }, error } = await supabase.auth.getUser(access_token)
  if (error || !user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const res = NextResponse.json({ ok: true })
  const maxAge = 60 * 60 * 24 * 7 // 7 días

  res.cookies.set('vx-admin-token', access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
  res.cookies.set('vx-admin-refresh', refresh_token ?? '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge,
    path: '/',
  })

  return res
}
