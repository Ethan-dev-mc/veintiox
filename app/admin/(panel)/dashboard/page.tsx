import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
import AdminHeader from '@/components/admin/AdminHeader'

export default async function DashboardPage() {
  const supabase = getSupabase()

  const [
    { count: totalProductos },
    { count: totalPedidos },
    { data: pedidosRecientes },
    { data: pedidosStats },
  ] = await Promise.all([
    supabase.from('productos').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('pedidos').select('*', { count: 'exact', head: true }),
    supabase.from('pedidos').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('pedidos').select('total, estado').in('estado', ['pendiente_envio', 'enviado', 'entregado']),
  ])

  const ingresos = (pedidosStats as any[])?.reduce((acc: number, p: any) => acc + Number(p.total), 0) ?? 0

  const stats = [
    { label: 'Productos activos', value: totalProductos ?? 0 },
    { label: 'Pedidos totales',   value: totalPedidos ?? 0 },
    { label: 'Ingresos pagados',  value: `$${ingresos.toFixed(0)} MXN` },
  ]

  const estadoColor: Record<string, string> = {
    pendiente:       'text-yellow-400',
    pendiente_envio: 'text-yellow-400',
    enviado:         'text-vx-cyan',
    entregado:       'text-green-400',
    cancelado:       'text-red-400',
  }

  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Resumen de la tienda" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-vx-gray900 rounded-xl p-5 border border-vx-gray800">
            <p className="text-xs text-vx-gray500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="font-display text-3xl text-vx-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-vx-gray900 rounded-xl border border-vx-gray800">
        <div className="px-5 py-4 border-b border-vx-gray800">
          <h2 className="font-body font-semibold text-sm text-vx-white">Pedidos recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-vx-gray500 uppercase tracking-wider border-b border-vx-gray800">
                <th className="px-5 py-3 text-left">Pedido</th>
                <th className="px-5 py-3 text-left">Cliente</th>
                <th className="px-5 py-3 text-left">Total</th>
                <th className="px-5 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {((pedidosRecientes ?? []) as any[]).map((p) => (
                <tr key={p.id} className="border-b border-vx-gray800/50 hover:bg-vx-gray800/30 transition-colors">
                  <td className="px-5 py-3 text-vx-gray300 font-mono text-xs">{p.numero_pedido}</td>
                  <td className="px-5 py-3 text-vx-white">{p.cliente_nombre}</td>
                  <td className="px-5 py-3 text-vx-white">${Number(p.total).toFixed(2)}</td>
                  <td className={`px-5 py-3 capitalize font-medium ${estadoColor[p.estado] ?? 'text-vx-gray400'}`}>{p.estado}</td>
                </tr>
              ))}
              {!pedidosRecientes?.length && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-vx-gray500 text-xs">Sin pedidos aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'

export const revalidate = 0
export const fetchCache = 'force-no-store'
