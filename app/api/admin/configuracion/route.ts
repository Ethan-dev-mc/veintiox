import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('configuracion').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  const body: Record<string, string> = await req.json()

  for (const [clave, valor] of Object.entries(body)) {
    const { error } = await supabase
      .from('configuracion')
      .upsert({ clave, valor: String(valor) }, { onConflict: 'clave' })
    if (error) return NextResponse.json({ error: error.message, clave }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
