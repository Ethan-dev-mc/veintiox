import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server'
import ProductDetailClient from './ProductDetailClient'
import type { Producto } from '@/types/database'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.from('productos').select('nombre, descripcion, imagenes, precio').eq('slug', params.slug).single()
  if (!data) return {}
  const p = data as Pick<Producto, 'nombre' | 'descripcion' | 'imagenes' | 'precio'>
  const imagen = p.imagenes?.[0]
  return {
    title: `${p.nombre} | Veintiox`,
    description: p.descripcion?.slice(0, 160),
    openGraph: {
      title: `${p.nombre} | Veintiox`,
      description: p.descripcion?.slice(0, 160) ?? '',
      type: 'website',
      ...(imagen ? { images: [{ url: imagen, width: 800, height: 800, alt: p.nombre }] } : {}),
    },
  }
}

export const revalidate = 60

export default async function ProductoPage({ params }: Props) {
  const supabase = createSupabaseServerClient()

  const { data: productoRaw } = await supabase
    .from('productos')
    .select('*, categorias(*)')
    .eq('slug', params.slug)
    .eq('activo', true)
    .single()

  if (!productoRaw) notFound()

  const producto = productoRaw as any

  const { data: relacionadosRaw } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .eq('categoria_id', producto.categoria_id)
    .neq('id', producto.id)
    .limit(4)

  const relacionados = (relacionadosRaw ?? []) as Producto[]

  const adminClient = createSupabaseAdminClient()
  const { data: configRaw } = await adminClient
    .from('configuracion')
    .select('valor')
    .eq('clave', 'envio_gratis_minimo')
    .single()

  const envioGratisMinimo = configRaw ? parseFloat((configRaw as any).valor) || 999 : 999

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://veintiox.store'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    description: producto.descripcion ?? '',
    image: producto.imagenes ?? [],
    url: `${siteUrl}/producto/${params.slug}`,
    brand: { '@type': 'Brand', name: 'Veintiox' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MXN',
      price: producto.precio,
      availability: producto.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Veintiox' },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetailClient producto={producto} relacionados={relacionados} envioGratisMinimo={envioGratisMinimo} />
    </>
  )
}
