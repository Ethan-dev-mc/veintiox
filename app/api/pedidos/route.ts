import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/orders'
import { createMercadoPagoPreference } from '@/lib/payments/mercadopago'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const pedido = await createOrder(body)
    const checkoutUrl = await createMercadoPagoPreference(pedido.id, body.total)
    return NextResponse.json({ numeroPedido: pedido.numero_pedido, checkoutUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
