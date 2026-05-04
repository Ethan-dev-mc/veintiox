import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/admin/Sidebar'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const token = cookieStore.get('vx-admin-token')?.value

  if (!token) redirect('/admin/login')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) redirect('/admin/login')

  return (
    <div className="flex h-screen overflow-hidden bg-vx-black">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 lg:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  )
}
