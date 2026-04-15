const BASE = 'https://api.skydropx.com/v1'

function headers() {
  const credentials = Buffer.from(
    `${process.env.SKYDROPX_API_KEY}:${process.env.SKYDROPX_API_SECRET}`
  ).toString('base64')
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${credentials}`,
  }
}

export interface DireccionEnvio {
  nombre: string
  empresa?: string
  telefono: string
  email?: string
  calle: string
  ciudad: string
  estado: string
  cp: string
  pais?: string
}

export interface PaqueteInfo {
  peso: number      // kg
  largo: number     // cm
  ancho: number     // cm
  alto: number      // cm
}

export interface EnvioCreado {
  id: string
  numero_rastreo: string
  carrier: string
  etiqueta_url: string
  costo: number
}

// Cotiza y crea envío (elige el carrier más barato automáticamente)
export async function crearEnvio(params: {
  origen: DireccionEnvio
  destino: DireccionEnvio
  paquete: PaqueteInfo
  pedidoNumero: string
}): Promise<EnvioCreado> {
  const { origen, destino, paquete, pedidoNumero } = params

  // 1. Crear shipment
  const shipRes = await fetch(`${BASE}/shipments`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      shipment: {
        address_from: {
          name: origen.nombre,
          company: origen.empresa ?? '',
          phone: origen.telefono,
          email: origen.email ?? '',
          address1: origen.calle,
          city: origen.ciudad,
          province: origen.estado,
          zip: origen.cp,
          country: origen.pais ?? 'MX',
        },
        address_to: {
          name: destino.nombre,
          phone: destino.telefono,
          address1: destino.calle,
          city: destino.ciudad,
          province: destino.estado,
          zip: destino.cp,
          country: destino.pais ?? 'MX',
        },
        parcel: {
          weight: paquete.peso,
          length: paquete.largo,
          width: paquete.ancho,
          height: paquete.alto,
          mass_unit: 'kg',
          distance_unit: 'cm',
        },
        reference: pedidoNumero,
      },
    }),
  })

  const shipData = await shipRes.json()
  if (!shipRes.ok) throw new Error(shipData.message ?? 'Error creando shipment en Skydropx')

  const shipmentId = shipData.data?.id
  if (!shipmentId) throw new Error('No se obtuvo ID del shipment')

  // 2. Obtener tarifas
  const ratesRes = await fetch(`${BASE}/shipments/${shipmentId}/rates`, { headers: headers() })
  const ratesData = await ratesRes.json()
  const rates: any[] = ratesData.data ?? []

  if (!rates.length) throw new Error('No hay tarifas disponibles para esta ruta')

  // Elegir la más barata
  const cheapest = rates.reduce((min: any, r: any) =>
    Number(r.attributes?.total_pricing) < Number(min.attributes?.total_pricing) ? r : min
  )

  const rateId = cheapest.id

  // 3. Crear label
  const labelRes = await fetch(`${BASE}/labels`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ label: { rate_id: rateId } }),
  })

  const labelData = await labelRes.json()
  if (!labelRes.ok) throw new Error(labelData.message ?? 'Error generando etiqueta')

  const label = labelData.data?.attributes

  return {
    id: labelData.data?.id,
    numero_rastreo: label?.tracking_number ?? '',
    carrier: label?.carrier ?? cheapest.attributes?.provider ?? '',
    etiqueta_url: label?.label_url ?? '',
    costo: Number(cheapest.attributes?.total_pricing ?? 0),
  }
}
