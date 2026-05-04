import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { crearEnvio } from '@/lib/skydropx'
import { z } from 'zod'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const schema = z.object({ pedidoId: z.string().uuid() })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'pedidoId inválido' }, { status: 400 })

  const supabase = getSupabase()
  const { pedidoId } = parsed.data

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .select('*')
    .eq('id', pedidoId)
    .single()

  if (pedidoError || !pedido) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

  if (pedido.etiqueta_url) {
    return NextResponse.json({
      numero_rastreo: pedido.numero_rastreo,
      etiqueta_url: pedido.etiqueta_url,
      carrier_envio: pedido.carrier_envio,
    })
  }

  const { data: configRows } = await supabase.from('configuracion').select('clave, valor')
  const cfg: Record<string, string> = {}
  for (const row of configRows ?? []) cfg[row.clave] = row.valor

  const origen = {
    nombre:   cfg.envio_origen_nombre   ?? 'Veintiox',
    telefono: cfg.envio_origen_telefono ?? '',
    email:    cfg.envio_origen_email    ?? '',
    calle:    cfg.envio_origen_calle    ?? '',
    ciudad:   cfg.envio_origen_ciudad   ?? '',
    estado:   cfg.envio_origen_estado   ?? '',
    cp:       cfg.envio_origen_cp       ?? '',
  }

  const destino = {
    nombre:   pedido.cliente_nombre,
    telefono: pedido.cliente_telefono ?? '',
    calle:    pedido.direccion_calle,
    ciudad:   pedido.direccion_ciudad,
    estado:   pedido.direccion_estado,
    cp:       pedido.direccion_cp,
  }

  const paquete = {
    peso:  Number(cfg.paquete_peso  ?? 1),
    largo: Number(cfg.paquete_largo ?? 20),
    ancho: Number(cfg.paquete_ancho ?? 15),
    alto:  Number(cfg.paquete_alto  ?? 10),
  }

  try {
    const envio = await crearEnvio({ origen, destino, paquete, pedidoNumero: pedido.numero_pedido })

    await supabase.from('pedidos').update({
      numero_rastreo: envio.numero_rastreo,
      etiqueta_url:   envio.etiqueta_url,
      carrier_envio:  envio.carrier,
      estado:         'enviado',
    }).eq('id', pedidoId)

    return NextResponse.json({
      numero_rastreo: envio.numero_rastreo,
      etiqueta_url:   envio.etiqueta_url,
      carrier_envio:  envio.carrier,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Error al generar etiqueta' }, { status: 500 })
  }
}
