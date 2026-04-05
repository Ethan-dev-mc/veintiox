'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Textarea from '@/components/atoms/Textarea'
import Button from '@/components/atoms/Button'
import { IconZap } from '@/components/atoms/Icon'
import type { Producto } from '@/types/database'

const schema = z.object({
  nombre:             z.string().min(2),
  slug:               z.string().min(2).regex(/^[a-z0-9-]+$/),
  descripcion:        z.string().optional(),
  precio:             z.coerce.number().positive(),
  precio_comparacion: z.coerce.number().positive().optional().or(z.literal('')),
  categoria_id:       z.string().uuid('Selecciona una categoría'),
  stock:              z.coerce.number().int().min(0),
  tallas:             z.string().optional(),
  destacado:          z.boolean().optional(),
  activo:             z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  categorias: { id: string; nombre: string }[]
  producto?: Producto
}

export default function ProductForm({ categorias, producto }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>(producto?.imagenes ?? [])
  const [uploading, setUploading] = useState(false)
  const [cats, setCats] = useState(categorias)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (cats.length === 0) {
      fetch('/api/admin/categorias').then(r => r.json()).then(d => { if (d.categorias) setCats(d.categorias) })
    }
  }, [])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: producto ? {
      nombre:             producto.nombre,
      slug:               producto.slug,
      descripcion:        producto.descripcion,
      precio:             producto.precio,
      precio_comparacion: producto.precio_comparacion ?? undefined,
      categoria_id:       producto.categoria_id,
      stock:              producto.stock,
      tallas:             producto.tallas_disponibles.join(', '),
      destacado:          producto.destacado,
      activo:             producto.activo,
    } : { activo: true, destacado: false, stock: 0 },
  })

  const nombre = watch('nombre')
  const categoriaId = watch('categoria_id')

  const generateSlug = () => {
    setValue('slug', nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  const generateDescription = async () => {
    if (!nombre) return
    setAiLoading(true)
    try {
      const cat = categorias.find((c) => c.id === categoriaId)?.nombre ?? ''
      const res = await fetch('/api/ai/descripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, categoria: cat }),
      })
      const { descripcion } = await res.json()
      setValue('descripcion', descripcion)
    } finally {
      setAiLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (res.ok) {
        const { url } = await res.json()
        urls.push(url)
      }
    }
    setImagenes((prev) => [...prev, ...urls])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (url: string) => setImagenes((prev) => prev.filter((i) => i !== url))

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    const payload = {
      nombre:             data.nombre,
      slug:               data.slug,
      descripcion:        data.descripcion ?? '',
      precio:             data.precio,
      precio_comparacion: data.precio_comparacion || null,
      categoria_id:       data.categoria_id,
      stock:              data.stock,
      tallas_disponibles: data.tallas ? data.tallas.split(',').map((t) => t.trim()).filter(Boolean) : [],
      destacado:          data.destacado ?? false,
      activo:             data.activo ?? true,
      imagenes,
    }
    const res = await fetch('/api/admin/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto ? { id: producto.id, ...payload } : payload),
    })
    const result = await res.json()
    if (!res.ok) {
      alert('Error al guardar: ' + result.error)
      setSaving(false)
      return
    }
    window.location.href = '/admin/productos'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nombre" error={errors.nombre?.message} {...register('nombre')} />
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input label="Slug (URL)" error={errors.slug?.message} {...register('slug')} />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={generateSlug}>Auto</Button>
        </div>
        <Input label="Precio (MXN)" type="number" step="0.01" error={errors.precio?.message} {...register('precio')} />
        <Input label="Precio comparación" type="number" step="0.01" hint="Precio tachado (opcional)" {...register('precio_comparacion')} />
        <Select label="Categoría" options={cats.map((c) => ({ value: c.id, label: c.nombre }))} placeholder="Selecciona..." error={errors.categoria_id?.message} {...register('categoria_id')} />
        <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />
        <Input label="Tallas" hint="Ej: XS, S, M, L, XL (separadas por coma)" {...register('tallas')} className="sm:col-span-2" />
      </div>

      {/* Imágenes */}
      <div>
        <p className="text-sm text-vx-gray300 font-medium mb-2">Imágenes</p>
        <div className="flex flex-wrap gap-3 mb-3">
          {imagenes.map((url) => (
            <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-vx-gray700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">×</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-vx-gray700 hover:border-vx-cyan text-vx-gray500 hover:text-vx-cyan transition-colors flex flex-col items-center justify-center text-xs gap-1"
          >
            {uploading ? '...' : <>＋<span>Subir</span></>}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {/* Descripción */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm text-vx-gray300 font-medium">Descripción</label>
          <button type="button" onClick={generateDescription} disabled={aiLoading || !nombre} className="flex items-center gap-1.5 text-xs text-vx-cyan hover:text-vx-cyan-dim disabled:opacity-40">
            <IconZap className="w-3 h-3" />
            {aiLoading ? 'Generando...' : 'Generar con IA'}
          </button>
        </div>
        <Textarea {...register('descripcion')} rows={4} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-vx-gray300 cursor-pointer">
          <input type="checkbox" {...register('activo')} className="accent-vx-cyan" /> Activo
        </label>
        <label className="flex items-center gap-2 text-sm text-vx-gray300 cursor-pointer">
          <input type="checkbox" {...register('destacado')} className="accent-vx-cyan" /> Destacado
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={saving}>{producto ? 'Guardar cambios' : 'Crear producto'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  )
}
