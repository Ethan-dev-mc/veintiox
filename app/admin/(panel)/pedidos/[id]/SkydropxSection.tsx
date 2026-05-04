'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/atoms/Button'

interface Props {
  pedidoId: string
  initialTracking?: string | null
  initialEtiqueta?: string | null
  initialCarrier?: string | null
}

export default function SkydropxSection({ pedidoId, initialTracking, initialEtiqueta, initialCarrier }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tracking, setTracking] = useState(initialTracking ?? '')
  const [etiqueta, setEtiqueta] = useState(initialEtiqueta ?? '')
  const [carrier, setCarrier] = useState(initialCarrier ?? '')

  const generar = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/skydropx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error al generar etiqueta')
      setTracking(json.numero_rastreo)
      setEtiqueta(json.etiqueta_url)
      setCarrier(json.carrier_envio)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-vx-gray900 rounded-xl p-4 border border-vx-gray800 flex flex-col gap-3">
      <p className="text-sm font-medium text-vx-white">Envío — Skydropx</p>

      {tracking ? (
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-vx-gray400">
            <span>Carrier</span>
            <span className="text-vx-white uppercase">{carrier}</span>
          </div>
          <div className="flex justify-between text-vx-gray400">
            <span>Tracking</span>
            <span className="text-vx-white font-mono text-xs">{tracking}</span>
          </div>
          <a
            href={etiqueta}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center justify-center w-full px-4 py-2 rounded-lg border border-vx-gray600 text-vx-gray200 hover:border-vx-cyan hover:text-vx-cyan text-xs uppercase tracking-wider transition-colors"
          >
            Descargar etiqueta PDF
          </a>
        </div>
      ) : (
        <>
          <p className="text-xs text-vx-gray500">
            Se cotizará automáticamente con el carrier más barato disponible y el pedido pasará a "Enviado".
          </p>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button onClick={generar} loading={loading} size="sm">
            Generar etiqueta de envío
          </Button>
        </>
      )}
    </div>
  )
}
