'use client'

import { useState } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import ImageGallery from './ImageGallery'
import SizeSelector from './SizeSelector'
import { Heading, Text, Label } from '@/components/atoms/Typography'
import Price from '@/components/atoms/Price'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import QuantitySelector from '@/components/atoms/QuantitySelector'
import { IconCart, IconTruck, IconZap } from '@/components/atoms/Icon'
import type { Producto, Categoria } from '@/types/database'

interface ProductDetailProps {
  product: Producto & { categorias?: Categoria }
  onAddToCart: (item: { id: string; talla?: string; cantidad: number }) => void
  envioGratisMinimo?: number
}

export default function ProductDetail({ product, onAddToCart, envioGratisMinimo = 999 }: ProductDetailProps) {
  const [selectedTalla, setSelectedTalla] = useState<string | null>(
    product.tallas_disponibles.length === 1 ? product.tallas_disponibles[0] : null
  )
  const [cantidad, setCantidad] = useState(1)
  const [error, setError] = useState('')

  const agotado = product.stock === 0

  const handleAddToCart = () => {
    if (product.tallas_disponibles.length > 0 && !selectedTalla) {
      setError('Selecciona una talla')
      return
    }
    setError('')
    onAddToCart({ id: product.id, talla: selectedTalla ?? undefined, cantidad })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Galería */}
      <ImageGallery images={product.imagenes} alt={product.nombre} />

      {/* Info */}
      <div className="flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-vx-gray500">
          <Link href="/catalogo" className="hover:text-vx-cyan transition-colors">Catálogo</Link>
          {product.categorias && (
            <>
              <span>/</span>
              <Link href={`/catalogo/${product.categorias.slug}`} className="hover:text-vx-cyan transition-colors capitalize">
                {product.categorias.nombre}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-vx-gray300 truncate">{product.nombre}</span>
        </nav>

        {/* Título y precio */}
        <div>
          <Heading size="sm" className="mb-3">{product.nombre}</Heading>
          <div className="flex items-center gap-3 flex-wrap">
            <Price amount={product.precio} compare={product.precio_comparacion ?? undefined} size="lg" />
            {agotado && <Badge variant="danger">Agotado</Badge>}
            {!agotado && product.stock <= 5 && (
              <Badge variant="warning">Solo {product.stock} disponibles</Badge>
            )}
            {!agotado && product.precio >= envioGratisMinimo && (
              <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2.5 py-0.5 text-xs font-bold">
                <IconTruck className="w-3 h-3" />
                ENVÍO GRATIS
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        {product.descripcion && (
          <Text color="muted" className="leading-relaxed">{product.descripcion}</Text>
        )}

        {/* Tallas */}
        {product.tallas_disponibles.length > 0 && (
          <SizeSelector
            tallas={product.tallas_disponibles}
            selected={selectedTalla}
            onSelect={(t) => { setSelectedTalla(t); setError('') }}
          />
        )}
        {error && <p className="text-xs text-red-400 -mt-4">{error}</p>}

        {/* Cantidad */}
        {!agotado && (
          <div className="flex items-center gap-4">
            <Label>Cantidad</Label>
            <QuantitySelector value={cantidad} max={product.stock} onChange={setCantidad} />
          </div>
        )}

        {/* CTA */}
        <Button
          size="lg"
          fullWidth
          disabled={agotado}
          onClick={handleAddToCart}
          className={clsx(agotado && 'opacity-50')}
        >
          <IconCart className="w-5 h-5" />
          {agotado ? 'Agotado' : 'Agregar al carrito'}
        </Button>

        {/* Beneficios */}
        <div className="flex flex-col gap-2 pt-2 border-t border-vx-gray800">
          <div className="flex items-center gap-2 text-xs text-vx-gray400">
            <IconTruck className="w-4 h-4 text-vx-cyan flex-shrink-0" />
            Envío gratis en compras mayores a ${envioGratisMinimo} MXN
          </div>
          <div className="flex items-center gap-2 text-xs text-vx-gray400">
            <IconZap className="w-4 h-4 text-vx-cyan flex-shrink-0" />
            Entrega en 2–5 días hábiles
          </div>
        </div>
      </div>
    </div>
  )
}
