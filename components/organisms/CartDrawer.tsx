'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { IconClose, IconCart, IconTruck } from '@/components/atoms/Icon'
import { Heading } from '@/components/atoms/Typography'
import Button from '@/components/atoms/Button'
import CartItem, { type CartItemData } from '@/components/molecules/CartItem'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  items: CartItemData[]
  onQuantityChange: (id: string, cantidad: number) => void
  onRemove: (id: string) => void
  envioGratisMinimo?: number
  costoEnvio?: number
}

export default function CartDrawer({
  open,
  onClose,
  items,
  onQuantityChange,
  onRemove,
  envioGratisMinimo = 999,
  costoEnvio = 150,
}: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const envio = subtotal >= envioGratisMinimo ? 0 : costoEnvio
  const total = subtotal + envio
  const faltaEnvioGratis = Math.max(0, envioGratisMinimo - subtotal)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-vx-black/70 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-vx-gray900 flex flex-col transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-vx-gray800">
          <div className="flex items-center gap-2">
            <IconCart className="w-5 h-5 text-vx-cyan" />
            <Heading as="h2" size="xs">Carrito</Heading>
            {items.length > 0 && (
              <span className="text-xs text-vx-gray400">({items.length} {items.length === 1 ? 'artículo' : 'artículos'})</span>
            )}
          </div>
          <button onClick={onClose} aria-label="Cerrar carrito" className="p-1.5 text-vx-gray400 hover:text-vx-white transition-colors">
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center">
            <IconCart className="w-12 h-12 text-vx-gray700" />
            <p className="text-vx-gray400 text-sm">Tu carrito está vacío</p>
            <Button variant="outline" size="sm" onClick={onClose}>Ver productos</Button>
          </div>
        ) : (
          <>
            {/* Banner envío gratis */}
            {faltaEnvioGratis > 0 && (
              <div className="px-5 py-2.5 bg-vx-gray800 flex items-center gap-2 text-xs text-vx-gray300">
                <IconTruck className="w-4 h-4 text-vx-cyan flex-shrink-0" />
                Te faltan <span className="text-vx-cyan font-bold mx-1">
                  ${faltaEnvioGratis.toFixed(0)} MXN
                </span> para envío gratis
              </div>
            )}
            {faltaEnvioGratis === 0 && (
              <div className="px-5 py-2.5 bg-vx-cyan/10 flex items-center gap-2 text-xs text-vx-cyan border-b border-vx-cyan/20">
                <IconTruck className="w-4 h-4 flex-shrink-0" />
                ¡Tienes envío gratis!
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={onQuantityChange}
                  onRemove={onRemove}
                />
              ))}
            </div>

            {/* Footer totales */}
            <div className="px-5 py-4 border-t border-vx-gray800 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-vx-gray400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-vx-gray400">
                  <span>Envío</span>
                  <span>{envio === 0 ? <span className="text-vx-cyan">Gratis</span> : `$${envio} MXN`}</span>
                </div>
                <div className="flex justify-between text-vx-white font-bold text-base pt-1 border-t border-vx-gray800">
                  <span>Total</span>
                  <span>${total.toFixed(2)} MXN</span>
                </div>
              </div>
              <Link href="/checkout" onClick={onClose}>
                <Button fullWidth size="lg">Proceder al pago</Button>
              </Link>
              <button onClick={onClose} className="text-center text-xs text-vx-gray500 hover:text-vx-white transition-colors">
                Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
