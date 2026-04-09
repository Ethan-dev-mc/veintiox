import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendConfirmacionPedido, sendNotificacionAdmin } from '@/lib/email'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const body = await req.json()
    const { type, data } = body
    if (type !== 'payment') return NextResponse.json({ ok: true })

    const paymentId = data?.id
    if (!paymentId) return NextResponse.json({ ok: true })

    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    })
    const payment = await mpRes.json()

    if (payment.status !== 'approved') return NextResponse.json({ ok: true })

    const pedidoId = payment.external_reference
    if (!pedidoId) return NextResponse.json({ ok: true })

    // Marcar como pagado
    const { data: pedido } = await supabase
      .from('pedidos')
      .update({ estado: 'pagado', mp_payment_id: String(paymentId) })
      .eq('id', pedidoId)
      .select('numero_pedido, cliente_nombre, cliente_email, total, metodo_pago')
      .single()

    // Enviar emails si hay API key configurada
    if (pedido && process.env.RESEND_API_KEY) {
      const { data: items } = await supabase
        .from('pedido_items')
        .select('nombre, cantidad, precio')
        .eq('pedido_id', pedidoId)

      await Promise.allSettled([
        sendConfirmacionPedido({
          numero: pedido.numero_pedido,
          clienteNombre: pedido.cliente_nombre,
          clienteEmail: pedido.cliente_email,
          items: items ?? [],
          total: pedido.total,
        }),
        sendNotificacionAdmin({
          numero: pedido.numero_pedido,
          clienteNombre: pedido.cliente_nombre,
          clienteEmail: pedido.cliente_email,
          total: pedido.total,
          metodo: pedido.metodo_pago,
        }),
      ])
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[MP Webhook]', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
