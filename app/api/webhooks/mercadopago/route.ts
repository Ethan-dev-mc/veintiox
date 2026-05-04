import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendConfirmacionPedido, sendNotificacionAdmin } from '@/lib/email'
import { createHmac } from 'crypto'

async function verifyMPSignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return true // sin secret configurado, no bloquear (modo legacy)

  const xSignature = req.headers.get('x-signature')
  const xRequestId = req.headers.get('x-request-id')
  if (!xSignature || !xRequestId) return false

  const parts = Object.fromEntries(xSignature.split(',').map(p => p.split('=')))
  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  let dataId: string | undefined
  try {
    const parsed = JSON.parse(rawBody)
    dataId = String(parsed?.data?.id ?? '')
  } catch {
    return false
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')
  return expected === v1
}

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {
    const rawBody = await req.text()

    if (!(await verifyMPSignature(req, rawBody))) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
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

    // Marcar como pendiente de envío (pagado pero aún no enviado)
    const { data: pedido } = await supabase
      .from('pedidos')
      .update({ estado: 'pendiente_envio', mp_payment_id: String(paymentId), pagado_at: new Date().toISOString() })
      .eq('id', pedidoId)
      .select('numero_pedido, cliente_nombre, cliente_email, total, metodo_pago, cupon_id')
      .single()

    // Incrementar ventas_count en productos
    const { data: pedidoItems } = await supabase
      .from('pedido_items')
      .select('producto_id, cantidad')
      .eq('pedido_id', pedidoId)

    if (pedidoItems?.length) {
      await Promise.allSettled(pedidoItems.map(item =>
        supabase.rpc('incrementar_ventas', { p_producto_id: item.producto_id, p_cantidad: item.cantidad })
      ))
    }

    // Incrementar usos del cupón si aplica
    if (pedido?.cupon_id) {
      await supabase.rpc('incrementar_usos_cupon', { p_cupon_id: pedido.cupon_id })
    }

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
