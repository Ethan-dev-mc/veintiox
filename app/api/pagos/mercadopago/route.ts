import { NextRequest, NextResponse } from 'next/server'
import { createMercadoPagoPreference } from '@/lib/payments/mercadopago'
import { z } from 'zod'
import { rateLimit, getClientIP } from '@/lib/rate-limit'

const schema = z.object({
  pedidoId: z.string().uuid(),
  total: z.number().positive().max(999999),
})

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)
  if (!rateLimit(`pagos:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  try {
    const url = await createMercadoPagoPreference(parsed.data.pedidoId, parsed.data.total)
    return NextResponse.json({ url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
