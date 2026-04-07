'use client'

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

interface CheckoutFormProps {
  items: CartItemData[]
  subtotal: number
  envio: number
  total: number
  onSubmit: (data: CheckoutFormData) => Promise<void>
  loading?: boolean
}

export default function CheckoutForm({ items, subtotal, envio, total, onSubmit, loading = false }: CheckoutFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: { metodo_pago: 'mercadopago' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
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

        {/* Método de pago */}
        <section>
          <Label className="mb-4 block">Método de pago</Label>
          <Select label="" options={METODOS_PAGO} error={errors.metodo_pago?.message} {...register('metodo_pago')} />
        </section>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Confirmar pedido — ${total.toFixed(2)} MXN
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
            <div className="flex justify-between font-bold text-vx-white text-base pt-2 border-t border-vx-gray800">
              <span>Total</span>
              <Price amount={total} size="md" />
            </div>
          </div>
        </div>
      </aside>
    </form>
  )
}
