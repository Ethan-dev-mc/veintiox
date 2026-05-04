import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Heading, Text } from '@/components/atoms/Typography'
import Button from '@/components/atoms/Button'
import { IconCheck } from '@/components/atoms/Icon'

interface Props {
  searchParams: { pedido?: string; external_reference?: string; status?: string }
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const mpRef = searchParams.external_reference
  const pagoCancelado = searchParams.status === 'failure' || searchParams.status === 'rejected'

  if (pagoCancelado) {
    return (
      <div className="container-site py-20 flex flex-col items-center text-center gap-6">
        <Heading size="sm" className="text-red-400">Pago no completado</Heading>
        <Text color="muted">El pago fue cancelado o rechazado. Tu carrito sigue guardado.</Text>
        <Link href="/carrito"><Button>Volver al carrito</Button></Link>
      </div>
    )
  }

  let numeroPedido = searchParams.pedido ?? null

  if (mpRef) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('pedidos')
      .select('numero_pedido, estado')
      .eq('id', mpRef)
      .single()

    if (!data || !['pendiente_envio', 'enviado', 'entregado'].includes(data.estado)) {
      return (
        <div className="container-site py-20 flex flex-col items-center text-center gap-6">
          <Heading size="sm" className="text-yellow-400">Pago en proceso</Heading>
          <Text color="muted">Tu pago está siendo procesado. En unos minutos recibirás confirmación.</Text>
          <Link href="/catalogo"><Button>Seguir comprando</Button></Link>
        </div>
      )
    }
    numeroPedido = data.numero_pedido
  }

  return (
    <div className="container-site py-20 flex flex-col items-center text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-vx-cyan/10 border-2 border-vx-cyan flex items-center justify-center">
        <IconCheck className="w-10 h-10 text-vx-cyan" />
      </div>
      <div>
        <Heading size="md" className="mb-2">¡PEDIDO CONFIRMADO!</Heading>
        {numeroPedido && (
          <p className="text-vx-gray400 text-sm mb-1">
            Número: <span className="text-vx-white font-mono">{numeroPedido}</span>
          </p>
        )}
        <Text color="muted" className="max-w-md mx-auto">
          Tu pedido fue recibido. Te avisamos cuando sea enviado.
        </Text>
      </div>
      <div className="flex gap-3">
        <Link href="/catalogo"><Button>Seguir comprando</Button></Link>
        <Link href="/"><Button variant="outline">Ir al inicio</Button></Link>
      </div>
    </div>
  )
}
