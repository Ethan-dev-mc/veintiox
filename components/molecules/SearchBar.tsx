'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { clsx } from 'clsx'
import { IconSearch, IconClose } from '@/components/atoms/Icon'

interface SearchBarProps {
  className?: string
  onClose?: () => void
  autoFocus?: boolean
}

interface Resultado {
  id: string
  slug: string
  nombre: string
  precio: number
  imagenes: string[]
}

export default function SearchBar({ className, onClose, autoFocus = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [cargando, setCargando] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // Cierra al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const buscar = useCallback((q: string) => {
    if (!q.trim()) { setResultados([]); setAbierto(false); return }
    setCargando(true)
    fetch(`/api/productos?q=${encodeURIComponent(q)}&limit=5`)
      .then(r => r.json())
      .then((data) => {
        setResultados(Array.isArray(data) ? data : (data?.data ?? []))
        setAbierto(true)
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => buscar(val), 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setAbierto(false)
    router.push(`/catalogo?q=${encodeURIComponent(q)}`)
    onClose?.()
  }

  const handleSelect = () => {
    setAbierto(false)
    onClose?.()
  }

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center" role="search">
        <IconSearch className="absolute left-3 w-4 h-4 text-vx-gray500 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => { if (resultados.length) setAbierto(true) }}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className="w-full bg-vx-gray900 border border-vx-gray700 rounded-lg pl-10 pr-10 py-2.5 text-sm text-vx-white placeholder:text-vx-gray500 focus:outline-none focus:border-vx-cyan transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResultados([]); setAbierto(false) }}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 text-vx-gray500 hover:text-vx-white transition-colors"
          >
            <IconClose className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown resultados */}
      {abierto && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-vx-gray900 border border-vx-gray700 rounded-xl shadow-xl z-50 overflow-hidden">
          {cargando && (
            <p className="text-xs text-vx-gray500 px-4 py-3">Buscando...</p>
          )}
          {!cargando && resultados.length === 0 && (
            <p className="text-xs text-vx-gray500 px-4 py-3">Sin resultados para "{query}"</p>
          )}
          {!cargando && resultados.map(r => (
            <Link
              key={r.id}
              href={`/producto/${r.slug}`}
              onClick={handleSelect}
              className="flex items-center gap-3 px-4 py-3 hover:bg-vx-gray800 transition-colors"
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-vx-gray800 flex-shrink-0">
                {r.imagenes?.[0] ? (
                  <Image src={r.imagenes[0]} alt={r.nombre} fill sizes="40px" className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-vx-gray700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-vx-white truncate">{r.nombre}</p>
                <p className="text-xs text-vx-cyan">${r.precio.toFixed(2)} MXN</p>
              </div>
            </Link>
          ))}
          {!cargando && resultados.length > 0 && (
            <button
              onClick={handleSubmit as any}
              className="w-full text-xs text-vx-gray400 hover:text-vx-cyan px-4 py-2.5 border-t border-vx-gray800 text-left transition-colors"
            >
              Ver todos los resultados para "{query}" →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
