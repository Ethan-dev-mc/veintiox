'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'
import CheckoutForm, { type CheckoutFormData } from '@/components/organisms/CheckoutForm'
import { Heading } from '@/components/atoms/Typography'
import Button from '@/components/atoms/Button'

export default function CheckoutPageClient() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [costoEnvio, setCostoEnvio] = useState(150)
  const [minimoGratis, setMinimoGratis] = useState(999)

  useEffect(() => {
    fetch('/api/admin/configuracion')
      .then(r => r.json())
      .then(({ data }) => {
        if (!data) return
        const costo = data.find((d: any) => d.clave === 'costo_envio')
        const minimo = data.find((d: any) => d.clave === 'envio_gratis_minimo')
        if (costo) setCostoEnvio(Number(costo.valor))
        if (minimo) setMinimoGratis(Number(minimo.valor))
      })
  }, [])

  const sub = subtotal()
  const envio = sub >= minimoGratis ? 0 : costoEnvio
  const total = sub + envio

  if (items.length === 0) {
    return (
      <div className="container-site py-20 text-center flex flex-col items-center gap-5">
        <Heading size="sm">Sin artículos en el carrito</Heading>
        <Link href="/catalogo"><Button>Ver catálogo</Button></Link>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, items, subtotal: sub, envio, total }),
      })
      if (!res.ok) throw new Error()
      const { numeroPedido, checkoutUrl } = await res.json()
      clearCart()
      if (checkoutUrl) window.location.href = checkoutUrl
      else router.push(`/checkout/confirmacion?pedido=${numeroPedido}`)
    } catch {
      alert('Error al procesar el pedido. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-site py-10">
      <Heading size="sm" className="mb-8">CHECKOUT</Heading>
      <CheckoutForm
        items={items}
        subtotal={sub}
        envio={envio}
        total={total}
        onSubmit={onSubmit}
        loading={loading}
      />
    </div>
  )
}
