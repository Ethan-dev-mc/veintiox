import { createClient } from '@supabase/supabase-js'
import type { CheckoutFormData } from '@/components/organisms/CheckoutForm'
import type { CartItemData } from '@/components/molecules/CartItem'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface CreateOrderParams extends CheckoutFormData {
  items: CartItemData[]
  subtotal: number
  envio: number
  total: number
}

export async function createOrder(params: CreateOrderParams) {
  const supabase = getSupabase()
  const numeroPedido = `VX-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      numero_pedido:    numeroPedido,
      cliente_nombre:   params.nombre,
      cliente_email:    params.email,
      cliente_telefono: params.telefono,
      direccion_calle:  params.calle,
      direccion_ciudad: params.ciudad,
      direccion_estado: params.estado,
      direccion_cp:     params.cp,
      subtotal:         params.subtotal,
      envio:            params.envio,
      total:            params.total,
      metodo_pago:      params.metodo_pago,
      estado:           'pendiente',
    })
    .select('id, numero_pedido')
    .single()

  if (pedidoError || !pedido) throw new Error(pedidoError?.message ?? 'Error creando pedido')

  const pedidoItems = params.items.map((item) => ({
    pedido_id:   pedido.id,
    producto_id: item.productoId,
    nombre:      item.nombre,
    precio:      item.precio,
    cantidad:    item.cantidad,
    talla:       item.talla ?? null,
    subtotal:    item.precio * item.cantidad,
  }))

  const { error: itemsError } = await supabase.from('pedido_items').insert(pedidoItems)
  if (itemsError) throw new Error(itemsError.message)

  return pedido
}
