'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/stores/cartStore'
import CartItem from '@/components/molecules/CartItem'
import Button from '@/components/atoms/Button'
import Price from '@/components/atoms/Price'
import { Heading, Label } from '@/components/atoms/Typography'
import { IconTruck, IconArrowRight } from '@/components/atoms/Icon'

export default function CartPageClient() {
  const { items, updateQuantity, removeItem, subtotal, envio, total } = useCartStore()
  const [minimoGratis, setMinimoGratis] = useState(999)
  const [costoEnvio, setCostoEnvio] = useState(150)

  useEffect(() => {
    fetch('/api/admin/configuracion')
      .then(r => r.json())
      .then(({ data }) => {
        if (!data) return
        const minimo = data.find((d: any) => d.clave === 'envio_gratis_minimo')
        const costo = data.find((d: any) => d.clave === 'costo_envio')
        if (minimo) setMinimoGratis(Number(minimo.valor))
        if (costo) setCostoEnvio(Number(costo.valor))
      })
      .catch(() => {})
  }, [])

  const sub = subtotal()
  const env = envio(minimoGratis, costoEnvio)
  const tot = total(minimoGratis, costoEnvio)
  const falta = Math.max(0, minimoGratis - sub)

  if (items.length === 0) {
    return (
      <div className="container-site py-20 text-center flex flex-col items-center gap-5">
        <Heading size="sm">Tu carrito está vacío</Heading>
        <p className="text-vx-gray400 text-sm">Agrega productos para continuar.</p>
        <Link href="/catalogo"><Button>Ver catálogo</Button></Link>
      </div>
    )
  }

  return (
    <div className="container-site py-10">
      <Heading size="sm" className="mb-8">CARRITO</Heading>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2">
          {falta > 0 && (
            <div className="flex items-center gap-2 text-sm text-vx-gray300 bg-vx-gray900 rounded-lg px-4 py-3 mb-6 border border-vx-gray800">
              <IconTruck className="w-4 h-4 text-vx-cyan" />
              Agrega <span className="text-vx-cyan font-bold mx-1">${falta.toFixed(0)} MXN</span> más para envío gratis
            </div>
          )}
          <div>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        {/* Resumen */}
        <aside>
          <div className="bg-vx-gray900 rounded-2xl p-5 sticky top-24">
            <Heading as="h2" size="xs" className="mb-4">Resumen</Heading>
            <div className="flex flex-col gap-2 text-sm mb-5">
              <div className="flex justify-between text-vx-gray400">
                <span>Subtotal</span>
                <span>${sub.toFixed(2)} MXN</span>
              </div>
              <div className="flex justify-between text-vx-gray400">
                <span>Envío</span>
                <span>{env === 0 ? <span className="text-vx-cyan">Gratis</span> : `$${env} MXN`}</span>
              </div>
              <div className="flex justify-between font-bold text-vx-white text-base pt-2 border-t border-vx-gray800">
                <span>Total</span>
                <Price amount={tot} />
              </div>
            </div>
            <Link href="/checkout">
              <Button fullWidth size="lg">
                Ir al checkout
                <IconArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
