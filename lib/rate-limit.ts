const store = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    if (store.size > 5000) {
      store.forEach((v, k) => { if (now > v.reset) store.delete(k) })
    }
    return true
  }

  if (record.count >= max) return false
  record.count++
  return true
}

export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
