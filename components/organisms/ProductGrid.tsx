'use client'

import { useState, useMemo } from 'react'
import { clsx } from 'clsx'
import ProductCard from '@/components/molecules/ProductCard'
import CategoryFilter, { type FilterOption } from './CategoryFilter'
import { ProductGridSkeleton } from '@/components/atoms/Skeleton'
import type { Producto } from '@/types/database'

const PAGE_SIZE = 12

interface ProductGridProps {
  products: Producto[]
  categories?: FilterOption[]
  loading?: boolean
  onAddToCart?: (id: string) => void
  className?: string
  showFilters?: boolean
}

export default function ProductGrid({
  products,
  categories = [],
  loading = false,
  onAddToCart,
  className,
  showFilters = true,
}: ProductGridProps) {
  const [selectedCat, setSelectedCat] = useState('todos')
  const [sort, setSort] = useState('recientes')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    setVisible(PAGE_SIZE)
    let list = selectedCat === 'todos' ? products : products.filter((p) => p.categoria_id === selectedCat)
    if (sort === 'precio-asc') list = [...list].sort((a, b) => a.precio - b.precio)
    if (sort === 'precio-desc') list = [...list].sort((a, b) => b.precio - a.precio)
    return list
  }, [products, selectedCat, sort])

  if (loading) return <ProductGridSkeleton />

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  return (
    <div className={clsx('flex flex-col gap-6', className)}>
      {showFilters && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selected={selectedCat}
          onSelect={setSelectedCat}
          sortValue={sort}
          onSortChange={setSort}
        />
      )}

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-vx-gray500 text-sm">
          No se encontraron productos.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {shown.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex flex-col items-center gap-2 pt-4">
              <p className="text-xs text-vx-gray500">{shown.length} de {filtered.length} productos</p>
              <button
                onClick={() => setVisible(v => v + PAGE_SIZE)}
                className="px-8 py-3 rounded-xl border border-vx-gray700 text-sm text-vx-white hover:bg-vx-gray800 transition-colors"
              >
                Cargar más
              </button>
            </div>
          )}
          {!hasMore && filtered.length > PAGE_SIZE && (
            <p className="text-center text-xs text-vx-gray500 pt-2">Mostrando todos los productos</p>
          )}
        </>
      )}
    </div>
  )
}
