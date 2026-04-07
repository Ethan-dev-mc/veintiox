import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/orders'
import { createMercadoPagoPreference } from '@/lib/payments/mercadopago'
import { createStripeSession } from '@/lib/payments/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const pedido = await createOrder(body)

    let checkoutUrl: string | null = null

    if (body.metodo_pago === 'mercadopago') {
      checkoutUrl = await createMercadoPagoPreference(pedido.id, body.total)
    } else if (body.metodo_pago === 'stripe' && process.env.STRIPE_SECRET_KEY) {
      checkoutUrl = await createStripeSession(pedido.id, body.total)
    }

    return NextResponse.json({ numeroPedido: pedido.numero_pedido, checkoutUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
