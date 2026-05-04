'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const ESTADOS_BULK = ['pendiente_envio', 'enviado', 'entregado', 'cancelado'] as const
type EstadoBulk = typeof ESTADOS_BULK[number]

const ESTADO_BADGE: Record<string, 'default' | 'warning' | 'success' | 'cyan' | 'danger'> = {
  pendiente: 'warning',
  pendiente_envio: 'warning',
  enviado: 'cyan',
  entregado: 'success',
  cancelado: 'danger',
}

const ESTADO_LABEL: Record<string, string> = {
  pendiente: 'Sin pagar',
  pendiente_envio: 'Pend. envío',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

// Pagados = pendiente_envio | enviado | entregado
// Incompletos = pendiente (checkout iniciado, sin pago)
// Cancelados = cancelado
type Vista = 'pagados' | 'incompletos' | 'cancelados'

const ESTADOS_POR_VISTA: Record<Vista, string[]> = {
  pagados:     ['pendiente_envio', 'enviado', 'entregado'],
  incompletos: ['pendiente'],
  cancelados:  ['cancelado'],
}

interface Pedido {
  id: string
  numero_pedido: string
  cliente_nombre: string
  cliente_email: string
  total: number
  metodo_pago: string
  estado: string
  created_at: string
  pagado_at?: string | null
  etiqueta_url?: string | null
}


export default function PedidosClient({ pedidos: pedidosInit }: { pedidos: Pedido[] }) {
  const router = useRouter()
  const [pedidos, setPedidos] = useState(pedidosInit)
  const [vista, setVista] = useState<Vista>('pagados')
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [generando, setGenerando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [estadoBulk, setEstadoBulk] = useState<EstadoBulk>('pendiente_envio')
  const [resultados, setResultados] = useState<Record<string, { ok: boolean; url?: string; error?: string }>>({})

  const pedidosVista = useMemo(() =>
    pedidos.filter(p => ESTADOS_POR_VISTA[vista].includes(p.estado)),
    [pedidos, vista]
  )

  const pedidosFiltrados = useMemo(() => {
    if (filtroEstado === 'todos') return pedidosVista
    return pedidosVista.filter(p => p.estado === filtroEstado)
  }, [pedidosVista, filtroEstado])

  const conteoVista = (v: Vista) => pedidos.filter(p => ESTADOS_POR_VISTA[v].includes(p.estado)).length

  const toggleAll = () => {
    if (seleccionados.size === pedidosFiltrados.length) setSeleccionados(new Set())
    else setSeleccionados(new Set(pedidosFiltrados.map(p => p.id)))
  }

  const toggle = (id: string) => {
    const s = new Set(seleccionados)
    s.has(id) ? s.delete(id) : s.add(id)
    setSeleccionados(s)
  }

  const cambiarVista = (v: Vista) => {
    setVista(v)
    setFiltroEstado('todos')
    setSeleccionados(new Set())
  }

  const generarEtiquetas = async () => {
    if (!seleccionados.size) return
    setGenerando(true)
    try {
      const res = await fetch('/api/admin/etiquetas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoIds: Array.from(seleccionados) }),
      })
      const { resultados: data } = await res.json()
      const mapa: Record<string, { ok: boolean; url?: string; error?: string }> = {}
      for (const r of (data ?? [])) mapa[r.pedidoId] = { ok: r.ok, url: r.etiqueta_url, error: r.error }
      setResultados(mapa)
      for (const r of (data ?? [])) {
        if (r.ok && r.etiqueta_url) window.open(r.etiqueta_url, '_blank')
      }
    } catch (e: any) {
      alert('Error generando etiquetas: ' + e.message)
    } finally {
      setGenerando(false)
      setSeleccionados(new Set())
    }
  }

  const cambiarEstadoBulk = async () => {
    if (!seleccionados.size) return
    setCambiandoEstado(true)
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(seleccionados), estado: estadoBulk }),
      })
      if (!res.ok) throw new Error('Error al actualizar')
      setPedidos(prev => prev.map(p => seleccionados.has(p.id) ? { ...p, estado: estadoBulk } : p))
      setSeleccionados(new Set())
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setCambiandoEstado(false)
    }
  }

  const eliminarSeleccionados = async () => {
    if (!seleccionados.size) return
    if (!confirm(`¿Eliminar ${seleccionados.size} pedido${seleccionados.size > 1 ? 's' : ''}? Esta acción no se puede deshacer.`)) return
    setEliminando(true)
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(seleccionados) }),
      })
      if (!res.ok) throw new Error('Error al eliminar')
      setPedidos(prev => prev.filter(p => !seleccionados.has(p.id)))
      setSeleccionados(new Set())
      router.refresh()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setEliminando(false)
    }
  }

  const VISTAS: { key: Vista; label: string; color: string }[] = [
    { key: 'pagados',     label: 'Pagados',     color: 'text-green-400' },
    { key: 'incompletos', label: 'Incompletos', color: 'text-yellow-400' },
    { key: 'cancelados',  label: 'Cancelados',  color: 'text-red-400' },
  ]

  return (
    <div>
      {/* Tabs principales */}
      <div className="flex gap-1 mb-6 bg-vx-gray900 rounded-xl p-1 w-fit border border-vx-gray800">
        {VISTAS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => cambiarVista(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              vista === key
                ? 'bg-vx-gray800 text-vx-white'
                : 'text-vx-gray500 hover:text-vx-white'
            }`}
          >
            {label}
            <span className={`text-xs font-mono ${vista === key ? color : 'text-vx-gray600'}`}>
              {conteoVista(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Sub-filtros por estado (solo en vista pagados) */}
      {vista === 'pagados' && (
        <div className="flex gap-2 flex-wrap mb-4">
          {(['todos', 'pendiente_envio', 'enviado', 'entregado'] as string[]).map(e => (
            <button
              key={e}
              onClick={() => { setFiltroEstado(e); setSeleccionados(new Set()) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtroEstado === e
                  ? 'bg-vx-white text-vx-black'
                  : 'bg-vx-gray800 text-vx-gray400 hover:text-vx-white'
              }`}
            >
              {e === 'todos'
                ? `Todos (${pedidosVista.length})`
                : `${ESTADO_LABEL[e]} (${pedidosVista.filter(p => p.estado === e).length})`
              }
            </button>
          ))}
        </div>
      )}

      {/* Barra de acciones bulk */}
      {seleccionados.size > 0 && (
        <div className="mb-4 flex items-center gap-3 flex-wrap bg-vx-gray800 rounded-xl px-4 py-3">
          <span className="text-sm text-vx-white font-medium">
            {seleccionados.size} seleccionado{seleccionados.size > 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={estadoBulk}
              onChange={e => setEstadoBulk(e.target.value as EstadoBulk)}
              className="bg-vx-gray700 text-vx-white text-xs rounded-lg px-2 py-1.5 border border-vx-gray600"
            >
              {ESTADOS_BULK.map(e => (
                <option key={e} value={e}>{ESTADO_LABEL[e] ?? e}</option>
              ))}
            </select>
            <Button size="sm" onClick={cambiarEstadoBulk} loading={cambiandoEstado}>
              Cambiar estado
            </Button>
          </div>
          {vista === 'pagados' && (
            <Button size="sm" onClick={generarEtiquetas} loading={generando}>
              Generar etiquetas
            </Button>
          )}
          <Button
            size="sm"
            onClick={eliminarSeleccionados}
            loading={eliminando}
            className="!bg-red-600 hover:!bg-red-700 ml-auto"
          >
            Eliminar
          </Button>
          <button onClick={() => setSeleccionados(new Set())} className="text-xs text-vx-gray400 hover:text-vx-white">
            Cancelar
          </button>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-vx-gray900 rounded-xl border border-vx-gray800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-vx-gray500 uppercase tracking-wider border-b border-vx-gray800 bg-vx-gray800/50">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={seleccionados.size === pedidosFiltrados.length && pedidosFiltrados.length > 0}
                    onChange={toggleAll}
                    className="rounded border-vx-gray600 bg-vx-gray800 accent-white cursor-pointer"
                  />
                </th>
                {['Pedido', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => {
                const res = resultados[p.id]
                return (
                  <tr key={p.id} className={`border-b border-vx-gray800/50 hover:bg-vx-gray800/30 ${seleccionados.has(p.id) ? 'bg-vx-gray800/50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={seleccionados.has(p.id)}
                        onChange={() => toggle(p.id)}
                        className="rounded border-vx-gray600 bg-vx-gray800 accent-white cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-vx-gray300">{p.numero_pedido}</td>
                    <td className="px-5 py-3 text-vx-white">{p.cliente_nombre}</td>
                    <td className="px-5 py-3 text-vx-gray400 text-xs">{p.cliente_email}</td>
                    <td className="px-5 py-3 text-vx-white">${Number(p.total).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={ESTADO_BADGE[p.estado] ?? 'default'}>
                            {ESTADO_LABEL[p.estado] ?? p.estado}
                          </Badge>
                          {res && (
                            <span className={`text-xs ${res.ok ? 'text-green-400' : 'text-red-400'}`}>
                              {res.ok ? '✓ etiqueta' : `✗ ${res.error}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-vx-gray500 text-xs">
                      {new Date(p.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/pedidos/${p.id}`} className="text-vx-cyan text-xs hover:underline">
                          Ver / Editar
                        </Link>
                        {p.etiqueta_url && (
                          <a href={p.etiqueta_url} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:underline">
                            Etiqueta
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!pedidosFiltrados.length && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-vx-gray500 text-xs">
                    {vista === 'incompletos' && 'Sin pedidos incompletos — todos los clientes completaron su pago.'}
                    {vista === 'pagados' && 'Sin pedidos pagados aún.'}
                    {vista === 'cancelados' && 'Sin pedidos cancelados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
