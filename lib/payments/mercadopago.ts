const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://veintiox.store'

export async function createMercadoPagoPreference(pedidoId: string, total: number) {
  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: [{
        title: 'Pedido Veintiox',
        quantity: 1,
        unit_price: Math.round(Number(total) * 100) / 100,
        currency_id: 'MXN',
      }],
      external_reference: pedidoId,
      back_urls: {
        success: `${SITE_URL}/checkout/confirmacion?external_reference=${pedidoId}`,
        failure: `${SITE_URL}/checkout/confirmacion?external_reference=${pedidoId}&status=failure`,
        pending: `${SITE_URL}/checkout/confirmacion?external_reference=${pedidoId}&status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${SITE_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'VEINTIOX',
    }),
  })

  const data = await res.json()

  if (!data.init_point) {
    console.error('[MP] Error creando preferencia:', JSON.stringify(data))
    throw new Error(data.message ?? 'Error creando preferencia de MercadoPago')
  }

  return data.init_point as string
}
