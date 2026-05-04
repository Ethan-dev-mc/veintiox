import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookies = req.cookies.getAll()
  return NextResponse.json({
    count: cookies.length,
    names: cookies.map(c => c.name),
    supabaseCookies: cookies.filter(c => c.name.startsWith('sb-')).map(c => ({
      name: c.name,
      length: c.value.length,
    })),
  })
}
