'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { setError('Ingresa email y contraseña'); return }
    setLoading(true); setError('')

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError || !data.session) {
        setError(authError?.message ?? 'Credenciales incorrectas')
        setLoading(false); return
      }
      const res = await fetch('/api/admin/auth/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ access_token: data.session.access_token, refresh_token: data.session.refresh_token }),
      })
      if (!res.ok) { setError('Error al iniciar sesión'); setLoading(false); return }
      window.location.href = '/admin/dashboard'
    } catch (e: any) {
      setError('Error: ' + (e?.message ?? 'intenta de nuevo'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vx-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl text-vx-white tracking-widest">VEINTIOX</span>
          <p className="text-xs text-vx-gray500 uppercase tracking-wider mt-1">Panel Admin</p>
        </div>
        <div className="bg-vx-gray900 rounded-2xl p-6 flex flex-col gap-5">
          <p className="font-display text-xl text-vx-white">INICIAR SESIÓN</p>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@veintiox.store" autoComplete="email" />
          <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }} />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="button" onClick={handleLogin} fullWidth loading={loading}>Entrar</Button>
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
