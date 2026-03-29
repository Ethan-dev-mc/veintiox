import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { bestSellers, products } from '@/data/products'

const reviews = [
  { name: 'Rodrigo M.', text: 'La Black Phantom es una obra de arte. Calidad brutal, llevo 6 meses usándola y sigue perfecta.', rating: 5 },
  { name: 'Valeria C.', text: 'Llegó en 3 días y el empaque fue una experiencia en sí. Se nota que cuidan cada detalle.', rating: 5 },
  { name: 'Andrés P.', text: 'Ya van 3 gorras que les compro. El precio-calidad no existe en ningún otro lado.', rating: 5 },
  { name: 'Sara L.', text: 'La Rose Ghost es increíble. Todo el mundo me pregunta dónde la compré.', rating: 5 },
]

export default function Home() {
  const newProducts = products.filter((p) => p.badge === 'Nuevo').slice(0, 4)

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-phantom-black via-phantom-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-phantom-black/60 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-slide-up">
            <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-6">
              Nuevos drops disponibles
            </p>
            <h1 className="text-6xl md:text-8xl font-display tracking-wider text-white leading-none mb-6">
              DEFINE<br />
              <span className="text-phantom-accent">TU</span><br />
              ESTILO
            </h1>
            <p className="text-phantom-light text-lg mb-10 max-w-md leading-relaxed">
              Gorras premium para los que no siguen tendencias — las crean.
              Streetwear sin compromisos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase px-8 py-4 rounded-lg hover:bg-yellow-400 transition-all hover:scale-105"
              >
                Compra ahora
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/drops"
                className="inline-flex items-center gap-2 border border-phantom-light text-phantom-light font-bold tracking-widest uppercase px-8 py-4 rounded-lg hover:border-phantom-accent hover:text-phantom-accent transition-colors"
              >
                Ver drops
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-phantom-silver bg-phantom-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, text: 'Envío gratis a partir de $999 MXN' },
              { icon: Shield, text: 'Garantía de 30 días' },
              { icon: Zap, text: 'Entrega en 2–5 días hábiles' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-3">
                <Icon className="w-5 h-5 text-phantom-accent flex-shrink-0" />
                <span className="text-sm text-phantom-light tracking-wide">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-2">Lo más popular</p>
            <h2 className="text-4xl md:text-5xl font-display tracking-wider text-white">MÁS VENDIDOS</h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden md:flex items-center gap-2 text-sm text-phantom-muted hover:text-phantom-accent transition-colors tracking-widest uppercase"
          >
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {/* Fill to 4 */}
          {products.filter(p => !p.badge).slice(0, 4 - bestSellers.length).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* DROPS BANNER */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-phantom-black/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-400 text-xs tracking-[0.4em] uppercase mb-4 animate-pulse">
            Disponible por tiempo limitado
          </p>
          <h2 className="text-5xl md:text-7xl font-display tracking-wider text-white mb-6">
            DROPS EXCLUSIVOS
          </h2>
          <p className="text-phantom-light text-lg mb-10 max-w-xl mx-auto">
            Ediciones limitadas que no regresan. Stock real. Sin restock.
          </p>
          <Link
            href="/drops"
            className="inline-flex items-center gap-2 bg-red-500 text-white font-bold tracking-widest uppercase px-8 py-4 rounded-lg hover:bg-red-600 transition-all hover:scale-105"
          >
            Ver drops activos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-2">Recién llegadas</p>
            <h2 className="text-4xl md:text-5xl font-display tracking-wider text-white">NUEVOS MODELOS</h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden md:flex items-center gap-2 text-sm text-phantom-muted hover:text-phantom-accent transition-colors tracking-widest uppercase"
          >
            Ver todo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
          {newProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-phantom-gray border-y border-phantom-silver py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-2">Lo que dicen</p>
            <h2 className="text-4xl md:text-5xl font-display tracking-wider text-white">RESEÑAS REALES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-phantom-black p-6 rounded-xl border border-phantom-silver">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <span key={j} className="text-phantom-accent text-lg">★</span>
                  ))}
                </div>
                <p className="text-phantom-light text-sm leading-relaxed mb-4">"{r.text}"</p>
                <p className="text-phantom-muted text-xs font-medium">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-4">Sé el primero</p>
        <h2 className="text-4xl md:text-5xl font-display tracking-wider text-white mb-4">
          ENTÉRATE DE LOS DROPS
        </h2>
        <p className="text-phantom-muted mb-10 max-w-md mx-auto">
          Únete a la lista y recibe acceso anticipado a cada drop antes de que se agoten.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="flex-1 bg-phantom-gray border border-phantom-silver rounded-lg px-4 py-3 text-white placeholder:text-phantom-muted focus:outline-none focus:border-phantom-accent transition-colors"
          />
          <button className="bg-phantom-accent text-phantom-black font-bold tracking-widest uppercase px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors whitespace-nowrap">
            Suscribirme
          </button>
        </div>
      </section>
    </div>
  )
}
