'use client'

import { useCartStore } from '@/stores/cartStore'
import { useToast } from '@/components/atoms/Toast'
import ProductDetail from '@/components/organisms/ProductDetail'
import ProductGrid from '@/components/organisms/ProductGrid'
import { Label, Heading } from '@/components/atoms/Typography'
import type { Producto, Categoria } from '@/types/database'

interface Props {
  producto: Producto & { categorias?: Categoria }
  relacionados: Producto[]
  envioGratisMinimo?: number
}

export default function ProductDetailClient({ producto, relacionados, envioGratisMinimo = 999 }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const { toast } = useToast()

  return (
    <div className="container-site py-10">
      <ProductDetail
        product={producto}
        envioGratisMinimo={envioGratisMinimo}
        onAddToCart={({ id, talla, cantidad }) => {
          addItem({
            productoId: id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagenes?.[0] ?? '',
            talla,
            cantidad,
          })
          toast(`${producto.nombre} añadido al carrito`, 'success')
          openCart()
        }}
      />

      {relacionados.length > 0 && (
        <section className="mt-16">
          <Label>También te puede gustar</Label>
          <Heading size="sm" className="mt-1 mb-6">RELACIONADOS</Heading>
          <ProductGrid products={relacionados} showFilters={false} />
        </section>
      )}
    </div>
  )
}
