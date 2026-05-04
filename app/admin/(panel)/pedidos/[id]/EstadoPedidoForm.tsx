'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'

const ESTADOS = [
  { value: 'pendiente',       label: 'Pendiente' },
  { value: 'pendiente_envio', label: 'Pagado — Pendiente envío' },
  { value: 'enviado',         label: 'Enviado' },
  { value: 'entregado',       label: 'Entregado' },
  { value: 'cancelado',       label: 'Cancelado' },
]

export default function EstadoPedidoForm({ pedidoId, estadoActual }: { pedidoId: string; estadoActual: string }) {
  const router = useRouter()
  const [estado, setEstado] = useState(estadoActual)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/pedidos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id: pedidoId, estado }),
      })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Error'); return }
      router.refresh()
    } catch { setError('Error de red') }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-vx-gray900 rounded-xl p-4 border border-vx-gray800 flex flex-col gap-3">
      <p className="text-sm font-medium text-vx-white">Estado del pedido</p>
      <Select
        label=""
        options={ESTADOS}
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      />
      <Button onClick={save} loading={loading} size="sm">Guardar estado</Button>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
