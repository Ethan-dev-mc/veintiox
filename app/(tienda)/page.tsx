import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Producto, Drop } from '@/types/database'
import HeroBanner from '@/components/organisms/HeroBanner'
import ProductGrid from '@/components/organisms/ProductGrid'
import KitGrid from '@/components/organisms/KitGrid'
import DropSection from '@/components/organisms/DropSection'
import { Heading, Label } from '@/components/atoms/Typography'
import { IconArrowRight } from '@/components/atoms/Icon'

export const metadata: Metadata = {
  title: 'Veintiox — Hoodies, Tenis y Perfumes',
  description: 'Drops limitados cada semana. Hoodies, tenis y perfumes. Kits para emprendedores. Envíos a todo México.',
  openGraph: {
    title: 'Veintiox — Hoodies, Tenis y Perfumes',
    description: 'Drops limitados cada semana. Hoodies, tenis y perfumes. Kits para emprendedores. Envíos a todo México.',
    url: 'https://veintiox.store',
    siteName: 'Veintiox',
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veintiox — Hoodies, Tenis y Perfumes',
    description: 'Drops limitados. Streetwear y perfumes. Envíos a todo México.',
  },
}

export const revalidate = 60

export default async function HomePage() {
  const supabase = createSupabaseServerClient()

  const [{ data: destacadosRaw }, { data: todosRaw }, { data: masVendidosRaw }, { data: kits }, { data: dropRaw }] = await Promise.all([
    supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .eq('destacado', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .gt('ventas_count', 0)
      .order('ventas_count', { ascending: false })
      .limit(8),
    supabase
      .from('kits')
      .select('*, kit_items(count)')
      .eq('activo', true)
      .limit(3),
    supabase
      .from('drops')
      .select('*, drop_productos(*, productos(*))')
      .eq('activo', true)
      .gte('fecha_inicio', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('fecha_inicio', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const destacados = destacadosRaw as Producto[] | null
  const todos = todosRaw as Producto[] | null
  const masVendidos = masVendidosRaw as Producto[] | null
  const dropData = dropRaw as (Drop & { drop_productos: any[] }) | null

  const kitsConCount = (kits ?? []).map((k: any) => ({
    ...k,
    itemCount: k.kit_items?.[0]?.count ?? 0,
  }))

  const ahora = new Date()
  let dropEstado: 'proximo' | 'activo' | 'agotado' = 'proximo'
  let dropProductos: any[] = []

  if (dropData) {
    const inicio = new Date(dropData.fecha_inicio)
    const fin = dropData.fecha_fin ? new Date(dropData.fecha_fin) : null
    if (ahora < inicio) dropEstado = 'proximo'
    else if (!fin || ahora <= fin) {
      dropEstado = 'activo'
      dropProductos = (dropData as any).drop_productos?.map((dp: any) => ({
        ...dp.productos,
        stock: dp.stock_drop - dp.vendidos,
      })).filter((p: any) => p.stock > 0) ?? []
    } else dropEstado = 'agotado'
  }

  return (
    <>
      <HeroBanner />

      {/* Más vendidos */}
      {(masVendidos ?? []).length > 0 && (
        <section className="container-site py-16 border-t border-vx-gray800">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Label>Lo más popular</Label>
              <Heading size="md" className="mt-1">MÁS VENDIDOS</Heading>
            </div>
          </div>
          <ProductGrid products={masVendidos ?? []} showFilters={false} />
        </section>
      )}

      {/* Todos los productos */}
      {(todos ?? []).length > 0 && (
        <section className="container-site py-16 border-t border-vx-gray800">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Label>Colección completa</Label>
              <Heading size="md" className="mt-1">TODOS LOS PRODUCTOS</Heading>
            </div>
            <Link href="/catalogo" className="flex items-center gap-1 text-sm text-vx-gray400 hover:text-vx-cyan transition-colors">
              Ver catálogo <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={todos ?? []} showFilters={false} />
        </section>
      )}

      {/* Drop activo o próximo */}
      {dropData && (
        <DropSection
          drop={{
            id: dropData.id,
            nombre: dropData.nombre,
            descripcion: dropData.descripcion,
            fecha_inicio: dropData.fecha_inicio,
            imagen: dropData.imagen,
            productos: dropProductos,
          }}
          estado={dropEstado}
          className="border-y border-vx-gray800"
        />
      )}

      {/* Kits emprendedor */}
      {kitsConCount.length > 0 && (
        <section className="container-site py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Label>Para emprendedores</Label>
              <Heading size="md" className="mt-1">KITS</Heading>
            </div>
            <Link href="/kits" className="flex items-center gap-1 text-sm text-vx-gray400 hover:text-vx-cyan transition-colors">
              Ver todos <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <KitGrid kits={kitsConCount} />
        </section>
      )}
    </>
  )
}
