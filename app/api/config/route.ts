import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PUBLIC_KEYS = ['envio_gratis_minimo', 'costo_envio', 'promo_bar_texto']

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data, error } = await supabase
    .from('configuracion')
    .select('clave, valor')
    .in('clave', PUBLIC_KEYS)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const config: Record<string, string> = {}
  for (const { clave, valor } of data ?? []) config[clave] = valor

  return NextResponse.json({ data: config }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}

export const revalidate = 60
