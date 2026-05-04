'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Button from '@/components/atoms/Button'
import type { Drop } from '@/types/database'

interface Props { drop?: Drop }

export default function DropForm({ drop }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre:      drop?.nombre ?? '',
    descripcion: drop?.descripcion ?? '',
    fecha_inicio: drop?.fecha_inicio ? new Date(drop.fecha_inicio).toISOString().slice(0, 16) : '',
    fecha_fin:   drop?.fecha_fin ? new Date(drop.fecha_fin).toISOString().slice(0, 16) : '',
    activo:      drop?.activo ?? false,
  })

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }))

  const save = async () => {
    setSaving(true)
    setError('')
    const payload: Record<string, unknown> = {
      nombre:      form.nombre,
      descripcion: form.descripcion,
      fecha_inicio: new Date(form.fecha_inicio).toISOString(),
      fecha_fin:   form.fecha_fin ? new Date(form.fecha_fin).toISOString() : null,
      activo:      form.activo,
    }
    if (drop) payload.id = drop.id
    try {
      const res = await fetch('/api/admin/drops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Error al guardar'); return }
      router.push('/admin/drops')
      router.refresh()
    } catch {
      setError('Error de red')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg flex flex-col gap-4">
      <Input label="Nombre" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
      <Textarea label="Descripción" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
      <Input label="Fecha inicio" type="datetime-local" value={form.fecha_inicio} onChange={(e) => set('fecha_inicio', e.target.value)} />
      <Input label="Fecha fin (opcional)" type="datetime-local" value={form.fecha_fin} onChange={(e) => set('fecha_fin', e.target.value)} />
      <label className="flex items-center gap-2 text-sm text-vx-gray300 cursor-pointer">
        <input type="checkbox" checked={form.activo} onChange={(e) => set('activo', e.target.checked)} className="accent-vx-cyan" />
        Activo
      </label>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button onClick={save} loading={saving}>{drop ? 'Guardar' : 'Crear drop'}</Button>
        <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </div>
  )
}
