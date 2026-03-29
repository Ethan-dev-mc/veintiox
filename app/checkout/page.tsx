'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { CreditCard, Smartphone, Store, Lock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

type Step = 'info' | 'shipping' | 'payment' | 'success'

const paymentMethods = [
  { id: 'card', label: 'Tarjeta de crédito/débito', icon: CreditCard },
  { id: 'oxxo', label: 'Pago en OXXO', icon: Store },
  { id: 'transfer', label: 'Transferencia SPEI', icon: Smartphone },
]

export default function CheckoutPage() {
  const { state, total, clearCart } = useCart()
  const [step, setStep] = useState<Step>('info')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  })

  const shipping = total >= 999 ? 0 : 99
  const grandTotal = total + shipping

  const updateField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleOrder = () => {
    clearCart()
    setStep('success')
  }

  if (state.items.length === 0 && step !== 'success') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center animate-fade-in">
        <p className="text-phantom-muted text-lg">No tienes productos en el carrito.</p>
        <Link href="/catalogo" className="text-phantom-accent hover:underline mt-4 block">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fade-in">
        <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-4xl font-display tracking-wider text-white mb-4">¡PEDIDO CONFIRMADO!</h1>
        <p className="text-phantom-muted mb-2">
          Gracias por tu compra. Recibirás un correo de confirmación pronto.
        </p>
        <p className="text-phantom-accent font-medium text-sm mb-10">
          Número de pedido: #PH{Math.floor(Math.random() * 90000 + 10000)}
        </p>
        <Link
          href="/"
          className="inline-block bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  const steps = [
    { key: 'info', label: 'Datos' },
    { key: 'shipping', label: 'Envío' },
    { key: 'payment', label: 'Pago' },
  ]
  const stepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-center gap-4 mb-14">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${i <= stepIndex ? 'text-phantom-accent' : 'text-phantom-muted'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                i < stepIndex ? 'bg-phantom-accent border-phantom-accent text-phantom-black' :
                i === stepIndex ? 'border-phantom-accent' : 'border-phantom-silver'
              }`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className="hidden sm:block text-sm tracking-widest uppercase">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 h-px ${i < stepIndex ? 'bg-phantom-accent' : 'bg-phantom-silver'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'info' && (
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-2xl font-display tracking-widest text-white">INFORMACIÓN PERSONAL</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Nombre completo', placeholder: 'Juan García' },
                  { key: 'email', label: 'Correo electrónico', placeholder: 'juan@email.com', type: 'email' },
                  { key: 'phone', label: 'Teléfono', placeholder: '+52 55 1234 5678' },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} className={key === 'name' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs text-phantom-muted tracking-widest uppercase mb-2">{label}</label>
                    <input
                      type={type ?? 'text'}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-phantom-gray border border-phantom-silver rounded-lg px-4 py-3 text-white placeholder:text-phantom-muted focus:outline-none focus:border-phantom-accent transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep('shipping')}
                className="w-full bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-[1.02] mt-4"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 'shipping' && (
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-2xl font-display tracking-widest text-white">DIRECCIÓN DE ENVÍO</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'address', label: 'Dirección', placeholder: 'Calle y número', full: true },
                  { key: 'city', label: 'Ciudad', placeholder: 'Ciudad de México' },
                  { key: 'state', label: 'Estado', placeholder: 'CDMX' },
                  { key: 'zip', label: 'Código postal', placeholder: '06600' },
                ].map(({ key, label, placeholder, full }) => (
                  <div key={key} className={full ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs text-phantom-muted tracking-widest uppercase mb-2">{label}</label>
                    <input
                      type="text"
                      value={form[key as keyof typeof form]}
                      onChange={(e) => updateField(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-phantom-gray border border-phantom-silver rounded-lg px-4 py-3 text-white placeholder:text-phantom-muted focus:outline-none focus:border-phantom-accent transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setStep('info')}
                  className="flex-1 border border-phantom-silver text-phantom-muted font-bold tracking-widest uppercase py-4 rounded-xl hover:border-phantom-light hover:text-phantom-light transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-[1.02]"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-2xl font-display tracking-widest text-white">MÉTODO DE PAGO</h2>

              <div className="space-y-3">
                {paymentMethods.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                      paymentMethod === id
                        ? 'border-phantom-accent bg-phantom-accent/10'
                        : 'border-phantom-silver hover:border-phantom-light'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${paymentMethod === id ? 'text-phantom-accent' : 'text-phantom-muted'}`} />
                    <span className={`text-sm font-medium ${paymentMethod === id ? 'text-white' : 'text-phantom-muted'}`}>
                      {label}
                    </span>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === id ? 'border-phantom-accent' : 'border-phantom-silver'
                    }`}>
                      {paymentMethod === id && <div className="w-2.5 h-2.5 bg-phantom-accent rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-phantom-gray rounded-xl border border-phantom-silver">
                  {[
                    { key: 'cardNumber', label: 'Número de tarjeta', placeholder: '1234 5678 9012 3456', full: true },
                    { key: 'cardName', label: 'Nombre en tarjeta', placeholder: 'JUAN GARCIA', full: true },
                    { key: 'expiry', label: 'Vencimiento', placeholder: 'MM/AA' },
                    { key: 'cvv', label: 'CVV', placeholder: '123' },
                  ].map(({ key, label, placeholder, full }) => (
                    <div key={key} className={full ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs text-phantom-muted tracking-widest uppercase mb-2">{label}</label>
                      <input
                        type="text"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => updateField(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-phantom-black border border-phantom-silver rounded-lg px-4 py-3 text-white placeholder:text-phantom-muted focus:outline-none focus:border-phantom-accent transition-colors"
                      />
                    </div>
                  ))}
                </div>
              )}

              {paymentMethod === 'oxxo' && (
                <div className="p-5 bg-phantom-gray rounded-xl border border-phantom-silver text-sm text-phantom-light space-y-2">
                  <p className="font-medium text-white">Instrucciones OXXO</p>
                  <p>1. Finaliza tu pedido y recibirás una referencia de pago.</p>
                  <p>2. Ve a cualquier OXXO y proporciona la referencia al cajero.</p>
                  <p>3. Tu pedido se procesará al confirmar el pago (1–2 horas).</p>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="p-5 bg-phantom-gray rounded-xl border border-phantom-silver text-sm text-phantom-light space-y-2">
                  <p className="font-medium text-white">Transferencia SPEI</p>
                  <p>CLABE: 012 180 0123456789 01</p>
                  <p>Banco: BBVA · Titular: Phantom Caps SA de CV</p>
                  <p>Incluye tu número de pedido en la referencia.</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-phantom-muted">
                <Lock className="w-3.5 h-3.5" />
                <span>Tus datos están protegidos con cifrado SSL 256 bits</span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('shipping')}
                  className="flex-1 border border-phantom-silver text-phantom-muted font-bold tracking-widest uppercase py-4 rounded-xl hover:border-phantom-light hover:text-phantom-light transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handleOrder}
                  className="flex-1 bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-yellow-400 transition-all hover:scale-[1.02]"
                >
                  Confirmar pedido — ${grandTotal.toLocaleString('es-MX')} MXN
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-phantom-gray rounded-xl border border-phantom-silver p-6 sticky top-24">
            <h3 className="text-sm font-display tracking-widest text-white mb-6">TU PEDIDO</h3>
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 bg-phantom-accent text-phantom-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{item.product.name}</p>
                    <p className="text-phantom-muted text-xs">{item.size}</p>
                  </div>
                  <p className="text-white text-sm font-medium">
                    ${(item.product.price * item.quantity).toLocaleString('es-MX')}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-phantom-silver pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-phantom-muted">Subtotal</span>
                <span className="text-white">${total.toLocaleString('es-MX')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-phantom-muted">Envío</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                  {shipping === 0 ? 'Gratis' : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-white text-lg pt-2 border-t border-phantom-silver">
                <span>Total</span>
                <span>${grandTotal.toLocaleString('es-MX')} MXN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
