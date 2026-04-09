const SITE_URL = 'https://veintiox.store'

export async function createMercadoPagoPreference(pedidoId: string, total: number) {
  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: [{ title: 'Pedido Veintiox', quantity: 1, unit_price: Number(total), currency_id: 'MXN' }],
      external_reference: pedidoId,
    }),
  })

  const data = await res.json()

  if (!data.init_point) {
    console.error('[MP] Error creando preferencia:', JSON.stringify(data))
    throw new Error(data.message ?? 'Error creando preferencia de MercadoPago')
  }

  return data.init_point as string
}
