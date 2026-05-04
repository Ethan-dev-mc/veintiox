import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/admin/Sidebar'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const token = cookieStore.get('vx-admin-token')?.value
  const refreshToken = cookieStore.get('vx-admin-refresh')?.value

  if (!token && !refreshToken) redirect('/admin/login')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let user = null

  if (token) {
    const { data, error } = await supabase.auth.getUser(token)
    if (!error && data.user) user = data.user
  }

  // access_token expirado — renovar con refresh_token
  if (!user && refreshToken) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
    if (!error && data.user && data.session) {
      user = data.user
      const maxAge = 60 * 60 * 24 * 7
      cookieStore.set('vx-admin-token', data.session.access_token, {
        httpOnly: true, secure: true, sameSite: 'lax', maxAge, path: '/',
      })
      cookieStore.set('vx-admin-refresh', data.session.refresh_token, {
        httpOnly: true, secure: true, sameSite: 'lax', maxAge, path: '/',
      })
    }
  }

  if (!user) redirect('/admin/login')

  return (
    <div className="flex h-screen overflow-hidden bg-vx-black">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 lg:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  )
}
