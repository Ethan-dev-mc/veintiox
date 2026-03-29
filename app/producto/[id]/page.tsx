'use client'

import { useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ShoppingBag, Star, Shield, Truck, RotateCcw, ChevronDown } from 'lucide-react'
import { products } from '@/data/products'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

const badgeStyles: Record<string, string> = {
  'Más vendido': 'bg-phantom-accent text-phantom-black',
  'Nuevo': 'bg-white text-phantom-black',
  'Drop limitado': 'bg-red-500 text-white',
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)
  if (!product) notFound()

  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const related = products.filter((p) => p.id !== product.id).slice(0, 4)

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-xs text-phantom-muted mb-8 flex gap-2 items-center">
        <Link href="/" className="hover:text-phantom-accent transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-phantom-accent transition-colors">Catálogo</Link>
        <span>/</span>
        <span className="text-phantom-light">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-phantom-gray">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          {product.badge && (
            <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase ${badgeStyles[product.badge]}`}>
              {product.badge}
            </span>
          )}
          {product.stock <= 20 && (
            <span className="absolute top-4 right-4 text-xs bg-red-500/90 text-white px-3 py-1.5 rounded-full font-bold">
              ¡Solo {product.stock} disponibles!
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-phantom-muted text-xs tracking-widest uppercase mb-2">{product.colors[0]}</p>
            <h1 className="text-4xl md:text-5xl font-display tracking-wider text-white mb-2">
              {product.name.toUpperCase()}
            </h1>
            <p className="text-phantom-muted italic">{product.tagline}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-phantom-accent text-phantom-accent' : 'text-phantom-silver'}`}
                />
              ))}
            </div>
            <span className="text-phantom-light text-sm font-medium">{product.rating}</span>
            <span className="text-phantom-muted text-sm">({product.reviews} reseñas)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">${product.price.toLocaleString('es-MX')}</span>
            {product.originalPrice && (
              <span className="text-phantom-muted line-through text-xl">
                ${product.originalPrice.toLocaleString('es-MX')}
              </span>
            )}
            <span className="text-phantom-muted text-sm">MXN</span>
          </div>

          {/* Description */}
          <p className="text-phantom-light leading-relaxed">{product.description}</p>

          {/* Size selector */}
          <div>
            <p className="text-xs tracking-widest uppercase text-phantom-muted mb-3">Talla</p>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectedSize === size
                      ? 'bg-phantom-accent text-phantom-black border-phantom-accent'
                      : 'border-phantom-silver text-phantom-muted hover:border-phantom-light hover:text-phantom-light'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-xs tracking-widest uppercase text-phantom-muted mb-3">Cantidad</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-phantom-silver rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-phantom-muted hover:text-white hover:bg-phantom-silver transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-3 text-white font-medium min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-phantom-muted hover:text-white hover:bg-phantom-silver transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-phantom-muted text-xs">{product.stock} disponibles</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            className={`flex items-center justify-center gap-3 py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all ${
              added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-phantom-accent text-phantom-black hover:bg-yellow-400 hover:scale-[1.02]'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {added ? '¡Agregado al carrito!' : 'Añadir al carrito'}
          </button>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-phantom-silver">
            {[
              { icon: Truck, label: 'Envío rápido', sub: '2–5 días hábiles' },
              { icon: Shield, label: 'Garantía', sub: '30 días' },
              { icon: RotateCcw, label: 'Devoluciones', sub: 'Sin complicaciones' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon className="w-5 h-5 text-phantom-accent" />
                <span className="text-white text-xs font-medium">{label}</span>
                <span className="text-phantom-muted text-[11px]">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-24">
        <h2 className="text-3xl font-display tracking-wider text-white mb-8">TAMBIÉN TE PUEDE GUSTAR</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
