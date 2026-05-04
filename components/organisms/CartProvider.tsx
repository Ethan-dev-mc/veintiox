'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/stores/cartStore'
import CartDrawer from './CartDrawer'

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const { items, open, closeCart, updateQuantity, removeItem } = useCartStore()
  const [envioGratisMinimo, setEnvioGratisMinimo] = useState(999)

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(({ data }) => {
        const val = parseFloat(data?.envio_gratis_minimo)
        if (!isNaN(val)) setEnvioGratisMinimo(val)
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
      />
    </>
  )
}
