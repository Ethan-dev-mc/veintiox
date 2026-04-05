import AdminHeader from '@/components/admin/AdminHeader'
import ProductForm from '../ProductForm'
import { createClient } from '@supabase/supabase-js'

export default async function NuevoProductoPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data: categorias, error } = await supabase.from('categorias').select('id, nombre').order('nombre')
  console.log('[NuevoProducto] categorias:', categorias, 'error:', error)

  return (
    <div>
      <AdminHeader title="Nuevo producto" />
      <ProductForm categorias={categorias ?? []} />
    </div>
  )
}
export const dynamic = 'force-dynamic'
