export async function createMercadoPagoPreference(pedidoId: string, total: number) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://veintiox.store'

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: [{ title: 'Pedido Veintiox', quantity: 1, unit_price: total, currency_id: 'MXN' }],
      external_reference: pedidoId,
      back_urls: {
        success: `${base}/checkout/confirmacion`,
        failure: `${base}/carrito`,
        pending: `${base}/checkout/confirmacion`,
      },
      auto_return: 'approved',
      notification_url: `${base}/api/webhooks/mercadopago`,
    }),
  })

  const data = await res.json()
  return data.init_point as string
}
