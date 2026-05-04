'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Ingresa email y contraseña')
      return
    }
    setLoading(true)
    setError('')
    setStatus('Conectando...')

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      setStatus('Autenticando...')
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError('Error: ' + authError.message)
        setStatus('')
        setLoading(false)
        return
      }

      if (!data.session) {
        setError('No se obtuvo sesión. Intenta de nuevo.')
        setStatus('')
        setLoading(false)
        return
      }

      setStatus('Redirigiendo...')
      window.location.href = '/admin/dashboard'
    } catch (e: any) {
      setError('Excepción: ' + (e?.message ?? String(e)))
      setStatus('')
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
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@veintiox.store"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
          />
          {error && <p className="text-xs text-red-400 break-all">{error}</p>}
          {status && !error && <p className="text-xs text-vx-cyan">{status}</p>}
          <Button type="button" onClick={handleLogin} fullWidth loading={loading}>
            Entrar
          </Button>
          <p className="text-center text-xs text-vx-gray500">
            ¿Primera vez?{' '}
            <a href="/admin/setup" className="text-vx-cyan hover:underline">Crear cuenta admin</a>
          </p>
        </div>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
