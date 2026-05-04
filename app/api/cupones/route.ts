import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

const schema = z.object({
  codigo: z.string().min(1).max(30).regex(/^[A-Z0-9_\-]+$/i),
  subtotal: z.number().min(0).max(999999),
})

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)
  if (!rateLimit(`cupones:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Demasiados intentos. Espera un momento.' }, { status: 429 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  const { codigo, subtotal } = parsed.data

  const { data: cupon, error } = await supabase
    .from('cupones')
    .select('*')
    .eq('codigo', codigo.toUpperCase().trim())
    .eq('activo', true)
    .maybeSingle()

  if (error) return NextResponse.json({ error: 'Error al validar' }, { status: 500 })
  if (!cupon) return NextResponse.json({ error: 'Cupón no válido o inactivo' }, { status: 404 })

  if (cupon.usos_max !== null && cupon.usos_actuales >= cupon.usos_max) {
    return NextResponse.json({ error: 'Cupón agotado' }, { status: 400 })
  }

  if (cupon.minimo_compra && subtotal < cupon.minimo_compra) {
    return NextResponse.json({ error: `Compra mínima de $${cupon.minimo_compra} requerida` }, { status: 400 })
  }

  let descuento = 0
  if (cupon.tipo === 'porcentaje') {
    descuento = Math.round((subtotal * cupon.valor) / 100 * 100) / 100
  } else {
    descuento = Math.min(cupon.valor, subtotal)
  }

  return NextResponse.json({ cupon: { id: cupon.id, codigo: cupon.codigo, tipo: cupon.tipo, valor: cupon.valor, descuento } })
}
