'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { products, Badge } from '@/data/products'
import { SlidersHorizontal } from 'lucide-react'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating'

const badges: (Badge | 'Todos')[] = ['Todos', 'Más vendido', 'Nuevo', 'Drop limitado']

export default function CatalogPage() {
  const [filter, setFilter] = useState<Badge | 'Todos'>('Todos')
  const [sort, setSort] = useState<SortKey>('default')

  const filtered = products
    .filter((p) => filter === 'Todos' || p.badge === filter)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-2">Colección completa</p>
        <h1 className="text-5xl md:text-6xl font-display tracking-wider text-white">CATÁLOGO</h1>
        <p className="text-phantom-muted mt-3">{filtered.length} productos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-10">
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <button
              key={b ?? 'null'}
              onClick={() => setFilter(b === 'Todos' ? 'Todos' : (b as Badge))}
              className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-colors border ${
                filter === b
                  ? 'bg-phantom-accent text-phantom-black border-phantom-accent'
                  : 'border-phantom-silver text-phantom-muted hover:border-phantom-light hover:text-phantom-light'
              }`}
            >
              {b ?? 'Sin etiqueta'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-phantom-muted" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-phantom-gray border border-phantom-silver text-phantom-light text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-phantom-accent"
          >
            <option value="default">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor valoradas</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-phantom-muted">
          <p className="text-xl font-display tracking-widest">SIN RESULTADOS</p>
          <p className="text-sm mt-2">Intenta con otro filtro</p>
        </div>
      )}
    </div>
  )
}
