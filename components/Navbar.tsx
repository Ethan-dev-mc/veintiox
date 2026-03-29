'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

export default function Navbar() {
  const { toggleCart, itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-phantom-black/95 backdrop-blur-sm border-b border-phantom-silver">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display tracking-widest text-white group-hover:text-phantom-accent transition-colors">
              PHANTOM
            </span>
            <span className="text-xs tracking-[0.3em] text-phantom-muted uppercase mt-1">CAPS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/catalogo', label: 'Catálogo' },
              { href: '/drops', label: 'Drops' },
              { href: '/informacion', label: 'Info de compra' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm tracking-widest text-phantom-light hover:text-phantom-accent uppercase transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-phantom-light hover:text-phantom-accent transition-colors"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-phantom-accent text-phantom-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-phantom-light"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-phantom-gray border-t border-phantom-silver">
          <nav className="flex flex-col p-4 gap-4">
            {[
              { href: '/catalogo', label: 'Catálogo' },
              { href: '/drops', label: 'Drops' },
              { href: '/informacion', label: 'Info de compra' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest text-phantom-light hover:text-phantom-accent uppercase transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
