import Image from 'next/image'
import Link from 'next/link'
import { Flame, AlertTriangle } from 'lucide-react'
import CountdownTimer from '@/components/CountdownTimer'
import { dropProducts, products } from '@/data/products'
import ProductCard from '@/components/ProductCard'

export default function DropsPage() {
  const upcomingDrops = products.filter((p) => !p.isDropItem).slice(0, 2)

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden border-b border-phantom-silver">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-phantom-black to-phantom-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-400 text-xs tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6">
            <Flame className="w-3.5 h-3.5" />
            Drops activos
          </div>
          <h1 className="text-6xl md:text-8xl font-display tracking-wider text-white mb-6">
            DROPS
          </h1>
          <p className="text-phantom-muted text-lg max-w-xl mx-auto">
            Ediciones limitadas. Sin restock. Una vez agotadas, desaparecen para siempre.
          </p>
        </div>
      </section>

      {/* Active drops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-16">
          {dropProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
            >
              {/* Image */}
              <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden group ${idx % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-phantom-black/60 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
                    Drop limitado
                  </span>
                </div>
                {/* Stock bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between text-xs text-white mb-1.5">
                    <span>Stock disponible</span>
                    <span className="font-bold text-red-400">{product.stock} / 50 restantes</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${((50 - product.stock) / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className={idx % 2 === 1 ? 'lg:col-start-1' : ''}>
                <p className="text-red-400 text-xs tracking-[0.3em] uppercase mb-3">
                  Solo por tiempo limitado
                </p>
                <h2 className="text-4xl md:text-5xl font-display tracking-wider text-white mb-3">
                  {product.name.toUpperCase()}
                </h2>
                <p className="text-phantom-muted italic mb-6">{product.tagline}</p>
                <p className="text-phantom-light leading-relaxed mb-8">{product.description}</p>

                {/* Countdown */}
                <div className="mb-8">
                  <p className="text-xs text-phantom-muted tracking-widest uppercase mb-3">
                    Tiempo restante
                  </p>
                  <CountdownTimer hours={72} />
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div>
                    <p className="text-xs text-phantom-muted">Precio</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-white">${product.price.toLocaleString('es-MX')}</p>
                      {product.originalPrice && (
                        <p className="text-phantom-muted line-through">${product.originalPrice.toLocaleString('es-MX')}</p>
                      )}
                      <span className="text-phantom-muted text-sm">MXN</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/producto/${product.id}`}
                    className="inline-flex items-center gap-2 bg-red-500 text-white font-bold tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-red-600 transition-all hover:scale-105"
                  >
                    Comprar ahora
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>¡Solo {product.stock} unidades!</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section className="border-t border-phantom-silver bg-phantom-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-phantom-accent text-xs tracking-[0.4em] uppercase mb-2">Próximamente</p>
            <h2 className="text-4xl font-display tracking-wider text-white">PRÓXIMOS DROPS</h2>
            <p className="text-phantom-muted mt-3 max-w-md mx-auto">
              Suscríbete al newsletter para ser el primero en enterarte cuando lancemos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {upcomingDrops.map((p) => (
              <div key={p.id} className="relative rounded-xl overflow-hidden group">
                <div className="relative aspect-square">
                  <Image src={p.image} alt={p.name} fill className="object-cover blur-sm scale-110 group-hover:blur-none transition-all duration-500" />
                  <div className="absolute inset-0 bg-phantom-black/70 flex flex-col items-center justify-center">
                    <p className="text-phantom-accent text-xs tracking-widest uppercase mb-2">Próximamente</p>
                    <p className="font-display text-2xl text-white tracking-wider">???</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
