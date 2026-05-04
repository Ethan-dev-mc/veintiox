import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import Sidebar from '@/components/admin/Sidebar'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/admin/login')

  return (
    <div className="flex h-screen overflow-hidden bg-vx-black">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 lg:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  )
}
