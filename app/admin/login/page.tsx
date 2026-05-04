'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
      return
    }
    router.refresh()
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-vx-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl text-vx-white tracking-widest">VEINTIOX</span>
          <p className="text-xs text-vx-gray500 uppercase tracking-wider mt-1">Panel Admin</p>
        </div>

        <form onSubmit={handleLogin} className="bg-vx-gray900 rounded-2xl p-6 flex flex-col gap-5">
          <p className="font-display text-xl text-vx-white">INICIAR SESIÓN</p>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@veintiox.store"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" fullWidth loading={loading}>Entrar</Button>
          <p className="text-center text-xs text-vx-gray500">
            ¿Primera vez?{' '}
            <a href="/admin/setup" className="text-vx-cyan hover:underline">Crear cuenta admin</a>
          </p>
        </form>
      </div>
    </div>
  )
}
export const dynamic = 'force-dynamic'
