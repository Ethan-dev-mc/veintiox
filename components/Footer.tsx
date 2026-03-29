import Link from 'next/link'
import { Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-phantom-black border-t border-phantom-silver mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-3xl font-display tracking-widest text-white mb-2">PHANTOM CAPS</p>
            <p className="text-phantom-muted text-sm mb-4">Define tu estilo. Domina la calle.</p>
            <div className="flex gap-4">
              <a href="#" className="text-phantom-muted hover:text-phantom-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-phantom-muted hover:text-phantom-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs tracking-widest uppercase text-phantom-muted mb-4">Tienda</p>
            <ul className="space-y-2">
              {[
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/drops', label: 'Drops' },
                { href: '/carrito', label: 'Carrito' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-phantom-light hover:text-phantom-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-phantom-muted mb-4">Ayuda</p>
            <ul className="space-y-2">
              {[
                { href: '/informacion', label: 'Envíos y entregas' },
                { href: '/informacion#devoluciones', label: 'Devoluciones' },
                { href: '/informacion#faq', label: 'FAQ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-phantom-light hover:text-phantom-accent transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-phantom-silver mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-phantom-muted text-xs">© 2025 Phantom Caps. Todos los derechos reservados.</p>
          <p className="text-phantom-muted text-xs">Hecho en México 🇲🇽</p>
        </div>
      </div>
    </footer>
  )
}
