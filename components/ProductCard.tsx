'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'
import { Product } from '@/data/products'
import { useCart } from '@/context/CartContext'

const badgeStyles: Record<string, string> = {
  'Más vendido': 'bg-phantom-accent text-phantom-black',
  'Nuevo': 'bg-white text-phantom-black',
  'Drop limitado': 'bg-red-500 text-white',
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, product.sizes[0])
  }

  return (
    <Link href={`/producto/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-phantom-gray aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full tracking-widest uppercase z-10 ${badgeStyles[product.badge]}`}>
            {product.badge}
          </span>
        )}

        {/* Stock warning */}
        {product.stock <= 20 && (
          <span className="absolute top-3 right-3 text-xs bg-red-500/90 text-white px-2 py-1 rounded-full z-10">
            ¡Solo {product.stock}!
          </span>
        )}

        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAdd}
            className="w-full bg-phantom-accent text-phantom-black font-bold text-xs tracking-widest uppercase py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Añadir al carrito
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white group-hover:text-phantom-accent transition-colors">
            {product.name}
          </p>
          <p className="font-bold text-white">${product.price.toLocaleString('es-MX')}</p>
        </div>
        <p className="text-xs text-phantom-muted truncate">{product.tagline}</p>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-phantom-accent text-phantom-accent" />
          <span className="text-xs text-phantom-muted">{product.rating} ({product.reviews})</span>
        </div>
      </div>
    </Link>
  )
}
