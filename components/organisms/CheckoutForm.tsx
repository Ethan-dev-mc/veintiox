'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { clsx } from 'clsx'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Price from '@/components/atoms/Price'
import { Heading, Label } from '@/components/atoms/Typography'
import type { CartItemData } from '@/components/molecules/CartItem'

const schema = z.object({
  nombre:           z.string().min(2, 'Nombre requerido'),
  email:            z.string().email('Email inválido'),
  telefono:         z.string().min(10, 'Teléfono inválido'),
  calle:            z.string().min(3, 'Dirección requerida'),
  ciudad:           z.string().min(2, 'Ciudad requerida'),
  estado:           z.string().min(2, 'Estado requerido'),
  cp:               z.string().length(5, 'CP de 5 dígitos'),
  metodo_pago:      z.enum(['mercadopago']),
})

export type CheckoutFormData = z.infer<typeof schema>

const ESTADOS_MX = [
  'Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas',
  'Chihuahua','Ciudad de México','Coahuila','Colima','Durango','Estado de México',
  'Guanajuato','Guerrero','Hidalgo','Jalisco','Michoacán','Morelos','Nayarit',
  'Nuevo León','Oaxaca','Puebla','Querétaro','Quintana Roo','San Luis Potosí',
  'Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala','Veracruz','Yucatán','Zacatecas',
].map((e) => ({ value: e, label: e }))

const METODOS_PAGO = [
  { value: 'mercadopago',  label: 'MercadoPago (tarjeta, OXXO, transferencia)' },
]

interface CuponAplicado {
  id: string
  codigo: string
  tipo: string
  valor: number
  descuento: number
}

interface CheckoutFormProps {
  items: CartItemData[]
  subtotal: number
  envio: number
  total: number
  onSubmit: (data: CheckoutFormData, cuponId?: string, descuento?: number) => Promise<void>
  loading?: boolean
}

export default function CheckoutForm({ items, subtotal, envio, total, onSubmit, loading = false }: CheckoutFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: { metodo_pago: 'mercadopago' },
  })

  const [codigoCupon, setCodigoCupon] = useState('')
  const [cupon, setCupon] = useState<CuponAplicado | null>(null)
  const [cuponError, setCuponError] = useState('')
  const [validandoCupon, setValidandoCupon] = useState(false)

  const totalConDescuento = cupon ? Math.max(0, total - cupon.descuento) : total

  const aplicarCupon = async () => {
    if (!codigoCupon.trim()) return
    setValidandoCupon(true)
    setCuponError('')
    try {
      const res = await fetch('/api/cupones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoCupon, subtotal }),
      })
      const data = await res.json()
      if (!res.ok) { setCuponError(data.error ?? 'Cupón inválido'); return }
      setCupon(data.cupon)
    } catch {
      setCuponError('Error al validar el cupón')
    } finally {
      setValidandoCupon(false)
    }
  }

  const quitarCupon = () => { setCupon(null); setCodigoCupon(''); setCuponError('') }

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, cupon?.id, cupon?.descuento))} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
      {/* Formulario */}
      <div className="lg:col-span-3 flex flex-col gap-8">
        {/* Datos personales */}
        <section>
          <Label className="mb-4 block">Datos de contacto</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombre completo" placeholder="Juan Pérez" error={errors.nombre?.message} {...register('nombre')} />
            <Input label="Email" type="email" placeholder="juan@email.com" error={errors.email?.message} {...register('email')} />
            <Input label="Teléfono" type="tel" placeholder="55 1234 5678" error={errors.telefono?.message} {...register('telefono')} className="sm:col-span-2" />
          </div>
        </section>

        {/* Dirección */}
        <section>
          <Label className="mb-4 block">Dirección de envío</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Calle y número" placeholder="Av. Reforma 123, Col. Centro" error={errors.calle?.message} {...register('calle')} className="sm:col-span-2" />
            <Input label="Ciudad" placeholder="Ciudad de México" error={errors.ciudad?.message} {...register('ciudad')} />
            <Select label="Estado" options={ESTADOS_MX} placeholder="Selecciona un estado" error={errors.estado?.message} {...register('estado')} />
            <Input label="Código Postal" placeholder="06600" error={errors.cp?.message} {...register('cp')} />
          </div>
        </section>

        {/* Cupón */}
        <section>
          <Label className="mb-4 block">Cupón de descuento</Label>
          {cupon ? (
            <div className="flex items-center justify-between bg-vx-gray800 rounded-lg px-4 py-3">
              <div>
                <span className="text-sm text-vx-cyan font-mono font-bold">{cupon.codigo}</span>
                <span className="text-xs text-vx-gray400 ml-2">
                  {cupon.tipo === 'porcentaje' ? `${cupon.valor}% de descuento` : `$${cupon.valor} de descuento`}
                  {' — '}<span className="text-green-400">-${cupon.descuento.toFixed(2)}</span>
                </span>
              </div>
              <button type="button" onClick={quitarCupon} className="text-xs text-vx-gray500 hover:text-red-400 transition-colors">Quitar</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={codigoCupon}
                onChange={e => { setCodigoCupon(e.target.value.toUpperCase()); setCuponError('') }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); aplicarCupon() } }}
                placeholder="CODIGO20"
                className="flex-1 bg-vx-gray900 border border-vx-gray700 rounded-lg px-3 py-2.5 text-sm text-vx-white placeholder:text-vx-gray500 focus:outline-none focus:border-vx-cyan transition-colors font-mono"
              />
              <Button type="button" size="sm" onClick={aplicarCupon} loading={validandoCupon} disabled={!codigoCupon.trim()}>
                Aplicar
              </Button>
            </div>
          )}
          {cuponError && <p className="text-xs text-red-400 mt-1">{cuponError}</p>}
        </section>

        {/* Método de pago */}
        <section>
          <Label className="mb-4 block">Método de pago</Label>
          <Select label="" options={METODOS_PAGO} error={errors.metodo_pago?.message} {...register('metodo_pago')} />
        </section>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Confirmar pedido — ${totalConDescuento.toFixed(2)} MXN
        </Button>
      </div>

      {/* Resumen */}
      <aside className="lg:col-span-2">
        <div className="bg-vx-gray900 rounded-2xl p-5 sticky top-24">
          <Heading as="h2" size="xs" className="mb-4">Resumen del pedido</Heading>

          <div className="flex flex-col gap-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-vx-gray300 line-clamp-1 flex-1 mr-2">
                  {item.nombre} {item.talla ? `(${item.talla})` : ''} ×{item.cantidad}
                </span>
                <span className="text-vx-white flex-shrink-0">${(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className={clsx('flex flex-col gap-2 pt-3 border-t border-vx-gray800 text-sm')}>
            <div className="flex justify-between text-vx-gray400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-vx-gray400">
              <span>Envío</span>
              <span>{envio === 0 ? <span className="text-vx-cyan">Gratis</span> : `$${envio}`}</span>
            </div>
            {cupon && (
              <div className="flex justify-between text-green-400">
                <span>Descuento ({cupon.codigo})</span>
                <span>-${cupon.descuento.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-vx-white text-base pt-2 border-t border-vx-gray800">
              <span>Total</span>
              <Price amount={totalConDescuento} size="md" />
            </div>
          </div>
        </div>
      </aside>
    </form>
  )
}
