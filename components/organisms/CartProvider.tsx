'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/stores/cartStore'
import CartDrawer from './CartDrawer'

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { items, open, closeCart, updateQuantity, removeItem } = useCartStore()
  const [envioGratisMinimo, setEnvioGratisMinimo] = useState(999)
  const [costoEnvio, setCostoEnvio] = useState(150)

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(({ data }) => {
        const minimo = parseFloat(data?.envio_gratis_minimo)
        const costo = parseFloat(data?.costo_envio)
        if (!isNaN(minimo)) setEnvioGratisMinimo(minimo)
        if (!isNaN(costo)) setCostoEnvio(costo)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {children}
      <CartDrawer
        open={open}
        onClose={closeCart}
        items={items}
        onQuantityChange={updateQuantity}
        onRemove={removeItem}
        envioGratisMinimo={envioGratisMinimo}
        costoEnvio={costoEnvio}
      />
    </>
  )
}
