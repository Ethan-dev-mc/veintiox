import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo JPG, PNG, WebP o GIF.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'El archivo supera el límite de 5MB.' }, { status: 400 })
  }

  const safeExt = file.type.split('/')[1]
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const adminSupabase = getAdminSupabase()
  const { error } = await adminSupabase.storage.from('productos').upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = adminSupabase.storage.from('productos').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
