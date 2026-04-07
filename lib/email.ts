import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@veintiox.com'
const ADMIN_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'hola@veintiox.com'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

export async function sendConfirmacionPedido(pedido: {
  numero: string
  clienteNombre: string
  clienteEmail: string
  items: { nombre: string; cantidad: number; precio: number }[]
  total: number
}) {
  const itemsHtml = pedido.items
    .map((i) => `<tr><td>${i.nombre} ×${i.cantidad}</td><td>$${(i.precio * i.cantidad).toFixed(2)} MXN</td></tr>`)
    .join('')

  await getResend().emails.send({
    from: FROM,
    to: pedido.clienteEmail,
    subject: `Confirmación de pedido ${pedido.numero} — Veintiox`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#fff;padding:32px;border-radius:12px">
        <h1 style="font-size:28px;margin-bottom:8px;color:#00F0FF">¡Pedido confirmado!</h1>
        <p style="color:#aaa">Hola ${pedido.clienteNombre}, recibimos tu pedido <strong style="color:#fff">${pedido.numero}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px">
          <thead><tr style="border-bottom:1px solid #333;color:#888"><th style="text-align:left;padding:8px 0">Producto</th><th style="text-align:right;padding:8px 0">Subtotal</th></tr></thead>
          <tbody style="color:#ccc">${itemsHtml}</tbody>
          <tfoot><tr style="border-top:1px solid #333;font-weight:bold;color:#fff"><td style="padding-top:12px">Total</td><td style="padding-top:12px;text-align:right">$${pedido.total.toFixed(2)} MXN</td></tr></tfoot>
        </table>
        <p style="color:#aaa;font-size:13px">Te avisaremos cuando tu pedido sea enviado. Si tienes dudas, escríbenos a <a href="mailto:hola@veintiox.com" style="color:#00F0FF">hola@veintiox.com</a>.</p>
        <p style="color:#444;font-size:12px;margin-top:32px">— Equipo Veintiox</p>
      </div>
    `,
  })
}

export async function sendNotificacionAdmin(pedido: {
  numero: string
  clienteNombre: string
  clienteEmail: string
  total: number
  metodo: string
}) {
  await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Nuevo pedido ${pedido.numero} — $${pedido.total.toFixed(2)} MXN`,
    html: `
      <p><strong>Pedido:</strong> ${pedido.numero}</p>
      <p><strong>Cliente:</strong> ${pedido.clienteNombre} (${pedido.clienteEmail})</p>
      <p><strong>Total:</strong> $${pedido.total.toFixed(2)} MXN</p>
      <p><strong>Método:</strong> ${pedido.metodo}</p>
    `,
  })
}
