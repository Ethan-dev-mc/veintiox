'use client'

import { useCart } from '@/context/CartContext'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartSidebar() {
  const { state, closeCart, removeItem, updateQuantity, total, itemCount } = useCart()

  if (!state.isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-phantom-gray z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-phantom-silver">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-phantom-accent" />
            <span className="font-display tracking-widest text-lg text-white">CARRITO</span>
            {itemCount > 0 && (
              <span className="bg-phantom-accent text-phantom-black text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 text-phantom-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-phantom-muted">
              <ShoppingBag className="w-12 h-12 opacity-30" />
              <p className="text-sm tracking-widest uppercase">Tu carrito está vacío</p>
              <button
                onClick={closeCart}
                className="text-xs text-phantom-accent hover:underline tracking-widest uppercase"
              >
                Explorar catálogo
              </button>
            </div>
          ) : (
            state.items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex gap-4 p-4 bg-phantom-black rounded-lg"
              >
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{item.product.name}</p>
                  <p className="text-phantom-muted text-xs mt-0.5">Talla: {item.size}</p>
                  <p className="text-phantom-accent font-bold text-sm mt-1">
                    ${(item.product.price * item.quantity).toLocaleString('es-MX')} MXN
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-phantom-silver flex items-center justify-center text-phantom-muted hover:border-phantom-accent hover:text-phantom-accent transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-phantom-silver flex items-center justify-center text-phantom-muted hover:border-phantom-accent hover:text-phantom-accent transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="ml-auto text-phantom-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="p-6 border-t border-phantom-silver space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-phantom-muted text-sm uppercase tracking-widest">Total</span>
              <span className="text-white font-bold text-xl">
                ${total.toLocaleString('es-MX')} MXN
              </span>
            </div>
            <p className="text-phantom-muted text-xs text-center">Envío calculado en checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-phantom-accent text-phantom-black text-center font-bold tracking-widest uppercase py-4 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Finalizar compra
            </Link>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="block w-full border border-phantom-silver text-phantom-light text-center text-sm tracking-widest uppercase py-3 rounded-lg hover:border-phantom-light transition-colors"
            >
              Ver carrito
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
