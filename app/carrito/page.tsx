'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { state, removeItem, updateQuantity, total, clearCart } = useCart()

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-fade-in">
        <ShoppingBag className="w-16 h-16 text-phantom-muted mx-auto mb-6 opacity-40" />
        <h1 className="text-4xl font-display tracking-wider text-white mb-4">CARRITO VACÍO</h1>
        <p className="text-phantom-muted mb-8">Todavía no has agregado nada. ¡El catálogo te espera!</p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ir al catálogo
        </Link>
      </div>
    )
  }

  const shipping = total >= 999 ? 0 : 99
  const grandTotal = total + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl md:text-5xl font-display tracking-wider text-white">MI CARRITO</h1>
        <button
          onClick={clearCart}
          className="text-xs text-phantom-muted hover:text-red-400 tracking-widest uppercase transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}`}
              className="flex gap-5 p-5 bg-phantom-gray rounded-xl border border-phantom-silver"
            >
              <Link href={`/producto/${item.product.id}`} className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link href={`/producto/${item.product.id}`}>
                      <p className="font-medium text-white hover:text-phantom-accent transition-colors">
                        {item.product.name}
                      </p>
                    </Link>
                    <p className="text-phantom-muted text-xs mt-0.5">Talla: {item.size}</p>
                    <p className="text-phantom-muted text-xs">${item.product.price.toLocaleString('es-MX')} c/u</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size)}
                    className="text-phantom-muted hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-phantom-silver rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                      className="px-3 py-2 text-phantom-muted hover:text-white hover:bg-phantom-silver transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-4 py-2 text-white text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                      className="px-3 py-2 text-phantom-muted hover:text-white hover:bg-phantom-silver transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-bold text-white">
                    ${(item.product.price * item.quantity).toLocaleString('es-MX')} MXN
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-phantom-gray rounded-xl border border-phantom-silver p-6 sticky top-24">
            <h2 className="text-lg font-display tracking-widest text-white mb-6">RESUMEN</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-phantom-muted">Subtotal</span>
                <span className="text-white">${total.toLocaleString('es-MX')} MXN</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-phantom-muted">Envío</span>
                <span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-white'}>
                  {shipping === 0 ? 'Gratis' : `$${shipping} MXN`}
                </span>
              </div>
              {total < 999 && (
                <p className="text-xs text-phantom-accent">
                  Te faltan ${(999 - total).toLocaleString('es-MX')} para envío gratis
                </p>
              )}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-phantom-muted" />
                <input
                  type="text"
                  placeholder="Código de descuento"
                  className="w-full bg-phantom-black border border-phantom-silver rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-phantom-muted focus:outline-none focus:border-phantom-accent transition-colors"
                />
              </div>
              <button className="px-4 py-2.5 border border-phantom-silver text-phantom-muted text-sm rounded-lg hover:border-phantom-accent hover:text-phantom-accent transition-colors">
                Aplicar
              </button>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-phantom-silver">
              <span className="font-medium text-white">Total</span>
              <span className="text-2xl font-bold text-white">${grandTotal.toLocaleString('es-MX')} MXN</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-phantom-accent text-phantom-black text-center font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-[1.02]"
            >
              Finalizar compra
            </Link>

            <Link
              href="/catalogo"
              className="flex items-center justify-center gap-2 mt-4 text-sm text-phantom-muted hover:text-phantom-light transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
