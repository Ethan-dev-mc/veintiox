'use client'

import { useState, useEffect } from 'react'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Button from '@/components/atoms/Button'
import { IconCheck } from '@/components/atoms/Icon'

export default function ConfigForm() {
  const [form, setForm] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/configuracion')
      .then(r => r.json())
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {}
          for (const { clave, valor } of data) map[clave] = valor
          setForm(map)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Error al guardar')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      setError('Error de red')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-white/50 text-sm">Cargando...</p>

  return (
    <div className="max-w-lg flex flex-col gap-5">
      <Input label="Monto mínimo envío gratis (MXN)" type="number" value={form.envio_gratis_minimo ?? ''} onChange={(e) => set('envio_gratis_minimo', e.target.value)} />
      <Input label="Costo de envío estándar (MXN)" type="number" value={form.costo_envio ?? ''} onChange={(e) => set('costo_envio', e.target.value)} />
      <Textarea label="Texto barra promocional" value={form.promo_bar_texto ?? ''} onChange={(e) => set('promo_bar_texto', e.target.value)} />
      <Input label="URL Instagram" value={form.instagram_url ?? ''} onChange={(e) => set('instagram_url', e.target.value)} />
      <Input label="URL TikTok" value={form.tiktok_url ?? ''} onChange={(e) => set('tiktok_url', e.target.value)} />
      <Input label="URL Facebook" value={form.facebook_url ?? ''} onChange={(e) => set('facebook_url', e.target.value)} />
      <Input label="Email de contacto" value={form.contacto_email ?? ''} onChange={(e) => set('contacto_email', e.target.value)} />
      <Button onClick={save} loading={saving}>
        {saved ? <><IconCheck className="w-4 h-4" /> Guardado</> : 'Guardar cambios'}
      </Button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
