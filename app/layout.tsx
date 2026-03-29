import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'

export const metadata: Metadata = {
  title: 'Phantom Caps — Define tu estilo. Domina la calle.',
  description: 'Gorras premium streetwear. Drops exclusivos. Envíos a todo México.',
  openGraph: {
    title: 'Phantom Caps',
    description: 'Gorras premium streetwear. Define tu estilo.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  )
}
