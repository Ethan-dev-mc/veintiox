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

  const errors: string[] = []

  for (const [clave, valor] of Object.entries(body)) {
    // Try update first (record exists)
    const { data: existing } = await supabase
      .from('configuracion')
      .select('id')
      .eq('clave', clave)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('configuracion')
        .update({ valor: String(valor) })
        .eq('clave', clave)
      if (error) errors.push(`${clave}: ${error.message}`)
    } else {
      const { error } = await supabase
        .from('configuracion')
        .insert({ clave, valor: String(valor) })
      if (error) errors.push(`${clave}: ${error.message}`)
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(', ') }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
