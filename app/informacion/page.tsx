import { Truck, CreditCard, RotateCcw, HelpCircle, Package, MapPin, Clock, Shield } from 'lucide-react'

const faqs = [
  {
    q: '¿Cuánto tarda en llegar mi pedido?',
    a: 'Los envíos estándar tardan entre 2 y 5 días hábiles. Para zonas metropolitanas (CDMX, Monterrey, Guadalajara) generalmente son 2–3 días.',
  },
  {
    q: '¿Puedo rastrear mi pedido?',
    a: 'Sí. Al confirmar tu pedido recibirás un correo con el número de guía y un enlace para rastrear tu paquete en tiempo real.',
  },
  {
    q: '¿Qué tallas están disponibles?',
    a: 'Manejamos tallas S/M, M/L y L/XL. Todas nuestras gorras tienen sistema de ajuste snapback para mayor comodidad.',
  },
  {
    q: '¿Puedo cancelar mi pedido?',
    a: 'Puedes cancelar tu pedido dentro de las primeras 2 horas después de realizarlo. Después de ese tiempo, el pedido ya está en proceso.',
  },
  {
    q: '¿Hacen envíos internacionales?',
    a: 'Por el momento solo hacemos envíos a toda la República Mexicana. Próximamente expandiremos a EE.UU. y Latinoamérica.',
  },
  {
    q: '¿Las gorras tienen garantía?',
    a: 'Todos nuestros productos tienen garantía de 30 días por defectos de fabricación. No aplica para daños por mal uso.',
  },
]

export default function InfoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="mb-14">
        <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-2">Todo lo que necesitas saber</p>
        <h1 className="text-5xl md:text-6xl font-display tracking-wider text-white">INFO DE COMPRA</h1>
      </div>

      {/* Métodos de pago */}
      <section id="pagos" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="w-6 h-6 text-phantom-accent" />
          <h2 className="text-2xl font-display tracking-widest text-white">MÉTODOS DE PAGO</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Tarjeta de crédito/débito', desc: 'Visa, Mastercard, American Express. Pagos seguros con cifrado SSL.', note: 'Sin comisiones' },
            { title: 'OXXO Pay', desc: 'Paga en efectivo en cualquier tienda OXXO. Recibirás una referencia única.', note: 'Cargo de $13 MXN' },
            { title: 'Transferencia SPEI', desc: 'Transferencia bancaria directa. Se procesa en 1–2 horas hábiles.', note: 'Sin comisiones' },
          ].map(({ title, desc, note }) => (
            <div key={title} className="bg-phantom-gray border border-phantom-silver rounded-xl p-5">
              <p className="font-medium text-white mb-2">{title}</p>
              <p className="text-phantom-muted text-sm mb-3">{desc}</p>
              <span className="text-xs text-phantom-accent">{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Envíos */}
      <section id="envios" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Truck className="w-6 h-6 text-phantom-accent" />
          <h2 className="text-2xl font-display tracking-widest text-white">ENVÍOS Y ENTREGAS</h2>
        </div>
        <div className="bg-phantom-gray border border-phantom-silver rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-phantom-silver">
                <th className="text-left text-xs tracking-widest uppercase text-phantom-muted p-4">Tipo</th>
                <th className="text-left text-xs tracking-widest uppercase text-phantom-muted p-4">Tiempo</th>
                <th className="text-left text-xs tracking-widest uppercase text-phantom-muted p-4">Costo</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Estándar', time: '3–5 días hábiles', cost: '$99 MXN' },
                { type: 'Express', time: '1–2 días hábiles', cost: '$189 MXN' },
                { type: 'Gratis (en pedidos +$999)', time: '3–5 días hábiles', cost: 'GRATIS' },
              ].map((row, i) => (
                <tr key={i} className={i < 2 ? 'border-b border-phantom-silver/50' : ''}>
                  <td className="p-4 text-white text-sm">{row.type}</td>
                  <td className="p-4 text-phantom-light text-sm flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-phantom-muted" />
                    {row.time}
                  </td>
                  <td className={`p-4 text-sm font-medium ${row.cost === 'GRATIS' ? 'text-green-400' : 'text-white'}`}>
                    {row.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-start gap-3 text-sm text-phantom-muted">
          <MapPin className="w-4 h-4 text-phantom-accent mt-0.5 flex-shrink-0" />
          <p>Enviamos a toda la República Mexicana mediante DHL, FedEx y Estafeta. El tiempo de envío comienza a correr una vez que tu pago sea confirmado.</p>
        </div>
      </section>

      {/* Devoluciones */}
      <section id="devoluciones" className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <RotateCcw className="w-6 h-6 text-phantom-accent" />
          <h2 className="text-2xl font-display tracking-widest text-white">DEVOLUCIONES</h2>
        </div>
        <div className="space-y-4">
          {[
            { icon: Package, title: 'Plazo de devolución', desc: 'Tienes 30 días naturales desde la recepción del producto para solicitar una devolución.' },
            { icon: Shield, title: 'Condiciones', desc: 'El producto debe estar sin usar, en su empaque original y con todas las etiquetas. No aplica para productos de edición limitada (Drops).' },
            { icon: CreditCard, title: 'Reembolso', desc: 'Una vez recibido y verificado el producto, procesamos el reembolso completo en 3–5 días hábiles al método de pago original.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 bg-phantom-gray border border-phantom-silver rounded-xl">
              <Icon className="w-5 h-5 text-phantom-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-white mb-1">{title}</p>
                <p className="text-phantom-muted text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm">
            <strong>Nota:</strong> Los productos de edición limitada (Drops) no tienen cambios ni devoluciones, excepto por defectos de fabricación.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-6 h-6 text-phantom-accent" />
          <h2 className="text-2xl font-display tracking-widest text-white">PREGUNTAS FRECUENTES</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-phantom-gray border border-phantom-silver rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                <span className="text-phantom-accent text-lg font-bold flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 text-phantom-muted text-sm leading-relaxed border-t border-phantom-silver pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <div className="mt-14 text-center p-8 bg-phantom-gray border border-phantom-silver rounded-2xl">
        <p className="text-phantom-muted mb-2">¿Tienes más preguntas?</p>
        <p className="text-white font-medium mb-4">Escríbenos directamente</p>
        <a
          href="mailto:hola@phantomcaps.mx"
          className="inline-block bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm"
        >
          hola@phantomcaps.mx
        </a>
      </div>
    </div>
  )
}
